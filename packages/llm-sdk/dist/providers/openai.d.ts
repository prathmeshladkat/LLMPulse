import { ChatMessage } from '../types';
export declare const defaultModel = "gpt-4.1";
export declare function chatOpenAI(messages: ChatMessage[], model: string): Promise<{
    content: string;
    inputTokens: number;
    outputTokens: number;
}>;
export declare function streamOpenAI(messages: ChatMessage[], model: string, onChunk: (chunk: string) => void): Promise<{
    content: string;
    inputTokens: number;
    outputTokens: number;
}>;
