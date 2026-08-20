import { supabase } from "@/lib/supabase";

export type ReleaseType = "Feature" | "Improvement" | "Bug Fix" | "Security" | "System Update";

export interface AppRelease {
  id: string;
  created_at: string;
  version: string;
  title: string;
  description: string;
  release_type: ReleaseType;
  published_at: string | null;
  is_published: boolean;
  changelog_notes: string | null;
  deployment_id: string | null;
}

export interface PublishReleasePayload {
  version: string;
  title: string;
  description: string;
  release_type?: ReleaseType;
  changelog_notes?: string;
  deployment_id?: string;
}

export async function getPublishedReleases(): Promise<AppRelease[]> {
  const { data, error } = await supabase
    .from("app_releases")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching published releases:", error);
    return [];
  }
  return (data || []).map((r) => ({ ...r, release_type: r.release_type as ReleaseType }));
}

export async function getUserReadReleaseIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("user_release_reads")
    .select("release_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user release reads:", error);
    return [];
  }
  return (data || []).map((r) => r.release_id);
}

export async function markReleaseRead(userId: string, releaseId: string): Promise<void> {
  const { error } = await supabase
    .from("user_release_reads")
    .insert({ user_id: userId, release_id: releaseId });

  if (error && error.code !== "23505") { // Ignore duplicate primary key error
    console.error("Error marking release read:", error);
  }
}

export async function publishRelease(payload: PublishReleasePayload): Promise<AppRelease | null> {
  const { data, error } = await supabase
    .from("app_releases")
    .insert({
      version: payload.version,
      title: payload.title,
      description: payload.description,
      release_type: payload.release_type ?? "Feature",
      changelog_notes: payload.changelog_notes ?? null,
      deployment_id: payload.deployment_id ?? null,
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error publishing release:", error);
    throw error;
  }
  return data ? { ...data, release_type: data.release_type as ReleaseType } : null;
}
