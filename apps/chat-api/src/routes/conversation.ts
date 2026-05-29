import { Router, Request, Response } from "express";
import {
  getAllConversations,
  getConversationById,
  createConversation,
  updateConversationStatus,
  getMessagesByConversation,
} from '../db/queries'

const router = Router()

router.get('/', async(req: Request, res: Response) => {
    const conversations = await getAllConversations()
    res.json(conversations)
})

router.get('/:id', async(req: Request<{ id: string }>, res: Response) => {
    const conversation = await getConversationById(req.params.id)
    if (!conversation) {
    res.status(404).json({ error: 'Conversation not found' })
    return
  }
  const messages = await getMessagesByConversation(req.params.id)
  res.json({ ...conversation, messages })

})

// POST /conversations — start a new conversation
router.post('/', async (req: Request, res: Response) => {
  const { provider = 'anthropic', model, title = 'New Conversation' } = req.body

  const defaultModels: Record<string, string> = {
    anthropic: 'claude-sonnet-4-20250514',
    openai:    'gpt-4.1',
    google:    'gemini-2.0-flash',
  }

  const resolvedModel = model || defaultModels[provider] || defaultModels.anthropic
  const conversation = await createConversation(provider, resolvedModel, title)
  res.status(201).json(conversation)
})

// PATCH /conversations/:id/cancel — cancel an active conversation
router.patch('/:id/cancel', async (req: Request<{ id: string }>, res: Response) => {
  const conversation = await getConversationById(req.params.id)

  if (!conversation) {
    res.status(404).json({ error: 'Conversation not found' })
    return
  }
  if (conversation.status !== 'active') {
    res.status(400).json({ error: `Cannot cancel — status is already: ${conversation.status}` })
    return
  }

  const updated = await updateConversationStatus(req.params.id, 'cancelled')
  res.json(updated)
})

export default router