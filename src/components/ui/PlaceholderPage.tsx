import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status?: "coming-soon" | "in-development";
  features?: string[];
}

export function PlaceholderPage({
  icon: Icon,
  title,
  description,
  status = "coming-soon",
  features = [],
}: PlaceholderPageProps) {
  const statusLabel = status === "coming-soon" ? "Coming Soon" : "Module Under Development";
  const statusColor =
    status === "coming-soon"
      ? "bg-brand/10 text-brand"
      : "bg-warning/15 text-warning";

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card shadow-soft">
        <Icon className="h-7 w-7 text-brand" strokeWidth={1.5} />
      </div>

      <span className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${statusColor}`}>
        <Clock className="h-3 w-3" strokeWidth={2} />
        {statusLabel}
      </span>

      <h2 className="text-[22px] font-bold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>

      {features.length > 0 && (
        <div className="mt-7 w-full max-w-xs rounded-xl border border-border bg-card p-5 text-left shadow-soft">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Planned features
          </p>
          <ul className="space-y-2">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[13px] text-foreground">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand/90"
        >
          Return to Command Centre
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          Back
        </button>
      </div>
    </div>
  );
}
