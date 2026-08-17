import { supabase } from "@/lib/supabase";
import type { Customer, CustomerInsert, CustomerUpdate } from "@/lib/database.types";
import { logActivity } from "./activity";

export async function getCustomers(businessId: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("business_id", businessId)
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
  return data ?? [];
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
  return data;
}

export async function createCustomer(insert: CustomerInsert): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .insert(insert)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    business_id: data.business_id,
    customer_id: data.id,
    entity_type: "customer",
    entity_id: data.id,
    action: "created",
    description: `Added new customer: ${data.full_name || data.email || 'Customer'}`,
    actor_id: data.created_by,
  });

  return data;
}

export async function updateCustomer(id: string, updates: CustomerUpdate): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    business_id: data.business_id,
    customer_id: data.id,
    entity_type: "customer",
    entity_id: data.id,
    action: "updated",
    description: `Updated customer details for ${data.full_name || data.email || 'Customer'}`,
    actor_id: data.updated_by,
  });

  return data;
}

export async function archiveCustomer(id: string): Promise<void> {
  const customer = await getCustomer(id);
  if (!customer) return;

  const { error } = await supabase
    .from("customers")
    .update({ is_active: false, status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;

  await logActivity({
    business_id: customer.business_id,
    customer_id: customer.id,
    entity_type: "customer",
    entity_id: customer.id,
    action: "archived",
    description: `Archived customer: ${customer.full_name || customer.email || 'Customer'}`,
  });
}

export async function restoreCustomer(id: string): Promise<void> {
  const customer = await getCustomer(id);
  if (!customer) return;

  const { error } = await supabase
    .from("customers")
    .update({ is_active: true, status: "active", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;

  await logActivity({
    business_id: customer.business_id,
    customer_id: customer.id,
    entity_type: "customer",
    entity_id: customer.id,
    action: "restored",
    description: `Restored customer: ${customer.full_name || customer.email || 'Customer'}`,
  });
}

export async function searchCustomers(businessId: string, query: string): Promise<Customer[]> {
  const q = `%${query}%`;
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("business_id", businessId)
    .eq("is_active", true)
    .or(`full_name.ilike.${q},email.ilike.${q},phone.ilike.${q},company_name.ilike.${q}`)
    .order("full_name", { ascending: true })
    .limit(50);

  if (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
  return data ?? [];
}
