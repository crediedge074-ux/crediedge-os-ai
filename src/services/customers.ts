import { supabase } from "@/lib/supabase";
import type { Customer, CustomerInsert, CustomerUpdate } from "@/lib/database.types";

const DEMO_CUSTOMERS: Omit<CustomerInsert, "business_id">[] = [
  {
    first_name: "Marcus", last_name: "Williams", full_name: "Marcus Williams",
    email: "marcus.williams@example.com", phone: "07700 900123",
    city: "London", postcode: "SW1A 1AA", customer_type: "individual",
    status: "active", source: "referral", lifetime_value: 3100,
    preferred_contact_method: "email", marketing_consent: true, gdpr_consent: true,
    tags: ["vip", "loyal"], customer_since: "2025-01-10",
    last_booking_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Prefers morning appointments. Has a dog named Biscuit. Works in finance.",
  },
  {
    first_name: "James", last_name: "Thompson", full_name: "James Thompson",
    email: "james.thompson@example.com", phone: "07700 900456",
    city: "Manchester", postcode: "M1 1AE", customer_type: "individual",
    status: "active", source: "referral", lifetime_value: 5600,
    preferred_contact_method: "sms", marketing_consent: true, gdpr_consent: true,
    tags: ["high-value", "regular"], customer_since: "2025-03-03",
    last_booking_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Referred by Marcus Williams. Owns a small business. Flexible mornings.",
  },
  {
    first_name: "Sarah", last_name: "Johnson", full_name: "Sarah Johnson",
    email: "sarah.johnson@example.com", phone: "07700 900789",
    city: "Birmingham", postcode: "B1 1BB", customer_type: "individual",
    status: "active", source: "organic", lifetime_value: 2400,
    preferred_contact_method: "email", marketing_consent: true, gdpr_consent: true,
    tags: ["growing"], customer_since: "2025-04-15",
    last_booking_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    first_name: "Emily", last_name: "Clarke", full_name: "Emily Clarke",
    email: "emily.clarke@example.com", phone: "07700 900321",
    city: "Leeds", postcode: "LS1 1BA", customer_type: "individual",
    status: "active", source: "referral", lifetime_value: 1800,
    preferred_contact_method: "email", marketing_consent: false, gdpr_consent: true,
    tags: ["at-risk"], customer_since: "2025-04-30",
    last_booking_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Referred by James Thompson. Last engagement dropping off.",
  },
  {
    first_name: "John", last_name: "Smith", full_name: "John Smith",
    email: "john.smith@example.com", phone: "07700 900654",
    city: "Bristol", postcode: "BS1 1AA", customer_type: "individual",
    status: "active", source: "social", lifetime_value: 2900,
    preferred_contact_method: "phone", marketing_consent: true, gdpr_consent: true,
    tags: ["high-value", "upsell-ready"], customer_since: "2025-02-20",
    last_booking_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    first_name: "Olivia", last_name: "Brown", full_name: "Olivia Brown",
    email: "olivia.brown@example.com", phone: "07700 900987",
    city: "Edinburgh", postcode: "EH1 1YZ", customer_type: "individual",
    status: "active", source: "organic", lifetime_value: 1500,
    preferred_contact_method: "sms", marketing_consent: true, gdpr_consent: true,
    tags: ["growing"], customer_since: "2025-05-10",
    last_booking_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    first_name: "Daniel", last_name: "Murphy", full_name: "Daniel Murphy",
    email: "daniel.murphy@example.com", phone: "07700 900111",
    city: "Dublin", postcode: "D01 F5P2", country: "Ireland", customer_type: "individual",
    status: "active", source: "referral", lifetime_value: 4200,
    preferred_contact_method: "email", marketing_consent: true, gdpr_consent: true,
    tags: ["vip", "loyal"], customer_since: "2024-11-05",
    last_booking_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    first_name: "Sophie", last_name: "Turner", full_name: "Sophie Turner",
    email: "sophie.turner@example.com", phone: "07700 900222",
    city: "Liverpool", postcode: "L1 1AA", customer_type: "individual",
    status: "active", source: "social", lifetime_value: 950,
    preferred_contact_method: "sms", marketing_consent: true, gdpr_consent: true,
    tags: ["new"], customer_since: "2026-06-01",
    last_booking_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    first_name: "Alex", last_name: "Harrison", full_name: "Alex Harrison",
    email: "alex.harrison@example.com", phone: "07700 900333",
    city: "Sheffield", postcode: "S1 1AA", customer_type: "individual",
    status: "inactive", source: "organic", lifetime_value: 680,
    preferred_contact_method: "email", marketing_consent: false, gdpr_consent: true,
    tags: ["inactive"], customer_since: "2025-08-12",
    last_booking_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    first_name: "Rachel", last_name: "Green", full_name: "Rachel Green",
    email: "rachel.green@example.com", phone: "07700 900444",
    city: "Nottingham", postcode: "NG1 1AA", customer_type: "individual",
    status: "active", source: "organic", lifetime_value: 2100,
    preferred_contact_method: "email", marketing_consent: true, gdpr_consent: true,
    tags: ["regular"], customer_since: "2025-03-18",
    last_booking_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    first_name: "Tom", last_name: "Baker", full_name: "Tom Baker",
    email: "tom.baker@example.com", phone: "07700 900555",
    city: "Cardiff", postcode: "CF10 1AA", country: "Wales", customer_type: "individual",
    status: "active", source: "referral", lifetime_value: 3600,
    preferred_contact_method: "phone", marketing_consent: true, gdpr_consent: true,
    tags: ["high-value", "loyal"], customer_since: "2024-12-20",
    last_booking_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    first_name: "Natasha", last_name: "Patel", full_name: "Natasha Patel",
    email: "natasha.patel@example.com", phone: "07700 900666",
    city: "Leicester", postcode: "LE1 1AA", customer_type: "individual",
    status: "active", source: "social", lifetime_value: 1200,
    preferred_contact_method: "sms", marketing_consent: true, gdpr_consent: true,
    tags: ["growing"], customer_since: "2025-06-22",
    last_booking_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    first_name: "Chris", last_name: "Evans", full_name: "Chris Evans",
    company_name: "Evans & Co.", email: "chris@evansco.co.uk", phone: "07700 900777",
    city: "Cambridge", postcode: "CB1 1AA", customer_type: "business",
    status: "active", source: "organic", lifetime_value: 7800,
    preferred_contact_method: "email", marketing_consent: true, gdpr_consent: true,
    tags: ["business", "high-value", "vip"], customer_since: "2024-10-01",
    last_booking_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Business account. Manages a team of 12. Monthly standing order.",
  },
  {
    first_name: "Priya", last_name: "Sharma", full_name: "Priya Sharma",
    email: "priya.sharma@example.com", phone: "07700 900888",
    city: "Oxford", postcode: "OX1 1AA", customer_type: "individual",
    status: "inactive", source: "organic", lifetime_value: 420,
    preferred_contact_method: "email", marketing_consent: false, gdpr_consent: true,
    tags: ["inactive", "at-risk"], customer_since: "2025-09-05",
    last_booking_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    first_name: "George", last_name: "Wilson", full_name: "George Wilson",
    email: "george.wilson@example.com", phone: "07700 900999",
    city: "Glasgow", postcode: "G1 1AA", country: "Scotland", customer_type: "individual",
    status: "active", source: "referral", lifetime_value: 2700,
    preferred_contact_method: "phone", marketing_consent: true, gdpr_consent: true,
    tags: ["regular", "loyal"], customer_since: "2025-01-28",
    last_booking_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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
  const inserts: CustomerInsert[] = DEMO_CUSTOMERS.map((c) => ({
    ...c,
    business_id: businessId,
    created_by: userId,
  }));

  const { error } = await supabase.from("customers").insert(inserts);
  if (error) throw error;
}
