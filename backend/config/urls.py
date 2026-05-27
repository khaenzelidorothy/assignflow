from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Authentication
    path('api/v1/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # API Endpoints
    path('api/v1/', include('apps.identity.urls')),
    path('api/v1/', include('apps.organizations.urls')),
    path('api/v1/', include('apps.members.urls')),
    path('api/v1/', include('apps.skills.urls')),
    path('api/v1/', include('apps.roles.urls')),
    path('api/v1/', include('apps.availability.urls')),
    path('api/v1/', include('apps.scheduling.urls')),
    path('api/v1/', include('apps.analytics.urls')),
    path('api/v1/', include('apps.notifications.urls')),
    path('api/v1/', include('apps.audit.urls')),
    
    # Health Check
    path('health/', include('apps.common.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Debug Toolbar
    try:
        import debug_toolbar
        urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
    except ImportError:
        pass
