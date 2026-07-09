import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { Building2, User, Users, Bell, Palette, Brain, Database, Shield, CreditCard, Layers, Circle as HelpCircle, Activity, ChevronRight, CircleCheck as CheckCircle2, Globe, Clock, Lock, Key, Download, Upload, Trash2, Star, Smartphone, Monitor, Sun, Moon, RefreshCw } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { updateProfile } from "@/services/profiles";
import { updateBusiness } from "@/services/business";
import { updateBusinessSettings } from "@/services/settings";

// ─── Section config ───────────────────────────────────────────────────────────

interface SectionDef {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  group: string;
}

const sections: SectionDef[] = [
  { id: "business", icon: Building2, label: "Business Profile", description: "Name, logo, contact and hours", group: "Core" },
  { id: "account", icon: User, label: "Account", description: "Profile, password and devices", group: "Core" },
  { id: "organisation", icon: Users, label: "Organisation", description: "Users, roles and permissions", group: "Core" },
  { id: "notifications", icon: Bell, label: "Notifications", description: "Email, push and SMS preferences", group: "Preferences" },
  { id: "appearance", icon: Palette, label: "Appearance", description: "Theme, layout and display", group: "Preferences" },
  { id: "ai", icon: Brain, label: "AI Settings", description: "Models, analysis and behaviour", group: "Preferences" },
  { id: "data", icon: Database, label: "Data & Privacy", description: "Export, backup and GDPR", group: "Data" },
  { id: "security", icon: Shield, label: "Security", description: "2FA, sessions and audit logs", group: "Data" },
  { id: "billing", icon: CreditCard, label: "Billing", description: "Plan, invoices and usage", group: "Account" },
  { id: "whitelabel", icon: Layers, label: "White Label", description: "Custom branding and domains", group: "Account" },
  { id: "status", icon: Activity, label: "System Status", description: "Platform health and versions", group: "System" },
  { id: "help", icon: HelpCircle, label: "Help & Support", description: "Docs, requests and changelog", group: "System" },
];

const groups = ["Core", "Preferences", "Data", "Account", "System"];

// ─── Reusable primitives ──────────────────────────────────────────────────────

function SettingsRow({ label, description, action }: { label: string; description?: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/20 px-4 py-3.5">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-foreground">{label}</div>
        {description && <div className="mt-0.5 text-[12px] text-muted-foreground">{description}</div>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-brand" : "bg-border"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function ActionButton({ label, variant = "secondary" }: { label: string; variant?: "secondary" | "brand" | "danger" }) {
  const cls =
    variant === "brand" ? "bg-brand text-white hover:opacity-80" :
    variant === "danger" ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100" :
    "border border-border bg-card text-foreground hover:bg-secondary";
  return (
    <button className={`rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors ${cls}`}>{label}</button>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5 border-b border-border pb-4">
      <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
      <p className="mt-0.5 text-[12.5px] text-muted-foreground">{description}</p>
    </div>
  );
}

function FormField({
  label, value, onChange, defaultValue, type = "text", hint,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  defaultValue?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        defaultValue={value === undefined ? defaultValue : undefined}
        className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/20 focus:bg-card focus:outline-none"
      />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

type Feedback = "saved" | "error" | null;

function SaveBar({ onSave, saving, feedback }: { onSave?: () => void; saving?: boolean; feedback?: Feedback }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {feedback === "saved" && (
        <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
          Saved
        </span>
      )}
      {feedback === "error" && (
        <span className="text-[12.5px] font-medium text-red-600">Failed to save. Try again.</span>
      )}
      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-80 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-secondary" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-secondary" />
        ))}
      </div>
    </div>
  );
}

// ─── Panel: Business Profile ──────────────────────────────────────────────────

function BusinessPanel() {
  const { business, membership, refreshBusiness } = useAuthContext();
  const [form, setForm] = useState({
    name: "", industry: "", phone: "", email: "", website: "",
    vat_number: "", address_line_1: "", city: "", postcode: "",
    timezone: "Europe/London", currency: "GBP",
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

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
  }, [business?.id]);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!membership?.business_id) return;
    setSaving(true);
    try {
      await updateBusiness(membership.business_id, form);
      await refreshBusiness();
      setFeedback("saved");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  if (!business) return <PanelSkeleton />;

  const businessHours = [
    { day: "Monday", open: true, from: "08:00", to: "18:00" },
    { day: "Tuesday", open: true, from: "08:00", to: "18:00" },
    { day: "Wednesday", open: true, from: "08:00", to: "18:00" },
    { day: "Thursday", open: true, from: "08:00", to: "18:00" },
    { day: "Friday", open: true, from: "08:00", to: "17:00" },
    { day: "Saturday", open: true, from: "09:00", to: "14:00" },
    { day: "Sunday", open: false, from: "—", to: "—" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Business Profile" description="Your business identity displayed throughout CrediEdgeOS." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Business Name" value={form.name} onChange={set("name")} />
        <FormField label="Industry" value={form.industry} onChange={set("industry")} />
        <FormField label="Phone Number" value={form.phone} onChange={set("phone")} />
        <FormField label="Email Address" value={form.email} onChange={set("email")} type="email" />
        <FormField label="Website" value={form.website} onChange={set("website")} />
        <FormField label="VAT Number" value={form.vat_number} onChange={set("vat_number")} />
        <FormField label="Address Line 1" value={form.address_line_1} onChange={set("address_line_1")} />
        <FormField label="City / Town" value={form.city} onChange={set("city")} />
        <FormField label="Postcode" value={form.postcode} onChange={set("postcode")} />
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Timezone</label>
          <select
            value={form.timezone}
            onChange={(e) => set("timezone")(e.target.value)}
            className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
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
            onChange={(e) => set("currency")(e.target.value)}
            className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
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
          {businessHours.map((bh, i) => (
            <div key={bh.day} className={`flex items-center gap-4 px-4 py-3 ${i < businessHours.length - 1 ? "border-b border-border" : ""}`}>
              <div className="w-24 text-[12.5px] font-medium text-foreground">{bh.day}</div>
              <div className={`h-1.5 w-1.5 rounded-full ${bh.open ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
              <div className="text-[12px] text-muted-foreground">{bh.open ? `${bh.from} – ${bh.to}` : "Closed"}</div>
            </div>
          ))}
        </div>
      </div>

      <SaveBar onSave={handleSave} saving={saving} feedback={feedback} />
    </div>
  );
}

// ─── Panel: Account ───────────────────────────────────────────────────────────

function AccountPanel() {
  const { profile, user, refreshProfile } = useAuthContext();
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        phone: profile.phone ?? "",
      });
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

  if (!profile) return <PanelSkeleton />;

  const displayName = profile.full_name ?? user?.email?.split("@")[0] ?? "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <SectionHeader title="Account" description="Your personal profile, password and active sessions." />

      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={displayName} className="h-16 w-16 rounded-2xl object-cover" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-[22px] font-bold text-brand">
            {initials}
          </div>
        )}
        <div>
          <div className="text-[14px] font-semibold text-foreground">{displayName}</div>
          <div className="text-[12.5px] text-muted-foreground">{user?.email}</div>
        </div>
        <button className="ml-auto rounded-xl border border-border bg-secondary px-3.5 py-2 text-[12.5px] font-medium text-foreground transition-colors hover:bg-secondary/70">
          Change Photo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="First Name" value={form.first_name} onChange={(v) => setForm((f) => ({ ...f, first_name: v }))} />
        <FormField label="Last Name" value={form.last_name} onChange={(v) => setForm((f) => ({ ...f, last_name: v }))} />
        <FormField label="Email Address" defaultValue={user?.email} type="email" hint="Email changes require re-authentication." />
        <FormField label="Phone Number" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
      </div>

      <div className="space-y-2">
        <div className="text-[13px] font-semibold text-foreground">Security</div>
        <SettingsRow label="Password" description="Last changed 30 days ago" action={<ActionButton label="Change" />} />
        <SettingsRow label="Two-Factor Authentication" description="Not enabled — recommended for account security" action={<ActionButton label="Enable" variant="brand" />} />
        <SettingsRow label="Active Sessions" description="1 active session on this device" action={<ActionButton label="View" />} />
        <SettingsRow label="Active Devices" description="MacBook Pro, iPhone 15" action={<ActionButton label="Manage" />} />
      </div>

      <SaveBar onSave={handleSave} saving={saving} feedback={feedback} />
    </div>
  );
}

// ─── Panel: Organisation ──────────────────────────────────────────────────────

function OrganisationPanel() {
  const { profile, membership, business } = useAuthContext();

  const roles = profile ? [
    {
      name: profile.full_name ?? profile.first_name ?? "You",
      email: "",
      role: membership?.role ?? "Owner",
      status: "active",
    },
  ] : [];

  const rolePermissions = [
    { role: "Owner", permissions: ["Full access", "Billing", "Users", "Delete data", "API keys"] },
    { role: "Admin", permissions: ["All features", "Manage users", "View billing"] },
    { role: "Staff", permissions: ["View data", "Create tasks", "Manage communications"] },
    { role: "Read Only", permissions: ["View reports", "View dashboard"] },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Organisation" description="Manage your team members, roles and access permissions." />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[13px] font-semibold text-foreground">
            Team Members{business?.name ? ` — ${business.name}` : ""}
          </div>
          <button className="rounded-xl bg-brand px-3.5 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-80">
            Invite Member
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          {roles.map((r, i) => (
            <div key={i} className={`flex items-center gap-4 px-4 py-3.5 ${i < roles.length - 1 ? "border-b border-border" : ""}`}>
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
                {r.name[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-foreground">{r.name}</div>
                {r.email && <div className="text-[11.5px] text-muted-foreground">{r.email}</div>}
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700">
                {r.role.charAt(0).toUpperCase() + r.role.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 text-[13px] font-semibold text-foreground">Role Permissions</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {rolePermissions.map((r) => (
            <div key={r.role} className="rounded-xl border border-border bg-secondary/20 p-4">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">{r.role}</div>
              <div className="space-y-1">
                {r.permissions.map((p) => (
                  <div key={p} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={1.75} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Panel: Notifications ─────────────────────────────────────────────────────

function NotificationsPanel() {
  const { settings, membership, refreshSettings } = useAuthContext();
  const [prefs, setPrefs] = useState<Record<string, { email: boolean; push: boolean; sms: boolean }>>({
    new_enquiry: { email: true, push: true, sms: true },
    invoice_overdue: { email: true, push: true, sms: false },
    new_review: { email: true, push: true, sms: false },
    daily_briefing: { email: true, push: false, sms: false },
    weekly_report: { email: true, push: false, sms: false },
    campaign_alerts: { email: false, push: true, sms: false },
    mission_updates: { email: false, push: true, sms: false },
    ai_insights: { email: true, push: true, sms: false },
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (settings) {
      setPrefs((p) => ({
        ...p,
        daily_briefing: { ...p.daily_briefing, email: settings.daily_briefing },
        weekly_report: { ...p.weekly_report, email: settings.weekly_report },
        new_enquiry: { ...p.new_enquiry, email: settings.email_notifications, push: settings.push_notifications, sms: settings.sms_notifications },
      }));
    }
  }, [settings?.id]);

  const toggle = (id: string, channel: "email" | "push" | "sms") => {
    setPrefs((p) => ({ ...p, [id]: { ...p[id], [channel]: !p[id][channel] } }));
  };

  const handleSave = async () => {
    if (!membership?.business_id) return;
    setSaving(true);
    try {
      await updateBusinessSettings(membership.business_id, {
        email_notifications: prefs.new_enquiry.email,
        push_notifications: prefs.new_enquiry.push,
        sms_notifications: prefs.new_enquiry.sms,
        daily_briefing: prefs.daily_briefing.email,
        weekly_report: prefs.weekly_report.email,
      });
      await refreshSettings();
      setFeedback("saved");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  const items = [
    { id: "new_enquiry", label: "New Enquiry Received", description: "Triggered when a new lead or enquiry arrives" },
    { id: "invoice_overdue", label: "Invoice Overdue", description: "Alert when an invoice passes its due date" },
    { id: "new_review", label: "New Review Posted", description: "Notified when a customer posts a new review" },
    { id: "daily_briefing", label: "Daily AI Briefing", description: "Receive your CEO morning briefing each day" },
    { id: "weekly_report", label: "Weekly Performance Report", description: "Receive a weekly AI business summary" },
    { id: "campaign_alerts", label: "Campaign Alerts", description: "Status updates on running campaigns" },
    { id: "mission_updates", label: "Mission Updates", description: "Task completion and mission progress alerts" },
    { id: "ai_insights", label: "AI Insights", description: "New AI discoveries and opportunity alerts" },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader title="Notifications" description="Control how and when CrediEdgeOS notifies you." />

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[1fr_64px_64px_64px] border-b border-border bg-secondary/30 px-4 py-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Notification</div>
          <div className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</div>
          <div className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Push</div>
          <div className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">SMS</div>
        </div>
        {items.map((item, i) => (
          <div key={item.id} className={`grid grid-cols-[1fr_64px_64px_64px] items-center px-4 py-3.5 ${i < items.length - 1 ? "border-b border-border" : ""}`}>
            <div>
              <div className="text-[13px] font-medium text-foreground">{item.label}</div>
              <div className="text-[11.5px] text-muted-foreground">{item.description}</div>
            </div>
            {(["email", "push", "sms"] as const).map((ch) => (
              <div key={ch} className="flex justify-center">
                <Toggle on={prefs[item.id][ch]} onChange={() => toggle(item.id, ch)} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <SaveBar onSave={handleSave} saving={saving} feedback={feedback} />
    </div>
  );
}

// ─── Panel: Appearance ────────────────────────────────────────────────────────

function AppearancePanel() {
  const { settings, membership, refreshSettings } = useAuthContext();
  const [theme, setTheme] = useState("Light");
  const [accent, setAccent] = useState("#E31B23");
  const [compact, setCompact] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme === "dark" ? "Dark" : settings.theme === "system" ? "System" : "Light");
      setAccent(settings.accent_colour ?? "#E31B23");
      setCompact(settings.compact_mode);
    }
  }, [settings?.id]);

  const handleSave = async () => {
    if (!membership?.business_id) return;
    setSaving(true);
    try {
      await updateBusinessSettings(membership.business_id, {
        theme: theme.toLowerCase(),
        accent_colour: accent,
        compact_mode: compact,
      });
      await refreshSettings();
      setFeedback("saved");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  const colors = [
    { value: "#E31B23", label: "CrediEdge Red" },
    { value: "#1A1A1A", label: "Midnight" },
    { value: "#2563EB", label: "Ocean" },
    { value: "#059669", label: "Forest" },
    { value: "#D97706", label: "Amber" },
    { value: "#7C3AED", label: "Violet" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Appearance" description="Personalise the look and feel of CrediEdgeOS." />

      <div>
        <label className="mb-2.5 block text-[13px] font-semibold text-foreground">Theme</label>
        <div className="flex gap-2">
          {[{ label: "Light", icon: Sun }, { label: "Dark", icon: Moon }, { label: "System", icon: Monitor }].map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setTheme(label)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-colors ${theme === label ? "border-brand bg-brand/10 text-brand" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2.5 block text-[13px] font-semibold text-foreground">Accent Colour</label>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((c) => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => setAccent(c.value)}
              className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${accent === c.value ? "border-foreground" : "border-transparent"}`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2.5 block text-[13px] font-semibold text-foreground">Layout</label>
        <div className="space-y-2">
          <SettingsRow label="Compact Mode" description="Reduce spacing and padding for a denser interface" action={<Toggle on={compact} onChange={setCompact} />} />
        </div>
      </div>

      <SaveBar onSave={handleSave} saving={saving} feedback={feedback} />
    </div>
  );
}

// ─── Panel: AI Settings ───────────────────────────────────────────────────────

function AIPanel() {
  const { settings, membership, refreshSettings } = useAuthContext();
  const [form, setForm] = useState({
    ai_provider: "openai",
    ai_model: "gpt-4o",
    ai_creativity: 65,
    ai_enabled: true,
    daily_briefing: true,
    weekly_report: true,
    business_context: "",
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (settings) {
      setForm({
        ai_provider: settings.ai_provider ?? "openai",
        ai_model: settings.ai_model ?? "gpt-4o",
        ai_creativity: settings.ai_creativity ?? 65,
        ai_enabled: settings.ai_enabled,
        daily_briefing: settings.daily_briefing,
        weekly_report: settings.weekly_report,
        business_context: settings.business_context ?? "",
      });
    }
  }, [settings?.id]);

  const handleSave = async () => {
    if (!membership?.business_id) return;
    setSaving(true);
    try {
      await updateBusinessSettings(membership.business_id, {
        ai_provider: form.ai_provider,
        ai_model: form.ai_model,
        ai_creativity: form.ai_creativity,
        ai_enabled: form.ai_enabled,
        daily_briefing: form.daily_briefing,
        weekly_report: form.weekly_report,
        business_context: form.business_context || null,
      });
      await refreshSettings();
      setFeedback("saved");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <PanelSkeleton />;

  return (
    <div className="space-y-6">
      <SectionHeader title="AI Settings" description="Configure how the AI analyses and communicates with you." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">AI Provider</label>
          <select
            value={form.ai_provider}
            onChange={(e) => setForm((f) => ({ ...f, ai_provider: e.target.value }))}
            className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none"
          >
            <option value="openai">OpenAI (GPT-4o)</option>
            <option value="anthropic">Anthropic (Claude 3.5)</option>
            <option value="google">Google (Gemini 1.5)</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Preferred Model</label>
          <select
            value={form.ai_model}
            onChange={(e) => setForm((f) => ({ ...f, ai_model: e.target.value }))}
            className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none"
          >
            <option value="gpt-4o">GPT-4o (Recommended)</option>
            <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
            <option value="o1">GPT-o1 (Advanced Reasoning)</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Response Length</label>
          <select className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none">
            <option>Concise</option>
            <option>Standard</option>
            <option>Detailed</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Analysis Frequency</label>
          <select className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none">
            <option>Every hour</option>
            <option>Every 6 hours</option>
            <option>Daily</option>
            <option>Manual only</option>
          </select>
        </div>
      </div>

      <div>
        <div className="mb-2.5 text-[13px] font-semibold text-foreground">Creativity Level</div>
        <input
          type="range" min={0} max={100}
          value={form.ai_creativity}
          onChange={(e) => setForm((f) => ({ ...f, ai_creativity: Number(e.target.value) }))}
          className="w-full accent-brand"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
          <span>Precise</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>

      <div className="space-y-2">
        <SettingsRow label="AI Enabled" description="Enable AI analysis and insights across the platform" action={<Toggle on={form.ai_enabled} onChange={(v) => setForm((f) => ({ ...f, ai_enabled: v }))} />} />
        <SettingsRow label="Scheduled AI Refresh" description="Re-analyse all data at 06:00 each morning" action={<Toggle on={form.daily_briefing} onChange={(v) => setForm((f) => ({ ...f, daily_briefing: v }))} />} />
        <SettingsRow label="Automatic AI Reports" description="Generate weekly executive reports automatically" action={<Toggle on={form.weekly_report} onChange={(v) => setForm((f) => ({ ...f, weekly_report: v }))} />} />
      </div>

      <div>
        <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Business Context</label>
        <textarea
          value={form.business_context}
          onChange={(e) => setForm((f) => ({ ...f, business_context: e.target.value }))}
          placeholder="Describe your business, goals and challenges to help the AI provide more relevant insights..."
          rows={4}
          className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/20 focus:outline-none"
        />
        <p className="mt-1 text-[11px] text-muted-foreground">This context helps the AI understand your business goals and provide more relevant insights.</p>
      </div>

      <SaveBar onSave={handleSave} saving={saving} feedback={feedback} />
    </div>
  );
}

// ─── Static panels ────────────────────────────────────────────────────────────

function DataPanel() {
  return (
    <div className="space-y-5">
      <SectionHeader title="Data & Privacy" description="Manage your data, exports, backups and privacy settings." />
      <div className="space-y-2">
        <div className="text-[13px] font-semibold text-foreground">Data Management</div>
        <SettingsRow label="Export All Data" description="Download a full export of your business data as CSV / JSON" action={<ActionButton label="Export" />} />
        <SettingsRow label="Import Data" description="Import contacts, jobs or financial data from CSV" action={<ActionButton label="Import" />} />
        <SettingsRow label="Data Retention" description="Automatically archive records older than 24 months" action={<ActionButton label="Configure" />} />
      </div>
      <div className="space-y-2">
        <div className="text-[13px] font-semibold text-foreground">Backups</div>
        <SettingsRow label="Create Backup" description="Generate a full backup of your platform data now" action={<ActionButton label="Backup Now" />} />
        <SettingsRow label="Last Backup" description="Completed successfully — 6 Jul 2026 at 02:00" action={<ActionButton label="Download" />} />
        <SettingsRow label="Restore from Backup" description="Restore a previous backup to this account" action={<ActionButton label="Restore" />} />
      </div>
      <div className="space-y-2">
        <div className="text-[13px] font-semibold text-foreground">Privacy & GDPR</div>
        <SettingsRow label="Privacy Controls" description="Manage what data is collected and processed" action={<ActionButton label="Manage" />} />
        <SettingsRow label="GDPR Compliance" description="View your data processing agreements" action={<ActionButton label="View DPA" />} />
        <SettingsRow label="Cookie Preferences" description="Control analytical and functional cookies" action={<ActionButton label="Configure" />} />
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="mb-1 text-[13px] font-semibold text-red-700">Danger Zone</div>
        <p className="mb-3 text-[12px] text-red-600">This action is irreversible. All data will be permanently deleted.</p>
        <ActionButton label="Delete Account" variant="danger" />
      </div>
    </div>
  );
}

function SecurityPanel() {
  const [twoFa, setTwoFa] = useState(false);
  const devices = [
    { name: "MacBook Pro 14", location: "London, UK", lastActive: "Now", current: true },
    { name: "iPhone 15 Pro", location: "London, UK", lastActive: "1 hour ago", current: false },
  ];
  const auditLog = [
    { action: "Logged in", device: "MacBook Pro", time: "Today 09:31", status: "success" },
    { action: "Changed password", device: "MacBook Pro", time: "7 Jul 09:18", status: "success" },
    { action: "API key generated", device: "MacBook Pro", time: "6 Jul 14:52", status: "success" },
    { action: "Failed login attempt", device: "Unknown", time: "5 Jul 22:14", status: "warning" },
  ];
  return (
    <div className="space-y-6">
      <SectionHeader title="Security" description="Protect your account with advanced security controls." />
      <div className="space-y-2">
        <div className="text-[13px] font-semibold text-foreground">Authentication</div>
        <SettingsRow label="Password" description="Last changed 30 days ago" action={<ActionButton label="Change Password" />} />
        <SettingsRow label="Two-Factor Authentication" description={twoFa ? "Enabled — authenticator app configured" : "Not enabled — adds an extra layer of security"} action={<Toggle on={twoFa} onChange={setTwoFa} />} />
      </div>
      <div>
        <div className="mb-3 text-[13px] font-semibold text-foreground">Active Devices</div>
        <div className="overflow-hidden rounded-xl border border-border">
          {devices.map((d, i) => (
            <div key={d.name} className={`flex items-center gap-4 px-4 py-3.5 ${i === 0 ? "border-b border-border" : ""}`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary">
                {d.name.includes("iPhone") ? <Smartphone className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} /> : <Monitor className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-foreground">{d.name}</span>
                  {d.current && <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Current</span>}
                </div>
                <div className="text-[11.5px] text-muted-foreground">{d.location} · {d.lastActive}</div>
              </div>
              {!d.current && <ActionButton label="Revoke" variant="danger" />}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 text-[13px] font-semibold text-foreground">Audit Log</div>
        <div className="overflow-hidden rounded-xl border border-border">
          {auditLog.map((entry, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < auditLog.length - 1 ? "border-b border-border" : ""}`}>
              <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${entry.status === "success" ? "bg-emerald-500" : "bg-amber-500"}`} />
              <div className="min-w-0 flex-1">
                <span className="text-[13px] font-medium text-foreground">{entry.action}</span>
                <span className="mx-1.5 text-muted-foreground/40">·</span>
                <span className="text-[12px] text-muted-foreground">{entry.device}</span>
              </div>
              <span className="shrink-0 text-[11.5px] text-muted-foreground">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BillingPanel() {
  const { business } = useAuthContext();
  const plan = business?.subscription_plan ?? "Professional";
  const invoices = [
    { number: "INV-2026-007", date: "1 Jul 2026", amount: "£299.00", status: "paid" },
    { number: "INV-2026-006", date: "1 Jun 2026", amount: "£299.00", status: "paid" },
    { number: "INV-2026-005", date: "1 May 2026", amount: "£299.00", status: "paid" },
  ];
  return (
    <div className="space-y-6">
      <SectionHeader title="Billing" description="Manage your subscription, payment method and invoices." />
      <div className="rounded-2xl border border-brand/20 bg-brand/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[15px] font-bold text-foreground">{plan} Plan</div>
            <div className="mt-1 text-[13px] text-muted-foreground">£299 / month · Renews 1 August 2026</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Unlimited contacts", "All DNA modules", "AI analysis", "Priority support", "API access"].map((f) => (
                <span key={f} className="flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand">
                  <CheckCircle2 className="h-3 w-3" strokeWidth={2} />{f}
                </span>
              ))}
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold text-brand">Active</span>
        </div>
        <div className="mt-4 flex gap-2">
          <ActionButton label="Upgrade Plan" variant="brand" />
          <ActionButton label="Manage Subscription" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-[13px] font-semibold text-foreground">Payment Method</div>
        <SettingsRow label="Visa ending 4242" description="Expires 12/26 · Default payment method" action={<ActionButton label="Update" />} />
      </div>
      <div>
        <div className="mb-3 text-[13px] font-semibold text-foreground">Invoice History</div>
        <div className="overflow-hidden rounded-xl border border-border">
          {invoices.map((inv, i) => (
            <div key={inv.number} className={`flex items-center gap-4 px-4 py-3.5 ${i < invoices.length - 1 ? "border-b border-border" : ""}`}>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-foreground">{inv.number}</div>
                <div className="text-[11.5px] text-muted-foreground">{inv.date}</div>
              </div>
              <div className="text-[13px] font-semibold text-foreground">{inv.amount}</div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700">Paid</span>
              <ActionButton label="Download" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 text-[13px] font-semibold text-foreground">AI Credits Usage</div>
        <div className="rounded-xl border border-border bg-secondary/20 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-medium text-foreground">Monthly Credits</span>
            <span className="text-[13px] font-semibold text-foreground">7,284 / 10,000</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[73%] rounded-full bg-brand transition-all duration-700" />
          </div>
          <div className="mt-1.5 text-[11.5px] text-muted-foreground">2,716 credits remaining this month</div>
        </div>
      </div>
    </div>
  );
}

function WhiteLabelPanel() {
  return (
    <div className="space-y-5">
      <SectionHeader title="White Label" description="Customise CrediEdgeOS with your own branding for client portals." />
      <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card">
          <Layers className="h-6 w-6 text-muted-foreground/50" strokeWidth={1.25} />
        </div>
        <div className="text-[14px] font-semibold text-foreground">White Label Available on Enterprise Plan</div>
        <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted-foreground">
          Custom logo, domain, colours, and client portal branding. Contact us to upgrade to Enterprise.
        </p>
        <button className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-80">
          Upgrade to Enterprise
        </button>
      </div>
      <div className="pointer-events-none grid grid-cols-1 gap-4 opacity-40 sm:grid-cols-2">
        <FormField label="Custom Logo URL" defaultValue="" hint="Displayed in place of CrediEdgeOS logo" />
        <FormField label="Custom Domain" defaultValue="" hint="e.g. app.yourbusiness.com" />
        <FormField label="Primary Brand Colour" defaultValue="#E31B23" />
        <FormField label="Email Sender Name" defaultValue="" hint="Shown in email From field" />
      </div>
    </div>
  );
}

function SystemStatusPanel() {
  const services = [
    { name: "Core Platform", status: "operational", uptime: "99.98%" },
    { name: "AI Engine", status: "operational", uptime: "99.94%" },
    { name: "Database", status: "operational", uptime: "99.99%" },
    { name: "Background Jobs", status: "operational", uptime: "99.91%" },
    { name: "API Gateway", status: "operational", uptime: "100%" },
    { name: "Webhooks", status: "operational", uptime: "99.87%" },
    { name: "Email Delivery", status: "degraded", uptime: "98.2%" },
    { name: "SMS Gateway", status: "operational", uptime: "99.76%" },
  ];
  return (
    <div className="space-y-5">
      <SectionHeader title="System Status" description="Real-time health and performance of all platform services." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[11px] font-medium text-muted-foreground">Platform Version</div>
          <div className="mt-1.5 text-[20px] font-bold text-foreground">v2.14.1</div>
          <div className="mt-0.5 text-[11px] text-emerald-600">Up to date</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[11px] font-medium text-muted-foreground">Storage Used</div>
          <div className="mt-1.5 text-[20px] font-bold text-foreground">4.2 GB</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">of 50 GB</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[11px] font-medium text-muted-foreground">Connected Services</div>
          <div className="mt-1.5 text-[20px] font-bold text-foreground">9</div>
          <div className="mt-0.5 text-[11px] text-emerald-600">All responding</div>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[1fr_120px_80px] border-b border-border bg-secondary/30 px-4 py-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Service</div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</div>
          <div className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Uptime</div>
        </div>
        {services.map((s, i) => (
          <div key={s.name} className={`grid grid-cols-[1fr_120px_80px] items-center px-4 py-3 ${i < services.length - 1 ? "border-b border-border" : ""}`}>
            <span className="text-[13px] font-medium text-foreground">{s.name}</span>
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${s.status === "operational" ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className={`text-[12px] font-medium capitalize ${s.status === "operational" ? "text-emerald-700" : "text-amber-700"}`}>{s.status}</span>
            </div>
            <div className="text-right text-[12px] font-medium text-muted-foreground">{s.uptime}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpPanel() {
  const links = [
    { label: "Documentation", description: "Full platform guides and API reference", icon: Globe, action: "Open Docs" },
    { label: "Contact Support", description: "Talk to the CrediEdge support team", icon: HelpCircle, action: "Get Help" },
    { label: "Feature Requests", description: "Suggest new features for CrediEdgeOS", icon: Star, action: "Submit Idea" },
    { label: "Bug Reports", description: "Report a bug or unexpected behaviour", icon: RefreshCw, action: "Report Bug" },
    { label: "Public Roadmap", description: "See what's coming next in CrediEdgeOS", icon: Activity, action: "View Roadmap" },
    { label: "Changelog", description: "See recent updates and new features", icon: Clock, action: "View Changes" },
  ];
  return (
    <div className="space-y-4">
      <SectionHeader title="Help & Support" description="Find resources, report issues or contact the team." />
      <div className="space-y-2">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <SettingsRow
              key={l.label}
              label={l.label}
              description={l.description}
              action={
                <button className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {l.action}
                  <ChevronRight className="h-3 w-3" strokeWidth={2} />
                </button>
              }
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Panel registry ───────────────────────────────────────────────────────────

const panels: Record<string, React.ReactNode> = {
  business: <BusinessPanel />,
  account: <AccountPanel />,
  organisation: <OrganisationPanel />,
  notifications: <NotificationsPanel />,
  appearance: <AppearancePanel />,
  ai: <AIPanel />,
  data: <DataPanel />,
  security: <SecurityPanel />,
  billing: <BillingPanel />,
  whitelabel: <WhiteLabelPanel />,
  status: <SystemStatusPanel />,
  help: <HelpPanel />,
};

// ─── Root Export ──────────────────────────────────────────────────────────────

export function SettingsHub() {
  const [active, setActive] = useState("business");
  const activeSection = sections.find((s) => s.id === active)!;
  const ActiveIcon = activeSection.icon;

  return (
    <div className="flex gap-5">
      <aside className="w-52 shrink-0">
        <nav className="rounded-2xl border border-border bg-card shadow-soft">
          <div className="space-y-4 p-2">
            {groups.map((group) => {
              const groupSections = sections.filter((s) => s.group === group);
              return (
                <div key={group}>
                  <div className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{group}</div>
                  <ul className="space-y-0.5">
                    {groupSections.map((s) => {
                      const Icon = s.icon;
                      return (
                        <li key={s.id}>
                          <button
                            onClick={() => setActive(s.id)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[12.5px] font-medium transition-all duration-150 ${active === s.id ? "bg-brand text-white" : "text-foreground/70 hover:bg-secondary hover:text-foreground"}`}
                          >
                            <span className="flex items-center gap-2.5">
                              <Icon className={`h-3.5 w-3.5 shrink-0 ${active === s.id ? "text-white" : "text-foreground/50"}`} strokeWidth={1.75} />
                              {s.label}
                            </span>
                            <ChevronRight className={`h-3 w-3 ${active === s.id ? "text-white/50" : "text-foreground/25"}`} strokeWidth={2} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>
      </aside>

      <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10">
            <ActiveIcon className="h-4.5 w-4.5 text-brand" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-[14.5px] font-semibold text-foreground">{activeSection.label}</h2>
            <p className="text-[12px] text-muted-foreground">{activeSection.description}</p>
          </div>
        </div>
        <div className="p-6">{panels[active]}</div>
      </div>
    </div>
  );
}
