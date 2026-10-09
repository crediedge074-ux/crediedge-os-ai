import { createFileRoute } from "@tanstack/react-router";
import { Users, Search, Loader2, ChevronLeft, ChevronRight, AlertCircle, KeyRound, UserCheck, UserX, UserPlus } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { AdminPageHeader, AdminTable, AdminBadge } from "@/components/admin/AdminShared";
import { fetchUsers, type AdminUserSummary } from "@/services/adminUsers";
import { listAuthUsers, deactivateUser, activateUser, sendPasswordReset, inviteUser, type AuthUser } from "@/services/adminAuth";
import { logAdminEvent } from "@/services/adminAccess";
import { useAuthContext } from "@/contexts/AuthContext";
import { InsufficientData } from "@/components/ui/InsufficientData";
import { toUserMessage } from "@/lib/errors";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { user: currentUser } = useAuthContext();
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [authUsers, setAuthUsers] = useState<Map<string, AuthUser>>(new Map());
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const pageSize = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [result, authResult] = await Promise.all([
        fetchUsers({ search, role: roleFilter, status: statusFilter, page, pageSize }),
        listAuthUsers(1, 1000),
      ]);
      setUsers(result.users);
      setTotal(result.total);
      const map = new Map<string, AuthUser>();
      for (const u of authResult.users) map.set(u.id, u);
      setAuthUsers(map);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => { const timer = setTimeout(() => { setPage(1); void load(); }, 200); return () => clearTimeout(timer); }, [search, roleFilter, statusFilter]);
  useEffect(() => { void load(); }, [page, load]);

  const totalPages = Math.ceil(total / pageSize);

  const handleDeactivate = async (userId: string, email: string) => {
    if (userId === currentUser?.id) { setActionMsg({ type: "error", text: "Cannot deactivate your own account." }); return; }
    setActionLoading(userId);
    setActionMsg(null);
    try {
      const result = await deactivateUser(userId);
      if (!result.success) throw new Error(result.error || "Failed");
      await logAdminEvent({ action: "user_deactivated", targetType: "user", targetId: userId, targetLabel: email });
      setActionMsg({ type: "success", text: `Deactivated ${email}` });
      void load();
    } catch (err) {
      setActionMsg({ type: "error", text: toUserMessage(err, "We could not deactivate this user. Please try again.") });
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionMsg(null), 3000);
    }
  };

  const handleActivate = async (userId: string, email: string) => {
    setActionLoading(userId);
    setActionMsg(null);
    try {
      const result = await activateUser(userId);
      if (!result.success) throw new Error(result.error || "Failed");
      await logAdminEvent({ action: "user_activated", targetType: "user", targetId: userId, targetLabel: email });
      setActionMsg({ type: "success", text: `Activated ${email}` });
      void load();
    } catch (err) {
      setActionMsg({ type: "error", text: toUserMessage(err, "We could not reactivate this user. Please try again.") });
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionMsg(null), 3000);
    }
  };

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    setActionLoading("invite");
    setActionMsg(null);
    try {
      const result = await inviteUser(inviteEmail, inviteName);
      if (!result.success) throw new Error(result.error || "Failed");
      setInviteEmail("");
      setInviteName("");
      setInviteOpen(false);
      setActionMsg({ type: "success", text: `Invitation sent to ${inviteEmail}` });
      void load();
    } catch (err) {
      setActionMsg({ type: "error", text: toUserMessage(err, "We could not invite this user. Please try again.") });
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionMsg(null), 3000);
    }
  };

  const handlePasswordReset = async (email: string) => {
    setActionLoading(email);
    setActionMsg(null);
    try {
      const result = await sendPasswordReset(email);
      if (!result.success) throw new Error(result.error || "Failed");
      await logAdminEvent({ action: "password_reset_sent", targetType: "user", targetLabel: email });
      setActionMsg({ type: "success", text: `Password reset email sent to ${email}` });
    } catch (err) {
      setActionMsg({ type: "error", text: toUserMessage(err, "We could not send the password reset email. Please try again.") });
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionMsg(null), 3000);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <AdminPageHeader title="Users" description="Manage all users across the platform." icon={Users} />
        <button onClick={() => setInviteOpen((open) => !open)} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-3 py-2 text-[12px] font-semibold text-white hover:opacity-90">
          <UserPlus className="h-3.5 w-3.5" /> Invite User
        </button>
      </div>

      {inviteOpen && (
        <form onSubmit={(event) => void handleInvite(event)} className="mb-4 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-card sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="text-[12px] font-medium text-muted-foreground">Name<input value={inviteName} onChange={(event) => setInviteName(event.target.value)} className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-3 text-[12.5px] text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20" placeholder="Optional" /></label>
          <label className="text-[12px] font-medium text-muted-foreground">Email<input required type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-3 text-[12.5px] text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20" placeholder="user@example.com" /></label>
          <button type="submit" disabled={actionLoading === "invite"} className="h-9 rounded-lg bg-foreground px-4 text-[12px] font-semibold text-background disabled:opacity-50">{actionLoading === "invite" ? "Sending…" : "Send Invite"}</button>
        </form>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-[12.5px] text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-9 rounded-lg border border-border bg-card px-3 text-[12.5px] text-foreground focus:outline-none">
          <option value="all">All Roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="read_only">Read Only</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-border bg-card px-3 text-[12.5px] text-foreground focus:outline-none">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {actionMsg && (
        <div className={`mb-3 rounded-lg px-4 py-2.5 text-[12px] font-medium ${actionMsg.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {actionMsg.text}
        </div>
      )}

      {loading ? (
        <div className="grid min-h-[300px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>
      ) : users.length === 0 ? (
        <InsufficientData description="No users match the current filters." icon={AlertCircle} />
      ) : (
        <>
          <AdminTable headers={["Name", "Email", "Role", "Business", "Plan", "Last Sign-In", "Status", "Actions"]}>
            {users.map((u) => {
              const authUser = authUsers.get(u.id);
              const isBanned = authUser ? !authUser.last_sign_in_at && authUser.email_confirmed_at === null : false;
              return (
                <tr key={u.id} className="transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-3 text-[13px] font-semibold text-foreground">{u.full_name || "Unknown"}</td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">{authUser?.email || "—"}</td>
                  <td className="px-4 py-3"><AdminBadge tone={u.role === "owner" ? "brand" : "default"}>{u.role || "—"}</AdminBadge></td>
                  <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{u.business_name || "—"}</td>
                  <td className="px-4 py-3"><AdminBadge>{u.subscription_plan || "—"}</AdminBadge></td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground">
                    {authUser?.last_sign_in_at ? new Date(authUser.last_sign_in_at).toLocaleDateString("en-GB") : "Never"}
                  </td>
                  <td className="px-4 py-3"><AdminBadge tone={u.is_active ? "emerald" : "amber"}>{u.is_active ? "Active" : "Inactive"}</AdminBadge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => authUser && void handlePasswordReset(authUser.email)}
                        disabled={actionLoading === authUser?.email || !authUser}
                        title="Send password reset"
                        className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-40"
                      >
                        {actionLoading === authUser?.email ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
                      </button>
                      {u.is_active ? (
                        <button
                          onClick={() => authUser && void handleDeactivate(u.id, authUser.email)}
                          disabled={actionLoading === u.id || u.id === currentUser?.id}
                          title="Deactivate user"
                          className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-red-600 disabled:opacity-40"
                        >
                          <UserX className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => authUser && void handleActivate(u.id, authUser.email)}
                          disabled={actionLoading === u.id}
                          title="Activate user"
                          className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-emerald-600 disabled:opacity-40"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
