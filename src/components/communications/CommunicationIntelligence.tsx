import { useState, useEffect, useRef, useCallback } from "react";
import { Brain, TrendingUp, MessageSquare, Mail, Phone, Clock, ChevronDown, Zap, Star, Lightbulb, TriangleAlert as AlertTriangle, ChartBar as BarChart3, MessageCircle, Sparkles, Award, Eye, Wand as Wand2, Smile, Minus, BookOpen, Mic, Instagram, Globe, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { fetchCommunicationsMetrics, fetchAwaitingReply, type CommunicationsMetrics, type AwaitingReplyItem } from "@/services/communications";
import { appEvents, APP_EVENTS } from "@/lib/events";

// ─── Animated Number ──────────────────────────────────────────────────────────

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

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({
  score,
  size = 96,
  stroke = 8,
  color = "#E31B23",
  label,
}: {
  score: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
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
    <div className="relative inline-flex flex-col items-center gap-1">
      <div className="relative">
        <svg ref={ref} width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border" />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[20px] font-bold leading-none text-foreground">{score}</span>
          <span className="text-[9px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      {label && <span className="text-[10.5px] font-medium text-muted-foreground">{label}</span>}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

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

// ─── CHANNEL ICON MAP ─────────────────────────────────────────────────────────

const channelIcon: Record<string, React.ElementType> = {
  email: Mail,
  Email: Mail,
  whatsapp: MessageCircle,
  WhatsApp: MessageCircle,
  sms: MessageSquare,
  SMS: MessageSquare,
  phone: Phone,
  Phone: Phone,
  facebook: MessageSquare,
  Facebook: MessageSquare,
  instagram: Instagram,
  Instagram: Instagram,
  "web chat": Globe,
  "Web Chat": Globe,
  "contact form": BookOpen,
  "Contact Form": BookOpen,
  voicemail: Mic,
  Voicemail: Mic,
};

const channelColor: Record<string, string> = {
  email: "bg-blue-50 text-blue-600",
  whatsapp: "bg-emerald-50 text-emerald-600",
  sms: "bg-violet-50 text-violet-600",
  phone: "bg-amber-50 text-amber-600",
  facebook: "bg-indigo-50 text-indigo-600",
  instagram: "bg-pink-50 text-pink-600",
  "web chat": "bg-cyan-50 text-cyan-600",
  "contact form": "bg-orange-50 text-orange-600",
  voicemail: "bg-rose-50 text-rose-600",
};

// ─── INSUFFICIENT DATA BADGE ──────────────────────────────────────────────────

function InsufficientDataBadge({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-3 py-2">
      <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
      <span className="text-[11px] font-medium text-muted-foreground">
        {label || "Insufficient data — not enough evidence to calculate"}
      </span>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function CommunicationIntelligenceHero({ metrics }: { metrics: CommunicationsMetrics | null }) {
  const m = metrics;

  const stats = [
    { label: "Unread Messages", value: m?.unreadMessages ?? 0, suffix: "", icon: MessageSquare, hasData: !!m && m.totalCommunications > 0 },
    { label: "Awaiting Reply", value: m?.awaitingReply ?? 0, suffix: "", icon: Clock, hasData: !!m && m.totalCommunications > 0 },
    { label: "Avg Response", value: m?.avgResponseTimeMinutes, suffix: "m", icon: Zap, hasData: m?.avgResponseTimeMinutes !== null && m?.avgResponseTimeMinutes !== undefined },
    { label: "AI Priority", value: m?.aiPriorityScore, suffix: "", icon: Brain, hasData: m?.aiPriorityScore !== null && m?.aiPriorityScore !== undefined },
    { label: "Satisfaction", value: m?.satisfactionPct, suffix: "%", icon: Star, hasData: m?.satisfactionPct !== null && m?.satisfactionPct !== undefined },
    { label: "Missed Opps", value: m?.missedOpportunities ?? 0, suffix: "", icon: AlertTriangle, hasData: !!m && m.totalCommunications > 0 },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-brand/10 blur-2xl" />

      <div className="relative">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-brand" />
              AI-Powered Intelligence
            </div>
            <h2 className="text-[22px] font-bold leading-tight tracking-tight text-background">
              Communication Intelligence™
            </h2>
            <p className="mt-1 text-[13px] text-background/65">
              Every conversation. One intelligent workspace.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 rounded-xl px-3 py-2 ${m?.liveMonitoring ? "bg-emerald-500/15" : "bg-background/10"}`}>
              <span className={`h-2 w-2 rounded-full ${m?.liveMonitoring ? "animate-pulse bg-emerald-400" : "bg-background/30"}`} />
              <span className="text-[11px] font-semibold text-background/80">
                {m?.liveMonitoring ? "Live monitoring" : "No live sync"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-background/10 px-3 py-2">
              <span className="text-[11px] font-semibold text-background/80">
                {m?.connectedChannels ?? 0} channels connected
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-col gap-1.5 rounded-xl bg-background/10 p-3">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-background/50" strokeWidth={1.75} />
                  <span className="text-[9.5px] font-medium text-background/55">{s.label}</span>
                </div>
                {s.hasData ? (
                  <span className="text-[20px] font-bold tracking-tight text-background">
                    <AnimatedNumber value={s.value as number} suffix={s.suffix} />
                  </span>
                ) : (
                  <span className="text-[14px] font-semibold text-background/40">—</span>
                )}
              </div>
            );
          })}
        </div>

        {m && !m.hasSufficientData && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-background/5 px-3.5 py-2.5">
            <AlertTriangle className="h-3.5 w-3.5 text-background/50" strokeWidth={1.75} />
            <span className="text-[11px] text-background/60">
              No communication records found yet. Metrics will appear once conversations are logged.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TODAY'S PRIORITY CARD ────────────────────────────────────────────────────

function TodaysPriorityCard({
  awaitingReply,
  metrics,
  onSelectConversation,
}: {
  awaitingReply: AwaitingReplyItem[];
  metrics: CommunicationsMetrics | null;
  onSelectConversation: (index: number) => void;
}) {
  const [explainOpen, setExplainOpen] = useState(false);

  if (!metrics || !metrics.hasSufficientData || awaitingReply.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">AI Recommendation</span>
        </div>
        <p className="text-[12.5px] text-muted-foreground">
          {metrics && metrics.totalCommunications > 0
            ? "No conversations are currently awaiting your reply. You're all caught up."
            : "AI recommendations will appear here once you have communication records. Start by composing a message or connecting a channel."}
        </p>
      </div>
    );
  }

  const top = awaitingReply[0];
  const waitingCount = awaitingReply.length;
  const longWaiters = awaitingReply.filter((a) => a.waiting_hours > 12).length;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/5 to-card shadow-card">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/10 blur-2xl" />
      <div className="relative p-5">
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">AI Recommendation</span>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold text-brand">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            LIVE
          </span>
        </div>

        <p className="text-[13.5px] leading-relaxed text-foreground">
          You have <span className="font-semibold">{waitingCount} {waitingCount === 1 ? "enquiry" : "enquiries"}</span> awaiting reply
          {longWaiters > 0 && (
            <span> — <span className="font-semibold">{longWaiters} {longWaiters === 1 ? "has" : "have"} been waiting over 12 hours</span></span>
          )}.{" "}
          AI recommends replying to{" "}
          <span className="font-semibold">{top.customer_name || "your most recent enquiry"}</span> first.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-2.5">
            <div>
              <div className="text-[10px] text-muted-foreground">Waiting</div>
              <div className="text-[18px] font-bold text-brand">{Math.round(top.waiting_hours)}h</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-[10px] text-muted-foreground">Via</div>
              <div className="text-[14px] font-bold text-foreground capitalize">{top.channel}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSelectConversation(0)}
              className="rounded-xl bg-brand px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:bg-brand/90 hover:shadow-md"
            >
              Open Conversation
            </button>
            <button
              onClick={() => setExplainOpen(!explainOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-[12.5px] font-semibold text-foreground transition-all hover:border-foreground/20 hover:bg-secondary"
            >
              <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
              Explain Why
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${explainOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {explainOpen && (
          <div className="mt-4 rounded-xl bg-brand/5 border border-brand/15 p-4">
            <div className="flex items-start gap-2.5">
              <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
              <div>
                <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-brand">
                  Why {top.customer_name || "this enquiry"} first?
                </div>
                <p className="text-[12px] leading-relaxed text-foreground/80">
                  This enquiry has been waiting {Math.round(top.waiting_hours)} hours
                  {top.waiting_hours > 24 && " — this exceeds the 24-hour response window and may be a missed opportunity"}.{" "}
                  {top.customer_name
                    ? `${top.customer_name} contacted you via ${top.channel}. `
                    : `This message was received via ${top.channel}. `}
                  Replying promptly improves customer satisfaction and response-time metrics.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CONVERSATION LIST ────────────────────────────────────────────────────────

function ConversationList({
  items,
  selected,
  onSelect,
}: {
  items: AwaitingReplyItem[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <span className="text-[12px] font-semibold text-foreground">AI Priority Queue</span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[10px] font-bold text-muted-foreground">0</span>
        </div>
        <div className="flex items-center justify-center px-4 py-12 text-center">
          <div>
            <MessageSquare className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" strokeWidth={1.5} />
            <p className="text-[11.5px] text-muted-foreground">No conversations awaiting reply</p>
            <p className="mt-1 text-[10px] text-muted-foreground/60">You're all caught up</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <span className="text-[12px] font-semibold text-foreground">AI Priority Queue</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {items.length}
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground">Sorted by wait time</span>
      </div>

      <ul className="flex-1 divide-y divide-border overflow-y-auto max-h-[600px]">
        {items.map((item, rank) => {
          const ChanIcon = channelIcon[item.channel] ?? channelIcon[item.channel?.toLowerCase()] ?? MessageSquare;
          const chColor = channelColor[item.channel?.toLowerCase()] ?? "bg-secondary text-muted-foreground";
          const isUrgent = item.waiting_hours > 24;
          const isHigh = item.waiting_hours > 4 && !isUrgent;
          const priCfg = isUrgent
            ? { dot: "bg-destructive animate-pulse", badge: "bg-destructive/10 text-destructive", label: "Critical" }
            : isHigh
              ? { dot: "bg-brand", badge: "bg-brand/10 text-brand", label: "High" }
              : { dot: "bg-amber-500", badge: "bg-amber-50 text-amber-600", label: "Medium" };

          const isSelected = selected === rank;
          const initials = (item.customer_name || "?")
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <li
              key={item.id}
              onClick={() => onSelect(rank)}
              className={`group cursor-pointer px-4 py-3.5 transition-all duration-150 ${
                isSelected
                  ? "bg-brand/5 border-l-2 border-l-brand"
                  : "hover:bg-secondary/40 border-l-2 border-l-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
                    {initials}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${priCfg.dot}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[12.5px] font-semibold text-foreground">
                      {item.customer_name || "Unknown customer"}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{Math.round(item.waiting_hours)}h ago</span>
                  </div>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <ChanIcon className={`h-2.5 w-2.5 shrink-0 ${chColor.split(" ")[1]}`} strokeWidth={1.75} />
                    <span className="truncate text-[11px] text-muted-foreground">
                      {item.subject || item.body?.slice(0, 60) || "No message content"}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${priCfg.badge}`}>
                      <span className={`h-1 w-1 rounded-full ${priCfg.dot.replace(" animate-pulse", "")}`} />
                      {priCfg.label}
                    </span>
                    <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-medium ${chColor}`}>
                      <ChanIcon className="h-2.5 w-2.5" strokeWidth={1.75} />
                      <span className="capitalize">{item.channel}</span>
                    </span>
                  </div>

                  <div className="mt-1 text-[10px] text-muted-foreground">
                    #{rank + 1} — Waiting {Math.round(item.waiting_hours)}h
                    {isUrgent && " · Overdue"}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── CONVERSATION DETAIL ──────────────────────────────────────────────────────

function ConversationDetail({ item }: { item: AwaitingReplyItem | null }) {
  const [replyText, setReplyText] = useState("");
  const [showCoach, setShowCoach] = useState(false);

  useEffect(() => {
    setReplyText("");
  }, [item?.id]);

  if (!item) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border bg-card shadow-card">
        <MessageSquare className="mb-3 h-8 w-8 text-muted-foreground/30" strokeWidth={1.5} />
        <p className="text-[13px] font-semibold text-foreground">No conversation selected</p>
        <p className="mt-1 text-[11.5px] text-muted-foreground">Select an enquiry from the queue to view details</p>
      </div>
    );
  }

  const ChanIcon = channelIcon[item.channel] ?? channelIcon[item.channel?.toLowerCase()] ?? MessageSquare;
  const chColor = channelColor[item.channel?.toLowerCase()] ?? "bg-secondary text-muted-foreground";
  const isUrgent = item.waiting_hours > 24;
  const initials = (item.customer_name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSuggest = () => {
    const suggested = item.customer_name
      ? `Hi ${item.customer_name.split(" ")[0]}, thanks for your message. I wanted to get back to you as soon as possible. Could you let me know a good time to call or discuss this further?`
      : `Hi, thanks for your message. I wanted to get back to you as soon as possible. How can I help you today?`;
    setReplyText(suggested);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-foreground">
                {item.customer_name || "Unknown customer"}
              </span>
              {isUrgent && (
                <span className="flex items-center gap-0.5 rounded-md bg-destructive/10 px-1.5 py-0.5 text-[9.5px] font-semibold text-destructive">
                  <AlertTriangle className="h-2.5 w-2.5" strokeWidth={1.75} />
                  Overdue
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
              <ChanIcon className="h-3 w-3" strokeWidth={1.75} />
              <span className="capitalize">via {item.channel}</span>
              <span className="text-muted-foreground/30">·</span>
              <span>{Math.round(item.waiting_hours)}h ago</span>
              {isUrgent && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-destructive font-medium">Reply urgently</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setShowCoach(!showCoach)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all ${showCoach ? "border-brand/30 bg-brand/5 text-brand" : "border-border bg-card text-foreground hover:border-foreground/20"}`}
          >
            <Brain className="h-3 w-3" strokeWidth={1.75} />
            AI Coach
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* Message */}
          <div className="p-4">
            {item.subject && (
              <div className="mb-2 text-[12px] font-semibold text-foreground">
                Subject: {item.subject}
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                {initials}
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-3">
                <p className="text-[13px] leading-relaxed text-foreground whitespace-pre-wrap">
                  {item.body || "No message content available"}
                </p>
              </div>
            </div>
          </div>

          {/* AI Coach panel */}
          {showCoach && (
            <div className="mx-4 mb-4 rounded-xl border border-brand/15 bg-brand/5 p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
                <span className="text-[11px] font-semibold text-foreground">AI Coach</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-1.5">
                  <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-brand" strokeWidth={1.75} />
                  <p className="text-[10.5px] leading-relaxed text-foreground/80">
                    This enquiry has been waiting {Math.round(item.waiting_hours)} hours.
                    {isUrgent && " It's now overdue — prioritise a prompt, apologetic response."}
                  </p>
                </div>
                <div className="flex items-start gap-1.5">
                  <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-brand" strokeWidth={1.75} />
                  <p className="text-[10.5px] leading-relaxed text-foreground/80">
                    Respond via {item.channel} — that's how the customer contacted you.
                  </p>
                </div>
                {isUrgent && (
                  <div className="flex items-start gap-1.5">
                    <Smile className="mt-0.5 h-3 w-3 shrink-0 text-brand" strokeWidth={1.75} />
                    <p className="text-[10.5px] leading-relaxed text-foreground/80">
                      Use a reassuring, apologetic tone for overdue replies.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply area */}
      <div className="border-t border-border p-4">
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          <button
            onClick={handleSuggest}
            className="flex items-center gap-1 rounded-lg border border-brand/30 bg-brand/5 px-2.5 py-1.5 text-[11px] font-semibold text-brand transition-all hover:bg-brand/10"
          >
            <Wand2 className="h-3 w-3" strokeWidth={1.75} />
            Suggest Reply
          </button>
          <button
            onClick={() => setReplyText((t) => t.split(". ")[0] + ".")}
            className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
          >
            <Minus className="h-3 w-3" strokeWidth={1.75} />
            Shorten
          </button>
        </div>

        <div className="relative">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${item.customer_name || "customer"} via ${item.channel}...`}
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-secondary/30 px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-card focus:outline-none"
          />
          {replyText && (
            <div className="absolute left-3 top-2.5 flex items-center gap-1 rounded-md bg-brand/10 px-1.5 py-0.5">
              <Brain className="h-2.5 w-2.5 text-brand" strokeWidth={1.75} />
              <span className="text-[9.5px] font-semibold text-brand">AI suggested</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[10.5px] text-muted-foreground">
            AI suggestion — always review before sending
          </span>
          <span className="text-[10.5px] text-muted-foreground">
            Use the Compose button to send a recorded reply
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── COMMUNICATION ANALYTICS ──────────────────────────────────────────────────

function CommunicationAnalytics({ metrics }: { metrics: CommunicationsMetrics | null }) {
  const m = metrics;
  const totalComms = m?.totalCommunications ?? 0;
  const hasData = !!m && totalComms > 0;

  const items = [
    {
      label: "Total Communications",
      value: totalComms > 0 ? String(totalComms) : null,
      suffix: "",
      hasData,
    },
    {
      label: "Inbound",
      value: m && m.totalInbound > 0 ? String(m.totalInbound) : null,
      suffix: "",
      hasData: m ? m.totalInbound > 0 : false,
    },
    {
      label: "Outbound",
      value: m && m.totalOutbound > 0 ? String(m.totalOutbound) : null,
      suffix: "",
      hasData: m ? m.totalOutbound > 0 : false,
    },
    {
      label: "Connected Channels",
      value: m ? String(m.connectedChannels) : null,
      suffix: "",
      hasData: !!m,
    },
    {
      label: "Avg Response Time",
      value: m?.avgResponseTimeMinutes !== null && m?.avgResponseTimeMinutes !== undefined ? String(m.avgResponseTimeMinutes) : null,
      suffix: "m",
      hasData: m?.avgResponseTimeMinutes !== null && m?.avgResponseTimeMinutes !== undefined,
    },
    {
      label: "Missed Opportunities",
      value: hasData ? String(m?.missedOpportunities ?? 0) : null,
      suffix: "",
      hasData,
    },
    {
      label: "Customer Satisfaction",
      value: m?.satisfactionPct !== null && m?.satisfactionPct !== undefined ? String(m.satisfactionPct) : null,
      suffix: "%",
      hasData: m?.satisfactionPct !== null && m?.satisfactionPct !== undefined,
    },
    {
      label: "Live Monitoring",
      value: m?.liveMonitoring ? "Active" : "Inactive",
      suffix: "",
      hasData: !!m,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Communication Analytics</span>
          <span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">All time</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        {items.map((a) => (
          <div key={a.label} className="rounded-xl bg-secondary/50 p-3.5">
            <div className="text-[10.5px] font-medium text-muted-foreground">{a.label}</div>
            {a.hasData && a.value !== null ? (
              <div className="mt-1 text-[18px] font-bold text-foreground">
                {a.value}{a.suffix}
              </div>
            ) : (
              <div className="mt-1 text-[14px] font-semibold text-muted-foreground/50">—</div>
            )}
          </div>
        ))}
      </div>
      {!hasData && (
        <div className="px-5 pb-5">
          <InsufficientDataBadge />
        </div>
      )}
    </div>
  );
}

// ─── COMMUNICATION SCORE ──────────────────────────────────────────────────────

function CommunicationScore({ metrics }: { metrics: CommunicationsMetrics | null }) {
  const score = metrics?.aiPriorityScore ?? null;
  const hasScore = score !== null;

  const breakdown = hasScore && metrics
    ? [
        { label: "Response Rate", score: Math.round((metrics.totalInbound > 0 ? Math.min(1, metrics.totalOutbound / metrics.totalInbound) : 0) * 100), color: "#E31B23" },
        { label: "Unread Handling", score: Math.round((metrics.totalInbound > 0 ? (1 - metrics.unreadMessages / metrics.totalInbound) : 1) * 100), color: "#10b981" },
        { label: "Customer Satisfaction", score: metrics.satisfactionPct ?? 0, color: "#3b82f6" },
        { label: "Channel Coverage", score: Math.min(100, metrics.connectedChannels * 20), color: "#f59e0b" },
      ]
    : [];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Communication Score™</span>
        </div>
      </div>
      <div className="p-5">
        {hasScore ? (
          <>
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={score as number} size={96} stroke={8} color="#E31B23" />
                <div className="text-center">
                  <div className="text-[11px] font-semibold text-foreground">
                    {(score as number) >= 80 ? "Excellent" : (score as number) >= 60 ? "Good" : (score as number) >= 40 ? "Fair" : "Needs Work"}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Based on {metrics?.totalCommunications ?? 0} communications</div>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {breakdown.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="w-36 shrink-0 text-[11.5px] text-muted-foreground">{s.label}</span>
                    <ProgressBar value={s.score} color={s.color} />
                    <span className="w-8 shrink-0 text-right text-[11px] font-semibold text-foreground">{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col items-center gap-2 py-4">
              <ScoreRing score={0} size={96} stroke={8} color="#6b7280" />
              <div className="text-center">
                <div className="text-[11px] font-semibold text-muted-foreground">No score yet</div>
                <div className="text-[10px] text-muted-foreground">Requires at least 5 communications</div>
              </div>
            </div>
            <InsufficientDataBadge label={`Insufficient data — ${metrics?.totalCommunications ?? 0} of 5 communications needed to calculate a score`} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMMUNICATION IMPACT ─────────────────────────────────────────────────────

function CommunicationImpact({ metrics }: { metrics: CommunicationsMetrics | null }) {
  const m = metrics;
  const hasData = !!m && m.totalCommunications > 0;

  const stats = [
    { label: "Total Conversations", value: m?.totalCommunications ?? 0, prefix: "", description: "All time" },
    { label: "Awaiting Reply", value: m?.awaitingReply ?? 0, prefix: "", description: "Needs your attention" },
    { label: "Missed Opportunities", value: m?.missedOpportunities ?? 0, prefix: "", description: "Overdue > 24 hours" },
    { label: "Channels Connected", value: m?.connectedChannels ?? 0, prefix: "", description: "Active integrations" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Communication Impact</span>
          <span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">Overview</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
            <div className="text-[10.5px] font-medium text-muted-foreground">{s.label}</div>
            <div className="mt-1.5 text-[20px] font-bold text-foreground">
              <AnimatedNumber value={s.value} prefix={s.prefix} />
            </div>
            <div className="mt-0.5 text-[10.5px] font-medium text-brand">{s.description}</div>
          </div>
        ))}
      </div>
      {!hasData && (
        <div className="px-5 pb-5">
          <InsufficientDataBadge />
        </div>
      )}
    </div>
  );
}

// ─── CHANNEL BREAKDOWN ────────────────────────────────────────────────────────

function ChannelBreakdown({ metrics }: { metrics: CommunicationsMetrics | null }) {
  const m = metrics;
  const hasData = !!m && m.totalCommunications > 0;

  // Calculate channel distribution from real metrics
  // Since we only have aggregate counts, we show a summary based on connected channels
  const channels = m && m.connectedChannels > 0
    ? Array.from({ length: m.connectedChannels }, (_, i) => ({
        name: `Channel ${i + 1}`,
        connected: true,
      }))
    : [];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Channel Breakdown</span>
        </div>
      </div>
      <div className="p-5">
        {hasData && m && m.connectedChannels > 0 ? (
          <div className="flex items-center gap-3 rounded-xl bg-secondary/40 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/10">
              <MessageSquare className="h-4 w-4 text-brand" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-foreground">
                {m.connectedChannels} {m.connectedChannels === 1 ? "channel" : "channels"} connected
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {m.totalInbound} inbound · {m.totalOutbound} outbound
                {m.liveMonitoring && " · Live sync active"}
              </div>
            </div>
          </div>
        ) : hasData ? (
          <div className="flex items-center gap-3 rounded-xl bg-secondary/40 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-foreground">No channels connected</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                Connect a communication platform in Settings to enable channel-level insights
              </div>
            </div>
          </div>
        ) : (
          <InsufficientDataBadge />
        )}
      </div>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────

export function CommunicationIntelligence() {
  const { business } = useAuthContext();
  const businessId = business?.id;

  const [metrics, setMetrics] = useState<CommunicationsMetrics | null>(null);
  const [awaitingReply, setAwaitingReply] = useState<AwaitingReplyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const loadData = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [m, items] = await Promise.all([
        fetchCommunicationsMetrics(businessId),
        fetchAwaitingReply(businessId),
      ]);
      setMetrics(m);
      setAwaitingReply(items);
    } catch (err) {
      console.error("[CommunicationIntelligence] load error:", err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen for communications mutations to refresh
  useEffect(() => {
    const unsub = appEvents.on(APP_EVENTS.COMMUNICATIONS_MUTATED, () => {
      loadData();
    });
    return unsub;
  }, [loadData]);

  // Clamp selected index
  useEffect(() => {
    if (selectedIndex >= awaitingReply.length && awaitingReply.length > 0) {
      setSelectedIndex(0);
    }
  }, [awaitingReply.length, selectedIndex]);

  const selectedItem = awaitingReply[selectedIndex] ?? null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand" strokeWidth={1.75} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <CommunicationIntelligenceHero metrics={metrics} />

      {/* AI Priority */}
      <TodaysPriorityCard
        awaitingReply={awaitingReply}
        metrics={metrics}
        onSelectConversation={(idx) => setSelectedIndex(idx)}
      />

      {/* Main workspace */}
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <ConversationList
          items={awaitingReply}
          selected={selectedIndex}
          onSelect={setSelectedIndex}
        />
        <ConversationDetail item={selectedItem} />
      </div>

      {/* Analytics row */}
      <CommunicationAnalytics metrics={metrics} />

      {/* Score + Impact */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CommunicationScore metrics={metrics} />
        <CommunicationImpact metrics={metrics} />
      </div>

      {/* Channel breakdown */}
      <ChannelBreakdown metrics={metrics} />
    </div>
  );
}
