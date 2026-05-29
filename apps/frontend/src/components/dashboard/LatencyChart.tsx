import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { LatencyDataPoint } from '@/types'

interface LatencyChartProps {
  data: LatencyDataPoint[]
  loading: boolean
}

export default function LatencyChart({ data, loading }: LatencyChartProps) {
  // Format hour label for x axis
  function formatHour(hourStr: string) {
    const date = new Date(hourStr)
    return date.getHours() + ':00'
  }

  const chartData = data.map(d => ({
    hour:    formatHour(d.hour),
    latency: d.avg_latency_ms,
    requests: d.request_count
  }))

  return (
    <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: 'white' }}>
        Avg Latency — Last 24 Hours
      </h3>

      {loading ? (
        <div style={{ height: '200px', backgroundColor: '#2a2a2a', borderRadius: '8px' }} />
      ) : data.length === 0 ? (
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
          No data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="hour" stroke="#6b7280" fontSize={11} />
            <YAxis stroke="#6b7280" fontSize={11} unit="ms" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: 'white' }}
              formatter={(value) => [`${value}ms`, 'Avg Latency']}
            />
            <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}