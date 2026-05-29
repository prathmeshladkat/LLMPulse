from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database import connect, disconnect
from app.kafka_producer import start_producer, stop_producer
from app.routes.logs import router as logs_router

# lifespan handles startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # runs on startup
    await connect()
    await start_producer()
    yield
    # runs on shutdown
    await stop_producer()
    await disconnect()

app = FastAPI(
    title="Ingestion API",
    description="Receives and stores LLM inference logs",
    lifespan=lifespan
)

app.include_router(logs_router)

# Health check
@app.get("/health")
async def health():
    return { "status": "ok" }