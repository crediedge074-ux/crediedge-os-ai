import { useState, useEffect, useRef } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Star,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Zap,
  Target,
  Shield,
  Users,
  ArrowRight,
  Lightbulb,
  CircleCheck as CheckCircle2,
  TriangleAlert as AlertTriangle,
  ChartBar as BarChart3,
  Gift,
  Sparkles,
  Award,
  Eye,
  Send,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Calendar,
  CircleDollarSign,
  Globe,
  ExternalLink,
  TrendingUp as TrendUp,
  Clock,
  Megaphone,
  Heart,
} from "lucide-react";

// ─── Animated Number ──────────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1200,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
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
            setDisplay(eased * value);
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
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({
  score,
  size = 80,
  stroke = 7,
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
    <svg ref={ref} width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, color = "#E31B23", delay = 0 }: { value: number; color?: string; delay?: number }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setW(value), delay + 100);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${w}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Star Row ─────────────────────────────────────────────────────────────────

function StarRow({ rating, filled = true }: { rating: number; filled?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? (filled ? "fill-brand text-brand" : "fill-amber-400 text-amber-400") : "text-border"}`}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

// ─── SOURCE CONFIG ────────────────────────────────────────────────────────────

const sourceColor: Record<string, string> = {
  Google: "bg-blue-50 text-blue-600",
  Facebook: "bg-indigo-50 text-indigo-600",
  Trustpilot: "bg-emerald-50 text-emerald-600",
  Yelp: "bg-red-50 text-red-600",
  TripAdvisor: "bg-green-50 text-green-600",
};

// ─── SENTIMENT CONFIG ─────────────────────────────────────────────────────────

type ReviewSentiment = "Very Positive" | "Positive" | "Neutral" | "Negative" | "Urgent" | "High Influence";

const sentimentCfg: Record<ReviewSentiment, { color: string; bg: string; icon: React.ElementType }> = {
  "Very Positive": { color: "text-emerald-600", bg: "bg-emerald-50", icon: ThumbsUp },
  Positive: { color: "text-brand", bg: "bg-brand/10", icon: ThumbsUp },
  Neutral: { color: "text-muted-foreground", bg: "bg-secondary", icon: Minus },
  Negative: { color: "text-amber-600", bg: "bg-amber-50", icon: ThumbsDown },
  Urgent: { color: "text-destructive", bg: "bg-destructive/10", icon: AlertTriangle },
  "High Influence": { color: "text-purple-600", bg: "bg-purple-50", icon: Star },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const reviews = [
  {
    id: "1",
    name: "John Smith",
    initials: "JS",
    rating: 5,
    source: "Google",
    date: "2 days ago",
    text: "Absolutely brilliant service. Had my car serviced and it was back on the road the same day. The team kept me informed throughout — couldn't ask for more.",
    replied: true,
    reply: "Thank you so much, John! We're thrilled you had a great experience. We look forward to seeing you next time!",
    sentiment: "Very Positive" as ReviewSentiment,
    themes: ["Communication", "Speed", "Service Quality"],
    aiNote: "Ideal candidate for a referral request. High advocacy potential based on language used.",
    ltv: "£1,240",
    jobs: 3,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    initials: "SJ",
    rating: 5,
    source: "Google",
    date: "1 week ago",
    text: "Really professional team. The communication throughout was excellent and the pricing was very fair. Will definitely be back.",
    replied: false,
    sentiment: "Very Positive" as ReviewSentiment,
    themes: ["Communication", "Pricing", "Professionalism"],
    aiNote: "Reply immediately — Google rewards fast responses. Include a personalised thank-you mentioning her specific praise.",
    ltv: "£4,200",
    jobs: 7,
  },
  {
    id: "3",
    name: "Marcus Williams",
    initials: "MW",
    rating: 4,
    source: "Trustpilot",
    date: "2 weeks ago",
    text: "Great work overall. Would have given 5 stars if the wait time was a little shorter. The quality of the work itself was excellent.",
    replied: true,
    reply: "Thank you Marcus! We appreciate the feedback on wait times and are working to improve our scheduling.",
    sentiment: "Positive" as ReviewSentiment,
    themes: ["Wait Time", "Quality", "Service"],
    aiNote: "Wait time mentioned — this is a recurring theme. Consider booking gap review. Acknowledge personally.",
    ltv: "£3,100",
    jobs: 6,
  },
  {
    id: "4",
    name: "Emily Clarke",
    initials: "EC",
    rating: 5,
    source: "Google",
    date: "3 weeks ago",
    text: "Best garage I've ever used. Honest pricing and quality workmanship. They went above and beyond to explain exactly what was needed.",
    replied: false,
    sentiment: "Very Positive" as ReviewSentiment,
    themes: ["Pricing", "Quality", "Transparency"],
    aiNote: "Strong review — no response sent. Google visibility reduces without timely replies. Reply urgently.",
    ltv: "£980",
    jobs: 2,
  },
  {
    id: "5",
    name: "James Thompson",
    initials: "JT",
    rating: 3,
    source: "Google",
    date: "1 month ago",
    text: "Decent work but had to wait longer than expected. Was told it would be ready by 2pm, wasn't ready until 5pm. Communication could be better.",
    replied: false,
    sentiment: "Negative" as ReviewSentiment,
    themes: ["Wait Time", "Communication", "Expectations"],
    aiNote: "URGENT: 3-star review with no response. Reply today with an apology and invite back. Risk of further negative content.",
    ltv: "£5,600",
    jobs: 9,
  },
  {
    id: "6",
    name: "Rebecca Foster",
    initials: "RF",
    rating: 1,
    source: "Google",
    date: "3 weeks ago",
    text: "Very disappointed. Car was booked in for a week, work wasn't completed and I wasn't kept informed. Will not return.",
    replied: false,
    sentiment: "Urgent" as ReviewSentiment,
    themes: ["Communication", "Reliability", "Completion"],
    aiNote: "CRITICAL: 1-star review unanswered for 3 weeks. This is actively harming your Google ranking. Respond today with a full apology and a direct resolution offer.",
    ltv: "£240",
    jobs: 1,
  },
];

const priorities = [
  {
    id: "1",
    action: "Reply to Rebecca's 1-star review",
    priority: "Critical" as const,
    impact: "£1,800",
    confidence: 96,
    time: "5 min",
    reason: "1-star reviews without a response actively harm your Google ranking. Every day of silence increases the probability of a second negative review from the same customer by 34%. A professional, empathetic public response converts 22% of dissatisfied reviewers into loyal customers.",
    reviewId: "6",
  },
  {
    id: "2",
    action: "Reply to James's 3-star review",
    priority: "High" as const,
    impact: "£640",
    confidence: 88,
    time: "5 min",
    reason: "James is your highest-LTV customer at £5,600 over 9 jobs. A 3-star review from an otherwise loyal customer signals frustration, not departure. A personalised apology acknowledging wait time issues has an 81% chance of retaining this customer and improving his next rating.",
    reviewId: "5",
  },
  {
    id: "3",
    action: "Ask 27 customers for reviews",
    priority: "High" as const,
    impact: "£4,500",
    confidence: 84,
    time: "10 min",
    reason: "27 customers who have visited in the last 60 days have not been asked for a review. Based on your current satisfaction rate, 18 of them are predicted to leave 4-5 star reviews. This would increase your Google ranking position by an estimated 2 places.",
    reviewId: null,
  },
  {
    id: "4",
    action: "Reply to Sarah and Emily's 5-star reviews",
    priority: "Medium" as const,
    impact: "£280",
    confidence: 79,
    time: "5 min",
    reason: "5-star reviews without a response miss a referral and loyalty opportunity. A personalised reply that names what they specifically praised increases repeat booking likelihood by 31%.",
    reviewId: "2",
  },
];

const themeData = [
  { label: "Communication", positive: 18, negative: 4, color: "#E31B23" },
  { label: "Service Quality", positive: 22, negative: 1, color: "#10b981" },
  { label: "Pricing", positive: 14, negative: 2, color: "#3b82f6" },
  { label: "Wait Time", positive: 3, negative: 9, color: "#f59e0b" },
  { label: "Professionalism", positive: 16, negative: 0, color: "#8b5cf6" },
  { label: "Transparency", positive: 11, negative: 1, color: "#06b6d4" },
  { label: "Reliability", positive: 8, negative: 3, color: "#ec4899" },
];

const healthMetrics = [
  { label: "Review Score", score: 89, color: "#E31B23" },
  { label: "Response Score", score: 54, color: "#f59e0b" },
  { label: "Customer Trust", score: 82, color: "#10b981" },
  { label: "Service Quality", score: 91, color: "#3b82f6" },
  { label: "Communication", score: 76, color: "#8b5cf6" },
  { label: "Loyalty Score", score: 84, color: "#06b6d4" },
];

const benchmarks = [
  { label: "Average Rating", you: "4.3", market: "3.9", rank: "Top 18%", up: true },
  { label: "Review Count", you: "127", market: "84", rank: "Top 22%", up: true },
  { label: "Response Rate", you: "54%", market: "61%", rank: "Below avg", up: false },
  { label: "Review Growth", you: "+14%", market: "+8%", rank: "Top 15%", up: true },
  { label: "Avg Reply Time", you: "6.2h", market: "18h", rank: "Top 5%", up: true },
];

const timeline = [
  { type: "review", name: "John Smith", stars: 5, date: "2 Jul 2026", source: "Google", text: "Absolutely brilliant service." },
  { type: "reply", name: "You replied", date: "2 Jul 2026", text: "Thank you so much, John!" },
  { type: "request", name: "Review request sent", date: "1 Jul 2026", text: "Sent to 8 customers via SMS" },
  { type: "review", name: "Marcus Williams", stars: 4, date: "28 Jun 2026", source: "Trustpilot", text: "Great work overall." },
  { type: "review", name: "Emily Clarke", stars: 5, date: "22 Jun 2026", source: "Google", text: "Best garage I've ever used." },
  { type: "campaign", name: "Campaign launched", date: "20 Jun 2026", text: "Become Highest Rated Garage — started" },
  { type: "review", name: "Rebecca Foster", stars: 1, date: "18 Jun 2026", source: "Google", text: "Very disappointed." },
];

const aiMemory = [
  "Customers mention 'communication' in 76% of all reviews — your single biggest strength.",
  "Wait time is cited negatively in 4 of the last 6 critical reviews. Scheduling review recommended.",
  "Review requests sent within 24 hours of job completion achieve a 68% open rate vs 31% after 72 hours.",
  "Phone call follow-ups produce reviews with 40% more words on average — stronger for SEO.",
  "Friday afternoon jobs generate 2.4x more reviews than any other time slot.",
  "Customers who receive a personalised reply leave a second review 28% of the time.",
];

// ─── HERO ─────────────────────────────────────────────────────────────────────

function ReputationDNAHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -bottom-10 left-1/3 h-48 w-48 rounded-full bg-brand/10 blur-2xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-brand" />
            AI-Powered Intelligence
          </div>
          <h1 className="text-[22px] font-bold leading-tight tracking-tight text-background">
            Reputation DNA™
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-background/65">
            Build a reputation your customers trust. Every review analysed, every opportunity identified, every risk predicted.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          {[
            { label: "Overall Rating", value: "4.3", sub: "out of 5", icon: Star },
            { label: "Total Reviews", value: "127", sub: "across 4 platforms", icon: MessageSquare },
            { label: "Response Rate", value: "54%", sub: "needs improvement", icon: CheckCircle2 },
            { label: "AI Reputation Score", value: "82/100", sub: "Top 18%", icon: Brain },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex min-w-[110px] flex-col gap-0.5 rounded-xl bg-background/10 p-3">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-background/55" strokeWidth={1.75} />
                  <span className="text-[9.5px] font-medium text-background/55">{stat.label}</span>
                </div>
                <span className="text-[18px] font-bold tracking-tight text-background">{stat.value}</span>
                <span className="text-[9px] text-background/50">{stat.sub}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2.5">
        {[
          { label: "2 unanswered negative reviews — reply today", dot: "bg-destructive animate-pulse" },
          { label: "27 customers ready to be asked for reviews", dot: "bg-brand" },
          { label: "Response rate below market average", dot: "bg-amber-400" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 rounded-lg bg-background/10 px-3 py-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
            <span className="text-[11.5px] text-background/80">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI REPUTATION SUMMARY ────────────────────────────────────────────────────

function AIReputationSummary() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-5 text-background shadow-card">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand/15 blur-2xl" />
      <div className="relative flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-background/15">
          <Brain className="h-5 w-5 text-background" strokeWidth={1.75} />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-background/60">AI Reputation Summary</span>
            <span className="rounded-md bg-brand/40 px-1.5 py-0.5 text-[9.5px] font-bold text-background">LIVE</span>
          </div>
          <p className="text-[13px] leading-relaxed text-background/85">
            Your reputation is <span className="font-semibold text-background">strong but undefended</span>. Your average rating of{" "}
            <span className="font-semibold text-brand">4.3</span> has increased by 0.3 this month — customers consistently praise{" "}
            <span className="font-semibold text-background">communication and workmanship</span>. However, 2 negative reviews remain
            unanswered and your response rate of 54% is below the market average of 61%. The biggest improvement opportunity is{" "}
            <span className="font-semibold text-background">reducing wait times</span> and{" "}
            <span className="font-semibold text-background">activating your 27 silent happy customers</span>. You are currently outperforming
            similar businesses in customer satisfaction and review growth.
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <div className="flex items-center gap-2 rounded-xl bg-background/10 px-3.5 py-2">
              <CircleDollarSign className="h-3.5 w-3.5 text-background/70" strokeWidth={1.75} />
              <span className="text-[11.5px] text-background/80">
                Revenue opportunity from review improvements:{" "}
                <span className="font-semibold text-background">+£3,200</span>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-background/10 px-3.5 py-2">
              <TrendingUp className="h-3.5 w-3.5 text-background/70" strokeWidth={1.75} />
              <span className="text-[11.5px] text-background/80">
                Potential Google ranking gain:{" "}
                <span className="font-semibold text-background">+2 positions</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TODAY'S PRIORITIES ───────────────────────────────────────────────────────

function TodaysPriorities({ onViewReview }: { onViewReview: (id: string) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const priorityCfg = {
    Critical: { dot: "bg-destructive animate-pulse", badge: "bg-destructive/10 text-destructive" },
    High: { dot: "bg-brand", badge: "bg-brand/10 text-brand" },
    Medium: { dot: "bg-amber-500", badge: "bg-amber-50 text-amber-600" },
    Low: { dot: "bg-muted-foreground/40", badge: "bg-secondary text-muted-foreground" },
  } as const;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <Target className="h-4 w-4 text-brand" strokeWidth={1.75} />
        <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Today's Review Priorities</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {priorities.length}
        </span>
      </div>

      <div className="divide-y divide-border">
        {priorities.map((p) => {
          const cfg = priorityCfg[p.priority];
          return (
            <div key={p.id} className="p-4 transition-colors hover:bg-secondary/20">
              <div className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 justify-between">
                    <div>
                      <span className="text-[12.5px] font-semibold text-foreground">{p.action}</span>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${cfg.badge}`}>{p.priority}</span>
                        <span className="text-[11px] font-bold text-brand">{p.impact} impact</span>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="text-[10.5px] text-muted-foreground">{p.confidence}% confidence</span>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="flex items-center gap-0.5 text-[10.5px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" strokeWidth={1.75} />
                          {p.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {p.reviewId && (
                        <button
                          onClick={() => onViewReview(p.reviewId!)}
                          className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-brand/90"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                        className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
                      >
                        <Eye className="h-3 w-3" strokeWidth={1.75} />
                        Explain Why
                        <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${expanded === p.id ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {expanded === p.id && (
                    <div className="mt-3 rounded-xl border border-brand/15 bg-brand/5 p-3.5">
                      <div className="flex items-start gap-2">
                        <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
                        <p className="text-[11.5px] leading-relaxed text-foreground/80">{p.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── REVIEW LIST ──────────────────────────────────────────────────────────────

function ReviewList({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <Star className="h-4 w-4 text-brand" strokeWidth={1.75} />
        <span className="text-[12px] font-semibold text-foreground">All Reviews</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {reviews.length}
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground">AI-sorted by urgency</span>
      </div>

      <ul className="flex-1 divide-y divide-border overflow-y-auto">
        {reviews.map((r) => {
          const sentCfg = sentimentCfg[r.sentiment];
          const SentIcon = sentCfg.icon;
          const isSelected = selected === r.id;

          return (
            <li
              key={r.id}
              onClick={() => onSelect(r.id)}
              className={`cursor-pointer px-4 py-3.5 transition-all duration-150 ${
                isSelected
                  ? "bg-brand/5 border-l-2 border-l-brand"
                  : "hover:bg-secondary/40 border-l-2 border-l-transparent"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
                  {r.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[12.5px] font-semibold text-foreground">{r.name}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{r.date}</span>
                  </div>
                  <StarRow rating={r.rating} />
                  <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">{r.text}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`rounded-md px-1 py-0.5 text-[9px] font-medium ${sourceColor[r.source] ?? "bg-secondary text-muted-foreground"}`}>{r.source}</span>
                    <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-medium ${sentCfg.bg} ${sentCfg.color}`}>
                      <SentIcon className="h-2 w-2" strokeWidth={1.75} />
                      {r.sentiment}
                    </span>
                    {!r.replied && (
                      <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-amber-600">No reply</span>
                    )}
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

// ─── REVIEW DETAIL ────────────────────────────────────────────────────────────

function ReviewDetail({ review }: { review: (typeof reviews)[0] }) {
  const [replyText, setReplyText] = useState(review.reply ?? "");
  const sentCfg = sentimentCfg[review.sentiment];
  const SentIcon = sentCfg.icon;

  const suggestReply = () => {
    if (review.rating >= 4) {
      setReplyText(`Thank you so much for your kind words, ${review.name.split(" ")[0]}! We're delighted you had a great experience and we look forward to welcoming you back soon.`);
    } else if (review.rating === 3) {
      setReplyText(`Thank you for your feedback, ${review.name.split(" ")[0]}. We sincerely apologise for the wait time — this is something we're actively addressing. We'd love to welcome you back and show you the improvement. Please feel free to reach out directly.`);
    } else {
      setReplyText(`Dear ${review.name.split(" ")[0]}, we are truly sorry to hear about your experience — this is not the standard we hold ourselves to. We would very much like the opportunity to make this right. Please contact us directly at your earliest convenience.`);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">
            {review.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-foreground">{review.name}</span>
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${sourceColor[review.source] ?? "bg-secondary text-muted-foreground"}`}>{review.source}</span>
              <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-medium ${sentCfg.bg} ${sentCfg.color}`}>
                <SentIcon className="h-2.5 w-2.5" strokeWidth={1.75} />
                {review.sentiment}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <StarRow rating={review.rating} />
              <span className="text-[11px] text-muted-foreground">{review.date}</span>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-[11px] text-muted-foreground">LTV: <span className="font-semibold text-foreground">{review.ltv}</span></span>
            </div>
          </div>
        </div>
        <button className="shrink-0 rounded-lg border border-border bg-card px-3 py-1.5 text-[11.5px] font-medium text-foreground transition-all hover:border-foreground/20 hover:bg-secondary">
          <ExternalLink className="inline h-3 w-3 mr-1" strokeWidth={1.75} />
          Open in {review.source}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Review text */}
        <div className="rounded-xl bg-secondary/50 p-4">
          <p className="text-[13.5px] leading-relaxed text-foreground">{review.text}</p>
        </div>

        {/* Themes */}
        <div>
          <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Identified Themes</div>
          <div className="flex flex-wrap gap-1.5">
            {review.themes.map((t) => (
              <span key={t} className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground">{t}</span>
            ))}
          </div>
        </div>

        {/* AI Note */}
        <div className="rounded-xl border border-brand/15 bg-brand/5 p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Brain className="h-3 w-3 text-brand" strokeWidth={1.75} />
            <span className="text-[10.5px] font-semibold text-brand">AI Insight</span>
          </div>
          <p className="text-[11.5px] leading-relaxed text-foreground/80">{review.aiNote}</p>
        </div>

        {/* Existing reply */}
        {review.replied && review.reply && (
          <div>
            <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Your Reply</div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
              <p className="text-[12.5px] leading-relaxed text-emerald-800">{review.reply}</p>
            </div>
          </div>
        )}

        {/* Reply composer */}
        {!review.replied && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Your Reply</span>
              <button
                onClick={suggestReply}
                className="flex items-center gap-1 rounded-lg bg-brand/10 border border-brand/20 px-2.5 py-1 text-[11px] font-semibold text-brand transition-all hover:bg-brand/20"
              >
                <Sparkles className="h-2.5 w-2.5" strokeWidth={1.75} />
                AI Suggest
              </button>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a professional reply..."
              rows={4}
              className="w-full resize-none rounded-xl border border-border bg-secondary/30 px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-card focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-[10.5px] text-muted-foreground">Always review before publishing</span>
              <button className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:bg-brand/90">
                <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
                Publish Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REVIEW ANALYSIS ─────────────────────────────────────────────────────────

function ReviewAnalysis() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">AI Review Analysis</span>
          <span className="ml-auto text-[11px] text-muted-foreground">127 reviews analysed</span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Positive Themes</div>
            <div className="space-y-2">
              {themeData.filter((t) => t.positive > t.negative).map((t) => (
                <div key={t.label} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-[11.5px] text-foreground">{t.label}</span>
                  <ProgressBar value={(t.positive / 22) * 100} color="#10b981" />
                  <span className="w-6 shrink-0 text-right text-[11px] font-bold text-emerald-600">{t.positive}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Negative Themes</div>
            <div className="space-y-2">
              {themeData.filter((t) => t.negative > 0).sort((a, b) => b.negative - a.negative).map((t) => (
                <div key={t.label} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-[11.5px] text-foreground">{t.label}</span>
                  <ProgressBar value={(t.negative / 9) * 100} color="#f59e0b" />
                  <span className="w-6 shrink-0 text-right text-[11px] font-bold text-amber-600">{t.negative}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-brand/5 border border-brand/10 p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Lightbulb className="h-3 w-3 text-brand" strokeWidth={1.75} />
            <span className="text-[10.5px] font-semibold text-brand">AI Pattern Recognition</span>
          </div>
          <p className="text-[11.5px] leading-relaxed text-foreground/80">
            <span className="font-semibold text-foreground">Wait time</span> is cited negatively 9 times — your most actionable improvement area. Resolving this could convert 3–4 star reviews into 5-star reviews. Consider a same-day ETA update system to reduce perceived wait times by 40%.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "5-Star Reviews", value: 89, total: 127, color: "#10b981" },
            { label: "4-Star Reviews", value: 24, total: 127, color: "#E31B23" },
            { label: "3-Star Reviews", value: 9, total: 127, color: "#f59e0b" },
            { label: "1-2 Star Reviews", value: 5, total: 127, color: "#ef4444" },
          ].map((r) => (
            <div key={r.label} className="rounded-xl bg-secondary/50 p-3 text-center">
              <div className="text-[10px] font-medium text-muted-foreground">{r.label}</div>
              <div className="mt-1 text-[18px] font-bold text-foreground">{r.value}</div>
              <div className="mt-1.5">
                <ProgressBar value={(r.value / r.total) * 100} color={r.color} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── REPUTATION HEALTH ────────────────────────────────────────────────────────

function ReputationHealth() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Reputation Health</span>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {healthMetrics.map((m) => (
            <div key={m.label} className="flex flex-col items-center gap-2">
              <div className="relative">
                <ScoreRing score={m.score} size={64} stroke={5} color={m.color} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[14px] font-bold text-foreground">{m.score}</span>
                </div>
              </div>
              <span className="text-center text-[10.5px] font-medium text-muted-foreground leading-tight">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-3.5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" strokeWidth={1.75} />
            <p className="text-[11.5px] text-amber-700">
              <span className="font-semibold">Response Score (54) is your weakest area.</span> Improving this to 80+ would add approximately{" "}
              <span className="font-semibold">+6 points</span> to your overall Reputation DNA™ score and improve Google search visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BENCHMARKING ─────────────────────────────────────────────────────────────

function Benchmarking() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Market Benchmarking</span>
          <span className="ml-auto rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">Top 18% overall</span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {benchmarks.map((b) => (
          <div key={b.label} className="flex items-center gap-4 rounded-xl border border-border p-3.5 transition-colors hover:bg-secondary/30">
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-medium text-muted-foreground">{b.label}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-[9px] font-medium text-muted-foreground">You</div>
                <div className="text-[13px] font-bold text-foreground">{b.you}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] font-medium text-muted-foreground">Market</div>
                <div className="text-[13px] font-bold text-muted-foreground">{b.market}</div>
              </div>
              <div className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${b.up ? "bg-brand/10 text-brand" : "bg-amber-50 text-amber-600"}`}>
                {b.rank}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI OPPORTUNITIES ────────────────────────────────────────────────────────

function AIOpportunities() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const opps = [
    {
      title: "Activate 27 silent happy customers",
      value: "£4,500",
      confidence: 84,
      difficulty: "Easy",
      time: "10 min",
      detail: "27 customers who visited in the last 60 days have never left a review. Based on their sentiment data and engagement patterns, 18 are predicted to leave 4-5 star reviews. This would increase your average rating and improve Google search position by an estimated 2 places.",
    },
    {
      title: "Recover 2 negative reviewers",
      value: "£1,200",
      confidence: 71,
      difficulty: "Medium",
      time: "15 min",
      detail: "Direct outreach to customers who left 1-3 star reviews with a personal apology and resolution offer converts 22% into loyal repeat customers and 15% into updated reviews. Rebecca and James are both viable recovery candidates.",
    },
    {
      title: "Launch a post-job review workflow",
      value: "£8,400/yr",
      confidence: 91,
      difficulty: "Easy",
      time: "30 min",
      detail: "Businesses that send automated review requests within 24 hours of job completion achieve 3.4x more reviews than those who don't. At your current job volume, this would generate approximately 47 additional reviews per year.",
    },
  ];

  const diffCfg = {
    Easy: "bg-emerald-50 text-emerald-600",
    Medium: "bg-amber-50 text-amber-600",
    Hard: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">AI Opportunities</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {opps.map((o, i) => (
          <div key={i} className="p-4 transition-colors hover:bg-secondary/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-foreground">{o.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-[11.5px] font-bold text-brand">{o.value}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-[10.5px] text-muted-foreground">{o.confidence}% confidence</span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${diffCfg[o.difficulty as keyof typeof diffCfg]}`}>{o.difficulty}</span>
                    <span className="flex items-center gap-0.5 text-[10.5px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" strokeWidth={1.75} />
                      {o.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-brand/90">
                  Launch
                </button>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
                >
                  <Eye className="h-3 w-3" strokeWidth={1.75} />
                  <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>
            {expanded === i && (
              <div className="mt-3 ml-9 rounded-xl border border-brand/15 bg-brand/5 p-3.5">
                <div className="flex items-start gap-2">
                  <Brain className="mt-0.5 h-3 w-3 shrink-0 text-brand" strokeWidth={1.75} />
                  <p className="text-[11.5px] leading-relaxed text-foreground/80">{o.detail}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NEGATIVE REVIEW RECOVERY ────────────────────────────────────────────────

function NegativeReviewRecovery({ onViewReview }: { onViewReview: (id: string) => void }) {
  const negatives = reviews.filter((r) => r.rating <= 3);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Negative Review Recovery</span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
            {negatives.length}
          </span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {negatives.map((r) => (
          <div key={r.id} className="flex items-start gap-3.5 p-4 transition-colors hover:bg-secondary/20">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-destructive/10 text-[12px] font-bold text-destructive">
              {r.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[12.5px] font-semibold text-foreground">{r.name}</span>
                  <div className="mt-0.5 flex items-center gap-2">
                    <StarRow rating={r.rating} />
                    <span className="text-[10.5px] text-muted-foreground">{r.date}</span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-medium ${sourceColor[r.source] ?? "bg-secondary text-muted-foreground"}`}>{r.source}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => onViewReview(r.id)}
                    className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-brand/90"
                  >
                    Reply
                  </button>
                </div>
              </div>
              <p className="mt-1.5 text-[11.5px] text-muted-foreground line-clamp-2">{r.text}</p>
              <div className="mt-2 rounded-lg bg-brand/5 border border-brand/10 px-3 py-2">
                <p className="text-[11px] text-foreground/75">{r.aiNote}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── REVIEW TIMELINE ─────────────────────────────────────────────────────────

function ReviewTimeline() {
  const typeConfig: Record<string, { color: string; icon: React.ElementType }> = {
    review: { color: "bg-brand/10 text-brand", icon: Star },
    reply: { color: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
    request: { color: "bg-blue-50 text-blue-600", icon: Send },
    campaign: { color: "bg-purple-50 text-purple-600", icon: Megaphone },
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Review Timeline</span>
        </div>
      </div>
      <ul className="divide-y divide-border">
        {timeline.map((item, idx) => {
          const cfg = typeConfig[item.type] ?? { color: "bg-secondary text-muted-foreground", icon: Calendar };
          const Icon = cfg.icon;
          return (
            <li key={idx} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/30">
              <div className="relative flex flex-col items-center">
                <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${cfg.color}`}>
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </div>
                {idx < timeline.length - 1 && <div className="mt-1 h-full w-px bg-border" />}
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12.5px] font-semibold text-foreground">{item.name}</span>
                      {"source" in item && item.source && (
                        <span className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-medium ${sourceColor[item.source as string] ?? "bg-secondary text-muted-foreground"}`}>{item.source}</span>
                      )}
                      {"stars" in item && typeof item.stars === "number" && <StarRow rating={item.stars} />}
                    </div>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">{item.text}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{item.date}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── REVIEW CAMPAIGNS ────────────────────────────────────────────────────────

function ReviewCampaigns() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Review Campaigns</span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
            <span className="text-[12px] font-semibold text-foreground">Active Campaign</span>
            <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-[9.5px] font-bold text-white">ACTIVE</span>
          </div>
          <div className="text-[15px] font-bold text-foreground mb-1">Become Highest Rated Garage</div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-3">
            <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
            <span>Mission: Reach 250 Reviews</span>
            <span className="ml-1 font-semibold text-foreground">127 / 250</span>
          </div>
          <ProgressBar value={51} color="#E31B23" />
          <div className="mt-3 space-y-1.5">
            {["Ask Today's Customers", "Reply To All Reviews", "Recover Negative Feedback"].map((task, i) => (
              <div key={task} className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${i === 0 ? "bg-brand" : "bg-secondary"}`} />
                <span className="text-[11.5px] text-foreground">{task}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-[12px] font-semibold text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground">
          + Create New Review Campaign
        </button>
      </div>
    </div>
  );
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

function ReputationAnalytics() {
  const stats = [
    { label: "Avg Rating", value: "4.3", trend: "+0.3", up: true },
    { label: "Review Growth", value: "+14%", trend: "+6%", up: true },
    { label: "Requests Sent", value: "89", trend: "+22", up: true },
    { label: "Response Rate", value: "54%", trend: "-7%", up: false },
    { label: "Avg Reply Time", value: "6.2h", trend: "-2.1h", up: true },
    { label: "Revenue from Reviews", value: "£12,400", trend: "+£2,800", up: true },
    { label: "Trust Trend", value: "Rising", trend: "+12pts", up: true },
    { label: "New Review Freq", value: "4.1/wk", trend: "+0.9", up: true },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Reputation Analytics</span>
          <span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">This month</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-secondary/50 p-3.5">
            <div className="text-[10.5px] font-medium text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-[17px] font-bold text-foreground">{s.value}</div>
            <div className={`mt-0.5 flex items-center gap-1 text-[10.5px] font-semibold ${s.up ? "text-brand" : "text-destructive"}`}>
              {s.up ? <TrendingUp className="h-2.5 w-2.5" strokeWidth={2} /> : <TrendingDown className="h-2.5 w-2.5" strokeWidth={2} />}
              {s.trend} vs last month
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI MEMORY ────────────────────────────────────────────────────────────────

function AIMemorySection() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold tracking-tight text-foreground">AI Memory</span>
          <span className="ml-auto text-[10.5px] text-muted-foreground">What your AI has learned from 127 reviews</span>
        </div>
      </div>
      <div className="p-5">
        <ul className="space-y-2.5">
          {aiMemory.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-xl bg-secondary/50 px-3.5 py-2.5">
              <Brain className="mt-0.5 h-3 w-3 shrink-0 text-brand" strokeWidth={1.75} />
              <span className="text-[12px] text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── BUSINESS DNA PREVIEW ─────────────────────────────────────────────────────

function BusinessDNAPreview() {
  const modules = [
    { name: "Relationship DNA™", pct: 94, done: true },
    { name: "Communication Intelligence™", pct: 83, done: true },
    { name: "Reputation DNA™", pct: 82, done: true },
    { name: "Website DNA™", pct: 72, done: false },
    { name: "Revenue DNA™", pct: 80, done: false },
    { name: "Operations DNA™", pct: 76, done: false },
    { name: "Marketing DNA™", pct: 68, done: false },
    { name: "Automation DNA™", pct: 58, done: false },
    { name: "Finance DNA™", pct: 71, done: false },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-brand/30 bg-gradient-to-r from-brand/5 to-transparent p-5">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">Business DNA™</span>
          <span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">3 of 9 modules active</span>
        </div>
        <p className="mb-4 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
          Reputation DNA™ contributes to your overall CrediEdge Score™. Every module adds to one unified business intelligence profile.
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-9">
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

export function ReputationDNA() {
  const [selectedId, setSelectedId] = useState("6");
  const review = reviews.find((r) => r.id === selectedId)!;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <ReputationDNAHero />

      {/* AI Summary */}
      <AIReputationSummary />

      {/* KPI quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {[
          { label: "Total Reviews", value: 127, suffix: "" },
          { label: "Avg Rating", value: 4.3, decimals: 1, suffix: "" },
          { label: "This Month", value: 14, suffix: "" },
          { label: "5-Star Rate", value: 70, suffix: "%" },
          { label: "Response Rate", value: 54, suffix: "%" },
          { label: "Review Growth", value: 14, suffix: "%" },
          { label: "Google Position", value: 4, suffix: "" },
          { label: "Trust Score", value: 82, suffix: "/100" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/10 hover:shadow-card">
            <div className="text-[10px] font-medium text-muted-foreground">{s.label}</div>
            <div className="mt-1.5 text-[18px] font-bold text-foreground">
              <AnimatedNumber value={s.value} suffix={s.suffix} decimals={"decimals" in s ? s.decimals ?? 0 : 0} />
            </div>
          </div>
        ))}
      </div>

      {/* Today's priorities */}
      <TodaysPriorities onViewReview={setSelectedId} />

      {/* Reviews workspace */}
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <ReviewList selected={selectedId} onSelect={setSelectedId} />
        <ReviewDetail review={review} />
      </div>

      {/* Analysis + Health */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ReviewAnalysis />
        <ReputationHealth />
      </div>

      {/* Benchmarking + Opportunities */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Benchmarking />
        <AIOpportunities />
      </div>

      {/* Negative recovery + Campaigns */}
      <div className="grid gap-4 lg:grid-cols-2">
        <NegativeReviewRecovery onViewReview={setSelectedId} />
        <ReviewCampaigns />
      </div>

      {/* Timeline */}
      <ReviewTimeline />

      {/* Analytics */}
      <ReputationAnalytics />

      {/* AI Memory */}
      <AIMemorySection />

      {/* Business DNA preview */}
      <BusinessDNAPreview />
    </div>
  );
}
