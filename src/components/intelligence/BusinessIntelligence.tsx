import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Brain, TrendingUp, TrendingDown, Sparkles, Zap, Target, Shield,
  ChevronDown, ChevronRight, ArrowRight, Eye, Clock, Lightbulb,
  CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle,
  ChartBar as BarChart3, CircleDollarSign, Calendar, Star, Send,
  Award, RefreshCw, Users, Globe, MessageSquare, TrendingUp as TrendUp,
  Minus, ArrowDown, ArrowUp, FileText, Cpu,
} from "lucide-react";
import {
  dnaModules, discoveries, healthScores, causeEffectChains,
  predictions, opportunities, risks, timelineEvents, decisions,
  memoryItems, impactMetrics, suggestedPrompts,
} from "./mockData";
import type { ChatMessage } from "./types";

// ─── Shared Primitives ────────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1300,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
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
            setDisplay(eased * value);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString()}
      {suffix}
    </span>
  );
}

function ScoreRing({
  score,
  size = 80,
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
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <svg ref={ref} width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

function ProgressBar({ value, color = "#E31B23" }: { value: number; color?: string }) {
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
    <div ref={ref} className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${w}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── STATUS HELPERS ───────────────────────────────────────────────────────────

const statusConfig = {
  excellent: { badge: "bg-emerald-50 text-emerald-600", label: "Excellent" },
  strong: { badge: "bg-brand/10 text-brand", label: "Strong" },
  good: { badge: "bg-blue-50 text-blue-600", label: "Good" },
  "needs-attention": { badge: "bg-amber-50 text-amber-600", label: "Needs Attention" },
  critical: { badge: "bg-destructive/10 text-destructive", label: "Critical" },
} as const;

const severityConfig = {
  critical: { badge: "bg-destructive/10 text-destructive", dot: "bg-destructive animate-pulse" },
  high: { badge: "bg-brand/10 text-brand", dot: "bg-brand" },
  medium: { badge: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
  low: { badge: "bg-secondary text-muted-foreground", dot: "bg-muted-foreground/40" },
} as const;

const priorityConfig = {
  urgent: { badge: "bg-destructive/10 text-destructive" },
  high: { badge: "bg-brand/10 text-brand" },
  medium: { badge: "bg-amber-50 text-amber-600" },
  low: { badge: "bg-secondary text-muted-foreground" },
} as const;

// ─── SECTION 1: HERO ──────────────────────────────────────────────────────────

function Hero() {
  const [explainOpen, setExplainOpen] = useState(false);
  const overallScore = 91;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-brand/10 blur-2xl" />

      <div className="relative">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-brand" />
              Business Intelligence™
            </div>
            <h1 className="text-[20px] font-bold leading-tight tracking-tight text-background sm:text-[24px]">
              Good morning, Dom.
            </h1>
            <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-background/65">
              I've analysed every part of your business overnight. Here's what's happening, why it matters, and what to do next.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                <ScoreRing score={overallScore} size={72} stroke={6} color="#E31B23" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[18px] font-bold leading-none text-background">{overallScore}</span>
                  <span className="text-[8px] text-background/50">/ 100</span>
                </div>
              </div>
              <span className="text-[10px] font-medium text-background/60">Business Health</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            { label: "Business Momentum", value: "Strong", icon: TrendingUp, sub: "Accelerating" },
            { label: "Biggest Opportunity", value: "Re-activate Customers", icon: Target, sub: "Est. £8,200" },
            { label: "Biggest Risk", value: "Response Times", icon: AlertTriangle, sub: "Impact: £1,200/mo" },
            { label: "AI Confidence", value: "95%", icon: Brain, sub: "Based on 847 data points" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col gap-1 rounded-xl bg-background/10 p-3">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-background/55" strokeWidth={1.75} />
                  <span className="text-[9.5px] font-medium text-background/55">{item.label}</span>
                </div>
                <span className="text-[14px] font-bold leading-tight text-background">{item.value}</span>
                <span className="text-[9px] text-background/50">{item.sub}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            onClick={() => setExplainOpen(!explainOpen)}
            className="flex items-center gap-2 rounded-xl bg-background/15 px-4 py-2.5 text-[12.5px] font-semibold text-background transition-all hover:bg-background/25"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
            Explain Everything
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${explainOpen ? "rotate-180" : ""}`} />
          </button>
          <div className="flex items-center gap-2 rounded-xl bg-background/10 px-3.5 py-2.5 text-[11px] text-background/70">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Last analysed: 6:00am today
          </div>
        </div>

        {explainOpen && (
          <div className="mt-4 rounded-xl border border-background/20 bg-background/10 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Brain className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-background/70">Full AI Analysis — 9 July 2026</span>
            </div>
            <div className="space-y-3 text-[12.5px] leading-relaxed text-background/80">
              <p><span className="font-semibold text-background">What changed:</span> Response times increased 14 minutes on average. Website page speed score dropped to 54. Two negative reviews remain unanswered. Revenue is up 8% month-on-month.</p>
              <p><span className="font-semibold text-background">Why it changed:</span> The response time increase correlates with a surge in evening enquiries (5–7pm) without coverage. The website slowdown followed a plugin update on 6 July. The unanswered reviews are a capacity issue, not a process failure.</p>
              <p><span className="font-semibold text-background">Expected impact if not addressed:</span> Response time delay will cost an estimated £1,200/month in lost conversions. Website speed will continue to erode Google rankings. Each unanswered review reduces organic click-through rate by ~2%.</p>
              <p><span className="font-semibold text-background">What to do next:</span> Reply to both reviews today (5 minutes). Enable auto-acknowledgment on WhatsApp and Email for out-of-hours. Fix website images and plugins (2 hours). Launch re-activation campaign for 12 dormant customers (20 minutes). Total effort: ~3 hours. Total value unlocked: ~£12,000.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SECTION 2: BUSINESS DNA GRID ─────────────────────────────────────────────

function BusinessDNAGrid() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Business DNA™</span>
          <span className="ml-auto text-[11px] text-muted-foreground">9 intelligence modules</span>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dnaModules.map((mod) => {
            const cfg = statusConfig[mod.status];
            return (
              <Link
                key={mod.id}
                to={mod.route as "/"}
                className="group flex flex-col gap-3 rounded-xl border border-border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold text-foreground">{mod.name}</div>
                    <span className={`mt-1 inline-block rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="relative h-12 w-12 shrink-0">
                      <ScoreRing score={mod.score} size={48} stroke={4} color={mod.color} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[12px] font-bold text-foreground">{mod.score}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <ProgressBar value={mod.score} color={mod.color} />
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <p className="text-[10.5px] text-muted-foreground leading-tight">{mod.description}</p>
                    <div className={`flex shrink-0 items-center gap-0.5 text-[10px] font-semibold ${mod.trend >= 0 ? "text-brand" : "text-destructive"}`}>
                      {mod.trend >= 0 ? <TrendingUp className="h-2.5 w-2.5" strokeWidth={2} /> : <TrendingDown className="h-2.5 w-2.5" strokeWidth={2} />}
                      {Math.abs(mod.trend)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="text-[10px] text-muted-foreground">Contributes <span className="font-semibold text-foreground">{mod.contribution}/100</span></span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 3: AI DISCOVERIES ────────────────────────────────────────────────

function AIDiscoveries() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">AI Discoveries</span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{discoveries.length}</span>
          <span className="ml-auto text-[11px] text-muted-foreground">Updated 6:00am</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {discoveries.map((d) => (
          <div key={d.id} className="p-4 transition-colors hover:bg-secondary/20">
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: d.impactType === "positive" ? "#10b981" : d.impactType === "negative" ? "#E31B23" : "#6b7280" }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold text-foreground">{d.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[9.5px] font-bold"
                        style={{ backgroundColor: `${d.moduleColor}18`, color: d.moduleColor }}
                      >
                        {d.module}
                      </span>
                      <span className={`text-[11px] font-bold ${d.impactType === "positive" ? "text-brand" : "text-destructive"}`}>{d.impact}</span>
                      <span className="text-[10.5px] text-muted-foreground">{d.confidence}% confidence</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
                  >
                    <Eye className="h-3 w-3" strokeWidth={1.75} />
                    Explain
                    <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${expanded === d.id ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {expanded === d.id && (
                  <div className="mt-3 rounded-xl border border-brand/15 bg-brand/5 p-3.5">
                    <div className="flex items-start gap-2">
                      <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
                      <p className="text-[11.5px] leading-relaxed text-foreground/80">{d.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION 4: BUSINESS HEALTH ──────────────────────────────────────────────

function BusinessHealth() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Business Health Dashboard</span>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9">
          {healthScores.map((h) => (
            <div key={h.label} className="flex flex-col items-center gap-2">
              <div className="relative">
                <ScoreRing score={h.score} size={60} stroke={5} color={h.color} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[13px] font-bold text-foreground">{h.score}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-center text-[9.5px] font-medium text-muted-foreground leading-tight">{h.label}</span>
                <span className={`flex items-center gap-0.5 text-[9px] font-semibold ${h.trend >= 0 ? "text-brand" : "text-destructive"}`}>
                  {h.trend >= 0 ? <ArrowUp className="h-2 w-2" strokeWidth={2.5} /> : <ArrowDown className="h-2 w-2" strokeWidth={2.5} />}
                  {Math.abs(h.trend)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 5: CAUSE & EFFECT ────────────────────────────────────────────────

function CauseEffect() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Cause & Effect</span>
          <span className="ml-auto text-[11px] text-muted-foreground">AI connects events automatically</span>
        </div>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-3">
        {causeEffectChains.map((chain) => (
          <div key={chain.id} className="rounded-xl border border-border p-4">
            <div className="mb-3 text-[12px] font-semibold text-foreground">{chain.title}</div>
            <div className="space-y-2">
              {chain.steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-full rounded-lg px-3 py-2 text-center text-[11px] font-medium"
                    style={{
                      backgroundColor: step.type === "cause"
                        ? `${chain.color}18`
                        : step.type === "outcome"
                          ? `${chain.color}30`
                          : "oklch(0.97 0 0)",
                      color: step.type === "cause" || step.type === "outcome" ? chain.color : "oklch(0.45 0 0)",
                    }}
                  >
                    {step.label}
                  </div>
                  {i < chain.steps.length - 1 && (
                    <ArrowDown className="my-1 h-3 w-3 text-muted-foreground/40" strokeWidth={1.75} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION 6: AI PREDICTIONS ───────────────────────────────────────────────

function AIPredictions() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">AI Predictions</span>
          <span className="ml-auto text-[11px] text-muted-foreground">Next 30–60 days</span>
        </div>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {predictions.map((p, i) => (
          <div
            key={i}
            className="group cursor-pointer rounded-xl border border-border p-4 transition-all duration-200 hover:border-foreground/15 hover:shadow-card"
            onClick={() => setExpanded(expanded === p.label ? null : p.label)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-[11.5px] font-semibold text-foreground">{p.label}</span>
              <div className={`flex items-center gap-0.5 text-[11px] font-bold ${p.direction === "up" ? "text-brand" : p.direction === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                {p.direction === "up" ? <ArrowUp className="h-3 w-3" strokeWidth={2.5} /> : p.direction === "down" ? <ArrowDown className="h-3 w-3" strokeWidth={2.5} /> : <Minus className="h-3 w-3" strokeWidth={2} />}
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[11px] text-muted-foreground">{p.current}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground/40" strokeWidth={1.75} />
              <span className={`text-[16px] font-bold ${p.direction === "up" ? "text-brand" : p.direction === "down" ? "text-destructive" : "text-foreground"}`}>{p.predicted}</span>
            </div>
            <ProgressBar value={p.confidence} color={p.direction === "up" ? "#E31B23" : "#f59e0b"} />
            <div className="mt-1.5 flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">{p.timeframe}</span>
              <span className={`font-semibold ${p.direction === "up" ? "text-brand" : "text-amber-600"}`}>{p.confidence}% confidence</span>
            </div>
            {expanded === p.label && (
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-[11px] leading-relaxed text-muted-foreground">{p.reasoning}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION 7: OPPORTUNITY ENGINE ────────────────────────────────────────────

function OpportunityEngine() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const diffCfg = { Easy: "bg-emerald-50 text-emerald-600", Medium: "bg-amber-50 text-amber-600", Hard: "bg-destructive/10 text-destructive" } as const;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Opportunity Engine</span>
          <span className="ml-auto text-[11px] text-muted-foreground">Sorted by value</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {opportunities.map((o, rank) => (
          <div key={o.id} className="p-4 transition-colors hover:bg-secondary/20">
            <div className="flex items-start gap-3">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">{rank + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-[12.5px] font-semibold text-foreground">{o.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-[12px] font-bold text-brand">{o.value}</span>
                      <span className="text-[10.5px] text-muted-foreground">ROI: {o.roi}</span>
                      <span className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${diffCfg[o.difficulty]}`}>{o.difficulty}</span>
                      <span className="flex items-center gap-0.5 text-[10.5px] text-muted-foreground"><Clock className="h-2.5 w-2.5" strokeWidth={1.75} />{o.timeRequired}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-brand/90">Start</button>
                    <button
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                      className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] text-muted-foreground transition-all hover:border-foreground/20"
                    >
                      <Eye className="h-3 w-3" strokeWidth={1.75} />
                      <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${expanded === o.id ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>
                {expanded === o.id && (
                  <div className="mt-3 rounded-xl border border-brand/15 bg-brand/5 p-3.5">
                    <div className="flex items-start gap-2">
                      <Brain className="mt-0.5 h-3 w-3 shrink-0 text-brand" strokeWidth={1.75} />
                      <p className="text-[11.5px] leading-relaxed text-foreground/80">{o.reasoning}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION 8: RISK ENGINE ───────────────────────────────────────────────────

function RiskEngine() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Risk Engine</span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">{risks.length}</span>
          <span className="ml-auto text-[11px] text-muted-foreground">AI-identified</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {risks.map((r) => {
          const cfg = severityConfig[r.severity];
          return (
            <div key={r.id} className="p-4 transition-colors hover:bg-secondary/20">
              <div className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-[12.5px] font-semibold text-foreground">{r.title}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${cfg.badge}`}>{r.severity.charAt(0).toUpperCase() + r.severity.slice(1)}</span>
                        <span className="text-[11px] font-bold text-destructive">{r.financialImpact}</span>
                        <span className="text-[10.5px] text-muted-foreground">{r.probability}% probability</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
                    >
                      <Eye className="h-3 w-3" strokeWidth={1.75} />
                      Solution
                      <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${expanded === r.id ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {expanded === r.id && (
                    <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3.5">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" strokeWidth={1.75} />
                        <p className="text-[11.5px] leading-relaxed text-amber-800">{r.suggestedSolution}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SECTION 9: BUSINESS TIMELINE ────────────────────────────────────────────

function BusinessTimeline() {
  const catColors: Record<string, string> = {
    Revenue: "bg-brand/10 text-brand",
    Booking: "bg-emerald-50 text-emerald-600",
    Review: "bg-amber-50 text-amber-600",
    Website: "bg-orange-50 text-orange-600",
    Campaign: "bg-purple-50 text-purple-600",
    Finance: "bg-red-50 text-red-600",
    Relationship: "bg-blue-50 text-blue-600",
    AI: "bg-cyan-50 text-cyan-600",
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Business Timeline</span>
          <span className="ml-auto text-[11px] text-muted-foreground">Every event. One view.</span>
        </div>
      </div>
      <ul className="divide-y divide-border">
        {timelineEvents.map((ev, idx) => (
          <li key={ev.id} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/30">
            <div className="relative flex flex-col items-center">
              <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[9px] font-bold ${catColors[ev.category] ?? "bg-secondary text-muted-foreground"}`}>
                {ev.category.slice(0, 3)}
              </div>
              {idx < timelineEvents.length - 1 && <div className="mt-1 h-full w-px bg-border" />}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] font-semibold text-foreground">{ev.title}</span>
                    <div className={`h-1.5 w-1.5 rounded-full ${ev.sentiment === "positive" ? "bg-emerald-500" : ev.sentiment === "negative" ? "bg-destructive" : "bg-muted-foreground/40"}`} />
                  </div>
                  {ev.detail && <p className="mt-0.5 text-[11px] text-muted-foreground">{ev.detail}</p>}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  {ev.value && <span className="text-[12px] font-bold text-brand">{ev.value}</span>}
                  <span className="text-[10px] text-muted-foreground">{ev.date}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── SECTION 10: DECISION ENGINE ─────────────────────────────────────────────

function DecisionEngine() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">AI Decision Engine</span>
          <span className="ml-auto text-[11px] text-muted-foreground">What your AI recommends doing</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {decisions.map((d, i) => {
          const pcfg = priorityConfig[d.priority];
          return (
            <div key={d.id} className="p-4 transition-colors hover:bg-secondary/20">
              <div className="flex items-start gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-foreground text-[11px] font-bold text-background mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-[13px] font-semibold text-foreground">{d.recommendation}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${pcfg.badge}`}>{d.priority.charAt(0).toUpperCase() + d.priority.slice(1)}</span>
                        <span className="text-[10.5px] text-muted-foreground">{d.confidence}% confidence</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                      className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
                    >
                      <Eye className="h-3 w-3" strokeWidth={1.75} />
                      Explain Why
                      <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${expanded === d.id ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {expanded === d.id && (
                    <div className="mt-3 rounded-xl border border-brand/15 bg-brand/5 p-3.5">
                      <div className="mb-2 flex items-start gap-2">
                        <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
                        <div>
                          <p className="text-[11.5px] leading-relaxed text-foreground/80">{d.reason}</p>
                          <p className="mt-2 text-[11px] font-semibold text-brand">Expected: {d.expectedOutcome}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SECTION 11: EXECUTIVE REPORT ────────────────────────────────────────────

function ExecutiveReport() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Weekly Executive Report</span>
          <span className="ml-auto rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">W28 · July 2026</span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Business Momentum", value: "Strong", color: "text-brand" },
            { label: "Overall Confidence", value: "95%", color: "text-foreground" },
            { label: "Revenue Opportunity", value: "£24,940", color: "text-brand" },
            { label: "Critical Actions", value: "3", color: "text-destructive" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-secondary/50 p-3 text-center">
              <div className="text-[10px] font-medium text-muted-foreground">{s.label}</div>
              <div className={`mt-1 text-[17px] font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Wins This Week", color: "emerald", items: ["Revenue up 8% month-on-month", "Relationship health at all-time high (94)", "Review response programme launched", "5 new customers acquired"] },
            { label: "Areas to Address", color: "amber", items: ["2 negative reviews unanswered", "Website speed score declined to 54", "Response times increased 14 minutes", "2 invoices overdue £1,640 combined"] },
            { label: "Top Recommendations", color: "brand", items: ["Reply to negative reviews today", "Enable out-of-hours auto-response", "Launch re-activation campaign", "Fix website images and plugins"] },
          ].map((section) => (
            <div key={section.label} className="rounded-xl border border-border p-3.5">
              <div className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{section.label}</div>
              <ul className="space-y-1.5">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11.5px] text-foreground/80">
                    <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${section.color === "emerald" ? "bg-emerald-500" : section.color === "amber" ? "bg-amber-500" : "bg-brand"}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary/50 p-4">
          <div>
            <div className="text-[11px] text-muted-foreground">Full PDF report ready</div>
            <div className="text-[12.5px] font-semibold text-foreground">Week 28 — Business Intelligence Report</div>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-[12.5px] font-semibold text-background transition-all hover:bg-foreground/90">
            <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 12: AI MEMORY ────────────────────────────────────────────────────

function AIMemorySection() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">AI Memory</span>
          <span className="ml-auto text-[11px] text-muted-foreground">Continuously learning from your business</span>
        </div>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2">
        {memoryItems.map((m) => (
          <div key={m.id} className="flex items-start gap-3 rounded-xl bg-secondary/50 px-4 py-3">
            <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
            <div>
              <p className="text-[12px] leading-relaxed text-foreground">{m.insight}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{m.learnedFrom}</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-[10px] font-semibold text-brand">{m.confidence}% confident</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION 13: BUSINESS IMPACT ─────────────────────────────────────────────

function BusinessImpact() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Business Impact</span>
          <span className="ml-auto rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">Since Activation</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        {impactMetrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
            <div className="text-[10px] font-medium text-muted-foreground">{m.label}</div>
            <div className="mt-1.5 text-[20px] font-bold text-foreground">
              <AnimatedNumber value={m.value} prefix={m.prefix ?? ""} suffix={m.suffix ?? ""} />
            </div>
            <div className="mt-0.5 text-[10px] font-medium" style={{ color: m.color }}>{m.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION 14: INTELLIGENCE CHAT ───────────────────────────────────────────

const aiResponses: Record<string, string> = {
  "Why is profit falling?": "Your profit margin has decreased from 38% to 34% over 6 weeks. Two contributing factors: supplier costs have increased by approximately £890/month without a corresponding price adjustment, and 2 overdue invoices totalling £1,640 are creating cashflow pressure. I recommend reviewing 3 supplier contracts due for Q3 renewal and chasing both invoices this week.",
  "Where am I losing money?": "There are three identified revenue leaks: (1) Slow response times are costing an estimated £1,200/month in unconverted leads. (2) The website speed decline has reduced organic traffic by 18%, worth approximately £640/month in lost enquiries. (3) 27 happy customers haven't been asked for reviews — their Google impact is worth approximately £4,500 in potential new customer revenue.",
  "What should I focus on this month?": "Prioritise in this order: First, reply to both negative reviews (5 minutes, protects £1,800 in reputation value). Second, enable out-of-hours auto-response (30 minutes, recovers £2,800/month). Third, launch the 12-customer re-activation campaign (20 minutes, generates estimated £8,200). Total: 55 minutes of effort for ~£12,000 in unlocked value.",
  "What is my biggest opportunity right now?": "Your biggest immediate opportunity is the 12 dormant customers identified by AI. These customers have spent an average of £680 each and haven't booked in 90+ days. Based on historical re-activation campaigns with similar customer profiles, 5–7 are predicted to rebook. AI has already drafted personalised messages for each one. Estimated return: £8,200. Effort: 20 minutes.",
  "Summarise my business in one paragraph.": "Your business is performing well with strong momentum. Revenue is up 8% month-on-month and your customer relationships are at their healthiest ever, with a Relationship DNA™ score of 94/100. Your biggest strengths are communication quality and customer loyalty. The areas requiring immediate attention are response time management, website performance, and reputation response rate — all of which are fixable within a few hours this week. Overall Business Health: 91/100.",
  "How can I grow revenue faster?": "The fastest revenue growth available to you right now comes from three sources: (1) Re-activating 12 dormant customers (£8,200, 20 minutes). (2) Reducing response time to under 15 minutes, which should recover 9% of currently lost leads (£2,800/month ongoing). (3) Fixing website speed and collecting 27 outstanding reviews, which together should increase organic traffic by 14% within 60 days. Combined impact: approximately £15,000 additional revenue over the next 60 days.",
  "Why is my Business Score dropping?": "Your Business Score has dropped 4 points from its peak of 95. The main contributing factors are: Website DNA™ fell from 71 to 65 (page speed decline), Marketing DNA™ fell from 70 to 68 (SEO erosion), and Finance DNA™ fell from 74 to 71 (overdue invoices). Your Relationship DNA™ and Communication Intelligence™ scores are both rising, partially offsetting the decline. Addressing the website speed and overdue invoices would recover approximately 3–4 points.",
  "What would a 10% revenue increase require?": "At your current monthly revenue of £18,250, a 10% increase means generating an additional £1,825/month. The AI estimates this is achievable by: activating the dormant customer campaign (adds £8,200 once, not recurring), reducing response time (adds £2,800/month recurring), and the review-driven SEO improvement adds approximately £640/month. The sustainable 10% monthly increase is most achievable through the response time fix combined with the review campaign over a 60-day period.",
};

function IntelligenceChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Hello. I've already analysed your entire business. Ask me anything — I know your revenue, customers, reviews, website, and operations in detail." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const response = aiResponses[text] ?? `Great question. Based on your current business data, I can see patterns across your ${dnaModules.length} intelligence modules. To give you the most accurate answer, I'd recommend also looking at your Relationship DNA™ score (94) and Communication Intelligence™ (83) — both are performing well and provide context for this question. Would you like me to analyse a specific module in more detail?`;
      setMessages((m) => [...m, { role: "ai", content: response }]);
      setLoading(false);
    }, 900);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Business Intelligence Chat</span>
          <span className="flex items-center gap-1.5 ml-auto rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            AI Online
          </span>
        </div>
      </div>

      {/* Suggested prompts */}
      <div className="border-b border-border bg-secondary/30 px-4 py-3">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Suggested questions</div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition-all hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex h-80 flex-col overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" && (
              <div className="mr-2 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10">
                <Brain className="h-3 w-3 text-brand" strokeWidth={1.75} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-[12.5px] leading-relaxed ${
                msg.role === "user"
                  ? "rounded-tr-sm bg-foreground text-background"
                  : "rounded-tl-sm bg-secondary/60 text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10">
              <Brain className="h-3 w-3 text-brand" strokeWidth={1.75} />
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-secondary/60 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask your AI anything about your business..."
            className="flex-1 rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-card focus:outline-none"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-white transition-all hover:bg-brand/90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────

export function BusinessIntelligence() {
  return (
    <div className="space-y-6">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Business DNA Grid */}
      <BusinessDNAGrid />

      {/* 3. AI Discoveries */}
      <AIDiscoveries />

      {/* 4. Business Health */}
      <BusinessHealth />

      {/* 5 + 6. Cause & Effect + Predictions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CauseEffect />
        <AIPredictions />
      </div>

      {/* 7 + 8. Opportunities + Risks */}
      <div className="grid gap-4 lg:grid-cols-2">
        <OpportunityEngine />
        <RiskEngine />
      </div>

      {/* 9. Business Timeline */}
      <BusinessTimeline />

      {/* 10. Decision Engine */}
      <DecisionEngine />

      {/* 11. Executive Report */}
      <ExecutiveReport />

      {/* 12 + 13. Memory + Impact */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AIMemorySection />
        <BusinessImpact />
      </div>

      {/* 14. Intelligence Chat */}
      <IntelligenceChat />
    </div>
  );
}
