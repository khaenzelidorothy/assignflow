from rest_framework import serializers
from .models import Availability

class AvailabilitySerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.full_name', read_only=True)
    
    class Meta:
        model = Availability
        fields = [
            'id', 'member', 'member_name', 'date', 'status',
            'available_until', 'notes', 'submitted_at', 'updated_at'
        ]
        read_only_fields = ['id', 'submitted_at', 'updated_at']
