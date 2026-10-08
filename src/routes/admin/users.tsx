import { createFileRoute } from "@tanstack/react-router";
import { Users, Search, Loader2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { AdminPageHeader, AdminTable, AdminBadge } from "@/components/admin/AdminShared";
import { fetchUsers, type AdminUserSummary } from "@/services/adminUsers";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchUsers({ search, role: roleFilter, status: statusFilter, page, pageSize });
      setUsers(result.users); setTotal(result.total);
    } catch { setUsers([]); } finally { setLoading(false); }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => { const timer = setTimeout(() => { setPage(1); void load(); }, 200); return () => clearTimeout(timer); }, [search, roleFilter, statusFilter]);
  useEffect(() => { void load(); }, [page, load]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <AdminPageHeader title="Users" description="Manage all users across the platform." icon={Users} />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-[12.5px] text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-9 rounded-lg border border-border bg-card px-3 text-[12.5px] text-foreground focus:outline-none">
          <option value="all">All Roles</option><option value="owner">Owner</option><option value="staff">Staff</option><option value="manager">Manager</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-border bg-card px-3 text-[12.5px] text-foreground focus:outline-none">
          <option value="all">All Statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="grid min-h-[300px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>
      ) : users.length === 0 ? (
        <InsufficientData description="No users match the current filters." icon={AlertCircle} />
      ) : (
        <>
          <AdminTable headers={["Name", "Role", "Business", "Plan", "Status", "Created"]}>
            {users.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-secondary/30">
                <td className="px-4 py-3 text-[13px] font-semibold text-foreground">{u.full_name || "Unknown"}</td>
                <td className="px-4 py-3"><AdminBadge tone={u.role === "owner" ? "brand" : "default"}>{u.role || "—"}</AdminBadge></td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{u.business_name || "—"}</td>
                <td className="px-4 py-3"><AdminBadge>{u.subscription_plan || "—"}</AdminBadge></td>
                <td className="px-4 py-3"><AdminBadge tone={u.is_active ? "emerald" : "amber"}>{u.is_active ? "Active" : "Inactive"}</AdminBadge></td>
                <td className="px-4 py-3 text-[11px] text-muted-foreground">{new Date(u.created_at).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
          </AdminTable>
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">{total} users</span>
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
