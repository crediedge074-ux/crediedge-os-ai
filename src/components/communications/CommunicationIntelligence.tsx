import { useState, useEffect, useRef } from "react";
import { Brain, TrendingUp, TrendingDown, MessageSquare, Mail, Phone, Clock, ChevronDown, ChevronRight, Zap, Target, Star, Shield, Users, ArrowRight, Lightbulb, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, ChartBar as BarChart3, Gift, MessageCircle, Sparkles, Award, Eye, Send, RefreshCw, Wand as Wand2, Volume2, Smile, ThumbsUp, ThumbsDown, Minus, Calendar, CircleDollarSign, BookOpen, Mic, Instagram, Globe } from "lucide-react";

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
  Email: Mail,
  WhatsApp: MessageCircle,
  SMS: MessageSquare,
  Phone: Phone,
  Facebook: MessageSquare,
  Instagram: Instagram,
  "Web Chat": Globe,
  "Contact Form": BookOpen,
  Voicemail: Mic,
};

const channelColor: Record<string, string> = {
  Email: "bg-blue-50 text-blue-600",
  WhatsApp: "bg-emerald-50 text-emerald-600",
  SMS: "bg-purple-50 text-purple-600",
  Phone: "bg-amber-50 text-amber-600",
  Facebook: "bg-indigo-50 text-indigo-600",
  Instagram: "bg-pink-50 text-pink-600",
  "Web Chat": "bg-cyan-50 text-cyan-600",
  "Contact Form": "bg-orange-50 text-orange-600",
  Voicemail: "bg-rose-50 text-rose-600",
};

// ─── SENTIMENT CONFIG ─────────────────────────────────────────────────────────

type Sentiment = "Very Happy" | "Positive" | "Neutral" | "Frustrated" | "Urgent" | "At Risk";

const sentimentConfig: Record<Sentiment, { color: string; bg: string; icon: React.ElementType }> = {
  "Very Happy": { color: "text-emerald-600", bg: "bg-emerald-50", icon: ThumbsUp },
  Positive: { color: "text-brand", bg: "bg-brand/10", icon: Smile },
  Neutral: { color: "text-muted-foreground", bg: "bg-secondary", icon: Minus },
  Frustrated: { color: "text-amber-600", bg: "bg-amber-50", icon: ThumbsDown },
  Urgent: { color: "text-orange-600", bg: "bg-orange-50", icon: AlertTriangle },
  "At Risk": { color: "text-destructive", bg: "bg-destructive/10", icon: AlertTriangle },
};

// ─── PRIORITY CONFIG ──────────────────────────────────────────────────────────

type Priority = "Critical" | "High" | "Medium" | "Low";

const priorityConfig: Record<Priority, { dot: string; badge: string }> = {
  Critical: { dot: "bg-destructive animate-pulse", badge: "bg-destructive/10 text-destructive" },
  High: { dot: "bg-brand", badge: "bg-brand/10 text-brand" },
  Medium: { dot: "bg-amber-500", badge: "bg-amber-50 text-amber-600" },
  Low: { dot: "bg-muted-foreground/40", badge: "bg-secondary text-muted-foreground" },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const conversations = [
  {
    id: "1",
    name: "Sarah Johnson",
    initials: "SJ",
    channel: "Email",
    preview: "Hi, I wanted to follow up on the quote you sent last week. Is the price still valid?",
    time: "8m ago",
    waitingHours: 0.1,
    unread: true,
    priority: "Critical" as Priority,
    sentiment: "Urgent" as Sentiment,
    aiLabel: "Potential High Value Customer",
    estimatedRevenue: "£780",
    confidence: 94,
    responseDeadline: "Reply within 1 hour",
    customerHealth: 82,
    ltv: "£4,200",
    jobs: 7,
    lastContact: "9 days ago",
    aiSummary: "Sarah is requesting confirmation on a premium service quote. Lifetime spend £4,200. Books every 6–8 weeks. Has left two 5-star reviews. AI recommends offering a loyalty discount to convert — estimated value £780.",
    opportunity: "£780",
    timeline: [
      { type: "email", event: "Quote sent by you", date: "9 days ago" },
      { type: "booking", event: "Last service completed", date: "2 months ago", amount: "£490" },
      { type: "review", event: "Left 5-star review", date: "2 months ago" },
      { type: "booking", event: "Previous booking", date: "4 months ago", amount: "£380" },
    ],
    dna: {
      tone: "Professional",
      channel: "Email",
      bestTime: "Weekdays 9am–11am",
      replyTime: "< 2 hours",
      style: "Detail-oriented",
      sentiment: 78,
      strength: 82,
    },
    followUps: [
      { reason: "Quote expires in 24 hours", estimatedRevenue: "£780", bestTime: "Now", confidence: 94, message: "Hi Sarah, just following up on your quote. We'd love to get you booked in — I can also offer you a loyalty discount as a returning customer. Does Tuesday work for you?" },
    ],
    replies: [
      "Hi Sarah, of course! The quote is still valid. In fact, as a valued returning customer I can offer you a small loyalty discount. Would Tuesday morning work for you?",
      "Hi Sarah, thanks for following up. The quote remains valid. Shall I book you in for this week?",
    ],
  },
  {
    id: "2",
    name: "John Smith",
    initials: "JS",
    channel: "WhatsApp",
    preview: "Hi, I'd like to book my car in for a service next week if possible?",
    time: "2m ago",
    waitingHours: 0,
    unread: true,
    priority: "High" as Priority,
    sentiment: "Positive" as Sentiment,
    aiLabel: "Likely To Book",
    estimatedRevenue: "£420",
    confidence: 87,
    responseDeadline: "Reply within 3 hours",
    customerHealth: 74,
    ltv: "£1,240",
    jobs: 3,
    lastContact: "6 weeks ago",
    aiSummary: "John is ready to book a service. New customer with 3 previous jobs. Consistent 6-week booking cycle suggests high retention potential. WhatsApp is his preferred channel — respond there.",
    opportunity: "£420",
    timeline: [
      { type: "booking", event: "Service completed", date: "6 weeks ago", amount: "£420" },
      { type: "booking", event: "Previous service", date: "3 months ago", amount: "£380" },
    ],
    dna: {
      tone: "Friendly & casual",
      channel: "WhatsApp",
      bestTime: "Evenings 6pm–8pm",
      replyTime: "< 30 minutes",
      style: "Brief and direct",
      sentiment: 82,
      strength: 68,
    },
    followUps: [],
    replies: [
      "Hi John! Of course, we'd love to see you. We have Tuesday at 9am or Thursday at 2pm available. Which works best for you?",
      "Hi John! Great timing. We have availability next week — Tuesday or Thursday. Let me know what suits you!",
    ],
  },
  {
    id: "3",
    name: "Emily Clarke",
    initials: "EC",
    channel: "SMS",
    preview: "I've been waiting for a callback since this morning. Starting to get concerned...",
    time: "4h ago",
    waitingHours: 4,
    unread: true,
    priority: "Critical" as Priority,
    sentiment: "Frustrated" as Sentiment,
    aiLabel: "Likely To Leave",
    estimatedRevenue: "£290",
    confidence: 78,
    responseDeadline: "Reply IMMEDIATELY",
    customerHealth: 44,
    ltv: "£980",
    jobs: 2,
    lastContact: "3 weeks ago",
    aiSummary: "Emily has been waiting 4 hours with no response. Sentiment is deteriorating. Health score dropped 18 points. Risk of negative review is 67%. Immediate response with an apology and resolution is critical to retain this customer.",
    opportunity: "£290",
    timeline: [
      { type: "phone", event: "Missed call from Emily", date: "4 hours ago" },
      { type: "phone", event: "Missed call from Emily", date: "6 hours ago" },
      { type: "booking", event: "Last service", date: "3 weeks ago", amount: "£290" },
    ],
    dna: {
      tone: "Reassuring",
      channel: "SMS",
      bestTime: "Mornings 8am–10am",
      replyTime: "< 1 hour",
      style: "Direct, appreciates transparency",
      sentiment: 38,
      strength: 44,
    },
    followUps: [],
    replies: [
      "Hi Emily, I'm so sorry for the delayed response today — that's not the standard we aim for. I'm available right now if you'd like to call, or I can arrange a callback in the next 10 minutes. What would you prefer?",
      "Hi Emily, I apologise for the delay. Please call me directly on this number — I'll pick up immediately.",
    ],
  },
  {
    id: "4",
    name: "Marcus Williams",
    initials: "MW",
    channel: "WhatsApp",
    preview: "Everything was perfect as always! Would recommend to anyone.",
    time: "2h ago",
    waitingHours: 2,
    unread: false,
    priority: "High" as Priority,
    sentiment: "Very Happy" as Sentiment,
    aiLabel: "Review Opportunity",
    estimatedRevenue: "£340",
    confidence: 88,
    responseDeadline: "Reply within 6 hours",
    customerHealth: 94,
    ltv: "£3,100",
    jobs: 6,
    lastContact: "Today",
    aiSummary: "Marcus has just expressed very high satisfaction. This is the ideal moment to request a Google review and plant the seed for a referral. His loyalty score is 91% — a referral request here has an estimated 73% success rate.",
    opportunity: "£340",
    timeline: [
      { type: "booking", event: "Service completed (today)", date: "Today", amount: "£620" },
      { type: "review", event: "Left 5-star review", date: "3 months ago" },
      { type: "booking", event: "Previous service", date: "3 months ago", amount: "£517" },
    ],
    dna: {
      tone: "Warm & professional",
      channel: "WhatsApp",
      bestTime: "Tuesday–Thursday, 9am–11am",
      replyTime: "< 2 hours",
      style: "Quality-focused",
      sentiment: 94,
      strength: 91,
    },
    followUps: [
      { reason: "Review opportunity — very happy customer", estimatedRevenue: "£340", bestTime: "Within 2 hours", confidence: 88, message: "Hi Marcus, so glad to hear it — it was a pleasure as always! We'd really appreciate it if you had a moment to leave us a quick Google review. It means the world to a small business. Here's the link: [link]" },
    ],
    replies: [
      "Hi Marcus, thank you so much! It's always a pleasure. We'd love it if you had a moment to leave us a Google review — it really helps other customers find us. Here's the link! 🙏",
      "Marcus, thank you! That means a lot to us. Would you consider leaving a Google review? It takes 30 seconds and helps us hugely.",
    ],
  },
  {
    id: "5",
    name: "James Thompson",
    initials: "JT",
    channel: "Email",
    preview: "Can I get a quote for a full service and MOT on my BMW 5 Series?",
    time: "5h ago",
    waitingHours: 5,
    unread: true,
    priority: "High" as Priority,
    sentiment: "Neutral" as Sentiment,
    aiLabel: "Referral Opportunity",
    estimatedRevenue: "£650",
    confidence: 71,
    responseDeadline: "Reply within 8 hours",
    customerHealth: 88,
    ltv: "£5,600",
    jobs: 9,
    lastContact: "Yesterday",
    aiSummary: "James is your highest-LTV customer requesting a full-service quote. BMW 5 Series — premium tier. He has referred 2 customers previously. A comprehensive quote with a referral incentive included could generate additional pipeline.",
    opportunity: "£650",
    timeline: [
      { type: "email", event: "Quote request received", date: "5 hours ago" },
      { type: "booking", event: "Service completed", date: "Yesterday", amount: "£410" },
      { type: "booking", event: "Bundle deal purchased", date: "1 month ago", amount: "£780" },
      { type: "referral", event: "Referred Emily Clarke", date: "2 months ago" },
    ],
    dna: {
      tone: "Value-focused",
      channel: "Email",
      bestTime: "Monday & Friday, 12pm–2pm",
      replyTime: "< 4 hours",
      style: "Wants clear pricing, no jargon",
      sentiment: 71,
      strength: 79,
    },
    followUps: [],
    replies: [
      "Hi James, great to hear from you. For your BMW 5 Series, a full service + MOT would be £595. Given your loyalty, I can offer you a 10% returning customer discount — bringing it to £536. Shall I book you in?",
      "Hi James! Full service and MOT for your BMW 5 Series: £595. Available this week — Tuesday or Thursday. Want me to reserve a slot?",
    ],
  },
];

const analytics = [
  { label: "Avg Response Time", value: "18", suffix: " min", trend: "-4 min", up: true },
  { label: "Resolution Time", value: "2.4", suffix: "h", trend: "-0.6h", up: true },
  { label: "Conversations Closed", value: "47", suffix: "", trend: "+12", up: true },
  { label: "Revenue Generated", value: "£8,240", suffix: "", trend: "+£1,200", up: true },
  { label: "Bookings from Comms", value: "23", suffix: "", trend: "+5", up: true },
  { label: "Reviews Generated", value: "9", suffix: "", trend: "+3", up: true },
  { label: "Missed Opportunities", value: "3", suffix: "", trend: "-2", up: true },
  { label: "Customer Satisfaction", value: "94", suffix: "%", trend: "+2%", up: true },
];

const impactStats = [
  { label: "Revenue via Conversations", value: 8240, prefix: "£", description: "This month" },
  { label: "Customers Saved", value: 6, prefix: "", description: "Re-activation wins" },
  { label: "Negative Reviews Prevented", value: 4, prefix: "", description: "AI early warning" },
  { label: "Hours Saved by AI", value: 14, prefix: "", description: "Smart suggestions" },
];

const scoreBreakdown = [
  { label: "Response Time", score: 88, color: "#E31B23" },
  { label: "Sentiment Score", score: 81, color: "#10b981" },
  { label: "Customer Satisfaction", score: 94, color: "#3b82f6" },
  { label: "Consistency", score: 76, color: "#f59e0b" },
  { label: "Follow-up Rate", score: 69, color: "#8b5cf6" },
  { label: "Resolution Time", score: 83, color: "#06b6d4" },
];

// ─── HERO ─────────────────────────────────────────────────────────────────────

function CommunicationIntelligenceHero() {
  const stats = [
    { label: "Unread Messages", value: 8, suffix: "", icon: MessageSquare },
    { label: "Awaiting Reply", value: 5, suffix: "", icon: Clock },
    { label: "Avg Response Time", value: 18, suffix: "m", icon: Zap },
    { label: "AI Priority Score", value: 91, suffix: "", icon: Brain },
    { label: "Satisfaction", value: 94, suffix: "%", icon: Star },
    { label: "Missed Opps", value: 3, suffix: "", icon: AlertTriangle },
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
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[11px] font-semibold text-background/80">Live monitoring</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-background/10 px-3 py-2">
              <span className="text-[11px] font-semibold text-background/80">9 channels active</span>
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
                <span className="text-[20px] font-bold tracking-tight text-background">
                  <AnimatedNumber value={s.value} suffix={s.suffix} />
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

function TodaysPriorityCard({ onSelectConversation }: { onSelectConversation: (id: string) => void }) {
  const [explainOpen, setExplainOpen] = useState(false);
  const top = conversations[0];

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
          You have <span className="font-semibold">4 enquiries</span> worth approximately <span className="font-semibold text-brand">£2,300</span>. 2 customers have been waiting over 12 hours. 1 customer is showing frustration signals. AI recommends replying to{" "}
          <span className="font-semibold">{top.name}</span> first.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-2.5">
            <div>
              <div className="text-[10px] text-muted-foreground">Estimated Value</div>
              <div className="text-[18px] font-bold text-brand">{top.estimatedRevenue}</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-[10px] text-muted-foreground">Confidence</div>
              <div className="text-[18px] font-bold text-foreground">{top.confidence}%</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSelectConversation(top.id)}
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
                <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-brand">Why {top.name} first?</div>
                <p className="text-[12px] leading-relaxed text-foreground/80">{top.aiSummary}</p>
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
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <span className="text-[12px] font-semibold text-foreground">AI Priority Queue</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {conversations.length}
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground">Sorted by business impact</span>
      </div>

      <ul className="flex-1 divide-y divide-border overflow-y-auto">
        {conversations.map((c, rank) => {
          const ChanIcon = channelIcon[c.channel] ?? MessageSquare;
          const sentCfg = sentimentConfig[c.sentiment];
          const SentIcon = sentCfg.icon;
          const priCfg = priorityConfig[c.priority];
          const isSelected = selected === c.id;

          return (
            <li
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`group cursor-pointer px-4 py-3.5 transition-all duration-150 ${
                isSelected
                  ? "bg-brand/5 border-l-2 border-l-brand"
                  : "hover:bg-secondary/40 border-l-2 border-l-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
                    {c.initials}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${priCfg.dot}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className={`text-[12.5px] font-semibold ${c.unread ? "text-foreground" : "text-foreground/80"}`}>
                      {c.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{c.time}</span>
                  </div>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <ChanIcon className="h-2.5 w-2.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                    <span className="truncate text-[11px] text-muted-foreground">{c.preview}</span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${priCfg.badge}`}>
                      <span className={`h-1 w-1 rounded-full ${priCfg.dot.replace(" animate-pulse", "")}`} />
                      {c.priority}
                    </span>
                    <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-medium ${sentCfg.bg} ${sentCfg.color}`}>
                      <SentIcon className="h-2.5 w-2.5" strokeWidth={1.75} />
                      {c.sentiment}
                    </span>
                    <span className="ml-auto text-[10px] font-bold text-brand">{c.estimatedRevenue}</span>
                  </div>

                  <div className="mt-1 text-[10px] text-muted-foreground">
                    #{rank + 1} — {c.aiLabel}
                  </div>
                </div>

                {c.unread && (
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── CONVERSATION DETAIL ──────────────────────────────────────────────────────

function ConversationDetail({ conversation }: { conversation: (typeof conversations)[0] }) {
  const [replyText, setReplyText] = useState("");
  const [suggestedIdx, setSuggestedIdx] = useState<number | null>(null);
  const [showCoach, setShowCoach] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showDNA, setShowDNA] = useState(false);

  const sentCfg = sentimentConfig[conversation.sentiment];
  const SentIcon = sentCfg.icon;
  const ChanIcon = channelIcon[conversation.channel] ?? MessageSquare;

  const handleSuggest = () => {
    setSuggestedIdx(0);
    setReplyText(conversation.replies[0]);
  };

  const handleImprove = () => {
    if (conversation.replies[1]) {
      setSuggestedIdx(1);
      setReplyText(conversation.replies[1]);
    }
  };

  const timelineIcons: Record<string, React.ElementType> = {
    booking: Calendar, email: Mail, review: Star, phone: Phone, referral: Gift,
  };
  const timelineColors: Record<string, string> = {
    booking: "bg-brand/10 text-brand", email: "bg-blue-50 text-blue-600",
    review: "bg-emerald-50 text-emerald-600", phone: "bg-amber-50 text-amber-600",
    referral: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">
            {conversation.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-foreground">{conversation.name}</span>
              <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${sentCfg.bg} ${sentCfg.color}`}>
                <SentIcon className="h-2.5 w-2.5" strokeWidth={1.75} />
                {conversation.sentiment}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
              <ChanIcon className="h-3 w-3" strokeWidth={1.75} />
              <span>via {conversation.channel}</span>
              <span className="text-muted-foreground/30">·</span>
              <span>{conversation.time}</span>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-destructive font-medium">{conversation.responseDeadline}</span>
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
          <button className="rounded-lg bg-brand px-3.5 py-1.5 text-[12px] font-semibold text-white transition-all hover:bg-brand/90">
            Mark Done
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* AI Summary */}
          <div className="border-b border-border bg-secondary/30 p-4">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand/10">
                <Brain className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider text-brand">AI Summary</span>
                  <span className="text-[10px] font-bold text-brand">+{conversation.opportunity} opportunity</span>
                </div>
                <p className="text-[12px] leading-relaxed text-foreground/80">{conversation.aiSummary}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-card border border-border px-2 py-1 text-[10px] text-muted-foreground">
                    LTV: <span className="font-semibold text-foreground">{conversation.ltv}</span>
                  </span>
                  <span className="rounded-lg bg-card border border-border px-2 py-1 text-[10px] text-muted-foreground">
                    Jobs: <span className="font-semibold text-foreground">{conversation.jobs}</span>
                  </span>
                  <span className="rounded-lg bg-card border border-border px-2 py-1 text-[10px] text-muted-foreground">
                    Last: <span className="font-semibold text-foreground">{conversation.lastContact}</span>
                  </span>
                  <span className="rounded-lg bg-card border border-border px-2 py-1 text-[10px] text-muted-foreground">
                    Health: <span className="font-semibold text-brand">{conversation.customerHealth}/100</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                {conversation.initials}
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-3">
                <p className="text-[13px] leading-relaxed text-foreground">{conversation.preview}</p>
              </div>
            </div>
          </div>

          {/* Follow-up suggestions */}
          {conversation.followUps.length > 0 && (
            <div className="mx-4 mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
              <div className="mb-2 flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-amber-600" strokeWidth={1.75} />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-amber-600">Follow-up Suggested</span>
              </div>
              {conversation.followUps.map((f, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 text-[11.5px] text-amber-700">
                    <span className="font-medium">{f.reason}</span>
                    <span className="ml-auto font-bold">{f.estimatedRevenue}</span>
                    <span className="text-amber-600/70">·</span>
                    <span>{f.confidence}% confidence</span>
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-amber-800/80 italic">"{f.message}"</p>
                  <button
                    onClick={() => setReplyText(f.message)}
                    className="mt-2 rounded-lg bg-amber-500 px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-amber-600"
                  >
                    Use This Message
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Timeline toggle */}
          <div className="px-4 pb-2">
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="flex w-full items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary/40"
            >
              <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
              Customer Timeline
              <ChevronDown className={`ml-auto h-3.5 w-3.5 transition-transform duration-200 ${showTimeline ? "rotate-180" : ""}`} />
            </button>
            {showTimeline && (
              <div className="mt-2 space-y-2">
                {conversation.timeline.map((item, idx) => {
                  const Icon = timelineIcons[item.type] ?? Calendar;
                  return (
                    <div key={idx} className="flex items-center gap-3 rounded-xl bg-secondary/40 px-3.5 py-2.5">
                      <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${timelineColors[item.type] ?? "bg-secondary text-muted-foreground"}`}>
                        <Icon className="h-3 w-3" strokeWidth={1.75} />
                      </div>
                      <span className="flex-1 text-[11.5px] text-foreground">{item.event}</span>
                      <span className="text-[10.5px] text-muted-foreground">{item.date}</span>
                      {"amount" in item && item.amount && (
                        <span className="text-[11px] font-bold text-brand">{item.amount}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Comm DNA toggle */}
          <div className="px-4 pb-4">
            <button
              onClick={() => setShowDNA(!showDNA)}
              className="flex w-full items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary/40"
            >
              <Brain className="h-3.5 w-3.5" strokeWidth={1.75} />
              Communication DNA™
              <ChevronDown className={`ml-auto h-3.5 w-3.5 transition-transform duration-200 ${showDNA ? "rotate-180" : ""}`} />
            </button>
            {showDNA && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  ["Preferred Tone", conversation.dna.tone],
                  ["Preferred Channel", conversation.dna.channel],
                  ["Best Time", conversation.dna.bestTime],
                  ["Reply Time", conversation.dna.replyTime],
                  ["Style", conversation.dna.style],
                  ["Sentiment Score", `${conversation.dna.sentiment}%`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-secondary/50 p-2.5">
                    <div className="text-[9.5px] font-medium text-muted-foreground">{k}</div>
                    <div className="mt-0.5 text-[11.5px] font-semibold text-foreground">{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Coach panel */}
        {showCoach && (
          <div className="w-56 shrink-0 border-l border-border bg-secondary/20 p-4 overflow-y-auto">
            <div className="mb-3 flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
              <span className="text-[11px] font-semibold text-foreground">AI Coach</span>
            </div>
            <div className="space-y-2.5">
              {[
                { tip: `${conversation.name} responds better to ${conversation.dna.style.toLowerCase()} messages.`, icon: Lightbulb },
                { tip: `Best contact time: ${conversation.dna.bestTime}.`, icon: Clock },
                { tip: `Preferred channel: ${conversation.dna.channel}. Use it.`, icon: MessageSquare },
                { tip: `Relationship strength: ${conversation.dna.strength}/100. ${conversation.dna.strength > 70 ? "Strong bond — be warm." : "Needs nurturing."}`, icon: Heart },
                { tip: conversation.sentiment === "Frustrated" || conversation.sentiment === "At Risk" ? "Use a reassuring, apologetic tone. Avoid excuses." : "Tone is positive — match their energy.", icon: Smile },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="rounded-xl bg-brand/5 border border-brand/10 p-2.5">
                    <div className="flex items-start gap-1.5">
                      <Icon className="mt-0.5 h-3 w-3 shrink-0 text-brand" strokeWidth={1.75} />
                      <p className="text-[10.5px] leading-relaxed text-foreground/80">{item.tip}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Reply area */}
      <div className="border-t border-border p-4">
        {/* Smart Reply Buttons */}
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          <button
            onClick={handleSuggest}
            className="flex items-center gap-1 rounded-lg border border-brand/30 bg-brand/5 px-2.5 py-1.5 text-[11px] font-semibold text-brand transition-all hover:bg-brand/10"
          >
            <Wand2 className="h-3 w-3" strokeWidth={1.75} />
            Suggest Reply
          </button>
          {[
            { label: "Improve", icon: RefreshCw, action: handleImprove },
            { label: "Shorten", icon: Minus, action: () => setReplyText(replyText.split(". ")[0] + ".") },
            { label: "More Professional", icon: Award, action: () => {} },
            { label: "Friendlier", icon: Smile, action: () => {} },
            { label: "Summarise", icon: BookOpen, action: () => {} },
          ].map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.label}
                onClick={btn.action}
                className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
              >
                <Icon className="h-3 w-3" strokeWidth={1.75} />
                {btn.label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${conversation.name} via ${conversation.channel}...`}
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-secondary/30 px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-card focus:outline-none"
          />
          {suggestedIdx !== null && (
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
          <button className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:bg-brand/90 hover:shadow-md">
            <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMMUNICATION ANALYTICS ──────────────────────────────────────────────────

function CommunicationAnalytics() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Communication Analytics</span>
          <span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">This month</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        {analytics.map((a) => (
          <div key={a.label} className="rounded-xl bg-secondary/50 p-3.5">
            <div className="text-[10.5px] font-medium text-muted-foreground">{a.label}</div>
            <div className="mt-1 text-[18px] font-bold text-foreground">
              {a.value}{a.suffix}
            </div>
            <div className={`mt-0.5 flex items-center gap-1 text-[10.5px] font-semibold ${a.up ? "text-brand" : "text-destructive"}`}>
              {a.up ? <TrendingUp className="h-2.5 w-2.5" strokeWidth={2} /> : <TrendingDown className="h-2.5 w-2.5" strokeWidth={2} />}
              {a.trend} vs last month
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMMUNICATION SCORE ──────────────────────────────────────────────────────

function CommunicationScore() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Communication Score™</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={83} size={96} stroke={8} color="#E31B23" />
            <div className="text-center">
              <div className="text-[11px] font-semibold text-foreground">Excellent</div>
              <div className="text-[10px] text-muted-foreground">Top 15% of businesses</div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {scoreBreakdown.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="w-36 shrink-0 text-[11.5px] text-muted-foreground">{s.label}</span>
                <ProgressBar value={s.score} color={s.color} />
                <span className="w-8 shrink-0 text-right text-[11px] font-semibold text-foreground">{s.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-brand/5 border border-brand/15 p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Lightbulb className="h-3 w-3 text-brand" strokeWidth={1.75} />
            <span className="text-[10.5px] font-semibold text-brand">How to reach 90+</span>
          </div>
          <p className="text-[11.5px] leading-relaxed text-foreground/80">
            Your response time is strong (88). Biggest gain: improve your follow-up rate from 69 to 85+ by acting on AI-suggested follow-ups within 24 hours. This alone would add +6 points to your score.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── COMMUNICATION IMPACT ─────────────────────────────────────────────────────

function CommunicationImpact() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Communication Impact</span>
          <span className="ml-auto rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">This Month</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5">
        {impactStats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
            <div className="text-[10.5px] font-medium text-muted-foreground">{s.label}</div>
            <div className="mt-1.5 text-[20px] font-bold text-foreground">
              <AnimatedNumber value={s.value} prefix={s.prefix} />
            </div>
            <div className="mt-0.5 text-[10.5px] font-medium text-brand">{s.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHANNEL BREAKDOWN ────────────────────────────────────────────────────────

function ChannelBreakdown() {
  const channels = [
    { name: "WhatsApp", messages: 34, revenue: "£3,200", response: "14m", color: "#10b981" },
    { name: "Email", messages: 28, revenue: "£2,900", response: "22m", color: "#3b82f6" },
    { name: "Phone", messages: 19, revenue: "£1,800", response: "Immediate", color: "#f59e0b" },
    { name: "SMS", messages: 14, revenue: "£960", response: "18m", color: "#8b5cf6" },
    { name: "Web Chat", messages: 8, revenue: "£480", response: "11m", color: "#06b6d4" },
    { name: "Instagram", messages: 5, revenue: "£220", response: "31m", color: "#ec4899" },
  ];

  const total = channels.reduce((s, c) => s + c.messages, 0);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Channel Breakdown</span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {channels.map((ch) => {
          const Icon = channelIcon[ch.name] ?? MessageSquare;
          const pct = Math.round((ch.messages / total) * 100);
          return (
            <div key={ch.name} className="flex items-center gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${ch.color}18` }}>
                <Icon className="h-3.5 w-3.5" style={{ color: ch.color }} strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-foreground">{ch.name}</span>
                  <span className="text-[11px] font-bold text-foreground">{ch.revenue}</span>
                </div>
                <ProgressBar value={pct} color={ch.color} />
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{ch.messages} messages</span>
                  <span className="text-muted-foreground/30">·</span>
                  <span>Avg response: {ch.response}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BUSINESS DNA PREVIEW ─────────────────────────────────────────────────────

function BusinessDNAPreview() {
  const modules = [
    { name: "Relationship DNA™", pct: 94, done: true },
    { name: "Communication Intelligence™", pct: 83, done: true },
    { name: "Website DNA™", pct: 72, done: false },
    { name: "Revenue DNA™", pct: 80, done: false },
    { name: "Marketing DNA™", pct: 68, done: false },
    { name: "Operations DNA™", pct: 76, done: false },
    { name: "Finance DNA™", pct: 71, done: false },
    { name: "Automation DNA™", pct: 58, done: false },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-brand/30 bg-gradient-to-r from-brand/5 to-transparent p-5">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">Business DNA™</span>
          <span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">Preview</span>
        </div>
        <p className="mb-4 max-w-lg text-[12px] leading-relaxed text-muted-foreground">
          Communication Intelligence™ contributes to your overall CrediEdge Score™. Every module adds to one unified business intelligence profile.
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {modules.map((m) => (
            <div key={m.name} className={`rounded-xl border p-3 ${m.done ? "border-brand/20 bg-brand/5" : "border-border bg-card"}`}>
              <div className="mb-1.5 flex items-center justify-between gap-1">
                <span className="text-[10px] font-semibold text-foreground truncate">{m.name}</span>
                {m.done ? (
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-brand" strokeWidth={2} />
                ) : (
                  <span className="shrink-0 text-[9px] text-muted-foreground">Soon</span>
                )}
              </div>
              <ProgressBar value={m.pct} color={m.done ? "#E31B23" : "#6b7280"} />
              <div className={`mt-1 text-[10px] font-semibold ${m.done ? "text-brand" : "text-muted-foreground"}`}>{m.pct}/100</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────

export function CommunicationIntelligence() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const conversation = conversations.find((c) => c.id === selectedId)!;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <CommunicationIntelligenceHero />

      {/* AI Priority */}
      <TodaysPriorityCard onSelectConversation={setSelectedId} />

      {/* Main workspace */}
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <ConversationList selected={selectedId} onSelect={setSelectedId} />
        <ConversationDetail conversation={conversation} />
      </div>

      {/* Analytics row */}
      <CommunicationAnalytics />

      {/* Score + Impact */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CommunicationScore />
        <CommunicationImpact />
      </div>

      {/* Channel breakdown */}
      <ChannelBreakdown />

      {/* Business DNA preview */}
      <BusinessDNAPreview />
    </div>
  );
}
