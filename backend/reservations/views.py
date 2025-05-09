from rest_framework import viewsets, permissions, filters, status as drf_status
from rest_framework.response import Response
from rest_framework.decorators import action
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
        """ Apply different permissions based on action. """
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
        """ Set status to PENDING. Associate user ONLY if authenticated. """
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user, status='PENDING')
        else:
            serializer.save(user=None, status='PENDING')

