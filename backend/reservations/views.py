from rest_framework import viewsets, permissions, filters, status as drf_status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Reservation, Room, ROOM_TYPE_CHOICES, TABLE, KARAOKE_ROOM
from .serializers import (
    CreateReservationSerializer,
    ViewReservationSerializer,
    AdminReservationUpdateSerializer,
    PublicBookingSlotSerializer
)
from .permissions import IsOwnerOrAdmin

from rest_framework.views import APIView
import datetime
from django.utils import timezone
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
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
    queryset = Reservation.objects.all().select_related('user', 'room')

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'reservation_date', 'room', 'room_type', 'room__room_type']
    search_fields = ['guest_name', 'guest_email', 'user__username', 'user__email', 'room__room_name', 'room_type']
    ordering_fields = ['reservation_date', 'reservation_time', 'created_at']
    ordering = ['-reservation_date', '-reservation_time'] 

    def get_queryset(self):
        """ Filter reservations based on user role or for public slot view. """
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
        query_params = self.request.query_params
        # Check if this is a request for public booked slots
        is_public_slot_query = (
            self.action == 'list' and 
            query_params.get('status') == 'CONFIRMED' and 
            query_params.get('reservation_date') and 
            query_params.get('room__room_type')
        )

        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        elif is_public_slot_query:
             permission_classes = [permissions.AllowAny] # Allow anyone to see booked slots
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        else: # Standard list (for user's own) or retrieve
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

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

        # Send email notification to management
        try:
            subject = f"New Reservation Created - ID: {reservation.id}"
            message_body = f"""
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
            send_mail(
                subject,
                message_body,
                settings.EMAIL_HOST_USER,
                ['stopshot.management@gmail.com'],
                fail_silently=False,
            )
            print(f"Management notification email sent for new reservation {reservation.id}")
        except Exception as e:
            print(f"Error sending management notification email for new reservation {reservation.id}: {e}")
        

class DailyAvailabilitySummaryView(APIView):
    """
    Provides a summary of daily availability based on confirmed bookings.
    Accepts a 'date' query parameter in YYYY-MM-DD format.
    e.g., /api/availability/summary/?date=2024-05-10
    """
    permission_classes = [permissions.AllowAny] # Accessible to anyone

    def get(self, request):
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({"error": "Date query parameter is required."}, status=drf_status.HTTP_400_BAD_REQUEST)

        try:
            target_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=drf_status.HTTP_400_BAD_REQUEST)

        business_day_start_dt = timezone.make_aware(datetime.datetime.combine(target_date, BUSINESS_DAY_START_TIME))
        business_day_end_dt = timezone.make_aware(datetime.datetime.combine(target_date + datetime.timedelta(days=1), BUSINESS_DAY_END_TIME))

        reservations_in_window = Reservation.objects.filter(
            status='CONFIRMED'
        ).filter(
            (Q(reservation_date=target_date) & Q(reservation_time__gte=BUSINESS_DAY_START_TIME)) |
            (Q(reservation_date=(target_date + datetime.timedelta(days=1))) & Q(reservation_time__lt=BUSINESS_DAY_END_TIME))
        ).select_related('room') 

        availability_results = {}

        for room_type_value, room_type_display in ROOM_TYPE_CHOICES:
            # Find active rooms of the current type
            active_rooms_of_type = Room.objects.filter(
                room_can_be_booked=True,
                room_type=room_type_value
            )
            num_rooms_of_type = active_rooms_of_type.count()

            if num_rooms_of_type == 0:
                availability_results[room_type_value] = {
                    "room_type_display": room_type_display,
                    "percentage_booked": 100.0,
                    "availability_status": "UNAVAILABLE",
                    "message": f"No {room_type_display} rooms are configured or currently bookable."
                }
                continue 
            total_available_duration_for_type = VENUE_TOTAL_OPERATING_HOURS_PER_BUSINESS_DAY * num_rooms_of_type

     
            total_booked_duration_for_type = datetime.timedelta(0)
            reservations_for_type = [ 
                res for res in reservations_in_window 
                if res.room and res.room.room_type == room_type_value
            ]
            
            for res in reservations_for_type:
                res_start_dt = res.get_start_datetime()
                res_end_dt = res.get_end_datetime()

                if not res_start_dt or not res_end_dt or not res.duration:
                    continue

                overlap_start = max(business_day_start_dt, res_start_dt)
                overlap_end = min(business_day_end_dt, res_end_dt)

                if overlap_end > overlap_start:
                    total_booked_duration_for_type += (overlap_end - overlap_start)

            percentage_booked = 0.0
            if total_available_duration_for_type.total_seconds() > 0:
                percentage_booked = (total_booked_duration_for_type.total_seconds() / total_available_duration_for_type.total_seconds()) * 100
            elif total_booked_duration_for_type.total_seconds() > 0:
                 percentage_booked = 100.0

            percentage_booked = min(max(0, percentage_booked), 100.0)

            availability_status = "AVAILABLE"
            if percentage_booked >= 100:
                availability_status = "UNAVAILABLE"
            elif percentage_booked >= 50:
                availability_status = "LIMITED_AVAILABILITY"
            
            availability_results[room_type_value] = {
                "room_type_display": room_type_display,
                "percentage_booked": round(percentage_booked, 2),
                "availability_status": availability_status
            }

        return Response({
            "date": target_date.isoformat(),
            "availability_by_type": availability_results
        }, status=drf_status.HTTP_200_OK)

