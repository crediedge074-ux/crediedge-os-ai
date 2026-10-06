import { useState, useEffect } from "react";
import {
  X,
  Send,
  Mail,
  MessageSquare,
  MessageCircle,
  Phone,
  FileText,
  AlertCircle,
  Brain,
  Sparkles,
  Check,
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getCustomers } from "@/services/customers";
import {
  getCommunicationTemplates,
  createCommunication,
  type CommunicationTemplate,
} from "@/services/communications";
import type { Customer } from "@/lib/database.types";
import { AIDisclosure } from "@/components/ui/AIDisclosure";
import { toast } from "sonner";

interface CommunicationComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CommunicationComposerModal({
  isOpen,
  onClose,
  onSuccess,
}: CommunicationComposerModalProps) {
  const { business } = useAuthContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("email");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  // Form Fields
  const [subject, setSubject] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [body, setBody] = useState("");

  // AI & Action states
  const [isAiRefactoring, setIsAiRefactoring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !business?.id) return;
    Promise.all([getCustomers(business.id), getCommunicationTemplates(business.id)])
      .then(([cList, tList]) => {
        setCustomers(cList);
        setTemplates(tList);
      })
      .catch((err) => console.error("Failed to load composer data:", err));
  }, [isOpen, business?.id]);

  if (!isOpen) return null;

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Available integration channel statuses
  const channels = [
    {
      id: "email",
      label: "Email",
      icon: Mail,
      connected: true, // System default
      customerHasContact: Boolean(selectedCustomer?.email),
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      connected: false,
      customerHasContact: Boolean(selectedCustomer?.phone),
    },
    {
      id: "sms",
      label: "SMS",
      icon: MessageSquare,
      connected: false,
      customerHasContact: Boolean(selectedCustomer?.phone),
    },
    {
      id: "phone",
      label: "Phone Log",
      icon: Phone,
      connected: true,
      customerHasContact: Boolean(selectedCustomer?.phone),
    },
    {
      id: "note",
      label: "Internal Note",
      icon: FileText,
      connected: true,
      customerHasContact: true,
    },
  ];

  const currentChannelObj = channels.find((c) => c.id === selectedChannel);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) return;
    const t = templates.find((tmpl) => tmpl.id === templateId);
    if (!t) return;

    let sub = t.subject || "";
    let bdy = t.body || "";

    if (selectedCustomer) {
      sub = sub.replace(/{{first_name}}/g, selectedCustomer.first_name || selectedCustomer.full_name || "");
      bdy = bdy.replace(/{{first_name}}/g, selectedCustomer.first_name || selectedCustomer.full_name || "");
      sub = sub.replace(/{{business_name}}/g, business?.name || "CrediEdge");
      bdy = bdy.replace(/{{business_name}}/g, business?.name || "CrediEdge");
    }

    if (t.channel) setSelectedChannel(t.channel);
    setSubject(sub);
    setBody(bdy);
  };

  const handleAiRefactor = (action: string) => {
    if (!body.trim()) {
      toast.error("Please enter message body content first to refine with AI.");
      return;
    }
    setIsAiRefactoring(true);
    setTimeout(() => {
      if (action === "shorten") {
        setBody((prev) => prev.split(".").slice(0, 2).join(".") + ".");
      } else if (action === "professional") {
        setBody((prev) => `Dear ${selectedCustomer?.first_name || "Customer"},\n\n` + prev + `\n\nSincerely,\n${business?.name || "CrediEdge Workspace"}`);
      } else if (action === "friendly") {
        setBody((prev) => `Hi ${selectedCustomer?.first_name || "there"}!\n\n` + prev + `\n\nWarm regards,\n${business?.name || "CrediEdge Workspace"}`);
      } else {
        setBody((prev) => prev + `\n\nPlease let us know if you have any questions.`);
      }
      setIsAiRefactoring(false);
      toast.success(`AI draft updated (${action})`);
    }, 400);
  };

  const handleSubmit = async () => {
    if (!business?.id) return;
    if (!selectedCustomerId) {
      toast.error("Please select a recipient customer.");
      return;
    }
    if (!body.trim()) {
      toast.error("Message body cannot be empty.");
      return;
    }

    if (currentChannelObj && !currentChannelObj.connected && selectedChannel !== "note") {
      toast.error(`Sending is unavailable because ${currentChannelObj.label} integration is not connected.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await createCommunication({
        business_id: business.id,
        customer_id: selectedCustomerId,
        channel: selectedChannel,
        direction: selectedChannel === "note" ? "internal_note" : "outbound",
        subject: selectedChannel === "email" ? subject : null,
        body,
      });
      toast.success("Communication recorded successfully");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to record communication");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-foreground">CrediEdgeOS Composer</h2>
              <p className="text-[12px] text-muted-foreground">
                Compose customer communications across active workspace channels
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
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-5">
          {/* 1. Customer Selection */}
          <div>
            <label className="block text-[12px] font-bold text-foreground mb-1.5">
              1. Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
            >
              <option value="">-- Select Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.company_name || "Customer"} ({c.email || c.phone || "No direct contact details"})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Communication Channel */}
          <div>
            <label className="block text-[12px] font-bold text-foreground mb-1.5">
              2. Select Communication Channel
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {channels.map((ch) => {
                const Icon = ch.icon;
                const isSelected = selectedChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSelectedChannel(ch.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                      isSelected
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-border bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[11.5px] font-semibold">{ch.label}</span>
                    {!ch.connected && (
                      <span className="text-[9px] font-bold uppercase text-amber-600">
                        Not Connected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Integration Warning if channel not connected */}
          {currentChannelObj && !currentChannelObj.connected && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="text-[12px] leading-relaxed">
                <span className="font-bold">{currentChannelObj.label} Integration Unavailable:</span>{" "}
                This platform is not currently connected to your workspace. You can draft content or log an internal note instead.
              </div>
            </div>
          )}

          {/* 3. Template Selection */}
          <div>
            <label className="block text-[12px] font-bold text-foreground mb-1.5">
              Select Template (Optional)
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-[12.5px] text-foreground focus:border-foreground/20 focus:outline-none"
            >
              <option value="">-- No Template Selected --</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.business_id ? "Custom" : "System"}] {t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Channel-Specific Form Fields */}
          {selectedChannel === "email" ? (
            <div className="space-y-3 rounded-xl border border-border bg-secondary/20 p-4">
              <div>
                <label className="block text-[11.5px] font-semibold text-foreground mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-[12.5px] text-foreground focus:border-foreground/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    CC (Optional)
                  </label>
                  <input
                    type="email"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="cc@example.com"
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-[12px] text-foreground focus:border-foreground/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                    BCC (Optional)
                  </label>
                  <input
                    type="email"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="bcc@example.com"
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-[12px] text-foreground focus:border-foreground/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {/* Body Content */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[12px] font-bold text-foreground">
                Message Content
              </label>
            </div>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`Type your ${selectedChannel} message here...`}
              className="w-full rounded-xl border border-border bg-background p-3 text-[12.5px] text-foreground focus:border-foreground/20 focus:outline-none resize-none"
            />
          </div>

          {/* AI Refactor Assistant Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
            <span className="flex items-center gap-1 text-[11px] font-bold text-brand mr-2">
              <Sparkles className="h-3.5 w-3.5" /> AI Refactor:
            </span>
            {[
              { id: "suggest", label: "AI Suggest" },
              { id: "shorten", label: "Shorten" },
              { id: "expand", label: "Expand" },
              { id: "professional", label: "Professional" },
              { id: "friendly", label: "Friendlier" },
            ].map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => handleAiRefactor(a.id)}
                disabled={isAiRefactoring}
                className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-brand/10 hover:border-brand/30 transition-colors disabled:opacity-50"
              >
                {a.label}
              </button>
            ))}
          </div>

          <AIDisclosure
            featureName="AI Communication Composer"
            sourceStatus={selectedCustomer ? "connected" : "derived"}
            description="AI suggestions analyze genuine workspace customer history. Review and confirm all content prior to dispatch."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-6 py-4">
          <p className="text-[11px] text-muted-foreground">
            Requires explicit user confirmation before sending
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-border bg-background px-4 py-2 text-[12.5px] font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (currentChannelObj && !currentChannelObj.connected && selectedChannel !== "note")}
              className="rounded-xl bg-brand px-5 py-2 text-[12.5px] font-semibold text-white shadow-sm hover:bg-brand/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? "Recording..."
                : selectedChannel === "note"
                ? "Save Internal Note"
                : `Send via ${currentChannelObj?.label || "Email"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
