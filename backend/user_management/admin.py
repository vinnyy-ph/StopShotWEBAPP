from django.contrib import admin
from .models import PasswordResetOTP, User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'role', 'is_active', 'is_staff']
    search_fields = ['email']
    list_editable = ['role', 'is_active', 'is_staff']
    list_filter = ['role', 'is_active', 'is_staff']
    
    # (for resetting passwords or deactivating accounts)
    actions = ['deactivate_users']
    
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_users.short_description = "Deactivate selected users"

@admin.register(PasswordResetOTP)
class PasswordResetOTPAdmin(admin.ModelAdmin):
    list_display = [field.name for field in PasswordResetOTP._meta.fields]
    search_fields = ['user__email', 'code']
    list_filter = ['is_used', 'created_at']
