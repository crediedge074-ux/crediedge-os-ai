import { supabase } from "@/lib/supabase";

export async function uploadBusinessLogo(businessId: string, file: File): Promise<string | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${businessId}/logo-${Date.now()}.${ext}`;
  const { error: uploadErr } = await supabase.storage
    .from("business-logos")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadErr) {
    console.error("[uploadBusinessLogo] upload error:", uploadErr);
    return null;
  }
  const { data } = supabase.storage.from("business-logos").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${userId}/avatar-${Date.now()}.${ext}`;
  const { error: uploadErr } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadErr) {
    console.error("[uploadAvatar] upload error:", uploadErr);
    return null;
  }
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

export async function updateBusinessLogo(businessId: string, logoUrl: string): Promise<boolean> {
  const { error } = await (supabase.from as any)("businesses")
    .update({ logo_url: logoUrl, updated_at: new Date().toISOString() })
    .eq("id", businessId);
  if (error) {
    console.error("[updateBusinessLogo] error:", error);
    return false;
  }
  return true;
}

export async function updateAvatarUrl(userId: string, avatarUrl: string): Promise<boolean> {
  const { error } = await (supabase.from as any)("profiles")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) {
    console.error("[updateAvatarUrl] error:", error);
    return false;
  }
  return true;
}
