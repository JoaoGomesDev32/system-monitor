import psutil
import time
from datetime import datetime

def get_cpu_metrics():
    return {
        "percent": psutil.cpu_percent(interval=1),
        "count": psutil.cpu_count(),
        "freq": psutil.cpu_freq()._asdict() if psutil.cpu_freq() else {},
        "per_core": psutil.cpu_percent(percpu=True)
    }

def get_memory_metrics():
    mem = psutil.virtual_memory()
    swap = psutil.swap_memory()
    return {
        "total": mem.total,
        "available": mem.available,
        "used": mem.used,
        "percent": mem.percent,
        "swap_total": swap.total,
        "swap_used": swap.used,
        "swap_percent": swap.percent
    }

def get_disk_metrics():
    partitions = []
    for part in psutil.disk_partitions():
        try:
            usage = psutil.disk_usage(part.mountpoint)
            partitions.append({
                "device": part.device,
                "mountpoint": part.mountpoint,
                "total": usage.total,
                "used": usage.used,
                "free": usage.free,
                "percent": usage.percent
            })
        except PermissionError:
            pass
    return partitions

def get_network_metrics():
    net = psutil.net_io_counters()
    return {
        "bytes_sent": net.bytes_sent,
        "bytes_recv": net.bytes_recv,
        "packets_sent": net.packets_sent,
        "packets_recv": net.packets_recv
    }

def get_processes():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'status']):
        try:
            processes.append(proc.info)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return sorted(processes, key=lambda x: x['cpu_percent'] or 0, reverse=True)[:20]

def get_all_metrics():
    return {
        "timestamp": datetime.now().isoformat(),
        "cpu": get_cpu_metrics(),
        "memory": get_memory_metrics(),
        "disk": get_disk_metrics(),
        "network": get_network_metrics(),
        "processes": get_processes()
    }