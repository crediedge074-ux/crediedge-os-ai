import { useState, useRef, useEffect } from "react";
import { Target, TrendingUp, Star, Globe, Zap, Users, Building2, Package, Settings2, ChevronDown, ChevronUp, ArrowRight, Sparkles, CircleCheck as CheckCircle2, Clock, PoundSterling, ChartBar as BarChart3, Brain, Trophy, Flame, Shield, Activity, MapPin, CalendarDays } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

type CampaignHealth = "Excellent" | "Good" | "Needs Attention" | "At Risk";
type CampaignType =
  | "revenue"
  | "growth"
  | "customer"
  | "marketing"
  | "website"
  | "automation"
  | "expansion"
  | "operations";

interface Mission {
  id: string;
  title: string;
  progress: number;
  tasks: number;
  tasksCompleted: number;
  status: "active" | "completed" | "pending";
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  progress: number;
  missions: Mission[];
  totalTasks: number;
  businessValue: string;
  estimatedDays: number;
  health: CampaignHealth;
  confidence: number;
  startDate: string;
  estimatedRevenue: string;
  hoursSaved: string;
  scoreImprovement: string;
  aiInsight: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────

const campaigns: Campaign[] = [
  {
    id: "c1",
    name: "Become Bromley's Highest Rated Garage",
    description:
      "Systematically improve every customer touchpoint to dominate local search rankings and review platforms.",
    type: "customer",
    progress: 74,
    businessValue: "£48,000",
    estimatedDays: 43,
    health: "Excellent",
    confidence: 95,
    startDate: "1 Jun",
    estimatedRevenue: "£48,000",
    hoursSaved: "120 hrs",
    scoreImprovement: "+18",
    aiInsight:
      "At current pace you will reach your target 6 days ahead of schedule. Review volume is the primary remaining lever — sending 8 more review requests this week would accelerate completion.",
    missions: [
      { id: "m1", title: "Reach 250 Google Reviews", progress: 82, tasks: 12, tasksCompleted: 10, status: "active" },
      { id: "m2", title: "Improve Website Speed Score", progress: 100, tasks: 6, tasksCompleted: 6, status: "completed" },
      { id: "m3", title: "Reduce Response Time to < 1hr", progress: 65, tasks: 8, tasksCompleted: 5, status: "active" },
      { id: "m4", title: "Increase Repeat Customers", progress: 58, tasks: 10, tasksCompleted: 6, status: "active" },
      { id: "m5", title: "Win 5 Industry Awards", progress: 40, tasks: 8, tasksCompleted: 3, status: "pending" },
    ],
    totalTasks: 38,
  },
  {
    id: "c2",
    name: "£30k Monthly Revenue Target",
    description:
      "Drive consistent revenue growth through pricing optimisation, upselling, and new customer acquisition.",
    type: "revenue",
    progress: 61,
    businessValue: "£72,000",
    estimatedDays: 68,
    health: "Good",
    confidence: 88,
    startDate: "15 Jun",
    estimatedRevenue: "£72,000",
    hoursSaved: "85 hrs",
    scoreImprovement: "+12",
    aiInsight:
      "Revenue is growing 8% month-on-month. Upselling premium packages to existing customers has the highest ROI at this stage — estimated £4,200 additional monthly revenue with minimal acquisition cost.",
    missions: [
      { id: "m6", title: "Optimise Service Pricing", progress: 90, tasks: 5, tasksCompleted: 4, status: "active" },
      { id: "m7", title: "Launch Premium Package", progress: 45, tasks: 9, tasksCompleted: 4, status: "active" },
      { id: "m8", title: "Grow Referral Programme", progress: 30, tasks: 7, tasksCompleted: 2, status: "pending" },
    ],
    totalTasks: 21,
  },
  {
    id: "c3",
    name: "Automate 80% of Admin",
    description:
      "Eliminate repetitive admin tasks through AI automation, freeing 15+ hours per week for revenue-generating activities.",
    type: "automation",
    progress: 38,
    businessValue: "£24,000",
    estimatedDays: 112,
    health: "Good",
    confidence: 82,
    startDate: "20 Jun",
    estimatedRevenue: "£24,000",
    hoursSaved: "200 hrs",
    scoreImprovement: "+9",
    aiInsight:
      "Invoice automation alone would save 4 hours per week. Setting up automated follow-up sequences is the highest-impact next step — estimated 6 hours saved weekly once complete.",
    missions: [
      { id: "m9", title: "Automate Invoice Sending", progress: 70, tasks: 4, tasksCompleted: 3, status: "active" },
      { id: "m10", title: "Set Up AI Follow-Up Sequences", progress: 20, tasks: 8, tasksCompleted: 2, status: "active" },
      { id: "m11", title: "Connect All Integrations", progress: 85, tasks: 6, tasksCompleted: 5, status: "active" },
    ],
    totalTasks: 18,
  },
];

const completedCampaigns = [
  {
    id: "cc1",
    name: "Launch New Website",
    completedDate: "28 May",
    outcome: "Website conversion rate improved by 34%",
    revenueGenerated: "£12,400",
    lessonLearned: "Mobile-first design had the greatest impact on enquiry volume. Future website work should prioritise mobile experience above all else.",
    scoreChange: "+8",
  },
  {
    id: "cc2",
    name: "Improve Google Review Score",
    completedDate: "10 Jun",
    outcome: "Rating increased from 4.2 to 4.8 stars",
    revenueGenerated: "£8,200",
    lessonLearned: "Personalised review requests sent within 2 hours of job completion had a 68% response rate vs 22% for generic messages sent the following day.",
    scoreChange: "+11",
  },
];

const aiSuggestedCampaign = {
  name: "Become London's Highest Rated Detailing Studio",
  description:
    "Based on your current trajectory and market position, expanding your reputation campaign beyond Bromley to target the wider London market would position you as the premium choice in a high-value market.",
  estimatedRevenue: "£84,000",
  estimatedDuration: "8 months",
  confidence: 96,
  roi: "420%",
  why: "Your current review score (4.8) and response time (1.4 hrs) already exceed 94% of competitors in the London market. You have the foundation — the campaign would amplify it.",
};

// ─── Type Config ────────────────────────────────────────────────────────────

const typeConfig: Record<CampaignType, { icon: LucideIcon; color: string; bg: string; label: string }> = {
  revenue: { icon: PoundSterling, color: "text-emerald-600", bg: "bg-emerald-50", label: "Revenue Growth" },
  growth: { icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", label: "Business Growth" },
  customer: { icon: Users, color: "text-brand", bg: "bg-brand/10", label: "Customer Experience" },
  marketing: { icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50", label: "Marketing" },
  website: { icon: Globe, color: "text-orange-600", bg: "bg-orange-50", label: "Website" },
  automation: { icon: Zap, color: "text-amber-600", bg: "bg-amber-50", label: "Automation" },
  expansion: { icon: MapPin, color: "text-indigo-600", bg: "bg-indigo-50", label: "Expansion" },
  operations: { icon: Settings2, color: "text-slate-600", bg: "bg-slate-100", label: "Operations" },
};

const healthConfig: Record<CampaignHealth, { color: string; dot: string; bg: string }> = {
  Excellent: { color: "text-emerald-700", dot: "bg-emerald-500", bg: "bg-emerald-50" },
  Good: { color: "text-blue-700", dot: "bg-blue-500", bg: "bg-blue-50" },
  "Needs Attention": { color: "text-amber-700", dot: "bg-amber-500", bg: "bg-amber-50" },
  "At Risk": { color: "text-destructive", dot: "bg-destructive", bg: "bg-destructive/10" },
};

// ─── Animated Ring ─────────────────────────────────────────────────────────

function ProgressRing({
  progress,
  size = 72,
  strokeWidth = 5.5,
  color = "#E31B23",
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const [animated, setAnimated] = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let frame = 0;
          const total = 40;
          const tick = () => {
            frame++;
            setAnimated(Math.round((frame / total) * progress));
            if (frame < total) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [progress]);

  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;
  const cx = size / 2;

  return (
    <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={cx} cy={cx} r={r} stroke="oklch(0.928 0 0)" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.04s linear" }}
      />
    </svg>
  );
}

// ─── Mission Bar ────────────────────────────────────────────────────────────

function MissionBar({ mission }: { mission: Mission }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(mission.progress), 300);
    return () => clearTimeout(t);
  }, [mission.progress]);

  const statusColor = mission.status === "completed"
    ? "text-emerald-600 bg-emerald-50"
    : mission.status === "active"
    ? "text-blue-600 bg-blue-50"
    : "text-muted-foreground bg-secondary";

  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="truncate text-[12px] font-medium text-foreground">{mission.title}</span>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[10.5px] text-muted-foreground">
              {mission.tasksCompleted}/{mission.tasks} tasks
            </span>
            <span className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold capitalize ${statusColor}`}>
              {mission.status}
            </span>
          </div>
        </div>
        <div className="relative h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
              mission.status === "completed" ? "bg-emerald-500" : "bg-brand"
            }`}
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
      <div className="w-8 shrink-0 text-right text-[11.5px] font-bold text-foreground">
        {mission.progress}%
      </div>
    </div>
  );
}

// ─── Campaign Expanded View ─────────────────────────────────────────────────

function CampaignExpanded({ campaign }: { campaign: Campaign }) {
  const tc = typeConfig[campaign.type];
  const hc = healthConfig[campaign.health];

  return (
    <div className="border-t border-border bg-secondary/30 p-5 space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Est. Revenue", value: campaign.estimatedRevenue, icon: PoundSterling, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Hours Saved", value: campaign.hoursSaved, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Score Impact", value: campaign.scoreImprovement, icon: TrendingUp, color: "text-brand", bg: "bg-brand/10" },
          { label: "Confidence", value: `${campaign.confidence}%`, icon: Brain, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-3.5 text-center">
              <div className={`mx-auto mb-2 grid h-8 w-8 place-items-center rounded-xl ${s.bg} ${s.color}`}>
                <Icon className="h-[14px] w-[14px]" strokeWidth={2} />
              </div>
              <div className={`text-[18px] font-extrabold leading-none ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-[10.5px] text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Mission Timeline */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-foreground/60" strokeWidth={2} />
          <span className="text-[12.5px] font-semibold text-foreground">Mission Roadmap</span>
          <span className="ml-auto text-[11px] text-muted-foreground">
            {campaign.missions.filter((m) => m.status === "completed").length}/{campaign.missions.length} complete
          </span>
        </div>
        <div className="space-y-3">
          {campaign.missions.map((m) => (
            <MissionBar key={m.id} mission={m} />
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="rounded-xl border border-brand/15 bg-brand/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand/70">AI Campaign Analysis</span>
        </div>
        <p className="text-[12.5px] leading-relaxed text-foreground/80">{campaign.aiInsight}</p>
      </div>

      {/* Health + Campaign Info */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className={`flex items-center gap-3 rounded-xl border border-border p-3.5 ${hc.bg}`}>
          <Flame className={`h-5 w-5 ${hc.color}`} strokeWidth={1.75} />
          <div>
            <div className="text-[10.5px] text-muted-foreground">Campaign Health</div>
            <div className={`text-[13px] font-bold ${hc.color}`}>{campaign.health}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
          <CalendarDays className="h-5 w-5 text-foreground/50" strokeWidth={1.75} />
          <div>
            <div className="text-[10.5px] text-muted-foreground">Started</div>
            <div className="text-[13px] font-bold text-foreground">{campaign.startDate}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
          <Activity className="h-5 w-5 text-foreground/50" strokeWidth={1.75} />
          <div>
            <div className="text-[10.5px] text-muted-foreground">Total Tasks</div>
            <div className="text-[13px] font-bold text-foreground">{campaign.totalTasks} tasks</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Campaign Card ──────────────────────────────────────────────────────────

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [expanded, setExpanded] = useState(false);
  const tc = typeConfig[campaign.type];
  const hc = healthConfig[campaign.health];
  const TypeIcon = tc.icon;

  const progressColor =
    campaign.progress >= 75 ? "#10B981" :
    campaign.progress >= 50 ? "#E31B23" : "#F59E0B";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card">
      <div className="flex items-start gap-4 p-5">
        {/* Progress ring */}
        <div className="relative shrink-0">
          <ProgressRing progress={campaign.progress} color={progressColor} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[15px] font-extrabold leading-none text-foreground">{campaign.progress}%</div>
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[14px] font-bold text-foreground leading-snug">{campaign.name}</h3>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${tc.bg} ${tc.color}`}>
                  <TypeIcon className="h-2.5 w-2.5" strokeWidth={2} />
                  {tc.label}
                </span>
                <span className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${hc.bg} ${hc.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${hc.dot}`} />
                  {campaign.health}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="rounded-xl border border-border bg-secondary/60 px-2.5 py-1.5 text-center">
                <div className="text-[9.5px] font-medium text-muted-foreground">Value</div>
                <div className="text-[13px] font-extrabold text-emerald-600">{campaign.businessValue}</div>
              </span>
              <span className="rounded-xl border border-border bg-secondary/60 px-2.5 py-1.5 text-center">
                <div className="text-[9.5px] font-medium text-muted-foreground">Days left</div>
                <div className="text-[13px] font-extrabold text-foreground">{campaign.estimatedDays}</div>
              </span>
            </div>
          </div>

          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
            {campaign.description}
          </p>

          {/* Stats row */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Target className="h-3 w-3" strokeWidth={1.75} />
              {campaign.missions.length} missions
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CheckCircle2 className="h-3 w-3" strokeWidth={1.75} />
              {campaign.totalTasks} tasks
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Brain className="h-3 w-3" strokeWidth={1.75} />
              {campaign.confidence}% confidence
            </span>
          </div>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between border-t border-border px-5 py-2.5 text-[11.5px] font-semibold text-brand transition-colors duration-150 hover:bg-secondary/40"
      >
        <span>{expanded ? "Collapse Campaign" : "View Campaign Details"}</span>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </button>

      {expanded && <CampaignExpanded campaign={campaign} />}
    </div>
  );
}

// ─── AI Suggested Campaign ──────────────────────────────────────────────────

function AISuggestedCampaign() {
  return (
    <div className="overflow-hidden rounded-2xl border border-dashed border-brand/30 bg-brand/3 p-5 transition-all duration-200 hover:border-brand/50 hover:bg-brand/5">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/15">
          <Sparkles className="h-[20px] w-[20px] text-brand" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-brand/60">AI Recommended Next Campaign</span>
              </div>
              <h3 className="mt-1 text-[15px] font-bold text-foreground">{aiSuggestedCampaign.name}</h3>
              <p className="mt-1.5 max-w-xl text-[12.5px] leading-relaxed text-muted-foreground">
                {aiSuggestedCampaign.description}
              </p>
            </div>

            <button className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand/90 hover:shadow">
              Launch Campaign
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { label: "Est. Revenue", value: aiSuggestedCampaign.estimatedRevenue, color: "text-emerald-600" },
              { label: "Duration", value: aiSuggestedCampaign.estimatedDuration, color: "text-foreground" },
              { label: "ROI", value: aiSuggestedCampaign.roi, color: "text-brand" },
              { label: "AI Confidence", value: `${aiSuggestedCampaign.confidence}%`, color: "text-foreground" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-brand/15 bg-card px-3 py-2.5">
                <div className="text-[10px] font-medium text-muted-foreground">{s.label}</div>
                <div className={`mt-0.5 text-[15px] font-extrabold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-3.5 rounded-xl bg-card border border-brand/10 px-3.5 py-2.5">
            <div className="flex items-start gap-2">
              <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2} />
              <p className="text-[12px] leading-relaxed text-foreground/70">
                <span className="font-semibold text-foreground">Why now? </span>
                {aiSuggestedCampaign.why}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Completed Campaigns ────────────────────────────────────────────────────

function CompletedCampaigns() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-amber-500" strokeWidth={2} />
        <span className="text-[14px] font-semibold text-foreground">Completed Campaigns</span>
        <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-100 px-1 text-[10px] font-bold text-emerald-700">
          {completedCampaigns.length}
        </span>
      </div>

      <div className="space-y-3">
        {completedCampaigns.map((c) => (
          <div key={c.id} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={2} />
                  <span className="text-[13px] font-semibold text-foreground">{c.name}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">Completed {c.completedDate}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-xl bg-emerald-100 px-3 py-1 text-[12px] font-bold text-emerald-700">
                  {c.revenueGenerated}
                </span>
                <span className="rounded-xl bg-brand/10 px-3 py-1 text-[12px] font-bold text-brand">
                  Score {c.scoreChange}
                </span>
              </div>
            </div>
            <p className="mt-2 text-[12px] text-emerald-700 font-medium">{c.outcome}</p>
            <div className="mt-2.5 rounded-lg bg-white/70 border border-emerald-100 px-3 py-2">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                AI Lesson Learned
              </div>
              <p className="text-[11.5px] leading-relaxed text-foreground/70">{c.lessonLearned}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────

export function Campaigns() {
  const totalValue = "£144,000";
  const activeCampaigns = campaigns.length;
  const avgProgress = Math.round(
    campaigns.reduce((sum, c) => sum + c.progress, 0) / campaigns.length
  );

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold tracking-tight text-foreground">Campaigns</h2>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            The biggest objectives driving your business.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft">
            <div className="text-[9.5px] font-medium text-muted-foreground">Active</div>
            <div className="text-[15px] font-extrabold text-foreground">{activeCampaigns}</div>
          </div>
          <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft">
            <div className="text-[9.5px] font-medium text-muted-foreground">Avg Progress</div>
            <div className="text-[15px] font-extrabold text-brand">{avgProgress}%</div>
          </div>
          <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft">
            <div className="text-[9.5px] font-medium text-muted-foreground">Total Value</div>
            <div className="text-[15px] font-extrabold text-emerald-600">{totalValue}</div>
          </div>

          <button className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-2.5 text-[12.5px] font-semibold text-background transition-all duration-200 hover:bg-foreground/85">
            New Campaign
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Active campaign cards */}
      <div className="space-y-3">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>

      {/* AI Suggested */}
      <AISuggestedCampaign />

      {/* Completed */}
      <CompletedCampaigns />
    </div>
  );
}
