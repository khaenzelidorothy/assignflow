from celery import shared_task
from celery.exceptions import MaxRetriesExceededError
from django.db import transaction
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=600,
    retry_jitter=True,
)
def generate_schedule_task(self, organization_id: str, schedule_date: str, config: dict = None):
    """
    Async task to generate schedule for an organization
    """
    from apps.scheduling.services import SchedulingService
    from apps.scheduling.models import Schedule
    
    try:
        logger.info(f"Starting schedule generation for org {organization_id} on {schedule_date}")
        
        service = SchedulingService()
        schedule = service.generate_schedule(
            organization_id=organization_id,
            schedule_date=schedule_date,
            configuration=config or {}
        )
        
        logger.info(
            f"Schedule generated successfully: {schedule.id} "
            f"with {schedule.assignments.count()} assignments"
        )
        
        # Trigger post-generation tasks
        calculate_fairness_metrics.delay(organization_id)
        check_burnout_risks.delay(organization_id)
        
        return {
            'schedule_id': str(schedule.id),
            'status': 'success',
            'assignments_count': schedule.assignments.count(),
        }
    
    except Exception as exc:
        logger.error(f"Schedule generation failed: {str(exc)}", exc_info=True)
        try:
            raise self.retry(exc=exc)
        except MaxRetriesExceededError:
            logger.error(f"Max retries exceeded for org {organization_id}")
            return {
                'status': 'failed',
                'error': str(exc),
            }

@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=300,
)
def calculate_fairness_metrics(self, organization_id: str):
    """
    Calculate and update fairness metrics for all members
    """
    from apps.members.models import FairnessProfile, Member
    from apps.analytics.services import AnalyticsService
    
    try:
        logger.info(f"Calculating fairness metrics for org {organization_id}")
        
        analytics_service = AnalyticsService()
        metrics = analytics_service.calculate_organization_fairness(organization_id)
        
        # Update individual profiles
        for member_id, member_metrics in metrics.get('member_metrics', {}).items():
            FairnessProfile.objects.filter(
                member__organization_id=organization_id,
                member_id=member_id,
            ).update(
                fairness_score=member_metrics.get('fairness_score', 100),
                workload_score=member_metrics.get('workload_score', 0),
                burnout_score=member_metrics.get('burnout_score', 0),
                updated_at=timezone.now(),
            )
        
        logger.info(f"Fairness metrics updated for org {organization_id}")
        
        return {
            'status': 'success',
            'members_updated': len(metrics.get('member_metrics', {})),
        }
    
    except Exception as exc:
        logger.error(f"Fairness calculation failed: {str(exc)}")
        try:
            raise self.retry(exc=exc)
        except MaxRetriesExceededError:
            return {'status': 'failed', 'error': str(exc)}

@shared_task
def send_schedule_notifications(schedule_id: str):
    """
    Send notifications to members about their assignments
    """
    from apps.scheduling.models import Schedule, Assignment
    from apps.notifications.services import NotificationService
    
    try:
        schedule = Schedule.objects.get(id=schedule_id)
        assignments = Assignment.objects.filter(schedule=schedule).select_related('member')
        
        notification_service = NotificationService()
        
        for assignment in assignments:
            notification_service.send_assignment_notification(assignment)
        
        logger.info(f"Notifications sent for schedule {schedule_id}")
        
        return {
            'status': 'success',
            'notifications_sent': assignments.count(),
        }
    
    except Exception as e:
        logger.error(f"Notification sending failed: {str(e)}")
        return {'status': 'failed', 'error': str(e)}

@shared_task
def check_burnout_risks(organization_id: str):
    """
    Check and alert on high burnout risks
    """
    from apps.members.models import FairnessProfile, Member
    from apps.notifications.services import NotificationService
    
    high_risk_profiles = FairnessProfile.objects.filter(
        member__organization_id=organization_id,
        burnout_score__gte=70,
        member__status='active',
    ).select_related('member')
    
    if high_risk_profiles.exists():
        notification_service = NotificationService()
        notification_service.send_burnout_alerts(high_risk_profiles)
        
        logger.warning(
            f"Found {high_risk_profiles.count()} members with high burnout risk "
            f"in org {organization_id}"
        )
    
    return {
        'status': 'success',
        'high_risk_count': high_risk_profiles.count(),
    }

@shared_task(
    queue='high_priority',
    rate_limit='10/m',
)
def process_reassignment_request(self, assignment_id: str, reason: str):
    """
    Process a member's request for reassignment
    """
    from apps.scheduling.models import Assignment
    from apps.scheduling.services import SchedulingService
    
    try:
        with transaction.atomic():
            assignment = Assignment.objects.select_for_update().get(id=assignment_id)
            
            # Try to find alternative member
            service = SchedulingService()
            alternative = service.find_alternative_member(
                role=assignment.role,
                schedule=assignment.schedule,
                exclude_members=[assignment.member_id],
            )
            
            if alternative:
                # Reassign
                old_member = assignment.member
                assignment.member = alternative
                assignment.manually_modified = True
                assignment.assignment_reason['reassignment_reason'] = reason
                assignment.save()
                
                logger.info(
                    f"Reassigned role {assignment.role.name} from "
                    f"{old_member.full_name} to {alternative.full_name}"
                )
                
                return {
                    'status': 'reassigned',
                    'new_member_id': str(alternative.id),
                }
            else:
                logger.warning(f"No alternative found for assignment {assignment_id}")
                return {
                    'status': 'no_alternative',
                }
    
    except Exception as e:
        logger.error(f"Reassignment failed: {str(e)}")
        raise