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
} from "lucide-react";
import type { CalculatedCampaign } from "@/services/campaigns";
import type { CalculatedMission } from "@/services/missions";
import type { Task } from "@/lib/database.types";
import type { WorkspaceMemberInfo } from "@/services/tasks";
import { moveTaskMission } from "@/services/tasks";
import { updateMission, archiveMission, createMission } from "@/services/missions";
import { updateCampaign, archiveCampaign } from "@/services/campaigns";

interface HierarchicalNavProps {
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
  onCreateMissionInCampaign?: (campaignId: string) => void;
}

export function HierarchicalDetailModal({
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
  onCreateMissionInCampaign,
}: HierarchicalNavProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "items" | "performance">("overview");
  const [assigningTaskId, setAssigningTaskId] = useState<string>("");

  if (!campaign && !mission && !task) return null;

  // Resolve active context
  const currentTask = task;
  const currentMission = mission || (currentTask ? allMissions.find((m) => m.id === (currentTask as any).mission_id) : null);
  const currentCampaign = campaign || (currentMission ? allCampaigns.find((c) => c.id === currentMission.campaign_id) : null);

  const memberMap = members.reduce<Record<string, string>>((acc, m) => {
    acc[m.userId] = m.fullName;
    return acc;
  }, {});

  // Associated tasks & missions
  const linkedMissions = currentCampaign ? allMissions.filter((m) => m.campaign_id === currentCampaign.id) : [];
  const linkedTasks = currentMission ? allTasks.filter((t: any) => t.mission_id === currentMission.id) : [];
  const unassignedTasks = allTasks.filter((t: any) => !t.mission_id);

  const handleAssignTask = async (taskId: string) => {
    if (!taskId || !currentMission) return;
    try {
      await moveTaskMission(taskId, businessId, currentMission.id);
      setAssigningTaskId("");
      onRefresh();
    } catch (err: any) {
      alert(`Failed to assign task: ${err.message || String(err)}`);
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    try {
      await moveTaskMission(taskId, businessId, null);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to remove task: ${err.message || String(err)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Breadcrumb & Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/30">
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
            <span className="text-foreground/70">Workspace</span>
            <ChevronRight className="h-3.5 w-3.5" />

            {currentCampaign && (
              <>
                <button
                  type="button"
                  onClick={() => onSelectCampaign(currentCampaign)}
                  className={`hover:text-foreground ${!currentMission && !currentTask ? "font-bold text-foreground" : ""}`}
                >
                  Campaign: {currentCampaign.name}
                </button>
              </>
            )}

            {currentMission && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <button
                  type="button"
                  onClick={() => onSelectMission(currentMission)}
                  className={`hover:text-foreground ${!currentTask ? "font-bold text-foreground" : ""}`}
                >
                  Mission: {currentMission.title}
                </button>
              </>
            )}

            {currentTask && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-bold text-foreground">Task: {currentTask.title}</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-6 border-b border-border px-6 py-2.5 bg-card text-[13px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-1 transition-all ${
              activeTab === "overview" ? "border-b-2 border-brand text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview & Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("items")}
            className={`pb-1 transition-all ${
              activeTab === "items" ? "border-b-2 border-brand text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {currentTask ? "Task Context" : currentMission ? `Linked Tasks (${linkedTasks.length})` : `Missions (${linkedMissions.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("performance")}
            className={`pb-1 transition-all ${
              activeTab === "performance" ? "border-b-2 border-brand text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Performance & Metrics
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Campaign View */}
              {currentCampaign && !currentMission && !currentTask && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider">
                        Strategic Campaign
                      </span>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {currentCampaign.health} Health
                      </span>
                    </div>
                    <h2 className="text-[20px] font-extrabold text-foreground">{currentCampaign.name}</h2>
                    <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
                      {currentCampaign.description || "No strategic objective details recorded."}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Target Description</div>
                      <div className="text-[14px] font-bold text-foreground mt-0.5">
                        {currentCampaign.target_description || "N/A"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Business Value</div>
                      <div className="text-[14px] font-bold text-emerald-600 mt-0.5">
                        £{Number(currentCampaign.business_value).toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Deadline Date</div>
                      <div className="text-[14px] font-bold text-foreground mt-0.5">
                        {currentCampaign.deadline ? new Date(currentCampaign.deadline).toLocaleDateString("en-GB") : "No deadline"}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border p-4 bg-card">
                    <div className="flex items-center justify-between text-[12.5px] font-bold text-foreground mb-1.5">
                      <span>Campaign Completion Progress</span>
                      <span>{currentCampaign.progressPct}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-brand transition-all duration-500"
                        style={{ width: `${currentCampaign.progressPct}%` }}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      {currentCampaign.completedTasks} of {currentCampaign.totalTasks} tasks completed across linked workstream missions.
                    </div>
                  </div>
                </div>
              )}

              {/* Mission View */}
              {currentMission && !currentTask && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                        Workstream Mission
                      </span>
                      {currentCampaign && (
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          Campaign: <span className="text-foreground">{currentCampaign.name}</span>
                        </span>
                      )}
                    </div>
                    <h2 className="text-[20px] font-extrabold text-foreground">{currentMission.title}</h2>
                    <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
                      {currentMission.description || "No mission summary provided."}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Status</div>
                      <div className="text-[14px] font-bold text-foreground capitalize mt-0.5">{currentMission.status}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <div className="text-[11px] font-medium text-muted-foreground">Start Date</div>
                      <div className="text-[14px] font-bold text-foreground mt-0.5">
                        {currentMission.start_date ? new Date(currentMission.start_date).toLocaleDateString("en-GB") : "Recently started"}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border p-4 bg-card">
                    <div className="flex items-center justify-between text-[12.5px] font-bold text-foreground mb-1.5">
                      <span>Mission Completion Progress</span>
                      <span>{currentMission.progressPct}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-brand transition-all duration-500"
                        style={{ width: `${currentMission.progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Task View */}
              {currentTask && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                        Execution Task
                      </span>
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        Priority: <span className="text-foreground uppercase">{currentTask.priority}</span>
                      </span>
                    </div>
                    <h2 className="text-[20px] font-extrabold text-foreground">{currentTask.title}</h2>
                    <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
                      {currentTask.description || "No detailed task instructions provided."}
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
                      <div className="text-[14px] font-bold text-foreground capitalize mt-0.5">
                        {currentTask.status}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "items" && (
            <div className="space-y-4">
              {currentCampaign && !currentMission && !currentTask && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-bold text-foreground">Linked Workstream Missions</h3>
                    {onCreateMissionInCampaign && (
                      <button
                        type="button"
                        onClick={() => onCreateMissionInCampaign(currentCampaign.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-brand px-3 py-1.5 text-[12px] font-semibold text-white"
                      >
                        <Plus className="h-3.5 w-3.5" /> Create Mission
                      </button>
                    )}
                  </div>

                  {linkedMissions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      No Missions are currently linked to this Campaign.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {linkedMissions.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => onSelectMission(m)}
                          className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-foreground/20 cursor-pointer"
                        >
                          <div>
                            <div className="text-[13px] font-bold text-foreground">{m.title}</div>
                            <div className="text-[11px] text-muted-foreground">{m.completedTasks} / {m.totalTasks} tasks completed</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[13px] font-extrabold text-foreground">{m.progressPct}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentMission && !currentTask && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[14px] font-bold text-foreground">Mission Execution Tasks</h3>
                    <div className="flex items-center gap-2">
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
                  </div>

                  {/* Assign Existing Task Dropdown */}
                  {unassignedTasks.length > 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 p-3">
                      <span className="text-[12px] font-semibold text-foreground shrink-0">Assign Existing Task:</span>
                      <select
                        value={assigningTaskId}
                        onChange={(e) => setAssigningTaskId(e.target.value)}
                        className="h-8 flex-1 rounded-lg border border-border bg-card px-2 text-[12px] text-foreground focus:outline-none"
                      >
                        <option value="">Select unassigned workspace task...</option>
                        {unassignedTasks.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title} ({t.priority})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={!assigningTaskId}
                        onClick={() => handleAssignTask(assigningTaskId)}
                        className="rounded-lg bg-foreground px-3 py-1 text-[11.5px] font-semibold text-background hover:bg-foreground/85 disabled:opacity-50"
                      >
                        Link Task
                      </button>
                    </div>
                  )}

                  {linkedTasks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      No tasks assigned to this Mission yet. Click "Create Task in Mission" or link an existing task above.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {linkedTasks.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between rounded-xl border border-border bg-card p-3 hover:border-foreground/20"
                        >
                          <div
                            onClick={() => onSelectTask(t)}
                            className="min-w-0 flex-1 cursor-pointer"
                          >
                            <div className="text-[13px] font-bold text-foreground">{t.title}</div>
                            <div className="text-[11px] text-muted-foreground">
                              Priority: {t.priority} • Due: {t.due_date || "No due date"}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveTask(t.id)}
                              className="text-[10.5px] font-semibold text-destructive hover:underline"
                            >
                              Unlink Task
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "performance" && (
            <div className="rounded-xl border border-border bg-secondary/20 p-6 text-center space-y-3">
              <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <div className="text-[14px] font-bold text-foreground">Verified Performance & Metrics</div>
              <p className="text-[12.5px] text-muted-foreground max-w-md mx-auto">
                CrediEdgeOS strictly measures performance from completed financial, task, and outcome records.
              </p>
              <div className="inline-block rounded-xl bg-card border border-border px-4 py-2 text-[12px] font-bold text-foreground/80">
                Insufficient data — Complete underlying tasks and financial records to generate actual outcome variance.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
