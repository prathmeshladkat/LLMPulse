import { MetricsSummary } from '@/types'
import { Zap, Hash, AlertCircle, Activity, DollarSign } from 'lucide-react'

interface SummaryCardsProps {
  data: MetricsSummary | null
  loading: boolean
}

export default function SummaryCards({ data, loading }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Requests',
      value: data?.total_requests ?? 0,
      display: (data?.total_requests ?? 0).toLocaleString(),
      icon: <Activity size={18} color="#3b82f6" />,
      color: '#3b82f6'
    },
    {
      title: 'Avg Latency',
      value: data?.avg_latency_ms ?? 0,
      display: `${(data?.avg_latency_ms ?? 0).toLocaleString()}ms`,
      icon: <Zap size={18} color="#f59e0b" />,
      color: '#f59e0b'
    },
    {
      title: 'Total Tokens',
      value: data?.total_tokens ?? 0,
      display: (data?.total_tokens ?? 0).toLocaleString(),
      icon: <Hash size={18} color="#10b981" />,
      color: '#10b981'
    },
    {
      title: 'Total Cost',
      value: data?.total_cost_usd ?? 0,
      display: `$${(data?.total_cost_usd ?? 0).toFixed(4)}`,
      icon: <DollarSign size={18} color="#a855f7" />,
      color: '#a855f7'
    },
    {
      title: 'Errors',
      value: data?.error_count ?? 0,
      display: (data?.error_count ?? 0).toLocaleString(),
      icon: <AlertCircle size={18} color="#ef4444" />,
      color: '#ef4444'
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
      {cards.map(card => (
        <div
          key={card.title}
          style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>{card.title}</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {card.icon}
            </div>
          </div>
          {loading ? (
            <div style={{ height: '28px', backgroundColor: '#2a2a2a', borderRadius: '4px' }} />
          ) : (
            <p style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
              {card.display}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}