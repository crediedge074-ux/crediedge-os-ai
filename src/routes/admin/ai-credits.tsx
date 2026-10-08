import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminPageHeader, AdminKpiCard, AdminTable, AdminBadge } from "@/components/admin/AdminShared";
import { fetchAICreditSummary, type AICreditSummary } from "@/services/adminAICredits";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/ai-credits")({
  component: AdminAICreditsPage,
});

function AdminAICreditsPage() {
  const [summary, setSummary] = useState<AICreditSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAICreditSummary().then(setSummary).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid min-h-[400px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>;
  if (!summary) return <InsufficientData description="AI credit data could not be loaded." icon={AlertCircle} />;

  return (
    <div>
      <AdminPageHeader title="AI Credits" description="Platform-wide AI credit allocation, usage, and management." icon={Sparkles} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <AdminKpiCard label="Total Allowance" value={summary.totalAllowance.toLocaleString()} icon={Sparkles} />
        <AdminKpiCard label="Total Used" value={summary.totalUsed.toLocaleString()} icon={Sparkles} tone="amber" />
        <AdminKpiCard label="Total Remaining" value={summary.totalRemaining.toLocaleString()} icon={Sparkles} tone="emerald" />
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-[14px] font-semibold text-foreground">Usage by Business</h3>
        {summary.byBusiness.length > 0 ? (
          <AdminTable headers={["Business", "Allowance", "Used", "Remaining", "Usage"]}>
            {summary.byBusiness.slice(0, 20).map((b) => (
              <tr key={b.businessId} className="hover:bg-secondary/20">
                <td className="px-4 py-3 text-[13px] font-medium text-foreground">{b.businessName}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{b.allowance}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{b.used}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{b.remaining}</td>
                <td className="px-4 py-3">
                  <div className="h-1.5 w-24 rounded-full bg-secondary"><div className="h-full rounded-full bg-brand" style={{ width: `${b.allowance > 0 ? Math.min(100, (b.used / b.allowance) * 100) : 0}%` }} /></div>
                </td>
              </tr>
            ))}
          </AdminTable>
        ) : <InsufficientData description="No AI credit allocations exist yet." />}
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-[14px] font-semibold text-foreground">Usage by Feature</h3>
        {summary.byFeature.length > 0 ? (
          <AdminTable headers={["Action Type", "Requests", "Credits Consumed"]}>
            {summary.byFeature.map((f) => (
              <tr key={f.actionType} className="hover:bg-secondary/20">
                <td className="px-4 py-3 text-[13px] font-medium text-foreground">{f.actionType}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{f.requestCount}</td>
                <td className="px-4 py-3"><AdminBadge tone="amber">{f.creditsConsumed}</AdminBadge></td>
              </tr>
            ))}
          </AdminTable>
        ) : <InsufficientData description="No AI usage has been recorded yet." />}
      </div>

      <div className="mt-4 rounded-lg bg-secondary/50 p-4 text-[12px] text-muted-foreground">
        Credit adjustments (add, remove, set allowance) are Coming Soon. The existing AI usage system is reused — this is the management layer over it.
      </div>
    </div>
  );
}
