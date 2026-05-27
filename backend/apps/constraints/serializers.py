from rest_framework import serializers
from .models import OrganizationRule, Constraint

class OrganizationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationRule
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class ConstraintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Constraint
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
