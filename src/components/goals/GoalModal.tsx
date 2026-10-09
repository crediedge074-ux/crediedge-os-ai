import { toUserMessage } from "@/lib/errors";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { WorkspaceMemberInfo } from "@/services/tasks";
import type { CalculatedGoal, GoalPriority } from "@/services/goals";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description?: string | null;
    target_value: number;
    current_value?: number;
    unit?: string;
    category?: string;
    priority?: GoalPriority;
    owner_id?: string | null;
    target_date?: string | null;
  }) => Promise<void>;
  goalToEdit?: CalculatedGoal | null;
  members: WorkspaceMemberInfo[];
  currentUserId?: string | null;
}

const categories = [
  { value: "revenue", label: "Revenue" },
  { value: "reviews", label: "Reviews" },
  { value: "customers", label: "Customers" },
  { value: "efficiency", label: "Efficiency" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
];

const units = [
  { value: "£", label: "Pounds (£)" },
  { value: "%", label: "Percentage (%)" },
  { value: "count", label: "Count (number)" },
  { value: "hrs", label: "Hours" },
  { value: "days", label: "Days" },
];

export function GoalModal({ isOpen, onClose, onSave, goalToEdit, members, currentUserId }: GoalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("0");
  const [unit, setUnit] = useState("count");
  const [category, setCategory] = useState("revenue");
  const [priority, setPriority] = useState<GoalPriority>("medium");
  const [ownerId, setOwnerId] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description || "");
      setTargetValue(String(goalToEdit.target_value));
      setCurrentValue(String(goalToEdit.current_value));
      setUnit(goalToEdit.unit || "count");
      setCategory(goalToEdit.category || "revenue");
      setPriority((goalToEdit.priority as GoalPriority) || "medium");
      setOwnerId(goalToEdit.owner_id || "");
      setTargetDate(goalToEdit.target_date || "");
    } else {
      setTitle("");
      setDescription("");
      setTargetValue("");
      setCurrentValue("0");
      setUnit("count");
      setCategory("revenue");
      setPriority("medium");
      setOwnerId(currentUserId || "");
      setTargetDate("");
    }
    setError(null);
  }, [goalToEdit, isOpen, currentUserId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const targetNum = Number(targetValue);
    if (isNaN(targetNum) || targetNum <= 0) {
      setError("Target value must be a positive number.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || null,
        target_value: targetNum,
        current_value: Number(currentValue) || 0,
        unit,
        category,
        priority,
        owner_id: ownerId || null,
        target_date: targetDate || null,
      });
      onClose();
    } catch (err: any) {
      setError(toUserMessage(err, "Failed to save goal. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-[15px] font-bold text-foreground">
            {goalToEdit ? "Edit Goal" : "Create New Goal"}
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-[12px] font-semibold text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-foreground">Goal Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Achieve 100 five-star reviews"
              required
              className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-foreground">Description / Why this matters</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain why this goal matters to the business..."
              rows={2}
              className="w-full rounded-xl border border-border bg-secondary/30 p-3 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as GoalPriority)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Target Value *</label>
              <input
                type="number"
                step="any"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="100"
                required
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Current Value</label>
              <input
                type="number"
                step="any"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder="0"
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
              >
                {units.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Owner</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.fullName} ({m.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Deadline</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-[12.5px] font-semibold text-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : goalToEdit ? "Update Goal" : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
