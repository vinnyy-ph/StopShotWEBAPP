from django.contrib import admin
from .models import Menu
# Register your models here.


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Menu._meta.fields]
    search_fields = ['name']
    list_editable = ['is_available']
    list_filter = ['price', 'category', 'is_available']