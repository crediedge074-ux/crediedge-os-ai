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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AIDisclosure } from "@/components/ui/AIDisclosure";
import { getCustomers } from "@/services/customers";
type Customer = Awaited<ReturnType<typeof getCustomers>>[number];
import { getPrimaryMembership } from "@/services/business";
import { supabase } from "@/lib/supabase";
import {
  createCommunication,
  fetchCommunicationTemplates,
  fetchCommunicationSettings,
  generateAICommunicationDraft,
  CommunicationTemplate,
  CommunicationSettings,
} from "@/services/communications";
import {
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  Send,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Wand2,
} from "lucide-react";

interface CommunicationComposerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CommunicationComposerModal({
  open,
  onOpenChange,
  onSuccess,
}: CommunicationComposerModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [settings, setSettings] = useState<CommunicationSettings | null>(null);

  // Form states
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [channel, setChannel] = useState<'email' | 'sms' | 'whatsapp' | 'phone' | 'note'>("email");
  const [subject, setSubject] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [body, setBody] = useState("");
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      let custList: Customer[] = [];
      if (userData?.user) {
        const mem = await getPrimaryMembership(userData.user.id);
        if (mem?.business_id) {
          custList = await getCustomers(mem.business_id);
        }
      }

      const [tmplList, setList] = await Promise.all([
        fetchCommunicationTemplates(),
        fetchCommunicationSettings(),
      ]);
      setCustomers(custList);
      setTemplates(tmplList);
      setSettings(setList);

      if (custList.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(custList[0].id);
      }
    } catch (err: any) {
      console.error("Error loading composer data:", err);
      setErrorMessage(err.message || "Failed to load customers and templates.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Customer Contact Capabilities
  const hasEmailCapability = Boolean(selectedCustomer?.email?.trim());
  const hasPhoneCapability = Boolean(selectedCustomer?.phone?.trim());

  // Workspace Integration Capabilities
  const isEmailIntegrationActive = Boolean(
    settings?.connected_integrations.some(
      (i) => i.provider === "email" || i.provider === "sendgrid" || i.provider === "smtp"
    )
  );
  const isSmsIntegrationActive = Boolean(
    settings?.connected_integrations.some(
      (i) => i.provider === "sms" || i.provider === "twilio"
    )
  );
  const isWhatsAppIntegrationActive = Boolean(
    settings?.connected_integrations.some((i) => i.provider === "whatsapp")
  );

  // Determine channel availability status
  const getChannelCapabilityStatus = (targetChannel: 'email' | 'sms' | 'whatsapp' | 'phone' | 'note') => {
    if (targetChannel === "note" || targetChannel === "phone") {
      return { available: true, reason: "Internal record logging" };
    }
    if (targetChannel === "email") {
      if (!hasEmailCapability) return { available: false, reason: "Customer missing email address" };
      if (!isEmailIntegrationActive) return { available: false, isManual: true, reason: "Email integration disconnected (manual log mode)" };
      return { available: true, reason: "Ready to send via connected Email gateway" };
    }
    if (targetChannel === "sms") {
      if (!hasPhoneCapability) return { available: false, reason: "Customer missing phone number" };
      if (!isSmsIntegrationActive) return { available: false, isManual: true, reason: "SMS integration disconnected (manual log mode)" };
      return { available: true, reason: "Ready to send via connected SMS gateway" };
    }
    if (targetChannel === "whatsapp") {
      if (!hasPhoneCapability) return { available: false, reason: "Customer missing phone number" };
      if (!isWhatsAppIntegrationActive) return { available: false, isManual: true, reason: "WhatsApp integration disconnected (manual log mode)" };
      return { available: true, reason: "Ready to send via connected WhatsApp gateway" };
    }
    return { available: true, reason: "Available" };
  };

  const currentCapability = getChannelCapabilityStatus(channel);

  const handleSelectTemplate = (templateId: string) => {
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      if (tmpl.subject) setSubject(tmpl.subject);
      setBody(tmpl.body);
      setIsAiGenerated(false);
    }
  };

  const handleAiAction = async (action: 'suggest' | 'improve' | 'professional' | 'shorten' | 'expand') => {
    const custName = selectedCustomer
      ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`.trim()
      : "Customer";

    const result = await generateAICommunicationDraft({
      action,
      channel,
      currentBody: body,
      customerName: custName,
      subject,
    });

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    if (result.subject) setSubject(result.subject);
    setBody(result.body);
    setIsAiGenerated(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      setErrorMessage("Please enter a message or content body.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      // Include CC/BCC into the recorded body metadata if provided for email channel
      let fullBody = body;
      if (channel === "email" && (cc.trim() || bcc.trim())) {
        const copyDetails = [
          cc.trim() ? `CC: ${cc.trim()}` : null,
          bcc.trim() ? `BCC: ${bcc.trim()}` : null,
        ]
          .filter(Boolean)
          .join(" | ");
        fullBody = `[${copyDetails}]\n\n${body}`;
      }

      await createCommunication({
        customer_id: selectedCustomerId || null,
        channel,
        direction: "outbound",
        subject: channel === "email" ? subject : null,
        body: fullBody,
        sentiment: "neutral",
      });

      if (onSuccess) onSuccess();
      onOpenChange(false);
      // Reset form
      setBody("");
      setSubject("");
      setCc("");
      setBcc("");
      setIsAiGenerated(false);
    } catch (err: any) {
      console.error("Failed to save communication:", err);
      setErrorMessage(err.message || "Failed to record communication.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="h-5 w-5 text-indigo-400" />
            Communication Composer
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Draft, optimize with AI, and record workspace communications with verified customer profiles.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading customer & template data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 py-2">
            {errorMessage && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Customer & Channel Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-300">Select Customer</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                    <SelectValue placeholder="Select a customer..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.first_name} {c.last_name} ({c.email || c.phone || "No direct contact"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-300">Channel</Label>
                <Select
                  value={channel}
                  onValueChange={(val: any) => setChannel(val)}
                >
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="phone">Phone Log</SelectItem>
                    <SelectItem value="note">Internal Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Integration & Capability Status Warning */}
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {currentCapability.available ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                )}
                <span className="text-slate-300">{currentCapability.reason}</span>
              </div>
              {currentCapability.isManual && (
                <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10">
                  Manual Record Only
                </Badge>
              )}
            </div>

            {/* Email Specific Fields: Subject, CC, BCC */}
            {channel === "email" && (
              <div className="space-y-3 p-3 rounded-lg border border-slate-800/80 bg-slate-950/40">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Subject</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject line..."
                    className="bg-slate-900 border-slate-800 text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">CC (Optional)</Label>
                    <Input
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                      placeholder="cc@example.com"
                      className="bg-slate-900 border-slate-800 text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">BCC (Optional)</Label>
                    <Input
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                      placeholder="bcc@example.com"
                      className="bg-slate-900 border-slate-800 text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Template Selector & AI Helpers Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <Select onValueChange={handleSelectTemplate}>
                  <SelectTrigger className="w-[200px] h-8 text-xs bg-slate-950 border-slate-800 text-slate-300">
                    <SelectValue placeholder="Use a template..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* AI Assistant Status */}
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="border-slate-800 bg-slate-950 text-slate-400 text-xs py-1 px-2.5">
                  <Sparkles className="h-3 w-3 mr-1.5 text-slate-500" />
                  AI Assistant Unavailable (Provider Setup Required)
                </Badge>
              </div>
            </div>

            {/* Message Body Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase text-slate-300">Message Content</Label>
                {isAiGenerated && (
                  <Badge variant="outline" className="border-indigo-500/40 text-indigo-300 bg-indigo-500/10 text-[10px]">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI-Drafted (Editable)
                  </Badge>
                )}
              </div>
              <Textarea
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  setIsAiGenerated(false);
                }}
                rows={5}
                placeholder="Type your message or draft here..."
                className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500"
              />
            </div>

            {/* AI Disclosure Component */}
            <AIDisclosure
              featureName="AI Communication Composer"
              dataDependencies={["Customer contact profile", "Active workspace communication templates"]}
              limitations={["AI suggestions require user confirmation before sending.", "Auto-sending is strictly disabled."]}
            />

            <DialogFooter className="border-t border-slate-800 pt-3">
              <Button
                type="button"
                variant="outline"
                className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !body.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
              >
                {submitting
                  ? "Saving Record..."
                  : currentCapability.available && !currentCapability.isManual
                  ? "Send & Record"
                  : "Log Communication Record"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
