from django.db import models
from user_management.models import User

class UserMessage(models.Model):
    message_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('user_management.User', on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Optional phone number
    message_text = models.TextField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.user.email} at {self.created_at}"