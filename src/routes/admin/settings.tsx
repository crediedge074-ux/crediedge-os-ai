import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShared";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/settings")({
  component: AdminEnterpriseSettingsPage,
});

function AdminEnterpriseSettingsPage() {
  return (
    <div>
      <AdminPageHeader title="Enterprise Settings" description="Platform-level configuration for enterprise accounts, white-label, and reseller functionality." icon={Settings} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Enterprise Accounts</h3>
          <p className="mt-2 text-[12.5px] text-muted-foreground">Manage enterprise customer organisations, their business hierarchies, and admin users.</p>
          <div className="mt-3"><InsufficientData description="Enterprise account management is Coming Soon. The database architecture supports the hierarchy." /></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">White-Label Configuration</h3>
          <p className="mt-2 text-[12.5px] text-muted-foreground">Custom brand name, logo, colours, domain, and terminology for enterprise customers.</p>
          <div className="mt-3"><InsufficientData description="White-label configuration is Coming Soon. The architecture supports custom branding fields." /></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Reseller Management</h3>
          <p className="mt-2 text-[12.5px] text-muted-foreground">Allow enterprise customers to resell CrediEdgeOS with their own branding and customer base.</p>
          <div className="mt-3"><InsufficientData description="Reseller functionality is Coming Soon. The enterprise_accounts table supports the reseller hierarchy." /></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Platform Configuration</h3>
          <p className="mt-2 text-[12.5px] text-muted-foreground">Global settings that affect the entire CrediEdgeOS platform.</p>
          <div className="mt-3"><InsufficientData description="Platform-level configuration is Coming Soon." /></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Support Access</h3>
          <p className="mt-2 text-[12.5px] text-muted-foreground">Future capability for platform admins to enter a customer workspace for support, with explicit audit logging and visible impersonation state.</p>
          <div className="mt-3"><InsufficientData description="Support access / impersonation is Coming Soon. No insecure impersonation is implemented." /></div>
        </div>
      </div>
    </div>
  );
}
