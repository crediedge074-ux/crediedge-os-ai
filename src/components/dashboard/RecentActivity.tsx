import { MessageSquare, CircleDollarSign, Star, TriangleAlert as AlertTriangle, ArrowRight, CircleCheck as CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Item {
  icon: LucideIcon;
  title: string;
  detail?: string;
  time: string;
  starred?: boolean;
  type: "enquiry" | "payment" | "review" | "alert" | "task";
}

const items: Item[] = [
  { icon: MessageSquare, title: "New enquiry from John Smith", time: "2 min ago", type: "enquiry" },
  { icon: CircleDollarSign, title: "Payment received — Sarah Johnson", detail: "£450.00", time: "1 hr ago", type: "payment" },
  { icon: Star, title: "New 5-star review on Google", time: "2 hr ago", starred: true, type: "review" },
  { icon: AlertTriangle, title: "Website speed issue detected", time: "3 hr ago", type: "alert" },
  { icon: CheckCircle2, title: "Job #0041 marked as complete", time: "4 hr ago", type: "task" },
];

const typeColor: Record<Item["type"], string> = {
  enquiry: "bg-secondary text-foreground/60",
  payment: "bg-success/10 text-success",
  review: "bg-brand/10 text-brand",
  alert: "bg-warning/10 text-warning",
  task: "bg-secondary text-foreground/60",
};

export function RecentActivity() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4 text-[13.5px] font-semibold tracking-tight text-foreground">
        Recent Activity
      </div>

      <ul className="flex-1 divide-y divide-border">
        {items.map((i) => {
          const Icon = i.icon;
          return (
            <li key={i.title} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
              <div
                className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${typeColor[i.type]}`}
              >
                <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-medium text-foreground">{i.title}</div>
                {i.detail && (
                  <div className="mt-0.5 text-[12px] font-bold text-foreground">{i.detail}</div>
                )}
                {i.starred && (
                  <div className="mt-0.5 flex gap-0.5 text-brand">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="h-2.5 w-2.5 fill-current" strokeWidth={0} />
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0 text-[10.5px] text-muted-foreground">{i.time}</div>
            </li>
          );
        })}
      </ul>

      <Link
        to="/intelligence"
        className="mt-4 inline-flex items-center gap-1 self-start text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-1.5"
      >
        View All Activity <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
