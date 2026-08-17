import { supabase } from "@/lib/supabase";
import type { Business, BusinessUpdate, Membership } from "@/lib/database.types";

export async function getPrimaryMembership(userId: string): Promise<Membership | null> {
  console.log("[getPrimaryMembership] querying memberships for userId:", userId);
  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) {
    console.error("[getPrimaryMembership] error querying memberships:", error);
    throw error;
  }

  console.log("[getPrimaryMembership] query returned data:", data);

  if (!data || data.length === 0) {
    console.warn("[getPrimaryMembership] no membership row found for user:", userId);
    return null;
  }

  return data[0];
}

export async function getBusiness(businessId: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateBusiness(businessId: string, updates: BusinessUpdate): Promise<Business> {
  const { data, error } = await supabase
    .from("businesses")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", businessId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
