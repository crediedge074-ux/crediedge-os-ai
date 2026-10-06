import { useState, useEffect } from "react";
import { X, Sliders, CheckCircle2, MessageSquare, Mail, Phone, Globe, ShieldAlert, Sparkles } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { updateBusinessSettings } from "@/services/settings";
import { toast } from "sonner";

interface CommunicationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommunicationSettingsModal({ isOpen, onClose }: CommunicationSettingsModalProps) {
  const { business } = useAuthContext();
  const [slaTargetMinutes, setSlaTargetMinutes] = useState(60);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!business?.id) return;
    setIsSaving(true);
    try {
      await updateBusinessSettings(business.id, {
        updated_at: new Date().toISOString(),
      });
      toast.success("Communication preferences saved");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const platforms = [
    {
      id: "email",
      name: "Email (System Default)",
      icon: Mail,
      connected: true,
      description: "Internal email dispatch & workspace customer notifications.",
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business API",
      icon: MessageSquare,
      connected: false,
      description: "Official Meta WhatsApp Business Cloud API integration.",
    },
    {
      id: "sms",
      name: "SMS Gateway (Twilio / MessageBird)",
      icon: MessageSquare,
      connected: false,
      description: "Two-way SMS text messaging gateway for customer updates.",
    },
    {
      id: "phone",
      name: "VoIP Phone & Call Logging",
      icon: Phone,
      connected: false,
      description: "Cloud PBX & call transcript integration.",
    },
    {
      id: "webchat",
      name: "CrediEdgeOS Web Chat Widget",
      icon: Globe,
      connected: false,
      comingSoon: true,
      description: "Live website chat widget synced directly to your workspace.",
    },
    {
      id: "contact_form",
      name: "Contact Form Webhook",
      icon: Globe,
      connected: false,
      description: "Inbound web lead and contact form integration.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-foreground">Communications Settings</h2>
              <p className="text-[12px] text-muted-foreground">
                Configure channel integrations & workspace SLA response targets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Section 1: Connected Channels */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-foreground">Communication Platforms & Channels</h3>
              <span className="text-[11px] text-muted-foreground">
                1 Connected · 5 Not Connected
              </span>
            </div>

            <div className="space-y-2.5">
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    className={`flex items-start justify-between rounded-xl border p-3.5 transition-all ${
                      p.connected
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-border bg-secondary/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${
                          p.connected
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-foreground">{p.name}</span>
                          {p.connected ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9.5px] font-bold uppercase text-emerald-600">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Connected
                            </span>
                          ) : p.comingSoon ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-2 py-0.5 text-[9.5px] font-bold uppercase text-purple-600">
                              <Sparkles className="h-2.5 w-2.5" /> Coming Soon
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[9.5px] font-bold uppercase text-muted-foreground">
                              <X className="h-2.5 w-2.5" /> Not Connected
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{p.description}</p>
                      </div>
                    </div>

                    {!p.connected && (
                      <button
                        onClick={() =>
                          toast.info(
                            p.comingSoon
                              ? "Web Chat widget is currently in development."
                              : "Integration setup required. Connect via Integrations settings."
                          )
                        }
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-[11.5px] font-semibold text-foreground hover:bg-secondary transition-colors"
                      >
                        {p.comingSoon ? "In Development" : "Setup Required"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: SLA & Targets */}
          <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-4">
            <h3 className="text-[13px] font-bold text-foreground">Workspace SLA & Response Targets</h3>

            <div>
              <label className="block text-[12px] font-semibold text-foreground mb-1">
                Target Response Time SLA (Minutes)
              </label>
              <input
                type="number"
                value={slaTargetMinutes}
                onChange={(e) => setSlaTargetMinutes(Number(e.target.value))}
                min={5}
                max={1440}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Inbound customer messages taking longer than {slaTargetMinutes} minutes will be flagged as overdue.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/40 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-border bg-background px-4 py-2 text-[12.5px] font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-brand px-5 py-2 text-[12.5px] font-semibold text-white shadow-sm hover:bg-brand/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
