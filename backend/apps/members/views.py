from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Member, MemberSkill, FairnessProfile
from .serializers import MemberSerializer, MemberSkillSerializer, FairnessProfileSerializer

class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['last_name', 'created_at']
    
    def get_queryset(self):
        return Member.objects.filter(
            organization=self.request.organization
        )

class MemberSkillViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSkillSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MemberSkill.objects.filter(
            member__organization=self.request.organization
        )
