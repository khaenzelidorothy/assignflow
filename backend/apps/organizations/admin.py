from django.contrib import admin
from .models import Organization, OrganizationUser

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'subscription_plan', 'is_active', 'created_at']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(OrganizationUser)
class OrganizationUserAdmin(admin.ModelAdmin):
    list_display = ['organization', 'user', 'role', 'is_active']
    list_filter = ['organization', 'role']
