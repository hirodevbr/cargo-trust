# 🚀 - Decentralized Delivery Platform

**Blockchain solution to revolutionize the delivery market through decentralization, transparency and payment automation.**

## 🎯 Overview

Cargo Trust is a decentralized platform built on Stellar blockchain that solves the main problems of the traditional delivery market:

### ❌ Identified Problems

1. **Lack of Trust**: Requesters fear paying without receiving, carriers fear delivering without being paid
2. **Centralization and Intermediaries**: Centralized platforms charge high fees and can delay processes
3. **Lack of Transparency**: Information can be altered, falsified or deleted
4. **Payment Delays**: Carriers can wait up to 30 days to receive payment

### ✅ Our Solution

- **Smart Escrow**: Smart contracts ensure secure payments
- **Total Decentralization**: No intermediaries, reducing costs and increasing efficiency
- **Complete Transparency**: All transactions recorded on blockchain
- **Instant Payments**: Automatic release after delivery confirmation

## 🏗️ Technical Architecture

### Smart Contracts (Rust/Soroban)

- **DeliveryEscrowContract**: Main contract for delivery management
- Features: creation, acceptance, tracking and payment of deliveries
- Automatic validation of business rules
- Native integrated escrow system

### Frontend (React + TypeScript)

- Modern interface built with Stellar Design System
- Two main interfaces: Requesters and Carriers
- Native integration with Stellar wallets
- Real-time transaction notifications

### Technologies Used

- ⚡️ Vite + React + TypeScript
- 🔗 Stellar SDK & Soroban
- 🎨 Stellar Design System
- 🔐 Stellar Wallet Kit
- 🧪 Stellar CLI for deployment

## 🚦 How It Works

### For Requesters

1. **Connect Wallet**: Integration with Stellar wallets
2. **Create Request**: Define origin, destination, description and value
3. **Automatic Deposit**: Value stays in escrow in smart contract
4. **Track Delivery**: Complete transparency of the process
5. **Automatic Release**: Payment released after confirmation

### For Carriers

1. **Explore Opportunities**: See available deliveries in real-time
2. **Accept Jobs**: Commit to specific deliveries
3. **Update Status**: Confirm pickup, transit and delivery
4. **Receive Payment**: Instant release on blockchain

### State Flow

```
Open → Accepted → PickedUp → InTransit → Delivered → Completed
```

## 💰 Token Economy

- **Currency**: XLM (Stellar Lumens)
- **Fee**: 0% - no intermediaries
- **Escrow**: Automatic deposit in smart contract
- **Release**: Instant after confirmation
- **Transparency**: All transactions auditable

## 🛠️ Technical Requirements

Before starting, make sure you have installed:

- [Rust](https://www.rust-lang.org/tools/install) (for smart contracts)
- [Node.js](https://nodejs.org/en/download/package-manager) (v22+)
- [Stellar CLI](https://developers.stellar.org/docs/tools/cli/stellar-cli)
- [Git](https://git-scm.com/downloads)

## 🚀 How to Run the Project

### 1. Prerequisites

Make sure you have installed:

```bash
# Node.js (version 18+)
node --version

# npm
npm --version

# Git
git --version

# Rust (for smart contracts - optional)
rustc --version
```

### 2. Clone and Installation

```bash
# Clone the repository
git clone <repository-url>
cd cargo-trust

# Install dependencies
npm install
```

### 3. Run the Project

#### Option A: Frontend Only (Recommended for demonstration)

```bash
# Start only the development server
npx vite

# Access: http://localhost:5173/
```

#### Option B: With Stellar Blockchain (Complete development)

```bash
# Start with local blockchain
npm run dev

# Access: http://localhost:5173/
```

**Note**: If there are problems with the local Stellar network, use Option A.

### 4. Implemented Features

#### ✅ Interface and UX

- ✅ **Custom Logo**: CARGO TRUST with unique design
- ✅ **Responsive Design**: Works on desktop, tablet and mobile
- ✅ **Notification System**: Smooth and elegant animations
- ✅ **Intuitive Navigation**: Clear menu between pages
- ✅ **Visual Feedback**: Loading and confirmation states

#### ✅ Delivery Management

- ✅ **Delivery Creation**: Complete form for requesters
- ✅ **Delivery Acceptance**: Interface for carriers
- ✅ **Status Updates**: Complete state flow
- ✅ **Data Persistence**: Functional local database
- ✅ **Automatic Updates**: No need to reload page

#### ✅ State System

- ✅ **Complete Flow**: Open → Accepted → PickedUp → InTransit → Delivered → Completed
- ✅ **Validations**: Required fields and form validations
- ✅ **Notifications**: Confirmation of each status change
- ✅ **History**: Complete delivery tracking

#### ✅ Technologies

- ✅ **React + TypeScript**: Modern and typed interface
- ✅ **Stellar Design System**: Consistent components
- ✅ **Vite**: Fast and efficient build
- ✅ **LocalStorage**: Local data persistence
- ✅ **CSS Animations**: Smooth transitions

#### 🔗 Blockchain (Optional)

- ✅ **Smart Contracts**: Escrow contract in Rust/Soroban
- ✅ **Stellar Integration**: Wallets and transactions
- ✅ **Automatic Deploy**: Deployment scripts
- ✅ **Flexible Configuration**: Testnet/Mainnet

### 5. Navigation

1. **Home Page** (`/`): For requesters to create deliveries
2. **Carriers** (`/carriers`): For carriers to accept deliveries
3. **About Us** (`/about`): Information about the project

### 6. Testing the System

#### As Requester:

1. Access the home page
2. Click "Create New Delivery"
3. Fill in delivery data
4. Click "Create Delivery"
5. See success notification

#### As Carrier:

1. Access "Carriers" in the menu
2. See available deliveries
3. Click "Accept" on a delivery
4. Update delivery status
5. See update notifications

### 7. Troubleshooting

#### Stellar Network Error

```bash
# If there are problems with local blockchain
npx vite  # Use only frontend
```

#### Dependencies Error

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Compilation Error

```bash
# Check TypeScript errors
npm run build
```

### 8. Contract Deployment (Optional)

#### Testnet

```bash
# Compile contracts
cd contracts/cargo-trust
cargo build --target wasm32-unknown-unknown --release

# Deploy using Stellar CLI
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/cargo_trust.wasm \
  --source <your-private-key> \
  --network testnet
```

#### Production Configuration

```bash
# Update environments.toml with contract-id
# Edit src/contracts/util.ts to use testnet/mainnet
```

## 📁 Project Structure

```
cargo-trust/
├── contracts/
│   └── cargo-trust/            # Escrow smart contract
│       ├── src/
│       │   ├── lib.rs          # Contract logic
│       │   └── test.rs         # Unit tests
│       └── Cargo.toml
├── src/
│   ├── components/              # React components
│   │   ├── CargoTrustLogo.tsx  # Custom logo
│   │   ├── ConnectAccount.tsx  # Account connection
│   │   ├── Notification.tsx    # Notification system
│   │   └── WalletButton.tsx    # Wallet button
│   ├── database/               # Data persistence
│   │   ├── simpleDatabase.ts   # Local database service
│   │   └── schema.sql          # Database schema
│   ├── hooks/                  # Custom hooks
│   │   ├── useWallet.ts        # Wallet hook
│   │   ├── useDeliveryContract.ts # Contract hook
│   │   ├── useDeliveries.ts    # Deliveries hook
│   │   ├── useScrollLock.ts    # Scroll lock hook
│   │   └── useModalFix.ts      # Modal fix hook
│   ├── pages/
│   │   ├── Home.tsx            # Requesters page
│   │   ├── Carriers.tsx        # Carriers page
│   │   └── About.tsx           # About project page
│   ├── contracts/
│   │   ├── cargoTrust.ts       # Contract client
│   │   └── util.ts             # Utilities
│   └── App.tsx                 # Main application
├── dist/                       # Production build
├── target/                     # Rust build artifacts
├── environments.toml           # Stellar configuration
├── package.json                # Node.js dependencies
├── vite.config.ts              # Vite configuration
└── README.md                   # This documentation
```

## 🧪 Tests

### Smart Contracts

```bash
# Run contract tests
cd contracts/cargo-trust
cargo test
```

### Frontend

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## 🚢 Deploy and Production

### Preparation

1. Configure environment variables for production
2. Compile contracts for optimization
3. Build frontend application

### Automated Deploy

```bash
# Complete deploy script
./scripts/deploy.sh testnet
./scripts/deploy.sh mainnet
```

## 📈 Roadmap

### Phase 1: MVP ✅

- ✅ Basic escrow smart contract
- ✅ Interface for requesters
- ✅ Interface for carriers
- ✅ Stellar wallet integration

### Phase 2: Expansion 🚧

- 🔄 Reputation system
- 🔄 Maps API integration
- 🔄 Push notifications
- 🔄 Dispute system

### Phase 3: Scale 📋

- 📋 Multi-currencies (custom tokens)
- 📋 IoT integration for tracking
- 📋 Carrier marketplace
- 📋 Public API for third parties

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🏆 Hackathon Submission

This project was developed to demonstrate how Stellar blockchain can revolutionize the delivery market through:

- **Decentralization**: Elimination of intermediaries
- **Transparency**: Complete auditability
- **Automation**: Smart contracts for payments
- **Efficiency**: Cost and time reduction

### Technical Differentiators

- Native use of Stellar ecosystem
- Smart contracts in Rust/Soroban
- Modern and responsive interface
- Integration with existing wallets
- Robust escrow system

## 🛠️ Useful Commands

### Development

```bash
# Install dependencies
npm install

# Run in development mode (frontend only)
npx vite

# Run with blockchain (if available)
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

### Debugging

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check lint errors
npm run lint

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Blockchain (Optional)

```bash
# Compile contracts
cd contracts/cargo-trust
cargo build --target wasm32-unknown-unknown --release

# Check Stellar network status
stellar network status

# Stop local container
stellar network container stop local
```

## 📱 Screenshots

### Home Page

- Custom CARGO TRUST logo
- Delivery creation form
- User's delivery list
- Notification system

### Carriers Page

- Available deliveries list
- Acceptance interface
- Delivery status management
- Animated badges ("Calculating...")

### Notification System

- Success notifications (green)
- Error notifications (red)
- Smooth animations
- Auto-close

---

**Cargo Trust** - Transforming deliveries through blockchain 🚀

**CARGO TRUST** - Trust in every delivery 📦
