import { supabase } from "@/lib/supabase";
import type { ActivityLog } from "@/lib/database.types";

export async function getActivityLogs(businessId: string, limit = 20): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
  return data ?? [];
}

export async function getCustomerActivityLogs(businessId: string, customerId: string): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("business_id", businessId)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customer activity logs:", error);
    return [];
  }
  return data ?? [];
}

export async function logActivity(params: {
  business_id: string;
  customer_id?: string | null;
  job_id?: string | null;
  entity_type: string;
  entity_id?: string | null;
  action: string;
  description: string;
  actor_id?: string | null;
  metadata?: Record<string, any>;
}): Promise<void> {
  const { error } = await supabase.from("activity_logs").insert(params as any);
  if (error) {
    console.error("Error inserting activity log:", error);
  }
}
