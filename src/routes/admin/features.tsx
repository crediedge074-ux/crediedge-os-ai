import { createFileRoute } from "@tanstack/react-router";
import { Package, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminPageHeader, AdminTable, AdminBadge } from "@/components/admin/AdminShared";
import { fetchFeatures, fetchPlans, fetchPlanEntitlements, togglePlanEntitlement, type FeatureDefinition, type PlatformPlan, type PlanEntitlement } from "@/services/adminEntitlements";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/features")({
  component: AdminFeaturesPage,
});

function AdminFeaturesPage() {
  const [features, setFeatures] = useState<FeatureDefinition[]>([]);
  const [plans, setPlans] = useState<PlatformPlan[]>([]);
  const [entitlements, setEntitlements] = useState<PlanEntitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [f, p, e] = await Promise.all([fetchFeatures(), fetchPlans(), fetchPlanEntitlements()]);
      setFeatures(f); setPlans(p as any); setEntitlements(e);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const handleToggle = async (planId: string, featureId: string, currentEnabled: boolean) => {
    setUpdating(`${planId}-${featureId}`);
    try { await togglePlanEntitlement(planId, featureId, !currentEnabled); void load(); } catch {} finally { setUpdating(null); }
  };

  if (loading) return <div className="grid min-h-[400px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>;

  const isEntitled = (planId: string, featureId: string) => entitlements.some((e) => e.plan_id === planId && e.feature_id === featureId && e.is_enabled);

  return (
    <div>
      <AdminPageHeader title="Feature Entitlements" description="Control which features are available on each plan." icon={Package} />

      <div className="overflow-x-auto">
        <table className="w-full rounded-2xl border border-border bg-card shadow-card">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Feature</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
              {plans.map((plan) => <th key={plan.id} className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{plan.display_name}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {features.map((feature) => (
              <tr key={feature.id} className="hover:bg-secondary/20">
                <td className="px-4 py-3">
                  <div className="text-[13px] font-semibold text-foreground">{feature.display_name}</div>
                  <div className="text-[11px] text-muted-foreground">{feature.description}</div>
                </td>
                <td className="px-4 py-3"><AdminBadge>{feature.category}</AdminBadge></td>
                {plans.map((plan) => {
                  const enabled = isEntitled(plan.id, feature.id);
                  const cellKey = `${plan.id}-${feature.id}`;
                  return (
                    <td key={plan.id} className="px-4 py-3 text-center">
                      <button
                        onClick={() => void handleToggle(plan.id, feature.id, enabled)}
                        disabled={updating === cellKey}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? "bg-brand" : "bg-secondary"} disabled:opacity-50`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-4.5" : "translate-x-1"}`} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg bg-secondary/50 p-4 text-[12px] text-muted-foreground">
        Toggling a feature changes what the plan includes. Per-business overrides can enable or disable features for individual businesses regardless of plan. Changes are audited.
      </div>
    </div>
  );
}
