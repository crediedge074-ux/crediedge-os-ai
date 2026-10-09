import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, Loader2, Search, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { AdminPageHeader, AdminTable, AdminBadge } from "@/components/admin/AdminShared";
import { fetchAuditEvents, type AdminAuditEvent } from "@/services/adminAudit";
import { fetchEnterpriseLeads, updateLeadStatus, type EnterpriseLead } from "@/services/adminLeads";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/security")({
  component: AdminSecurityPage,
});

function AdminSecurityPage() {
  const [events, setEvents] = useState<AdminAuditEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState<EnterpriseLead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 25;

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [audit, l] = await Promise.all([fetchAuditEvents({ search, page, pageSize }), fetchEnterpriseLeads()]);
      setEvents(audit.events); setTotal(audit.total); setLeads(l);
    } catch { setError("Failed to load audit data. You may not have permission or the request failed."); setEvents([]); setLeads([]); } finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { const timer = setTimeout(() => { setPage(1); void load(); }, 200); return () => clearTimeout(timer); }, [search]);
  useEffect(() => { void load(); }, [page, load]);

  const handleLeadStatus = async (leadId: string, status: string) => {
    try { await updateLeadStatus(leadId, status); void load(); } catch { setError("Failed to update lead status."); setTimeout(() => setError(null), 3000); }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <AdminPageHeader title="Security & Audit" description="Platform audit trail and enterprise lead management." icon={ShieldAlert} />

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-[12px] font-medium text-red-700">{error}</div>}

      <div className="mb-6">
        <h3 className="mb-3 text-[14px] font-semibold text-foreground">Enterprise Leads</h3>
        {leads.length > 0 ? (
          <AdminTable headers={["User", "Business", "Message", "Status", "Created", "Actions"]}>
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-secondary/20">
                <td className="px-4 py-3 text-[12.5px] font-medium text-foreground">{lead.user_name || lead.user_email || "Unknown"}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{lead.business_name || "—"}</td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground max-w-[200px] truncate">{lead.message || "—"}</td>
                <td className="px-4 py-3"><AdminBadge tone={lead.status === "open" ? "brand" : lead.status === "converted" ? "emerald" : "default"}>{lead.status}</AdminBadge></td>
                <td className="px-4 py-3 text-[11px] text-muted-foreground">{new Date(lead.created_at).toLocaleDateString("en-GB")}</td>
                <td className="px-4 py-3">
                  <select defaultValue={lead.status} onChange={(e) => void handleLeadStatus(lead.id, e.target.value)} className="h-7 rounded border border-border bg-card px-2 text-[11px] text-foreground focus:outline-none">
                    <option value="open">Open</option><option value="contacted">Contacted</option><option value="converted">Converted</option><option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </AdminTable>
        ) : <InsufficientData description="No enterprise leads have been submitted yet." />}
      </div>

      <div>
        <h3 className="mb-3 text-[14px] font-semibold text-foreground">Audit Events</h3>
        <div className="mb-3 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audit events..." className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-[12.5px] text-foreground focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        {loading ? <div className="grid min-h-[200px] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>
        : events.length === 0 ? <InsufficientData description="No audit events have been recorded yet." icon={AlertCircle} />
        : (
          <>
            <AdminTable headers={["Action", "Actor", "Target", "Label", "Date"]}>
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-secondary/20">
                  <td className="px-4 py-3 text-[12.5px] font-medium text-foreground">{event.action}</td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">{event.actor_name || event.actor_id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">{event.target_type || "—"}</td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">{event.target_label || "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground">{new Date(event.created_at).toLocaleString("en-GB")}</td>
                </tr>
              ))}
            </AdminTable>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-border text-foreground disabled:opacity-40 hover:bg-secondary"><ChevronLeft className="h-4 w-4" /></button>
                <span className="text-[12px] text-muted-foreground">{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-border text-foreground disabled:opacity-40 hover:bg-secondary"><ChevronRight className="h-4 w-4" /></button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
