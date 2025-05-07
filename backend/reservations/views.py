from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Count
from .models import Reservation, Room
from .serializers import (
    CreateReservationSerializer,
    ViewReservationSerializer,
    AdminReservationUpdateSerializer
)
from .permissions import IsOwnerOrAdmin

class ReservationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for reservations.
    - ANYONE can create reservations (POST /api/reservations/).
    - Users can list their own reservations (GET /api/reservations/). (If logged in)
    - Users can retrieve/update/delete their own reservations (GET/PUT/PATCH/DELETE /api/reservations/{id}/). (If logged in)
    - Admins can list all reservations with filters/search (GET /api/reservations/).
    - Admins can retrieve/update/delete any reservation.
    """
    queryset = Reservation.objects.all()

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'reservation_date', 'room'] 
    search_fields = ['guest_name', 'guest_phone', 'user__username', 'user__email', 'room__room_name']
    ordering_fields = ['reservation_date', 'reservation_time', 'created_at']
    ordering = ['-reservation_date', '-reservation_time'] 

    def get_queryset(self):
        """ Filter reservations based on user role. """
        user = self.request.user

        if user.is_authenticated and user.is_staff:
            return Reservation.objects.all() 
        elif user.is_authenticated:
            return Reservation.objects.filter(user=user) 
        else:
             return Reservation.objects.none() 

    def get_serializer_class(self):
        """ Return appropriate serializer based on action and user role. """
        user = self.request.user
    
        is_admin = user.is_authenticated and user.is_staff

        if self.action == 'create':
            return CreateReservationSerializer
        elif self.action in ['update', 'partial_update'] and is_admin:
            return AdminReservationUpdateSerializer
    
        return ViewReservationSerializer

    def get_permissions(self):
        """ Apply different permissions based on action. """
        if self.action == 'create' or self.action in ['availability', 'timeslots']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """ Set status to PENDING. Associate user ONLY if authenticated. """
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user, status='PENDING')
        else:
            serializer.save(user=None, status='PENDING')
            
    @action(detail=False, methods=['get'], url_path='availability')
    def availability(self, request):
        """
        Check availability for a given year/month
        GET /api/reservations/availability/?year=2023&month=8&reservation_type=table
        """
        try:
            year = int(request.query_params.get('year', timezone.now().year))
            month = int(request.query_params.get('month', timezone.now().month))
            reservation_type = request.query_params.get('reservation_type', 'table')
            
            # Determine room type based on reservation type
            is_karaoke = reservation_type.lower() == 'karaoke'
            
            # Get rooms of the requested type
            if is_karaoke:
                available_rooms = Room.objects.filter(
                    room_can_be_booked=True, 
                    room_name__icontains='karaoke'
                )
            else:
                available_rooms = Room.objects.filter(
                    room_can_be_booked=True
                ).exclude(room_name__icontains='karaoke')
            
            total_capacity = available_rooms.count()
            if total_capacity == 0:
                return Response({"error": "No rooms available for this type"}, status=400)
            
            # Get existing reservations for this month
            month_reservations = Reservation.objects.filter(
                reservation_date__year=year,
                reservation_date__month=month,
                status__in=['PENDING', 'CONFIRMED'],
            )
            
            # Count special events (manual setup or could be from another model)
            special_events = {8: True, 15: True, 22: True}  # Example days with special events
            
            # Get the current date to prevent past dates from being reservable
            current_date = timezone.now().date()
            
            # Calculate availability for each day
            availability = {}
            
            # Loop through all days in the month
            import calendar
            _, num_days = calendar.monthrange(year, month)
            
            for day in range(1, num_days + 1):
                check_date = datetime(year, month, day).date()
                
                # Skip past dates
                if check_date < current_date:
                    availability[day] = {
                        "isAvailable": False,
                        "isBusy": False,
                        "isSpecialEvent": False
                    }
                    continue
                
                # For the current or future days, check actual availability
                if is_karaoke:
                    day_reservations = month_reservations.filter(
                        reservation_date=check_date,
                        special_requests__icontains='karaoke'
                    ).count()
                else:
                    day_reservations = month_reservations.filter(
                        reservation_date=check_date
                    ).exclude(special_requests__icontains='karaoke').count()
                
                # A day is "busy" if more than 70% of capacity is booked
                is_busy = day_reservations >= (total_capacity * 0.7)
                
                # A day is "unavailable" if fully booked
                is_available = day_reservations < total_capacity
                
                # Check if this is a special event day
                is_special_event = day in special_events
                
                availability[day] = {
                    "isAvailable": is_available,
                    "isBusy": is_busy,
                    "isSpecialEvent": is_special_event
                }
            
            return Response(availability)
            
        except (ValueError, TypeError) as e:
            return Response(
                {"error": f"Invalid parameters: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'], url_path='timeslots')
    def timeslots(self, request):
        """
        Get available time slots for a specific date
        GET /api/reservations/timeslots/?date=2023-08-15&reservation_type=table
        """
        try:
            date_str = request.query_params.get('date')
            reservation_type = request.query_params.get('reservation_type', 'table')
            
            if not date_str:
                return Response(
                    {"error": "Date parameter is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            reservation_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            # If the date is in the past, no slots are available
            if reservation_date < timezone.now().date():
                return Response({"available_slots": []})
            
            # Define time slots (from 4 PM to 1 AM)
            all_time_slots = [
                '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
                '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM'
            ]
            
            # Get available rooms based on reservation type
            is_karaoke = reservation_type.lower() == 'karaoke'
            
            if is_karaoke:
                available_rooms = Room.objects.filter(
                    room_can_be_booked=True,
                    room_name__icontains='karaoke'
                )
            else:
                available_rooms = Room.objects.filter(
                    room_can_be_booked=True
                ).exclude(room_name__icontains='karaoke')
            
            total_rooms = available_rooms.count()
            
            # Check availability for each time slot
            available_slots = []
            
            for time_slot in all_time_slots:
                # Convert time string to datetime.time object for database comparison
                hour = int(time_slot.split(':')[0])
                if 'PM' in time_slot and hour != 12:
                    hour += 12
                if 'AM' in time_slot and hour == 12:
                    hour = 0
                
                time_obj = datetime.strptime(f"{hour}:00", "%H:%M").time()
                
                # Count existing reservations for this time
                if is_karaoke:
                    booked_count = Reservation.objects.filter(
                        reservation_date=reservation_date,
                        reservation_time=time_obj,
                        special_requests__icontains='karaoke',
                        status__in=['PENDING', 'CONFIRMED']
                    ).count()
                else:
                    booked_count = Reservation.objects.filter(
                        reservation_date=reservation_date,
                        reservation_time=time_obj,
                        status__in=['PENDING', 'CONFIRMED']
                    ).exclude(special_requests__icontains='karaoke').count()
                
                # If there are still rooms available at this time
                if booked_count < total_rooms:
                    available_slots.append(time_slot)
            
            return Response({"available_slots": available_slots})
            
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

