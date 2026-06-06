# 🖥️ System Monitor Dashboard

Dashboard de monitorização de sistema em tempo real, com backend em Python e frontend em Next.js comunicando via WebSockets.

![Dashboard Preview](docs/system-monitor.png)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)

## 📸 Preview

> Dashboard a monitorizar CPU, memória, disco, rede e processos em tempo real.

## 🚀 Features

- **CPU** — uso geral, por núcleo e histórico em gráfico de linha
- **Memória** — RAM e Swap com barras de progresso dinâmicas
- **Disco** — uso por partição
- **Rede** — velocidade de upload/download em tempo real
- **Processos** — top 15 processos ordenados por CPU
- **WebSocket** — atualização automática a cada 2 segundos
- **Reconexão automática** — recupera a ligação sem reload da página

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, Recharts |
| Backend | Python 3.12, FastAPI, WebSockets, psutil |
| Infra | Docker, Docker Compose |

## 📁 Estruturasystem-monitor/
├── backend/
│   ├── main.py          # API REST + WebSocket
│   ├── metrics.py       # Coleta de métricas do sistema
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   ├── components/      # CPUPanel, MemoryPanel, NetworkPanel...
│   ├── hooks/           # useSystemMetrics (WebSocket)
│   ├── types/           # TypeScript interfaces
│   └── Dockerfile
└── docker-compose.yml## ⚡ Como correr

### Com Docker (recomendado)

```bash
git clone https://github.com/joagomes/system-monitor
cd system-monitor
docker compose up --build
```

Acede a `http://localhost:3000`

### Sem Docker (desenvolvimento)

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🔌 API

| Endpoint | Método | Descrição |
|---|---|---|
| `/` | GET | Info da API |
| `/health` | GET | Health check |
| `/api/metrics` | GET | Snapshot das métricas |
| `/ws` | WebSocket | Stream em tempo real |

## 💡 O que aprendi

- Arquitetura cliente-servidor com WebSockets para comunicação bidirecional em tempo real
- FastAPI com endpoints async e gestão de múltiplas conexões simultâneas
- Next.js App Router com TypeScript e hooks personalizados
- Docker multi-stage builds para imagens de produção otimizadas
- Docker Compose para orquestração de múltiplos serviços

## 👤 Autor

**João Gomes** — [GitHub](https://github.com/JoaoGomesDev32) · [LinkedIn](https://www.linkedin.com/in/joaofelipedev32/)

> Projeto desenvolvido como parte do meu portfólio de desenvolvimento. Estudante na 42Lisboa.
