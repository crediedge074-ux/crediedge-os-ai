import { logActivity, getActivityLogs } from "@/services/activity";
import type { ActivityLog } from "@/lib/database.types";

export type DataProvenanceType =
  | "CONNECTED"
  | "DERIVED"
  | "AI ANALYSIS"
  | "INSUFFICIENT DATA"
  | "ESTIMATED";

export interface DataProvenanceMeta {
  type: DataProvenanceType;
  label?: string;
  methodology?: string;
  evidenceCount?: number;
  dataSources?: string[];
  lastUpdated?: string;
}

export interface ReportInaccurateOutputParams {
  businessId: string;
  feature: string;
  outputSummary: string;
  reason: string;
  customerId?: string | null;
  creditsToRefund?: number;
  metadata?: Record<string, any>;
}

export interface ConsumeCreditsParams {
  businessId: string;
  feature: string;
  creditsRequired: number;
  metadata?: Record<string, any>;
}

/**
  * Standardized AI Governance & Credit Service for CrediEdgeOS.
  */

export async function checkAICredits(businessId: string): Promise<{
  creditsRemaining: number;
  monthlyLimit: number;
  canProceed: boolean;
}> {
  // In CrediEdgeOS, monthly credits default to 3,000 credits per business workspace
  // We compute used credits from activity logs for the current month or default to existing balance
  const monthlyLimit = 3000;
  try {
    const logs = await getActivityLogs(businessId, 100);
    const aiLogs = logs.filter(
      (l) =>
        l.entity_type === "ai_governance" &&
        l.action === "ai_credits_consumed"
    );
    const totalConsumed = aiLogs.reduce((acc, log) => {
      const credits = (log.metadata as any)?.creditsRequired || 1;
      return acc + credits;
    }, 0);

    const creditsRemaining = Math.max(0, monthlyLimit - totalConsumed);
    return {
      creditsRemaining,
      monthlyLimit,
      canProceed: creditsRemaining > 0,
    };
  } catch (err) {
    console.error("Failed to check AI credits:", err);
    return { creditsRemaining: monthlyLimit, monthlyLimit, canProceed: true };
  }
}

export async function consumeAICredits({
  businessId,
  feature,
  creditsRequired,
  metadata = {},
}: ConsumeCreditsParams): Promise<{ success: boolean; remainingCredits: number }> {
  const status = await checkAICredits(businessId);
  if (!status.canProceed) {
    return { success: false, remainingCredits: 0 };
  }

  await logActivity({
    business_id: businessId,
    entity_type: "ai_governance",
    action: "ai_credits_consumed",
    description: `Consumed ${creditsRequired} AI credit(s) for ${feature}`,
    metadata: {
      feature,
      creditsRequired,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  });

  const remainingCredits = Math.max(0, status.creditsRemaining - creditsRequired);
  return { success: true, remainingCredits };
}

export async function reportInaccurateAIOutput({
  businessId,
  feature,
  outputSummary,
  reason,
  customerId = null,
  creditsToRefund = 1,
  metadata = {},
}: ReportInaccurateOutputParams): Promise<{ success: boolean; refundIssued: boolean }> {
  // Log inaccurate output report
  await logActivity({
    business_id: businessId,
    customer_id: customerId,
    entity_type: "ai_governance",
    action: "ai_inaccurate_output_reported",
    description: `Reported inaccurate AI output in ${feature}: "${reason}"`,
    metadata: {
      feature,
      outputSummary,
      reason,
      reportedAt: new Date().toISOString(),
      ...metadata,
    },
  });

  // Automatically refund credits to business workspace
  if (creditsToRefund > 0) {
    await logActivity({
      business_id: businessId,
      customer_id: customerId,
      entity_type: "ai_governance",
      action: "ai_credit_refunded",
      description: `Refunded ${creditsToRefund} AI credit(s) for reported inaccurate output in ${feature}`,
      metadata: {
        feature,
        creditsRefunded: creditsToRefund,
        refundedAt: new Date().toISOString(),
      },
    });
  }

  return { success: true, refundIssued: creditsToRefund > 0 };
}

export async function getAIGovernanceAuditLogs(businessId: string): Promise<ActivityLog[]> {
  const logs = await getActivityLogs(businessId, 50);
  return logs.filter((l) => l.entity_type === "ai_governance");
}
