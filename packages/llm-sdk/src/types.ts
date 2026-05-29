export type Provider = 'anthropic' | 'openai' | 'google'

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
    role: MessageRole
    content: string
}

// This is what we log for every single LLM call
export interface InferenceLog {
    conversationId: string
    messageId?: string
    provider: Provider
    model: string
    latencyMs: number 
    inputTokens: number
    outputTokens: number
    costUsd?: number
    status: 'success' | 'error' | 'cancelled'
    errorMessage?: string
    inputPreview: string    // first 200 chars of user message
    outputPreview: string   // first 200 chars of LLM response
    timestamp: string
}

export interface ChatOptions {
    conversationId: string
    messages: ChatMessage[]
    provider?: Provider
    model?: string
    stream?: boolean
    onChunk?: (chunk: string) => void

}

// LLM chat returns
export interface ChatResult {
    content: string
    log: InferenceLog
}