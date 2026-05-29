import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createConversation } from '@/api/client'
import { Conversation } from '@/types'

interface NewChatModalProps {
  open: boolean
  onClose: () => void
  onCreated: (conversation: Conversation) => void
}

const PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4.1', 'gpt-4o', 'gpt-3.5-turbo'],
    color: '#10a37f'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: ['claude-sonnet-4-20250514', 'claude-haiku-4-5-20251001'],
    color: '#d97706'
  },
  {
    id: 'google',
    name: 'Google',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro'],
    color: '#4285f4'
  }
]

export default function NewChatModal({ open, onClose, onCreated }: NewChatModalProps) {
  const [selectedProvider, setSelectedProvider] = useState('openai')
  const [selectedModel, setSelectedModel]       = useState('gpt-4.1')
  const [title, setTitle]                       = useState('')
  const [loading, setLoading]                   = useState(false)

  // When provider changes, auto select first model of that provider
  function handleProviderChange(providerId: string) {
    setSelectedProvider(providerId)
    const provider = PROVIDERS.find(p => p.id === providerId)
    if (provider) setSelectedModel(provider.models[0])
  }

  async function handleCreate() {
    setLoading(true)
    try {
      const conversation = await createConversation(
        selectedProvider,
        selectedModel,
        title.trim() || 'New Conversation'
      )
      onCreated(conversation)
      // Reset form
      setTitle('')
      setSelectedProvider('openai')
      setSelectedModel('gpt-4.1')
      onClose()
    } catch (err) {
      console.error('Failed to create conversation:', err)
    } finally {
      setLoading(false)
    }
  }

  const currentProvider = PROVIDERS.find(p => p.id === selectedProvider)!

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent style={{ backgroundColor: '#111', border: '1px solid #2a2a2a', color: 'white', maxWidth: '440px' }}>
        <DialogHeader>
          <DialogTitle style={{ color: 'white' }}>New Conversation</DialogTitle>
        </DialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>

          {/* Title input */}
          <div>
            <label style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px', display: 'block' }}>
              Title (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Python help, Trip planning..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none' }}
            />
          </div>

          {/* Provider selection */}
          <div>
            <label style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px', display: 'block' }}>
              Provider
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {PROVIDERS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleProviderChange(p.id)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: selectedProvider === p.id ? `1px solid ${p.color}` : '1px solid #2a2a2a',
                    backgroundColor: selectedProvider === p.id ? `${p.color}20` : '#1a1a1a',
                    color: selectedProvider === p.id ? p.color : '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    transition: 'all 0.15s'
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Model selection */}
          <div>
            <label style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px', display: 'block' }}>
              Model
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {currentProvider.models.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: selectedModel === m ? `1px solid ${currentProvider.color}` : '1px solid #2a2a2a',
                    backgroundColor: selectedModel === m ? `${currentProvider.color}15` : '#1a1a1a',
                    color: selectedModel === m ? 'white' : '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Create button */}
          <Button
            onClick={handleCreate}
            disabled={loading}
            style={{ backgroundColor: '#3b82f6', width: '100%', marginTop: '4px' }}
          >
            {loading ? 'Creating...' : 'Start Conversation'}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}