from rest_framework import serializers
from .models import Member, MemberSkill, FairnessProfile

class FairnessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FairnessProfile
        fields = '__all__'

class MemberSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    
    class Meta:
        model = MemberSkill
        fields = ['id', 'member', 'skill', 'skill_name', 'proficiency_level', 'is_verified']

class MemberSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    skills = MemberSkillSerializer(source='member_skills', many=True, read_only=True)
    fairness = FairnessProfileSerializer(source='fairness_profile', read_only=True)
    
    class Meta:
        model = Member
        fields = [
            'id', 'organization', 'user', 'first_name', 'last_name',
            'full_name', 'phone_number', 'email', 'status',
            'preferences', 'skills', 'fairness',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
