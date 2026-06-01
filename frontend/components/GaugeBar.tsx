interface Props {
  label: string
  percent: number
  detail?: string
}

export function GaugeBar({ label, percent, detail }: Props) {
  const color =
    percent < 60 ? 'bg-emerald-500' :
    percent < 80 ? 'bg-yellow-500'  : 'bg-red-500'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{detail ?? `${percent.toFixed(1)}%`}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}
