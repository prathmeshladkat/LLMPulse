import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ProviderError } from '@/types'

interface ErrorsChartProps {
  data: ProviderError[]
  loading: boolean
}

export default function ErrorsChart({ data, loading }: ErrorsChartProps) {
  const chartData = data.map(d => ({
    provider: d.provider,
    errors:   d.errors,
    total:    d.total,
    rate:     d.total > 0 ? ((d.errors / d.total) * 100).toFixed(1) : '0'
  }))

  return (
    <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: 'white' }}>
        Errors by Provider — Last 24 Hours
      </h3>

      {loading ? (
        <div style={{ height: '200px', backgroundColor: '#2a2a2a', borderRadius: '8px' }} />
      ) : data.length === 0 ? (
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
          No data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="provider" stroke="#6b7280" fontSize={11} />
            <YAxis stroke="#6b7280" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: 'white' }}
              formatter={(value, name) => [value, name === 'errors' ? 'Errors' : 'Total']}
            />
            <Bar dataKey="total"  fill="#3b82f6" radius={[4,4,0,0]} />
            <Bar dataKey="errors" fill="#ef4444" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}