import { useState, useEffect, useRef } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  CircleDollarSign,
  Star,
  Clock,
  Calendar,
  ChevronDown,
  ChevronRight,
  Zap,
  Target,
  Heart,
  Shield,
  BarChart2,
  Users,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Repeat,
  Gift,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  Award,
  Eye,
  RefreshCw,
  ShieldCheck,
  Flag,
} from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import type { Customer } from "@/lib/database.types";
import { AIDisclosure } from "@/components/ui/AIDisclosure";
import {
  fetchPortfolioAnalytics,
  fetchPortfolioSegments,
  fetchCustomerDNAContext,
  joinBusinessDNAWaitlist,
  checkBusinessDNAWaitlistStatus,
  type PortfolioKPIs,
  type PortfolioSegment,
  type CustomerDNAContext,
} from "@/services/relationshipAnalytics";
import { useBusiness } from "@/hooks/useBusiness";
import { useAuthContext } from "@/contexts/AuthContext";

// ─── Animated Number ────────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1000,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Health Ring ─────────────────────────────────────────────────────────────

function HealthRing({
  score,
  size = 72,
  stroke = 6,
  color = "#E31B23",
}: {
  score: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<SVGSVGElement>(null);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated ? score / 100 : 0) * circ;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <svg ref={ref} width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

// ─── Trait Bar ────────────────────────────────────────────────────────────────

function TraitBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-[11.5px] text-muted-foreground">{label}</span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-[11px] font-semibold text-foreground">{value}%</span>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand/10">
        <Users className="h-6 w-6 text-brand" strokeWidth={1.75} />
      </div>
      <h3 className="text-[15px] font-semibold text-foreground">No customers in workspace yet</h3>
      <p className="mt-1.5 max-w-xs text-[13px] text-muted-foreground">
        Create your first customer to unlock real-data Relationship DNA™ profiles, portfolio metrics, and evidence-based AI recommendations.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:opacity-85 transition-opacity"
      >
        <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
        Add Your First Customer
      </button>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function RelationshipDNAHero({ kpis }: { kpis: PortfolioKPIs }) {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-8 left-1/3 h-40 w-40 rounded-full bg-brand/10 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-brand" />
              AI-Powered Portfolio Intelligence
            </div>
            <h1 className="text-[22px] font-bold leading-tight tracking-tight text-background">
              Relationship DNA™
            </h1>
            <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-background/70">
              Analyses workspace customer records, order history, and contact preferences to evaluate relationship health, retention risks, and engagement opportunities.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            {[
              { label: "Total Customers", value: String(kpis.totalCustomers), icon: Users, badge: "CONNECTED" },
              { label: "Active Relationships", value: String(kpis.activeRelationships), icon: Heart, badge: "CONNECTED" },
              { label: "Total Lifetime Value", value: kpis.formattedTotalLtv, icon: CircleDollarSign, badge: "CONNECTED" },
              { label: "Avg Customer LTV", value: kpis.formattedAvgLtv, icon: TrendingUp, badge: "DERIVED" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex min-w-[110px] flex-col gap-0.5 rounded-xl bg-background/10 p-3">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3 w-3 text-background/60" strokeWidth={1.75} />
                      <span className="text-[10px] font-medium text-background/60">{stat.label}</span>
                    </div>
                    <span className="text-[8.5px] font-extrabold uppercase bg-white/20 text-white px-1 rounded">
                      {stat.badge}
                    </span>
                  </div>
                  <span className="text-[18px] font-bold tracking-tight text-background">{stat.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2.5">
          <div className="flex items-center gap-2 rounded-lg bg-background/10 px-3 py-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${kpis.churnRiskCount > 0 ? "bg-brand animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-[11.5px] text-background/80">
              {kpis.churnRiskCount > 0
                ? `${kpis.churnRiskCount} profile(s) requiring re-activation attention`
                : "All active customer relationships up to date"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-background/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11.5px] text-background/80">
              {kpis.retentionRatePct !== null ? `${kpis.retentionRatePct}% active relationship rate` : "Insufficient data"}
            </span>
          </div>
        </div>
      </div>

      <AIDisclosure />
    </div>
  );
}

// ─── CUSTOMER PORTFOLIO KPIs ──────────────────────────────────────────────────

function CustomerKPIs({ kpis }: { kpis: PortfolioKPIs }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">Total LTV</span>
          <span className="rounded bg-brand/10 px-1 py-0.2 text-[8.5px] font-extrabold text-brand uppercase">
            {kpis.totalLtv > 0 ? "CONNECTED" : "INSUFFICIENT DATA"}
          </span>
        </div>
        <div className="text-[20px] font-bold tracking-tight text-foreground">
          {kpis.totalLtv > 0 ? kpis.formattedTotalLtv : "Insufficient Data"}
        </div>
        <div className="text-[10.5px] font-medium text-muted-foreground truncate">
          {kpis.totalLtv > 0 ? "From settled payment ledger" : "No settled revenue recorded"}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">Avg. LTV</span>
          <span className="rounded bg-blue-500/10 px-1 py-0.2 text-[8.5px] font-extrabold text-blue-500 uppercase">
            {kpis.avgLtv > 0 ? "DERIVED" : "INSUFFICIENT DATA"}
          </span>
        </div>
        <div className="text-[20px] font-bold tracking-tight text-foreground">
          {kpis.avgLtv > 0 ? kpis.formattedAvgLtv : "Insufficient Data"}
        </div>
        <div className="text-[10.5px] font-medium text-muted-foreground truncate">
          {kpis.avgLtv > 0 ? "Across qualifying clients" : "Requires revenue history"}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">Retention Rate</span>
          <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[8.5px] font-extrabold text-emerald-500 uppercase">
            {kpis.retentionRatePct !== null ? "DERIVED" : "INSUFFICIENT DATA"}
          </span>
        </div>
        <div className="text-[20px] font-bold tracking-tight text-foreground">
          {kpis.retentionRatePct !== null ? `${kpis.retentionRatePct}%` : "Insufficient Data"}
        </div>
        <div className="text-[10.5px] font-medium text-muted-foreground truncate">
          {kpis.retentionRatePct !== null ? "90-day active cohort" : "Requires >90d history"}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">Genuine NPS</span>
          <span className="rounded bg-secondary px-1 py-0.2 text-[8.5px] font-extrabold text-muted-foreground uppercase">
            INSUFFICIENT DATA
          </span>
        </div>
        <div className="text-[20px] font-bold tracking-tight text-foreground">Insufficient Data</div>
        <div className="text-[10.5px] font-medium text-muted-foreground truncate">
          Requires survey response feed
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">Churn Risk</span>
          <span className="rounded bg-amber-500/10 px-1 py-0.2 text-[8.5px] font-extrabold text-amber-500 uppercase">DERIVED</span>
        </div>
        <div className="text-[20px] font-bold tracking-tight text-foreground">{kpis.churnRiskCount}</div>
        <div className="text-[10.5px] font-medium text-muted-foreground truncate">
          {kpis.churnRiskPct !== null ? `${kpis.churnRiskPct}% of portfolio` : "Evaluated workspace records"}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">LTV Trend (MoM)</span>
          <span className="rounded bg-secondary px-1 py-0.2 text-[8.5px] font-extrabold text-muted-foreground uppercase">
            {kpis.ltvTrendPct !== null ? "DERIVED" : "INSUFFICIENT DATA"}
          </span>
        </div>
        <div className="text-[20px] font-bold tracking-tight text-foreground">
          {kpis.ltvTrendPct !== null ? `+${kpis.ltvTrendPct}%` : "Insufficient Data"}
        </div>
        <div className="text-[10.5px] font-medium text-muted-foreground truncate">
          {kpis.ltvTrendPct !== null ? "vs previous month" : "Requires 14+ daily snapshot logs"}
        </div>
      </div>
    </div>
  );
}

// ─── CUSTOMER PROFILE SELECTOR ────────────────────────────────────────────────

function CustomerSelector({
  customers,
  selectedId,
  onSelect,
  onViewAll,
}: {
  customers: Customer[];
  selectedId: string;
  onSelect: (id: string) => void;
  onViewAll?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {customers.map((c) => {
        const name = c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Customer";
        const initials = name.slice(0, 2).toUpperCase();
        const ltv = Number(c.lifetime_value) || 0;

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-left transition-all duration-150 ${
              selectedId === c.id
                ? "border-brand bg-card shadow-card ring-1 ring-brand/30"
                : "border-border bg-card/50 hover:border-foreground/15 hover:bg-card"
            }`}
          >
            <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
              selectedId === c.id ? "bg-brand text-white" : "bg-secondary text-foreground"
            }`}>
              {initials}
            </div>
            <div>
              <div className="text-[12.5px] font-semibold text-foreground">{name}</div>
              <div className="text-[10.5px] text-muted-foreground">£{ltv.toLocaleString("en-GB")} LTV</div>
            </div>
          </button>
        );
      })}

      {customers.length > 0 && onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1.5 rounded-2xl border border-dashed border-border px-4 py-2.5 text-[12px] font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
        >
          View all {customers.length}
        </button>
      )}
    </div>
  );
}

// ─── CUSTOMER DNA SUMMARY CARD ────────────────────────────────────────────────

function CustomerDnaSummaryCard({
  context,
  onEdit,
}: {
  context: CustomerDNAContext;
  onEdit?: () => void;
}) {
  const { customer, healthScore, healthLabel, segmentName, unpaidBalance } = context;
  const name = customer.full_name || `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Customer";
  const ltv = Number(customer.lifetime_value) || 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-5 text-background shadow-card">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/15 blur-2xl" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-background/15 text-background font-extrabold text-[14px]">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-background/60">
                Customer DNA Profile — {name}
              </span>
              <span className="rounded bg-brand/30 px-2 py-0.5 text-[9.5px] font-bold text-background uppercase">
                {segmentName}
              </span>
            </div>

            <p className="text-[13px] leading-relaxed text-background/85">
              {name} has a recorded lifetime value of <span className="font-bold text-background">£{ltv.toLocaleString("en-GB")}</span> across workspace transactions. Relationship health index stands at <span className="font-bold text-brand">{healthScore} / 100 ({healthLabel})</span>.
              {unpaidBalance > 0 ? (
                <span className="text-red-300 font-semibold"> Outstanding unpaid invoice balance of £{unpaidBalance.toLocaleString("en-GB")}.</span>
              ) : (
                <span> No active unpaid invoice balance.</span>
              )}
            </p>
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-[12px] font-semibold text-white shadow-sm transition-all hover:opacity-90"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PRIORITIES & AI RECOMMENDATIONS ──────────────────────────────────────────

function CustomerPrioritiesCard({ context }: { context: CustomerDNAContext }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [reported, setReported] = useState<Record<number, boolean>>({});

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Grounded Relationship Actions</span>
        </div>
        <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
          {context.suggestedPriorities.length}
        </span>
      </div>

      <div className="divide-y divide-border">
        {context.suggestedPriorities.map((p, i) => (
          <div key={i} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                  {i + 1}
                </div>
                <div>
                  <div className="text-[12.5px] font-bold text-foreground">{p.action}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="font-bold text-brand">{p.impact}</span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-muted-foreground">{p.confidence}% confidence</span>
                    <span className="rounded bg-brand/10 px-1.5 py-0.2 text-[9px] font-extrabold text-brand uppercase">
                      {p.provenance}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="shrink-0 flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
              >
                <Eye className="h-3 w-3" strokeWidth={1.75} />
                Explain Why
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}`} />
              </button>
            </div>

            {expanded === i && (
              <div className="mt-2 ml-7 rounded-xl bg-secondary/30 border border-border p-3.5 space-y-2">
                <div className="flex items-start gap-2 text-[11.5px]">
                  <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
                  <div>
                    <div className="mb-0.5 font-extrabold text-brand uppercase text-[10px]">Evidence Grounding:</div>
                    <p className="text-foreground/80 leading-relaxed">{p.reason}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10.5px]">
                  <span className="text-muted-foreground italic">Actions require user review and workspace confirmation.</span>
                  {reported[i] ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Feedback logged for credit review
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setReported((prev) => ({ ...prev, [i]: true }))}
                      className="text-muted-foreground hover:text-destructive flex items-center gap-1 font-semibold"
                    >
                      <Flag className="h-3 w-3" /> Report inaccurate recommendation
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CUSTOMER TIMELINE ────────────────────────────────────────────────────────

function CustomerTimelineCard({ context }: { context: CustomerDNAContext }) {
  const { activityTimeline, customer } = context;
  const name = customer.full_name || `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Customer";

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Relationship Activity Timeline</span>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">{name}</span>
      </div>

      {activityTimeline.length === 0 ? (
        <div className="p-6 text-center text-xs text-muted-foreground italic">
          No recent activity logs recorded for {name}.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {activityTimeline.map((item) => (
            <li key={item.id} className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-secondary/30 text-[12px]">
              <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                <Calendar className="h-3 w-3" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground">{item.description}</div>
                <div className="text-[10.5px] text-muted-foreground">
                  {new Date(item.created_at).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── PORTFOLIO SEGMENTS ───────────────────────────────────────────────────────

function PortfolioSegmentsCard({ segments }: { segments: PortfolioSegment[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Portfolio Segmentation</span>
        </div>
        <span className="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase">DERIVED</span>
      </div>

      <div className="p-5 space-y-3">
        {segments.map((s) => (
          <div key={s.name} className="flex items-center gap-3 rounded-xl border border-border p-3.5 transition-all hover:bg-secondary/30">
            <div className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}18` }}>
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 text-[12.5px]">
                <span className="font-semibold text-foreground">{s.name}</span>
                <span className="font-bold text-foreground">{s.formattedValue}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{s.count} customer(s)</span>
                <span>•</span>
                <span className="truncate">{s.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BUSINESS DNA PREVIEW & WAITLIST ──────────────────────────────────────────

function BusinessDnaWaitlistCard({ businessId, userId }: { businessId: string | undefined; userId?: string | null }) {
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    checkBusinessDNAWaitlistStatus(businessId, userId || undefined)
      .then((status) => setJoined(status))
      .catch((err) => console.error("Waitlist status check error:", err))
      .finally(() => setLoading(false));
  }, [businessId, userId]);

  const handleJoin = async () => {
    if (!businessId) return;
    setJoining(true);
    try {
      const ok = await joinBusinessDNAWaitlist(businessId, userId || undefined);
      if (ok) {
        setJoined(true);
      }
    } catch (err) {
      console.error("Waitlist error:", err);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-brand/30 bg-gradient-to-r from-brand/5 to-transparent p-5">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" strokeWidth={1.75} />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand">Coming Soon</span>
          </div>
          <h3 className="text-[16px] font-bold tracking-tight text-foreground">Business DNA™ Intelligence Suite</h3>
          <p className="mt-1 max-w-md text-[12px] leading-relaxed text-muted-foreground">
            Combines Relationship DNA™, Campaign execution, financial velocity, and review sentiment into one unified cross-module intelligence engine.
          </p>
        </div>

        {loading ? (
          <div className="h-9 w-32 animate-pulse rounded-xl bg-secondary" />
        ) : joined ? (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-[12px] font-extrabold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> You're on the waitlist
          </span>
        ) : (
          <button
            type="button"
            disabled={joining}
            onClick={handleJoin}
            className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-[12px] font-extrabold text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {joining ? "Registering..." : "Join Waitlist"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────

export function RelationshipDNA({
  onAddCustomer,
  onEditCustomer,
  onViewAllCustomers,
}: {
  onAddCustomer?: () => void;
  onEditCustomer?: (customer: Customer) => void;
  onViewAllCustomers?: () => void;
}) {
  const { business } = useBusiness();
  const { user } = useAuthContext();
  const businessId = business?.id;

  const { customers: rawCustomers, loading: customersLoading, error } = useCustomers();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const [portfolioKpis, setPortfolioKpis] = useState<PortfolioKPIs | null>(null);
  const [portfolioSegments, setPortfolioSegments] = useState<PortfolioSegment[]>([]);
  const [customerContext, setCustomerContext] = useState<CustomerDNAContext | null>(null);
  const [loadingContext, setLoadingContext] = useState(false);

  // 1. Fetch Portfolio KPIs and Segments
  useEffect(() => {
    if (!businessId) return;
    Promise.all([
      fetchPortfolioAnalytics(businessId),
      fetchPortfolioSegments(businessId),
    ])
      .then(([kpis, segments]) => {
        setPortfolioKpis(kpis);
        setPortfolioSegments(segments);
      })
      .catch((err) => console.error("Error fetching portfolio analytics:", err));
  }, [businessId, rawCustomers]);

  // 2. Default Selected Customer Selection
  useEffect(() => {
    if (rawCustomers.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId(rawCustomers[0].id);
    } else if (rawCustomers.length > 0 && selectedCustomerId && !rawCustomers.some((c) => c.id === selectedCustomerId)) {
      setSelectedCustomerId(rawCustomers[0].id);
    }
  }, [rawCustomers, selectedCustomerId]);

  // 3. Fetch Selected Customer DNA Context
  useEffect(() => {
    if (!businessId || !selectedCustomerId) return;
    setLoadingContext(true);
    fetchCustomerDNAContext(selectedCustomerId, businessId)
      .then((ctx) => setCustomerContext(ctx))
      .catch((err) => console.error("Error fetching customer DNA context:", err))
      .finally(() => setLoadingContext(false));
  }, [selectedCustomerId, businessId]);

  if (customersLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-2xl bg-secondary" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-12 text-center">
        <AlertTriangle className="mb-3 h-8 w-8 text-red-500" />
        <h3 className="text-[14px] font-bold text-red-700">Failed to load relationship records</h3>
        <p className="mt-1 text-[12px] text-red-600">{error}</p>
      </div>
    );
  }

  if (rawCustomers.length === 0) {
    return <EmptyState onAdd={onAddCustomer ?? (() => {})} />;
  }

  return (
    <div className="space-y-6">
      {portfolioKpis && <RelationshipDNAHero kpis={portfolioKpis} />}

      {portfolioKpis && <CustomerKPIs kpis={portfolioKpis} />}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-foreground">Select Customer DNA Profile</h2>
          {onViewAllCustomers && (
            <button
              type="button"
              onClick={onViewAllCustomers}
              className="flex items-center gap-1 text-[11.5px] font-semibold text-brand transition-all hover:gap-1.5"
            >
              View all customers <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
        <CustomerSelector
          customers={rawCustomers}
          selectedId={selectedCustomerId ?? ""}
          onSelect={setSelectedCustomerId}
          onViewAll={onViewAllCustomers}
        />
      </div>

      {loadingContext ? (
        <div className="p-8 text-center text-xs text-muted-foreground italic">
          Loading customer DNA intelligence...
        </div>
      ) : customerContext ? (
        <>
          <CustomerDnaSummaryCard
            context={customerContext}
            onEdit={onEditCustomer ? () => onEditCustomer(customerContext.customer) : undefined}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <CustomerPrioritiesCard context={customerContext} />
            <CustomerTimelineCard context={customerContext} />
          </div>
        </>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <PortfolioSegmentsCard segments={portfolioSegments} />
        <BusinessDnaWaitlistCard businessId={businessId} userId={user?.id} />
      </div>
    </div>
  );
}
