import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Users, Sparkles, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminPageHeader, AdminKpiCard } from "@/components/admin/AdminShared";
import { fetchPlatformOverview, type PlatformOverviewMetrics } from "@/services/adminBusinesses";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/")({
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<PlatformOverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchPlatformOverview()
      .then((data) => { if (mounted) { setMetrics(data); setLoading(false); } })
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
        <AdminKpiCard label="AI Credits Used" value={metrics.aiCreditsUsed.toLocaleString()} icon={Sparkles} tone="amber" />
        <AdminKpiCard label="AI Credits Remaining" value={metrics.aiCreditsRemaining.toLocaleString()} icon={Sparkles} />
        <AdminKpiCard label="Open Enterprise Leads" value={metrics.openEnterpriseLeads} icon={TrendingUp} tone="brand" />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-[14px] font-semibold text-foreground">Recent Signups</h3>
        {metrics.recentSignups.length > 0 ? (
          <div className="mt-3 space-y-2">
            {metrics.recentSignups.map((signup) => (
              <div key={signup.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                <span className="text-[13px] font-medium text-foreground">{signup.name}</span>
                <span className="text-[11px] text-muted-foreground">{new Date(signup.created_at).toLocaleDateString("en-GB")}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3"><InsufficientData description="No recent business signups to display." /></div>
        )}
      </div>

      <div className="mt-4 text-[11px] text-muted-foreground">
        Metrics are calculated from verified workspace data. MRR and revenue figures require a billing provider integration (Coming Soon).
      </div>
    </div>
  );
}
