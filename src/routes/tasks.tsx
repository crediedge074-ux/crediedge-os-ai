import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Sparkles, Clock, PoundSterling, Target, CircleCheck as CheckCircle2, Circle, ListFilter as Filter, LayoutList, ChartBar as BarChart3, History, ChevronRight, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Campaigns } from "@/components/tasks/Campaigns";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

// ─── Data ───────────────────────────────────────────────────────────────────

type Priority = "High" | "Medium" | "Low";

interface Task {
  id: number;
  title: string;
  priority: Priority;
  time: string;
  impact: string;
  impactType: "currency" | "text";
  done: boolean;
  campaign: string;
  mission: string;
  cta: string;
  to: string;
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Reply to 4 new enquiries",
    priority: "High",
    time: "15 min",
    impact: "£1,800",
    impactType: "currency",
    done: false,
    campaign: "Become Bromley's Highest Rated Garage",
    mission: "Reduce Response Time to < 1hr",
    cta: "Reply Now",
    to: "/communications",
  },
  {
    id: 2,
    title: "Chase 2 overdue invoices",
    priority: "High",
    time: "5 min",
    impact: "£950",
    impactType: "currency",
    done: false,
    campaign: "£30k Monthly Revenue Target",
    mission: "Optimise Service Pricing",
    cta: "Open CRM",
    to: "/relationships",
  },
  {
    id: 3,
    title: "Send 6 review requests",
    priority: "Medium",
    time: "8 min",
    impact: "£340",
    impactType: "currency",
    done: false,
    campaign: "Become Bromley's Highest Rated Garage",
    mission: "Reach 250 Google Reviews",
    cta: "Send Reviews",
    to: "/reviews",
  },
  {
    id: 4,
    title: "Review ad campaign performance",
    priority: "Medium",
    time: "15 min",
    impact: "£200",
    impactType: "currency",
    done: false,
    campaign: "£30k Monthly Revenue Target",
    mission: "Launch Premium Package",
    cta: "View Insights",
    to: "/insights",
  },
  {
    id: 5,
    title: "Fix homepage speed issue",
    priority: "Low",
    time: "45 min",
    impact: "SEO risk",
    impactType: "text",
    done: true,
    campaign: "Become Bromley's Highest Rated Garage",
    mission: "Improve Website Speed Score",
    cta: "View Website",
    to: "/website",
  },
  {
    id: 6,
    title: "Set up invoice automation",
    priority: "Medium",
    time: "30 min",
    impact: "4 hrs/wk",
    impactType: "text",
    done: false,
    campaign: "Automate 80% of Admin",
    mission: "Automate Invoice Sending",
    cta: "View Integrations",
    to: "/integrations",
  },
];

const priorityConfig: Record<Priority, { dot: string; badge: string; border: string }> = {
  High: { dot: "bg-brand", badge: "bg-brand/10 text-brand", border: "border-l-brand" },
  Medium: { dot: "bg-warning", badge: "bg-warning/10 text-warning", border: "border-l-warning" },
  Low: { dot: "bg-muted-foreground/40", badge: "bg-secondary text-muted-foreground", border: "border-l-border" },
};

const analyticsData = [
  { label: "Completed Today", value: "1", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Pending", value: "5", icon: Circle, color: "text-brand", bg: "bg-brand/10" },
  { label: "Est. Impact Today", value: "£3,290", icon: PoundSterling, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Time Required", value: "1h 48m", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
];

const historyItems = [
  { title: "Check website speed", completedAt: "Yesterday, 3:42pm", campaign: "Become Bromley's Highest Rated Garage", impact: "Speed improved" },
  { title: "Send review requests to 8 customers", completedAt: "Yesterday, 11:20am", campaign: "Become Bromley's Highest Rated Garage", impact: "+£420" },
  { title: "Update pricing page", completedAt: "2 days ago", campaign: "£30k Monthly Revenue Target", impact: "Conversion +8%" },
  { title: "Set up Google Calendar sync", completedAt: "2 days ago", campaign: "Automate 80% of Admin", impact: "2 hrs/wk saved" },
];

// ─── Today's Focus ──────────────────────────────────────────────────────────

function TodaysFocus({ tasks }: { tasks: Task[] }) {
  const pending = tasks.filter((t) => !t.done);
  const totalImpact = pending
    .filter((t) => t.impactType === "currency")
    .reduce((sum, t) => sum + parseFloat(t.impact.replace(/[£,]/g, "")), 0);
  const totalTime = pending.reduce((sum, t) => {
    const mins = parseInt(t.time);
    return sum + (isNaN(mins) ? 0 : mins);
  }, 0);

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-foreground p-5 text-background shadow-card">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-8 h-28 w-28 rounded-full bg-brand/20 blur-2xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-background/60" strokeWidth={2} />
            <span className="text-[10.5px] font-semibold uppercase tracking-widest text-background/50">
              Today's Focus
            </span>
          </div>
          <h2 className="text-[16px] font-bold leading-snug text-background">
            You have {pending.length} tasks to complete today.
          </h2>
          <p className="mt-1.5 text-[12.5px] text-background/60">
            Completing all pending tasks will generate an estimated{" "}
            <span className="font-semibold text-background">
              £{totalImpact.toLocaleString()}
            </span>{" "}
            and requires approximately{" "}
            <span className="font-semibold text-background">{totalTime} minutes</span>.
            Tasks are sorted by business impact.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-center">
            <div className="text-[10px] font-medium text-background/50">Est. Impact</div>
            <div className="text-[16px] font-extrabold text-background">
              £{totalImpact.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-center">
            <div className="text-[10px] font-medium text-background/50">Time needed</div>
            <div className="text-[16px] font-extrabold text-background">{totalTime}m</div>
          </div>
        </div>
      </div>

      {/* AI priority note */}
      <div className="relative mt-4 flex items-center gap-2.5 rounded-xl bg-white/8 px-4 py-2.5">
        <Zap className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2} />
        <span className="text-[12px] text-background/80">
          <span className="font-semibold text-background">AI Priority Queue active.</span>{" "}
          Tasks ordered by maximum business impact. Complete in order for best results.
        </span>
      </div>
    </div>
  );
}

// ─── Missions Section ────────────────────────────────────────────────────────

function MissionsSection() {
  const missions = [
    { id: "m1", title: "Reach 250 Google Reviews", campaign: "Become Bromley's Highest Rated Garage", progress: 82, tasks: 12, completed: 10 },
    { id: "m2", title: "Reduce Response Time to < 1hr", campaign: "Become Bromley's Highest Rated Garage", progress: 65, tasks: 8, completed: 5 },
    { id: "m3", title: "Optimise Service Pricing", campaign: "£30k Monthly Revenue Target", progress: 90, tasks: 5, completed: 4 },
    { id: "m4", title: "Automate Invoice Sending", campaign: "Automate 80% of Admin", progress: 70, tasks: 4, completed: 3 },
    { id: "m5", title: "Launch Premium Package", campaign: "£30k Monthly Revenue Target", progress: 45, tasks: 9, completed: 4 },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <Target className="h-4 w-4 text-foreground/60" strokeWidth={1.75} />
        <span className="text-[13.5px] font-semibold text-foreground">Active Missions</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[10px] font-bold text-foreground/70">
          {missions.length}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {missions.map((m) => (
          <li key={m.id} className="group flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 hover:bg-secondary/40">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[12.5px] font-medium text-foreground truncate">{m.title}</span>
                <span className="shrink-0 text-[11px] font-bold text-foreground">{m.progress}%</span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-brand"
                  style={{ width: `${m.progress}%`, transition: "width 0.7s ease-out" }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground">
                  <ChevronRight className="h-2.5 w-2.5" strokeWidth={2} />
                  <span className="truncate">{m.campaign}</span>
                </div>
                <span className="shrink-0 text-[10.5px] text-muted-foreground">
                  {m.completed}/{m.tasks} tasks
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Task List ───────────────────────────────────────────────────────────────

function TaskList({
  tasks,
  onToggle,
}: {
  tasks: Task[];
  onToggle: (id: number) => void;
}) {
  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="space-y-4">
      {/* Pending */}
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
          <span className="text-[13.5px] font-semibold text-foreground">Task List</span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
            {pending.length}
          </span>
          <button className="ml-auto flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary">
            <Filter className="h-3 w-3" strokeWidth={1.75} />
            Filter
          </button>
        </div>

        {pending.length === 0 ? (
          <div className="px-5 py-10 text-center text-[13px] text-muted-foreground">
            All tasks complete — great work!
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {pending.map((t) => {
              const cfg = priorityConfig[t.priority];
              return (
                <li
                  key={t.id}
                  className={`group flex items-start gap-3.5 border-l-2 px-5 py-4 transition-colors duration-150 hover:bg-secondary/30 ${cfg.border}`}
                >
                  <button
                    onClick={() => onToggle(t.id)}
                    className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] border-border bg-card transition-all duration-200 hover:border-brand/50"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-medium text-foreground">{t.title}</span>
                      <span className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-bold ${cfg.badge}`}>
                        {t.priority}
                      </span>
                    </div>

                    {/* Breadcrumb */}
                    <div className="mt-1 flex items-center gap-1 text-[10.5px] text-muted-foreground">
                      <span className="truncate max-w-[160px]">{t.campaign}</span>
                      <ChevronRight className="h-2.5 w-2.5 shrink-0" strokeWidth={2} />
                      <span className="truncate max-w-[140px]">{t.mission}</span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-3">
                      <span className="flex items-center gap-0.5 text-[10.5px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" strokeWidth={1.75} />
                        {t.time}
                      </span>
                      <span
                        className={`text-[10.5px] font-bold ${
                          t.impactType === "currency" ? "text-brand" : "text-warning"
                        }`}
                      >
                        {t.impact}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={t.to}
                    className="shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-foreground/20 hover:bg-foreground hover:text-background"
                  >
                    {t.cta}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Completed */}
      {done.length > 0 && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
            <span className="text-[13.5px] font-semibold text-foreground">Completed</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-100 px-1 text-[10px] font-bold text-emerald-700">
              {done.length}
            </span>
          </div>
          <ul className="divide-y divide-border">
            {done.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3.5 px-5 py-3.5 opacity-50"
              >
                <button
                  onClick={() => onToggle(t.id)}
                  className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] border-brand bg-brand text-white"
                >
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-foreground line-through">{t.title}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground">
                    <span className="truncate">{t.campaign}</span>
                    <ChevronRight className="h-2.5 w-2.5 shrink-0" strokeWidth={2} />
                    <span className="truncate">{t.mission}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Task Analytics ──────────────────────────────────────────────────────────

function TaskAnalytics() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {analyticsData.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
            <div className={`mb-3 grid h-8 w-8 place-items-center rounded-xl ${s.bg} ${s.color}`}>
              <Icon className="h-[14px] w-[14px]" strokeWidth={2} />
            </div>
            <div className={`text-[22px] font-extrabold leading-none ${s.color}`}>{s.value}</div>
            <div className="mt-1 text-[10.5px] text-muted-foreground leading-tight">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Task History ─────────────────────────────────────────────────────────────

function TaskHistory() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <History className="h-4 w-4 text-foreground/60" strokeWidth={1.75} />
        <span className="text-[13.5px] font-semibold text-foreground">Task History</span>
      </div>
      <ul className="divide-y divide-border">
        {historyItems.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3.5 px-5 py-3.5 transition-colors hover:bg-secondary/30">
            <div className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-medium text-foreground">{item.title}</div>
              <div className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground">
                <span>{item.completedAt}</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="truncate">{item.campaign}</span>
              </div>
            </div>
            <span className="shrink-0 rounded-lg bg-brand/10 px-2 py-0.5 text-[10.5px] font-bold text-brand">
              {item.impact}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── AI Priority Queue ────────────────────────────────────────────────────────

function AIPriorityQueue({ tasks }: { tasks: Task[] }) {
  const top3 = tasks.filter((t) => !t.done).slice(0, 3);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <Sparkles className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
        <span className="text-[13.5px] font-semibold text-foreground">AI Priority Queue</span>
        <span className="ml-auto rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
          AI
        </span>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-[12px] text-muted-foreground mb-3">
          Complete these 3 tasks first for maximum business impact today.
        </p>
        {top3.map((t, idx) => (
          <div key={t.id} className="flex items-center gap-3 rounded-xl bg-secondary/50 px-3.5 py-2.5">
            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-extrabold text-white">
              {idx + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-medium text-foreground truncate">{t.title}</div>
              <div className="text-[10.5px] text-muted-foreground">{t.time} · {t.impact}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggle = (id: number) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  return (
    <AppLayout>
      <PageHeader
        title="Tasks"
        description="Campaigns drive Missions. Missions drive Tasks. Everything connects."
        crumbs={[{ label: "Tasks" }]}
        action={{ label: "Add Task", icon: Plus }}
      />

      {/* 1. Today's Focus */}
      <TodaysFocus tasks={tasks} />

      {/* 2. Campaigns */}
      <div className="mb-5">
        <Campaigns />
      </div>

      {/* 3. Missions */}
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">Missions</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <MissionsSection />
      </div>

      {/* 4. AI Priority Queue */}
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">AI Priority Queue</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <AIPriorityQueue tasks={tasks} />
      </div>

      {/* 5–6. Task Analytics + Task List */}
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">Task Analytics</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <TaskAnalytics />
      </div>

      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">Task List</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <TaskList tasks={tasks} onToggle={toggle} />
      </div>

      {/* 7. Task History */}
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">Task History</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <TaskHistory />
      </div>

      <div className="h-8" />
    </AppLayout>
  );
}
