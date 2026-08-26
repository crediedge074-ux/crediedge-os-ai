import { supabase } from "@/lib/supabase";
import type { Customer, CustomerInsert, CustomerUpdate } from "@/lib/database.types";
import { logActivity } from "./activity";

export interface DuplicateCheckResult {
  hasDuplicate: boolean;
  matchType: "EMAIL" | "PHONE" | "NAME" | "COMPANY" | null;
  matchingCustomer: Customer | null;
  confidenceScore: number; // 0 - 100
  matchReason: string;
}

/**
 * Workspace-isolated duplicate customer check before creation or editing.
 * Checks for matching email, phone, full name, or company name.
 */
export async function checkDuplicateCustomer(
  businessId: string,
  data: {
    email?: string | null;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    companyName?: string | null;
    fullName?: string | null;
  },
  excludeId?: string | null
): Promise<DuplicateCheckResult> {
  const cleanEmail = data.email?.trim().toLowerCase();
  const cleanPhone = data.phone?.trim().replace(/\D/g, "");
  const cleanCompany = data.companyName?.trim().toLowerCase();
  const cleanName = (data.fullName || `${data.firstName || ""} ${data.lastName || ""}`).trim().toLowerCase();

  try {
    let query = supabase
      .from("customers")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_active", true);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data: existing, error } = await query;

    if (error || !existing || existing.length === 0) {
      return {
        hasDuplicate: false,
        matchType: null,
        matchingCustomer: null,
        confidenceScore: 0,
        matchReason: "No existing workspace customers found.",
      };
    }

    const customers = existing as Customer[];

    // 1. Exact Email Match (Highest confidence: 100%)
    if (cleanEmail) {
      const emailMatch = customers.find((c) => c.email && c.email.trim().toLowerCase() === cleanEmail);
      if (emailMatch) {
        return {
          hasDuplicate: true,
          matchType: "EMAIL",
          matchingCustomer: emailMatch,
          confidenceScore: 100,
          matchReason: `Matching email address (${cleanEmail}) found on existing customer record.`,
        };
      }
    }

    // 2. Exact Phone Match (High confidence: 90%)
    if (cleanPhone && cleanPhone.length >= 7) {
      const phoneMatch = customers.find((c) => {
        if (!c.phone) return false;
        const existingPhoneDigits = c.phone.replace(/\D/g, "");
        return existingPhoneDigits === cleanPhone;
      });
      if (phoneMatch) {
        return {
          hasDuplicate: true,
          matchType: "PHONE",
          matchingCustomer: phoneMatch,
          confidenceScore: 90,
          matchReason: `Matching phone number found on existing customer record.`,
        };
      }
    }

    // 3. Exact Company Name Match for business customers (Confidence: 85%)
    if (cleanCompany && cleanCompany.length >= 3) {
      const companyMatch = customers.find(
        (c) => c.company_name && c.company_name.trim().toLowerCase() === cleanCompany
      );
      if (companyMatch) {
        return {
          hasDuplicate: true,
          matchType: "COMPANY",
          matchingCustomer: companyMatch,
          confidenceScore: 85,
          matchReason: `Matching company name (${cleanCompany}) found on existing workspace customer.`,
        };
      }
    }

    // 4. Exact Full Name Match (Confidence: 75%)
    if (cleanName && cleanName.length >= 4) {
      const nameMatch = customers.find((c) => {
        const existingName = (c.full_name || `${c.first_name || ""} ${c.last_name || ""}`).trim().toLowerCase();
        return existingName === cleanName;
      });
      if (nameMatch) {
        return {
          hasDuplicate: true,
          matchType: "NAME",
          matchingCustomer: nameMatch,
          confidenceScore: 75,
          matchReason: `Matching customer name (${cleanName}) found on existing workspace record.`,
        };
      }
    }

    return {
      hasDuplicate: false,
      matchType: null,
      matchingCustomer: null,
      confidenceScore: 0,
      matchReason: "No duplicate records detected.",
    };
  } catch (err) {
    console.error("[checkDuplicateCustomer] error:", err);
    return {
      hasDuplicate: false,
      matchType: null,
      matchingCustomer: null,
      confidenceScore: 0,
      matchReason: "Duplicate check failed (non-blocking).",
    };
  }
}

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
  console.log("[createCustomer] inserting customer into Supabase table:", insert);
  const { data, error } = await supabase
    .from("customers")
    .insert(insert)
    .select()
    .single();

  if (error) {
    console.error("[createCustomer] Supabase insert failed:", error);
    throw error;
  }

  console.log("[createCustomer] Supabase insert succeeded, row:", data);

  try {
    await logActivity({
      business_id: data.business_id,
      customer_id: data.id,
      entity_type: "customer",
      entity_id: data.id,
      action: "created",
      description: `Added new customer: ${data.full_name || data.email || 'Customer'}`,
      actor_id: data.created_by,
    });
    console.log("[createCustomer] Activity logged successfully");
  } catch (actErr) {
    console.error("[createCustomer] Activity logging failed (non-blocking):", actErr);
  }

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
