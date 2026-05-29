import { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
  latencyMs?: number
  totalTokens?: number
}

export default function MessageBubble({ message, latencyMs, totalTokens }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
    }}>

      {/* Role label */}
      <span style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', paddingLeft: '4px' }}>
        {isUser ? 'You' : 'Assistant'}
      </span>

      {/* Bubble */}
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        backgroundColor: isUser ? '#1e3a5f' : '#1a1a1a',
        border: isUser ? '1px solid #1e4a8f' : '1px solid #2a2a2a',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#f5f5f5',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {message.content}
      </div>

      {/* Metadata badges — only show on assistant messages if data exists */}
      {!isUser && (latencyMs || totalTokens) && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', paddingLeft: '4px' }}>
          {latencyMs && (
            <span style={{
              fontSize: '11px',
              color: '#6b7280',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              padding: '2px 8px',
              borderRadius: '20px',
            }}>
              ⚡ {latencyMs}ms
            </span>
          )}
          {totalTokens && (
            <span style={{
              fontSize: '11px',
              color: '#6b7280',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              padding: '2px 8px',
              borderRadius: '20px',
            }}>
              🪙 {totalTokens} tokens
            </span>
          )}
        </div>
      )}

    </div>
  )
}