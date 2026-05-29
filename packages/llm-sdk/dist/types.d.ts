export type Provider = 'anthropic' | 'openai' | 'google';
export type MessageRole = 'user' | 'assistant';
export interface ChatMessage {
    role: MessageRole;
    content: string;
}
export interface InferenceLog {
    conversationId: string;
    messageId?: string;
    provider: Provider;
    model: string;
    latencyMs: number;
    inputTokens: number;
    outputTokens: number;
    costUsd?: number;
    status: 'success' | 'error' | 'cancelled';
    errorMessage?: string;
    inputPreview: string;
    outputPreview: string;
    timestamp: string;
}
export interface ChatOptions {
    conversationId: string;
    messages: ChatMessage[];
    provider?: Provider;
    model?: string;
    stream?: boolean;
    onChunk?: (chunk: string) => void;
}
export interface ChatResult {
    content: string;
    log: InferenceLog;
}
