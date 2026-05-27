from django.db import models
from apps.organizations.models import Organization

class AnalyticsSnapshot(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    date = models.DateField()
    metrics = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'analytics_snapshots'
        unique_together = ['organization', 'date']

class ScheduleMetrics(models.Model):
    schedule = models.OneToOneField('scheduling.Schedule', on_delete=models.CASCADE)
    total_roles = models.IntegerField(default=0)
    filled_roles = models.IntegerField(default=0)
    unfilled_roles = models.IntegerField(default=0)
    fairness_score = models.FloatField(default=100)
    average_workload = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'schedule_metrics'
