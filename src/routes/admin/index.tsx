import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Users, Sparkles, TrendingUp, AlertCircle, Loader2, CircleDashed } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminPageHeader, AdminKpiCard } from "@/components/admin/AdminShared";
import { fetchPlatformOverview, type PlatformOverviewMetrics } from "@/services/adminBusinesses";
import { listAuthUsers, type AuthUser } from "@/services/adminAuth";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/")({
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<PlatformOverviewMetrics | null>(null);
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchPlatformOverview(),
      listAuthUsers(1, 50),
    ])
      .then(([data, authResult]) => {
        if (!mounted) return;
        setMetrics(data);
        setAuthUsers(authResult.users);
        setLoading(false);
      })
      .catch(() => { if (mounted) { setError(true); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="grid min-h-[400px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>;
  if (error || !metrics) return <InsufficientData description="Platform metrics could not be loaded from the database." icon={AlertCircle} />;

  return (
    <div>
      <AdminPageHeader title="Platform Overview" description="How is the CrediEdgeOS platform performing?" icon={LayoutDashboard} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AdminKpiCard label="Total Businesses" value={metrics.totalBusinesses} icon={Building2} />
        <AdminKpiCard label="Active Businesses" value={metrics.activeBusinesses} icon={Building2} tone="emerald" />
        <AdminKpiCard label="Enterprise Businesses" value={metrics.enterpriseBusinesses} icon={Building2} tone="brand" />
        <AdminKpiCard label="Total Users" value={metrics.totalUsers} icon={Users} />
        <AdminKpiCard label="Active Users" value={metrics.activeUsers} icon={Users} tone="emerald" />
        <AdminKpiCard label="Open Enterprise Leads" value={metrics.openEnterpriseLeads} icon={TrendingUp} tone="brand" />
      </div>

      {/* AI Credits — honest unavailable state */}
      <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <CircleDashed className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" strokeWidth={1.5} />
          <div>
            <div className="text-[13px] font-semibold text-foreground">AI Credits — Not Available</div>
            <p className="mt-1 max-w-lg text-[12px] text-muted-foreground">
              Platform-wide AI credit totals are not displayed because the current credit allocation and consumption architecture does not provide trustworthy aggregate figures. The platform owner has unlimited AI capacity. Per-business credit allocation, usage by feature, and credit adjustments will be available here once the credit management system is fully connected.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Signups — real auth users */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-[14px] font-semibold text-foreground">Recent Signups</h3>
        {authUsers.length > 0 ? (
          <div className="mt-3 space-y-2">
            {authUsers.slice(0, 10).map((user) => {
              const profile = metrics.recentSignups.find((s) => s.id === user.id);
              return (
                <div key={user.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-foreground">{profile?.name || user.email}</div>
                    <div className="text-[11px] text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {user.last_sign_in_at ? (
                      <span className="text-[11px] text-emerald-600">Signed in</span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Never signed in</span>
                    )}
                    <span className="text-[11px] text-muted-foreground">{new Date(user.created_at).toLocaleDateString("en-GB")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-3"><InsufficientData description="No authenticated users found." /></div>
        )}
      </div>

      <div className="mt-4 text-[11px] text-muted-foreground">
        Metrics are calculated from verified database records. MRR and revenue figures require a billing provider integration (Coming Soon).
      </div>
    </div>
  );
}
