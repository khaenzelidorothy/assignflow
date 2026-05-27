from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, MemberSkillViewSet

router = DefaultRouter()
router.register(r'members', MemberViewSet, basename='member')
router.register(r'member-skills', MemberSkillViewSet, basename='member-skill'   )

urlpatterns = [
    path('', include(router.urls)),
]
