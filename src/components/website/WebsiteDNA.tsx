import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Globe, TrendingUp, TrendingDown, Sparkles, Zap, Target, Shield,
  ChevronDown, ChevronRight, ArrowRight, Eye, Clock, Lightbulb,
  CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle,
  ChartBar as BarChart3, CircleDollarSign, Search, FileText,
  RefreshCw, Users, MessageSquare, Minus, ArrowDown, ArrowUp,
  Cpu, Brain, Star, Send, Award, Map, MousePointerClick,
  Wand as Wand2, Activity, Layers,
} from "lucide-react";
import {
  websiteScores, websiteDiscoveries, journeySteps, conversionMetrics,
  websiteOpportunities, seoMetrics, contentIssues, websitePredictions,
  websiteMissions, dnaContributions, websiteMemoryItems,
  websiteImpactMetrics, websiteSuggestedPrompts,
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
    <svg ref={ref} width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="oklch(0.925 0 0)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

function ProgressBar({
  value,
  color = "#E31B23",
  height = 6,
}: {
  value: number;
  color?: string;
  height?: number;
}) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(value), 100);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="w-full rounded-full bg-secondary" style={{ height }}>
      <div
        className="rounded-full transition-all duration-700 ease-out"
        style={{ width: `${width}%`, height, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Section 1: Website DNA™ Hero ─────────────────────────────────────────────

function WebsiteDNAHero() {
  const [showExplain, setShowExplain] = useState(false);
  const mainScore = websiteScores[0];
  const otherScores = websiteScores.slice(1);

  return (
    <div className="overflow-hidden rounded-2xl bg-foreground text-background shadow-card">
      <div className="border-b border-background/10 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Globe className="h-5 w-5 text-[#f97316]" strokeWidth={1.75} />
              <span className="text-[13px] font-semibold uppercase tracking-widest text-background/60">Website DNA™</span>
            </div>
            <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-background sm:text-[32px]">
              Is Your Website Helping or Hurting?
            </h1>
            <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-background/60">
              AI has analysed your website across 8 performance dimensions. Action is required.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-background/50">Health Score</div>
              <div className="text-[42px] font-bold leading-none text-background">
                <AnimatedNumber value={mainScore.score} />
              </div>
              <div className="text-[11px] text-background/50">out of 100</div>
            </div>
            <ScoreRing score={mainScore.score} size={76} stroke={6} color="#f97316" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-background/10 sm:grid-cols-4 sm:divide-x">
        {otherScores.slice(0, 4).map((s, i) => (
          <div key={s.label} className={`flex flex-col gap-3 px-5 py-5 ${i > 0 ? "border-l border-background/10 sm:border-0" : ""}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-background/50">{s.label}</span>
              <span className={`text-[11px] font-semibold ${s.trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {s.trend >= 0 ? "+" : ""}{s.trend}
              </span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-[26px] font-bold leading-none text-background">
                <AnimatedNumber value={s.score} />
              </span>
              <ScoreRing score={s.score} size={36} stroke={4} color={s.color} />
            </div>
            <ProgressBar value={s.score} color={s.color} height={3} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 divide-background/10 border-t border-background/10 sm:grid-cols-4 sm:divide-x">
        {otherScores.slice(4).map((s, i) => (
          <div key={s.label} className={`flex flex-col gap-3 px-5 py-5 ${i > 0 ? "border-l border-background/10 sm:border-0" : ""}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-background/50">{s.label}</span>
              <span className={`text-[11px] font-semibold ${s.trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {s.trend >= 0 ? "+" : ""}{s.trend}
              </span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-[26px] font-bold leading-none text-background">
                <AnimatedNumber value={s.score} />
              </span>
              <ScoreRing score={s.score} size={36} stroke={4} color={s.color} />
            </div>
            <ProgressBar value={s.score} color={s.color} height={3} />
          </div>
        ))}
      </div>

      <div className="border-t border-background/10 px-6 py-5 sm:px-8">
        <button
          onClick={() => setShowExplain(!showExplain)}
          className="flex items-center gap-2 rounded-xl border border-background/20 px-4 py-2.5 text-[13px] font-semibold text-background/80 transition-colors hover:bg-background/10"
        >
          <Sparkles className="h-4 w-4 text-[#f97316]" strokeWidth={1.75} />
          Explain Everything
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showExplain ? "rotate-180" : ""}`} />
        </button>
        {showExplain && (
          <div className="mt-4 rounded-xl border border-background/10 bg-background/5 p-4">
            <p className="text-[13.5px] leading-relaxed text-background/80">
              Your website is currently <strong className="text-background">underperforming across 6 of 8 dimensions</strong>. The most critical issue is page speed — a 4.2-second load time is causing 22% of mobile visitors to leave before the page loads. This directly impacts conversion rate (currently 1.8% vs 3.2% industry average). Combined with a contact form that has too many fields and a homepage CTA that is below the fold on mobile, your website is losing an estimated <strong className="text-background">£5,760 in potential monthly revenue</strong>. The good news: 3 of the top 6 fixes are Easy difficulty and require under 1 hour to implement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section 2: AI Executive Summary ──────────────────────────────────────────

function AIExecutiveSummary() {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl bg-foreground text-background shadow-card">
      <div className="px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Brain className="h-5 w-5 text-[#f97316]" strokeWidth={1.75} />
            <span className="text-[13px] font-semibold uppercase tracking-widest text-background/60">AI Executive Summary</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-background/20 px-3 py-1.5">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[12px] font-semibold text-background/60">94% Confidence</span>
          </div>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-background/90">
          Your website is <strong className="text-background">attracting visitors but failing to convert them</strong>. Traffic increased 18% in Q2 but conversions fell 9% — a divergence that points directly to UX and speed issues rather than a demand problem. The AI has identified that slow page loading (4.2 seconds on mobile) and a contact form with 9 required fields are the primary conversion blockers.
        </p>
        {showFull && (
          <div className="mt-3 space-y-2 text-[14px] leading-relaxed text-background/80">
            <p>
              Fixing page speed alone is expected to recover 22% of mobile bounce and generate approximately <strong className="text-background">£1,960 in additional monthly leads</strong>. Reducing the contact form to 4 fields could increase completions from 3.1% to 8.4%, adding a further <strong className="text-background">£2,800/month</strong>.
            </p>
            <p>
              SEO erosion is a secondary concern. Four keywords dropped from positions 3–5 to 7–9 following competitor content activity. Without intervention, organic traffic is projected to fall a further 16% over the next 30 days.
            </p>
            <p className="font-medium text-background">
              Combined, the recommended fixes could generate an additional <strong>£5,760–£9,700/month</strong> within 90 days.
            </p>
          </div>
        )}
        <button
          onClick={() => setShowFull(!showFull)}
          className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-[#f97316] transition-opacity hover:opacity-70"
        >
          {showFull ? "Show Less" : "Explain Everything"}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFull ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );
}

// ─── Section 3: Website Health ─────────────────────────────────────────────────

function WebsiteHealth() {
  const healthItems = [
    { label: "Overall Health", score: 65, color: "#E31B23" },
    { label: "Performance", score: 54, color: "#ef4444" },
    { label: "SEO", score: 61, color: "#f59e0b" },
    { label: "Conversions", score: 52, color: "#f97316" },
    { label: "User Experience", score: 63, color: "#f97316" },
    { label: "Accessibility", score: 74, color: "#10b981" },
    { label: "Security", score: 88, color: "#10b981" },
    { label: "Forms", score: 38, color: "#ef4444" },
    { label: "Tracking", score: 71, color: "#3b82f6" },
  ];

  const statusLabel = (s: number) =>
    s >= 80 ? "Excellent" : s >= 70 ? "Good" : s >= 55 ? "Needs Work" : "Critical";
  const statusColor = (s: number) =>
    s >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : s >= 70 ? "text-blue-600 bg-blue-50 border-blue-200" : s >= 55 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200";

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Activity className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Website Health Dashboard</span>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border sm:grid-cols-3 lg:grid-cols-9">
        {healthItems.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-3 bg-card px-3 py-5">
            <ScoreRing score={item.score} size={64} stroke={5} color={item.color} />
            <div className="text-center">
              <div className="text-[20px] font-bold text-foreground">
                <AnimatedNumber value={item.score} />
              </div>
              <div className="mt-0.5 text-[10.5px] font-medium text-muted-foreground">{item.label}</div>
              <span className={`mt-1.5 inline-block rounded border px-1.5 py-0.5 text-[9.5px] font-semibold ${statusColor(item.score)}`}>
                {statusLabel(item.score)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 4: AI Discoveries ────────────────────────────────────────────────

function AIDiscoveries() {
  const [expanded, setExpanded] = useState<string | null>("wd1");

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Lightbulb className="h-4.5 w-4.5 text-[#f97316]" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">AI Discoveries</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {websiteDiscoveries.length}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {websiteDiscoveries.map((d) => {
          const open = expanded === d.id;
          return (
            <li key={d.id}>
              <button
                className="flex w-full items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-secondary/30"
                onClick={() => setExpanded(open ? null : d.id)}
              >
                <span className={`mt-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${d.impactType === "positive" ? "bg-emerald-50 text-emerald-700" : d.impactType === "negative" ? "bg-red-50 text-red-700" : "bg-secondary text-muted-foreground"}`}>
                  {d.businessImpact}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold text-foreground">{d.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {d.relatedPages.map((p) => (
                      <span key={p} className="rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground">{p}</span>
                    ))}
                    <span className="text-[11px] text-muted-foreground">{d.confidence}% confidence</span>
                  </div>
                </div>
                <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="border-t border-border bg-secondary/20 px-6 py-4">
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{d.explanation}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Section 5: Website Journey ───────────────────────────────────────────────

function WebsiteJourney() {
  const maxVisitors = journeySteps[0].visitors;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Map className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Visitor Journey</span>
        <span className="ml-auto text-[12px] text-muted-foreground">Where visitors drop off</span>
      </div>
      <div className="px-6 py-6">
        <div className="flex flex-col gap-0">
          {journeySteps.map((step, i) => {
            const widthPct = (step.visitors / maxVisitors) * 100;
            const isLast = i === journeySteps.length - 1;
            return (
              <div key={step.label} className="flex flex-col">
                <div className="flex items-center gap-4">
                  <div className="w-36 shrink-0 text-right text-[12px] font-medium text-muted-foreground sm:w-44">{step.label}</div>
                  <div className="flex flex-1 items-center gap-3">
                    <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-secondary">
                      <div
                        className="flex h-full items-center justify-end pr-2 transition-all duration-700 ease-out"
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: step.isDropPoint ? "#ef4444" : "#E31B23",
                          opacity: step.isDropPoint ? 0.7 : 1,
                        }}
                      >
                        <span className="text-[11px] font-semibold text-white">{step.visitors.toLocaleString()}</span>
                      </div>
                    </div>
                    {step.isDropPoint && step.dropOff > 0 && (
                      <div className="flex w-20 shrink-0 items-center gap-1">
                        <ArrowDown className="h-3.5 w-3.5 text-red-500" />
                        <span className="text-[11px] font-semibold text-red-500">-{step.dropOff}%</span>
                        <span className="text-[10px] text-muted-foreground">leave</span>
                      </div>
                    )}
                    {!step.isDropPoint && step.dropOff === 0 && i > 0 && (
                      <div className="w-20 shrink-0" />
                    )}
                  </div>
                </div>
                {!isLast && (
                  <div className="ml-36 flex items-center sm:ml-44">
                    <div className="ml-4 h-4 w-px bg-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-brand" />
            <span className="text-[11.5px] text-muted-foreground">Normal flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-red-400" />
            <span className="text-[11.5px] text-muted-foreground">High drop-off point</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section 6: Conversion Intelligence ───────────────────────────────────────

function ConversionIntelligence() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Target className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Conversion Intelligence</span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {conversionMetrics.map((m) => (
          <button
            key={m.label}
            className="flex flex-col gap-1.5 bg-card px-4 py-4 text-left transition-colors hover:bg-secondary/30"
            onClick={() => setExpanded(expanded === m.label ? null : m.label)}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">{m.label}</span>
              {m.trend && (
                <span className={`text-[10.5px] font-semibold ${m.up ? "text-emerald-600" : "text-red-500"}`}>
                  {m.trend}
                </span>
              )}
            </div>
            <span className="text-[20px] font-bold tracking-tight text-foreground">{m.value}</span>
            <span className="text-[10.5px] text-muted-foreground/60">Tap for insight →</span>
          </button>
        ))}
      </div>
      {expanded && (
        <div className="border-t border-border bg-secondary/30 px-6 py-4">
          {conversionMetrics.filter((m) => m.label === expanded).map((m) => (
            <p key={m.label} className="text-[13px] leading-relaxed text-muted-foreground">
              <strong className="text-foreground">{m.label}:</strong> {m.explanation}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section 7: AI Opportunities ──────────────────────────────────────────────

function AIOpportunities() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const diffColor = (d: string) =>
    d === "Easy" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
    d === "Medium" ? "text-amber-700 bg-amber-50 border-amber-200" :
    "text-red-700 bg-red-50 border-red-200";

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Zap className="h-4.5 w-4.5 text-[#f97316]" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">AI Opportunities</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {websiteOpportunities.length}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {websiteOpportunities.map((op, i) => {
          const open = expanded === op.id;
          return (
            <li key={op.id} className="px-6 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-semibold text-foreground">{op.title}</div>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{op.estimatedRevenue}</span>
                        <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">{op.conversionIncrease} conversion</span>
                        <span className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${diffColor(op.difficulty)}`}>{op.difficulty}</span>
                        <span className="rounded border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">{op.timeRequired}</span>
                        <span className="rounded border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">{op.confidence}% confidence</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-brand px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-80">
                        Start Mission
                      </button>
                      <button
                        onClick={() => setExpanded(open ? null : op.id)}
                        className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:bg-secondary"
                      >
                        {open ? "Hide" : "Explain Why"}
                      </button>
                    </div>
                  </div>
                  {open && (
                    <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3">
                      <p className="text-[13px] leading-relaxed text-muted-foreground">{op.reasoning}</p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Section 8: SEO DNA ────────────────────────────────────────────────────────

function SEODNA() {
  const statusConfig = {
    good: { color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
    warning: { color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
    critical: { color: "text-red-700 bg-red-50 border-red-200", dot: "bg-red-500" },
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Search className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">SEO DNA</span>
        <span className="ml-auto text-[12px] text-muted-foreground">
          {seoMetrics.filter((s) => s.status === "good").length}/{seoMetrics.length} passing
        </span>
      </div>
      <ul className="divide-y divide-border">
        {seoMetrics.map((m) => {
          const cfg = statusConfig[m.status];
          return (
            <li key={m.label} className="flex items-start gap-4 px-6 py-3.5">
              <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-foreground">{m.label}</span>
                  <span className={`rounded border px-2 py-0.5 text-[10.5px] font-semibold ${cfg.color}`}>{m.value}</span>
                </div>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{m.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Section 9: Content Intelligence ──────────────────────────────────────────

function ContentIntelligence() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const typeLabel: Record<string, string> = {
    "weak-headline": "Weak Headline",
    "confusing": "Confusing Section",
    "low-trust": "Low Trust",
    "poor-cta": "Poor CTA",
    "missing-faq": "Missing FAQ",
    "missing-proof": "Missing Proof",
  };

  const typeColor: Record<string, string> = {
    "weak-headline": "text-amber-700 bg-amber-50 border-amber-200",
    "confusing": "text-orange-700 bg-orange-50 border-orange-200",
    "low-trust": "text-red-700 bg-red-50 border-red-200",
    "poor-cta": "text-red-700 bg-red-50 border-red-200",
    "missing-faq": "text-blue-700 bg-blue-50 border-blue-200",
    "missing-proof": "text-purple-700 bg-purple-50 border-purple-200",
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <FileText className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Content Intelligence</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {contentIssues.length}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {contentIssues.map((ci) => {
          const open = expanded === ci.id;
          return (
            <li key={ci.id}>
              <button
                className="flex w-full items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-secondary/30"
                onClick={() => setExpanded(open ? null : ci.id)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">{ci.page}</span>
                    <span className={`rounded border px-1.5 py-0.5 text-[10.5px] font-semibold ${typeColor[ci.type]}`}>{typeLabel[ci.type]}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-semibold ${ci.impact === "high" ? "text-red-600" : ci.impact === "medium" ? "text-amber-600" : "text-muted-foreground"}`}>
                      {ci.impact} impact
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] font-medium text-foreground">{ci.issue}</p>
                </div>
                <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="border-t border-border bg-secondary/20 px-6 py-4">
                  <div className="flex items-start gap-2">
                    <Wand2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">AI Suggestion:</strong> {ci.suggestion}
                    </p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Section 10: Heatmap Insights ─────────────────────────────────────────────

function HeatmapInsights() {
  const placeholders = [
    { label: "Click Heatmap", description: "See exactly where visitors click most on each page.", icon: MousePointerClick, color: "#E31B23" },
    { label: "Scroll Depth", description: "Understand how far down visitors read before leaving.", icon: ArrowDown, color: "#f97316" },
    { label: "Attention Areas", description: "AI identifies which page sections hold attention longest.", icon: Eye, color: "#3b82f6" },
    { label: "Dead Clicks", description: "Detect elements visitors click that do nothing — broken UX.", icon: Target, color: "#f59e0b" },
    { label: "Rage Clicks", description: "Find areas where frustrated visitors repeatedly click.", icon: AlertTriangle, color: "#ef4444" },
    { label: "Session Replays", description: "Watch anonymised recordings of real visitor sessions.", icon: Activity, color: "#8b5cf6" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2.5">
          <MousePointerClick className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[14px] font-semibold text-foreground">Heatmap Insights</span>
        </div>
        <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          Microsoft Clarity · Coming Soon
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3">
        {placeholders.map(({ label, description, icon: Icon, color }) => (
          <div key={label} className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-secondary/30 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card">
              <Icon className="h-4.5 w-4.5" style={{ color }} strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-foreground">{label}</div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">{description}</p>
            </div>
            <span className="text-[10.5px] font-medium text-muted-foreground/60">Connects with Microsoft Clarity</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 11: AI Predictions ───────────────────────────────────────────────

function AIPredictions() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const dirIcon = (d: string) =>
    d === "up" ? <ArrowUp className="h-3.5 w-3.5 text-emerald-500" /> :
    d === "down" ? <ArrowDown className="h-3.5 w-3.5 text-red-500" /> :
    <Minus className="h-3.5 w-3.5 text-muted-foreground" />;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <TrendingUp className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">AI Predictions</span>
      </div>
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {websitePredictions.map((p) => {
          const open = expanded === p.label;
          return (
            <button
              key={p.label}
              className="flex flex-col gap-2 bg-card px-5 py-4 text-left transition-colors hover:bg-secondary/30"
              onClick={() => setExpanded(open ? null : p.label)}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-medium text-muted-foreground">{p.label}</span>
                <div className="flex items-center gap-1">
                  {dirIcon(p.direction)}
                  <span className="text-[10.5px] text-muted-foreground">{p.confidence}%</span>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-[18px] font-bold text-foreground">{p.predicted}</span>
                <span className="mb-0.5 text-[11.5px] text-muted-foreground">from {p.current}</span>
              </div>
              <div className="text-[10.5px] text-muted-foreground/70">{p.timeframe}</div>
              {open && (
                <p className="mt-1 rounded-lg bg-secondary/50 p-2.5 text-[12px] leading-relaxed text-muted-foreground">
                  {p.reasoning}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Section 12: Website Missions ─────────────────────────────────────────────

function WebsiteMissions() {
  const statusColor = (s: string) =>
    s === "active" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
    s === "planned" ? "text-blue-700 bg-blue-50 border-blue-200" :
    "text-muted-foreground bg-secondary border-border";

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Layers className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Website Missions</span>
      </div>
      <div className="space-y-0 divide-y divide-border">
        {websiteMissions.map((m) => (
          <div key={m.id} className="px-6 py-5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{m.campaign}</div>
                <div className="mt-0.5 text-[14px] font-semibold text-foreground">{m.mission}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{m.estimatedRevenue}</span>
                <span className={`rounded border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusColor(m.status)}`}>{m.status}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {m.tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/30 px-3 py-2">
                  <div className="h-4 w-4 shrink-0 rounded border border-border bg-card" />
                  <span className="text-[12.5px] text-foreground">{task}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 13: Business DNA™ Preview ────────────────────────────────────────

function BusinessDNAPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Brain className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Business DNA™ — Website Contribution</span>
        <Link to="/intelligence" className="ml-auto flex items-center gap-1 text-[12px] text-brand hover:opacity-70">
          View Intelligence <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="p-6">
        <p className="mb-4 text-[13px] text-muted-foreground">
          Website DNA™ contributes data to the following Business DNA™ modules. Improving your website score improves your overall CrediEdge Score.
        </p>
        <div className="space-y-3">
          {dnaContributions.map((d) => (
            <Link key={d.module} to={d.route} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary/30">
              <div className="h-8 w-8 shrink-0 rounded-lg" style={{ backgroundColor: `${d.color}18`, border: `1px solid ${d.color}30` }}>
                <div className="flex h-full items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-foreground">{d.module}</div>
                <ProgressBar value={d.contribution} color={d.color} height={4} />
              </div>
              <div className="text-right">
                <div className="text-[15px] font-bold text-foreground">
                  <AnimatedNumber value={d.contribution} suffix="%" />
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section 14: AI Memory ────────────────────────────────────────────────────

function AIMemorySection() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Cpu className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">AI Memory</span>
        <span className="ml-auto text-[12px] text-muted-foreground">Continuously learning</span>
      </div>
      <ul className="divide-y divide-border">
        {websiteMemoryItems.map((m) => (
          <li key={m.id} className="flex items-start gap-4 px-6 py-4">
            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-relaxed text-foreground">{m.insight}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground">{m.learnedFrom}</span>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground">{m.category}</span>
                <span className="text-[10.5px] font-semibold text-emerald-600">{m.confidence}% confidence</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Section 15a: Website Impact ──────────────────────────────────────────────

function WebsiteImpact() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Award className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Website Impact</span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {websiteImpactMetrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-1.5 bg-card px-4 py-5">
            <div className="text-[11px] font-medium text-muted-foreground">{m.label}</div>
            <div className="text-[24px] font-bold tracking-tight" style={{ color: m.color }}>
              <AnimatedNumber value={m.value} prefix={m.prefix ?? ""} suffix={m.suffix ?? ""} />
            </div>
            <div className="text-[11.5px] text-muted-foreground">{m.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 15b: Executive Report ────────────────────────────────────────────

function ExecutiveReport() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };

  const sections = [
    { label: "Summary", value: "Website performing below potential. 3 critical fixes available within 1 hour." },
    { label: "Strengths", value: "Security (88/100). Pricing page converts well. Accessibility improving." },
    { label: "Weaknesses", value: "Speed (54/100). Contact form (9 fields). Mobile CTA placement. SEO erosion." },
    { label: "Risks", value: "Organic traffic projected to fall 16% without SEO intervention in 30 days." },
    { label: "Opportunities", value: "£9,700/mo recoverable. 6 identified opportunities. 3 require under 1 hour." },
    { label: "Priority Actions", value: "1. Compress images. 2. Simplify contact form. 3. Add pricing to navigation." },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2.5">
          <FileText className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[14px] font-semibold text-foreground">Executive Website Report</span>
        </div>
        {generated ? (
          <button className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-80">
            Download Report (PDF)
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-[12.5px] font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-60"
          >
            {generating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
                Generate Report
              </>
            )}
          </button>
        )}
      </div>
      {generated ? (
        <div className="divide-y divide-border">
          {sections.map((s) => (
            <div key={s.label} className="flex gap-4 px-6 py-3.5">
              <span className="w-28 shrink-0 text-[12px] font-semibold text-muted-foreground">{s.label}</span>
              <span className="text-[13px] text-foreground">{s.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-6 py-3.5">
            <span className="text-[12px] text-muted-foreground">AI Confidence: <strong className="text-foreground">91%</strong></span>
            <span className="text-[12px] text-muted-foreground">Generated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/30" strokeWidth={1.25} />
          <div className="text-[14px] font-semibold text-foreground">Generate Your Website Report</div>
          <p className="max-w-sm text-[13px] text-muted-foreground">
            The AI will generate a complete executive report including summary, strengths, weaknesses, risks, opportunities, and priority actions.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Section 16: Website Chat ─────────────────────────────────────────────────

const chatResponses: Record<string, string> = {
  "Why aren't visitors converting?": "Your conversion rate is 1.8% vs an industry average of 3.2%. The AI has identified three primary blockers: (1) A 4.2-second load time causing 22% of mobile visitors to leave before the page loads. (2) A contact form with 9 mandatory fields — industry data shows 9+ fields average 3.1% completion vs 8.4% for 4-field forms. (3) Your homepage CTA button is below the fold on 38% of mobile devices. Fixing these three issues alone is projected to increase conversions by 72%.",
  "What is my biggest website problem?": "Your biggest single problem is page speed. At 4.2 seconds load time, you're failing Google's Core Web Vitals (LCP, CLS, FID all in 'poor' range). This is a triple problem: it directly causes mobile visitors to leave, it reduces your Google search ranking, and it affects conversion rate. The fix is straightforward — your homepage images are uncompressed (3.8MB). Converting to WebP format reduces load time by approximately 1.8 seconds and costs nothing.",
  "How do I fix my bounce rate?": "Your bounce rate is 53%, up from 31% last month. The AI traced this directly to a large uncompressed image added to the homepage on 28 June, which increased page load time from 2.4 to 4.2 seconds. Step 1: Compress all homepage images to WebP format (1 hour). Step 2: Move the CTA above the fold on mobile (30 minutes). These two actions are projected to bring mobile bounce back to 31–35% within 2 weeks.",
  "Why did my Google rankings drop?": "Four of your primary keywords dropped from positions 3–5 to 7–9 during June. The AI identified two causes: (1) A competitor published 6 new service pages in June specifically targeting your primary keywords, and (2) your Core Web Vitals score dropped to 'poor', which is a ranking factor. To recover: publish 3 targeted service pages within 4–6 weeks, fix page speed (which also helps rankings), and add internal links to your pricing page, which currently has only 1 internal link.",
  "What would double my leads?": "Doubling your leads (from 31 to 62/month) requires two changes: (1) Fix the contact form — reducing from 9 to 4 fields is projected to increase form completions from 3.1% to 8.4%, adding approximately 22 additional monthly leads at current traffic. (2) Recover SEO rankings — fixing speed + publishing content should restore organic traffic, adding the remaining volume needed. Combined, these two actions are the fastest path to 62+ monthly leads.",
  "How does my site compare to competitors?": "Based on available data, your competitors are outperforming you in three key areas: (1) Page speed — your main competitor loads in 1.8 seconds vs your 4.2 seconds. (2) Content volume — they published 6 new service pages in June; you have had no new content in 3 months. (3) Backlinks — your competitors average 47 referring domains; you have 14. Your strengths: security (88/100), accessibility (74/100), and your pricing page converts exceptionally well once visitors find it.",
  "What should I fix first?": "Fix the contact form first. It is the highest ROI action available: Easy difficulty, 30 minutes to implement, and projected to generate an additional £2,800/month. It requires no design changes — simply remove 5 non-essential fields. Second priority: compress homepage images (1 hour, £1,960/month recovery). Third priority: add pricing page to navigation (15 minutes, £3,200/month potential). All three can be done today for a combined projected impact of £7,960/month.",
  "How much revenue is my website losing?": "The AI estimates your website is currently underperforming by £5,740–£9,700 per month compared to its potential. Broken down: slow page speed costs approximately £1,960/month in mobile bounce, the broken contact form costs approximately £2,800/month in lost leads, weak CTAs and missing pricing navigation cost approximately £1,400–£3,200/month, and declining SEO is costing approximately £640/month in organic traffic. The total opportunity if all 6 recommended fixes are implemented is approximately £9,700/month.",
};

function WebsiteChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = (text: string) => {
    const userMsg = text.trim();
    if (!userMsg) return;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const response = chatResponses[userMsg] ??
        "The AI is analysing your website data to answer that question. Based on your current performance metrics, the most impactful action you can take today is to simplify your contact form (from 9 to 4 fields) and compress your homepage images. These two changes are projected to generate an additional £4,760/month within 30 days.";
      setMessages((prev) => [...prev, { role: "ai", content: response }]);
      setTyping(false);
    }, 900);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <MessageSquare className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Ask About Your Website</span>
        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-muted-foreground">AI Active</span>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="px-6 py-5">
          <p className="mb-3 text-[12.5px] font-medium text-muted-foreground">Suggested questions</p>
          <div className="flex flex-wrap gap-2">
            {websiteSuggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-[12.5px] text-foreground transition-colors hover:bg-secondary/70"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="max-h-80 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${m.role === "user" ? "bg-brand text-white" : "bg-secondary text-foreground"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      )}

      <div className="border-t border-border px-4 py-4">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your website performance…"
            className="flex-1 rounded-xl border border-border bg-secondary px-4 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/60 focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            <Send className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export function WebsiteDNA() {
  return (
    <div className="space-y-6">
      <WebsiteDNAHero />
      <AIExecutiveSummary />
      <WebsiteHealth />
      <AIDiscoveries />
      <WebsiteJourney />
      <ConversionIntelligence />
      <AIOpportunities />
      <div className="grid gap-6 lg:grid-cols-2">
        <SEODNA />
        <ContentIntelligence />
      </div>
      <HeatmapInsights />
      <AIPredictions />
      <WebsiteMissions />
      <BusinessDNAPreview />
      <div className="grid gap-6 lg:grid-cols-2">
        <AIMemorySection />
        <WebsiteImpact />
      </div>
      <ExecutiveReport />
      <WebsiteChat />
    </div>
  );
}
