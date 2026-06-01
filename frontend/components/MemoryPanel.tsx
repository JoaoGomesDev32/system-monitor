'use client'
import { SystemMetrics } from '@/types/metrics'
import { MetricCard } from './MetricCard'
import { GaugeBar } from './GaugeBar'

interface Props { metrics: SystemMetrics }

export function MemoryPanel({ metrics }: Props) {
  const { ram, swap } = metrics.memory
  return (
    <MetricCard title="Memória">
      <div className="text-3xl font-bold text-white mb-3">
        {ram.used_gb.toFixed(1)}<span className="text-base text-slate-400 ml-1">GB / {ram.total_gb.toFixed(1)} GB</span>
      </div>
      <div className="space-y-3">
        <GaugeBar label="RAM"  percent={ram.percent}  detail={`${ram.used_gb.toFixed(1)} / ${ram.total_gb.toFixed(1)} GB`} />
        <GaugeBar label="Swap" percent={swap.percent} detail={`${swap.used_gb.toFixed(1)} / ${swap.total_gb.toFixed(1)} GB`} />
      </div>
    </MetricCard>
  )
}
