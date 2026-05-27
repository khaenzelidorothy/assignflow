from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ScheduleViewSet, AssignmentViewSet

router = DefaultRouter()
router.register(r'schedules', ScheduleViewSet, basename='schedules')
router.register(r'assignments', AssignmentViewSet, basename='assignments'   )

urlpatterns = [
    path('', include(router.urls)),
]
