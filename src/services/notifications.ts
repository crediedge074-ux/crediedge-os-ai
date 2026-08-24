import { supabase } from "@/lib/supabase";
import type { AppNotification } from "@/lib/database.types";
import { getPublishedReleases, getUserReadReleaseIds, markReleaseRead } from "./releases";

export async function getNotifications(businessId: string): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  return data ?? [];
}

export async function getAllCombinedNotifications(
  businessId: string | undefined,
  userId: string | undefined
): Promise<AppNotification[]> {
  const businessNotifs = businessId ? await getNotifications(businessId) : [];

  if (!userId) return businessNotifs;

  // Fetch published global system releases
  const releases = await getPublishedReleases();
  const readReleaseIds = await getUserReadReleaseIds(userId);

  // Convert global releases to AppNotification format dynamically without duplicating database rows
  const releaseNotifs: AppNotification[] = releases.map((rel) => {
    const isRead = readReleaseIds.includes(rel.id);
    return {
      id: `release-${rel.id}`,
      created_at: rel.published_at || rel.created_at,
      business_id: "", // Global system release (not business specific)
      user_id: userId,
      type: "system_release",
      title: `CrediEdgeOS ${rel.version} Updated`,
      message: `${rel.title} — ${rel.description}`,
      action_url: "/support",
      is_read: isRead,
    };
  });

  const combined = [...releaseNotifs, ...businessNotifs];
  combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return combined;
}

export async function markNotificationRead(id: string, userId?: string): Promise<void> {
  if (id.startsWith("release-")) {
    const releaseId = id.replace("release-", "");
    if (userId) {
      await markReleaseRead(userId, releaseId);
    }
    return;
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    console.error("Error marking notification read:", error);
  }
}

export async function createWorkspaceNotification(params: {
  businessId: string;
  userId?: string | null;
  type: string;
  title: string;
  message: string;
  actionUrl?: string | null;
}): Promise<void> {
  const { businessId, userId, type, title, message, actionUrl } = params;
  if (!businessId) return;

  try {
    const { error } = await supabase.from("notifications").insert({
      business_id: businessId,
      user_id: userId || null,
      type,
      title,
      message,
      action_url: actionUrl || null,
      is_read: false,
    });

    if (error) {
      console.error("[createWorkspaceNotification] error:", error);
    }
  } catch (err) {
    console.error("[createWorkspaceNotification] failed:", err);
  }
}
