from django.db import models
from user_management.models import User

class UserFeedback(models.Model):

    feedback_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('user_management.User', on_delete=models.CASCADE)
    feedback_text = models.TextField(blank=True, null=True)
    response_text = models.TextField(blank=True, null=True)
    experience_rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)], default=3)  # 1 to 5 scale
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Feedback from {self.user.email} at {self.created_at}"
