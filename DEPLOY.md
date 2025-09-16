# Deploy do Cargo Trust no Google Cloud Platform

Este guia explica como fazer o deploy da aplicação Cargo Trust no Google Cloud Run.

## Pré-requisitos

1. **Google Cloud CLI** instalado

   ```bash
   # Instalar gcloud CLI
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   ```

2. **Docker** instalado (opcional, para testes locais)

3. **Conta Google Cloud** com billing habilitado

## Configuração Inicial

1. **Fazer login no Google Cloud**

   ```bash
   gcloud auth login
   ```

2. **Criar um projeto** (substitua `cargo-trust-app` pelo seu ID de projeto)

   ```bash
   gcloud projects create cargo-trust-app
   gcloud config set project cargo-trust-app
   ```

3. **Habilitar APIs necessárias**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

## Opções de Deploy

### Opção 1: Deploy Automático (Recomendado)

Execute o script de deploy:

```bash
./deploy.sh
```

### Opção 2: Deploy Manual

1. **Build da imagem**

   ```bash
   gcloud builds submit --tag gcr.io/cargo-trust-app/cargo-trust .
   ```

2. **Deploy no Cloud Run**
   ```bash
   gcloud run deploy cargo-trust \
     --image gcr.io/cargo-trust-app/cargo-trust \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 80
   ```

### Opção 3: Deploy via Cloud Build

```bash
gcloud builds submit --config cloudbuild.yaml .
```

## Configurações do Serviço

- **Região**: us-central1
- **Memória**: 512Mi
- **CPU**: 1 vCPU
- **Instâncias**: 0-10 (auto-scaling)
- **Porta**: 80
- **Acesso**: Público (sem autenticação)

## Monitoramento

- **Logs**: `gcloud run logs tail cargo-trust --region us-central1`
- **Console**: https://console.cloud.google.com/run
- **Métricas**: https://console.cloud.google.com/monitoring

## Custos Estimados

- **Cloud Run**: ~$0.50-2.00/mês (dependendo do tráfego)
- **Container Registry**: ~$0.10/mês
- **Cloud Build**: ~$0.10 por build

## Troubleshooting

### Erro de Permissões

```bash
gcloud auth configure-docker
```

### Erro de Quota

- Verifique se o billing está habilitado
- Aumente as quotas se necessário

### Erro de Build

- Verifique se o Dockerfile está correto
- Teste localmente: `docker build -t cargo-trust .`

## Atualizações

Para atualizar a aplicação:

```bash
./deploy.sh
```

O Cloud Run fará o deploy da nova versão automaticamente.
