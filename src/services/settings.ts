import { supabase } from "@/lib/supabase";
import type { BusinessSettings, BusinessSettingsUpdate } from "@/lib/database.types";

export async function getBusinessSettings(businessId: string): Promise<BusinessSettings | null> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateBusinessSettings(
  businessId: string,
  updates: BusinessSettingsUpdate,
): Promise<BusinessSettings> {
  const { data, error } = await supabase
    .from("settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("business_id", businessId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
