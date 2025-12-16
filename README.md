# 0x_SCADA - Decentralized Industrial Control Fabric

A DePIN-style, blockchain-backed industrial SCADA system that uses blockchain for identity, audit, compliance, and event anchoring—while keeping real-time control logic safely off-chain.

## Architecture Overview

```
┌─────────────────┐
│  Field Layer    │  Simulated PLCs/RTUs generating industrial events
│  (Simulator)    │  (breaker trips, setpoint changes, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gateway Layer  │  Hashes events, anchors to blockchain, stores full
│  (Express API)  │  payload off-chain in PostgreSQL
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌──────────────┐  ┌──────────────┐
│ Blockchain   │  │  Database    │
│ (Hardhat)    │  │ (PostgreSQL) │
│              │  │              │
│ Immutable    │  │ Full Event   │
│ Hash Anchors │  │ Payloads     │
└──────────────┘  └──────────────┘
         │
         ▼
┌─────────────────┐
│  Dashboard UI   │  React SPA showing sites, assets, and event stream
│  (React/Vite)   │  with real-time updates
└─────────────────┘
```

## Safety & Design Principles

**Critical: NO real-time control on-chain.**  
All safety-critical logic, PID loops, and equipment control stays off-chain. The blockchain is purely for:
- Identity & registry (Sites, Assets)
- Immutable audit trail (Event hashes, Maintenance records)
- Tamper-evident proof (Payload verification)

## Current State (MVP)

### ✅ Implemented
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Sites, Assets, EventAnchors, MaintenanceRecords
- **Gateway API**: REST endpoints for CRUD operations
- **Field Simulator**: Auto-generates realistic industrial events every 10s
- **Event Hashing**: SHA-256 payload hashing before anchoring
- **Smart Contract**: Solidity contract for registry and event anchoring
- **Dashboard UI**: Real-time views of sites, assets, and event stream

### ⚠️ Blockchain Integration Status
The smart contract (`IndustrialRegistry.sol`) is deployed-ready, but blockchain anchoring is **optional** and currently disabled by default.

To enable blockchain features:
1. Start a local Hardhat node: `npx hardhat node`
2. Deploy the contract: `npx hardhat run scripts/deploy.ts --network localhost`
3. Set environment variables (see below)

**Without blockchain**: The system runs in "Database-only" mode—events are still hashed and stored with their hashes, but no on-chain transactions occur.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
The PostgreSQL database is already configured. Push the schema:
```bash
npm run db:push
```

### 3. Start the Application
```bash
npm run dev
```

The system will:
- Start the Express server on port 5000
- Initialize the field simulator
- Seed 3 sites and 4 assets (if DB is empty)
- Generate industrial events every 10 seconds
- Serve the dashboard UI at `http://localhost:5000`

### 4. Access the Dashboard
Open your browser to:
- **Dashboard**: `http://localhost:5000/dashboard` - Overview and live event stream
- **Sites**: `http://localhost:5000/sites` - Network assets registry
- **Events**: `http://localhost:5000/events` - Full audit log

## (Optional) Enable Blockchain Integration

### 1. Start Local Blockchain
```bash
npx hardhat node
```

This starts a local Ethereum node on `http://127.0.0.1:8545` with test accounts.

### 2. Deploy Smart Contract
In a new terminal:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

This creates `deployment.json` with the contract address.

### 3. Configure Environment Variables
Create a `.env` file (or use Replit Secrets):
```env
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Note**: The private key above is from Hardhat's default test account #0. **Never use this in production.**

### 4. Restart the Server
```bash
npm run dev
```

You'll see:
```
✅ Blockchain service initialized
   Provider: http://127.0.0.1:8545
   Contract: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Now events will be hashed AND anchored to the blockchain. The dashboard will show transaction hashes.

## API Endpoints

### Sites
- `GET /api/sites` - List all sites
- `POST /api/sites` - Register new site

### Assets
- `GET /api/assets` - List all assets
- `GET /api/assets/site/:siteId` - Get assets by site
- `POST /api/assets` - Register new asset

### Events
- `GET /api/events?limit=100` - Get recent events
- `POST /api/events` - Record new event (auto-hashes and anchors)

### Maintenance
- `GET /api/maintenance` - Get maintenance records
- `POST /api/maintenance` - Record maintenance

### Blockchain
- `GET /api/blockchain/status` - Check if blockchain is enabled

## Field Simulator

The simulator runs automatically and:
- Generates events every 10 seconds (configurable via `SIMULATOR_INTERVAL_MS`)
- Creates realistic payloads (breaker trips, setpoint changes, maintenance)
- Posts events to the gateway API
- Can be disabled with `SIMULATOR_ENABLED=false`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | (auto-configured) | PostgreSQL connection string |
| `BLOCKCHAIN_RPC_URL` | `http://127.0.0.1:8545` | Ethereum RPC endpoint |
| `BLOCKCHAIN_PRIVATE_KEY` | (none) | Private key for signing transactions |
| `SIMULATOR_ENABLED` | `true` | Enable/disable field simulator |
| `SIMULATOR_INTERVAL_MS` | `10000` | Event generation interval (ms) |

## Smart Contract Details

**Contract**: `IndustrialRegistry.sol`  
**Location**: `contracts/IndustrialRegistry.sol`

### Key Functions
- `registerSite(siteId, name, location, owner)` - Register a site
- `registerAsset(assetId, siteId, assetType, nameOrTag, critical)` - Register an asset
- `anchorEvent(assetId, eventType, payloadHash)` - Anchor event hash
- `anchorMaintenance(assetId, workOrderId, maintenanceType, performedAt)` - Anchor maintenance

### Events Emitted
- `SiteRegistered(siteId, name, owner, timestamp)`
- `AssetRegistered(assetId, siteId, assetType, timestamp)`
- `EventAnchored(assetId, eventType, payloadHash, timestamp, recordedBy)`
- `MaintenanceAnchored(assetId, workOrderId, maintenanceType, timestamp, performedBy)`

## Data Model

### Site
- `id` - UUID
- `name` - Site name (e.g., "Substation Alpha")
- `location` - Physical location
- `owner` - Ethereum address or identifier
- `status` - ONLINE | OFFLINE | MAINTENANCE

### Asset
- `id` - UUID
- `siteId` - Foreign key to Site
- `assetType` - TRANSFORMER | BREAKER | MCC | FEEDER | INVERTER
- `nameOrTag` - Asset tag (e.g., "TR-MAIN-01")
- `critical` - Boolean flag
- `metadata` - JSON (voltage, capacity, etc.)
- `status` - OK | WARNING | CRITICAL

### EventAnchor
- `id` - UUID
- `assetId` - Foreign key to Asset
- `eventType` - BREAKER_TRIP | BREAKER_CLOSE | SETPOINT_CHANGE | MAINTENANCE_PERFORMED
- `payloadHash` - SHA-256 hash of full payload (stored off-chain)
- `timestamp` - Event timestamp
- `recordedBy` - Address/identifier
- `txHash` - Blockchain transaction hash (if anchored)
- `fullPayload` - Complete event data (stored in DB)

### MaintenanceRecord
- `id` - UUID
- `assetId` - Foreign key to Asset
- `workOrderId` - Work order reference
- `performedBy` - Technician address/ID
- `maintenanceType` - IR_SCAN | ARC_FLASH_STUDY_UPDATE | BREAKER_INSP
- `performedAt` - Completion timestamp
- `nextDueAt` - Next scheduled maintenance
- `notes` - Free text
- `attachmentHash` - Hash of PDF/document (if any)

## Future Enhancements

### Multi-Chain Support
- Extend to Neo N3 for dual-chain anchoring
- Add cross-chain verification

### Real SCADA Integration
- MQTT broker for real field devices
- Modbus, DNP3, IEC 61850 protocol support
- Unified Namespace (UNS) integration

### DePIN Network
- Distributed gateway nodes with incentives
- Stake-based validator network
- Proof-of-coverage for industrial sites

### Compliance Engine
- NFPA 70B program tracking
- Automated compliance checks
- Regulatory reporting

## Security Considerations

1. **Private Keys**: Never commit private keys to the repository
2. **Production RPC**: Use Infura, Alchemy, or similar for production chains
3. **Access Control**: Implement role-based permissions in production
4. **Rate Limiting**: Add API rate limits for public endpoints
5. **Input Validation**: All inputs are validated via Zod schemas

## License

MIT

## Support

For issues or questions:
- Check logs: Server runs on port 5000, logs show in terminal
- Database issues: Run `npm run db:push` to sync schema
- Blockchain issues: Verify Hardhat node is running and contract is deployed
