import { supabase } from "@/lib/supabase";

// The storage buckets enforce these limits server-side as well; this check is
// only here so the person uploading gets a clear message instead of a failure.
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif"];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a PNG, JPG, WEBP or GIF image.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "That image is too large. Please choose one under 5 MB.";
  }
  return null;
}

function safeExtension(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  return ALLOWED_EXTENSIONS.includes(ext) ? ext : "png";
}

export async function uploadBusinessLogo(businessId: string, file: File): Promise<string | null> {
  if (validateImageFile(file)) return null;
  const ext = safeExtension(file);
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
  if (validateImageFile(file)) return null;
  const ext = safeExtension(file);
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
