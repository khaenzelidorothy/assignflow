from django.contrib import admin
from .models import OrganizationRule, Constraint

@admin.register(OrganizationRule)
class OrganizationRuleAdmin(admin.ModelAdmin):
    list_display = ['organization', 'max_assignments_per_day', 'prioritize_fairness']

@admin.register(Constraint)
class ConstraintAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'type', 'weight', 'is_active']
    list_filter = ['type', 'is_active']
