from rest_framework import serializers
from django.utils import timezone
from .models import Room, Reservation
from user_management.models import User 

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name'] 

class CreateReservationSerializer(serializers.ModelSerializer):
 

    class Meta:
        model = Reservation
        fields = [
            # 'user', # Removed - set in view
            'guest_name',
            'guest_phone',
            'reservation_date',
            'reservation_time',
            'number_of_guests',
            'special_requests',

        ]

    def validate_reservation_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("Reservation date cannot be in the past.")

        return value

    def validate_reservation_time(self, value):
        return value

class ViewReservationSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer(read_only=True)
    room = RoomSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id',
            'user',
            'room',
            'guest_name',
            'guest_phone',
            'reservation_date',
            'reservation_time',
            'number_of_guests',
            'special_requests',
            'status',
            'status_display',
            'created_at',
            'updated_at'
        ]

class AdminReservationUpdateSerializer(serializers.ModelSerializer):
    room_id = serializers.PrimaryKeyRelatedField(
        queryset=Room.objects.all(),
        source='room',
        allow_null=True, 
        required=False 
    )

    class Meta:
        model = Reservation
        fields = [
            'status',
            'room_id',
        ]
        read_only_fields = [] 