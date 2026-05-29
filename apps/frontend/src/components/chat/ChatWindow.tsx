import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'
import MessageBubble from './MessageBubble'
import { Message, InferenceLog } from '@/types'
import { getConversation, sendMessage } from '@/api/client'

interface ChatWindowProps {
  conversationId: string | null
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
  const [messages, setMessages]         = useState<Message[]>([])
  const [logs, setLogs]                 = useState<InferenceLog[]>([])
  const [input, setInput]               = useState('')
  const [streaming, setStreaming]       = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const bottomRef                       = useRef<HTMLDivElement>(null)

  // Load conversation messages when conversationId changes (resume)
  useEffect(() => {
    if (!conversationId) return
    setMessages([])
    setLogs([])

    getConversation(conversationId).then(data => {
      setMessages(data.messages || [])
    })
  }, [conversationId])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  async function handleSend() {
    if (!input.trim() || !conversationId || streaming) return

    const userText = input.trim()
    setInput('')
    setStreaming(true)
    setStreamingText('')

    // Optimistically add user message to UI immediately
    const tempUserMsg: Message = {
      id:             'temp-user',
      conversationId,
      role:           'user',
      content:        userText,
      createdAt:      new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempUserMsg])

    let fullResponse = ''

    await sendMessage(
      conversationId,
      userText,
      // onChunk — append each word to streaming text
      (chunk) => {
        fullResponse += chunk
        setStreamingText(fullResponse)
      },
      // onDone — move streamed text into messages list
      () => {
        const assistantMsg: Message = {
          id:             'temp-assistant-' + Date.now(),
          conversationId,
          role:           'assistant',
          content:        fullResponse,
          createdAt:      new Date().toISOString(),
        }
        setMessages(prev => [...prev, assistantMsg])
        setStreamingText('')
        setStreaming(false)
      },
      // onError
      (err) => {
        console.error('Stream error:', err)
        setStreaming(false)
        setStreamingText('')
      }
    )
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Empty state
  if (!conversationId) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '40px' }}>💬</div>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Select a conversation or start a new one</p>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            // Match log to assistant message by position
            latencyMs={msg.role === 'assistant' ? logs[Math.floor(i / 2)]?.latencyMs : undefined}
            totalTokens={msg.role === 'assistant' ? (logs[Math.floor(i / 2)]?.inputTokens ?? 0) + (logs[Math.floor(i / 2)]?.outputTokens ?? 0) : undefined}
          />
        ))}

        {/* Streaming bubble — shows while response is coming in */}
        {streamingText && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', paddingLeft: '4px' }}>Assistant</span>
            <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '14px', lineHeight: '1.6', color: '#f5f5f5', whiteSpace: 'pre-wrap' }}>
              {streamingText}
              <span style={{ display: 'inline-block', width: '8px', height: '14px', backgroundColor: '#3b82f6', marginLeft: '2px', animation: 'blink 1s infinite' }} />
            </div>
          </div>
        )}

        {/* Loading indicator before first chunk arrives */}
        {streaming && !streamingText && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: '16px', borderTop: '1px solid #2a2a2a' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '8px 12px' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            disabled={streaming}
            rows={1}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: '14px', resize: 'none', lineHeight: '1.5', maxHeight: '120px', overflowY: 'auto' }}
          />
          <Button
            onClick={handleSend}
            disabled={streaming || !input.trim()}
            size="sm"
            style={{ backgroundColor: '#3b82f6', flexShrink: 0, width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {streaming
              ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={15} />
            }
          </Button>
        </div>
        <p style={{ fontSize: '11px', color: '#444', textAlign: 'center', marginTop: '8px' }}>
          LLMpulse — all conversations are logged for observability
        </p>
      </div>

    </div>
  )
}