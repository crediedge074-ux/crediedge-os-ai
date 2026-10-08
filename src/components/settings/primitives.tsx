import type { LucideIcon } from "lucide-react";
import { CircleCheck as CheckCircle2 } from "lucide-react";

export type Feedback = "saved" | "error" | null;

export function SettingsRow({ label, description, action }: { label: string; description?: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/20 px-4 py-3.5">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-foreground">{label}</div>
        {description && <div className="mt-0.5 text-[12px] text-muted-foreground">{description}</div>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

export function ActionButton({ label, variant = "secondary", onClick, loading }: { label: string; variant?: "secondary" | "brand" | "danger"; onClick?: () => void; loading?: boolean }) {
  const cls =
    variant === "brand" ? "bg-brand text-white hover:opacity-80" :
    variant === "danger" ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100" :
    "border border-border bg-card text-foreground hover:bg-secondary";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick || loading}
      title={!onClick ? "Coming soon" : undefined}
      className={`rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors ${cls} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? "…" : label}{!onClick && <span className="ml-1 text-[10px] font-normal opacity-70">(Coming soon)</span>}
    </button>
  );
}

export function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5 border-b border-border pb-4">
      <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
      <p className="mt-0.5 text-[12.5px] text-muted-foreground">{description}</p>
    </div>
  );
}

export function FormField({
  label, value, onChange, defaultValue, type = "text", hint,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  defaultValue?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        defaultValue={value === undefined ? defaultValue : undefined}
        className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/20 focus:bg-card focus:outline-none"
      />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SaveBar({ onSave, saving, feedback }: { onSave?: () => void; saving?: boolean; feedback?: Feedback }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {feedback === "saved" && (
        <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
          Saved
        </span>
      )}
      {feedback === "error" && (
        <span className="text-[12.5px] font-medium text-red-600">Failed to save. Try again.</span>
      )}
      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-80 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

export function PanelSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-secondary" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-secondary" />
        ))}
      </div>
    </div>
  );
}

export interface BusinessHour {
  day: string;
  open: boolean;
  from: string;
  to: string;
}

export const DEFAULT_BUSINESS_HOURS: BusinessHour[] = [
  { day: "Monday", open: true, from: "08:00", to: "18:00" },
  { day: "Tuesday", open: true, from: "08:00", to: "18:00" },
  { day: "Wednesday", open: true, from: "08:00", to: "18:00" },
  { day: "Thursday", open: true, from: "08:00", to: "18:00" },
  { day: "Friday", open: true, from: "08:00", to: "17:00" },
  { day: "Saturday", open: true, from: "09:00", to: "14:00" },
  { day: "Sunday", open: false, from: "09:00", to: "17:00" },
];
