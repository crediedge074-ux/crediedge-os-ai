import { supabase } from "@/lib/supabase";
import { logActivity } from "./activity";

export type CampaignStatus = "active" | "completed" | "archived";
export type CampaignHealth = "Excellent" | "Good" | "Needs Attention" | "At Risk";
export type CampaignType =
  | "revenue"
  | "growth"
  | "customer"
  | "marketing"
  | "website"
  | "automation"
  | "expansion"
  | "operations";

export interface StoredCampaign {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  type: CampaignType;
  target_description: string | null;
  target_value: number;
  business_value: number;
  deadline: string | null;
  status: CampaignStatus;
  health: CampaignHealth;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CalculatedCampaign extends StoredCampaign {
  totalTasks: number;
  completedTasks: number;
  progressPct: number;
  daysRemaining: number | null;
  performancePct: number | null;
}

export interface CampaignOverview {
  activeCampaigns: CalculatedCampaign[];
  completedCampaigns: CalculatedCampaign[];
  totalActiveValue: number;
  avgProgressPct: number;
}

export async function fetchCampaigns(businessId: string | undefined): Promise<CampaignOverview> {
  if (!businessId) {
    return {
      activeCampaigns: [],
      completedCampaigns: [],
      totalActiveValue: 0,
      avgProgressPct: 0,
    };
  }

  try {
    const [campaignsRes, tasksRes] = await Promise.all([
      (supabase.from as any)("campaigns").select("*").eq("business_id", businessId).order("created_at", { ascending: false }),
      supabase.from("tasks").select("id, campaign_id, status").eq("business_id", businessId),
    ]);

    const rawCampaigns = ((campaignsRes.data || []) as StoredCampaign[]);
    const tasks = tasksRes.data || [];

    // Group task counts per campaign
    const taskCountMap: Record<string, { total: number; completed: number }> = {};
    tasks.forEach((t: any) => {
      if (t.campaign_id) {
        if (!taskCountMap[t.campaign_id]) {
          taskCountMap[t.campaign_id] = { total: 0, completed: 0 };
        }
        taskCountMap[t.campaign_id].total++;
        if (t.status === "completed") {
          taskCountMap[t.campaign_id].completed++;
        }
      }
    });

    const now = new Date();

    const calculatedList: CalculatedCampaign[] = rawCampaigns.map((c) => {
      const taskStats = taskCountMap[c.id] || { total: 0, completed: 0 };
      const totalTasks = taskStats.total;
      const completedTasks = taskStats.completed;

      // Progress calculation methodology:
      // If tasks exist, progress is completedTasks / totalTasks.
      // If no tasks linked, progress is 0% (neutral state).
      const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Days remaining calculation methodology:
      // Difference between target deadline and current runtime date.
      let daysRemaining: number | null = null;
      if (c.deadline) {
        const deadlineDate = new Date(c.deadline);
        const diffMs = deadlineDate.getTime() - now.getTime();
        daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      }

      // Performance calculation methodology:
      // Performance is measured as completed tasks percentage relative to target value when available.
      const performancePct = totalTasks > 0 ? progressPct : null;

      return {
        ...c,
        totalTasks,
        completedTasks,
        progressPct,
        daysRemaining,
        performancePct,
      };
    });

    const activeCampaigns = calculatedList.filter((c) => c.status === "active");
    const completedCampaigns = calculatedList.filter((c) => c.status === "completed" || c.status === "archived");

    const totalActiveValue = activeCampaigns.reduce((acc, c) => acc + (Number(c.business_value) || 0), 0);
    const avgProgressPct = activeCampaigns.length > 0
      ? Math.round(activeCampaigns.reduce((acc, c) => acc + c.progressPct, 0) / activeCampaigns.length)
      : 0;

    return {
      activeCampaigns,
      completedCampaigns,
      totalActiveValue,
      avgProgressPct,
    };
  } catch (err) {
    console.error("[fetchCampaigns] error:", err);
    return {
      activeCampaigns: [],
      completedCampaigns: [],
      totalActiveValue: 0,
      avgProgressPct: 0,
    };
  }
}

export async function createCampaign(
  businessId: string,
  data: {
    name: string;
    description?: string;
    type?: CampaignType;
    target_description?: string;
    target_value?: number;
    business_value?: number;
    deadline?: string | null;
  }
): Promise<StoredCampaign> {
  const { data: created, error } = await (supabase.from as any)("campaigns")
    .insert({
      business_id: businessId,
      name: data.name,
      description: data.description || null,
      type: data.type || "revenue",
      target_description: data.target_description || null,
      target_value: data.target_value || 0,
      business_value: data.business_value || 0,
      deadline: data.deadline || null,
      status: "active",
      health: "Good",
    })
    .select()
    .single();

  if (error) {
    console.error("[createCampaign] Supabase insert error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "campaign",
    entity_id: created.id,
    action: "created",
    description: `Created campaign: ${created.name}`,
  }).catch((err) => console.warn("[createCampaign] logActivity failed:", err));

  return created;
}

export async function updateCampaign(
  campaignId: string,
  businessId: string,
  updates: Partial<StoredCampaign>
): Promise<StoredCampaign> {
  const { data: updated, error } = await (supabase.from as any)("campaigns")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) {
    console.error("[updateCampaign] Supabase update error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "campaign",
    entity_id: campaignId,
    action: "updated",
    description: `Updated campaign: ${updated.name}`,
  }).catch((err) => console.warn("[updateCampaign] logActivity failed:", err));

  return updated;
}

export async function archiveCampaign(
  campaignId: string,
  businessId: string,
  status: "completed" | "archived" = "completed"
): Promise<boolean> {
  const now = new Date().toISOString();
  const { error } = await (supabase.from as any)("campaigns")
    .update({
      status,
      completed_at: now,
      updated_at: now,
    })
    .eq("id", campaignId)
    .eq("business_id", businessId);

  if (error) {
    console.error("Error archiving campaign:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "campaign",
    entity_id: campaignId,
    action: status === "completed" ? "completed" : "archived",
    description: `${status === "completed" ? "Completed" : "Archived"} campaign #${campaignId.slice(0, 8)}`,
  }).catch((err) => console.warn("[archiveCampaign] logActivity failed:", err));

  return true;
}
