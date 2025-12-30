# 0xSCADA API Documentation

Complete API reference for the 0xSCADA platform, including core SCADA operations and the Blueprints code generation engine.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication. Future versions will implement JWT-based authentication.

---

## Core SCADA API

### Sites

#### GET /api/sites
Returns all registered industrial sites.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Plant A",
    "location": "Houston, TX",
    "status": "ONLINE",
    "registeredAt": "2024-01-15T10:30:00Z",
    "txHash": "0x..."
  }
]
```

#### POST /api/sites
Register a new site.

**Request Body:**
```json
{
  "name": "Plant B",
  "location": "Chicago, IL"
}
```

---

### Assets

#### GET /api/assets
Returns all registered assets.

**Response:**
```json
[
  {
    "id": "uuid",
    "siteId": "uuid",
    "nameOrTag": "TIC-4750",
    "assetType": "TEMPERATURE_CONTROLLER",
    "critical": true,
    "status": "RUNNING",
    "txHash": "0x..."
  }
]
```

#### POST /api/assets
Register a new asset.

**Request Body:**
```json
{
  "siteId": "uuid",
  "nameOrTag": "FIC-1001",
  "assetType": "FLOW_CONTROLLER",
  "critical": true
}
```

---

### Events

#### GET /api/events
Returns event anchors with optional limit.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 100 | Maximum events to return |

**Response:**
```json
[
  {
    "id": "uuid",
    "assetId": "uuid",
    "eventType": "ALARM",
    "timestamp": "2024-01-15T10:30:00Z",
    "details": "High temperature alarm",
    "payloadHash": "0x...",
    "txHash": "0x..."
  }
]
```

#### POST /api/events
Create and anchor a new event.

**Request Body:**
```json
{
  "payload": {
    "assetId": "uuid",
    "eventType": "SETPOINT_CHANGE",
    "details": "Setpoint changed from 150 to 175"
  }
}
```

---

### Maintenance Records

#### GET /api/maintenance
Returns all maintenance records.

#### POST /api/maintenance
Create a new maintenance record.

**Request Body:**
```json
{
  "assetId": "uuid",
  "maintenanceType": "CALIBRATION",
  "description": "Annual calibration",
  "performedBy": "John Smith"
}
```

---

## Blueprints API

### Control Module Types

#### GET /api/blueprints/cm-types
Returns all control module type definitions.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "PIDController",
    "version": "1.0",
    "vendorId": "siemens",
    "description": "Standard PID control module",
    "classification": "control_module",
    "inputs": [
      { "name": "SP", "dataType": "REAL", "comment": "Setpoint" },
      { "name": "PV", "dataType": "REAL", "comment": "Process Value" }
    ],
    "outputs": [
      { "name": "CV", "dataType": "REAL", "comment": "Control Value" }
    ],
    "inOuts": [],
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### POST /api/blueprints/cm-types
Create a new control module type.

**Request Body:**
```json
{
  "name": "AnalogInput",
  "vendorId": "siemens",
  "description": "Analog input scaling module",
  "classification": "control_module",
  "inputs": [
    { "name": "RawValue", "dataType": "INT", "comment": "Raw analog value" }
  ],
  "outputs": [
    { "name": "ScaledValue", "dataType": "REAL", "comment": "Engineering units" }
  ],
  "inOuts": []
}
```

---

### Unit Types

#### GET /api/blueprints/unit-types
Returns all unit type definitions.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Tank",
    "version": "1.0",
    "vendorId": null,
    "description": "Storage tank unit",
    "variables": [
      { "name": "Level", "dataType": "REAL" },
      { "name": "Temperature", "dataType": "REAL" }
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### POST /api/blueprints/unit-types
Create a new unit type.

---

### Phase Types

#### GET /api/blueprints/phase-types
Returns all phase type definitions (ISA-88 batch control).

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Fill",
    "version": "1.0",
    "vendorId": null,
    "description": "Tank filling phase",
    "linkedControlModules": ["AnalogValve", "LevelMeasurement"],
    "inputs": [...],
    "outputs": [...],
    "internalValues": [...],
    "hmiParameters": [...],
    "recipeParameters": [...],
    "sequenceLogic": "...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### POST /api/blueprints/phase-types
Create a new phase type.

---

### Blueprints Summary

#### GET /api/blueprints/summary
Returns counts of all blueprint entities.

**Response:**
```json
{
  "controlModuleTypes": 12,
  "controlModuleInstances": 150,
  "unitTypes": 5,
  "unitInstances": 25,
  "phaseTypes": 8,
  "phaseInstances": 40,
  "vendors": 5,
  "templates": 20
}
```

---

## Vendors API

### GET /api/vendors
Returns all registered vendors.

**Response:**
```json
[
  {
    "id": "siemens",
    "name": "siemens",
    "displayName": "Siemens",
    "description": "Siemens TIA Portal",
    "platforms": ["S7-1200", "S7-1500", "S7-300", "S7-400"],
    "languages": ["SCL", "LAD", "FBD", "STL"],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### GET /api/templates
Returns all code templates.

### GET /api/templates/vendor/:vendorId
Returns templates for a specific vendor.

---

## Code Generation API

### POST /api/generate/control-module/:cmTypeId
Generate vendor-specific code for a control module type.

**Request Body:**
```json
{
  "vendorId": "siemens",
  "instanceName": "TIC4750_01",
  "format": "scl"
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid",
  "code": "FUNCTION_BLOCK \"PIDController\"\n...",
  "codeHash": "0x1234567890abcdef...",
  "language": "SCL",
  "vendor": "Siemens"
}
```

### POST /api/generate/phase/:phaseTypeId
Generate vendor-specific code for a phase type.

**Request Body:**
```json
{
  "vendorId": "rockwell",
  "instanceName": "Fill_Tank1",
  "format": "st"
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid",
  "code": "// AOI: Fill_Tank1\n...",
  "codeHash": "0xabcdef1234567890...",
  "language": "Structured Text",
  "vendor": "Rockwell Automation"
}
```

---

## Generated Code API

### GET /api/generated-code
Returns all generated code records.

**Response:**
```json
[
  {
    "id": "uuid",
    "sourceType": "control_module",
    "sourceId": "uuid",
    "vendorId": "siemens",
    "code": "...",
    "codeHash": "0x...",
    "language": "SCL",
    "txHash": null,
    "generatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### POST /api/generated-code/:id/anchor
Anchor generated code hash to blockchain.

**Response:**
```json
{
  "success": true,
  "txHash": "0x..."
}
```

---

## Database Seeding

### POST /api/blueprints/seed
Seed the database with default vendors and data type mappings.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| force | boolean | false | Re-seed even if already seeded |

**Response:**
```json
{
  "success": true,
  "vendors": 5,
  "dataTypeMappings": 30,
  "templatePackages": 10,
  "errors": []
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Data Types

### I/O Definition
```typescript
interface IODefinition {
  name: string;
  dataType: string;
  comment?: string;
  defaultValue?: string;
}
```

### Supported Data Types (Generic)
| Type | Description |
|------|-------------|
| BOOL | Boolean (true/false) |
| INT | 16-bit integer |
| DINT | 32-bit integer |
| REAL | 32-bit floating point |
| STRING | Character string |
| TIME | Time duration |
| DATE | Date value |
| TOD | Time of day |

### Vendor-Specific Mappings

#### Siemens TIA Portal
| Generic | Siemens |
|---------|---------|
| BOOL | Bool |
| INT | Int |
| DINT | DInt |
| REAL | Real |
| STRING | String |
| TIME | Time |

#### Rockwell (Allen-Bradley)
| Generic | Rockwell |
|---------|----------|
| BOOL | BOOL |
| INT | INT |
| DINT | DINT |
| REAL | REAL |
| STRING | STRING |
| TIME | DINT |

---

## Rate Limits

Currently no rate limits are enforced. Production deployments should implement appropriate rate limiting.

---

## Changelog

### v1.0.0
- Initial API release
- Core SCADA endpoints (sites, assets, events, maintenance)
- Blueprints engine (CM types, unit types, phase types)
- Multi-vendor code generation (Siemens, Rockwell)
- Blockchain anchoring for audit trails
