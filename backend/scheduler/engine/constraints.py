from typing import Dict, List, Any, Optional
from abc import ABC, abstractmethod
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class ConstraintType(Enum):
    HARD = 'hard'  # Must be satisfied
    SOFT = 'soft'  # Should be satisfied, can be relaxed

class Constraint(ABC):
    """Base constraint class"""
    
    def __init__(self, name: str, constraint_type: ConstraintType, weight: float = 1.0):
        self.name = name
        self.type = constraint_type
        self.weight = weight
    
    @abstractmethod
    def evaluate(self, context: Dict[str, Any]) -> bool:
        """Evaluate if constraint is satisfied"""
        pass
    
    @abstractmethod
    def explain(self) -> str:
        """Human-readable explanation"""
        pass

class AvailabilityConstraint(Constraint):
    """Member must be available on schedule date"""
    
    def __init__(self):
        super().__init__(
            name='availability',
            constraint_type=ConstraintType.HARD,
            weight=1.0
        )
    
    def evaluate(self, context: Dict[str, Any]) -> bool:
        member_id = context.get('member_id')
        schedule_date = context.get('schedule_date')
        availability = context.get('availability', {})
        
        is_available = availability.get(member_id, False)
        if not is_available:
            logger.debug(f"Member {member_id} not available on {schedule_date}")
        return is_available
    
    def explain(self) -> str:
        return "Member must be available on schedule date"

class SkillConstraint(Constraint):
    """Member must have required skill"""
    
    def __init__(self):
        super().__init__(
            name='required_skill',
            constraint_type=ConstraintType.HARD,
            weight=1.0
        )
    
    def evaluate(self, context: Dict[str, Any]) -> bool:
        member_id = context.get('member_id')
        required_skill_id = context.get('required_skill_id')
        member_skills = context.get('member_skills', {})
        
        if not required_skill_id:
            return True
        
        has_skill = required_skill_id in member_skills.get(member_id, [])
        if not has_skill:
            logger.debug(f"Member {member_id} lacks skill {required_skill_id}")
        return has_skill
    
    def explain(self) -> str:
        return "Member must have required skill"

class DuplicateAssignmentConstraint(Constraint):
    """Member cannot be assigned to multiple roles"""
    
    def __init__(self):
        super().__init__(
            name='no_duplicate_assignment',
            constraint_type=ConstraintType.HARD,
            weight=1.0
        )
    
    def evaluate(self, context: Dict[str, Any]) -> bool:
        member_id = context.get('member_id')
        assigned_members = context.get('assigned_members', set())
        
        is_duplicate = member_id in assigned_members
        if is_duplicate:
            logger.debug(f"Member {member_id} already assigned")
        return not is_duplicate
    
    def explain(self) -> str:
        return "Member cannot be assigned to multiple roles"

class FairnessConstraint(Constraint):
    """Soft constraint for fairness balancing"""
    
    def __init__(self, weight: float = 0.5):
        super().__init__(
            name='fairness',
            constraint_type=ConstraintType.SOFT,
            weight=weight
        )
    
    def evaluate(self, context: Dict[str, Any]) -> bool:
        member_id = context.get('member_id')
        fairness_profiles = context.get('fairness_profiles', {})
        
        profile = fairness_profiles.get(member_id)
        if not profile:
            return True
        
        # Allow if fairness score is acceptable
        return profile.get('fairness_score', 100) > 30
    
    def explain(self) -> str:
        return "Member should have fair distribution of assignments"

class BurnoutConstraint(Constraint):
    """Soft constraint to prevent burnout"""
    
    def __init__(self, weight: float = 0.7):
        super().__init__(
            name='burnout_prevention',
            constraint_type=ConstraintType.SOFT,
            weight=weight
        )
    
    def evaluate(self, context: Dict[str, Any]) -> bool:
        member_id = context.get('member_id')
        fairness_profiles = context.get('fairness_profiles', {})
        
        profile = fairness_profiles.get(member_id)
        if not profile:
            return True
        
        # Allow if burnout risk is manageable
        return profile.get('burnout_score', 0) < 80
    
    def explain(self) -> str:
        return "Member should not be overworked"

class ConstraintValidator:
    """Validates constraints against scheduling context"""
    
    def __init__(self):
        self.hard_constraints = [
            AvailabilityConstraint(),
            SkillConstraint(),
            DuplicateAssignmentConstraint(),
        ]
        
        self.soft_constraints = [
            FairnessConstraint(weight=0.5),
            BurnoutConstraint(weight=0.7),
        ]
    
    def validate_hard_constraints(
        self,
        member_id: str,
        role: 'Role',
        context: 'SchedulingContext'
    ) -> bool:
        """Validate all hard constraints"""
        eval_context = self._build_eval_context(member_id, role, context)
        
        for constraint in self.hard_constraints:
            if not constraint.evaluate(eval_context):
                logger.info(
                    f"Hard constraint failed: {constraint.name} "
                    f"for member {member_id} role {role.name}"
                )
                return False
        
        return True
    
    def evaluate_soft_constraints(
        self,
        member_id: str,
        role: 'Role',
        context: 'SchedulingContext'
    ) -> float:
        """Calculate soft constraint score (0-1)"""
        eval_context = self._build_eval_context(member_id, role, context)
        total_weight = sum(c.weight for c in self.soft_constraints)
        
        if total_weight == 0:
            return 1.0
        
        score = 0.0
        for constraint in self.soft_constraints:
            if constraint.evaluate(eval_context):
                score += constraint.weight
        
        return score / total_weight
    
    def _build_eval_context(
        self,
        member_id: str,
        role: 'Role',
        context: 'SchedulingContext'
    ) -> Dict[str, Any]:
        """Build evaluation context for constraints"""
        return {
            'member_id': member_id,
            'role_id': role.id,
            'required_skill_id': role.required_skill_id,
            'schedule_date': context.schedule_date,
            'availability': context.available_members,
            'member_skills': context.member_skills,
            'assigned_members': set(),  # Will be populated during assignment
            'fairness_profiles': context.fairness_profiles,
        }