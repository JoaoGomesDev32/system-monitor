from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from metrics import get_all_metrics

app = FastAPI(title="System Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em prod: coloque o domínio real
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST endpoint (snapshot único)
@app.get("/api/metrics")
async def metrics():
    return get_all_metrics()

@app.get("/api/health")
async def health():
    return {"status": "ok"}

# WebSocket (stream em tempo real)
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = get_all_metrics()
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(2)  # atualiza a cada 2 segundos
    except WebSocketDisconnect:
        print("Client disconnected")