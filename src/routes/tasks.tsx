import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Sparkles, Clock, CircleCheck as CheckCircle2, Circle, ListFilter as Filter, ChevronRight, Zap, Trash2, Edit3, User, AlertCircle, X, Check } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Campaigns } from "@/components/tasks/Campaigns";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  fetchWorkspaceMembers,
  type WorkspaceMemberInfo,
} from "@/services/tasks";
import type { Task, TaskInsert } from "@/lib/database.types";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

type Priority = "urgent" | "high" | "medium" | "low";

const priorityConfig: Record<string, { label: string; dot: string; badge: string; border: string }> = {
  urgent: { label: "Urgent", dot: "bg-destructive animate-pulse", badge: "bg-destructive/10 text-destructive", border: "border-l-destructive" },
  high: { label: "High", dot: "bg-brand", badge: "bg-brand/10 text-brand", border: "border-l-brand" },
  medium: { label: "Medium", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700", border: "border-l-amber-500" },
  low: { label: "Low", dot: "bg-muted-foreground/40", badge: "bg-secondary text-muted-foreground", border: "border-l-border" },
};

function TodaysFocus({ pendingCount }: { pendingCount: number }) {
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
            {pendingCount > 0
              ? `You have ${pendingCount} active task${pendingCount !== 1 ? "s" : ""} in your workspace.`
              : "All workspace tasks are complete — excellent momentum!"}
          </h2>
          <p className="mt-1.5 text-[12.5px] text-background/60">
            Tasks are synchronized across your team with member assignments and priority status tracking.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-center">
            <div className="text-[10px] font-medium text-background/50">Active Tasks</div>
            <div className="text-[16px] font-extrabold text-background">{pendingCount}</div>
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-2.5 rounded-xl bg-white/8 px-4 py-2.5">
        <Zap className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2} />
        <span className="text-[12px] text-background/80">
          <span className="font-semibold text-background">AI Priority Alignment.</span>{" "}
          Tasks marked high or urgent priority feed directly into your Command Centre Executive Priorities.
        </span>
      </div>
    </div>
  );
}

// ─── Task Modal (Create & Edit) ────────────────────────────────────────────────

function TaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  members,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskInsert) => Promise<void>;
  taskToEdit?: Task | null;
  members: WorkspaceMemberInfo[];
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setPriority((taskToEdit.priority as Priority) || "medium");
      setDueDate(taskToEdit.due_date || "");
      setAssignedTo(taskToEdit.assigned_to || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setAssignedTo("");
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null,
        assigned_to: assignedTo || null,
        status: taskToEdit ? taskToEdit.status : "todo",
      } as TaskInsert);
      onClose();
    } catch (err) {
      console.error("Failed to save task:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-[15px] font-bold text-foreground">
            {taskToEdit ? "Edit Task" : "Create New Task"}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-foreground">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Follow up on bromley garage quote"
              required
              className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-foreground">Description / Notes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add task context or instructions..."
              rows={3}
              className="w-full rounded-xl border border-border bg-secondary/30 p-3 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-foreground">Assignee</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.fullName} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-[12.5px] font-semibold text-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : taskToEdit ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Tasks Page Component ────────────────────────────────────────────────

function TasksPage() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<WorkspaceMemberInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadData = () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      getTasks(businessId),
      fetchWorkspaceMembers(businessId),
    ])
      .then(([taskList, memberList]) => {
        setTasks(taskList);
        setMembers(memberList);
      })
      .catch((err) => {
        console.error("Failed to load tasks data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [businessId]);

  const handleToggleCompletion = async (task: Task) => {
    if (!businessId) return;

    // Optimistic toggle
    const isCompleted = task.status === "completed";
    const newStatus = isCompleted ? "todo" : "completed";
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus, completed_at: newStatus === "completed" ? new Date().toISOString() : null } : t))
    );

    try {
      await toggleTaskCompletion(task.id, businessId, task.status, task.title);
    } catch (err) {
      console.error("Failed to toggle completion:", err);
      loadData();
    }
  };

  const handleSaveTask = async (taskData: TaskInsert) => {
    if (!businessId) return;
    if (editingTask) {
      await updateTask(editingTask.id, businessId, taskData);
    } else {
      await createTask({ ...taskData, business_id: businessId });
    }
    loadData();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!businessId) return;
    if (!confirm("Are you sure you want to delete this task?")) return;

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await deleteTask(taskId, businessId);
  };

  const memberMap = members.reduce<Record<string, string>>((acc, m) => {
    acc[m.userId] = m.fullName;
    return acc;
  }, {});

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "pending") return t.status !== "completed";
    if (filterStatus === "completed") return t.status === "completed";
    return true;
  });

  return (
    <AppLayout>
      <PageHeader
        title="Tasks"
        description="Workspace-scoped task management with real-time assignment, priority levels, and activity audit history."
        crumbs={[{ label: "Tasks" }]}
        action={{
          label: "Add Task",
          icon: Plus,
          onClick: () => {
            setEditingTask(null);
            setIsModalOpen(true);
          },
        }}
      />

      <TodaysFocus pendingCount={pendingTasks.length} />

      {/* Campaigns */}
      <div className="mb-5">
        <Campaigns />
      </div>

      {/* Task List Header + Filter Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-foreground">Workspace Task Directory</span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
            {tasks.length} total
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="flex rounded-xl border border-border bg-card p-1 text-[11.5px] font-semibold">
            <button
              onClick={() => setFilterStatus("all")}
              className={`rounded-lg px-3 py-1 transition-colors ${filterStatus === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`rounded-lg px-3 py-1 transition-colors ${filterStatus === "pending" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Pending ({pendingTasks.length})
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`rounded-lg px-3 py-1 transition-colors ${filterStatus === "completed" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Completed ({completedTasks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Task List Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground">Loading workspace tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <div className="text-[14px] font-semibold text-foreground mb-1">No tasks found</div>
          <p className="text-[12px] text-muted-foreground max-w-sm mx-auto mb-4">
            {filterStatus !== "all"
              ? "No tasks match the selected filter criteria."
              : "No tasks recorded for your workspace yet. Click 'Add Task' to create your first task."}
          </p>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[12px] font-semibold text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((t) => {
            const isDone = t.status === "completed";
            const cfg = priorityConfig[t.priority] || priorityConfig.medium;
            const assigneeName = t.assigned_to ? memberMap[t.assigned_to] || "Team Member" : null;

            return (
              <div
                key={t.id}
                className={`group rounded-2xl border border-border bg-card p-4 shadow-soft border-l-4 transition-all duration-200 hover:shadow-card ${cfg.border} ${isDone ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggleCompletion(t)}
                    title={isDone ? "Reopen task" : "Complete task"}
                    className={`mt-0.5 grid h-[20px] w-[20px] shrink-0 place-items-center rounded-md border transition-all ${
                      isDone ? "border-emerald-600 bg-emerald-600 text-white" : "border-border bg-secondary/50 hover:border-brand"
                    }`}
                  >
                    {isDone && <Check className="h-3 w-3" strokeWidth={3} />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[13.5px] font-semibold ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {t.title}
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                      {isDone && (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Completed
                        </span>
                      )}
                    </div>

                    {t.description && (
                      <p className="mt-1 text-[12px] text-muted-foreground line-clamp-2">
                        {t.description}
                      </p>
                    )}

                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      {t.due_date && (
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="h-3 w-3" /> Due {t.due_date}
                        </span>
                      )}
                      {assigneeName && (
                        <span className="flex items-center gap-1 font-medium text-foreground/80">
                          <User className="h-3 w-3" /> {assigneeName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setEditingTask(t);
                        setIsModalOpen(true);
                      }}
                      title="Edit task"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(t.id)}
                      title="Delete task"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
        members={members}
      />

      <div className="h-8" />
    </AppLayout>
  );
}
