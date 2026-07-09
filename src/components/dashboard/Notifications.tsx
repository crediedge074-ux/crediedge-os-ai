import { Mail, Star, FileText, ChartBar as BarChart3, Shield, TriangleAlert as AlertTriangle, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Tier = "critical" | "important" | "general";

interface N {
  icon: LucideIcon;
  title: string;
  time: string;
  tier: Tier;
  stars?: boolean;
}

const notifs: N[] = [
  { icon: FileText, title: "Invoice INV-1002 overdue — £950", time: "2h ago", tier: "critical" },
  { icon: AlertTriangle, title: "Customer waiting over 4 hours", time: "4h ago", tier: "critical" },
  { icon: Mail, title: "4 new messages waiting", time: "2m ago", tier: "important" },
  { icon: Star, title: "New 5-star review received", time: "1h ago", tier: "important", stars: true },
  { icon: BarChart3, title: "Website backup completed", time: "3h ago", tier: "general" },
  { icon: Shield, title: "Monthly report is ready", time: "5h ago", tier: "general" },
];

const tierConfig: Record<
  Tier,
  { label: string; dot: string; bg: string; textColor: string; iconColor: string }
> = {
  critical: {
    label: "Critical",
    dot: "bg-destructive",
    bg: "bg-destructive/5 border-destructive/10",
    textColor: "text-destructive",
    iconColor: "text-destructive",
  },
  important: {
    label: "Important",
    dot: "bg-warning",
    bg: "bg-warning/5 border-warning/10",
    textColor: "text-foreground",
    iconColor: "text-warning",
  },
  general: {
    label: "Info",
    dot: "bg-muted-foreground/30",
    bg: "bg-transparent border-transparent",
    textColor: "text-foreground",
    iconColor: "text-muted-foreground",
  },
};

const grouped = {
  critical: notifs.filter((n) => n.tier === "critical"),
  important: notifs.filter((n) => n.tier === "important"),
  general: notifs.filter((n) => n.tier === "general"),
} satisfies Record<Tier, N[]>;

export function Notifications() {
  const criticalCount = grouped.critical.length;

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Notifications</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {notifs.length}
        </span>
        {criticalCount > 0 && (
          <span className="ml-auto flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
            {criticalCount} critical
          </span>
        )}
      </div>

      <div className="divide-y divide-border">
        {(["critical", "important", "general"] as Tier[]).map((tier) => {
          const items = grouped[tier];
          if (!items.length) return null;
          const cfg = tierConfig[tier];
          return (
            <div key={tier} className="px-5 py-3.5">
              <div className="mb-2 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {cfg.label}
                </span>
              </div>
              <ul className="space-y-1.5">
                {items.map((n) => {
                  const Icon = n.icon;
                  return (
                    <li
                      key={n.title}
                      className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 transition-colors duration-150 hover:brightness-95 ${cfg.bg}`}
                    >
                      <Icon
                        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${cfg.iconColor}`}
                        strokeWidth={1.75}
                      />
                      <div className="min-w-0 flex-1">
                        <div className={`text-[12px] font-medium leading-snug ${cfg.textColor}`}>
                          {n.title}
                        </div>
                        {n.stars && (
                          <div className="mt-0.5 flex gap-0.5 text-brand">
                            {Array.from({ length: 5 }).map((_, k) => (
                              <Star key={k} className="h-2.5 w-2.5 fill-current" strokeWidth={0} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 text-[10px] text-muted-foreground">{n.time}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border px-5 py-3">
        <Link
          to="/communications"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-1.5"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
