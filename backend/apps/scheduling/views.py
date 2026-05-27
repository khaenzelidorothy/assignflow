from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import serializers
from django.db import transaction
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
import logging

from .models import Schedule, Assignment
from .serializers import (
    ScheduleSerializer,
    AssignmentSerializer,
    ScheduleGenerateSerializer,
)
from .services import SchedulingService
from .tasks import generate_schedule_task, send_schedule_notifications

logger = logging.getLogger(__name__)

class ScheduleViewSet(viewsets.ModelViewSet):
    """
    API endpoint for schedule management
    
    Supports:
    - List schedules with filtering
    - Create new schedules
    - Generate schedule automatically
    - Version management
    - Manual overrides
    """
    
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'date']
    search_fields = ['name']
    ordering_fields = ['date', 'created_at']
    
    def get_queryset(self):
        """Filter schedules by organization"""
        return Schedule.objects.filter(
            organization=self.request.organization
        )
    
    def perform_create(self, serializer):
        serializer.save(
            organization=self.request.organization,
            created_by=self.request.user,
        )
    
    @extend_schema(
        request=ScheduleGenerateSerializer,
        responses={201: ScheduleSerializer},
        description="Automatically generate a schedule using the scheduling engine"
    )
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        Trigger schedule generation
        
        Can run synchronously for small schedules or async for large ones
        """
        serializer = ScheduleGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        schedule_date = serializer.validated_data['date']
        configuration = serializer.validated_data.get('configuration', {})
        run_async = serializer.validated_data.get('run_async', True)
        
        if run_async:
            # Async generation for large schedules
            task = generate_schedule_task.delay(
                organization_id=str(request.organization.id),
                schedule_date=str(schedule_date),
                config=configuration,
            )
            
            return Response({
                'status': 'processing',
                'task_id': task.id,
                'message': 'Schedule generation started asynchronously',
            }, status=status.HTTP_202_ACCEPTED)
        else:
            # Synchronous generation
            with transaction.atomic():
                service = SchedulingService()
                schedule = service.generate_schedule(
                    organization_id=str(request.organization.id),
                    schedule_date=schedule_date,
                    configuration=configuration,
                )
                
                serializer = self.get_serializer(schedule)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @extend_schema(
        description="Create a new version of an existing schedule"
    )
    @action(detail=True, methods=['post'])
    def create_version(self, request, pk=None):
        """Create a new version of a schedule"""
        schedule = self.get_object()
        
        if schedule.status == 'locked':
            return Response(
                {'error': 'Cannot version a locked schedule'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        new_version = schedule.create_new_version()
        serializer = self.get_serializer(new_version)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @extend_schema(
        description="Publish schedule and send notifications"
    )
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publish a schedule"""
        schedule = self.get_object()
        
        if not schedule.can_transition_to('published'):
            return Response(
                {'error': 'Schedule cannot be published in current state'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        schedule.status = 'published'
        schedule.save()
        
        # Send notifications asynchronously
        send_schedule_notifications.delay(str(schedule.id))
        
        serializer = self.get_serializer(schedule)
        return Response(serializer.data)

class AssignmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for assignment management
    
    Supports:
    - View assignments
    - Manual override
    - Lock assignments
    - Reassignment requests
    """
    
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Assignment.objects.filter(
            schedule__organization=self.request.organization
        )
    
    @extend_schema(
        description="Manually override an assignment"
    )
    @action(detail=True, methods=['post'])
    def override(self, request, pk=None):
        """Manually override an assignment"""
        assignment = self.get_object()
        
        if assignment.schedule.status == 'locked':
            return Response(
                {'error': 'Cannot modify locked schedule'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        new_member_id = request.data.get('member_id')
        reason = request.data.get('reason', 'Manual override')
        
        try:
            with transaction.atomic():
                assignment = SchedulingService.manual_override(
                    assignment=assignment,
                    new_member_id=new_member_id,
                    reason=reason,
                    performed_by=request.user,
                )
                
                serializer = self.get_serializer(assignment)
                return Response(serializer.data)
        
        except Exception as e:
            logger.error(f"Override failed: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
    
    @action(detail=True, methods=['post'])
    def lock(self, request, pk=None):
        """Lock an assignment to prevent auto-changes"""
        assignment = self.get_object()
        assignment.is_locked = True
        assignment.save()
        
        serializer = self.get_serializer(assignment)
        return Response(serializer.data)
    

class ScheduleGenerationSerializer(serializers.Serializer):
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    team_id = serializers.IntegerField(required=False)