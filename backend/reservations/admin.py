from django.contrib import admin
from .models import Reservation, Room

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'room_name', 'room_type', 'max_number_of_people', 'room_can_be_booked')
    list_filter = ('room_can_be_booked', 'room_type')
    search_fields = ('room_name', 'room_description', 'room_type')

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'guest_name', 
        'guest_email',
        'user',       
        'room_type',
        'room',
        'reservation_date',
        'reservation_time',
        'duration',
        'number_of_guests',
        'status',
    )
    list_filter = ('status', 'reservation_date', 'room', 'room_type')
    search_fields = ('guest_name', 'guest_email', 'user__username', 'user__email', 'room__room_name', 'room_type', 'special_requests')
    list_editable = ('status', 'room', 'duration') 
    raw_id_fields = ('user', 'room',) 
    list_display_links = ('id', 'guest_name',) 