# 0x_SCADA MVP Blueprint

This repository contains the blueprints for a decentralized industrial control audit fabric.

## Architecture

1.  **Field Layer (Simulated)**
    *   Generates raw events (`breaker_trip`, `setpoint_change`).
    *   In a real system, this would be an Edge Gateway running on a Raspberry Pi or Industrial PC talking Modbus/DNP3.

2.  **Gateway Layer (Node.js)**
    *   Ingests events.
    *   Hashes them (SHA-256/Keccak).
    *   Stores full payload in local DB (SQLite).
    *   Submits Hash + Metadata to Ethereum/EVM Smart Contract.

3.  **DePIN Layer (EVM Smart Contract)**
    *   `IndustrialRegistry.sol`
    *   Stores Identity (Sites, Assets).
    *   Stores Audit Log (Event Anchors).
    *   **NO CONTROL LOGIC ON CHAIN.**

4.  **Ops Dashboard (React)**
    *   Reads from Gateway API (for full details).
    *   Reads from Blockchain (for verification).
    *   Visualizes system status.

## Directory Structure

```
/
├── contracts/
│   └── IndustrialRegistry.sol  <-- The Smart Contract
├── gateway/
│   └── index.ts                <-- The Node.js Service
├── frontend/
│   └── src/                    <-- The React Dashboard (Current App)
└── docker-compose.yml          <-- Orchestration
```

## How to Run (Local Dev)

1.  **Blockchain**
    *   Install Hardhat or Foundry.
    *   Start a local node: `npx hardhat node`.
    *   Deploy contract: `npx hardhat run scripts/deploy.ts --network localhost`.
    *   Copy the deployed `CONTRACT_ADDRESS`.

2.  **Gateway**
    *   Navigate to `gateway/`.
    *   Install deps: `npm install ethers express dotenv`.
    *   Create `.env` with `PRIVATE_KEY` (from hardhat) and `CONTRACT_ADDRESS`.
    *   Run: `ts-node index.ts`.
    *   *Simulator will start automatically.*

3.  **Frontend**
    *   Navigate to `frontend/`.
    *   Run: `npm run dev`.
    *   Open `localhost:5000`.

## Future Expansion

*   **Neo N3**: Port `IndustrialRegistry` to C# or Python for Neo N3. Use NeoFS for storing large maintenance reports (PDFs).
*   **Incentives**: Mint `$SCADA` tokens for nodes that maintain high uptime and verify events.
*   **Zero Knowledge**: Use ZK-SNARKs to prove a maintenance check passed without revealing the sensitive data of the facility.
