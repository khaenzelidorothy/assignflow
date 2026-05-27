from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganizationRuleViewSet, ConstraintViewSet

router = DefaultRouter()
router.register(r'rules', OrganizationRuleViewSet, basename='organization-rules')
router.register(r'constraints', ConstraintViewSet, basename='constraints')

urlpatterns = [
    path('', include(router.urls)),
]
