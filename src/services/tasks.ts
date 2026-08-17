import { supabase } from "@/lib/supabase";
import type { Task, TaskInsert, TaskUpdate } from "@/lib/database.types";
import { logActivity } from "./activity";

export async function getTasks(businessId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("business_id", businessId)
    .order("due_date", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
  return data ?? [];
}

export async function createTask(insert: TaskInsert): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert(insert)
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

export async function updateTask(id: string, updates: TaskUpdate): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
