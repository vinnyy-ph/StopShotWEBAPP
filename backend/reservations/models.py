from django.db import models
from django.conf import settings
from django.utils import timezone

class Room(models.Model):
    room_name = models.CharField(max_length=100)
    room_description = models.TextField(blank=True, null=True)
    room_can_be_booked = models.BooleanField(default=True)
    max_number_of_people = models.PositiveIntegerField()

    def __str__(self):
        return self.room_name


class Reservation(models.Model):
 
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, 
        related_name='reservations',
        null=True,
        blank=True 
    )
   
    room = models.ForeignKey(
        Room,
        on_delete=models.SET_NULL, 
        null=True,                 
        blank=True,
        related_name='reservations'
    )

   
    guest_name = models.CharField(max_length=100)
    guest_phone = models.CharField(max_length=20, blank=True)
    reservation_date = models.DateField()
    reservation_time = models.TimeField()
    number_of_guests = models.PositiveIntegerField(default=1) 
    special_requests = models.TextField(blank=True, null=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        room_name = self.room.room_name if self.room else "Unassigned"
        user_info = self.guest_name 
        return f"Reservation for {user_info} ({room_name}) on {self.reservation_date} at {self.reservation_time}"

    class Meta:
        ordering = ['reservation_date', 'reservation_time'] 