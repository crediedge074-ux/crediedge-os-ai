// ─── Shared TypeScript interfaces for Insight Engine™ ────────────────────────

export interface Discovery {
  id: string;
  title: string;
  evidence: string;
  explanation: string;
  confidence: number;
  businessImpact: string;
  impactType: "positive" | "negative" | "neutral";
  revenueOpportunity: string;
  recommendedAction: string;
  module: string;
  moduleColor: string;
  category: "behaviour" | "revenue" | "operations" | "marketing" | "retention";
  discoveredAt: string;
  isNew?: boolean;
}

export interface Pattern {
  id: string;
  title: string;
  description: string;
  dataPoints: string;
  strength: "strong" | "moderate" | "emerging";
  confidence: number;
  impact: string;
  category: string;
  color: string;
}

export interface Correlation {
  id: string;
  factorA: string;
  factorB: string;
  relationship: "positive" | "negative";
  strength: number;
  confidence: number;
  businessImpact: string;
  explanation: string;
  revenueEffect: string;
}

export interface HiddenOpportunity {
  id: string;
  title: string;
  description: string;
  estimatedValue: string;
  roi: string;
  difficulty: "Easy" | "Medium" | "Hard";
  confidence: number;
  timeRequired: string;
  reasoning: string;
  module: string;
}

export interface HiddenRisk {
  id: string;
  title: string;
  description: string;
  probability: number;
  financialImpact: string;
  urgency: "critical" | "high" | "medium" | "low";
  confidence: number;
  suggestedSolution: string;
  trend: "worsening" | "stable" | "improving";
}

export interface AIExperiment {
  id: string;
  hypothesis: string;
  description: string;
  expectedOutcome: string;
  estimatedRevenue: string;
  confidence: number;
  successCriteria: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "ready" | "running" | "completed";
}

export interface WhatChanged {
  id: string;
  metric: string;
  change: string;
  direction: "up" | "down" | "flat";
  magnitude: "significant" | "moderate" | "minor";
  explanation: string;
  period: string;
  value: string;
}

export interface IndustryBenchmark {
  id: string;
  insight: string;
  relevance: string;
  benchmark: string;
  yourPosition: string;
  gap: string;
  opportunity: string;
}

export interface MemoryItem {
  id: string;
  insight: string;
  learnedFrom: string;
  confidence: number;
  category: string;
  discoveredAt: string;
}

export interface InsightHistoryEntry {
  id: string;
  date: string;
  title: string;
  detail: string;
  module: string;
  moduleColor: string;
  impact: string;
}

export interface ImpactMetric {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description: string;
  color: string;
}

export interface FeedItem {
  id: string;
  timestamp: string;
  title: string;
  summary: string;
  confidence: number;
  impactType: "positive" | "negative" | "neutral";
  module: string;
  moduleColor: string;
  isNew: boolean;
}

export interface DNAContribution {
  module: string;
  discoveries: number;
  color: string;
  route: string;
}
