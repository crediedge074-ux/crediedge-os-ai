// ─── Shared TypeScript interfaces for Integrations Hub ───────────────────────

export type IntegrationStatus = "connected" | "disconnected" | "warning" | "pending" | "error";
export type IntegrationCategory =
  | "CRM" | "Communication" | "Calendar" | "Finance"
  | "Website" | "Social Media" | "Review Platforms"
  | "AI" | "Automation" | "Storage" | "Developer";

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  logoInitials: string;
  logoColor: string;
  status: IntegrationStatus;
  connectedAccount?: string;
  lastSync?: string;
  version?: string;
  health: "healthy" | "degraded" | "down" | "unknown";
  permissions: string[];
  syncFrequency?: string;
  featured?: boolean;
}

export interface SyncHistoryEntry {
  id: string;
  platform: string;
  time: string;
  status: "success" | "warning" | "error";
  duration: string;
  recordsUpdated: number;
  errors: number;
  warnings: number;
}

export interface IntegrationHealthKPI {
  label: string;
  value: string | number;
  sublabel: string;
  status: "ok" | "warning" | "error" | "neutral";
}
