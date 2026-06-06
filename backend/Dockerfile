# Imagem base — Python 3.12 versão slim (sem pacotes desnecessários)
# "slim" é menor que a imagem completa: ~50MB vs ~900MB
FROM python:3.12-slim

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia PRIMEIRO só o requirements.txt
# Porquê? Docker cacheia camadas — se o código mudar mas as dependências não,
# ele reutiliza a camada do pip install sem reinstalar tudo
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Agora copia o resto do código
COPY . .

# Documenta que o container usa a porta 8000
EXPOSE 8000

# Comando que arranca o servidor
# 0.0.0.0 é obrigatório — sem isso o container não aceita ligações externas
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
