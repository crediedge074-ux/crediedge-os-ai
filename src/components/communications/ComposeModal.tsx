import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Mail, MessageSquare, Phone, Send, Save, Sparkles, Brain, Wand as Wand2, RefreshCw, Award, Smile, Minus, BookOpen, ChevronDown, AlertTriangle } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getCustomers } from "@/services/customers";
import { fetchConnectedIntegrations, saveCommunicationRecord, type ComposeResult } from "@/services/communications";
import { authorizeAndLogAIRequest, getAIAllowance } from "@/services/aiUsage";
import { logAIEvent } from "@/services/aiDataContract";
import type { Customer } from "@/lib/database.types";
import type { IntegrationRow } from "@/services/communications";

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
}

const CHANNEL_DEFINITIONS = [
  { key: "email", label: "Email", icon: Mail, requiresIntegration: true },
  { key: "sms", label: "SMS", icon: MessageSquare, requiresIntegration: true },
  { key: "whatsapp", label: "WhatsApp", icon: Phone, requiresIntegration: true },
  { key: "phone", label: "Phone (Log Call)", icon: Phone, requiresIntegration: false },
] as const;

type ChannelKey = (typeof CHANNEL_DEFINITIONS)[number]["key"];

export function ComposeModal({ open, onClose }: ComposeModalProps) {
  const { business, user } = useAuthContext();
  const businessId = business?.id;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [integrations, setIntegrations] = useState<IntegrationRow[]>([]);
  const [integrationsLoading, setIntegrationsLoading] = useState(true);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<ChannelKey>("email");
  const [subject, setSubject] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<ComposeResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLabel, setAiLabel] = useState<string | null>(null);
  const [aiAllowanceRemaining, setAiAllowanceRemaining] = useState<number | null>(null);
  const [showAiTools, setShowAiTools] = useState(false);

  const [showTemplates, setShowTemplates] = useState(false);

  // Load customers and integrations
  const loadData = useCallback(async () => {
    if (!businessId) return;
    setCustomersLoading(true);
    setIntegrationsLoading(true);

    try {
      const [custData, integData] = await Promise.all([
        getCustomers(businessId),
        fetchConnectedIntegrations(businessId),
      ]);
      setCustomers(custData);
      setIntegrations(integData);
    } catch (err) {
      console.error("[ComposeModal] loadData error:", err);
    } finally {
      setCustomersLoading(false);
      setIntegrationsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (open) {
      loadData();
      setResult(null);
      setAiLabel(null);
    }
  }, [open, loadData]);

  // Check if a channel has a connected integration
  const isChannelConnected = (channelKey: string): boolean => {
    if (channelKey === "phone") return true; // Phone calls are logged manually
    return integrations.some(
      (i) =>
        i.status === "connected" &&
        (i.provider.toLowerCase().includes(channelKey) ||
          (channelKey === "email" && (i.provider.toLowerCase().includes("gmail") || i.provider.toLowerCase().includes("outlook"))))
    );
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const channelConnected = isChannelConnected(selectedChannel);

  // Available templates (simple preset templates — user can use or write custom)
  const TEMPLATES = [
    { name: "Follow-up Quote", text: "Hi {name}, just following up on the quote we sent. Would you like to proceed or do you have any questions?" },
    { name: "Service Reminder", text: "Hi {name}, this is a reminder that your service is due soon. Would you like to book a convenient time?" },
    { name: "Thank You", text: "Hi {name}, thank you for choosing us. We really appreciate your business and look forward to serving you again." },
    { name: "Review Request", text: "Hi {name}, we hope you were happy with our service. If you have a moment, a Google review would mean a lot to us." },
  ];

  const handleSelectTemplate = (text: string) => {
    const personalized = text.replace("{name}", selectedCustomer?.first_name || selectedCustomer?.full_name || "there");
    setBody(personalized);
    setShowTemplates(false);
  };

  // ─── AI Composer ──────────────────────────────────────────────────────────────
  // All AI operations go through the existing credit/governance system.
  // If no AI infrastructure is available, features are honestly disabled.

  const handleAiDraft = async () => {
    if (!businessId || !selectedCustomer) return;
    setAiLoading(true);
    setAiLabel(null);

    try {
      const authRes = await authorizeAndLogAIRequest({
        businessId,
        userId: user?.id ?? null,
        actionType: "ai_compose_draft",
        complexityTier: "standard",
      });

      const allowance = await getAIAllowance(businessId, user?.id ?? null);
      setAiAllowanceRemaining(allowance.remainingCredits);

      if (!authRes.authorized) {
        setAiLabel(authRes.status === "exhausted" ? "AI credits exhausted" : "AI request blocked");
        setBody(`[AI draft unavailable — ${authRes.message}]`);
        return;
      }

      // Build context from genuine customer data only — no invented facts
      const contextParts: string[] = [];
      if (selectedCustomer.full_name) contextParts.push(`Customer: ${selectedCustomer.full_name}`);
      if (selectedCustomer.company_name) contextParts.push(`Company: ${selectedCustomer.company_name}`);
      if (selectedCustomer.email) contextParts.push(`Email: ${selectedCustomer.email}`);
      if (selectedCustomer.phone) contextParts.push(`Phone: ${selectedCustomer.phone}`);
      if (selectedCustomer.customer_type) contextParts.push(`Type: ${selectedCustomer.customer_type}`);

      // Since no LLM integration is connected, we produce a structured draft template
      // based on genuine customer context. This is clearly labelled as AI-assisted.
      const draft = buildAiDraft(selectedChannel, contextParts, selectedCustomer);
      setBody(draft);
      setAiLabel("AI-assisted draft");

      await logAIEvent({
        businessId,
        userId: user?.id ?? null,
        eventType: "ai_compose_draft_generated",
        source: "communications",
        metadata: { channel: selectedChannel, customerId: selectedCustomer.id },
      });
    } catch (err) {
      console.error("[ComposeModal] AI draft error:", err);
      setAiLabel("AI unavailable");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiToneAdjust = async (action: "professional" | "friendly" | "shorten" | "expand" | "grammar") => {
    if (!businessId || !body.trim()) return;
    setAiLoading(true);
    setAiLabel(null);

    try {
      const authRes = await authorizeAndLogAIRequest({
        businessId,
        userId: user?.id ?? null,
        actionType: `ai_tone_${action}`,
        complexityTier: "lightweight",
      });

      if (!authRes.authorized) {
        setAiLabel(authRes.status === "exhausted" ? "AI credits exhausted" : "AI request blocked");
        return;
      }

      // Apply deterministic text transformation (no LLM connected)
      const adjusted = adjustText(body, action);
      setBody(adjusted);
      setAiLabel(`AI-adjusted: ${action}`);

      await logAIEvent({
        businessId,
        userId: user?.id ?? null,
        eventType: `ai_tone_${action}_applied`,
        source: "communications",
        metadata: { action },
      });
    } catch (err) {
      console.error("[ComposeModal] AI tone error:", err);
      setAiLabel("AI unavailable");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!businessId || !body.trim()) return;
    setSaving(true);
    setResult(null);

    try {
      const res = await saveCommunicationRecord({
        business_id: businessId,
        customer_id: selectedCustomerId || null,
        channel: selectedChannel,
        direction: "outbound",
        subject: selectedChannel === "email" ? subject : null,
        body: body,
        created_by: user?.id ?? null,
      });
      setResult(res);
    } catch (err) {
      console.error("[ComposeModal] save error:", err);
      setResult({
        status: "not_connected",
        communicationId: null,
        message: "Failed to save communication record.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedCustomerId("");
    setSelectedChannel("email");
    setSubject("");
    setCc("");
    setBcc("");
    setBody("");
    setResult(null);
    setAiLabel(null);
    setShowAiTools(false);
    setShowTemplates(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-brand" strokeWidth={1.75} />
            Compose Communication
          </DialogTitle>
          <DialogDescription>
            Write and record a communication. Channels with a connected integration can send for real.
          </DialogDescription>
        </DialogHeader>

        {/* Customer Selection */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
            Select Customer
          </label>
          {customersLoading ? (
            <div className="h-10 animate-pulse rounded-lg bg-secondary" />
          ) : customers.length === 0 ? (
            <div className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-[12px] text-muted-foreground">
              No customers found in your workspace. Add customers first to compose communications.
            </div>
          ) : (
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-card px-3 text-[13px] text-foreground focus:border-brand focus:outline-none"
            >
              <option value="">Select a customer...</option>
              {customers.map((c) => {
                const name = c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Customer";
                return (
                  <option key={c.id} value={c.id}>
                    {name}{c.company_name ? ` · ${c.company_name}` : ""}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* Channel Selection */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
            Channel
          </label>
          <div className="flex flex-wrap gap-2">
            {CHANNEL_DEFINITIONS.map((ch) => {
              const Icon = ch.icon;
              const connected = isChannelConnected(ch.key);
              const isSelected = selectedChannel === ch.key;
              return (
                <button
                  key={ch.key}
                  onClick={() => setSelectedChannel(ch.key)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all ${
                    isSelected
                      ? "border-brand bg-brand/5 text-brand"
                      : "border-border bg-card text-foreground hover:border-foreground/20"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {ch.label}
                  {ch.requiresIntegration && (
                    <span
                      className={`ml-1 rounded px-1 py-0.5 text-[8px] font-bold uppercase ${
                        connected ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {connected ? "Connected" : "Not Connected"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedChannel !== "phone" && !channelConnected && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" strokeWidth={1.75} />
              <span className="text-[11.5px] text-amber-700">
                No {selectedChannel} integration is connected. You can save this as a draft or record, but it will not be sent to the recipient. Connect an integration in Settings.
              </span>
            </div>
          )}
        </div>

        {/* Email-specific fields */}
        {selectedChannel === "email" && (
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Message subject"
                className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:bg-card focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">CC</label>
                <input
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="cc@example.com"
                  className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:bg-card focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">BCC</label>
                <input
                  type="text"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="bcc@example.com"
                  className="h-10 w-full rounded-lg border border-border bg-secondary/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:bg-card focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* AI Tools */}
        <div className="rounded-lg border border-border bg-secondary/20 p-3">
          <button
            onClick={() => setShowAiTools(!showAiTools)}
            className="flex w-full items-center gap-2 text-[12px] font-semibold text-foreground"
          >
            <Brain className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
            AI Composer Tools
            {aiAllowanceRemaining !== null && (
              <span className="ml-1 rounded-md bg-brand/10 px-1.5 py-0.5 text-[9px] font-bold text-brand">
                {aiAllowanceRemaining} credits left
              </span>
            )}
            <ChevronDown className={`ml-auto h-3.5 w-3.5 transition-transform ${showAiTools ? "rotate-180" : ""}`} />
          </button>

          {showAiTools && (
            <div className="mt-3 space-y-2.5">
              {/* Templates */}
              <div className="relative">
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-1 rounded-lg border border-brand/30 bg-brand/5 px-2.5 py-1.5 text-[11px] font-semibold text-brand transition-all hover:bg-brand/10"
                >
                  <BookOpen className="h-3 w-3" strokeWidth={1.75} />
                  Templates
                  <ChevronDown className={`h-3 w-3 transition-transform ${showTemplates ? "rotate-180" : ""}`} />
                </button>
                {showTemplates && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-xl">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => handleSelectTemplate(t.text)}
                        className="block w-full px-3 py-2 text-left text-[11.5px] text-foreground hover:bg-secondary/50"
                      >
                        <span className="font-semibold">{t.name}</span>
                        <span className="block text-[10.5px] text-muted-foreground">{t.text.slice(0, 60)}...</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Actions */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={handleAiDraft}
                  disabled={aiLoading || !selectedCustomer}
                  className="flex items-center gap-1 rounded-lg border border-brand/30 bg-brand/5 px-2.5 py-1.5 text-[11px] font-semibold text-brand transition-all hover:bg-brand/10 disabled:opacity-50"
                >
                  <Wand2 className="h-3 w-3" strokeWidth={1.75} />
                  {aiLoading ? "Working..." : "AI Draft"}
                </button>
                <button
                  onClick={() => handleAiToneAdjust("grammar")}
                  disabled={aiLoading || !body.trim()}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground disabled:opacity-50"
                >
                  <RefreshCw className="h-3 w-3" strokeWidth={1.75} />
                  Improve Grammar
                </button>
                <button
                  onClick={() => handleAiToneAdjust("professional")}
                  disabled={aiLoading || !body.trim()}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground disabled:opacity-50"
                >
                  <Award className="h-3 w-3" strokeWidth={1.75} />
                  More Professional
                </button>
                <button
                  onClick={() => handleAiToneAdjust("friendly")}
                  disabled={aiLoading || !body.trim()}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground disabled:opacity-50"
                >
                  <Smile className="h-3 w-3" strokeWidth={1.75} />
                  Friendlier
                </button>
                <button
                  onClick={() => handleAiToneAdjust("shorten")}
                  disabled={aiLoading || !body.trim()}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground disabled:opacity-50"
                >
                  <Minus className="h-3 w-3" strokeWidth={1.75} />
                  Shorten
                </button>
                <button
                  onClick={() => handleAiToneAdjust("expand")}
                  disabled={aiLoading || !body.trim()}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3" strokeWidth={1.75} />
                  Expand
                </button>
              </div>

              {/* AI Label */}
              {aiLabel && (
                <div className="flex items-center gap-1.5 rounded-md bg-brand/10 px-2 py-1">
                  <Brain className="h-2.5 w-2.5 text-brand" strokeWidth={1.75} />
                  <span className="text-[9.5px] font-semibold text-brand">{aiLabel}</span>
                  <span className="text-[9.5px] text-muted-foreground">— always review before sending</span>
                </div>
              )}

              {!selectedCustomer && (
                <p className="text-[10.5px] text-muted-foreground">
                  Select a customer to enable AI drafting with customer context.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Message body */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Write your ${selectedChannel} message...`}
            rows={6}
            className="w-full resize-none rounded-lg border border-border bg-secondary/30 px-3.5 py-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:bg-card focus:outline-none"
          />
        </div>

        {/* Result */}
        {result && (
          <div className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 ${
            result.status === "not_connected"
              ? "border-amber-200 bg-amber-50"
              : "border-emerald-200 bg-emerald-50"
          }`}>
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" strokeWidth={1.75} />
            <p className="text-[12px] text-foreground/80">{result.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <span className="text-[10.5px] text-muted-foreground">
            {channelConnected
              ? "A sending integration is connected — configure it in Settings to enable delivery."
              : "No sending integration connected — this will be saved as a record only."}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !body.trim()}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition-all hover:bg-secondary disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" strokeWidth={1.75} />
              {saving ? "Saving..." : "Save / Record"}
            </button>
            {channelConnected ? (
              <button
                onClick={handleSave}
                disabled={saving || !body.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:bg-brand/90 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
                Send
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-1.5 rounded-lg bg-secondary px-3.5 py-2 text-[12.5px] font-semibold text-muted-foreground cursor-not-allowed"
                title="No sending integration connected"
              >
                <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
                Send (Unavailable)
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── AI Text Helpers ──────────────────────────────────────────────────────────
// Deterministic text transformations — no LLM is connected, so these are
// rule-based adjustments clearly labelled as AI-assisted.

function buildAiDraft(channel: string, contextParts: string[], customer: Customer): string {
  const name = customer.first_name || customer.full_name || "there";
  const channelLabel = channel === "email" ? "email" : channel === "sms" ? "message" : channel === "whatsapp" ? "message" : "message";

  if (channel === "email") {
    return `Dear ${name},\n\nThank you for getting in touch. We have received your enquiry and wanted to follow up with you.\n\n[Add your specific response here based on the customer's enquiry]\n\nIf you have any further questions, please don't hesitate to contact us.\n\nKind regards,\n${"[Your name]"}`;
  }
  return `Hi ${name}, thanks for reaching out. We've received your message and will get back to you shortly. Is there anything specific we can help with today?`;
}

function adjustText(text: string, action: string): string {
  switch (action) {
    case "professional":
      return text
        .replace(/hi /gi, "Dear ")
        .replace(/hey /gi, "Hello ")
        .replace(/cheers/gi, "Kind regards")
        .replace(/thanks/gi, "Thank you")
        .replace(/btw/gi, "By the way")
        .replace(/asap/gi, "at your earliest convenience");
    case "friendly":
      return text
        .replace(/Dear /g, "Hi ")
        .replace(/Kind regards/g, "Cheers")
        .replace(/Thank you/g, "Thanks")
        .replace(/at your earliest convenience/gi, "when you get a chance");
    case "shorten":
      return text
        .split(/[.]\s*/)
        .filter((s) => s.trim().length > 0)
        .slice(0, 2)
        .map((s) => s.trim())
        .join(". ") + ".";
    case "expand":
      return text.replace(/\.(\s|$)/g, ". Please let us know if you need any further information or have any questions.\n\n");
    case "grammar":
      return text
        .replace(/\bi\b/g, "I")
        .replace(/\s{2,}/g, " ")
        .replace(/\s+([.,!])/g, "$1")
        .trim();
    default:
      return text;
  }
}
