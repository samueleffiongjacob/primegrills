import os
import json
import logging
import pika
import django
from django.core.management.base import BaseCommand
from message_service.models import User, ClientProfile, StaffProfile
from message_service.serializers import UserSerializer

# Ensure Django settings are loaded
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'message_service.settings')
django.setup()

logger = logging.getLogger(__name__)

def store_user(event_type, event_data):
    """Stores user based on event type."""
    try:
        username = event_data.get("username")
        email = event_data.get("email")
        role = event_data.get("role")

        print(f"Processing user: {username}, role: {role}")
        
        if not email:
            logger.warning("Missing email in event data. Skipping user creation.")
            return

        # Determine user type
        user_type = "client" if event_type == "UserSignedUp" else "staff"

        # Check if user already exists
        user, created = User.objects.get_or_create(
            email=email, 
            defaults={
                "username": username,
                "user_type": user_type
            }
        )

        if created:
            logger.info(f"New user created: {username} ({user_type})")
            print(f"New user created: {username} ({user_type})")

            # Create profile - this should now be handled by the UserManager
            # but we'll leave it here as a safeguard
            if user_type == "client":
                ClientProfile.objects.get_or_create(user=user)
            else:
                StaffProfile.objects.get_or_create(user=user, defaults={"role": role})
        else:
            logger.info(f"User already exists: {username}")
            # Update existing user if needed
            if user_type == "staff" and user.staff_profile:
                user.staff_profile.role = role
                user.staff_profile.save()

    except Exception as e:
        logger.error(f"Error storing user: {str(e)}")
def callback(ch, method, properties, body):
    """Process incoming event from RabbitMQ"""
    try:
        event_data = json.loads(body)
        event_type = event_data.get("type")

        if event_type in ["UserSignedUp", "StaffSignedUp"]:
            store_user(event_type, event_data.get("data"))

        # Acknowledge message
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        logger.error(f"Error processing event: {str(e)}")
        ch.basic_nack(delivery_tag=method.delivery_tag)

class Command(BaseCommand):
    help = "Starts the RabbitMQ event consumer for auth events"

    def handle(self, *args, **kwargs):
        """Start RabbitMQ consumer for auth events"""
        print('starting event listener ')
        connection_params = pika.ConnectionParameters(
            host='localhost',
            port=5672,
            credentials=pika.PlainCredentials('primegrills', 'primegrills'),
            heartbeat=600,
            blocked_connection_timeout=300
        )
        connection = pika.BlockingConnection(connection_params)
        channel = connection.channel()

        # Declare queue
        channel.queue_declare(queue="auth_events_queue", durable=True)

        # Bind queue to exchange
        channel.queue_bind(exchange="auth_events", queue="auth_events_queue", routing_key="#")

        # Consume messages
        channel.basic_consume(queue="auth_events_queue", on_message_callback=callback, auto_ack=False)
        logger.info("Started event consumer...")
        channel.start_consuming()
