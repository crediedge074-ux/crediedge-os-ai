import { useState } from "react";
import { ArrowRight, Clock, Link as LinkIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Priority = "High" | "Medium" | "Low";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  time: string;
  impact: string;
  impactType: "currency" | "text";
  cta: string;
  to: string;
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Reply to 4 new enquiries",
    priority: "High",
    time: "15 min",
    impact: "£1,800",
    impactType: "currency",
    cta: "Reply Now",
    to: "/communications",
  },
  {
    id: "2",
    title: "Chase 2 overdue invoices",
    priority: "High",
    time: "5 min",
    impact: "£950",
    impactType: "currency",
    cta: "Open CRM",
    to: "/relationships",
  },
  {
    id: "3",
    title: "Send 6 review requests",
    priority: "Medium",
    time: "8 min",
    impact: "£340",
    impactType: "currency",
    cta: "Send Reviews",
    to: "/reviews",
  },
  {
    id: "4",
    title: "Review ad performance",
    priority: "Medium",
    time: "15 min",
    impact: "£200",
    impactType: "currency",
    cta: "View Insights",
    to: "/insights",
  },
  {
    id: "5",
    title: "Fix website speed issue",
    priority: "Low",
    time: "5 min",
    impact: "SEO risk",
    impactType: "text",
    cta: "View Issues",
    to: "/website",
  },
];

const priorityConfig: Record<Priority, { dot: string; label: string; labelColor: string; bg: string }> = {
  High: {
    dot: "bg-brand",
    label: "HIGH",
    labelColor: "text-brand bg-brand/10",
    bg: "hover:bg-brand/5",
  },
  Medium: {
    dot: "bg-warning",
    label: "MED",
    labelColor: "text-warning bg-warning/10",
    bg: "hover:bg-warning/5",
  },
  Low: {
    dot: "bg-muted-foreground/40",
    label: "LOW",
    labelColor: "text-muted-foreground bg-secondary",
    bg: "hover:bg-secondary/60",
  },
};

export function Priorities() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  const remaining = tasks.filter((t) => !done[t.id]).length;

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
          Today's Priorities
        </span>
        {remaining > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
            {remaining}
          </span>
        )}
        {remaining === 0 && (
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
            All done!
          </span>
        )}
      </div>

      <ul className="divide-y divide-border">
        {tasks.map((t) => {
          const checked = !!done[t.id];
          const cfg = priorityConfig[t.priority];
          return (
            <li
              key={t.id}
              className={`group flex items-center gap-3 px-4 py-3.5 transition-all duration-150 ${cfg.bg} ${checked ? "opacity-50" : ""}`}
            >
              {/* Checkbox */}
              <button
                onClick={() => setDone((d) => ({ ...d, [t.id]: !d[t.id] }))}
                className={`relative grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] transition-all duration-200 ${
                  checked
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-card hover:border-brand/50"
                }`}
              >
                {checked && (
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                    <path
                      d="M2 6l3 3 5-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div
                  className={`text-[12.5px] font-medium leading-snug ${
                    checked ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {t.title}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-0.5 text-[10.5px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" strokeWidth={1.75} />
                    {t.time}
                  </span>
                  <span className="text-muted-foreground/30">·</span>
                  <span
                    className={`text-[10.5px] font-bold ${
                      t.impactType === "currency" ? "text-brand" : "text-warning"
                    }`}
                  >
                    {t.impact}
                  </span>
                </div>
              </div>

              {/* Priority badge */}
              <span
                className={`hidden shrink-0 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold sm:block ${cfg.labelColor}`}
              >
                {cfg.label}
              </span>

              {/* Action button */}
              {!checked && (
                <Link
                  to={t.to}
                  className="shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-foreground/20 hover:bg-foreground hover:text-background"
                >
                  {t.cta}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <div className="text-[11px] text-muted-foreground">
          AI-sorted by business impact
        </div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-1.5"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
