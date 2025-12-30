<div align="center">

# 🏭 0xSCADA

### Decentralized Industrial Control & Automation Platform

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://reactjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8-363636?logo=solidity)](https://soliditylang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://www.postgresql.org/)

**A blockchain-backed industrial SCADA system with multi-vendor PLC code generation, ISA-88 batch control, and immutable audit trails.**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Reference](#-api-reference) • [Roadmap](#-roadmap)

</div>

---

## 🎯 Overview

**0xSCADA** bridges the gap between traditional industrial control systems and modern decentralized infrastructure. It combines:

- **🔐 Blockchain Anchoring** — Immutable audit trails for compliance and tamper-evident records
- **🏭 Multi-Vendor Code Generation** — Generate PLC code for Siemens, Rockwell, ABB, and more
- **📋 ISA-88 Batch Control** — Full support for procedural control with phases, units, and recipes
- **🔄 Blueprints Integration** — Design-Ops workflow for deterministic automation code

> **Safety First**: Real-time control logic stays OFF-chain. The blockchain is purely for identity, audit, and compliance—never for safety-critical operations.

---

## ✨ Features

### Core Platform
| Feature | Description |
|---------|-------------|
| **Site & Asset Registry** | Manage industrial sites, PLCs, and equipment with blockchain-backed identity |
| **Event Anchoring** | SHA-256 hash anchoring of events to blockchain for tamper-evident audit trails |
| **Real-time Dashboard** | React-based UI with live event streaming and asset monitoring |
| **Field Simulator** | Generate realistic industrial events for testing and demos |

### Blueprints Engine
| Feature | Description |
|---------|-------------|
| **Control Module Types** | Define reusable CM types (PID, Valves, VFDs) with I/O specifications |
| **Unit & Phase Types** | ISA-88 compliant batch control definitions |
| **Multi-Vendor Support** | Siemens (SCL/TIA), Rockwell (AOI/L5X), ABB, Emerson, Schneider |
| **Code Generation** | Automatic PLC code generation from blueprints definitions |
| **Template Engine** | Customizable templates with placeholder substitution |

### Supported Vendors

| Vendor | Platforms | Languages | Export Formats |
|--------|-----------|-----------|----------------|
| **Siemens** | TIA Portal, STEP 7 | SCL, LAD, FBD | SCL Source, TIA XML |
| **Rockwell** | Studio 5000, RSLogix | ST, Ladder, AOI | L5X, AOI Definition |
| **ABB** | Automation Builder | ST, LAD, FBD | IEC 61131-3 |
| **Emerson** | DeltaV, Ovation | ST, FBD, SFC | Native Export |
| **Schneider** | EcoStruxure | ST, LAD, FBD | Native Export |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- (Optional) Hardhat for blockchain features

### Installation

```bash
# Clone the repository
git clone https://github.com/The-ESCO-Group/0xSCADA.git
cd 0xSCADA

# Install dependencies
npm install

# Push database schema
npm run db:push

# Seed default vendors (Siemens, Rockwell, etc.)
curl -X POST http://localhost:5000/api/blueprints/seed

# Start the application
npm run dev
```

### Access Points
| URL | Description |
|-----|-------------|
| `http://localhost:5000` | Main Dashboard |
| `http://localhost:5000/sites` | Site Registry |
| `http://localhost:5000/events` | Event Audit Log |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         0xSCADA Platform                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   React UI   │    │  Express API │    │  Blueprints  │          │
│  │  Dashboard   │◄──►│   Gateway    │◄──►│   Engine     │          │
│  └──────────────┘    └──────┬───────┘    └──────────────┘          │
│                             │                                       │
│         ┌───────────────────┼───────────────────┐                  │
│         │                   │                   │                  │
│         ▼                   ▼                   ▼                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │  PostgreSQL  │    │  Blockchain  │    │    Code      │          │
│  │   Database   │    │   (EVM)      │    │  Generator   │          │
│  │              │    │              │    │              │          │
│  │ • Sites      │    │ • Anchors    │    │ • SCL        │          │
│  │ • Assets     │    │ • Registry   │    │ • AOI/L5X    │          │
│  │ • Events     │    │ • Audit      │    │ • Templates  │          │
│  │ • Blueprints │    │              │    │              │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Field Layer                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Siemens  │  │ Rockwell │  │   ABB    │  │ Emerson  │            │
│  │ S7-1500  │  │ CtrlLogix│  │  AC500   │  │ DeltaV   │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📚 API Reference

### Sites & Assets
```bash
GET    /api/sites                    # List all sites
POST   /api/sites                    # Register new site
GET    /api/assets                   # List all assets
GET    /api/assets/site/:siteId      # Get assets by site
POST   /api/assets                   # Register new asset
```

### Events & Maintenance
```bash
GET    /api/events?limit=100         # Get recent events
POST   /api/events                   # Record event (auto-anchors)
GET    /api/maintenance              # Get maintenance records
POST   /api/maintenance              # Record maintenance
```

### Blueprints
```bash
GET    /api/blueprints/cm-types      # List control module types
GET    /api/blueprints/unit-types    # List unit types
GET    /api/blueprints/phase-types   # List phase types
POST   /api/blueprints/import        # Import blueprint package
GET    /api/blueprints/summary       # Get counts summary
POST   /api/blueprints/seed          # Seed default vendors
```

### Vendors & Templates
```bash
GET    /api/vendors                  # List vendors
POST   /api/vendors                  # Create vendor
GET    /api/templates                # List template packages
GET    /api/templates/vendor/:id     # Templates by vendor
GET    /api/data-types/vendor/:id    # Data type mappings
```

### Code Generation
```bash
POST   /api/generate/control-module/:id   # Generate CM code
POST   /api/generate/phase/:id            # Generate phase code
GET    /api/generated-code                # List generated code
POST   /api/generated-code/:id/anchor     # Anchor to blockchain
```

### Controllers
```bash
GET    /api/controllers              # List all controllers
GET    /api/controllers/vendor/:id   # Controllers by vendor
GET    /api/controllers/site/:id     # Controllers by site
POST   /api/controllers              # Register controller
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `BLOCKCHAIN_RPC_URL` | `http://127.0.0.1:8545` | Ethereum RPC endpoint |
| `BLOCKCHAIN_PRIVATE_KEY` | — | Private key for signing |
| `SIMULATOR_ENABLED` | `true` | Enable field simulator |
| `SIMULATOR_INTERVAL_MS` | `10000` | Event generation interval |

### Enable Blockchain (Optional)

```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.ts --network localhost

# Set environment variables
export BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
export BLOCKCHAIN_PRIVATE_KEY=0xac0974bec...  # Hardhat test key

# Restart server
npm run dev
```

---

## 📊 Data Model

### Core Entities
- **Sites** — Industrial facilities with location and ownership
- **Assets** — Equipment (transformers, breakers, PLCs) within sites
- **EventAnchors** — Blockchain-anchored event records
- **MaintenanceRecords** — Work orders and maintenance history

### Blueprints Entities
- **Vendors** — PLC manufacturers (Siemens, Rockwell, etc.)
- **TemplatePackages** — Code generation templates per vendor
- **ControlModuleTypes** — Reusable CM definitions (PID, Valve, VFD)
- **UnitTypes** — ISA-88 unit definitions (Tank, Reactor)
- **PhaseTypes** — Batch control phases with state machines
- **Controllers** — PLC/DCS hardware definitions
- **GeneratedCode** — Audit trail of generated code with hashes

---

## 🗺 Roadmap

### ✅ Phase 1-4: Complete
- [x] Core SCADA platform with blockchain anchoring
- [x] Multi-vendor blueprints integration
- [x] Code generation for Siemens SCL and Rockwell AOI
- [x] Database schema for ISA-88 entities

### 🔄 Phase 5: UI Dashboard (Next)
- [ ] Visual blueprints explorer
- [ ] Drag-and-drop I/O editor
- [ ] Code preview and export
- [ ] Import wizard with validation

### 📅 Future Phases
- **Phase 6**: Real-time PLC communication (OPC-UA, S7, EtherNet/IP)
- **Phase 7**: ISA-88 batch runtime engine
- **Phase 8**: HMI/SCADA visualization generation
- **Phase 9**: AI-assisted code generation, digital twins

---

## 🔒 Security

| Consideration | Implementation |
|---------------|----------------|
| **Private Keys** | Never committed; use environment variables |
| **Input Validation** | All inputs validated via Zod schemas |
| **Access Control** | Role-based permissions (production) |
| **Rate Limiting** | API rate limits for public endpoints |
| **Audit Trail** | Immutable blockchain anchoring |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.

```
Copyright 2024 The ESCO Group

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/The-ESCO-Group/0xSCADA/issues)
- **Discussions**: [GitHub Discussions](https://github.com/The-ESCO-Group/0xSCADA/discussions)

---

<div align="center">

**Built with ❤️ by [The ESCO Group](https://github.com/The-ESCO-Group)**

*Bridging Industrial Control and Decentralized Infrastructure*

</div>
