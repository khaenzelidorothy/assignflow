import logging
from django.conf import settings
from .models import Notification

logger = logging.getLogger(__name__)

class NotificationService:
    """Service for sending notifications across channels"""
    
    def send_assignment_notification(self, assignment):
        """Send notification about a new assignment"""
        notification = Notification.objects.create(
            organization=assignment.schedule.organization,
            recipient=assignment.member.user,
            channel='email',
            subject='New Schedule Assignment',
            body=f"You have been assigned to {assignment.role.name} on {assignment.schedule.date}",
            metadata={
                'schedule_id': str(assignment.schedule.id),
                'assignment_id': str(assignment.id),
            }
        )
        
        # In production, actually send the email
        notification.status = 'sent'
        notification.sent_at = notification.created_at
        notification.save()
        
        return notification
    
    def send_availability_reminder(self, member, date):
        """Send reminder to submit availability"""
        notification = Notification.objects.create(
            organization=member.organization,
            recipient=member.user,
            channel='email',
            subject='Availability Reminder',
            body=f"Please submit your availability for {date}",
            metadata={'date': str(date)}
        )
        
        notification.status = 'sent'
        notification.sent_at = notification.created_at
        notification.save()
        
        return notification
