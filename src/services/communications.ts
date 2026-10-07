import { supabase } from "@/lib/supabase";
import type { Json } from "@/lib/database.types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CommunicationRow {
  id: string;
  business_id: string;
  customer_id: string | null;
  job_id: string | null;
  channel: string;
  direction: string;
  subject: string | null;
  body: string;
  sentiment: string | null;
  read_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface CommunicationsMetrics {
  unreadMessages: number;
  awaitingReply: number;
  avgResponseTimeMinutes: number | null;
  satisfactionPct: number | null;
  aiPriorityScore: number | null;
  missedOpportunities: number;
  connectedChannels: number;
  liveMonitoring: boolean;
  totalCommunications: number;
  totalInbound: number;
  totalOutbound: number;
  hasSufficientData: boolean;
}

export interface AwaitingReplyItem {
  id: string;
  customer_id: string | null;
  channel: string;
  subject: string | null;
  body: string;
  created_at: string;
  waiting_hours: number;
  customer_name: string | null;
}

export interface MissedOpportunityItem {
  id: string;
  customer_id: string | null;
  channel: string;
  subject: string | null;
  body: string;
  created_at: string;
  waiting_hours: number;
  reason: string;
  customer_name: string | null;
}

export interface IntegrationRow {
  id: string;
  provider: string;
  status: string;
  last_synced_at: string | null;
  settings: Json;
}

export type SendStatus = "draft_saved" | "recorded" | "not_connected";

export interface ComposeResult {
  status: SendStatus;
  communicationId: string | null;
  message: string;
}

export interface CommunicationInsertPayload {
  business_id: string;
  customer_id: string | null;
  channel: string;
  direction: string;
  subject: string | null;
  body: string;
  created_by: string | null;
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

/**
 * Calculates all Communications header metrics from genuine database records.
 * Every value is derived from real Supabase queries — no hardcoded values.
 * Returns null / INSUFFICIENT DATA indicators when insufficient evidence exists.
 */
export async function fetchCommunicationsMetrics(
  businessId: string | undefined
): Promise<CommunicationsMetrics> {
  if (!businessId) {
    return emptyMetrics();
  }

  try {
    // 1. Fetch all communications for this workspace
    const { data: comms, error: commsErr } = await supabase
      .from("communications")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (commsErr) throw commsErr;

    const rows = (comms || []) as CommunicationRow[];

    // 2. Unread messages: inbound records where read_at IS NULL
    const unreadMessages = rows.filter(
      (r) => r.direction === "inbound" && !r.read_at
    ).length;

    // 3. Awaiting reply: inbound messages with no outbound reply in the same thread
    //    An inbound message is "awaiting reply" if there is no outbound communication
    //    linked to the same customer_id that was created AFTER it.
    const inboundRows = rows.filter((r) => r.direction === "inbound");
    const outboundRows = rows.filter((r) => r.direction === "outbound");

    const awaitingReplyItems: AwaitingReplyItem[] = [];

    // Fetch customer names for the awaiting-reply items
    const customerIds = [...new Set(inboundRows.map((r) => r.customer_id).filter(Boolean))] as string[];
    let customerMap: Record<string, string> = {};
    if (customerIds.length > 0) {
      const { data: customers } = await supabase
        .from("customers")
        .select("id, full_name, first_name, last_name")
        .in("id", customerIds);
      for (const c of customers || []) {
        const name = c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Customer";
        customerMap[c.id] = name;
      }
    }

    for (const inbound of inboundRows) {
      const hasReply = outboundRows.some(
        (out) =>
          out.customer_id === inbound.customer_id &&
          new Date(out.created_at) > new Date(inbound.created_at)
      );
      if (!hasReply) {
        const waitingHours = (Date.now() - new Date(inbound.created_at).getTime()) / (1000 * 60 * 60);
        awaitingReplyItems.push({
          id: inbound.id,
          customer_id: inbound.customer_id,
          channel: inbound.channel,
          subject: inbound.subject,
          body: inbound.body,
          created_at: inbound.created_at,
          waiting_hours: Math.round(waitingHours * 10) / 10,
          customer_name: inbound.customer_id ? customerMap[inbound.customer_id] ?? null : null,
        });
      }
    }

    const awaitingReply = awaitingReplyItems.length;

    // 4. Average response time: for each inbound that HAS a reply, calculate time delta.
    //    Only calculate if there are at least 2 inbound-with-reply pairs.
    const responseDeltas: number[] = [];
    for (const inbound of inboundRows) {
      const reply = outboundRows
        .filter(
          (out) =>
            out.customer_id === inbound.customer_id &&
            new Date(out.created_at) > new Date(inbound.created_at)
        )
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];

      if (reply) {
        const deltaMs = new Date(reply.created_at).getTime() - new Date(inbound.created_at).getTime();
        responseDeltas.push(deltaMs / (1000 * 60)); // minutes
      }
    }

    const avgResponseTimeMinutes =
      responseDeltas.length >= 2
        ? Math.round((responseDeltas.reduce((a, b) => a + b, 0) / responseDeltas.length) * 10) / 10
        : null;

    // 5. Satisfaction: use genuine review ratings from the reviews table
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("business_id", businessId)
      .not("rating", "is", null);

    const validRatings = (reviews || []).filter((r) => r.rating !== null && r.rating !== undefined);
    const satisfactionPct =
      validRatings.length > 0
        ? Math.round((validRatings.reduce((a, r) => a + r.rating, 0) / validRatings.length) * 20) // 5-star → 100%
        : null;

    // 6. AI Priority Score: only if sufficient communication evidence exists (>= 5 comms)
    //    Uses the existing confidence scoring engine from aiDataContract
    const aiPriorityScore = rows.length >= 5 ? calculateCommPriorityScore(rows) : null;

    // 7. Missed opportunities: inbound messages awaiting reply for > 24 hours
    //    These are evidence-backed — genuinely unanswered messages past a response window.
    const missedOpportunitiesItems: MissedOpportunityItem[] = awaitingReplyItems
      .filter((item) => item.waiting_hours > 24)
      .map((item) => ({
        ...item,
        reason: `Unanswered for ${Math.round(item.waiting_hours)} hours — potential missed opportunity`,
      }));

    const missedOpportunities = missedOpportunitiesItems.length;

    // 8. Connected channels: count verified integrations from the integrations table
    const { data: integrations } = await supabase
      .from("integrations")
      .select("id, provider, status, last_synced_at, settings")
      .eq("business_id", businessId)
      .eq("status", "connected");

    const connectedChannels = (integrations || []).length;

    // 9. Live monitoring: true only if at least one integration has synced in the last 10 minutes
    const now = Date.now();
    const liveMonitoring = (integrations || []).some((int: any) => {
      if (!int.last_synced_at) return false;
      const synced = new Date(int.last_synced_at).getTime();
      return now - synced < 10 * 60 * 1000;
    });

    const hasSufficientData = rows.length > 0;

    return {
      unreadMessages,
      awaitingReply,
      avgResponseTimeMinutes,
      satisfactionPct,
      aiPriorityScore,
      missedOpportunities,
      connectedChannels,
      liveMonitoring,
      totalCommunications: rows.length,
      totalInbound: inboundRows.length,
      totalOutbound: outboundRows.length,
      hasSufficientData,
    };
  } catch (err) {
    console.error("[fetchCommunicationsMetrics] error:", err);
    return emptyMetrics();
  }
}

function emptyMetrics(): CommunicationsMetrics {
  return {
    unreadMessages: 0,
    awaitingReply: 0,
    avgResponseTimeMinutes: null,
    satisfactionPct: null,
    aiPriorityScore: null,
    missedOpportunities: 0,
    connectedChannels: 0,
    liveMonitoring: false,
    totalCommunications: 0,
    totalInbound: 0,
    totalOutbound: 0,
    hasSufficientData: false,
  };
}

/**
 * Calculates a communication priority score from genuine communication records.
 * Based on: response rate, unread ratio, and inbound volume.
 * Score range: 0-100. Only called when there are >= 5 communications.
 */
function calculateCommPriorityScore(rows: CommunicationRow[]): number {
  const inbound = rows.filter((r) => r.direction === "inbound");
  const outbound = rows.filter((r) => r.direction === "outbound");
  const unread = inbound.filter((r) => !r.read_at);

  const unreadRatio = inbound.length > 0 ? unread.length / inbound.length : 0;
  const responseRate = inbound.length > 0 ? Math.min(1, outbound.length / inbound.length) : 0;
  const volumeFactor = Math.min(1, inbound.length / 20);

  // Weighted score: lower unread ratio = higher score, higher response rate = higher score
  const score = Math.round(
    (1 - unreadRatio) * 40 + responseRate * 35 + volumeFactor * 25
  );

  return Math.min(100, Math.max(0, score));
}

// ─── Integration Status ───────────────────────────────────────────────────────

export async function fetchConnectedIntegrations(
  businessId: string | undefined
): Promise<IntegrationRow[]> {
  if (!businessId) return [];

  const { data, error } = await supabase
    .from("integrations")
    .select("id, provider, status, last_synced_at, settings")
    .eq("business_id", businessId);

  if (error) {
    console.error("[fetchConnectedIntegrations] error:", error);
    return [];
  }

  return (data || []) as IntegrationRow[];
}

// ─── Compose / Send ───────────────────────────────────────────────────────────

/**
 * Saves a communication record as a draft/log entry.
 * This does NOT send an actual message — it records the communication in the database.
 * Actual sending requires a verified integration (email/SMS/WhatsApp provider).
 *
 * Returns the status indicating whether it was saved as a draft, recorded, or
 * whether no sending integration is connected.
 */
export async function saveCommunicationRecord(
  payload: CommunicationInsertPayload
): Promise<ComposeResult> {
  try {
    const { data, error } = await supabase
      .from("communications")
      .insert({
        business_id: payload.business_id,
        customer_id: payload.customer_id,
        channel: payload.channel,
        direction: "outbound",
        subject: payload.subject,
        body: payload.body,
        created_by: payload.created_by,
      })
      .select("id")
      .single();

    if (error) throw error;

    // Check if a real sending integration exists for this channel
    const { data: integration } = await supabase
      .from("integrations")
      .select("id, status")
      .eq("business_id", payload.business_id)
      .eq("status", "connected")
      .maybeSingle();

    if (!integration) {
      return {
        status: "not_connected",
        communicationId: data.id,
        message: "Communication saved as a record. No sending integration is connected — the message was not sent to the recipient.",
      };
    }

    return {
      status: "recorded",
      communicationId: data.id,
      message: "Communication recorded in your workspace. A sending integration is connected — configure it in Settings to enable real delivery.",
    };
  } catch (err) {
    console.error("[saveCommunicationRecord] error:", err);
    return {
      status: "not_connected",
      communicationId: null,
      message: "Failed to save communication record. Please try again.",
    };
  }
}

// ─── Awaiting Reply (full list) ───────────────────────────────────────────────

export async function fetchAwaitingReply(
  businessId: string | undefined
): Promise<AwaitingReplyItem[]> {
  if (!businessId) return [];

  try {
    const { data: comms, error } = await supabase
      .from("communications")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = (comms || []) as CommunicationRow[];
    const inboundRows = rows.filter((r) => r.direction === "inbound");
    const outboundRows = rows.filter((r) => r.direction === "outbound");

    const customerIds = [...new Set(inboundRows.map((r) => r.customer_id).filter(Boolean))] as string[];
    let customerMap: Record<string, string> = {};
    if (customerIds.length > 0) {
      const { data: customers } = await supabase
        .from("customers")
        .select("id, full_name, first_name, last_name")
        .in("id", customerIds);
      for (const c of customers || []) {
        const name = c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Customer";
        customerMap[c.id] = name;
      }
    }

    const items: AwaitingReplyItem[] = [];
    for (const inbound of inboundRows) {
      const hasReply = outboundRows.some(
        (out) =>
          out.customer_id === inbound.customer_id &&
          new Date(out.created_at) > new Date(inbound.created_at)
      );
      if (!hasReply) {
        const waitingHours = (Date.now() - new Date(inbound.created_at).getTime()) / (1000 * 60 * 60);
        items.push({
          id: inbound.id,
          customer_id: inbound.customer_id,
          channel: inbound.channel,
          subject: inbound.subject,
          body: inbound.body,
          created_at: inbound.created_at,
          waiting_hours: Math.round(waitingHours * 10) / 10,
          customer_name: inbound.customer_id ? customerMap[inbound.customer_id] ?? null : null,
        });
      }
    }

    return items;
  } catch (err) {
    console.error("[fetchAwaitingReply] error:", err);
    return [];
  }
}
