import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Building2, User, Users, Bell, Palette, Brain, Database, Shield, CreditCard, Layers, Circle as HelpCircle, Activity, ChevronRight, CircleCheck as CheckCircle2, Globe, Clock, Lock, Key, Download, Upload, Trash2, Star, Smartphone, Monitor, Sun, Moon, RefreshCw } from "lucide-react";

// ─── Section config ───────────────────────────────────────────────────────────

interface SectionDef {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  group: string;
}

const sections: SectionDef[] = [
  // Core
  { id: "business", icon: Building2, label: "Business Profile", description: "Name, logo, contact and hours", group: "Core" },
  { id: "account", icon: User, label: "Account", description: "Profile, password and devices", group: "Core" },
  { id: "organisation", icon: Users, label: "Organisation", description: "Users, roles and permissions", group: "Core" },
  // Preferences
  { id: "notifications", icon: Bell, label: "Notifications", description: "Email, push and SMS preferences", group: "Preferences" },
  { id: "appearance", icon: Palette, label: "Appearance", description: "Theme, layout and display", group: "Preferences" },
  { id: "ai", icon: Brain, label: "AI Settings", description: "Models, analysis and behaviour", group: "Preferences" },
  // Data
  { id: "data", icon: Database, label: "Data & Privacy", description: "Export, backup and GDPR", group: "Data" },
  { id: "security", icon: Shield, label: "Security", description: "2FA, sessions and audit logs", group: "Data" },
  // Account Management
  { id: "billing", icon: CreditCard, label: "Billing", description: "Plan, invoices and usage", group: "Account" },
  { id: "whitelabel", icon: Layers, label: "White Label", description: "Custom branding and domains", group: "Account" },
  // System
  { id: "status", icon: Activity, label: "System Status", description: "Platform health and versions", group: "System" },
  { id: "help", icon: HelpCircle, label: "Help & Support", description: "Docs, requests and changelog", group: "System" },
];

const groups = ["Core", "Preferences", "Data", "Account", "System"];

// ─── Reusable primitives ──────────────────────────────────────────────────────

function SettingsRow({
  label,
  description,
  action,
}: {
  label: string;
  description?: string;
  action: React.ReactNode;
}) {
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
  label,
  defaultValue,
  type = "text",
  hint,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/20 focus:bg-card focus:outline-none"
      />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SaveBar() {
  return (
    <div className="flex justify-end pt-2">
      <button className="rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-80">
        Save Changes
      </button>
    </div>
  );
}

// ─── Panel components ─────────────────────────────────────────────────────────

function BusinessPanel() {
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
        <FormField label="Business Name" defaultValue="CrediEdge Automotive" />
        <FormField label="Industry" defaultValue="Automotive" />
        <FormField label="Phone Number" defaultValue="+44 7700 900000" />
        <FormField label="Email Address" defaultValue="contact@crediedge.co.uk" />
        <FormField label="Website" defaultValue="https://crediedge.co.uk" />
        <FormField label="VAT Number" defaultValue="GB123456789" />
        <FormField label="Address Line 1" defaultValue="12 Commerce Street" />
        <FormField label="City / Town" defaultValue="London" />
        <FormField label="Postcode" defaultValue="EC1A 1BB" />
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Timezone</label>
          <select className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none">
            <option>Europe/London (GMT+1)</option>
            <option>America/New_York (GMT-4)</option>
            <option>Asia/Dubai (GMT+4)</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Currency</label>
          <select className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none">
            <option>GBP — British Pound (£)</option>
            <option>USD — US Dollar ($)</option>
            <option>EUR — Euro (€)</option>
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

      <SaveBar />
    </div>
  );
}

function AccountPanel() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Account" description="Your personal profile, password and active sessions." />

      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-[22px] font-bold text-brand">D</div>
        <div>
          <div className="text-[14px] font-semibold text-foreground">Dom Crediedge</div>
          <div className="text-[12.5px] text-muted-foreground">dom@crediedge.co.uk</div>
        </div>
        <button className="ml-auto rounded-xl border border-border bg-secondary px-3.5 py-2 text-[12.5px] font-medium text-foreground transition-colors hover:bg-secondary/70">
          Change Photo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="First Name" defaultValue="Dom" />
        <FormField label="Last Name" defaultValue="Crediedge" />
        <FormField label="Email Address" defaultValue="dom@crediedge.co.uk" />
        <FormField label="Phone Number" defaultValue="+44 7700 900000" />
      </div>

      <div className="space-y-2">
        <div className="text-[13px] font-semibold text-foreground">Security</div>
        <SettingsRow label="Password" description="Last changed 30 days ago" action={<ActionButton label="Change" />} />
        <SettingsRow label="Two-Factor Authentication" description="Not enabled — recommended for account security" action={<ActionButton label="Enable" variant="brand" />} />
        <SettingsRow label="Active Sessions" description="1 active session on this device" action={<ActionButton label="View" />} />
        <SettingsRow label="Active Devices" description="MacBook Pro, iPhone 15" action={<ActionButton label="Manage" />} />
      </div>

      <SaveBar />
    </div>
  );
}

function OrganisationPanel() {
  const roles = [
    { name: "Dom Crediedge", email: "dom@crediedge.co.uk", role: "Owner", status: "active" },
    { name: "Sarah Johnson", email: "sarah@crediedge.co.uk", role: "Admin", status: "active" },
    { name: "James Wilson", email: "james@crediedge.co.uk", role: "Staff", status: "pending" },
  ];

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
          <div className="text-[13px] font-semibold text-foreground">Team Members</div>
          <button className="rounded-xl bg-brand px-3.5 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-80">
            Invite Member
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          {roles.map((r, i) => (
            <div key={r.email} className={`flex items-center gap-4 px-4 py-3.5 ${i < roles.length - 1 ? "border-b border-border" : ""}`}>
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
                {r.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-foreground">{r.name}</div>
                <div className="text-[11.5px] text-muted-foreground">{r.email}</div>
              </div>
              <span className={`rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${r.status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                {r.status === "active" ? r.role : "Pending"}
              </span>
              <button className="text-[12px] text-muted-foreground transition-colors hover:text-foreground">Edit</button>
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

function NotificationsPanel() {
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

  const toggle = (id: string, channel: "email" | "push" | "sms") => {
    setPrefs((p) => ({ ...p, [id]: { ...p[id], [channel]: !p[id][channel] } }));
  };

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
    </div>
  );
}

function AppearancePanel() {
  const [theme, setTheme] = useState("Light");
  const [accent, setAccent] = useState("#E31B23");
  const [compact, setCompact] = useState(false);

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
          {[
            { label: "Light", icon: Sun },
            { label: "Dark", icon: Moon },
            { label: "System", icon: Monitor },
          ].map(({ label, icon: Icon }) => (
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
    </div>
  );
}

function AIPanel() {
  const [autoReports, setAutoReports] = useState(true);
  const [scheduledRefresh, setScheduledRefresh] = useState(true);
  const [insights, setInsights] = useState(true);

  return (
    <div className="space-y-6">
      <SectionHeader title="AI Settings" description="Configure how the AI analyses and communicates with you." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">AI Provider</label>
          <select className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none">
            <option>OpenAI (GPT-4o)</option>
            <option>Anthropic (Claude 3.5)</option>
            <option>Google (Gemini 1.5)</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Preferred Model</label>
          <select className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none">
            <option>GPT-4o (Recommended)</option>
            <option>GPT-4o Mini (Faster)</option>
            <option>GPT-o1 (Advanced Reasoning)</option>
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
        <input type="range" min={0} max={100} defaultValue={60} className="w-full accent-brand" />
        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
          <span>Precise</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>

      <div className="space-y-2">
        <SettingsRow label="Automatic AI Reports" description="Generate weekly executive reports automatically" action={<Toggle on={autoReports} onChange={setAutoReports} />} />
        <SettingsRow label="Scheduled AI Refresh" description="Re-analyse all data at 06:00 each morning" action={<Toggle on={scheduledRefresh} onChange={setScheduledRefresh} />} />
        <SettingsRow label="Proactive AI Insights" description="Push new discoveries and opportunities automatically" action={<Toggle on={insights} onChange={setInsights} />} />
      </div>

      <div>
        <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Business Context</label>
        <textarea
          defaultValue="We are a premium automotive service business in London. Our primary goal is to increase customer retention and grow recurring revenue. Our main challenge is converting online enquiries to bookings."
          rows={4}
          className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/20 focus:outline-none"
        />
        <p className="mt-1 text-[11px] text-muted-foreground">This context helps the AI understand your business goals and provide more relevant insights.</p>
      </div>

      <SaveBar />
    </div>
  );
}

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
        <SettingsRow
          label="Two-Factor Authentication"
          description={twoFa ? "Enabled — authenticator app configured" : "Not enabled — adds an extra layer of security"}
          action={<Toggle on={twoFa} onChange={setTwoFa} />}
        />
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
            <div className="text-[15px] font-bold text-foreground">Growth Plan</div>
            <div className="mt-1 text-[13px] text-muted-foreground">£299 / month · Renews 1 August 2026</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Unlimited contacts", "All DNA modules", "AI analysis", "Priority support", "API access"].map((f) => (
                <span key={f} className="flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand">
                  <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
                  {f}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 opacity-40 pointer-events-none">
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
              <span className={`text-[12px] font-medium capitalize ${s.status === "operational" ? "text-emerald-700" : "text-amber-700"}`}>
                {s.status}
              </span>
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
      {/* Sidebar nav */}
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

      {/* Content panel */}
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
