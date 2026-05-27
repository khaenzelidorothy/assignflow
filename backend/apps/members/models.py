import uuid
from django.db import models
from django.conf import settings
from apps.organizations.models import Organization
from apps.common.models import TimeStampedModel

class Member(TimeStampedModel):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('on_leave', 'On Leave'),
        ('suspended', 'Suspended'),
    ]
    
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='members'
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='member_profile'
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    preferences = models.JSONField(default=dict)
    metadata = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'members'
        ordering = ['last_name', 'first_name']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['email']),
        ]
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def __str__(self):
        return self.full_name

class MemberSkill(models.Model):
    PROFICIENCY_LEVELS = [
        (1, 'Beginner'),
        (2, 'Intermediate'),
        (3, 'Advanced'),
        (4, 'Expert'),
        (5, 'Master'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='member_skills')
    skill = models.ForeignKey('skills.Skill', on_delete=models.CASCADE, related_name='member_skills')
    proficiency_level = models.IntegerField(choices=PROFICIENCY_LEVELS, default=1)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'member_skills'
        unique_together = ['member', 'skill']

class FairnessProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.OneToOneField(Member, on_delete=models.CASCADE, related_name='fairness_profile')
    burnout_score = models.FloatField(default=0.0)
    workload_score = models.FloatField(default=0.0)
    fairness_score = models.FloatField(default=100.0)
    total_assignments = models.IntegerField(default=0)
    last_assignment_date = models.DateField(null=True, blank=True)
    consecutive_weeks_assigned = models.IntegerField(default=0)
    rotation_position = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'fairness_profiles'
