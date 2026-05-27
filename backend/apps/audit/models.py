import uuid
from django.db import models
from django.conf import settings
from apps.organizations.models import Organization

class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action_type = models.CharField(max_length=50)
    entity_type = models.CharField(max_length=100)
    entity_id = models.CharField(max_length=100, null=True)
    old_values = models.JSONField(null=True)
    new_values = models.JSONField(null=True)
    ip_address = models.GenericIPAddressField(null=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'audit_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'created_at']),
            models.Index(fields=['entity_type', 'entity_id']),
        ]

class EventLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=100)
    payload = models.JSONField(default=dict)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_type', 'created_at']),
        ]
