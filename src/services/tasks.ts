import { supabase } from "@/lib/supabase";
import type { Task, TaskInsert, TaskUpdate } from "@/lib/database.types";
import { logActivity } from "./activity";

export interface WorkspaceMemberInfo {
  userId: string;
  fullName: string;
  role: string;
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
