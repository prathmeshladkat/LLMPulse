import {Registry, Counter, Histogram, Gauge} from 'prom-client'

export const register = new Registry()

export const llmRequestsTotal = new Counter({
    name: 'llm_requests_total',
    help: 'Total number of LLM API calls',
    labelNames: ['provider', 'model', 'status'],
    registers: [register]
})

export const llmLatencyMs = new Histogram({
    name: 'llm_latency_ms',
    help: 'LLM call latency in millisecond',
    labelNames: ['provider', 'model'],
    buckets: [500, 1000, 2000, 3000, 5000, 10000],
    registers: [register]

})


export const llmTokensTotal = new Counter({
  name: 'llm_tokens_total',
  help: 'Total tokens used',
  labelNames: ['provider', 'model', 'type'],  // type = input | output
  registers: [register]
})

// Cost counter
export const llmCostUsd = new Counter({
  name: 'llm_cost_usd_total',
  help: 'Total cost in USD',
  labelNames: ['provider', 'model'],
  registers: [register]
})

// Error counter
export const llmErrorsTotal = new Counter({
  name: 'llm_errors_total',
  help: 'Total LLM errors',
  labelNames: ['provider', 'model'],
  registers: [register]
})

// Active conversations gauge
export const activeConversations = new Gauge({
  name: 'llm_active_conversations',
  help: 'Number of active conversations',
  registers: [register]
})
