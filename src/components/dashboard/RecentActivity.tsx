import {
  MessageSquare,
  CircleDollarSign,
  Star,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Item {
  icon: LucideIcon;
  title: string;
  detail?: string;
  time: string;
  starred?: boolean;
}

const items: Item[] = [
  { icon: MessageSquare, title: "New enquiry from John Smith", time: "2 minutes ago" },
  { icon: CircleDollarSign, title: "Payment received from Sarah Johnson", detail: "£450.00", time: "1 hour ago" },
  { icon: Star, title: "New 5-star review on Google", time: "2 hours ago", starred: true },
  { icon: AlertTriangle, title: "Website speed issue detected", time: "3 hours ago" },
];

export function RecentActivity() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 text-[15px] font-semibold tracking-tight text-foreground">
        Recent Activity
      </div>

      <ul className="flex-1 divide-y divide-border">
        {items.map((i) => {
          const Icon = i.icon;
          return (
            <li key={i.title} className="flex items-center gap-3 py-3 first:pt-0">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-foreground/70">
                <Icon className="h-[16px] w-[16px]" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-foreground">
                  {i.title}
                </div>
                {i.detail && (
                  <div className="mt-0.5 text-[12px] font-semibold text-foreground">
                    {i.detail}
                  </div>
                )}
                {i.starred && (
                  <div className="mt-0.5 flex gap-0.5 text-brand">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="h-3 w-3 fill-current" strokeWidth={0} />
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0 text-[11px] text-muted-foreground">{i.time}</div>
            </li>
          );
        })}
      </ul>

      <button className="mt-4 inline-flex items-center gap-1 self-start text-[12.5px] font-semibold text-brand transition hover:gap-1.5">
        View All Activity <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
