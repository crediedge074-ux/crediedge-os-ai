import { supabase } from "@/lib/supabase";

const db = supabase as unknown as { from: (table: string) => any; rpc: (fn: string) => Promise<{ data: unknown }> };

export type PlatformRole = "platform_owner" | "platform_admin" | null;

export interface AdminAccessStatus {
  platformRole: PlatformRole;
  isPlatformAdmin: boolean;
  isPlatformOwner: boolean;
  hasEnterprisePlan: boolean;
  canAccessAdminConsole: boolean;
}

export async function getAdminAccessStatus(businessId?: string): Promise<AdminAccessStatus> {
  const { data: roleData } = await db.rpc("get_platform_role");
  const platformRole = (roleData as PlatformRole) ?? null;

  let hasEnterprisePlan = false;
  if (businessId) {
    const { data: business } = await supabase
      .from("businesses")
      .select("subscription_plan")
      .eq("id", businessId)
      .maybeSingle();
    hasEnterprisePlan = (business?.subscription_plan || "").toLowerCase() === "enterprise";
  }

  const isPlatformAdmin = platformRole === "platform_owner" || platformRole === "platform_admin";
  const isPlatformOwner = platformRole === "platform_owner";
  const canAccessAdminConsole = isPlatformAdmin;

  return { platformRole, isPlatformAdmin, isPlatformOwner, hasEnterprisePlan, canAccessAdminConsole };
}

export interface AdminAuditInput {
  action: string;
  targetType?: string;
  targetId?: string;
  targetLabel?: string;
  businessId?: string;
  metadata?: Record<string, unknown>;
}

export async function logAdminEvent(input: AdminAuditInput): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) return;
  await db.from("admin_audit_events").insert({
    actor_id: user.id,
    action: input.action,
    target_type: input.targetType,
    target_id: input.targetId,
    target_label: input.targetLabel,
    business_id: input.businessId,
    metadata: input.metadata ?? {},
  });
}
