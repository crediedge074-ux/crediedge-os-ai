import { useState, useEffect, useRef } from "react";
import { TrendingUp, Clock, CircleCheck as CheckCircle2, ChevronDown, ChevronUp, Star, Target, Brain, Award, MessageSquare, Globe, PoundSterling, ChartBar as BarChart3, ArrowUp, Sparkles, Calendar, Users, FileText, ShoppingBag, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type RecoStatus = "successful" | "partial" | "pending" | "failed";
type RecoCategory =
  | "Customer Communication"
  | "Revenue"
  | "Marketing"
  | "Operations"
  | "Website"
  | "Reviews";

interface Recommendation {
  id: string;
  title: string;
  dateSuggested: string;
  dateCompleted: string;
  category: RecoCategory;
  estimatedImpact: string;
  actualResult: string;
  confidence: number;
  status: RecoStatus;
  icon: LucideIcon;
  why: string;
  what: string;
  beforeMetric: { label: string; value: string };
  afterMetric: { label: string; value: string };
  aiLearnt: string;
  futureImprovement: string;
}

interface Achievement {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const recommendations: Recommendation[] = [
  {
    id: "r1",
    title: "Reply to 4 Outstanding Enquiries",
    dateSuggested: "2 Jul",
    dateCompleted: "3 Jul",
    category: "Customer Communication",
    estimatedImpact: "+£2,300",
    actualResult: "+£2,050",
    confidence: 94,
    status: "successful",
    icon: MessageSquare,
    why: "Four high-intent enquiries had been unanswered for over 6 hours. Historical data shows response within 2 hours converts at 68% vs 31% after 24 hours.",
    what: "Replies were sent within 15 minutes of the recommendation. Three of four customers proceeded to booking.",
    beforeMetric: { label: "Response time", value: "8.2 hrs avg" },
    afterMetric: { label: "Response time", value: "1.4 hrs avg" },
    aiLearnt: "Morning enquiries convert better when replied to before midday. Customers in this segment respond strongly to personalised follow-ups.",
    futureImprovement: "AI will now alert you within 30 minutes of a new enquiry arriving during business hours.",
  },
  {
    id: "r2",
    title: "Send 18 Google Review Requests",
    dateSuggested: "28 Jun",
    dateCompleted: "29 Jun",
    category: "Reviews",
    estimatedImpact: "+£1,200",
    actualResult: "+£1,410",
    confidence: 91,
    status: "successful",
    icon: Star,
    why: "You had 18 recently completed jobs with no review request sent. Research shows 72% of customers will leave a review when asked within 48 hours.",
    what: "18 review requests sent. 11 customers left 5-star reviews. Average rating increased from 4.6 to 4.8.",
    beforeMetric: { label: "Review rating", value: "4.6 ★" },
    afterMetric: { label: "Review rating", value: "4.8 ★" },
    aiLearnt: "Customers from premium packages are 2.3× more likely to leave detailed reviews. Timing requests for Tuesday afternoon yields highest open rates.",
    futureImprovement: "AI will auto-identify optimal review request timing per customer based on their activity patterns.",
  },
  {
    id: "r3",
    title: "Fix Website Page Speed",
    dateSuggested: "25 Jun",
    dateCompleted: "26 Jun",
    category: "Website",
    estimatedImpact: "SEO risk",
    actualResult: "Bounce rate −14%",
    confidence: 87,
    status: "successful",
    icon: Globe,
    why: "Your homepage was loading in 4.8 seconds on mobile. Google penalises sites over 3 seconds in search rankings, reducing organic enquiries by an estimated 18%.",
    what: "Images were compressed and a caching layer was added. Load time improved to 1.9 seconds. Google Core Web Vitals score improved from 42 to 78.",
    beforeMetric: { label: "Load time", value: "4.8 sec" },
    afterMetric: { label: "Load time", value: "1.9 sec" },
    aiLearnt: "Mobile performance has 3.1× more impact on enquiry volume than desktop for this business category.",
    futureImprovement: "Weekly website health scans will now flag speed regressions before they affect rankings.",
  },
  {
    id: "r4",
    title: "Chase 2 Overdue Invoices",
    dateSuggested: "24 Jun",
    dateCompleted: "24 Jun",
    category: "Revenue",
    estimatedImpact: "+£950",
    actualResult: "+£950",
    confidence: 99,
    status: "successful",
    icon: PoundSterling,
    why: "Two invoices were 14 days overdue. Historical collection data shows 94% recovery rate within 24 hours of first reminder.",
    what: "Both invoices collected in full within 6 hours of sending reminders. Zero dispute.",
    beforeMetric: { label: "Outstanding", value: "£950" },
    afterMetric: { label: "Outstanding", value: "£0" },
    aiLearnt: "Polite reminder emails with a direct payment link have 3× better conversion than phone calls for this client profile.",
    futureImprovement: "Invoice reminders will be triggered automatically at 7 days overdue.",
  },
  {
    id: "r5",
    title: "Pause Underperforming Ad Campaign",
    dateSuggested: "20 Jun",
    dateCompleted: "21 Jun",
    category: "Marketing",
    estimatedImpact: "Save £380/mo",
    actualResult: "Saved £380/mo",
    confidence: 82,
    status: "partial",
    icon: BarChart3,
    why: "Campaign A had a cost per lead of £47 vs Campaign B at £12. Reallocating budget to Campaign B was estimated to improve ROI by 290%.",
    what: "Campaign A was paused. Budget reallocated to Campaign B. Monthly leads increased from 12 to 29 while spend remained the same.",
    beforeMetric: { label: "Cost per lead", value: "£47" },
    afterMetric: { label: "Cost per lead", value: "£18" },
    aiLearnt: "Weekend ad spend generates 40% fewer qualified leads. Budget concentration on Tuesday–Thursday performs best for this industry.",
    futureImprovement: "AI will now monitor campaign performance weekly and flag budget optimisation opportunities.",
  },
];

const achievements: Achievement[] = [
  {
    id: "a1",
    icon: CheckCircle2,
    title: "First Recommendation Completed",
    description: "You completed your very first AI recommendation.",
    earned: true,
    earnedDate: "15 Jun",
  },
  {
    id: "a2",
    icon: Target,
    title: "10 Recommendations Completed",
    description: "You've completed 10 AI recommendations.",
    earned: true,
    earnedDate: "28 Jun",
  },
  {
    id: "a3",
    icon: Trophy,
    title: "£10,000 Revenue Generated",
    description: "AI recommendations have generated over £10,000 in revenue.",
    earned: true,
    earnedDate: "2 Jul",
  },
  {
    id: "a4",
    icon: Clock,
    title: "50 Hours Saved",
    description: "AI has saved your business over 50 hours.",
    earned: true,
    earnedDate: "4 Jul",
  },
  {
    id: "a5",
    icon: TrendingUp,
    title: "Score +10 Improvement",
    description: "CrediEdge Score™ improved by 10 points.",
    earned: true,
    earnedDate: "5 Jul",
  },
  {
    id: "a6",
    icon: Award,
    title: "100 Recommendations Completed",
    description: "Complete 100 AI recommendations to unlock.",
    earned: false,
  },
];

const dataPoints = [
  { icon: MessageSquare, label: "Enquiries analysed", value: 482 },
  { icon: ShoppingBag, label: "Bookings analysed", value: 311 },
  { icon: Star, label: "Reviews analysed", value: 128 },
  { icon: FileText, label: "Invoices processed", value: 43 },
];

const confidenceSources = [
  { label: "Bookings", pct: 95 },
  { label: "Customers", pct: 88 },
  { label: "Revenue", pct: 91 },
  { label: "Reviews", pct: 84 },
  { label: "Website", pct: 76 },
  { label: "Communications", pct: 97 },
  { label: "Tasks", pct: 89 },
  { label: "Goals", pct: 72 },
];

// ─── Animated Stat ────────────────────────────────────────────────────────────

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

// ─── Status Config ─────────────────────────────────────────────────────────────

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
  partial: {
    label: "Partial",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  pending: {
    label: "Pending",
    bg: "bg-secondary",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/40",
  },
  failed: {
    label: "Failed",
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
  },
};

const categoryColor: Record<RecoCategory, string> = {
  "Customer Communication": "bg-blue-50 text-blue-700",
  Revenue: "bg-emerald-50 text-emerald-700",
  Marketing: "bg-purple-50 text-purple-700",
  Operations: "bg-slate-50 text-slate-700",
  Website: "bg-orange-50 text-orange-700",
  Reviews: "bg-brand/10 text-brand",
};

// ─── Recommendation Card ──────────────────────────────────────────────────────

function RecommendationCard({ reco }: { reco: Recommendation }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[reco.status];
  const Icon = reco.icon;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card">
      {/* Main row */}
      <div className="flex items-start gap-4 p-5">
        {/* Icon + status */}
        <div className="relative shrink-0">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
            <Icon className="h-[18px] w-[18px] text-foreground/60" strokeWidth={1.75} />
          </div>
          <div
            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${cfg.dot}`}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-[13.5px] font-semibold text-foreground">{reco.title}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${categoryColor[reco.category]}`}>
                  {reco.category}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Suggested {reco.dateSuggested} · Completed {reco.dateCompleted}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Impact grid */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
              <div className="text-[10px] font-medium text-muted-foreground">Estimated</div>
              <div className="mt-0.5 text-[14px] font-bold text-foreground">{reco.estimatedImpact}</div>
            </div>
            <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
              <div className="text-[10px] font-medium text-muted-foreground">Actual Result</div>
              <div className={`mt-0.5 text-[14px] font-bold ${reco.status === "successful" ? "text-emerald-600" : "text-foreground"}`}>
                {reco.actualResult}
              </div>
            </div>
            <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
              <div className="text-[10px] font-medium text-muted-foreground">AI Confidence</div>
              <div className="mt-0.5 text-[14px] font-bold text-foreground">{reco.confidence}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between border-t border-border px-5 py-2.5 text-[11.5px] font-semibold text-brand transition-colors duration-150 hover:bg-secondary/40"
      >
        <span>View Outcome</span>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </button>

      {/* Expanded outcome panel */}
      {expanded && (
        <div className="border-t border-border bg-secondary/30 p-5 space-y-4">
          {/* Why + What */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-card border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Brain className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Why This Was Recommended</span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-foreground/80">{reco.why}</p>
            </div>
            <div className="rounded-xl bg-card border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">What Happened</span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-foreground/80">{reco.what}</p>
            </div>
          </div>

          {/* Before / After */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Before</div>
              <div className="text-[11.5px] text-muted-foreground">{reco.beforeMetric.label}</div>
              <div className="mt-1 text-[20px] font-bold text-foreground">{reco.beforeMetric.value}</div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-emerald-600">After</div>
              <div className="text-[11.5px] text-emerald-700/70">{reco.afterMetric.label}</div>
              <div className="mt-1 text-[20px] font-bold text-emerald-700">{reco.afterMetric.value}</div>
            </div>
          </div>

          {/* What AI learnt */}
          <div className="rounded-xl border border-brand/15 bg-brand/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand/70">What the AI Learnt</span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-foreground/80">{reco.aiLearnt}</p>
            <div className="mt-3 border-t border-brand/10 pt-3">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">How This Improves Future Recommendations</div>
              <p className="text-[12px] leading-relaxed text-foreground/70">{reco.futureImprovement}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI Performance Summary ───────────────────────────────────────────────────

function AIPerformanceSummary() {
  const stats = [
    { label: "Recommendations Completed", value: 84, suffix: "", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "AI Accuracy", value: 93, suffix: "%", icon: Target, color: "text-brand", bg: "bg-brand/10" },
    { label: "Revenue Generated", value: 18450, prefix: "£", icon: PoundSterling, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Hours Saved", value: 74, suffix: " hrs", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Score Improvement", value: 11, prefix: "+", icon: TrendingUp, color: "text-brand", bg: "bg-brand/10" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
          <Brain className="h-[18px] w-[18px] text-brand" strokeWidth={2} />
        </div>
        <div>
          <div className="text-[15px] font-bold tracking-tight text-foreground">AI Performance</div>
          <div className="text-[11.5px] text-muted-foreground">Cumulative impact since you started using CrediEdgeOS</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex flex-col rounded-2xl border border-border bg-secondary/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
              <div className={`grid h-8 w-8 place-items-center rounded-xl ${s.bg} ${s.color} mb-3`}>
                <Icon className="h-[15px] w-[15px]" strokeWidth={2} />
              </div>
              <div className={`text-[22px] font-extrabold leading-none tracking-tight ${s.color}`}>
                <AnimatedNumber
                  target={s.value}
                  prefix={s.prefix ?? ""}
                  suffix={s.suffix ?? ""}
                />
              </div>
              <div className="mt-1.5 text-[10.5px] leading-tight text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Monthly Impact ───────────────────────────────────────────────────────────

function MonthlyImpact() {
  const items = [
    { label: "AI recommendations completed", value: "27", icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Additional revenue generated", value: "£12,420", icon: PoundSterling, color: "text-emerald-600" },
    { label: "Response times improved by", value: "31%", icon: Clock, color: "text-blue-600" },
    { label: "Review score increased by", value: "+0.3 ★", icon: Star, color: "text-brand" },
    { label: "CrediEdge Score™ improved", value: "+9", icon: TrendingUp, color: "text-brand" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-foreground p-6 text-background shadow-card">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-background/60" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-background/50">This Month</span>
        </div>
        <div className="mt-2 text-[18px] font-bold leading-tight text-background">
          Monthly AI Impact Report
        </div>
        <div className="mt-1 text-[12.5px] text-background/60">July 2026</div>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3">
              <Icon className="h-4 w-4 shrink-0 text-background/50" strokeWidth={1.75} />
              <div className="min-w-0 flex-1 text-[12.5px] text-background/70">{item.label}</div>
              <div className="shrink-0 text-[15px] font-bold text-background">{item.value}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl bg-brand/20 px-4 py-3 border border-brand/30">
        <div className="text-[12px] text-background/80">
          Your AI recommendations are generating an average of{" "}
          <span className="font-bold text-background">£460 per recommendation</span>.
          That's <span className="font-bold text-background">4.6× your subscription cost</span>.
        </div>
      </div>
    </div>
  );
}

// ─── AI Learning System ───────────────────────────────────────────────────────

function AILearningSystem() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
          <Brain className="h-[18px] w-[18px] text-brand" strokeWidth={2} />
        </div>
        <div>
          <div className="text-[15px] font-bold tracking-tight text-foreground">AI Learning System</div>
          <div className="text-[11.5px] text-muted-foreground">Your AI grows smarter with every piece of business data</div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {dataPoints.map((d) => {
          const Icon = d.icon;
          return (
            <div key={d.label} className="flex flex-col items-center rounded-2xl border border-border bg-secondary/50 py-4 px-3 text-center">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-card shadow-soft mb-2">
                <Icon className="h-[14px] w-[14px] text-foreground/60" strokeWidth={1.75} />
              </div>
              <div className="text-[20px] font-extrabold leading-none text-foreground">
                <AnimatedNumber target={d.value} />
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground leading-tight">{d.label}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-brand/15 bg-brand/5 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-brand" strokeWidth={2} />
          <p className="text-[12.5px] leading-relaxed text-foreground/80">
            Because of this data, recommendation confidence has increased from{" "}
            <span className="font-semibold text-foreground">81%</span> to{" "}
            <span className="font-bold text-brand">94%</span>. As more business data
            becomes available, your AI will continue to improve — making smarter,
            higher-confidence recommendations every month.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────────

function Achievements() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-4.5 w-4.5 text-amber-500" strokeWidth={2} />
        <div className="text-[15px] font-bold tracking-tight text-foreground">Achievements</div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {achievements.map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className={`relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 ${
                a.earned
                  ? "border-amber-200 bg-amber-50/60 hover:shadow-card"
                  : "border-border bg-secondary/30 opacity-50"
              }`}
            >
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl mb-3 ${
                  a.earned ? "bg-amber-100 text-amber-600" : "bg-secondary text-muted-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </div>
              <div className={`text-[12px] font-semibold leading-tight ${a.earned ? "text-foreground" : "text-muted-foreground"}`}>
                {a.title}
              </div>
              <div className="mt-1 text-[10.5px] text-muted-foreground leading-tight">{a.description}</div>
              {a.earned && a.earnedDate && (
                <div className="mt-2 rounded-md bg-amber-100 px-2 py-0.5 text-[9.5px] font-semibold text-amber-700">
                  Earned {a.earnedDate}
                </div>
              )}
              {!a.earned && (
                <div className="mt-2 text-[9.5px] text-muted-foreground/60">Locked</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Personalisation ─────────────────────────────────────────────────────────

function AIPersonalisation() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-1 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand" strokeWidth={2} />
        <span className="text-[13px] font-semibold text-muted-foreground">AI Personalisation</span>
      </div>
      <div className="mb-5 text-[15px] font-bold tracking-tight text-foreground">
        Your AI is becoming smarter every day.
      </div>

      <div className="mb-5 flex items-center gap-5">
        {/* Large confidence ring */}
        <div className="relative shrink-0">
          <svg width={96} height={96} viewBox="0 0 96 96" className="-rotate-90">
            <circle cx={48} cy={48} r={40} stroke="oklch(0.928 0 0)" strokeWidth={6} fill="none" />
            <circle
              cx={48}
              cy={48}
              r={40}
              stroke="#E31B23"
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={animate ? 2 * Math.PI * 40 * (1 - 0.94) : 2 * Math.PI * 40}
              style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[22px] font-extrabold leading-none text-foreground">94%</div>
            <div className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-wider text-muted-foreground">Confidence</div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">
            Current confidence is based on{" "}
            <span className="font-semibold text-foreground">7 connected data sources</span>.
            Adding more integrations will increase recommendation accuracy further.
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <ArrowUp className="h-3 w-3 text-brand" strokeWidth={2.5} />
            <span className="text-[11.5px] font-semibold text-brand">Up from 81% last month</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {confidenceSources.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-[11.5px] font-medium text-foreground/70">{s.label}</div>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-brand transition-all duration-700 ease-out"
                style={{ width: animate ? `${s.pct}%` : "0%" }}
              />
            </div>
            <div className="w-8 shrink-0 text-right text-[11px] font-semibold text-foreground">{s.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function AIImpactTracker() {
  return (
    <div className="mt-10 space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10">
          <Target className="h-4 w-4 text-brand" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold tracking-tight text-foreground">AI Impact Tracker</h2>
          <p className="text-[12.5px] text-muted-foreground">
            See how previous AI recommendations have improved your business.
          </p>
        </div>
      </div>

      {/* Personalisation + Monthly Impact */}
      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <AIPersonalisation />
        </div>
        <div className="xl:col-span-5">
          <MonthlyImpact />
        </div>
      </div>

      {/* Performance Summary */}
      <AIPerformanceSummary />

      {/* Recommendation History */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-[14px] font-semibold text-foreground">Recommendation History</h3>
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] text-muted-foreground">{recommendations.length} completed</span>
        </div>
        <div className="space-y-3">
          {recommendations.map((r) => (
            <RecommendationCard key={r.id} reco={r} />
          ))}
        </div>
      </div>

      {/* AI Learning + Achievements side by side */}
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
