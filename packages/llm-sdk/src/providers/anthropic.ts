import Anthropic from "@anthropic-ai/sdk";
import { ChatMessage } from "../types";

export class AnthropicProvider {
    private client: Anthropic
    readonly defaultModel = 'claude-sonnet-4-20250514'

    constructor(apiKey: string){
        this.client = new Anthropic({apiKey})
    }

    async chat(messages: ChatMessage[], model: string){
        const response = await this.client.messages.create({
            model,
            max_tokens: 1024,
            messages: messages.map(m => ({ role: m.role, content: m.content }))
        })

        const content = response.content[0].type == 'text'? response.content[0].text : ''

        return {
          content,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens
        }
    }

    async stream(messages: ChatMessage[], model: string, onChunk: (chunk: string) => void) {
         let fullContent = ''

         const stream = this.client.messages.stream({
           model,
           max_tokens: 1024,
           messages: messages.map(m => ({ role: m.role, content: m.content }))
         })
     
         stream.on('text', (text) => {
           fullContent += text
           onChunk(text)
         })
     
         const final = await stream.finalMessage()
     
         return {
           content: fullContent,
           inputTokens: final.usage.input_tokens,
           outputTokens: final.usage.output_tokens
         }
    }
}