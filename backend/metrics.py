import psutil
from datetime import datetime


# ─── CPU ────────────────────────────────────────────────────────────────────

def get_cpu():
    """
    cpu_percent(interval=1) mede uso real durante 1 segundo.
    Sem interval, retorna 0.0 na primeira chamada (não há referência anterior).
    percpu=True retorna lista por núcleo, ex: [12.0, 45.0, 8.0, 33.0]
    """
    freq = psutil.cpu_freq()
    return {
        "percent":   psutil.cpu_percent(interval=1),
        "per_core":  psutil.cpu_percent(interval=1, percpu=True),
        "cores":     psutil.cpu_count(logical=True),   # inclui hyperthreading
        "cores_physical": psutil.cpu_count(logical=False),
        "freq_mhz":  round(freq.current) if freq else 0,
    }


# ─── MEMÓRIA ────────────────────────────────────────────────────────────────

def get_memory():
    """
    virtual_memory() = RAM física
    swap_memory()    = memória virtual em disco (usada quando RAM esgota)
    
    Os valores vêm em bytes — dividimos por 1024³ para converter para GB.
    """
    ram  = psutil.virtual_memory()
    swap = psutil.swap_memory()

    def to_gb(b): return round(b / 1024**3, 2)

    return {
        "ram": {
            "total_gb":  to_gb(ram.total),
            "used_gb":   to_gb(ram.used),
            "free_gb":   to_gb(ram.available),
            "percent":   ram.percent,
        },
        "swap": {
            "total_gb": to_gb(swap.total),
            "used_gb":  to_gb(swap.used),
            "percent":  swap.percent,
        }
    }


# ─── DISCO ──────────────────────────────────────────────────────────────────

def get_disk():
    """
    disk_partitions() lista todas as partições montadas.
    Ignoramos partições do tipo 'squashfs' (snaps do Ubuntu — são read-only
    e poluem a lista sem acrescentar informação útil).
    """
    partitions = []
    for part in psutil.disk_partitions():
        if "squashfs" in part.fstype:
            continue
        try:
            usage = psutil.disk_usage(part.mountpoint)
            partitions.append({
                "device":     part.device,
                "mountpoint": part.mountpoint,
                "fstype":     part.fstype,
                "total_gb":   round(usage.total  / 1024**3, 2),
                "used_gb":    round(usage.used   / 1024**3, 2),
                "free_gb":    round(usage.free   / 1024**3, 2),
                "percent":    usage.percent,
            })
        except PermissionError:
            # Algumas partições de sistema bloqueiam acesso — ignoramos
            pass
    return partitions


# ─── REDE ───────────────────────────────────────────────────────────────────

# Guardamos a leitura anterior para calcular velocidade (bytes/s)
_prev_net = None
_prev_time = None

def get_network():
    """
    net_io_counters() retorna TOTAIS acumulados desde o boot.
    Para calcular velocidade (MB/s), subtraímos a leitura anterior
    e dividimos pelo tempo decorrido.
    """
    global _prev_net, _prev_time

    now  = psutil.net_io_counters()
    ts   = datetime.now().timestamp()

    speed_sent = 0.0
    speed_recv = 0.0

    if _prev_net and _prev_time:
        elapsed      = ts - _prev_time
        speed_sent   = (now.bytes_sent - _prev_net.bytes_sent) / elapsed
        speed_recv   = (now.bytes_recv - _prev_net.bytes_recv) / elapsed

    _prev_net  = now
    _prev_time = ts

    def to_mb(b): return round(b / 1024**2, 2)

    return {
        "total_sent_mb":  to_mb(now.bytes_sent),
        "total_recv_mb":  to_mb(now.bytes_recv),
        "speed_sent_kbs": round(speed_sent / 1024, 2),   # KB/s
        "speed_recv_kbs": round(speed_recv / 1024, 2),
    }


# ─── PROCESSOS ──────────────────────────────────────────────────────────────

def get_processes(limit=15):
    """
    process_iter() é lazy — só busca os campos que você pede.
    Pedimos apenas os 5 campos necessários para não sobrecarregar.
    Ordenamos por CPU e retornamos os top N.
    """
    procs = []
    for p in psutil.process_iter(["pid", "name", "cpu_percent",
                                   "memory_percent", "status"]):
        try:
            info = p.info
            procs.append({
                "pid":     info["pid"],
                "name":    info["name"] or "unknown",
                "cpu":     round(info["cpu_percent"] or 0, 1),
                "mem":     round(info["memory_percent"] or 0, 2),
                "status":  info["status"],
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            # Processo pode morrer durante a iteração — normal
            pass

    return sorted(procs, key=lambda x: x["cpu"], reverse=True)[:limit]


# ─── SNAPSHOT COMPLETO ──────────────────────────────────────────────────────

def get_all():
    """Agrega todas as métricas num único dicionário."""
    return {
        "timestamp":  datetime.now().isoformat(),
        "cpu":        get_cpu(),
        "memory":     get_memory(),
        "disk":       get_disk(),
        "network":    get_network(),
        "processes":  get_processes(),
    }