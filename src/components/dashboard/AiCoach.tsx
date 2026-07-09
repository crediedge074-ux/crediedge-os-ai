import {
  Sparkles,
  MessageSquare,
  Clock,
  Star,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Rec {
  icon: LucideIcon;
  title: string;
  desc: string;
  cta: string;
}

const recs: Rec[] = [
  {
    icon: MessageSquare,
    title: "4 enquiries waiting",
    desc: "Fresh leads from the last 24h haven't been replied to yet.",
    cta: "Respond now",
  },
  {
    icon: Clock,
    title: "3 overdue follow-ups",
    desc: "Booked jobs from last week are missing a check-in.",
    cta: "Follow up",
  },
  {
    icon: Star,
    title: "6 review requests",
    desc: "Recently completed customers ready to be asked for a review.",
    cta: "Send requests",
  },
  {
    icon: AlertTriangle,
    title: "Website issues detected",
    desc: "Your contact form dropped 12% in conversions this week.",
    cta: "Investigate",
  },
];

export function AiCoach() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
            <Sparkles className="h-4 w-4" strokeWidth={2} />
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-foreground">
              AI Business Coach
            </div>
            <div className="text-[11.5px] text-muted-foreground">
              Personalised recommendations for today
            </div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10.5px] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Live
        </span>
      </div>

      <div className="mb-5 rounded-xl bg-foreground p-4 text-background">
        <p className="text-[13.5px] leading-relaxed">
          <span className="font-semibold">Good morning Dom.</span> Here are 4 things I recommend
          you focus on today to grow your business.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {recs.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.title}
              className="group flex items-start gap-3 rounded-xl border border-border bg-background/60 p-4 transition-all hover:-translate-y-0.5 hover:bg-card hover:shadow-soft"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/8 text-brand">
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold text-foreground">{r.title}</div>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  {r.desc}
                </p>
                <button className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-medium text-brand transition group-hover:gap-1.5">
                  {r.cta} <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end">
        <button className="inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground transition hover:text-brand">
          View All Recommendations <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
