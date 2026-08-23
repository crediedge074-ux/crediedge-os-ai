import { supabase } from "@/lib/supabase";
import { fetchCrediEdgeScore } from "./score";
import { fetchCalculatedPriorities, type DashboardPriorityItem } from "./priorities";
import { fetchMorningBriefingMetrics } from "./briefing";
import { logActivity } from "./activity";
import { authorizeAndLogAIRequest, type AIAllowanceStatus, getAIAllowance } from "./aiUsage";
import {
  calculateStandardConfidenceScore,
  logAIEvent,
  type StandardRecommendationOutcome,
  type AISourceStatus,
} from "./aiDataContract";

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
  allowanceStatus?: AIAllowanceStatus;
  creditExhausted?: boolean;
}

export interface RecommendationSourceSignals {
  evidence_reason?: string;
  priority_score?: number;
  data_status?: AISourceStatus;
  [key: string]: any;
}

export interface RecommendationExpectedOutcome {
  expected_value?: number;
  expected_score_boost?: number;
  metric_key?: string;
  time_saved_minutes?: number;
  data_status?: AISourceStatus;
  [key: string]: any;
}

export interface RecommendationActualOutcome extends Partial<StandardRecommendationOutcome> {
  actual_value?: number | null;
  variance?: number | null;
  outcome_status?: "successful" | "below_expected" | "pending";
  recorded_at?: string;
  time_saved_minutes?: number | null;
  data_status?: AISourceStatus;
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

export interface AreaPerformanceMetric {
  area: string;
  dataAvailable: boolean;
  analysedCount: number;
  accuracyPct: number | null; // null if insufficient data to measure accuracy
  statusLabel: string;
}

export interface MonthlyImpactReport {
  monthLabel: string;
  completedCount: number;
  hasCompletedThisMonth: boolean;
  measuredRevenue: number | null;
  expectedRevenue: number | null;
  responseTimeImprovementPct: number | null;
  reviewScoreIncrease: number | null;
  scoreImprovement: number | null;
}

export interface AIPerformanceSummaryMetrics {
  completedCount: number;
  accuracyPct: number | null;
  measuredRevenue: number | null;
  expectedRevenue: number | null;
  measuredHoursSaved: number | null;
  expectedHoursSaved: number | null;
  scoreImprovement: number | null;
  hasMinimumSampleSize: boolean;
}

export interface WorkspaceAnalysedCounts {
  enquiriesAnalysed: number;
  bookingsAnalysed: number;
  reviewsAnalysed: number;
  invoicesProcessed: number;
  totalDataPoints: number;
}

export interface LearningSourceVolume {
  sourceName: string;
  recordCount: number;
  recommendationCount: number;
  isAvailable: boolean;
  provenance: AISourceStatus;
}

export interface RecurringPattern {
  id: string;
  category: string;
  occurrenceCount: number;
  description: string;
  suggestedFocus: string;
}

export interface AILearningSystemReport {
  totalDataPoints: number;
  completedRecommendationsCount: number;
  learningActive: boolean;
  learningStatusMessage: string;
  sourcesVolume: LearningSourceVolume[];
  recurringPatterns: RecurringPattern[];
  historicalFeedbackCount: number;
}

// Sensible sample size requirement to prevent misleading performance percentages from tiny datasets
export const MIN_ACCURACY_SAMPLE_SIZE = 3;

export async function generateAIExecutiveBriefing(
  businessId: string | undefined,
  firstName?: string | null,
  userId?: string | null
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

  // Authorize credit usage for briefing generation (standard tier = 2 credits)
  const authRes = await authorizeAndLogAIRequest({
    businessId,
    userId,
    actionType: "executive_briefing_generation",
    complexityTier: "standard",
  });

  const allowanceStatus = await getAIAllowance(businessId, userId);

  if (!authRes.authorized && authRes.status === "exhausted") {
    return {
      greetingName,
      actionCount: 0,
      totalOpportunityAmount: 0,
      timeRequiredMinutes: 0,
      confidenceScore: null,
      summaryParagraph: `AI Credit Limit Reached (${allowanceStatus.usedCredits}/${allowanceStatus.monthlyAllowance} credits used). Please upgrade your workspace allowance or wait until your reset period to generate additional briefings.`,
      recommendations: [],
      hasSufficientData: false,
      lastAnalyzedTime: formattedTime,
      allowanceStatus,
      creditExhausted: true,
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
        allowanceStatus,
        creditExhausted: false,
      };
    }

    const actionCount = priorities.length;
    const totalOpportunityAmount = briefingMetrics.totalOpportunityToday;

    // Estimate total time required based on priority action count
    const timeRequiredMinutes = priorities.reduce((acc, p) => {
      const mins = parseInt(p.timeEstimate.replace(/[^0-9]/g, ""), 10) || 10;
      return acc + mins;
    }, 0);

    // Contextual feedback from historical outcomes for this business_id
    const { data: rawHistoricalCompleted } = await supabase
      .from("ai_recommendations")
      .select("*")
      .eq("business_id", businessId)
      .eq("status", "completed");

    const historicalCompleted = (rawHistoricalCompleted || []) as StoredRecommendation[];

    const successfulOutcomeCount = historicalCompleted.filter(
      (r) => r.actual_outcome?.outcome_status === "successful"
    ).length;

    // Standardized confidence calculation engine
    const standardConfidence = calculateStandardConfidenceScore({
      hasSufficientData: scoreData.hasSufficientData,
      overallScore: scoreData.overallScore,
      historicalCompletedCount: historicalCompleted.length,
      successfulOutcomeCount,
    });

    const confidenceScore = standardConfidence.isGrounded ? standardConfidence.score : null;

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
            source_signals: { evidence_reason: prio.reason, priority_score: prio.score, data_status: "connected" },
            expected_outcome: { expected_value: estimatedVal, expected_score_boost: prio.score > 80 ? 5 : 2, data_status: "estimated" },
          } as any);
        }
      } catch (err) {
        console.warn("[generateAIExecutiveBriefing] Non-blocking AI recommendation persist notice:", err);
      }
    }

    // Log AI briefing generation event
    await logAIEvent({
      businessId,
      userId,
      eventType: "briefing_generated",
      source: "advisor_engine",
      metadata: { actionCount, totalOpportunityAmount, confidenceScore },
    });

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
      allowanceStatus,
      creditExhausted: false,
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
      allowanceStatus,
      creditExhausted: false,
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

  // 1. Fetch current recommendation details
  const { data: rec } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("id", id)
    .eq("business_id", businessId)
    .maybeSingle();

  const recTyped = rec as StoredRecommendation | null;
  const expectedVal = recTyped?.expected_outcome?.expected_value ?? 0;

  // Real measured outcomes are NOT fabricated upon completing an action.
  // Unless explicit measured value exists on the recommendation, actual_value remains null/pending.
  const actualVal = recTyped?.actual_outcome?.actual_value ?? null;
  const variance = actualVal !== null ? actualVal - expectedVal : null;
  const outcomeStatus = actualVal !== null ? (variance! >= 0 ? "successful" : "below_expected") : "pending";

  const actualOutcomeObj: RecommendationActualOutcome = {
    expectedValue: expectedVal,
    actualValue: actualVal,
    unit: "currency_gbp",
    measurementType: actualVal !== null ? "verified" : "pending",
    measurementPeriod: "post_action",
    variance: variance,
    outcomeStatus,
    evidenceSource: recTyped?.category || "system",
    recorded_at: now,
    time_saved_minutes: recTyped?.actual_outcome?.time_saved_minutes ?? null,
    data_status: actualVal !== null ? "connected" : "estimated",
  };

  // 2. Update recommendation status in Supabase
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

  // 4. Log activity and AI event
  await logActivity({
    business_id: businessId,
    entity_type: "recommendation",
    entity_id: id,
    action: "completed",
    description: `Completed recommendation: ${title}`,
  });

  await logAIEvent({
    businessId,
    eventType: "recommendation_completed",
    source: "advisor_engine",
    recommendationId: id,
    metadata: { title, outcomeStatus },
  });

  return true;
}

// ─── AI IMPACT MEASUREMENT & ANALYTICS SERVICES ─────────────────────────────

export async function fetchBusinessAreaMetrics(businessId: string | undefined): Promise<AreaPerformanceMetric[]> {
  const areaKeys = [
    "Bookings",
    "Customers",
    "Revenue",
    "Reviews",
    "Website",
    "Communications",
    "Tasks",
    "Goals",
  ];

  if (!businessId) {
    return areaKeys.map((area) => ({
      area,
      dataAvailable: false,
      analysedCount: 0,
      accuracyPct: null,
      statusLabel: "Insufficient data",
    }));
  }

  try {
    // 1. Fetch real workspace table counts in parallel
    const [
      jobsRes,
      calRes,
      custRes,
      invRes,
      payRes,
      revRes,
      integRes,
      commRes,
      taskRes,
      goalRes,
      completedRecsRes,
    ] = await Promise.all([
      supabase.from("jobs").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("calendar_events").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("customers").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("invoices").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("payments").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("integrations").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("communications").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("tasks").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("goals").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("ai_recommendations").select("*").eq("business_id", businessId).eq("status", "completed"),
    ]);

    const bookingsCount = (jobsRes.count || 0) + (calRes.count || 0);
    const customersCount = custRes.count || 0;
    const revenueCount = (invRes.count || 0) + (payRes.count || 0);
    const reviewsCount = revRes.count || 0;
    const websiteCount = integRes.count || 0;
    const commsCount = commRes.count || 0;
    const tasksCount = taskRes.count || 0;
    const goalsCount = goalRes.count || 0;

    const completedRecs = (completedRecsRes.data || []) as StoredRecommendation[];

    const areaCounts: Record<string, number> = {
      Bookings: bookingsCount,
      Customers: customersCount,
      Revenue: revenueCount,
      Reviews: reviewsCount,
      Website: websiteCount,
      Communications: commsCount,
      Tasks: tasksCount,
      Goals: goalsCount,
    };

    const areaCategoryMap: Record<string, string[]> = {
      Bookings: ["job", "booking", "calendar_event"],
      Customers: ["customer", "relationship"],
      Revenue: ["invoice", "Revenue", "payment"],
      Reviews: ["review"],
      Website: ["website", "integration"],
      Communications: ["communication", "enquiry"],
      Tasks: ["task"],
      Goals: ["goal"],
    };

    return areaKeys.map((area) => {
      const count = areaCounts[area] || 0;
      const dataAvailable = count > 0;

      // Filter completed recommendations relevant to this area with measured outcomes
      const relevantCategories = areaCategoryMap[area] || [];
      const areaRecsWithMeasuredOutcomes = completedRecs.filter(
        (r) =>
          relevantCategories.some((cat) => r.category.toLowerCase().includes(cat.toLowerCase())) &&
          r.actual_outcome?.actual_value !== undefined &&
          r.actual_outcome?.actual_value !== null
      );

      let accuracyPct: number | null = null;
      let statusLabel = "Insufficient data";

      if (!dataAvailable) {
        statusLabel = "Insufficient data";
      } else if (areaRecsWithMeasuredOutcomes.length < MIN_ACCURACY_SAMPLE_SIZE) {
        statusLabel = areaRecsWithMeasuredOutcomes.length > 0 ? "Sample size too small (<3)" : "No measurable impact yet";
      } else {
        const totalAccuracy = areaRecsWithMeasuredOutcomes.reduce((acc, r) => {
          const expected = r.expected_outcome?.expected_value ?? 0;
          const actual = r.actual_outcome?.actual_value ?? 0;
          if (expected > 0) {
            return acc + Math.min(100, Math.round((actual / expected) * 100));
          }
          return acc + (r.confidence_score ?? 0);
        }, 0);
        accuracyPct = Math.round(totalAccuracy / areaRecsWithMeasuredOutcomes.length);
        statusLabel = `${accuracyPct}% accuracy`;
      }

      return {
        area,
        dataAvailable,
        analysedCount: count,
        accuracyPct,
        statusLabel,
      };
    });
  } catch (err) {
    console.error("[fetchBusinessAreaMetrics] error:", err);
    return areaKeys.map((area) => ({
      area,
      dataAvailable: false,
      analysedCount: 0,
      accuracyPct: null,
      statusLabel: "Insufficient data",
    }));
  }
}

export async function fetchMonthlyImpactMetrics(businessId: string | undefined): Promise<MonthlyImpactReport> {
  const now = new Date();
  const monthName = now.toLocaleString("en-GB", { month: "long" });
  const yearStr = now.getFullYear();
  const monthLabel = `${monthName} ${yearStr}`;

  if (!businessId) {
    return {
      monthLabel,
      completedCount: 0,
      hasCompletedThisMonth: false,
      measuredRevenue: null,
      expectedRevenue: null,
      responseTimeImprovementPct: null,
      reviewScoreIncrease: null,
      scoreImprovement: null,
    };
  }

  // Current calendar month bounds: 1st of current month to now
  const startOfMonthIso = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  try {
    const { data: rawRecs } = await supabase
      .from("ai_recommendations")
      .select("*")
      .eq("business_id", businessId)
      .eq("status", "completed")
      .gte("updated_at", startOfMonthIso);

    const recs = (rawRecs || []) as StoredRecommendation[];

    if (recs.length === 0) {
      return {
        monthLabel,
        completedCount: 0,
        hasCompletedThisMonth: false,
        measuredRevenue: null,
        expectedRevenue: null,
        responseTimeImprovementPct: null,
        reviewScoreIncrease: null,
        scoreImprovement: null,
      };
    }

    let measuredRev = 0;
    let expectedRev = 0;
    let revMeasuredCount = 0;

    recs.forEach((r) => {
      const exp = r.expected_outcome?.expected_value ?? 0;
      const act = r.actual_outcome?.actual_value;
      if (exp > 0) expectedRev += exp;
      if (act !== undefined && act !== null) {
        measuredRev += act;
        revMeasuredCount++;
      }
    });

    return {
      monthLabel,
      completedCount: recs.length,
      hasCompletedThisMonth: true,
      measuredRevenue: revMeasuredCount > 0 ? measuredRev : null,
      expectedRevenue: expectedRev > 0 ? expectedRev : null,
      responseTimeImprovementPct: null, // Defensible null unless response time delta exists
      reviewScoreIncrease: null, // Defensible null unless review delta exists
      scoreImprovement: null, // Defensible null unless historical score delta exists
    };
  } catch (err) {
    console.error("[fetchMonthlyImpactMetrics] error:", err);
    return {
      monthLabel,
      completedCount: 0,
      hasCompletedThisMonth: false,
      measuredRevenue: null,
      expectedRevenue: null,
      responseTimeImprovementPct: null,
      reviewScoreIncrease: null,
      scoreImprovement: null,
    };
  }
}

export async function fetchAIPerformanceSummary(businessId: string | undefined): Promise<AIPerformanceSummaryMetrics> {
  if (!businessId) {
    return {
      completedCount: 0,
      accuracyPct: null,
      measuredRevenue: null,
      expectedRevenue: null,
      measuredHoursSaved: null,
      expectedHoursSaved: null,
      scoreImprovement: null,
      hasMinimumSampleSize: false,
    };
  }

  try {
    const { data: rawRecs } = await supabase
      .from("ai_recommendations")
      .select("*")
      .eq("business_id", businessId)
      .eq("status", "completed");

    const recs = (rawRecs || []) as StoredRecommendation[];

    if (recs.length === 0) {
      return {
        completedCount: 0,
        accuracyPct: null,
        measuredRevenue: null,
        expectedRevenue: null,
        measuredHoursSaved: null,
        expectedHoursSaved: null,
        scoreImprovement: null,
        hasMinimumSampleSize: false,
      };
    }

    let totalConfidenceSum = 0;
    let confidenceCount = 0;

    let measuredRevSum = 0;
    let expectedRevSum = 0;
    let revMeasuredCount = 0;

    let measuredMinutesSavedSum = 0;
    let timeMeasuredCount = 0;

    recs.forEach((r) => {
      if (r.confidence_score !== null && r.confidence_score !== undefined) {
        totalConfidenceSum += r.confidence_score;
        confidenceCount++;
      }

      const exp = r.expected_outcome?.expected_value ?? 0;
      const act = r.actual_outcome?.actual_value;

      if (exp > 0) expectedRevSum += exp;
      if (act !== undefined && act !== null) {
        measuredRevSum += act;
        revMeasuredCount++;
      }

      const minutes = r.actual_outcome?.time_saved_minutes;
      if (minutes !== undefined && minutes !== null) {
        measuredMinutesSavedSum += minutes;
        timeMeasuredCount++;
      }
    });

    const hasMinimumSampleSize = confidenceCount >= MIN_ACCURACY_SAMPLE_SIZE;
    const accuracyPct = hasMinimumSampleSize ? Math.round(totalConfidenceSum / confidenceCount) : null;

    return {
      completedCount: recs.length,
      accuracyPct,
      measuredRevenue: revMeasuredCount > 0 ? measuredRevSum : null,
      expectedRevenue: expectedRevSum > 0 ? expectedRevSum : null,
      measuredHoursSaved: timeMeasuredCount > 0 ? Math.round((measuredMinutesSavedSum / 60) * 10) / 10 : null,
      expectedHoursSaved: null,
      scoreImprovement: null, // Defensible null unless historical score before/after logged
      hasMinimumSampleSize,
    };
  } catch (err) {
    console.error("[fetchAIPerformanceSummary] error:", err);
    return {
      completedCount: 0,
      accuracyPct: null,
      measuredRevenue: null,
      expectedRevenue: null,
      measuredHoursSaved: null,
      expectedHoursSaved: null,
      scoreImprovement: null,
      hasMinimumSampleSize: false,
    };
  }
}

export async function fetchWorkspaceAnalysedCounts(businessId: string | undefined): Promise<WorkspaceAnalysedCounts> {
  if (!businessId) {
    return {
      enquiriesAnalysed: 0,
      bookingsAnalysed: 0,
      reviewsAnalysed: 0,
      invoicesProcessed: 0,
      totalDataPoints: 0,
    };
  }

  try {
    const [commsRes, jobsRes, calRes, revRes, invRes] = await Promise.all([
      supabase.from("communications").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("jobs").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("calendar_events").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("invoices").select("id", { count: "exact", head: true }).eq("business_id", businessId),
    ]);

    const enquiriesAnalysed = commsRes.count || 0;
    const bookingsAnalysed = (jobsRes.count || 0) + (calRes.count || 0);
    const reviewsAnalysed = revRes.count || 0;
    const invoicesProcessed = invRes.count || 0;
    const totalDataPoints = enquiriesAnalysed + bookingsAnalysed + reviewsAnalysed + invoicesProcessed;

    return {
      enquiriesAnalysed,
      bookingsAnalysed,
      reviewsAnalysed,
      invoicesProcessed,
      totalDataPoints,
    };
  } catch (err) {
    console.error("[fetchWorkspaceAnalysedCounts] error:", err);
    return {
      enquiriesAnalysed: 0,
      bookingsAnalysed: 0,
      reviewsAnalysed: 0,
      invoicesProcessed: 0,
      totalDataPoints: 0,
    };
  }
}

export async function fetchAILearningSystemData(businessId: string | undefined): Promise<AILearningSystemReport> {
  if (!businessId) {
    return {
      totalDataPoints: 0,
      completedRecommendationsCount: 0,
      learningActive: false,
      learningStatusMessage: "Learning inactive — no active business workspace connected.",
      sourcesVolume: [],
      recurringPatterns: [],
      historicalFeedbackCount: 0,
    };
  }

  try {
    const [
      analysedCounts,
      allRecsRes,
      outcomesRes,
      tasksRes,
      goalsRes,
      customersRes,
    ] = await Promise.all([
      fetchWorkspaceAnalysedCounts(businessId),
      supabase.from("ai_recommendations").select("*").eq("business_id", businessId),
      supabase.from("ai_recommendation_outcomes").select("*").eq("business_id", businessId),
      supabase.from("tasks").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("goals").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("customers").select("id", { count: "exact", head: true }).eq("business_id", businessId),
    ]);

    const allRecs = (allRecsRes.data || []) as StoredRecommendation[];
    const outcomes = outcomesRes.data || [];
    const completedRecs = allRecs.filter((r) => r.status === "completed");

    // Volume breakdown by data source
    const getSourceRecCount = (categoryKeys: string[]) =>
      allRecs.filter((r) => categoryKeys.some((cat) => r.category.toLowerCase().includes(cat.toLowerCase()))).length;

    const sourcesVolume: LearningSourceVolume[] = [
      {
        sourceName: "Invoices & Revenue",
        recordCount: analysedCounts.invoicesProcessed,
        recommendationCount: getSourceRecCount(["invoice", "revenue", "payment"]),
        isAvailable: analysedCounts.invoicesProcessed > 0,
        provenance: "connected",
      },
      {
        sourceName: "Enquiries & Comms",
        recordCount: analysedCounts.enquiriesAnalysed,
        recommendationCount: getSourceRecCount(["communication", "enquiry"]),
        isAvailable: analysedCounts.enquiriesAnalysed > 0,
        provenance: "connected",
      },
      {
        sourceName: "Bookings & Jobs",
        recordCount: analysedCounts.bookingsAnalysed,
        recommendationCount: getSourceRecCount(["job", "booking", "calendar"]),
        isAvailable: analysedCounts.bookingsAnalysed > 0,
        provenance: "connected",
      },
      {
        sourceName: "Tasks & Operations",
        recordCount: tasksRes.count || 0,
        recommendationCount: getSourceRecCount(["task"]),
        isAvailable: (tasksRes.count || 0) > 0,
        provenance: "connected",
      },
      {
        sourceName: "Customer Relationships",
        recordCount: customersRes.count || 0,
        recommendationCount: getSourceRecCount(["customer", "relationship"]),
        isAvailable: (customersRes.count || 0) > 0,
        provenance: "connected",
      },
      {
        sourceName: "Goals & Growth",
        recordCount: goalsRes.count || 0,
        recommendationCount: getSourceRecCount(["goal"]),
        isAvailable: (goalsRes.count || 0) > 0,
        provenance: "connected",
      },
    ];

    // Identify recurring patterns from recommendation history for this business_id
    const categoryCounts: Record<string, number> = {};
    allRecs.forEach((r) => {
      const cat = r.category || "General";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const recurringPatterns: RecurringPattern[] = Object.entries(categoryCounts)
      .filter(([_, count]) => count >= 2)
      .map(([cat, count], idx) => ({
        id: `pattern-${idx}`,
        category: cat,
        occurrenceCount: count,
        description: `Identified ${count} recurring recommendations in ${cat}. The AI contextual feedback loop prioritises resolving underlying bottleneck signals in this area.`,
        suggestedFocus: `Focus on streamlining ${cat.toLowerCase()} workflow triggers.`,
      }));

    const learningActive = completedRecs.length >= MIN_ACCURACY_SAMPLE_SIZE;
    const learningStatusMessage = learningActive
      ? `AI Learning engine is active with ${completedRecs.length} verified recommendation outcome logs calibrating workspace confidence.`
      : `AI Learning engine requires ${MIN_ACCURACY_SAMPLE_SIZE - completedRecs.length} more completed recommendation outcome(s) to calibrate workspace confidence.`;

    return {
      totalDataPoints: analysedCounts.totalDataPoints,
      completedRecommendationsCount: completedRecs.length,
      learningActive,
      learningStatusMessage,
      sourcesVolume,
      recurringPatterns,
      historicalFeedbackCount: outcomes.length,
    };
  } catch (err) {
    console.error("[fetchAILearningSystemData] error:", err);
    return {
      totalDataPoints: 0,
      completedRecommendationsCount: 0,
      learningActive: false,
      learningStatusMessage: "Unable to load AI Learning System metrics.",
      sourcesVolume: [],
      recurringPatterns: [],
      historicalFeedbackCount: 0,
    };
  }
}
