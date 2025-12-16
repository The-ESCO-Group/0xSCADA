import type { Site, Asset, EventAnchor, MaintenanceRecord } from "@shared/schema";

const API_BASE = "/api";

export async function fetchSites(): Promise<Site[]> {
  const response = await fetch(`${API_BASE}/sites`);
  if (!response.ok) throw new Error("Failed to fetch sites");
  return response.json();
}

export async function fetchAssets(): Promise<Asset[]> {
  const response = await fetch(`${API_BASE}/assets`);
  if (!response.ok) throw new Error("Failed to fetch assets");
  return response.json();
}

export async function fetchEvents(limit: number = 100): Promise<EventAnchor[]> {
  const response = await fetch(`${API_BASE}/events?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
}

export async function fetchMaintenanceRecords(): Promise<MaintenanceRecord[]> {
  const response = await fetch(`${API_BASE}/maintenance`);
  if (!response.ok) throw new Error("Failed to fetch maintenance records");
  return response.json();
}
