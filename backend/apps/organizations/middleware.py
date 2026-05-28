import threading
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import connection
from django.http import Http404
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()

_thread_locals = threading.local()

class OrganizationMiddleware:
    """
    Middleware to set the current organization based on the request.
    Implements row-level security for multi-tenant isolation.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            try:
                auth_result = JWTAuthentication().authenticate(request)
            except Exception:
                auth_result = None

            if auth_result is not None:
                request.user, request.auth = auth_result

        organization = self.get_organization(request)
        
        if organization:
            request.organization = organization
            _thread_locals.organization = organization
            
            # Set PostgreSQL row-level security context
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT set_config('assignflow.current_organization_id', %s, false)",
                    [str(organization.id)]
                )
        
        response = self.get_response(request)
        return response
    
    def get_organization(self, request):
        """Extract organization from request"""
        
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return None
        
        # Superusers can access all organizations
        if request.user.is_superuser:
            org_id = request.headers.get('X-Organization-ID')
            if org_id:
                try:
                    from apps.organizations.models import Organization
                    return Organization.objects.get(id=org_id, is_active=True)
                except Organization.DoesNotExist:
                    raise Http404("Organization not found")
            return None
        
        # Get organization from user's profile or membership
        if hasattr(request.user, 'organization'):
            return request.user.organization

        from .models import OrganizationUser
        membership = OrganizationUser.objects.filter(
            user=request.user,
            is_active=True,
        ).select_related('organization').first()
        return membership.organization if membership else None
    
    @classmethod
    def get_current_organization(cls):
        """Get current organization from thread local storage"""
        return getattr(_thread_locals, 'organization', None)