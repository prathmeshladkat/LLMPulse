import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InferenceLog } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface LogsTableProps {
  logs: InferenceLog[]
  total: number
  page: number
  loading: boolean
  onPageChange: (page: number) => void
}

export default function LogsTable({ logs, total, page, loading, onPageChange }: LogsTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const totalPages = Math.ceil(total / 20)

  function statusColor(status: string) {
    if (status === 'success')   return '#10b981'
    if (status === 'error')     return '#ef4444'
    if (status === 'cancelled') return '#f59e0b'
    return '#6b7280'
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString()
  }

  return (
    <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>Inference Logs</h3>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>{total} total</span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
              {['Time', 'Provider', 'Model', 'Latency', 'Tokens', 'Cost', 'Status', 'PII'].map(col => (
                <th key={col} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} style={{ padding: '12px 16px' }}>
                      <div style={{ height: '14px', backgroundColor: '#2a2a2a', borderRadius: '4px' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  No logs yet — send a message to see data here
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <>
                  <tr
                    key={log.id}
                    onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                    style={{ borderBottom: '1px solid #1a1a1a', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#222')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#9ca3af' }}>{formatTime(log.createdAt)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'white' }}>{log.provider}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#9ca3af' }}>{log.model}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#f59e0b' }}>{log.latencyMs}ms</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#10b981' }}>{log.inputTokens + log.outputTokens}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#a855f7' }}>${((log.costUsd ?? 0) * 1).toFixed(6)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', color: statusColor(log.status), backgroundColor: `${statusColor(log.status)}15`, padding: '2px 8px', borderRadius: '20px' }}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {log.piiAudit && log.piiAudit.redactionCount > 0 ? (
                        <span style={{ fontSize: '12px', color: '#f59e0b', backgroundColor: '#f59e0b15', padding: '2px 8px', borderRadius: '20px' }}>
                          {log.piiAudit.piiTypesFound.join(', ')}
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#444' }}>—</span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded row — shows input/output preview */}
                  {expanded === log.id && (
                    <tr key={log.id + '-expanded'} style={{ backgroundColor: '#111' }}>
                      <td colSpan={7} style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>INPUT PREVIEW</p>
                            <p style={{ fontSize: '13px', color: '#d1d5db', backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '6px', lineHeight: '1.5' }}>
                              {log.inputPreview || '—'}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>OUTPUT PREVIEW</p>
                            <p style={{ fontSize: '13px', color: '#d1d5db', backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '6px', lineHeight: '1.5' }}>
                              {log.outputPreview || '—'}
                            </p>
                          </div>
                        </div>
                        {log.errorMessage && (
                          <div style={{ marginTop: '10px' }}>
                            <p style={{ fontSize: '11px', color: '#ef4444', marginBottom: '6px' }}>ERROR</p>
                            <p style={{ fontSize: '13px', color: '#ef4444', backgroundColor: '#1a0a0a', padding: '10px', borderRadius: '6px' }}>
                              {log.errorMessage}
                            </p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Page {page} of {totalPages}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button size="sm" variant="outline" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
              <ChevronLeft size={14} />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}