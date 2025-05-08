from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
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
    - Users create reservations with room_type preference (POST /api/reservations/). Room is not assigned yet.
    - Admins can list/filter reservations (including by room_type) and assign a specific Room.
    """
    queryset = Reservation.objects.all()

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'reservation_date', 'room', 'room_type'] 
    search_fields = ['guest_name', 'guest_email', 'user__username', 'user__email', 'room__room_name', 'room_type']
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
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        else: 
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """
        Set status to PENDING. Associate user ONLY if authenticated.
        Room is NOT assigned here. Admin will assign it later.
        """
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

