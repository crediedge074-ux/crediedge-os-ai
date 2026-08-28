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
  Eye,
  Trash2,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import type { Customer } from "@/lib/database.types";
import type { CustomerDNAContext } from "@/services/relationshipAnalytics";
import {
  associateCustomerWithCampaign,
  addConfirmedCustomerMemory,
  deleteCustomerMemory,
} from "@/services/relationshipAnalytics";
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

type ProfileTab =
  | "overview"
  | "intelligence"
  | "jobs"
  | "invoices"
  | "predictions"
  | "opportunities"
  | "memories"
  | "comms"
  | "reviews"
  | "notes";

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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

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

  // Memory creation state
  const [newMemoryStatement, setNewMemoryStatement] = useState("");
  const [savingMemory, setSavingMemory] = useState(false);
  const [expandedMemoryId, setExpandedMemoryId] = useState<string | null>(null);

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

      toast.success("Relationship note saved.");
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

      toast.success("Task created for customer.");
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

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryStatement.trim() || !businessId) return;
    setSavingMemory(true);

    try {
      const ok = await addConfirmedCustomerMemory(businessId, customer.id, newMemoryStatement.trim());
      if (ok) {
        toast.success("Confirmed preference saved to AI Memory.");
        setNewMemoryStatement("");
        appEvents.emit(APP_EVENTS.CUSTOMERS_MUTATED);
        onRefresh();
      } else {
        toast.error("Failed to save memory item.");
      }
    } catch (err: any) {
      toast.error(`Error saving memory: ${err?.message || String(err)}`);
    } finally {
      setSavingMemory(false);
    }
  };

  const handleDeleteMemory = async (memoryId: string) => {
    if (!businessId) return;
    try {
      const ok = await deleteCustomerMemory(memoryId, businessId);
      if (ok) {
        toast.success("Memory item removed.");
        appEvents.emit(APP_EVENTS.CUSTOMERS_MUTATED);
        onRefresh();
      }
    } catch (err: any) {
      toast.error(`Error deleting memory: ${err?.message || String(err)}`);
    }
  };

  const intel = context?.intelligenceDna;
  const opps = context?.customerOpportunities || [];
  const campaigns = context?.connectedCampaigns || [];
  const preds = context?.customerPredictions || [];
  const memories = context?.aiMemories || [];
  const activity = context?.activityTimeline || [];

  const primaryTabs: { id: ProfileTab; label: string; icon: any; count?: number }[] = [
    { id: "overview", label: "Overview", icon: CircleDollarSign },
    { id: "intelligence", label: "Intelligence DNA", icon: Brain },
    { id: "jobs", label: "Jobs", icon: Briefcase, count: context?.connectedJobs.length },
    { id: "invoices", label: "Invoices", icon: FileText, count: context?.connectedInvoices.length },
  ];

  const secondaryTabs: { id: ProfileTab; label: string; icon: any; count?: number }[] = [
    { id: "predictions", label: "AI Predictions", icon: Zap, count: preds.length },
    { id: "opportunities", label: "Opportunities", icon: TrendingUp, count: opps.length },
    { id: "memories", label: "AI Memory", icon: Brain, count: memories.length },
    { id: "comms", label: "Communications", icon: MessageSquare, count: context?.connectedComms.length },
    { id: "reviews", label: "Reviews", icon: Star, count: context?.connectedReviews.length },
    { id: "notes", label: "Notes & Consent", icon: FileText },
  ];

  const isSecondaryActive = secondaryTabs.some((t) => t.id === activeTab);

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-card">
      {/* Profile Header Bar */}
      <div className="flex items-center justify-between border-b border-border p-6 bg-card">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToList}
            className="lg:hidden grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-foreground text-background text-[15px] font-black shadow-soft">
            {initials}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[19px] font-bold tracking-tight text-foreground">{name}</h2>
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

            <div className="mt-1 flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground">
              {customer.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {customer.email}
                </span>
              )}
              {customer.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {customer.phone}
                </span>
              )}
              {customer.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {customer.city}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-[12px] font-semibold text-foreground hover:bg-secondary transition-colors"
        >
          <Edit3 className="h-3.5 w-3.5" /> Edit Record
        </button>
      </div>

      {/* Responsive Workspace Navigation Bar */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/15 px-6 text-[12.5px] font-semibold">
        <div className="flex items-center gap-2">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setMoreDropdownOpen(false);
                }}
                className={`flex items-center gap-2 border-b-2 px-3.5 py-3.5 transition-colors shrink-0 ${
                  isActive
                    ? "border-brand text-brand font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${isActive ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`flex items-center gap-1.5 border-b-2 px-3.5 py-3.5 transition-colors ${
                isSecondaryActive
                  ? "border-brand text-brand font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span>More</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute left-0 top-12 z-50 min-w-[200px] rounded-xl border border-border bg-card p-1.5 shadow-2xl text-foreground divide-y divide-border/40">
                {secondaryTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMoreDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-[12px] font-medium transition-colors ${
                        isActive ? "bg-brand/10 text-brand font-bold" : "hover:bg-secondary/40 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.count !== undefined && (
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{tab.count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {loadingContext ? (
          <div className="p-16 text-center text-xs text-muted-foreground italic">
            Fetching customer profile workspace...
          </div>
        ) : activeTab === "overview" && context ? (
          /* ─── CUSTOMER COMMAND CENTRE OVERVIEW ────────────────────────────── */
          <div className="space-y-8 max-w-5xl">
            {/* Top KPI Metrics Row (Restrained & De-cluttered) */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Lifetime Value</div>
                <div className="text-[24px] font-extrabold text-foreground">
                  £{Number(customer.lifetime_value || 0).toLocaleString("en-GB")}
                </div>
                <div className="text-[11px] text-muted-foreground">Settled financial history</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Relationship Health</span>
                  <span className="rounded bg-brand/10 px-1.5 py-0.2 text-[8.5px] font-extrabold text-brand uppercase">
                    {context.authoritativeHealth.provenance}
                  </span>
                </div>
                <div className="text-[24px] font-extrabold text-foreground">
                  {context.authoritativeHealth.overallScore !== null ? `${context.authoritativeHealth.overallScore} / 100` : "N/A"}
                  <span className="ml-2 text-[12px] font-bold text-brand uppercase">{context.authoritativeHealth.overallLabel}</span>
                </div>
                <div className="text-[11px] text-muted-foreground truncate">{context.authoritativeHealth.explanation.summary}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Unpaid Balance</div>
                <div className={`text-[24px] font-extrabold ${context.unpaidBalance > 0 ? "text-red-500" : "text-emerald-500"}`}>
                  £{context.unpaidBalance.toLocaleString("en-GB")}
                </div>
                <div className="text-[11px] text-muted-foreground">Active open invoices</div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Preferred Channel</div>
                <div className="text-[24px] font-extrabold text-foreground">{context.preferredChannel}</div>
                <div className="text-[11px] text-muted-foreground">Contact rule</div>
              </div>
            </div>

            <hr className="border-border/60" />

            {/* Compact Recent Activity Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand" />
                  <h3 className="text-[14px] font-bold text-foreground">Recent Activity</h3>
                </div>
                {activity.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("comms")}
                    className="flex items-center gap-1 text-[11.5px] font-semibold text-brand hover:underline"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>

              {activity.length === 0 ? (
                <div className="p-4 text-xs text-muted-foreground italic bg-secondary/15 rounded-xl">
                  No recent customer activity logs recorded.
                </div>
              ) : (
                <div className="divide-y divide-border/50 border border-border/60 rounded-xl bg-card">
                  {activity.slice(0, 3).map((act) => (
                    <div key={act.id} className="p-3.5 flex items-center justify-between text-[12px]">
                      <div>
                        <div className="font-semibold text-foreground">{act.description}</div>
                        <div className="text-[10.5px] text-muted-foreground">Action: {act.action}</div>
                      </div>
                      <span className="text-[10.5px] text-muted-foreground">
                        {new Date(act.created_at).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-border/60" />

            {/* Campaign Association Block */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-brand" />
                <h3 className="text-[14px] font-bold text-foreground">Associated Campaigns ({campaigns.length})</h3>
              </div>

              {campaigns.length === 0 ? (
                <div className="text-xs text-muted-foreground italic">No active campaigns linked to this customer account.</div>
              ) : (
                <div className="divide-y divide-border border border-border/60 rounded-xl">
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

            <hr className="border-border/60" />

            {/* Quick Actions: Note & Task */}
            <div className="grid gap-6 sm:grid-cols-2">
              <form onSubmit={handleAddNote} className="space-y-3">
                <div className="text-[13px] font-bold text-foreground">Append Relationship Note</div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record customer preferences, call notes, or follow-up details..."
                  rows={2}
                  className="w-full rounded-xl border border-border bg-card p-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <button
                  type="submit"
                  disabled={addingNote}
                  className="rounded-xl bg-brand px-4 py-2 text-[11.5px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {addingNote ? "Saving..." : "Save Note"}
                </button>
              </form>

              <form onSubmit={handleAddTask} className="space-y-3">
                <div className="text-[13px] font-bold text-foreground">Create Task for Customer</div>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Send updated proposal quote"
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-[11.5px] text-foreground focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={addingTask}
                    className="rounded-xl bg-foreground px-4 py-2 text-[11.5px] font-semibold text-background hover:bg-foreground/85 disabled:opacity-50"
                  >
                    {addingTask ? "Saving..." : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : activeTab === "predictions" && context ? (
          <div className="space-y-4 max-w-5xl">
            <AIDisclosure />
            <h3 className="text-[14px] font-bold text-foreground">Customer AI Predictions ({preds.length})</h3>

            {preds.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground italic bg-secondary/10 rounded-2xl">
                No active predictions available. Requires historical transaction/activity logs.
              </div>
            ) : (
              <div className="divide-y divide-border border border-border/60 rounded-2xl bg-card">
                {preds.map((pred) => (
                  <div key={pred.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-brand/10 px-2 py-0.5 text-[9.5px] font-extrabold text-brand uppercase">
                          {pred.predictionType.replace("_", " ")}
                        </span>
                        <span className="font-bold text-[13px] text-foreground">{pred.prediction}</span>
                      </div>
                      <span className="rounded bg-secondary px-2 py-0.5 text-[9px] font-extrabold text-muted-foreground uppercase">
                        {pred.provenance}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="font-bold text-brand">{pred.formattedProbability}</span>
                      <span>•</span>
                      <span>{pred.timeframe}</span>
                    </div>
                    <p className="text-[10.5px] text-muted-foreground/80 italic">Evidence: {pred.evidence}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "opportunities" && context ? (
          <div className="space-y-4 max-w-5xl">
            <AIDisclosure />
            <h3 className="text-[14px] font-bold text-foreground">Customer Revenue Opportunities ({opps.length})</h3>

            {opps.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground italic bg-secondary/10 rounded-2xl">
                No revenue opportunities identified for this customer record.
              </div>
            ) : (
              <div className="divide-y divide-border border border-border/60 rounded-2xl bg-card">
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
          <div className="space-y-8 max-w-5xl">
            <AIDisclosure />

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-brand" />
                  <h3 className="text-[14px] font-bold text-foreground">Relationship Health Breakdown</h3>
                </div>
                <span className="rounded bg-brand/10 px-2 py-0.5 text-[9.5px] font-extrabold text-brand uppercase">
                  {context.authoritativeHealth.provenance}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  context.authoritativeHealth.components.engagement,
                  context.authoritativeHealth.components.satisfaction,
                  context.authoritativeHealth.components.loyalty,
                  context.authoritativeHealth.components.advocacy,
                  context.authoritativeHealth.components.growth,
                ].map((comp) => (
                  <div key={comp.componentName} className="p-3.5 border border-border/60 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[10.5px] font-semibold text-muted-foreground">
                      <span>{comp.componentName}</span>
                      <span className="font-extrabold text-foreground uppercase">{comp.provenance}</span>
                    </div>
                    <div className="text-[15px] font-extrabold text-foreground">{comp.formatted}</div>
                    <div className="text-[10px] text-muted-foreground/80 truncate">{comp.evidence}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-brand" />
                  <h3 className="text-[14px] font-bold text-foreground">AI Personality Profile</h3>
                </div>
                <span className="rounded bg-brand/10 px-2 py-0.5 text-[9.5px] font-extrabold text-brand uppercase">
                  {intel.personalityProfile.provenance}
                </span>
              </div>

              <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                {intel.personalityProfile.overallSummary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {[intel.personalityProfile.decisionSpeed, intel.personalityProfile.priceSensitivity, intel.personalityProfile.qualityFocus].map((trait) => (
                  <div key={trait.factorName} className="p-4 border border-border/60 rounded-xl space-y-1.5">
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
          </div>
        ) : activeTab === "memories" ? (
          <div className="space-y-6 max-w-5xl">
            <AIDisclosure />

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-brand" />
                  <h3 className="text-[14px] font-bold text-foreground">Customer AI Memory Architecture</h3>
                </div>
                <span className="rounded bg-brand/10 px-2 py-0.5 text-[9.5px] font-extrabold text-brand uppercase">
                  CONFIRMED • OBSERVED • AI INTERPRETATION
                </span>
              </div>

              <form onSubmit={handleAddMemory} className="flex gap-2">
                <input
                  type="text"
                  value={newMemoryStatement}
                  onChange={(e) => setNewMemoryStatement(e.target.value)}
                  placeholder="Record explicit confirmed customer preference (e.g. Prefers morning appointments)..."
                  className="flex-1 rounded-xl border border-border bg-secondary/20 px-3.5 py-2 text-[12px] text-foreground focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={savingMemory || !newMemoryStatement.trim()}
                  className="rounded-xl bg-brand px-4 py-2 text-[11.5px] font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {savingMemory ? "Saving..." : "Add Confirmed Memory"}
                </button>
              </form>

              {memories.length === 0 ? (
                <div className="p-12 text-center text-xs text-muted-foreground italic bg-secondary/10 rounded-2xl">
                  No memory records found for this customer profile.
                </div>
              ) : (
                <div className="divide-y divide-border border border-border/60 rounded-xl bg-card">
                  {memories.map((mem) => {
                    const isExpanded = expandedMemoryId === mem.id;
                    return (
                      <div key={mem.id} className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`rounded px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                                mem.memoryType === "CONFIRMED"
                                  ? "bg-emerald-500/10 text-emerald-600 font-bold"
                                  : mem.memoryType === "OBSERVED"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-purple-500/10 text-purple-500"
                              }`}>
                                {mem.memoryType}
                              </span>
                              <span className="font-bold text-[13px] text-foreground">{mem.statement}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">{mem.explanation}</p>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setExpandedMemoryId(isExpanded ? null : mem.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="h-3 w-3" /> Why do we know this?
                              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>

                            {mem.isPersistentInDb && (
                              <button
                                type="button"
                                onClick={() => handleDeleteMemory(mem.id)}
                                className="p-1 rounded-lg text-muted-foreground hover:text-red-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-2 rounded-xl border border-border bg-secondary/20 p-3.5 space-y-1.5 text-[11.5px]">
                            <div className="font-bold text-foreground text-[11px] uppercase tracking-wider">Grounding Evidence & Provenance:</div>
                            <p className="text-muted-foreground"><strong className="text-foreground">Why Do We Know This:</strong> {mem.whyDoWeKnowThis}</p>
                            <p className="text-muted-foreground"><strong className="text-foreground">Supporting Records:</strong> {mem.supportingRecords.join(", ") || "Workspace profile ledger"}</p>
                            <p className="text-muted-foreground"><strong className="text-foreground">Timeframe:</strong> {mem.timeframe || "Profile Lifetime"}</p>
                            <p className="text-muted-foreground"><strong className="text-foreground">Provenance:</strong> {mem.provenance}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "jobs" && context ? (
          <div className="space-y-4 max-w-5xl">
            <h3 className="text-[14px] font-bold text-foreground">Connected Jobs ({context.connectedJobs.length})</h3>
            {context.connectedJobs.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground italic bg-secondary/10 rounded-2xl">
                No jobs linked yet. Jobs will appear here once connected to this customer.
              </div>
            ) : (
              <div className="divide-y divide-border border border-border/60 rounded-2xl bg-card">
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
          <div className="space-y-4 max-w-5xl">
            <h3 className="text-[14px] font-bold text-foreground">Connected Invoices ({context.connectedInvoices.length})</h3>
            {context.connectedInvoices.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground italic bg-secondary/10 rounded-2xl">
                No invoices linked yet. Invoice activity will appear here once transactions are connected.
              </div>
            ) : (
              <div className="divide-y divide-border border border-border/60 rounded-2xl bg-card">
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
          <div className="space-y-4 max-w-5xl">
            <h3 className="text-[14px] font-bold text-foreground">Communication Log ({context.connectedComms.length})</h3>
            {context.connectedComms.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground italic bg-secondary/10 rounded-2xl">
                No communication history yet. Recorded customer interactions will appear here.
              </div>
            ) : (
              <div className="divide-y divide-border border border-border/60 rounded-2xl bg-card">
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
          <div className="space-y-6 text-xs max-w-5xl">
            <div className="p-5 border border-border/60 rounded-2xl space-y-2">
              <div className="font-bold text-foreground text-[13px]">Historical Notes</div>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-[12px]">
                {customer.notes || "No notes recorded for this customer profile."}
              </p>
            </div>

            <div className="p-5 border border-border/60 rounded-2xl space-y-2">
              <div className="font-bold text-foreground text-[13px]">Consent & Privacy Status</div>
              <div className="flex flex-col gap-2 text-muted-foreground text-[12px]">
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
