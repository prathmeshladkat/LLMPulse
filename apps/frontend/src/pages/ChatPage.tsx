import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import ChatWindow from '@/components/chat/ChatWindow'
import NewChatModal from '@/components/chat/NewChatModal'
import { Conversation } from '@/types'
import { getConversations } from '@/api/client'

export default function ChatPage() {
  const [conversations, setConversations]   = useState<Conversation[]>([])
  const [activeId, setActiveId]             = useState<string | null>(null)
  const [modalOpen, setModalOpen]           = useState(false)
  const [loading, setLoading]               = useState(true)

  // Load all conversations on mount
  useEffect(() => {
    getConversations()
      .then(data => setConversations(data))
      .finally(() => setLoading(false))
  }, [])

  // When a new conversation is created from modal
  function handleCreated(conversation: Conversation) {
    setConversations(prev => [conversation, ...prev])
    setActiveId(conversation.id)
  }

  // When user cancels a conversation from sidebar
  function handleCancelled(id: string) {
    setConversations(prev =>
      prev.map(c => c.id === id ? { ...c, status: 'cancelled' as const } : c)
    )
    // If cancelled conversation was active, clear chat window
    if (activeId === id) setActiveId(null)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a0a' }}>

      <Navbar />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar */}
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onNewChat={() => setModalOpen(true)}
          onCancelled={handleCancelled}
        />

        {/* Chat Window */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              Loading...
            </div>
          ) : (
            <ChatWindow conversationId={activeId} />
          )}
        </div>

      </div>

      {/* New Chat Modal */}
      <NewChatModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />

    </div>
  )
}