import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { fetchCommunicationSettings, CommunicationSettings } from "@/services/communications";
import { Mail, MessageSquare, Phone, AlertCircle, CheckCircle, Radio } from "lucide-react";

interface CommunicationSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommunicationSettingsModal({
  open,
  onOpenChange,
}: CommunicationSettingsModalProps) {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<CommunicationSettings | null>(null);

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchCommunicationSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load communication settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const isEmailConnected = settings?.connected_integrations.some(
    (i) => i.provider === "email" || i.provider === "sendgrid" || i.provider === "smtp"
  );
  const isSmsConnected = settings?.connected_integrations.some(
    (i) => i.provider === "sms" || i.provider === "twilio"
  );
  const isWhatsAppConnected = settings?.connected_integrations.some(
    (i) => i.provider === "whatsapp"
  );

  const totalConnected = settings?.connected_integrations.length || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="h-5 w-5 text-indigo-400" />
            Communication Settings & Channels
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure integration connections, notification channels, and active communication preferences.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading settings...</div>
        ) : (
          <div className="space-y-6 py-2">
            {/* Live Monitoring & Integration Summary */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-200">System Integration Status</span>
                {totalConnected > 0 ? (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {totalConnected} Active Integration{totalConnected > 1 ? "s" : ""}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Manual Mode
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {totalConnected > 0
                  ? "Your connected communication gateways are synchronized and monitored in real-time."
                  : "Zero 3rd-party integration APIs connected. Communication records are currently logged manually."}
              </p>
            </div>

            {/* Channels & Providers */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Supported Communication Platforms
              </h4>

              {/* Email Integration Card */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-indigo-500/10 text-indigo-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">Email Service (SendGrid / SMTP)</div>
                    <div className="text-xs text-slate-500">Sends transaction emails & outbound client updates</div>
                  </div>
                </div>
                {isEmailConnected ? (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Connected</Badge>
                ) : (
                  <Badge variant="outline" className="border-slate-700 text-slate-400">Not Connected</Badge>
                )}
              </div>

              {/* SMS Integration Card */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">SMS Gateway (Twilio)</div>
                    <div className="text-xs text-slate-500">Delivers urgent SMS notifications & reminders</div>
                  </div>
                </div>
                {isSmsConnected ? (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Connected</Badge>
                ) : (
                  <Badge variant="outline" className="border-slate-700 text-slate-400">Not Connected</Badge>
                )}
              </div>

              {/* WhatsApp Integration Card */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-green-500/10 text-green-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">WhatsApp Business API</div>
                    <div className="text-xs text-slate-500">Enables direct WhatsApp conversations</div>
                  </div>
                </div>
                {isWhatsAppConnected ? (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Connected</Badge>
                ) : (
                  <Badge variant="outline" className="border-slate-700 text-slate-400">Not Connected</Badge>
                )}
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Communication Preferences
              </h4>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-slate-200">Email Notifications</Label>
                  <p className="text-xs text-slate-500">Receive copy of unread customer messages via email</p>
                </div>
                <Switch checked={settings?.email_notifications ?? true} disabled />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-slate-200">AI Assistant Guidance</Label>
                  <p className="text-xs text-slate-500">Provide automated tone and grammar options in composer</p>
                </div>
                <Switch checked={settings?.ai_drafts_enabled ?? true} disabled />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-slate-800 pt-3">
          <Button
            variant="outline"
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
