from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import timedelta
from apps.members.models import Member, FairnessProfile
from apps.scheduling.models import Assignment, Schedule

class DashboardMetricsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        org = request.organization
        
        # Member metrics
        total_members = Member.objects.filter(organization=org).count()
        active_members = Member.objects.filter(organization=org, status='active').count()
        
        # Fairness metrics
        avg_fairness = FairnessProfile.objects.filter(
            member__organization=org
        ).aggregate(Avg('fairness_score'))['fairness_score__avg'] or 100
        
        # Schedule metrics
        recent_schedules = Schedule.objects.filter(
            organization=org,
            date__gte=timezone.now().date() - timedelta(days=30)
        )
        
        total_assignments = Assignment.objects.filter(
            schedule__in=recent_schedules
        ).count()
        
        # Burnout risks
        high_burnout = FairnessProfile.objects.filter(
            member__organization=org,
            burnout_score__gte=70
        ).count()
        
        return Response({
            'total_members': total_members,
            'active_members': active_members,
            'average_fairness': avg_fairness,
            'total_assignments_30days': total_assignments,
            'high_burnout_risk': high_burnout,
            'schedules_generated': recent_schedules.count(),
        })

class FairnessAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        org = request.organization
        
        profiles = FairnessProfile.objects.filter(
            member__organization=org
        ).select_related('member')
        
        data = []
        for profile in profiles:
            data.append({
                'member_name': profile.member.full_name,
                'fairness_score': profile.fairness_score,
                'burnout_score': profile.burnout_score,
                'workload_score': profile.workload_score,
                'total_assignments': profile.total_assignments,
            })
        
        return Response(data)
