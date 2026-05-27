from dataclasses import dataclass, field
from typing import List, Dict, Optional, Set, Tuple
from datetime import date, timedelta
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

@dataclass
class SchedulingContext:
    """Context object holding all data needed for scheduling"""
    organization_id: str
    schedule_date: date
    roles: List['Role']
    available_members: Dict[str, List['Member']]
    member_skills: Dict[str, List[str]]
    fairness_profiles: Dict[str, 'FairnessProfile']
    constraints: List['Constraint']
    rules: 'OrganizationRules'
    assignment_history: List['AssignmentHistory']

@dataclass
class AssignmentResult:
    """Result of a scheduling operation"""
    member_id: str
    role_id: str
    score: float
    reasons: List[str] = field(default_factory=list)
    is_optimal: bool = True

@dataclass
class SchedulingResult:
    """Complete scheduling output"""
    assignments: List[AssignmentResult]
    unassigned_roles: List[str]
    conflicts: List[Dict]
    fairness_metrics: Dict
    execution_time: float
    total_score: float

class SchedulingEngine:
    """
    Core scheduling engine implementing constraint-based optimization
    with fairness-first approach
    """
    
    def __init__(self):
        self.constraint_validator = ConstraintValidator()
        self.fairness_calculator = FairnessCalculator()
        self.conflict_resolver = ConflictResolver()
        self.role_prioritizer = RolePrioritizer()
    
    def generate_schedule(
        self,
        context: SchedulingContext,
        existing_assignments: Optional[List[str]] = None
    ) -> SchedulingResult:
        """
        Main scheduling algorithm:
        1. Load and validate context
        2. Prioritize roles by scarcity
        3. For each role, find best member
        4. Apply constraints
        5. Calculate fairness scores
        6. Resolve conflicts
        7. Generate explanations
        """
        assignments = []
        assigned_members = set(existing_assignments or [])
        conflicts = []
        
        # Step 1: Prioritize roles by scarcity
        prioritized_roles = self.role_prioritizer.prioritize(
            context.roles,
            context.available_members,
            context.member_skills
        )
        
        logger.info(f"Processing {len(prioritized_roles)} roles for {context.schedule_date}")
        
        # Step 2: Assign members to roles
        for role in prioritized_roles:
            try:
                assignment = self._assign_role(
                    role=role,
                    context=context,
                    assigned_members=assigned_members
                )
                
                if assignment:
                    assignments.append(assignment)
                    assigned_members.add(assignment.member_id)
                    logger.info(
                        f"Assigned {assignment.member_id} to {role.name} "
                        f"(score: {assignment.score})"
                    )
                else:
                    conflicts.append({
                        'role_id': role.id,
                        'role_name': role.name,
                        'reason': 'No eligible member found',
                        'severity': 'high'
                    })
                    logger.warning(f"No eligible member found for role: {role.name}")
            
            except Exception as e:
                logger.error(f"Error assigning role {role.name}: {str(e)}")
                conflicts.append({
                    'role_id': role.id,
                    'role_name': role.name,
                    'reason': str(e),
                    'severity': 'error'
                })
        
        # Step 3: Calculate overall fairness metrics
        fairness_metrics = self.fairness_calculator.calculate_overall_fairness(
            assignments,
            context.fairness_profiles
        )
        
        # Step 4: Build result
        result = SchedulingResult(
            assignments=assignments,
            unassigned_roles=[
                conflict['role_id'] for conflict in conflicts
            ],
            conflicts=conflicts,
            fairness_metrics=fairness_metrics,
            execution_time=0.0,
            total_score=sum(a.score for a in assignments)
        )
        
        return result
    
    def _assign_role(
        self,
        role: 'Role',
        context: SchedulingContext,
        assigned_members: Set[str]
    ) -> Optional[AssignmentResult]:
        """Assign the best member to a specific role"""
        
        # Get candidates with required skills
        candidates = self._get_eligible_candidates(
            role,
            context,
            assigned_members
        )
        
        if not candidates:
            return None
        
        # Score each candidate
        scored_candidates = []
        for member_id in candidates:
            score, reasons = self._calculate_member_score(
                member_id=member_id,
                role=role,
                context=context
            )
            scored_candidates.append((member_id, score, reasons))
        
        # Sort by score (highest first)
        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        
        # Select best candidate that passes constraints
        for member_id, score, reasons in scored_candidates:
            # Validate hard constraints
            if self.constraint_validator.validate_hard_constraints(
                member_id=member_id,
                role=role,
                context=context
            ):
                return AssignmentResult(
                    member_id=member_id,
                    role_id=role.id,
                    score=score,
                    reasons=reasons,
                    is_optimal=True
                )
        
        return None
    
    def _get_eligible_candidates(
        self,
        role: 'Role',
        context: SchedulingContext,
        assigned_members: Set[str]
    ) -> List[str]:
        """Get members eligible for a role"""
        eligible = []
        
        for member_id in context.available_members:
            # Skip already assigned members
            if member_id in assigned_members:
                continue
            
            # Check if member has required skills
            if role.required_skill_id:
                member_skill_ids = context.member_skills.get(member_id, [])
                if role.required_skill_id not in member_skill_ids:
                    continue
            
            # Check availability
            if member_id not in context.available_members.get(role.id, []):
                continue
            
            eligible.append(member_id)
        
        return eligible
    
    def _calculate_member_score(
        self,
        member_id: str,
        role: 'Role',
        context: SchedulingContext
    ) -> Tuple[float, List[str]]:
        """
        Calculate comprehensive scoring for member-role assignment
        
        Scoring components:
        - Rotation weight (hasn't done this role recently)
        - Workload balance (overall assignment count)
        - Availability reliability (history of showing up)
        - Skill priority (proficiency level)
        - Recent repeat penalty (did same role last time)
        - Burnout penalty (overworked)
        """
        reasons = []
        score = 0.0
        
        # Get member profile
        fairness_profile = context.fairness_profiles.get(member_id)
        if not fairness_profile:
            return 0.0, ['No fairness profile']
        
        # 1. Rotation weight (0-50 points)
        if self._has_member_done_role_recently(member_id, role.id, context):
            score -= 40
            reasons.append('Recently performed this role')
        else:
            score += 50
            reasons.append('Has not performed this role recently')
        
        # 2. Workload balance (0-30 points)
        workload_score = 30 - min(fairness_profile.workload_score, 30)
        score += workload_score
        if workload_score > 20:
            reasons.append('Low current workload')
        
        # 3. Availability reliability (0-20 points)
        reliability = self._calculate_reliability(member_id, context)
        score += reliability
        if reliability > 15:
            reasons.append('Reliable availability history')
        
        # 4. Skill proficiency bonus (0-10 points)
        proficiency = self._get_proficiency(member_id, role.required_skill_id)
        score += proficiency * 2
        if proficiency >= 4:
            reasons.append('High skill proficiency')
        
        # 5. Recent repeat penalty (-50 points)
        if self._was_assigned_last_period(member_id, context):
            score -= 50
            reasons.append('Assigned in previous period')
        
        # 6. Burnout penalty (varies)
        if fairness_profile.burnout_score > 70:
            score -= 50
            reasons.append('High burnout risk')
        elif fairness_profile.burnout_score > 40:
            score -= 20
            reasons.append('Moderate burnout risk')
        
        # Normalize score to 0-100 range
        score = max(0, min(100, score + 50))
        
        return score, reasons
    
    def _has_member_done_role_recently(
        self,
        member_id: str,
        role_id: str,
        context: SchedulingContext,
        weeks: int = 4
    ) -> bool:
        """Check if member has performed this role in recent weeks"""
        cutoff_date = context.schedule_date - timedelta(weeks=weeks)
        return any(
            ah.assignment_date >= cutoff_date and str(ah.role.id) == role_id
            for ah in context.assignment_history
            if str(ah.member.id) == member_id
        )
    
    def _calculate_reliability(
        self,
        member_id: str,
        context: SchedulingContext
    ) -> float:
        """Calculate availability reliability score (0-20)"""
        # In production, this would analyze historical attendance
        # For now, return base reliability
        return 15.0
    
    def _get_proficiency(
        self,
        member_id: str,
        skill_id: Optional[str]
    ) -> int:
        """Get member's proficiency level for a skill"""
        if not skill_id:
            return 3  # Default proficiency
        return context.member_skills.get(member_id, {}).get(skill_id, 0)
    
    def _was_assigned_last_period(
        self,
        member_id: str,
        context: SchedulingContext
    ) -> bool:
        """Check if member was assigned in the last scheduling period"""
        last_period = context.schedule_date - timedelta(weeks=1)
        return any(
            ah.assignment_date == last_period
            for ah in context.assignment_history
            if str(ah.member.id) == member_id
        )