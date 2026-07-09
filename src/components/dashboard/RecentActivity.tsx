import {
  MessageSquare,
  CreditCard,
  Star,
  AlertTriangle,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Item {
  icon: LucideIcon;
  title: string;
  desc: string;
  time: string;
}

const items: Item[] = [
  { icon: MessageSquare, title: "New enquiry from Sarah Bennett", desc: "Kitchen renovation quote request", time: "12m ago" },
  { icon: CreditCard, title: "Payment received", desc: "£2,400 from J. Harrington", time: "1h ago" },
  { icon: Star, title: "New 5-star review", desc: "\"Absolutely brilliant service\"", time: "3h ago" },
  { icon: UserPlus, title: "New customer onboarded", desc: "M. Thompson added to CRM", time: "5h ago" },
  { icon: AlertTriangle, title: "Website alert", desc: "Contact form conversion dropped 12%", time: "Yesterday" },
];

export function RecentActivity() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-5 text-[15px] font-semibold tracking-tight text-foreground">
        Recent Activity
      </div>
      <ol className="relative space-y-4">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
        {items.map((i) => {
          const Icon = i.icon;
          return (
            <li key={i.title} className="relative flex gap-3">
              <div className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-card text-brand">
                <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="text-[13px] font-medium text-foreground">{i.title}</div>
                <div className="mt-0.5 text-[11.5px] text-muted-foreground">{i.desc}</div>
              </div>
              <div className="shrink-0 pt-1 text-[11px] text-muted-foreground">{i.time}</div>
            </li>
          );
        })}
      </ol>

      <button className="mt-5 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground transition hover:text-brand">
        View All Activity <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
