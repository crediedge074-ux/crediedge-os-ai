import { useState, useEffect, useRef } from "react";
import {
  Brain,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  Zap,
  Star,
  Eye,
  Send,
  Sparkles,
  Award,
  MessageCircle,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Inbox,
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  getCommunications,
  getCommunicationHeaderMetrics,
  markCommunicationAsRead,
  createCommunication,
  type CommunicationHeaderMetrics,
} from "@/services/communications";
import { getCustomers } from "@/services/customers";
import type { Communication, Customer } from "@/lib/database.types";
import { toast } from "sonner";

// ─── Animated Number / Value ──────────────────────────────────────────────────

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number | string;
  prefix?: string;
  suffix?: string;
}) {
  if (typeof value === "string") {
    return <span>{value}</span>;
  }
  return (
    <span>
      {value.toLocaleString()}
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
  score: number | null;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<SVGSVGElement>(null);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated && score !== null ? score / 100 : 0) * circ;

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
  }, [score]);

  return (
    <div className="relative inline-flex flex-col items-center gap-1">
      <div className="relative">
        <svg ref={ref} width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-border"
          />
          {score !== null && (
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
              style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center">
          {score !== null ? (
            <>
              <span className="text-[20px] font-bold leading-none text-foreground">{score}</span>
              <span className="text-[9px] text-muted-foreground">/ 100</span>
            </>
          ) : (
            <span className="text-[9.5px] font-bold uppercase leading-tight text-muted-foreground">
              NO DATA
            </span>
          )}
        </div>
      </div>
      {label && <span className="text-[10.5px] font-medium text-muted-foreground">{label}</span>}
    </div>
  );
}

// ─── CHANNEL ICON MAP ─────────────────────────────────────────────────────────

const channelIcon: Record<string, React.ElementType> = {
  email: Mail,
  whatsapp: MessageCircle,
  sms: MessageSquare,
  phone: Phone,
  note: Inbox,
};

// ─── HERO COMPONENT ───────────────────────────────────────────────────────────

function CommunicationIntelligenceHero({
  metrics,
  loading,
}: {
  metrics: CommunicationHeaderMetrics | null;
  loading: boolean;
}) {
  const stats = [
    {
      label: "Unread Messages",
      value: metrics ? metrics.unreadMessagesCount : 0,
      suffix: "",
      icon: MessageSquare,
    },
    {
      label: "Awaiting Reply",
      value: metrics ? metrics.awaitingReplyCount : 0,
      suffix: "",
      icon: Clock,
    },
    {
      label: "Avg Response Time",
      value:
        metrics && metrics.avgResponseTimeMinutes !== null
          ? `${metrics.avgResponseTimeMinutes}m`
          : "INSUFFICIENT DATA",
      icon: Zap,
    },
    {
      label: "AI Priority Score",
      value:
        metrics && metrics.aiPriorityScore !== null
          ? metrics.aiPriorityScore
          : "INSUFFICIENT DATA",
      icon: Brain,
    },
    {
      label: "Satisfaction",
      value:
        metrics && metrics.satisfactionPercentage !== null
          ? `${metrics.satisfactionPercentage}%`
          : "INSUFFICIENT DATA",
      icon: Star,
    },
    {
      label: "Missed Opps",
      value: metrics ? metrics.missedOpportunitiesCount : 0,
      icon: AlertTriangle,
    },
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
            <div className="flex items-center gap-1.5 rounded-xl bg-background/10 px-3 py-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  metrics?.liveMonitoringState === "Live"
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-[11px] font-semibold text-background/80">
                {metrics ? metrics.liveMonitoringState : "Manual Mode"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-background/10 px-3 py-2">
              <span className="text-[11px] font-semibold text-background/80">
                {metrics ? `${metrics.connectedChannelsCount} channels active` : "0 channels active"}
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
                <span className="text-[15px] sm:text-[18px] font-bold tracking-tight text-background truncate">
                  {loading ? (
                    "..."
                  ) : (
                    <AnimatedNumber value={s.value} suffix={"suffix" in s ? s.suffix : ""} />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TODAY'S PRIORITY CARD ────────────────────────────────────────────────────

function TodaysPriorityCard({
  comms,
  customers,
  onOpenCompose,
}: {
  comms: Communication[];
  customers: Customer[];
  onOpenCompose: () => void;
}) {
  const [explainOpen, setExplainOpen] = useState(false);

  const unrepliedComms = comms.filter((c) => c.direction === "inbound" && !c.read_at);
  const topComm = unrepliedComms[0];
  const topCustomer = topComm
    ? customers.find((c) => c.id === topComm.customer_id)
    : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/5 to-card shadow-card">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/10 blur-2xl" />
      <div className="relative p-5">
        <div className="mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
            AI Recommendation
          </span>
        </div>

        {topComm && topCustomer ? (
          <div>
            <p className="text-[13.5px] leading-relaxed text-foreground">
              You have <span className="font-semibold">{unrepliedComms.length} unread enquiry</span> requiring response. AI recommends replying to{" "}
              <span className="font-semibold text-brand">
                {topCustomer.full_name || topCustomer.first_name}
              </span>{" "}
              first ({topComm.channel.toUpperCase()}).
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenCompose}
                className="rounded-xl bg-brand px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:bg-brand/90 hover:shadow-md"
              >
                Open Composer
              </button>
              <button
                onClick={() => setExplainOpen(!explainOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-[12.5px] font-semibold text-foreground transition-all hover:border-foreground/20 hover:bg-secondary"
              >
                <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
                Explain Why
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${
                    explainOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {explainOpen && (
              <div className="mt-4 rounded-xl bg-brand/5 border border-brand/15 p-4">
                <div className="flex items-start gap-2.5">
                  <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
                  <div>
                    <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-brand">
                      Why {topCustomer.first_name || topCustomer.full_name}?
                    </div>
                    <p className="text-[12px] leading-relaxed text-foreground/80">
                      Inbound enquiry received on {new Date(topComm.created_at).toLocaleDateString()}. Reaching out promptly increases conversion likelihood and customer retention.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-[13.5px] leading-relaxed text-foreground/80">
              No urgent unreplied customer enquiries currently logged in this workspace. All conversations are up to date.
            </p>
            <button
              onClick={onOpenCompose}
              className="rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:bg-brand/90"
            >
              Compose New Communication
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CONVERSATION LIST & DETAIL ───────────────────────────────────────────────

function CommunicationWorkspace({
  comms,
  customers,
  onRefresh,
  onOpenCompose,
}: {
  comms: Communication[];
  customers: Customer[];
  onRefresh: () => void;
  onOpenCompose: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(comms[0]?.id || "");
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (comms.length > 0 && !selectedId) {
      setSelectedId(comms[0].id);
    }
  }, [comms]);

  const selectedComm = comms.find((c) => c.id === selectedId) || comms[0];
  const selectedCustomer = selectedComm
    ? customers.find((c) => c.id === selectedComm.customer_id)
    : null;

  const handleMarkRead = async (comm: Communication) => {
    if (comm.read_at) return;
    try {
      await markCommunicationAsRead(comm.id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReplyNote = async () => {
    if (!replyText.trim() || !selectedComm?.business_id) return;
    setIsSubmitting(true);
    try {
      await createCommunication({
        business_id: selectedComm.business_id,
        customer_id: selectedComm.customer_id,
        channel: selectedComm.channel,
        direction: "outbound",
        body: replyText,
      });
      toast.success("Outbound communication recorded");
      setReplyText("");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (comms.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <Inbox className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" strokeWidth={1.5} />
        <h3 className="text-[16px] font-bold text-foreground">No Communications Recorded</h3>
        <p className="mt-1 text-[13px] text-muted-foreground max-w-md mx-auto">
          Your workspace does not have any recorded communications yet. Use the Compose button to start a new message or log customer interaction notes.
        </p>
        <button
          onClick={onOpenCompose}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm hover:bg-brand/90 transition-all"
        >
          <Send className="h-3.5 w-3.5" />
          Compose Communication
        </button>
      </div>
    );
  }

  const ChanIcon = channelIcon[selectedComm?.channel || "email"] || Mail;

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      {/* List */}
      <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <span className="text-[12px] font-semibold text-foreground">Workspace Communications</span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
            {comms.length}
          </span>
        </div>

        <ul className="flex-1 divide-y divide-border overflow-y-auto max-h-[500px]">
          {comms.map((c) => {
            const cust = customers.find((cu) => cu.id === c.customer_id);
            const isSelected = selectedId === c.id;
            const CIcon = channelIcon[c.channel] || Mail;

            return (
              <li
                key={c.id}
                onClick={() => {
                  setSelectedId(c.id);
                  handleMarkRead(c);
                }}
                className={`group cursor-pointer px-4 py-3.5 transition-all duration-150 ${
                  isSelected
                    ? "bg-brand/5 border-l-2 border-l-brand"
                    : "hover:bg-secondary/40 border-l-2 border-l-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                    {cust?.first_name ? cust.first_name[0] : "C"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[12px] font-semibold text-foreground truncate">
                        {cust ? cust.full_name || cust.first_name : "Customer"}
                      </span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <CIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <span className="truncate text-[11px] text-muted-foreground">{c.body}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[9.5px] uppercase font-bold text-muted-foreground">
                      <span
                        className={`px-1.5 py-0.5 rounded-md ${
                          c.direction === "inbound"
                            ? "bg-blue-50 text-blue-700"
                            : c.direction === "internal_note"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {c.direction}
                      </span>
                      <span>· {c.channel}</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Detail */}
      {selectedComm && (
        <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card p-5">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">
                {selectedCustomer?.first_name ? selectedCustomer.first_name[0] : "C"}
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  {selectedCustomer
                    ? selectedCustomer.full_name || selectedCustomer.first_name
                    : "Customer"}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <ChanIcon className="h-3 w-3" />
                  <span>via {selectedComm.channel.toUpperCase()}</span>
                  <span>·</span>
                  <span>{new Date(selectedComm.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                selectedComm.direction === "inbound"
                  ? "bg-blue-100 text-blue-800"
                  : selectedComm.direction === "internal_note"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {selectedComm.direction}
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {selectedComm.subject && (
              <div className="text-[13px] font-bold text-foreground">
                Subject: {selectedComm.subject}
              </div>
            )}
            <div className="rounded-xl bg-secondary/40 p-4 text-[13px] leading-relaxed text-foreground">
              {selectedComm.body}
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <label className="block text-[11.5px] font-semibold text-foreground mb-1">
              Log Outbound Reply / Internal Note
            </label>
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${
                selectedCustomer?.first_name || "customer"
              }...`}
              className="w-full resize-none rounded-xl border border-border bg-secondary/30 p-3 text-[12.5px] text-foreground focus:border-foreground/20 focus:outline-none"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleSendReplyNote}
                disabled={isSubmitting || !replyText.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-brand/90 transition-all disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                Record Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMMUNICATION ANALYTICS ──────────────────────────────────────────────────

function CommunicationAnalytics({
  metrics,
}: {
  metrics: CommunicationHeaderMetrics | null;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
            Communication Analytics
          </span>
          <span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
            Authoritative Workspace Data
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        {[
          {
            label: "Avg Response Time",
            value:
              metrics && metrics.avgResponseTimeMinutes !== null
                ? `${metrics.avgResponseTimeMinutes} min`
                : "INSUFFICIENT DATA",
          },
          {
            label: "Unread Messages",
            value: metrics ? metrics.unreadMessagesCount : 0,
          },
          {
            label: "Awaiting Reply",
            value: metrics ? metrics.awaitingReplyCount : 0,
          },
          {
            label: "Satisfaction Rate",
            value:
              metrics && metrics.satisfactionPercentage !== null
                ? `${metrics.satisfactionPercentage}%`
                : "INSUFFICIENT DATA",
          },
        ].map((a) => (
          <div key={a.label} className="rounded-xl bg-secondary/50 p-3.5">
            <div className="text-[10.5px] font-medium text-muted-foreground">{a.label}</div>
            <div className="mt-1 text-[16px] sm:text-[18px] font-bold text-foreground">
              {a.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMMUNICATION SCORE ──────────────────────────────────────────────────────

function CommunicationScore({
  metrics,
}: {
  metrics: CommunicationHeaderMetrics | null;
}) {
  const score = metrics ? metrics.aiPriorityScore : null;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
            Communication Score™
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col items-center gap-4 text-center">
        <ScoreRing score={score} size={96} stroke={8} color="#E31B23" />
        <div>
          <div className="text-[12px] font-bold text-foreground">
            {score !== null ? `${score} / 100 Score` : "INSUFFICIENT DATA"}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground max-w-xs">
            {score !== null
              ? "Communication priority score evaluated from genuine unreplied messages & response SLAs."
              : "Insufficient communication volume to calculate an authoritative priority score."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── COMMUNICATION IMPACT ─────────────────────────────────────────────────────

function CommunicationImpact({
  metrics,
}: {
  metrics: CommunicationHeaderMetrics | null;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
            Communication Impact
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[10.5px] font-medium text-muted-foreground">
            Active Unreplied Enquiries
          </div>
          <div className="mt-1 text-[20px] font-bold text-foreground">
            {metrics ? metrics.awaitingReplyCount : 0}
          </div>
          <div className="mt-0.5 text-[10.5px] font-medium text-brand">
            Requiring workspace attention
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[10.5px] font-medium text-muted-foreground">
            Satisfaction Rating
          </div>
          <div className="mt-1 text-[20px] font-bold text-foreground">
            {metrics && metrics.satisfactionPercentage !== null
              ? `${metrics.satisfactionPercentage}%`
              : "INSUFFICIENT DATA"}
          </div>
          <div className="mt-0.5 text-[10.5px] font-medium text-brand">
            From genuine workspace reviews
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BUSINESS DNA PREVIEW ─────────────────────────────────────────────────────

function BusinessDNAPreview() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-brand/30 bg-gradient-to-r from-brand/5 to-transparent p-5">
      <div className="relative">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
            Business DNA™ Integration
          </span>
        </div>
        <p className="text-[12px] leading-relaxed text-muted-foreground max-w-lg">
          Communication Intelligence™ feeds genuine workspace response SLAs and customer interaction signals directly into your overall CrediEdge Score™.
        </p>
      </div>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────

export function CommunicationIntelligence({
  onOpenCompose,
}: {
  onOpenCompose?: () => void;
}) {
  const { business } = useAuthContext();
  const [metrics, setMetrics] = useState<CommunicationHeaderMetrics | null>(null);
  const [comms, setComms] = useState<Communication[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!business?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [m, cList, custs] = await Promise.all([
        getCommunicationHeaderMetrics(business.id),
        getCommunications(business.id),
        getCustomers(business.id),
      ]);
      setMetrics(m);
      setComms(cList);
      setCustomers(custs);
    } catch (err) {
      console.error("Failed to load communication intelligence data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [business?.id]);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <CommunicationIntelligenceHero metrics={metrics} loading={loading} />

      {/* AI Priority Recommendation */}
      <TodaysPriorityCard
        comms={comms}
        customers={customers}
        onOpenCompose={onOpenCompose || (() => {})}
      />

      {/* Communication Workspace */}
      <CommunicationWorkspace
        comms={comms}
        customers={customers}
        onRefresh={loadData}
        onOpenCompose={onOpenCompose || (() => {})}
      />

      {/* Analytics row */}
      <CommunicationAnalytics metrics={metrics} />

      {/* Score + Impact */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CommunicationScore metrics={metrics} />
        <CommunicationImpact metrics={metrics} />
      </div>

      {/* Business DNA preview */}
      <BusinessDNAPreview />
    </div>
  );
}
