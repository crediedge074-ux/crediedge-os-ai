import { useState, useEffect, useCallback } from "react";
import {
  X, ChevronRight, Target, Calendar, User, Users, Flag, TrendingUp,
  CheckCircle2, Circle, Plus, Send, MessageSquare, Heart, ThumbsUp,
  Edit3, Trash2, Activity as ActivityIcon, Sparkles, AlertTriangle,
  Clock, ArrowLeft, MoreHorizontal, Zap, Trophy, Pause, Play,
} from "lucide-react";
import type { Task, TaskInsert } from "@/lib/database.types";
import type { WorkspaceMemberInfo } from "@/services/tasks";
import type { CalculatedMission } from "@/services/missions";
import {
  type CalculatedGoal, type GoalHealth, type GoalComment, type GoalActivityEntry,
  type GoalProgressUpdate, type GoalPriority,
  fetchGoalComments, createGoalComment, updateGoalComment, deleteGoalComment, toggleGoalCommentReaction,
  fetchGoalActivity, fetchGoalProgressUpdates, createGoalProgressUpdate,
  updateGoal, deleteGoal, completeGoal,
} from "@/services/goals";
import { createTask, updateTask, toggleTaskCompletion } from "@/services/tasks";
import { createMission, fetchMissions } from "@/services/missions";
import { appEvents, APP_EVENTS } from "@/lib/events";
import { InsufficientData } from "@/components/ui/InsufficientData";

const healthConfig: Record<GoalHealth, { label: string; color: string; bg: string; icon: typeof Target }> = {
  on_track: { label: "ON TRACK", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  at_risk: { label: "AT RISK", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: AlertTriangle },
  overdue: { label: "OVERDUE", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", icon: AlertTriangle },
  completed: { label: "COMPLETED", color: "text-brand", bg: "bg-brand/10 border-brand/20", icon: Trophy },
  paused: { label: "PAUSED", color: "text-muted-foreground", bg: "bg-secondary border-border", icon: Pause },
};

const priorityConfig: Record<GoalPriority, { label: string; dot: string; badge: string }> = {
  urgent: { label: "Urgent", dot: "bg-destructive", badge: "bg-destructive/10 text-destructive" },
  high: { label: "High", dot: "bg-brand", badge: "bg-brand/10 text-brand" },
  medium: { label: "Medium", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700" },
  low: { label: "Low", dot: "bg-muted-foreground/40", badge: "bg-secondary text-muted-foreground" },
};

const REACTIONS = [
  { emoji: "👍", icon: ThumbsUp },
  { emoji: "❤️", icon: Heart },
];

interface GoalWorkspaceProps {
  goal: CalculatedGoal;
  businessId: string;
  currentUserId?: string | null;
  members: WorkspaceMemberInfo[];
  tasks: Task[];
  missions: CalculatedMission[];
  onClose: () => void;
  onRefresh: () => void;
  onEditGoal: (goal: CalculatedGoal) => void;
  onOpenTask: (task: Task) => void;
  onOpenMission: (mission: CalculatedMission) => void;
}

export function GoalWorkspace({
  goal, businessId, currentUserId, members, tasks, missions,
  onClose, onRefresh, onEditGoal, onOpenTask, onOpenMission,
}: GoalWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "comments" | "activity">("overview");
  const [comments, setComments] = useState<GoalComment[]>([]);
  const [activity, setActivity] = useState<GoalActivityEntry[]>([]);
  const [progressUpdates, setProgressUpdates] = useState<GoalProgressUpdate[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newMissionTitle, setNewMissionTitle] = useState("");
  const [progressText, setProgressText] = useState("");
  const [progressValue, setProgressValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  const goalTasks = tasks.filter((t) => (t as any).goal_id === goal.id);
  const goalMissions = missions.filter((m) => (m as any).goal_id === goal.id);
  const activeGoalTasks = goalTasks.filter((t) => t.status !== "completed");
  const completedGoalTasks = goalTasks.filter((t) => t.status === "completed");

  const memberMap = members.reduce<Record<string, string>>((acc, m) => {
    acc[m.userId] = m.fullName;
    return acc;
  }, {});

  const loadComments = useCallback(() => {
    setLoadingComments(true);
    fetchGoalComments(goal.id, businessId)
      .then(setComments)
      .catch((err) => console.error("Error loading goal comments:", err))
      .finally(() => setLoadingComments(false));
  }, [goal.id, businessId]);

  const loadActivity = useCallback(() => {
    fetchGoalActivity(goal.id, businessId).then(setActivity).catch(console.error);
  }, [goal.id, businessId]);

  const loadProgressUpdates = useCallback(() => {
    fetchGoalProgressUpdates(goal.id, businessId).then(setProgressUpdates).catch(console.error);
  }, [goal.id, businessId]);

  useEffect(() => {
    loadComments();
    loadActivity();
    loadProgressUpdates();
  }, [loadComments, loadActivity, loadProgressUpdates]);

  const hCfg = healthConfig[goal.health] || healthConfig.on_track;
  const pCfg = priorityConfig[goal.priority] || priorityConfig.medium;
  const unitLabel = goal.unit === "£" ? "£" : goal.unit === "%" ? "%" : goal.unit === "count" ? "" : ` ${goal.unit}`;
  const formattedCurrent = goal.unit === "£"
    ? `${unitLabel}${goal.current_value.toLocaleString("en-GB")}`
    : `${goal.current_value.toLocaleString("en-GB")}${unitLabel}`;
  const formattedTarget = goal.unit === "£"
    ? `${unitLabel}${goal.target_value.toLocaleString("en-GB")}`
    : `${goal.target_value.toLocaleString("en-GB")}${unitLabel}`;
  const formattedRemaining = goal.unit === "£"
    ? `${unitLabel}${goal.remaining.toLocaleString("en-GB")}`
    : `${goal.remaining.toLocaleString("en-GB")}${unitLabel}`;

  // ─── Next Best Action ─────────
  const computeNextAction = (): string | null => {
    if (goal.health === "completed") return "Goal achieved. No immediate action required.";
    if (goal.health === "paused") return "Goal is paused. Resume it when ready to continue progress.";
    if (goal.health === "overdue") {
      const overdueTasks = activeGoalTasks.filter((t) => t.due_date && new Date(t.due_date) < new Date());
      if (overdueTasks.length > 0) return `${overdueTasks.length} task${overdueTasks.length !== 1 ? "s" : ""} overdue. Start with "${overdueTasks[0].title}".`;
      return "Deadline has passed. Consider extending the deadline or accelerating remaining tasks.";
    }
    if (goal.health === "at_risk") {
      if (activeGoalTasks.length === 0 && goal.remaining > 0) return "No active tasks linked to this goal. Create tasks to drive progress.";
      return `At risk: ${goal.daysRemaining} days remaining with ${formattedRemaining} to go. Prioritise the most impactful tasks.`;
    }
    if (activeGoalTasks.length === 0 && goal.remaining > 0) return "On track but no active tasks. Create tasks to maintain progress.";
    const overdueTasks = activeGoalTasks.filter((t) => t.due_date && new Date(t.due_date) < new Date());
    if (overdueTasks.length > 0) return `${overdueTasks.length} task${overdueTasks.length !== 1 ? "s" : ""} overdue. Start with "${overdueTasks[0].title}".`;
    return "On track. No immediate action required.";
  };

  const nextAction = computeNextAction();

  // ─── Handlers ─────────
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setCommentError(null);
    try {
      await createGoalComment({ businessId, goalId: goal.id, userId: currentUserId, commentText: newComment });
      setNewComment("");
      loadComments();
      loadActivity();
    } catch (err: any) {
      setCommentError(`Failed to post comment: ${err?.message || String(err)}`);
    }
  };

  const handleReaction = async (commentId: string, emoji: string) => {
    if (!currentUserId) return;
    try {
      await toggleGoalCommentReaction({ commentId, businessId, userId: currentUserId, emoji });
      loadComments();
    } catch (err: any) {
      setCommentError(`Failed to toggle reaction: ${err?.message || String(err)}`);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUserId || !confirm("Delete this comment?")) return;
    try {
      await deleteGoalComment(commentId, businessId, currentUserId);
      loadComments();
    } catch (err: any) {
      setCommentError(`Failed to delete: ${err?.message || String(err)}`);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    setSaving(true);
    try {
      await createTask({
        title: newTaskTitle.trim(),
        business_id: businessId,
        priority: newTaskPriority,
        due_date: newTaskDueDate || null,
        assigned_to: newTaskAssignee || null,
        status: "todo",
        goal_id: goal.id,
      } as any);
      setNewTaskTitle("");
      setNewTaskAssignee("");
      setNewTaskPriority("medium");
      setNewTaskDueDate("");
      setShowTaskForm(false);
      appEvents.emit(APP_EVENTS.TASKS_MUTATED);
      appEvents.emit(APP_EVENTS.GOALS_MUTATED);
      onRefresh();
    } catch (err: any) {
      setCommentError(`Failed to create task: ${err?.message || String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      await toggleTaskCompletion(task.id, businessId, task.status, task.title);
      appEvents.emit(APP_EVENTS.TASKS_MUTATED);
      appEvents.emit(APP_EVENTS.GOALS_MUTATED);
      onRefresh();
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const handleCreateMission = async () => {
    if (!newMissionTitle.trim()) return;
    setSaving(true);
    try {
      await createMission(businessId, { title: newMissionTitle.trim(), goal_id: goal.id } as any);
      setNewMissionTitle("");
      setShowMissionForm(false);
      appEvents.emit(APP_EVENTS.MISSIONS_MUTATED);
      appEvents.emit(APP_EVENTS.GOALS_MUTATED);
      onRefresh();
    } catch (err: any) {
      setCommentError(`Failed to create mission: ${err?.message || String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleProgressUpdate = async () => {
    if (!progressText.trim()) return;
    setSaving(true);
    try {
      const pv = progressValue.trim() !== "" ? Number(progressValue) : null;
      await createGoalProgressUpdate({
        businessId, goalId: goal.id, userId: currentUserId,
        updateText: progressText.trim(), progressValue: pv,
      });
      setProgressText("");
      setProgressValue("");
      setShowProgressForm(false);
      loadProgressUpdates();
      loadActivity();
      appEvents.emit(APP_EVENTS.GOALS_MUTATED);
      onRefresh();
    } catch (err: any) {
      setCommentError(`Failed to post progress update: ${err?.message || String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteGoal = async () => {
    if (!confirm("Mark this goal as achieved?")) return;
    try {
      await completeGoal(goal.id, businessId);
      appEvents.emit(APP_EVENTS.GOALS_MUTATED);
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(`Failed to complete goal: ${err?.message || String(err)}`);
    }
  };

  const handleDeleteGoal = async () => {
    if (!confirm("Delete this goal permanently? Linked tasks and missions will keep their data but lose the goal link.")) return;
    try {
      await deleteGoal(goal.id, businessId);
      appEvents.emit(APP_EVENTS.GOALS_MUTATED);
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(`Failed to delete goal: ${err?.message || String(err)}`);
    }
  };

  const handlePauseGoal = async () => {
    try {
      await updateGoal(goal.id, businessId, { status: goal.status === "paused" ? "active" : "paused" });
      appEvents.emit(APP_EVENTS.GOALS_MUTATED);
      onRefresh();
      setMenuOpen(false);
    } catch (err: any) {
      alert(`Failed to update goal: ${err?.message || String(err)}`);
    }
  };

  const renderComment = (comment: GoalComment, isReply = false) => {
    const isOwner = comment.userId === currentUserId;
    const dateStr = new Date(comment.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

    return (
      <div key={comment.id} className={`group space-y-2 ${isReply ? "ml-8 pt-2 border-l-2 border-border pl-3" : "py-3 border-b border-border/60"}`}>
        <div className="flex items-start gap-2.5">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-bold text-foreground">
            {comment.commenterName?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-foreground">{comment.commenterName}</span>
              <span className="text-[10px] text-muted-foreground">{dateStr}</span>
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/90">{comment.commentText}</p>

            <div className="mt-1.5 flex items-center gap-1.5">
              {REACTIONS.map(({ emoji, icon: Icon }) => {
                const count = comment.reactions.filter((r) => r.emoji === emoji).length;
                const hasReacted = comment.reactions.some((r) => r.emoji === emoji && r.userId === currentUserId);
                return (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(comment.id, emoji)}
                    className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                      hasReacted ? "bg-brand/15 text-brand" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="h-3 w-3" /> {count > 0 && count}
                  </button>
                );
              })}
              {isOwner && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {comment.replies?.map((reply) => renderComment(reply, true))}
      </div>
    );
  };

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Target },
    { id: "tasks" as const, label: "Tasks & Missions", icon: CheckCircle2 },
    { id: "comments" as const, label: "Comments", icon: MessageSquare },
    { id: "activity" as const, label: "Activity", icon: ActivityIcon },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/70 backdrop-blur-md">
      <div className="relative flex flex-col h-[94vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* ─── Header ─── */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <button onClick={onClose} className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3 w-3" /> Goals
                </button>
                <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                <span className="text-[11px] font-medium text-foreground">Goal Detail</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${pCfg.badge}`}>{pCfg.label}</span>
                <h2 className="text-[18px] font-bold tracking-tight text-foreground truncate">{goal.title}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => onEditGoal(goal)} className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors">
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-9 z-10 w-44 rounded-xl border border-border bg-card shadow-lg py-1">
                    <button onClick={handlePauseGoal} className="flex w-full items-center gap-2 px-3 py-2 text-[12px] text-foreground hover:bg-secondary">
                      {goal.status === "paused" ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                      {goal.status === "paused" ? "Resume Goal" : "Pause Goal"}
                    </button>
                    <button onClick={handleCompleteGoal} className="flex w-full items-center gap-2 px-3 py-2 text-[12px] text-foreground hover:bg-secondary">
                      <Trophy className="h-3.5 w-3.5" /> Mark Achieved
                    </button>
                    <div className="my-1 border-t border-border" />
                    <button onClick={handleDeleteGoal} className="flex w-full items-center gap-2 px-3 py-2 text-[12px] text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3.5 w-3.5" /> Delete Goal
                    </button>
                  </div>
                )}
              </div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress + Health Bar */}
          <div className="mt-3 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[20px] font-black text-foreground">{formattedCurrent}</span>
                <span className="text-[13px] text-muted-foreground">/ {formattedTarget}</span>
                <span className="text-[13px] font-bold text-brand">{goal.progressPct}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${goal.progressPct}%` }} />
              </div>
            </div>
            <div className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 ${hCfg.bg}`}>
              <hCfg.icon className={`h-3.5 w-3.5 ${hCfg.color}`} />
              <span className={`text-[11px] font-bold ${hCfg.color}`}>{hCfg.label}</span>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="flex items-center gap-1 border-b border-border px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[12px] font-semibold transition-colors ${
                activeTab === tab.id ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.id === "comments" && comments.length > 0 && (
                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">{comments.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        <div className="flex-1 overflow-y-auto p-6">
          {commentError && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-[12px] font-semibold text-destructive">
              {commentError}
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Summary */}
              <div className="rounded-2xl border border-border bg-secondary/20 p-5">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current</div>
                    <div className="mt-0.5 text-[15px] font-bold text-foreground">{formattedCurrent}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target</div>
                    <div className="mt-0.5 text-[15px] font-bold text-foreground">{formattedTarget}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Remaining</div>
                    <div className="mt-0.5 text-[15px] font-bold text-foreground">{formattedRemaining}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Deadline</div>
                    <div className="mt-0.5 text-[15px] font-bold text-foreground">
                      {goal.target_date ? new Date(goal.target_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No deadline"}
                    </div>
                    {goal.daysRemaining !== null && (
                      <div className={`text-[10px] ${goal.daysRemaining < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                        {goal.daysRemaining < 0 ? `${Math.abs(goal.daysRemaining)} days overdue` : `${goal.daysRemaining} days remaining`}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description / Why */}
              {goal.description ? (
                <div className="rounded-xl border border-border p-4">
                  <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Why this matters</div>
                  <p className="text-[13px] leading-relaxed text-foreground/90">{goal.description}</p>
                </div>
              ) : (
                <InsufficientData description="No description has been added for this goal yet. Edit the goal to explain why it matters." icon={Target} />
              )}

              {/* People */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-4">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Owner</div>
                  {goal.ownerName ? (
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                        {goal.ownerName[0]?.toUpperCase()}
                      </div>
                      <span className="text-[13px] font-semibold text-foreground">{goal.ownerName}</span>
                    </div>
                  ) : (
                    <span className="text-[12px] text-muted-foreground">Unassigned</span>
                  )}
                </div>
                <div className="rounded-xl border border-border p-4">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tasks</div>
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                    {goal.completedTasks} / {goal.totalTasks} completed
                  </div>
                  {goal.totalMissions > 0 && (
                    <div className="mt-1 text-[12px] text-muted-foreground">{goal.totalMissions} mission{goal.totalMissions !== 1 ? "s" : ""}</div>
                  )}
                </div>
              </div>

              {/* Next Best Action */}
              <div className="rounded-2xl border border-brand/20 bg-brand/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-brand" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand">Next Best Action</span>
                </div>
                {nextAction ? (
                  <p className="text-[14px] leading-relaxed text-foreground">{nextAction}</p>
                ) : (
                  <InsufficientData description="Not enough data to determine the next best action." icon={Zap} />
                )}
              </div>

              {/* Progress Updates */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-semibold text-foreground">Progress Updates</div>
                  <button
                    onClick={() => setShowProgressForm(!showProgressForm)}
                    className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white hover:opacity-90"
                  >
                    <Plus className="h-3 w-3" /> Post Update
                  </button>
                </div>

                {showProgressForm && (
                  <div className="mb-3 rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
                    <textarea
                      value={progressText}
                      onChange={(e) => setProgressText(e.target.value)}
                      placeholder="What progress has been made? What's the current situation?"
                      rows={3}
                      className="w-full rounded-xl border border-border bg-card p-3 text-[13px] text-foreground focus:outline-none"
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        step="any"
                        value={progressValue}
                        onChange={(e) => setProgressValue(e.target.value)}
                        placeholder={`New current value (optional, current: ${goal.current_value})`}
                        className="h-9 flex-1 rounded-xl border border-border bg-card px-3 text-[12px] text-foreground focus:outline-none"
                      />
                      <button
                        onClick={handleProgressUpdate}
                        disabled={saving || !progressText.trim()}
                        className="rounded-xl bg-brand px-4 py-2 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
                      >
                        {saving ? "Posting..." : "Post Update"}
                      </button>
                    </div>
                  </div>
                )}

                {progressUpdates.length > 0 ? (
                  <div className="space-y-3">
                    {progressUpdates.map((pu) => (
                      <div key={pu.id} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-[10px] font-bold text-foreground">
                            {pu.authorName?.[0]?.toUpperCase() || "?"}
                          </div>
                          <span className="text-[12px] font-bold text-foreground">{pu.authorName}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(pu.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {pu.progress_value !== null && (
                            <span className="rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                              Progress: {goal.unit === "£" ? `${goal.unit}${pu.progress_value.toLocaleString()}` : pu.progress_value}
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] leading-relaxed text-foreground/90">{pu.update_text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <InsufficientData description="No progress updates have been posted yet." icon={TrendingUp} />
                )}
              </div>
            </div>
          )}

          {/* TASKS & MISSIONS TAB */}
          {activeTab === "tasks" && (
            <div className="space-y-5">
              {/* Missions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-semibold text-foreground">Linked Missions</div>
                  <button
                    onClick={() => setShowMissionForm(!showMissionForm)}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground hover:bg-secondary"
                  >
                    <Plus className="h-3 w-3" /> Add Mission
                  </button>
                </div>
                {showMissionForm && (
                  <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-secondary/20 p-3">
                    <input
                      type="text"
                      value={newMissionTitle}
                      onChange={(e) => setNewMissionTitle(e.target.value)}
                      placeholder="Mission title..."
                      className="h-9 flex-1 rounded-lg border border-border bg-card px-3 text-[12px] text-foreground focus:outline-none"
                    />
                    <button onClick={handleCreateMission} disabled={saving || !newMissionTitle.trim()} className="rounded-lg bg-brand px-3 py-2 text-[11px] font-semibold text-white hover:opacity-90 disabled:opacity-50">
                      {saving ? "..." : "Create"}
                    </button>
                  </div>
                )}
                {goalMissions.length > 0 ? (
                  <div className="space-y-2">
                    {goalMissions.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => onOpenMission(m)}
                        className="cursor-pointer rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-foreground/10"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-semibold text-foreground">{m.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">{m.completedTasks}/{m.totalTasks} tasks</span>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-secondary">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${m.progressPct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <InsufficientData description="No missions linked to this goal yet." icon={Flag} />
                )}
              </div>

              {/* Tasks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-semibold text-foreground">Tasks</div>
                  <button
                    onClick={() => setShowTaskForm(!showTaskForm)}
                    className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white hover:opacity-90"
                  >
                    <Plus className="h-3 w-3" /> Add Task
                  </button>
                </div>

                {showTaskForm && (
                  <div className="mb-3 rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Task title..."
                      className="h-9 w-full rounded-lg border border-border bg-card px-3 text-[12px] text-foreground focus:outline-none"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)} className="h-9 rounded-lg border border-border bg-card px-2 text-[12px] text-foreground focus:outline-none">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <input type="date" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} className="h-9 rounded-lg border border-border bg-card px-2 text-[12px] text-foreground focus:outline-none" />
                      <select value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)} className="h-9 rounded-lg border border-border bg-card px-2 text-[12px] text-foreground focus:outline-none">
                        <option value="">Unassigned</option>
                        {members.map((m) => (
                          <option key={m.userId} value={m.userId}>{m.fullName}</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={handleCreateTask} disabled={saving || !newTaskTitle.trim()} className="w-full rounded-lg bg-brand py-2 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-50">
                      {saving ? "Creating..." : "Create Task"}
                    </button>
                  </div>
                )}

                {activeGoalTasks.length > 0 ? (
                  <div className="mb-4">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Active</div>
                    <div className="space-y-2">
                      {activeGoalTasks.map((t) => (
                        <div key={t.id} className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-foreground/10">
                          <button onClick={() => handleToggleTask(t)} className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-border hover:border-foreground hover:bg-secondary">
                            <Circle className="h-3 w-3 text-muted-foreground" />
                          </button>
                          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onOpenTask(t)}>
                            <div className="text-[13px] font-semibold text-foreground truncate">{t.title}</div>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              {t.assigned_to && <span>{memberMap[t.assigned_to] || "Assigned"}</span>}
                              {t.due_date && <span>Due {new Date(t.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>}
                            </div>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  goalTasks.length === 0 && <InsufficientData description="No tasks linked to this goal. Create tasks to drive progress." icon={CheckCircle2} />
                )}

                {completedGoalTasks.length > 0 && (
                  <div>
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Completed</div>
                    <div className="space-y-2">
                      {completedGoalTasks.map((t) => (
                        <div key={t.id} className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 opacity-60">
                          <button onClick={() => handleToggleTask(t)} className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-brand bg-brand/10">
                            <CheckCircle2 className="h-3 w-3 text-brand" />
                          </button>
                          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onOpenTask(t)}>
                            <div className="text-[13px] font-semibold text-foreground line-through truncate">{t.title}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* COMMENTS TAB */}
          {activeTab === "comments" && (
            <div className="space-y-3">
              <div className="flex items-end gap-2 rounded-xl border border-border bg-secondary/20 p-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  className="flex-1 rounded-lg border border-border bg-card p-2.5 text-[13px] text-foreground focus:outline-none"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="rounded-lg bg-brand px-3 py-2 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

              {loadingComments ? (
                <div className="py-8 text-center text-[12px] text-muted-foreground">Loading comments...</div>
              ) : comments.length > 0 ? (
                <div>{comments.map((c) => renderComment(c))}</div>
              ) : (
                <InsufficientData description="No comments yet. Start the conversation." icon={MessageSquare} />
              )}
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === "activity" && (
            <div>
              {activity.length > 0 ? (
                <div className="space-y-2">
                  {activity.map((entry) => (
                    <div key={`${entry.source}-${entry.id}`} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
                      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary">
                        <ActivityIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-semibold text-foreground">{entry.actorName || "System"}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12.5px] text-muted-foreground">{entry.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <InsufficientData description="No activity recorded yet. Activity will appear here as the goal is updated." icon={ActivityIcon} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
