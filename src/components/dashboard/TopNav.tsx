import { Sparkles, Bell, HelpCircle, ChevronDown, Menu, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { signOut } from "@/services/auth";
import { getNotifications } from "@/services/notifications";

export function TopNav() {
  const { profile, membership, user } = useAuthContext();
  const businessId = membership?.business_id;
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "User";
  const initials = displayName.charAt(0).toUpperCase();
  const role = membership?.role
    ? membership.role.charAt(0).toUpperCase() + membership.role.slice(1)
    : "Owner";

  useEffect(() => {
    let mounted = true;
    if (businessId) {
      getNotifications(businessId)
        .then((raw) => {
          if (mounted) {
            const unread = raw.filter((n) => !n.is_read).length;
            setUnreadCount(unread);
          }
        })
        .catch((err) => {
          console.error("Failed to load header notification count:", err);
        });
    }
    return () => {
      mounted = false;
    };
  }, [businessId]);

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
        {/* Functional Bell Notification Button */}
        <Link
          to="/communications"
          title="View Notifications"
          className="relative grid h-8 w-8 place-items-center rounded-lg text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground"
        >
          <Bell className="h-[17px] w-[17px]" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-brand px-0.5 text-[8px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Circular Control: System Help & Support */}
        <Link
          to="/advisor"
          title="Help & System Support"
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
