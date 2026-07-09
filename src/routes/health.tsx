import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, ArrowUp, ArrowDown, Shield, Zap, Users, Star, Globe } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { useEffect, useState } from "react";
import {
  Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/health")({
  component: HealthPage,
});

const history = [
  { d: "Jan", s: 64 }, { d: "Feb", s: 68 }, { d: "Mar", s: 70 },
  { d: "Apr", s: 74 }, { d: "May", s: 78 }, { d: "Jun", s: 84 },
];

const pillars = [
  { label: "Revenue Health", score: 88, icon: TrendingUp, change: +4, detail: "Revenue is trending above target" },
  { label: "Customer Satisfaction", score: 92, icon: Star, change: +2, detail: "4.8 avg rating · 84 reviews" },
  { label: "Online Presence", score: 74, icon: Globe, change: -2, detail: "Website speed needs attention" },
  { label: "Enquiry Management", score: 82, icon: Zap, change: +6, detail: "Response time improved 18%" },
  { label: "Customer Retention", score: 79, icon: Users, change: +3, detail: "72% of customers returned" },
  { label: "Financial Security", score: 85, icon: Shield, change: +1, detail: "Cash flow is healthy" },
];

function ScoreGauge({ score }: { score: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      let c = 0;
      const step = () => {
        c = Math.min(c + 1, score);
        setCurrent(c);
        if (c < score) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 200);
    return () => clearTimeout(t);
  }, [score]);

  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (current / 100) * circ;

  return (
    <div className="relative h-40 w-40">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} stroke="oklch(0.928 0 0)" strokeWidth="7" fill="none" />
        <circle
          cx="60" cy="60" r={r}
          stroke="#E31B23" strokeWidth="7" fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.02s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[36px] font-bold leading-none tracking-tight text-foreground">{current}</span>
        <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Excellent</span>
      </div>
    </div>
  );
}

function HealthPage() {
  return (
    <AppLayout>
      <PageHeader
        title="CrediEdge Score™"
        description="Your comprehensive business health score — updated daily across 6 core performance pillars."
        crumbs={[{ label: "CrediEdge Score™" }]}
        badge="Flagship"
        action={{ label: "Full Report" }}
        secondaryAction={{ label: "Share Score" }}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Score card */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-[#0D0D0D] p-8 text-white shadow-soft lg:col-span-1">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">Your Score</div>
          <ScoreGauge score={84} />
          <div className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-brand">
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
            +6 this week
          </div>
          <div className="mt-2 text-[12px] text-white/50">Top 12% of similar businesses</div>

          <div className="mt-6 grid w-full grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center">
            {[["Previous", "78"], ["This Month", "+6"], ["Benchmark", "71"]].map(([l, v]) => (
              <div key={l}>
                <div className="text-[10px] font-medium text-white/40">{l}</div>
                <div className="mt-0.5 text-[16px] font-bold text-white">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend chart */}
        <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <div className="mb-4 text-[13.5px] font-semibold text-foreground">Score History — 2025</div>
          <div className="flex-1" style={{ minHeight: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="oklch(0.925 0 0)" strokeDasharray="3 3" />
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.925 0 0)", fontSize: 12, padding: "6px 10px" }}
                  formatter={(v: number) => [v, "Score"]}
                />
                <Line
                  type="monotone" dataKey="s" stroke="#E31B23" strokeWidth={2.5}
                  dot={{ r: 4, fill: "#E31B23", stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="mt-5">
        <h2 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">Score Breakdown</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pillars.map((p) => {
            const Icon = p.icon;
            const up = p.change >= 0;
            return (
              <div key={p.label} className="rounded-xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand/10">
                      <Icon className="h-4 w-4 text-brand" strokeWidth={1.75} />
                    </div>
                    <span className="text-[13px] font-semibold text-foreground">{p.label}</span>
                  </div>
                  <div className={`flex items-center gap-0.5 text-[11.5px] font-semibold ${up ? "text-brand" : "text-destructive"}`}>
                    {up ? <ArrowUp className="h-3 w-3" strokeWidth={2.5} /> : <ArrowDown className="h-3 w-3" strokeWidth={2.5} />}
                    {Math.abs(p.change)}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[12px]">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${p.score}%` }} />
                  </div>
                  <span className="ml-3 shrink-0 font-bold text-foreground">{p.score}</span>
                </div>
                <div className="mt-2 text-[11.5px] text-muted-foreground">{p.detail}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
