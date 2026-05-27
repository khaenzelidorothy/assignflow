import uuid
from django.db import models
from apps.organizations.models import Organization

class OrganizationRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name='rules')
    allow_repeat_before_cycle = models.IntegerField(default=2)
    max_assignments_per_day = models.IntegerField(default=1)
    prioritize_fairness = models.BooleanField(default=True)
    prioritize_workload_balance = models.BooleanField(default=True)
    prioritize_skill_scarcity = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'organization_rules'

class Constraint(models.Model):
    CONSTRAINT_TYPES = [
        ('hard', 'Hard'),
        ('soft', 'Soft'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='constraints')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=CONSTRAINT_TYPES)
    weight = models.FloatField(default=1.0)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    configuration = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'constraints'
        ordering = ['type', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.type})"
