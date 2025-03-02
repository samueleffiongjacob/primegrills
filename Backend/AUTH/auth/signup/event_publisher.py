# AUTH/auth/signup/event_publisher.py
import pika
import json
import datetime
import threading
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class EventPublisher:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(EventPublisher, cls).__new__(cls)
                cls._instance.connection = None
                cls._instance.channel = None
                cls._instance.connect()
            return cls._instance
    
    def connect(self):
        """Establish connection to RabbitMQ"""
        print('connecting')
        try:
            # Get RabbitMQ connection parameters from settings or use defaults
            rabbitmq_host = 'localhost'
            rabbitmq_port = 5672
            rabbitmq_user = 'primegrills'
            rabbitmq_pass = 'primegrills'
            
            credentials = pika.PlainCredentials(rabbitmq_user, rabbitmq_pass)
            parameters = pika.ConnectionParameters(
                host=rabbitmq_host,
                port=rabbitmq_port,
                credentials=credentials,
                heartbeat=600,
                blocked_connection_timeout=300
            )
            
            self.connection = pika.BlockingConnection(parameters)
            self.channel = self.connection.channel()
            
            # Declare the exchange
            self.channel.exchange_declare(
                exchange='auth_events',
                exchange_type='topic',
                durable=True
            )
            
            logger.info("Connected to RabbitMQ successfully")
        except Exception as e:
            logger.error(f"Failed to connect to RabbitMQ: {str(e)}")
            self.connection = None
            self.channel = None
    
    def publish_event(self, event_type, event_data):
        """Publish an event to RabbitMQ"""
        print('publishing event')
        if not self.connection or self.connection.is_closed:
            self.connect()
            
        if not self.connection:
            logger.error("Cannot publish event: No RabbitMQ connection")
            return False
            
        try:
            # Create message
            message = {
                'type': event_type,
                'data': event_data,
                'timestamp': datetime.datetime.now().isoformat()
            }
            
            # Publish message
            self.channel.basic_publish(
                exchange='auth_events',
                routing_key=event_type,  # Use event type as routing key
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    delivery_mode=2,  # make message persistent
                    content_type='application/json'
                )
            )
            
            logger.info(f"Published event: {event_type}")
            return True
        except Exception as e:
            logger.error(f"Failed to publish event: {str(e)}")
            # Try to reconnect for next time
            try:
                self.connect()
            except:
                pass
            return False

# Singleton instance
def get_publisher():
    return EventPublisher()