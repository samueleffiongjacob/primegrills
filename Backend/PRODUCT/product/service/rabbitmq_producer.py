import pika
import json

RABBITMQ_URL = "amqp://guest:guest@rabbitmq:5672/"

def send_image_to_file_manager(image_url):
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    channel.queue_declare(queue="image_uploads")
    
    message = json.dumps({"image_url": image_url})
    channel.basic_publish(exchange="", routing_key="image_uploads", body=message)
    
    connection.close()
