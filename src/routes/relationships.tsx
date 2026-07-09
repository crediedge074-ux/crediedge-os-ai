import { createFileRoute } from "@tanstack/react-router";
import { Users, Plus, Search, Mail, Phone } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const Route = createFileRoute("/relationships")({
  component: RelationshipsPage,
});

const customers = [
  { id: 1, name: "John Smith", email: "john@example.com", phone: "07700 900123", value: "£2,400", jobs: 4, last: "2 days ago", status: "Active" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", phone: "07700 900456", value: "£1,850", jobs: 3, last: "1 week ago", status: "Active" },
  { id: 3, name: "Marcus Williams", email: "marcus@example.com", phone: "07700 900789", value: "£3,100", jobs: 6, last: "3 days ago", status: "VIP" },
  { id: 4, name: "Emily Clarke", email: "emily@example.com", phone: "07700 900012", value: "£980", jobs: 2, last: "2 weeks ago", status: "Active" },
  { id: 5, name: "James Thompson", email: "james@example.com", phone: "07700 900345", value: "£5,600", jobs: 9, last: "yesterday", status: "VIP" },
];

const statusColor: Record<string, string> = {
  Active: "bg-success/10 text-success",
  VIP: "bg-brand/10 text-brand",
  Inactive: "bg-secondary text-muted-foreground",
};

function RelationshipsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Relationships"
        description="Manage your customer relationships, communication history and lifetime value."
        crumbs={[{ label: "Relationships" }]}
        action={{ label: "Add Customer", icon: Plus }}
        secondaryAction={{ label: "Import" }}
      >
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search customers..."
            className="h-9 w-52 rounded-lg border border-border bg-secondary/50 pl-9 pr-3 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-card focus:outline-none"
          />
        </div>
      </PageHeader>

      {customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Import your first customer or add them manually to get started."
          action={{ label: "Add Customer" }}
          secondaryAction={{ label: "Import CSV" }}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="hidden px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Contact</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Value</th>
                  <th className="hidden px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Jobs</th>
                  <th className="hidden px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Last Visit</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => (
                  <tr key={c.id} className="group transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
                          {c.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 md:table-cell">
                      <div className="flex flex-col gap-0.5 text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" strokeWidth={1.75} />{c.email}</span>
                        <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" strokeWidth={1.75} />{c.phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-foreground">{c.value}</td>
                    <td className="hidden px-5 py-3.5 text-muted-foreground lg:table-cell">{c.jobs}</td>
                    <td className="hidden px-5 py-3.5 text-muted-foreground lg:table-cell">{c.last}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusColor[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11.5px] font-medium text-foreground opacity-0 transition-all duration-150 group-hover:opacity-100 hover:bg-secondary">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
