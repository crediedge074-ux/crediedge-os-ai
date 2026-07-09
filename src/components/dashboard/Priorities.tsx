import { useState } from "react";
import { ArrowRight } from "lucide-react";

type Priority = "High" | "Medium" | "Low";

const tasks: { title: string; priority: Priority }[] = [
  { title: "Respond to 4 new enquiries", priority: "High" },
  { title: "Follow up with 3 overdue jobs", priority: "High" },
  { title: "Send 6 review requests", priority: "Medium" },
  { title: "Chase 2 unpaid invoices", priority: "Medium" },
  { title: "Check website performance", priority: "Low" },
  { title: "Review ad performance", priority: "Low" },
];

const priorityStyles: Record<Priority, string> = {
  High: "bg-brand/10 text-brand",
  Medium: "bg-secondary text-foreground/70",
  Low: "bg-secondary text-muted-foreground",
};

export function Priorities() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Today's Priorities
        </span>
        <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-[10.5px] font-bold text-white">
          {tasks.length}
        </span>
      </div>

      <ul className="space-y-0.5">
        {tasks.map((t) => {
          const checked = !!done[t.title];
          return (
            <li key={t.title}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 transition hover:bg-secondary/70">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setDone((d) => ({ ...d, [t.title]: !d[t.title] }))}
                  className="peer sr-only"
                />
                <span
                  className={`grid h-[17px] w-[17px] shrink-0 place-items-center rounded-[5px] border transition ${
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
                <span
                  className={`flex-1 truncate text-[12.5px] font-medium ${
                    checked ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {t.title}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${priorityStyles[t.priority]}`}
                >
                  {t.priority}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <button className="mt-3 inline-flex items-center gap-1 self-start text-[12.5px] font-semibold text-brand transition hover:gap-1.5">
        View All Tasks <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
