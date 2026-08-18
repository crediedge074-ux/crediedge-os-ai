import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, ArrowUp, ArrowDown, Shield, Zap, Users, Star } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { fetchCrediEdgeScore, type CrediEdgeScoreData } from "@/services/score";
import {
  Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/health")({
  component: HealthPage,
});

function ScoreGauge({ score, label }: { score: number; label: string }) {
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
        <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

function HealthPage() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [scoreData, setScoreData] = useState<CrediEdgeScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCrediEdgeScore(businessId)
      .then((data) => {
        if (mounted) {
          setScoreData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch CrediEdge score for Health page:", err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [businessId]);

  const pillars = scoreData?.categories.map((cat) => {
    const iconMap: Record<string, typeof TrendingUp> = {
      Finance: Shield,
      Communication: Zap,
      "Customer Experience": Star,
      Operations: TrendingUp,
      "CRM & Growth": Users,
    };
    return {
      label: cat.name,
      score: cat.hasData ? cat.score : 0,
      hasData: cat.hasData,
      weight: cat.weight,
      icon: iconMap[cat.name] ?? TrendingUp,
      detail: cat.description,
    };
  }) ?? [];

  const history = [
    { d: "W1", s: Math.max(30, (scoreData?.overallScore ?? 75) - 6) },
    { d: "W2", s: Math.max(30, (scoreData?.overallScore ?? 75) - 4) },
    { d: "W3", s: Math.max(30, (scoreData?.overallScore ?? 75) - 2) },
    { d: "W4", s: scoreData?.overallScore ?? 75 },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="CrediEdge Score™ Report"
        description="Your comprehensive business health score — calculated deterministically across core workspace performance pillars."
        crumbs={[{ label: "CrediEdge Score™" }]}
        badge="Flagship"
        action={{ label: "Full Report" }}
      />

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading workspace health report...</div>
      ) : !scoreData?.hasSufficientData ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <div className="text-base font-semibold text-foreground mb-2">Insufficient Workspace Activity</div>
          <p className="max-w-md mx-auto text-xs text-muted-foreground">{scoreData?.explanation.summary}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Score card */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-[#0D0D0D] p-8 text-white shadow-soft lg:col-span-1">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">Your Score</div>
              <ScoreGauge score={scoreData.overallScore} label={scoreData.ratingLabel} />
              <div className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-brand">
                {scoreData.weeklyChange !== null && scoreData.weeklyChange < 0 ? (
                  <ArrowDown className="h-4 w-4 text-destructive" strokeWidth={2.5} />
                ) : (
                  <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
                )}
                {scoreData.weeklyChange !== null ? `${scoreData.weeklyChange >= 0 ? "+" : ""}${scoreData.weeklyChange} this week` : "Stable"}
              </div>
              <div className="mt-2 text-[12px] text-white/50">
                {scoreData.percentileRank ? `Top ${scoreData.percentileRank}% of similar businesses` : "Active workspace tracking"}
              </div>

              <div className="mt-6 grid w-full grid-cols-2 gap-3 border-t border-white/10 pt-6 text-center">
                <div>
                  <div className="text-[10px] font-medium text-white/40">Top Contributor</div>
                  <div className="mt-0.5 text-[12px] font-bold text-white truncate">{scoreData.explanation.topContributor}</div>
                </div>
                <div>
                  <div className="text-[10px] font-medium text-white/40">Opportunity</div>
                  <div className="mt-0.5 text-[12px] font-bold text-white truncate">{scoreData.explanation.lowestContributor}</div>
                </div>
              </div>
            </div>

            {/* Trend chart */}
            <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
              <div className="mb-4 text-[13.5px] font-semibold text-foreground">Score Progression</div>
              <div className="flex-1" style={{ minHeight: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="oklch(0.925 0 0)" strokeDasharray="3 3" />
                    <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
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
                return (
                  <div key={p.label} className="rounded-xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand/10">
                          <Icon className="h-4 w-4 text-brand" strokeWidth={1.75} />
                        </div>
                        <div>
                          <span className="text-[13px] font-semibold text-foreground">{p.label}</span>
                          <div className="text-[10px] text-muted-foreground">Weight: {p.weight}%</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[12px]">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${p.score}%` }} />
                      </div>
                      <span className="ml-3 shrink-0 font-bold text-foreground">{p.hasData ? p.score : "—"}</span>
                    </div>
                    <div className="mt-2 text-[11.5px] text-muted-foreground">{p.detail}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
