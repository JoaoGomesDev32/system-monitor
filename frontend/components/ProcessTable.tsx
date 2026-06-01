'use client'
import { SystemMetrics } from '@/types/metrics'
import { MetricCard } from './MetricCard'

interface Props { metrics: SystemMetrics }

export function ProcessTable({ metrics }: Props) {
  return (
    <MetricCard title="Processos (Top 15 por CPU)" className="col-span-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-700">
              <th className="pb-2 pr-4">PID</th>
              <th className="pb-2 pr-4">Nome</th>
              <th className="pb-2 pr-4">CPU %</th>
              <th className="pb-2 pr-4">Mem %</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {metrics.processes.map(p => (
              <tr key={p.pid} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                <td className="py-2 pr-4 text-slate-500 font-mono text-xs">{p.pid}</td>
                <td className="py-2 pr-4 text-slate-200 font-medium">{p.name}</td>
                <td className="py-2 pr-4">
                  <span className={p.cpu > 50 ? 'text-red-400' : p.cpu > 20 ? 'text-yellow-400' : 'text-emerald-400'}>
                    {p.cpu.toFixed(1)}%
                  </span>
                </td>
                <td className="py-2 pr-4 text-slate-300">{p.mem.toFixed(2)}%</td>
                <td className="py-2">
                  <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MetricCard>
  )
}
