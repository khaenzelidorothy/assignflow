import time
import logging
import json
from django.utils import timezone

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware:
    """Log all API requests with timing information"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        
        # Log request details
        log_data = {
            'method': request.method,
            'path': request.path,
            'status_code': response.status_code,
            'duration': f'{duration:.3f}s',
            'user': str(request.user) if request.user.is_authenticated else 'anonymous',
            'timestamp': timezone.now().isoformat(),
        }
        
        logger.info(f"Request: {json.dumps(log_data)}")
        
        return response

class AuditLogMiddleware:
    """Middleware for audit logging"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log request
        if request.user.is_authenticated and request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            from apps.audit.models import AuditLog
            AuditLog.objects.create(
                organization=getattr(request, 'organization', None),
                actor=request.user,
                action_type=request.method,
                entity_type=request.path,
                created_at=timezone.now(),
            )
        
        return self.get_response(request)
