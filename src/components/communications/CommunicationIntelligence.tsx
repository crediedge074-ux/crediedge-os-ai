import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Globe,
  Instagram,
  Lightbulb,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  Mic,
  Phone,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  fetchCommunicationDNA,
  fetchCommunicationScore,
  fetchCommunicationsAnalytics,
  fetchCommunicationsMetrics,
  fetchCustomerTimeline,
  fetchPriorityRecommendation,
  fetchAwaitingReply,
  resolveCommunication,
  type AnalyticsMetric,
  type AwaitingReplyItem,
  type CommunicationDNA,
  type CommunicationScore,
  type CommunicationsAnalytics,
  type CommunicationsMetrics,
  type TimelineEvent,
} from "@/services/communications";
import { authorizeAndLogAIRequest } from "@/services/aiUsage";
import { appEvents, APP_EVENTS } from "@/lib/events";

const channelIcons: Record<string, React.ElementType> = {
  email: Mail,
  whatsapp: MessageCircle,
  sms: MessageSquare,
  phone: Phone,
  "web chat": Globe,
  instagram: Instagram,
  voicemail: Mic,
};

const channelStyles: Record<string, string> = {
  email: "bg-blue-50 text-blue-600",
  whatsapp: "bg-emerald-50 text-emerald-600",
  sms: "bg-violet-50 text-violet-600",
  phone: "bg-amber-50 text-amber-600",
  "web chat": "bg-cyan-50 text-cyan-600",
  instagram: "bg-pink-50 text-pink-600",
  voicemail: "bg-rose-50 text-rose-600",
};

function formatNumber(value: number | null, suffix = ""): string {
  return value === null ? "—" : `${value.toLocaleString()}${suffix}`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatMetric(metric: AnalyticsMetric): string {
  if (metric.value === null) return "—";
  if (metric.unit === "currency") return `£${metric.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  return `${metric.value.toLocaleString()}${metric.unit === "minutes" ? "m" : metric.unit === "hours" ? "h" : metric.unit === "%" ? "%" : ""}`;
}

function DataState({ children = "Insufficient data — not enough evidence to calculate" }: { children?: string }) {
  return <div className="rounded-lg border border-dashed border-border bg-secondary/30 px-3 py-2 text-[11px] font-medium text-muted-foreground">{children}</div>;
}

function ScoreRing({ score }: { score: number | null }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = score === null ? circumference : circumference - (score / 100) * circumference;
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className={score === null ? "text-muted-foreground/30" : "text-brand"} style={{ transition: "stroke-dashoffset 700ms ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{score ?? "—"}</span>
        <span className="text-[10px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number | null }) {
  return <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${value ?? 0}%` }} /></div>;
}

function Hero({ metrics }: { metrics: CommunicationsMetrics }) {
  const cards = [
    ["Unread Messages", formatNumber(metrics.unreadMessages), MessageSquare],
    ["Awaiting Reply", formatNumber(metrics.awaitingReply), Clock3],
    ["Avg Response", formatNumber(metrics.avgResponseTimeMinutes, "m"), TrendingUp],
    ["Priority Score", formatNumber(metrics.aiPriorityScore), Brain],
    ["Satisfaction", formatNumber(metrics.satisfactionPct, "%"), Star],
    ["Missed Opps", formatNumber(metrics.missedOpportunities), AlertTriangle],
  ] as const;
  return (
    <section className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
      <div className="relative">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"><Sparkles className="h-3 w-3 text-brand" /> Communication Intelligence</div>
            <h2 className="text-[22px] font-bold tracking-tight">Every conversation. One intelligent workspace.</h2>
            <p className="mt-1 text-[12px] text-background/60">Verified records and calculated signals are shown separately from AI assistance.</p>
          </div>
          <div className="flex items-center gap-2 text-[10.5px] font-semibold text-background/75">
            <span className={`h-2 w-2 rounded-full ${metrics.liveMonitoring ? "animate-pulse bg-emerald-400" : "bg-background/30"}`} />
            {metrics.liveMonitoring ? "Live monitoring" : "No live sync"} · {metrics.connectedChannels} connected
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {cards.map(([label, value, Icon]) => <div key={label} className="rounded-xl bg-background/10 p-3"><div className="flex items-center gap-1.5 text-[9.5px] text-background/55"><Icon className="h-3 w-3" />{label}</div><div className="mt-1.5 text-[19px] font-bold">{value}</div></div>)}
        </div>
        {!metrics.hasSufficientData && <div className="mt-4 rounded-xl bg-background/10 px-3 py-2 text-[11px] text-background/65">No communication records found yet. Verified metrics will appear as activity is recorded.</div>}
      </div>
    </section>
  );
}

function PriorityCard({ recommendation, onOpen }: { recommendation: AwaitingReplyItem | null; onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  if (!recommendation) return <section className="rounded-2xl border border-dashed border-border bg-card p-5 shadow-card"><div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"><Brain className="h-4 w-4" /> Evidence-based priority</div><p className="mt-2 text-[12.5px] text-muted-foreground">No unresolved inbound conversation is currently awaiting reply.</p></section>;
  return <section className="rounded-2xl border border-brand/20 bg-brand/5 p-5 shadow-card"><div className="flex items-center gap-2"><Brain className="h-4 w-4 text-brand" /><span className="text-[11px] font-semibold uppercase tracking-wider text-brand">Evidence-based priority</span><span className="ml-auto rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">CALCULATED</span></div><p className="mt-3 text-[13px] leading-relaxed text-foreground">Reply to <strong>{recommendation.customer_name || "this customer"}</strong> first. This is the longest-waiting unresolved inbound conversation.</p><div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground"><span className="rounded-lg border border-border bg-card px-3 py-2">Waiting <strong className="text-brand">{Math.round(recommendation.waiting_hours)}h</strong></span><span className="rounded-lg border border-border bg-card px-3 py-2 capitalize">Via <strong className="text-foreground">{recommendation.channel}</strong></span><button onClick={onOpen} className="rounded-lg bg-brand px-3 py-2 font-semibold text-white">Open Conversation</button><button onClick={() => setOpen(!open)} className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 font-semibold text-foreground">Explain Why <ChevronDown className={`h-3 w-3 ${open ? "rotate-180" : ""}`} /></button></div>{open && <div className="mt-3 rounded-xl border border-brand/15 bg-card p-3"><div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-brand">Verified evidence</div><ul className="space-y-1 text-[11px] text-muted-foreground">{recommendation.evidence.map((evidence) => <li key={evidence} className="flex gap-2"><span className="text-brand">•</span>{evidence}</li>)}</ul><p className="mt-2 text-[10.5px] text-muted-foreground">This is a deterministic calculation from communication timestamps and resolution state, not an LLM-generated fact.</p></div>}</section>;
}

function Queue({ items, selected, onSelect }: { items: AwaitingReplyItem[]; selected: string | null; onSelect: (item: AwaitingReplyItem) => void }) {
  return <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"><div className="flex items-center gap-2 border-b border-border px-4 py-3"><span className="text-[12px] font-semibold">Priority Queue</span><span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">{items.length}</span><span className="ml-auto text-[10px] text-muted-foreground">Longest wait first</span></div>{items.length === 0 ? <div className="px-4 py-12 text-center text-[11.5px] text-muted-foreground">No conversations awaiting reply.</div> : <ul className="max-h-[640px] divide-y divide-border overflow-y-auto">{items.map((item) => { const Icon = channelIcons[item.channel.toLowerCase()] || MessageSquare; const active = item.id === selected; return <li key={item.id}><button onClick={() => onSelect(item)} className={`w-full px-4 py-3 text-left transition-colors ${active ? "border-l-2 border-brand bg-brand/5" : "border-l-2 border-transparent hover:bg-secondary/40"}`}><div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">{(item.customer_name || "?").split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><span className="truncate text-[12.5px] font-semibold">{item.customer_name || "Unknown customer"}</span><span className="shrink-0 text-[10px] text-muted-foreground">{Math.round(item.waiting_hours)}h</span></div><div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground"><Icon className="h-3 w-3" /> <span className="truncate">{item.subject || item.body || "No message content"}</span></div><div className="mt-1.5 flex items-center gap-1.5"><span className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${item.waiting_hours > 24 ? "bg-destructive/10 text-destructive" : "bg-brand/10 text-brand"}`}>{item.waiting_hours > 24 ? "Overdue" : "Awaiting reply"}</span><span className={`rounded-md px-1.5 py-0.5 text-[9.5px] capitalize ${channelStyles[item.channel.toLowerCase()] || "bg-secondary text-muted-foreground"}`}>{item.channel}</span></div></div></div></button></li>; })}</ul>}</section>;
}

function Timeline({ events }: { events: TimelineEvent[] }) {
  return <div className="rounded-xl border border-border bg-card"><div className="border-b border-border px-4 py-3 text-[12px] font-semibold">Customer Timeline</div>{events.length === 0 ? <div className="p-4"><DataState /></div> : <div className="divide-y divide-border">{events.slice(0, 8).map((event) => <div key={event.id} className="flex gap-3 px-4 py-3"><div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold"><span>{event.title}</span><span className="font-normal text-muted-foreground">{formatDate(event.occurredAt)}</span></div><p className="mt-0.5 truncate text-[11px] text-muted-foreground">{event.description}</p></div></div>)}</div>}</div>;
}

function DNA({ dna }: { dna: CommunicationDNA | null }) {
  return <div className="rounded-xl border border-border bg-card"><div className="border-b border-border px-4 py-3 text-[12px] font-semibold">Communication DNA™</div><div className="grid grid-cols-2 gap-2 p-4">{[["Preferred channel", dna?.preferredChannel ? `${dna.preferredChannel.value} · ${dna.preferredChannel.status}` : null], ["Typical response", dna?.typicalResponseTimeMinutes !== null && dna?.typicalResponseTimeMinutes !== undefined ? `${dna.typicalResponseTimeMinutes}m` : null], ["Preferred contact hour", dna?.preferredContactHour !== null && dna?.preferredContactHour !== undefined ? `${dna.preferredContactHour}:00` : null], ["Sentiment trend", dna?.sentimentTrend || null]].map(([label, value]) => <div key={label} className="rounded-lg bg-secondary/50 p-3"><div className="text-[10px] text-muted-foreground">{label}</div><div className="mt-1 text-[11.5px] font-semibold capitalize">{value || "—"}</div></div>)}</div>{(!dna || !dna.hasSufficientData) && <div className="px-4 pb-4"><DataState>INSUFFICIENT DATA — behavioural patterns require at least 3 communications</DataState></div>}</div>;
}

function ConversationDetail({ item, businessId, userId, onChanged }: { item: AwaitingReplyItem | null; businessId: string; userId: string | null; onChanged: () => void }) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [dna, setDna] = useState<CommunicationDNA | null>(null);
  const [reply, setReply] = useState("");
  const [coachOpen, setCoachOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [actionTaken, setActionTaken] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!item?.customer_id) { setTimeline([]); setDna(null); return; }
    Promise.all([fetchCustomerTimeline(businessId, item.customer_id), fetchCommunicationDNA(businessId, item.customer_id)]).then(([events, customerDna]) => { if (active) { setTimeline(events); setDna(customerDna); } });
    setReply(""); setCoachOpen(false); setResolveOpen(false); setNotice(null);
    return () => { active = false; };
  }, [businessId, item?.customer_id]);

  if (!item) return <section className="flex min-h-[480px] items-center justify-center rounded-2xl border border-border bg-card shadow-card"><div className="text-center"><MessageSquare className="mx-auto mb-2 h-7 w-7 text-muted-foreground/30" /><p className="text-[13px] font-semibold">Select a conversation</p><p className="mt-1 text-[11px] text-muted-foreground">The customer context will appear here.</p></div></section>;

  const Icon = channelIcons[item.channel.toLowerCase()] || MessageSquare;
  const suggestReply = async () => {
    if (!userId) return;
    const authorization = await authorizeAndLogAIRequest({ businessId, userId, actionType: "guided_communication_reply", complexityTier: "free" });
    if (!authorization.authorized) { setNotice("Guided assistance is unavailable right now."); return; }
    const firstName = item.customer_name?.split(" ")[0];
    setReply(`Hi${firstName ? ` ${firstName}` : ""}, thanks for getting in touch. I have reviewed your message and will follow up with you as soon as possible. Please let me know if there is anything else you would like me to consider.`);
    setNotice("Guided reply created from the selected conversation. Review it before using it.");
  };
  const shorten = () => setReply((value) => value.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ").trim());
  const complete = async () => {
    if (!userId || !actionTaken.trim()) return;
    setSaving(true);
    try {
      const result = await resolveCommunication({ businessId, communicationId: item.id, customerId: item.customer_id, userId, actionTaken, notes, manualChannel: item.channel });
      setNotice(result.message);
      if (result.success) { setResolveOpen(false); onChanged(); }
    } catch (err: any) {
      setNotice(`Failed to resolve: ${err?.message || "Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  return <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"><div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">{(item.customer_name || "?").split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase()}</div><div><div className="text-[14px] font-semibold">{item.customer_name || "Unknown customer"}</div><div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground"><Icon className="h-3 w-3" /> via {item.channel} · {formatDate(item.created_at)}</div></div></div><div className="flex gap-2"><button onClick={() => setCoachOpen(!coachOpen)} className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold"><Brain className="h-3 w-3" /> Coach</button><button onClick={() => setResolveOpen(!resolveOpen)} className="flex items-center gap-1.5 rounded-lg bg-brand px-2.5 py-1.5 text-[11px] font-semibold text-white"><CheckCircle2 className="h-3 w-3" /> Mark Done</button></div></div><div className="space-y-3 p-4"><div className="rounded-xl bg-secondary/50 p-4"><div className="mb-2 text-[11px] font-semibold">{item.subject || "Inbound communication"}</div><p className="whitespace-pre-wrap text-[13px] leading-relaxed">{item.body || "No message content available"}</p></div>{coachOpen && <div className="rounded-xl border border-brand/15 bg-brand/5 p-4"><div className="flex items-center gap-2 text-[11px] font-semibold text-brand"><Lightbulb className="h-3.5 w-3.5" /> Evidence coach · deterministic</div><ul className="mt-2 space-y-1 text-[11px] text-muted-foreground"><li>• The message has been waiting {Math.round(item.waiting_hours)} hours.</li><li>• The customer contacted you through {item.channel}.</li>{item.waiting_hours > 24 && <li>• This is beyond the 24-hour response window.</li>}<li>• No LLM analysis is connected, so no sentiment or intent is inferred.</li></ul></div>}{resolveOpen && <div className="rounded-xl border border-brand/20 bg-card p-4"><div className="mb-2 text-[11px] font-semibold">Confirm resolution</div><p className="mb-3 text-[11px] text-muted-foreground">Record what happened before removing this conversation from the priority queue.</p><input value={actionTaken} onChange={(event) => setActionTaken(event.target.value)} placeholder="Action taken" className="mb-2 h-9 w-full rounded-lg border border-border bg-card px-3 text-[12px]" /><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional notes or manual communication details" rows={2} className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-[12px]" /><div className="mt-2 flex justify-end gap-2"><button onClick={() => setResolveOpen(false)} className="rounded-lg border border-border px-3 py-1.5 text-[11px] font-semibold">Cancel</button><button disabled={saving || !actionTaken.trim()} onClick={complete} className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Confirm resolved"}</button></div></div>}<div className="grid gap-3 xl:grid-cols-2"><Timeline events={timeline} /><DNA dna={dna} /></div><div className="border-t border-border pt-3"><div className="mb-2 flex flex-wrap gap-2"><button onClick={suggestReply} className="flex items-center gap-1 rounded-lg border border-brand/30 bg-brand/5 px-2.5 py-1.5 text-[11px] font-semibold text-brand"><Wand2 className="h-3 w-3" /> Guided Reply</button><button onClick={shorten} disabled={!reply} className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold disabled:opacity-40">Shorten</button></div><textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder={`Write a reply to ${item.customer_name || "the customer"}…`} rows={3} className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-[13px] focus:outline-none" /><div className="mt-2 flex items-center justify-between gap-2"><span className="text-[10.5px] text-muted-foreground">Guided assistance is editable and never sends automatically.</span><button disabled className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-[11px] font-semibold text-muted-foreground"><Send className="h-3 w-3" /> Send unavailable</button></div>{notice && <div className="mt-2 text-[11px] text-muted-foreground">{notice}</div>}</div></div></section>;
}

function Analytics({ analytics, periodDays, onPeriodChange }: { analytics: CommunicationsAnalytics | null; periodDays: number; onPeriodChange: (days: number) => void }) {
  const [showSources, setShowSources] = useState(false);
  if (!analytics) return <DataState />;
  return <section className="rounded-2xl border border-border bg-card shadow-card"><div className="flex items-center gap-2 border-b border-border px-5 py-3.5"><BarChart3 className="h-4 w-4 text-brand" /><span className="text-[13.5px] font-semibold">Communication Analytics</span><select value={periodDays} onChange={(event) => onPeriodChange(Number(event.target.value))} className="ml-auto rounded-md border border-border bg-card px-2 py-1 text-[10px] text-muted-foreground"><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select></div><div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">{analytics.metrics.slice(0, 8).map((metric) => <div key={metric.key} className="rounded-xl bg-secondary/50 p-3.5"><div className="text-[10.5px] text-muted-foreground">{metric.label}</div><div className="mt-1 text-[18px] font-bold">{formatMetric(metric)}</div><div className="mt-1 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">{metric.status}</div></div>)}</div><div className="px-5 pb-4"><button onClick={() => setShowSources(!showSources)} className="flex items-center gap-1 text-[10.5px] font-semibold text-brand">{showSources ? "Hide" : "Show"} calculation sources <ChevronDown className={`h-3 w-3 ${showSources ? "rotate-180" : ""}`} /></button>{showSources && <div className="mt-2 space-y-1 text-[10.5px] text-muted-foreground">{analytics.metrics.map((metric) => <div key={metric.key}><strong>{metric.label}:</strong> {metric.source}</div>)}</div>}</div></section>;
}

function ScoreCard({ score }: { score: CommunicationScore | null }) {
  const improvement = score?.components.filter((component) => component.score !== null).sort((a, b) => (a.score as number) - (b.score as number))[0];
  return <section className="rounded-2xl border border-border bg-card p-5 shadow-card"><div className="mb-4 flex items-center gap-2"><Award className="h-4 w-4 text-brand" /><span className="text-[13.5px] font-semibold">Communication Score™</span></div><div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start"><div className="text-center"><ScoreRing score={score?.score ?? null} /><div className="mt-2 text-[10px] text-muted-foreground">{score?.minimumEvidence}</div></div><div className="w-full space-y-3">{score?.components.map((component) => <div key={component.key}><div className="mb-1 flex items-center justify-between gap-3 text-[11px]"><span>{component.label}</span><span className="font-semibold">{component.score ?? "—"}</span></div><ProgressBar value={component.score} /><div className="mt-1 text-[9.5px] text-muted-foreground">{component.evidence}</div></div>)}</div></div>{score?.hasSufficientData && improvement && <div className="mt-4 rounded-xl border border-brand/15 bg-brand/5 p-3"><div className="flex items-center gap-2 text-[11px] font-semibold text-brand"><Lightbulb className="h-3.5 w-3.5" /> Calculated improvement area</div><p className="mt-1 text-[11px] text-muted-foreground">{improvement.label} is currently the lowest measurable category at {improvement.score}/100. Improving this category is the clearest evidence-based route to a higher score; no unsupported target is promised.</p></div>}{!score?.hasSufficientData && <div className="mt-4"><DataState /></div>}</section>;
}

function ImpactCard({ analytics }: { analytics: CommunicationsAnalytics | null }) {
  const get = (key: string) => analytics?.metrics.find((metric) => metric.key === key) || null;
  const cards = [["Revenue via Conversations", get("revenueGenerated")], ["Customers Saved", null], ["Negative Reviews Prevented", null], ["Hours Saved by AI", null]] as const;
  return <section className="rounded-2xl border border-border bg-card p-5 shadow-card"><div className="mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-brand" /><span className="text-[13.5px] font-semibold">Communication Impact</span></div><div className="grid grid-cols-2 gap-3">{cards.map(([label, metric]) => <div key={label} className="rounded-xl border border-border p-4"><div className="text-[10.5px] text-muted-foreground">{label}</div><div className="mt-1.5 text-[20px] font-bold">{metric ? formatMetric(metric) : "—"}</div><div className="mt-1 text-[10px] text-muted-foreground">{metric ? metric.status : "Insufficient evidence"}</div></div>)}</div><p className="mt-3 text-[10.5px] text-muted-foreground">Only revenue directly linked to a communicated job is shown. Retention, prevented reviews, and time saved require outcome evidence not present in the current records.</p></section>;
}

function ChannelCard({ metrics }: { metrics: CommunicationsMetrics }) {
  return <section className="rounded-2xl border border-border bg-card shadow-card"><div className="flex items-center gap-2 border-b border-border px-5 py-3.5"><MessageCircle className="h-4 w-4 text-brand" /><span className="text-[13.5px] font-semibold">Channel Breakdown</span></div><div className="space-y-2 p-5">{metrics.channels.length === 0 ? <DataState /> : metrics.channels.map((channel) => { const Icon = channelIcons[channel.channel] || MessageSquare; return <div key={channel.channel} className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3"><div className={`grid h-9 w-9 place-items-center rounded-lg ${channelStyles[channel.channel] || "bg-secondary text-muted-foreground"}`}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex justify-between gap-2 text-[12px] font-semibold capitalize"><span>{channel.channel}</span><span>{channel.communicationCount || "—"}</span></div><div className="mt-1 text-[10.5px] text-muted-foreground">{channel.connected ? `${channel.inboundCount} inbound · ${channel.outboundCount} outbound` : "Not connected"}{channel.responseTimeMinutes !== null ? ` · ${channel.responseTimeMinutes}m average response` : ""}</div></div><span className="text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">{channel.status}</span></div>; })}</div></section>;
}

function BusinessDNA({ score }: { score: CommunicationScore | null }) {
  return <section className="rounded-2xl border border-border bg-card p-5 shadow-card"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand" /><span className="text-[13.5px] font-semibold">Business DNA™</span><span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">Contribution</span></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-xl bg-secondary/50 p-3"><div className="text-[10px] text-muted-foreground">Communication Intelligence</div><div className="mt-1 text-[18px] font-bold">{score?.score ?? "—"}</div><div className="text-[10px] text-muted-foreground">Authoritative Communication Score</div></div><div className="rounded-xl bg-secondary/50 p-3"><div className="text-[10px] text-muted-foreground">Relationship DNA</div><div className="mt-1 text-[14px] font-semibold text-muted-foreground">Existing source</div><div className="text-[10px] text-muted-foreground">Not duplicated here</div></div><div className="rounded-xl bg-secondary/50 p-3"><div className="text-[10px] text-muted-foreground">Other modules</div><div className="mt-1 text-[14px] font-semibold text-muted-foreground">Soon</div><div className="text-[10px] text-muted-foreground">Only verified scores contribute</div></div><div className="rounded-xl bg-secondary/50 p-3"><div className="text-[10px] text-muted-foreground">Status</div><div className="mt-1 text-[14px] font-semibold">{score?.hasSufficientData ? "Calculated" : "Insufficient data"}</div><div className="text-[10px] text-muted-foreground">No fabricated score</div></div></div></section>;
}

export function CommunicationIntelligence() {
  const { business, user } = useAuthContext();
  const businessId = business?.id;
  const [metrics, setMetrics] = useState<CommunicationsMetrics | null>(null);
  const [recommendation, setRecommendation] = useState<AwaitingReplyItem | null>(null);
  const [items, setItems] = useState<AwaitingReplyItem[]>([]);
  const [analytics, setAnalytics] = useState<CommunicationsAnalytics | null>(null);
  const [score, setScore] = useState<CommunicationScore | null>(null);
  const [selected, setSelected] = useState<AwaitingReplyItem | null>(null);
  const [periodDays, setPeriodDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const period = useMemo(() => { const end = new Date(); const start = new Date(end); start.setDate(start.getDate() - periodDays); return { start: start.toISOString(), end: end.toISOString() }; }, [periodDays]);
  const load = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [nextMetrics, nextItems, nextRecommendation, nextAnalytics, nextScore] = await Promise.all([
        fetchCommunicationsMetrics(businessId),
        fetchAwaitingReply(businessId),
        fetchPriorityRecommendation(businessId),
        fetchCommunicationsAnalytics(businessId, period.start, period.end),
        fetchCommunicationScore(businessId),
      ]);
      setMetrics(nextMetrics); setItems(nextItems); setRecommendation(nextRecommendation.item); setAnalytics(nextAnalytics); setScore(nextScore); setSelected((current) => nextItems.find((item) => item.id === current?.id) || nextItems[0] || null);
    } catch (error) { console.error("[CommunicationIntelligence] load error:", error); setLoadError("Communications could not be loaded. Please try again."); } finally { setLoading(false); }
  }, [businessId, period.end, period.start]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => appEvents.on(APP_EVENTS.COMMUNICATIONS_MUTATED, load), [load]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>;
  if (!metrics) return <div className="flex flex-col items-center justify-center py-20 text-center"><p className="text-[13px] font-semibold text-foreground">{loadError || "Communications are unavailable."}</p><button onClick={() => void load()} className="mt-3 rounded-lg bg-brand px-4 py-2 text-[12px] font-semibold text-white">Retry</button></div>;
  return <div className="space-y-6"><Hero metrics={metrics} /><PriorityCard recommendation={recommendation} onOpen={() => setSelected(recommendation)} /><div className="grid gap-4 lg:grid-cols-[340px_1fr]"><Queue items={items} selected={selected?.id || null} onSelect={setSelected} /><ConversationDetail item={selected} businessId={businessId as string} userId={user?.id || null} onChanged={load} /></div><Analytics analytics={analytics} periodDays={periodDays} onPeriodChange={setPeriodDays} /><div className="grid gap-4 lg:grid-cols-2"><ScoreCard score={score} /><ImpactCard analytics={analytics} /></div><ChannelCard metrics={metrics} /><BusinessDNA score={score} /></div>;
}
