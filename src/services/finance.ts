import { supabase } from "@/lib/supabase";
import type { Invoice, Payment, InvoiceInsert, PaymentInsert } from "@/lib/database.types";
import { logActivity } from "./activity";

export async function getInvoices(businessId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
  return data ?? [];
}

export async function getPayments(businessId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("business_id", businessId)
    .order("payment_date", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
  return data ?? [];
}

export async function createInvoice(insert: InvoiceInsert): Promise<Invoice> {
  const { data, error } = await supabase
    .from("invoices")
    .insert(insert)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    business_id: data.business_id,
    customer_id: data.customer_id,
    job_id: data.job_id,
    entity_type: "invoice",
    entity_id: data.id,
    action: "created",
    description: `Created Invoice ${data.invoice_number} for £${data.total_amount}`,
  });

  return data;
}

export async function createPayment(insert: PaymentInsert): Promise<Payment> {
  const { data, error } = await supabase
    .from("payments")
    .insert(insert)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    business_id: data.business_id,
    customer_id: data.customer_id,
    job_id: data.job_id,
    entity_type: "payment",
    entity_id: data.id,
    action: "received",
    description: `Received payment of £${data.amount} via ${data.payment_method || "card"}`,
  });

  return data;
}
