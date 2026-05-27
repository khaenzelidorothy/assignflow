from django.contrib import admin
from .models import Member, MemberSkill, FairnessProfile

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'status', 'organization']
    search_fields = ['first_name', 'last_name', 'email']
    list_filter = ['status', 'organization']

@admin.register(MemberSkill)
class MemberSkillAdmin(admin.ModelAdmin):
    list_display = ['member', 'skill', 'proficiency_level', 'is_verified']

@admin.register(FairnessProfile)
class FairnessProfileAdmin(admin.ModelAdmin):
    list_display = ['member', 'fairness_score', 'burnout_score', 'workload_score']
