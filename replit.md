# 0x_SCADA - Decentralized Industrial Control Fabric

## Overview

0x_SCADA is a DePIN-style, blockchain-backed industrial SCADA system prototype. The core principle is that real-time control logic stays safely off-chain, while blockchain is used exclusively for identity, audit, compliance, and event anchoring. This creates a tamper-evident audit trail for industrial operations without compromising safety-critical control systems.

The system models four layers:
- **Field Layer**: Simulated PLCs/RTUs generating industrial events (breaker trips, setpoint changes)
- **Gateway Layer**: Express API that hashes events, anchors to blockchain, stores payloads in PostgreSQL
- **Blockchain Layer**: Hardhat-based Ethereum smart contracts for immutable registry and audit logs
- **Dashboard UI**: React/Vite SPA for operations monitoring and event visualization

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend (Express + TypeScript)
- **Entry Point**: `server/index.ts` - Express server with HTTP/WebSocket support
- **API Routes**: `server/routes.ts` - REST endpoints for Sites, Assets, Events, and Maintenance records
- **Storage**: `server/storage.ts` - Database operations using Drizzle ORM with PostgreSQL
- **Blockchain Service**: `server/blockchain.ts` - Ethereum integration via ethers.js for on-chain anchoring
- **Field Simulator**: `server/simulator.ts` - Generates simulated industrial events for demo purposes

### Frontend (React + Vite + TailwindCSS)
- **Framework**: React 18 with TypeScript, Vite bundler
- **Styling**: TailwindCSS v4 with a brutalist dark theme (acid green accent)
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library with Radix primitives
- **Pages**: Home (landing), Dashboard (operations), Sites (registry), Events (audit log)

### Database Schema (Drizzle ORM)
Defined in `shared/schema.ts`:
- **Sites**: Industrial locations with owner addresses and status
- **Assets**: Equipment (transformers, breakers, MCCs) linked to sites
- **EventAnchors**: Hashed industrial events with blockchain transaction references
- **MaintenanceRecords**: Work orders with compliance tracking

### Smart Contracts (Hardhat/Solidity)
- **IndustrialRegistry.sol**: Registers Sites and Assets, anchors Events and Maintenance records
- **Target**: Ethereum-compatible chains (local Hardhat node for development)
- **Safety Principle**: NO control logic on-chain - only audit/identity functions

### Build System
- **Development**: `npm run dev` starts Express server with Vite middleware
- **Production**: `npm run build` uses custom esbuild script for server bundling and Vite for client
- **Database**: `npm run db:push` applies Drizzle schema to PostgreSQL

## External Dependencies

### Database
- **PostgreSQL**: Primary data store for full event payloads and system registry
- **Drizzle ORM**: Type-safe database queries with automatic schema inference
- **Connection**: Via `DATABASE_URL` environment variable

### Blockchain
- **Hardhat**: Local Ethereum development network (chainId 1337)
- **ethers.js**: Ethereum provider and contract interaction
- **Environment Variables**:
  - `BLOCKCHAIN_RPC_URL`: JSON-RPC endpoint (defaults to localhost:8545)
  - `BLOCKCHAIN_PRIVATE_KEY`: Wallet for signing transactions
  - Contract address read from `deployment.json` after running deploy script

### Frontend Libraries
- **TanStack Query**: Server state management with automatic refetching
- **Framer Motion**: Landing page animations
- **Lucide React**: Icon library
- **date-fns**: Date formatting utilities

### Development Tools
- **Vite**: Frontend dev server with HMR
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Production server bundling