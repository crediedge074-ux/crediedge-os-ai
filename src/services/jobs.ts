import { supabase } from "@/lib/supabase";
import type { Job, JobInsert, JobUpdate } from "@/lib/database.types";
import { logActivity } from "./activity";

export async function getJobs(businessId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
  return data ?? [];
}

export async function getCustomerJobs(businessId: string, customerId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("business_id", businessId)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customer jobs:", error);
    return [];
  }
  return data ?? [];
}

export async function createJob(insert: JobInsert): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .insert(insert)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    business_id: data.business_id,
    customer_id: data.customer_id,
    job_id: data.id,
    entity_type: "job",
    entity_id: data.id,
    action: "created",
    description: `Created Job #${data.job_number}: ${data.title}`,
  });

  return data;
}

export async function updateJob(id: string, updates: JobUpdate): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    business_id: data.business_id,
    customer_id: data.customer_id,
    job_id: data.id,
    entity_type: "job",
    entity_id: data.id,
    action: "updated",
    description: `Updated Job #${data.job_number} status to ${data.status}`,
  });

  return data;
}
