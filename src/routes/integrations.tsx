import { createFileRoute } from "@tanstack/react-router";
import { Plug, Plus, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Clock } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";

export const Route = createFileRoute("/integrations")({
  component: IntegrationsPage,
});

type HealthStatus = "connected" | "warning" | "pending";

interface Integration {
  id: number;
  name: string;
  category: string;
  initials: string;
  color: string;
  lastSync: string;
  health: HealthStatus;
  description: string;
}

const integrations: Integration[] = [
  { id: 1, name: "GoHighLevel", category: "CRM", initials: "GH", color: "#E31B23", lastSync: "2 min ago", health: "connected", description: "Customer relationship management and pipeline" },
  { id: 2, name: "Google Calendar", category: "Scheduling", initials: "31", color: "#1A1A1A", lastSync: "5 min ago", health: "connected", description: "Booking and appointment synchronisation" },
  { id: 3, name: "Google Business", category: "Reviews", initials: "GB", color: "#1A1A1A", lastSync: "12 min ago", health: "connected", description: "Google Business Profile and review management" },
  { id: 4, name: "Xero", category: "Accounting", initials: "X", color: "#13B5EA", lastSync: "1 hr ago", health: "connected", description: "Invoicing, expenses and financial reporting" },
  { id: 5, name: "Stripe", category: "Payments", initials: "S", color: "#635BFF", lastSync: "3 min ago", health: "connected", description: "Payment processing and subscription billing" },
  { id: 6, name: "Slack", category: "Communications", initials: "#", color: "#E31B23", lastSync: "8 min ago", health: "connected", description: "Team notifications and alerts" },
  { id: 7, name: "Microsoft 365", category: "Productivity", initials: "M", color: "#D83B01", lastSync: "30 min ago", health: "warning", description: "Email, calendar and document management" },
];

const upcoming: { name: string; category: string; initials: string; color: string }[] = [
  { name: "QuickBooks", category: "Accounting", initials: "QB", color: "#2CA01C" },
  { name: "Mailchimp", category: "Marketing", initials: "MC", color: "#FFE01B" },
  { name: "Trustpilot", category: "Reviews", initials: "TP", color: "#00B67A" },
  { name: "Facebook Ads", category: "Advertising", initials: "FB", color: "#1877F2" },
];

const healthConfig: Record<HealthStatus, { icon: React.ElementType; label: string; color: string }> = {
  connected: { icon: CheckCircle2, label: "Connected", color: "text-success" },
  warning: { icon: AlertTriangle, label: "Needs attention", color: "text-warning" },
  pending: { icon: Clock, label: "Pending", color: "text-muted-foreground" },
};

function IntegrationsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Integrations"
        description="Connect your business tools to create a seamless workflow and unified data view."
        crumbs={[{ label: "Integrations" }]}
        action={{ label: "Browse All", icon: Plus }}
      />

      {/* Active */}
      <div className="mb-5">
        <h2 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">Active Integrations</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {integrations.map((it) => {
            const cfg = healthConfig[it.health];
            const StatusIcon = cfg.icon;
            return (
              <div key={it.id} className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/10 hover:shadow-card">
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[12px] font-bold text-white"
                  style={{ backgroundColor: it.color }}
                >
                  {it.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13.5px] font-semibold text-foreground">{it.name}</span>
                    <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{it.category}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{it.description}</p>
                  <div className={`mt-2 flex items-center gap-1.5 text-[11.5px] font-medium ${cfg.color}`}>
                    <StatusIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {cfg.label} · {it.lastSync}
                  </div>
                </div>
                <button className="shrink-0 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11.5px] font-medium text-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-secondary">
                  Manage
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available */}
      <div>
        <h2 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">Available Integrations</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {upcoming.map((u) => (
            <div key={u.name} className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-4 transition-all duration-200 hover:border-foreground/20 hover:bg-secondary/30">
              <div
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[11px] font-bold text-white"
                style={{ backgroundColor: u.color }}
              >
                {u.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-foreground">{u.name}</div>
                <div className="text-[11.5px] text-muted-foreground">{u.category}</div>
              </div>
              <button className="shrink-0 rounded-lg bg-brand px-2.5 py-1.5 text-[11.5px] font-semibold text-white shadow-sm transition-colors hover:bg-brand/90">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
