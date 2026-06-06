import { useState, useEffect, useRef, useCallback } from 'react'
import { SystemMetrics } from '@/types/metrics'

const HISTORY_SIZE = 30

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export function useSystemMetrics() {
  const [metrics, setMetrics]   = useState<SystemMetrics | null>(null)
  const [history, setHistory]   = useState<SystemMetrics[]>([])
  const [status, setStatus]     = useState<ConnectionStatus>('connecting')
  const wsRef                   = useRef<WebSocket | null>(null)
  const retryRef                = useRef<ReturnType<typeof setTimeout> | null>(null)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    const url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'
    const ws  = new WebSocket(url)
    wsRef.current = ws

    ws.onopen    = () => { setStatus('connected'); if (retryRef.current) clearTimeout(retryRef.current) }
    ws.onmessage = (e) => {
      const data: SystemMetrics = JSON.parse(e.data)
      setMetrics(data)
      setHistory(prev => [...prev.slice(-(HISTORY_SIZE - 1)), data])
    }
    ws.onerror  = () => setStatus('error')
    ws.onclose  = () => { setStatus('disconnected'); retryRef.current = setTimeout(connect, 3000) }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      if (retryRef.current) clearTimeout(retryRef.current)
      wsRef.current?.close()
    }
  }, [connect])

  return { metrics, history, status }
}
