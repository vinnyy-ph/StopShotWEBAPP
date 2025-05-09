from django.core.mail import send_mail
from user_management.models import User

def send_feedback_email(user, feedback_text):

    send_mail(
        subject="User Feedback",
        message=f"New feedback received from {user.email}. \n\nFeedback: {feedback_text}",
        from_email="stopshotsportsbar@gmail.com",
        recipient_list= ["stopshot.management@gmail.com"],
    )



def send_response_email(user, feedback_text, response_text):
    send_mail(
        subject="Response to Your Feedback",
        message=f"Dear {user.first_name},\n\nThank you for your feedback:\n\n'{feedback_text}'\n\nOur response:\n\n'{response_text}'\n\nBest regards,\nStopShot Management",
        from_email="stopshotsportsbar@gmail.com",
        recipient_list=[user.email],
    )
