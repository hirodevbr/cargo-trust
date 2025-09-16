export interface Delivery {
  id: number;
  origin: string;
  destination: string;
  description: string;
  amount: string;
  status: 'open' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'completed';
  deadline: string;
  requester: string;
  carrier?: string;
  createdAt: number;
  updatedAt: number;
  distance?: string;
  estimatedTime?: string;
  contractAddress?: string;
  transactionHash?: string;
}

export interface User {
  id: number;
  address: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt: number;
  updatedAt: number;
}

export interface BlockchainTransaction {
  id: number;
  deliveryId: number;
  transactionHash: string;
  transactionType: 'create' | 'accept' | 'pickup' | 'deliver' | 'complete' | 'refund';
  blockNumber?: number;
  gasUsed?: number;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: number;
}

class SimpleDatabaseService {
  private isInitialized = false;
  private deliveries: Delivery[] = [];
  private users: User[] = [];
  private transactions: BlockchainTransaction[] = [];
  private nextDeliveryId = 1;
  private nextUserId = 1;
  private nextTransactionId = 1;

  private readonly STORAGE_KEYS = {
    deliveries: 'meridian_deliveries',
    users: 'meridian_users',
    transactions: 'meridian_transactions',
    nextIds: 'meridian_next_ids'
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('✅ Database already initialized');
      return;
    }

    try {
      console.log('🔄 Initializing Simple Database...');
      // Carregar dados do localStorage
      await this.loadFromStorage();
      this.isInitialized = true;
      console.log('✅ Simple Database initialized successfully');
      console.log('📊 Data loaded:', {
        deliveries: this.deliveries.length,
        users: this.users.length,
        transactions: this.transactions.length
      });
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      throw error;
    }
  }

  private async loadFromStorage(): Promise<void> {
    try {
      console.log('📂 Loading data from localStorage...');
      
      // Inicializar arrays primeiro
      this.deliveries = [];
      this.users = [];
      this.transactions = [];
      
      // Carregar entregas
      const deliveriesData = localStorage.getItem(this.STORAGE_KEYS.deliveries);
      if (deliveriesData) {
        const parsedDeliveries = JSON.parse(deliveriesData);
        if (Array.isArray(parsedDeliveries)) {
          this.deliveries = parsedDeliveries;
          console.log('📦 Loaded deliveries:', this.deliveries.length);
        } else {
          console.log('📦 Invalid deliveries data, starting fresh');
          this.deliveries = [];
        }
      } else {
        console.log('📦 No deliveries found, starting fresh');
        this.deliveries = [];
      }

      // Carregar usuários
      const usersData = localStorage.getItem(this.STORAGE_KEYS.users);
      if (usersData) {
        const parsedUsers = JSON.parse(usersData);
        if (Array.isArray(parsedUsers)) {
          this.users = parsedUsers;
          console.log('👥 Loaded users:', this.users.length);
        } else {
          console.log('👥 Invalid users data, starting fresh');
          this.users = [];
        }
      } else {
        console.log('👥 No users found, starting fresh');
        this.users = [];
      }

      // Carregar transações
      const transactionsData = localStorage.getItem(this.STORAGE_KEYS.transactions);
      if (transactionsData) {
        const parsedTransactions = JSON.parse(transactionsData);
        if (Array.isArray(parsedTransactions)) {
          this.transactions = parsedTransactions;
          console.log('🔗 Loaded transactions:', this.transactions.length);
        } else {
          console.log('🔗 Invalid transactions data, starting fresh');
          this.transactions = [];
        }
      } else {
        console.log('🔗 No transactions found, starting fresh');
        this.transactions = [];
      }

      // Carregar próximos IDs
      const nextIdsData = localStorage.getItem(this.STORAGE_KEYS.nextIds);
      if (nextIdsData) {
        const nextIds = JSON.parse(nextIdsData);
        this.nextDeliveryId = nextIds.deliveryId || 1;
        this.nextUserId = nextIds.userId || 1;
        this.nextTransactionId = nextIds.transactionId || 1;
        console.log('🔢 Loaded next IDs:', { deliveryId: this.nextDeliveryId, userId: this.nextUserId, transactionId: this.nextTransactionId });
      } else {
        console.log('🔢 No next IDs found, starting from 1');
        this.nextDeliveryId = 1;
        this.nextUserId = 1;
        this.nextTransactionId = 1;
      }
      
      console.log('✅ Data loaded successfully from localStorage');
      console.log('🔍 Final arrays:', {
        deliveries: Array.isArray(this.deliveries) ? this.deliveries.length : 'NOT ARRAY',
        users: Array.isArray(this.users) ? this.users.length : 'NOT ARRAY',
        transactions: Array.isArray(this.transactions) ? this.transactions.length : 'NOT ARRAY'
      });
    } catch (error) {
      console.error('❌ Error loading from storage:', error);
      // Inicializar com dados vazios se houver erro
      this.deliveries = [];
      this.users = [];
      this.transactions = [];
      this.nextDeliveryId = 1;
      this.nextUserId = 1;
      this.nextTransactionId = 1;
      console.log('🔄 Initialized with empty data due to error');
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEYS.deliveries, JSON.stringify(this.deliveries));
      localStorage.setItem(this.STORAGE_KEYS.users, JSON.stringify(this.users));
      localStorage.setItem(this.STORAGE_KEYS.transactions, JSON.stringify(this.transactions));
      localStorage.setItem(this.STORAGE_KEYS.nextIds, JSON.stringify({
        deliveryId: this.nextDeliveryId,
        userId: this.nextUserId,
        transactionId: this.nextTransactionId
      }));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
  }

  // Operações de Delivery
  async createDelivery(delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>): Promise<Delivery> {
    this.ensureInitialized();

    // Garantir que deliveries é um array
    if (!Array.isArray(this.deliveries)) {
      console.log('🔧 Fixing deliveries array...');
      this.deliveries = [];
    }

    const now = Date.now();
    const newDelivery: Delivery = {
      ...delivery,
      id: this.nextDeliveryId++,
      createdAt: now,
      updatedAt: now
    };

    console.log('📝 Creating delivery:', newDelivery);
    console.log('📊 Current deliveries array:', Array.isArray(this.deliveries) ? this.deliveries.length : 'NOT ARRAY');
    
    this.deliveries.push(newDelivery);
    console.log('✅ Delivery added, new count:', this.deliveries.length);
    
    await this.saveToStorage();
    return newDelivery;
  }

  async getDeliveryById(id: number): Promise<Delivery | null> {
    this.ensureInitialized();
    return this.deliveries.find(delivery => delivery.id === id) || null;
  }

  async getDeliveriesByRequester(requester: string): Promise<Delivery[]> {
    this.ensureInitialized();
    return this.deliveries
      .filter(delivery => delivery.requester === requester)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async getDeliveriesByCarrier(carrier: string): Promise<Delivery[]> {
    this.ensureInitialized();
    return this.deliveries
      .filter(delivery => delivery.carrier === carrier)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async getOpenDeliveries(): Promise<Delivery[]> {
    this.ensureInitialized();
    return this.deliveries
      .filter(delivery => delivery.status === 'open')
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async updateDeliveryStatus(id: number, status: Delivery['status'], carrier?: string): Promise<void> {
    this.ensureInitialized();

    const delivery = this.deliveries.find(d => d.id === id);
    if (delivery) {
      delivery.status = status;
      delivery.updatedAt = Date.now();
      if (carrier) {
        delivery.carrier = carrier;
      }
      await this.saveToStorage();
    }
  }

  async updateDelivery(id: number, updates: Partial<Delivery>): Promise<void> {
    this.ensureInitialized();

    const delivery = this.deliveries.find(d => d.id === id);
    if (delivery) {
      Object.assign(delivery, updates);
      delivery.updatedAt = Date.now();
      await this.saveToStorage();
    }
  }

  async deleteDelivery(id: number): Promise<void> {
    this.ensureInitialized();

    const index = this.deliveries.findIndex(d => d.id === id);
    if (index !== -1) {
      this.deliveries.splice(index, 1);
      await this.saveToStorage();
    }
  }

  async getAllDeliveries(): Promise<Delivery[]> {
    this.ensureInitialized();
    return [...this.deliveries].sort((a, b) => b.createdAt - a.createdAt);
  }

  // Operações de User
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    this.ensureInitialized();

    const now = Date.now();
    const newUser: User = {
      ...user,
      id: this.nextUserId++,
      createdAt: now,
      updatedAt: now
    };

    this.users.push(newUser);
    await this.saveToStorage();
    return newUser;
  }

  async getUserByAddress(address: string): Promise<User | null> {
    this.ensureInitialized();
    return this.users.find(user => user.address === address) || null;
  }

  // Operações de Blockchain Transaction
  async createTransaction(transaction: Omit<BlockchainTransaction, 'id' | 'createdAt'>): Promise<BlockchainTransaction> {
    this.ensureInitialized();

    const now = Date.now();
    const newTransaction: BlockchainTransaction = {
      ...transaction,
      id: this.nextTransactionId++,
      createdAt: now
    };

    this.transactions.push(newTransaction);
    await this.saveToStorage();
    return newTransaction;
  }

  async getTransactionsByDeliveryId(deliveryId: number): Promise<BlockchainTransaction[]> {
    this.ensureInitialized();
    return this.transactions
      .filter(transaction => transaction.deliveryId === deliveryId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  // Métodos de utilidade
  async clearDatabase(): Promise<void> {
    this.ensureInitialized();

    this.deliveries = [];
    this.users = [];
    this.transactions = [];
    this.nextDeliveryId = 1;
    this.nextUserId = 1;
    this.nextTransactionId = 1;

    await this.saveToStorage();
  }

  async exportDatabase(): Promise<string> {
    this.ensureInitialized();
    return JSON.stringify({
      deliveries: this.deliveries,
      users: this.users,
      transactions: this.transactions,
      nextIds: {
        deliveryId: this.nextDeliveryId,
        userId: this.nextUserId,
        transactionId: this.nextTransactionId
      }
    });
  }

  async importDatabase(data: string): Promise<void> {
    try {
      const imported = JSON.parse(data);
      this.deliveries = imported.deliveries || [];
      this.users = imported.users || [];
      this.transactions = imported.transactions || [];
      
      if (imported.nextIds) {
        this.nextDeliveryId = imported.nextIds.deliveryId || 1;
        this.nextUserId = imported.nextIds.userId || 1;
        this.nextTransactionId = imported.nextIds.transactionId || 1;
      }

      await this.saveToStorage();
    } catch (error) {
      console.error('Error importing database:', error);
      throw error;
    }
  }

  // Métodos de busca avançada
  async searchDeliveries(query: string): Promise<Delivery[]> {
    this.ensureInitialized();
    const lowerQuery = query.toLowerCase();
    
    return this.deliveries.filter(delivery => 
      delivery.origin.toLowerCase().includes(lowerQuery) ||
      delivery.destination.toLowerCase().includes(lowerQuery) ||
      delivery.description.toLowerCase().includes(lowerQuery) ||
      delivery.requester.toLowerCase().includes(lowerQuery) ||
      (delivery.carrier && delivery.carrier.toLowerCase().includes(lowerQuery))
    ).sort((a, b) => b.createdAt - a.createdAt);
  }

  async getDeliveriesByStatus(status: Delivery['status']): Promise<Delivery[]> {
    this.ensureInitialized();
    return this.deliveries
      .filter(delivery => delivery.status === status)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async getDeliveriesByDateRange(startDate: number, endDate: number): Promise<Delivery[]> {
    this.ensureInitialized();
    return this.deliveries
      .filter(delivery => delivery.createdAt >= startDate && delivery.createdAt <= endDate)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
}

// Instância singleton
export const databaseService = new SimpleDatabaseService();
