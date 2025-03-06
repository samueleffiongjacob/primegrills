
"""
import pika
import json

RABBITMQ_HOST = "rabbitmq"

def send_image_to_file_manager(category_name, image_url):
    # Send image data to RabbitMQ for File Manager. 
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
    channel = connection.channel()
    channel.queue_declare(queue="image_upload_queue", durable=True)

    message = {
        "category_name": category_name,
        "image_url": image_url,
    }

    channel.basic_publish(
        exchange="",
        routing_key="image_upload_queue",
        body=json.dumps(message),
        properties=pika.BasicProperties(delivery_mode=2),
    )

    connection.close()
"""