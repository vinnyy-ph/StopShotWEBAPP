from rest_framework import serializers
from django.utils import timezone
from .models import Room, Reservation, STATUS_CHOICES, KARAOKE_ROOM, TABLE
from user_management.models import User 
import datetime 
from django.core.exceptions import ValidationError 

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'room_name', 'room_type'] 

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

class PublicBookingSlotSerializer(serializers.ModelSerializer):

    room = RoomSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'room',
            'reservation_date',
            'reservation_time',
            'duration'
        ]
   
        read_only_fields = fields 

class DetailRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__' # Or list all fields needed for detailed view

class ViewReservationSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer(read_only=True)
    # Use the more detailed Room serializer here
    room = DetailRoomSerializer(read_only=True)
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

    def update(self, instance, validated_data):
        """ Override update to run full_clean() before saving. """
       
        potential_status = validated_data.get('status', instance.status)
        potential_room = validated_data.get('room', instance.room) 
        potential_duration = validated_data.get('duration', instance.duration)

        run_clean = False
        if potential_status == 'CONFIRMED':
            run_clean = True
        elif instance.status == 'CONFIRMED' and ('room' in validated_data or 'duration' in validated_data):
             run_clean = True 
        
        if run_clean:
            original_status = instance.status
            original_room = instance.room
            original_duration = instance.duration

            instance.status = potential_status
            instance.room = potential_room
            instance.duration = potential_duration
            
            try:
                instance.full_clean(exclude=None) 
            except ValidationError as e:
                instance.status = original_status
                instance.room = original_room
                instance.duration = original_duration

                raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else e.messages)
            finally:
                instance.status = original_status
                instance.room = original_room
                instance.duration = original_duration

        return super().update(instance, validated_data)
