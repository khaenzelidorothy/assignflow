import uuid
from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError
from apps.organizations.models import Organization

class Schedule(models.Model):
    """Represents a generated schedule for an organization"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending_review', 'Pending Review'),
        ('approved', 'Approved'),
        ('published', 'Published'),
        ('locked', 'Locked'),
        ('archived', 'Archived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='schedules'
    )
    name = models.CharField(max_length=255)
    date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    version = models.IntegerField(default=1)
    configuration = models.JSONField(default=dict)  # Stores scheduling parameters used
    metadata = models.JSONField(default=dict)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_schedules'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'schedules'
        unique_together = ['organization', 'date', 'version']
        ordering = ['-date', '-version']
        indexes = [
            models.Index(fields=['organization', 'date']),
            models.Index(fields=['status']),
        ]
    
    def can_transition_to(self, new_status):
        """Validate schedule state transitions"""
        valid_transitions = {
            'draft': ['pending_review', 'archived'],
            'pending_review': ['approved', 'draft'],
            'approved': ['published', 'draft'],
            'published': ['locked'],
            'locked': [],
            'archived': [],
        }
        return new_status in valid_transitions.get(self.status, [])
    
    def create_new_version(self):
        """Create a new version of this schedule"""
        self.pk = None
        self.version += 1
        self.status = 'draft'
        self.save()
        return self

class Assignment(models.Model):
    """Individual assignment of a member to a role in a schedule"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    schedule = models.ForeignKey(
        Schedule,
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    role = models.ForeignKey(
        'roles.Role',
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    assignment_reason = models.JSONField(default=dict)
    auto_generated = models.BooleanField(default=True)
    manually_modified = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    score = models.FloatField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'assignments'
        unique_together = ['schedule', 'role', 'member']
        indexes = [
            models.Index(fields=['schedule', 'role']),
            models.Index(fields=['member', 'schedule']),
        ]
    
    def clean(self):
        # Prevent duplicate assignments for same member in same schedule
        if Assignment.objects.filter(
            schedule=self.schedule,
            member=self.member
        ).exclude(id=self.id).exists():
            raise ValidationError('Member already assigned in this schedule')

class AssignmentHistory(models.Model):
    """Historical record of all assignments for fairness tracking"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='assignment_history'
    )
    role = models.ForeignKey(
        'roles.Role',
        on_delete=models.CASCADE
    )
    schedule = models.ForeignKey(
        Schedule,
        on_delete=models.CASCADE
    )
    assignment_date = models.DateField()
    was_auto_generated = models.BooleanField()
    was_overridden = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'assignment_history'
        indexes = [
            models.Index(fields=['member', 'assignment_date']),
            models.Index(fields=['role', 'assignment_date']),
        ]