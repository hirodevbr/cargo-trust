
import initSqlJs from 'sql.js';
import schema from './schema.sql?raw';

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

class DatabaseService {
  private db: any = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Carregar SQL.js
      const SQL = await initSqlJs({
        // Usar CDN para carregar o arquivo wasm
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`
      });

      // Tentar carregar dados existentes do localStorage
      const savedData = localStorage.getItem('meridian_delivery_db');
      let data: Uint8Array | undefined;

      if (savedData) {
        // Converter string base64 para Uint8Array
        const binaryString = atob(savedData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        data = bytes;
      }

      // Criar ou carregar banco de dados
      this.db = new SQL.Database(data);

      // Executar schema se o banco estiver vazio
      if (!savedData) {
        this.db.exec(schema);
        this.saveToLocalStorage();
      }

      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private saveToLocalStorage(): void {
    if (!this.db) return;

    try {
      const data = this.db.export();
      const binaryString = btoa(String.fromCharCode(...data));
      localStorage.setItem('meridian_delivery_db', binaryString);
    } catch (error) {
      console.error('Failed to save database to localStorage:', error);
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized || !this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
  }

  // Operações de Delivery
  async createDelivery(delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>): Promise<Delivery> {
    this.ensureInitialized();

    const now = Date.now();
    const stmt = this.db.prepare(`
      INSERT INTO deliveries (origin, destination, description, amount, status, deadline, requester, carrier, created_at, updated_at, distance, estimated_time, contract_address, transaction_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      delivery.origin,
      delivery.destination,
      delivery.description,
      delivery.amount,
      delivery.status,
      delivery.deadline,
      delivery.requester,
      delivery.carrier || null,
      now,
      now,
      delivery.distance || null,
      delivery.estimatedTime || null,
      delivery.contractAddress || null,
      delivery.transactionHash || null
    ]);

    const newDelivery: Delivery = {
      id: this.db.exec("SELECT last_insert_rowid() as id")[0].values[0][0],
      ...delivery,
      createdAt: now,
      updatedAt: now
    };

    this.saveToLocalStorage();
    return newDelivery;
  }

  async getDeliveryById(id: number): Promise<Delivery | null> {
    this.ensureInitialized();

    const stmt = this.db.prepare('SELECT * FROM deliveries WHERE id = ?');
    const result = stmt.getAsObject([id]);

    if (!result.id) return null;

    return {
      id: result.id,
      origin: result.origin,
      destination: result.destination,
      description: result.description,
      amount: result.amount,
      status: result.status,
      deadline: result.deadline,
      requester: result.requester,
      carrier: result.carrier,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      distance: result.distance,
      estimatedTime: result.estimated_time,
      contractAddress: result.contract_address,
      transactionHash: result.transaction_hash
    };
  }

  async getDeliveriesByRequester(requester: string): Promise<Delivery[]> {
    this.ensureInitialized();

    const stmt = this.db.prepare('SELECT * FROM deliveries WHERE requester = ? ORDER BY created_at DESC');
    const results = stmt.allAsObject([requester]);

    return results.map((result: any) => ({
      id: result.id,
      origin: result.origin,
      destination: result.destination,
      description: result.description,
      amount: result.amount,
      status: result.status,
      deadline: result.deadline,
      requester: result.requester,
      carrier: result.carrier,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      distance: result.distance,
      estimatedTime: result.estimated_time,
      contractAddress: result.contract_address,
      transactionHash: result.transaction_hash
    }));
  }

  async getDeliveriesByCarrier(carrier: string): Promise<Delivery[]> {
    this.ensureInitialized();

    const stmt = this.db.prepare('SELECT * FROM deliveries WHERE carrier = ? ORDER BY created_at DESC');
    const results = stmt.allAsObject([carrier]);

    return results.map((result: any) => ({
      id: result.id,
      origin: result.origin,
      destination: result.destination,
      description: result.description,
      amount: result.amount,
      status: result.status,
      deadline: result.deadline,
      requester: result.requester,
      carrier: result.carrier,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      distance: result.distance,
      estimatedTime: result.estimated_time,
      contractAddress: result.contract_address,
      transactionHash: result.transaction_hash
    }));
  }

  async getOpenDeliveries(): Promise<Delivery[]> {
    this.ensureInitialized();

    const stmt = this.db.prepare('SELECT * FROM deliveries WHERE status = ? ORDER BY created_at DESC');
    const results = stmt.allAsObject(['open']);

    return results.map((result: any) => ({
      id: result.id,
      origin: result.origin,
      destination: result.destination,
      description: result.description,
      amount: result.amount,
      status: result.status,
      deadline: result.deadline,
      requester: result.requester,
      carrier: result.carrier,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      distance: result.distance,
      estimatedTime: result.estimated_time,
      contractAddress: result.contract_address,
      transactionHash: result.transaction_hash
    }));
  }

  async updateDeliveryStatus(id: number, status: Delivery['status'], carrier?: string): Promise<void> {
    this.ensureInitialized();

    const now = Date.now();
    const stmt = this.db.prepare(`
      UPDATE deliveries 
      SET status = ?, carrier = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run([status, carrier || null, now, id]);
    this.saveToLocalStorage();
  }

  async updateDelivery(id: number, updates: Partial<Delivery>): Promise<void> {
    this.ensureInitialized();

    const now = Date.now();
    const fields = [];
    const values = [];

    if (updates.origin !== undefined) {
      fields.push('origin = ?');
      values.push(updates.origin);
    }
    if (updates.destination !== undefined) {
      fields.push('destination = ?');
      values.push(updates.destination);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.amount !== undefined) {
      fields.push('amount = ?');
      values.push(updates.amount);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.deadline !== undefined) {
      fields.push('deadline = ?');
      values.push(updates.deadline);
    }
    if (updates.carrier !== undefined) {
      fields.push('carrier = ?');
      values.push(updates.carrier);
    }
    if (updates.distance !== undefined) {
      fields.push('distance = ?');
      values.push(updates.distance);
    }
    if (updates.estimatedTime !== undefined) {
      fields.push('estimated_time = ?');
      values.push(updates.estimatedTime);
    }
    if (updates.contractAddress !== undefined) {
      fields.push('contract_address = ?');
      values.push(updates.contractAddress);
    }
    if (updates.transactionHash !== undefined) {
      fields.push('transaction_hash = ?');
      values.push(updates.transactionHash);
    }

    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);

    const stmt = this.db.prepare(`UPDATE deliveries SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(values);
    this.saveToLocalStorage();
  }

  async deleteDelivery(id: number): Promise<void> {
    this.ensureInitialized();

    const stmt = this.db.prepare('DELETE FROM deliveries WHERE id = ?');
    stmt.run([id]);
    this.saveToLocalStorage();
  }

  // Operações de User
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    this.ensureInitialized();

    const now = Date.now();
    const stmt = this.db.prepare(`
      INSERT INTO users (address, name, email, phone, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      user.address,
      user.name || null,
      user.email || null,
      user.phone || null,
      now,
      now
    ]);

    const newUser: User = {
      id: this.db.exec("SELECT last_insert_rowid() as id")[0].values[0][0],
      ...user,
      createdAt: now,
      updatedAt: now
    };

    this.saveToLocalStorage();
    return newUser;
  }

  async getUserByAddress(address: string): Promise<User | null> {
    this.ensureInitialized();

    const stmt = this.db.prepare('SELECT * FROM users WHERE address = ?');
    const result = stmt.getAsObject([address]);

    if (!result.id) return null;

    return {
      id: result.id,
      address: result.address,
      name: result.name,
      email: result.email,
      phone: result.phone,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
  }

  // Operações de Blockchain Transaction
  async createTransaction(transaction: Omit<BlockchainTransaction, 'id' | 'createdAt'>): Promise<BlockchainTransaction> {
    this.ensureInitialized();

    const now = Date.now();
    const stmt = this.db.prepare(`
      INSERT INTO blockchain_transactions (delivery_id, transaction_hash, transaction_type, block_number, gas_used, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      transaction.deliveryId,
      transaction.transactionHash,
      transaction.transactionType,
      transaction.blockNumber || null,
      transaction.gasUsed || null,
      transaction.status,
      now
    ]);

    const newTransaction: BlockchainTransaction = {
      id: this.db.exec("SELECT last_insert_rowid() as id")[0].values[0][0],
      ...transaction,
      createdAt: now
    };

    this.saveToLocalStorage();
    return newTransaction;
  }

  async getTransactionsByDeliveryId(deliveryId: number): Promise<BlockchainTransaction[]> {
    this.ensureInitialized();

    const stmt = this.db.prepare('SELECT * FROM blockchain_transactions WHERE delivery_id = ? ORDER BY created_at DESC');
    const results = stmt.allAsObject([deliveryId]);

    return results.map((result: any) => ({
      id: result.id,
      deliveryId: result.delivery_id,
      transactionHash: result.transaction_hash,
      transactionType: result.transaction_type,
      blockNumber: result.block_number,
      gasUsed: result.gas_used,
      status: result.status,
      createdAt: result.created_at
    }));
  }

  // Métodos de utilidade
  async getAllDeliveries(): Promise<Delivery[]> {
    this.ensureInitialized();

    const stmt = this.db.prepare('SELECT * FROM deliveries ORDER BY created_at DESC');
    const results = stmt.allAsObject([]);

    return results.map((result: any) => ({
      id: result.id,
      origin: result.origin,
      destination: result.destination,
      description: result.description,
      amount: result.amount,
      status: result.status,
      deadline: result.deadline,
      requester: result.requester,
      carrier: result.carrier,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      distance: result.distance,
      estimatedTime: result.estimated_time,
      contractAddress: result.contract_address,
      transactionHash: result.transaction_hash
    }));
  }

  async clearDatabase(): Promise<void> {
    this.ensureInitialized();

    this.db.exec('DELETE FROM blockchain_transactions');
    this.db.exec('DELETE FROM deliveries');
    this.db.exec('DELETE FROM users');
    this.saveToLocalStorage();
  }

  async exportDatabase(): Promise<string> {
    this.ensureInitialized();
    const data = this.db.export();
    return btoa(String.fromCharCode(...data));
  }

  async importDatabase(data: string): Promise<void> {
    const binaryString = atob(data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const SQL = await initSqlJs();
    this.db = new SQL.Database(bytes);
    this.saveToLocalStorage();
  }
}

// Instância singleton
export const databaseService = new DatabaseService();
