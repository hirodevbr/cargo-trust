# 🚀 Meridian Delivery - Plataforma Descentralizada de Entregas

**Solução blockchain para revolucionar o mercado de entregas através da descentralização, transparência e automação de pagamentos.**

## 🎯 Visão Geral

Meridian Delivery é uma plataforma descentralizada construída na blockchain Stellar que resolve os principais problemas do mercado tradicional de entregas:

### ❌ Problemas Identificados

1. **Falta de Confiança**: Solicitantes temem pagar sem receber, transportadoras temem entregar sem ser pagas
2. **Centralização e Intermediários**: Plataformas centralizadas cobram altas taxas e podem atrasar processos
3. **Falta de Transparência**: Informações podem ser alteradas, falsificadas ou excluídas
4. **Atrasos nos Pagamentos**: Transportadoras podem esperar até 30 dias para receber

### ✅ Nossa Solução

- **Escrow Inteligente**: Contratos inteligentes garantem pagamentos seguros
- **Descentralização Total**: Sem intermediários, reduzindo custos e aumentando eficiência
- **Transparência Completa**: Todas as transações registradas na blockchain
- **Pagamentos Instantâneos**: Liberação automática após confirmação de entrega

## 🏗️ Arquitetura Técnica

### Smart Contracts (Rust/Soroban)

- **DeliveryEscrowContract**: Contrato principal para gestão de entregas
- Funcionalidades: criação, aceitação, rastreamento e pagamento de entregas
- Validações automáticas de regras de negócio
- Sistema de escrow nativo integrado

### Frontend (React + TypeScript)

- Interface moderna construída com Stellar Design System
- Duas interfaces principais: Solicitantes e Transportadores
- Integração nativa com carteiras Stellar
- Notificações em tempo real de transações

### Tecnologias Utilizadas

- ⚡️ Vite + React + TypeScript
- 🔗 Stellar SDK & Soroban
- 🎨 Stellar Design System
- 🔐 Stellar Wallet Kit
- 🧪 Stellar CLI para deployment

## 🚦 Como Funciona

### Para Solicitantes

1. **Conectar Carteira**: Integração com carteiras Stellar
2. **Criar Solicitação**: Definir origem, destino, descrição e valor
3. **Depósito Automático**: Valor fica em escrow no smart contract
4. **Acompanhar Entrega**: Transparência total do processo
5. **Liberação Automática**: Pagamento liberado após confirmação

### Para Transportadores

1. **Explorar Oportunidades**: Ver entregas disponíveis em tempo real
2. **Aceitar Trabalhos**: Comprometer-se com entregas específicas
3. **Atualizar Status**: Confirmar coleta, trânsito e entrega
4. **Receber Pagamento**: Liberação instantânea na blockchain

### Fluxo de Estados

```
Open → Accepted → PickedUp → InTransit → Delivered → Completed
```

## 💰 Economia do Token

- **Moeda**: XLM (Stellar Lumens)
- **Taxa**: 0% - sem intermediários
- **Escrow**: Depósito automático em smart contract
- **Liberação**: Instantânea após confirmação
- **Transparência**: Todas as transações auditáveis

## 🛠️ Requisitos Técnicos

Antes de começar, certifique-se de ter instalado:

- [Rust](https://www.rust-lang.org/tools/install) (para smart contracts)
- [Node.js](https://nodejs.org/en/download/package-manager) (v22+)
- [Stellar CLI](https://developers.stellar.org/docs/tools/cli/stellar-cli)
- [Git](https://git-scm.com/downloads)

## 🚀 Como Rodar o Projeto

### 1. Pré-requisitos

Certifique-se de ter instalado:

```bash
# Node.js (versão 18+)
node --version

# npm
npm --version

# Git
git --version

# Rust (para smart contracts - opcional)
rustc --version
```

### 2. Clone e Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd cargo

# Instalar dependências
npm install
```

### 3. Executar o Projeto

#### Opção A: Apenas Frontend (Recomendado para demonstração)

```bash
# Iniciar apenas o servidor de desenvolvimento
npx vite

# Acesse: http://localhost:5173/
```

#### Opção B: Com Blockchain Stellar (Desenvolvimento completo)

```bash
# Iniciar com blockchain local
npm run dev

# Acesse: http://localhost:5173/
```

**Nota**: Se houver problemas com a rede Stellar local, use a Opção A.

### 4. Funcionalidades Implementadas

#### ✅ Interface e UX

- ✅ **Logo Personalizado**: CARGO TRUST com design único
- ✅ **Design Responsivo**: Funciona em desktop, tablet e mobile
- ✅ **Sistema de Notificações**: Animações suaves e elegantes
- ✅ **Navegação Intuitiva**: Menu claro entre páginas
- ✅ **Feedback Visual**: Estados de loading e confirmação

#### ✅ Gestão de Entregas

- ✅ **Criação de Entregas**: Formulário completo para solicitantes
- ✅ **Aceitação de Entregas**: Interface para transportadores
- ✅ **Atualização de Status**: Fluxo completo de estados
- ✅ **Persistência de Dados**: Banco de dados local funcional
- ✅ **Atualização Automática**: Sem necessidade de recarregar página

#### ✅ Sistema de Estados

- ✅ **Fluxo Completo**: Open → Accepted → PickedUp → InTransit → Delivered → Completed
- ✅ **Validações**: Campos obrigatórios e validações de formulário
- ✅ **Notificações**: Confirmação de cada mudança de status
- ✅ **Histórico**: Rastreamento completo das entregas

#### ✅ Tecnologias

- ✅ **React + TypeScript**: Interface moderna e tipada
- ✅ **Stellar Design System**: Componentes consistentes
- ✅ **Vite**: Build rápido e eficiente
- ✅ **LocalStorage**: Persistência de dados local
- ✅ **CSS Animations**: Transições suaves

#### 🔗 Blockchain (Opcional)

- ✅ **Smart Contracts**: Contrato de escrow em Rust/Soroban
- ✅ **Integração Stellar**: Carteiras e transações
- ✅ **Deploy Automático**: Scripts de deployment
- ✅ **Configuração Flexível**: Testnet/Mainnet

### 5. Navegação

1. **Página Inicial** (`/`): Para solicitantes criarem entregas
2. **Transportadores** (`/carriers`): Para transportadores aceitarem entregas
3. **Sobre Nós** (`/about`): Informações sobre o projeto

### 6. Testando o Sistema

#### Como Solicitante:

1. Acesse a página inicial
2. Clique em "Criar Nova Entrega"
3. Preencha os dados da entrega
4. Clique em "Criar Entrega"
5. Veja a notificação de sucesso

#### Como Transportador:

1. Acesse "Transportadores" no menu
2. Veja entregas disponíveis
3. Clique em "Aceitar" em uma entrega
4. Atualize o status da entrega
5. Veja as notificações de atualização

### 7. Solução de Problemas

#### Erro de Rede Stellar

```bash
# Se houver problemas com blockchain local
npx vite  # Use apenas o frontend
```

#### Erro de Dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Erro de Compilação

```bash
# Verificar erros TypeScript
npm run build
```

### 8. Deploy dos Contratos (Opcional)

#### Testnet

```bash
# Compilar contratos
cd contracts/cargo-trust
cargo build --target wasm32-unknown-unknown --release

# Deploy usando Stellar CLI
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/cargo_trust.wasm \
  --source <sua-chave-privada> \
  --network testnet
```

#### Configuração para Produção

```bash
# Atualizar environments.toml com contract-id
# Editar src/contracts/util.ts para usar testnet/mainnet
```

## 📁 Estrutura do Projeto

```
meridian_delivery_project/
├── contracts/
│   └── cargo-trust/            # Smart contract de escrow
│       ├── src/
│       │   ├── lib.rs          # Lógica do contrato
│       │   └── test.rs         # Testes unitários
│       └── Cargo.toml
├── src/
│   ├── components/              # Componentes React
│   │   ├── CargoTrustLogo.tsx  # Logo personalizado
│   │   ├── DatabaseStatus.tsx  # Status do banco
│   │   ├── DatabaseTest.tsx    # Testes do banco
│   │   └── Notification.tsx    # Sistema de notificações
│   ├── database/               # Persistência de dados
│   │   ├── simpleDatabase.ts   # Serviço de banco local
│   │   └── schema.sql          # Schema do banco
│   ├── hooks/                  # Hooks customizados
│   │   ├── useWallet.ts        # Hook para carteira
│   │   ├── useDeliveryContract.ts # Hook do contrato
│   │   ├── useDeliveries.ts    # Hook de entregas
│   │   ├── useScrollLock.ts    # Hook de scroll
│   │   └── useModalFix.ts      # Hook de modal
│   ├── pages/
│   │   ├── Home.tsx            # Página dos solicitantes
│   │   ├── Carriers.tsx        # Página dos transportadores
│   │   └── About.tsx           # Página sobre o projeto
│   ├── contracts/
│   │   ├── cargoTrust.ts       # Cliente do contrato
│   │   └── util.ts             # Utilitários
│   └── App.tsx                 # Aplicação principal
├── dist/                       # Build de produção
├── target/                     # Artefatos de build Rust
├── environments.toml           # Configuração Stellar
├── package.json                # Dependências Node.js
├── vite.config.ts              # Configuração Vite
└── README.md                   # Esta documentação
```

## 🧪 Testes

### Smart Contracts

```bash
# Executar testes do contrato
cd contracts/delivery_escrow
cargo test
```

### Frontend

```bash
# Testes unitários
npm test

# Testes E2E
npm run test:e2e
```

## 🚢 Deploy e Produção

### Preparação

1. Configurar variáveis de ambiente para produção
2. Compilar contratos para otimização
3. Build da aplicação frontend

### Deploy Automatizado

```bash
# Script de deploy completo
./scripts/deploy.sh testnet
./scripts/deploy.sh mainnet
```

## 📈 Roadmap

### Fase 1: MVP ✅

- ✅ Smart contract básico de escrow
- ✅ Interface para solicitantes
- ✅ Interface para transportadores
- ✅ Integração com carteiras Stellar

### Fase 2: Expansão 🚧

- 🔄 Sistema de reputação
- 🔄 Integração com APIs de mapas
- 🔄 Notificações push
- 🔄 Sistema de disputa

### Fase 3: Escala 📋

- 📋 Multi-moedas (tokens personalizados)
- 📋 Integração com IoT para rastreamento
- 📋 Marketplace de transportadores
- 📋 API pública para terceiros

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Distribuído sob a licença Apache 2.0. Veja `LICENSE` para mais informações.

## 🏆 Hackathon Submission

Este projeto foi desenvolvido para demonstrar como a blockchain Stellar pode revolucionar o mercado de entregas através de:

- **Descentralização**: Eliminação de intermediários
- **Transparência**: Auditabilidade completa
- **Automação**: Contratos inteligentes para pagamentos
- **Eficiência**: Redução de custos e tempo

### Diferenciais Técnicos

- Uso nativo do ecossistema Stellar
- Smart contracts em Rust/Soroban
- Interface moderna e responsiva
- Integração com carteiras existentes
- Sistema de escrow robusto

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento (apenas frontend)
npx vite

# Executar com blockchain (se disponível)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Debugging

```bash
# Verificar erros de TypeScript
npx tsc --noEmit

# Verificar erros de lint
npm run lint

# Limpar cache
rm -rf node_modules package-lock.json
npm install
```

### Blockchain (Opcional)

```bash
# Compilar contratos
cd contracts/cargo-trust
cargo build --target wasm32-unknown-unknown --release

# Verificar status da rede Stellar
stellar network status

# Parar container local
stellar network container stop local
```

## 📱 Screenshots

### Página Inicial

- Logo CARGO TRUST personalizado
- Formulário de criação de entregas
- Lista de entregas do usuário
- Sistema de notificações

### Página Transportadores

- Lista de entregas disponíveis
- Interface de aceitação
- Gestão de status das entregas
- Badges animados ("Calculando...")

### Sistema de Notificações

- Notificações de sucesso (verde)
- Notificações de erro (vermelho)
- Animações suaves
- Auto-fechamento

---

**Meridian Delivery** - Transformando entregas através da blockchain 🚀

**CARGO TRUST** - Confiança em cada entrega 📦
