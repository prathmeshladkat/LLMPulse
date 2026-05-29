import { ChatMessage } from '../types';
export declare class GoogleProvider {
    readonly defaultModel = "gemini-2.0-flash";
    constructor(apiKey?: string);
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
