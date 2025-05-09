from rest_framework import viewsets, permissions, filters, status as drf_status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Reservation, Room, ROOM_TYPE_CHOICES, TABLE, KARAOKE_ROOM
from .serializers import (
    CreateReservationSerializer,
    ViewReservationSerializer,
    AdminReservationUpdateSerializer,
    PublicBookingSlotSerializer,
    DetailRoomSerializer,
    RoomSerializer
)
from .permissions import IsOwnerOrAdmin
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

from rest_framework.views import APIView
import datetime
from django.utils import timezone
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.conf import settings

VENUE_TOTAL_OPERATING_HOURS_PER_BUSINESS_DAY = datetime.timedelta(hours=9)

BUSINESS_DAY_START_TIME = datetime.time(16, 0, 0)  # 4:00 PM
BUSINESS_DAY_END_TIME = datetime.time(1, 0, 0)    # 1:00 AM

class ReservationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for reservations.
    - Users create reservations with room_type preference (POST /api/reservations/). Room is not assigned yet.
    - Admins can list/filter reservations (including by room_type) and assign a specific Room.
    """
    queryset = Reservation.objects.all() #

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'reservation_date', 'room', 'room_type', 'room__room_type']
    search_fields = ['guest_name', 'guest_email', 'user__username', 'user__email', 'room__room_name', 'room_type']
    ordering_fields = ['reservation_date', 'reservation_time', 'created_at']
    ordering = ['-reservation_date', '-reservation_time'] 

    def get_queryset(self):
        
        return super().get_queryset()
        
        """ Filter reservations based on user role or for public slot view. 
        user = self.request.user
        query_params = self.request.query_params
        queryset = super().get_queryset()

        is_public_slot_query = (
            self.action == 'list' and 
            query_params.get('status') == 'CONFIRMED' and 
            query_params.get('reservation_date') and 
            query_params.get('room__room_type')
        )

        if is_public_slot_query:
            # No user filtering needed for public slots query
            # Filters for date, status, room__room_type are handled by DjangoFilterBackend
            return queryset 
        elif user.is_authenticated and user.is_staff:
            return queryset # Staff see all (filtered by query params if any)
        elif user.is_authenticated:
            return queryset.filter(user=user) # Regular users see only their own
        else:
            # This case shouldn't be reached for list/retrieve due to permissions,
            # but return none just in case.
             return queryset.none() 
        """

    def get_serializer_class(self):
        user = self.request.user
        is_admin = user.is_authenticated and user.is_staff
        query_params = self.request.query_params

        # Check if this is a request for public booked slots
        is_public_slot_query = (
            self.action == 'list' and 
            query_params.get('status') == 'CONFIRMED' and 
            query_params.get('reservation_date') and 
            query_params.get('room__room_type')
        )

        if self.action == 'create':
            return CreateReservationSerializer
        elif self.action in ['update', 'partial_update'] and is_admin:
            return AdminReservationUpdateSerializer
        elif is_public_slot_query:
            return PublicBookingSlotSerializer # Use minimal serializer for public slots
        else:
            # For retrieve, or standard list for authenticated users/admins
            return ViewReservationSerializer

    def get_permissions(self):
        # For development only - allow all actions without authentication
        return [permissions.AllowAny()]
        
        # Original code commented out for later restoration
        """
        query_params = self.request.query_params
        
        is_public_slot_query = (
            self.action == 'list' and 
            query_params.get('status') == 'CONFIRMED' and 
            query_params.get('reservation_date') and 
            query_params.get('room__room_type')
        )
        
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        elif is_public_slot_query:
             permission_classes = [permissions.AllowAny] 
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
        """

    def perform_create(self, serializer):
        """
        Set status to PENDING.
        Get or create a user based on guest_email and guest_name.
        Associate this user with the reservation.
        Room is NOT assigned here. Admin will assign it later.
        Send an email notification to management.
        """
        guest_email = serializer.validated_data.get('guest_email')
        guest_name = serializer.validated_data.get('guest_name', '') # Default to empty string if not provided

        User = get_user_model() # Get the active user model

        user = None
        if guest_email:
            parts = guest_name.split(' ', 1)
            first_name = parts[0]
            last_name = parts[1] if len(parts) > 1 else ''

            user, created = User.objects.get_or_create(
                email=guest_email,
                defaults={
                    'username': guest_email, 
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'CUSTOMER', 
                    'is_active': True
                }
            )
        elif self.request.user.is_authenticated:
            user = self.request.user

        serializer.save(user=user)
        reservation = serializer.instance # Get the created reservation instance

        # Send email notification to management with styled HTML
        try:
            subject = f"New Reservation Created - ID: {reservation.id}"
            
            # Plain text version as fallback
            plain_text = f"""
A new reservation has been created with the following details:

Guest Name: {reservation.guest_name}
Guest Email: {reservation.guest_email}
Reservation Date: {reservation.reservation_date.strftime('%Y-%m-%d')}
Reservation Time: {reservation.reservation_time.strftime('%H:%M:%S')}
Room Type: {reservation.get_room_type_display()}
Number of Guests: {reservation.number_of_guests}
Duration: {str(reservation.duration)}
Special Requests: {reservation.special_requests or 'None'}

Status: {reservation.get_status_display()}
Created At: {reservation.created_at.strftime('%Y-%m-%d %H:%M:%S')}
"""

            # Create HTML content with styling
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>New Reservation Notification</title>
                <style>
                    body {{
                        background-color: #121212;
                        color: #e0e0e0;
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #1e1e1e;
                        border: 1px solid #333333;
                    }}
                    .header {{
                        text-align: center;
                        padding: 20px 0;
                        border-bottom: 2px solid #ff9800;
                        background-color: #252525;
                    }}
                    .logo {{
                        max-width: 150px;
                        height: auto;
                        background-color: #252525;
                        padding: 10px;
                        border-radius: 5px;
                    }}
                    .content {{
                        padding: 20px;
                        background-color: #1e1e1e;
                        border-radius: 8px;
                        margin-top: 20px;
                    }}
                    .content p {{
                        color: #e0e0e0 !important;
                    }}
                    .box {{
                        background-color: #252525;
                        border-left: 4px solid #ff9800;
                        padding: 15px;
                        margin: 15px 0;
                        border-radius: 4px;
                        color: #e0e0e0;
                    }}
                    .footer {{
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #aaaaaa;
                        border-top: 1px solid #333333;
                        padding-top: 15px;
                    }}
                    h1, h2 {{
                        color: #ff9800;
                    }}
                    .highlight {{
                        color: #ff9800;
                        font-weight: bold;
                    }}
                    .cta-button {{
                        display: inline-block;
                        background-color: #ff9800;
                        color: #ffffff !important;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 4px;
                        font-weight: bold;
                        margin-top: 20px;
                    }}
                    a {{
                        color: #64b5f6;
                        text-decoration: none;
                    }}
                    .label {{
                        font-weight: bold;
                        min-width: 150px;
                        display: inline-block;
                    }}
                    .value {{
                        color: #e0e0e0;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://i.imgur.com/6Hf2QI2.png" alt="StopShot Sports Bar" class="logo">
                        <h1>New Reservation Alert</h1>
                    </div>
                    <div class="content">
                        <p style="color: #e0e0e0;">A new reservation has been created with ID: <span class="highlight">#{reservation.id}</span></p>
                        
                        <h2>Customer Information</h2>
                        <div class="box">
                            <p><span class="label">Guest Name:</span> <span class="value">{reservation.guest_name}</span></p>
                            <p><span class="label">Guest Email:</span> <span class="value">{reservation.guest_email}</span></p>
                        </div>
                        
                        <h2>Reservation Details</h2>
                        <div class="box">
                            <p><span class="label">Date:</span> <span class="value">{reservation.reservation_date.strftime('%A, %B %d, %Y')}</span></p>
                            <p><span class="label">Time:</span> <span class="value">{reservation.reservation_time.strftime('%I:%M %p')}</span></p>
                            <p><span class="label">Room Type:</span> <span class="value">{reservation.get_room_type_display()}</span></p>
                            <p><span class="label">Number of Guests:</span> <span class="value">{reservation.number_of_guests}</span></p>
                            <p><span class="label">Duration:</span> <span class="value">{str(reservation.duration)}</span></p>
                            <p><span class="label">Special Requests:</span> <span class="value">{reservation.special_requests or 'None'}</span></p>
                        </div>
                        
                        <h2>Status Information</h2>
                        <div class="box">
                            <p><span class="label">Status:</span> <span class="highlight">{reservation.get_status_display()}</span></p>
                            <p><span class="label">Created At:</span> <span class="value">{reservation.created_at.strftime('%Y-%m-%d %H:%M:%S')}</span></p>
                        </div>
                        
                        <center>
                            <a href="https://stopshotsportsbar.com/admin/reservations" class="cta-button">MANAGE RESERVATIONS</a>
                        </center>
                    </div>
                    <div class="footer">
                        <p>2025 StopShot Sports Bar. All rights reserved.</p>
                        <p>This is an automated message from the reservation system.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Create email with both HTML and plain text versions
            email = EmailMultiAlternatives(
                subject=subject,
                body=strip_tags(plain_text),
                from_email=settings.EMAIL_HOST_USER,
                to=['stopshot.management@gmail.com'],
            )
            
            # Attach HTML content
            email.attach_alternative(html_content, "text/html")
            email.send()
            
            print(f"Management notification email sent for new reservation {reservation.id}")
        except Exception as e:
            print(f"Error sending management notification email for new reservation {reservation.id}: {e}")

class DailyAvailabilitySummaryView(APIView):
    """
    API endpoint that provides a summary of availability for a given day.
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        # Get date parameter, default to today
        date_str = request.query_params.get('date')
        try:
            if date_str:
                target_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
            else:
                target_date = timezone.now().date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."},
                status=drf_status.HTTP_400_BAD_REQUEST
            )
            
        # Get room type parameter, default to all
        room_type = request.query_params.get('room_type')
        
        # Query all confirmed reservations for the date
        reservations = Reservation.objects.filter(
            reservation_date=target_date,
            status='CONFIRMED'
        )
        
        # Filter by room type if specified
        if room_type:
            if room_type not in dict(ROOM_TYPE_CHOICES):
                return Response(
                    {"error": f"Invalid room type. Choose from {dict(ROOM_TYPE_CHOICES).keys()}"},
                    status=drf_status.HTTP_400_BAD_REQUEST
                )
            reservations = reservations.filter(room_type=room_type)
            
        # Calculate availability summary
        summary = {
            "date": target_date.isoformat(),
            "total_confirmed_reservations": reservations.count(),
            "availability": {
                "TABLE": not reservations.filter(room_type=TABLE).exists(),
                "KARAOKE_ROOM": not reservations.filter(room_type=KARAOKE_ROOM).exists()
            }
        }
        
        return Response(summary)

class RoomViewSet(viewsets.ModelViewSet):
    """
    API endpoint for rooms.
    - Admins can manage rooms (create, update, delete)
    - Users can view available rooms
    """
    queryset = Room.objects.all()
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['room_type', 'room_can_be_booked', 'max_number_of_people']
    search_fields = ['room_name', 'room_description']
    ordering_fields = ['id', 'room_name', 'max_number_of_people']
    ordering = ['id']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update', 'retrieve']:
            return DetailRoomSerializer
        return RoomSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

