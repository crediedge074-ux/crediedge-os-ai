import { useState, useEffect, useRef } from "react";
import { TrendingUp, Clock, CircleCheck as CheckCircle2, ChevronDown, ChevronUp, Star, Target, Brain, Award, MessageSquare, Globe, PoundSterling, ChartBar as BarChart3, Sparkles, Calendar, Users, FileText, ShoppingBag, Trophy, Layers, Activity } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  getHistoricalRecommendations,
  fetchBusinessAreaMetrics,
  fetchMonthlyImpactMetrics,
  fetchAIPerformanceSummary,
  fetchWorkspaceAnalysedCounts,
  fetchAILearningSystemData,
  type StoredRecommendation,
  type AreaPerformanceMetric,
  type MonthlyImpactReport,
  type AIPerformanceSummaryMetrics,
  type WorkspaceAnalysedCounts,
  type AILearningSystemReport,
  MIN_ACCURACY_SAMPLE_SIZE,
} from "@/services/advisor";
import { useAuthContext } from "@/contexts/AuthContext";

type RecoStatus = "successful" | "below_expected" | "pending";

interface Achievement {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  earned: boolean;
}

function AnimatedNumber({
  target,
  prefix = "",
  suffix = "",
  duration = 1200,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const progress = Math.min((Date.now() - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

const statusConfig: Record<
  RecoStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  successful: {
    label: "Successful",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  below_expected: {
    label: "Below Expected",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  pending: {
    label: "Outcome Pending",
    bg: "bg-secondary",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/40",
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

// ─── Real Historical Recommendation Card ─────────────────────────────────────

function RealRecommendationCard({ reco }: { reco: StoredRecommendation }) {
  const [expanded, setExpanded] = useState(false);

  const isCompleted = reco.status === "completed";
  const outcomeStatus: RecoStatus = isCompleted
    ? reco.actual_outcome?.outcome_status ?? "pending"
    : "pending";

  const cfg = statusConfig[outcomeStatus] ?? statusConfig.pending;
  const Icon = getCategoryIcon(reco.category);

  const expectedVal = reco.expected_outcome?.expected_value ?? 0;
  const actualVal = reco.actual_outcome?.actual_value ?? null;
  const confidence = reco.confidence_score;

  const dateCreatedStr = new Date(reco.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  const dateCompletedStr = reco.completed_at
    ? new Date(reco.completed_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card">
      <div className="flex items-start gap-4 p-5">
        <div className="relative shrink-0">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
            <Icon className="h-[18px] w-[18px] text-foreground/60" strokeWidth={1.75} />
          </div>
          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${cfg.dot}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-[13.5px] font-semibold text-foreground">{reco.title}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[10.5px] font-semibold text-foreground uppercase">
                  {reco.category}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Suggested {dateCreatedStr} {dateCompletedStr ? `· Completed ${dateCompletedStr}` : "· Dismissed"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                {isCompleted ? cfg.label : "Dismissed"}
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
              <div className="text-[10px] font-medium text-muted-foreground">Expected Impact</div>
              <div className="mt-0.5 text-[14px] font-bold text-foreground">
                {reco.estimated_impact || (expectedVal > 0 ? `+£${expectedVal.toLocaleString()}` : "N/A")}
              </div>
            </div>
            <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
              <div className="text-[10px] font-medium text-muted-foreground">Actual Measured Result</div>
              <div className={`mt-0.5 text-[14px] font-bold ${isCompleted && actualVal !== null ? "text-emerald-600" : "text-muted-foreground"}`}>
                {isCompleted ? (actualVal !== null ? `£${actualVal.toLocaleString()}` : "Pending measurement") : "No outcome"}
              </div>
            </div>
            <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
              <div className="text-[10px] font-medium text-muted-foreground">AI Confidence</div>
              <div className="mt-0.5 text-[14px] font-bold text-foreground">
                {confidence !== null && confidence !== undefined ? `${confidence}%` : "Pending"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between border-t border-border px-5 py-2.5 text-[11.5px] font-semibold text-brand transition-colors duration-150 hover:bg-secondary/40"
      >
        <span>View Outcome</span>
        {expanded ? <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} /> : <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />}
      </button>

      {expanded && (
        <div className="border-t border-border bg-secondary/30 p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-card border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Brain className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Why Recommended</span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-foreground/80">{reco.description}</p>
            </div>

            <div className="rounded-xl bg-card border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Source Signals</span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-foreground/80">
                {reco.source_signals?.evidence_reason || `Signal priority score: ${reco.source_signals?.priority_score ?? "N/A"}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Expected Target</div>
              <div className="text-[11.5px] text-muted-foreground">Estimated Value</div>
              <div className="mt-1 text-[20px] font-bold text-foreground">
                {expectedVal > 0 ? `£${expectedVal.toLocaleString()}` : "N/A"}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-emerald-600">Actual Measured Outcome</div>
              <div className="text-[11.5px] text-muted-foreground">
                {isCompleted ? (actualVal !== null ? (outcomeStatus === "successful" ? "Successful" : "Below expected") : "Pending real measurement") : "Dismissed"}
              </div>
              <div className="mt-1 text-[20px] font-bold text-emerald-700">
                {isCompleted ? (actualVal !== null ? `£${actualVal.toLocaleString()}` : "Pending") : "N/A"}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-brand/15 bg-brand/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand/70">AI Feedback & Learning</span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-foreground/80">
              Learning data not yet available. As additional recommendation outcomes are recorded across your workspace, the AI feedback loop will automatically calibrate future impact estimations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Historical Section Component ─────────────────────────────────────────────

function HistoricalRecommendationsSection() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [historical, setHistorical] = useState<StoredRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (businessId) {
      setLoading(true);
      getHistoricalRecommendations(businessId)
        .then((data) => {
          if (mounted) {
            setHistorical(data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Failed to load historical recommendations:", err);
          if (mounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [businessId]);

  if (loading) {
    return <div className="p-6 text-center text-xs text-muted-foreground">Loading recommendation outcome history...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-[14px] font-semibold text-foreground">Recommendation History</h3>
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] text-muted-foreground">{historical.length} records</span>
      </div>

      {historical.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
          No completed or dismissed recommendations yet. As you complete actions, their expected vs actual outcomes will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {historical.map((r) => (
            <RealRecommendationCard key={r.id} reco={r} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Supporting Advisor Widgets ───────────────────────────────────────────────

function AIPerformanceSummary() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [summary, setSummary] = useState<AIPerformanceSummaryMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (businessId) {
      fetchAIPerformanceSummary(businessId).then((data) => {
        if (mounted) {
          setSummary(data);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [businessId]);

  const completedCount = summary?.completedCount ?? 0;
  const accuracyPct = summary?.accuracyPct;
  const measuredRevenue = summary?.measuredRevenue;
  const measuredHoursSaved = summary?.measuredHoursSaved;
  const hasMinSample = summary?.hasMinimumSampleSize;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
          <Brain className="h-[18px] w-[18px] text-brand" strokeWidth={2} />
        </div>
        <div>
          <div className="text-[15px] font-bold tracking-tight text-foreground">AI Performance Summary</div>
          <div className="text-[11.5px] text-muted-foreground">Transparent, measured cumulative impact from workspace recommendation data</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {/* Stat 1: Completed */}
        <div className="flex flex-col rounded-2xl border border-border bg-secondary/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
            <CheckCircle2 className="h-[15px] w-[15px]" strokeWidth={2} />
          </div>
          <div className="text-[22px] font-extrabold leading-none tracking-tight text-emerald-600">
            {loading ? "..." : <AnimatedNumber target={completedCount} />}
          </div>
          <div className="mt-1.5 text-[10.5px] leading-tight text-muted-foreground">Recommendations Completed</div>
        </div>

        {/* Stat 2: Accuracy */}
        <div className="flex flex-col rounded-2xl border border-border bg-secondary/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand/10 text-brand mb-3">
            <Target className="h-[15px] w-[15px]" strokeWidth={2} />
          </div>
          <div className="text-[22px] font-extrabold leading-none tracking-tight text-brand">
            {loading ? "..." : accuracyPct !== null && accuracyPct !== undefined ? `${accuracyPct}%` : "Pending"}
          </div>
          <div className="mt-1.5 text-[10.5px] leading-tight text-muted-foreground">
            {hasMinSample ? "Average AI Confidence" : `Sample size too small (<${MIN_ACCURACY_SAMPLE_SIZE})`}
          </div>
        </div>

        {/* Stat 3: Measured Revenue */}
        <div className="flex flex-col rounded-2xl border border-border bg-secondary/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
            <PoundSterling className="h-[15px] w-[15px]" strokeWidth={2} />
          </div>
          <div className="text-[22px] font-extrabold leading-none tracking-tight text-emerald-600">
            {loading ? "..." : measuredRevenue !== null && measuredRevenue !== undefined ? <AnimatedNumber target={measuredRevenue} prefix="£" /> : "£0"}
          </div>
          <div className="mt-1.5 text-[10.5px] leading-tight text-muted-foreground">
            {measuredRevenue !== null && measuredRevenue !== undefined ? "Measured Revenue Generated" : "No Measured Revenue Yet"}
          </div>
        </div>

        {/* Stat 4: Hours Saved */}
        <div className="flex flex-col rounded-2xl border border-border bg-secondary/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600 mb-3">
            <Clock className="h-[15px] w-[15px]" strokeWidth={2} />
          </div>
          <div className="text-[22px] font-extrabold leading-none tracking-tight text-blue-600">
            {loading ? "..." : measuredHoursSaved !== null && measuredHoursSaved !== undefined ? `${measuredHoursSaved} hrs` : "0 hrs"}
          </div>
          <div className="mt-1.5 text-[10.5px] leading-tight text-muted-foreground">
            {measuredHoursSaved !== null && measuredHoursSaved !== undefined ? "Measured Hours Saved" : "No Measured Time Saved Yet"}
          </div>
        </div>

        {/* Stat 5: Score Improvement */}
        <div className="flex flex-col rounded-2xl border border-border bg-secondary/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand/10 text-brand mb-3">
            <TrendingUp className="h-[15px] w-[15px]" strokeWidth={2} />
          </div>
          <div className="text-[22px] font-extrabold leading-none tracking-tight text-foreground">
            {loading ? "..." : "Pending"}
          </div>
          <div className="mt-1.5 text-[10.5px] leading-tight text-muted-foreground">No Historical Baseline</div>
        </div>
      </div>
    </div>
  );
}

function MonthlyImpact() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [monthly, setMonthly] = useState<MonthlyImpactReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (businessId) {
      fetchMonthlyImpactMetrics(businessId).then((data) => {
        if (mounted) {
          setMonthly(data);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [businessId]);

  return (
    <div className="rounded-2xl border border-border bg-foreground p-6 text-background shadow-card">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-background/60" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-background/50">This Calendar Month</span>
        </div>
        <div className="mt-2 text-[18px] font-bold leading-tight text-background">Monthly AI Impact Report</div>
        <div className="mt-1 text-[12.5px] text-background/60">{monthly?.monthLabel ?? "Current Month"}</div>
      </div>

      <div className="space-y-3">
        {/* Completed count */}
        <div className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-background/50" strokeWidth={1.75} />
          <div className="min-w-0 flex-1 text-[12.5px] text-background/70">AI recommendations completed</div>
          <div className="shrink-0 text-[15px] font-bold text-background">{loading ? "..." : monthly?.completedCount ?? 0}</div>
        </div>

        {/* Measured revenue */}
        <div className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3">
          <PoundSterling className="h-4 w-4 shrink-0 text-background/50" strokeWidth={1.75} />
          <div className="min-w-0 flex-1 text-[12.5px] text-background/70">Additional revenue generated</div>
          <div className="shrink-0 text-[15px] font-bold text-background">
            {loading ? "..." : monthly?.measuredRevenue !== null && monthly?.measuredRevenue !== undefined ? `£${monthly.measuredRevenue.toLocaleString()} (Measured)` : monthly?.expectedRevenue ? `£${monthly.expectedRevenue.toLocaleString()} (Expected)` : "No revenue yet"}
          </div>
        </div>

        {/* Response times */}
        <div className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3">
          <Clock className="h-4 w-4 shrink-0 text-background/50" strokeWidth={1.75} />
          <div className="min-w-0 flex-1 text-[12.5px] text-background/70">Response times improved</div>
          <div className="shrink-0 text-[12px] font-semibold text-background/60">Insufficient data to measure</div>
        </div>

        {/* Review score */}
        <div className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3">
          <Star className="h-4 w-4 shrink-0 text-background/50" strokeWidth={1.75} />
          <div className="min-w-0 flex-1 text-[12.5px] text-background/70">Review score change</div>
          <div className="shrink-0 text-[12px] font-semibold text-background/60">Insufficient data to measure</div>
        </div>

        {/* Score improvement */}
        <div className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3">
          <TrendingUp className="h-4 w-4 shrink-0 text-background/50" strokeWidth={1.75} />
          <div className="min-w-0 flex-1 text-[12.5px] text-background/70">CrediEdge Score™ attribution</div>
          <div className="shrink-0 text-[12px] font-semibold text-background/60">No historical baseline</div>
        </div>
      </div>
    </div>
  );
}

function AILearningSystem() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [learningReport, setLearningReport] = useState<AILearningSystemReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (businessId) {
      fetchAILearningSystemData(businessId).then((data) => {
        if (mounted) {
          setLearningReport(data);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [businessId]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
          <Brain className="h-[18px] w-[18px] text-brand" strokeWidth={2} />
        </div>
        <div>
          <div className="text-[15px] font-bold tracking-tight text-foreground">AI Learning System</div>
          <div className="text-[11.5px] text-muted-foreground">
            {learningReport?.learningStatusMessage ?? "Connecting workspace learning engine..."}
          </div>
        </div>
      </div>

      {/* Data Source Volume Grid */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-4 text-center text-xs text-muted-foreground">Loading workspace signals...</div>
        ) : (
          learningReport?.sourcesVolume.map((src) => (
            <div key={src.sourceName} className="rounded-xl border border-border bg-secondary/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">{src.sourceName}</span>
                <span className={`h-2 w-2 rounded-full ${src.isAvailable ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[16px] font-bold text-foreground">{src.recordCount}</span>
                <span className="text-[10px] text-muted-foreground">{src.recommendationCount} recs</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detected Patterns Section */}
      <div className="rounded-xl border border-border bg-secondary/20 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand" strokeWidth={2} />
          <span className="text-[12px] font-bold text-foreground">Detected Recurring Recommendation Patterns</span>
        </div>

        {learningReport?.recurringPatterns && learningReport.recurringPatterns.length > 0 ? (
          <div className="space-y-2">
            {learningReport.recurringPatterns.map((pat) => (
              <div key={pat.id} className="rounded-lg bg-card p-3 border border-border text-[12px]">
                <div className="font-semibold text-foreground">{pat.category} ({pat.occurrenceCount} occurrences)</div>
                <div className="mt-1 text-muted-foreground">{pat.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[11.5px] text-muted-foreground">
            No recurring bottleneck patterns detected yet. As you use your workspace and resolve recommendations, recurring signals will automatically surface here.
          </div>
        )}
      </div>
    </div>
  );
}

function Achievements() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [summary, setSummary] = useState<AIPerformanceSummaryMetrics | null>(null);

  useEffect(() => {
    let mounted = true;
    if (businessId) {
      fetchAIPerformanceSummary(businessId).then((data) => {
        if (mounted) setSummary(data);
      });
    }
    return () => {
      mounted = false;
    };
  }, [businessId]);

  const completed = summary?.completedCount ?? 0;
  const revenue = summary?.measuredRevenue ?? 0;
  const hours = summary?.measuredHoursSaved ?? 0;

  const realAchievements: Achievement[] = [
    {
      id: "a1",
      icon: CheckCircle2,
      title: "First Recommendation Completed",
      description: "You completed your very first AI recommendation.",
      earned: completed >= 1,
    },
    {
      id: "a2",
      icon: Target,
      title: "10 Recommendations Completed",
      description: "Complete 10 AI recommendations across your business.",
      earned: completed >= 10,
    },
    {
      id: "a3",
      icon: Trophy,
      title: "£10,000 Revenue Generated",
      description: "AI recommendations generated over £10,000 in measured revenue.",
      earned: revenue >= 10000,
    },
    {
      id: "a4",
      icon: Clock,
      title: "50 Hours Saved",
      description: "AI saved your business over 50 hours of work.",
      earned: hours >= 50,
    },
    {
      id: "a5",
      icon: TrendingUp,
      title: "Score +10 Improvement",
      description: "CrediEdge Score™ improved by 10 points through actions.",
      earned: false,
    },
    {
      id: "a6",
      icon: Award,
      title: "100 Recommendations Completed",
      description: "Complete 100 AI recommendations to unlock master level.",
      earned: completed >= 100,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-4.5 w-4.5 text-amber-500" strokeWidth={2} />
        <div className="text-[15px] font-bold tracking-tight text-foreground">Achievements</div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {realAchievements.map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className={`relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 ${
                a.earned ? "border-amber-200 bg-amber-50/60 hover:shadow-card" : "border-border bg-secondary/30 opacity-50"
              }`}
            >
              <div className={`grid h-10 w-10 place-items-center rounded-xl mb-3 ${a.earned ? "bg-amber-100 text-amber-600" : "bg-secondary text-muted-foreground"}`}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </div>
              <div className={`text-[12px] font-semibold leading-tight ${a.earned ? "text-foreground" : "text-muted-foreground"}`}>
                {a.title}
              </div>
              <div className="mt-1 text-[10.5px] text-muted-foreground leading-tight">{a.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AIPersonalisation() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [metrics, setMetrics] = useState<AreaPerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (businessId) {
      fetchBusinessAreaMetrics(businessId).then((data) => {
        if (mounted) {
          setMetrics(data);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [businessId]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-1 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand" strokeWidth={2} />
        <span className="text-[13px] font-semibold text-muted-foreground">AI Performance by Area</span>
      </div>
      <div className="mb-5 text-[15px] font-bold tracking-tight text-foreground">
        Workspace data coverage across 8 key business areas
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-4 text-center text-xs text-muted-foreground">Checking area coverage...</div>
        ) : (
          metrics.map((s) => (
            <div key={s.area} className="flex items-center gap-3">
              <div className="w-28 shrink-0 text-[11.5px] font-medium text-foreground">{s.area}</div>

              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                {s.dataAvailable && s.accuracyPct !== null ? (
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-brand transition-all duration-700 ease-out"
                    style={{ width: `${Math.max(10, Math.min(100, s.accuracyPct))}%` }}
                  />
                ) : null}
              </div>

              <div className="w-36 shrink-0 text-right text-[11px]">
                {s.dataAvailable ? (
                  s.accuracyPct !== null ? (
                    <span className="font-bold text-emerald-600">{s.accuracyPct}% accuracy ({s.analysedCount} records)</span>
                  ) : (
                    <span className="font-medium text-muted-foreground">{s.statusLabel} ({s.analysedCount} records)</span>
                  )
                ) : (
                  <span className="font-normal text-muted-foreground/60">Insufficient data</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function AIImpactTracker() {
  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10">
          <Target className="h-4 w-4 text-brand" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold tracking-tight text-foreground">AI Impact Tracker</h2>
          <p className="text-[12.5px] text-muted-foreground">
            Measured accuracy and performance metrics backed strictly by workspace data.
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <AIPersonalisation />
        </div>
        <div className="xl:col-span-5">
          <MonthlyImpact />
        </div>
      </div>

      <AIPerformanceSummary />

      <HistoricalRecommendationsSection />

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <AILearningSystem />
        </div>
        <div className="xl:col-span-6">
          <Achievements />
        </div>
      </div>
    </div>
  );
}
