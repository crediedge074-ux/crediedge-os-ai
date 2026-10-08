import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Target, Plus, ChevronRight, Trash2, Edit3, Trophy } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { GoalModal } from "@/components/goals/GoalModal";
import { GoalWorkspace } from "@/components/goals/GoalWorkspace";
import { useAuthContext } from "@/contexts/AuthContext";
import { fetchWorkspaceMembers, type WorkspaceMemberInfo } from "@/services/tasks";
import { fetchMissions, type CalculatedMission } from "@/services/missions";
import {
  fetchGoals, createGoal, updateGoal, deleteGoal, completeGoal,
  type CalculatedGoal, type GoalPriority,
} from "@/services/goals";
import type { Task } from "@/lib/database.types";
import { getTasks } from "@/services/tasks";
import { appEvents, APP_EVENTS } from "@/lib/events";

export const Route = createFileRoute("/goals")({
  component: GoalsPage,
});

const healthBadge: Record<string, string> = {
  on_track: "bg-emerald-50 text-emerald-600 border-emerald-200",
  at_risk: "bg-amber-50 text-amber-600 border-amber-200",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-brand/10 text-brand border-brand/20",
  paused: "bg-secondary text-muted-foreground border-border",
};

const healthLabel: Record<string, string> = {
  on_track: "On Track",
  at_risk: "At Risk",
  overdue: "Overdue",
  completed: "Completed",
  paused: "Paused",
};

const categoryColor: Record<string, string> = {
  revenue: "bg-brand/10 text-brand",
  reviews: "bg-amber-50 text-amber-700",
  customers: "bg-secondary text-foreground/70",
  efficiency: "bg-emerald-50 text-emerald-600",
  marketing: "bg-blue-50 text-blue-600",
  operations: "bg-secondary text-muted-foreground",
};

function GoalsPage() {
  const { membership, user } = useAuthContext();
  const businessId = membership?.business_id;
  const currentUserId = user?.id;

  const [goals, setGoals] = useState<CalculatedGoal[]>([]);
  const [members, setMembers] = useState<WorkspaceMemberInfo[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [missions, setMissions] = useState<CalculatedMission[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<CalculatedGoal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<CalculatedGoal | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const loadData = () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      fetchGoals(businessId),
      fetchWorkspaceMembers(businessId),
      getTasks(businessId),
      fetchMissions(businessId),
    ])
      .then(([goalList, memberList, taskList, missionList]) => {
        setGoals(goalList);
        setMembers(memberList);
        setTasks(taskList);
        setMissions(missionList);
      })
      .catch((err) => console.error("Failed to load goals data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    const unsub = appEvents.on(APP_EVENTS.GOALS_MUTATED, loadData);
    return () => unsub();
  }, [businessId]);

  const handleSaveGoal = async (data: {
    title: string;
    description?: string | null;
    target_value: number;
    current_value?: number;
    unit?: string;
    category?: string;
    priority?: GoalPriority;
    owner_id?: string | null;
    target_date?: string | null;
  }) => {
    if (!businessId) return;
    if (editingGoal) {
      await updateGoal(editingGoal.id, businessId, data as any);
    } else {
      await createGoal(businessId, { ...data, created_by: currentUserId || null });
    }
    appEvents.emit(APP_EVENTS.GOALS_MUTATED);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!businessId || !confirm("Delete this goal permanently?")) return;
    try {
      await deleteGoal(goalId, businessId);
      appEvents.emit(APP_EVENTS.GOALS_MUTATED);
    } catch (err: any) {
      alert(`Failed to delete goal: ${err?.message || String(err)}`);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    if (!businessId || !confirm("Mark this goal as achieved?")) return;
    try {
      await completeGoal(goalId, businessId);
      appEvents.emit(APP_EVENTS.GOALS_MUTATED);
    } catch (err: any) {
      alert(`Failed to complete goal: ${err?.message || String(err)}`);
    }
  };

  const handleOpenTask = (task: Task) => {
    // Navigate to tasks page with task selected
    window.location.hash = `/tasks?taskId=${task.id}`;
    window.location.href = "/tasks";
  };

  const handleOpenMission = (mission: CalculatedMission) => {
    window.location.href = "/tasks";
  };

  const formatValue = (goal: CalculatedGoal, value: number) => {
    if (goal.unit === "£") return `£${value.toLocaleString("en-GB")}`;
    if (goal.unit === "%") return `${value}%`;
    if (goal.unit === "count") return value.toLocaleString("en-GB");
    return `${value.toLocaleString("en-GB")} ${goal.unit}`;
  };

  const filteredGoals = goals.filter((g) => {
    if (filter === "active") return g.status === "active";
    if (filter === "completed") return g.status === "achieved";
    if (filter === "at_risk") return g.health === "at_risk" || g.health === "overdue";
    return true;
  });

  const activeCount = goals.filter((g) => g.status === "active").length;
  const completedCount = goals.filter((g) => g.status === "achieved").length;
  const atRiskCount = goals.filter((g) => g.health === "at_risk" || g.health === "overdue").length;

  return (
    <AppLayout>
      <PageHeader
        title="Goals"
        description="Set, track and achieve your business growth targets."
        crumbs={[{ label: "Goals" }]}
        action={{ label: "Create Goal", icon: Plus, onClick: () => { setEditingGoal(null); setIsModalOpen(true); } }}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[13px] text-muted-foreground">
          Loading goals...
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No active goals"
          description="Create a business goal and CrediEdgeOS will connect the people, missions and tasks needed to achieve it."
          action={{ label: "Create Goal", onClick: () => { setEditingGoal(null); setIsModalOpen(true); } }}
        />
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="mb-4 flex gap-1.5 text-[11px] font-semibold">
            {[
              { id: "all", label: "All", count: goals.length },
              { id: "active", label: "Active", count: activeCount },
              { id: "at_risk", label: "At Risk", count: atRiskCount },
              { id: "completed", label: "Completed", count: completedCount },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  filter === f.id
                    ? "bg-foreground text-background font-bold shadow-xs"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          {filteredGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Target className="mb-3 h-8 w-8 text-muted-foreground/40" strokeWidth={1.5} />
              <p className="text-[13px] text-muted-foreground">No goals match this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredGoals.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGoal(g)}
                  className="group flex cursor-pointer flex-col rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold capitalize ${categoryColor[g.category || "revenue"] || categoryColor.revenue}`}>
                          {g.category || "General"}
                        </span>
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-[9.5px] font-bold uppercase ${healthBadge[g.health] || healthBadge.on_track}`}>
                          {healthLabel[g.health] || "On Track"}
                        </span>
                      </div>
                      <h3 className="text-[14px] font-semibold leading-tight text-foreground">{g.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingGoal(g); setIsModalOpen(true); }}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteGoal(g.id); }}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                      <span>Progress</span>
                      <span className="font-semibold text-foreground">{g.progressPct}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${g.progressPct}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
                    <div>
                      <div className="text-[10.5px] font-medium text-muted-foreground">Current</div>
                      <div className="mt-0.5 text-[13px] font-semibold text-foreground">{formatValue(g, g.current_value)}</div>
                    </div>
                    <div>
                      <div className="text-[10.5px] font-medium text-muted-foreground">Target</div>
                      <div className="mt-0.5 text-[13px] font-semibold text-foreground">{formatValue(g, g.target_value)}</div>
                    </div>
                    <div>
                      <div className="text-[10.5px] font-medium text-muted-foreground">Deadline</div>
                      <div className="mt-0.5 text-[13px] font-semibold text-foreground">
                        {g.target_date ? new Date(g.target_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </div>
                      {g.daysRemaining !== null && (
                        <div className={`text-[9.5px] ${g.daysRemaining < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                          {g.daysRemaining < 0 ? `${Math.abs(g.daysRemaining)}d overdue` : `${g.daysRemaining}d left`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task count footer */}
                  <div className="mt-3 flex items-center gap-3 text-[10.5px] text-muted-foreground">
                    {g.totalTasks > 0 && <span>{g.completedTasks}/{g.totalTasks} tasks done</span>}
                    {g.totalMissions > 0 && <span>{g.totalMissions} mission{g.totalMissions !== 1 ? "s" : ""}</span>}
                    {g.ownerName && <span className="ml-auto">Owner: {g.ownerName}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGoal}
        goalToEdit={editingGoal}
        members={members}
        currentUserId={currentUserId}
      />

      {/* Goal Workspace */}
      {selectedGoal && businessId && (
        <GoalWorkspace
          goal={selectedGoal}
          businessId={businessId}
          currentUserId={currentUserId}
          members={members}
          tasks={tasks}
          missions={missions}
          onClose={() => setSelectedGoal(null)}
          onRefresh={loadData}
          onEditGoal={(g) => { setSelectedGoal(null); setEditingGoal(g); setIsModalOpen(true); }}
          onOpenTask={handleOpenTask}
          onOpenMission={handleOpenMission}
        />
      )}
    </AppLayout>
  );
}
