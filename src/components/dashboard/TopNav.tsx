import { Sparkles, Bell, HelpCircle, ChevronDown, Menu, LogOut, ArrowRight, AlertTriangle, Mail, Star, FileText, Shield, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { signOut } from "@/services/auth";
import { getAllCombinedNotifications, markNotificationRead } from "@/services/notifications";
import type { AppNotification } from "@/lib/database.types";

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

function getNotificationIcon(type: string): LucideIcon {
  if (type === "system_release") return Rocket;
  if (type === "critical" || type === "overdue_invoice" || type === "urgent") return AlertTriangle;
  if (type === "message" || type === "enquiry") return Mail;
  if (type === "review") return Star;
  if (type === "security" || type === "report") return Shield;
  return FileText;
}

export function TopNav() {
  const { profile, membership, user } = useAuthContext();
  const businessId = membership?.business_id;
  const userId = user?.id;
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "User";
  const initials = displayName.charAt(0).toUpperCase();
  const role = membership?.role
    ? membership.role.charAt(0).toUpperCase() + membership.role.slice(1)
    : "Owner";

  useEffect(() => {
    let mounted = true;
    getAllCombinedNotifications(businessId, userId)
      .then((combined) => {
        if (mounted) {
          setNotifications(combined);
        }
      })
      .catch((err) => {
        console.error("Failed to load header notifications:", err);
      });

    return () => {
      mounted = false;
    };
  }, [businessId, userId]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotificationClick = async (notif: AppNotification) => {
    if (!notif.is_read) {
      await markNotificationRead(notif.id, userId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
    }
    setNotifPopoverOpen(false);
    if (notif.action_url) {
      navigate({ to: notif.action_url as any });
    }
  };

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    navigate({ to: "/login" });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-sm sm:px-6">
      <button className="grid h-8 w-8 place-items-center rounded-lg text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground lg:hidden">
        <Menu className="h-4.5 w-4.5" strokeWidth={1.75} />
      </button>

      <div className="mx-auto w-full max-w-lg">
        <div className="relative">
          <Sparkles
            className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand"
            strokeWidth={1.75}
          />
          <input
            type="text"
            placeholder="Ask anything about your business..."
            className="h-[34px] w-full rounded-full border border-border bg-secondary/50 pl-9 pr-4 text-[12.5px] text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-3 focus:ring-foreground/5"
          />
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        {/* Notification Bell Dropdown Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifPopoverOpen(!notifPopoverOpen)}
            title="Notifications"
            className="relative grid h-8 w-8 place-items-center rounded-lg text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground"
          >
            <Bell className="h-[17px] w-[17px]" strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-brand px-0.5 text-[8px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifPopoverOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl z-40">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    No notifications for your workspace yet.
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = getNotificationIcon(n.type);
                    const isSystemRelease = n.type === "system_release";

                    return (
                      <button
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-secondary/50 ${
                          !n.is_read ? (isSystemRelease ? "bg-brand/10 border-l-2 border-l-brand" : "bg-brand/5") : ""
                        }`}
                      >
                        <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg mt-0.5 ${
                          isSystemRelease ? "bg-brand/15 text-brand" : "bg-secondary text-foreground/70"
                        }`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[12px] font-semibold text-foreground truncate">{n.title}</span>
                            {isSystemRelease && (
                              <span className="rounded bg-brand/20 px-1 py-0.2 text-[8.5px] font-bold text-brand uppercase">
                                UPDATE
                              </span>
                            )}
                            {!n.is_read && !isSystemRelease && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
                          </div>
                          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground line-clamp-2">{n.message}</p>
                          <span className="mt-1 block text-[10px] text-muted-foreground/70">{formatRelativeTime(n.created_at)}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="border-t border-border p-2 text-center bg-secondary/20">
                <Link
                  to="/communications"
                  onClick={() => setNotifPopoverOpen(false)}
                  className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand hover:gap-1.5 transition-all"
                >
                  View Communications Hub <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Circular Support Control -> /support */}
        <Link
          to="/support"
          title="Support"
          className="grid h-8 w-8 place-items-center rounded-lg text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground"
        >
          <HelpCircle className="h-[17px] w-[17px]" strokeWidth={1.75} />
        </Link>

        <div className="mx-1.5 h-5 w-px bg-border" />

        {/* Profile dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors duration-150 hover:bg-secondary"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-7 w-7 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                {initials}
              </div>
            )}
            <div className="hidden text-left sm:block">
              <div className="text-[12.5px] font-semibold leading-tight text-foreground">{displayName}</div>
              <div className="text-[10.5px] leading-tight text-muted-foreground">{role}</div>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground" strokeWidth={2} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="border-b border-border px-4 py-3">
                <div className="text-[13px] font-semibold text-foreground">{displayName}</div>
                <div className="mt-0.5 truncate text-[11.5px] text-muted-foreground">{user?.email}</div>
              </div>
              <div className="p-1">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
