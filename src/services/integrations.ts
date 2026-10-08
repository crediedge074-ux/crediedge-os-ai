import { supabase } from "@/lib/supabase";
import { logActivity } from "./activity";
import { INTEGRATION_CATALOGUE, type CatalogueEntry } from "../components/integrations/catalogue";

export interface IntegrationRow {
  id: string;
  business_id: string;
  provider: string;
  status: string;
  credentials_encrypted: string | null;
  settings: Record<string, unknown> | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SyncLogRow {
  id: string;
  business_id: string;
  integration_id: string | null;
  provider: string;
  status: "success" | "failed" | "partial";
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  records_processed: number;
  records_created: number;
  records_updated: number;
  records_failed: number;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export type IntegrationStatus = "connected" | "disconnected" | "needs_attention" | "syncing" | "sync_failed";

export interface MergedIntegration extends CatalogueEntry {
  dbRow: IntegrationRow | null;
  liveStatus: IntegrationStatus;
  lastSyncedAt: string | null;
}

export async function fetchIntegrations(businessId: string): Promise<IntegrationRow[]> {
  const { data, error } = await (supabase.from as any)("integrations")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[fetchIntegrations] error:", error);
    return [];
  }
  return (data || []) as IntegrationRow[];
}

export async function fetchSyncLogs(businessId: string, limit = 20): Promise<SyncLogRow[]> {
  const { data, error } = await (supabase.from as any)("integration_sync_logs")
    .select("*")
    .eq("business_id", businessId)
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[fetchSyncLogs] error:", error);
    return [];
  }
  return (data || []) as SyncLogRow[];
}

export function mergeIntegrations(dbRows: IntegrationRow[]): MergedIntegration[] {
  const dbMap = new Map(dbRows.map((r) => [r.provider, r]));
  return INTEGRATION_CATALOGUE.map((entry) => {
    const dbRow = dbMap.get(entry.id) ?? null;
    let liveStatus: IntegrationStatus = "disconnected";
    if (dbRow) {
      if (dbRow.status === "connected") liveStatus = "connected";
      else if (dbRow.status === "needs_attention") liveStatus = "needs_attention";
      else if (dbRow.status === "syncing") liveStatus = "syncing";
      else if (dbRow.status === "sync_failed") liveStatus = "sync_failed";
      else liveStatus = "disconnected";
    }
    return { ...entry, dbRow, liveStatus, lastSyncedAt: dbRow?.last_synced_at ?? null };
  });
}

export async function disconnectIntegration(businessId: string, integrationId: string): Promise<boolean> {
  const { error } = await (supabase.from as any)("integrations")
    .update({ status: "disconnected", credentials_encrypted: null, last_synced_at: null, updated_at: new Date().toISOString() })
    .eq("id", integrationId)
    .eq("business_id", businessId);
  if (error) {
    console.error("[disconnectIntegration] error:", error);
    return false;
  }
  await logActivity({
    business_id: businessId,
    entity_type: "integration",
    entity_id: integrationId,
    action: "disconnected",
    description: "Disconnected integration",
  }).catch(() => {});
  return true;
}

export function computeHealthKPIs(merged: MergedIntegration[], syncLogs: SyncLogRow[]) {
  const connected = merged.filter((m) => m.liveStatus === "connected").length;
  const needsAttention = merged.filter((m) => m.liveStatus === "needs_attention" || m.liveStatus === "sync_failed").length;
  const syncing = merged.filter((m) => m.liveStatus === "syncing").length;
  const lastSync = syncLogs.length > 0 ? syncLogs[0].started_at : null;
  const failedSyncs = syncLogs.filter((s) => s.status === "failed").length;
  return { connected, needsAttention, syncing, lastSync, failedSyncs, totalLogs: syncLogs.length };
}
