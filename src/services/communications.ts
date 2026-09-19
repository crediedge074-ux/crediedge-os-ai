import { supabase } from "@/lib/supabase";
import type { Communication, CommunicationInsert } from "@/lib/database.types";

/**
 * Authoritative Communications Service for CrediEdgeOS.
 * All queries are strictly scoped by business_id (and customer_id where applicable) to preserve workspace isolation.
 */

export async function getCommunications(
  businessId: string,
  limit = 100
): Promise<Communication[]> {
  if (!businessId) return [];

  try {
    const { data, error } = await supabase
      .from("communications")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching communications:", error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Failed to fetch communications:", err);
    return [];
  }
}

export async function getCommunicationsByCustomer(
  businessId: string,
  customerId: string
): Promise<Communication[]> {
  if (!businessId || !customerId) return [];

  try {
    const { data, error } = await supabase
      .from("communications")
      .select("*")
      .eq("business_id", businessId)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customer communications:", error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Failed to fetch customer communications:", err);
    return [];
  }
}

export async function createCommunication(
  comm: CommunicationInsert
): Promise<Communication | null> {
  if (!comm.business_id) {
    throw new Error("Cannot create communication without business_id scoping.");
  }

  try {
    const { data, error } = await supabase
      .from("communications")
      .insert(comm)
      .select()
      .single();

    if (error) {
      console.error("Error creating communication:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Failed to create communication:", err);
    return null;
  }
}

export async function markCommunicationAsRead(
  id: string,
  businessId: string
): Promise<void> {
  if (!id || !businessId) return;

  try {
    const { error } = await supabase
      .from("communications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id)
      .eq("business_id", businessId);

    if (error) {
      console.error("Error marking communication as read:", error);
    }
  } catch (err) {
    console.error("Failed to mark communication as read:", err);
  }
}
