# Dockerfile simples para servir arquivos estáticos
FROM nginx:alpine

# Copiar arquivos buildados
COPY dist/ /usr/share/nginx/html/

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]