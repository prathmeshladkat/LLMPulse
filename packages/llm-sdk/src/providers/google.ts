import { ChatMessage } from '../types'

// Stubbed - same pattern as openai.ts
export class GoogleProvider {
  readonly defaultModel = 'gemini-2.0-flash'

  constructor(apiKey?: string) {
    if (!apiKey) {
      console.warn('[SDK] Google key not set - provider stubbed')
    }
  }

  async chat(messages: ChatMessage[], model: string) {
    return {
      content: `[Google/${model}] Add GOOGLE_API_KEY to enable this provider.`,
      inputTokens: 0,
      outputTokens: 0
    }
  }

  async stream(messages: ChatMessage[], model: string, onChunk: (chunk: string) => void) {
    const result = await this.chat(messages, model)
    onChunk(result.content)
    return result
  }
}