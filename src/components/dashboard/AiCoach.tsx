import {
  Sparkles,
  MessageSquare,
  Calendar,
  Star,
  Globe,
  ArrowRight,
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
    title: "You have 4 new enquiries waiting",
    desc: "Responding within 5 minutes increases conversion by 21%.",
    cta: "View Enquiries",
  },
  {
    icon: Calendar,
    title: "3 jobs are overdue for follow-up",
    desc: "Following up now could bring in an estimated £2,400.",
    cta: "View Jobs",
  },
  {
    icon: Star,
    title: "You have 6 review requests to send",
    desc: "More reviews = more trust and more customers.",
    cta: "Send Reviews",
  },
  {
    icon: Globe,
    title: "Website performance issues detected",
    desc: "Fixing these issues could improve your Google ranking.",
    cta: "View Issues",
  },
];

export function AiCoach() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-2.5">
        <Sparkles className="h-4 w-4 text-brand" strokeWidth={2} />
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          AI Business Coach
        </span>
      </div>

      <div className="mb-4 rounded-xl bg-[#0D0D0D] p-4 text-white">
        <p className="text-[13px] leading-relaxed">
          Good morning Dom! Here are 4 things I recommend you focus on today to grow your
          business.
        </p>
      </div>

      <div className="flex-1 space-y-2.5">
        {recs.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.title}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-foreground/15 hover:shadow-soft"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                <Icon className="h-[16px] w-[16px]" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-foreground">
                  {r.title}
                </div>
                <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                  {r.desc}
                </p>
              </div>
              <button className="shrink-0 rounded-lg border border-border bg-card px-3 py-1.5 text-[11.5px] font-semibold text-foreground transition hover:bg-foreground hover:text-background">
                {r.cta}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center border-t border-border pt-4">
        <button className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand transition hover:gap-1.5">
          View All Recommendations <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
