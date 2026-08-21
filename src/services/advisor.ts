import { supabase } from "@/lib/supabase";
import { fetchCrediEdgeScore } from "./score";
import { fetchCalculatedPriorities, type DashboardPriorityItem } from "./priorities";
import { fetchMorningBriefingMetrics } from "./briefing";

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

    // Persist top recommendation to `ai_recommendations` table if available in schema
    if (priorities.length > 0) {
      const topPrio = priorities[0];
      try {
        await supabase
          .from("ai_recommendations")
          .insert({
            business_id: businessId,
            category: topPrio.sourceType,
            title: topPrio.title,
            description: topPrio.reason,
            action_type: topPrio.cta,
            estimated_impact: topPrio.impact,
            confidence_score: confidenceScore,
            status: "active",
          });
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
