import type { LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function AdminPageHeader({ title, description, icon: Icon }: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="h-5 w-5 text-brand" strokeWidth={1.75} />}
        <h1 className="text-[20px] font-bold tracking-tight text-foreground lg:text-[22px]">{title}</h1>
      </div>
      {description && <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>}
    </div>
  );
}

interface AdminKpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "brand" | "emerald" | "amber";
}

export function AdminKpiCard({ label, value, hint, icon: Icon, tone = "default" }: AdminKpiCardProps) {
  const toneCls =
    tone === "brand" ? "text-brand" :
    tone === "emerald" ? "text-emerald-600" :
    tone === "amber" ? "text-amber-600" :
    "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        {Icon && <Icon className={`h-4 w-4 ${toneCls}`} strokeWidth={1.75} />}
      </div>
      <div className={`mt-2 text-[26px] font-bold ${toneCls}`}>{value}</div>
      {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

interface AdminTableProps {
  headers: string[];
  children: React.ReactNode;
}

export function AdminTable({ headers, children }: AdminTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function AdminBadge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "brand" | "emerald" | "amber" | "red" }) {
  const cls =
    tone === "brand" ? "bg-brand/10 text-brand" :
    tone === "emerald" ? "bg-emerald-50 text-emerald-600" :
    tone === "amber" ? "bg-amber-50 text-amber-600" :
    tone === "red" ? "bg-red-50 text-red-600" :
    "bg-secondary text-muted-foreground";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{children}</span>;
}
