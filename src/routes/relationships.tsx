import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { RelationshipDNA } from "@/components/relationships/RelationshipDNA";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { useCreateCustomer, useCustomers } from "@/hooks/useCustomers";
import { Users, RefreshCw } from "lucide-react";
import type { CustomerInsert } from "@/lib/database.types";

export const Route = createFileRoute("/relationships")({
  component: RelationshipsPage,
});

function RelationshipsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const { create, creating } = useCreateCustomer();
  const { refresh } = useCustomers();

  const handleSave = async (data: Omit<CustomerInsert, "business_id">) => {
    const result = await create(data);
    if (result) {
      setFormOpen(false);
      refresh();
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Relationships"
        description="AI-powered customer intelligence — understand who deserves attention, who's ready to spend, and who's going quiet."
        crumbs={[{ label: "Relationships" }]}
        action={{ label: "Add Customer", icon: Users, onClick: () => setFormOpen(true) }}
        secondaryAction={{ label: "Sync Data" }}
      />
      <RelationshipDNA onAddCustomer={() => setFormOpen(true)} />
      <CustomerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        saving={creating}
      />
    </AppLayout>
  );
}
