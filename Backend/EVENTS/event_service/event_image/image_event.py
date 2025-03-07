import pika
import json
import requests
from django.conf import settings

RABBITMQ_URL = settings.RABBITMQ_URL
FILE_MANAGER_UPLOAD_URL = settings.FILE_MANAGER_UPLOAD_URL

def process_image_event(ch, method, properties, body):
    """Process image events received from RabbitMQ."""
    try:
        message = json.loads(body)
        image_url = message.get("image_url")

        if image_url:
            print(f"Received image event: {image_url}")

            # Fetch the image and send it to file_manager
            response = requests.get(image_url)
            if response.status_code == 200:
                files = {"file": response.content}
                upload_response = requests.post(FILE_MANAGER_UPLOAD_URL, files=files)

                if upload_response.status_code == 201:
                    print(f"Image successfully stored in File Manager: {image_url}")
                else:
                    print(f"Failed to store image in File Manager: {upload_response.text}")
            else:
                print(f"Failed to download image: {image_url}")

    except Exception as e:
        print(f"Error processing image event: {e}")

    ch.basic_ack(delivery_tag=method.delivery_tag)

def consume_image_events():
    """Starts consuming image events from RabbitMQ."""
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    channel.queue_declare(queue="image_uploads")
    channel.basic_consume(queue="image_uploads", on_message_callback=process_image_event)
    print("Event service listening for image events...")
    channel.start_consuming()
