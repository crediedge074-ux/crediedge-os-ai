import { supabase } from "@/lib/supabase";

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: string;
  accent_colour: string;
  compact_mode: boolean;
  notification_new_enquiry: boolean;
  notification_invoice_overdue: boolean;
  notification_new_review: boolean;
  notification_daily_briefing: boolean;
  notification_weekly_report: boolean;
  notification_campaign_alerts: boolean;
  notification_mission_updates: boolean;
  notification_ai_insights: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferencesUpdate {
  theme?: string;
  accent_colour?: string;
  compact_mode?: boolean;
  notification_new_enquiry?: boolean;
  notification_invoice_overdue?: boolean;
  notification_new_review?: boolean;
  notification_daily_briefing?: boolean;
  notification_weekly_report?: boolean;
  notification_campaign_alerts?: boolean;
  notification_mission_updates?: boolean;
  notification_ai_insights?: boolean;
}

const DEFAULTS: UserPreferencesUpdate = {
  theme: "system",
  accent_colour: "#E31B23",
  compact_mode: false,
  notification_new_enquiry: true,
  notification_invoice_overdue: true,
  notification_new_review: true,
  notification_daily_briefing: true,
  notification_weekly_report: true,
  notification_campaign_alerts: true,
  notification_mission_updates: true,
  notification_ai_insights: true,
};

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const { data, error } = await (supabase.from as any)("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("[getUserPreferences] error:", error);
    return { ...DEFAULTS, id: "", user_id: userId, created_at: "", updated_at: "" } as UserPreferences;
  }
  if (!data) {
    const { data: created, error: createErr } = await (supabase.from as any)("user_preferences")
      .insert({ user_id: userId, ...DEFAULTS })
      .select()
      .single();
    if (createErr) {
      console.error("[getUserPreferences] create error:", createErr);
      return { ...DEFAULTS, id: "", user_id: userId, created_at: "", updated_at: "" } as UserPreferences;
    }
    return created as UserPreferences;
  }
  return data as UserPreferences;
}

export async function updateUserPreferences(userId: string, updates: UserPreferencesUpdate): Promise<UserPreferences> {
  const { data: existing } = await (supabase.from as any)("user_preferences")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!existing) {
    const { data, error } = await (supabase.from as any)("user_preferences")
      .insert({ user_id: userId, ...DEFAULTS, ...updates })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as UserPreferences;
  }

  const { data, error } = await (supabase.from as any)("user_preferences")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as UserPreferences;
}
