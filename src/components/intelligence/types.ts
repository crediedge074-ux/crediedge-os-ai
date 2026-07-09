// ─── Shared TypeScript interfaces for Business Intelligence™ ─────────────────

export interface BusinessMetric {
  label: string;
  value: string | number;
  trend: string;
  up: boolean;
  unit?: string;
}

export interface DNAModule {
  id: string;
  name: string;
  score: number;
  trend: number;
  status: "excellent" | "strong" | "good" | "needs-attention" | "critical";
  contribution: number;
  description: string;
  route: string;
  color: string;
}

export interface BusinessInsight {
  id: string;
  title: string;
  explanation: string;
  impact: string;
  impactType: "positive" | "negative" | "neutral";
  confidence: number;
  module: string;
  moduleColor: string;
}

export interface HealthScore {
  label: string;
  score: number;
  color: string;
  trend: number;
}

export interface CauseEffectChain {
  id: string;
  title: string;
  color: string;
  steps: { label: string; type: "cause" | "effect" | "outcome" }[];
}

export interface Prediction {
  label: string;
  current: string;
  predicted: string;
  confidence: number;
  direction: "up" | "down" | "flat";
  reasoning: string;
  timeframe: string;
}

export interface BusinessOpportunity {
  id: string;
  title: string;
  value: string;
  roi: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeRequired: string;
  confidence: number;
  reasoning: string;
  module: string;
}

export interface BusinessRisk {
  id: string;
  title: string;
  probability: number;
  financialImpact: string;
  suggestedSolution: string;
  confidence: number;
  severity: "critical" | "high" | "medium" | "low";
}

export interface TimelineEvent {
  id: string;
  date: string;
  category: string;
  title: string;
  detail?: string;
  value?: string;
  sentiment: "positive" | "negative" | "neutral";
}

export interface Decision {
  id: string;
  recommendation: string;
  reason: string;
  confidence: number;
  expectedOutcome: string;
  priority: "urgent" | "high" | "medium" | "low";
}

export interface MemoryItem {
  id: string;
  insight: string;
  learnedFrom: string;
  confidence: number;
  category: string;
}

export interface ImpactMetric {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description: string;
  color: string;
}

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
}
