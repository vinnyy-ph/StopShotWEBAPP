from django.contrib import admin
from .models import UserFeedback
from .utils import send_response_email

@admin.register(UserFeedback)
class UserFeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'feedback_text', 'response_text', 'experience_rating', 'created_at')
    search_fields = ('user__email', 'feedback_text', 'response_text')
    list_filter = ('experience_rating', 'created_at')
    list_editable = ('response_text',)

    def save_model(self, request, obj, form, change):
        if 'response_text' in form.changed_data and obj.response_text:
            send_response_email(obj.user, obj.feedback_text, obj.response_text)
        super().save_model(request, obj, form, change)