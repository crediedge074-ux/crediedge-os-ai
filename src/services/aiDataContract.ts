import { supabase } from "@/lib/supabase";

export type AISourceStatus = "connected" | "inferred" | "estimated" | "derived";

export type AISourceType =
  | "invoices"
  | "payments"
  | "communications"
  | "jobs"
  | "calendar"
  | "tasks"
  | "reviews"
  | "customers"
  | "goals"
  | "website"
  | "banking"
  | "whatsapp"
  | "email";

export interface AISignalInput {
  businessId: string;
  sourceType: AISourceType;
  sourceId: string;
  entityType: string;
  signalType: string;
  signalValue: number | string | Record<string, any>;
  observedAt: string;
  confidence: number;
  dataStatus: AISourceStatus;
  metadata?: Record<string, any>;
}

export interface StandardRecommendationOutcome {
  expectedValue: number;
  actualValue: number | null;
  unit: "currency_gbp" | "minutes" | "count" | "points" | "percentage";
  measurementType: "verified" | "estimated" | "pending";
  measurementPeriod: string;
  variance: number | null;
  outcomeStatus: "successful" | "below_expected" | "pending";
  evidenceSource: string;
}

export interface StandardConfidenceScore {
  score: number;
  dataCompletenessPct: number;
  historicalOutcomeBonus: number;
  isGrounded: boolean;
  explanation: string;
}

export interface AISourceAdapter {
  sourceType: AISourceType;
  sourceName: string;
  isAvailable(businessId: string): Promise<boolean>;
  fetchSignalCount(businessId: string): Promise<number>;
  getProvenance(businessId: string): Promise<AISourceStatus>;
}

export interface AIEventLogParams {
  businessId: string;
  userId?: string | null;
  eventType: string;
  source: AISourceType | string;
  recommendationId?: string | null;
  metadata?: Record<string, any>;
}

// ─── CENTRAL CONFIDENCE SCORING ENGINE ──────────────────────────────────────

export function calculateStandardConfidenceScore(params: {
  hasSufficientData: boolean;
  overallScore: number;
  historicalCompletedCount: number;
  successfulOutcomeCount: number;
}): StandardConfidenceScore {
  const { hasSufficientData, overallScore, historicalCompletedCount, successfulOutcomeCount } = params;

  if (!hasSufficientData) {
    return {
      score: 50,
      dataCompletenessPct: 20,
      historicalOutcomeBonus: 0,
      isGrounded: false,
      explanation: "Low workspace data availability. Minimum baseline confidence applied.",
    };
  }

  // Base score grounded in workspace overall score
  const baseConfidence = Math.min(90, Math.max(65, overallScore + 10));

  // Historical feedback bonus (up to +10 pts for verified successful outcomes)
  let outcomeBonus = 0;
  if (historicalCompletedCount >= 3) {
    outcomeBonus = Math.min(10, successfulOutcomeCount * 2);
  }

  const finalScore = Math.min(98, baseConfidence + outcomeBonus);

  return {
    score: finalScore,
    dataCompletenessPct: Math.min(100, overallScore + 15),
    historicalOutcomeBonus: outcomeBonus,
    isGrounded: true,
    explanation: `Grounded in workspace health score (${overallScore}) with +${outcomeBonus} bonus from ${successfulOutcomeCount} verified successful outcomes.`,
  };
}

// ─── AI EVENT LOGGING ─────────────────────────────────────────────────────────

export async function logAIEvent(params: AIEventLogParams): Promise<boolean> {
  const { businessId, userId, eventType, source, recommendationId, metadata } = params;

  try {
    await (supabase.from as any)("ai_usage_logs").insert({
      business_id: businessId,
      user_id: userId || null,
      action_type: `event_${eventType}`,
      complexity_tier: "free",
      credits_consumed: 0,
      request_id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      status: "completed",
      provider: "internal_event_bus",
      model: source,
      estimated_cost_gbp: 0,
    });
    return true;
  } catch (err) {
    console.warn("[logAIEvent] Non-blocking AI event log notice:", err);
    return false;
  }
}

// ─── EXTENSIBLE SOURCE ADAPTER REGISTRY ──────────────────────────────────────

class AISourceRegistry {
  private adapters: Map<AISourceType, AISourceAdapter> = new Map();

  registerAdapter(adapter: AISourceAdapter) {
    this.adapters.set(adapter.sourceType, adapter);
  }

  getAdapter(sourceType: AISourceType): AISourceAdapter | undefined {
    return this.adapters.get(sourceType);
  }

  getAllAdapters(): AISourceAdapter[] {
    return Array.from(this.adapters.values());
  }
}

export const aiSourceRegistry = new AISourceRegistry();

// Standard Adapters for Core Workspace Modules
aiSourceRegistry.registerAdapter({
  sourceType: "invoices",
  sourceName: "Invoices & Revenue",
  async isAvailable(businessId: string) {
    const { count } = await supabase.from("invoices").select("id", { count: "exact", head: true }).eq("business_id", businessId);
    return (count || 0) > 0;
  },
  async fetchSignalCount(businessId: string) {
    const { count } = await supabase.from("invoices").select("id", { count: "exact", head: true }).eq("business_id", businessId);
    return count || 0;
  },
  async getProvenance() {
    return "connected";
  },
});

aiSourceRegistry.registerAdapter({
  sourceType: "communications",
  sourceName: "Inbound Enquiries & Messaging",
  async isAvailable(businessId: string) {
    const { count } = await supabase.from("communications").select("id", { count: "exact", head: true }).eq("business_id", businessId);
    return (count || 0) > 0;
  },
  async fetchSignalCount(businessId: string) {
    const { count } = await supabase.from("communications").select("id", { count: "exact", head: true }).eq("business_id", businessId);
    return count || 0;
  },
  async getProvenance() {
    return "connected";
  },
});

aiSourceRegistry.registerAdapter({
  sourceType: "jobs",
  sourceName: "Jobs & Work",
  async isAvailable(businessId: string) {
    const { count } = await supabase.from("jobs").select("id", { count: "exact", head: true }).eq("business_id", businessId);
    return (count || 0) > 0;
  },
  async fetchSignalCount(businessId: string) {
    const { count } = await supabase.from("jobs").select("id", { count: "exact", head: true }).eq("business_id", businessId);
    return count || 0;
  },
  async getProvenance() {
    return "connected";
  },
});

aiSourceRegistry.registerAdapter({
  sourceType: "reviews",
  sourceName: "Reviews & Ratings",
  async isAvailable(businessId: string) {
    const { count } = await supabase.from("reviews").select("id", { count: "exact", head: true }).eq("business_id", businessId);
    return (count || 0) > 0;
  },
  async fetchSignalCount(businessId: string) {
    const { count } = await supabase.from("reviews").select("id", { count: "exact", head: true }).eq("business_id", businessId);
    return count || 0;
  },
  async getProvenance() {
    return "connected";
  },
});

// Future Integrations Placeholders (Inferred/Estimated until connected)
const futureIntegrations: AISourceType[] = ["whatsapp", "email", "banking", "website"];
futureIntegrations.forEach((st) => {
  aiSourceRegistry.registerAdapter({
    sourceType: st,
    sourceName: st.charAt(0).toUpperCase() + st.slice(1),
    async isAvailable() {
      return false;
    },
    async fetchSignalCount() {
      return 0;
    },
    async getProvenance() {
      return "estimated";
    },
  });
});
