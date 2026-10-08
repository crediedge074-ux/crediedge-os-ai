import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { updateProfile } from "@/services/profiles";
import { uploadAvatar, updateAvatarUrl } from "@/services/storage";
import { logActivity } from "@/services/activity";
import { SectionHeader, FormField, SaveBar, PanelSkeleton, SettingsRow, ActionButton, type Feedback } from "../primitives";
import { InsufficientData } from "@/components/ui/InsufficientData";
import { supabase } from "@/lib/supabase";

export function AccountPanel() {
  const { profile, user, membership, refreshProfile } = useAuthContext();
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [pwModal, setPwModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setForm({ first_name: profile.first_name ?? "", last_name: profile.last_name ?? "", phone: profile.phone ?? "" });
    }
  }, [profile?.id]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.id, {
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        full_name: [form.first_name, form.last_name].filter(Boolean).join(" ") || null,
        phone: form.phone || null,
      });
      await refreshProfile();
      setFeedback("saved");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { setAvatarError("Photo must be under 2MB."); return; }
    setAvatarUploading(true);
    setAvatarError(null);
    try {
      const url = await uploadAvatar(user.id, file);
      if (url) {
        await updateAvatarUrl(user.id, url);
        await refreshProfile();
      } else {
        setAvatarError("Could not upload the photo. Please try again.");
      }
    } catch {
      setAvatarError("Could not upload the photo. Please try again.");
    } finally {
      setAvatarUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleAvatarRemove = async () => {
    if (!user) return;
    setAvatarUploading(true);
    try {
      await updateAvatarUrl(user.id, "");
      await refreshProfile();
    } catch {
      setAvatarError("Could not remove the photo.");
    } finally {
      setAvatarUploading(false);
    }
  };

  if (!profile) return <PanelSkeleton />;

  const displayName = profile.full_name ?? user?.email?.split("@")[0] ?? "User";
  const initials = (profile.first_name?.charAt(0) ?? displayName.charAt(0) ?? "?").toUpperCase();
  const avatarUrl = profile.avatar_url;

  return (
    <div className="space-y-6">
      <SectionHeader title="Account" description="Your personal profile, password and active sessions." />

      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="h-16 w-16 rounded-2xl object-cover" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-[22px] font-bold text-brand">{initials}</div>
        )}
        <div className="flex-1">
          <div className="text-[14px] font-semibold text-foreground">{displayName}</div>
          <div className="text-[12.5px] text-muted-foreground">{user?.email}</div>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={handleAvatarUpload} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={avatarUploading}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[12.5px] font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {avatarUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {avatarUploading ? "Uploading…" : "Change Photo"}
          </button>
          {avatarUrl && (
            <button
              onClick={handleAvatarRemove}
              disabled={avatarUploading}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-red-600 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      {avatarError && <p className="text-[12px] text-red-600">{avatarError}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="First Name" value={form.first_name} onChange={(v) => setForm((f) => ({ ...f, first_name: v }))} />
        <FormField label="Last Name" value={form.last_name} onChange={(v) => setForm((f) => ({ ...f, last_name: v }))} />
        <FormField label="Email Address" defaultValue={user?.email} type="email" hint="Email changes require re-authentication." />
        <FormField label="Phone Number" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
      </div>

      <div className="space-y-2">
        <div className="text-[13px] font-semibold text-foreground">Security</div>
        <SettingsRow label="Password" description="Change your account password" action={<ActionButton label="Change" onClick={() => setPwModal(true)} />} />
        <SettingsRow label="Two-Factor Authentication" description="Not enabled — recommended for account security" action={<ActionButton label="Enable" variant="brand" />} />
        <SettingsRow label="Active Sessions" description="Sign out of other sessions" action={<ActionButton label="Manage" onClick={() => setPwModal(false)} />} />
      </div>

      {pwModal && <PasswordModal onClose={() => setPwModal(false)} userId={user?.id ?? null} businessId={membership?.business_id ?? null} />}

      <SaveBar onSave={handleSave} saving={saving} feedback={feedback} />
    </div>
  );
}

function PasswordModal({ onClose, userId, businessId }: { onClose: () => void; userId: string | null; businessId: string | null }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = async () => {
    setError(null);
    if (!currentPw || !newPw || !confirmPw) { setError("All fields are required."); return; }
    if (newPw !== confirmPw) { setError("New passwords do not match."); return; }
    if (newPw.length < 8) { setError("New password must be at least 8 characters."); return; }
    setSaving(true);
    try {
      const { error: authErr } = await supabase.auth.updateUser({ password: newPw });
      if (authErr) throw new Error(authErr.message);
      if (userId && businessId) {
        await logActivity({ business_id: businessId, entity_type: "security", entity_id: userId, action: "password_changed", description: "Password changed from Settings", actor_id: userId }).catch(() => {});
      }
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      setError(err?.message || "Could not change password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[15px] font-semibold text-foreground">Change Password</div>
        {success ? (
          <div className="py-6 text-center">
            <div className="text-[14px] font-semibold text-emerald-600">Password changed successfully</div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-muted-foreground">Current Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 pr-10 text-[13px] text-foreground focus:outline-none" />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-muted-foreground">New Password</label>
              <input type={showPw ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] font-medium text-muted-foreground">Confirm New Password</label>
              <input type={showPw ? "text" : "password"} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none" />
            </div>
            {error && <p className="text-[12px] text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={onClose} className="rounded-lg border border-border bg-secondary px-4 py-2 text-[13px] font-medium text-foreground hover:bg-secondary/70">Cancel</button>
              <button onClick={handleChange} disabled={saving} className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:opacity-80 disabled:opacity-60">
                {saving ? "Changing…" : "Change Password"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
