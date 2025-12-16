export interface Site {
  id: string;
  name: string;
  location: string;
  owner: string;
  createdAt: string;
  status: "ONLINE" | "OFFLINE" | "MAINTENANCE";
}

export interface Asset {
  id: string;
  siteId: string;
  assetType: "TRANSFORMER" | "BREAKER" | "MCC" | "FEEDER" | "INVERTER";
  nameOrTag: string;
  critical: boolean;
  metadata: Record<string, any>;
  createdAt: string;
  status: "OK" | "WARNING" | "CRITICAL";
}

export interface EventAnchor {
  id: string;
  assetId: string;
  eventType: "BREAKER_TRIP" | "BREAKER_CLOSE" | "SETPOINT_CHANGE" | "MAINTENANCE_PERFORMED";
  payloadHash: string;
  timestamp: string;
  recordedBy: string;
  txHash: string;
  details: string;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  workOrderId: string;
  performedBy: string;
  maintenanceType: "IR_SCAN" | "ARC_FLASH_STUDY_UPDATE" | "BREAKER_INSP";
  performedAt: string;
  nextDueAt: string;
  notes: string;
  attachmentHash: string;
}

export const MOCK_SITES: Site[] = [
  { id: "SITE-001", name: "Substation Alpha", location: "Sector 7G", owner: "0x71C...9A21", createdAt: "2024-01-15T08:00:00Z", status: "ONLINE" },
  { id: "SITE-002", name: "Solar Array B", location: "Mojave Sector", owner: "0x3D2...1B4C", createdAt: "2024-02-10T09:30:00Z", status: "ONLINE" },
  { id: "SITE-003", name: "Hydro Plant C", location: "River Valley", owner: "0x9F1...8E22", createdAt: "2024-03-01T14:15:00Z", status: "MAINTENANCE" },
];

export const MOCK_ASSETS: Asset[] = [
  { id: "AST-101", siteId: "SITE-001", assetType: "TRANSFORMER", nameOrTag: "TR-MAIN-01", critical: true, metadata: { kVA: 2500, voltage: "13.8kV/480V" }, createdAt: "2024-01-16T10:00:00Z", status: "OK" },
  { id: "AST-102", siteId: "SITE-001", assetType: "BREAKER", nameOrTag: "BK-FEEDER-01", critical: true, metadata: { amp: 1200, type: "Vacuum" }, createdAt: "2024-01-16T11:00:00Z", status: "OK" },
  { id: "AST-201", siteId: "SITE-002", assetType: "INVERTER", nameOrTag: "INV-01", critical: false, metadata: { capacity: "500kW" }, createdAt: "2024-02-11T09:00:00Z", status: "WARNING" },
  { id: "AST-301", siteId: "SITE-003", assetType: "MCC", nameOrTag: "MCC-PUMP-01", critical: true, metadata: { buckets: 12 }, createdAt: "2024-03-02T08:00:00Z", status: "OK" },
];

export const MOCK_EVENTS: EventAnchor[] = [
  { id: "EVT-9001", assetId: "AST-102", eventType: "BREAKER_TRIP", payloadHash: "0x8a7...f1e2", timestamp: "2025-05-10T14:23:01Z", recordedBy: "0xGateway_01", txHash: "0xabc...123", details: "Overcurrent Trip (Phase A) > 1250A" },
  { id: "EVT-9002", assetId: "AST-201", eventType: "SETPOINT_CHANGE", payloadHash: "0x3b2...d4c5", timestamp: "2025-05-10T15:05:22Z", recordedBy: "0xOperator_04", txHash: "0xdef...456", details: "Max Power Output: 80% -> 90%" },
  { id: "EVT-9003", assetId: "AST-101", eventType: "MAINTENANCE_PERFORMED", payloadHash: "0x1c9...a8b7", timestamp: "2025-05-09T09:00:00Z", recordedBy: "0xTech_09", txHash: "0xghi...789", details: "Quarterly IR Scan Completed" },
];

export const MOCK_MAINTENANCE: MaintenanceRecord[] = [
  { id: "MAINT-501", assetId: "AST-101", workOrderId: "WO-2025-042", performedBy: "0xTech_09", maintenanceType: "IR_SCAN", performedAt: "2025-05-09T09:00:00Z", nextDueAt: "2025-08-09T09:00:00Z", notes: "Hotspot detected on X1 bushing.", attachmentHash: "QmHash...PDF" },
];
