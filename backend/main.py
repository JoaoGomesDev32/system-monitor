import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from metrics import get_all

app = FastAPI(title="System Monitor", version="1.0.0")

# ─── CORS ───────────────────────────────────────────────────────────────────
# CORS = Cross-Origin Resource Sharing
# Por padrão, navegadores bloqueiam requisições entre origens diferentes.
# Ex: frontend em localhost:3000 tentando falar com backend em localhost:8000
# é bloqueado. O middleware abaixo libera isso durante desenvolvimento.
# Em produção, troque ["*"] pelo domínio real: ["https://seusite.com"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── GERENCIADOR DE CONEXÕES ────────────────────────────────────────────────
# Em vez de uma conexão única, gerenciamos múltiplos clientes simultaneamente.
# Se você abrir o dashboard em 2 abas, ambas recebem os dados.

class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)
        print(f"[+] Cliente conectado. Total: {len(self.active)}")

    def disconnect(self, ws: WebSocket):
        self.active.remove(ws)
        print(f"[-] Cliente desconectado. Total: {len(self.active)}")

    async def broadcast(self, data: str):
        """Envia para todos os clientes conectados."""
        for ws in self.active:
            await ws.send_text(data)

manager = ConnectionManager()


# ─── ENDPOINTS REST ─────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"message": "System Monitor API", "docs": "/docs"}

@app.get("/health")
async def health():
    """Endpoint de health check — usado pelo Docker e load balancers."""
    return {"status": "ok"}

@app.get("/api/metrics")
async def snapshot():
    """
    Retorna um snapshot único das métricas.
    Útil para carregar os dados iniciais antes do WebSocket conectar.
    """
    return get_all()


# ─── WEBSOCKET ──────────────────────────────────────────────────────────────

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Fluxo:
    1. Cliente conecta em ws://localhost:8000/ws
    2. Servidor aceita e adiciona à lista de conexões ativas
    3. Loop infinito: coleta métricas → serializa para JSON → envia → espera 2s
    4. Se cliente desconectar (fechar aba, perder internet), capturamos
       WebSocketDisconnect e removemos da lista
    """
    await manager.connect(websocket)
    try:
        while True:
            data = get_all()
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        manager.disconnect(websocket)