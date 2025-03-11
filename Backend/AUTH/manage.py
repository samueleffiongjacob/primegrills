# import pika

# credentials = pika.PlainCredentials("primegrills", "primegrills")
# parameters = pika.ConnectionParameters(host="rabbitmq", port=5672, credentials=credentials)

# try:
#     connection = pika.BlockingConnection(parameters)
#     print("RabbitMQ connection successful!")
#     connection.close()
# except Exception as e:
#     print(f"RabbitMQ connection failed: {e}")

# import pika

# try:
#     connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
#     channel = connection.channel()
#     print("✅ Connected to RabbitMQ successfully!")
#     connection.close()
# except Exception as e:
#     print("❌ Failed to connect:", e)

# import pika
# import time

# connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
# channel = connection.channel()
# print("✅ Connected to RabbitMQ. Keeping connection open...")

# try:
#     time.sleep(60)  # Keep connection open for 1 minute
# except KeyboardInterrupt:
#     print("\nClosing connection.")
#     connection.close()

import pika

credentials = pika.PlainCredentials('primegrills', 'primegrills')
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', credentials=credentials))
channel = connection.channel()
print("✅ primegrills connected to RabbitMQ via AMQP")
input("Press Enter to exit...")  # Keep the connection open
connection.close()
