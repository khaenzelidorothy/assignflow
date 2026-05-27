from rest_framework import serializers
from .models import Schedule, Assignment, AssignmentHistory

class AssignmentSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.full_name', read_only=True)
    role_name = serializers.CharField(source='role.name', read_only=True)
    
    class Meta:
        model = Assignment
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class ScheduleSerializer(serializers.ModelSerializer):
    assignments = AssignmentSerializer(many=True, read_only=True)
    assignment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Schedule
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_assignment_count(self, obj):
        return obj.assignments.count()

class ScheduleGenerateSerializer(serializers.Serializer):
    date = serializers.DateField()
    configuration = serializers.JSONField(required=False, default=dict)
    run_async = serializers.BooleanField(default=True)

class AssignmentOverrideSerializer(serializers.Serializer):
    member_id = serializers.UUIDField()
    reason = serializers.CharField(required=False, default='Manual override')
