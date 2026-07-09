import { MessageSquare, Star, Globe, PoundSterling, ChartBar as BarChart3, Users, ArrowRight, Clock, Zap, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

type Priority = "critical" | "high" | "medium" | "low";

interface Recommendation {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  estimatedImpact: string;
  impactLabel: string;
  timeRequired: string;
  to: string;
  cta: string;
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    icon: MessageSquare,
    title: "Reply to 4 Outstanding Enquiries",
    description:
      "4 high-intent enquiries have been waiting over 6 hours. Historical data shows reply within 2 hours converts at 68%. Acting now maximises revenue opportunity.",
    priority: "critical",
    category: "Customer Communication",
    estimatedImpact: "+£2,300",
    impactLabel: "Est. revenue",
    timeRequired: "15 min",
    to: "/communications",
    cta: "Reply Now",
  },
  {
    id: "2",
    icon: PoundSterling,
    title: "Chase 2 Overdue Invoices",
    description:
      "INV-1002 (£650) and INV-1005 (£300) are both 14+ days overdue. A polite reminder with a direct payment link historically recovers 94% of late payments within 24 hours.",
    priority: "high",
    category: "Revenue",
    estimatedImpact: "+£950",
    impactLabel: "Est. recovered",
    timeRequired: "5 min",
    to: "/relationships",
    cta: "Open CRM",
  },
  {
    id: "3",
    icon: Star,
    title: "Send 18 Review Requests",
    description:
      "You have 18 recently completed jobs with no review request sent. Requesting within 48 hours of job completion increases review submission rate by 3.2×.",
    priority: "high",
    category: "Reviews",
    estimatedImpact: "+£1,200",
    impactLabel: "Est. impact",
    timeRequired: "8 min",
    to: "/reviews",
    cta: "Send Reviews",
  },
  {
    id: "4",
    icon: Globe,
    title: "Fix Homepage Load Speed",
    description:
      "Your homepage loads in 4.8 seconds on mobile. Google penalises pages over 3 seconds, which reduces organic traffic by an estimated 18%. A fix takes under an hour.",
    priority: "medium",
    category: "Website",
    estimatedImpact: "SEO risk",
    impactLabel: "Risk avoided",
    timeRequired: "45 min",
    to: "/website",
    cta: "View Issues",
  },
  {
    id: "5",
    icon: BarChart3,
    title: "Reallocate Ad Budget to Campaign B",
    description:
      "Campaign A has a cost per lead of £47 vs Campaign B at £12. Shifting 80% of budget to Campaign B is estimated to generate 290% more leads at the same spend.",
    priority: "medium",
    category: "Marketing",
    estimatedImpact: "+£1,840",
    impactLabel: "Est. monthly",
    timeRequired: "20 min",
    to: "/insights",
    cta: "View Insights",
  },
  {
    id: "6",
    icon: Users,
    title: "Follow Up with 3 Inactive Customers",
    description:
      "3 customers who booked 60+ days ago haven't re-engaged. A personalised outreach at this stage has a 34% rebooking rate based on your historical data.",
    priority: "low",
    category: "Customer Retention",
    estimatedImpact: "+£480",
    impactLabel: "Est. revenue",
    timeRequired: "10 min",
    to: "/relationships",
    cta: "View Customers",
  },
];

const priorityConfig: Record<
  Priority,
  { label: string; border: string; bg: string; text: string; dot: string; badge: string }
> = {
  critical: {
    label: "Critical",
    border: "border-destructive/25",
    bg: "hover:bg-destructive/3",
    text: "text-destructive",
    dot: "bg-destructive animate-pulse",
    badge: "bg-destructive/10 text-destructive",
  },
  high: {
    label: "High",
    border: "border-brand/20",
    bg: "hover:bg-brand/3",
    text: "text-brand",
    dot: "bg-brand",
    badge: "bg-brand/10 text-brand",
  },
  medium: {
    label: "Medium",
    border: "border-border",
    bg: "hover:bg-secondary/50",
    text: "text-amber-600",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
  },
  low: {
    label: "Low",
    border: "border-border",
    bg: "hover:bg-secondary/30",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/40",
    badge: "bg-secondary text-muted-foreground",
  },
};

const categoryColor: Record<string, string> = {
  "Customer Communication": "bg-blue-50 text-blue-700",
  Revenue: "bg-emerald-50 text-emerald-700",
  Reviews: "bg-brand/10 text-brand",
  Website: "bg-orange-50 text-orange-700",
  Marketing: "bg-purple-50 text-purple-700",
  "Customer Retention": "bg-slate-50 text-slate-700",
};

export function AIRecommendations() {
  const totalImpact = "+£6,770";
  const totalTime = "103 min";

  return (
    <div>
      {/* Section header */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold tracking-tight text-foreground">AI Recommendations</h2>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            Sorted by estimated business impact. Complete these to maximise today's results.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft">
            <div className="text-[10px] font-medium text-muted-foreground">Total Opportunity</div>
            <div className="text-[15px] font-bold text-brand">{totalImpact}</div>
          </div>
          <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft">
            <div className="text-[10px] font-medium text-muted-foreground">Time Required</div>
            <div className="text-[15px] font-bold text-foreground">{totalTime}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, idx) => {
          const Icon = rec.icon;
          const cfg = priorityConfig[rec.priority];
          const catColor = categoryColor[rec.category] ?? "bg-secondary text-muted-foreground";
          return (
            <div
              key={rec.id}
              className={`group rounded-2xl border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${cfg.border} ${cfg.bg}`}
            >
              <div className="flex items-start gap-4">
                {/* Number + icon */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/60 transition-colors group-hover:bg-card group-hover:shadow-soft">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground/50">#{idx + 1}</div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-foreground">{rec.title}</h3>
                      <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                    {rec.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${catColor}`}>
                      {rec.category}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" strokeWidth={1.75} />
                      {rec.timeRequired}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 text-[10.5px] font-bold text-brand">
                      <TrendingUp className="h-2.5 w-2.5" strokeWidth={2} />
                      {rec.estimatedImpact} {rec.impactLabel}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to={rec.to}
                  className="mt-1 shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-2 text-[12px] font-semibold text-background transition-all duration-200 hover:bg-foreground/85 hover:gap-2"
                >
                  {rec.cta}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
