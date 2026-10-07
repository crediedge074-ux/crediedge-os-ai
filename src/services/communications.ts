import { supabase } from "@/lib/supabase";
import { getPrimaryMembership, getBusiness } from "@/services/business";

async function fetchCurrentBusiness() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;
  const membership = await getPrimaryMembership(userData.user.id);
  if (!membership?.business_id) return null;
  return getBusiness(membership.business_id);
}
import { logActivity } from "@/services/activity";

export interface CommunicationRecord {
  id: string;
  business_id: string;
  customer_id?: string | null;
  job_id?: string | null;
  channel: 'email' | 'sms' | 'whatsapp' | 'phone' | 'note';
  direction: 'inbound' | 'outbound';
  subject?: string | null;
  body: string;
  sentiment?: 'positive' | 'neutral' | 'urgent' | 'frustrated' | null;
  read_at?: string | null;
  created_by?: string | null;
  created_at: string;
  customer?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
  } | null;
}

export interface CommunicationTemplate {
  id: string;
  business_id?: string | null;
  title: string;
  category: string;
  channel: string;
  subject?: string | null;
  body: string;
  variables?: string[];
  created_at: string;
  updated_at: string;
}

export interface CommunicationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  auto_archive_replied: boolean;
  ai_drafts_enabled: boolean;
  connected_integrations: Array<{
    id: string;
    provider: string;
    status: string;
    created_at: string;
  }>;
}

export interface CommunicationIntelligenceMetrics {
  totalCommunications: number;
  unreadMessagesCount: number;
  awaitingReplyCount: number;
  avgResponseTimeMinutes: number | null;
  avgResponseTimeFormatted: string;
  aiPriorityScore: number | null;
  aiPriorityLabel: string;
  satisfactionScore: number | null;
  satisfactionLabel: string;
  missedOpportunitiesCount: number;
  connectedChannelsCount: number;
  liveMonitoringState: 'Active Monitoring' | 'Manual Mode' | 'Limited Monitoring';
  insufficientDataFlags: {
    responseTime: boolean;
    priorityScore: boolean;
    satisfaction: boolean;
    missedOpportunities: boolean;
  };
}

/**
 * Fetch authoritative Communication Intelligence Overview Metrics for the active business.
 */
export async function fetchCommunicationIntelligenceMetrics(): Promise<CommunicationIntelligenceMetrics> {
  const business = await fetchCurrentBusiness();
  if (!business) {
    return {
      totalCommunications: 0,
      unreadMessagesCount: 0,
      awaitingReplyCount: 0,
      avgResponseTimeMinutes: null,
      avgResponseTimeFormatted: "INSUFFICIENT DATA",
      aiPriorityScore: null,
      aiPriorityLabel: "INSUFFICIENT DATA",
      satisfactionScore: null,
      satisfactionLabel: "INSUFFICIENT DATA",
      missedOpportunitiesCount: 0,
      connectedChannelsCount: 0,
      liveMonitoringState: "Manual Mode",
      insufficientDataFlags: {
        responseTime: true,
        priorityScore: true,
        satisfaction: true,
        missedOpportunities: true,
      },
    };
  }

  // 1. Fetch communications for business
  const { data: comms, error: commsError } = await supabase
    .from("communications")
    .select("id, customer_id, channel, direction, sentiment, read_at, created_at")
    .eq("business_id", business.id)
    .order("created_at", { ascending: true });

  if (commsError) {
    console.error("Error fetching communications metrics:", commsError);
    throw new Error(commsError.message);
  }

  const communicationsList = comms || [];
  const totalCommunications = communicationsList.length;

  // 2. Fetch connected integrations
  const { data: integrationsData } = await supabase
    .from("integrations")
    .select("id, provider, status")
    .eq("business_id", business.id)
    .eq("status", "connected");

  const connectedIntegrations = integrationsData || [];
  const connectedChannelsCount = connectedIntegrations.length;

  // 3. Unread Messages Count
  const unreadMessagesCount = communicationsList.filter(
    (c) => c.direction === "inbound" && !c.read_at
  ).length;

  // 4. Awaiting Reply Count (Unique customers whose latest message was inbound)
  const customerLatestMsgMap = new Map<string, { direction: string; created_at: string }>();
  communicationsList.forEach((c) => {
    if (c.customer_id) {
      customerLatestMsgMap.set(c.customer_id, {
        direction: c.direction,
        created_at: c.created_at,
      });
    }
  });

  let awaitingReplyCount = 0;
  customerLatestMsgMap.forEach((val) => {
    if (val.direction === "inbound") {
      awaitingReplyCount++;
    }
  });

  // 5. Average Response Time calculation
  // Group communications by customer in chronological order
  const customerCommsMap = new Map<string, Array<{ direction: string; created_at: string }>>();
  communicationsList.forEach((c) => {
    if (c.customer_id) {
      if (!customerCommsMap.has(c.customer_id)) {
        customerCommsMap.set(c.customer_id, []);
      }
      customerCommsMap.get(c.customer_id)!.push({
        direction: c.direction,
        created_at: c.created_at,
      });
    }
  });

  const responseDurationsMinutes: number[] = [];
  customerCommsMap.forEach((commList) => {
    for (let i = 0; i < commList.length - 1; i++) {
      const current = commList[i];
      const next = commList[i + 1];
      if (current.direction === "inbound" && next.direction === "outbound") {
        const inboundTime = new Date(current.created_at).getTime();
        const outboundTime = new Date(next.created_at).getTime();
        const diffMinutes = (outboundTime - inboundTime) / (1000 * 60);
        if (diffMinutes >= 0) {
          responseDurationsMinutes.push(diffMinutes);
        }
      }
    }
  });

  let avgResponseTimeMinutes: number | null = null;
  let avgResponseTimeFormatted = "INSUFFICIENT DATA";
  let responseTimeInsufficient = true;

  if (responseDurationsMinutes.length > 0) {
    const totalMinutes = responseDurationsMinutes.reduce((sum, val) => sum + val, 0);
    avgResponseTimeMinutes = Math.round(totalMinutes / responseDurationsMinutes.length);
    responseTimeInsufficient = false;

    if (avgResponseTimeMinutes < 60) {
      avgResponseTimeFormatted = `${avgResponseTimeMinutes} mins`;
    } else {
      const hours = Math.round((avgResponseTimeMinutes / 60) * 10) / 10;
      avgResponseTimeFormatted = `${hours} hrs`;
    }
  }

  // 6. AI Priority Score — Return explicit INSUFFICIENT DATA until dedicated AI priority scoring engine is integrated
  const aiPriorityScore: number | null = null;
  const aiPriorityLabel = "INSUFFICIENT DATA";
  const priorityInsufficient = true;

  // 7. Customer Satisfaction — Strictly derived from authoritative reviews table
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("rating")
    .eq("business_id", business.id);

  const reviewsList = reviewsData || [];
  let satisfactionScore: number | null = null;
  let satisfactionLabel = "INSUFFICIENT DATA";
  let satisfactionInsufficient = true;

  if (reviewsList.length > 0) {
    satisfactionInsufficient = false;
    const totalRating = reviewsList.reduce((acc, r) => acc + (r.rating || 0), 0);
    const avgRating = totalRating / reviewsList.length;
    satisfactionScore = Math.round((avgRating / 5) * 100);
    satisfactionLabel = `${avgRating.toFixed(1)} / 5.0 Star Rating`;
  }

  // 8. Missed Opportunities — Count inbound messages flagged with urgent/frustrated sentiment requiring attention
  const missedOpportunitiesCount = communicationsList.filter(
    (c) => c.direction === "inbound" && (c.sentiment === "urgent" || c.sentiment === "frustrated")
  ).length;

  // 9. Live Monitoring State — Reflects genuine connected integration state
  let liveMonitoringState: 'Active Monitoring' | 'Manual Mode' | 'Limited Monitoring' = "Manual Mode";
  if (connectedChannelsCount > 0) {
    liveMonitoringState = "Active Monitoring";
  }

  return {
    totalCommunications,
    unreadMessagesCount,
    awaitingReplyCount,
    avgResponseTimeMinutes,
    avgResponseTimeFormatted,
    aiPriorityScore,
    aiPriorityLabel,
    satisfactionScore,
    satisfactionLabel,
    missedOpportunitiesCount,
    connectedChannelsCount,
    liveMonitoringState,
    insufficientDataFlags: {
      responseTime: responseTimeInsufficient,
      priorityScore: priorityInsufficient,
      satisfaction: satisfactionInsufficient,
      missedOpportunities: awaitingReplyCount === 0 && missedOpportunitiesCount === 0,
    },
  };
}

/**
 * Fetch communications for the workspace.
 */
export async function fetchCommunications(): Promise<CommunicationRecord[]> {
  const business = await fetchCurrentBusiness();
  if (!business) return [];

  const { data, error } = await supabase
    .from("communications")
    .select(`
      id,
      business_id,
      customer_id,
      job_id,
      channel,
      direction,
      subject,
      body,
      sentiment,
      read_at,
      created_by,
      created_at,
      customer:customers(id, first_name, last_name, email, phone)
    `)
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching communications:", error);
    throw new Error(error.message);
  }

  return (data || []) as unknown as CommunicationRecord[];
}

/**
 * Create/Log a new communication record for the active business.
 */
export async function createCommunication(params: {
  customer_id?: string | null;
  channel: 'email' | 'sms' | 'whatsapp' | 'phone' | 'note';
  direction?: 'inbound' | 'outbound';
  subject?: string | null;
  body: string;
  sentiment?: 'positive' | 'neutral' | 'urgent' | 'frustrated' | null;
}): Promise<CommunicationRecord> {
  const business = await fetchCurrentBusiness();
  if (!business) throw new Error("No active workspace found");

  const { data: userData } = await supabase.auth.getUser();

  const recordPayload = {
    business_id: business.id,
    customer_id: params.customer_id || null,
    channel: params.channel,
    direction: params.direction || "outbound",
    subject: params.subject || null,
    body: params.body,
    sentiment: params.sentiment || "neutral",
    created_by: userData?.user?.id || null,
  };

  const { data, error } = await supabase
    .from("communications")
    .insert(recordPayload)
    .select(`
      id,
      business_id,
      customer_id,
      job_id,
      channel,
      direction,
      subject,
      body,
      sentiment,
      read_at,
      created_by,
      created_at,
      customer:customers(id, first_name, last_name, email, phone)
    `)
    .single();

  if (error) {
    console.error("Error creating communication record:", error);
    throw new Error(error.message);
  }

  // Audit activity log
  await logActivity({
    entity_type: "communication",
    entity_id: data.id,
    customer_id: params.customer_id || undefined,
    action: "message_sent",
    description: `Recorded outbound ${params.channel} communication.`,
  });

  return data as unknown as CommunicationRecord;
}

/**
 * Fetch communication templates (both global system defaults and workspace custom templates).
 */
export async function fetchCommunicationTemplates(): Promise<CommunicationTemplate[]> {
  const business = await fetchCurrentBusiness();
  const businessId = business?.id;

  const query = supabase
    .from("communication_templates")
    .select("id, business_id, title, category, channel, subject, body, variables, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (businessId) {
    query.or(`business_id.is.null,business_id.eq.${businessId}`);
  } else {
    query.is("business_id", null);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching communication templates:", error);
    throw new Error(`Failed to load communication templates: ${error.message}`);
  }

  return (data || []) as CommunicationTemplate[];
}

/**
 * Create a custom workspace communication template.
 */
export async function createCommunicationTemplate(params: {
  title: string;
  category?: string;
  channel?: string;
  subject?: string;
  body: string;
}): Promise<CommunicationTemplate> {
  const business = await fetchCurrentBusiness();
  if (!business) throw new Error("No active workspace found");

  const { data, error } = await supabase
    .from("communication_templates")
    .insert({
      business_id: business.id,
      title: params.title,
      category: params.category || "general",
      channel: params.channel || "email",
      subject: params.subject || null,
      body: params.body,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating communication template:", error);
    throw new Error(error.message);
  }

  return data as CommunicationTemplate;
}

/**
 * Fetch workspace Settings & Active Integrations for Communications.
 */
export async function fetchCommunicationSettings(): Promise<CommunicationSettings> {
  const business = await fetchCurrentBusiness();
  if (!business) {
    return {
      email_notifications: true,
      sms_notifications: false,
      auto_archive_replied: false,
      ai_drafts_enabled: true,
      connected_integrations: [],
    };
  }

  const { data: integrationsData } = await supabase
    .from("integrations")
    .select("id, provider, status, created_at")
    .eq("business_id", business.id);

  const connected_integrations = (integrationsData || [])
    .filter((item) => item.status === "connected")
    .map((item) => ({
      id: item.id,
      provider: item.provider,
      status: item.status,
      created_at: item.created_at,
    }));

  return {
    email_notifications: true,
    sms_notifications: false,
    auto_archive_replied: false,
    ai_drafts_enabled: true,
    connected_integrations,
  };
}

/**
 * AI Assistant status for workspace communications.
 * Honest baseline behavior: When no LLM provider/key is configured in the Production environment,
 * explicitly reports AI Service Unavailable rather than returning hardcoded strings.
 */
export async function generateAICommunicationDraft(params: {
  action: 'suggest' | 'improve' | 'professional' | 'shorten' | 'expand';
  channel: 'email' | 'sms' | 'whatsapp' | 'phone' | 'note';
  currentBody?: string;
  customerName?: string;
  subject?: string;
}): Promise<{ subject?: string; body: string; error?: string }> {
  // Check if active AI endpoint / environment key is present
  const aiApiKey = typeof process !== "undefined" ? process.env?.VITE_OPENAI_API_KEY : null;

  if (!aiApiKey) {
    return {
      body: params.currentBody || "",
      error: "AI Provider Configuration Missing: AI Assistant features require an active LLM provider key in workspace settings.",
    };
  }

  // Placeholder for real provider execution when configured
  return {
    body: params.currentBody || "",
    error: "AI Assistant Unavailable: LLM completion engine not configured for this workspace.",
  };
}
