import { supabase } from "@/lib/supabase";
import type { Review, ReviewInsert } from "@/lib/database.types";

export interface ExtendedReview extends Review {
  customer?: {
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  reply_text?: string | null;
  replied_at?: string | null;
}

export interface ReviewCampaign {
  id: string;
  business_id: string;
  name: string;
  mission: string;
  status: string;
  target_reviews: number;
  current_reviews: number;
  created_at: string;
}

export async function getReviews(
  businessId: string,
  limit = 100
): Promise<ExtendedReview[]> {
  if (!businessId) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      customer:customers(first_name, last_name, full_name, email, phone)
    `)
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }

  return (data as any) ?? [];
}

export async function createReview(
  review: ReviewInsert
): Promise<Review> {
  if (!review.business_id) {
    throw new Error("Cannot create review without business_id scoping.");
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert(review)
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    throw error;
  }

  return data;
}

export async function updateReviewReply(
  reviewId: string,
  businessId: string,
  replyText: string
): Promise<Review> {
  if (!reviewId || !businessId) {
    throw new Error("Cannot update review reply without reviewId and businessId.");
  }

  const { data, error } = await supabase
    .from("reviews")
    .update({
      status: "replied",
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) {
    console.error("Error updating review reply:", error);
    throw error;
  }

  return data;
}

export async function requestReviewForCustomer(
  businessId: string,
  customerId: string,
  source = "Google"
): Promise<Review> {
  if (!businessId || !customerId) {
    throw new Error("Cannot request review without businessId and customerId.");
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      business_id: businessId,
      customer_id: customerId,
      source,
      status: "requested",
      requested_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error requesting review:", error);
    throw error;
  }

  return data;
}
