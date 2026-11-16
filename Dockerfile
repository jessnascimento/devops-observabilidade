# Imagem base do Node.js
FROM node:22-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências de produção
RUN npm ci --omit=dev

# Copia os arquivos do projeto
COPY public ./public
COPY src ./src

# Porta utilizada pela aplicação
EXPOSE 3000

# Inicializa o servidor
CMD ["npm", "start"]
