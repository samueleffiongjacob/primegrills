import pika
import json
import logging
from django.core.management.base import BaseCommand
from django.utils.timezone import now
from query_processor.models import CustomUser

logger = logging.getLogger(__name__)

def callback(ch, method, properties, body):
    """Process event from Event Service and store in Query Service"""
    try:
        event_data = json.loads(body)
        event_type = event_data.get("type")
        data = event_data.get("data")

        if event_type in ["UserSignedUp", "StaffSignedUp"]:
            email = data["email"]
            username = data["username"]

            # Check if user already exists
            if CustomUser.objects.filter(email=email).exists() or CustomUser.objects.filter(username=username).exists():
                logger.warning(f"Duplicate user detected: {email}. Skipping event processing.")
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return

            # Create user if it does not exist
            user_data = {
                "username": username,
                "email": email,
                "phone": data.get("phone", ""),
                "address": data.get("address", ""),
                "date_joined": now(),
            }

            if event_type == "UserSignedUp":
                user_data["is_staff"] = False
                user_data["name"] = data.get("name", "")

            elif event_type == "StaffSignedUp":
                user_data.update({
                    "first_name": data.get("first_name", ""),
                    "last_name": data.get("last_name", ""),
                    "age": data.get("age"),
                    "gender": data.get("gender"),
                    "role": data.get("role"),
                    "is_staff": True,
                })

            CustomUser.objects.create(**user_data)
            logger.info(f"Stored new user: {email}")

        ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        logger.error(f"Error processing stored event: {str(e)}")
        ch.basic_nack(delivery_tag=method.delivery_tag)


class Command(BaseCommand):
    help = "Start RabbitMQ consumer for query service events"

    def handle(self, *args, **options):
        """Start RabbitMQ consumer"""
        connection_params = pika.ConnectionParameters(
            host='rabbitmq',
            port=5672,
            credentials=pika.PlainCredentials('primegrills', 'primegrills'),
            heartbeat=600,
            blocked_connection_timeout=300
        )
        connection = pika.BlockingConnection(connection_params)
        channel = connection.channel()

        # Declare Exchange to Ensure It Exists
        channel.exchange_declare(exchange="processed_auth_events", exchange_type="topic", durable=True)

        # Declare Queue (Durable for Persistence)
        channel.queue_declare(queue="processed_auth_events_queue", durable=True)

        # Bind Queue to Exchange (Using Correct Routing Key)
        channel.queue_bind(exchange="processed_auth_events", queue="processed_auth_events_queue", routing_key="user.*")

        # Start Consuming Messages
        channel.basic_consume(queue="processed_auth_events_queue", on_message_callback=callback, auto_ack=False)
        logger.info("Started query service consumer...")
        
        try:
            channel.start_consuming()
        except KeyboardInterrupt:
            logger.info("Stopping consumer...")
            channel.stop_consuming()
        finally:
            connection.close()
