'use client'
import { useSystemMetrics } from '@/hooks/useSystemMetrics'
import { StatusBar }    from '@/components/StatusBar'
import { CPUPanel }     from '@/components/CPUPanel'
import { MemoryPanel }  from '@/components/MemoryPanel'
import { DiskPanel }    from '@/components/DiskPanel'
import { NetworkPanel } from '@/components/NetworkPanel'
import { ProcessTable } from '@/components/ProcessTable'

export default function Home() {
  const { metrics, history, status } = useSystemMetrics()

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">System Monitor</h1>
        <p className="text-slate-400 text-sm mb-3">Dashboard de métricas em tempo real</p>
        <StatusBar status={status} timestamp={metrics?.timestamp} />
      </div>

      {!metrics && (
        <div className="flex items-center justify-center h-64 text-slate-500">
          A carregar métricas...
        </div>
      )}

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-2">
            <CPUPanel metrics={metrics} history={history} />
          </div>
          <MemoryPanel  metrics={metrics} />
          <DiskPanel    metrics={metrics} />
          <div className="md:col-span-2 xl:col-span-4">
            <NetworkPanel metrics={metrics} history={history} />
          </div>
          <ProcessTable metrics={metrics} />
        </div>
      )}
    </main>
  )
}
