'use client'
import { useEffect, useState } from 'react'
import { SystemMetrics } from '@/types/metrics'
import { MetricCard } from './MetricCard'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { LineChart, Line, YAxis, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props { metrics: SystemMetrics; history: SystemMetrics[] }

export function NetworkPanel({ metrics, history }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { network } = metrics
  const chartData = history.map((m, i) => ({
    t: i,
    upload:   m.network.speed_sent_kbs,
    download: m.network.speed_recv_kbs,
  }))

  return (
    <MetricCard title="Rede">
      <div className="flex gap-6 mb-4">
        <div className="flex items-center gap-2">
          <ArrowUp size={14} className="text-indigo-400" />
          <span className="text-sm text-slate-300">{network.speed_sent_kbs.toFixed(1)} KB/s</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDown size={14} className="text-emerald-400" />
          <span className="text-sm text-slate-300">{network.speed_recv_kbs.toFixed(1)} KB/s</span>
        </div>
      </div>
      <div style={{ width: '100%', height: 96, minHeight: 96 }}>
        {mounted && (
          <ResponsiveContainer width="100%" height={96}>
            <LineChart data={chartData}>
              <YAxis hide /><XAxis dataKey="t" hide />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 12 }}
                formatter={(v, name) => [`${Number(v ?? 0).toFixed(1)} KB/s`, name === 'upload' ? '↑ Upload' : '↓ Download']}
                labelFormatter={() => ''}
              />
              <Line type="monotone" dataKey="upload"   stroke="#6366f1" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="download" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex gap-6 mt-2 text-xs text-slate-500">
        <span>Total enviado: {(network.total_sent_mb / 1024).toFixed(2)} GB</span>
        <span>Total recebido: {(network.total_recv_mb / 1024).toFixed(2)} GB</span>
      </div>
    </MetricCard>
  )
}
