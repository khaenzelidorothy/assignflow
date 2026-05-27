from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404
from .models import Organization, OrganizationUser
from .serializers import OrganizationSerializer, OrganizationUserSerializer

class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return Organization.objects.all()
        return Organization.objects.filter(
            memberships__user=self.request.user,
            memberships__is_active=True
        )

class OrganizationUserViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return OrganizationUser.objects.filter(
            organization=self.request.organization
        )
