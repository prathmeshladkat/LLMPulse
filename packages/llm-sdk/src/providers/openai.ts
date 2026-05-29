import { ChatMessage } from '../types'
import OpenAI from 'openai'

const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY || ''})

export const defaultModel = 'gpt-4.1'

export async function chatOpenAI(messages: ChatMessage[], model:string){
  const response = await client.chat.completions.create({
    model,
    messages: messages.map(m => ({ role: m.role, content: m.content}))
  })

  return {
    content:      response.choices[0].message.content || '',
    inputTokens:  response.usage?.prompt_tokens     || 0,
    outputTokens: response.usage?.completion_tokens || 0,

  }

}

export async function streamOpenAI(messages: ChatMessage[], model: string, onChunk: (chunk: string) => void){
  let fullContent  = ''
  let inputTokens  = 0
  let outputTokens = 0

  const stream = await client.chat.completions.create({
    model,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    stream: true,
    stream_options: { include_usage: true }
  })

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || ''
    if (text) {
      fullContent += text
      onChunk(text)
    }
    // OpenAI sends usage in the last chunk only
    if (chunk.usage) {
      inputTokens  = chunk.usage.prompt_tokens
      outputTokens = chunk.usage.completion_tokens
    }
  }

  return { content: fullContent, inputTokens, outputTokens }

}


