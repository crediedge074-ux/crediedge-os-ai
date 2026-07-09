// ─── Shared TypeScript interfaces for Website DNA™ ───────────────────────────

export interface WebsiteScore {
  label: string;
  score: number;
  color: string;
  trend: number;
  description: string;
}

export interface WebsiteDiscovery {
  id: string;
  title: string;
  explanation: string;
  businessImpact: string;
  impactType: "positive" | "negative" | "neutral";
  confidence: number;
  relatedPages: string[];
}

export interface JourneyStep {
  label: string;
  visitors: number;
  dropOff: number;
  isDropPoint: boolean;
}

export interface ConversionMetric {
  label: string;
  value: string;
  trend: string;
  up: boolean;
  explanation: string;
}

export interface WebsiteOpportunity {
  id: string;
  title: string;
  estimatedRevenue: string;
  conversionIncrease: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeRequired: string;
  confidence: number;
  reasoning: string;
}

export interface SeoMetric {
  label: string;
  value: string;
  status: "good" | "warning" | "critical";
  detail: string;
}

export interface ContentIssue {
  id: string;
  page: string;
  type: "weak-headline" | "confusing" | "low-trust" | "poor-cta" | "missing-faq" | "missing-proof";
  issue: string;
  suggestion: string;
  impact: "high" | "medium" | "low";
}

export interface HeatmapPlaceholder {
  label: string;
  description: string;
  icon: string;
  status: "coming-soon";
}

export interface WebsitePrediction {
  label: string;
  current: string;
  predicted: string;
  confidence: number;
  direction: "up" | "down" | "flat";
  reasoning: string;
  timeframe: string;
}

export interface WebsiteMission {
  id: string;
  campaign: string;
  mission: string;
  tasks: string[];
  status: "active" | "planned" | "completed";
  estimatedRevenue: string;
}

export interface DnaContribution {
  module: string;
  contribution: number;
  color: string;
  route: string;
}

export interface WebsiteMemoryItem {
  id: string;
  insight: string;
  learnedFrom: string;
  confidence: number;
  category: string;
}

export interface WebsiteImpactMetric {
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
