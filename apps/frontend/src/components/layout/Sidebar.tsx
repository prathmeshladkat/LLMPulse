import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, MessageSquare, XCircle, Loader2 } from 'lucide-react'
import { Conversation } from '@/types'
import { cancelConversation } from '@/api/client'

interface SidebarProps {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNewChat: () => void
  onCancelled: (id: string) => void
}

export default function Sidebar({ conversations, activeId, onSelect, onNewChat, onCancelled }: SidebarProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  async function handleCancel(e: React.MouseEvent, id: string) {
    // Stop click from bubbling up to onSelect
    e.stopPropagation()
    setCancellingId(id)
    try {
      await cancelConversation(id)
      onCancelled(id)
    } catch (err) {
      console.error('Failed to cancel:', err)
    } finally {
      setCancellingId(null)
    }
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr)
    const now  = new Date()
    const diff = now.getTime() - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1)  return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24)  return `${hrs}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div style={{ width: '260px', borderRight: '1px solid #2a2a2a', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a0a' }}>

      {/* New Chat Button */}
      <div style={{ padding: '12px' }}>
        <Button
          onClick={onNewChat}
          style={{ width: '100%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          New Chat
        </Button>
      </div>

      {/* Conversation List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
        {conversations.length === 0 && (
          <p style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', marginTop: '32px' }}>
            No conversations yet
          </p>
        )}

        {conversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => conv.status === 'active' && onSelect(conv.id)}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '2px',
              cursor: conv.status === 'active' ? 'pointer' : 'default',
              backgroundColor: activeId === conv.id ? '#1a1a2e' : 'transparent',
              border: activeId === conv.id ? '1px solid #1e3a5f' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              opacity: conv.status === 'cancelled' ? 0.5 : 1,
            }}
          >
            {/* Icon */}
            <MessageSquare size={14} color="#6b7280" style={{ flexShrink: 0 }} />

            {/* Title + meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {conv.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>{conv.provider}</span>
                <span style={{ fontSize: '11px', color: '#444' }}>•</span>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>{formatTime(conv.updatedAt)}</span>
              </div>
            </div>

            {/* Status badge or cancel button */}
            {conv.status === 'cancelled' ? (
              <span style={{ fontSize: '10px', color: '#ef4444', backgroundColor: '#1a0a0a', padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>
                cancelled
              </span>
            ) : (
              <button
                onClick={(e) => handleCancel(e, conv.id)}
                title="Cancel conversation"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#6b7280', flexShrink: 0, display: 'flex', alignItems: 'center' }}
              >
                {cancellingId === conv.id
                  ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                  : <XCircle size={13} />
                }
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px', borderTop: '1px solid #2a2a2a' }}>
        <p style={{ fontSize: '11px', color: '#444', textAlign: 'center' }}>LLMpulse v1.0</p>
      </div>

    </div>
  )
}