from rest_framework import viewsets, permissions
from .models import OrganizationRule, Constraint
from .serializers import OrganizationRuleSerializer, ConstraintSerializer

class OrganizationRuleViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationRuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return OrganizationRule.objects.filter(
            organization=self.request.organization
        )

class ConstraintViewSet(viewsets.ModelViewSet):
    serializer_class = ConstraintSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Constraint.objects.filter(
            organization=self.request.organization
        )
