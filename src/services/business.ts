import { supabase } from "@/lib/supabase";
import type { Business, BusinessUpdate, Membership } from "@/lib/database.types";

export async function getPrimaryMembership(userId: string): Promise<Membership | null> {
  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("joined_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
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
