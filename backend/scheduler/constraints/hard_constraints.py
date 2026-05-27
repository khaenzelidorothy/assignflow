"""Hard constraints that must be satisfied"""
from abc import ABC, abstractmethod

class HardConstraint(ABC):
    @abstractmethod
    def is_satisfied(self, member, role, context):
        pass

class AvailabilityConstraint(HardConstraint):
    def is_satisfied(self, member, role, context):
        return member.id in context.get('available_members', [])

class SkillConstraint(HardConstraint):
    def is_satisfied(self, member, role, context):
        if not role.required_skill:
            return True
        member_skills = context.get('member_skills', {}).get(member.id, [])
        return role.required_skill.id in member_skills

class DuplicateConstraint(HardConstraint):
    def is_satisfied(self, member, role, context):
        assigned = context.get('assigned_members', [])
        return member.id not in assigned
