interface Props {
  title: string
  children: React.ReactNode
  className?: string
}

export function MetricCard({ title, children, className = '' }: Props) {
  return (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 ${className}`}>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}
