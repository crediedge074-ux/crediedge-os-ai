import { Task } from "@/lib/database.types";

export interface PriorityFactor {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  points: number;
}

export interface PrioritisedTask {
  task: Task;
  calculatedScore: number; // 0 - 100
  calculatedTier: "Urgent" | "High" | "Medium" | "Low";
  reasons: PriorityFactor[];
  estimatedImpactText: string;
  estimatedEffortText: string;
  aiRecommendation?: {
    suggestedAdjustment?: string;
    explanation: string;
    confidence: number;
  };
}

export function calculateDeterministicTaskPriority(
  task: Task,
  campaignName?: string | null,
  missionTitle?: string | null
): PrioritisedTask {
  let score = 30; // Baseline score
  const reasons: PriorityFactor[] = [];

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // 1. Urgency / Due Date Factor (up to +35 pts)
  if (task.due_date) {
    const dueDateStr = task.due_date.slice(0, 10);
    if (dueDateStr < todayStr) {
      score += 35;
      reasons.push({ factor: "Overdue task requiring immediate recovery", impact: "positive", points: 35 });
    } else if (dueDateStr === todayStr) {
      score += 30;
      reasons.push({ factor: "Due today", impact: "positive", points: 30 });
    } else {
      const diffDays = Math.ceil((new Date(dueDateStr).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 3) {
        score += 15;
        reasons.push({ factor: `Due within ${diffDays} days`, impact: "positive", points: 15 });
      }
    }
  }

  // 2. Base Task Priority Rating (up to +25 pts)
  if (task.priority === "urgent") {
    score += 25;
    reasons.push({ factor: "Explicitly marked Urgent priority", impact: "positive", points: 25 });
  } else if (task.priority === "high") {
    score += 15;
    reasons.push({ factor: "Explicitly marked High priority", impact: "positive", points: 15 });
  } else if (task.priority === "medium") {
    score += 5;
  }

  // 3. Strategic Context — Campaign / Mission linkage (up to +20 pts)
  const isLinkedToMission = Boolean((task as any).mission_id || missionTitle);
  const isLinkedToCampaign = Boolean((task as any).campaign_id || campaignName);

  if (isLinkedToCampaign || isLinkedToMission) {
    score += 15;
    const contextTag = campaignName ? `Campaign: ${campaignName}` : `Mission: ${missionTitle}`;
    reasons.push({ factor: `Linked to active strategic workstream (${contextTag})`, impact: "positive", points: 15 });
  }

  // 4. Financial / Business Impact (up to +15 pts)
  const impactVal = Number((task as any).estimated_impact_value) || 0;
  let estimatedImpactText = "Insufficient data";
  if (impactVal > 0) {
    estimatedImpactText = `£${impactVal.toLocaleString()} (Estimated)`;
    if (impactVal >= 1000) {
      score += 15;
      reasons.push({ factor: `High estimated business impact (£${impactVal.toLocaleString()})`, impact: "positive", points: 15 });
    } else if (impactVal >= 250) {
      score += 10;
      reasons.push({ factor: `Moderate estimated business impact (£${impactVal.toLocaleString()})`, impact: "positive", points: 10 });
    }
  }

  // 5. Effort / Duration Ratio
  const mins = Number((task as any).estimated_minutes) || 30;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  const estimatedEffortText = hours > 0 ? `${hours}h ${remMins}m` : `${mins}m`;

  if (mins <= 30) {
    score += 5;
    reasons.push({ factor: "Low effort quick-win task (<=30 mins)", impact: "positive", points: 5 });
  }

  // 6. Risk Level
  const risk = (task as any).risk_level || "low";
  if (risk === "high" || risk === "critical") {
    score += 10;
    reasons.push({ factor: "High operational risk if delayed", impact: "positive", points: 10 });
  }

  // Clamp score 0 - 100
  score = Math.min(100, Math.max(0, score));

  // Determine Tier
  let calculatedTier: "Urgent" | "High" | "Medium" | "Low" = "Low";
  if (score >= 80) calculatedTier = "Urgent";
  else if (score >= 60) calculatedTier = "High";
  else if (score >= 40) calculatedTier = "Medium";

  // Optional AI Recommendation Overlay (grounded, non-fabricating)
  let aiRecommendation;
  if ((task as any).ai_context_notes) {
    aiRecommendation = {
      explanation: (task as any).ai_context_notes,
      confidence: 88,
    };
  } else if (isLinkedToCampaign && impactVal >= 500) {
    aiRecommendation = {
      explanation: `AI Advisor Analysis: Completing this task accelerates campaign "${campaignName || 'Strategic Objective'}" and unlocks milestone value.`,
      confidence: 92,
    };
  }

  return {
    task,
    calculatedScore: score,
    calculatedTier,
    reasons,
    estimatedImpactText,
    estimatedEffortText,
    aiRecommendation,
  };
}
