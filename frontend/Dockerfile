# STAGE 1: Builder
# Usamos uma imagem maior para compilar o Next.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm ci

# Copia o código e compila
COPY . .
RUN npm run build

# STAGE 2: Runner
# Imagem final muito mais leve — só o necessário para correr
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copia apenas o output da build do stage anterior
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
