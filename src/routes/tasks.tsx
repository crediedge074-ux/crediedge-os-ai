import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Sparkles, Clock, CircleCheck as CheckCircle2, Circle, ListFilter as Filter, ChevronRight, Zap, Trash2, Edit3, User, X, Check, MessageSquare, Heart, ThumbsUp, Send, Target, PoundSterling, History, Trophy, Flame } from "lucide-react";
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
import {
  fetchTaskComments,
  createTaskComment,
  updateTaskComment,
  deleteTaskComment,
  toggleCommentReaction,
  type TaskComment,
} from "@/services/comments";
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

// ─── Task Comments Component ──────────────────────────────────────────────────

function TaskCommentsSection({
  taskId,
  businessId,
  currentUserId,
}: {
  taskId: string;
  businessId: string;
  currentUserId?: string | null;
}) {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const loadComments = () => {
    setLoading(true);
    fetchTaskComments(taskId, businessId)
      .then((data) => setComments(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadComments();
  }, [taskId, businessId]);

  const handleAddComment = async (parentCommentId?: string | null) => {
    const text = parentCommentId ? replyText : newCommentText;
    if (!text.trim()) return;

    await createTaskComment({
      businessId,
      taskId,
      userId: currentUserId,
      commentText: text,
      parentCommentId,
    });

    if (parentCommentId) {
      setReplyText("");
      setReplyingToId(null);
    } else {
      setNewCommentText("");
    }
    loadComments();
  };

  const handleEdit = async (commentId: string) => {
    if (!editText.trim() || !currentUserId) return;
    await updateTaskComment(commentId, businessId, currentUserId, editText);
    setEditingId(null);
    setEditText("");
    loadComments();
  };

  const handleDelete = async (commentId: string) => {
    if (!currentUserId || !confirm("Delete this comment?")) return;
    await deleteTaskComment(commentId, businessId, currentUserId);
    loadComments();
  };

  const handleReaction = async (commentId: string, emoji: string) => {
    if (!currentUserId) return;
    await toggleCommentReaction({ commentId, businessId, userId: currentUserId, emoji });
    loadComments();
  };

  const renderComment = (comment: TaskComment, isReply = false) => {
    const isOwner = comment.userId === currentUserId;
    const dateStr = new Date(comment.createdAt).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div key={comment.id} className={`group space-y-2 ${isReply ? "ml-8 pt-2 border-l-2 border-border pl-3" : "py-3 border-b border-border/60"}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
              {comment.commenterName.charAt(0).toUpperCase()}
            </div>
            <span className="text-[12px] font-bold text-foreground">{comment.commenterName}</span>
            <span className="text-[10px] text-muted-foreground">{dateStr}</span>
          </div>

          {isOwner && (
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => {
                  setEditingId(comment.id);
                  setEditText(comment.commentText);
                }}
                className="text-[10.5px] font-semibold text-muted-foreground hover:text-foreground"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(comment.id)}
                className="text-[10.5px] font-semibold text-destructive hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {editingId === comment.id ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="h-8 flex-1 rounded-lg border border-border bg-secondary/30 px-3 text-[12px] text-foreground"
            />
            <button
              type="button"
              onClick={() => handleEdit(comment.id)}
              className="rounded-lg bg-brand px-3 py-1 text-[11px] font-semibold text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="rounded-lg border border-border px-3 py-1 text-[11px] font-semibold text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        ) : (
          <p className="text-[12.5px] text-foreground/90 leading-relaxed">{comment.commentText}</p>
        )}

        {/* Reaction Bar & Reply Link */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-muted-foreground">
          <button
            type="button"
            onClick={() => handleReaction(comment.id, "👍")}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 border ${
              comment.reactions.some((r) => r.emoji === "👍" && r.userId === currentUserId)
                ? "border-brand bg-brand/10 text-brand"
                : "border-border bg-secondary/40 hover:bg-secondary"
            }`}
          >
            <ThumbsUp className="h-3 w-3" />
            {comment.reactions.filter((r) => r.emoji === "👍").length || ""}
          </button>

          <button
            type="button"
            onClick={() => handleReaction(comment.id, "❤️")}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 border ${
              comment.reactions.some((r) => r.emoji === "❤️" && r.userId === currentUserId)
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-border bg-secondary/40 hover:bg-secondary"
            }`}
          >
            <Heart className="h-3 w-3" />
            {comment.reactions.filter((r) => r.emoji === "❤️").length || ""}
          </button>

          {!isReply && (
            <button
              type="button"
              onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
              className="font-semibold text-brand hover:underline ml-2"
            >
              Reply
            </button>
          )}
        </div>

        {/* Threaded Reply Form */}
        {replyingToId === comment.id && (
          <div className="ml-4 mt-2 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="h-8 flex-1 rounded-lg border border-border bg-secondary/30 px-3 text-[12px] text-foreground"
            />
            <button
              type="button"
              onClick={() => handleAddComment(comment.id)}
              className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-1 text-[11px] font-semibold text-white"
            >
              <Send className="h-3 w-3" /> Reply
            </button>
          </div>
        )}

        {/* Threaded Replies List */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2 mt-2">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border-t border-border bg-secondary/20 p-4 space-y-3">
      <div className="flex items-center gap-2 text-[12.5px] font-bold text-foreground">
        <MessageSquare className="h-3.5 w-3.5 text-brand" />
        Task Discussion & Activity Comments
      </div>

      {loading ? (
        <div className="text-xs text-muted-foreground">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-xs text-muted-foreground italic">No comments yet. Start the conversation below.</div>
      ) : (
        <div className="divide-y divide-border/40">
          {comments.map((c) => renderComment(c))}
        </div>
      )}

      {/* Add New Top-Level Comment Form */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Add a comment or update note..."
          className="h-9 flex-1 rounded-xl border border-border bg-card px-3.5 text-[12.5px] text-foreground focus:border-foreground/20 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => handleAddComment(null)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-2 text-[12px] font-semibold text-background hover:bg-foreground/85"
        >
          <Send className="h-3.5 w-3.5" /> Post
        </button>
      </div>
    </div>
  );
}

// ─── Restored Task Page Sections ─────────────────────────────────────────────

function MissionsSection() {
  const missions = [
    { id: "m1", title: "Reach 250 Google Reviews", campaign: "Become Bromley's Highest Rated Garage", progress: 82, tasks: 12, completed: 10 },
    { id: "m2", title: "Reduce Response Time to < 1hr", campaign: "Become Bromley's Highest Rated Garage", progress: 65, tasks: 8, completed: 5 },
    { id: "m3", title: "Optimise Service Pricing", campaign: "£30k Monthly Revenue Target", progress: 90, tasks: 5, completed: 4 },
    { id: "m4", title: "Automate Invoice Sending", campaign: "Automate 80% of Admin", progress: 70, tasks: 4, completed: 3 },
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
          <li key={m.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 hover:bg-secondary/40">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[12.5px] font-medium text-foreground truncate">{m.title}</span>
                <span className="shrink-0 text-[11px] font-bold text-foreground">{m.progress}%</span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="absolute inset-y-0 left-0 rounded-full bg-brand transition-all duration-700" style={{ width: `${m.progress}%` }} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AIPriorityQueue({ tasks }: { tasks: Task[] }) {
  const top3 = tasks.filter((t) => t.status !== "completed").slice(0, 3);

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
          Complete these priority tasks first for maximum business impact today.
        </p>
        {top3.length === 0 ? (
          <div className="text-[12px] text-muted-foreground italic">No pending tasks in AI queue.</div>
        ) : (
          top3.map((t, idx) => (
            <div key={t.id} className="flex items-center gap-3 rounded-xl bg-secondary/50 px-3.5 py-2.5">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-extrabold text-white">
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-foreground truncate">{t.title}</div>
                <div className="text-[10.5px] text-muted-foreground">Priority: {t.priority}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
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
  const { membership, user } = useAuthContext();
  const businessId = membership?.business_id;
  const currentUserId = user?.id;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<WorkspaceMemberInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedCommentTaskId, setExpandedCommentTaskId] = useState<string | null>(null);

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
        description="Workspace-scoped task management with real-time assignment, priority levels, task comments, and activity audit history."
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

      {/* Missions */}
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">Missions</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <MissionsSection />
      </div>

      {/* AI Priority Queue */}
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">AI Priority Queue</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <AIPriorityQueue tasks={tasks} />
      </div>

      {/* Task Directory Header */}
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
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`rounded-lg px-3 py-1 transition-colors ${filterStatus === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("pending")}
              className={`rounded-lg px-3 py-1 transition-colors ${filterStatus === "pending" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Pending ({pendingTasks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("completed")}
              className={`rounded-lg px-3 py-1 transition-colors ${filterStatus === "completed" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Completed ({completedTasks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
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
            type="button"
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
            const isCommentsExpanded = expandedCommentTaskId === t.id;

            return (
              <div
                key={t.id}
                className={`group rounded-2xl border border-border bg-card shadow-soft border-l-4 transition-all duration-200 hover:shadow-card overflow-hidden ${cfg.border} ${isDone ? "opacity-75" : ""}`}
              >
                <div className="p-4 flex items-start gap-3.5">
                  <button
                    type="button"
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
                      <button
                        type="button"
                        onClick={() => setExpandedCommentTaskId(isCommentsExpanded ? null : t.id)}
                        className="flex items-center gap-1 font-semibold text-brand hover:underline"
                      >
                        <MessageSquare className="h-3 w-3" /> Comments & Discussion
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
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
                      type="button"
                      onClick={() => handleDeleteTask(t.id)}
                      title="Delete task"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expandable Task Comments Section */}
                {isCommentsExpanded && businessId && (
                  <TaskCommentsSection
                    taskId={t.id}
                    businessId={businessId}
                    currentUserId={currentUserId}
                  />
                )}
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
