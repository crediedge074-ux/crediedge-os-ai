import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  User,
  ExternalLink,
  Trash2,
  CalendarDays,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import type { CalendarEvent, Task } from "@/lib/database.types";
import { calculateDeterministicTaskPriority } from "@/services/taskPriority";

export type CalendarViewType = "month" | "week" | "day";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onNewEvent: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onNewEvent,
}: CalendarHeaderProps) {
  const getRangeLabel = () => {
    if (view === "month") {
      return currentDate.toLocaleString("en-GB", { month: "long", year: "numeric" });
    }
    if (view === "day") {
      return currentDate.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    }
    // Week
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay() + 1;
    const startOfWeek = new Date(curr.setDate(first));
    const endOfWeek = new Date(curr.setDate(first + 6));
    return `${startOfWeek.toLocaleString("en-GB", { day: "numeric", month: "short" })} – ${endOfWeek.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-6 py-4 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="rounded-lg border border-border bg-secondary/30 px-3 py-1 text-[12px] font-bold text-foreground hover:bg-secondary"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <h2 className="text-[17px] font-extrabold text-foreground tracking-tight">{getRangeLabel()}</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-border bg-secondary/30 p-0.5 text-[12px] font-semibold">
          <button
            type="button"
            onClick={() => onViewChange("month")}
            className={`rounded-md px-3 py-1 transition-all ${view === "month" ? "bg-card text-foreground font-extrabold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => onViewChange("week")}
            className={`rounded-md px-3 py-1 transition-all ${view === "week" ? "bg-card text-foreground font-extrabold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => onViewChange("day")}
            className={`rounded-md px-3 py-1 transition-all ${view === "day" ? "bg-card text-foreground font-extrabold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            Day
          </button>
        </div>

        <button
          type="button"
          onClick={onNewEvent}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-1.5 text-[12.5px] font-extrabold text-white shadow-sm hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Event
        </button>
      </div>
    </div>
  );
}

interface ActiveTasksPanelProps {
  selectedDate: Date;
  allTasks: Task[];
  linkedTaskMap: Record<string, Task>;
  onOpenTaskWorkspace: (task: Task) => void;
  onScheduleTask: (task: Task) => void;
  onToggleTaskCompletion: (task: Task) => void;
}

export function ActiveTasksPanel({
  selectedDate,
  allTasks,
  linkedTaskMap,
  onOpenTaskWorkspace,
  onScheduleTask,
  onToggleTaskCompletion,
}: ActiveTasksPanelProps) {
  const selectedDateStr = selectedDate.toISOString().slice(0, 10);
  const nowStr = new Date().toISOString().slice(0, 10);

  // Group tasks into due today, scheduled, overdue, and unscheduled backlog
  const dueTodayTasks: Task[] = [];
  const scheduledTasks: Task[] = [];
  const overdueTasks: Task[] = [];
  const unscheduledBacklog: Task[] = [];

  allTasks.forEach((t) => {
    if (t.status === "completed") return;

    const dueDateStr = t.due_date ? t.due_date.slice(0, 10) : null;
    const schedStartStr = (t as any).scheduled_start ? (t as any).scheduled_start.slice(0, 10) : null;

    let isCategorized = false;

    if (dueDateStr && dueDateStr < nowStr) {
      overdueTasks.push(t);
      isCategorized = true;
    }

    if (schedStartStr === selectedDateStr) {
      scheduledTasks.push(t);
      isCategorized = true;
    } else if (dueDateStr === selectedDateStr) {
      dueTodayTasks.push(t);
      isCategorized = true;
    }

    if (!isCategorized && !schedStartStr) {
      unscheduledBacklog.push(t);
    }
  });

  const isSelectedToday = selectedDateStr === nowStr;

  return (
    <div className="w-full lg:w-80 shrink-0 flex flex-col rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm">
      <div className="flex flex-col gap-1 border-b border-border pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand" />
            <h3 className="text-[14px] font-extrabold text-foreground">Active Tasks Hub</h3>
          </div>
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10.5px] font-extrabold text-brand">
            {allTasks.filter((t) => t.status !== "completed").length} Active
          </span>
        </div>

        {/* Selected Date Context Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] pt-1">
          <span className="text-muted-foreground font-medium">Viewing Date:</span>
          <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10.5px] ${
            isSelectedToday
              ? "bg-brand text-white shadow-sm"
              : "bg-secondary text-foreground border border-border"
          }`}>
            {isSelectedToday ? "TODAY (" + selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + ")" : selectedDate.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-[12px]">
        {/* OVERDUE TASKS */}
        {overdueTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-red-500">
              <AlertCircle className="h-3.5 w-3.5" /> Overdue Tasks ({overdueTasks.length})
            </div>
            {overdueTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                isOverdue
                onOpen={() => onOpenTaskWorkspace(t)}
                onSchedule={() => onScheduleTask(t)}
                onComplete={() => onToggleTaskCompletion(t)}
              />
            ))}
          </div>
        )}

        {/* SCHEDULED ON SELECTED DATE */}
        {scheduledTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-500">
              <Clock className="h-3.5 w-3.5" /> Scheduled for Selected Date ({scheduledTasks.length})
            </div>
            {scheduledTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onOpen={() => onOpenTaskWorkspace(t)}
                onSchedule={() => onScheduleTask(t)}
                onComplete={() => onToggleTaskCompletion(t)}
              />
            ))}
          </div>
        )}

        {/* DUE TODAY */}
        {dueTodayTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-500">
              <CalendarIcon className="h-3.5 w-3.5" /> Due Today ({dueTodayTasks.length})
            </div>
            {dueTodayTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onOpen={() => onOpenTaskWorkspace(t)}
                onSchedule={() => onScheduleTask(t)}
                onComplete={() => onToggleTaskCompletion(t)}
              />
            ))}
          </div>
        )}

        {/* UNSCHEDULED BACKLOG */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            <span>Unscheduled Backlog ({unscheduledBacklog.length})</span>
          </div>
          {unscheduledBacklog.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-3 text-center text-[11px] text-muted-foreground">
              No unscheduled backlog tasks.
            </div>
          ) : (
            unscheduledBacklog.slice(0, 10).map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onOpen={() => onOpenTaskWorkspace(t)}
                onSchedule={() => onScheduleTask(t)}
                onComplete={() => onToggleTaskCompletion(t)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  isOverdue?: boolean;
  onOpen: () => void;
  onSchedule: () => void;
  onComplete: () => void;
}

function TaskCard({ task, isOverdue, onOpen, onSchedule, onComplete }: TaskCardProps) {
  const prio = calculateDeterministicTaskPriority(task);

  return (
    <div className={`group rounded-xl border p-3 transition-all ${isOverdue ? "border-red-500/30 bg-red-500/5" : "border-border bg-card hover:border-brand/40"}`}>
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="text-[12.5px] font-bold text-foreground text-left hover:text-brand line-clamp-2"
        >
          {task.title}
        </button>
        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase ${
          prio.calculatedTier === "Urgent" ? "bg-red-500/10 text-red-500" :
          prio.calculatedTier === "High" ? "bg-amber-500/10 text-amber-500" :
          prio.calculatedTier === "Medium" ? "bg-blue-500/10 text-blue-500" : "bg-secondary text-muted-foreground"
        }`}>
          {prio.calculatedTier}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10.5px] text-muted-foreground border-t border-border/40 pt-2">
        <div className="flex items-center gap-1.5">
          {(task as any).scheduled_start ? (
            <span className="text-emerald-500 font-semibold flex items-center gap-1">
              <Clock className="h-3 w-3" /> {new Date((task as any).scheduled_start).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </span>
          ) : task.due_date ? (
            <span className={isOverdue ? "text-red-500 font-bold" : "text-muted-foreground"}>
              Due: {task.due_date.slice(0, 10)}
            </span>
          ) : (
            <span>No schedule</span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onSchedule}
            className="rounded px-1.5 py-0.5 font-bold text-brand hover:bg-brand/10 text-[10px]"
          >
            {(task as any).scheduled_start ? "Reschedule" : "+ Schedule"}
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="rounded p-1 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500"
            title="Mark Complete"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
