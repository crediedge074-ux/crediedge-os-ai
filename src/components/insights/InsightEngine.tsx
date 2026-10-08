import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Activity, ArrowRight, Brain, CircleAlert, FileText, Lightbulb, Loader2, RefreshCw, ShieldAlert, TrendingUp } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { fetchIntelligenceSnapshot, dateLabel, type IntelligenceSnapshot } from "@/services/intelligence";
import { InsufficientData } from "@/components/ui/InsufficientData";

const panel = "rounded-2xl border border-border bg-card shadow-card";
const muted = "text-muted-foreground";

function SectionTitle({ icon: Icon, title, detail }: { icon: typeof Brain; title: string; detail?: string }) {
  return <div className="flex items-center gap-2 border-b border-border px-5 py-3.5"><Icon className="h-4 w-4 text-brand" /><span className="text-[13.5px] font-semibold text-foreground">{title}</span>{detail && <span className={`ml-auto text-[10.5px] ${muted}`}>{detail}</span>}</div>;
}

function Evidence({ items }: { items: string[] }) {
  return <ul className={`mt-2 space-y-1 text-[10.5px] ${muted}`}>{items.map((item) => <li key={item} className="flex gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand" />{item}</li>)}</ul>;
}

function SnapshotSummary({ snapshot }: { snapshot: IntelligenceSnapshot }) {
  const score = snapshot.score.hasSufficientData ? `${snapshot.score.overallScore}/100` : "INSUFFICIENT DATA";
  return <div className="overflow-hidden rounded-2xl bg-foreground text-background shadow-card"><div className="border-b border-background/10 px-6 py-6 sm:px-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-background/60"><Brain className="h-4 w-4 text-brand" />Evidence-led insights</div><h2 className="mt-2 text-[25px] font-bold tracking-tight">What the connected data supports</h2><p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-background/65">Insights are calculated from the active workspace snapshot. Potential outcomes are not presented as achieved results.</p></div><div className="text-right"><div className="text-[10px] uppercase tracking-widest text-background/50">CrediEdge Score</div><div className="mt-1 text-[34px] font-bold">{score}</div></div></div></div><div className="grid grid-cols-2 divide-x divide-background/10 sm:grid-cols-4"><Stat label="Discoveries" value={snapshot.discoveries.length.toString()} /><Stat label="Risks" value={snapshot.risks.length.toString()} /><Stat label="Opportunities" value={snapshot.opportunities.length.toString()} /><Stat label="Analysed" value={dateLabel(snapshot.analyzedAt)} /></div></div>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="px-5 py-4"><div className="text-[10px] text-background/50">{label}</div><div className="mt-1 text-[15px] font-bold text-background">{value}</div></div>;
}

function DiscoverySection({ snapshot }: { snapshot: IntelligenceSnapshot }) {
  return <div className={panel}><SectionTitle icon={Lightbulb} title="Verified Discoveries" detail={snapshot.discoveries.length ? `${snapshot.discoveries.length} found` : "No qualifying discoveries"} />{snapshot.discoveries.length ? <div className="divide-y divide-border">{snapshot.discoveries.map((item) => <div key={item.id} className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><div className="text-[13px] font-semibold text-foreground">{item.title}</div><div className={`mt-1 text-[10.5px] ${muted}`}>{item.source} · {item.status}</div></div>{item.action && <Link to={item.action.route as "/"} className="inline-flex shrink-0 items-center gap-1 text-[10.5px] font-semibold text-brand">{item.action.label}<ArrowRight className="h-3 w-3" /></Link>}</div><p className={`mt-3 text-[12px] leading-relaxed ${muted}`}>{item.interpretation}</p><Evidence items={item.evidence} /></div>)}</div> : <div className="p-5"><InsufficientData description="No cross-module pattern is currently supported by verified workspace records." /></div>}</div>;
}

function ActionSection({ snapshot }: { snapshot: IntelligenceSnapshot }) {
  return <div className="grid gap-4 lg:grid-cols-2"><div className={panel}><SectionTitle icon={ShieldAlert} title="Risks" detail="Evidence-backed" />{snapshot.risks.length ? <div className="divide-y divide-border">{snapshot.risks.map((risk) => <div key={risk.id} className="p-4"><div className="flex items-start gap-3"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><div className="min-w-0"><div className="text-[12.5px] font-semibold text-foreground">{risk.title}</div><div className={`mt-1 text-[10.5px] ${muted}`}>{risk.severity} · {risk.source}</div><Evidence items={risk.evidence} /></div></div></div>)}</div> : <div className="p-5"><InsufficientData description="No current risk is supported by the connected records." /></div>}</div><div className={panel}><SectionTitle icon={TrendingUp} title="Opportunities" detail="Workflow actions only" />{snapshot.opportunities.length ? <div className="divide-y divide-border">{snapshot.opportunities.map((opportunity) => <div key={opportunity.id} className="p-4"><div className="text-[12.5px] font-semibold text-foreground">{opportunity.title}</div><p className={`mt-1 text-[11px] leading-relaxed ${muted}`}>{opportunity.explanation}</p><Evidence items={opportunity.evidence} />{opportunity.action && <Link to={opportunity.action.route as "/"} className="mt-3 inline-flex items-center gap-1 text-[10.5px] font-semibold text-brand">{opportunity.action.label}<ArrowRight className="h-3 w-3" /></Link>}</div>)}</div> : <div className="p-5"><InsufficientData description="No opportunity with sufficient evidence is currently available." /></div>}</div></div>;
}

function ActivitySection({ snapshot }: { snapshot: IntelligenceSnapshot }) {
  return <div className={panel}><SectionTitle icon={Activity} title="Business Activity Patterns" detail="Source records" /><div className="grid gap-3 p-5 sm:grid-cols-3"><Metric label="Revenue this period" value={snapshot.revenue.hasData ? snapshot.revenue.totalRevenue.value : "INSUFFICIENT DATA"} detail="Verified payments only" /><Metric label="Inbound awaiting reply" value={snapshot.communications.totalCommunications ? snapshot.communications.awaitingReply.toString() : "INSUFFICIENT DATA"} detail="Communications source" /><Metric label="Review average" value={snapshot.reviewMetrics.averageRating === null ? "INSUFFICIENT DATA" : `${snapshot.reviewMetrics.averageRating.toFixed(1)}/5`} detail="Submitted reviews" /></div></div>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-border p-4"><div className={`text-[10.5px] ${muted}`}>{label}</div><div className="mt-2 text-[18px] font-bold text-foreground">{value}</div><div className={`mt-1 text-[10px] ${muted}`}>{detail}</div></div>;
}

function TimelineSection({ snapshot }: { snapshot: IntelligenceSnapshot }) {
  const events = snapshot.timeline.slice(0, 8);
  return <div className={panel}><SectionTitle icon={FileText} title="Recent Evidence" detail={events.length ? `${events.length} latest events` : "No events"} />{events.length ? <div className="divide-y divide-border">{events.map((event) => <div key={event.id} className="flex items-start gap-3 px-5 py-3.5"><div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${event.tone === "negative" ? "bg-brand" : event.tone === "positive" ? "bg-emerald-500" : "bg-muted-foreground/50"}`} /><div className="min-w-0 flex-1"><div className="text-[12px] font-semibold text-foreground">{event.title}</div><div className={`mt-0.5 text-[10.5px] ${muted}`}>{event.detail}</div></div><div className={`shrink-0 text-[10px] ${muted}`}>{dateLabel(event.date)}</div></div>)}</div> : <div className="p-5"><InsufficientData description="No material business events are available in the current workspace." /></div>}</div>;
}

export function InsightEngine() {
  const { business } = useAuthContext();
  const [snapshot, setSnapshot] = useState<IntelligenceSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = useCallback(async () => {
    if (!business?.id) { setLoading(false); return; }
    setLoading(true); setError(false);
    try { setSnapshot(await fetchIntelligenceSnapshot(business.id, business.name)); } catch { setError(true); } finally { setLoading(false); }
  }, [business?.id, business?.name]);
  useEffect(() => { void load(); const refresh = () => void load(); window.addEventListener("intelligence:refresh", refresh); return () => window.removeEventListener("intelligence:refresh", refresh); }, [load]);
  if (loading && !snapshot) return <div className="grid min-h-[480px] place-items-center"><Loader2 className="h-7 w-7 animate-spin text-brand" /></div>;
  if (!business?.id || error || !snapshot) return <div className={panel}><InsufficientData description={business?.id ? "The connected workspace data could not be loaded. Try refreshing the analysis." : "A signed-in workspace is required to calculate Insights."} icon={CircleAlert} /></div>;
  return <div className="space-y-6"><SnapshotSummary snapshot={snapshot} /><DiscoverySection snapshot={snapshot} /><ActionSection snapshot={snapshot} /><ActivitySection snapshot={snapshot} /><TimelineSection snapshot={snapshot} /><div className="text-[10px] text-muted-foreground">Source data refreshed from the active workspace. No forecasts or outcomes are shown without sufficient evidence.</div></div>;
}
