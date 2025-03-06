"""
 this below from file_manager/services/rabbitmq_consumer.py (No longer needed)


 File Manager now only accepts direct API calls from the `event` microservice.
"""

"""
import pika
import json
import requests

RABBITMQ_URL = "amqp://guest:guest@rabbitmq:5672/"
UPLOAD_API_URL = "http://filemanager:8000/files/upload/"

def callback(ch, method, properties, body):
    message = json.loads(body)
    image_url = message.get("image_url")
    files = {"file": requests.get(image_url).content}
    response = requests.post(UPLOAD_API_URL, files=files)
    if response.status_code == 201:
        print(f"Image stored successfully: {image_url}")
    ch.basic_ack(delivery_tag=method.delivery_tag)

def consume_images():
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    channel.queue_declare(queue="image_uploads")
    channel.basic_consume(queue="image_uploads", on_message_callback=callback)
    print("Waiting for image messages...")
    channel.start_consuming()
"""

