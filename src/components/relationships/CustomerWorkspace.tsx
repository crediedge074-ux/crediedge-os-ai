import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  Tag,
  Clock,
  CircleDollarSign,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Plus,
  Edit3,
  Activity,
  Heart,
  Briefcase,
  FileText,
  MessageSquare,
  Star,
  CheckCircle2,
} from "lucide-react";
import type { Customer } from "@/lib/database.types";
import { useCustomers } from "@/hooks/useCustomers";
import { useBusiness } from "@/hooks/useBusiness";
import { fetchCustomerDNAContext, type CustomerDNAContext } from "@/services/relationshipAnalytics";
import { CustomerProfileHub } from "./CustomerProfileHub";

interface CustomerWorkspaceProps {
  open: boolean;
  onClose: () => void;
  onEditCustomer: (customer: Customer) => void;
  onAddCustomer: () => void;
}

type WorkspaceFilter = "all" | "active" | "attention" | "at_risk" | "opportunities" | "recent";

export function CustomerWorkspace({ open, onClose, onEditCustomer, onAddCustomer }: CustomerWorkspaceProps) {
  const { business } = useBusiness();
  const businessId = business?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<WorkspaceFilter>("all");
  const { customers, loading, refresh } = useCustomers(searchQuery);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCustomerContext, setSelectedCustomerContext] = useState<CustomerDNAContext | null>(null);
  const [loadingContext, setLoadingContext] = useState(false);

  // Load customer DNA context when a customer is selected
  useEffect(() => {
    if (!selectedCustomer || !businessId) {
      setSelectedCustomerContext(null);
      return;
    }

    setLoadingContext(true);
    fetchCustomerDNAContext(selectedCustomer.id, businessId)
      .then((ctx) => setSelectedCustomerContext(ctx))
      .catch((err) => console.error("Error fetching customer context:", err))
      .finally(() => setLoadingContext(false));
  }, [selectedCustomer, businessId]);

  if (!open) return null;

  // Filter customers based on workspace criteria
  const filteredCustomers = customers.filter((c) => {
    if (activeFilter === "active") return c.status === "active";
    if (activeFilter === "at_risk") return c.status === "inactive" || (Number(c.lifetime_value) || 0) === 0;
    if (activeFilter === "opportunities") return (Number(c.lifetime_value) || 0) >= 500 && c.status === "active";
    if (activeFilter === "recent") {
      const createdDaysAgo = (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return createdDaysAgo <= 30;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/70 backdrop-blur-md">
      <div className="relative flex flex-col h-[94vh] w-full max-w-7xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Workspace Top Header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand/10">
              <Users className="h-5 w-5 text-brand" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-bold tracking-tight text-foreground">Customer Workspace</h2>
                <span className="rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                  {customers.length} Records
                </span>
              </div>
              <p className="text-[11.5px] text-muted-foreground">
                Central relationship directory with real-time portfolio health, transaction feeds, and customer profile hubs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAddCustomer}
              className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Add Customer
            </button>

            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Panel: Filter & List Directory */}
          <div className={`flex flex-col border-r border-border bg-secondary/10 ${selectedCustomer ? "hidden lg:flex lg:w-1/3" : "w-full"}`}>
            {/* Search & Filter Controls */}
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* View Filters */}
              <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
                {[
                  { id: "all", label: "All", count: customers.length },
                  { id: "active", label: "Active", count: customers.filter((c) => c.status === "active").length },
                  { id: "opportunities", label: "Opportunities", count: customers.filter((c) => (Number(c.lifetime_value) || 0) >= 500).length },
                  { id: "at_risk", label: "At Risk / Inactive", count: customers.filter((c) => c.status === "inactive").length },
                  { id: "recent", label: "Recently Added" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id as WorkspaceFilter)}
                    className={`rounded-lg px-2.5 py-1 transition-all ${
                      activeFilter === f.id
                        ? "bg-foreground text-background font-bold shadow-xs"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label} {f.count !== undefined ? `(${f.count})` : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Customers Scrollable List */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/60 p-2 space-y-1">
              {loading ? (
                <div className="p-8 text-center text-xs text-muted-foreground italic">Loading workspace customer records...</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No matching customer profiles found.
                </div>
              ) : (
                filteredCustomers.map((c) => {
                  const name = c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Customer";
                  const initials = name.slice(0, 2).toUpperCase();
                  const ltv = Number(c.lifetime_value) || 0;
                  const isSelected = selectedCustomer?.id === c.id;

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className={`group cursor-pointer rounded-2xl p-3.5 transition-all duration-150 border ${
                        isSelected
                          ? "border-brand bg-card shadow-card ring-1 ring-brand/30"
                          : "border-transparent hover:border-border hover:bg-card/70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[11px] font-extrabold ${
                            isSelected ? "bg-brand text-white" : "bg-secondary text-foreground"
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-foreground group-hover:text-brand transition-colors">
                              {name}
                            </div>
                            <div className="text-[10.5px] text-muted-foreground">
                              {c.company_name || c.email || c.phone || "No contact details"}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[12px] font-extrabold text-foreground">
                            £{ltv.toLocaleString("en-GB")}
                          </div>
                          <span className={`inline-block rounded-md px-1.5 py-0.2 text-[9px] font-extrabold uppercase ${
                            c.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-secondary text-muted-foreground"
                          }`}>
                            {c.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10.5px] text-muted-foreground border-t border-border/40 pt-2">
                        <span>Added {new Date(c.created_at).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}</span>
                        <ChevronRight className={`h-3 w-3 transition-transform ${isSelected ? "text-brand translate-x-0.5" : "text-muted-foreground/40"}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Selected Customer Profile Hub */}
          <div className={`flex-1 flex flex-col min-w-0 bg-card ${!selectedCustomer ? "hidden lg:flex" : "flex"}`}>
            {selectedCustomer ? (
              <CustomerProfileHub
                customer={selectedCustomer}
                businessId={businessId}
                context={selectedCustomerContext}
                loadingContext={loadingContext}
                onBackToList={() => setSelectedCustomer(null)}
                onEdit={() => onEditCustomer(selectedCustomer)}
                onRefresh={refresh}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-secondary mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-[16px] font-bold text-foreground">Select a Customer Profile</h3>
                <p className="mt-1 max-w-sm text-[12.5px] text-muted-foreground">
                  Choose a customer record from the list to view jobs, invoices, communication logs, reviews, and relationship health intelligence.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
