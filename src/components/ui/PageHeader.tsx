import { Link } from "@tanstack/react-router";
import { ChevronRight, Hop as Home } from "lucide-react";

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  action?: {
    label: string;
    icon?: React.ElementType;
    onClick?: () => void;
    to?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    to?: string;
  };
  badge?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  crumbs = [],
  action,
  secondaryAction,
  badge,
  children,
}: PageHeaderProps) {
  const ActionIcon = action?.icon;

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav className="mb-3 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 transition-colors hover:text-foreground">
          <Home className="h-3 w-3" strokeWidth={1.75} />
          Command Centre
        </Link>
        {crumbs.map((c) => (
          <span key={c.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 shrink-0" strokeWidth={2} />
            {c.to ? (
              <Link to={c.to} className="transition-colors hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span className="text-foreground">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Title row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-foreground lg:text-[24px]">
              {title}
            </h1>
            {badge && (
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 max-w-xl text-[13px] text-muted-foreground">{description}</p>
          )}
        </div>

        {(action || secondaryAction || children) && (
          <div className="flex shrink-0 items-center gap-2">
            {children}
            {secondaryAction && (
              secondaryAction.to ? (
                <Link
                  to={secondaryAction.to}
                  className="rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-secondary"
                >
                  {secondaryAction.label}
                </Link>
              ) : (
                <button
                  onClick={secondaryAction.onClick}
                  className="rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-secondary"
                >
                  {secondaryAction.label}
                </button>
              )
            )}
            {action && (
              action.to ? (
                <Link
                  to={action.to}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand/90 hover:shadow"
                >
                  {ActionIcon && <ActionIcon className="h-3.5 w-3.5" strokeWidth={2} />}
                  {action.label}
                </Link>
              ) : (
                <button
                  onClick={action.onClick}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand/90 hover:shadow"
                >
                  {ActionIcon && <ActionIcon className="h-3.5 w-3.5" strokeWidth={2} />}
                  {action.label}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
