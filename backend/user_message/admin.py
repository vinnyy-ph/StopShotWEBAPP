from django.contrib import admin
from .models import UserMessage

@admin.register(UserMessage)
class UserMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'message_text', 'created_at')
    search_fields = ('user__email', 'message_text')
    list_filter = ('created_at',)