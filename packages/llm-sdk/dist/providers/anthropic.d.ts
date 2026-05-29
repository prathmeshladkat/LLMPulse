import { ChatMessage } from "../types";
export declare class AnthropicProvider {
    private client;
    readonly defaultModel = "claude-sonnet-4-20250514";
    constructor(apiKey: string);
    chat(messages: ChatMessage[], model: string): Promise<{
        content: string;
        inputTokens: number;
        outputTokens: number;
    }>;
    stream(messages: ChatMessage[], model: string, onChunk: (chunk: string) => void): Promise<{
        content: string;
        inputTokens: number;
        outputTokens: number;
    }>;
}
