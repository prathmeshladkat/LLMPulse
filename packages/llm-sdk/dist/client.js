"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSDK = startSDK;
exports.stopSDK = stopSDK;
exports.chat = chat;
const anthropic_1 = require("./providers/anthropic");
const openai_1 = require("./providers/openai");
const google_1 = require("./providers/google");
const outbox_1 = require("./outbox");
const anthropic = new anthropic_1.AnthropicProvider(process.env.ANTHROPIC_API_KEY || '');
const google = new google_1.GoogleProvider(process.env.GOOGLE_API_KEY);
const outbox = new outbox_1.Outbox(process.env.INGESTION_URL || 'http://localhost:8000', 2000);
function startSDK() {
    outbox.start();
}
async function stopSDK() {
    await outbox.stop();
}
async function chat(options) {
    const providerName = options.provider || 'openai';
    const startTime = Date.now();
    // Pick default model based on provider
    const defaultModels = {
        anthropic: anthropic.defaultModel,
        openai: openai_1.defaultModel,
        google: google.defaultModel,
    };
    const model = options.model || defaultModels[providerName];
    const lastUserMsg = [...options.messages].reverse().find(m => m.role === 'user');
    const inputPreview = (lastUserMsg?.content || '').slice(0, 200);
    let content = '';
    let inputTokens = 0;
    let outputTokens = 0;
    let status = 'success';
    let errorMessage;
    try {
        if (providerName === 'openai') {
            // OpenAI — plain functions
            if (options.stream && options.onChunk) {
                const result = await (0, openai_1.streamOpenAI)(options.messages, model, options.onChunk);
                content = result.content;
                inputTokens = result.inputTokens;
                outputTokens = result.outputTokens;
            }
            else {
                const result = await (0, openai_1.chatOpenAI)(options.messages, model);
                content = result.content;
                inputTokens = result.inputTokens;
                outputTokens = result.outputTokens;
            }
        }
        else if (providerName === 'anthropic') {
            // Anthropic — still class based
            if (options.stream && options.onChunk) {
                const result = await anthropic.stream(options.messages, model, options.onChunk);
                content = result.content;
                inputTokens = result.inputTokens;
                outputTokens = result.outputTokens;
            }
            else {
                const result = await anthropic.chat(options.messages, model);
                content = result.content;
                inputTokens = result.inputTokens;
                outputTokens = result.outputTokens;
            }
        }
        else {
            // Google stub
            const result = await google.chat(options.messages, model);
            content = result.content;
            inputTokens = result.inputTokens;
            outputTokens = result.outputTokens;
        }
    }
    catch (err) {
        status = 'error';
        errorMessage = err.message || 'Unknown error';
    }
    const log = {
        conversationId: options.conversationId,
        provider: providerName,
        model,
        latencyMs: Date.now() - startTime,
        inputTokens,
        outputTokens,
        costUsd: calculateCost(model, inputTokens, outputTokens),
        status,
        errorMessage,
        inputPreview,
        outputPreview: content.slice(0, 200),
        timestamp: new Date().toISOString(),
    };
    outbox.push(log);
    if (status === 'error')
        throw new Error(errorMessage);
    return { content, log };
}
// Cost per 1k tokens
const COST_PER_1K = {
    'gpt-4.1': { input: 0.002, output: 0.008 },
    'gpt-4o': { input: 0.0025, output: 0.010 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'claude-sonnet-4-20250514': { input: 0.003, output: 0.015 },
    'gemini-2.0-flash': { input: 0.00010, output: 0.00040 },
};
function calculateCost(model, inputTokens, outputTokens) {
    const pricing = COST_PER_1K[model] || { input: 0.002, output: 0.008 };
    return ((inputTokens / 1000) * pricing.input) + ((outputTokens / 1000) * pricing.output);
}
