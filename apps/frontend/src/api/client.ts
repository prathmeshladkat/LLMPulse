import axios from 'axios'
import {
  Conversation,
  Message,
  MetricsSummary,
  LatencyDataPoint,
  ProviderError,
  LogsResponse
} from '../types'

const api = axios.create({
  baseURL: 'http://localhost:3001',
})

export async function getConversations(): Promise<Conversation[]> {
    const res = await api.get('/conversations')
    return res.data
}

export async function getConversation(id: string): Promise<Conversation & { messages: Message[] }> {
  const res = await api.get(`/conversations/${id}`)
  return res.data
}

export async function createConversation(
  provider: string,
  model: string,
  title: string
): Promise<Conversation> {
  const res = await api.post('/conversations', { provider, model, title })
  return res.data
}

export async function cancelConversation(id: string): Promise<Conversation> {
  const res = await api.patch(`/conversations/${id}/cancel`)
  return res.data
}

// Streaming is handled differently — returns a raw fetch response
// so we can read the SSE stream chunk by chunk
export async function sendMessage(
  conversationId: string,
  content: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (err: string) => void
) {
  const response = await fetch(`http://localhost:3001/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })

  const reader  = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    onError('No response body')
    return
  }

  // Read SSE stream chunk by chunk
  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const text  = decoder.decode(value)
    const lines = text.split('\n')

    for (const line of lines) {
      // SSE lines start with "data: "
      if (!line.startsWith('data: ')) continue

      try {
        const json = JSON.parse(line.replace('data: ', ''))

        if (json.chunk) {
          onChunk(json.chunk)
        } else if (json.done) {
          onDone()
        } else if (json.error) {
          onError(json.error)
        }
      } catch {
        // ignore malformed lines
      }
    }
  }
}

// ── Messages ───────────────────────────────────────────────────────────────

export async function getMessages(conversationId: string): Promise<Message[]> {
  const res = await api.get(`/conversations/${conversationId}/messages`)
  return res.data
}

export async function getMetricsSummary(): Promise<MetricsSummary> {
  const res = await api.get('/metrics/summary')
  return res.data
}

export async function getLatencyOverTime(): Promise<LatencyDataPoint[]> {
  const res = await api.get('/metrics/latency')
  return res.data
}

export async function getErrorsByProvider(): Promise<ProviderError[]> {
  const res = await api.get('/metrics/errors')
  return res.data
}

export async function getInferenceLogs(page = 1, limit = 20): Promise<LogsResponse> {
  const res = await api.get(`/metrics/logs?page=${page}&limit=${limit}`)
  return res.data
}