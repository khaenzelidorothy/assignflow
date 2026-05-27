import requests
from django.conf import settings
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class WhatsAppService:
    """WhatsApp Cloud API integration for notifications"""
    
    def __init__(self):
        self.api_version = 'v17.0'
        self.phone_number_id = settings.WHATSAPP_PHONE_NUMBER_ID
        self.access_token = settings.WHATSAPP_ACCESS_TOKEN
        self.base_url = f'https://graph.facebook.com/{self.api_version}/{self.phone_number_id}'
        self.is_enabled = settings.FEATURE_FLAGS.get('WHATSAPP_INTEGRATION', False)
    
    def send_availability_reminder(self, phone_number: str, member_name: str, date: str):
        """Send availability check reminder"""
        if not self.is_enabled:
            logger.info(f"WhatsApp disabled, skipping reminder to {phone_number}")
            return
        
        message = (
            f"👋 Hi {member_name}!\n\n"
            f"Are you available to serve on {date}?\n\n"
            f"Reply:\n"
            f"1️⃣ - Yes, I'm available\n"
            f"2️⃣ - No, I'm not available"
        )
        
        return self._send_message(phone_number, message)
    
    def send_assignment_notification(self, phone_number: str, member_name: str, 
                                   role_name: str, date: str, time: str):
        """Send assignment notification"""
        if not self.is_enabled:
            return
        
        message = (
            f"📋 Schedule Update for {member_name}\n\n"
            f"You've been assigned to:\n"
            f"🔹 Role: {role_name}\n"
            f"📅 Date: {date}\n"
            f"⏰ Time: {time}\n\n"
            f"Please confirm your availability.\n"
            f"Reply:\n"
            f"✅ Confirm\n"
            f"🔄 Request Change"
        )
        
        return self._send_message(phone_number, message)
    
    def send_schedule_published(self, phone_number: str, member_name: str, schedule_link: str):
        """Notify when schedule is published"""
        if not self.is_enabled:
            return
        
        message = (
            f"📢 Schedule Published!\n\n"
            f"Hi {member_name},\n\n"
            f"The new schedule is now available.\n"
            f"View your assignments here:\n"
            f"{schedule_link}\n\n"
            f"Thank you for serving! 🙏"
        )
        
        return self._send_message(phone_number, message)
    
    def _send_message(self, to: str, message: str) -> Optional[Dict[str, Any]]:
        """Send WhatsApp message via Cloud API"""
        try:
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json',
            }
            
            payload = {
                'messaging_product': 'whatsapp',
                'to': to,
                'type': 'text',
                'text': {
                    'body': message,
                },
            }
            
            response = requests.post(
                f'{self.base_url}/messages',
                headers=headers,
                json=payload,
                timeout=10,
            )
            
            response.raise_for_status()
            
            logger.info(f"WhatsApp message sent to {to}")
            return response.json()
        
        except requests.exceptions.RequestException as e:
            logger.error(f"WhatsApp send failed to {to}: {str(e)}")
            return None
    
    def process_incoming_message(self, from_number: str, message: str):
        """Process incoming WhatsApp messages"""
        message = message.strip().lower()
        
        if message in ['1', '1️⃣', 'yes', 'y']:
            # Process availability confirmation
            self._handle_availability_confirmation(from_number, available=True)
        
        elif message in ['2', '2️⃣', 'no', 'n']:
            # Process availability decline
            self._handle_availability_confirmation(from_number, available=False)
        
        elif message in ['✅', 'confirm']:
            # Process assignment confirmation
            self._handle_assignment_confirmation(from_number)
        
        elif message in ['🔄', 'change']:
            # Process reassignment request
            self._handle_reassignment_request(from_number)
    
    def _handle_availability_confirmation(self, phone_number: str, available: bool):
        """Update member availability based on WhatsApp response"""
        from apps.availability.services import AvailabilityService
        
        service = AvailabilityService()
        service.update_availability_from_whatsapp(phone_number, available)
    
    def _handle_assignment_confirmation(self, phone_number: str):
        """Confirm assignment via WhatsApp"""
        # Implementation for assignment confirmation
        pass
    
    def _handle_reassignment_request(self, phone_number: str):
        """Handle reassignment request from WhatsApp"""
        # Implementation for reassignment request
        pass