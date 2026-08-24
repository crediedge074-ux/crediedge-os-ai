import { supabase } from "@/lib/supabase";
import { logActivity } from "./activity";
import { createWorkspaceNotification } from "./notifications";

export interface CommentReaction {
  id: string;
  commentId: string;
  userId: string;
  emoji: string;
}

export interface TaskComment {
  id: string;
  businessId: string;
  taskId: string;
  parentCommentId: string | null;
  userId: string | null;
  commenterName: string;
  commenterAvatar?: string | null;
  commentText: string;
  createdAt: string;
  updatedAt: string;
  reactions: CommentReaction[];
  replies?: TaskComment[];
}

export async function fetchTaskComments(taskId: string, businessId: string): Promise<TaskComment[]> {
  try {
    const [commentsRes, reactionsRes] = await Promise.all([
      (supabase.from as any)("task_comments")
        .select("*")
        .eq("task_id", taskId)
        .eq("business_id", businessId)
        .order("created_at", { ascending: true }),
      (supabase.from as any)("task_comment_reactions")
        .select("*")
        .eq("business_id", businessId),
    ]);

    const rawComments = commentsRes.data || [];
    const rawReactions = reactionsRes.data || [];

    // Fetch profile commenter names
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

    const reactionMap: Record<string, CommentReaction[]> = {};
    rawReactions.forEach((r: any) => {
      if (!reactionMap[r.comment_id]) reactionMap[r.comment_id] = [];
      reactionMap[r.comment_id].push({
        id: r.id,
        commentId: r.comment_id,
        userId: r.user_id,
        emoji: r.emoji,
      });
    });

    const parsedComments: TaskComment[] = rawComments.map((c: any) => {
      const commenter = c.user_id ? profileMap[c.user_id] : null;
      return {
        id: c.id,
        businessId: c.business_id,
        taskId: c.task_id,
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

    // Build threaded hierarchy
    const rootComments: TaskComment[] = [];
    const commentMap: Record<string, TaskComment> = {};

    parsedComments.forEach((c) => {
      commentMap[c.id] = c;
    });

    parsedComments.forEach((c) => {
      if (c.parentCommentId && commentMap[c.parentCommentId]) {
        if (!commentMap[c.parentCommentId].replies) {
          commentMap[c.parentCommentId].replies = [];
        }
        commentMap[c.parentCommentId].replies!.push(c);
      } else {
        rootComments.push(c);
      }
    });

    return rootComments;
  } catch (err) {
    console.error("Error fetching task comments:", err);
    return [];
  }
}

export async function createTaskComment(params: {
  businessId: string;
  taskId: string;
  userId?: string | null;
  commentText: string;
  parentCommentId?: string | null;
}): Promise<TaskComment> {
  const { businessId, taskId, userId, commentText, parentCommentId } = params;

  const { data: created, error } = await (supabase.from as any)("task_comments")
    .insert({
      business_id: businessId,
      task_id: taskId,
      user_id: userId || null,
      comment_text: commentText.trim(),
      parent_comment_id: parentCommentId || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[createTaskComment] error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "task",
    entity_id: taskId,
    action: "comment_added",
    description: `Added comment on task #${taskId.slice(0, 8)}`,
  }).catch((err) => console.warn("[createTaskComment] logActivity failed:", err));

  // Trigger workspace notification for task owner or parent commenter
  if (parentCommentId) {
    const { data: parent } = await (supabase.from as any)("task_comments")
      .select("user_id")
      .eq("id", parentCommentId)
      .maybeSingle();

    if (parent?.user_id && parent.user_id !== userId) {
      await createWorkspaceNotification({
        businessId,
        userId: parent.user_id,
        type: "comment_reply",
        title: "New Comment Reply",
        message: `Someone replied to your comment on task`,
        actionUrl: `/tasks?taskId=${taskId}`,
      });
    }
  } else {
    const { data: taskData } = await supabase
      .from("tasks")
      .select("assigned_to, created_by")
      .eq("id", taskId)
      .maybeSingle();

    const notifyUserId = taskData?.assigned_to || taskData?.created_by;
    if (notifyUserId && notifyUserId !== userId) {
      await createWorkspaceNotification({
        businessId,
        userId: notifyUserId,
        type: "task_comment",
        title: "New Task Comment",
        message: `New comment posted on task`,
        actionUrl: `/tasks?taskId=${taskId}`,
      });
    }
  }

  return {
    id: created.id,
    businessId: created.business_id,
    taskId: created.task_id,
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

export async function updateTaskComment(
  commentId: string,
  businessId: string,
  userId: string,
  commentText: string
): Promise<boolean> {
  const { error } = await (supabase.from as any)("task_comments")
    .update({
      comment_text: commentText.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .eq("business_id", businessId)
    .eq("user_id", userId);

  if (error) {
    console.error("[updateTaskComment] error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }
  return true;
}

export async function deleteTaskComment(
  commentId: string,
  businessId: string,
  userId: string
): Promise<boolean> {
  const { error } = await (supabase.from as any)("task_comments")
    .delete()
    .eq("id", commentId)
    .eq("business_id", businessId)
    .eq("user_id", userId);

  if (error) {
    console.error("[deleteTaskComment] error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }
  return true;
}

export async function toggleCommentReaction(params: {
  commentId: string;
  businessId: string;
  userId: string;
  emoji: string;
}): Promise<boolean> {
  const { commentId, businessId, userId, emoji } = params;

  // Check if reaction exists
  const { data: existing, error: selectErr } = await (supabase.from as any)("task_comment_reactions")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .eq("emoji", emoji)
    .maybeSingle();

  if (selectErr) {
    console.error("[toggleCommentReaction] select error:", selectErr);
    throw new Error(selectErr.message || JSON.stringify(selectErr));
  }

  if (existing) {
    const { error: delErr } = await (supabase.from as any)("task_comment_reactions")
      .delete()
      .eq("id", existing.id);
    if (delErr) {
      console.error("[toggleCommentReaction] delete error:", delErr);
      throw new Error(delErr.message || JSON.stringify(delErr));
    }
  } else {
    const { error: insErr } = await (supabase.from as any)("task_comment_reactions").insert({
      comment_id: commentId,
      business_id: businessId,
      user_id: userId,
      emoji,
    });
    if (insErr) {
      console.error("[toggleCommentReaction] insert error:", insErr);
      throw new Error(insErr.message || JSON.stringify(insErr));
    }

    // Trigger notification on reaction
    const { data: targetComment } = await (supabase.from as any)("task_comments")
      .select("user_id, task_id")
      .eq("id", commentId)
      .maybeSingle();

    if (targetComment?.user_id && targetComment.user_id !== userId) {
      await createWorkspaceNotification({
        businessId,
        userId: targetComment.user_id,
        type: "comment_reaction",
        title: "New Comment Reaction",
        message: `Someone reacted ${emoji} to your comment`,
        actionUrl: `/tasks?taskId=${targetComment.task_id}`,
      });
    }
  }

  return true;
}
