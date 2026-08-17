import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { PoundSterling, Plus, FileText, CreditCard, ArrowUpRight } from "lucide-react";
import { getInvoices, getPayments, createInvoice } from "@/services/finance";
import { useBusiness } from "@/hooks/useBusiness";
import type { Invoice, Payment } from "@/lib/database.types";
import { toast } from "sonner";

export const Route = createFileRoute("/finance")({
  component: FinancePage,
});

function FinancePage() {
  const { business } = useBusiness();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [invModal, setInvModal] = useState(false);
  const [invNum, setInvNum] = useState("");
  const [invAmount, setInvAmount] = useState("");

  const loadFinance = async () => {
    if (!business?.id) return;
    setLoading(true);
    const [invs, pymts] = await Promise.all([
      getInvoices(business.id),
      getPayments(business.id),
    ]);
    setInvoices(invs);
    setPayments(pymts);
    setLoading(false);
  };

  useEffect(() => {
    loadFinance();
  }, [business?.id]);

  const totalInvoiced = invoices.reduce((s, i) => s + (i.total_amount || 0), 0);
  const totalPaid = invoices.reduce((s, i) => s + (i.amount_paid || 0), 0);
  const totalOutstanding = totalInvoiced - totalPaid;

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?.id || !invNum || !invAmount) return;

    try {
      const amt = parseFloat(invAmount);
      await createInvoice({
        business_id: business.id,
        invoice_number: invNum,
        total_amount: amt,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "sent",
      });
      toast.success("Invoice created!");
      setInvModal(false);
      setInvNum("");
      setInvAmount("");
      loadFinance();
    } catch (err: any) {
      toast.error(err.message || "Failed to create invoice");
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Financial Operating Centre"
        description="Unified cashflow, invoices, and revenue tracking linked directly to customer jobs and activity."
        crumbs={[{ label: "Administration" }, { label: "Finance" }]}
        action={{
          label: "New Invoice",
          icon: Plus,
          onClick: () => {
            setInvNum(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
            setInvModal(true);
          },
        }}
      />

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-7 xl:px-8 space-y-6">
        {/* KPI Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Invoiced</span>
              <FileText className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">£{totalInvoiced.toLocaleString()}</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
              <ArrowUpRight className="h-3 w-3" /> Billed this period
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Revenue Collected</span>
              <PoundSterling className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">£{totalPaid.toLocaleString()}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">Settled cashflow</div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Outstanding Accounts</span>
              <CreditCard className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">£{totalOutstanding.toLocaleString()}</div>
            <div className="mt-1 text-[11px] text-amber-500 font-medium">Awaiting payment</div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="rounded-2xl border border-border bg-card shadow-card p-6">
          <h3 className="text-sm font-bold text-foreground mb-4">Invoices & Billing</h3>
          {loading ? (
            <div className="text-center py-8 text-xs text-muted-foreground">Loading financial records...</div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
              No invoices created yet. Create an invoice to track revenue.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {invoices.map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-foreground">{inv.invoice_number}</span>
                    <span className="ml-2 text-[11px] text-muted-foreground">Due: {inv.due_date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-foreground">£{inv.total_amount.toLocaleString()}</span>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      inv.status === "paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {invModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <h3 className="text-base font-bold text-foreground">Create Invoice</h3>
              <form onSubmit={handleCreateInvoice} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={invNum}
                    onChange={(e) => setInvNum(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground">Total Amount (£)</label>
                  <input
                    type="number"
                    required
                    value={invAmount}
                    onChange={(e) => setInvAmount(e.target.value)}
                    placeholder="350"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInvModal(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand/90"
                  >
                    Create Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
