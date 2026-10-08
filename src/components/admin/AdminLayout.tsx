import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, Users, CreditCard, Package, Sparkles,
  Receipt, ShieldAlert, Settings, ArrowLeft, LogOut, Loader2,
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getAdminAccessStatus, type AdminAccessStatus } from "@/services/adminAccess";
import { signOut } from "@/services/auth";
import { InsufficientData } from "@/components/ui/InsufficientData";

interface AdminNavItem {
  label: string;
  icon: typeof LayoutDashboard;
  to: string;
}

const navItems: AdminNavItem[] = [
  { label: "Overview", icon: LayoutDashboard, to: "/admin" },
  { label: "Businesses", icon: Building2, to: "/admin/businesses" },
  { label: "Users", icon: Users, to: "/admin/users" },
  { label: "Subscriptions", icon: CreditCard, to: "/admin/subscriptions" },
  { label: "Features", icon: Package, to: "/admin/features" },
  { label: "AI Credits", icon: Sparkles, to: "/admin/ai-credits" },
  { label: "Billing & Pricing", icon: Receipt, to: "/admin/billing" },
  { label: "Security & Audit", icon: ShieldAlert, to: "/admin/security" },
  { label: "Enterprise Settings", icon: Settings, to: "/admin/settings" },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, profile, business } = useAuthContext();
  const navigate = useNavigate();
  const [access, setAccess] = useState<AdminAccessStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAdminAccessStatus(business?.id).then((result) => {
      if (mounted) {
        setAccess(result);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [business?.id]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-7 w-7 animate-spin text-brand" />
      </div>
    );
  }

  if (!access?.canAccessAdminConsole) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6">
        <div className="max-w-md rounded-2xl border border-border bg-card p-6 shadow-card">
          <ShieldAlert className="h-6 w-6 text-brand" />
          <h2 className="mt-3 text-[16px] font-bold text-foreground">Access Restricted</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            The Admin Console is restricted to platform administrators. Your account does not have platform-level access.
          </p>
          <Link to="/" className="mt-4 inline-flex items-center gap-2 text-[12.5px] font-semibold text-brand">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to CrediEdgeOS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Admin Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-60 flex-col border-r border-border bg-card xl:w-64">
        {/* Logo + Admin label */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <img src="/CE_OS_LOGO.png" alt="CrediEdgeOS" className="h-8 w-auto max-w-[140px] object-contain" />
        </div>
        <div className="border-b border-border px-4 py-2.5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand">Admin Console</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            {access.isPlatformOwner ? "Platform Owner" : "Platform Admin"}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to as "/admin"}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-brand/10 data-[status=active]:text-brand data-[status=active]:font-semibold"
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <div className="mb-2 rounded-lg bg-secondary/50 px-3 py-2">
            <div className="truncate text-[11.5px] font-semibold text-foreground">{profile?.full_name || user?.email}</div>
            <div className="truncate text-[10px] text-muted-foreground">{user?.email}</div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to CrediEdgeOS
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-60 xl:pl-64">
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 xl:px-8">{children}</main>
      </div>
    </div>
  );
}
