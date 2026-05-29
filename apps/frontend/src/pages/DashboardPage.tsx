import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import SummaryCards from '@/components/dashboard/SummaryCards'
import LatencyChart from '@/components/dashboard/LatencyChart'
import ErrorsChart from '@/components/dashboard/ErrorsChart'
import LogsTable from '@/components/dashboard/LogsTable'
import { MetricsSummary, LatencyDataPoint, ProviderError, InferenceLog } from '@/types'
import { getMetricsSummary, getLatencyOverTime, getErrorsByProvider, getInferenceLogs } from '@/api/client'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [summary, setSummary]           = useState<MetricsSummary | null>(null)
  const [latency, setLatency]           = useState<LatencyDataPoint[]>([])
  const [errors, setErrors]             = useState<ProviderError[]>([])
  const [logs, setLogs]                 = useState<InferenceLog[]>([])
  const [total, setTotal]               = useState(0)
  const [page, setPage]                 = useState(1)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [loadingCharts, setLoadingCharts]   = useState(true)
  const [loadingLogs, setLoadingLogs]       = useState(true)
  const [lastRefreshed, setLastRefreshed]   = useState(new Date())

  async function fetchSummary() {
    setLoadingSummary(true)
    try {
      const data = await getMetricsSummary()
      setSummary(data)
    } catch (err) {
      console.error('Failed to fetch summary:', err)
    } finally {
      setLoadingSummary(false)
    }
  }

  async function fetchCharts() {
    setLoadingCharts(true)
    try {
      const [latencyData, errorsData] = await Promise.all([
        getLatencyOverTime(),
        getErrorsByProvider()
      ])
      setLatency(latencyData)
      setErrors(errorsData)
    } catch (err) {
      console.error('Failed to fetch charts:', err)
    } finally {
      setLoadingCharts(false)
    }
  }

  async function fetchLogs(p: number) {
    setLoadingLogs(true)
    try {
      const data = await getInferenceLogs(p)
      setLogs(data.logs)
      setTotal(data.total)
    } catch (err) {
      console.error('Failed to fetch logs:', err)
    } finally {
      setLoadingLogs(false)
    }
  }

  // Fetch everything on mount
  useEffect(() => {
    fetchSummary()
    fetchCharts()
    fetchLogs(1)
  }, [])

  // Fetch logs when page changes
  useEffect(() => {
    fetchLogs(page)
  }, [page])

  // Refresh everything
  async function handleRefresh() {
    await Promise.all([fetchSummary(), fetchCharts(), fetchLogs(page)])
    setLastRefreshed(new Date())
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>

      <Navbar />

      <div style={{ flex: 1, padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>Dashboard</h1>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              Last 24 hours • Refreshed at {lastRefreshed.toLocaleTimeString()}
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} />
            Refresh
          </Button>
        </div>

        {/* Summary cards */}
        <div style={{ marginBottom: '24px' }}>
          <SummaryCards data={summary} loading={loadingSummary} />
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <LatencyChart data={latency} loading={loadingCharts} />
          <ErrorsChart  data={errors}  loading={loadingCharts} />
        </div>

        {/* Logs table */}
        <LogsTable
          logs={logs}
          total={total}
          page={page}
          loading={loadingLogs}
          onPageChange={setPage}
        />

      </div>
    </div>
  )
}