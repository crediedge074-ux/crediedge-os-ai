import { supabase } from "@/lib/supabase";
import { logAdminEvent } from "./adminAccess";

const db = supabase as unknown as { from: (table: string) => any };

export interface PlatformPlan {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  monthly_price_gbp: number;
  annual_price_gbp: number;
  ai_credit_allowance: number;
  is_enterprise: boolean;
  is_active: boolean;
  sort_order: number;
  max_users: number | null;
}

export async function fetchPlans(): Promise<PlatformPlan[]> {
  const { data, error } = await db.from("platform_plans")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []) as PlatformPlan[];
}

export interface FeatureDefinition {
  id: string;
  key: string;
  display_name: string;
  description: string | null;
  category: string;
  is_active: boolean;
  sort_order: number;
}

export interface PlanEntitlement {
  id: string;
  plan_id: string;
  feature_id: string;
  is_enabled: boolean;
  feature?: FeatureDefinition;
}

export interface BusinessOverride {
  id: string;
  business_id: string;
  feature_id: string;
  override_type: "enable" | "disable";
  reason: string | null;
  created_at: string;
  feature?: FeatureDefinition;
}

export async function fetchFeatures(): Promise<FeatureDefinition[]> {
  const { data, error } = await db.from("feature_definitions")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []) as FeatureDefinition[];
}

export async function fetchPlanEntitlements(): Promise<PlanEntitlement[]> {
  const { data, error } = await db.from("plan_feature_entitlements")
    .select("*, feature:feature_definitions(*)")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []) as PlanEntitlement[];
}

export async function fetchBusinessOverrides(businessId: string): Promise<BusinessOverride[]> {
  const { data, error } = await db.from("business_feature_overrides")
    .select("*, feature:feature_definitions(*)")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as BusinessOverride[];
}

export async function togglePlanEntitlement(planId: string, featureId: string, isEnabled: boolean): Promise<void> {
  if (isEnabled) {
    const { error } = await db.from("plan_feature_entitlements")
      .upsert({ plan_id: planId, feature_id: featureId, is_enabled: true }, { onConflict: "plan_id,feature_id" });
    if (error) throw error;
  } else {
    const { error } = await db.from("plan_feature_entitlements")
      .delete()
      .eq("plan_id", planId)
      .eq("feature_id", featureId);
    if (error) throw error;
  }
  await logAdminEvent({
    action: isEnabled ? "feature_enabled_for_plan" : "feature_disabled_for_plan",
    targetType: "plan_feature",
    targetId: planId,
    metadata: { featureId, isEnabled },
  });
}

export async function setBusinessOverride(
  businessId: string,
  featureId: string,
  overrideType: "enable" | "disable",
  reason?: string
): Promise<void> {
  const { error } = await db.from("business_feature_overrides")
    .upsert(
      { business_id: businessId, feature_id: featureId, override_type: overrideType, reason: reason || null },
      { onConflict: "business_id,feature_id" }
    );
  if (error) throw error;
  await logAdminEvent({
    action: overrideType === "enable" ? "feature_override_enabled" : "feature_override_disabled",
    targetType: "business_feature",
    targetId: businessId,
    metadata: { featureId, overrideType, reason },
  });
}

export async function removeBusinessOverride(businessId: string, featureId: string): Promise<void> {
  const { error } = await db.from("business_feature_overrides")
    .delete()
    .eq("business_id", businessId)
    .eq("feature_id", featureId);
  if (error) throw error;
  await logAdminEvent({
    action: "feature_override_removed",
    targetType: "business_feature",
    targetId: businessId,
    metadata: { featureId },
  });
}

export async function updatePlan(planId: string, updates: {
  display_name?: string;
  monthly_price_gbp?: number;
  annual_price_gbp?: number;
  ai_credit_allowance?: number;
  max_users?: number | null;
  description?: string | null;
}): Promise<void> {
  const { error } = await db.from("platform_plans").update(updates).eq("id", planId);
  if (error) throw error;
  await logAdminEvent({
    action: "plan_updated",
    targetType: "plan",
    targetId: planId,
    metadata: updates,
  });
}

export async function fetchPlanCounts(): Promise<Record<string, number>> {
  const { data, error } = await db.from("businesses").select("subscription_plan");
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const b of data || []) {
    const plan = (b.subscription_plan || "").toLowerCase();
    counts[plan] = (counts[plan] || 0) + 1;
  }
  return counts;
}

export function isFeatureEnabled(
  featureKey: string,
  features: FeatureDefinition[],
  entitlements: PlanEntitlement[],
  overrides: BusinessOverride[],
  planName: string | null
): boolean {
  const feature = features.find((f) => f.key === featureKey);
  if (!feature) return true;
  const override = overrides.find((o) => o.feature_id === feature.id);
  if (override) return override.override_type === "enable";
  const entitlement = entitlements.find((e) => e.feature_id === feature.id);
  if (!entitlement) return false;
  return entitlement.is_enabled;
}
