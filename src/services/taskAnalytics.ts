import { supabase } from "@/lib/supabase";
import type { Task } from "@/lib/database.types";
import { fetchCampaigns, type CalculatedCampaign } from "./campaigns";
import { fetchMissions, type CalculatedMission } from "./missions";

export interface MonthlyTaskTrend {
  monthKey: string; // e.g. "2026-08"
  monthLabel: string; // e.g. "Aug 2026"
  createdCount: number;
  completedCount: number;
  completionRatePct: number | null;
  avgCompletionHours: number | null;
}

export interface CampaignTaskBreakdown {
  campaignId: string;
  campaignName: string;
  totalTasks: number;
  completedTasks: number;
  completionRatePct: number;
  businessValue: number;
}

export interface MissionTaskBreakdown {
  missionId: string;
  missionTitle: string;
  campaignName: string | null;
  totalTasks: number;
  completedTasks: number;
  completionRatePct: number;
}

export interface TaskAnalyticsReport {
  hasSufficientData: boolean;
  totalTasksCreated: number;
  totalTasksCompleted: number;
  totalPendingTasks: number;
  totalOverdueTasks: number;

  // Authoritative Completion Rate Formula: (Completed / Total) * 100
  overallCompletionRatePct: number | null;

  // Average Completion Duration: (completed_at - created_at) in hours/days
  avgCompletionHours: number | null;
  avgCompletionDays: number | null;
  completedTasksWithTimestampsCount: number;

  // Duration Variance (Actual Tracked vs Estimated)
  totalEstimatedMinutes: number;
  totalActualTrackedMinutes: number;
  varianceMinutes: number | null;

  // Business Impact
  totalEstimatedImpactValue: number;
  totalVerifiedImpactValue: number;
  hasVerifiedImpactData: boolean;

  // Time Series & Groupings
  monthlyTrends: MonthlyTaskTrend[];
  campaignBreakdowns: CampaignTaskBreakdown[];
  missionBreakdowns: MissionTaskBreakdown[];
  priorityBreakdown: { priority: string; count: number; completedCount: number }[];
  statusBreakdown: { status: string; count: number }[];
}

export async function fetchTaskAnalytics(businessId: string | undefined): Promise<TaskAnalyticsReport> {
  if (!businessId) {
    return getEmptyAnalyticsReport();
  }

  try {
    const [tasksRes, campaignsOverview, missionsList, timeEntriesRes, paymentsRes] = await Promise.all([
      supabase.from("tasks").select("*").eq("business_id", businessId).order("created_at", { ascending: true }),
      fetchCampaigns(businessId),
      fetchMissions(businessId),
      (supabase as any).from("task_time_entries").select("task_id, duration_minutes").eq("business_id", businessId),
      supabase.from("payments").select("amount, invoice_id").eq("business_id", businessId).eq("type", "income"),
    ]);

    const tasks = (tasksRes.data || []) as (Task & {
      estimated_minutes?: number;
      estimated_impact_value?: number;
      target_metric?: string;
    })[];

    if (tasks.length === 0) {
      return getEmptyAnalyticsReport();
    }

    const now = new Date();
    const nowIsoStr = now.toISOString().slice(0, 10);

    let totalTasksCreated = tasks.length;
    let totalTasksCompleted = 0;
    let totalPendingTasks = 0;
    let totalOverdueTasks = 0;

    let totalCompletionDurationHours = 0;
    let completedWithTimestampsCount = 0;

    let totalEstimatedMinutes = 0;
    let totalEstimatedImpactValue = 0;

    const priorityMap: Record<string, { count: number; completedCount: number }> = {
      urgent: { count: 0, completedCount: 0 },
      high: { count: 0, completedCount: 0 },
      medium: { count: 0, completedCount: 0 },
      low: { count: 0, completedCount: 0 },
    };

    const statusMap: Record<string, number> = {};
    const monthlyMap: Record<string, { created: number; completed: number; durHoursSum: number; durCount: number }> = {};

    tasks.forEach((t) => {
      // Status breakdown
      const st = t.status || "todo";
      statusMap[st] = (statusMap[st] || 0) + 1;

      // Priority breakdown
      const prio = t.priority || "medium";
      if (!priorityMap[prio]) priorityMap[prio] = { count: 0, completedCount: 0 };
      priorityMap[prio].count++;

      // Estimated metrics
      const estMins = Number(t.estimated_minutes) || 30;
      totalEstimatedMinutes += estMins;

      const estImpact = Number(t.estimated_impact_value) || 0;
      totalEstimatedImpactValue += estImpact;

      // Created month trend
      const createdDate = new Date(t.created_at);
      const monthKey = createdDate.toISOString().slice(0, 7); // e.g. "2026-08"
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { created: 0, completed: 0, durHoursSum: 0, durCount: 0 };
      }
      monthlyMap[monthKey].created++;

      // Completion & Overdue logic
      if (t.status === "completed") {
        totalTasksCompleted++;
        priorityMap[prio].completedCount++;

        if (t.completed_at && t.created_at) {
          const startMs = new Date(t.created_at).getTime();
          const endMs = new Date(t.completed_at).getTime();
          if (endMs >= startMs) {
            const diffHours = (endMs - startMs) / (1000 * 60 * 60);
            totalCompletionDurationHours += diffHours;
            completedWithTimestampsCount++;

            const compMonthKey = new Date(t.completed_at).toISOString().slice(0, 7);
            if (!monthlyMap[compMonthKey]) {
              monthlyMap[compMonthKey] = { created: 0, completed: 0, durHoursSum: 0, durCount: 0 };
            }
            monthlyMap[compMonthKey].completed++;
            monthlyMap[compMonthKey].durHoursSum += diffHours;
            monthlyMap[compMonthKey].durCount++;
          }
        }
      } else {
        totalPendingTasks++;
        // Check overdue (only pending/active tasks with due_date < today)
        if (t.due_date && t.due_date.slice(0, 10) < nowIsoStr) {
          totalOverdueTasks++;
        }
      }
    });

    // Calculate overall completion rate
    const overallCompletionRatePct = totalTasksCreated > 0
      ? Math.round((totalTasksCompleted / totalTasksCreated) * 100)
      : null;

    // Calculate average completion time
    const avgCompletionHours = completedWithTimestampsCount > 0
      ? Math.round((totalCompletionDurationHours / completedWithTimestampsCount) * 10) / 10
      : null;

    const avgCompletionDays = avgCompletionHours !== null
      ? Math.round((avgCompletionHours / 24) * 10) / 10
      : null;

    // Tracked time entries vs estimated
    const timeEntries = timeEntriesRes.data || [];
    const totalActualTrackedMinutes = timeEntries.reduce((acc: number, e: any) => acc + (Number(e.duration_minutes) || 0), 0);
    const varianceMinutes = timeEntries.length > 0 ? totalActualTrackedMinutes - totalEstimatedMinutes : null;

    // Verified Business Impact (from connected payments against completed tasks)
    const completedTaskInvoiceIds = new Set(
      tasks.filter((t) => t.status === "completed" && (t as any).invoice_id).map((t) => (t as any).invoice_id)
    );

    const payments = paymentsRes.data || [];
    let totalVerifiedImpactValue = 0;
    let hasVerifiedImpactData = false;

    payments.forEach((p) => {
      if (p.invoice_id && completedTaskInvoiceIds.has(p.invoice_id)) {
        totalVerifiedImpactValue += Number(p.amount) || 0;
        hasVerifiedImpactData = true;
      }
    });

    // Monthly Trends List (Sorted chronologically)
    const sortedMonthKeys = Object.keys(monthlyMap).sort();
    const monthlyTrends: MonthlyTaskTrend[] = sortedMonthKeys.map((key) => {
      const data = monthlyMap[key];
      const d = new Date(`${key}-01T00:00:00`);
      const monthLabel = d.toLocaleString("en-GB", { month: "short", year: "numeric" });
      const completionRatePct = data.created > 0 ? Math.round((data.completed / data.created) * 100) : null;
      const avgHours = data.durCount > 0 ? Math.round((data.durHoursSum / data.durCount) * 10) / 10 : null;

      return {
        monthKey: key,
        monthLabel,
        createdCount: data.created,
        completedCount: data.completed,
        completionRatePct,
        avgCompletionHours: avgHours,
      };
    });

    // Campaign Breakdowns
    const campaignBreakdowns: CampaignTaskBreakdown[] = campaignsOverview.activeCampaigns.map((c) => ({
      campaignId: c.id,
      campaignName: c.name,
      totalTasks: c.totalTasks,
      completedTasks: c.completedTasks,
      completionRatePct: c.progressPct,
      businessValue: c.business_value,
    }));

    // Mission Breakdowns
    const missionBreakdowns: MissionTaskBreakdown[] = missionsList.map((m) => ({
      missionId: m.id,
      missionTitle: m.title,
      campaignName: m.campaignName || null,
      totalTasks: m.totalTasks,
      completedTasks: m.completedTasks,
      completionRatePct: m.progressPct,
    }));

    const priorityBreakdown = Object.entries(priorityMap).map(([prio, val]) => ({
      priority: prio,
      count: val.count,
      completedCount: val.completedCount,
    }));

    const statusBreakdown = Object.entries(statusMap).map(([st, count]) => ({
      status: st,
      count,
    }));

    return {
      hasSufficientData: true,
      totalTasksCreated,
      totalTasksCompleted,
      totalPendingTasks,
      totalOverdueTasks,

      overallCompletionRatePct,

      avgCompletionHours,
      avgCompletionDays,
      completedTasksWithTimestampsCount: completedWithTimestampsCount,

      totalEstimatedMinutes,
      totalActualTrackedMinutes,
      varianceMinutes,

      totalEstimatedImpactValue,
      totalVerifiedImpactValue,
      hasVerifiedImpactData,

      monthlyTrends,
      campaignBreakdowns,
      missionBreakdowns,
      priorityBreakdown,
      statusBreakdown,
    };
  } catch (err) {
    console.error("[fetchTaskAnalytics] error:", err);
    return getEmptyAnalyticsReport();
  }
}

function getEmptyAnalyticsReport(): TaskAnalyticsReport {
  return {
    hasSufficientData: false,
    totalTasksCreated: 0,
    totalTasksCompleted: 0,
    totalPendingTasks: 0,
    totalOverdueTasks: 0,

    overallCompletionRatePct: null,

    avgCompletionHours: null,
    avgCompletionDays: null,
    completedTasksWithTimestampsCount: 0,

    totalEstimatedMinutes: 0,
    totalActualTrackedMinutes: 0,
    varianceMinutes: null,

    totalEstimatedImpactValue: 0,
    totalVerifiedImpactValue: 0,
    hasVerifiedImpactData: false,

    monthlyTrends: [],
    campaignBreakdowns: [],
    missionBreakdowns: [],
    priorityBreakdown: [],
    statusBreakdown: [],
  };
}
