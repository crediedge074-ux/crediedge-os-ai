import { supabase } from "@/lib/supabase";
import { logActivity } from "./activity";
import { createWorkspaceNotification } from "./notifications";

// ─── Types ───────────────────────────────────────────────────────────────────

export type GoalStatus = "active" | "achieved" | "paused" | "cancelled";
export type GoalHealth = "on_track" | "at_risk" | "overdue" | "completed" | "paused";
export type GoalPriority = "low" | "medium" | "high" | "urgent";

export interface StoredGoal {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  target_value: number;
  current_value: number;
  unit: string | null;
  category: string | null;
  status: GoalStatus;
  priority: GoalPriority;
  owner_id: string | null;
  start_date: string | null;
  target_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoalProgressUpdate {
  id: string;
  goal_id: string;
  user_id: string | null;
  update_text: string;
  progress_value: number | null;
  created_at: string;
  authorName?: string;
}

export interface CalculatedGoal extends StoredGoal {
  progressPct: number;
  remaining: number;
  daysRemaining: number | null;
  health: GoalHealth;
  totalTasks: number;
  completedTasks: number;
  totalMissions: number;
  ownerName: string | null;
}

export interface GoalComment {
  id: string;
  goalId: string;
  parentCommentId: string | null;
  userId: string | null;
  commenterName: string;
  commenterAvatar?: string | null;
  commentText: string;
  createdAt: string;
  updatedAt: string;
  reactions: { id: string; userId: string; emoji: string }[];
  replies?: GoalComment[];
}

// ─── Goal CRUD ───────────────────────────────────────────────────────────────

export async function fetchGoals(businessId: string | undefined): Promise<CalculatedGoal[]> {
  if (!businessId) return [];

  try {
    const [goalsRes, tasksRes, missionsRes, membersRes] = await Promise.all([
      supabase.from("goals").select("*").eq("business_id", businessId).order("created_at", { ascending: false }),
      supabase.from("tasks").select("id, goal_id, status").eq("business_id", businessId),
      (supabase.from as any)("missions").select("id, goal_id, status").eq("business_id", businessId),
      supabase.from("memberships").select("user_id, status").eq("business_id", businessId).eq("status", "active"),
    ]);

    if (goalsRes.error) {
      console.error("[fetchGoals] Supabase error:", goalsRes.error);
      return [];
    }

    const rawGoals = (goalsRes.data || []) as StoredGoal[];
    const tasks = tasksRes.data || [];
    const missions = (missionsRes.data || []) as any[];
    const memberUserIds = (membersRes.data || []).map((m: any) => m.user_id);

    // Fetch owner profiles
    const ownerIds = Array.from(new Set(rawGoals.map((g) => g.owner_id).filter(Boolean))) as string[];
    const ownerMap: Record<string, string> = {};
    if (ownerIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, first_name, last_name")
        .in("id", ownerIds);
      (profiles || []).forEach((p: any) => {
        ownerMap[p.id] = p.full_name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Team Member";
      });
    }

    // Count tasks per goal
    const taskCountMap: Record<string, { total: number; completed: number }> = {};
    tasks.forEach((t: any) => {
      if (t.goal_id) {
        if (!taskCountMap[t.goal_id]) taskCountMap[t.goal_id] = { total: 0, completed: 0 };
        taskCountMap[t.goal_id].total++;
        if (t.status === "completed") taskCountMap[t.goal_id].completed++;
      }
    });

    // Count missions per goal
    const missionCountMap: Record<string, number> = {};
    missions.forEach((m: any) => {
      if (m.goal_id) {
        missionCountMap[m.goal_id] = (missionCountMap[m.goal_id] || 0) + 1;
      }
    });

    const now = new Date();

    return rawGoals.map((g) => {
      const targetValue = Number(g.target_value) || 0;
      const currentValue = Number(g.current_value) || 0;
      const progressPct = targetValue > 0 ? Math.min(100, Math.round((currentValue / targetValue) * 100)) : 0;
      const remaining = Math.max(0, targetValue - currentValue);

      const daysRemaining = g.target_date
        ? Math.ceil((new Date(g.target_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const stats = taskCountMap[g.id] || { total: 0, completed: 0 };

      const health = calculateGoalHealth(g.status, progressPct, daysRemaining, currentValue, targetValue);

      return {
        ...g,
        progressPct,
        remaining,
        daysRemaining,
        health,
        totalTasks: stats.total,
        completedTasks: stats.completed,
        totalMissions: missionCountMap[g.id] || 0,
        ownerName: g.owner_id ? ownerMap[g.owner_id] || null : null,
      };
    });
  } catch (err) {
    console.error("[fetchGoals] unexpected error:", err);
    return [];
  }
}

export function calculateGoalHealth(
  status: GoalStatus,
  progressPct: number,
  daysRemaining: number | null,
  currentValue: number,
  targetValue: number
): GoalHealth {
  if (status === "achieved" || (targetValue > 0 && currentValue >= targetValue)) return "completed";
  if (status === "paused") return "paused";
  if (daysRemaining !== null && daysRemaining < 0) return "overdue";
  if (daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7 && progressPct < 80) return "at_risk";
  return "on_track";
}

export async function createGoal(
  businessId: string,
  data: {
    title: string;
    description?: string | null;
    target_value: number;
    current_value?: number;
    unit?: string;
    category?: string;
    priority?: GoalPriority;
    owner_id?: string | null;
    target_date?: string | null;
    created_by?: string | null;
  }
): Promise<StoredGoal> {
  const { data: created, error } = await supabase
    .from("goals")
    .insert({
      business_id: businessId,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      target_value: data.target_value,
      current_value: data.current_value || 0,
      unit: data.unit || "count",
      category: data.category || "revenue",
      priority: data.priority || "medium",
      owner_id: data.owner_id || null,
      target_date: data.target_date || null,
      created_by: data.created_by || null,
      status: "active",
    } as any)
    .select()
    .single();

  if (error) {
    console.error("[createGoal] Supabase error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "goal",
    entity_id: created.id,
    action: "created",
    description: `Created goal: ${created.title}`,
  }).catch((err) => console.warn("[createGoal] logActivity error:", err));

  return created as StoredGoal;
}

export async function updateGoal(
  goalId: string,
  businessId: string,
  updates: Partial<StoredGoal>
): Promise<StoredGoal> {
  const { data: updated, error } = await supabase
    .from("goals")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    } as any)
    .eq("id", goalId)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) {
    console.error("[updateGoal] Supabase error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "goal",
    entity_id: goalId,
    action: "updated",
    description: `Updated goal: ${updated.title}`,
  }).catch((err) => console.warn("[updateGoal] logActivity error:", err));

  return updated as StoredGoal;
}

export async function deleteGoal(goalId: string, businessId: string): Promise<boolean> {
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("business_id", businessId);

  if (error) {
    console.error("[deleteGoal] Supabase error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "goal",
    entity_id: goalId,
    action: "deleted",
    description: `Deleted goal #${goalId.slice(0, 8)}`,
  }).catch((err) => console.warn("[deleteGoal] logActivity error:", err));

  return true;
}

export async function completeGoal(goalId: string, businessId: string): Promise<boolean> {
  const { error } = await supabase
    .from("goals")
    .update({ status: "achieved", updated_at: new Date().toISOString() })
    .eq("id", goalId)
    .eq("business_id", businessId);

  if (error) {
    console.error("[completeGoal] Supabase error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "goal",
    entity_id: goalId,
    action: "completed",
    description: `Goal achieved #${goalId.slice(0, 8)}`,
  }).catch((err) => console.warn("[completeGoal] logActivity error:", err));

  return true;
}

// ─── Goal Comments ───────────────────────────────────────────────────────────

export async function fetchGoalComments(goalId: string, businessId: string): Promise<GoalComment[]> {
  try {
    const [commentsRes, reactionsRes] = await Promise.all([
      (supabase.from as any)("goal_comments")
        .select("*")
        .eq("goal_id", goalId)
        .eq("business_id", businessId)
        .order("created_at", { ascending: true }),
      (supabase.from as any)("goal_comment_reactions")
        .select("*")
        .eq("business_id", businessId),
    ]);

    const rawComments = commentsRes.data || [];
    const rawReactions = reactionsRes.data || [];

    const userIds = Array.from(new Set(rawComments.map((c: any) => c.user_id).filter(Boolean)));
    const profileMap: Record<string, { name: string; avatar?: string | null }> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, first_name, last_name, avatar_url")
        .in("id", userIds as string[]);

      (profiles || []).forEach((p: any) => {
        profileMap[p.id] = {
          name: p.full_name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Team Member",
          avatar: p.avatar_url,
        };
      });
    }

    const reactionMap: Record<string, { id: string; userId: string; emoji: string }[]> = {};
    rawReactions.forEach((r: any) => {
      if (!reactionMap[r.comment_id]) reactionMap[r.comment_id] = [];
      reactionMap[r.comment_id].push({ id: r.id, userId: r.user_id, emoji: r.emoji });
    });

    const parsedComments: GoalComment[] = rawComments.map((c: any) => {
      const commenter = c.user_id ? profileMap[c.user_id] : null;
      return {
        id: c.id,
        goalId: c.goal_id,
        parentCommentId: c.parent_comment_id,
        userId: c.user_id,
        commenterName: commenter?.name || "Team Member",
        commenterAvatar: commenter?.avatar,
        commentText: c.comment_text,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        reactions: reactionMap[c.id] || [],
        replies: [],
      };
    });

    const rootComments: GoalComment[] = [];
    const commentMap: Record<string, GoalComment> = {};
    parsedComments.forEach((c) => { commentMap[c.id] = c; });
    parsedComments.forEach((c) => {
      if (c.parentCommentId && commentMap[c.parentCommentId]) {
        if (!commentMap[c.parentCommentId].replies) commentMap[c.parentCommentId].replies = [];
        commentMap[c.parentCommentId].replies!.push(c);
      } else {
        rootComments.push(c);
      }
    });

    return rootComments;
  } catch (err) {
    console.error("Error fetching goal comments:", err);
    return [];
  }
}

export async function createGoalComment(params: {
  businessId: string;
  goalId: string;
  userId?: string | null;
  commentText: string;
  parentCommentId?: string | null;
}): Promise<GoalComment> {
  const { businessId, goalId, userId, commentText, parentCommentId } = params;

  const { data: created, error } = await (supabase.from as any)("goal_comments")
    .insert({
      business_id: businessId,
      goal_id: goalId,
      user_id: userId || null,
      comment_text: commentText.trim(),
      parent_comment_id: parentCommentId || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[createGoalComment] error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "goal",
    entity_id: goalId,
    action: "comment_added",
    description: `Added comment on goal #${goalId.slice(0, 8)}`,
  }).catch((err) => console.warn("[createGoalComment] logActivity failed:", err));

  return {
    id: created.id,
    goalId: created.goal_id,
    parentCommentId: created.parent_comment_id,
    userId: created.user_id,
    commenterName: "You",
    commentText: created.comment_text,
    createdAt: created.created_at,
    updatedAt: created.updated_at,
    reactions: [],
    replies: [],
  };
}

export async function updateGoalComment(
  commentId: string,
  businessId: string,
  userId: string,
  commentText: string
): Promise<boolean> {
  const { error } = await (supabase.from as any)("goal_comments")
    .update({ comment_text: commentText.trim(), updated_at: new Date().toISOString() })
    .eq("id", commentId)
    .eq("business_id", businessId)
    .eq("user_id", userId);

  if (error) {
    console.error("[updateGoalComment] error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }
  return true;
}

export async function deleteGoalComment(
  commentId: string,
  businessId: string,
  userId: string
): Promise<boolean> {
  const { error } = await (supabase.from as any)("goal_comments")
    .delete()
    .eq("id", commentId)
    .eq("business_id", businessId)
    .eq("user_id", userId);

  if (error) {
    console.error("[deleteGoalComment] error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }
  return true;
}

export async function toggleGoalCommentReaction(params: {
  commentId: string;
  businessId: string;
  userId: string;
  emoji: string;
}): Promise<boolean> {
  const { commentId, businessId, userId, emoji } = params;

  const { data: existing, error: selectErr } = await (supabase.from as any)("goal_comment_reactions")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .eq("emoji", emoji)
    .maybeSingle();

  if (selectErr) {
    console.error("[toggleGoalCommentReaction] select error:", selectErr);
    throw new Error(selectErr.message || JSON.stringify(selectErr));
  }

  if (existing) {
    const { error: delErr } = await (supabase.from as any)("goal_comment_reactions")
      .delete()
      .eq("id", existing.id);
    if (delErr) throw new Error(delErr.message || JSON.stringify(delErr));
  } else {
    const { error: insErr } = await (supabase.from as any)("goal_comment_reactions").insert({
      comment_id: commentId,
      business_id: businessId,
      user_id: userId,
      emoji,
    });
    if (insErr) throw new Error(insErr.message || JSON.stringify(insErr));
  }

  return true;
}

// ─── Goal Progress Updates ───────────────────────────────────────────────────

export async function fetchGoalProgressUpdates(goalId: string, businessId: string): Promise<GoalProgressUpdate[]> {
  try {
    const { data, error } = await (supabase.from as any)("goal_progress_updates")
      .select("*")
      .eq("goal_id", goalId)
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[fetchGoalProgressUpdates] error:", error);
      return [];
    }

    const rawUpdates = data || [];
    const userIds = Array.from(new Set(rawUpdates.map((u: any) => u.user_id).filter(Boolean)));
    const profileMap: Record<string, string> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, first_name, last_name")
        .in("id", userIds as string[]);
      (profiles || []).forEach((p: any) => {
        profileMap[p.id] = p.full_name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Team Member";
      });
    }

    return rawUpdates.map((u: any) => ({
      id: u.id,
      goal_id: u.goal_id,
      user_id: u.user_id,
      update_text: u.update_text,
      progress_value: u.progress_value !== null ? Number(u.progress_value) : null,
      created_at: u.created_at,
      authorName: u.user_id ? profileMap[u.user_id] || "Team Member" : "Team Member",
    }));
  } catch (err) {
    console.error("[fetchGoalProgressUpdates] unexpected error:", err);
    return [];
  }
}

export async function createGoalProgressUpdate(params: {
  businessId: string;
  goalId: string;
  userId?: string | null;
  updateText: string;
  progressValue?: number | null;
}): Promise<GoalProgressUpdate> {
  const { businessId, goalId, userId, updateText, progressValue } = params;

  const { data: created, error } = await (supabase.from as any)("goal_progress_updates")
    .insert({
      business_id: businessId,
      goal_id: goalId,
      user_id: userId || null,
      update_text: updateText.trim(),
      progress_value: progressValue !== undefined && progressValue !== null ? progressValue : null,
    })
    .select()
    .single();

  if (error) {
    console.error("[createGoalProgressUpdate] error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  // If progress_value was provided, update the goal's current_value
  if (progressValue !== undefined && progressValue !== null) {
    await supabase
      .from("goals")
      .update({ current_value: progressValue, updated_at: new Date().toISOString() })
      .eq("id", goalId)
      .eq("business_id", businessId);
  }

  await logActivity({
    business_id: businessId,
    entity_type: "goal",
    entity_id: goalId,
    action: "progress_updated",
    description: `Posted progress update on goal #${goalId.slice(0, 8)}`,
  }).catch((err) => console.warn("[createGoalProgressUpdate] logActivity failed:", err));

  return {
    id: created.id,
    goal_id: created.goal_id,
    user_id: created.user_id,
    update_text: created.update_text,
    progress_value: created.progress_value !== null ? Number(created.progress_value) : null,
    created_at: created.created_at,
    authorName: "You",
  };
}

// ─── Goal Activity ───────────────────────────────────────────────────────────

export interface GoalActivityEntry {
  id: string;
  action: string;
  description: string;
  actorName: string | null;
  createdAt: string;
  source: "activity_log" | "progress_update";
}

export async function fetchGoalActivity(goalId: string, businessId: string): Promise<GoalActivityEntry[]> {
  try {
    const [activityRes, progressRes] = await Promise.all([
      supabase
        .from("activity_logs")
        .select("*")
        .eq("business_id", businessId)
        .eq("entity_type", "goal")
        .eq("entity_id", goalId)
        .order("created_at", { ascending: false })
        .limit(30),
      (supabase.from as any)("goal_progress_updates")
        .select("*")
        .eq("goal_id", goalId)
        .eq("business_id", businessId)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const activityLogs = (activityRes.data || []) as any[];
    const progressUpdates = (progressRes.data || []) as any[];

    // Fetch actor names
    const allUserIds = Array.from(new Set([
      ...activityLogs.map((a) => a.actor_id).filter(Boolean),
      ...progressUpdates.map((p) => p.user_id).filter(Boolean),
    ]));
    const profileMap: Record<string, string> = {};

    if (allUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, first_name, last_name")
        .in("id", allUserIds as string[]);
      (profiles || []).forEach((p: any) => {
        profileMap[p.id] = p.full_name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Team Member";
      });
    }

    const entries: GoalActivityEntry[] = [
      ...activityLogs.map((a) => ({
        id: a.id,
        action: a.action,
        description: a.description,
        actorName: a.actor_id ? profileMap[a.actor_id] || null : null,
        createdAt: a.created_at,
        source: "activity_log" as const,
      })),
      ...progressUpdates.map((p) => ({
        id: p.id,
        action: "progress_updated",
        description: p.update_text,
        actorName: p.user_id ? profileMap[p.user_id] || null : null,
        createdAt: p.created_at,
        source: "progress_update" as const,
      })),
    ];

    entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return entries;
  } catch (err) {
    console.error("[fetchGoalActivity] error:", err);
    return [];
  }
}
