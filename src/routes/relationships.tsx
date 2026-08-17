import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { RelationshipDNA } from "@/components/relationships/RelationshipDNA";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { useCreateCustomer, useCustomers } from "@/hooks/useCustomers";
import { Users, Search, Archive } from "lucide-react";
import type { CustomerInsert } from "@/lib/database.types";
import { toast } from "sonner";

export const Route = createFileRoute("/relationships")({
  component: RelationshipsPage,
});

function RelationshipsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { create, creating, error: createError } = useCreateCustomer();
  const { refresh } = useCustomers(searchQuery);

  const handleSave = async (data: Omit<CustomerInsert, "business_id">) => {
    const result = await create(data);
    if (result) {
      toast.success(`Customer ${result.full_name || 'record'} created successfully!`);
      setFormOpen(false);
      refresh();
    } else if (createError) {
      toast.error(createError);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Relationships"
        description="AI-powered customer intelligence — understand who deserves attention, who's ready to spend, and who's going quiet."
        crumbs={[{ label: "Relationships" }]}
        action={{ label: "Add Customer", icon: Users, onClick: () => setFormOpen(true) }}
        secondaryAction={{ label: "Sync Data", onClick: () => refresh() }}
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      <RelationshipDNA
        onAddCustomer={() => setFormOpen(true)}
      />

      <CustomerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        saving={creating}
      />
    </AppLayout>
  );
}
