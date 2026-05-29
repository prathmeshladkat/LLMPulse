from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# This must match exactly what the SDK sends in outbox.ts
class InferenceLog(BaseModel):
    conversationId: str
    messageId: Optional[str] = None
    provider: str
    model: str
    latencyMs: int
    inputTokens: int
    outputTokens: int
    status: str
    errorMessage: Optional[str] = None
    inputPreview: Optional[str] = None
    outputPreview: Optional[str] = None
    timestamp: str

# SDK sends logs in batches
class LogBatch(BaseModel):
    logs: list[InferenceLog]