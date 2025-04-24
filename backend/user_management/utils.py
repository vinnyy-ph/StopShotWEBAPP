import random
from django.core.mail import send_mail
from .models import PasswordResetOTP

def send_otp_email(user):
    code = str(random.randint(100000, 999999))
    PasswordResetOTP.objects.create(user=user, code=code)

    send_mail(
        subject="Your OTP for Password Reset",
        message=f"Hello {user.username}, your OTP is {code}. It will expire in 5 minutes.",
        from_email="stopshopsportsbar@gmail.com",
        recipient_list=[user.email],
    )
