import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Loader2, AlertCircle, Pencil, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminPageHeader, AdminBadge } from "@/components/admin/AdminShared";
import { fetchPlans, updatePlan, fetchPlanCounts, type PlatformPlan } from "@/services/adminEntitlements";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/subscriptions")({
  component: AdminSubscriptionsPage,
});

function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<PlatformPlan[]>([]);
  const [planCounts, setPlanCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PlatformPlan>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([fetchPlans(), fetchPlanCounts()]);
      setPlans(p);
      setPlanCounts(c);
    } catch {
      setError("Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const startEdit = (plan: PlatformPlan) => {
    setEditingId(plan.id);
    setEditForm({
      display_name: plan.display_name,
      monthly_price_gbp: plan.monthly_price_gbp,
      annual_price_gbp: plan.annual_price_gbp,
      ai_credit_allowance: plan.ai_credit_allowance,
      max_users: plan.max_users,
      description: plan.description,
    });
    setError(null);
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async (planId: string) => {
    setSaving(true); setError(null);
    try {
      await updatePlan(planId, {
        display_name: editForm.display_name,
        monthly_price_gbp: Number(editForm.monthly_price_gbp),
        annual_price_gbp: Number(editForm.annual_price_gbp),
        ai_credit_allowance: Number(editForm.ai_credit_allowance),
        max_users: editForm.max_users ? Number(editForm.max_users) : null,
        description: editForm.description || null,
      });
      setEditingId(null); setEditForm({});
      void load();
    } catch {
      setError("Failed to save plan changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="grid min-h-[400px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>;
  if (plans.length === 0) return <InsufficientData description="No subscription plans have been defined yet." icon={AlertCircle} />;

  return (
    <div>
      <AdminPageHeader title="Subscriptions" description="View and manage subscription plans across the platform." icon={CreditCard} />

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-[12px] font-medium text-red-700">{error}</div>}

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const isEditing = editingId === plan.id;
          const count = planCounts[plan.name.toLowerCase()] || 0;
          return (
            <div key={plan.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <input value={editForm.display_name || ""} onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })} className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[14px] font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20" />
                ) : (
                  <h3 className="text-[15px] font-bold text-foreground">{plan.display_name}</h3>
                )}
                <div className="flex items-center gap-1.5">
                  {plan.is_enterprise && <AdminBadge tone="brand">Enterprise</AdminBadge>}
                  {isEditing ? (
                    <>
                      <button onClick={() => void saveEdit(plan.id)} disabled={saving} className="grid h-7 w-7 place-items-center rounded-lg border border-border text-emerald-600 hover:bg-emerald-50 disabled:opacity-40"><Check className="h-3.5 w-3.5" /></button>
                      <button onClick={cancelEdit} className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"><X className="h-3.5 w-3.5" /></button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(plan)} className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <textarea value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" className="mt-2 h-16 w-full rounded-lg border border-border bg-card px-2 py-1.5 text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20" />
              ) : (
                <p className="mt-1 text-[12px] text-muted-foreground">{plan.description}</p>
              )}

              <div className="mt-3 flex items-baseline gap-1">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <span className="text-[16px] font-semibold text-muted-foreground">£</span>
                    <input type="number" value={editForm.monthly_price_gbp ?? 0} onChange={(e) => setEditForm({ ...editForm, monthly_price_gbp: Number(e.target.value) })} className="h-8 w-20 rounded-lg border border-border bg-card px-2 text-[18px] font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20" />
                    <span className="text-[13px] text-muted-foreground">/mo</span>
                  </div>
                ) : (
                  <span className="text-[24px] font-bold text-foreground">£{plan.monthly_price_gbp}<span className="text-[13px] font-normal text-muted-foreground">/mo</span></span>
                )}
              </div>

              <dl className="mt-3 space-y-1.5 text-[12px]">
                <div className="flex justify-between"><dt className="text-muted-foreground">Businesses</dt><dd className="font-semibold text-foreground">{count}</dd></div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">AI Credits</dt>
                  {isEditing ? <input type="number" value={editForm.ai_credit_allowance ?? 0} onChange={(e) => setEditForm({ ...editForm, ai_credit_allowance: Number(e.target.value) })} className="h-7 w-20 rounded border border-border bg-card px-2 text-[12px] font-semibold text-foreground focus:outline-none" /> : <dd className="font-semibold text-foreground">{plan.ai_credit_allowance}</dd>}
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Max Users</dt>
                  {isEditing ? <input type="number" value={editForm.max_users ?? ""} onChange={(e) => setEditForm({ ...editForm, max_users: e.target.value ? Number(e.target.value) : null })} placeholder="Unlimited" className="h-7 w-20 rounded border border-border bg-card px-2 text-[12px] font-semibold text-foreground focus:outline-none" /> : <dd className="font-semibold text-foreground">{plan.max_users || "Unlimited"}</dd>}
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Annual (£)</dt>
                  {isEditing ? <input type="number" value={editForm.annual_price_gbp ?? 0} onChange={(e) => setEditForm({ ...editForm, annual_price_gbp: Number(e.target.value) })} className="h-7 w-20 rounded border border-border bg-card px-2 text-[12px] font-semibold text-foreground focus:outline-none" /> : <dd className="font-semibold text-foreground">£{plan.annual_price_gbp}</dd>}
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg bg-secondary/50 p-4 text-[12px] text-muted-foreground">
        Per-business subscription changes (upgrade, downgrade, suspend, reactivate) are managed from the Business Detail view. Billing provider integration (Stripe) is Coming Soon — payment processing is not yet connected.
      </div>
    </div>
  );
}
