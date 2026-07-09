import { Mail, Star, FileText, BarChart3, Shield, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface N {
  icon: LucideIcon;
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
}

const notifs: N[] = [
  { icon: Mail, title: "3 new messages", desc: "From leads in your inbox", time: "5m", unread: true },
  { icon: Star, title: "New review posted", desc: "Google — 5 stars", time: "1h", unread: true },
  { icon: FileText, title: "Invoice #1042 paid", desc: "£1,850 from Bright & Co.", time: "2h" },
  { icon: BarChart3, title: "Weekly report ready", desc: "Your business summary is available", time: "1d" },
  { icon: Shield, title: "Backup completed", desc: "All data securely synced", time: "1d" },
];

export function Notifications() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[15px] font-semibold tracking-tight text-foreground">
          Notifications
        </div>
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10.5px] font-semibold text-brand">
          2 new
        </span>
      </div>

      <ul className="divide-y divide-border">
        {notifs.map((n) => {
          const Icon = n.icon;
          return (
            <li key={n.title} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-foreground">
                <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="truncate text-[13px] font-medium text-foreground">
                    {n.title}
                  </div>
                  {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
                </div>
                <div className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                  {n.desc}
                </div>
              </div>
              <div className="shrink-0 pt-0.5 text-[11px] text-muted-foreground">{n.time}</div>
            </li>
          );
        })}
      </ul>

      <button className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground transition hover:text-brand">
        View All Notifications <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
