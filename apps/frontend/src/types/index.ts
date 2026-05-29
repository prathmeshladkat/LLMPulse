export interface Conversation{
    id: string
    title: string
    provider: string
    model: string
    status: 'active' | 'cancelled' | 'completed'
    createdAt: string
    updatedAt: string

}

export interface Message {
    id: string
    conversationId: string
    role: 'user' | 'assistant'
    content: string
    createdAt: string
}

export interface InferenceLog {
  id: string
  conversationId: string | null
  messageId: string | null
  provider: string
  model: string
  latencyMs: number
  inputTokens: number
  outputTokens: number
  costUsd: number | null    // ← add this
  status: 'success' | 'error' | 'cancelled'
  errorMessage: string | null
  inputPreview: string | null
  outputPreview: string | null
  createdAt: string
  piiAudit?: PiiAudit | null
}

export interface PiiAudit {
  id: string
  inferenceLogId: string
  piiTypesFound: string[]
  redactionCount: number
  createdAt: string
}


export interface MetricsSummary {
  total_requests: number
  avg_latency_ms: number
  max_latency_ms: number
  total_tokens: number
  total_cost_usd: number
  error_count: number
}


export interface LatencyDataPoint {
  hour: string
  avg_latency_ms: number
  request_count: number
}


export interface ProviderError {
  provider: string
  errors: number
  total: number
}

// Paginated logs response
export interface LogsResponse {
  logs: InferenceLog[]
  total: number
  page: number
  limit: number
}