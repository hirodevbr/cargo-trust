# Multi-stage build para otimizar o tamanho da imagem
FROM node:20-alpine AS builder

# Instalar dependências do sistema necessárias para compilação nativa
RUN apk add --no-cache python3 make g++ linux-headers

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências com flags para evitar problemas com usb
RUN npm ci --ignore-scripts

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção com nginx
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
