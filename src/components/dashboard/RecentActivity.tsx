import {
  MessageSquare,
  CircleDollarSign,
  Star,
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle2,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Item {
  icon: LucideIcon;
  title: string;
  detail?: string;
  time: string;
  type: "enquiry" | "payment" | "review" | "alert" | "task" | "customer";
  action?: { label: string; to: string };
}

const items: Item[] = [
  {
    icon: MessageSquare,
    title: "New enquiry from John Smith",
    time: "2 min ago",
    type: "enquiry",
    action: { label: "Reply", to: "/communications" },
  },
  {
    icon: CircleDollarSign,
    title: "Payment received — Sarah Johnson",
    detail: "£450.00",
    time: "1h ago",
    type: "payment",
  },
  {
    icon: Star,
    title: "New 5-star review on Google",
    detail: "★★★★★",
    time: "2h ago",
    type: "review",
    action: { label: "View", to: "/reviews" },
  },
  {
    icon: AlertTriangle,
    title: "Website speed issue detected",
    time: "3h ago",
    type: "alert",
    action: { label: "Fix", to: "/website" },
  },
  {
    icon: CheckCircle2,
    title: "Job #0041 marked as complete",
    time: "4h ago",
    type: "task",
  },
  {
    icon: UserPlus,
    title: "New appointment booked — Emma Clarke",
    time: "5h ago",
    type: "customer",
    action: { label: "View", to: "/relationships" },
  },
];

const typeStyle: Record<Item["type"], string> = {
  enquiry: "bg-blue-50 text-blue-600",
  payment: "bg-emerald-50 text-emerald-600",
  review: "bg-brand/10 text-brand",
  alert: "bg-amber-50 text-amber-600",
  task: "bg-secondary text-foreground/60",
  customer: "bg-purple-50 text-purple-600",
};

export function RecentActivity() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Recent Activity</span>
        <Link
          to="/intelligence"
          className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand transition-all duration-200 hover:gap-1.5"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Timeline */}
      <ul className="flex-1 divide-y divide-border">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <li
              key={item.title}
              className="group flex items-start gap-3 px-5 py-3.5 transition-colors duration-150 hover:bg-secondary/40"
            >
              {/* Timeline line */}
              <div className="relative flex flex-col items-center">
                <div className={`grid h-8 w-8 place-items-center rounded-xl ${typeStyle[item.type]}`}>
                  <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} />
                </div>
                {idx < items.length - 1 && (
                  <div className="mt-1 h-[calc(100%-2rem)] w-px bg-border" />
                )}
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-medium text-foreground">{item.title}</div>
                    {item.detail && (
                      <div className="mt-0.5 text-[12px] font-bold text-foreground">{item.detail}</div>
                    )}
                    <div className="mt-0.5 text-[10.5px] text-muted-foreground">{item.time}</div>
                  </div>
                  {item.action && (
                    <Link
                      to={item.action.to}
                      className="shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-foreground/20 hover:bg-foreground hover:text-background"
                    >
                      {item.action.label}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
