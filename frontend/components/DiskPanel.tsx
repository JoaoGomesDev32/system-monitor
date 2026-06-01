'use client'
import { SystemMetrics } from '@/types/metrics'
import { MetricCard } from './MetricCard'
import { GaugeBar } from './GaugeBar'

interface Props { metrics: SystemMetrics }

export function DiskPanel({ metrics }: Props) {
  const unique = metrics.disk.filter(
    (d, i, arr) => arr.findIndex(x => x.device === d.device) === i
  )
  return (
    <MetricCard title="Disco">
      <div className="space-y-3">
        {unique.map(d => (
          <GaugeBar
            key={d.mountpoint}
            label={d.mountpoint}
            percent={d.percent}
            detail={`${d.used_gb.toFixed(1)} / ${d.total_gb.toFixed(1)} GB`}
          />
        ))}
      </div>
    </MetricCard>
  )
}
