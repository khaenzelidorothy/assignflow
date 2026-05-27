import uuid
from django.db import models
from apps.members.models import Member

class Availability(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('unavailable', 'Unavailable'),
        ('tentative', 'Tentative'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='availability_set')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    available_until = models.TimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'availability'
        unique_together = ['member', 'date']
        ordering = ['date']
        indexes = [
            models.Index(fields=['member', 'date']),
            models.Index(fields=['date', 'status']),
        ]
    
    def __str__(self):
        return f"{self.member.full_name} - {self.date}: {self.status}"
