import { ConnectionStatus } from '@/hooks/useSystemMetrics'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'

interface Props {
  status: ConnectionStatus
  timestamp?: string
}

export function StatusBar({ status, timestamp }: Props) {
  const configs = {
    connected:    { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: Wifi,    label: 'Conectado' },
    connecting:   { color: 'text-yellow-400',  bg: 'bg-yellow-400/10  border-yellow-400/20',  icon: Loader2, label: 'Conectando...' },
    disconnected: { color: 'text-red-400',     bg: 'bg-red-400/10     border-red-400/20',     icon: WifiOff, label: 'Desconectado — reconectando...' },
    error:        { color: 'text-red-400',     bg: 'bg-red-400/10     border-red-400/20',     icon: WifiOff, label: 'Erro de conexão' },
  }
  const { color, bg, icon: Icon, label } = configs[status]

  return (
    <div className={`flex items-center justify-between px-4 py-2 rounded-lg border text-sm ${bg}`}>
      <div className={`flex items-center gap-2 ${color}`}>
        <Icon size={14} className={status === 'connecting' ? 'animate-spin' : ''} />
        <span>{label}</span>
      </div>
      {timestamp && (
        <span className="text-slate-500 text-xs">
          Última atualização: {new Date(timestamp).toLocaleTimeString('pt-PT')}
        </span>
      )}
    </div>
  )
}
