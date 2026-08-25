import { supabase } from "@/lib/supabase";
import type { CalendarEvent, Task } from "@/lib/database.types";
import { logActivity } from "./activity";

export type CalendarProvider = "internal" | "google" | "microsoft" | "apple";
export type CalendarSyncStatus = "synced" | "pending" | "error";

export interface CalendarEventInsertInput {
  business_id: string;
  title: string;
  description?: string | null;
  event_type?: string; // booking, meeting, reminder, task, job
  start_time: string;
  end_time: string;
  is_all_day?: boolean;
  location?: string | null;
  customer_id?: string | null;
  job_id?: string | null;
  task_id?: string | null;
  provider?: CalendarProvider;
  external_event_id?: string | null;
  external_calendar_id?: string | null;
  sync_status?: CalendarSyncStatus;
}

export interface CalendarEventUpdateInput {
  title?: string;
  description?: string | null;
  event_type?: string;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
  location?: string | null;
  customer_id?: string | null;
  job_id?: string | null;
  task_id?: string | null;
  sync_status?: CalendarSyncStatus;
  last_synced_at?: string | null;
}

export interface CalendarScheduleRange {
  startIso: string;
  endIso: string;
}

export async function fetchCalendarEvents(
  businessId: string,
  startIso: string,
  endIso: string
): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("business_id", businessId)
    .gte("end_time", startIso)
    .lte("start_time", endIso)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("[fetchCalendarEvents] error:", error);
    return [];
  }
  return data ?? [];
}

export async function createCalendarEvent(input: CalendarEventInsertInput): Promise<CalendarEvent> {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id || null;

  const { data, error } = await supabase
    .from("calendar_events")
    .insert({
      ...input,
      event_type: input.event_type || "meeting",
      is_all_day: input.is_all_day ?? false,
      provider: input.provider || "internal",
      sync_status: input.sync_status || "synced",
      created_by: userId,
    } as any)
    .select()
    .single();

  if (error) {
    console.error("[createCalendarEvent] error:", error);
    throw new Error(error.message || "Failed to create calendar event.");
  }

  await logActivity({
    business_id: input.business_id,
    customer_id: input.customer_id || null,
    job_id: input.job_id || null,
    entity_type: "calendar_event",
    entity_id: data.id,
    action: "created",
    description: `Created calendar event: "${data.title}"`,
  }).catch(() => null);

  return data;
}

export async function updateCalendarEvent(
  id: string,
  businessId: string,
  updates: CalendarEventUpdateInput
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from("calendar_events")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    } as any)
    .eq("id", id)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) {
    console.error("[updateCalendarEvent] error:", error);
    throw new Error(error.message || "Failed to update calendar event.");
  }

  // If this calendar event is linked to a task and times were changed, sync task scheduled times
  if (data.task_id && (updates.start_time || updates.end_time)) {
    const taskUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.start_time) taskUpdates.scheduled_start = updates.start_time;
    if (updates.end_time) taskUpdates.scheduled_end = updates.end_time;

    await supabase
      .from("tasks")
      .update(taskUpdates)
      .eq("id", data.task_id)
      .eq("business_id", businessId);
  }

  await logActivity({
    business_id: businessId,
    entity_type: "calendar_event",
    entity_id: id,
    action: "updated",
    description: `Updated calendar event: "${data.title}"`,
  }).catch(() => null);

  return data;
}

export async function deleteCalendarEvent(id: string, businessId: string): Promise<boolean> {
  const { data: event } = await supabase
    .from("calendar_events")
    .select("task_id")
    .eq("id", id)
    .eq("business_id", businessId)
    .maybeSingle();

  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    console.error("[deleteCalendarEvent] error:", error);
    return false;
  }

  // If linked to a task, unschedule the task scheduled start/end times
  if (event?.task_id) {
    await supabase
      .from("tasks")
      .update({
        scheduled_start: null,
        scheduled_end: null,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", event.task_id)
      .eq("business_id", businessId);
  }

  return true;
}

export async function scheduleTaskOnCalendar(
  taskId: string,
  businessId: string,
  startIso: string,
  endIso: string,
  isAllDay: boolean = false
): Promise<{ task: Task; calendarEvent: CalendarEvent }> {
  // 1. Fetch Task
  const { data: task, error: taskErr } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("business_id", businessId)
    .single();

  if (taskErr || !task) {
    throw new Error(taskErr?.message || "Task not found.");
  }

  const nowIso = new Date().toISOString();

  // 2. Update task scheduled start/end
  const { data: updatedTask, error: updateErr } = await supabase
    .from("tasks")
    .update({
      scheduled_start: startIso,
      scheduled_end: endIso,
      updated_at: nowIso,
    } as any)
    .eq("id", taskId)
    .eq("business_id", businessId)
    .select()
    .single();

  if (updateErr) throw updateErr;

  // 3. Upsert calendar event for this task
  const { data: existingEvent } = await supabase
    .from("calendar_events")
    .select("id")
    .eq("task_id", taskId)
    .eq("business_id", businessId)
    .maybeSingle();

  let calEvent: CalendarEvent;

  if (existingEvent) {
    calEvent = await updateCalendarEvent(existingEvent.id, businessId, {
      title: task.title,
      description: task.description,
      start_time: startIso,
      end_time: endIso,
      is_all_day: isAllDay,
      event_type: "task",
    });
  } else {
    calEvent = await createCalendarEvent({
      business_id: businessId,
      task_id: taskId,
      customer_id: task.customer_id,
      job_id: task.job_id,
      title: task.title,
      description: task.description,
      event_type: "task",
      start_time: startIso,
      end_time: endIso,
      is_all_day: isAllDay,
      provider: "internal",
    });
  }

  await logActivity({
    business_id: businessId,
    entity_type: "task",
    entity_id: taskId,
    action: "scheduled",
    description: `Scheduled task "${task.title}" on calendar for ${new Date(startIso).toLocaleString("en-GB")}`,
  }).catch(() => null);

  return { task: updatedTask as Task, calendarEvent: calEvent };
}

export async function unscheduleTask(taskId: string, businessId: string): Promise<Task> {
  const nowIso = new Date().toISOString();

  // 1. Clear scheduled times on task
  const { data: updatedTask, error } = await supabase
    .from("tasks")
    .update({
      scheduled_start: null,
      scheduled_end: null,
      updated_at: nowIso,
    } as any)
    .eq("id", taskId)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) throw error;

  // 2. Remove corresponding calendar event
  await supabase
    .from("calendar_events")
    .delete()
    .eq("task_id", taskId)
    .eq("business_id", businessId);

  await logActivity({
    business_id: businessId,
    entity_type: "task",
    entity_id: taskId,
    action: "unscheduled",
    description: `Removed calendar schedule for task "${updatedTask.title}"`,
  }).catch(() => null);

  return updatedTask as Task;
}
