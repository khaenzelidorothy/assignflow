from rest_framework import serializers
from .models import Organization, OrganizationUser

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

class OrganizationUserSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = OrganizationUser
        fields = ['id', 'user', 'user_email', 'user_name', 'role', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
