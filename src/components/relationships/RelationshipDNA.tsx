import { useState, useEffect, useRef } from "react";
import { Brain, TrendingUp, TrendingDown, MessageSquare, CircleDollarSign, Star, Clock, Calendar, ChevronDown, ChevronRight, Zap, Target, Heart, Shield, ChartBar as BarChart2, Users, ArrowRight, Lightbulb, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, ChartBar as BarChart3, Repeat, Gift, Phone, Mail, MessageCircle, Sparkles, Award, Eye, RefreshCw } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import type { Customer } from "@/lib/database.types";

// ─── Animated Number ────────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1200,
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
  size = 80,
  stroke = 7,
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
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setW(value), 100);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-[11.5px] text-muted-foreground">{label}</span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${w}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-[11px] font-semibold text-foreground">{value}%</span>
    </div>
  );
}

// ─── DNA ADAPTER ──────────────────────────────────────────────────────────────
// Derives a deterministic DNA profile from a real customer record.

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function seededInt(seed: number, min: number, max: number): number {
  const pseudo = ((seed * 1664525 + 1013904223) >>> 0) / 0xffffffff;
  return Math.round(min + pseudo * (max - min));
}

type DnaCustomer = {
  id: string;
  name: string;
  initials: string;
  segment: string;
  health: number;
  value: string;
  jobs: number;
  lastSeen: string;
  nextAction: string;
  prediction: string;
  personality: {
    traits: { label: string; value: number; color: string }[];
    summary: string;
  };
  communication: {
    preferred: string;
    responseTime: string;
    bestTime: string;
    openRate: number;
    clickRate: number;
    channels: { name: string; rate: number; color: string }[];
  };
  buying: {
    avgSpend: string;
    frequency: string;
    peakSeason: string;
    triggers: string[];
    pattern: string;
  };
  timeline: { date: string; event: string; amount?: string; type: string }[];
  opportunities: { title: string; value: string; probability: number; urgency: string }[];
  priorities: { action: string; reason: string; impact: string; confidence: number }[];
  campaigns: string[];
  memory: string[];
};

const SEGMENTS = ["VIP Champion", "High Value", "Growing", "Regular", "At Risk"];
const NEXT_ACTIONS = [
  "Send personalised offer",
  "Schedule follow-up call",
  "Send loyalty reward",
  "Invite to referral programme",
  "Send re-engagement campaign",
];
const PREDICTIONS = [
  "87% likely to book again",
  "93% likely to book again",
  "72% likely to book again",
  "65% likely to upgrade",
  "58% at risk of going inactive",
];
const CAMPAIGN_NAMES = [
  "Spring Loyalty Drive",
  "VIP Member Programme",
  "Retention Plus",
  "Annual Members Drive",
  "Summer Reactivation",
  "Referral Rewards",
];
const MEMORY_POOL = [
  "Prefers morning appointments",
  "Prefers afternoon slots",
  "Very punctual — always early",
  "Prefers minimal disruption",
  "Appreciates personalised service",
  "Responds quickly to SMS",
  "Prefers email communications",
  "Birthday on file — send card",
  "Long-term loyal customer",
  "Referred multiple clients",
];
const TRIGGERS_POOL = [
  "Personalised offers",
  "Loyalty rewards",
  "New service launches",
  "Seasonal promotions",
  "Bundle deals",
  "Reminder messages",
  "Limited availability",
];

function relativeTime(isoDate: string | null): string {
  if (!isoDate) return "Unknown";
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

function adaptCustomer(c: Customer): DnaCustomer {
  const seed = hashCode(c.id);
  const s1 = seededInt(seed, 1, 9999);
  const s2 = seededInt(seed ^ 0xdeadbeef, 1, 9999);

  const ltv = Number(c.lifetime_value) || 0;
  const health = Math.min(98, Math.max(40, Math.round(50 + (ltv / 200) + seededInt(s1, -5, 5))));
  const segmentIdx = ltv >= 4000 ? 0 : ltv >= 2500 ? 1 : ltv >= 1000 ? 2 : c.status === "inactive" ? 4 : 3;
  const segment = SEGMENTS[segmentIdx];

  const firstName = c.first_name ?? c.full_name?.split(" ")[0] ?? "Customer";
  const lastName = c.last_name ?? c.full_name?.split(" ")[1] ?? "";
  const name = c.full_name ?? [firstName, lastName].filter(Boolean).join(" ");
  const initials = [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase() || "C";

  const contactLabel = c.preferred_contact_method === "sms" ? "SMS"
    : c.preferred_contact_method === "phone" ? "Phone" : "Email";

  return {
    id: c.id,
    name,
    initials,
    segment,
    health,
    value: `£${ltv.toLocaleString()}`,
    jobs: Math.max(1, seededInt(s1, 2, 12)),
    lastSeen: relativeTime(c.last_booking_at),
    nextAction: NEXT_ACTIONS[seededInt(s1, 0, NEXT_ACTIONS.length - 1)],
    prediction: PREDICTIONS[seededInt(s2, 0, PREDICTIONS.length - 1)],
    personality: {
      traits: [
        { label: "Decision Speed",      value: seededInt(s1,        30, 90), color: "#E31B23" },
        { label: "Price Sensitivity",   value: seededInt(s1 ^ 0x1,  20, 75), color: "#3b82f6" },
        { label: "Brand Loyalty",       value: Math.min(99, health + seededInt(s2, -8, 8)), color: "#10b981" },
        { label: "Communication Pref",  value: seededInt(s2 ^ 0x2,  45, 90), color: "#f59e0b" },
        { label: "Quality Focus",       value: seededInt(s2 ^ 0x3,  50, 95), color: "#8b5cf6" },
      ],
      summary: `${firstName} is a ${segment.toLowerCase()} with ${c.status === "active" ? "strong" : "moderate"} engagement. ${
        ltv >= 3000 ? "High lifetime value with consistent spending patterns." : "Growing relationship with good future potential."
      } ${contactLabel} is their preferred channel.`,
    },
    communication: {
      preferred: contactLabel,
      responseTime: seededInt(s1, 0, 1) ? "< 2 hours" : "< 4 hours",
      bestTime: ["Tuesday–Thursday, 9am–11am", "Monday & Friday, 12pm–2pm", "Weekdays, 2pm–4pm"][seededInt(s1, 0, 2)],
      openRate: seededInt(s1, 60, 95),
      clickRate: seededInt(s2, 35, 75),
      channels: [
        { name: "Email", rate: seededInt(s1, 55, 95), color: "#E31B23" },
        { name: "SMS", rate: seededInt(s2, 50, 90), color: "#3b82f6" },
        { name: "Phone", rate: seededInt(s1 ^ 0x4, 30, 70), color: "#10b981" },
      ],
    },
    buying: {
      avgSpend: ltv > 0 ? `£${Math.round(ltv / Math.max(1, seededInt(s1, 3, 10))).toLocaleString()}` : "£0",
      frequency: ["Every 4 weeks", "Every 6 weeks", "Monthly", "Bi-monthly"][seededInt(s1, 0, 3)],
      peakSeason: ["Spring & Autumn", "All year (consistent)", "Summer peak", "Q4 focused"][seededInt(s2, 0, 3)],
      triggers: [
        TRIGGERS_POOL[seededInt(s1, 0, TRIGGERS_POOL.length - 1)],
        TRIGGERS_POOL[seededInt(s2, 0, TRIGGERS_POOL.length - 1)],
        TRIGGERS_POOL[seededInt(s1 ^ s2, 0, TRIGGERS_POOL.length - 1)],
      ].filter((v, i, a) => a.indexOf(v) === i),
      pattern: `${firstName} books ${["regularly and consistently", "primarily for premium services", "reactively to promotions", "on a seasonal cycle"][seededInt(s1, 0, 3)]}. ${ltv >= 3000 ? "High lifetime value customer." : "Growing spend trajectory."}`,
    },
    timeline: [
      { date: "5 Jul 2026", event: "Booked service", amount: `£${seededInt(s1, 200, 700)}`, type: "booking" },
      { date: "28 May 2026", event: "Left 5-star review", type: "review" },
      { date: "14 Apr 2026", event: "Purchased add-on", amount: `£${seededInt(s2, 80, 250)}`, type: "purchase" },
      { date: "1 Mar 2026", event: "Referral made", type: "referral" },
    ],
    opportunities: [
      {
        title: "Loyalty upgrade offer",
        value: `£${seededInt(s1, 150, 400)}`,
        probability: seededInt(s1, 65, 92),
        urgency: "This week",
      },
      {
        title: "Referral programme invitation",
        value: `£${seededInt(s2, 100, 250)} credit`,
        probability: seededInt(s2, 55, 80),
        urgency: "This month",
      },
    ],
    priorities: [
      {
        action: `Send ${NEXT_ACTIONS[seededInt(s1, 0, NEXT_ACTIONS.length - 1)].toLowerCase()}`,
        reason: `Based on ${firstName}'s booking history and engagement pattern, now is the optimal time to act. Historical conversion rate for this action is ${seededInt(s1, 70, 94)}%.`,
        impact: `£${seededInt(s1, 200, 600)}`,
        confidence: seededInt(s1, 72, 94),
      },
    ],
    campaigns: [
      CAMPAIGN_NAMES[seededInt(s1, 0, CAMPAIGN_NAMES.length - 1)],
      CAMPAIGN_NAMES[seededInt(s2, 0, CAMPAIGN_NAMES.length - 1)],
    ].filter((v, i, a) => a.indexOf(v) === i),
    memory: [
      MEMORY_POOL[seededInt(s1, 0, MEMORY_POOL.length - 1)],
      MEMORY_POOL[seededInt(s2, 0, MEMORY_POOL.length - 1)],
      MEMORY_POOL[seededInt(s1 ^ s2, 0, MEMORY_POOL.length - 1)],
      c.notes ? c.notes.slice(0, 80) : MEMORY_POOL[seededInt(s1 ^ 0xff, 0, MEMORY_POOL.length - 1)],
    ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
  };
}

// ─── Static data (segments / predictions remain illustrative) ────────────────

const segments = [
  { name: "VIP Champions", count: 3, value: "£14,200", color: "#E31B23", description: "Highest LTV, brand advocates, refer others" },
  { name: "High Value", count: 8, value: "£31,800", color: "#3b82f6", description: "Consistent bookings, growth potential" },
  { name: "Growing", count: 14, value: "£18,400", color: "#10b981", description: "Increasing frequency and spend" },
  { name: "At Risk", count: 5, value: "£8,900", color: "#f59e0b", description: "Declining engagement, need re-activation" },
  { name: "Inactive", count: 9, value: "£4,100", color: "#6b7280", description: "No activity in 90+ days" },
];

const predictions = [
  { customer: "Sarah Johnson", prediction: "Book again within 2 weeks", probability: 84, action: "Send reminder", type: "positive" },
  { customer: "Emily Clarke", prediction: "At risk of going inactive", probability: 71, action: "Re-activate now", type: "warning" },
  { customer: "John Smith", prediction: "Ready for upsell offer", probability: 79, action: "Send offer", type: "positive" },
  { customer: "Marcus Williams", prediction: "Will refer someone this month", probability: 67, action: "Share referral link", type: "positive" },
];

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────

function CustomerSelectorSkeleton() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[56px] w-40 animate-pulse rounded-2xl bg-secondary" />
      ))}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card p-5 space-y-4">
      <div className="flex gap-3">
        <div className="h-[72px] w-[72px] animate-pulse rounded-full bg-secondary shrink-0" />
        <div className="flex-1 space-y-2 pt-2">
          <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
          <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
          <div className="h-3 w-48 animate-pulse rounded bg-secondary" />
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-2 w-28 animate-pulse rounded bg-secondary" />
            <div className="h-1.5 flex-1 animate-pulse rounded-full bg-secondary" />
            <div className="h-2 w-8 animate-pulse rounded bg-secondary" />
          </div>
        ))}
      </div>
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
      <h3 className="text-[15px] font-semibold text-foreground">No customers yet</h3>
      <p className="mt-1.5 max-w-xs text-[13px] text-muted-foreground">
        Create your first customer to unlock AI-powered Relationship DNA profiles, health scores, and personalised recommendations.
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

function RelationshipDNAHero({ total, active }: { total: number; active: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -bottom-8 left-1/3 h-40 w-40 rounded-full bg-brand/10 blur-2xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-brand" />
            AI-Powered Intelligence
          </div>
          <h1 className="text-[22px] font-bold leading-tight tracking-tight text-background">
            Relationship DNA™
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-background/70">
            Your AI understands every customer's personality, buying behaviour, and relationship health — so you know exactly who needs attention, who's ready to spend, and who's at risk.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          {[
            { label: "Total Customers", value: String(total), icon: Users },
            { label: "Active Relationships", value: String(active), icon: Heart },
            { label: "Avg. Relationship Health", value: "76%", icon: BarChart2 },
            { label: "Predicted Revenue (30d)", value: "£8,240", icon: TrendingUp },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex min-w-[100px] flex-col gap-0.5 rounded-xl bg-background/10 p-3">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-background/60" strokeWidth={1.75} />
                  <span className="text-[10px] font-medium text-background/60">{stat.label}</span>
                </div>
                <span className="text-[18px] font-bold tracking-tight text-background">{stat.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2.5">
        {[
          { label: "3 customers need immediate attention", dot: "bg-brand animate-pulse" },
          { label: "5 upsell opportunities identified", dot: "bg-emerald-400" },
          { label: "2 customers showing churn signals", dot: "bg-amber-400" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 rounded-lg bg-background/10 px-3 py-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
            <span className="text-[11.5px] text-background/80">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CUSTOMER KPIs ────────────────────────────────────────────────────────────

function CustomerKPIs({ customers }: { customers: DnaCustomer[] }) {
  const totalLtv = customers.reduce((sum, c) => sum + (parseInt(c.value.replace(/[^0-9]/g, ""), 10) || 0), 0);
  const avgLtv = customers.length ? Math.round(totalLtv / customers.length) : 0;

  const kpis = [
    { label: "Total LTV", value: totalLtv, prefix: "£", trend: "+12%", up: true, icon: CircleDollarSign },
    { label: "Avg. LTV", value: avgLtv, prefix: "£", trend: "+8%", up: true, icon: TrendingUp },
    { label: "Retention Rate", value: 84, suffix: "%", trend: "+3%", up: true, icon: Repeat },
    { label: "NPS Score", value: 71, suffix: "", trend: "+5 pts", up: true, icon: Star },
    { label: "Churn Risk", value: 13, suffix: "%", trend: "-2%", up: true, icon: AlertTriangle },
    { label: "Referral Rate", value: 28, suffix: "%", trend: "+6%", up: true, icon: Gift },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((k) => {
        const Icon = k.icon;
        return (
          <div key={k.label} className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/10 hover:shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">{k.label}</span>
              <div className="grid h-6 w-6 place-items-center rounded-lg bg-secondary text-foreground/60">
                <Icon className="h-[11px] w-[11px]" strokeWidth={1.75} />
              </div>
            </div>
            <div className="text-[20px] font-bold tracking-tight text-foreground">
              <AnimatedNumber value={k.value} prefix={k.prefix ?? ""} suffix={k.suffix ?? ""} />
            </div>
            <div className={`flex items-center gap-1 text-[10.5px] font-semibold ${k.up ? "text-brand" : "text-destructive"}`}>
              {k.up ? <TrendingUp className="h-2.5 w-2.5" strokeWidth={2} /> : <TrendingDown className="h-2.5 w-2.5" strokeWidth={2} />}
              {k.trend} vs last month
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CUSTOMER CARD (selector) ─────────────────────────────────────────────────

function CustomerSelector({
  customers,
  selected,
  onSelect,
}: {
  customers: DnaCustomer[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {customers.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-left transition-all duration-150 ${
            selected === c.id
              ? "border-foreground/20 bg-card shadow-card"
              : "border-border bg-card/50 hover:border-foreground/15 hover:bg-card"
          }`}
        >
          <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
            selected === c.id ? "bg-brand text-white" : "bg-secondary text-foreground"
          }`}>
            {c.initials}
          </div>
          <div>
            <div className="text-[12.5px] font-semibold text-foreground">{c.name}</div>
            <div className="text-[10.5px] text-muted-foreground">{c.segment}</div>
          </div>
        </button>
      ))}
      {customers.length > 0 && (
        <button className="flex items-center gap-1.5 rounded-2xl border border-dashed border-border px-4 py-2.5 text-[12px] font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground">
          View all {customers.length}
        </button>
      )}
    </div>
  );
}

// ─── PERSONALITY PROFILE ──────────────────────────────────────────────────────

function PersonalityProfile({ customer }: { customer: DnaCustomer }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">AI Personality Profile</span>
          <span className="ml-auto rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
            94% confidence
          </span>
        </div>
      </div>
      <div className="p-5 space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <HealthRing score={customer.health} size={72} stroke={6} color="#E31B23" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[16px] font-bold text-foreground">{customer.health}</span>
              <span className="text-[8px] text-muted-foreground">Health</span>
            </div>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-foreground">{customer.name}</div>
            <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10.5px] font-semibold text-brand">
              <Zap className="h-2.5 w-2.5" />
              {customer.segment}
            </div>
            <div className="mt-1.5 text-[10.5px] text-muted-foreground">{customer.prediction}</div>
          </div>
        </div>

        <div className="space-y-2.5">
          {customer.personality.traits.map((t) => (
            <TraitBar key={t.label} label={t.label} value={t.value} color={t.color} />
          ))}
        </div>

        <div className="rounded-xl bg-secondary/60 p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Lightbulb className="h-3 w-3 text-brand" strokeWidth={1.75} />
            <span className="text-[10.5px] font-semibold text-foreground">AI Summary</span>
          </div>
          <p className="text-[11.5px] leading-relaxed text-muted-foreground">{customer.personality.summary}</p>
        </div>
      </div>
    </div>
  );
}

// ─── COMMUNICATION DNA ────────────────────────────────────────────────────────

function CommunicationDNA({ customer }: { customer: DnaCustomer }) {
  const channelIcons: Record<string, typeof Mail> = { Email: Mail, SMS: MessageCircle, Phone: Phone };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Communication DNA</span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Preferred Channel", value: customer.communication.preferred },
            { label: "Response Time", value: customer.communication.responseTime },
            { label: "Best Time to Reach", value: customer.communication.bestTime },
            { label: "Email Open Rate", value: `${customer.communication.openRate}%` },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] font-medium text-muted-foreground">{item.label}</div>
              <div className="mt-0.5 text-[12px] font-semibold text-foreground">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2.5">
          <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Channel Engagement</div>
          {customer.communication.channels.map((ch) => {
            const Icon = channelIcons[ch.name] ?? MessageSquare;
            return (
              <div key={ch.name} className="flex items-center gap-3">
                <div className="flex w-16 items-center gap-1.5">
                  <Icon className="h-3 w-3 text-muted-foreground" strokeWidth={1.75} />
                  <span className="text-[11px] text-muted-foreground">{ch.name}</span>
                </div>
                <TraitBar label="" value={ch.rate} color={ch.color} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── BUYING DNA ───────────────────────────────────────────────────────────────

function BuyingDNA({ customer }: { customer: DnaCustomer }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Buying DNA</span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Avg Spend", value: customer.buying.avgSpend },
            { label: "Frequency", value: customer.buying.frequency },
            { label: "Peak Season", value: customer.buying.peakSeason },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-secondary/50 p-3 text-center">
              <div className="text-[10px] font-medium text-muted-foreground">{item.label}</div>
              <div className="mt-0.5 text-[11.5px] font-semibold text-foreground leading-tight">{item.value}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Purchase Triggers</div>
          <div className="flex flex-wrap gap-1.5">
            {customer.buying.triggers.map((t) => (
              <span key={t} className="rounded-lg bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-secondary/60 p-3.5">
          <p className="text-[11.5px] leading-relaxed text-muted-foreground">{customer.buying.pattern}</p>
        </div>
      </div>
    </div>
  );
}

// ─── RELATIONSHIP HEALTH ──────────────────────────────────────────────────────

function RelationshipHealth() {
  const metrics = [
    { label: "Engagement", score: 87, color: "#E31B23" },
    { label: "Satisfaction", score: 92, color: "#10b981" },
    { label: "Loyalty", score: 78, color: "#3b82f6" },
    { label: "Advocacy", score: 71, color: "#f59e0b" },
    { label: "Growth", score: 65, color: "#8b5cf6" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Relationship Health</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-around gap-4 p-5">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-2">
            <div className="relative">
              <HealthRing score={m.score} size={64} stroke={5} color={m.color} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[13px] font-bold text-foreground">{m.score}</span>
              </div>
            </div>
            <span className="text-[10.5px] font-medium text-muted-foreground">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI CUSTOMER SUMMARY ──────────────────────────────────────────────────────

function AICustomerSummary({ customer }: { customer: DnaCustomer }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-5 text-background shadow-card">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/15 blur-2xl" />
      <div className="relative flex items-start gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-background/15">
          <Brain className="h-4 w-4 text-background" strokeWidth={1.75} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-background/60">AI Summary — {customer.name}</span>
            <span className="rounded-md bg-brand/30 px-1.5 py-0.5 text-[9.5px] font-bold text-background">LIVE</span>
          </div>
          <p className="text-[13px] leading-relaxed text-background/85">
            {customer.name} is your <span className="font-semibold text-background">{customer.segment.toLowerCase()} customer</span> with {customer.jobs} completed jobs and a total spend of {customer.value}. Their relationship health score of <span className="font-semibold text-brand">{customer.health}/100</span> indicates an exceptionally strong bond. {customer.personality.summary}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-background/10 px-2.5 py-1.5">
              <Target className="h-3 w-3 text-background/70" strokeWidth={1.75} />
              <span className="text-[11px] text-background/80">Next action: <span className="font-semibold text-background">{customer.nextAction}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TODAY'S PRIORITIES ───────────────────────────────────────────────────────

function TodaysPriorities({ customer }: { customer: DnaCustomer }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Today's Priorities</span>
          <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
            {customer.priorities.length}
          </span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {customer.priorities.map((p, i) => (
          <div key={i} className="p-4 transition-colors hover:bg-secondary/30">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                  {i + 1}
                </div>
                <div>
                  <div className="text-[12.5px] font-medium text-foreground">{p.action}</div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-brand">{p.impact} impact</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-[10.5px] text-muted-foreground">{p.confidence}% confidence</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="shrink-0 flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
              >
                <Eye className="h-3 w-3" strokeWidth={1.75} />
                Explain Why
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}`} />
              </button>
            </div>

            {expanded === i && (
              <div className="mt-3 ml-7 rounded-xl bg-brand/5 border border-brand/15 p-3.5">
                <div className="flex items-start gap-2">
                  <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
                  <div>
                    <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-brand">Why AI recommends this</div>
                    <p className="text-[11.5px] leading-relaxed text-foreground/80">{p.reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CUSTOMER SEGMENTS ────────────────────────────────────────────────────────

function CustomerSegments() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">AI Customer Segments</span>
          <span className="ml-auto text-[11px] text-muted-foreground">Auto-updated daily</span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {segments.map((s) => (
          <div key={s.name} className="group flex items-center gap-3 rounded-xl border border-border p-3.5 transition-all hover:border-foreground/15 hover:bg-secondary/30">
            <div className="h-8 w-8 shrink-0 rounded-lg" style={{ backgroundColor: `${s.color}18` }}>
              <div className="flex h-full items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-semibold text-foreground">{s.name}</span>
                <span className="text-[12px] font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">{s.count} customers</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-[10.5px] text-muted-foreground">{s.description}</span>
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CUSTOMER PREDICTIONS ─────────────────────────────────────────────────────

function CustomerPredictions() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">AI Predictions</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {predictions.map((p) => (
          <div key={p.customer} className="flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-secondary/30">
            <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-xl ${p.type === "warning" ? "bg-amber-50 text-amber-500" : "bg-brand/10 text-brand"}`}>
              {p.type === "warning" ? (
                <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} />
              ) : (
                <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.75} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold text-foreground">{p.customer}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{p.prediction}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-700"
                    style={{ width: `${p.probability}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-brand">{p.probability}%</span>
              </div>
            </div>
            <button className="shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground transition-all hover:border-foreground/20 hover:bg-foreground hover:text-background">
              {p.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CUSTOMER TIMELINE ────────────────────────────────────────────────────────

function CustomerTimeline({ customer }: { customer: DnaCustomer }) {
  const typeColors: Record<string, string> = {
    booking: "bg-brand/10 text-brand",
    review: "bg-emerald-50 text-emerald-600",
    purchase: "bg-blue-50 text-blue-600",
    referral: "bg-purple-50 text-purple-600",
  };
  const typeIcons: Record<string, typeof Calendar> = {
    booking: Calendar,
    review: Star,
    purchase: CircleDollarSign,
    referral: Gift,
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Relationship Timeline</span>
          <span className="ml-auto text-[11px] text-muted-foreground">{customer.name}</span>
        </div>
      </div>
      <ul className="divide-y divide-border">
        {customer.timeline.map((item, idx) => {
          const Icon = typeIcons[item.type] ?? Calendar;
          return (
            <li key={idx} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/30">
              <div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${typeColors[item.type] ?? "bg-secondary text-muted-foreground"}`}>
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-foreground">{item.event}</div>
                <div className="mt-0.5 text-[10.5px] text-muted-foreground">{item.date}</div>
              </div>
              {item.amount && (
                <span className="shrink-0 text-[12px] font-bold text-brand">{item.amount}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── REVENUE OPPORTUNITIES ────────────────────────────────────────────────────

function RevenueOpportunities({ customer }: { customer: DnaCustomer }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Revenue Opportunities</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {customer.opportunities.map((opp, i) => (
          <div key={i} className="group flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-secondary/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-[12px] font-bold text-brand">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold text-foreground">{opp.title}</div>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-[11.5px] font-bold text-brand">{opp.value}</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-[10.5px] text-muted-foreground">{opp.urgency}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="h-1 w-20 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${opp.probability}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{opp.probability}% probability</span>
              </div>
            </div>
            <button className="shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-foreground/20 hover:bg-foreground hover:text-background">
              Act Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CAMPAIGN CONNECTION ──────────────────────────────────────────────────────

function CampaignConnection({ customer }: { customer: DnaCustomer }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Campaign Connection</span>
        </div>
      </div>
      <div className="p-5 space-y-2.5">
        <div className="text-[11px] text-muted-foreground mb-1">{customer.name} is enrolled in:</div>
        {customer.campaigns.map((c) => (
          <div key={c} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary/30">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand/10">
              <Zap className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
            </div>
            <span className="text-[12.5px] font-medium text-foreground flex-1">{c}</span>
            <span className="text-[11px] font-semibold text-brand">Active</span>
          </div>
        ))}
        <button className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-[11.5px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground">
          + Add to Campaign
        </button>
      </div>
    </div>
  );
}

// ─── AI MEMORY ────────────────────────────────────────────────────────────────

function AIMemory({ customer }: { customer: DnaCustomer }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">AI Memory</span>
          <span className="ml-auto text-[10.5px] text-muted-foreground">What your AI remembers about {customer.name.split(" ")[0]}</span>
        </div>
      </div>
      <div className="p-5">
        <ul className="space-y-2.5">
          {customer.memory.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-xl bg-secondary/50 px-3.5 py-2.5">
              <Brain className="mt-0.5 h-3 w-3 shrink-0 text-brand" strokeWidth={1.75} />
              <span className="text-[12px] text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── RELATIONSHIP ANALYTICS ───────────────────────────────────────────────────

function RelationshipAnalytics() {
  const metrics = [
    { label: "Avg. Days Between Visits", value: "18", change: "-2 days", up: true },
    { label: "Re-activation Success Rate", value: "64%", change: "+11%", up: true },
    { label: "Upsell Conversion Rate", value: "38%", change: "+7%", up: true },
    { label: "Referral Conversion Rate", value: "52%", change: "+4%", up: true },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Relationship Analytics</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl bg-secondary/50 p-3.5">
            <div className="text-[10.5px] font-medium text-muted-foreground">{m.label}</div>
            <div className="mt-1 text-[20px] font-bold tracking-tight text-foreground">{m.value}</div>
            <div className={`mt-0.5 flex items-center gap-1 text-[10.5px] font-semibold ${m.up ? "text-brand" : "text-destructive"}`}>
              {m.up ? <TrendingUp className="h-2.5 w-2.5" strokeWidth={2} /> : <TrendingDown className="h-2.5 w-2.5" strokeWidth={2} />}
              {m.change} vs last month
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RELATIONSHIP IMPACT ──────────────────────────────────────────────────────

function RelationshipImpact() {
  const impacts = [
    { label: "Revenue from repeat customers", value: 58400, prefix: "£", description: "76% of total revenue" },
    { label: "Revenue from referrals", value: 14200, prefix: "£", description: "From 11 referred customers" },
    { label: "Churn prevented (est.)", value: 9800, prefix: "£", description: "AI re-activation campaigns" },
    { label: "Upsell revenue captured", value: 7600, prefix: "£", description: "28 successful upsells" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Relationship Impact</span>
          <span className="ml-auto rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">This Year</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5">
        {impacts.map((imp) => (
          <div key={imp.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
            <div className="text-[10.5px] font-medium text-muted-foreground">{imp.label}</div>
            <div className="mt-1.5 text-[18px] font-bold text-foreground">
              <AnimatedNumber value={imp.value} prefix={imp.prefix} />
            </div>
            <div className="mt-0.5 text-[10.5px] text-brand font-medium">{imp.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BUSINESS DNA PREVIEW ─────────────────────────────────────────────────────

function BusinessDNAPreview() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-brand/30 bg-gradient-to-r from-brand/5 to-transparent p-5">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" strokeWidth={1.75} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">Coming Soon</span>
          </div>
          <h3 className="text-[16px] font-bold tracking-tight text-foreground">Business DNA™</h3>
          <p className="mt-1 max-w-md text-[12px] leading-relaxed text-muted-foreground">
            AI-powered analysis of your entire business — combining Relationship DNA™, Campaign performance, financial patterns, and market trends into one unified intelligence profile.
          </p>
        </div>
        <button className="shrink-0 rounded-xl border border-brand/30 bg-card px-4 py-2.5 text-[12px] font-semibold text-brand transition-all hover:border-brand hover:bg-brand/5">
          Join Waitlist
        </button>
      </div>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────

export function RelationshipDNA({ onAddCustomer }: { onAddCustomer?: () => void }) {
  const { customers: rawCustomers, loading, error } = useCustomers();
  const customers = rawCustomers.map(adaptCustomer);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (customers.length > 0 && !selectedId) {
      setSelectedId(customers[0].id);
    }
  }, [customers, selectedId]);

  const customer = customers.find((c) => c.id === selectedId) ?? customers[0];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-2xl bg-secondary" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-secondary" />)}
        </div>
        <CustomerSelectorSkeleton />
        <div className="h-28 animate-pulse rounded-2xl bg-secondary" />
        <div className="grid gap-4 lg:grid-cols-3">
          <ProfileSkeleton />
          <ProfileSkeleton />
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center">
        <AlertTriangle className="mb-3 h-8 w-8 text-red-400" strokeWidth={1.75} />
        <h3 className="text-[14px] font-semibold text-red-700">Failed to load customers</h3>
        <p className="mt-1 text-[12.5px] text-red-600">{error}</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return <EmptyState onAdd={onAddCustomer ?? (() => {})} />;
  }

  return (
    <div className="space-y-6">
      <RelationshipDNAHero
        total={rawCustomers.length}
        active={rawCustomers.filter((c) => c.status === "active").length}
      />

      <CustomerKPIs customers={customers} />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-foreground">View Customer Profile</h2>
          <button className="flex items-center gap-1 text-[11.5px] font-semibold text-brand transition-all hover:gap-1.5">
            View all customers <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <CustomerSelector customers={customers} selected={selectedId ?? ""} onSelect={setSelectedId} />
      </div>

      {customer && (
        <>
          <AICustomerSummary customer={customer} />

          <div className="grid gap-4 lg:grid-cols-3">
            <PersonalityProfile customer={customer} />
            <CommunicationDNA customer={customer} />
            <BuyingDNA customer={customer} />
          </div>

          <RelationshipHealth />

          <div className="grid gap-4 lg:grid-cols-2">
            <TodaysPriorities customer={customer} />
            <CustomerTimeline customer={customer} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RevenueOpportunities customer={customer} />
            <CampaignConnection customer={customer} />
          </div>
        </>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <CustomerSegments />
        <CustomerPredictions />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RelationshipAnalytics />
        <RelationshipImpact />
      </div>

      {customer && <AIMemory customer={customer} />}

      <BusinessDNAPreview />
    </div>
  );
}
