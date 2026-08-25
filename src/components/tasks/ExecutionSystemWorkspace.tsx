import { useState, useEffect } from "react";
import {
  Target,
  Clock,
  User,
  Check,
  Edit3,
  Plus,
  X,
  ChevronRight,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Archive,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Zap,
  Building2,
  Briefcase,
  Receipt,
  PoundSterling,
  Link,
  Unlink,
  Send,
  ThumbsUp,
  Heart,
  Play,
  Square,
} from "lucide-react";
import type { CalculatedCampaign, StoredCampaign } from "@/services/campaigns";
import type { CalculatedMission, StoredMission } from "@/services/missions";
import type { Task, Customer, Job, Invoice } from "@/lib/database.types";
import type { WorkspaceMemberInfo } from "@/services/tasks";
import { updateCampaign } from "@/services/campaigns";
import { updateMission, createMission } from "@/services/missions";
import { updateTask, moveTaskMission } from "@/services/tasks";
import {
  fetchTaskTimeEntries,
  startTaskTimer,
  stopTaskTimer,
  addManualTimeEntry,
  updateTimeEntryNotes,
  calculateTaskProductivity,
  type TaskTimeEntry,
  type TaskProductivityMetrics,
} from "@/services/timeTracking";
import {
  evaluateTaskBusinessImpact,
  TARGET_METRIC_OPTIONS,
  type TaskBusinessImpactEvaluation,
} from "@/services/taskImpact";
import { getCustomers } from "@/services/customers";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Award } from "lucide-react";

interface ExecutionSystemWorkspaceProps {
  businessId: string;
  campaign?: CalculatedCampaign | null;
  mission?: CalculatedMission | null;
  task?: Task | null;
  allCampaigns: CalculatedCampaign[];
  allMissions: CalculatedMission[];
  allTasks: Task[];
  members: WorkspaceMemberInfo[];
  onClose: () => void;
  onRefresh: () => void;
  onSelectCampaign: (c: CalculatedCampaign) => void;
  onSelectMission: (m: CalculatedMission) => void;
  onSelectTask: (t: Task) => void;
  onCreateTaskInMission?: (missionId: string) => void;
}

export function ExecutionSystemWorkspace({
  businessId,
  campaign,
  mission,
  task,
  allCampaigns,
  allMissions,
  allTasks,
  members,
  onClose,
  onRefresh,
  onSelectCampaign,
  onSelectMission,
  onSelectTask,
  onCreateTaskInMission,
}: ExecutionSystemWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"strategy" | "workstreams" | "entities" | "activity">("strategy");

  // Connected entity datasets
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingEntities, setLoadingEntities] = useState(false);

  // Productivity & Time Tracking State
  const [timeEntries, setTimeEntries] = useState<TaskTimeEntry[]>([]);
  const [productivity, setProductivity] = useState<TaskProductivityMetrics | null>(null);
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
  const [manualMinutes, setManualMinutes] = useState<string>("");
  const [manualNotes, setManualNotes] = useState<string>("");
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Editing Note State
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editNotesText, setEditNotesText] = useState<string>("");

  // Business Impact Evaluation State
  const [impactEval, setImpactEval] = useState<TaskBusinessImpactEvaluation | null>(null);
  const [impactLoading, setImpactLoading] = useState(false);

  // Link selectors
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const [linking, setLinking] = useState(false);

  // Current entity context
  const currentTask = task;
  const currentMission = mission || (currentTask ? allMissions.find((m) => m.id === (currentTask as any).mission_id) : null);
  const currentCampaign = campaign || (currentMission ? allCampaigns.find((c) => c.id === currentMission.campaign_id) : null);

  const memberMap = members.reduce<Record<string, string>>((acc, m) => {
    acc[m.userId] = m.fullName;
    return acc;
  }, {});

  // Load connected entities & time entries
  useEffect(() => {
    if (!businessId) return;
    setLoadingEntities(true);
    Promise.all([
      getCustomers(businessId).catch(() => []),
      supabase.from("jobs").select("*").eq("business_id", businessId).then((r) => r.data || []),
      supabase.from("invoices").select("*").eq("business_id", businessId).then((r) => r.data || []),
      currentTask ? fetchTaskTimeEntries(currentTask.id, businessId) : Promise.resolve([]),
      currentTask ? calculateTaskProductivity(currentTask.id, businessId) : Promise.resolve(null),
    ])
      .then(([custList, jobList, invList, tEntries, prodMetrics]) => {
        setCustomers(custList);
        setJobs(jobList as Job[]);
        setInvoices(invList as Invoice[]);
        setTimeEntries(tEntries);
        setProductivity(prodMetrics);
        const activeEntry = tEntries.find((e) => !e.endTime && e.entryType === "timer");
        if (activeEntry) setActiveTimerId(activeEntry.id);
      })
      .finally(() => setLoadingEntities(false));

    if (currentTask) {
      setImpactLoading(true);
      evaluateTaskBusinessImpact(currentTask, businessId)
        .then((res) => setImpactEval(res))
        .catch((err) => console.error("Impact evaluation failed:", err))
        .finally(() => setImpactLoading(false));
    }
  }, [businessId, currentTask]);

  const handleStartTimer = async () => {
    if (!businessId || !currentTask) return;
    setTrackingLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || null;
      const entry = await startTaskTimer(currentTask.id, businessId, currentUserId);
      setActiveTimerId(entry.id);
      const updatedEntries = await fetchTaskTimeEntries(currentTask.id, businessId);
      setTimeEntries(updatedEntries);
      const updatedProd = await calculateTaskProductivity(currentTask.id, businessId);
      setProductivity(updatedProd);
    } catch (err: any) {
      alert(`Timer error: ${err.message || String(err)}`);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleStopTimer = async () => {
    if (!businessId || !currentTask || !activeTimerId) return;
    setTrackingLoading(true);
    try {
      await stopTaskTimer(activeTimerId, businessId, manualNotes);
      setActiveTimerId(null);
      setManualNotes("");
      const updatedEntries = await fetchTaskTimeEntries(currentTask.id, businessId);
      setTimeEntries(updatedEntries);
      const updatedProd = await calculateTaskProductivity(currentTask.id, businessId);
      setProductivity(updatedProd);
    } catch (err: any) {
      alert(`Timer error: ${err.message || String(err)}`);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleAddManualTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId || !currentTask || !manualMinutes) return;
    setTrackingLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || null;
      await addManualTimeEntry({
        taskId: currentTask.id,
        businessId,
        userId: currentUserId,
        durationMinutes: Number(manualMinutes),
        notes: manualNotes.trim() || null,
      });
      setManualMinutes("");
      setManualNotes("");
      const updatedEntries = await fetchTaskTimeEntries(currentTask.id, businessId);
      setTimeEntries(updatedEntries);
      const updatedProd = await calculateTaskProductivity(currentTask.id, businessId);
      setProductivity(updatedProd);
    } catch (err: any) {
      alert(`Manual time error: ${err.message || String(err)}`);
    } finally {
      setTrackingLoading(false);
    }
  };

  // Derived current links
  const targetEntity = currentTask || currentMission || currentCampaign;
  const activeCustomerId = targetEntity?.customer_id;
  const activeJobId = targetEntity?.job_id;
  const activeInvoiceId = (targetEntity as any)?.invoice_id;

  const linkedCustomer = customers.find((c) => c.id === activeCustomerId);
  const linkedJob = jobs.find((j) => j.id === activeJobId);
  const linkedInvoice = invoices.find((i) => i.id === activeInvoiceId);

  // Link entity handler
  const handleLinkEntity = async (type: "customer" | "job" | "invoice", entityId: string | null) => {
    if (!businessId || !targetEntity) return;
    setLinking(true);
    try {
      if (currentTask) {
        await updateTask(currentTask.id, businessId, { [`${type}_id`]: entityId } as any);
      } else if (currentMission) {
        await updateMission(currentMission.id, businessId, { [`${type}_id`]: entityId } as any);
      } else if (currentCampaign) {
        await updateCampaign(currentCampaign.id, businessId, { [`${type}_id`]: entityId } as any);
      }
      onRefresh();
    } catch (err: any) {
      alert(`Failed to update relationship: ${err?.message || String(err)}`);
    } finally {
      setLinking(false);
    }
  };

  // Associated items
  const linkedMissions = currentCampaign ? allMissions.filter((m) => m.campaign_id === currentCampaign.id) : [];
  const linkedTasks = currentMission
    ? allTasks.filter((t: any) => t.mission_id === currentMission.id)
    : currentCampaign
    ? allTasks.filter((t: any) => t.campaign_id === currentCampaign.id || linkedMissions.some((m) => m.id === t.mission_id))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header & Hierarchy Breadcrumb */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/30">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-1.5 text-[11.5px] font-semibold text-muted-foreground">
              <span className="text-foreground/70">Strategic Command</span>
              <ChevronRight className="h-3.5 w-3.5" />

              {currentCampaign && (
                <button
                  type="button"
                  onClick={() => onSelectCampaign(currentCampaign)}
                  className={`hover:text-foreground ${!currentMission && !currentTask ? "font-extrabold text-foreground" : ""}`}
                >
                  Campaign: {currentCampaign.name}
                </button>
              )}

              {currentMission && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <button
                    type="button"
                    onClick={() => onSelectMission(currentMission)}
                    className={`hover:text-foreground ${!currentTask ? "font-extrabold text-foreground" : ""}`}
                  >
                    Mission: {currentMission.title}
                  </button>
                </>
              )}

              {currentTask && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="font-extrabold text-foreground">Task: {currentTask.title}</span>
                </>
              )}
            </div>

            {/* Operational Context Sub-Breadcrumb */}
            {(linkedCustomer || linkedJob || linkedInvoice) && (
              <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-600">
                <span>Operational Context:</span>
                {linkedCustomer && <span>Customer: {linkedCustomer.full_name || linkedCustomer.company_name}</span>}
                {linkedJob && <span>• Job: {linkedJob.job_number} ({linkedJob.title})</span>}
                {linkedInvoice && <span>• Invoice: {linkedInvoice.invoice_number}</span>}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-b border-border px-6 py-3 bg-card text-[13px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("strategy")}
            className={`pb-1 transition-all ${
              activeTab === "strategy" ? "border-b-2 border-brand text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Strategy & Context
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("workstreams")}
            className={`pb-1 transition-all ${
              activeTab === "workstreams" ? "border-b-2 border-brand text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {currentTask ? "Task Context" : currentMission ? `Linked Tasks (${linkedTasks.length})` : `Missions & Workstreams (${linkedMissions.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("entities")}
            className={`pb-1 transition-all ${
              activeTab === "entities" ? "border-b-2 border-brand text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Connected Business Records
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`pb-1 transition-all ${
              activeTab === "activity" ? "border-b-2 border-brand text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Performance & Activity
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "strategy" && (
            <div className="space-y-6">
              {currentCampaign && !currentMission && !currentTask && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="rounded-md bg-brand/10 px-2.5 py-0.5 text-[10.5px] font-bold text-brand uppercase tracking-wider">
                        Strategic Campaign
                      </span>
                      <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-700">
                        {currentCampaign.health} Health
                      </span>
                    </div>
                    <h2 className="text-[22px] font-black text-foreground">{currentCampaign.name}</h2>
                    <p className="mt-1.5 text-[13.5px] text-muted-foreground leading-relaxed">
                      {currentCampaign.description || "No strategic objective summary specified."}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Target Description</div>
                      <div className="text-[14px] font-bold text-foreground mt-0.5">
                        {currentCampaign.target_description || "N/A"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Business Value</div>
                      <div className="text-[14px] font-extrabold text-emerald-600 mt-0.5">
                        £{Number(currentCampaign.business_value).toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Target Deadline</div>
                      <div className="text-[14px] font-bold text-foreground mt-0.5">
                        {currentCampaign.deadline ? new Date(currentCampaign.deadline).toLocaleDateString("en-GB") : "No deadline"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Operational Progress</div>
                      <div className="text-[14px] font-extrabold text-brand mt-0.5">
                        {currentCampaign.progressPct}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentMission && !currentTask && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[10.5px] font-bold text-blue-700 uppercase tracking-wider">
                        Workstream Mission
                      </span>
                      {currentCampaign && (
                        <span className="text-[12px] font-semibold text-muted-foreground">
                          Campaign: <span className="text-foreground">{currentCampaign.name}</span>
                        </span>
                      )}
                    </div>
                    <h2 className="text-[22px] font-black text-foreground">{currentMission.title}</h2>
                    <p className="mt-1.5 text-[13.5px] text-muted-foreground leading-relaxed">
                      {currentMission.description || "No mission objective details provided."}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Status</div>
                      <div className="text-[14px] font-bold text-foreground capitalize mt-0.5">{currentMission.status}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Operational Progress</div>
                      <div className="text-[14px] font-extrabold text-brand mt-0.5">{currentMission.progressPct}%</div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Tasks Completed</div>
                      <div className="text-[14px] font-bold text-foreground mt-0.5">
                        {currentMission.completedTasks} / {currentMission.totalTasks}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentTask && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[10.5px] font-bold text-amber-700 uppercase tracking-wider">
                        Executable Task
                      </span>
                      <span className="text-[12px] font-semibold text-muted-foreground">
                        Priority: <span className="text-foreground uppercase">{currentTask.priority}</span>
                      </span>
                    </div>
                    <h2 className="text-[22px] font-black text-foreground">{currentTask.title}</h2>
                    <p className="mt-1.5 text-[13.5px] text-muted-foreground leading-relaxed">
                      {currentTask.description || "No specific execution instructions recorded."}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Assignee</div>
                      <div className="text-[14px] font-bold text-foreground mt-0.5">
                        {currentTask.assigned_to ? memberMap[currentTask.assigned_to] || "Team Member" : "Unassigned"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Due Date</div>
                      <div className="text-[14px] font-bold text-foreground mt-0.5">
                        {currentTask.due_date || "No due date"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Status</div>
                      <div className="text-[14px] font-bold text-foreground capitalize mt-0.5">{currentTask.status}</div>
                    </div>
                  </div>

                  {/* ── SECTION 8: BUSINESS IMPACT & CREDIEDGE SCORE CARD ── */}
                  <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-brand" />
                        <h4 className="text-[13px] font-bold text-foreground">Business Impact & CrediEdge Score™</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-muted-foreground">Target Metric:</span>
                        <select
                          value={(currentTask as any).target_metric || "none"}
                          onChange={async (e) => {
                            if (!businessId) return;
                            const newMetric = e.target.value;
                            try {
                              await updateTask(currentTask.id, businessId, { target_metric: newMetric } as any);
                              onRefresh();
                              const evalRes = await evaluateTaskBusinessImpact(
                                { ...currentTask, target_metric: newMetric },
                                businessId
                              );
                              setImpactEval(evalRes);
                            } catch (err: any) {
                              alert(`Failed to update target metric: ${err.message || String(err)}`);
                            }
                          }}
                          className="h-7 rounded-lg border border-border bg-card px-2.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                        >
                          {TARGET_METRIC_OPTIONS.map((opt) => (
                            <option key={opt.key} value={opt.key}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {impactLoading ? (
                      <div className="text-[12px] text-muted-foreground italic">Evaluating task impact and CrediEdge Score attribution...</div>
                    ) : impactEval ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11.5px]">
                        {/* 1. Estimated Impact */}
                        <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                          <div className="flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span>Estimated Impact</span>
                            <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9.5px] text-amber-500 font-extrabold">ESTIMATED</span>
                          </div>
                          <div className="text-sm font-extrabold text-foreground pt-1">{impactEval.estimatedImpactFormatted}</div>
                          <p className="text-[10.5px] text-muted-foreground">Targeted outcome expected upon completion.</p>
                        </div>

                        {/* 2. Verified Result */}
                        <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                          <div className="flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span>Verified Result</span>
                            {impactEval.hasMeasuredData ? (
                              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9.5px] text-emerald-500 font-extrabold flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> VERIFIED
                              </span>
                            ) : (
                              <span className="rounded bg-secondary px-1.5 py-0.5 text-[9.5px] text-muted-foreground font-semibold">INSUFFICIENT DATA</span>
                            )}
                          </div>
                          <div className="text-sm font-extrabold text-foreground pt-1">
                            {impactEval.hasMeasuredData ? impactEval.newValueFormatted : "Insufficient Data"}
                          </div>
                          <p className="text-[10.5px] text-muted-foreground">{impactEval.verifiedSummaryNotes}</p>
                        </div>

                        {/* 3. CrediEdge Score Impact */}
                        <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                          <div className="flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span>CrediEdge Score™ Impact</span>
                            <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[9.5px] text-blue-500 font-extrabold">{impactEval.scoreCategoryName}</span>
                          </div>
                          <div className="text-sm font-extrabold text-foreground pt-1 flex items-center gap-1.5">
                            <span>{impactEval.currentOverallScore} / 100</span>
                            {impactEval.scoreConfirmedChange !== null && (
                              <span className={`text-[11px] font-bold ${impactEval.scoreConfirmedChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                ({impactEval.scoreConfirmedChange >= 0 ? `+${impactEval.scoreConfirmedChange}` : impactEval.scoreConfirmedChange} pts)
                              </span>
                            )}
                          </div>
                          <p className="text-[10.5px] text-muted-foreground">{impactEval.scoreExplanation}</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "workstreams" && (
            <div className="space-y-4">
              {currentCampaign && !currentMission && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-foreground">Linked Workstream Missions</h3>
                  </div>

                  {linkedMissions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      No Missions currently linked to this Campaign.
                    </div>
                  ) : (
                    linkedMissions.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => onSelectMission(m)}
                        className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-foreground/20 cursor-pointer"
                      >
                        <div>
                          <div className="text-[13.5px] font-bold text-foreground">{m.title}</div>
                          <div className="text-[11.5px] text-muted-foreground">{m.completedTasks} / {m.totalTasks} tasks finished</div>
                        </div>
                        <div className="text-[14px] font-extrabold text-foreground">{m.progressPct}%</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {currentMission && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-foreground">Mission Execution Tasks</h3>
                    {onCreateTaskInMission && (
                      <button
                        type="button"
                        onClick={() => onCreateTaskInMission(currentMission.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-brand px-3 py-1.5 text-[12px] font-semibold text-white"
                      >
                        <Plus className="h-3.5 w-3.5" /> Create Task in Mission
                      </button>
                    )}
                  </div>

                  {linkedTasks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      No tasks assigned to this Mission yet.
                    </div>
                  ) : (
                    linkedTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onSelectTask(t)}
                        className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 hover:border-foreground/20 cursor-pointer"
                      >
                        <div>
                          <div className="text-[13px] font-bold text-foreground">{t.title}</div>
                          <div className="text-[11px] text-muted-foreground">Priority: {t.priority} • Due: {t.due_date || "No due date"}</div>
                        </div>
                        <span className="rounded-md bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground capitalize">
                          {t.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "entities" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <h3 className="text-[14px] font-bold text-foreground mb-1">Connected Business Intelligence</h3>
                <p className="text-[12px] text-muted-foreground">
                  Link real workspace records to ground this strategic objective in actual customer and financial operations.
                </p>
              </div>

              {loadingEntities ? (
                <div className="p-6 text-center text-xs text-muted-foreground">Loading workspace records...</div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Linked Customer */}
                  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center gap-2 text-[12.5px] font-bold text-foreground">
                      <Building2 className="h-4 w-4 text-brand" /> Customer Link
                    </div>
                    {linkedCustomer ? (
                      <div className="space-y-2">
                        <div className="text-[13px] font-extrabold text-foreground">
                          {linkedCustomer.full_name || linkedCustomer.company_name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{linkedCustomer.email || "No email"}</div>
                        <button
                          type="button"
                          disabled={linking}
                          onClick={() => handleLinkEntity("customer", null)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive hover:underline"
                        >
                          <Unlink className="h-3 w-3" /> Unlink Customer
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <select
                          value={selectedCustomerId}
                          onChange={(e) => setSelectedCustomerId(e.target.value)}
                          className="h-8 w-full rounded-lg border border-border bg-secondary/30 px-2 text-[12px] text-foreground focus:outline-none"
                        >
                          <option value="">Select workspace customer...</option>
                          {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.full_name || c.company_name || c.email}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={!selectedCustomerId || linking}
                          onClick={() => handleLinkEntity("customer", selectedCustomerId)}
                          className="inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-1 text-[11px] font-semibold text-background hover:bg-foreground/85 disabled:opacity-50"
                        >
                          <Link className="h-3 w-3" /> Connect Customer
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Linked Job */}
                  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center gap-2 text-[12.5px] font-bold text-foreground">
                      <Briefcase className="h-4 w-4 text-blue-600" /> Job Link
                    </div>
                    {linkedJob ? (
                      <div className="space-y-2">
                        <div className="text-[13px] font-extrabold text-foreground">
                          {linkedJob.job_number} — {linkedJob.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground">Status: {linkedJob.status}</div>
                        <button
                          type="button"
                          disabled={linking}
                          onClick={() => handleLinkEntity("job", null)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive hover:underline"
                        >
                          <Unlink className="h-3 w-3" /> Unlink Job
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <select
                          value={selectedJobId}
                          onChange={(e) => setSelectedJobId(e.target.value)}
                          className="h-8 w-full rounded-lg border border-border bg-secondary/30 px-2 text-[12px] text-foreground focus:outline-none"
                        >
                          <option value="">Select workspace job...</option>
                          {jobs.map((j) => (
                            <option key={j.id} value={j.id}>
                              {j.job_number}: {j.title}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={!selectedJobId || linking}
                          onClick={() => handleLinkEntity("job", selectedJobId)}
                          className="inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-1 text-[11px] font-semibold text-background hover:bg-foreground/85 disabled:opacity-50"
                        >
                          <Link className="h-3 w-3" /> Connect Job
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Linked Invoice */}
                  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center gap-2 text-[12.5px] font-bold text-foreground">
                      <Receipt className="h-4 w-4 text-emerald-600" /> Invoice Link
                    </div>
                    {linkedInvoice ? (
                      <div className="space-y-2">
                        <div className="text-[13px] font-extrabold text-foreground">
                          {linkedInvoice.invoice_number} (£{Number(linkedInvoice.total_amount).toLocaleString()})
                        </div>
                        <div className="text-[11px] text-muted-foreground">Status: {linkedInvoice.status}</div>
                        <button
                          type="button"
                          disabled={linking}
                          onClick={() => handleLinkEntity("invoice", null)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive hover:underline"
                        >
                          <Unlink className="h-3 w-3" /> Unlink Invoice
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <select
                          value={selectedInvoiceId}
                          onChange={(e) => setSelectedInvoiceId(e.target.value)}
                          className="h-8 w-full rounded-lg border border-border bg-secondary/30 px-2 text-[12px] text-foreground focus:outline-none"
                        >
                          <option value="">Select workspace invoice...</option>
                          {invoices.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.invoice_number} (£{Number(i.total_amount).toLocaleString()})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={!selectedInvoiceId || linking}
                          onClick={() => handleLinkEntity("invoice", selectedInvoiceId)}
                          className="inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-1 text-[11px] font-semibold text-background hover:bg-foreground/85 disabled:opacity-50"
                        >
                          <Link className="h-3 w-3" /> Connect Invoice
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6">
              {/* Task Productivity & Time Tracking Panel */}
              {currentTask && (
                <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                    <div>
                      <h3 className="text-[14px] font-bold text-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand" /> Productivity & Duration Intelligence
                      </h3>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5">
                        Compare estimated vs. actual duration, log work sessions, and calculate verified time saved.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeTimerId ? (
                        <button
                          type="button"
                          disabled={trackingLoading}
                          onClick={handleStopTimer}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-destructive px-3.5 py-1.5 text-[12px] font-bold text-white hover:bg-destructive/90"
                        >
                          <Square className="h-3.5 w-3.5" fill="currentColor" /> Stop Timer
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={trackingLoading}
                          onClick={handleStartTimer}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-1.5 text-[12px] font-bold text-white hover:opacity-90"
                        >
                          <Play className="h-3.5 w-3.5" fill="currentColor" /> Start Timer
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-border bg-secondary/30 p-3.5">
                      <div className="text-[10.5px] font-medium text-muted-foreground">Estimated Duration</div>
                      <div className="text-[14px] font-extrabold text-foreground mt-0.5">
                        {productivity?.estimatedMinutes || 30} min
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-3.5">
                      <div className="text-[10.5px] font-medium text-muted-foreground">Actual Tracked Duration</div>
                      <div className="text-[14px] font-extrabold text-foreground mt-0.5">
                        {productivity?.hasTrackedTime ? `${productivity.actualMinutes} min` : "Not tracked"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-3.5">
                      <div className="text-[10.5px] font-medium text-muted-foreground">Duration Variance</div>
                      <div className="text-[14px] font-extrabold text-foreground mt-0.5">
                        {productivity?.varianceMinutes !== null && productivity?.varianceMinutes !== undefined
                          ? `${productivity.varianceMinutes > 0 ? "+" : ""}${productivity.varianceMinutes} min`
                          : "Not tracked"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-3.5">
                      <div className="text-[10.5px] font-medium text-muted-foreground">Verified Time Saved</div>
                      <div className="text-[14px] font-extrabold text-emerald-600 mt-0.5">
                        {productivity?.verifiedTimeSavedMinutes !== null && productivity?.verifiedTimeSavedMinutes !== undefined
                          ? `${productivity.verifiedTimeSavedMinutes} min`
                          : "Insufficient data"}
                      </div>
                    </div>
                  </div>

                  {/* Manual Log Form */}
                  <form onSubmit={handleAddManualTime} className="flex flex-wrap items-center gap-3 pt-2">
                    <input
                      type="number"
                      value={manualMinutes}
                      onChange={(e) => setManualMinutes(e.target.value)}
                      placeholder="Minutes (e.g. 45)"
                      min="1"
                      required
                      className="h-9 w-32 rounded-xl border border-border bg-secondary/30 px-3 text-[12.5px] text-foreground focus:outline-none"
                    />
                    <input
                      type="text"
                      value={manualNotes}
                      onChange={(e) => setManualNotes(e.target.value)}
                      placeholder="Work session notes / deliverable summary..."
                      className="h-9 flex-1 min-w-[200px] rounded-xl border border-border bg-secondary/30 px-3 text-[12.5px] text-foreground focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={trackingLoading || !manualMinutes}
                      className="inline-flex items-center gap-1 rounded-xl bg-foreground px-3.5 py-2 text-[12px] font-bold text-background hover:bg-foreground/85 disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" /> Log Manual Time
                    </button>
                  </form>

                  {/* Entries List */}
                  {timeEntries.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="text-[12px] font-bold text-foreground">Work Log Audit Trail ({timeEntries.length}):</div>
                      {timeEntries.map((e) => {
                        const isEditing = editingEntryId === e.id;
                        const dateStr = new Date(e.createdAt).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        const isEdited = e.updatedAt && e.updatedAt !== e.createdAt;

                        return (
                          <div key={e.id} className="rounded-xl border border-border bg-secondary/20 p-3 space-y-2 text-[11.5px]">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground capitalize">{e.entryType} Session</span>
                                <span className="text-muted-foreground">• by <span className="font-semibold text-foreground/80">{e.userName || "Team Member"}</span></span>
                                <span className="text-muted-foreground">• {dateStr}</span>
                                {isEdited && <span className="text-[10px] text-muted-foreground/70 italic">(edited)</span>}
                              </div>
                              <span className="font-extrabold text-foreground bg-secondary px-2 py-0.5 rounded-md">{e.durationMinutes} min</span>
                            </div>

                            {isEditing ? (
                              <div className="flex items-center gap-2 pt-1">
                                <input
                                  type="text"
                                  value={editNotesText}
                                  onChange={(evt) => setEditNotesText(evt.target.value)}
                                  placeholder="Add or update work session notes..."
                                  className="h-8 flex-1 rounded-lg border border-border bg-card px-3 text-[12px] text-foreground focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!businessId) return;
                                    try {
                                      await updateTimeEntryNotes(e.id, businessId, editNotesText);
                                      setEditingEntryId(null);
                                      if (currentTask) {
                                        const updatedEntries = await fetchTaskTimeEntries(currentTask.id, businessId);
                                        setTimeEntries(updatedEntries);
                                      }
                                    } catch (err: any) {
                                      alert(`Failed to save note: ${err.message || String(err)}`);
                                    }
                                  }}
                                  className="rounded-lg bg-brand px-3 py-1 text-[11px] font-bold text-white"
                                >
                                  Save Note
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingEntryId(null)}
                                  className="rounded-lg border border-border px-3 py-1 text-[11px] font-semibold text-muted-foreground"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2 pt-0.5">
                                <p className="text-muted-foreground italic">
                                  {e.notes ? `"${e.notes}"` : <span className="text-muted-foreground/60">No notes provided for this session</span>}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingEntryId(e.id);
                                    setEditNotesText(e.notes || "");
                                  }}
                                  className="text-[10.5px] font-semibold text-brand hover:underline shrink-0"
                                >
                                  {e.notes ? "Edit note" : "+ Add note"}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="rounded-xl border border-border bg-secondary/20 p-6 text-center space-y-3">
                <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground/60" />
                <div className="text-[14px] font-bold text-foreground">Measured Business Performance</div>
                <p className="text-[12.5px] text-muted-foreground max-w-md mx-auto">
                  CrediEdgeOS strictly calculates financial performance from verified linked payment records.
                </p>
                <div className="inline-block rounded-xl bg-card border border-border px-4 py-2 text-[12px] font-bold text-foreground/80">
                  Insufficient data — Connect an invoice or payment record to measure revenue outcome variance.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
