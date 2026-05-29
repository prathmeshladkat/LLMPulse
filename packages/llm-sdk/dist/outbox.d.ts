import { InferenceLog } from "./types";
export declare class Outbox {
    private ingestionUrl;
    private flushIntervalMs;
    private queue;
    private timer;
    constructor(ingestionUrl: string, flushIntervalMs?: number);
    start(): void;
    stop(): Promise<void>;
    push(log: InferenceLog): void;
    private flush;
}
