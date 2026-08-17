import { supabase } from "@/lib/supabase";
import type { AppNotification } from "@/lib/database.types";

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

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    console.error("Error marking notification read:", error);
  }
}
