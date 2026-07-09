import { useState, useEffect, useRef } from "react";
import { Brain, TrendingUp, TrendingDown, MessageSquare, CircleDollarSign, Star, Clock, Calendar, ChevronDown, ChevronRight, Zap, Target, Heart, Shield, ChartBar as BarChart2, Users, ArrowRight, Lightbulb, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, ChartBar as BarChart3, Repeat, Gift, Phone, Mail, MessageCircle, Sparkles, Award, Eye, RefreshCw } from "lucide-react";

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

// ─── DATA ─────────────────────────────────────────────────────────────────────

const customers = [
  {
    id: "1",
    name: "Marcus Williams",
    initials: "MW",
    segment: "VIP Champion",
    health: 94,
    value: "£3,100",
    jobs: 6,
    lastSeen: "3 days ago",
    nextAction: "Send personalised offer",
    prediction: "87% likely to book again",
    personality: {
      traits: [
        { label: "Decision Speed", value: 82, color: "#E31B23" },
        { label: "Price Sensitivity", value: 28, color: "#3b82f6" },
        { label: "Brand Loyalty", value: 91, color: "#10b981" },
        { label: "Communication Pref", value: 76, color: "#f59e0b" },
        { label: "Quality Focus", value: 88, color: "#8b5cf6" },
      ],
      summary: "Fast decision-maker with high brand loyalty. Low price sensitivity — responds better to quality messaging than discounts. Prefers email and responds within hours.",
    },
    communication: {
      preferred: "Email",
      responseTime: "< 2 hours",
      bestTime: "Tuesday–Thursday, 9am–11am",
      openRate: 94,
      clickRate: 67,
      channels: [
        { name: "Email", rate: 94, color: "#E31B23" },
        { name: "SMS", rate: 71, color: "#3b82f6" },
        { name: "Phone", rate: 55, color: "#10b981" },
      ],
    },
    buying: {
      avgSpend: "£517",
      frequency: "Every 6 weeks",
      peakSeason: "Spring & Autumn",
      triggers: ["New service launches", "Personalised offers", "Loyalty rewards"],
      pattern: "Books premium services. Often upgrades on-site. Responds to limited availability messaging.",
    },
    timeline: [
      { date: "5 Jul 2026", event: "Booked premium service", amount: "£620", type: "booking" },
      { date: "28 May 2026", event: "Left 5-star review", type: "review" },
      { date: "14 Apr 2026", event: "Purchased add-on package", amount: "£180", type: "purchase" },
      { date: "1 Mar 2026", event: "Referred James Thompson", type: "referral" },
      { date: "10 Jan 2026", event: "First appointment", amount: "£320", type: "booking" },
    ],
    opportunities: [
      { title: "Loyalty upgrade offer", value: "£280", probability: 89, urgency: "This week" },
      { title: "Referral programme invitation", value: "£150 credit", probability: 76, urgency: "This month" },
      { title: "Premium membership upsell", value: "£960/yr", probability: 64, urgency: "Next quarter" },
    ],
    priorities: [
      {
        action: "Send personalised loyalty offer",
        reason: "Marcus hasn't booked in 3 weeks — his typical cycle is every 6 weeks. Historically responds within 2 hours to personalised email offers.",
        impact: "£280",
        confidence: 89,
      },
      {
        action: "Invite to VIP referral programme",
        reason: "He referred James Thompson in March who became a £5,600 customer. High likelihood of further referrals given 91% brand loyalty score.",
        impact: "£450",
        confidence: 76,
      },
    ],
    campaigns: ["Spring Loyalty Drive", "VIP Member Programme"],
    memory: [
      "Prefers morning appointments",
      "Has a dog named Biscuit (mentioned March)",
      "Works in finance — time-sensitive",
      "Appreciates punctuality above all else",
      "Birthday: 14 September",
    ],
  },
  {
    id: "2",
    name: "James Thompson",
    initials: "JT",
    segment: "High Value",
    health: 88,
    value: "£5,600",
    jobs: 9,
    lastSeen: "Yesterday",
    nextAction: "Upsell annual plan",
    prediction: "93% likely to book again",
    personality: {
      traits: [
        { label: "Decision Speed", value: 45, color: "#E31B23" },
        { label: "Price Sensitivity", value: 62, color: "#3b82f6" },
        { label: "Brand Loyalty", value: 79, color: "#10b981" },
        { label: "Communication Pref", value: 58, color: "#f59e0b" },
        { label: "Quality Focus", value: 71, color: "#8b5cf6" },
      ],
      summary: "Considered decision-maker who researches before committing. Moderate price sensitivity — responds well to value-based pricing and bundle deals. Prefers SMS for quick updates.",
    },
    communication: {
      preferred: "SMS",
      responseTime: "< 4 hours",
      bestTime: "Monday & Friday, 12pm–2pm",
      openRate: 81,
      clickRate: 52,
      channels: [
        { name: "SMS", rate: 87, color: "#E31B23" },
        { name: "Email", rate: 81, color: "#3b82f6" },
        { name: "Phone", rate: 44, color: "#10b981" },
      ],
    },
    buying: {
      avgSpend: "£622",
      frequency: "Every 4 weeks",
      peakSeason: "All year (consistent)",
      triggers: ["Bundle deals", "Seasonal promotions", "Reminder messages"],
      pattern: "Books regularly and consistently. Highest LTV customer. Rarely upgrades spontaneously but accepts bundle offers.",
    },
    timeline: [
      { date: "8 Jul 2026", event: "Booked standard service", amount: "£410", type: "booking" },
      { date: "9 Jun 2026", event: "Purchased bundle deal", amount: "£780", type: "purchase" },
      { date: "22 May 2026", event: "Left 4-star review", type: "review" },
      { date: "30 Apr 2026", event: "Referred Emily Clarke", type: "referral" },
      { date: "3 Mar 2026", event: "First appointment (referred by Marcus)", amount: "£320", type: "booking" },
    ],
    opportunities: [
      { title: "Annual membership plan", value: "£1,440/yr", probability: 71, urgency: "This month" },
      { title: "Next month booking reminder", value: "£410", probability: 93, urgency: "In 3 weeks" },
      { title: "Cross-sell complementary service", value: "£220", probability: 58, urgency: "Next visit" },
    ],
    priorities: [
      {
        action: "Send annual plan proposal",
        reason: "James books every 4 weeks without fail. An annual plan at a 15% discount saves him money and locks in £1,440. High probability based on consistent booking pattern.",
        impact: "£1,440",
        confidence: 71,
      },
      {
        action: "Send booking reminder",
        reason: "Last visit was yesterday — next booking due in approximately 3 weeks. SMS reminder at the 2-week mark has a 93% conversion rate for this customer.",
        impact: "£410",
        confidence: 93,
      },
    ],
    campaigns: ["Retention Plus", "Annual Members Drive"],
    memory: [
      "Referred by Marcus Williams",
      "Owns a small business — flexible mornings",
      "Prefers SMS over calls",
      "Mentioned extending service to his office",
      "Allergic to certain cleaning products (noted)",
    ],
  },
];

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

// ─── HERO ─────────────────────────────────────────────────────────────────────

function RelationshipDNAHero() {
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
            { label: "Total Customers", value: "39", icon: Users },
            { label: "Active Relationships", value: "28", icon: Heart },
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

function CustomerKPIs() {
  const kpis = [
    { label: "Total LTV", value: 77200, prefix: "£", trend: "+12%", up: true, icon: CircleDollarSign },
    { label: "Avg. LTV", value: 1980, prefix: "£", trend: "+8%", up: true, icon: TrendingUp },
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
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {customers.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 ${
            selected === c.id
              ? "border-brand/30 bg-brand/5 shadow-[0_0_0_1px_rgba(227,27,35,0.2)]"
              : "border-border bg-card hover:border-foreground/15 hover:bg-secondary/40"
          }`}
        >
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
            {c.initials}
          </div>
          <div>
            <div className="text-[12.5px] font-semibold text-foreground">{c.name}</div>
            <div className="text-[10.5px] text-muted-foreground">{c.segment}</div>
          </div>
          {selected === c.id && (
            <CheckCircle2 className="ml-1 h-3.5 w-3.5 text-brand" strokeWidth={2} />
          )}
        </button>
      ))}
      <button className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3.5 py-2.5 text-[12px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground">
        <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
        View all 39
      </button>
    </div>
  );
}

// ─── PERSONALITY PROFILE ──────────────────────────────────────────────────────

function PersonalityProfile({ customer }: { customer: (typeof customers)[0] }) {
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

function CommunicationDNA({ customer }: { customer: (typeof customers)[0] }) {
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

function BuyingDNA({ customer }: { customer: (typeof customers)[0] }) {
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

function AICustomerSummary({ customer }: { customer: (typeof customers)[0] }) {
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

function TodaysPriorities({ customer }: { customer: (typeof customers)[0] }) {
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

function CustomerTimeline({ customer }: { customer: (typeof customers)[0] }) {
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

function RevenueOpportunities({ customer }: { customer: (typeof customers)[0] }) {
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

function CampaignConnection({ customer }: { customer: (typeof customers)[0] }) {
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

function AIMemory({ customer }: { customer: (typeof customers)[0] }) {
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

export function RelationshipDNA() {
  const [selectedId, setSelectedId] = useState(customers[0].id);
  const customer = customers.find((c) => c.id === selectedId)!;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <RelationshipDNAHero />

      {/* KPIs */}
      <CustomerKPIs />

      {/* Segment selector */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-foreground">View Customer Profile</h2>
          <button className="flex items-center gap-1 text-[11.5px] font-semibold text-brand transition-all hover:gap-1.5">
            View all customers <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <CustomerSelector selected={selectedId} onSelect={setSelectedId} />
      </div>

      {/* AI Summary */}
      <AICustomerSummary customer={customer} />

      {/* 3-col profile grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <PersonalityProfile customer={customer} />
        <CommunicationDNA customer={customer} />
        <BuyingDNA customer={customer} />
      </div>

      {/* Relationship health */}
      <RelationshipHealth />

      {/* Priorities + Timeline */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TodaysPriorities customer={customer} />
        <CustomerTimeline customer={customer} />
      </div>

      {/* Revenue Opportunities + Campaign Connection */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueOpportunities customer={customer} />
        <CampaignConnection customer={customer} />
      </div>

      {/* Segments + Predictions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CustomerSegments />
        <CustomerPredictions />
      </div>

      {/* Analytics + Impact */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RelationshipAnalytics />
        <RelationshipImpact />
      </div>

      {/* AI Memory */}
      <AIMemory customer={customer} />

      {/* Business DNA preview */}
      <BusinessDNAPreview />
    </div>
  );
}
