from django.contrib import admin
from .models import AuditLog, EventLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['actor', 'action_type', 'entity_type', 'created_at']
    list_filter = ['action_type', 'created_at']
    search_fields = ['actor__email', 'entity_type']

@admin.register(EventLog)
class EventLogAdmin(admin.ModelAdmin):
    list_display = ['organization', 'event_type', 'created_at']
    list_filter = ['event_type', 'created_at']
