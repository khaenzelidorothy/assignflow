from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganizationViewSet, OrganizationUserViewSet

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet, basename='organization')
router.register(r'organization-users', OrganizationUserViewSet, basename='organization-user')

urlpatterns = [
    path('', include(router.urls)),
]
