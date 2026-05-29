import asyncio
import json
import os
from aiokafka import AIOKafkaConsumer
from enricher import enrich
from dotenv import load_dotenv

load_dotenv()

async def start_consumer():
    consumer = AIOKafkaConsumer(
        "inference-logs",
        bootstrap_servers=os.getenv("KAFKA_BROKER", "localhost:9092"),
        group_id="metadata-extractor-group",
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        # Start from beginning if this consumer hasn't run before
        auto_offset_reset="earliest"
    )

    await consumer.start()
    print("[MetadataExtractor] Consumer started, waiting for events...")

    try:
        async for message in consumer:
            log = message.value
            print(f"[MetadataExtractor] Received event: {log['id']}")

            # Enrich and print — in production save to analytics table
            enriched = enrich(log)
            print(f"[MetadataExtractor] Enriched: {enriched}")

    except Exception as e:
        print(f"[MetadataExtractor] Error: {e}")
    finally:
        await consumer.stop()
        print("[MetadataExtractor] Consumer stopped")

if __name__ == "__main__":
    asyncio.run(start_consumer())