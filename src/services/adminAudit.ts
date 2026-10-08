import { supabase } from "@/lib/supabase";

const db = supabase as unknown as { from: (table: string) => any };

export interface AdminAuditEvent {
  id: string;
  actor_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  target_label: string | null;
  business_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export async function fetchAuditEvents(params: {
  search?: string;
  action?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ events: AdminAuditEvent[]; total: number }> {
  const page = params.page || 1;
  const pageSize = params.pageSize || 25;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = db.from("admin_audit_events").select("*", { count: "exact" });

  if (params.action && params.action !== "all") {
    query = query.eq("action", params.action);
  }
  if (params.search) {
    query = query.or(`action.ilike.%${params.search}%,target_type.ilike.%${params.search}%,target_label.ilike.%${params.search}%`);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);
  const { data, error, count } = await query;
  if (error) throw error;

  return { events: (data || []) as AdminAuditEvent[], total: count || 0 };
}
