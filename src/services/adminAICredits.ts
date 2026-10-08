import { supabase } from "@/lib/supabase";

const db = supabase as unknown as { from: (table: string) => any };

export interface AICreditSummary {
  totalAllowance: number;
  totalUsed: number;
  totalRemaining: number;
  byBusiness: Array<{
    businessId: string;
    businessName: string;
    allowance: number;
    used: number;
    remaining: number;
  }>;
  byFeature: Array<{
    actionType: string;
    creditsConsumed: number;
    requestCount: number;
  }>;
  recentUsage: Array<{
    id: string;
    business_id: string;
    action_type: string;
    credits_consumed: number;
    created_at: string;
  }>;
}

export async function fetchAICreditSummary(): Promise<AICreditSummary> {
  const [allowancesRes, usageRes] = await Promise.all([
    db.from("ai_credit_allowances").select("business_id, monthly_credit_allowance, is_active"),
    db.from("ai_usage_logs").select("id, business_id, action_type, credits_consumed, created_at").order("created_at", { ascending: false }).limit(100),
  ]);

  const allowances = allowancesRes.data || [];
  const usage = usageRes.data || [];

  const totalAllowance = allowances
    .filter((a: any) => a.is_active)
    .reduce((sum: number, a: any) => sum + (a.monthly_credit_allowance || 0), 0);
  const totalUsed = usage.reduce((sum: number, u: any) => sum + (u.credits_consumed || 0), 0);

  const businessIds = [...new Set(allowances.map((a: any) => a.business_id))];
  const businessesRes = businessIds.length > 0
    ? await db.from("businesses").select("id, name").in("id", businessIds)
    : { data: [] };
  const businessMap = (businessesRes.data || []).reduce((acc: Record<string, string>, b: any) => {
    acc[b.id] = b.name;
    return acc;
  }, {});

  const usageByBusiness = usage.reduce((acc: Record<string, number>, u: any) => {
    acc[u.business_id] = (acc[u.business_id] || 0) + (u.credits_consumed || 0);
    return acc;
  }, {});

  const byBusiness = allowances.map((a: any) => ({
    businessId: a.business_id,
    businessName: businessMap[a.business_id] || "Unknown",
    allowance: a.monthly_credit_allowance || 0,
    used: usageByBusiness[a.business_id] || 0,
    remaining: Math.max(0, (a.monthly_credit_allowance || 0) - (usageByBusiness[a.business_id] || 0)),
  }));

  const featureMap = usage.reduce((acc: Record<string, { credits: number; count: number }>, u: any) => {
    const key = u.action_type;
    if (!acc[key]) acc[key] = { credits: 0, count: 0 };
    acc[key].credits += u.credits_consumed || 0;
    acc[key].count += 1;
    return acc;
  }, {});

  const byFeature = Object.entries(featureMap).map(([actionType, data]) => ({
    actionType,
    creditsConsumed: (data as { credits: number; count: number }).credits,
    requestCount: (data as { credits: number; count: number }).count,
  }));

  const recentUsage = usage.slice(0, 20).map((u: any) => ({
    id: u.id,
    business_id: u.business_id,
    action_type: u.action_type,
    credits_consumed: u.credits_consumed,
    created_at: u.created_at,
  }));

  return {
    totalAllowance,
    totalUsed,
    totalRemaining: Math.max(0, totalAllowance - totalUsed),
    byBusiness,
    byFeature,
    recentUsage,
  };
}
