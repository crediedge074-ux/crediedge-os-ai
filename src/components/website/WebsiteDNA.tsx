import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  Globe, Sparkles, ChevronRight, ExternalLink, RefreshCw,
  Lightbulb, Layers, Brain, MessageSquare, Send, Search,
  MousePointerClick, ArrowDown, Eye, Target,
  TriangleAlert as AlertTriangle, Activity, FileText, Zap,
  CircleCheck as CheckCircle2, Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { updateBusiness } from "@/services/business";
import { fetchMissions, createMission, type CalculatedMission } from "@/services/missions";
import { fetchIntelligenceSnapshot, answerBusinessQuestion, type IntelligenceSnapshot, type IntelligenceModule, type IntelligenceAnswer } from "@/services/intelligence";
import { appEvents, APP_EVENTS } from "@/lib/events";
import { InsufficientData } from "@/components/ui/InsufficientData";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ChatMessage } from "./types";

// ─── Integration check ───────────────────────────────────────────────────────

interface IntegrationRow {
  provider: string;
  status: string;
}

async function fetchIntegrations(businessId: string): Promise<IntegrationRow[]> {
  const { data, error } = await (supabase.from as any)("integrations")
    .select("provider, status")
    .eq("business_id", businessId);
  if (error) return [];
  return (data || []) as IntegrationRow[];
}

// ─── Shared Primitives ───────────────────────────────────────────────────────

function ComingSoonCard({
  title,
  icon: Icon,
  description,
  badge,
}: {
  title: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Icon className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[14px] font-semibold text-foreground">{title}</span>
        </div>
        <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          {badge ?? "Coming Soon"}
        </span>
      </div>
      <div className="p-6">
        <InsufficientData description={description} icon={Icon} />
      </div>
    </div>
  );
}

// ─── Section 1: Website DNA Hero ─────────────────────────────────────────────

function WebsiteDNAHero({
  websiteUrl,
  connected,
}: {
  websiteUrl: string | null;
  connected: boolean;
}) {
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
              {connected ? "Website Performance" : "Connect Your Website"}
            </h1>
            <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-background/60">
              {connected
                ? "Performance data from your connected analytics source."
                : "Website DNA™ analyses your website's performance, conversions, and SEO — once an authoritative data source is connected."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-background/50">Health Score</div>
              <div className="text-[42px] font-bold leading-none text-background/40">
                —
              </div>
              <div className="text-[11px] text-background/50">no data</div>
            </div>
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full border-2 border-dashed border-background/20">
              <Sparkles className="h-6 w-6 text-background/30" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 sm:px-8">
        {websiteUrl ? (
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-background/20 px-4 py-2.5 text-[13px] font-semibold text-background/80 transition-colors hover:bg-background/10"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
              {websiteUrl.replace(/^https?:\/\//, "")}
            </a>
            {!connected && (
              <span className="text-[12px] text-background/50">URL saved — connect an analytics source to unlock performance data.</span>
            )}
          </div>
        ) : (
          <p className="text-[13px] text-background/50">No website URL saved. Enter your business website URL below to get started.</p>
        )}
      </div>
    </div>
  );
}

// ─── Section 2: Website URL Setup ────────────────────────────────────────────

function WebsiteUrlSetup({
  businessId,
  currentUrl,
  onSaved,
}: {
  businessId: string;
  currentUrl: string | null;
  onSaved: (url: string) => void;
}) {
  const [url, setUrl] = useState(currentUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setUrl(currentUrl ?? ""); }, [currentUrl]);

  const handleSave = async () => {
    const trimmed = url.trim();
    if (!trimmed) { setError("Enter a URL to save."); return; }
    let normalized = trimmed;
    if (!/^https?:\/\//i.test(normalized)) normalized = `https://${normalized}`;
    setSaving(true);
    setError(null);
    try {
      await updateBusiness(businessId, { website: normalized });
      onSaved(normalized);
    } catch (err: any) {
      setError(err?.message || "Could not save the website URL. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Globe className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Website URL</span>
      </div>
      <div className="p-6">
        <p className="mb-4 text-[13px] text-muted-foreground">
          Save your business website URL. This enables website-related missions and future integrations.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null); }}
            placeholder="https://your-business.co.uk"
            className="flex-1 rounded-xl border border-border bg-secondary px-4 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/60 focus:border-brand focus:outline-none"
          />
          <button
            onClick={handleSave}
            disabled={saving || url.trim() === (currentUrl ?? "")}
            className="rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save URL"}
          </button>
        </div>
        {error && <p className="mt-2 text-[12px] text-red-600">{error}</p>}
      </div>
    </div>
  );
}

// ─── Section 3: Integrations Panel ───────────────────────────────────────────

const WEBSITE_INTEGRATIONS = [
  { provider: "google_analytics", label: "Google Analytics 4", description: "Traffic, conversions, and visitor behaviour." },
  { provider: "google_search_console", label: "Google Search Console", description: "Search queries, keyword rankings, and indexing status." },
  { provider: "microsoft_clarity", label: "Microsoft Clarity", description: "Heatmaps, session replays, and user interaction data." },
];

function IntegrationsPanel({ integrations }: { integrations: IntegrationRow[] }) {
  const connectedMap = new Map(integrations.map((i) => [i.provider, i.status]));

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Zap className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Data Sources</span>
        <span className="ml-auto text-[12px] text-muted-foreground">
          {integrations.length} connected
        </span>
      </div>
      <ul className="divide-y divide-border">
        {WEBSITE_INTEGRATIONS.map(({ provider, label, description }) => {
          const status = connectedMap.get(provider);
          const isConnected = status === "connected";
          return (
            <li key={provider} className="flex items-start gap-4 px-6 py-4">
              <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${isConnected ? "border-emerald-200 bg-emerald-50" : "border-border bg-secondary"}`}>
                {isConnected
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={1.75} />
                  : <Globe className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold text-foreground">{label}</div>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{description}</p>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${isConnected ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-border bg-secondary text-muted-foreground"}`}>
                {isConnected ? "Connected" : "Not Connected"}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-border px-6 py-4">
        <p className="text-[12px] text-muted-foreground">
          Connecting a data source is Coming Soon. Once available, Website DNA™ will display real performance scores, discoveries, and opportunities from your connected analytics.
        </p>
      </div>
    </div>
  );
}

// ─── Section 4: Website Missions (real) ──────────────────────────────────────

function WebsiteMissions({
  missions,
  businessId,
  websiteUrl,
  onMissionCreated,
}: {
  missions: CalculatedMission[];
  businessId: string;
  websiteUrl: string | null;
  onMissionCreated: () => void;
}) {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setCreating(true);
    setError(null);
    try {
      await createMission(businessId, { title: trimmed, description: websiteUrl ? `Website improvement mission for ${websiteUrl}` : "Website improvement mission" });
      setTitle("");
      onMissionCreated();
    } catch (err: any) {
      setError(err?.message || "Could not create the mission. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Layers className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Website Missions</span>
        <Link to="/tasks" className="ml-auto flex items-center gap-1 text-[12px] text-brand hover:opacity-70">
          View All <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="border-b border-border bg-secondary/20 px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(null); }}
            placeholder="New website mission title…"
            className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/60 focus:border-brand focus:outline-none"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !title.trim()}
            className="rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {creating ? "Creating…" : "Create Mission"}
          </button>
        </div>
        {error && <p className="mt-2 text-[12px] text-red-600">{error}</p>}
      </div>

      {missions.length === 0 ? (
        <div className="px-6 py-10">
          <EmptyState
            icon={Layers}
            title="No website missions yet"
            description="Create a mission to start tracking website improvement tasks. Missions connect your website goals to actionable work."
          />
        </div>
      ) : (
        <div className="divide-y divide-border">
          {missions.map((m) => (
            <div key={m.id} className="px-6 py-5">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-[14px] font-semibold text-foreground">{m.title}</div>
                  {m.description && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{m.description}</p>}
                </div>
                <span className={`rounded border px-2 py-0.5 text-[11px] font-semibold capitalize ${
                  m.status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                  m.status === "completed" ? "border-blue-200 bg-blue-50 text-blue-700" :
                  "border-border bg-secondary text-muted-foreground"
                }`}>
                  {m.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                <span>{m.totalTasks} task{m.totalTasks === 1 ? "" : "s"}</span>
                <span>·</span>
                <span>{m.completedTasks} completed</span>
                {m.progressPct > 0 && (
                  <>
                    <span>·</span>
                    <span>{m.progressPct}% progress</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section 5: Business DNA Preview (real modules) ──────────────────────────

function BusinessDNAPreview({ modules }: { modules: IntelligenceModule[] }) {
  const websiteModule = modules.find((m) => m.id === "website");
  const otherModules = modules.filter((m) => m.id !== "website");

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <Brain className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Business DNA™ — Website Contribution</span>
        <Link to="/intelligence" className="ml-auto flex items-center gap-1 text-[12px] text-brand hover:opacity-70">
          View Intelligence <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="p-6">
        <p className="mb-4 text-[13px] text-muted-foreground">
          Website DNA™ contributes to your overall Business DNA™. Improving your website performance improves your CrediEdge Score once a data source is connected.
        </p>

        {websiteModule && (
          <div className="mb-4 rounded-xl border-2 border-dashed border-[#f97316]/30 bg-[#f97316]/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: websiteModule.color }} />
                <span className="text-[13px] font-semibold text-foreground">{websiteModule.name}</span>
              </div>
              <span className="text-[13px] font-bold text-muted-foreground">—</span>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">{websiteModule.evidence}</p>
          </div>
        )}

        <div className="space-y-2.5">
          {otherModules.map((m) => (
            <Link
              key={m.id}
              to={m.route}
              className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary/30"
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: m.color }} />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-foreground">{m.name}</div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{m.evidence}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[15px] font-bold text-foreground">
                  {m.score === null ? "—" : `${m.score}`}
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

// ─── Section 6: Heatmap Insights (Coming Soon, same as before) ────────────────

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

// ─── Section 7: Website Chat (real AI) ───────────────────────────────────────

function WebsiteChat({
  snapshot,
  userId,
}: {
  snapshot: IntelligenceSnapshot | null;
  userId: string | null;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg = text.trim();
    if (!userMsg || loading) return;

    if (!snapshot) {
      setMessages((prev) => [...prev, { role: "user", content: userMsg }, { role: "ai", content: "INSUFFICIENT DATA — Business intelligence is still loading. Please wait a moment and try again." }]);
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const answer: IntelligenceAnswer = await answerBusinessQuestion(snapshot, userMsg, userId);
      setMessages((prev) => [...prev, { role: "ai", content: answer.content }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "ai", content: "An error occurred while processing your question. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }, [snapshot, userId, loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const suggestedPrompts = [
    "What should I focus on next?",
    "How is my revenue?",
    "What are my biggest risks?",
    "What opportunities are available?",
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-4">
        <MessageSquare className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
        <span className="text-[14px] font-semibold text-foreground">Ask About Your Website</span>
        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1">
          <div className={`h-1.5 w-1.5 rounded-full ${snapshot ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"}`} />
          <span className="text-[11px] font-medium text-muted-foreground">
            {snapshot ? "AI Active" : "Loading…"}
          </span>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="px-6 py-5">
          <p className="mb-3 text-[12.5px] font-medium text-muted-foreground">
            Ask about your business performance. Website-specific questions require a connected analytics source.
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                disabled={!snapshot || loading}
                className="rounded-xl border border-border bg-secondary px-3 py-2 text-[12.5px] text-foreground transition-colors hover:bg-secondary/70 disabled:opacity-40"
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
            {loading && (
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
            placeholder="Ask about your website or business performance…"
            className="flex-1 rounded-xl border border-border bg-secondary px-4 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/60 focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading || !snapshot}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            <Send className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Section 8: Executive Report (Coming Soon) ───────────────────────────────

function ExecutiveReport() {
  return (
    <ComingSoonCard
      title="Executive Website Report"
      icon={FileText}
      description="A full executive report — summary, strengths, weaknesses, risks, opportunities, and priority actions — requires a connected analytics source. Once real website performance data is available, this report will be generated from verified metrics."
      badge="Coming Soon"
    />
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export function WebsiteDNA() {
  const { business, user } = useAuthContext();
  const businessId = business?.id ?? null;
  const businessName = business?.name ?? "Your Business";

  const [websiteUrl, setWebsiteUrl] = useState<string | null>(business?.website ?? null);
  const [integrations, setIntegrations] = useState<IntegrationRow[]>([]);
  const [missions, setMissions] = useState<CalculatedMission[]>([]);
  const [snapshot, setSnapshot] = useState<IntelligenceSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  const connected = integrations.some((i) => i.status === "connected");

  const loadData = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [ints, mss, snap] = await Promise.all([
        fetchIntegrations(businessId),
        fetchMissions(businessId),
        fetchIntelligenceSnapshot(businessId, businessName),
      ]);
      setIntegrations(ints);
      setMissions(mss);
      setSnapshot(snap);
    } catch (err) {
      console.error("[WebsiteDNA] load error:", err);
    } finally {
      setLoading(false);
    }
  }, [businessId, businessName]);

  useEffect(() => {
    if (businessId) loadData();
  }, [businessId, loadData]);

  useEffect(() => {
    setWebsiteUrl(business?.website ?? null);
  }, [business?.website]);

  useEffect(() => {
    if (!businessId) return;
    const handler = () => { fetchMissions(businessId).then(setMissions); };
    const unsubscribe = appEvents.on(APP_EVENTS.MISSIONS_MUTATED, handler);
    return unsubscribe;
  }, [businessId]);

  if (!businessId) {
    return (
      <div className="space-y-6">
        <InsufficientData description="No active business workspace found. Sign in to view your Website DNA™." icon={Globe} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" strokeWidth={1.75} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WebsiteDNAHero websiteUrl={websiteUrl} connected={connected} />
      <WebsiteUrlSetup businessId={businessId} currentUrl={websiteUrl} onSaved={setWebsiteUrl} />
      <IntegrationsPanel integrations={integrations} />

      {/* Honest sections: no data source connected */}
      <ComingSoonCard
        title="AI Executive Summary"
        icon={Brain}
        description="An AI-generated executive summary of your website's performance will appear here once an analytics source is connected. No summary is produced without verified data."
      />
      <ComingSoonCard
        title="Website Health Dashboard"
        icon={Activity}
        description="Health scores across performance, SEO, conversions, UX, accessibility, security, forms, and tracking require data from a connected analytics source."
      />
      <ComingSoonCard
        title="AI Discoveries"
        icon={Lightbulb}
        description="Evidence-backed discoveries about your website's performance — bounce rate, conversion blockers, SEO changes — will appear here once real analytics data is available."
      />
      <ComingSoonCard
        title="Visitor Journey"
        icon={Globe}
        description="A visual funnel showing where visitors enter and drop off requires Google Analytics 4 or a similar connected source."
      />
      <ComingSoonCard
        title="Conversion Intelligence"
        icon={Target}
        description="Conversion metrics, trends, and explanations require a connected analytics source with conversion tracking enabled."
      />
      <ComingSoonCard
        title="AI Opportunities"
        icon={Zap}
        description="Prioritised website improvement opportunities with estimated impact are generated from real analytics data. Connect a source to unlock this analysis."
      />
      <ComingSoonCard
        title="SEO DNA"
        icon={Search}
        description="Search engine optimisation findings — keyword rankings, meta descriptions, Core Web Vitals, schema markup — require Google Search Console integration."
      />
      <ComingSoonCard
        title="Content Intelligence"
        icon={FileText}
        description="Content issues and AI suggestions for each page require a connected analytics source and content crawl. This feature is Coming Soon."
      />

      <HeatmapInsights />

      <ComingSoonCard
        title="AI Predictions"
        icon={Brain}
        description="Traffic, lead, conversion, and revenue forecasts require historical analytics data. Connect a source and accumulate data before predictions can be generated."
      />

      {/* Real data sections */}
      <WebsiteMissions
        missions={missions}
        businessId={businessId}
        websiteUrl={websiteUrl}
        onMissionCreated={() => fetchMissions(businessId).then(setMissions)}
      />
      <BusinessDNAPreview modules={snapshot?.modules ?? []} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ComingSoonCard
          title="AI Memory"
          icon={Brain}
          description="Learned insights from your website data accumulate over time once an analytics source is connected. No memory items exist without verified data."
        />
        <ComingSoonCard
          title="Website Impact"
          icon={Activity}
          description="Revenue generated, leads, and score impact from your website require connected analytics with attribution data."
        />
      </div>

      <ExecutiveReport />
      <WebsiteChat snapshot={snapshot} userId={user?.id ?? null} />
    </div>
  );
}
