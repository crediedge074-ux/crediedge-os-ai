import { Sparkles, MessageSquare, Calendar, Star, Globe, ArrowRight, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Action {
  icon: LucideIcon;
  label: string;
  cta: string;
  impact: string;
}

const actions: Action[] = [
  {
    icon: MessageSquare,
    label: "Reply to 4 new enquiries",
    cta: "Reply Now",
    impact: "+£1,800",
  },
  {
    icon: Calendar,
    label: "Chase 2 overdue invoices",
    cta: "Open CRM",
    impact: "+£950",
  },
  {
    icon: Star,
    label: "Send 6 review requests",
    cta: "Send Reviews",
    impact: "+£340",
  },
  {
    icon: Globe,
    label: "Website speed needs attention",
    cta: "View Issues",
    impact: "SEO risk",
  },
];

export function TodaysBriefing() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10">
          <Sparkles className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
        </div>
        <span className="text-[14px] font-semibold tracking-tight text-foreground">
          Today's Briefing
        </span>
        <span className="ml-auto rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
          AI
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Executive Summary */}
        <div className="rounded-xl bg-foreground p-4 text-background">
          <p className="text-[13px] font-medium leading-relaxed">
            Good morning Dom 👋
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-background/80">
            Your CrediEdge Score rose 6 points overnight. Yesterday's revenue was{" "}
            <span className="font-semibold text-background">14% above target</span>. You have 4 new
            enquiries waiting — acting within the hour maximises conversion.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
            <TrendingUp className="h-3.5 w-3.5 shrink-0 text-background/70" strokeWidth={2} />
            <span className="text-[11.5px] font-medium text-background/90">
              Estimated business impact today:{" "}
              <span className="font-bold text-background">+£3,090</span>
            </span>
          </div>
        </div>

        {/* Action items */}
        <div className="mt-4 flex-1 space-y-2">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.label}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 transition-all duration-200 hover:border-foreground/15 hover:shadow-soft"
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-foreground/60 transition-colors group-hover:bg-brand/10 group-hover:text-brand">
                  <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-foreground">
                    {a.label}
                  </div>
                  <div className="mt-0.5 text-[11px] font-semibold text-brand">{a.impact}</div>
                </div>
                <button className="shrink-0 rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-foreground hover:text-background">
                  {a.cta}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center border-t border-border pt-4">
          <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-2">
            View All Recommendations <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
