import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Mail, MessageSquare, Phone, Globe, Settings as SettingsIcon, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { fetchConnectedIntegrations, type IntegrationRow } from "@/services/communications";

interface CommunicationsSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

// Supported communication platforms — only those with a real integration path
const SUPPORTED_PLATFORMS = [
  { key: "gmail", label: "Gmail", icon: Mail, category: "Email" },
  { key: "outlook", label: "Outlook", icon: Mail, category: "Email" },
  { key: "whatsapp", label: "WhatsApp Business", icon: Phone, category: "Messaging" },
  { key: "twilio", label: "Twilio (SMS)", icon: MessageSquare, category: "SMS" },
  { key: "slack", label: "Slack", icon: MessageSquare, category: "Team" },
  { key: "webchat", label: "Web Chat", icon: Globe, category: "Web" },
] as const;

export function CommunicationsSettingsModal({ open, onClose }: CommunicationsSettingsModalProps) {
  const { business } = useAuthContext();
  const businessId = business?.id;

  const [integrations, setIntegrations] = useState<IntegrationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIntegrations = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await fetchConnectedIntegrations(businessId);
      setIntegrations(data);
    } catch (err) {
      console.error("[CommSettings] load error:", err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (open) loadIntegrations();
  }, [open, loadIntegrations]);

  const getIntegrationStatus = (platformKey: string): IntegrationRow | null => {
    return integrations.find(
      (i) =>
        i.provider.toLowerCase().includes(platformKey) ||
        (platformKey === "gmail" && i.provider.toLowerCase().includes("gmail")) ||
        (platformKey === "outlook" && i.provider.toLowerCase().includes("outlook"))
    ) ?? null;
  };

  const formatLastSynced = (syncedAt: string | null): string => {
    if (!syncedAt) return "Never";
    const diff = Date.now() - new Date(syncedAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr ago`;
    return new Date(syncedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4 text-brand" strokeWidth={1.75} />
            Communications Settings
          </DialogTitle>
          <DialogDescription>
            View and manage your connected communication platforms.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Communication preferences */}
            <div className="rounded-lg border border-border bg-secondary/20 p-3.5">
              <h3 className="mb-2 text-[12px] font-semibold text-foreground">Communication Preferences</h3>
              <div className="space-y-1.5 text-[11.5px] text-muted-foreground">
                <p>Inbound enquiries from connected platforms appear in your Communications workspace automatically.</p>
                <p>Outbound messages require a connected integration to be delivered to the recipient.</p>
              </div>
            </div>

            {/* Platform list */}
            <div className="space-y-2">
              <h3 className="text-[12px] font-semibold text-foreground">Supported Platforms</h3>
              {SUPPORTED_PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                const integration = getIntegrationStatus(platform.key);
                const isConnected = integration?.status === "connected";

                return (
                  <div
                    key={platform.key}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary">
                      <Icon className="h-4 w-4 text-foreground/70" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12.5px] font-semibold text-foreground">{platform.label}</span>
                        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[8.5px] font-medium text-muted-foreground">
                          {platform.category}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
                        {isConnected ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" strokeWidth={1.75} />
                            <span className="text-emerald-600 font-medium">Connected</span>
                            {integration?.last_synced_at && (
                              <>
                                <span className="text-muted-foreground/30">·</span>
                                <Clock className="h-2.5 w-2.5" strokeWidth={1.75} />
                                <span>Last synced {formatLastSynced(integration.last_synced_at)}</span>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-muted-foreground" strokeWidth={1.75} />
                            <span>Not connected</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      disabled
                      className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-[11px] font-medium text-muted-foreground cursor-not-allowed"
                      title="Integration setup requires OAuth configuration — contact your administrator"
                    >
                      {isConnected ? "Manage" : "Connect"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-3">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" strokeWidth={1.75} />
              <p className="text-[11.5px] text-blue-700">
                Platform connections require OAuth configuration and API credentials. Contact your workspace administrator or see the Integrations Hub for setup details.
              </p>
            </div>

            {/* Connected count */}
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 px-3.5 py-2.5">
              <span className="text-[11.5px] font-medium text-muted-foreground">Connected platforms</span>
              <span className="text-[14px] font-bold text-foreground">
                {integrations.filter((i) => i.status === "connected").length}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
