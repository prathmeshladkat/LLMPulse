from fastapi import APIRouter, HTTPException
from app.models import LogBatch
from app.database import get_pool
from app.pii_redactor import redact
from app.kafka_producer import publish

import uuid

router = APIRouter()

# Cost per 1k tokens — same as enricher
COST_PER_1K_TOKENS = {
    "openai": {
        "gpt-4.1":       { "input": 0.002,   "output": 0.008 },
        "gpt-4o":        { "input": 0.0025,  "output": 0.010 },
        "gpt-4o-mini":   { "input": 0.00015, "output": 0.0006 },
        "gpt-3.5-turbo": { "input": 0.0005,  "output": 0.0015 },
        "default":       { "input": 0.002,   "output": 0.008 },
    },
    "anthropic": {
        "claude-sonnet-4-20250514":  { "input": 0.003,   "output": 0.015 },
        "claude-haiku-4-5-20251001": { "input": 0.00025, "output": 0.00125 },
        "default":                   { "input": 0.003,   "output": 0.015 },
    },
    "google": {
        "gemini-2.0-flash": { "input": 0.00010, "output": 0.00040 },
        "gemini-1.5-pro":   { "input": 0.00125, "output": 0.00500 },
        "default":          { "input": 0.00010, "output": 0.00040 },
    }
}

def calculate_cost(provider: str, model: str, input_tokens: int, output_tokens: int) -> float:
    provider_pricing = COST_PER_1K_TOKENS.get(provider, {})
    pricing = provider_pricing.get(model) or provider_pricing.get("default") or { "input": 0.002, "output": 0.008 }
    input_cost  = (input_tokens  / 1000) * pricing["input"]
    output_cost = (output_tokens / 1000) * pricing["output"]
    return round(input_cost + output_cost, 8)

@router.post("/logs/batch")
async def receive_logs(batch: LogBatch):
    pool = get_pool()
    if not pool:
        raise HTTPException(status_code=503, detail="Database not ready")

    saved_count = 0

    for log in batch.logs:
        # Step 1 — redact PII
        input_result  = redact(log.inputPreview  or "")
        output_result = redact(log.outputPreview or "")

        # Step 2 — calculate cost
        cost = calculate_cost(
            log.provider,
            log.model,
            log.inputTokens,
            log.outputTokens
        )

        print(f"[Cost] provider={log.provider} model={log.model} input={log.inputTokens} output={log.outputTokens} cost={cost}")

        # Step 3 — save to DB
        async with pool.acquire() as conn:
            log_id = str(uuid.uuid4())
            row = await conn.fetchrow("""
                INSERT INTO inference_logs (
                    id, conversation_id, message_id,
                    provider, model,
                    latency_ms, input_tokens, output_tokens,
                    status, error_message,
                    input_preview, output_preview,
                    cost_usd
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
                RETURNING id
            """,
                log_id,
                log.conversationId,
                log.messageId,
                log.provider,
                log.model,
                log.latencyMs,
                log.inputTokens,
                log.outputTokens,
                log.status,
                log.errorMessage,
                input_result.redacted_text,
                output_result.redacted_text,
                cost
            )

            # Step 4 — save PII audit if needed
            all_pii_types    = list(set(input_result.pii_types_found + output_result.pii_types_found))
            total_redactions = input_result.redaction_count + output_result.redaction_count

            if total_redactions > 0:
                await conn.execute("""
                    INSERT INTO pii_audit (
                        id, inference_log_id,
                        pii_types_found, redaction_count
                    ) VALUES ($1,$2,$3,$4)
                """,
                    str(uuid.uuid4()),
                    str(row["id"]),
                    all_pii_types,
                    total_redactions
                )

        # Step 5 — publish to Kafka
        await publish("inference-logs", {
            "id":             str(row["id"]),
            "conversationId": log.conversationId,
            "provider":       log.provider,
            "model":          log.model,
            "latencyMs":      log.latencyMs,
            "inputTokens":    log.inputTokens,
            "outputTokens":   log.outputTokens,
            "status":         log.status,
            "costUsd":        cost,
            "timestamp":      log.timestamp,
        })

        saved_count += 1

    return { "saved": saved_count }