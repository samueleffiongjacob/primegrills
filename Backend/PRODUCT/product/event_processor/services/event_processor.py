import pika
import json
import logging

logger = logging.getLogger(__name__)

def process_event(event_type, event_data):
    """Process events and forward relevant data to the Query Service"""
    try:
        if event_type in ["UserSignedUp", "StaffSignedUp", "CustomerSignedUp", "menu_created", "menu_updated"]:
            send_to_query_service(event_type, event_data)
        else:
            logger.warning(f"Unhandled event type: {event_type}")
    except Exception as e:
        logger.error(f"Error processing event: {str(e)}")

def send_to_query_service(event_type, event_data):
    """Send event data to the Query Service via RabbitMQ"""
    try:
        connection_params = pika.ConnectionParameters(
            host='rabbitmq',
            port=5672,
            credentials=pika.PlainCredentials('primegrills', 'primegrills'),
            heartbeat=600,
            blocked_connection_timeout=300
        )
        connection = pika.BlockingConnection(connection_params)
        channel = connection.channel()

        # Declare exchange
        channel.exchange_declare(exchange="processed_auth_events", exchange_type="topic", durable=True)

        # Publish processed event data
        message = json.dumps({"type": event_type, "data": event_data})
        channel.basic_publish(
            exchange="processed_auth_events",
            routing_key=event_type,
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2,  # Persistent message
                content_type="application/json"
            )
        )
        logger.info(f"Forwarded event to Query Service: {event_type}")
        connection.close()
    except Exception as e:
        logger.error(f"Failed to forward event: {str(e)}")
