import { useState, useEffect } from "react";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  fetchCalculatedPriorities,
  completePriorityItem,
  type DashboardPriorityItem,
  type PriorityLevel,
} from "@/services/priorities";

const priorityConfig: Record<
  PriorityLevel,
  { dot: string; label: string; labelColor: string; bg: string }
> = {
  High: {
    dot: "bg-brand",
    label: "HIGH",
    labelColor: "text-brand bg-brand/10",
    bg: "hover:bg-brand/5",
  },
  Medium: {
    dot: "bg-warning",
    label: "MED",
    labelColor: "text-warning bg-warning/10",
    bg: "hover:bg-warning/5",
  },
  Low: {
    dot: "bg-muted-foreground/40",
    label: "LOW",
    labelColor: "text-muted-foreground bg-secondary",
    bg: "hover:bg-secondary/60",
  },
};

export function Priorities() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [priorities, setPriorities] = useState<DashboardPriorityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingIds, setCompletingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCalculatedPriorities(businessId)
      .then((data) => {
        if (mounted) setPriorities(data);
      })
      .catch((err) => {
        console.error("Failed to load calculated priorities:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [businessId]);

  const handleToggleComplete = async (item: DashboardPriorityItem) => {
    if (!businessId || completingIds[item.id]) return;

    setCompletingIds((prev) => ({ ...prev, [item.id]: true }));

    // Optimistically remove completed priority item immediately
    setPriorities((prev) => prev.filter((p) => p.id !== item.id));

    const success = await completePriorityItem(item, businessId);
    if (!success) {
      // Revert if completion failed
      setPriorities((prev) => [...prev, item].sort((a, b) => b.score - a.score));
    }

    setCompletingIds((prev) => {
      const copy = { ...prev };
      delete copy[item.id];
      return copy;
    });
  };

  const remainingCount = priorities.length;
  const visiblePriorities = priorities.slice(0, 5);

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
          Today's Priorities
        </span>
        {!loading && remainingCount > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
            {remainingCount}
          </span>
        )}
        {!loading && remainingCount === 0 && (
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
            All clear!
          </span>
        )}
      </div>

      {loading ? (
        <div className="p-6 text-center text-xs text-muted-foreground">
          Calculating priorities from real workspace data...
        </div>
      ) : visiblePriorities.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-500/80" strokeWidth={1.5} />
          <div className="text-[13px] font-semibold text-foreground">No urgent priorities</div>
          <div className="mt-1 max-w-xs text-[11.5px] text-muted-foreground">
            All tasks, enquiries, and overdue invoices for your workspace are up to date!
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {visiblePriorities.map((t) => {
            const cfg = priorityConfig[t.priority];
            const isCompleting = !!completingIds[t.id];

            return (
              <li
                key={t.id}
                className={`group flex items-center gap-3 px-4 py-3.5 transition-all duration-150 ${
                  cfg.bg
                } ${isCompleting ? "opacity-40" : ""}`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleComplete(t)}
                  disabled={isCompleting}
                  title="Mark action as completed"
                  className="relative grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] border-border bg-card transition-all duration-200 hover:border-brand/50"
                >
                  {isCompleting && (
                    <span className="h-2 w-2 animate-spin rounded-full border border-brand border-t-transparent" />
                  )}
                </button>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-medium leading-snug text-foreground">
                    {t.title}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-[10.5px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" strokeWidth={1.75} />
                      {t.timeEstimate}
                    </span>
                    <span className="text-muted-foreground/30">·</span>
                    <span
                      className={`text-[10.5px] font-bold ${
                        t.impactType === "currency" ? "text-brand" : "text-warning"
                      }`}
                    >
                      {t.impact}
                    </span>
                  </div>
                </div>

                {/* Priority badge */}
                <span
                  className={`hidden shrink-0 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold sm:block ${cfg.labelColor}`}
                >
                  {cfg.label}
                </span>

                {/* Action button */}
                <Link
                  to={t.to}
                  className="shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-foreground/20 hover:bg-foreground hover:text-background"
                >
                  {t.cta}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <div className="text-[11px] text-muted-foreground">
          AI-sorted by business impact
        </div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-1.5"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
