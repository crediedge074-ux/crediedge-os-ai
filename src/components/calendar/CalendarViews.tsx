import React from "react";
import { Clock, CheckCircle2, AlertCircle, Briefcase, Calendar as CalendarIcon, ExternalLink, ShieldCheck } from "lucide-react";
import type { CalendarEvent, Task } from "@/lib/database.types";
import type { CalendarViewType } from "./CalendarComponents";

interface CalendarViewsProps {
  view: CalendarViewType;
  currentDate: Date;
  events: CalendarEvent[];
  tasks: Task[];
  linkedTaskMap: Record<string, Task>;
  onSelectDate: (date: Date) => void;
  onOpenEventDetail: (event: CalendarEvent) => void;
  onOpenTaskWorkspace: (task: Task) => void;
}

export function CalendarViews({
  view,
  currentDate,
  events,
  tasks,
  linkedTaskMap,
  onSelectDate,
  onOpenEventDetail,
  onOpenTaskWorkspace,
}: CalendarViewsProps) {
  if (view === "month") {
    return (
      <MonthView
        currentDate={currentDate}
        events={events}
        tasks={tasks}
        linkedTaskMap={linkedTaskMap}
        onSelectDate={onSelectDate}
        onOpenEventDetail={onOpenEventDetail}
        onOpenTaskWorkspace={onOpenTaskWorkspace}
      />
    );
  }

  if (view === "week") {
    return (
      <WeekView
        currentDate={currentDate}
        events={events}
        tasks={tasks}
        linkedTaskMap={linkedTaskMap}
        onOpenEventDetail={onOpenEventDetail}
        onOpenTaskWorkspace={onOpenTaskWorkspace}
      />
    );
  }

  return (
    <DayView
      currentDate={currentDate}
      events={events}
      tasks={tasks}
      linkedTaskMap={linkedTaskMap}
      onOpenEventDetail={onOpenEventDetail}
      onOpenTaskWorkspace={onOpenTaskWorkspace}
    />
  );
}

function MonthView({
  currentDate,
  events,
  tasks,
  linkedTaskMap,
  onSelectDate,
  onOpenEventDetail,
  onOpenTaskWorkspace,
}: Omit<CalendarViewsProps, "view">) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDayOfMonth.getDate();

  const daysGrid: (Date | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(new Date(year, month, d));
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex-1 flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-border bg-secondary/30 text-center text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground py-2.5">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr divide-x divide-y divide-border bg-card">
        {daysGrid.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="bg-secondary/10 min-h-[90px]" />;
          }

          const dateStr = date.toISOString().slice(0, 10);
          const isToday = dateStr === todayStr;

          const dayEvents = events.filter((e) => e.start_time.slice(0, 10) === dateStr);
          const dayScheduledTasks = tasks.filter(
            (t) => (t as any).scheduled_start && (t as any).scheduled_start.slice(0, 10) === dateStr
          );

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(date)}
              className={`p-2 min-h-[90px] flex flex-col justify-between transition-colors cursor-pointer hover:bg-secondary/20 ${
                isToday ? "bg-brand/5 font-extrabold" : ""
              }`}
            >
              <div className="flex items-center justify-between text-[11.5px]">
                <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full ${
                  isToday ? "bg-brand text-white font-black" : "text-foreground font-bold"
                }`}>
                  {date.getDate()}
                </span>
                {(dayEvents.length > 0 || dayScheduledTasks.length > 0) && (
                  <span className="text-[9.5px] font-extrabold text-muted-foreground">
                    {dayEvents.length + dayScheduledTasks.length} item(s)
                  </span>
                )}
              </div>

              {/* Day Items Preview */}
              <div className="space-y-1 my-1 overflow-hidden">
                {dayEvents.slice(0, 2).map((ev) => {
                  const linkedTask = ev.task_id ? linkedTaskMap[ev.task_id] : null;
                  const isCompleted = linkedTask?.status === "completed";

                  return (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEventDetail(ev);
                      }}
                      className={`truncate rounded px-1.5 py-0.5 text-[10.5px] font-semibold transition-all ${
                        ev.event_type === "task" || ev.task_id
                          ? isCompleted
                            ? "bg-secondary text-muted-foreground line-through opacity-70"
                            : "bg-brand/10 text-brand font-bold border border-brand/20"
                          : "bg-blue-500/10 text-blue-600 font-medium"
                      }`}
                    >
                      {ev.title}
                    </div>
                  );
                })}

                {dayScheduledTasks.slice(0, 2).map((t) => (
                  <div
                    key={`sched-${t.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTaskWorkspace(t);
                    }}
                    className={`truncate rounded px-1.5 py-0.5 text-[10.5px] font-bold border ${
                      t.status === "completed"
                        ? "bg-secondary text-muted-foreground border-border line-through"
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    }`}
                  >
                    Task: {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  currentDate,
  events,
  tasks,
  linkedTaskMap,
  onOpenEventDetail,
  onOpenTaskWorkspace,
}: Omit<CalendarViewsProps, "view" | "onSelectDate">) {
  const curr = new Date(currentDate);
  const dayOfWeek = curr.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + diffToMonday);

  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex-1 flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="grid grid-cols-7 border-b border-border bg-secondary/30 text-center divide-x divide-border">
        {weekDays.map((d) => {
          const dStr = d.toISOString().slice(0, 10);
          const isToday = dStr === todayStr;
          return (
            <div key={dStr} className={`py-3 px-2 ${isToday ? "bg-brand/10" : ""}`}>
              <div className="text-[11px] font-extrabold uppercase text-muted-foreground">
                {d.toLocaleString("en-GB", { weekday: "short" })}
              </div>
              <div className={`text-[15px] font-black mt-0.5 ${isToday ? "text-brand" : "text-foreground"}`}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7 flex-1 divide-x divide-border bg-card overflow-y-auto">
        {weekDays.map((d) => {
          const dateStr = d.toISOString().slice(0, 10);
          const dayEvents = events.filter((e) => e.start_time.slice(0, 10) === dateStr);
          const dayTasks = tasks.filter(
            (t) => (t as any).scheduled_start && (t as any).scheduled_start.slice(0, 10) === dateStr
          );

          return (
            <div key={dateStr} className="p-2 space-y-2 min-h-[300px]">
              {dayEvents.map((ev) => {
                const linkedTask = ev.task_id ? linkedTaskMap[ev.task_id] : null;
                const isCompleted = linkedTask?.status === "completed";

                return (
                  <div
                    key={ev.id}
                    onClick={() => onOpenEventDetail(ev)}
                    className={`rounded-xl border p-2 text-[11px] space-y-1 cursor-pointer transition-all ${
                      ev.event_type === "task" || ev.task_id
                        ? isCompleted
                          ? "bg-secondary/40 text-muted-foreground border-border line-through"
                          : "bg-brand/10 border-brand/30 text-foreground font-bold"
                        : "bg-blue-500/10 border-blue-500/30 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                      <span>{new Date(ev.start_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="uppercase text-[9px] font-bold">{ev.event_type}</span>
                    </div>
                    <div className="font-extrabold text-[11.5px] leading-snug">{ev.title}</div>
                  </div>
                );
              })}

              {dayTasks.map((t) => (
                <div
                  key={`sched-week-${t.id}`}
                  onClick={() => onOpenTaskWorkspace(t)}
                  className={`rounded-xl border p-2 text-[11px] space-y-1 cursor-pointer transition-all ${
                    t.status === "completed"
                      ? "bg-secondary/40 border-border text-muted-foreground line-through"
                      : "bg-emerald-500/10 border-emerald-500/30 text-foreground font-bold"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-emerald-600 font-bold">
                    <span>Task Schedule</span>
                    <span className="uppercase text-[9px]">{t.priority}</span>
                  </div>
                  <div className="font-extrabold text-[11.5px] leading-snug">{t.title}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayView({
  currentDate,
  events,
  tasks,
  linkedTaskMap,
  onOpenEventDetail,
  onOpenTaskWorkspace,
}: Omit<CalendarViewsProps, "view" | "onSelectDate">) {
  const dateStr = currentDate.toISOString().slice(0, 10);
  const dayEvents = events.filter((e) => e.start_time.slice(0, 10) === dateStr);
  const dayTasks = tasks.filter(
    (t) => (t as any).scheduled_start && (t as any).scheduled_start.slice(0, 10) === dateStr
  );

  const hasItems = dayEvents.length > 0 || dayTasks.length > 0;

  return (
    <div className="flex-1 flex flex-col rounded-2xl border border-border bg-card p-6 space-y-4 overflow-y-auto shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-[18px] font-black text-foreground">
            {currentDate.toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </h3>
          <p className="text-[12px] text-muted-foreground">Daily Schedule & Executable Work Blocks</p>
        </div>
        <span className="rounded-xl bg-brand/10 px-3 py-1 text-[11px] font-extrabold text-brand">
          {dayEvents.length + dayTasks.length} Schedule Item(s)
        </span>
      </div>

      {!hasItems ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 my-auto">
          <CalendarIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <div className="text-[15px] font-extrabold text-foreground">Your calendar is clear today.</div>
          <p className="text-[12.5px] text-muted-foreground max-w-sm mx-auto">
            No events or scheduled task time blocks recorded for this date.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((ev) => {
            const linkedTask = ev.task_id ? linkedTaskMap[ev.task_id] : null;
            const isCompleted = linkedTask?.status === "completed";

            return (
              <div
                key={ev.id}
                onClick={() => onOpenEventDetail(ev)}
                className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 cursor-pointer transition-all hover:border-brand/40 ${
                  ev.event_type === "task" || ev.task_id
                    ? isCompleted
                      ? "bg-secondary/30 border-border text-muted-foreground line-through opacity-75"
                      : "bg-brand/5 border-brand/30"
                    : "bg-blue-500/5 border-blue-500/20"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-secondary px-2 py-0.5 text-[10.5px] font-extrabold uppercase text-foreground">
                      {ev.event_type}
                    </span>
                    <span className="text-[12px] font-bold text-muted-foreground">
                      {new Date(ev.start_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} –{" "}
                      {new Date(ev.end_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="text-[14px] font-extrabold text-foreground">{ev.title}</div>
                  {ev.description && <p className="text-[12px] text-muted-foreground">{ev.description}</p>}
                </div>

                <button
                  type="button"
                  className="rounded-lg bg-secondary px-3 py-1.5 text-[11.5px] font-extrabold text-foreground hover:bg-brand hover:text-white transition-colors"
                >
                  View Details
                </button>
              </div>
            );
          })}

          {dayTasks.map((t) => (
            <div
              key={`day-task-${t.id}`}
              onClick={() => onOpenTaskWorkspace(t)}
              className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 cursor-pointer transition-all hover:border-emerald-500/50 ${
                t.status === "completed"
                  ? "bg-secondary/30 border-border text-muted-foreground line-through opacity-75"
                  : "bg-emerald-500/5 border-emerald-500/30"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10.5px] font-extrabold uppercase text-emerald-600">
                    Task Time Block
                  </span>
                  <span className="text-[12px] font-bold text-muted-foreground">
                    {new Date((t as any).scheduled_start).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="text-[14px] font-extrabold text-foreground">{t.title}</div>
              </div>

              <button
                type="button"
                className="rounded-lg bg-foreground px-3 py-1.5 text-[11.5px] font-bold text-background hover:bg-brand hover:text-white transition-colors"
              >
                Open Task Workspace
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
