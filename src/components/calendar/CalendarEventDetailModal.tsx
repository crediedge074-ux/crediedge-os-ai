import React, { useState } from "react";
import { X, Calendar as CalendarIcon, Clock, Trash2, ExternalLink, ShieldCheck, MapPin, User, Check, Layers } from "lucide-react";
import type { CalendarEvent, Task } from "@/lib/database.types";
import { updateCalendarEvent, deleteCalendarEvent } from "@/services/calendar";

interface CalendarEventDetailModalProps {
  event: CalendarEvent;
  businessId: string;
  linkedTask?: Task | null;
  onClose: () => void;
  onRefresh: () => void;
  onOpenTaskWorkspace?: (task: Task) => void;
}

export function CalendarEventDetailModal({
  event,
  businessId,
  linkedTask,
  onClose,
  onRefresh,
  onOpenTaskWorkspace,
}: CalendarEventDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [location, setLocation] = useState(event.location || "");
  const [loading, setLoading] = useState(false);

  const startStr = new Date(event.start_time).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const endStr = new Date(event.end_time).toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !businessId) return;

    setLoading(true);
    try {
      await updateCalendarEvent(event.id, businessId, {
        title: title.trim(),
        description: description.trim() || null,
        location: location.trim() || null,
      });
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to update event: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete event "${event.title}"?`)) return;
    setLoading(true);
    try {
      await deleteCalendarEvent(event.id, businessId);
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(`Failed to delete event: ${err.message || String(err)}`);
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
            <h3 className="text-[15px] font-extrabold text-foreground">Calendar Event Details</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-[12.5px]">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block font-bold text-foreground mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3 text-foreground font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-9 w-full rounded-xl border border-border bg-secondary/20 px-3 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-border px-4 py-1.5 font-semibold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-brand px-4 py-1.5 font-extrabold text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded bg-brand/10 px-2 py-0.5 text-[10.5px] font-extrabold text-brand uppercase">
                    {event.event_type}
                  </span>
                  <span className="text-[11px] text-muted-foreground">Provider: <strong className="text-foreground capitalize">{event.provider}</strong></span>
                </div>
                <h2 className="text-[20px] font-black text-foreground">{event.title}</h2>
              </div>

              <div className="rounded-xl border border-border bg-secondary/20 p-3 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <Clock className="h-4 w-4 text-brand shrink-0" />
                  <span>{startStr} – {endStr}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              {event.description && (
                <div>
                  <div className="font-bold text-foreground mb-1">Notes & Description</div>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{event.description}</p>
                </div>
              )}

              {/* Linked Task Card */}
              {linkedTask && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-extrabold uppercase text-emerald-600">
                    <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> Linked Task</span>
                    <span>Status: {linkedTask.status}</span>
                  </div>
                  <div className="text-[13.5px] font-black text-foreground">{linkedTask.title}</div>
                  {onOpenTaskWorkspace && (
                    <button
                      type="button"
                      onClick={() => onOpenTaskWorkspace(linkedTask)}
                      className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-brand hover:underline pt-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Open in Execution System Workspace
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-[12px] font-bold text-red-500 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Event
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-xl border border-border px-4 py-2 font-bold text-foreground hover:bg-secondary"
                  >
                    Edit Event
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl bg-foreground px-4 py-2 font-bold text-background hover:bg-foreground/85"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
