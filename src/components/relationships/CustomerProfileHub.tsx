import { useState, useEffect } from "react";
import {
  Activity,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Tag,
  Clock,
  CircleDollarSign,
  Briefcase,
  FileText,
  MessageSquare,
  Star,
  Plus,
  Edit3,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Send,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Brain,
  Zap,
  TrendingUp,
  Sparkles,
  HelpCircle,
  Target,
} from "lucide-react";
import type { Customer } from "@/lib/database.types";
import type { CustomerDNAContext } from "@/services/relationshipAnalytics";
import { associateCustomerWithCampaign } from "@/services/relationshipAnalytics";
import { supabase } from "@/lib/supabase";
import { appEvents, APP_EVENTS } from "@/lib/events";
import { AIDisclosure } from "@/components/ui/AIDisclosure";
import { toast } from "sonner";

interface CustomerProfileHubProps {
  customer: Customer;
  businessId: string | undefined;
  context: CustomerDNAContext | null;
  loadingContext: boolean;
  onBackToList: () => void;
  onEdit: () => void;
  onRefresh: () => void;
}

type ProfileTab = "overview" | "opportunities" | "intelligence" | "jobs" | "invoices" | "comms" | "reviews" | "notes";

export function CustomerProfileHub({
  customer,
  businessId,
  context,
  loadingContext,
  onBackToList,
  onEdit,
  onRefresh,
}: CustomerProfileHubProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const name = customer.full_name || `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Customer";
  const initials = name.slice(0, 2).toUpperCase();

  // Campaign linking state
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [linkingCampaign, setLinkingCampaign] = useState(false);

  // Quick note creation
  const [noteText, setNoteText] = useState("");
  const [addingNote, setSavingNote] = useState(false);

  // Quick task creation
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [addingTask, setSavingTask] = useState(false);

  const handleLinkCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId || !businessId) return;
    setLinkingCampaign(true);

    try {
      const ok = await associateCustomerWithCampaign(customer.id, selectedCampaignId, businessId);
      if (ok) {
        toast.success("Customer associated with campaign successfully.");
        setSelectedCampaignId("");
        appEvents.emit(APP_EVENTS.CUSTOMERS_MUTATED);
        onRefresh();
      } else {
        toast.error("Failed to link customer to campaign.");
      }
    } catch (err: any) {
      toast.error(`Error linking campaign: ${err?.message || String(err)}`);
    } finally {
      setLinkingCampaign(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !businessId) return;
    setSavingNote(true);

    try {
      const updatedNotes = customer.notes
        ? `${customer.notes}\n\n[${new Date().toLocaleDateString("en-GB")}] ${noteText.trim()}`
        : `[${new Date().toLocaleDateString("en-GB")}] ${noteText.trim()}`;

      const { error } = await supabase
        .from("customers")
        .update({ notes: updatedNotes, updated_at: new Date().toISOString() })
        .eq("id", customer.id)
        .eq("business_id", businessId);

      if (error) throw error;

      toast.success("Relationship note appended successfully.");
      setNoteText("");
      appEvents.emit(APP_EVENTS.CUSTOMERS_MUTATED);
      onRefresh();
    } catch (err: any) {
      toast.error(`Failed to add note: ${err?.message || String(err)}`);
    } finally {
      setSavingNote(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !businessId) return;
    setSavingTask(true);

    try {
      const { error } = await supabase.from("tasks").insert({
        business_id: businessId,
        customer_id: customer.id,
        title: taskTitle.trim(),
        due_date: taskDueDate || null,
        priority: "medium",
        status: "todo",
      });

      if (error) throw error;

      toast.success("Task created and linked to customer profile.");
      setTaskTitle("");
      setTaskDueDate("");
      appEvents.emit(APP_EVENTS.TASKS_MUTATED);
      onRefresh();
    } catch (err: any) {
      toast.error(`Failed to create task: ${err?.message || String(err)}`);
    } finally {
      setSavingTask(false);
    }
  };

  const intel = context?.intelligenceDna;
  const opps = context?.customerOpportunities || [];
  const campaigns = context?.connectedCampaigns || [];

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-card">
      {/* Profile Header Bar */}
      <div className="flex items-center justify-between border-b border-border p-5 bg-card">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToList}
            className="lg:hidden grid h-8 w-8 place-items-center rounded-xl border border-border text-muted-foreground hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-foreground text-background text-[15px] font-black">
            {initials}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold tracking-tight text-foreground">{name}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase ${
                customer.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-secondary text-muted-foreground"
              }`}>
                {customer.status}
              </span>
              {customer.customer_type === "business" && (
                <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[9.5px] font-bold text-blue-500 uppercase flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Business
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-[11.5px] text-muted-foreground">
              {customer.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {customer.email}
                </span>
              )}
              {customer.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {customer.phone}
                </span>
              )}
              {customer.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {customer.city}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-[12px] font-semibold text-foreground hover:bg-secondary transition-colors"
        >
          <Edit3 className="h-3.5 w-3.5" /> Edit Record
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-border bg-secondary/20 px-5 overflow-x-auto text-[12px] font-semibold">
        {[
          { id: "overview", label: "Overview", icon: CircleDollarSign },
          { id: "opportunities", label: `Opportunities (${opps.length})`, icon: TrendingUp },
          { id: "intelligence", label: "Customer Intelligence DNA", icon: Brain },
          { id: "jobs", label: `Jobs (${context?.connectedJobs.length ?? 0})`, icon: Briefcase },
          { id: "invoices", label: `Invoices (${context?.connectedInvoices.length ?? 0})`, icon: FileText },
          { id: "comms", label: `Communications (${context?.connectedComms.length ?? 0})`, icon: MessageSquare },
          { id: "reviews", label: `Reviews (${context?.connectedReviews.length ?? 0})`, icon: Star },
          { id: "notes", label: "Notes & Consent", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ProfileTab)}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-3 transition-colors shrink-0 ${
                isActive
                  ? "border-brand text-brand font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {loadingContext ? (
          <div className="p-12 text-center text-xs text-muted-foreground italic">
            Fetching customer profile intelligence...
          </div>
        ) : activeTab === "overview" && context ? (
          <div className="space-y-6">
            {/* KPI Overview Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="text-[11px] font-medium text-muted-foreground">Lifetime Value</div>
                <div className="mt-1 text-[22px] font-bold text-foreground">
                  £{Number(customer.lifetime_value || 0).toLocaleString("en-GB")}
                </div>
                <div className="mt-0.5 text-[10.5px] text-muted-foreground">Workspace collection history</div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground">Relationship Health</span>
                  <span className="rounded bg-brand/10 px-1 py-0.2 text-[8.5px] font-extrabold text-brand uppercase">
                    {context.authoritativeHealth.provenance}
                  </span>
                </div>
                <div className="mt-1 text-[22px] font-bold text-foreground">
                  {context.authoritativeHealth.overallScore !== null ? `${context.authoritativeHealth.overallScore} / 100` : "N/A"}
                  <span className="ml-2 text-[12px] font-bold text-brand uppercase">{context.authoritativeHealth.overallLabel}</span>
                </div>
                <div className="mt-0.5 text-[10.5px] text-muted-foreground truncate">{context.authoritativeHealth.explanation.summary}</div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="text-[11px] font-medium text-muted-foreground">Unpaid Balance</div>
                <div className={`mt-1 text-[22px] font-bold ${context.unpaidBalance > 0 ? "text-red-500" : "text-emerald-500"}`}>
                  £{context.unpaidBalance.toLocaleString("en-GB")}
                </div>
                <div className="mt-0.5 text-[10.5px] text-muted-foreground">Active open invoices</div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="text-[11px] font-medium text-muted-foreground">Preferred Channel</div>
                <div className="mt-1 text-[22px] font-bold text-foreground">{context.preferredChannel}</div>
                <div className="mt-0.5 text-[10.5px] text-muted-foreground">Customer contact rule</div>
              </div>
            </div>

            {/* Campaign Connection Block */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-brand" />
                  <span className="text-[13.5px] font-bold text-foreground">Associated Campaigns ({campaigns.length})</span>
                </div>
              </div>

              {campaigns.length === 0 ? (
                <div className="text-xs text-muted-foreground italic">No active campaigns linked to this customer account.</div>
              ) : (
                <div className="divide-y divide-border border border-border rounded-xl">
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-foreground">{camp.name}</div>
                        <div className="text-[10.5px] text-muted-foreground">Target: £{camp.target_value.toLocaleString("en-GB")}</div>
                      </div>
                      <span className="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase">{camp.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Customer to Campaign Form */}
              {context && context.connectedCampaigns && (
                <form onSubmit={handleLinkCampaign} className="pt-2 flex items-center gap-2">
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="h-9 flex-1 rounded-xl border border-border bg-secondary/30 px-3 text-[12px] text-foreground focus:outline-none"
                  >
                    <option value="">Select workspace campaign to associate...</option>
                    {context.connectedCampaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type})
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={linkingCampaign || !selectedCampaignId}
                    className="h-9 rounded-xl bg-brand px-3.5 text-[11.5px] font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {linkingCampaign ? "Linking..." : "Link Campaign"}
                  </button>
                </form>
              )}
            </div>

            {/* Quick Action Forms: Append Note & Create Task */}
            <div className="grid gap-4 sm:grid-cols-2">
              <form onSubmit={handleAddNote} className="rounded-2xl border border-border bg-secondary/20 p-4 space-y-3">
                <div className="text-[12.5px] font-bold text-foreground">Append Relationship Note</div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record customer preferences, phone call notes, or follow-up details..."
                  rows={2}
                  className="w-full rounded-xl border border-border bg-card p-2.5 text-[12px] text-foreground focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={addingNote}
                  className="rounded-xl bg-brand px-4 py-1.5 text-[11.5px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {addingNote ? "Saving..." : "Save Note"}
                </button>
              </form>

              <form onSubmit={handleAddTask} className="rounded-2xl border border-border bg-secondary/20 p-4 space-y-3">
                <div className="text-[12.5px] font-bold text-foreground">Create Task for Customer</div>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Send updated proposal quote"
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-[12px] text-foreground focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-card px-3 py-1.5 text-[11.5px] text-foreground focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={addingTask}
                    className="rounded-xl bg-foreground px-4 py-1.5 text-[11.5px] font-semibold text-background hover:bg-foreground/85 disabled:opacity-50"
                  >
                    {addingTask ? "Saving..." : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : activeTab === "opportunities" && context ? (
          /* ─── SECTION 8: REVENUE OPPORTUNITIES TAB ───────────────────────── */
          <div className="space-y-4">
            <AIDisclosure />
            <h3 className="text-[13.5px] font-bold text-foreground">Customer Revenue Opportunities ({opps.length})</h3>

            {opps.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground italic">
                No revenue opportunities identified for this customer record.
              </div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-2xl bg-card">
                {opps.map((opp) => (
                  <div key={opp.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9.5px] font-extrabold text-emerald-600 uppercase">
                          {opp.opportunityType.replace("_", " ")}
                        </span>
                        <span className="font-bold text-[13px] text-foreground">{opp.headline}</span>
                      </div>
                      <span className="rounded bg-secondary px-2 py-0.5 text-[9px] font-extrabold text-muted-foreground uppercase">
                        {opp.provenance}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-muted-foreground">{opp.detail}</p>
                    <p className="text-[10.5px] text-muted-foreground/70 italic">Evidence: {opp.evidence}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "intelligence" && intel ? (
          /* ─── SECTION 5: CUSTOMER INTELLIGENCE DNA TAB ────────────────────── */
          <div className="space-y-6">
            <AIDisclosure />

            {/* ─── AUTHORITATIVE RELATIONSHIP HEALTH BREAKDOWN ─────────────── */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <span className="text-[14px] font-bold text-foreground">Relationship Health Breakdown</span>
                </div>
                <span className="rounded bg-brand/10 px-2 py-0.5 text-[9.5px] font-extrabold text-brand uppercase">
                  {context.authoritativeHealth.provenance}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {[
                  context.authoritativeHealth.components.engagement,
                  context.authoritativeHealth.components.satisfaction,
                  context.authoritativeHealth.components.loyalty,
                  context.authoritativeHealth.components.advocacy,
                  context.authoritativeHealth.components.growth,
                ].map((comp) => (
                  <div key={comp.componentName} className="rounded-xl border border-border bg-secondary/20 p-3 space-y-1">
                    <div className="flex items-center justify-between text-[10.5px] font-semibold text-muted-foreground">
                      <span>{comp.componentName} ({comp.weightPct}%)</span>
                      <span className="font-extrabold text-foreground uppercase">{comp.provenance}</span>
                    </div>
                    <div className="text-[14px] font-extrabold text-foreground">{comp.formatted}</div>
                    <div className="text-[10px] text-muted-foreground/80 truncate">{comp.evidence}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Personality Profile Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <span className="text-[14px] font-bold text-foreground">AI Personality Profile</span>
                </div>
                <span className={`rounded px-2 py-0.5 text-[9.5px] font-extrabold uppercase ${
                  intel.personalityProfile.provenance === "INSUFFICIENT DATA" ? "bg-secondary text-muted-foreground" : "bg-brand/10 text-brand"
                }`}>
                  {intel.personalityProfile.provenance}
                </span>
              </div>

              <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                {intel.personalityProfile.overallSummary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[intel.personalityProfile.decisionSpeed, intel.personalityProfile.priceSensitivity, intel.personalityProfile.qualityFocus].map((trait) => (
                  <div key={trait.factorName} className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                      <span>{trait.factorName}</span>
                      <span className="font-extrabold text-foreground uppercase">{trait.provenance}</span>
                    </div>
                    <div className="text-[13px] font-bold text-foreground">{trait.label}</div>
                    <div className="text-[10.5px] text-muted-foreground/80 italic">{trait.evidence}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication DNA Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <span className="text-[14px] font-bold text-foreground">Communication DNA</span>
                </div>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9.5px] font-extrabold text-emerald-500 uppercase">
                  {intel.communicationDna.primaryChannel.provenance}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-1">
                  <div className="text-[11px] font-medium text-muted-foreground">Primary Channel</div>
                  <div className="text-[15px] font-bold text-foreground">{intel.communicationDna.primaryChannel.formatted}</div>
                  <div className="text-[10.5px] text-muted-foreground">{intel.communicationDna.primaryChannel.methodology}</div>
                </div>

                <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-1">
                  <div className="text-[11px] font-medium text-muted-foreground">Engagement Level</div>
                  <div className="text-[15px] font-bold text-foreground">{intel.communicationDna.engagementLevel.formatted}</div>
                  <div className="text-[10.5px] text-muted-foreground">{intel.communicationDna.engagementLevel.methodology}</div>
                </div>

                <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-1">
                  <div className="text-[11px] font-medium text-muted-foreground">Response Latency</div>
                  <div className="text-[15px] font-bold text-foreground">{intel.communicationDna.avgResponseTimeHours.formatted}</div>
                  <div className="text-[10.5px] text-muted-foreground">{intel.communicationDna.avgResponseTimeHours.methodology}</div>
                </div>
              </div>
            </div>

            {/* Buying DNA Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <span className="text-[14px] font-bold text-foreground">Buying DNA</span>
                </div>
                <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[9.5px] font-extrabold text-blue-500 uppercase">
                  {intel.buyingDna.avgTransactionValue.provenance}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-1">
                  <div className="text-[11px] font-medium text-muted-foreground">Avg. Invoice Transaction</div>
                  <div className="text-[15px] font-bold text-foreground">{intel.buyingDna.avgTransactionValue.formatted}</div>
                  <div className="text-[10.5px] text-muted-foreground">{intel.buyingDna.avgTransactionValue.methodology}</div>
                </div>

                <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-1">
                  <div className="text-[11px] font-medium text-muted-foreground">Account Classification</div>
                  <div className="text-[15px] font-bold text-foreground">{intel.buyingDna.spendCategory.formatted}</div>
                  <div className="text-[10.5px] text-muted-foreground">{intel.buyingDna.spendCategory.methodology}</div>
                </div>

                <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-1">
                  <div className="text-[11px] font-medium text-muted-foreground">Payment Settlement</div>
                  <div className="text-[15px] font-bold text-foreground">{intel.buyingDna.paymentPromptness.formatted}</div>
                  <div className="text-[10.5px] text-muted-foreground">{intel.buyingDna.paymentPromptness.methodology}</div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "jobs" && context ? (
          <div className="space-y-3">
            <h3 className="text-[13px] font-bold text-foreground">Connected Jobs ({context.connectedJobs.length})</h3>
            {context.connectedJobs.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No jobs linked to this customer record yet.</div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-2xl bg-card">
                {context.connectedJobs.map((j) => (
                  <div key={j.id} className="p-4 flex items-center justify-between text-[12.5px]">
                    <div>
                      <div className="font-bold text-foreground">{j.title || "Job Record"}</div>
                      <div className="text-[11px] text-muted-foreground">{j.description || "No job description"}</div>
                    </div>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase">{j.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "invoices" && context ? (
          <div className="space-y-3">
            <h3 className="text-[13px] font-bold text-foreground">Connected Invoices ({context.connectedInvoices.length})</h3>
            {context.connectedInvoices.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No invoices linked to this customer record yet.</div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-2xl bg-card">
                {context.connectedInvoices.map((inv) => (
                  <div key={inv.id} className="p-4 flex items-center justify-between text-[12.5px]">
                    <div>
                      <div className="font-bold text-foreground">Invoice #{inv.invoice_number || inv.id.slice(0, 6)}</div>
                      <div className="text-[11px] text-muted-foreground">Due: {inv.due_date || "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-foreground">£{Number(inv.total_amount || 0).toLocaleString("en-GB")}</div>
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase">{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "comms" && context ? (
          <div className="space-y-3">
            <h3 className="text-[13px] font-bold text-foreground">Communication Log ({context.connectedComms.length})</h3>
            {context.connectedComms.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No communication records logged for this customer.</div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-2xl bg-card">
                {context.connectedComms.map((cm) => (
                  <div key={cm.id} className="p-4 space-y-1 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand uppercase">{cm.channel} ({cm.direction})</span>
                      <span className="text-[10.5px] text-muted-foreground">{new Date(cm.created_at).toLocaleString("en-GB")}</span>
                    </div>
                    <p className="text-foreground/90">{cm.body || cm.subject || "No message content"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "notes" ? (
          <div className="space-y-4 text-xs">
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <div className="font-bold text-foreground">Historical Notes</div>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {customer.notes || "No notes recorded for this customer profile."}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <div className="font-bold text-foreground">Consent & Privacy Status</div>
              <div className="flex flex-col gap-1.5 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheck className={customer.gdpr_consent ? "text-emerald-500" : "text-muted-foreground"} />
                  GDPR Consent: {customer.gdpr_consent ? "Given" : "Not recorded"}
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className={customer.marketing_consent ? "text-emerald-500" : "text-muted-foreground"} />
                  Marketing Consent: {customer.marketing_consent ? "Given" : "Not recorded"}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
