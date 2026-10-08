import { supabase } from "@/lib/supabase";
import { logAdminEvent } from "./adminAccess";

const db = supabase as unknown as { from: (table: string) => any };

export interface EnterpriseLead {
  id: string;
  user_id: string;
  business_id: string | null;
  user_email: string | null;
  user_name: string | null;
  business_name: string | null;
  message: string | null;
  source: string;
  status: string;
  created_at: string;
}

export async function submitEnterpriseLead(params: {
  userId: string;
  businessId?: string;
  userEmail?: string;
  userName?: string;
  businessName?: string;
  message?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { data: existing } = await db.from("enterprise_leads").select("id")
    .eq("user_id", params.userId)
    .eq("status", "open")
    .maybeSingle();

  if (existing) return { success: false, error: "You already have an open Enterprise access request." };

  const { error } = await db.from("enterprise_leads").insert({
    user_id: params.userId,
    business_id: params.businessId || null,
    user_email: params.userEmail || null,
    user_name: params.userName || null,
    business_name: params.businessName || null,
    message: params.message || null,
    source: "admin_console_preview",
    status: "open",
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function fetchEnterpriseLeads(): Promise<EnterpriseLead[]> {
  const { data, error } = await db.from("enterprise_leads").select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as EnterpriseLead[];
}

export async function updateLeadStatus(leadId: string, status: string): Promise<void> {
  const { error } = await db.from("enterprise_leads").update({ status, updated_at: new Date().toISOString() }).eq("id", leadId);
  if (error) throw error;
  await logAdminEvent({
    action: "lead_status_changed",
    targetType: "enterprise_lead",
    targetId: leadId,
    targetLabel: status,
    metadata: { status },
  });
}
