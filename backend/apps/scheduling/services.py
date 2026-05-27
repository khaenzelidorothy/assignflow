import logging
from datetime import date
from django.db import transaction
from django.utils import timezone
from .models import Schedule, Assignment, AssignmentHistory
from apps.members.models import Member, FairnessProfile
from apps.roles.models import Role
from apps.availability.models import Availability

logger = logging.getLogger(__name__)

class SchedulingService:
    """Service for schedule generation and management"""
    
    def generate_schedule(self, organization_id: str, schedule_date: date, configuration: dict = None):
        """Generate a schedule using the scheduling engine"""
        
        # Create schedule record
        schedule = Schedule.objects.create(
            organization_id=organization_id,
            name=f"Schedule - {schedule_date}",
            date=schedule_date,
            status='draft',
            configuration=configuration or {},
        )
        
        # Get available members
        available_members = self._get_available_members(organization_id, schedule_date)
        
        # Get roles that need filling
        roles = Role.objects.filter(
            organization_id=organization_id,
            is_active=True
        ).order_by('priority')
        
        assigned_members = []
        
        for role in roles:
            # Find best member for this role
            best_member = self._find_best_member(
                role=role,
                available_members=available_members,
                assigned_members=assigned_members,
                schedule_date=schedule_date,
            )
            
            if best_member:
                # Create assignment
                assignment = Assignment.objects.create(
                    schedule=schedule,
                    role=role,
                    member=best_member,
                    auto_generated=True,
                    assignment_reason={
                        'method': 'fairness_based',
                        'date': schedule_date.isoformat(),
                    }
                )
                assigned_members.append(best_member.id)
                
                # Update assignment history
                AssignmentHistory.objects.create(
                    member=best_member,
                    role=role,
                    schedule=schedule,
                    assignment_date=schedule_date,
                    was_auto_generated=True,
                )
                
                # Update fairness profile
                self._update_fairness_profile(best_member)
        
        return schedule
    
    def _get_available_members(self, organization_id: str, schedule_date: date):
        """Get list of members available on a given date"""
        available_member_ids = Availability.objects.filter(
            member__organization_id=organization_id,
            date=schedule_date,
            status='available',
        ).values_list('member_id', flat=True)
        
        return Member.objects.filter(
            id__in=available_member_ids,
            status='active',
        )
    
    def _find_best_member(self, role, available_members, assigned_members, schedule_date):
        """Find the best member for a role based on fairness scoring"""
        
        candidates = available_members.exclude(id__in=assigned_members)
        
        if not candidates:
            return None
        
        # Score each candidate
        scored_candidates = []
        for member in candidates:
            score = self._calculate_member_score(member, role, schedule_date)
            scored_candidates.append((member, score))
        
        # Sort by score (highest first)
        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        
        return scored_candidates[0][0] if scored_candidates else None
    
    def _calculate_member_score(self, member, role, schedule_date):
        """Calculate fairness-based score for a member"""
        try:
            profile = FairnessProfile.objects.get(member=member)
        except FairnessProfile.DoesNotExist:
            profile = FairnessProfile.objects.create(member=member)
        
        score = 0
        
        # Fairness score contributes positively
        score += profile.fairness_score * 0.5
        
        # Burnout reduces score
        score -= profile.burnout_score * 0.3
        
        # Recent assignments reduce score
        recent_assignments = AssignmentHistory.objects.filter(
            member=member,
            assignment_date__gte=schedule_date.replace(day=1),
        ).count()
        score -= recent_assignments * 10
        
        return max(0, score)
    
    def _update_fairness_profile(self, member):
        """Update fairness profile after assignment"""
        profile, created = FairnessProfile.objects.get_or_create(member=member)
        
        # Increment total assignments
        profile.total_assignments += 1
        
        # Update workload score
        profile.workload_score = min(100, profile.workload_score + 10)
        
        # Adjust fairness score
        if profile.total_assignments > 5:
            profile.fairness_score = max(0, profile.fairness_score - 5)
        
        profile.save()
