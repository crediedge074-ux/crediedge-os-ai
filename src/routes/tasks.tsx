import { createFileRoute } from "@tanstack/react-router";
import { SquareCheck as CheckSquare, Plus } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState } from "react";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

const initialTasks = [
  { id: 1, title: "Reply to 4 new enquiries", priority: "High" as const, time: "10 min", impact: "£1,800", done: false },
  { id: 2, title: "Chase 2 overdue invoices", priority: "High" as const, time: "5 min", impact: "£950", done: false },
  { id: 3, title: "Send 6 review requests", priority: "Medium" as const, time: "8 min", impact: "£340", done: false },
  { id: 4, title: "Review ad performance", priority: "Medium" as const, time: "15 min", impact: "£200", done: false },
  { id: 5, title: "Check website speed", priority: "Low" as const, time: "5 min", impact: "SEO", done: true },
];

const priorityColor: Record<"High" | "Medium" | "Low", string> = {
  High: "text-brand bg-brand/10",
  Medium: "text-warning bg-warning/10",
  Low: "text-muted-foreground bg-secondary",
};

function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggle = (id: number) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <AppLayout>
      <PageHeader
        title="Tasks"
        description="Manage and prioritise your daily actions to maximise business impact."
        crumbs={[{ label: "Tasks" }]}
        action={{ label: "Add Task", icon: Plus }}
      />

      {tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Create your first task to start managing your daily priorities."
          action={{ label: "Create Task" }}
        />
      ) : (
        <div className="space-y-5">
          {/* Pending */}
          <div className="rounded-xl border border-border bg-card shadow-soft">
            <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
              <span className="text-[13px] font-semibold text-foreground">Pending</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{pending.length}</span>
            </div>
            {pending.length === 0 ? (
              <div className="px-5 py-8 text-center text-[13px] text-muted-foreground">All tasks complete 🎉</div>
            ) : (
              <ul className="divide-y divide-border">
                {pending.map((t) => (
                  <li key={t.id} className="flex items-center gap-3.5 px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggle(t.id)}
                      className="h-4 w-4 shrink-0 cursor-pointer rounded accent-brand"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-foreground">{t.title}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-muted-foreground">
                        <span>{t.time}</span>
                        <span className="text-brand font-semibold">{t.impact}</span>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${priorityColor[t.priority]}`}>
                      {t.priority}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Completed */}
          {done.length > 0 && (
            <div className="rounded-xl border border-border bg-card shadow-soft">
              <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
                <span className="text-[13px] font-semibold text-foreground">Completed</span>
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-success/15 px-1 text-[10px] font-bold text-success">{done.length}</span>
              </div>
              <ul className="divide-y divide-border">
                {done.map((t) => (
                  <li key={t.id} className="flex items-center gap-3.5 px-5 py-3.5 opacity-60">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggle(t.id)}
                      className="h-4 w-4 shrink-0 cursor-pointer rounded accent-brand"
                    />
                    <div className="text-[13px] font-medium text-foreground line-through">{t.title}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
