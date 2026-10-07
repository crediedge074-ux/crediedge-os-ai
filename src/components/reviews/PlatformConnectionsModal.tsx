import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import type { ReviewIntegration } from "@/services/reviews";
import { Globe, X } from "lucide-react";

export function PlatformConnectionsModal({ onClose }: { onClose: () => void }) {
  const { business } = useAuthContext();
  const [integrations, setIntegrations] = useState<ReviewIntegration[]>([]);
  useEffect(() => {
    if (!business?.id) return;
    supabase.from("integrations").select("id, provider, status, last_synced_at, settings").eq("business_id", business.id).then(({ data }) => setIntegrations((data || []) as ReviewIntegration[]));
  }, [business?.id]);
  const platforms = [{ provider: "google_business_profile", label: "Google Business Profile" }, { provider: "trustpilot", label: "Trustpilot" }];
  return <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl"><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="text-[16px] font-semibold text-foreground">Connect review platform</h2><button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"><X className="h-4 w-4" /></button></div><div className="space-y-3 p-5"><p className="text-[12px] leading-relaxed text-muted-foreground">CrediEdgeOS does not simulate OAuth or provider capabilities. Use the central integrations page to complete a verified connection.</p>{platforms.map((platform) => { const integration = integrations.find((item) => item.provider.toLowerCase() === platform.provider || item.provider.toLowerCase() === "google" && platform.provider.startsWith("google")); const connected = integration?.status === "connected"; return <div key={platform.provider} className="flex items-center gap-3 rounded-xl border border-border p-4"><div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary"><Globe className="h-4 w-4 text-muted-foreground" /></div><div className="min-w-0 flex-1"><div className="text-[13px] font-semibold text-foreground">{platform.label}</div><div className="mt-0.5 text-[11px] text-muted-foreground">{connected ? `Connected${integration?.last_synced_at ? ` · last sync ${new Date(integration.last_synced_at).toLocaleDateString()}` : ""}` : integration?.status === "error" ? "Connection Error" : "Connection Required"}</div></div><Link to="/integrations" className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white">{connected ? "Manage" : "Open integrations"}</Link></div>; })}</div></div></div>;
}
