import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BarChart2, MessageSquare } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav style={{ borderBottom: '1px solid #2a2a2a', backgroundColor: '#0a0a0a', padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
      
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div style={{ width: '28px', height: '28px', backgroundColor: '#3b82f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '11px' }}>LP</span>
        </div>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>LLMpulse</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to="/chat">
          <Button
            variant={location.pathname === '/chat' ? 'default' : 'ghost'}
            size="lg"
            style={{ display: 'flex', alignItems: 'center',width: '120px', gap: '6px' }}
          >
            <MessageSquare size={15} />
            Chat
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button
            variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
            size="lg"
            style={{ display: 'flex', alignItems: 'center',width: '120px', gap: '6px' }}
          >
            <BarChart2 size={15} />
            Dashboard
          </Button>
        </Link>
      </div>

    </nav>
  )
}