import { useState, useEffect } from "react";
import { MessageSquare, Star, Globe, PoundSterling, ChartBar as BarChart3, Users, ArrowRight, Clock, TrendingUp, Play, Check, X, ChevronDown, ChevronUp, ShieldCheck, Eye, Brain } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  getActiveRecommendations,
  startRecommendation,
  dismissRecommendation,
  completeRecommendation,
  type StoredRecommendation,
} from "@/services/advisor";

type Priority = "critical" | "high" | "medium" | "low";

const priorityConfig: Record<
  Priority,
  { label: string; border: string; bg: string; dot: string; badge: string }
> = {
  critical: {
    label: "Critical",
    border: "border-destructive/25",
    bg: "hover:bg-destructive/3",
    dot: "bg-destructive animate-pulse",
    badge: "bg-destructive/10 text-destructive",
  },
  high: {
    label: "High",
    border: "border-brand/20",
    bg: "hover:bg-brand/3",
    dot: "bg-brand",
    badge: "bg-brand/10 text-brand",
  },
  medium: {
    label: "Medium",
    border: "border-border",
    bg: "hover:bg-secondary/50",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
  },
  low: {
    label: "Low",
    border: "border-border",
    bg: "hover:bg-secondary/30",
    dot: "bg-muted-foreground/40",
    badge: "bg-secondary text-muted-foreground",
  },
};

function getCategoryIcon(category: string): LucideIcon {
  if (category === "invoice" || category === "Revenue") return PoundSterling;
  if (category === "communication" || category === "enquiry") return MessageSquare;
  if (category === "review") return Star;
  if (category === "website") return Globe;
  if (category === "customer") return Users;
  return BarChart3;
}

function getCategoryRoute(category: string): string {
  if (category === "invoice" || category === "Revenue") return "/relationships";
  if (category === "communication" || category === "enquiry") return "/communications";
  if (category === "review") return "/reviews";
  if (category === "website") return "/website";
  if (category === "customer") return "/relationships";
  return "/tasks";
}

function RecommendationCard({
  rec,
  idx,
  isProcessing,
  onStart,
  onDismiss,
  onComplete,
}: {
  rec: StoredRecommendation;
  idx: number;
  isProcessing: boolean;
  onStart: (r: StoredRecommendation) => void;
  onDismiss: (r: StoredRecommendation) => void;
  onComplete: (r: StoredRecommendation) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const Icon = getCategoryIcon(rec.category);
  const route = getCategoryRoute(rec.category);
  const prioLevel: Priority = rec.confidence_score && rec.confidence_score > 85 ? "critical" : "high";
  const cfg = priorityConfig[prioLevel];

  const provenance = rec.source_signals?.data_status ?? "connected";
  const evidenceReason = rec.source_signals?.evidence_reason ?? rec.description;
  const signalPriority = rec.source_signals?.priority_score ?? rec.impact_score ?? 80;
  const expectedValue = rec.expected_outcome?.expected_value ?? 0;

  return (
    <div
      className={`group rounded-2xl border bg-card shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card overflow-hidden ${cfg.border} ${cfg.bg}`}
    >
      <div className="p-5 flex flex-col sm:flex-row items-start gap-4">
        <div className="shrink-0 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/60">
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </div>
          <div className="text-[10px] font-bold text-muted-foreground/50">#{idx + 1}</div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[14px] font-semibold text-foreground">{rec.title}</h3>
            <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            {rec.status === "started" && (
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                In Progress
              </span>
            )}
          </div>

          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
            {rec.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[10.5px] font-semibold text-foreground uppercase">
              {rec.category}
            </span>
            {rec.estimated_impact && (
              <span className="flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 text-[10.5px] font-bold text-brand">
                <TrendingUp className="h-2.5 w-2.5" strokeWidth={2} />
                {rec.estimated_impact} (Estimated Target)
              </span>
            )}
            {rec.confidence_score && (
              <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700">
                {rec.confidence_score}% Confidence
              </span>
            )}
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
              Data: {provenance}
            </span>
          </div>
        </div>

        {/* Lifecycle Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-start">
          {rec.status !== "started" && (
            <button
              onClick={() => onStart(rec)}
              disabled={isProcessing}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-secondary/50 px-3 py-1.5 text-[11.5px] font-semibold text-foreground transition-all hover:bg-secondary"
            >
              <Play className="h-3 w-3" /> Start
            </button>
          )}

          <Link
            to={route}
            className="inline-flex items-center gap-1 rounded-xl bg-foreground px-3.5 py-1.5 text-[11.5px] font-semibold text-background transition-all hover:bg-foreground/85"
          >
            {rec.action_type || "Take Action"}
            <ArrowRight className="h-3 w-3" />
          </Link>

          <button
            onClick={() => onComplete(rec)}
            disabled={isProcessing}
            title="Mark recommendation as completed"
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11.5px] font-semibold text-white transition-all hover:bg-emerald-700"
          >
            <Check className="h-3 w-3" /> Complete
          </button>

          <button
            onClick={() => onDismiss(rec)}
            disabled={isProcessing}
            title="Dismiss recommendation"
            className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Evidence & Provenance Bar */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between border-t border-border px-5 py-2.5 text-[11.5px] font-semibold text-brand transition-colors duration-150 hover:bg-secondary/40"
      >
        <span className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5" /> Inspect Reasoning & Evidence Signals
        </span>
        {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {expanded && (
        <div className="border-t border-border bg-secondary/30 p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-card border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Brain className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Trigger Signal & Evidence</span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-foreground/80">{evidenceReason}</p>
            </div>

            <div className="rounded-xl bg-card border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Data Provenance & Confidence</span>
              </div>
              <div className="space-y-1.5 text-[12px] text-foreground/80">
                <div>Provenance: <span className="font-bold text-foreground capitalize">{provenance}</span></div>
                <div>Signal Priority Score: <span className="font-bold text-foreground">{signalPriority}/100</span></div>
                <div>Target Target: <span className="font-bold text-brand">{expectedValue > 0 ? `+£${expectedValue.toLocaleString()}` : "N/A"}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AIRecommendations() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [recommendations, setRecommendations] = useState<StoredRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionIds, setActionIds] = useState<Record<string, boolean>>({});

  const loadRecommendations = () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getActiveRecommendations(businessId)
      .then((data) => {
        setRecommendations(data);
      })
      .catch((err) => {
        console.error("Failed to load active recommendations:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRecommendations();
  }, [businessId]);

  const handleStart = async (rec: StoredRecommendation) => {
    if (!businessId || actionIds[rec.id]) return;
    setActionIds((prev) => ({ ...prev, [rec.id]: true }));

    setRecommendations((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, status: "started" } : r))
    );

    await startRecommendation(rec.id, businessId, rec.title);
    setActionIds((prev) => {
      const copy = { ...prev };
      delete copy[rec.id];
      return copy;
    });
  };

  const handleDismiss = async (rec: StoredRecommendation) => {
    if (!businessId || actionIds[rec.id]) return;
    setActionIds((prev) => ({ ...prev, [rec.id]: true }));

    setRecommendations((prev) => prev.filter((r) => r.id !== rec.id));

    await dismissRecommendation(rec.id, businessId, rec.title);
    setActionIds((prev) => {
      const copy = { ...prev };
      delete copy[rec.id];
      return copy;
    });
  };

  const handleComplete = async (rec: StoredRecommendation) => {
    if (!businessId || actionIds[rec.id]) return;
    setActionIds((prev) => ({ ...prev, [rec.id]: true }));

    setRecommendations((prev) => prev.filter((r) => r.id !== rec.id));

    await completeRecommendation(rec.id, businessId, rec.title);
    setActionIds((prev) => {
      const copy = { ...prev };
      delete copy[rec.id];
      return copy;
    });
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold tracking-tight text-foreground">AI Recommendations</h2>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            Transparent recommendations with inspectable evidence and source provenance.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          Loading recommendations for your workspace...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <div className="text-[14px] font-semibold text-foreground mb-1">
            No Active Recommendations
          </div>
          <p className="max-w-md mx-auto text-[12px] text-muted-foreground">
            Your Advisor is learning your business. Add customers, enquiries, invoices, or tasks to start receiving actionable AI recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              idx={idx}
              isProcessing={!!actionIds[rec.id]}
              onStart={handleStart}
              onDismiss={handleDismiss}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
