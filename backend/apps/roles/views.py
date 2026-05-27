from rest_framework import viewsets, permissions
from .models import Role
from .serializers import RoleSerializer

class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Role.objects.filter(
            organization=self.request.organization,
            is_active=True
        )
