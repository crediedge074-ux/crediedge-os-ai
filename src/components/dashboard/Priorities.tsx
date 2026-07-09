import { useState } from "react";
import { ArrowRight } from "lucide-react";

type Priority = "High" | "Medium" | "Low";

const tasks: { title: string; priority: Priority }[] = [
  { title: "Respond to enquiries", priority: "High" },
  { title: "Follow up overdue jobs", priority: "High" },
  { title: "Send review requests", priority: "Medium" },
  { title: "Chase invoices", priority: "Medium" },
  { title: "Check website", priority: "Low" },
  { title: "Review ads", priority: "Low" },
];

const priorityStyles: Record<Priority, string> = {
  High: "bg-brand/10 text-brand",
  Medium: "bg-[color:var(--warning)]/10 text-[color:var(--warning)]",
  Low: "bg-secondary text-muted-foreground",
};

export function Priorities() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[15px] font-semibold tracking-tight text-foreground">
            Today's Priorities
          </div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">
            {Object.values(done).filter(Boolean).length} of {tasks.length} completed
          </div>
        </div>
      </div>

      <ul className="space-y-1">
        {tasks.map((t) => {
          const checked = !!done[t.title];
          return (
            <li key={t.title}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-secondary/70">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setDone((d) => ({ ...d, [t.title]: !d[t.title] }))
                  }
                  className="peer sr-only"
                />
                <span
                  className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border transition ${
                    checked
                      ? "border-brand bg-brand text-white"
                      : "border-border bg-card"
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
                  className={`flex-1 text-[13px] font-medium ${
                    checked ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {t.title}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityStyles[t.priority]}`}
                >
                  {t.priority}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <button className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground transition hover:text-brand">
        View All Tasks <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
