import { useState, useEffect, useRef } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  Zap,
  Star,
  Sparkles,
  Award,
  Eye,
  Send,
  Wand as Wand2,
  Smile,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Calendar,
  BookOpen,
  Mic,
  Instagram,
  Globe,
  Plus,
  BarChart3,
  Lightbulb,
} from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";
import {
  getCommunications,
  markCommunicationAsRead,
  createCommunication,
} from "@/services/communications";
import {
  calculateCommunicationAnalytics,
  CommunicationAnalyticsResult,
} from "@/services/communicationAnalytics";
import { getCustomers } from "@/services/customers";
import { Communication, Customer } from "@/lib/database.types";
import { AIDisclosure } from "@/components/ui/AIDisclosure";

// ─── Animated Number ──────────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1000,
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
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[20px] font-bold leading-none text-foreground">{score}</span>
          <span className="text-[9px] text-muted-foreground">/ 100</span>
        </div>
      </div>
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
  Email: Mail,
  email: Mail,
  WhatsApp: MessageSquare,
  whatsapp: MessageSquare,
  SMS: MessageSquare,
  sms: MessageSquare,
  Phone: Phone,
  phone: Phone,
  Instagram: Instagram,
  "Web Chat": Globe,
  "Contact Form": BookOpen,
  Voicemail: Mic,
};

// ─── SENTIMENT CONFIG ─────────────────────────────────────────────────────────

const sentimentConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  "Very Happy": { color: "text-emerald-600", bg: "bg-emerald-50", icon: ThumbsUp },
  Positive: { color: "text-brand", bg: "bg-brand/10", icon: Smile },
  Neutral: { color: "text-muted-foreground", bg: "bg-secondary", icon: Minus },
  Frustrated: { color: "text-amber-600", bg: "bg-amber-50", icon: ThumbsDown },
  Urgent: { color: "text-orange-600", bg: "bg-orange-50", icon: Zap },
};

// ─── HERO ─────────────────────────────────────────────────────────────────────

function CommunicationIntelligenceHero({ analytics }: { analytics: CommunicationAnalyticsResult }) {
  const stats = [
    {
      label: "Total Messages",
      value: analytics.totalMessages,
      suffix: "",
      icon: MessageSquare,
    },
    {
      label: "Unread",
      value: analytics.unreadCount,
      suffix: "",
      icon: Clock,
    },
    {
      label: "Awaiting Reply",
      value: analytics.awaitingReplyCount,
      suffix: "",
      icon: Zap,
    },
    {
      label: "Avg Response",
      value: analytics.avgResponseTimeMinutes !== null ? analytics.avgResponseTimeMinutes : 0,
      suffix: analytics.avgResponseTimeMinutes !== null ? "m" : " N/A",
      icon: Clock,
    },
    {
      label: "Comm Score",
      value: analytics.communicationScore !== null ? analytics.communicationScore : 0,
      suffix: analytics.communicationScore !== null ? "/100" : " N/A",
      icon: Brain,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
      <div className="relative">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-brand" />
              Communication Intelligence™
            </div>
            <h2 className="text-[22px] font-bold leading-tight tracking-tight text-background">
              Workspace Communication Hub
            </h2>
            <p className="mt-1 text-[13px] text-background/65">
              Verified customer messages and evidence-based AI insights for your business.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold border ${
                analytics.hasSufficientData
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              Provenance: {analytics.provenance.type}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-col gap-1.5 rounded-xl bg-background/10 p-3">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-background/50" strokeWidth={1.75} />
                  <span className="text-[9.5px] font-medium text-background/55">{s.label}</span>
                </div>
                <span className="text-[20px] font-bold tracking-tight text-background">
                  {analytics.hasSufficientData ? (
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  ) : (
                    <span className="text-muted-foreground text-sm font-normal">No Data</span>
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

// ─── AI PRIORITY CARD ────────────────────────────────────────────────────────

function PriorityCard({
  analytics,
  communications,
  customers,
  businessId,
  onSelectComm,
}: {
  analytics: CommunicationAnalyticsResult;
  communications: Communication[];
  customers: Customer[];
  businessId: string;
  onSelectComm: (id: string) => void;
}) {
  const [explainOpen, setExplainOpen] = useState(false);

  // Find top priority communication (unread or inbound awaiting reply)
  const pendingComms = communications.filter((c) => c.direction === "inbound");
  const topComm = pendingComms[0];
  const topCustomer = topComm
    ? customers.find((cust) => cust.id === topComm.customer_id)
    : null;

  if (!analytics.hasSufficientData || !topComm) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
        <Brain className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
        <h3 className="text-sm font-semibold text-foreground">
          INSUFFICIENT DATA — AI Recommendation Suspended
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
          AI requires genuine workspace communications to generate evidence-based priority recommendations.
          Log a customer message or connect your channels below to activate AI priority analysis.
        </p>
      </div>
    );
  }

  const customerName = topCustomer
    ? `${topCustomer.first_name} ${topCustomer.last_name}`.trim()
    : "Customer";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/5 to-card shadow-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
            Evidence-Based AI Priority
          </span>
        </div>
      </div>

      <p className="text-[13.5px] leading-relaxed text-foreground">
        Priority attention recommended for <span className="font-semibold text-brand">{customerName}</span> via{" "}
        <span className="font-semibold">{topComm.channel}</span>.
        Received {new Date(topComm.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
      </p>

      <div className="mt-3 rounded-xl bg-card border border-border p-3 text-xs text-foreground/80">
        "{topComm.body}"
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => onSelectComm(topComm.id)}
          className="rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:bg-brand/90"
        >
          Open Conversation
        </button>
        <button
          onClick={() => setExplainOpen(!explainOpen)}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition-all hover:bg-secondary"
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
          Explain Why
          <ChevronDown className={`h-3 w-3 transition-transform ${explainOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {explainOpen && (
        <div className="mt-4">
          <AIDisclosure
            businessId={businessId}
            featureName="AI Communication Priority Recommendation"
            provenance={{
              type: "AI ANALYSIS",
              methodology: "Identified oldest unreplied inbound message from verified workspace communications.",
              evidenceCount: pendingComms.length,
              dataSources: ["communications table", "customers table"],
            }}
            evidenceSummary={`Selected message ID ${topComm.id} from customer ${customerName}. Direction: ${topComm.direction}, Channel: ${topComm.channel}.`}
            customerId={topComm.customer_id}
          />
        </div>
      )}
    </div>
  );
}

// ─── CONVERSATION LIST & DETAIL ────────────────────────────────────────────────

function CommunicationsWorkspace({
  communications,
  customers,
  businessId,
  selectedId,
  onSelectComm,
  onRefresh,
}: {
  communications: Communication[];
  customers: Customer[];
  businessId: string;
  selectedId: string | null;
  onSelectComm: (id: string) => void;
  onRefresh: () => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [showLogModal, setShowLogModal] = useState(false);
  const [newChannel, setNewChannel] = useState("Email");
  const [newDirection, setNewDirection] = useState("inbound");
  const [newBody, setNewBody] = useState("");
  const [newCustomerId, setNewCustomerId] = useState("");

  const selectedComm = communications.find((c) => c.id === selectedId) || communications[0];
  const selectedCustomer = selectedComm
    ? customers.find((cust) => cust.id === selectedComm.customer_id)
    : null;

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedComm || !businessId) return;
    try {
      await createCommunication({
        business_id: businessId,
        customer_id: selectedComm.customer_id,
        channel: selectedComm.channel,
        direction: "outbound",
        body: replyText,
      });
      await markCommunicationAsRead(selectedComm.id, businessId);
      setReplyText("");
      onRefresh();
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  const handleCreateNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBody.trim() || !businessId) return;
    try {
      await createCommunication({
        business_id: businessId,
        customer_id: newCustomerId || null,
        channel: newChannel,
        direction: newDirection,
        body: newBody,
      });
      setNewBody("");
      setShowLogModal(false);
      onRefresh();
    } catch (err) {
      console.error("Failed to create message:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-foreground">Verified Workspace Conversations</h3>
        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Log Communication
        </button>
      </div>

      {showLogModal && (
        <form onSubmit={handleCreateNewMessage} className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h4 className="text-xs font-semibold text-foreground">Log New Workspace Communication</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10.5px] font-medium text-muted-foreground block mb-1">Channel</label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
              >
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="SMS">SMS</option>
                <option value="Phone">Phone</option>
              </select>
            </div>
            <div>
              <label className="text-[10.5px] font-medium text-muted-foreground block mb-1">Direction</label>
              <select
                value={newDirection}
                onChange={(e) => setNewDirection(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
              >
                <option value="inbound">Inbound (from Customer)</option>
                <option value="outbound">Outbound (to Customer)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10.5px] font-medium text-muted-foreground block mb-1">Customer (Optional)</label>
            <select
              value={newCustomerId}
              onChange={(e) => setNewCustomerId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
            >
              <option value="">-- Unassigned --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name} ({c.email || c.phone || "No contact"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10.5px] font-medium text-muted-foreground block mb-1">Message Body</label>
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows={2}
              required
              placeholder="Enter message details..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowLogModal(false)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white"
            >
              Save Communication
            </button>
          </div>
        </form>
      )}

      {communications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
          <h3 className="text-sm font-semibold text-foreground">No Workspace Communications Recorded</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            Log an inbound or outbound customer message above to populate your workspace communication hub.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          {/* List */}
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            <div className="border-b border-border px-4 py-3 text-xs font-semibold text-foreground">
              Communication History ({communications.length})
            </div>
            <ul className="divide-y divide-border max-h-[500px] overflow-y-auto">
              {communications.map((c) => {
                const cust = customers.find((cu) => cu.id === c.customer_id);
                const name = cust ? `${cust.first_name} ${cust.last_name}` : "Customer";
                const isSelected = selectedComm?.id === c.id;

                return (
                  <li
                    key={c.id}
                    onClick={() => onSelectComm(c.id)}
                    className={`cursor-pointer px-4 py-3 transition-colors ${
                      isSelected ? "bg-brand/5 border-l-2 border-l-brand" : "hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground truncate">{c.body}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[9.5px] uppercase font-bold text-brand">{c.channel}</span>
                      <span className="text-[9.5px] text-muted-foreground">({c.direction})</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail */}
          {selectedComm && (
            <div className="rounded-2xl border border-border bg-card shadow-card p-5 space-y-4">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : "Customer"}
                  </h4>
                  <div className="text-xs text-muted-foreground">
                    Via {selectedComm.channel} ({selectedComm.direction}) · {new Date(selectedComm.created_at).toLocaleString()}
                  </div>
                </div>
                <span className="rounded-md bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase">
                  {selectedComm.sentiment || "Neutral"}
                </span>
              </div>

              <div className="rounded-xl bg-secondary/30 p-4 text-xs text-foreground leading-relaxed">
                {selectedComm.body}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-foreground block">Send Outbound Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  placeholder="Type your response..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send Reply
                  </button>
                </div>
              </div>

              <AIDisclosure
                businessId={businessId}
                featureName="Communication Record"
                provenance={{
                  type: "CONNECTED",
                  methodology: "Retrieved from genuine workspace record in Supabase communications table.",
                  evidenceCount: 1,
                  dataSources: ["communications table"],
                }}
                evidenceSummary={`Record ID: ${selectedComm.id}, Direction: ${selectedComm.direction}`}
                customerId={selectedComm.customer_id}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ANALYTICS & SCORE SECTION ────────────────────────────────────────────────

function AnalyticsAndScore({
  analytics,
  businessId,
}: {
  analytics: CommunicationAnalyticsResult;
  businessId: string;
}) {
  if (!analytics.hasSufficientData) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
        <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
        <h3 className="text-sm font-semibold text-foreground">
          INSUFFICIENT DATA — Communication Analytics & Score™ Suspended
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
          {analytics.insufficientDataReason}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Communication Score Card */}
      <div className="rounded-2xl border border-border bg-card shadow-card p-5">
        <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
          <Award className="h-4 w-4 text-brand" />
          <span className="text-[13.5px] font-semibold text-foreground">Communication Score™</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreRing score={analytics.communicationScore || 0} />

          <div className="flex-1 space-y-3 w-full">
            {analytics.scoreBreakdown.map((sb) => (
              <div key={sb.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{sb.label}</span>
                  <span className="font-bold text-foreground">{sb.score}/100</span>
                </div>
                <ProgressBar value={sb.score} color={sb.color} />
                <span className="text-[10px] text-muted-foreground">{sb.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <AIDisclosure
            businessId={businessId}
            featureName="Communication Score™ Calculation"
            provenance={analytics.provenance}
            evidenceSummary={`Derived from ${analytics.totalMessages} communication records.`}
          />
        </div>
      </div>

      {/* Channel Breakdown */}
      <div className="rounded-2xl border border-border bg-card shadow-card p-5">
        <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
          <MessageSquare className="h-4 w-4 text-brand" />
          <span className="text-[13.5px] font-semibold text-foreground">Channel Breakdown</span>
        </div>

        <div className="space-y-3">
          {analytics.channelBreakdown.map((cb) => {
            const Icon = channelIcon[cb.channel] || MessageSquare;
            return (
              <div key={cb.channel} className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{cb.channel}</span>
                    <span>{cb.count} messages ({cb.percentage}%)</span>
                  </div>
                  <ProgressBar value={cb.percentage} color="#3b82f6" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export function CommunicationIntelligence() {
  const { business } = useAuthContext();
  const businessId = business?.id || "workspace_default";

  const [communications, setCommunications] = useState<Communication[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [comms, custs] = await Promise.all([
        getCommunications(businessId),
        getCustomers(businessId),
      ]);
      setCommunications(comms);
      setCustomers(custs);
      if (comms.length > 0 && !selectedId) {
        setSelectedId(comms[0].id);
      }
    } catch (err) {
      console.error("Error loading communications workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [businessId]);

  const analytics = calculateCommunicationAnalytics(communications);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
        Loading verified workspace communication data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <CommunicationIntelligenceHero analytics={analytics} />

      {/* AI Priority Recommendation */}
      <PriorityCard
        analytics={analytics}
        communications={communications}
        customers={customers}
        businessId={businessId}
        onSelectComm={(id) => setSelectedId(id)}
      />

      {/* Workspace Conversations & Logging */}
      <CommunicationsWorkspace
        communications={communications}
        customers={customers}
        businessId={businessId}
        selectedId={selectedId}
        onSelectComm={(id) => setSelectedId(id)}
        onRefresh={loadData}
      />

      {/* Analytics & Communication Score */}
      <AnalyticsAndScore analytics={analytics} businessId={businessId} />
    </div>
  );
}
