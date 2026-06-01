export interface CPUMetrics {
  percent: number
  per_core: number[]
  cores: number
  cores_physical: number
  freq_mhz: number
}

export interface RAMMetrics {
  total_gb: number
  used_gb: number
  free_gb: number
  percent: number
}

export interface MemoryMetrics {
  ram: RAMMetrics
  swap: { total_gb: number; used_gb: number; percent: number }
}

export interface DiskPartition {
  device: string
  mountpoint: string
  fstype: string
  total_gb: number
  used_gb: number
  free_gb: number
  percent: number
}

export interface NetworkMetrics {
  total_sent_mb: number
  total_recv_mb: number
  speed_sent_kbs: number
  speed_recv_kbs: number
}

export interface Process {
  pid: number
  name: string
  cpu: number
  mem: number
  status: string
}

export interface SystemMetrics {
  timestamp: string
  cpu: CPUMetrics
  memory: MemoryMetrics
  disk: DiskPartition[]
  network: NetworkMetrics
  processes: Process[]
}
