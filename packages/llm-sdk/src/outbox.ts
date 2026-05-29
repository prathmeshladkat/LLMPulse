import axios from "axios";
import { InferenceLog } from "./types";

export class Outbox {
    private queue: InferenceLog[] = []
    private timer: NodeJS.Timeout | null = null 

    constructor(
        private ingestionUrl: string,
        private flushIntervalMs = 2000
    ) {}

    start() {
        this.timer = setInterval(() => this.flush(), this.flushIntervalMs)
        console.log(`[Outbox] Started - flushing every ${this.flushIntervalMs}ms`)
    }

    async stop() {
        if (this.timer) clearInterval(this.timer)
        await this.flush()
        console.log('[Outbocx] Stopped')
    }

    push(log: InferenceLog) {
    this.queue.push(log)
  }

  private async flush() {
    if (this.queue.length === 0) return

    // Take everything out of queue atomically
    const batch = this.queue.splice(0, this.queue.length)

    try {
      await axios.post(`${this.ingestionUrl}/logs/batch`, { logs: batch })
      console.log(`[Outbox] Flushed ${batch.length} log(s)`)
    } catch (err) {
      // Put logs back - they will retry on next flush
      console.error('[Outbox] Flush failed, re-queuing:', err)
      this.queue.unshift(...batch)
    }
  }


}