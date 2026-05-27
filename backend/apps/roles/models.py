import uuid
from django.db import models
from apps.organizations.models import Organization

class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='roles')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    required_skill = models.ForeignKey('skills.Skill', on_delete=models.SET_NULL, null=True, blank=True)
    required_people_count = models.IntegerField(default=1)
    priority = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'roles'
        ordering = ['priority', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.organization.name})"
