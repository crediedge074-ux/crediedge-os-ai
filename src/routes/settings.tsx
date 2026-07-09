import { createFileRoute } from "@tanstack/react-router";
import { Settings, User, Bell, Shield, Palette, CreditCard, Building2, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

interface Section {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

const sections: Section[] = [
  { id: "profile", icon: User, label: "Profile", description: "Your name, email and personal details" },
  { id: "business", icon: Building2, label: "Business", description: "Business name, address and contact details" },
  { id: "notifications", icon: Bell, label: "Notifications", description: "Email, SMS and push notification preferences" },
  { id: "security", icon: Shield, label: "Security & Access", description: "Password, two-factor auth and session management" },
  { id: "appearance", icon: Palette, label: "Appearance", description: "Theme, branding and display preferences" },
  { id: "billing", icon: CreditCard, label: "Billing & Plan", description: "Subscription, usage and payment details" },
];

const panels: Record<string, React.ReactNode> = {
  profile: (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[["First Name", "Dom"], ["Last Name", ""], ["Email Address", "dom@crediedge.co.uk"], ["Phone Number", "07700 900000"]].map(([label, val]) => (
          <div key={label}>
            <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">{label}</label>
            <input
              defaultValue={val}
              className="w-full rounded-lg border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-card focus:outline-none"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <button className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-brand/90">Save Changes</button>
      </div>
    </div>
  ),
  business: (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[["Business Name", "CrediEdge Automotive"], ["Industry", "Automotive"], ["Website", "https://crediedge.co.uk"], ["VAT Number", "GB123456789"]].map(([label, val]) => (
          <div key={label}>
            <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">{label}</label>
            <input
              defaultValue={val}
              className="w-full rounded-lg border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:border-foreground/20 focus:bg-card focus:outline-none"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <button className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-brand/90">Save Changes</button>
      </div>
    </div>
  ),
  notifications: (
    <div className="space-y-3">
      {[
        { label: "New enquiry received", desc: "Get notified when a new enquiry arrives", on: true },
        { label: "Invoice overdue", desc: "Alert when an invoice passes its due date", on: true },
        { label: "New review posted", desc: "Get notified of new customer reviews", on: true },
        { label: "Daily briefing", desc: "Receive your AI business briefing each morning", on: false },
        { label: "Weekly report", desc: "Receive a weekly performance summary", on: true },
      ].map((n) => (
        <div key={n.label} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5">
          <div>
            <div className="text-[13px] font-medium text-foreground">{n.label}</div>
            <div className="text-[12px] text-muted-foreground">{n.desc}</div>
          </div>
          <button className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${n.on ? "bg-brand" : "bg-secondary"}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${n.on ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      ))}
    </div>
  ),
  security: (
    <div className="space-y-4">
      {[
        { label: "Change Password", desc: "Update your account password", action: "Update" },
        { label: "Two-Factor Authentication", desc: "Add an extra layer of security to your account", action: "Enable" },
        { label: "Active Sessions", desc: "Manage devices currently signed into your account", action: "View" },
        { label: "API Keys", desc: "Manage your API keys for integrations", action: "Manage" },
      ].map((s) => (
        <div key={s.label} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5">
          <div>
            <div className="text-[13px] font-medium text-foreground">{s.label}</div>
            <div className="text-[12px] text-muted-foreground">{s.desc}</div>
          </div>
          <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-[12.5px] font-medium text-foreground transition-colors hover:bg-secondary">{s.action}</button>
        </div>
      ))}
    </div>
  ),
  appearance: (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-[12.5px] font-medium text-muted-foreground">Theme</label>
        <div className="flex gap-2">
          {["Light", "Dark", "System"].map((t) => (
            <button key={t} className={`rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors ${t === "Light" ? "border-brand bg-brand/10 text-brand" : "border-border bg-card text-foreground hover:bg-secondary"}`}>{t}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-[12.5px] font-medium text-muted-foreground">Accent Colour</label>
        <div className="flex gap-2">
          {["#E31B23", "#1A1A1A", "#2563EB", "#059669", "#D97706"].map((c) => (
            <button key={c} className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${c === "#E31B23" ? "border-foreground" : "border-transparent"}`} style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  ),
  billing: (
    <div className="space-y-4">
      <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[14px] font-bold text-foreground">Growth Plan</div>
            <div className="mt-0.5 text-[12.5px] text-muted-foreground">£299 / month · Renews 1 Aug 2025</div>
          </div>
          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10.5px] font-bold text-brand">Active</span>
        </div>
      </div>
      {[
        { label: "Payment Method", desc: "Visa ending 4242 · Expires 12/26", action: "Update" },
        { label: "Billing History", desc: "View and download past invoices", action: "View All" },
        { label: "Usage & Limits", desc: "Users, integrations and API usage", action: "View" },
      ].map((s) => (
        <div key={s.label} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5">
          <div>
            <div className="text-[13px] font-medium text-foreground">{s.label}</div>
            <div className="text-[12px] text-muted-foreground">{s.desc}</div>
          </div>
          <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-[12.5px] font-medium text-foreground transition-colors hover:bg-secondary">{s.action}</button>
        </div>
      ))}
    </div>
  ),
};

function SettingsPage() {
  const [active, setActive] = useState("profile");
  const activeSection = sections.find((s) => s.id === active)!;
  const ActiveIcon = activeSection.icon;

  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        description="Manage your account, business details and platform preferences."
        crumbs={[{ label: "Settings" }]}
      />

      <div className="flex gap-5">
        {/* Nav */}
        <aside className="w-56 shrink-0">
          <nav className="rounded-xl border border-border bg-card p-2 shadow-soft">
            <ul className="space-y-0.5">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setActive(s.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${active === s.id ? "bg-brand text-white" : "text-foreground/75 hover:bg-secondary hover:text-foreground"}`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 shrink-0 ${active === s.id ? "text-white" : "text-foreground/50"}`} strokeWidth={1.75} />
                        {s.label}
                      </span>
                      <ChevronRight className={`h-3.5 w-3.5 ${active === s.id ? "text-white/60" : "text-foreground/30"}`} strokeWidth={2} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Panel */}
        <div className="min-w-0 flex-1 rounded-xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-3 border-b border-border pb-5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10">
              <ActiveIcon className="h-4.5 w-4.5 text-brand" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">{activeSection.label}</h2>
              <p className="text-[12px] text-muted-foreground">{activeSection.description}</p>
            </div>
          </div>
          {panels[active]}
        </div>
      </div>
    </AppLayout>
  );
}
