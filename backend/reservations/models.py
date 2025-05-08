from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
import datetime 

STATUS_CHOICES = [
    ('PENDING', 'Pending'),
    ('CONFIRMED', 'Confirmed'),
    ('CANCELLED', 'Cancelled'),
]

TABLE = 'TABLE'
KARAOKE_ROOM = 'KARAOKE_ROOM'
ROOM_TYPE_CHOICES = [
    (TABLE, 'Table'),
    (KARAOKE_ROOM, 'Karaoke Room'),
]

class Room(models.Model):
    room_name = models.CharField(max_length=100)
    room_description = models.TextField(blank=True, null=True)
    room_can_be_booked = models.BooleanField(default=True)
    max_number_of_people = models.PositiveIntegerField()
    room_type = models.CharField(
        max_length=20,
        choices=ROOM_TYPE_CHOICES,
        default=TABLE,
    )

    def __str__(self):
        return self.room_name


class Reservation(models.Model):

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
    guest_email = models.EmailField()
    reservation_date = models.DateField()
    reservation_time = models.TimeField()
    duration = models.DurationField(default=datetime.timedelta(hours=1)) 
    number_of_guests = models.PositiveIntegerField(default=1) 
    special_requests = models.TextField(blank=True, null=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')

    room_type = models.CharField(
        max_length=20,
        choices=ROOM_TYPE_CHOICES,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_start_datetime(self):
        if self.reservation_date and self.reservation_time:
            return timezone.make_aware(datetime.datetime.combine(self.reservation_date, self.reservation_time))
        return None

    def get_end_datetime(self):
        start_dt = self.get_start_datetime()
        if start_dt and self.duration:
            return start_dt + self.duration
        return None

    def clean(self):
        super().clean()

        if self.room_type == KARAOKE_ROOM and self.duration:
            if self.duration < datetime.timedelta(hours=1):
                raise ValidationError({
                    'duration': 'Karaoke room bookings must be for at least 1 hour.'
                })

        if self.status == 'CONFIRMED' and self.room and self.reservation_date and self.reservation_time and self.duration:
            start_datetime = self.get_start_datetime()
            end_datetime = self.get_end_datetime()

            if not start_datetime or not end_datetime:
                return 

            overlapping_reservations = Reservation.objects.filter(
                room=self.room,
                status='CONFIRMED',
                reservation_date=self.reservation_date, 
            ).exclude(pk=self.pk) 

            for existing_res in overlapping_reservations:
                existing_start_dt = existing_res.get_start_datetime()
                existing_end_dt = existing_res.get_end_datetime()

                if not existing_start_dt or not existing_end_dt:
                    continue 

                if start_datetime < existing_end_dt and existing_start_dt < end_datetime:
                    raise ValidationError(
                        f"{self.room.room_name} is already booked between {existing_start_dt.strftime('%H:%M')} and "
                        f"{existing_end_dt.strftime('%H:%M')} on {self.reservation_date}. "
                        f"Requested slot: {start_datetime.strftime('%H:%M')} to {end_datetime.strftime('%H:%M')}."
                    )

    def __str__(self):
        room_name = self.room.room_name if self.room else "Unassigned"
        user_info = self.guest_name 
        return f"Reservation for {user_info} ({room_name}) on {self.reservation_date} at {self.reservation_time}"

    class Meta:
        ordering = ['reservation_date', 'reservation_time'] 