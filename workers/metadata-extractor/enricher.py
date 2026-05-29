# Latest pricing as of 2026 (per 1000 tokens in USD)
COST_PER_1K_TOKENS = {
    "openai": {
        "gpt-4.1":         { "input": 0.002,  "output": 0.008 },
        "gpt-4o":          { "input": 0.0025, "output": 0.010 },
        "gpt-4o-mini":     { "input": 0.00015,"output": 0.0006 },
        "gpt-3.5-turbo":   { "input": 0.0005, "output": 0.0015 },
        "default":         { "input": 0.002,  "output": 0.008 },
    },
    "anthropic": {
        "claude-sonnet-4-20250514":    { "input": 0.003,  "output": 0.015 },
        "claude-haiku-4-5-20251001":   { "input": 0.00025,"output": 0.00125 },
        "default":                     { "input": 0.003,  "output": 0.015 },
    },
    "google": {
        "gemini-2.0-flash": { "input": 0.00010, "output": 0.00040 },
        "gemini-1.5-pro":   { "input": 0.00125, "output": 0.00500 },
        "default":          { "input": 0.00010, "output": 0.00040 },
    }
}

def calculate_cost(provider: str, model: str, input_tokens: int, output_tokens: int) -> float:
    provider_pricing = COST_PER_1K_TOKENS.get(provider, {})
    # Try exact model match first, then fall back to default
    pricing = provider_pricing.get(model) or provider_pricing.get("default") or { "input": 0.002, "output": 0.008 }
    input_cost  = (input_tokens  / 1000) * pricing["input"]
    output_cost = (output_tokens / 1000) * pricing["output"]
    return round(input_cost + output_cost, 8)

def calculate_tokens_per_second(output_tokens: int, latency_ms: int) -> float:
    if latency_ms == 0:
        return 0
    return round(output_tokens / (latency_ms / 1000), 2)

def classify_latency(latency_ms: int) -> str:
    if latency_ms < 1000:  return "fast"
    elif latency_ms < 3000: return "normal"
    else:                   return "slow"

def enrich(log: dict) -> dict:
    input_tokens  = log.get("inputTokens",  0)
    output_tokens = log.get("outputTokens", 0)
    latency_ms    = log.get("latencyMs",    0)
    provider      = log.get("provider",     "openai")
    model         = log.get("model",        "")

    cost = calculate_cost(provider, model, input_tokens, output_tokens)

    return {
        **log,
        "costUsd":         cost,
        "tokensPerSecond": calculate_tokens_per_second(output_tokens, latency_ms),
        "latencyBucket":   classify_latency(latency_ms),
        "totalTokens":     input_tokens + output_tokens,
    }