from django.contrib import admin
from .models import AnalyticsSnapshot, ScheduleMetrics

@admin.register(AnalyticsSnapshot)
class AnalyticsSnapshotAdmin(admin.ModelAdmin):
    list_display = ['organization', 'date', 'created_at']

@admin.register(ScheduleMetrics)
class ScheduleMetricsAdmin(admin.ModelAdmin):
    list_display = ['schedule', 'filled_roles', 'unfilled_roles', 'fairness_score']
