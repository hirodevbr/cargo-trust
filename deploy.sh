#!/bin/bash

# Script de deploy para Google Cloud Run
# Configurações
PROJECT_ID="cargo-trust-app"
SERVICE_NAME="cargo-trust"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Iniciando deploy do Cargo Trust para Google Cloud Run..."

# Verificar se o gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI não está instalado. Instale em: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Verificar se está autenticado
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Fazendo login no Google Cloud..."
    gcloud auth login
fi

# Configurar projeto
echo "⚙️ Configurando projeto: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Habilitar APIs necessárias
echo "🔧 Habilitando APIs necessárias..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build da imagem Docker
echo "🐳 Construindo imagem Docker..."
gcloud builds submit --tag $IMAGE_NAME .

# Deploy no Cloud Run
echo "🚀 Fazendo deploy no Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 80 \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --min-instances 0

# Obter URL do serviço
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo "✅ Deploy concluído com sucesso!"
echo "🌐 URL da aplicação: $SERVICE_URL"
echo "📊 Para ver logs: gcloud run logs tail $SERVICE_NAME --region $REGION"
echo "🔧 Para gerenciar: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME"
