import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getCustomers } from "@/services/customers";
import { getJobs } from "@/services/jobs";
import { createReviewRequest, getConnectedReviewIntegrations, type ReviewIntegration } from "@/services/reviews";
import type { Customer, Job } from "@/lib/database.types";
import { X } from "lucide-react";

export function RequestReviewsModal({ onClose }: { onClose: () => void }) {
  const { business, user } = useAuthContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [integrations, setIntegrations] = useState<ReviewIntegration[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [jobId, setJobId] = useState("");
  const [platform, setPlatform] = useState("");
  const [message, setMessage] = useState("Thank you for choosing us. If you have a moment, please share your experience.");
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!business?.id) return;
    Promise.all([
      getCustomers(business.id).catch(() => []),
      getJobs(business.id),
      (async () => {
        const { data } = await (await import("@/lib/supabase")).supabase.from("integrations").select("id, provider, status, last_synced_at, settings").eq("business_id", business.id);
        return (data || []) as ReviewIntegration[];
      })(),
    ]).then(([loadedCustomers, loadedJobs, loadedIntegrations]) => {
      setCustomers(loadedCustomers);
      setJobs(loadedJobs);
      const connected = getConnectedReviewIntegrations(loadedIntegrations);
      setIntegrations(connected);
      setPlatform(connected[0]?.provider || "");
      setCustomerId(loadedCustomers[0]?.id || "");
    });
  }, [business?.id]);

  const selectedJobs = jobs.filter((job) => job.customer_id === customerId && job.status === "completed");
  const submit = async () => {
    if (!business?.id || !user?.id || !customerId || !platform || !message.trim()) return;
    setSaving(true);
    try {
      const integration = integrations.find((item) => item.provider === platform);
      const requestUrl = integration && typeof integration.settings.review_url === "string" ? integration.settings.review_url : null;
      await createReviewRequest({ businessId: business.id, userId: user.id, customerId, jobId: jobId || null, platform, message: message.trim(), requestUrl });
      setNotice("Request created. No message was sent because a verified messaging provider is not connected.");
    } catch {
      setNotice("The request could not be created.");
    } finally {
      setSaving(false);
    }
  };

  return <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" role="dialog" aria-modal="true"><div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="text-[16px] font-semibold text-foreground">Request a review</h2><button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"><X className="h-4 w-4" /></button></div><div className="space-y-4 p-5"><p className="text-[12px] leading-relaxed text-muted-foreground">Choose a genuine customer and completed interaction. Review the message before creating the request.</p><Field label="Customer"><select value={customerId} onChange={(event) => setCustomerId(event.target.value)} className="control"><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.full_name || customer.email || "Customer"}</option>)}</select></Field><Field label="Completed job"><select value={jobId} onChange={(event) => setJobId(event.target.value)} className="control"><option value="">No job selected</option>{selectedJobs.map((job) => <option key={job.id} value={job.id}>{job.title || job.job_number}</option>)}</select></Field><Field label="Review platform">{integrations.length ? <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="control">{integrations.map((integration) => <option key={integration.id} value={integration.provider}>{integration.provider}</option>)}</select> : <div className="rounded-xl border border-dashed border-border p-3 text-[11px] font-semibold text-muted-foreground">INSUFFICIENT DATA — connect Google Business Profile or Trustpilot first.</div>}</Field><Field label="Message"><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} className="control resize-none" /></Field>{notice && <div className="rounded-xl bg-secondary p-3 text-[11px] text-foreground">{notice}</div>}<div className="flex justify-end gap-2"><button onClick={onClose} className="rounded-lg border border-border px-3 py-2 text-[12px] font-medium text-foreground">Close</button><button disabled={saving || !integrations.length || !customerId} onClick={submit} className="rounded-lg bg-brand px-3 py-2 text-[12px] font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Create request"}</button></div></div></div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1 block text-[11px] font-semibold text-foreground">{label}</span>{children}</label>; }
