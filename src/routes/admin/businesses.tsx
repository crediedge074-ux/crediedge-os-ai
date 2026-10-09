import { createFileRoute } from "@tanstack/react-router";
import { Building2, Search, Loader2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { AdminPageHeader, AdminTable, AdminBadge } from "@/components/admin/AdminShared";
import { fetchBusinesses, type AdminBusinessSummary } from "@/services/adminBusinesses";
import { fetchPlans, type PlatformPlan } from "@/services/adminEntitlements";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/businesses")({
  component: AdminBusinessesPage,
});

function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<AdminBusinessSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [plans, setPlans] = useState<PlatformPlan[]>([]);
  const pageSize = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [result, planData] = await Promise.all([
        fetchBusinesses({ search, status: statusFilter, plan: planFilter, page, pageSize }),
        plans.length === 0 ? fetchPlans() : Promise.resolve(plans),
      ]);
      setBusinesses(result.businesses);
      setTotal(result.total);
      if (planData.length > 0) setPlans(planData);
    } catch { setBusinesses([]); setTotal(0); } finally { setLoading(false); }
  }, [search, statusFilter, planFilter, page, plans]);

  useEffect(() => { const timer = setTimeout(() => { setPage(1); void load(); }, 200); return () => clearTimeout(timer); }, [search, statusFilter, planFilter]);
  useEffect(() => { void load(); }, [page, load]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <AdminPageHeader title="Businesses" description="Manage all businesses on the platform." icon={Building2} />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or slug..." className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-[12.5px] text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-border bg-card px-3 text-[12.5px] text-foreground focus:outline-none">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="h-9 rounded-lg border border-border bg-card px-3 text-[12.5px] text-foreground focus:outline-none">
          <option value="all">All Plans</option>
          {plans.map((p) => <option key={p.id} value={p.name}>{p.display_name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid min-h-[300px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>
      ) : businesses.length === 0 ? (
        <InsufficientData description="No businesses match the current filters." icon={AlertCircle} />
      ) : (
        <>
          <AdminTable headers={["Name", "Plan", "Status", "Members", "AI Credits", "Created"]}>
            {businesses.map((b) => (
              <tr key={b.id} className="transition-colors hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <Link to="/admin/businesses/$id" params={{ id: b.id }} className="text-[13px] font-semibold text-foreground hover:text-brand">
                    {b.name}
                  </Link>
                  {b.owner_name && <div className="text-[11px] text-muted-foreground">{b.owner_name}</div>}
                </td>
                <td className="px-4 py-3"><AdminBadge tone={b.subscription_plan?.toLowerCase() === "enterprise" ? "brand" : "default"}>{b.subscription_plan || "—"}</AdminBadge></td>
                <td className="px-4 py-3"><AdminBadge tone={b.status === "active" ? "emerald" : "amber"}>{b.status}</AdminBadge></td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{b.member_count}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{b.ai_credits_used} / {b.ai_credits_allowance}</td>
                <td className="px-4 py-3 text-[11px] text-muted-foreground">{new Date(b.created_at).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
          </AdminTable>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">{total} businesses</span>
              <div className="flex gap-1">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-border text-foreground disabled:opacity-40 hover:bg-secondary"><ChevronLeft className="h-4 w-4" /></button>
                <span className="grid h-8 place-items-center px-3 text-[12px] font-medium text-foreground">{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-border text-foreground disabled:opacity-40 hover:bg-secondary"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
