-- Schema do banco de dados SQLite para Meridian Delivery
-- Tabela de entregas (deliveries)

CREATE TABLE IF NOT EXISTS deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    description TEXT NOT NULL,
    amount TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'accepted', 'picked_up', 'in_transit', 'delivered', 'completed')),
    deadline TEXT NOT NULL,
    requester TEXT NOT NULL,
    carrier TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    distance TEXT,
    estimated_time TEXT,
    contract_address TEXT,
    transaction_hash TEXT
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_deliveries_requester ON deliveries(requester);
CREATE INDEX IF NOT EXISTS idx_deliveries_carrier ON deliveries(carrier);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_created_at ON deliveries(created_at);

-- Tabela de usuários (opcional, para futuras funcionalidades)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Índice para busca por endereço
CREATE INDEX IF NOT EXISTS idx_users_address ON users(address);

-- Tabela de transações blockchain (para auditoria)
CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    delivery_id INTEGER NOT NULL,
    transaction_hash TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('create', 'accept', 'pickup', 'deliver', 'complete', 'refund')),
    block_number INTEGER,
    gas_used INTEGER,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
    created_at INTEGER NOT NULL,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id)
);

-- Índices para transações
CREATE INDEX IF NOT EXISTS idx_transactions_delivery_id ON blockchain_transactions(delivery_id);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON blockchain_transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON blockchain_transactions(transaction_type);
