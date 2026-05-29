import asyncio
import json
import os
from aiokafka import AIOKafkaConsumer
from dotenv import load_dotenv

load_dotenv()

# DLQ handler — reads failed events and logs them
# In production you would: alert on Slack, save to dead_letters table, retry logic
async def start_dlq_handler():
    consumer = AIOKafkaConsumer(
        "inference-logs-dlq",
        bootstrap_servers=os.getenv("KAFKA_BROKER", "localhost:9092"),
        group_id="dlq-handler-group",
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        auto_offset_reset="earliest"
    )

    await consumer.start()
    print("[DLQ] Handler started, waiting for failed events...")

    try:
        async for message in consumer:
            failed_event = message.value
            # In production: send Slack alert, save to DB, retry
            print(f"[DLQ] Failed event received: {failed_event}")

    except Exception as e:
        print(f"[DLQ] Error: {e}")
    finally:
        await consumer.stop()
        print("[DLQ] Handler stopped")

if __name__ == "__main__":
    asyncio.run(start_dlq_handler())