from django.core.mail import send_mail

def send_message_email(user, message_text):
    
    first_name = user.first_name if user.first_name else ""
    last_name = user.last_name if user.last_name else ""
    full_name = f"{first_name} {last_name}". strip()
    send_mail(
        subject="New User Message",
        message=f"New message received from {user.email}.\n\nFull Name: {full_name}\n\nMessage: {message_text}",
        from_email="stopshotsportsbar@gmail.com",
        recipient_list=["stopshot.management@gmail.com"], 
    )