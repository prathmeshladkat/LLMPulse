"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicProvider = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
class AnthropicProvider {
    constructor(apiKey) {
        this.defaultModel = 'claude-sonnet-4-20250514';
        this.client = new sdk_1.default({ apiKey });
    }
    async chat(messages, model) {
        const response = await this.client.messages.create({
            model,
            max_tokens: 1024,
            messages: messages.map(m => ({ role: m.role, content: m.content }))
        });
        const content = response.content[0].type == 'text' ? response.content[0].text : '';
        return {
            content,
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens
        };
    }
    async stream(messages, model, onChunk) {
        let fullContent = '';
        const stream = this.client.messages.stream({
            model,
            max_tokens: 1024,
            messages: messages.map(m => ({ role: m.role, content: m.content }))
        });
        stream.on('text', (text) => {
            fullContent += text;
            onChunk(text);
        });
        const final = await stream.finalMessage();
        return {
            content: fullContent,
            inputTokens: final.usage.input_tokens,
            outputTokens: final.usage.output_tokens
        };
    }
}
exports.AnthropicProvider = AnthropicProvider;
