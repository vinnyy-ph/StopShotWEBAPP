from rest_framework import serializers
from django.utils import timezone
from .models import Room, Reservation, STATUS_CHOICES, KARAOKE_ROOM, TABLE
from user_management.models import User 
import datetime 
from django.core.exceptions import ValidationError 

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CreateReservationSerializer(serializers.ModelSerializer):
    duration = serializers.DurationField(required=False) 

    class Meta:
        model = Reservation
        fields = [
            'guest_name',
            'guest_email',
            'reservation_date',
            'reservation_time',
            'duration', 
            'number_of_guests',
            'room_type',
            'special_requests',
        ]

    def validate_reservation_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("Reservation date cannot be in the past.")

        return value

    def validate_reservation_time(self, value):
        return value

    def validate(self, data):
        """ Check for minimum duration for karaoke rooms. """
        room_type = data.get('room_type')
        duration = data.get('duration') 
        

        if room_type == KARAOKE_ROOM: 
            actual_duration = duration if duration is not None else Reservation().duration 
            if actual_duration < datetime.timedelta(hours=1):
                raise serializers.ValidationError({
                    'duration': 'Karaoke room bookings must be for at least 1 hour.'
                })
        return data

class ViewReservationSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer(read_only=True)
    room = RoomSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    room_type = serializers.CharField(source='get_room_type_display', read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id',
            'user',
            'room',
            'guest_name',
            'guest_email',
            'reservation_date',
            'reservation_time',
            'duration',
            'number_of_guests',
            'room_type',
            'special_requests',
            'status',
            'status_display',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [] 

class AdminReservationUpdateSerializer(serializers.ModelSerializer):
    room_id = serializers.PrimaryKeyRelatedField(
        queryset=Room.objects.all(),
        source='room',
        allow_null=True, 
        required=False 
    )
    duration = serializers.DurationField(required=False) 

    class Meta:
        model = Reservation
        fields = [
            'status',
            'room_id',
            'duration', # Added duration
        ]
        read_only_fields = [] 

    def validate(self, data):
        instance_data = {} 
        if self.instance:
            instance_data = {
                'reservation_date': self.instance.reservation_date,
                'reservation_time': self.instance.reservation_time,
                'duration': self.instance.duration,
                'room': self.instance.room,
                'status': self.instance.status,
                'room_type': self.instance.room_type, 
                'pk': self.instance.pk 
            }

        status_to_validate = data.get('status', instance_data.get('status'))
        room_to_validate = data.get('room', instance_data.get('room'))
        duration_to_validate = data.get('duration', instance_data.get('duration'))

        temp_reservation_for_validation = Reservation(
            pk=instance_data.get('pk'), 
            reservation_date=instance_data.get('reservation_date'),
            reservation_time=instance_data.get('reservation_time'),
            duration=duration_to_validate,
            room=room_to_validate,
            status=status_to_validate,
            room_type=instance_data.get('room_type') 

        )
        
        try:
            temp_reservation_for_validation.clean() 
        except ValidationError as e:

            if hasattr(e, 'error_dict'): 
                raise serializers.ValidationError(e.error_dict)
            else:
                raise serializers.ValidationError(e.messages)
        return data
