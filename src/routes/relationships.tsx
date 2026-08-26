import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { PortfolioRelationshipHeader } from "@/components/relationships/PortfolioRelationshipHeader";
import { RelationshipDNA } from "@/components/relationships/RelationshipDNA";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerWorkspace } from "@/components/relationships/CustomerWorkspace";
import { useCreateCustomer, useUpdateCustomer, useCustomers } from "@/hooks/useCustomers";
import { Users, Search, X, Mail, Phone, MapPin, Edit3 } from "lucide-react";
import type { Customer, CustomerInsert, CustomerUpdate } from "@/lib/database.types";
import { toast } from "sonner";

export const Route = createFileRoute("/relationships")({
  component: RelationshipsPage,
});

function RelationshipsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { create, creating, error: createError } = useCreateCustomer();
  const { save: update, saving: updating } = useUpdateCustomer();
  const { customers, refresh } = useCustomers(searchQuery);

  const handleCreateNew = () => {
    setEditingCustomer(null);
    setFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  const handleSave = async (data: Omit<CustomerInsert, "business_id">) => {
    try {
      if (editingCustomer) {
        const result = await update(editingCustomer.id, data as CustomerUpdate);
        if (result) {
          toast.success(`Customer ${result.full_name || 'record'} updated successfully!`);
          setFormOpen(false);
          setEditingCustomer(null);
          refresh();
        }
      } else {
        const result = await create(data);
        if (result) {
          toast.success(`Customer ${result.full_name || 'record'} created successfully!`);
          setFormOpen(false);
          refresh();
        } else {
          toast.error(createError || "Failed to create customer.");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred while saving.");
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Relationships"
        description="AI-powered customer intelligence — understand who deserves attention, who's ready to spend, and who's going quiet."
        crumbs={[{ label: "Relationships" }]}
        action={{ label: "Add Customer", icon: Users, onClick: handleCreateNew }}
        secondaryAction={{ label: "Sync Data", onClick: () => refresh() }}
      />

      <PortfolioRelationshipHeader
        onSelectCustomer={(cust) => {
          handleEdit(cust);
        }}
        onAddCustomer={handleCreateNew}
      />

      <RelationshipDNA
        onAddCustomer={handleCreateNew}
        onEditCustomer={handleEdit}
        onViewAllCustomers={() => setListModalOpen(true)}
      />

      <CustomerForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleSave}
        initial={editingCustomer}
        saving={creating || updating}
      />

      {/* Customer Workspace Modal */}
      <CustomerWorkspace
        open={listModalOpen}
        onClose={() => setListModalOpen(false)}
        onEditCustomer={(cust) => {
          setListModalOpen(false);
          handleEdit(cust);
        }}
        onAddCustomer={() => {
          setListModalOpen(false);
          handleCreateNew();
        }}
      />
    </AppLayout>
  );
}
