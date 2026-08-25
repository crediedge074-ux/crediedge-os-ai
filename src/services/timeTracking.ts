import { supabase } from "@/lib/supabase";
import { logActivity } from "./activity";

export type TimeEntryType = "timer" | "manual" | "automated";

export interface TaskTimeEntry {
  id: string;
  businessId: string;
  taskId: string;
  userId: string | null;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
  entryType: TimeEntryType;
  notes: string | null;
  createdAt: string;
}

export interface TaskProductivityMetrics {
  estimatedMinutes: number;
  actualMinutes: number;
  hasTrackedTime: boolean;
  varianceMinutes: number | null; // negative = faster than estimate
  efficiencyPct: number | null; // e.g. 25% faster
  verifiedTimeSavedMinutes: number | null;
  suggestedFutureEstimateMinutes: number | null;
}

export async function fetchTaskTimeEntries(taskId: string, businessId: string): Promise<TaskTimeEntry[]> {
  try {
    const { data, error } = await (supabase.from as any)("task_time_entries")
      .select("*")
      .eq("task_id", taskId)
      .eq("business_id", businessId)
      .order("start_time", { ascending: false });

    if (error) {
      console.error("[fetchTaskTimeEntries] error:", error);
      return [];
    }

    return (data || []).map((e: any) => ({
      id: e.id,
      businessId: e.business_id,
      taskId: e.task_id,
      userId: e.user_id,
      startTime: e.start_time,
      endTime: e.end_time,
      durationMinutes: e.duration_minutes || 0,
      entryType: e.entry_type || "manual",
      notes: e.notes,
      createdAt: e.created_at,
    }));
  } catch (err) {
    console.error("[fetchTaskTimeEntries] unexpected error:", err);
    return [];
  }
}

export async function startTaskTimer(
  taskId: string,
  businessId: string,
  userId: string
): Promise<TaskTimeEntry> {
  const now = new Date().toISOString();
  const { data: created, error } = await (supabase.from as any)("task_time_entries")
    .insert({
      business_id: businessId,
      task_id: taskId,
      user_id: userId,
      start_time: now,
      entry_type: "timer",
      duration_minutes: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("[startTaskTimer] error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "task",
    entity_id: taskId,
    action: "timer_started",
    description: `Started timer on task #${taskId.slice(0, 8)}`,
  }).catch((err) => console.warn("[startTaskTimer] logActivity failed:", err));

  return {
    id: created.id,
    businessId: created.business_id,
    taskId: created.task_id,
    userId: created.user_id,
    startTime: created.start_time,
    endTime: created.end_time,
    durationMinutes: created.duration_minutes,
    entryType: created.entry_type,
    notes: created.notes,
    createdAt: created.created_at,
  };
}

export async function stopTaskTimer(
  entryId: string,
  businessId: string,
  notes?: string
): Promise<TaskTimeEntry> {
  const now = new Date();
  const { data: existing, error: fetchErr } = await (supabase.from as any)("task_time_entries")
    .select("start_time")
    .eq("id", entryId)
    .eq("business_id", businessId)
    .single();

  if (fetchErr || !existing) {
    throw new Error("Active timer entry not found.");
  }

  const startTime = new Date(existing.start_time);
  const diffMs = now.getTime() - startTime.getTime();
  const durationMinutes = Math.max(1, Math.round(diffMs / (1000 * 60)));

  const { data: updated, error } = await (supabase.from as any)("task_time_entries")
    .update({
      end_time: now.toISOString(),
      duration_minutes: durationMinutes,
      notes: notes || null,
      updated_at: now.toISOString(),
    })
    .eq("id", entryId)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) {
    console.error("[stopTaskTimer] error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  return {
    id: updated.id,
    businessId: updated.business_id,
    taskId: updated.task_id,
    userId: updated.user_id,
    startTime: updated.start_time,
    endTime: updated.end_time,
    durationMinutes: updated.duration_minutes,
    entryType: updated.entry_type,
    notes: updated.notes,
    createdAt: updated.created_at,
  };
}

export async function addManualTimeEntry(params: {
  taskId: string;
  businessId: string;
  userId?: string | null;
  durationMinutes: number;
  notes?: string | null;
  entryType?: TimeEntryType;
}): Promise<TaskTimeEntry> {
  const { taskId, businessId, userId, durationMinutes, notes, entryType } = params;
  const now = new Date().toISOString();

  const { data: created, error } = await (supabase.from as any)("task_time_entries")
    .insert({
      business_id: businessId,
      task_id: taskId,
      user_id: userId || null,
      start_time: now,
      end_time: now,
      duration_minutes: Math.max(1, durationMinutes),
      entry_type: entryType || "manual",
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[addManualTimeEntry] error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  return {
    id: created.id,
    businessId: created.business_id,
    taskId: created.task_id,
    userId: created.user_id,
    startTime: created.start_time,
    endTime: created.end_time,
    durationMinutes: created.duration_minutes,
    entryType: created.entry_type,
    notes: created.notes,
    createdAt: created.created_at,
  };
}

export async function calculateTaskProductivity(
  taskId: string,
  businessId: string
): Promise<TaskProductivityMetrics> {
  const [taskRes, entries] = await Promise.all([
    supabase.from("tasks").select("estimated_minutes, status").eq("id", taskId).eq("business_id", businessId).single(),
    fetchTaskTimeEntries(taskId, businessId),
  ]);

  const estimatedMinutes = (taskRes.data as any)?.estimated_minutes || 30;
  const isCompleted = (taskRes.data as any)?.status === "completed";

  const totalActualMinutes = entries.reduce((acc, e) => acc + (e.durationMinutes || 0), 0);
  const hasTrackedTime = entries.length > 0;

  let varianceMinutes: number | null = null;
  let efficiencyPct: number | null = null;
  let verifiedTimeSavedMinutes: number | null = null;

  if (hasTrackedTime) {
    varianceMinutes = totalActualMinutes - estimatedMinutes;
    if (estimatedMinutes > 0) {
      efficiencyPct = Math.round(((estimatedMinutes - totalActualMinutes) / estimatedMinutes) * 100);
    }
    if (isCompleted && totalActualMinutes < estimatedMinutes) {
      verifiedTimeSavedMinutes = estimatedMinutes - totalActualMinutes;
    }
  }

  return {
    estimatedMinutes,
    actualMinutes: totalActualMinutes,
    hasTrackedTime,
    varianceMinutes,
    efficiencyPct,
    verifiedTimeSavedMinutes,
    suggestedFutureEstimateMinutes: null,
  };
}
