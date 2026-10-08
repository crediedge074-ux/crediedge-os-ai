import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminPageHeader, AdminTable, AdminBadge } from "@/components/admin/AdminShared";
import { fetchPlans, type PlatformPlan } from "@/services/adminEntitlements";
import { fetchBusinesses as fetchBiz, type AdminBusinessSummary } from "@/services/adminBusinesses";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/subscriptions")({
  component: AdminSubscriptionsPage,
});

function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<PlatformPlan[]>([]);
  const [businesses, setBusinesses] = useState<AdminBusinessSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPlans(), fetchBiz({ pageSize: 100 })])
      .then(([p, b]) => { setPlans(p as any); setBusinesses(b.businesses); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid min-h-[400px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>;

  const planCounts = plans.map((plan) => ({
    ...plan,
    count: businesses.filter((b) => (b.subscription_plan || "").toLowerCase() === plan.name.toLowerCase()).length,
  }));

  return (
    <div>
      <AdminPageHeader title="Subscriptions" description="View and manage subscription plans across the platform." icon={CreditCard} />

      <div className="grid gap-4 lg:grid-cols-3">
        {planCounts.map((plan) => (
          <div key={plan.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-foreground">{plan.display_name}</h3>
              {plan.is_enterprise && <AdminBadge tone="brand">Enterprise</AdminBadge>}
            </div>
            <p className="mt-1 text-[12px] text-muted-foreground">{plan.description}</p>
            <div className="mt-3 text-[24px] font-bold text-foreground">£{plan.monthly_price_gbp}<span className="text-[13px] font-normal text-muted-foreground">/mo</span></div>
            <dl className="mt-3 space-y-1.5 text-[12px]">
              <div className="flex justify-between"><dt className="text-muted-foreground">Businesses</dt><dd className="font-semibold text-foreground">{plan.count}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">AI Credits</dt><dd className="font-semibold text-foreground">{plan.ai_credit_allowance}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Max Users</dt><dd className="font-semibold text-foreground">{plan.max_users || "Unlimited"}</dd></div>
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-secondary/50 p-4 text-[12px] text-muted-foreground">
        Subscription changes (upgrade, downgrade, suspend, reactivate) are managed per-business from the Business Detail view.
        Billing provider integration (Stripe) is Coming Soon — payment processing is not yet connected.
      </div>
    </div>
  );
}
