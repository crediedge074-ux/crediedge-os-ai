import { useState, useEffect } from "react";
import { Mail, Star, FileText, ChartBar as BarChart3, Shield, TriangleAlert as AlertTriangle, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { getNotifications } from "@/services/notifications";
import type { AppNotification } from "@/lib/database.types";

type Tier = "critical" | "important" | "general";

interface FormattedNotification {
  id: string;
  icon: LucideIcon;
  title: string;
  time: string;
  tier: Tier;
  actionUrl: string;
}

const tierConfig: Record<
  Tier,
  { label: string; dot: string; bg: string; textColor: string; iconColor: string }
> = {
  critical: {
    label: "Critical",
    dot: "bg-destructive",
    bg: "bg-destructive/5 border-destructive/10",
    textColor: "text-destructive",
    iconColor: "text-destructive",
  },
  important: {
    label: "Important",
    dot: "bg-warning",
    bg: "bg-warning/5 border-warning/10",
    textColor: "text-foreground",
    iconColor: "text-warning",
  },
  general: {
    label: "Info",
    dot: "bg-muted-foreground/30",
    bg: "bg-transparent border-transparent",
    textColor: "text-foreground",
    iconColor: "text-muted-foreground",
  },
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

function mapNotification(n: AppNotification): FormattedNotification {
  let tier: Tier = "general";
  let icon = FileText;

  if (n.type === "critical" || n.type === "overdue_invoice" || n.type === "urgent") {
    tier = "critical";
    icon = AlertTriangle;
  } else if (n.type === "message" || n.type === "enquiry") {
    tier = "important";
    icon = Mail;
  } else if (n.type === "review") {
    tier = "important";
    icon = Star;
  } else if (n.type === "security" || n.type === "report") {
    tier = "general";
    icon = Shield;
  }

  return {
    id: n.id,
    icon,
    title: `${n.title} — ${n.message}`,
    time: formatRelativeTime(n.created_at),
    tier,
    actionUrl: n.action_url || "/communications",
  };
}

export function Notifications() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [notifications, setNotifications] = useState<FormattedNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    if (!businessId) {
      setLoading(false);
      return;
    }

    getNotifications(businessId)
      .then((raw) => {
        if (mounted) {
          setNotifications(raw.map(mapNotification));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load notifications:", err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [businessId]);

  const criticalCount = notifications.filter((n) => n.tier === "critical").length;

  const grouped: Record<Tier, FormattedNotification[]> = {
    critical: notifications.filter((n) => n.tier === "critical"),
    important: notifications.filter((n) => n.tier === "important"),
    general: notifications.filter((n) => n.tier === "general"),
  };

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <span className="text-[13.5px] font-semibold tracking-tight text-foreground">Notifications</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {notifications.length}
        </span>
        {criticalCount > 0 && (
          <span className="ml-auto flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
            {criticalCount} critical
          </span>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">Loading workspace notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">No notifications for your workspace yet.</div>
      ) : (
        <div className="divide-y divide-border">
          {(["critical", "important", "general"] as Tier[]).map((tier) => {
            const items = grouped[tier];
            if (!items || !items.length) return null;
            const cfg = tierConfig[tier];
            return (
              <div key={tier} className="px-5 py-3.5">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {cfg.label}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {items.map((n) => {
                    const Icon = n.icon;
                    return (
                      <li key={n.id}>
                        <Link
                          to={n.actionUrl}
                          className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 transition-colors duration-150 hover:brightness-95 ${cfg.bg}`}
                        >
                          <Icon
                            className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${cfg.iconColor}`}
                            strokeWidth={1.75}
                          />
                          <div className="min-w-0 flex-1">
                            <div className={`text-[12px] font-medium leading-snug ${cfg.textColor}`}>
                              {n.title}
                            </div>
                          </div>
                          <div className="shrink-0 text-[10px] text-muted-foreground">{n.time}</div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      <div className="border-t border-border px-5 py-3">
        <Link
          to="/communications"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-1.5"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
