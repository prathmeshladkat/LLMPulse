"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleProvider = void 0;
// Stubbed - same pattern as openai.ts
class GoogleProvider {
    constructor(apiKey) {
        this.defaultModel = 'gemini-2.0-flash';
        if (!apiKey) {
            console.warn('[SDK] Google key not set - provider stubbed');
        }
    }
    async chat(messages, model) {
        return {
            content: `[Google/${model}] Add GOOGLE_API_KEY to enable this provider.`,
            inputTokens: 0,
            outputTokens: 0
        };
    }
    async stream(messages, model, onChunk) {
        const result = await this.chat(messages, model);
        onChunk(result.content);
        return result;
    }
}
exports.GoogleProvider = GoogleProvider;
