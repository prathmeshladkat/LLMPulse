from aiokafka import AIOKafkaProducer
import json
import os

producer = None

async def start_producer():
    global producer
    try:
        producer = AIOKafkaProducer(
            bootstrap_servers=os.getenv("KAFKA_BROKER", "localhost:9092"),
            value_serializer=lambda v: json.dumps(v).encode("utf-8")
        )
        await producer.start()
        print("[Kafka] Producer started")
    except Exception as e:
        # Kafka is optional — app still works without it
        print(f"[Kafka] Could not connect, running without Kafka: {e}")
        producer = None

async def stop_producer():
    global producer
    if producer:
        await producer.stop()
        print("[Kafka] Producer stopped")

async def publish(topic: str, message: dict):
    global producer
    if not producer:
        print("[Kafka] Skipping publish - Kafka not connected")
        return
    try:
        await producer.send_and_wait(topic, message)
        print(f"[Kafka] Published to topic: {topic}")
    except Exception as e:
        print(f"[Kafka] Failed to publish: {e}")