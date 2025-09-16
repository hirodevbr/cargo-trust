# 🗄️ Banco de Dados Meridian Delivery

## 📋 Visão Geral

O Meridian Delivery utiliza um sistema de banco de dados simplificado baseado em **localStorage** para persistir dados de entregas, usuários e transações blockchain.

## 🏗️ Arquitetura

### Estrutura de Dados

#### **Tabela: Deliveries (Entregas)**
```typescript
interface Delivery {
  id: number;                    // ID único da entrega
  origin: string;                // Origem da entrega
  destination: string;           // Destino da entrega
  description: string;           // Descrição do produto/serviço
  amount: string;                // Valor da entrega
  status: 'open' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'completed';
  deadline: string;              // Prazo de entrega
  requester: string;             // Endereço do solicitante
  carrier?: string;              // Endereço do transportador
  createdAt: number;             // Timestamp de criação
  updatedAt: number;             // Timestamp de última atualização
  distance?: string;             // Distância estimada
  estimatedTime?: string;        // Tempo estimado
  contractAddress?: string;      // Endereço do contrato
  transactionHash?: string;      // Hash da transação
}
```

#### **Tabela: Users (Usuários)**
```typescript
interface User {
  id: number;                    // ID único do usuário
  address: string;               // Endereço da carteira
  name?: string;                 // Nome do usuário
  email?: string;                // Email do usuário
  phone?: string;                // Telefone do usuário
  createdAt: number;             // Timestamp de criação
  updatedAt: number;             // Timestamp de última atualização
}
```

#### **Tabela: Blockchain Transactions (Transações)**
```typescript
interface BlockchainTransaction {
  id: number;                    // ID único da transação
  deliveryId: number;            // ID da entrega relacionada
  transactionHash: string;       // Hash da transação blockchain
  transactionType: 'create' | 'accept' | 'pickup' | 'deliver' | 'complete' | 'refund';
  blockNumber?: number;          // Número do bloco
  gasUsed?: number;              // Gas utilizado
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: number;             // Timestamp de criação
}
```

## 🔧 Funcionalidades

### Operações de Entregas
- ✅ **Criar entrega**: `createDelivery()`
- ✅ **Buscar por ID**: `getDeliveryById()`
- ✅ **Buscar por solicitante**: `getDeliveriesByRequester()`
- ✅ **Buscar por transportador**: `getDeliveriesByCarrier()`
- ✅ **Buscar abertas**: `getOpenDeliveries()`
- ✅ **Atualizar status**: `updateDeliveryStatus()`
- ✅ **Atualizar entrega**: `updateDelivery()`
- ✅ **Deletar entrega**: `deleteDelivery()`

### Operações de Usuários
- ✅ **Criar usuário**: `createUser()`
- ✅ **Buscar por endereço**: `getUserByAddress()`

### Operações de Transações
- ✅ **Criar transação**: `createTransaction()`
- ✅ **Buscar por entrega**: `getTransactionsByDeliveryId()`

### Operações de Utilidade
- ✅ **Buscar todas**: `getAllDeliveries()`
- ✅ **Limpar banco**: `clearDatabase()`
- ✅ **Exportar dados**: `exportDatabase()`
- ✅ **Importar dados**: `importDatabase()`
- ✅ **Busca avançada**: `searchDeliveries()`
- ✅ **Filtrar por status**: `getDeliveriesByStatus()`
- ✅ **Filtrar por data**: `getDeliveriesByDateRange()`

## 💾 Persistência

### localStorage Keys
```javascript
const STORAGE_KEYS = {
  deliveries: 'meridian_deliveries',
  users: 'meridian_users',
  transactions: 'meridian_transactions',
  nextIds: 'meridian_next_ids'
};
```

### Estrutura de Armazenamento
```json
{
  "deliveries": [...],
  "users": [...],
  "transactions": [...],
  "nextIds": {
    "deliveryId": 1,
    "userId": 1,
    "transactionId": 1
  }
}
```

## 🚀 Como Usar

### 1. Inicialização
```typescript
import { databaseService } from './database/simpleDatabase';

// Inicializar banco
await databaseService.initialize();
```

### 2. Criar Entrega
```typescript
const delivery = await databaseService.createDelivery({
  origin: 'São Paulo, SP',
  destination: 'Rio de Janeiro, RJ',
  description: 'Documentos importantes',
  amount: '100.00',
  deadline: '2025-12-31',
  requester: 'GDXN...K3LM'
});
```

### 3. Buscar Entregas
```typescript
// Por solicitante
const deliveries = await databaseService.getDeliveriesByRequester('GDXN...K3LM');

// Abertas
const openDeliveries = await databaseService.getOpenDeliveries();

// Por transportador
const carrierDeliveries = await databaseService.getDeliveriesByCarrier('GCAR...H4QW');
```

### 4. Atualizar Status
```typescript
// Aceitar entrega
await databaseService.updateDeliveryStatus(deliveryId, 'accepted', 'GCAR...H4QW');

// Atualizar para em trânsito
await databaseService.updateDeliveryStatus(deliveryId, 'in_transit');
```

## 🔍 Debug e Monitoramento

### Status do Banco
O componente `DatabaseStatus` mostra:
- ✅ Status da conexão (Conectado/Erro/Carregando)
- 📦 Número de entregas no banco
- ⏰ Timestamp do último teste

### Teste Automático
O arquivo `testDatabase.ts` executa testes automáticos:
- Inicialização do banco
- Criação de entrega de teste
- Busca e filtros
- Atualização de status

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Banco não inicializa**
   - Verificar se localStorage está disponível
   - Verificar console para erros

2. **Dados não persistem**
   - Verificar se `saveToStorage()` está sendo chamado
   - Verificar se localStorage tem espaço

3. **Performance lenta**
   - Considerar implementar paginação
   - Otimizar consultas com índices

### Logs de Debug
```javascript
// Habilitar logs detalhados
localStorage.setItem('debug_database', 'true');
```

## 🔄 Migração de Dados

### Exportar Dados
```typescript
const data = await databaseService.exportDatabase();
console.log(data); // JSON string
```

### Importar Dados
```typescript
await databaseService.importDatabase(jsonString);
```

## 📈 Próximos Passos

- [ ] Implementar paginação para grandes volumes
- [ ] Adicionar índices para consultas complexas
- [ ] Implementar backup automático
- [ ] Adicionar criptografia para dados sensíveis
- [ ] Migrar para SQLite real quando necessário

## 🎯 Vantagens

- ✅ **Simplicidade**: Fácil de entender e manter
- ✅ **Performance**: Rápido para volumes pequenos/médios
- ✅ **Persistência**: Dados não se perdem ao recarregar
- ✅ **Portabilidade**: Funciona em qualquer navegador
- ✅ **Debug**: Fácil de debugar e testar
- ✅ **Flexibilidade**: Fácil de estender e modificar
