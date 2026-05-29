"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultModel = void 0;
exports.chatOpenAI = chatOpenAI;
exports.streamOpenAI = streamOpenAI;
const openai_1 = __importDefault(require("openai"));
const client = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY || '' });
exports.defaultModel = 'gpt-4.1';
async function chatOpenAI(messages, model) {
    const response = await client.chat.completions.create({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
    });
    return {
        content: response.choices[0].message.content || '',
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
    };
}
async function streamOpenAI(messages, model, onChunk) {
    let fullContent = '';
    let inputTokens = 0;
    let outputTokens = 0;
    const stream = await client.chat.completions.create({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
        stream_options: { include_usage: true }
    });
    for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
            fullContent += text;
            onChunk(text);
        }
        // OpenAI sends usage in the last chunk only
        if (chunk.usage) {
            inputTokens = chunk.usage.prompt_tokens;
            outputTokens = chunk.usage.completion_tokens;
        }
    }
    return { content: fullContent, inputTokens, outputTokens };
}
