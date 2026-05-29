import { Router, Request, Response } from 'express'
import { chat, startSDK } from '@llm-obs/sdk'
import {
  getConversationById,
  getMessagesByConversation,
  saveMessage,
  saveInferenceLog,
} from '../db/queries'
import {
  llmRequestsTotal,
  llmLatencyMs,
  llmTokensTotal,
  llmCostUsd,
  llmErrorsTotal
} from '../metrics/prometheus'

const router = Router()

// Start the SDK outbox when this file loads
startSDK()

// POST /conversations/:id/messages — send a message, stream the response
router.post('/:id/messages', async (req: Request<{ id: string }>, res: Response) => {
  const { content, provider, model } = req.body
  const conversationId = req.params.id

  if (!content?.trim()) {
    res.status(400).json({ error: 'Message content is required' })
    return
  }

  const conversation = await getConversationById(conversationId)
  if (!conversation) {
    res.status(404).json({ error: 'Conversation not found' })
    return
  }
  if (conversation.status !== 'active') {
    res.status(400).json({ error: 'Cannot send messages to a cancelled conversation' })
    return
  }

  // Save user message to DB
  const userMessage = await saveMessage(conversationId, 'user', content)

  

  // Get full history so LLM has context
  const history = await getMessagesByConversation(conversationId)
  const messages = history.map((m: any) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content
  }))

  // Set SSE headers — this keeps the connection open and streams text chunks
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  let fullResponse = ''

  try {
    const result = await chat({
      conversationId,
      messages,
      provider: provider || conversation.provider as any,
      model:    model    || conversation.model,
      stream:   true,
      // Each chunk gets sent to frontend as an SSE event
      onChunk: (chunk: string) => {
        fullResponse += chunk
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`)
      }
    })

    // Save assistant response to DB
    const assistantMessage = await saveMessage(conversationId, 'assistant', fullResponse)

    // Save inference log to DB
    await saveInferenceLog({
      conversationId,
      messageId:    assistantMessage.id,
      provider:     result.log.provider,
      model:        result.log.model,
      latencyMs:    result.log.latencyMs,
      inputTokens:  result.log.inputTokens,
      outputTokens: result.log.outputTokens,
      status:       result.log.status,
      inputPreview:  result.log.inputPreview,
      outputPreview: result.log.outputPreview,
    })

    // Record metrics for Prometheus
    llmRequestsTotal.inc({
      provider: result.log.provider,
      model:    result.log.model,
      status:   result.log.status
    })
    
    llmLatencyMs.observe(
      { provider: result.log.provider, model: result.log.model },
      result.log.latencyMs
    )
    
    llmTokensTotal.inc(
      { provider: result.log.provider, model: result.log.model, type: 'input' },
      result.log.inputTokens
    )
    
    llmTokensTotal.inc(
      { provider: result.log.provider, model: result.log.model, type: 'output' },
      result.log.outputTokens
    )

    llmCostUsd.inc(
      { provider: result.log.provider, model: result.log.model },
      result.log.costUsd || 0
    )
    
    if (result.log.status === 'error') {
      llmErrorsTotal.inc({ provider: result.log.provider, model: result.log.model })
    }

    // Tell frontend the stream is done
    res.write(`data: ${JSON.stringify({ done: true, messageId: assistantMessage.id })}\n\n`)
    res.end()

  } catch (err: any) {
    // Send error through the stream so frontend knows what happened
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

// GET /conversations/:id/messages — fetch full message history
router.get('/:id/messages', async (req: Request<{ id: string }>, res: Response) => {
  const messages = await getMessagesByConversation(req.params.id)
  res.json(messages)
})

export default router