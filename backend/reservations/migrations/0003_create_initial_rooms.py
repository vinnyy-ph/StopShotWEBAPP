
from django.db import migrations

KARAOKE_ROOM = 'KARAOKE_ROOM'
TABLE = 'TABLE'

def create_rooms(apps, schema_editor):
    Room = apps.get_model('reservations', 'Room') 

    # Create Karaoke Rooms
    Room.objects.create(
        room_name="Karaoke Room 1",
        room_can_be_booked=True,
        max_number_of_people=10,
        room_type=KARAOKE_ROOM,
        room_description="Our premium Alpha karaoke experience."
    )
    Room.objects.create(
        room_name="Karaoke Room 2 ",
        room_can_be_booked=True,
        max_number_of_people=8, 
        room_type=KARAOKE_ROOM,
        room_description="The cozy Beta karaoke suite."
    )

    for i in range(1, 11): 
        Room.objects.create(
            room_name=f"Table {i}",
            room_can_be_booked=True,
            max_number_of_people=4, 
            room_type=TABLE,
            room_description=f"Standard dining table {i}."
        )

def delete_rooms(apps, schema_editor):
    Room = apps.get_model('reservations', 'Room')
    Room.objects.filter(room_type=KARAOKE_ROOM, room_name__startswith="Karaoke Room").delete()
    Room.objects.filter(room_type=TABLE, room_name__startswith="Table ").delete()


class Migration(migrations.Migration):

    dependencies = [
        ('reservations', '0002_initial'),
    ]

    operations = [
        migrations.RunPython(create_rooms, delete_rooms),
    ]