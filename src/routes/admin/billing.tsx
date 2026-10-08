import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShared";
import { InsufficientData } from "@/components/ui/InsufficientData";

export const Route = createFileRoute("/admin/billing")({
  component: AdminBillingPage,
});

function AdminBillingPage() {
  return (
    <div>
      <AdminPageHeader title="Billing & Pricing" description="Manage plans, pricing, invoices, and billing status." icon={Receipt} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Pricing Configuration</h3>
          <p className="mt-2 text-[12.5px] text-muted-foreground">Plan prices are managed via the Subscriptions section. A central pricing source replaces scattered hardcoded values.</p>
          <div className="mt-3"><InsufficientData description="Dynamic pricing edit and propagation is Coming Soon. Plan definitions are managed in the database." /></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Payment Provider</h3>
          <p className="mt-2 text-[12.5px] text-muted-foreground">Stripe integration is not yet connected. Payment processing, invoicing, and billing history require a billing provider.</p>
          <div className="mt-3"><InsufficientData description="Stripe integration is Coming Soon. No billing activity is simulated." /></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Invoices</h3>
          <div className="mt-3"><InsufficientData description="Invoice history requires a billing provider integration (Coming Soon)." /></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-foreground">Discounts & Credits</h3>
          <div className="mt-3"><InsufficientData description="Discount and credit management is Coming Soon." /></div>
        </div>
      </div>
    </div>
  );
}
