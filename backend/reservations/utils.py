from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.conf import settings
import os
import re

# Get the current directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

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

    # Create HTML content
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Reservation Status Update</title>
        <style>
            body {{
                background-color: #121212;
                color: #e0e0e0;
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #1e1e1e;
                border: 1px solid #333333;
            }}
            .header {{
                text-align: center;
                padding: 20px 0;
                border-bottom: 2px solid #d38236;
                background-color: #252525;
            }}
            .logo {{
                max-width: 150px;
                height: auto;
                background-color: #252525;
                padding: 10px;
                border-radius: 5px;
            }}
            .content {{
                padding: 20px;
                background-color: #1e1e1e;
                border-radius: 8px;
                margin-top: 20px;
            }}
            .content p {{
                color: #e0e0e0 !important;
            }}
            .box {{
                background-color: #252525;
                border-left: 4px solid #d38236;
                padding: 15px;
                margin: 15px 0;
                border-radius: 4px;
                color: #e0e0e0;
            }}
            .footer {{
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #aaaaaa;
                border-top: 1px solid #333333;
                padding-top: 15px;
            }}
            h1, h2 {{
                color: #d38236;
            }}
            .highlight {{
                color: #d38236;
                font-weight: bold;
            }}
            .cta-button {{
                display: inline-block;
                background-color: #d38236;
                color: #ffffff !important;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                margin-top: 20px;
            }}
            a {{
                color: #64b5f6;
                text-decoration: none;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://i.imgur.com/6Hf2QI2.png" alt="StopShot Sports Bar" class="logo">
                <h1>Reservation Status Update</h1>
            </div>
            <div class="content">
                <p style="color: #e0e0e0;">Dear <span class="highlight">{user_name}</span>,</p>
                
                <div class="box">
                    {message_body}
                </div>
    """
    
    # Add room information if confirmed
    if reservation.status == 'CONFIRMED' and reservation.room:
        html_content += f"""
                <h2>Room Assignment</h2>
                <div class="box">
                    You have been assigned to: <span class="highlight">{reservation.room.room_name}</span>
                </div>
        """
    
    # Add reservation details
    html_content += f"""
                <h2>Reservation Details</h2>
                <div class="box">
                    <p><strong>Special Requests:</strong> {reservation.special_requests if reservation.special_requests else 'None'}</p>
                    <p><strong>Number of Guests:</strong> {reservation.number_of_guests}</p>
                </div>
                
                <p style="color: #e0e0e0;">If you have any questions, please contact us.</p>
                
                <center>
                    <a href="https://stopshotsportsbar.com" class="cta-button">VISIT OUR WEBSITE</a>
                </center>
            </div>
            <div class="footer">
                <p>2025 StopShot Sports Bar. All rights reserved.</p>
                <p>This email was sent automatically from our reservation system.</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Plain text version as fallback
    plain_text = f"""
    Dear {user_name},

    {message_body}

    {f"You have been assigned to: {reservation.room.room_name}." if reservation.status == 'CONFIRMED' and reservation.room else ""}
    
    Reservation Details:
    Special Requests: {reservation.special_requests if reservation.special_requests else 'None'}
    Number of Guests: {reservation.number_of_guests}

    If you have any questions, please contact us.

    Best regards,
    StopShot Management
    """

    try:
        # Create email with both HTML and plain text versions
        email = EmailMultiAlternatives(
            subject=subject,
            body=strip_tags(plain_text),
            from_email=settings.EMAIL_HOST_USER,
            to=[reservation.user.email],
        )
        
        # Attach HTML content
        email.attach_alternative(html_content, "text/html")
        email.send()
        
        print(f"Reservation status email sent to {reservation.user.email} for status {reservation.status}")
    except Exception as e:
        print(f"Error sending reservation status email to {reservation.user.email}: {e}")