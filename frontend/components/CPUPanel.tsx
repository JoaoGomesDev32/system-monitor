'use client'
import { useEffect, useState } from 'react'
import { SystemMetrics } from '@/types/metrics'
import { MetricCard } from './MetricCard'
import { GaugeBar } from './GaugeBar'
import { LineChart, Line, YAxis, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props { metrics: SystemMetrics; history: SystemMetrics[] }

export function CPUPanel({ metrics, history }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { cpu } = metrics
  const chartData = history.map((m, i) => ({ t: i, cpu: m.cpu.percent }))

  return (
    <MetricCard title={`CPU — ${cpu.cores_physical} núcleos físicos / ${cpu.cores} lógicos · ${cpu.freq_mhz} MHz`}>
      <div className="text-3xl font-bold text-white mb-3">
        {cpu.percent.toFixed(1)}<span className="text-base text-slate-400 ml-1">%</span>
      </div>
      <div style={{ width: '100%', height: 80, minHeight: 80 }} className="mb-4">
        {mounted && (
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={chartData}>
              <YAxis domain={[0, 100]} hide />
              <XAxis dataKey="t" hide />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`${Number(v ?? 0).toFixed(1)}%`, 'CPU']}
                labelFormatter={() => ''}
              />
              <Line type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cpu.per_core.map((p, i) => (
          <GaugeBar key={i} label={`Core ${i}`} percent={p} />
        ))}
      </div>
    </MetricCard>
  )
}
