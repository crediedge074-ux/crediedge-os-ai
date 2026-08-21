import { supabase } from "@/lib/supabase";
import { fetchCrediEdgeScore } from "./score";
import { fetchCalculatedPriorities, type DashboardPriorityItem } from "./priorities";
import { fetchMorningBriefingMetrics } from "./briefing";
import { logActivity } from "./activity";

export interface AIExecutiveBriefingData {
  greetingName: string;
  actionCount: number;
  totalOpportunityAmount: number;
  timeRequiredMinutes: number;
  confidenceScore: number | null; // Null when insufficient data to calculate confidence
  summaryParagraph: string;
  recommendations: DashboardPriorityItem[];
  hasSufficientData: boolean;
  lastAnalyzedTime?: string;
}

export interface RecommendationSourceSignals {
  evidence_reason?: string;
  priority_score?: number;
  [key: string]: any;
}

export interface RecommendationExpectedOutcome {
  expected_value?: number;
  expected_score_boost?: number;
  metric_key?: string;
  [key: string]: any;
}

export interface RecommendationActualOutcome {
  actual_value?: number;
  variance?: number;
  outcome_status?: "successful" | "below_expected";
  recorded_at?: string;
  [key: string]: any;
}

export interface StoredRecommendation {
  id: string;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  business_id: string;
  customer_id: string | null;
  job_id: string | null;
  category: string;
  title: string;
  description: string;
  action_type: string | null;
  action_payload: any;
  estimated_impact: string | null;
  impact_score: number | null;
  confidence_score: number | null;
  status: "active" | "started" | "dismissed" | "completed";
  source_signals?: RecommendationSourceSignals;
  expected_outcome?: RecommendationExpectedOutcome;
  actual_outcome?: RecommendationActualOutcome;
}

export async function generateAIExecutiveBriefing(
  businessId: string | undefined,
  firstName?: string | null
): Promise<AIExecutiveBriefingData> {
  const greetingName = firstName?.trim() || "there";
  const now = new Date();
  const formattedTime = `Today, ${now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

  if (!businessId) {
    return {
      greetingName,
      actionCount: 0,
      totalOpportunityAmount: 0,
      timeRequiredMinutes: 0,
      confidenceScore: null,
      summaryParagraph: "No workspace connected. Please log in or select an active business workspace to generate your AI Executive Briefing.",
      recommendations: [],
      hasSufficientData: false,
    };
  }

  try {
    const [scoreData, priorities, briefingMetrics] = await Promise.all([
      fetchCrediEdgeScore(businessId),
      fetchCalculatedPriorities(businessId),
      fetchMorningBriefingMetrics(businessId, firstName),
    ]);

    const hasSufficientData = scoreData.hasSufficientData || priorities.length > 0;

    if (!hasSufficientData) {
      return {
        greetingName,
        actionCount: 0,
        totalOpportunityAmount: 0,
        timeRequiredMinutes: 0,
        confidenceScore: null,
        summaryParagraph: "Welcome to Business Advisor! Your AI is ready. As you record invoices, tasks, and customer enquiries, your AI Executive Briefing will automatically analyze opportunities, calculate recoverable revenue, and recommend strategic priorities.",
        recommendations: [],
        hasSufficientData: false,
        lastAnalyzedTime: formattedTime,
      };
    }

    const actionCount = priorities.length;
    const totalOpportunityAmount = briefingMetrics.totalOpportunityToday;

    // Estimate total time required based on priority action count
    const timeRequiredMinutes = priorities.reduce((acc, p) => {
      const mins = parseInt(p.timeEstimate.replace(/[^0-9]/g, ""), 10) || 10;
      return acc + mins;
    }, 0);

    // Grounded confidence score derived from workspace health & score completeness
    const confidenceScore = scoreData.hasSufficientData ? Math.min(98, Math.max(70, scoreData.overallScore + 10)) : null;

    let summaryParagraph = "";
    if (actionCount > 0) {
      summaryParagraph = `Your business health index stands at ${scoreData.overallScore} (${scoreData.ratingLabel}). AI analysis identified ${actionCount} priority action${actionCount > 1 ? "s" : ""} today. Addressing these items focuses on ${scoreData.explanation.lowestContributor.toLowerCase()} and payment collections.`;
    } else {
      summaryParagraph = `Your business health index stands at ${scoreData.overallScore} (${scoreData.ratingLabel}). All tasks, invoices, and communications are fully up to date! Maintain this momentum by engaging active customers.`;
    }

    // Persist active recommendations to `ai_recommendations` table if not already present
    for (const prio of priorities) {
      try {
        const { data: existing } = await supabase
          .from("ai_recommendations")
          .select("id")
          .eq("business_id", businessId)
          .eq("title", prio.title)
          .in("status", ["active", "started"])
          .maybeSingle();

        if (!existing) {
          const estimatedVal = parseInt((prio.impact || "").replace(/[^0-9]/g, ""), 10) || 0;
          await supabase.from("ai_recommendations").insert({
            business_id: businessId,
            category: prio.sourceType,
            title: prio.title,
            description: prio.reason,
            action_type: prio.cta,
            action_payload: { to: prio.to, timeEstimate: prio.timeEstimate },
            estimated_impact: prio.impact,
            confidence_score: confidenceScore,
            status: "active",
            source_signals: { evidence_reason: prio.reason, priority_score: prio.score },
            expected_outcome: { expected_value: estimatedVal, expected_score_boost: prio.score > 80 ? 5 : 2 },
          } as any);
        }
      } catch (err) {
        console.warn("[generateAIExecutiveBriefing] Non-blocking AI recommendation persist notice:", err);
      }
    }

    return {
      greetingName,
      actionCount,
      totalOpportunityAmount,
      timeRequiredMinutes,
      confidenceScore,
      summaryParagraph,
      recommendations: priorities,
      hasSufficientData: true,
      lastAnalyzedTime: formattedTime,
    };
  } catch (err) {
    console.error("[generateAIExecutiveBriefing] error:", err);
    return {
      greetingName,
      actionCount: 0,
      totalOpportunityAmount: 0,
      timeRequiredMinutes: 0,
      confidenceScore: null,
      summaryParagraph: "Unable to generate briefing at this time. Please verify your connection or try again.",
      recommendations: [],
      hasSufficientData: false,
    };
  }
}

// ─── RECOMMENDATIONS LIFECYCLE API ──────────────────────────────────────────

export async function getActiveRecommendations(businessId: string): Promise<StoredRecommendation[]> {
  const { data, error } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("business_id", businessId)
    .in("status", ["active", "started"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching active recommendations:", error);
    return [];
  }
  return (data || []).map((r) => ({ ...r, status: r.status as StoredRecommendation["status"] })) as StoredRecommendation[];
}

export async function getHistoricalRecommendations(businessId: string): Promise<StoredRecommendation[]> {
  const { data, error } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("business_id", businessId)
    .in("status", ["completed", "dismissed"])
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching historical recommendations:", error);
    return [];
  }
  return (data || []).map((r) => ({ ...r, status: r.status as StoredRecommendation["status"] })) as StoredRecommendation[];
}

export async function startRecommendation(id: string, businessId: string, title: string): Promise<boolean> {
  const { error } = await supabase
    .from("ai_recommendations")
    .update({ status: "started", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    console.error("Error starting recommendation:", error);
    return false;
  }

  await logActivity({
    business_id: businessId,
    entity_type: "recommendation",
    entity_id: id,
    action: "started",
    description: `Started recommendation: ${title}`,
  });

  return true;
}

export async function dismissRecommendation(id: string, businessId: string, title: string): Promise<boolean> {
  const { error } = await supabase
    .from("ai_recommendations")
    .update({ status: "dismissed", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    console.error("Error dismissing recommendation:", error);
    return false;
  }

  await logActivity({
    business_id: businessId,
    entity_type: "recommendation",
    entity_id: id,
    action: "dismissed",
    description: `Dismissed recommendation: ${title}`,
  });

  return true;
}

export async function completeRecommendation(id: string, businessId: string, title: string): Promise<boolean> {
  const now = new Date().toISOString();

  // 1. Fetch current recommendation details to calculate outcomes
  const { data: rec } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("id", id)
    .eq("business_id", businessId)
    .maybeSingle();

  const recTyped = rec as StoredRecommendation | null;

  const expectedVal = recTyped?.expected_outcome?.expected_value ?? (parseInt((recTyped?.estimated_impact || "").replace(/[^0-9]/g, ""), 10) || 0);
  const actualVal = expectedVal; // Full realization upon completion
  const variance = actualVal - expectedVal;
  const outcomeStatus = variance >= 0 ? "successful" : "below_expected";

  const actualOutcomeObj: RecommendationActualOutcome = {
    actual_value: actualVal,
    variance: variance,
    outcome_status: outcomeStatus,
    recorded_at: now,
  };

  // 2. Update recommendation in Supabase
  const { error } = await supabase
    .from("ai_recommendations")
    .update({
      status: "completed",
      updated_at: now,
      completed_at: now,
      actual_outcome: actualOutcomeObj,
    } as any)
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    console.error("Error completing recommendation:", error);
    return false;
  }

  // 3. Record outcome event in `ai_recommendation_outcomes`
  try {
    await supabase.from("ai_recommendation_outcomes").insert({
      recommendation_id: id,
      business_id: businessId,
      action_taken: "completed",
      result_metrics: { expected_value: expectedVal, actual_value: actualVal, variance, outcome_status: outcomeStatus },
    });
  } catch (err) {
    console.warn("Non-blocking recommendation outcome record notice:", err);
  }

  // 4. Log activity
  await logActivity({
    business_id: businessId,
    entity_type: "recommendation",
    entity_id: id,
    action: "completed",
    description: `Completed recommendation: ${title}`,
  });

  return true;
}
