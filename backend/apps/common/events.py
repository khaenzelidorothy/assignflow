from dataclasses import dataclass
from typing import Any, Dict, List, Callable
from enum import Enum
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class EventType(Enum):
    AVAILABILITY_SUBMITTED = 'availability_submitted'
    SCHEDULE_GENERATED = 'schedule_generated'
    ASSIGNMENT_CREATED = 'assignment_created'
    ASSIGNMENT_OVERRIDDEN = 'assignment_overridden'
    SCHEDULE_PUBLISHED = 'schedule_published'
    MEMBER_UNAVAILABLE = 'member_unavailable'
    ROLE_UNFILLED = 'role_unfilled'
    BURNOUT_ALERT = 'burnout_alert'
    FAIRNESS_ANOMALY = 'fairness_anomaly'

@dataclass
class Event:
    """Domain event"""
    event_type: EventType
    organization_id: str
    payload: Dict[str, Any]
    timestamp: datetime = None
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        self.timestamp = self.timestamp or datetime.utcnow()
        self.metadata = self.metadata or {}

class EventBus:
    """Simple event bus for internal event-driven communication"""
    
    _handlers: Dict[EventType, List[Callable]] = {}
    
    @classmethod
    def subscribe(cls, event_type: EventType, handler: Callable):
        """Subscribe to an event"""
        if event_type not in cls._handlers:
            cls._handlers[event_type] = []
        cls._handlers[event_type].append(handler)
        logger.debug(f"Handler subscribed to {event_type.value}")
    
    @classmethod
    def publish(cls, event: Event):
        """Publish an event to all subscribers"""
        handlers = cls._handlers.get(event.event_type, [])
        
        logger.info(
            f"Publishing event: {event.event_type.value} "
            f"for org {event.organization_id}"
        )
        
        for handler in handlers:
            try:
                handler(event)
            except Exception as e:
                logger.error(
                    f"Error handling event {event.event_type.value}: {str(e)}",
                    exc_info=True
                )
        
        # Always log event to database for auditing
        cls._persist_event(event)
    
    @classmethod
    def _persist_event(cls, event: Event):
        """Persist event to database"""
        from apps.audit.models import EventLog
        
        EventLog.objects.create(
            organization_id=event.organization_id,
            event_type=event.event_type.value,
            payload=event.payload,
            metadata=event.metadata,
        )

# Register event handlers
def setup_event_handlers():
    """Register all event handlers"""
    
    # Notification handlers
    EventBus.subscribe(
        EventType.SCHEDULE_PUBLISHED,
        lambda event: send_schedule_notifications.delay(
            event.payload['schedule_id']
        )
    )
    
    EventBus.subscribe(
        EventType.ASSIGNMENT_CREATED,
        lambda event: update_fairness_metrics.delay(
            event.organization_id,
            event.payload['member_id']
        )
    )
    
    # Analytics handlers
    EventBus.subscribe(
        EventType.AVAILABILITY_SUBMITTED,
        lambda event: track_availability_metrics.delay(
            event.organization_id,
            event.payload
        )
    )
    
    # AI pipeline handlers
    EventBus.subscribe(
        EventType.ASSIGNMENT_OVERRIDDEN,
        lambda event: feed_ai_training_data.delay(
            event.organization_id,
            event.payload
        )
    )