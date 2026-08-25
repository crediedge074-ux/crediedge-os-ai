import React, { useState } from "react";
import { X, Calendar as CalendarIcon, Clock, Plus, Link, MapPin, User, Check, Layers } from "lucide-react";
import type { Task, Customer, Job } from "@/lib/database.types";
import { createCalendarEvent, scheduleTaskOnCalendar, type CalendarEventInsertInput } from "@/services/calendar";

interface NewEventModalProps {
  businessId: string;
  selectedDate: Date;
  allTasks: Task[];
  customers: Customer[];
  jobs: Job[];
  onClose: () => void;
  onRefresh: () => void;
}

export function NewEventModal({
  businessId,
  selectedDate,
  allTasks,
  customers,
  jobs,
  onClose,
  onRefresh,
}: NewEventModalProps) {
  const defaultDateStr = selectedDate.toISOString().slice(0, 10);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("meeting");
  const [startDateStr, setStartDateStr] = useState(defaultDateStr);
  const [startTimeStr, setStartTimeStr] = useState("09:00");
  const [endDateStr, setEndDateStr] = useState(defaultDateStr);
  const [endTimeStr, setEndTimeStr] = useState("10:00");
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState("");

  const [linkedTaskId, setLinkedTaskId] = useState("");
  const [linkedCustomerId, setLinkedCustomerId] = useState("");
  const [linkedJobId, setLinkedJobId] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !businessId) return;

    setLoading(true);
    try {
      const startIso = isAllDay
        ? new Date(`${startDateStr}T00:00:00`).toISOString()
        : new Date(`${startDateStr}T${startTimeStr}:00`).toISOString();

      const endIso = isAllDay
        ? new Date(`${endDateStr}T23:59:59`).toISOString()
        : new Date(`${endDateStr}T${endTimeStr}:00`).toISOString();

      if (linkedTaskId) {
        // Schedule existing task on calendar
        await scheduleTaskOnCalendar(linkedTaskId, businessId, startIso, endIso, isAllDay);
      } else {
        // Create standalone event
        await createCalendarEvent({
          business_id: businessId,
          title: title.trim(),
          description: description.trim() || null,
          event_type: eventType,
          start_time: startIso,
          end_time: endIso,
          is_all_day: isAllDay,
          location: location.trim() || null,
          customer_id: linkedCustomerId || null,
          job_id: linkedJobId || null,
          provider: "internal",
        });
      }

      onRefresh();
      onClose();
    } catch (err: any) {
      alert(`Failed to save event: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/30">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-brand" />
            <h3 className="text-[15px] font-extrabold text-foreground">Schedule Calendar Event</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[12.5px]">
          <div>
            <label className="block font-bold text-foreground mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Client Onboarding Meeting / Workshop Review"
              className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-brand font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3 text-foreground focus:outline-none"
              >
                <option value="meeting">Meeting</option>
                <option value="booking">Customer Booking</option>
                <option value="job">Job Work Slot</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Link Existing Task (Optional)</label>
              <select
                value={linkedTaskId}
                onChange={(e) => {
                  const tId = e.target.value;
                  setLinkedTaskId(tId);
                  if (tId) {
                    const selTask = allTasks.find((t) => t.id === tId);
                    if (selTask) setTitle(selTask.title);
                  }
                }}
                className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3 text-foreground focus:outline-none"
              >
                <option value="">No linked task (Standalone event)</option>
                {allTasks.filter((t) => t.status !== "completed").map((t) => (
                  <option key={t.id} value={t.id}>
                    Task: {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">Start Date & Time</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  required
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  className="h-9 flex-1 rounded-xl border border-border bg-secondary/20 px-2 text-foreground focus:outline-none"
                />
                {!isAllDay && (
                  <input
                    type="time"
                    required
                    value={startTimeStr}
                    onChange={(e) => setStartTimeStr(e.target.value)}
                    className="h-9 w-24 rounded-xl border border-border bg-secondary/20 px-2 text-foreground focus:outline-none"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">End Date & Time</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  required
                  value={endDateStr}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  className="h-9 flex-1 rounded-xl border border-border bg-secondary/20 px-2 text-foreground focus:outline-none"
                />
                {!isAllDay && (
                  <input
                    type="time"
                    required
                    value={endTimeStr}
                    onChange={(e) => setEndTimeStr(e.target.value)}
                    className="h-9 w-24 rounded-xl border border-border bg-secondary/20 px-2 text-foreground focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAllDayCheck"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="rounded border-border text-brand focus:ring-brand"
            />
            <label htmlFor="isAllDayCheck" className="font-semibold text-foreground cursor-pointer">
              All-day event
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">Connect Customer</label>
              <select
                value={linkedCustomerId}
                onChange={(e) => setLinkedCustomerId(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3 text-foreground focus:outline-none"
              >
                <option value="">None</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name || c.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Video Call / On-site"
                className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3 text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-foreground mb-1">Description & Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details, agenda or meeting notes..."
              className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="rounded-xl bg-brand px-4 py-2 font-extrabold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ScheduleTaskModalProps {
  task: Task;
  businessId: string;
  onClose: () => void;
  onRefresh: () => void;
}

export function ScheduleTaskModal({ task, businessId, onClose, onRefresh }: ScheduleTaskModalProps) {
  const defaultDateStr = (task as any).scheduled_start
    ? (task as any).scheduled_start.slice(0, 10)
    : task.due_date
    ? task.due_date.slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const [startDateStr, setStartDateStr] = useState(defaultDateStr);
  const [startTimeStr, setStartTimeStr] = useState("09:00");
  const [durationMins, setDurationMins] = useState(String((task as any).estimated_minutes || 30));
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const startIso = new Date(`${startDateStr}T${startTimeStr}:00`).toISOString();
      const mins = Number(durationMins) || 30;
      const endIso = new Date(new Date(startIso).getTime() + mins * 60 * 1000).toISOString();

      await scheduleTaskOnCalendar(task.id, businessId, startIso, endIso, false);
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(`Failed to schedule task: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/30">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand" />
            <h3 className="text-[15px] font-extrabold text-foreground">Schedule Task Time Block</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-[12.5px]">
          <div className="rounded-xl border border-border bg-secondary/20 p-3 space-y-1">
            <div className="font-extrabold text-foreground text-[13px]">{task.title}</div>
            <div className="text-[11px] text-muted-foreground">Priority: {task.priority.toUpperCase()}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">Scheduled Date</label>
              <input
                type="date"
                required
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-2 text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTimeStr}
                onChange={(e) => setStartTimeStr(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-2 text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-foreground mb-1">Planned Duration (Minutes)</label>
            <input
              type="number"
              required
              min="15"
              step="15"
              value={durationMins}
              onChange={(e) => setDurationMins(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3 text-foreground focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brand px-4 py-2 font-extrabold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Confirm Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
