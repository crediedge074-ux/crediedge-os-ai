import { supabase } from "@/lib/supabase";
import type { Communication, Review } from "@/lib/database.types";

export interface CommunicationHeaderMetrics {
  unreadMessagesCount: number;
  awaitingReplyCount: number;
  avgResponseTimeMinutes: number | null;
  aiPriorityScore: number | null;
  satisfactionPercentage: number | null;
  missedOpportunitiesCount: number;
  connectedChannelsCount: number;
  liveMonitoringState: "Live" | "Manual Mode";
}

export interface CommunicationTemplate {
  id: string;
  business_id: string | null;
  title: string;
  category: string;
  channel: string;
  subject: string | null;
  body: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch communications for a workspace
 */
export async function getCommunications(businessId: string): Promise<Communication[]> {
  const { data, error } = await supabase
    .from("communications")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Compute header metrics using genuine workspace data
 */
export async function getCommunicationHeaderMetrics(
  businessId: string
): Promise<CommunicationHeaderMetrics> {
  const [commsResult, reviewsResult] = await Promise.all([
    supabase.from("communications").select("*").eq("business_id", businessId),
    supabase.from("reviews").select("*").eq("business_id", businessId),
  ]);

  if (commsResult.error) throw commsResult.error;

  const comms: Communication[] = commsResult.data || [];
  const reviews: Review[] = reviewsResult.data || [];

  // 1. Unread Messages (Inbound & unread)
  const unreadMessagesCount = comms.filter(
    (c) => c.direction === "inbound" && !c.read_at
  ).length;

  // 2. Awaiting Reply (Inbound messages requiring response)
  const awaitingReplyCount = comms.filter(
    (c) => c.direction === "inbound" && !c.read_at
  ).length;

  // 3. Average Response Time
  let avgResponseTimeMinutes: number | null = null;
  const inboundComms = comms.filter((c) => c.direction === "inbound");
  if (inboundComms.length > 0) {
    let totalMinutes = 0;
    let pairedCount = 0;

    inboundComms.forEach((inb) => {
      const reply = comms.find(
        (out) =>
          out.direction === "outbound" &&
          out.customer_id === inb.customer_id &&
          new Date(out.created_at) > new Date(inb.created_at)
      );
      if (reply) {
        const diffMs =
          new Date(reply.created_at).getTime() - new Date(inb.created_at).getTime();
        totalMinutes += diffMs / (1000 * 60);
        pairedCount++;
      }
    });

    if (pairedCount > 0) {
      avgResponseTimeMinutes = Math.round(totalMinutes / pairedCount);
    }
  }

  // 4. AI Priority Score (Grounded calculation or null)
  let aiPriorityScore: number | null = null;
  if (comms.length >= 3) {
    const baseScore = 100;
    const penaltyUnread = unreadMessagesCount * 10;
    const penaltyDelay = avgResponseTimeMinutes ? Math.min(30, avgResponseTimeMinutes / 5) : 0;
    aiPriorityScore = Math.max(0, Math.min(100, Math.round(baseScore - penaltyUnread - penaltyDelay)));
  }

  // 5. Satisfaction (from genuine workspace reviews)
  let satisfactionPercentage: number | null = null;
  const submittedReviews = reviews.filter((r) => r.rating !== null);
  if (submittedReviews.length > 0) {
    const totalRating = submittedReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const avgRating = totalRating / submittedReviews.length;
    satisfactionPercentage = Math.round((avgRating / 5) * 100);
  }

  // 6. Missed Opportunities
  const missedOpportunitiesCount = comms.filter(
    (c) => c.sentiment === "urgent" || c.sentiment === "frustrated"
  ).length;

  // 7. Connected Channel Count & Live Monitoring State
  const connectedChannelsCount = 0; // Manual Mode until external 3rd-party integration connected
  const liveMonitoringState: "Live" | "Manual Mode" = "Manual Mode";

  return {
    unreadMessagesCount,
    awaitingReplyCount,
    avgResponseTimeMinutes,
    aiPriorityScore,
    satisfactionPercentage,
    missedOpportunitiesCount,
    connectedChannelsCount,
    liveMonitoringState,
  };
}

/**
 * Mark communication record as read
 */
export async function markCommunicationAsRead(commId: string): Promise<void> {
  const { error } = await supabase
    .from("communications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", commId);

  if (error) throw error;
}

/**
 * Create a new communication record
 */
export async function createCommunication(payload: {
  business_id: string;
  customer_id?: string | null;
  channel: string;
  direction: string;
  subject?: string | null;
  body: string;
  sentiment?: string;
}): Promise<Communication> {
  const { data, error } = await supabase
    .from("communications")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get templates (global + custom workspace templates)
 */
export async function getCommunicationTemplates(
  businessId: string
): Promise<CommunicationTemplate[]> {
  const { data, error } = await supabase
    .from("communication_templates")
    .select("*")
    .or(`business_id.is.null,business_id.eq.${businessId}`)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Create a workspace custom template
 */
export async function createCustomTemplate(payload: {
  business_id: string;
  title: string;
  category: string;
  channel: string;
  subject?: string | null;
  body: string;
}): Promise<CommunicationTemplate> {
  const { data, error } = await supabase
    .from("communication_templates")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}
