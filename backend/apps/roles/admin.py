from django.contrib import admin
from .models import Role

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'priority', 'required_people_count', 'is_active']
    list_filter = ['organization', 'is_active']
