# LLMpulse

LLMpulse is a full stack LLM observability platform. It lets you chat with any foundation model while automatically capturing inference metadata — latency, token usage, cost, and errors — in real time. Every conversation is logged, PII is redacted, and a dashboard shows you exactly what your AI is doing and what it costs.

This repo is a monorepo with services for the chat API, ingestion pipeline, Kafka workers, and a React front end.

## What this solves

Most teams using LLMs in production have no visibility into what's happening. They don't know which calls are slow, how much each conversation costs, or when errors are silently failing. LLMpulse wraps your LLM calls with a lightweight SDK that captures everything and ships it to an ingestion pipeline — without slowing down your responses.

## Architecture at a glance

```
User → Frontend (React)
           |
           v
      Chat API (Node/Express)
           |
      LLM SDK Wrapper
      [captures latency, tokens, status]
           |
           ├──→ LLM Provider (OpenAI / Claude / Gemini)
           |
           └──→ Outbox Queue (in-memory, flushes every 2s)
                      |
                      v
             Ingestion API (FastAPI)
             [validates, redacts PII, stores]
                      |
                      ├──→ PostgreSQL (inference_logs, messages)
                      |
                      └──→ Kafka Topic: inference-logs
                                   |
                                   ├──→ Metadata Extractor Worker
                                   |    [cost, tokens/sec, latency bucket]
                                   |
                                   └──→ DLQ Handler
                                        [failed events → retry]
```

## Key features

- Multi-turn chatbot with streaming responses via SSE
- Multi-provider support — OpenAI, Claude, Gemini (stubbed)
- Lightweight SDK wrapper with outbox pattern for reliable log delivery
- PII redaction — emails, phones, credit cards masked before storage
- Kafka event-driven pipeline with fan-out consumers
- Dead Letter Queue for failed events
- Dashboard with latency charts, error rates, token usage
- Inference logs table with input/output previews
- Cancel, resume, and list conversations from UI

## Design patterns used

| Pattern | Where | Why |
|---|---|---|
| Outbox | SDK → Ingestion API | Logs queue locally and retry on failure — no lost data if network is down |
| Fan-out | Kafka → Workers | One topic, multiple independent consumers |
| Sidecar | Metadata extractor | Runs alongside ingestion without touching the hot path |
| DLQ | Kafka failed events | Failed messages park safely for inspection and replay |
| Event-driven | All services | Chat API and observability are fully decoupled |

## Services

Apps:
- `apps/chat-api` — Express API for conversations, messages, streaming, metrics
- `apps/ingestion-api` — FastAPI service that receives logs, redacts PII, stores, publishes to Kafka
- `apps/frontend` — React + Tailwind + shadcn UI

Packages:
- `packages/llm-sdk` — TypeScript SDK wrapper around LLM providers

Workers:
- `workers/metadata-extractor` — Kafka consumer that enriches logs with cost and token rate
- `workers/dlq-handler` — Consumes failed events from DLQ topic

## Data model

```
Conversation
  id, title, provider, model, status, created_at, updated_at

Message
  id, conversation_id, role (user|assistant), content, created_at

InferenceLog
  id, conversation_id, message_id
  provider, model
  latency_ms, input_tokens, output_tokens
  status (success|error|cancelled)
  input_preview, output_preview   ← PII redacted
  created_at

PiiAudit
  id, inference_log_id
  pii_types_found (email, phone, credit_card...)
  redaction_count, created_at
```

### Schema decisions

- `inference_logs` is append-only — never updated, only inserted. Keeps query patterns simple and audit-friendly.
- `input_preview` and `output_preview` store only first 200 chars. Full content lives in `messages`. This avoids duplicating large text in logs.
- PII redaction happens in the ingestion layer, not the chat layer. Chat API never touches raw log content — clean separation of concerns.
- `pii_audit` is a separate table, not columns on `inference_logs`. Makes it easy to query "how much PII did we redact today?" without scanning the main logs table.
- UUID primary keys on all tables — safe for distributed inserts from multiple services.

## Tradeoffs made

**Kafka vs Redis Streams** — Kafka was chosen for durability, consumer groups, and DLQ support. Redis Streams would be simpler for local dev but lacks native DLQ. Both are supported — swap `KAFKA_BROKER` for a Redis URL if needed.

**Separate ingestion service** — adds one network hop per log flush but means the chat API never slows down waiting for DB writes. If ingestion is down, the outbox queues logs locally and retries.

**Outbox flush interval of 2 seconds** — good balance between real-time visibility and network overhead. Could go lower (500ms) for near real-time dashboards or higher (10s) to reduce requests.

**Python for ingestion** — better PII detection libraries, cleaner async with FastAPI, natural fit for data processing. Node would work too but the ecosystem for text processing is weaker.

**Preview truncation at 200 chars** — enough context to debug issues without storing large payloads in the logs table. Full message content is always available in the `messages` table.

## What I would improve with more time

- **Prometheus + Grafana** — expose `/metrics` endpoint and build real-time Grafana dashboards for latency percentiles, throughput, and error rates
- **OpenTelemetry** — add distributed tracing so you can see the full trace: `user request → chat-api → LLM call → ingestion → kafka → db`
- **Cost calculator** — token count × price per model = exact dollar/rupee cost per conversation shown in the UI
- **Streaming token count** — OpenAI sends token usage only at the end of a stream. With more time, estimate tokens mid-stream using tiktoken
- **Conversation search** — full text search across message content using Postgres `tsvector`
- **Alert system** — notify on Slack/email when error rate exceeds threshold or latency spikes
- **Auth** — JWT-based auth so multiple users can have their own conversations and dashboards
- **Real OpenAI/Gemini switchover** — currently Gemini is stubbed. Would wire up the real SDK.

## Getting started

### Requirements

- Node 20+
- Python 3.11+
- Docker Desktop (for Postgres + Kafka)

### 1. Clone and install

```sh
git clone https://github.com/your-username/llm-observability
cd llm-observability
```

### 2. Start infrastructure

```sh
docker compose up -d
```

This starts PostgreSQL on port 5432 and Kafka on port 9092.

### 3. Environment variables

`apps/chat-api/.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/llm_obs
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
INGESTION_URL=http://localhost:8000
PORT=3001
```

`apps/ingestion-api/.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/llm_obs
KAFKA_BROKER=localhost:9092
```

### 4. Database setup

```sh
cd apps/chat-api
npm install
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start chat API

```sh
cd apps/chat-api
npm run dev
```

### 6. Start ingestion API

```sh
cd apps/ingestion-api
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

### 7. Start frontend

```sh
cd apps/frontend
npm install
npm run dev
```

### 8. Start workers (optional)

```sh
cd workers/metadata-extractor
python consumer.py
```

Open `http://localhost:5173` in your browser.

## API endpoints

### Chat API (port 3001)

```
GET    /health
GET    /conversations
POST   /conversations
GET    /conversations/:id
PATCH  /conversations/:id/cancel
GET    /conversations/:id/messages
POST   /conversations/:id/messages    ← SSE streaming
GET    /metrics/summary
GET    /metrics/latency
GET    /metrics/errors
GET    /metrics/logs
```

### Ingestion API (port 8000)

```
GET    /health
POST   /logs/batch
```

## Ingestion flow

1. User sends a message to `POST /conversations/:id/messages`
2. Chat API calls the LLM SDK, which calls the provider (OpenAI etc.)
3. Response streams back to the user via SSE
4. SDK records metadata (latency, tokens, status) and pushes to outbox
5. Outbox flushes batch to `POST /logs/batch` every 2 seconds
6. Ingestion API validates payload with Pydantic
7. PII redactor scans input/output previews and masks sensitive data
8. Log is saved to `inference_logs` table in Postgres
9. If PII was found, `pii_audit` row is created
10. Event is published to Kafka `inference-logs` topic
11. Metadata extractor worker consumes event and calculates cost + token rate
12. DLQ handler catches any failed events for retry

## Logging strategy

- Logs are fire-and-forget from the chat API perspective
- The outbox pattern ensures no logs are lost even if ingestion is temporarily down
- PII is redacted at ingestion time — raw user input never hits the logs table
- All logs are append-only — no updates, just inserts

## Failure handling

| Failure | Behaviour |
|---|---|
| Ingestion API down | Outbox queues logs locally, retries on next flush |
| Kafka down | Ingestion API logs warning, skips publish, DB write still succeeds |
| LLM provider error | Error captured in log with status=error, message returned to user |
| Worker crash | Kafka consumer group rebalances, another consumer picks up the message |
| DLQ event | Logged with full payload for manual inspection and replay |

## Project structure

```
llm-observability/
  apps/
    chat-api/
      src/
        db/          ← Prisma client + queries
        routes/      ← conversations, messages, metrics
        middleware/  ← error handler
      prisma/        ← schema + migrations
    ingestion-api/
      app/
        routes/      ← logs endpoint
        models.py    ← Pydantic schemas
        pii_redactor.py
        kafka_producer.py
        database.py
    frontend/
      src/
        api/         ← axios client
        components/  ← chat, dashboard, layout
        pages/       ← LandingPage, ChatPage, DashboardPage
        types/       ← shared TypeScript interfaces
  packages/
    llm-sdk/
      src/
        providers/   ← anthropic, openai, google
        client.ts    ← main chat function
        outbox.ts    ← buffered log queue
        types.ts
  workers/
    metadata-extractor/
    dlq-handler/
  docker-compose.yml
```