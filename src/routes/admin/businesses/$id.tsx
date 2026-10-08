import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { Building2, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminPageHeader, AdminBadge } from "@/components/admin/AdminShared";
import { fetchBusinessDetail, updateBusinessStatus, updateBusinessSubscriptionPlan, type AdminBusinessDetail } from "@/services/adminBusinesses";
import { fetchBusinessOverrides } from "@/services/adminEntitlements";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/businesses/$id")({
  component: AdminBusinessDetailPage,
});

function AdminBusinessDetailPage() {
  const { id } = useParams({ from: "/admin/businesses/$id" });
  const [business, setBusiness] = useState<AdminBusinessDetail | null>(null);
  const [overrides, setOverrides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "account" | "users" | "subscription" | "features" | "ai" | "activity">("overview");
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(false);
    try {
      const [detail, ov] = await Promise.all([fetchBusinessDetail(id), fetchBusinessOverrides(id)]);
      setBusiness(detail); setOverrides(ov);
    } catch { setError(true); } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!business) return;
    setUpdating(true); setUpdateMsg(null);
    try { await updateBusinessStatus(business.id, newStatus); setUpdateMsg("Status updated successfully."); void load(); }
    catch { setUpdateMsg("Failed to update status."); }
    finally { setUpdating(false); setTimeout(() => setUpdateMsg(null), 3000); }
  };

  const handlePlanChange = async (newPlan: string) => {
    if (!business) return;
    setUpdating(true); setUpdateMsg(null);
    try { await updateBusinessSubscriptionPlan(business.id, newPlan); setUpdateMsg("Subscription plan updated."); void load(); }
    catch { setUpdateMsg("Failed to update plan."); }
    finally { setUpdating(false); setTimeout(() => setUpdateMsg(null), 3000); }
  };

  if (loading) return <div className="grid min-h-[400px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>;
  if (error || !business) return <InsufficientData description="This business could not be loaded." icon={AlertCircle} />;

  const tabs = ["overview", "account", "users", "subscription", "features", "ai", "activity"] as const;

  return (
    <div>
      <Link to="/admin/businesses" className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand"><ArrowLeft className="h-3.5 w-3.5" />All Businesses</Link>
      <AdminPageHeader title={business.name} description={`${business.industry || "Unknown industry"} · ${business.slug || business.id.slice(0, 8)}`} icon={Building2} />

      <div className="mb-4 flex flex-wrap gap-1.5 border-b border-border">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`border-b-2 px-3 py-2 text-[12.5px] font-medium capitalize transition-colors ${activeTab === tab ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {updateMsg && <div className="mb-3 rounded-lg bg-emerald-50 px-4 py-2 text-[12px] font-medium text-emerald-700">{updateMsg}</div>}

      {activeTab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-[14px] font-semibold text-foreground">Business Details</h3>
            <dl className="mt-3 space-y-2 text-[12.5px]">
              <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd><AdminBadge tone={business.status === "active" ? "emerald" : "amber"}>{business.status}</AdminBadge></dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Plan</dt><dd><AdminBadge tone="brand">{business.subscription_plan || "—"}</AdminBadge></dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Active</dt><dd>{business.is_active ? "Yes" : "No"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Members</dt><dd>{business.member_count}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Created</dt><dd>{new Date(business.created_at).toLocaleDateString("en-GB")}</dd></div>
            </dl>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-[14px] font-semibold text-foreground">AI Credit Usage</h3>
            <div className="mt-3 text-[26px] font-bold text-brand">{business.ai_credits_used} <span className="text-[14px] text-muted-foreground">/ {business.ai_credits_allowance}</span></div>
            <div className="mt-2 h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-brand" style={{ width: `${business.ai_credits_allowance > 0 ? Math.min(100, (business.ai_credits_used / business.ai_credits_allowance) * 100) : 0}%` }} /></div>
            <p className="mt-2 text-[11px] text-muted-foreground">Credits used this period</p>
          </div>
        </div>
      )}

      {activeTab === "account" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Account Information</h3>
          <dl className="mt-3 space-y-2 text-[12.5px]">
            <div className="flex justify-between"><dt className="text-muted-foreground">Email</dt><dd>{business.email || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Phone</dt><dd>{business.phone || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Website</dt><dd>{business.website || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Timezone</dt><dd>{business.timezone || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Currency</dt><dd>{business.currency || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Trial Ends</dt><dd>{business.trial_ends_at ? new Date(business.trial_ends_at).toLocaleDateString("en-GB") : "—"}</dd></div>
          </dl>
        </div>
      )}

      {activeTab === "users" && (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border bg-secondary/30"><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Name</th><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Role</th><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Joined</th></tr></thead>
            <tbody className="divide-y divide-border">
              {business.members.map((m) => (
                <tr key={m.id}><td className="px-4 py-3 text-[13px] font-medium text-foreground">{m.full_name || "Unknown"}</td><td className="px-4 py-3"><AdminBadge tone={m.role === "owner" ? "brand" : "default"}>{m.role}</AdminBadge></td><td className="px-4 py-3"><AdminBadge tone={m.status === "active" ? "emerald" : "amber"}>{m.status}</AdminBadge></td><td className="px-4 py-3 text-[11px] text-muted-foreground">{new Date(m.joined_at).toLocaleDateString("en-GB")}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Subscription Management</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">Current Plan</label>
              <div className="mt-1 flex gap-2">
                <select defaultValue={business.subscription_plan || ""} onChange={(e) => void handlePlanChange(e.target.value)} disabled={updating} className="h-9 rounded-lg border border-border bg-card px-3 text-[12.5px] text-foreground focus:outline-none">
                  <option value="Starter">Starter</option>
                  <option value="Growth">Growth</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">Account Status</label>
              <div className="mt-1 flex gap-2">
                <select defaultValue={business.status} onChange={(e) => void handleStatusChange(e.target.value)} disabled={updating} className="h-9 rounded-lg border border-border bg-card px-3 text-[12.5px] text-foreground focus:outline-none">
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-[11px] text-muted-foreground">
              Billing integration (Stripe) is Coming Soon. Plan changes update the business record and are audited. Payment processing is not yet connected.
            </div>
          </div>
        </div>
      )}

      {activeTab === "features" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Feature Overrides</h3>
          {overrides.length > 0 ? (
            <div className="mt-3 space-y-2">{overrides.map((o) => <div key={o.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5"><span className="text-[12.5px] font-medium text-foreground">{o.feature?.display_name || "Unknown"}</span><AdminBadge tone={o.override_type === "enable" ? "emerald" : "red"}>{o.override_type}</AdminBadge></div>)}</div>
          ) : <div className="mt-3"><InsufficientData description="No feature overrides are configured for this business. Plan defaults apply." /></div>}
        </div>
      )}

      {activeTab === "ai" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">AI Credits</h3>
          <div className="mt-3 text-[26px] font-bold text-brand">{business.ai_credits_used} <span className="text-[14px] text-muted-foreground">/ {business.ai_credits_allowance}</span></div>
          <div className="mt-2 h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-brand" style={{ width: `${business.ai_credits_allowance > 0 ? Math.min(100, (business.ai_credits_used / business.ai_credits_allowance) * 100) : 0}%` }} /></div>
          <p className="mt-3 text-[11px] text-muted-foreground">Credit adjustments require the AI credit management console. Visit AI Credits in the sidebar for platform-wide management.</p>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Business Activity</h3>
          <div className="mt-3"><InsufficientData description="Activity history for this business is available in the Security & Audit section. Cross-business activity logging is Coming Soon." /></div>
        </div>
      )}
    </div>
  );
}
