import { supabase } from "@/lib/supabase";
import type { Task, TaskInsert, TaskUpdate } from "@/lib/database.types";
import { logActivity } from "./activity";
import { createWorkspaceNotification } from "./notifications";

export interface WorkspaceMemberInfo {
  userId: string;
  fullName: string;
  role: string;
}

export interface TodaysFocusSummary {
  todaysTasks: Task[];
  totalTasksCount: number;
  dueTodayCount: number;
  overdueCount: number;
  totalEstimatedMinutes: number;
  totalEstimatedImpact: number;
  hasMeasuredImpact: boolean;
}

export async function getTodaysFocusTasks(businessId: string): Promise<TodaysFocusSummary> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("business_id", businessId)
    .neq("status", "completed")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching Today's Focus tasks:", error);
    return {
      todaysTasks: [],
      totalTasksCount: 0,
      dueTodayCount: 0,
      overdueCount: 0,
      totalEstimatedMinutes: 0,
      totalEstimatedImpact: 0,
      hasMeasuredImpact: false,
    };
  }

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const priorityWeights: Record<string, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const focusTasks: Task[] = [];
  let dueTodayCount = 0;
  let overdueCount = 0;
  let totalMinutes = 0;
  let totalImpact = 0;
  let hasMeasuredImpact = false;

  data.forEach((t: any) => {
    let isFocus = false;
    if (t.due_date) {
      const taskDueDate = t.due_date.slice(0, 10);
      if (taskDueDate === todayStr) {
        dueTodayCount++;
        isFocus = true;
      } else if (taskDueDate < todayStr) {
        overdueCount++;
        isFocus = true;
      }
    } else if (t.priority === "urgent" || t.priority === "high") {
      isFocus = true;
    }

    if (isFocus) {
      focusTasks.push(t as Task);
      totalMinutes += Number(t.estimated_minutes) || 30;
      const impactVal = Number(t.estimated_impact_value) || 0;
      if (impactVal > 0) {
        totalImpact += impactVal;
        hasMeasuredImpact = true;
      }
    }
  });

  // Sort focus tasks deterministically by priority weight and due date
  focusTasks.sort((a: any, b: any) => {
    const wA = priorityWeights[a.priority] || 2;
    const wB = priorityWeights[b.priority] || 2;
    if (wA !== wB) return wB - wA;

    const impA = Number(a.estimated_impact_value) || 0;
    const impB = Number(b.estimated_impact_value) || 0;
    if (impA !== impB) return impB - impA;

    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return {
    todaysTasks: focusTasks,
    totalTasksCount: data.length,
    dueTodayCount,
    overdueCount,
    totalEstimatedMinutes: totalMinutes,
    totalEstimatedImpact: totalImpact,
    hasMeasuredImpact,
  };
}

export async function getTasks(businessId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
  return data ?? [];
}

export async function moveTaskMission(
  taskId: string,
  businessId: string,
  newMissionId: string | null
): Promise<Task> {
  const { data, error } = await (supabase.from("tasks") as any)
    .update({
      mission_id: newMissionId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) {
    console.error("[moveTaskMission] error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "task",
    entity_id: taskId,
    action: "updated",
    description: newMissionId ? `Assigned task to mission` : `Removed task from mission`,
  }).catch((err) => console.warn("[moveTaskMission] logActivity failed:", err));

  return data;
}

export async function createTask(insert: TaskInsert): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      ...insert,
      status: insert.status || "todo",
      priority: insert.priority || "medium",
    })
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    business_id: data.business_id,
    customer_id: data.customer_id,
    job_id: data.job_id,
    entity_type: "task",
    entity_id: data.id,
    action: "created",
    description: `Created task: ${data.title}`,
  });

  if (data.assigned_to) {
    await createWorkspaceNotification({
      businessId: data.business_id,
      userId: data.assigned_to,
      type: "task_assigned",
      title: "New Task Assigned",
      message: `You were assigned task: "${data.title}"`,
      actionUrl: `/tasks?taskId=${data.id}`,
    });
  }

  return data;
}

export async function updateTask(id: string, businessId: string, updates: TaskUpdate): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    business_id: businessId,
    entity_type: "task",
    entity_id: id,
    action: "updated",
    description: `Updated task: ${data.title}`,
  });

  if (updates.assigned_to) {
    await createWorkspaceNotification({
      businessId,
      userId: updates.assigned_to,
      type: "task_assigned",
      title: "Task Reassigned",
      message: `You were assigned task: "${data.title}"`,
      actionUrl: `/tasks?taskId=${data.id}`,
    });
  }

  return data;
}

export async function deleteTask(id: string, businessId: string): Promise<boolean> {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    console.error("Error deleting task:", error);
    return false;
  }

  await logActivity({
    business_id: businessId,
    entity_type: "task",
    entity_id: id,
    action: "deleted",
    description: `Deleted task #${id.slice(0, 8)}`,
  });

  return true;
}

export async function toggleTaskCompletion(id: string, businessId: string, currentStatus: string, title: string): Promise<Task> {
  const isCompleted = currentStatus === "completed";
  const newStatus = isCompleted ? "todo" : "completed";
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("tasks")
    .update({
      status: newStatus,
      completed_at: newStatus === "completed" ? now : null,
      updated_at: now,
    })
    .eq("id", id)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    business_id: businessId,
    entity_type: "task",
    entity_id: id,
    action: newStatus === "completed" ? "completed" : "reopened",
    description: `${newStatus === "completed" ? "Completed" : "Reopened"} task: ${title}`,
  });

  if (newStatus === "completed") {
    await createWorkspaceNotification({
      businessId,
      userId: data.assigned_to || data.created_by,
      type: "task_completed",
      title: "Task Completed",
      message: `Task completed: "${title}"`,
      actionUrl: `/tasks?taskId=${data.id}`,
    });
  }

  return data;
}

export async function fetchWorkspaceMembers(businessId: string): Promise<WorkspaceMemberInfo[]> {
  try {
    const { data: memberships, error } = await supabase
      .from("memberships")
      .select("user_id, role")
      .eq("business_id", businessId)
      .eq("status", "active");

    if (error || !memberships) return [];

    const userIds = memberships.map((m) => m.user_id);
    if (userIds.length === 0) return [];

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, first_name, last_name")
      .in("id", userIds);

    const profileMap: Record<string, string> = {};
    (profiles || []).forEach((p: any) => {
      profileMap[p.id] = p.full_name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Team Member";
    });

    return memberships.map((m) => ({
      userId: m.user_id,
      fullName: profileMap[m.user_id] || "Team Member",
      role: m.role,
    }));
  } catch (err) {
    console.error("Error fetching workspace members:", err);
    return [];
  }
}
