"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Outbox = void 0;
const axios_1 = __importDefault(require("axios"));
class Outbox {
    constructor(ingestionUrl, flushIntervalMs = 2000) {
        this.ingestionUrl = ingestionUrl;
        this.flushIntervalMs = flushIntervalMs;
        this.queue = [];
        this.timer = null;
    }
    start() {
        this.timer = setInterval(() => this.flush(), this.flushIntervalMs);
        console.log(`[Outbox] Started - flushing every ${this.flushIntervalMs}ms`);
    }
    async stop() {
        if (this.timer)
            clearInterval(this.timer);
        await this.flush();
        console.log('[Outbocx] Stopped');
    }
    push(log) {
        this.queue.push(log);
    }
    async flush() {
        if (this.queue.length === 0)
            return;
        // Take everything out of queue atomically
        const batch = this.queue.splice(0, this.queue.length);
        try {
            await axios_1.default.post(`${this.ingestionUrl}/logs/batch`, { logs: batch });
            console.log(`[Outbox] Flushed ${batch.length} log(s)`);
        }
        catch (err) {
            // Put logs back - they will retry on next flush
            console.error('[Outbox] Flush failed, re-queuing:', err);
            this.queue.unshift(...batch);
        }
    }
}
exports.Outbox = Outbox;
