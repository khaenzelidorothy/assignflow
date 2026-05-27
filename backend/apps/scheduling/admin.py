from django.contrib import admin
from .models import Schedule, Assignment, AssignmentHistory

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'date', 'status', 'version', 'created_at']
    list_filter = ['status', 'organization', 'date']
    search_fields = ['name']

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['schedule', 'role', 'member', 'auto_generated', 'manually_modified']
    list_filter = ['auto_generated', 'manually_modified']
    search_fields = ['member__first_name', 'member__last_name', 'role__name']

@admin.register(AssignmentHistory)
class AssignmentHistoryAdmin(admin.ModelAdmin):
    list_display = ['member', 'role', 'assignment_date']
    list_filter = ['assignment_date']
