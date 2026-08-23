import { supabase } from "@/lib/supabase";

export type AIComplexityTier = "free" | "lightweight" | "standard" | "advanced";

export interface AIAllowanceStatus {
  businessId: string;
  planTier: string;
  monthlyAllowance: number;
  usedCredits: number;
  remainingCredits: number;
  canGenerate: boolean;
  resetPeriodStart: string;
  resetPeriodEnd: string;
}

export interface AuthorizeAIRequestParams {
  businessId: string;
  userId?: string | null;
  actionType: string;
  complexityTier?: AIComplexityTier;
  requestId?: string;
}

export interface AuthorizeAIRequestResult {
  authorized: boolean;
  status: "authorized" | "exhausted" | "duplicate" | "error";
  message: string;
  requestId: string;
  creditsConsumed: number;
  remainingCredits: number;
}

// Complexity tier credit costs
export const AI_CREDIT_COSTS: Record<AIComplexityTier, number> = {
  free: 0,
  lightweight: 1,
  standard: 2,
  advanced: 5,
};

// Default plan allowance fallback configuration
export const DEFAULT_PLAN_ALLOWANCES: Record<string, number> = {
  starter: 100,
  growth: 500,
  enterprise: 2000,
};

export async function getAIAllowance(
  businessId: string | undefined,
  userId?: string | null
): Promise<AIAllowanceStatus> {
  const defaultStatus: AIAllowanceStatus = {
    businessId: businessId || "",
    planTier: "starter",
    monthlyAllowance: 100,
    usedCredits: 0,
    remainingCredits: 100,
    canGenerate: true,
    resetPeriodStart: new Date().toISOString(),
    resetPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
  };

  if (!businessId) return { ...defaultStatus, canGenerate: false, remainingCredits: 0 };

  try {
    // 1. Fetch or create credit allowance for business_id
    let { data: allowanceRow } = await (supabase.from as any)("ai_credit_allowances")
      .select("*")
      .eq("business_id", businessId)
      .maybeSingle();

    if (!allowanceRow) {
      const now = new Date();
      const monthLater = new Date(now.getTime() + 30 * 86400000);
      try {
        const { data: inserted } = await (supabase.from as any)("ai_credit_allowances")
          .insert({
            business_id: businessId,
            plan_tier: "starter",
            monthly_credit_allowance: 100,
            reset_period_start: now.toISOString(),
            reset_period_end: monthLater.toISOString(),
          })
          .select()
          .single();
        allowanceRow = inserted;
      } catch (err) {
        console.warn("[getAIAllowance] Non-blocking allowance insert notice:", err);
      }
    }

    const planTier = allowanceRow?.plan_tier ?? "starter";
    const monthlyAllowance = allowanceRow?.monthly_credit_allowance ?? (DEFAULT_PLAN_ALLOWANCES[planTier] || 100);
    const resetPeriodStart = allowanceRow?.reset_period_start ?? new Date().toISOString();
    const resetPeriodEnd = allowanceRow?.reset_period_end ?? new Date(Date.now() + 30 * 86400000).toISOString();

    // 2. Sum credits consumed in current period
    const { data: usageLogs } = await (supabase.from as any)("ai_usage_logs")
      .select("credits_consumed")
      .eq("business_id", businessId)
      .gte("created_at", resetPeriodStart);

    const usedCredits = (usageLogs || []).reduce((acc: number, log: any) => acc + (log.credits_consumed || 0), 0);
    const remainingCredits = Math.max(0, monthlyAllowance - usedCredits);
    const canGenerate = remainingCredits > 0;

    return {
      businessId,
      planTier,
      monthlyAllowance,
      usedCredits,
      remainingCredits,
      canGenerate,
      resetPeriodStart,
      resetPeriodEnd,
    };
  } catch (err) {
    console.error("[getAIAllowance] error:", err);
    return defaultStatus;
  }
}

export async function authorizeAndLogAIRequest(
  params: AuthorizeAIRequestParams
): Promise<AuthorizeAIRequestResult> {
  const { businessId, userId, actionType, complexityTier = "standard", requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` } = params;

  const cost = AI_CREDIT_COSTS[complexityTier];

  // 1. Free/deterministic actions bypass credit consumption
  if (cost === 0) {
    return {
      authorized: true,
      status: "authorized",
      message: "Deterministic action authorized (0 credits consumed).",
      requestId,
      creditsConsumed: 0,
      remainingCredits: 999,
    };
  }

  // 2. Duplicate generation protection (check request_id within last 10 seconds)
  const tenSecondsAgo = new Date(Date.now() - 10000).toISOString();
  const { data: recentDuplicate } = await (supabase.from as any)("ai_usage_logs")
    .select("id")
    .eq("business_id", businessId)
    .eq("request_id", requestId)
    .gte("created_at", tenSecondsAgo)
    .maybeSingle();

  if (recentDuplicate) {
    const allowance = await getAIAllowance(businessId, userId);
    return {
      authorized: false,
      status: "duplicate",
      message: "Duplicate AI request blocked to prevent duplicate generation.",
      requestId,
      creditsConsumed: 0,
      remainingCredits: allowance.remainingCredits,
    };
  }

  // 3. Allowance validation
  const allowance = await getAIAllowance(businessId, userId);

  if (!allowance.canGenerate || allowance.remainingCredits < cost) {
    return {
      authorized: false,
      status: "exhausted",
      message: `AI credit limit reached. ${cost} credits required, but only ${allowance.remainingCredits} remaining in your monthly allowance.`,
      requestId,
      creditsConsumed: 0,
      remainingCredits: allowance.remainingCredits,
    };
  }

  // 4. Record usage log in Supabase
  try {
    await (supabase.from as any)("ai_usage_logs").insert({
      business_id: businessId,
      user_id: userId || null,
      action_type: actionType,
      complexity_tier: complexityTier,
      credits_consumed: cost,
      request_id: requestId,
      status: "completed",
    });
  } catch (err) {
    console.warn("[authorizeAndLogAIRequest] Non-blocking usage log notice:", err);
  }

  const updatedRemaining = Math.max(0, allowance.remainingCredits - cost);

  return {
    authorized: true,
    status: "authorized",
    message: `AI request authorized (${cost} credit${cost !== 1 ? "s" : ""} consumed).`,
    requestId,
    creditsConsumed: cost,
    remainingCredits: updatedRemaining,
  };
}
