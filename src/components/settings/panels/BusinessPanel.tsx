import { useState, useEffect, useRef } from "react";
import { Building2, Upload, Trash2, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { updateBusiness } from "@/services/business";
import { uploadBusinessLogo, updateBusinessLogo, validateImageFile } from "@/services/storage";
import { logActivity } from "@/services/activity";
import { SectionHeader, FormField, SaveBar, PanelSkeleton, type Feedback, type BusinessHour, DEFAULT_BUSINESS_HOURS } from "../primitives";
import { InsufficientData } from "@/components/ui/InsufficientData";
import { supabase } from "@/lib/supabase";

export function BusinessPanel() {
  const { business, membership, user, refreshBusiness } = useAuthContext();
  const canEdit = membership?.role === "owner" || membership?.role === "admin";

  const [form, setForm] = useState({
    name: "", industry: "", phone: "", email: "", website: "",
    vat_number: "", address_line_1: "", city: "", postcode: "",
    timezone: "Europe/London", currency: "GBP",
  });
  const [hours, setHours] = useState<BusinessHour[]>(DEFAULT_BUSINESS_HOURS);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name ?? "",
        industry: business.industry ?? "",
        phone: business.phone ?? "",
        email: business.email ?? "",
        website: business.website ?? "",
        vat_number: business.vat_number ?? "",
        address_line_1: business.address_line_1 ?? "",
        city: business.city ?? "",
        postcode: business.postcode ?? "",
        timezone: business.timezone ?? "Europe/London",
        currency: business.currency ?? "GBP",
      });
    }
    const storedHours = (business as any)?.business_hours;
    if (storedHours && Array.isArray(storedHours) && storedHours.length === 7) {
      setHours(storedHours as BusinessHour[]);
    }
  }, [business?.id]);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!membership?.business_id || !canEdit) return;
    setSaving(true);
    try {
      await updateBusiness(membership.business_id, form);
      await (supabase.from as any)("businesses")
        .update({ business_hours: hours, updated_at: new Date().toISOString() })
        .eq("id", membership.business_id);
      await logActivity({
        business_id: membership.business_id,
        entity_type: "business",
        entity_id: membership.business_id,
        action: "updated",
        description: "Updated business profile settings",
        actor_id: user?.id ?? null,
      }).catch(() => {});
      await refreshBusiness();
      setFeedback("saved");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !membership?.business_id) return;
    const invalid = validateImageFile(file);
    if (invalid) { setLogoError(invalid); return; }
    setLogoUploading(true);
    setLogoError(null);
    try {
      const url = await uploadBusinessLogo(membership.business_id, file);
      if (url) {
        await updateBusinessLogo(membership.business_id, url);
        await refreshBusiness();
      } else {
        setLogoError("Could not upload the logo. Please try again.");
      }
    } catch {
      setLogoError("Could not upload the logo. Please try again.");
    } finally {
      setLogoUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleLogoRemove = async () => {
    if (!membership?.business_id) return;
    setLogoUploading(true);
    try {
      await updateBusinessLogo(membership.business_id, "");
      await refreshBusiness();
    } catch {
      setLogoError("Could not remove the logo.");
    } finally {
      setLogoUploading(false);
    }
  };

  if (!business) return <PanelSkeleton />;

  const logoUrl = (business as any)?.logo_url as string | null;

  return (
    <div className="space-y-6">
      <SectionHeader title="Business Profile" description="Your business identity displayed throughout CrediEdgeOS." />

      {!canEdit && (
        <InsufficientData description="You need Owner or Admin permissions to edit business profile settings. You can view the current settings below." icon={Building2} />
      )}

      {/* Logo */}
      <div className="flex items-center gap-4">
        {logoUrl ? (
          <img src={logoUrl} alt={business.name} className="h-16 w-16 rounded-2xl object-cover" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-[22px] font-bold text-brand">
            {business.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
        )}
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-foreground">Business Logo</div>
          <div className="text-[12px] text-muted-foreground">PNG or JPG, up to 2MB. Used throughout CrediEdgeOS.</div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={handleLogoUpload} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={logoUploading}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[12.5px] font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
            >
              {logoUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {logoUploading ? "Uploading…" : "Upload"}
            </button>
            {logoUrl && (
              <button
                onClick={handleLogoRemove}
                disabled={logoUploading}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-red-600 disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>
        )}
      </div>
      {logoError && <p className="text-[12px] text-red-600">{logoError}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Business Name" value={form.name} onChange={canEdit ? set("name") : undefined} />
        <FormField label="Industry" value={form.industry} onChange={canEdit ? set("industry") : undefined} />
        <FormField label="Phone Number" value={form.phone} onChange={canEdit ? set("phone") : undefined} />
        <FormField label="Email Address" value={form.email} onChange={canEdit ? set("email") : undefined} type="email" />
        <FormField label="Website" value={form.website} onChange={canEdit ? set("website") : undefined} hint="Used by Website Intelligence and other modules." />
        <FormField label="VAT Number" value={form.vat_number} onChange={canEdit ? set("vat_number") : undefined} />
        <FormField label="Address Line 1" value={form.address_line_1} onChange={canEdit ? set("address_line_1") : undefined} />
        <FormField label="City / Town" value={form.city} onChange={canEdit ? set("city") : undefined} />
        <FormField label="Postcode" value={form.postcode} onChange={canEdit ? set("postcode") : undefined} />
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Timezone</label>
          <select
            value={form.timezone}
            onChange={canEdit ? (e) => set("timezone")(e.target.value) : undefined}
            disabled={!canEdit}
            className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none disabled:opacity-60"
          >
            <option value="Europe/London">Europe/London (GMT+1)</option>
            <option value="America/New_York">America/New_York (GMT-4)</option>
            <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Currency</label>
          <select
            value={form.currency}
            onChange={canEdit ? (e) => set("currency")(e.target.value) : undefined}
            disabled={!canEdit}
            className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none disabled:opacity-60"
          >
            <option value="GBP">GBP — British Pound (£)</option>
            <option value="USD">USD — US Dollar ($)</option>
            <option value="EUR">EUR — Euro (€)</option>
          </select>
        </div>
      </div>

      <div>
        <div className="mb-3 text-[13px] font-semibold text-foreground">Business Hours</div>
        <div className="overflow-hidden rounded-xl border border-border">
          {hours.map((bh, i) => (
            <div key={bh.day} className={`flex items-center gap-4 px-4 py-3 ${i < hours.length - 1 ? "border-b border-border" : ""}`}>
              <div className="w-24 text-[12.5px] font-medium text-foreground">{bh.day}</div>
              {canEdit ? (
                <>
                  <button
                    onClick={() => setHours((h) => h.map((x, j) => j === i ? { ...x, open: !x.open } : x))}
                    className={`h-5 w-9 rounded-full transition-colors ${bh.open ? "bg-brand" : "bg-muted-foreground/30"}`}
                  >
                    <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${bh.open ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                  {bh.open ? (
                    <>
                      <input
                        type="time"
                        value={bh.from}
                        onChange={(e) => setHours((h) => h.map((x, j) => j === i ? { ...x, from: e.target.value } : x))}
                        className="rounded-lg border border-border bg-secondary/30 px-2 py-1 text-[12px] text-foreground focus:outline-none"
                      />
                      <span className="text-[12px] text-muted-foreground">–</span>
                      <input
                        type="time"
                        value={bh.to}
                        onChange={(e) => setHours((h) => h.map((x, j) => j === i ? { ...x, to: e.target.value } : x))}
                        className="rounded-lg border border-border bg-secondary/30 px-2 py-1 text-[12px] text-foreground focus:outline-none"
                      />
                    </>
                  ) : (
                    <span className="text-[12px] text-muted-foreground">Closed</span>
                  )}
                </>
              ) : (
                <>
                  <div className={`h-1.5 w-1.5 rounded-full ${bh.open ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                  <div className="text-[12px] text-muted-foreground">{bh.open ? `${bh.from} – ${bh.to}` : "Closed"}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {canEdit && <SaveBar onSave={handleSave} saving={saving} feedback={feedback} />}
    </div>
  );
}
