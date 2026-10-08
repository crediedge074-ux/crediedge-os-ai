import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Building2, User, Users, Bell, Palette, Brain, Database, Shield, CreditCard, Layers, Circle as HelpCircle, Activity, ChevronRight, Globe, Star, Clock, RefreshCw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { InsufficientData } from "@/components/ui/InsufficientData";
import { SectionHeader, SettingsRow, ActionButton, FormField } from "./primitives";

// ─── Panel imports ───────────────────────────────────────────────────────────

import { BusinessPanel } from "./panels/BusinessPanel";
import { AccountPanel } from "./panels/AccountPanel";
import { OrganisationPanel } from "./panels/OrganisationPanel";
import { NotificationsPanel } from "./panels/NotificationsPanel";
import { AppearancePanel } from "./panels/AppearancePanel";
import { AIPanel } from "./panels/AIPanel";
import { SecurityPanel } from "./panels/SecurityPanel";

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

// ─── Static panels (Coming Soon states) ───────────────────────────────────────

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
        <SettingsRow label="Last Backup" description="No backups have been created yet" action={<ActionButton label="Download" />} />
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

function BillingPanel() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Billing" description="Manage your subscription, payment method and invoices." />
      <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card">
          <CreditCard className="h-6 w-6 text-muted-foreground/50" strokeWidth={1.25} />
        </div>
        <div className="text-[14px] font-semibold text-foreground">Billing — Coming Soon</div>
        <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted-foreground">
          Subscription management, payment methods, and invoice history will appear here once billing integration is connected.
        </p>
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
        <Link to="/admin/enterprise-preview" className="mt-4 inline-flex rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-80">
          Explore Enterprise
        </Link>
      </div>
    </div>
  );
}

function SystemStatusPanel() {
  return (
    <div className="space-y-5">
      <SectionHeader title="System Status" description="Real-time health and performance of all platform services." />
      <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card">
          <Activity className="h-6 w-6 text-muted-foreground/50" strokeWidth={1.25} />
        </div>
        <div className="text-[14px] font-semibold text-foreground">System Status Dashboard — Coming Soon</div>
        <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted-foreground">
          Real-time platform health metrics, service uptime, and version information will be available here once the monitoring infrastructure is connected.
        </p>
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
            <SettingsRow key={l.label} label={l.label} description={l.description} action={<ActionButton label={l.action} />} />
          );
        })}
      </div>
    </div>
  );
}

// ─── Panel registry ───────────────────────────────────────────────────────────

function PanelContent({ active }: { active: string }) {
  switch (active) {
    case "business": return <BusinessPanel />;
    case "account": return <AccountPanel />;
    case "organisation": return <OrganisationPanel />;
    case "notifications": return <NotificationsPanel />;
    case "appearance": return <AppearancePanel />;
    case "ai": return <AIPanel />;
    case "data": return <DataPanel />;
    case "security": return <SecurityPanel />;
    case "billing": return <BillingPanel />;
    case "whitelabel": return <WhiteLabelPanel />;
    case "status": return <SystemStatusPanel />;
    case "help": return <HelpPanel />;
    default: return <InsufficientData description="Select a settings section from the left." />;
  }
}

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
        <div className="p-6"><PanelContent active={active} /></div>
      </div>
    </div>
  );
}
