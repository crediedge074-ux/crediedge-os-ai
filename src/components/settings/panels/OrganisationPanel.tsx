import { toUserMessage } from "@/lib/errors";
import { useState, useEffect, useCallback } from "react";
import { Users, Mail, X, Loader2, UserPlus } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { fetchMembers, fetchInvitations, createInvitation, revokeInvitation, updateMemberRole, type MemberInfo, type BusinessInvitation } from "@/services/invitations";
import { SectionHeader, PanelSkeleton } from "../primitives";
import { EmptyState } from "@/components/ui/EmptyState";

export function OrganisationPanel() {
  const { membership, business, user } = useAuthContext();
  const canManage = membership?.role === "owner" || membership?.role === "admin";
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [invitations, setInvitations] = useState<BusinessInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  const loadData = useCallback(async () => {
    if (!membership?.business_id) return;
    setLoading(true);
    try {
      const [m, inv] = await Promise.all([
        fetchMembers(membership.business_id),
        fetchInvitations(membership.business_id),
      ]);
      setMembers(m);
      setInvitations(inv);
    } catch (err) {
      console.error("[OrganisationPanel] load error:", err);
    } finally {
      setLoading(false);
    }
  }, [membership?.business_id]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <PanelSkeleton />;

  return (
    <div className="space-y-6">
      <SectionHeader title="Organisation" description="Manage your team members, roles and access permissions." />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[13px] font-semibold text-foreground">Team Members{business?.name ? ` — ${business.name}` : ""}</div>
          {canManage && (
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-80"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite Member
            </button>
          )}
        </div>
        {members.length === 0 ? (
          <EmptyState icon={Users} title="No members found" description="Team members will appear here once they join your workspace." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            {members.map((m, i) => (
              <div key={m.membership_id} className={`flex items-center gap-4 px-4 py-3.5 ${i < members.length - 1 ? "border-b border-border" : ""}`}>
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
                  {(m.full_name ?? m.first_name ?? "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-foreground">{m.full_name ?? [m.first_name, m.last_name].filter(Boolean).join(" ") ?? "Unknown"}</div>
                  {m.email && <div className="text-[11.5px] text-muted-foreground">{m.email}</div>}
                </div>
                {canManage && m.user_id !== user?.id ? (
                  <select
                    value={m.role}
                    onChange={async (e) => { await updateMemberRole(membership!.business_id, m.membership_id, e.target.value); loadData(); }}
                    className="rounded-lg border border-border bg-secondary/30 px-2 py-1 text-[12px] text-foreground focus:outline-none"
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="read_only">Read Only</option>
                  </select>
                ) : (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700">
                    {m.role.charAt(0).toUpperCase() + m.role.slice(1).replace("_", " ")}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {invitations.length > 0 && (
        <div>
          <div className="mb-3 text-[13px] font-semibold text-foreground">Pending Invitations</div>
          <div className="overflow-hidden rounded-xl border border-border">
            {invitations.filter((inv) => inv.status === "pending").map((inv, i, arr) => (
              <div key={inv.id} className={`flex items-center gap-4 px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-600">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-foreground">{inv.email}</div>
                  <div className="text-[11.5px] text-muted-foreground">Invited as {inv.role} · Expires {new Date(inv.expires_at).toLocaleDateString("en-GB")}</div>
                </div>
                {canManage && (
                  <button
                    onClick={async () => { await revokeInvitation(membership!.business_id, inv.id); loadData(); }}
                    className="flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-red-600"
                  >
                    <X className="h-3.5 w-3.5" />
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-3 text-[13px] font-semibold text-foreground">Role Permissions</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { role: "Owner", permissions: ["Full access", "Billing", "Manage users", "Delete data", "API keys"] },
            { role: "Admin", permissions: ["All features", "Manage users", "View billing"] },
            { role: "Staff", permissions: ["View data", "Create tasks", "Manage communications"] },
            { role: "Read Only", permissions: ["View reports", "View dashboard"] },
          ].map((r) => (
            <div key={r.role} className="rounded-xl border border-border bg-secondary/20 p-4">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">{r.role}</div>
              <div className="space-y-1">
                {r.permissions.map((p) => (
                  <div key={p} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showInvite && canManage && membership && (
        <InviteModal
          businessId={membership.business_id}
          invitedBy={user?.id ?? null}
          onClose={() => setShowInvite(false)}
          onInvited={loadData}
        />
      )}
    </div>
  );
}

function InviteModal({ businessId, invitedBy, onClose, onInvited }: { businessId: string; invitedBy: string | null; onClose: () => void; onInvited: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInvite = async () => {
    setError(null);
    if (!email.trim()) { setError("Enter an email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address."); return; }
    setSaving(true);
    try {
      const result = await createInvitation(businessId, invitedBy ?? "", email, role);
      if (!result) {
        setError("Could not send the invitation. The email may already be invited.");
      } else {
        setSuccess(true);
        setTimeout(() => { onInvited(); onClose(); }, 1500);
      }
    } catch (err: any) {
      setError(toUserMessage(err, "Could not send the invitation."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[15px] font-semibold text-foreground">Invite Team Member</div>
        {success ? (
          <div className="py-6 text-center">
            <div className="text-[14px] font-semibold text-emerald-600">Invitation sent to {email}</div>
            <p className="mt-1 text-[12px] text-muted-foreground">The invitee will be added to your workspace once they accept.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-muted-foreground">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="colleague@business.co.uk" className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-muted-foreground">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none">
                <option value="admin">Admin — All features, manage users</option>
                <option value="staff">Staff — View data, create tasks</option>
                <option value="read_only">Read Only — View reports only</option>
              </select>
            </div>
            {error && <p className="text-[12px] text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={onClose} className="rounded-lg border border-border bg-secondary px-4 py-2 text-[13px] font-medium text-foreground hover:bg-secondary/70">Cancel</button>
              <button onClick={handleInvite} disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:opacity-80 disabled:opacity-60">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
                {saving ? "Sending…" : "Send Invitation"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
