import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { PortfolioRelationshipHeader } from "@/components/relationships/PortfolioRelationshipHeader";
import { RelationshipDNA } from "@/components/relationships/RelationshipDNA";
import { CustomerForm } from "@/components/customers/CustomerForm";
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

      {/* Customer List Modal */}
      {listModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setListModalOpen(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <h3 className="text-[14px] font-semibold text-foreground">All Customers ({customers.length})</h3>
              </div>
              <button
                onClick={() => setListModalOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto divide-y divide-border p-2">
              {customers.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No customers found.</div>
              ) : (
                customers.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 transition-colors hover:bg-secondary/40 rounded-xl">
                    <div>
                      <div className="text-[13px] font-semibold text-foreground">{c.full_name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Unnamed Customer'}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        {c.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {c.email}
                          </span>
                        )}
                        {c.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {c.phone}
                          </span>
                        )}
                        {c.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {c.city}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setListModalOpen(false);
                        handleEdit(c);
                      }}
                      className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-[11.5px] font-medium text-foreground transition-all hover:border-brand hover:text-brand"
                    >
                      <Edit3 className="h-3 w-3" /> Edit
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
