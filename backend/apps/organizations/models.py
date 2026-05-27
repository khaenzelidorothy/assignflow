import uuid
from django.db import models
from django.utils.text import slugify
from django.conf import settings

class Organization(models.Model):
    """Central organization model for multi-tenant architecture"""
    
    SUBSCRIPTION_TIERS = [
        ('free', 'Free'),
        ('starter', 'Starter'),
        ('professional', 'Professional'),
        ('enterprise', 'Enterprise'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    subscription_plan = models.CharField(
        max_length=20,
        choices=SUBSCRIPTION_TIERS,
        default='free'
    )
    timezone = models.CharField(max_length=50, default='UTC')
    is_active = models.BooleanField(default=True)
    settings = models.JSONField(default=dict)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'organizations'
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class OrganizationUser(models.Model):
    """Association between users and organizations with roles"""
    
    ROLES = [
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('viewer', 'Viewer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='organization_memberships'
    )
    role = models.CharField(max_length=20, choices=ROLES, default='viewer')
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'organization_users'
        unique_together = ['organization', 'user']
        indexes = [
            models.Index(fields=['organization', 'user']),
        ]