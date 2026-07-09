import { Sparkles, MessageSquare, Users, Star, Globe, ArrowRight, TrendingUp, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface QuickAction {
  icon: LucideIcon;
  label: string;
  sublabel: string;
  impact: string;
  cta: string;
  to: string;
  urgent?: boolean;
}

const actions: QuickAction[] = [
  {
    icon: MessageSquare,
    label: "Reply to Enquiries",
    sublabel: "4 awaiting response",
    impact: "+£1,800",
    cta: "Reply Now",
    to: "/communications",
    urgent: true,
  },
  {
    icon: Users,
    label: "Open CRM",
    sublabel: "2 overdue invoices",
    impact: "+£950",
    cta: "View CRM",
    to: "/relationships",
    urgent: true,
  },
  {
    icon: Star,
    label: "Send Review Requests",
    sublabel: "6 customers eligible",
    impact: "+£340",
    cta: "Send Now",
    to: "/reviews",
  },
  {
    icon: Globe,
    label: "View Customers",
    sublabel: "3 awaiting follow-up",
    impact: "Retention",
    cta: "View",
    to: "/relationships",
  },
];

export function MorningBriefing() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10">
          <Sparkles className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
        </div>
        <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Morning Briefing</span>
        <span className="ml-auto rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">AI</span>
      </div>

      <div className="p-5">
        {/* AI Summary */}
        <div className="relative overflow-hidden rounded-xl bg-foreground p-5 text-background">
          {/* Subtle texture */}
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-12 h-24 w-24 rounded-full bg-brand/20 blur-2xl" />

          <p className="relative text-[14px] font-semibold leading-snug">
            {greeting}, Dom <span className="inline-block">👋</span>
          </p>
          <p className="relative mt-2.5 text-[13px] leading-[1.65] text-background/80">
            Yesterday your business performed well. Revenue increased by{" "}
            <span className="font-semibold text-background">12%</span> above target. You received{" "}
            <span className="font-semibold text-background">5 new enquiries</span> and response times
            improved. However, two invoices remain unpaid and three customers are still waiting for replies.
          </p>

          <div className="relative mt-4 flex items-center gap-2.5 rounded-lg bg-white/10 px-3.5 py-2.5">
            <TrendingUp className="h-4 w-4 shrink-0 text-background/70" strokeWidth={2} />
            <div>
              <span className="text-[12px] text-background/80">Estimated opportunity today: </span>
              <span className="text-[13px] font-bold text-background">+£3,090</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.label}
                to={a.to}
                className={`group relative flex flex-col gap-2 overflow-hidden rounded-xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${
                  a.urgent
                    ? "border-brand/20 bg-brand/5 hover:border-brand/30 hover:bg-brand/8"
                    : "border-border bg-secondary/40 hover:border-foreground/10 hover:bg-secondary/70"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
                      a.urgent ? "bg-brand/15 text-brand" : "bg-card text-foreground/60"
                    }`}
                  >
                    <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
                  </div>
                  {a.urgent && (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                  )}
                </div>
                <div>
                  <div className="text-[12px] font-semibold leading-tight text-foreground">{a.label}</div>
                  <div className="mt-0.5 text-[10.5px] text-muted-foreground">{a.sublabel}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${a.urgent ? "text-brand" : "text-foreground/60"}`}>
                    {a.impact}
                  </span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center border-t border-border pt-4">
          <Link
            to="/advisor"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-2"
          >
            View Full AI Analysis <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
