import os
import json
import logging
import pika
import django
from django.utils.timezone import now
from django.core.management.base import BaseCommand
from event_processor.models import AuthEvent
from event_processor.services.event_processor import process_event

# Ensure Django settings are loaded
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'event_service.settings')
django.setup()

logger = logging.getLogger(__name__)

def callback(ch, method, properties, body):
    """Process incoming event from RabbitMQ"""
    try:
        event_data = json.loads(body)
        event_type = event_data.get("type")

        # Store the raw event in the Event Service database
      

        # Store the raw event in the Event Service database
        event = AuthEvent.objects.create(
            event_type=event_type,
            event_data=event_data.get("data"),
            timestamp=now()
        )
        
        print('event object', event)
    
        logger.info(f"Stored event: {event_type}")

        # Forward relevant data to Query Service
        process_event(event_type, event_data.get("data"))

        # Acknowledge message
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        logger.error(f"Error processing event: {str(e)}")
        ch.basic_nack(delivery_tag=method.delivery_tag)
        return

class Command(BaseCommand):
    help = "Starts the RabbitMQ event consumer for auth events"

    def handle(self, *args, **kwargs):
        """Start RabbitMQ consumer for auth events"""
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
