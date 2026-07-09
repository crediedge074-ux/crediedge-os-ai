import { useState } from "react";
import { ArrowRight, Clock, PoundSterling } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Priority = "High" | "Medium" | "Low";

interface Task {
  title: string;
  priority: Priority;
  time: string;
  impact: string;
}

const tasks: Task[] = [
  { title: "Reply to 4 enquiries", priority: "High", time: "10 min", impact: "£1,800" },
  { title: "Chase 2 overdue invoices", priority: "High", time: "5 min", impact: "£950" },
  { title: "Send 6 review requests", priority: "Medium", time: "8 min", impact: "£340" },
  { title: "Review ad performance", priority: "Medium", time: "15 min", impact: "£200" },
  { title: "Check website speed", priority: "Low", time: "5 min", impact: "SEO" },
];

const priorityDot: Record<Priority, string> = {
  High: "bg-brand",
  Medium: "bg-warning",
  Low: "bg-muted-foreground/40",
};

const priorityLabel: Record<Priority, string> = {
  High: "text-brand",
  Medium: "text-warning",
  Low: "text-muted-foreground",
};

export function Priorities() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
          Today's Priorities
        </span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {tasks.length}
        </span>
      </div>

      <ul className="space-y-px">
        {tasks.map((t) => {
          const checked = !!done[t.title];
          return (
            <li key={t.title}>
              <label className="group flex cursor-pointer items-start gap-2.5 rounded-lg px-1 py-2 transition-colors duration-150 hover:bg-secondary/60">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setDone((d) => ({ ...d, [t.title]: !d[t.title] }))}
                  className="peer sr-only"
                />
                <span
                  className={`mt-0.5 grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[4px] border transition-all duration-200 ${
                    checked ? "border-brand bg-brand text-white" : "border-border bg-card"
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
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`flex items-center gap-1.5 text-[12px] font-medium ${
                    checked ? "text-muted-foreground line-through" : "text-foreground"
                  }`}>
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${priorityDot[t.priority]}`} />
                    <span className="truncate">{t.title}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2.5 pl-3">
                    <span className="flex items-center gap-0.5 text-[10.5px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" strokeWidth={1.75} />
                      {t.time}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10.5px] font-semibold text-brand">
                      <PoundSterling className="h-2.5 w-2.5" strokeWidth={1.75} />
                      {t.impact}
                    </span>
                  </div>
                </div>
              </label>
            </li>
          );
        })}
      </ul>

      <Link
        to="/tasks"
        className="mt-3 inline-flex items-center gap-1 self-start text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-1.5"
      >
        View All Tasks <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
