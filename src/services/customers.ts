import { supabase } from "@/lib/supabase";
import type { Customer, CustomerInsert, CustomerUpdate } from "@/lib/database.types";

export const demoDataEnabled =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEMO_DATA === "true";

export async function getCustomers(businessId: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("business_id", businessId)
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createCustomer(insert: CustomerInsert): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .insert(insert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCustomer(id: string, updates: CustomerUpdate): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function archiveCustomer(id: string): Promise<void> {
  const { error } = await supabase
    .from("customers")
    .update({ is_active: false, status: "archived" })
    .eq("id", id);

  if (error) throw error;
}

export async function restoreCustomer(id: string): Promise<void> {
  const { error } = await supabase
    .from("customers")
    .update({ is_active: true, status: "active" })
    .eq("id", id);

  if (error) throw error;
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

  if (error) throw error;
  return data ?? [];
}

export async function seedDemoCustomers(businessId: string, userId: string): Promise<void> {
  if (!demoDataEnabled) {
    throw new Error(
      "Demo data is only available in explicitly enabled development environments",
    );
  }

  const { DEMO_CUSTOMERS } = await import("./customers.demo");
  const inserts: CustomerInsert[] = DEMO_CUSTOMERS.map((c) => ({
    ...c,
    business_id: businessId,
    created_by: userId,
  }));

  const { error } = await supabase.from("customers").insert(inserts);
  if (error) throw error;
}
