import { Mail, Star, FileText, ChartBar as BarChart3, Shield, ArrowRight, CircleAlert as AlertCircle, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tier = "critical" | "important" | "general";

interface N {
  icon: LucideIcon;
  title: string;
  time: string;
  tier: Tier;
  stars?: boolean;
}

const notifs: N[] = [
  { icon: FileText, title: "Invoice INV-1002 overdue", time: "2h ago", tier: "critical" },
  { icon: Mail, title: "4 new messages waiting", time: "2m ago", tier: "important" },
  { icon: Star, title: "New 5-star review received", time: "1h ago", tier: "important", stars: true },
  { icon: BarChart3, title: "Website backup completed", time: "3h ago", tier: "general" },
  { icon: Shield, title: "Monthly report is ready", time: "5h ago", tier: "general" },
];

const tierConfig: Record<Tier, { label: string; dot: string; iconColor: string }> = {
  critical: { label: "Critical", dot: "bg-destructive", iconColor: "text-destructive" },
  important: { label: "Important", dot: "bg-warning", iconColor: "text-foreground/70" },
  general: { label: "General", dot: "bg-muted-foreground/40", iconColor: "text-muted-foreground" },
};

const grouped: Record<Tier, N[]> = {
  critical: notifs.filter((n) => n.tier === "critical"),
  important: notifs.filter((n) => n.tier === "important"),
  general: notifs.filter((n) => n.tier === "general"),
};

export function Notifications() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
          Notifications
        </span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {notifs.length}
        </span>
      </div>

      <div className="space-y-3">
        {(["critical", "important", "general"] as Tier[]).map((tier) => {
          const items = grouped[tier];
          if (!items.length) return null;
          const cfg = tierConfig[tier];
          return (
            <div key={tier}>
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {cfg.label}
                </span>
              </div>
              <ul className="space-y-px">
                {items.map((n) => {
                  const Icon = n.icon;
                  return (
                    <li
                      key={n.title}
                      className={`flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-secondary/60 ${
                        tier === "critical" ? "bg-destructive/5" : ""
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 shrink-0 ${cfg.iconColor}`}
                        strokeWidth={1.75}
                      />
                      <div className="min-w-0 flex-1">
                        <div className={`truncate text-[12px] font-medium ${
                          tier === "critical" ? "text-destructive" : "text-foreground"
                        }`}>
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
                      <div className="shrink-0 text-[10.5px] text-muted-foreground">{n.time}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <button className="mt-3 inline-flex items-center gap-1 self-start text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-1.5">
        View All <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
