from django.contrib import admin
from .models import Reservation, Room

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'room_name', 'max_number_of_people', 'room_can_be_booked')
    list_filter = ('room_can_be_booked',)
    search_fields = ('room_name', 'room_description')

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'guest_name', 
        'user',       
        'room',
        'reservation_date',
        'reservation_time',
        'number_of_guests',
        'status',
    )
    list_filter = ('status', 'reservation_date', 'room') 
    search_fields = ('guest_name', 'guest_phone', 'user__username', 'user__email', 'room__room_name', 'special_requests') # Updated search
    list_editable = ('status', 'room',) 
    raw_id_fields = ('user', 'room',) 
    list_display_links = ('id', 'guest_name',) 