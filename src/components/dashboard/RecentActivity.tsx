import { useState, useEffect } from "react";
import {
  MessageSquare,
  CircleDollarSign,
  Star,
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle2,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { getActivityLogs } from "@/services/activity";
import type { ActivityLog } from "@/lib/database.types";

type ActivityType = "enquiry" | "payment" | "review" | "alert" | "task" | "customer";

interface FormattedActivity {
  id: string;
  icon: LucideIcon;
  title: string;
  detail?: string;
  time: string;
  type: ActivityType;
  action?: { label: string; to: string };
}

const typeStyle: Record<ActivityType, string> = {
  enquiry: "bg-blue-50 text-blue-600",
  payment: "bg-emerald-50 text-emerald-600",
  review: "bg-brand/10 text-brand",
  alert: "bg-amber-50 text-amber-600",
  task: "bg-secondary text-foreground/60",
  customer: "bg-purple-50 text-purple-600",
};

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function mapActivityLog(log: ActivityLog): FormattedActivity {
  let type: ActivityType = "task";
  let icon = CheckCircle2;
  let action: FormattedActivity["action"] = undefined;

  if (log.entity_type === "payment") {
    type = "payment";
    icon = CircleDollarSign;
    action = { label: "View", to: "/finance" };
  } else if (log.entity_type === "customer") {
    type = "customer";
    icon = UserPlus;
    action = { label: "View", to: "/relationships" };
  } else if (log.entity_type === "communication" || log.entity_type === "enquiry") {
    type = "enquiry";
    icon = MessageSquare;
    action = { label: "Reply", to: "/communications" };
  } else if (log.entity_type === "review") {
    type = "review";
    icon = Star;
    action = { label: "View", to: "/reviews" };
  } else if (log.entity_type === "alert") {
    type = "alert";
    icon = AlertTriangle;
    action = { label: "Fix", to: "/website" };
  }

  return {
    id: log.id,
    icon,
    title: log.description,
    time: formatRelativeTime(log.created_at),
    type,
    action,
  };
}

export function RecentActivity() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [activities, setActivities] = useState<FormattedActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    if (!businessId) {
      setLoading(false);
      return;
    }

    getActivityLogs(businessId)
      .then((raw) => {
        if (mounted) {
          setActivities(raw.map(mapActivityLog));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load activity logs:", err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [businessId]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Recent Activity</span>
        <Link
          to="/intelligence"
          className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand transition-all duration-200 hover:gap-1.5"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">Loading recent workspace activity...</div>
      ) : activities.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">No recent activity recorded for your workspace yet.</div>
      ) : (
        <ul className="flex-1 divide-y divide-border">
          {activities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className="group flex items-start gap-3 px-5 py-3.5 transition-colors duration-150 hover:bg-secondary/40"
              >
                <div className="relative flex flex-col items-center">
                  <div className={`grid h-8 w-8 place-items-center rounded-xl ${typeStyle[item.type]}`}>
                    <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} />
                  </div>
                  {idx < activities.length - 1 && (
                    <div className="mt-1 h-[calc(100%-2rem)] w-px bg-border" />
                  )}
                </div>

                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[12.5px] font-medium text-foreground">{item.title}</div>
                      {item.detail && (
                        <div className="mt-0.5 text-[12px] font-bold text-foreground">{item.detail}</div>
                      )}
                      <div className="mt-0.5 text-[10.5px] text-muted-foreground">{item.time}</div>
                    </div>
                    {item.action && (
                      <Link
                        to={item.action.to}
                        className="shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-foreground/20 hover:bg-foreground hover:text-background"
                      >
                        {item.action.label}
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
