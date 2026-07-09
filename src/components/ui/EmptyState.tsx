import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-border bg-secondary text-muted-foreground shadow-soft">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-xs text-[13px] text-muted-foreground">{description}</p>
      {(action || secondaryAction) && (
        <div className="mt-5 flex items-center gap-2.5">
          {secondaryAction && (
            secondaryAction.to ? (
              <Link
                to={secondaryAction.to}
                className="rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-secondary"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-secondary"
              >
                {secondaryAction.label}
              </button>
            )
          )}
          {action && (
            action.to ? (
              <Link
                to={action.to}
                className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand/90"
              >
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand/90"
              >
                {action.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
