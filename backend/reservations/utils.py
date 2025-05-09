from django.core.mail import send_mail
from django.conf import settings

def send_reservation_status_email(reservation):
    if not reservation.user or not reservation.user.email:
        return

    subject = f"Update on Your Reservation at StopShot - {reservation.reservation_date.strftime('%B %d, %Y')}"
    
    status_messages = {
        'CONFIRMED': f"Your reservation for {reservation.get_room_type_display_value()} on {reservation.reservation_date.strftime('%A, %B %d, %Y')} at {reservation.reservation_time.strftime('%I:%M %p')} is now CONFIRMED.",
        'PENDING': f"Your reservation request for {reservation.get_room_type_display_value()} on {reservation.reservation_date.strftime('%A, %B %d, %Y')} at {reservation.reservation_time.strftime('%I:%M %p')} is currently PENDING. We will notify you once it's confirmed.",
        'CANCELLED': f"We are sorry to inform you that your reservation for {reservation.get_room_type_display_value()} on {reservation.reservation_date.strftime('%A, %B %d, %Y')} at {reservation.reservation_time.strftime('%I:%M %p')} has been CANCELLED.",
        'COMPLETED': f"Thank you for visiting StopShot! Your reservation for {reservation.get_room_type_display_value()} on {reservation.reservation_date.strftime('%A, %B %d, %Y')} at {reservation.reservation_time.strftime('%I:%M %p')} is now marked as COMPLETED. We hope you had a great time!",
    }
    
    message_body = status_messages.get(reservation.status, f"Your reservation status has been updated to: {reservation.status}.")
    
    user_name = reservation.user.first_name if reservation.user.first_name else "Valued Customer"

    full_message = f"Dear {user_name},\n\n"
    full_message += f"{message_body}\n\n"

    if reservation.status == 'CONFIRMED' and reservation.room:
        full_message += f"You have been assigned to: {reservation.room.room_name}.\n"
    
    full_message += "Special Requests: "
    full_message += f"{reservation.special_requests if reservation.special_requests else 'None'}\n"
    full_message += f"Number of Guests: {reservation.number_of_guests}\n\n"
    full_message += "If you have any questions, please contact us.\n\n"
    full_message += "Best regards,\nStopShot Management"

    try:
        send_mail(
            subject,
            full_message,
            settings.EMAIL_HOST_USER, 
            [reservation.user.email], 
            fail_silently=False,
        )
        print(f"Reservation status email sent to {reservation.user.email} for status {reservation.status}")
    except Exception as e:
        print(f"Error sending reservation status email to {reservation.user.email}: {e}") 