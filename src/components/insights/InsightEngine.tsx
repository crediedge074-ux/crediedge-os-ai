import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles, TrendingUp, TrendingDown, ChevronDown, ChevronRight,
  ArrowRight, Lightbulb, Zap, Shield, Brain, Target,
  CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle,
  RefreshCw, Send, Award, Clock, Activity, FlaskConical,
  ArrowUp, ArrowDown, Minus, Users, Globe, MessageSquare,
  CircleDollarSign, Cpu, GitBranch,
} from "lucide-react";
import {
  discoveries, patterns, correlations, hiddenOpportunities, hiddenRisks,
  experiments, whatChanged, industryBenchmarks, memoryItems,
  insightHistory, impactMetrics, feedItems, dnaContributions,
} from "./mockData";

// ─── Shared Primitives ────────────────────────────────────────────────────────

function AnimatedNumber({
  value, prefix = "", suffix = "", duration = 1300,
}: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setDisplay((1 - Math.pow(1 - p, 3)) * value);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);
  return <span ref={ref}>{prefix}{Math.round(display).toLocaleString()}{suffix}</span>;
}

function ConfidenceBar({ value, color = "#E31B23" }: { value: number; color?: string }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setW(value), 80); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="h-1 w-full rounded-full bg-secondary">
      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${w}%`, backgroundColor: color }} />
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card shadow-card ${className}`}>{children}</div>;
}

function SectionHead({ icon: Icon, title, count, color = "text-muted-foreground" }: { icon: React.ElementType; title: string; count?: number; color?: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
      <Icon className={`h-4.5 w-4.5 ${color}`} strokeWidth={1.75} />
      <span className="text-[14px] font-semibold text-foreground">{title}</span>
      {count != null && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{count}</span>
      )}
    </div>
  );
}

function DifficultyBadge({ d }: { d: string }) {
  const c = d === "Easy" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : d === "Medium" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-red-700 bg-red-50 border-red-200";
  return <span className={`rounded border px-1.5 py-0.5 text-[10.5px] font-semibold ${c}`}>{d}</span>;
}

// ─── Section 1: Insight Engine™ Hero ─────────────────────────────────────────

function InsightEngineHero() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const dataSources = [
    "Customers", "Revenue", "Bookings", "Reviews",
    "Communications", "Website", "Marketing", "Operations",
    "Finance", "Tasks", "Campaigns", "Missions",
  ];

  const handleGenerate = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setDone(true); }, 2000);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-foreground text-background shadow-card">
      <div className="border-b border-background/10 px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Brain className="h-5 w-5 text-[#f59e0b]" strokeWidth={1.75} />
              <span className="text-[13px] font-semibold uppercase tracking-widest text-background/60">Insight Engine™</span>
            </div>
            <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-background sm:text-[32px]">
              Your Business Just Taught You Something
            </h1>
            <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-background/60">
              The AI has analysed every corner of your business and discovered patterns, opportunities, and risks you would never have spotted manually.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-background/50">Discoveries</div>
              <div className="text-[42px] font-bold leading-none text-background">14</div>
              <div className="text-[11px] text-background/50">this month</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-background/10 px-6 py-4 sm:px-8">
        <div className="mb-3 text-[11.5px] font-semibold uppercase tracking-wider text-background/50">
          {done ? "Analysis Complete — Based on:" : "AI has analysed your:"}
        </div>
        <div className="flex flex-wrap gap-2">
          {dataSources.map((s, i) => (
            <span
              key={s}
              className={`rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-all duration-300 ${done ? "border-background/20 text-background/80" : "border-background/10 text-background/40"}`}
              style={{ transitionDelay: done ? `${i * 60}ms` : "0ms" }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-background/10 px-0">
        <div className="flex flex-col gap-1 px-6 py-5">
          <span className="text-[11px] font-medium text-background/50">Revenue Opportunity</span>
          <span className="text-[28px] font-bold text-background"><AnimatedNumber value={18400} prefix="£" /></span>
          <span className="text-[11px] text-background/50">identified this month</span>
        </div>
        <div className="flex flex-col gap-1 px-6 py-5">
          <span className="text-[11px] font-medium text-background/50">Business Confidence</span>
          <span className="text-[28px] font-bold text-background"><AnimatedNumber value={96} suffix="%" /></span>
          <span className="text-[11px] text-background/50">in all discoveries</span>
        </div>
        <div className="flex flex-col gap-1 px-6 py-5">
          <span className="text-[11px] font-medium text-background/50">New This Week</span>
          <span className="text-[28px] font-bold text-background"><AnimatedNumber value={3} /></span>
          <span className="text-[11px] text-background/50">fresh discoveries</span>
        </div>
      </div>

      <div className="border-t border-background/10 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={running}
            className="flex items-center gap-2 rounded-xl border border-background/20 px-4 py-2.5 text-[13px] font-semibold text-background/80 transition-colors hover:bg-background/10 disabled:opacity-60"
          >
            {running ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#f59e0b]" strokeWidth={1.75} />}
            {running ? "Analysing…" : done ? "Re-analyse Business" : "Generate Discoveries"}
          </button>
          {done && (
            <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-400">
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
              Analysis complete — 14 discoveries found
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section 2: Top Discoveries ───────────────────────────────────────────────

function DiscoveryCard({ d }: { d: typeof discoveries[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft transition-all hover:border-foreground/10 hover:shadow-card">
      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-start gap-2">
          {d.isNew && (
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-brand">New</span>
          )}
          <span className="rounded-full border px-2 py-0.5 text-[10.5px] font-semibold" style={{ borderColor: `${d.moduleColor}30`, backgroundColor: `${d.moduleColor}10`, color: d.moduleColor }}>
            {d.module}
          </span>
          <span className={`ml-auto rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${d.impactType === "positive" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
            {d.businessImpact}
          </span>
        </div>

        <h3 className="text-[14px] font-semibold leading-snug text-foreground">{d.title}</h3>

        <div className="mt-3 space-y-2">
          <div>
            <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Evidence</div>
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">{d.evidence}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Confidence</span>
              <span className="text-[11px] font-bold text-foreground">{d.confidence}%</span>
            </div>
            <ConfidenceBar value={d.confidence} color={d.moduleColor} />
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-center">
            <div className="text-[10px] font-medium text-emerald-600">Opportunity</div>
            <div className="text-[13px] font-bold text-emerald-700">{d.revenueOpportunity}</div>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">How the AI Discovered This</div>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{d.explanation}</p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand">Recommended Action</div>
              <p className="text-[13px] leading-relaxed text-foreground">{d.recommendedAction}</p>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button className="rounded-lg bg-brand px-3.5 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-80">
            Create Mission
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary/70"
          >
            {expanded ? "Hide" : "Explain Discovery"}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TopDiscoveries() {
  return (
    <SectionCard>
      <SectionHead icon={Lightbulb} title="Top Discoveries" count={discoveries.length} color="text-[#f59e0b]" />
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        {discoveries.map((d) => <DiscoveryCard key={d.id} d={d} />)}
      </div>
    </SectionCard>
  );
}

// ─── Section 3: Pattern Detection ────────────────────────────────────────────

function PatternDetection() {
  const strengthColor = (s: string) =>
    s === "strong" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
    s === "moderate" ? "text-amber-700 bg-amber-50 border-amber-200" :
    "text-blue-700 bg-blue-50 border-blue-200";

  return (
    <SectionCard>
      <SectionHead icon={Activity} title="Pattern Detection" count={patterns.length} />
      <div className="divide-y divide-border">
        {patterns.map((p) => (
          <div key={p.id} className="px-6 py-5">
            <div className="flex flex-wrap items-start gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                  <h3 className="text-[13.5px] font-semibold text-foreground">{p.title}</h3>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{p.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded border px-1.5 py-0.5 text-[10.5px] font-semibold capitalize ${strengthColor(p.strength)}`}>{p.strength} pattern</span>
                  <span className="text-[11px] text-muted-foreground">{p.dataPoints}</span>
                  <span className="text-[11px] font-semibold text-muted-foreground">{p.confidence}% confidence</span>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 px-3 py-2 text-right">
                <div className="text-[10px] font-medium text-muted-foreground">Impact</div>
                <div className="text-[12px] font-semibold text-foreground">{p.impact}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Section 4: Correlations ──────────────────────────────────────────────────

function Correlations() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SectionCard>
      <SectionHead icon={GitBranch} title="Correlations" count={correlations.length} />
      <div className="divide-y divide-border">
        {correlations.map((c) => {
          const open = expanded === c.id;
          return (
            <button
              key={c.id}
              className="w-full px-6 py-4 text-left transition-colors hover:bg-secondary/30"
              onClick={() => setExpanded(open ? null : c.id)}
            >
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-foreground">{c.factorA}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-[13px] font-semibold text-foreground">{c.factorB}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted-foreground">{c.businessImpact}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-2">
                      <span className="text-[10.5px] text-muted-foreground">Strength</span>
                      <div className="h-1.5 flex-1 rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${c.strength}%` }} />
                      </div>
                      <span className="text-[11px] font-semibold text-foreground">{c.strength}%</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{c.confidence}% confidence</span>
                  </div>
                </div>
                <div className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-right">
                  <div className="text-[10px] text-emerald-600">Revenue Effect</div>
                  <div className="text-[12px] font-bold text-emerald-700">{c.revenueEffect}</div>
                </div>
              </div>
              {open && (
                <div className="mt-3 rounded-xl border border-border bg-secondary/20 p-3 text-left">
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{c.explanation}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ─── Section 5: Hidden Opportunities ─────────────────────────────────────────

function HiddenOpportunities() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SectionCard>
      <SectionHead icon={Target} title="Hidden Opportunities" count={hiddenOpportunities.length} color="text-[#f59e0b]" />
      <ul className="divide-y divide-border">
        {hiddenOpportunities.map((op, i) => {
          const open = expanded === op.id;
          return (
            <li key={op.id} className="px-6 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">{i + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-semibold text-foreground">{op.title}</div>
                      <p className="mt-1 text-[12px] text-muted-foreground">{op.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">{op.estimatedValue}</span>
                        <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700">ROI {op.roi}</span>
                        <DifficultyBadge d={op.difficulty} />
                        <span className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground">{op.timeRequired}</span>
                        <span className="text-[11px] text-muted-foreground">{op.confidence}% confidence</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button className="rounded-lg bg-brand px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-80">Create Mission</button>
                      <button onClick={() => setExpanded(open ? null : op.id)} className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary">
                        {open ? "Hide" : "Explain"}
                      </button>
                    </div>
                  </div>
                  {open && (
                    <div className="mt-3 rounded-xl border border-border bg-secondary/20 p-3">
                      <p className="text-[13px] leading-relaxed text-muted-foreground">{op.reasoning}</p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

// ─── Section 6: Hidden Risks ──────────────────────────────────────────────────

function HiddenRisks() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const urgencyConfig = {
    critical: { color: "text-red-700 bg-red-50 border-red-200", dot: "bg-red-500" },
    high: { color: "text-orange-700 bg-orange-50 border-orange-200", dot: "bg-orange-500" },
    medium: { color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
    low: { color: "text-muted-foreground bg-secondary border-border", dot: "bg-muted-foreground/40" },
  };
  const trendColor = { worsening: "text-red-600", stable: "text-muted-foreground", improving: "text-emerald-600" };

  return (
    <SectionCard>
      <SectionHead icon={AlertTriangle} title="Hidden Risks" count={hiddenRisks.length} color="text-amber-500" />
      <ul className="divide-y divide-border">
        {hiddenRisks.map((r) => {
          const cfg = urgencyConfig[r.urgency];
          const open = expanded === r.id;
          return (
            <li key={r.id}>
              <button className="w-full px-6 py-4 text-left transition-colors hover:bg-secondary/30" onClick={() => setExpanded(open ? null : r.id)}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-[13.5px] font-semibold text-foreground">{r.title}</div>
                        <p className="mt-1 text-[12px] text-muted-foreground">{r.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={`rounded border px-1.5 py-0.5 text-[10.5px] font-semibold capitalize ${cfg.color}`}>{r.urgency}</span>
                          <span className="text-[11px] text-muted-foreground">{r.probability}% probability</span>
                          <span className={`text-[11px] font-medium capitalize ${trendColor[r.trend]}`}>{r.trend}</span>
                          <span className="text-[11px] text-muted-foreground">{r.confidence}% confidence</span>
                        </div>
                      </div>
                      <div className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-right">
                        <div className="text-[10px] text-red-600">Financial Impact</div>
                        <div className="text-[12px] font-bold text-red-700">{r.financialImpact}</div>
                      </div>
                    </div>
                  </div>
                </div>
                {open && (
                  <div className="ml-5 mt-3 rounded-xl border border-brand/20 bg-brand/5 p-3">
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand">Suggested Solution</div>
                    <p className="text-[13px] leading-relaxed text-foreground">{r.suggestedSolution}</p>
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

// ─── Section 7: AI Experiments ────────────────────────────────────────────────

function AIExperiments() {
  const statusConfig = {
    ready: { color: "text-blue-700 bg-blue-50 border-blue-200", label: "Ready to Launch" },
    running: { color: "text-emerald-700 bg-emerald-50 border-emerald-200", label: "Running" },
    completed: { color: "text-muted-foreground bg-secondary border-border", label: "Completed" },
  };

  return (
    <SectionCard>
      <SectionHead icon={FlaskConical} title="AI Experiments" count={experiments.length} />
      <div className="divide-y divide-border">
        {experiments.map((ex) => {
          const cfg = statusConfig[ex.status];
          return (
            <div key={ex.id} className="px-6 py-5">
              <div className="mb-3 flex flex-wrap items-start gap-2">
                <span className={`rounded border px-1.5 py-0.5 text-[10.5px] font-semibold ${cfg.color}`}>{cfg.label}</span>
                <DifficultyBadge d={ex.difficulty} />
                <span className="text-[11px] text-muted-foreground">{ex.duration}</span>
                <span className="ml-auto text-[11px] font-semibold text-muted-foreground">{ex.confidence}% confidence</span>
              </div>
              <h3 className="text-[13.5px] font-semibold text-foreground">{ex.hypothesis}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{ex.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-border bg-secondary/20 p-3 sm:grid-cols-3">
                <div>
                  <div className="text-[10px] font-medium text-muted-foreground">Expected Outcome</div>
                  <div className="mt-0.5 text-[12px] font-medium text-foreground">{ex.expectedOutcome.split(".")[0]}</div>
                </div>
                <div>
                  <div className="text-[10px] font-medium text-muted-foreground">Revenue Estimate</div>
                  <div className="mt-0.5 text-[12px] font-bold text-emerald-600">{ex.estimatedRevenue}</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-medium text-muted-foreground">Success Criteria</div>
                  <div className="mt-0.5 text-[12px] text-foreground">{ex.successCriteria}</div>
                </div>
              </div>
              <div className="mt-3">
                {ex.status === "ready" ? (
                  <button className="rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-80">
                    Launch Experiment
                  </button>
                ) : ex.status === "running" ? (
                  <div className="flex items-center gap-2 text-[12.5px] font-medium text-emerald-600">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    Experiment running — monitoring results
                  </div>
                ) : (
                  <button className="rounded-xl border border-border bg-secondary px-4 py-2 text-[12.5px] font-medium text-muted-foreground">
                    View Results
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ─── Section 8: What Changed ──────────────────────────────────────────────────

function WhatChangedSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const dirIcon = (d: string) =>
    d === "up" ? <ArrowUp className="h-4 w-4 text-emerald-500" /> :
    d === "down" ? <ArrowDown className="h-4 w-4 text-red-500" /> :
    <Minus className="h-4 w-4 text-muted-foreground" />;

  return (
    <SectionCard>
      <SectionHead icon={TrendingUp} title="What Changed?" count={whatChanged.length} />
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {whatChanged.map((wc) => {
          const open = expanded === wc.id;
          return (
            <button
              key={wc.id}
              className="flex flex-col gap-2 bg-card px-5 py-4 text-left transition-colors hover:bg-secondary/30"
              onClick={() => setExpanded(open ? null : wc.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-medium text-muted-foreground">{wc.metric}</span>
                {dirIcon(wc.direction)}
              </div>
              <div className="flex items-end gap-2">
                <span className="text-[20px] font-bold text-foreground">{wc.value}</span>
                <span className={`mb-0.5 text-[12px] font-semibold ${wc.direction === "up" ? "text-emerald-600" : wc.direction === "down" ? "text-red-500" : "text-muted-foreground"}`}>
                  {wc.change}
                </span>
              </div>
              <span className="text-[10.5px] text-muted-foreground/60">{wc.period}</span>
              {open && (
                <p className="mt-1 rounded-lg bg-secondary/50 p-2.5 text-[12px] leading-relaxed text-muted-foreground">
                  {wc.explanation}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ─── Section 9: Industry Insights ────────────────────────────────────────────

function IndustryInsights() {
  return (
    <SectionCard>
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Globe className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[14px] font-semibold text-foreground">Industry Insights</span>
        </div>
        <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">Anonymous Benchmarks</span>
      </div>
      <div className="divide-y divide-border">
        {industryBenchmarks.map((b) => (
          <div key={b.id} className="px-6 py-5">
            <p className="text-[13.5px] font-semibold text-foreground">{b.insight}</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-secondary/20 p-3">
                <div className="text-[10px] font-medium text-muted-foreground">Benchmark</div>
                <div className="mt-0.5 text-[12px] font-semibold text-foreground">{b.benchmark}</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/20 p-3">
                <div className="text-[10px] font-medium text-muted-foreground">Your Position</div>
                <div className="mt-0.5 text-[12px] font-semibold text-foreground">{b.yourPosition}</div>
              </div>
              <div className="rounded-xl border border-brand/20 bg-brand/5 p-3">
                <div className="text-[10px] font-medium text-brand">Opportunity</div>
                <div className="mt-0.5 text-[12px] font-semibold text-foreground">{b.opportunity}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Section 10: AI Memory ────────────────────────────────────────────────────

function AIMemorySection() {
  return (
    <SectionCard>
      <SectionHead icon={Cpu} title="AI Memory" />
      <ul className="divide-y divide-border">
        {memoryItems.map((m) => (
          <li key={m.id} className="flex items-start gap-4 px-6 py-4">
            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-relaxed text-foreground">{m.insight}</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground">{m.learnedFrom}</span>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground">{m.category}</span>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground">{m.discoveredAt}</span>
                <span className="text-[10.5px] font-semibold text-emerald-600">{m.confidence}% confidence</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

// ─── Section 11: Insight History ──────────────────────────────────────────────

function InsightHistorySection() {
  return (
    <SectionCard>
      <SectionHead icon={Clock} title="Insight History" />
      <div className="px-6 py-5">
        <div className="relative space-y-0">
          {insightHistory.map((entry, i) => (
            <div key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-background" style={{ backgroundColor: entry.moduleColor }} />
                {i < insightHistory.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11.5px] font-medium text-muted-foreground">{entry.date}</span>
                  <span className="rounded-full border px-1.5 py-0.5 text-[10px] font-semibold" style={{ borderColor: `${entry.moduleColor}30`, color: entry.moduleColor, backgroundColor: `${entry.moduleColor}10` }}>
                    {entry.module}
                  </span>
                  <span className="ml-auto text-[11.5px] font-semibold text-emerald-600">{entry.impact}</span>
                </div>
                <p className="mt-0.5 text-[13px] font-semibold text-foreground">{entry.title}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{entry.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Section 12: Action Centre ────────────────────────────────────────────────

function ActionCentre() {
  const actions = [
    { label: "Create Campaign", icon: Target, description: "Turn a discovery into a full marketing campaign" },
    { label: "Create Mission", icon: Zap, description: "Launch a structured improvement mission" },
    { label: "Create Task", icon: CheckCircle2, description: "Add a quick action to your task list" },
    { label: "Contact Customers", icon: MessageSquare, description: "Reach out to a customer segment" },
    { label: "Launch Website Fix", icon: Globe, description: "Start a website improvement mission" },
    { label: "Launch Review Campaign", icon: Award, description: "Boost your review volume and score" },
    { label: "Start AI Experiment", icon: FlaskConical, description: "Test a hypothesis with measurable outcomes" },
    { label: "View All Opportunities", icon: TrendingUp, description: "Review every identified revenue opportunity" },
  ];

  return (
    <SectionCard>
      <SectionHead icon={Zap} title="Action Centre" color="text-[#f59e0b]" />
      <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-4">
        {actions.map(({ label, icon: Icon, description }) => (
          <button
            key={label}
            className="flex flex-col gap-2.5 rounded-xl border border-border bg-secondary/20 p-4 text-left transition-all hover:border-brand/30 hover:bg-brand/5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card">
              <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[12.5px] font-semibold text-foreground">{label}</div>
              <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{description}</div>
            </div>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Section 13: Business DNA™ ────────────────────────────────────────────────

function BusinessDNAWidget() {
  const maxDiscoveries = Math.max(...dnaContributions.map((d) => d.discoveries));

  return (
    <SectionCard>
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Brain className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Business DNA™ — Source of Discoveries</span>
        <Link to="/intelligence" className="ml-auto flex items-center gap-1 text-[12px] text-brand hover:opacity-70">
          View Intelligence <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="p-6">
        <p className="mb-4 text-[13px] text-muted-foreground">Every discovery originates from a Business DNA™ module. The more data a module has, the more discoveries it generates.</p>
        <div className="space-y-3">
          {dnaContributions.map((d) => (
            <Link key={d.module} to={d.route} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary/30">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${d.color}15`, border: `1px solid ${d.color}25` }}>
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-foreground">{d.module}</span>
                  <span className="text-[12px] font-bold text-foreground">{d.discoveries} discoveries</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary">
                  <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${(d.discoveries / maxDiscoveries) * 100}%`, backgroundColor: d.color }} />
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Section 14: Insight Impact ───────────────────────────────────────────────

function InsightImpact() {
  return (
    <SectionCard>
      <SectionHead icon={Award} title="Insight Impact" />
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {impactMetrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-1.5 bg-card px-4 py-5">
            <div className="text-[11px] font-medium text-muted-foreground">{m.label}</div>
            <div className="text-[24px] font-bold tracking-tight" style={{ color: m.color }}>
              <AnimatedNumber value={m.value} prefix={m.prefix ?? ""} suffix={m.suffix ?? ""} />
            </div>
            <div className="text-[11.5px] text-muted-foreground">{m.description}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Section 15: Discovery Feed ───────────────────────────────────────────────

function DiscoveryFeed() {
  return (
    <SectionCard>
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[14px] font-semibold text-foreground">Discovery Feed</span>
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-muted-foreground">Live</span>
          </div>
        </div>
        <span className="text-[12px] text-muted-foreground">Newest first</span>
      </div>
      <ul className="divide-y divide-border">
        {feedItems.map((item) => (
          <li key={item.id} className="px-6 py-4 transition-colors hover:bg-secondary/20">
            <div className="flex items-start gap-3">
              <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.impactType === "positive" ? "bg-emerald-500" : item.impactType === "negative" ? "bg-red-500" : "bg-muted-foreground/40"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {item.isNew && <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-brand">New</span>}
                  <span className="text-[11px] text-muted-foreground">{item.timestamp}</span>
                  <span className="rounded-full border px-1.5 py-0.5 text-[10px] font-semibold" style={{ borderColor: `${item.moduleColor}30`, color: item.moduleColor, backgroundColor: `${item.moduleColor}10` }}>
                    {item.module}
                  </span>
                  <span className="ml-auto text-[11px] font-semibold text-muted-foreground">{item.confidence}% confidence</span>
                </div>
                <p className="mt-1 text-[13px] font-semibold text-foreground">{item.title}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{item.summary}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export function InsightEngine() {
  return (
    <div className="space-y-6">
      <InsightEngineHero />
      <TopDiscoveries />
      <div className="grid gap-6 lg:grid-cols-2">
        <PatternDetection />
        <Correlations />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <HiddenOpportunities />
        <HiddenRisks />
      </div>
      <AIExperiments />
      <WhatChangedSection />
      <IndustryInsights />
      <div className="grid gap-6 lg:grid-cols-2">
        <AIMemorySection />
        <InsightHistorySection />
      </div>
      <ActionCentre />
      <BusinessDNAWidget />
      <InsightImpact />
      <DiscoveryFeed />
    </div>
  );
}
