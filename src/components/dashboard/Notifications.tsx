import { Mail, Star, FileText, BarChart3, Shield, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface N {
  icon: LucideIcon;
  title: string;
  time: string;
  tone?: "default" | "brand";
  stars?: boolean;
}

const notifs: N[] = [
  { icon: Mail, title: "You have 4 new messages", time: "2m ago" },
  { icon: Star, title: "New review received", time: "1h ago", stars: true },
  { icon: FileText, title: "Invoice INV-1002 is overdue", time: "2h ago", tone: "brand" },
  { icon: BarChart3, title: "Website backup completed", time: "3h ago" },
  { icon: Shield, title: "Monthly report is ready", time: "5h ago" },
];

export function Notifications() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Notifications
        </span>
        <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-[10.5px] font-bold text-white">
          5
        </span>
      </div>

      <ul className="divide-y divide-border">
        {notifs.map((n) => {
          const Icon = n.icon;
          return (
            <li key={n.title} className="flex items-center gap-3 py-2.5">
              <Icon
                className={`h-4 w-4 shrink-0 ${n.tone === "brand" ? "text-brand" : "text-foreground/70"}`}
                strokeWidth={1.75}
              />
              <div className="min-w-0 flex-1">
                <div
                  className={`truncate text-[12.5px] font-medium ${
                    n.tone === "brand" ? "text-brand" : "text-foreground"
                  }`}
                >
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
              <div className="shrink-0 text-[11px] text-muted-foreground">{n.time}</div>
            </li>
          );
        })}
      </ul>

      <button className="mt-3 inline-flex items-center gap-1 self-start text-[12.5px] font-semibold text-brand transition hover:gap-1.5">
        View All Notifications <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
