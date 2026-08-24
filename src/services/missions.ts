import { supabase } from "@/lib/supabase";
import { logActivity } from "./activity";

export type MissionStatus = "active" | "completed" | "archived";

export interface StoredMission {
  id: string;
  business_id: string;
  campaign_id: string | null;
  title: string;
  description: string | null;
  status: MissionStatus;
  start_date: string | null;
  completion_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalculatedMission extends StoredMission {
  campaignName?: string | null;
  totalTasks: number;
  completedTasks: number;
  progressPct: number;
  performancePct: number | null;
}

export async function fetchMissions(businessId: string | undefined): Promise<CalculatedMission[]> {
  if (!businessId) return [];

  try {
    const [missionsRes, campaignsRes, tasksRes] = await Promise.all([
      (supabase.from as any)("missions")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false }),
      (supabase.from as any)("campaigns")
        .select("id, name")
        .eq("business_id", businessId),
      supabase
        .from("tasks")
        .select("id, mission_id, campaign_id, status")
        .eq("business_id", businessId),
    ]);

    if (missionsRes.error) {
      console.error("[fetchMissions] Supabase error:", missionsRes.error);
      return [];
    }

    const rawMissions = (missionsRes.data || []) as StoredMission[];
    const campaigns = campaignsRes.data || [];
    const tasks = tasksRes.data || [];

    const campaignMap: Record<string, string> = {};
    campaigns.forEach((c: any) => {
      campaignMap[c.id] = c.name;
    });

    const taskCountMap: Record<string, { total: number; completed: number }> = {};
    tasks.forEach((t: any) => {
      if (t.mission_id) {
        if (!taskCountMap[t.mission_id]) {
          taskCountMap[t.mission_id] = { total: 0, completed: 0 };
        }
        taskCountMap[t.mission_id].total++;
        if (t.status === "completed") {
          taskCountMap[t.mission_id].completed++;
        }
      }
    });

    return rawMissions.map((m) => {
      const stats = taskCountMap[m.id] || { total: 0, completed: 0 };
      const totalTasks = stats.total;
      const completedTasks = stats.completed;
      const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const performancePct = totalTasks > 0 ? progressPct : null;

      return {
        ...m,
        campaignName: m.campaign_id ? campaignMap[m.campaign_id] || null : null,
        totalTasks,
        completedTasks,
        progressPct,
        performancePct,
      };
    });
  } catch (err) {
    console.error("[fetchMissions] unexpected error:", err);
    return [];
  }
}

export async function createMission(
  businessId: string,
  data: {
    title: string;
    description?: string | null;
    campaign_id?: string | null;
    start_date?: string | null;
  }
): Promise<StoredMission> {
  const { data: created, error } = await (supabase.from as any)("missions")
    .insert({
      business_id: businessId,
      campaign_id: data.campaign_id || null,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      status: "active",
      start_date: data.start_date || new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("[createMission] Supabase error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "mission",
    entity_id: created.id,
    action: "created",
    description: `Created mission: ${created.title}`,
  }).catch((err) => console.warn("[createMission] logActivity error:", err));

  return created;
}

export async function updateMission(
  missionId: string,
  businessId: string,
  updates: Partial<StoredMission>
): Promise<StoredMission> {
  const { data: updated, error } = await (supabase.from as any)("missions")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", missionId)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) {
    console.error("[updateMission] Supabase error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "mission",
    entity_id: missionId,
    action: "updated",
    description: `Updated mission: ${updated.title}`,
  }).catch((err) => console.warn("[updateMission] logActivity error:", err));

  return updated;
}

export async function archiveMission(
  missionId: string,
  businessId: string,
  status: "completed" | "archived" = "completed"
): Promise<boolean> {
  const now = new Date().toISOString();
  const { error } = await (supabase.from as any)("missions")
    .update({
      status,
      completion_date: now,
      updated_at: now,
    })
    .eq("id", missionId)
    .eq("business_id", businessId);

  if (error) {
    console.error("[archiveMission] Supabase error:", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  await logActivity({
    business_id: businessId,
    entity_type: "mission",
    entity_id: missionId,
    action: status === "completed" ? "completed" : "archived",
    description: `${status === "completed" ? "Completed" : "Archived"} mission #${missionId.slice(0, 8)}`,
  }).catch((err) => console.warn("[archiveMission] logActivity error:", err));

  return true;
}
