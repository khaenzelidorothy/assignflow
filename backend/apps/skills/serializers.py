from rest_framework import serializers
from .models import Skill

class SkillSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Skill
        fields = [
            'id', 'organization', 'name', 'description', 'category',
            'is_active', 'member_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_member_count(self, obj):
        return obj.member_skills.count()
