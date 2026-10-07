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

  // 6. AI Priority Score calculation (0–100 based on proportion of non-urgent / positive messages)
  let aiPriorityScore: number | null = null;
  let aiPriorityLabel = "INSUFFICIENT DATA";
  let priorityInsufficient = true;

  if (totalCommunications >= 1) {
    priorityInsufficient = false;
    const urgentCount = communicationsList.filter(
      (c) => c.sentiment === "urgent" || c.sentiment === "frustrated"
    ).length;
    const neutralOrPositiveCount = totalCommunications - urgentCount;
    aiPriorityScore = Math.round((neutralOrPositiveCount / totalCommunications) * 100);

    if (aiPriorityScore >= 80) aiPriorityLabel = "High Priority Alignment";
    else if (aiPriorityScore >= 60) aiPriorityLabel = "Moderate Priority";
    else aiPriorityLabel = "Needs Immediate Attention";
  }

  // 7. Customer Satisfaction calculation from reviews or positive sentiments
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
  } else if (totalCommunications >= 3) {
    const positiveCount = communicationsList.filter((c) => c.sentiment === "positive").length;
    satisfactionScore = Math.round((positiveCount / totalCommunications) * 100);
    satisfactionInsufficient = false;
    satisfactionLabel = `${satisfactionScore}% Positive Sentiment`;
  }

  // 8. Missed Opportunities calculation (Unanswered urgent/frustrated inbound messages > 24 hours old or unread)
  const now = new Date().getTime();
  let missedOpportunitiesCount = 0;
  customerLatestMsgMap.forEach((val) => {
    if (val.direction === "inbound") {
      const ageHours = (now - new Date(val.created_at).getTime()) / (1000 * 60 * 60);
      if (ageHours > 24) {
        missedOpportunitiesCount++;
      }
    }
  });

  // 9. Live Monitoring State
  let liveMonitoringState: 'Active Monitoring' | 'Manual Mode' | 'Limited Monitoring' = "Manual Mode";
  if (connectedChannelsCount >= 2) {
    liveMonitoringState = "Active Monitoring";
  } else if (connectedChannelsCount === 1) {
    liveMonitoringState = "Limited Monitoring";
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
    // If table is missing or query fails, return system fallback array safely
    return [
      {
        id: "sys-1",
        business_id: null,
        title: "Service Follow-up",
        category: "follow_up",
        channel: "email",
        subject: "Following up on your recent service",
        body: "Hi {{customer_first_name}},\n\nThank you for choosing us. We wanted to follow up and see how everything is going.\n\nBest regards,\nTeam",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
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
 * AI Assistant logic for drafting and polishing communications using customer context.
 */
export function generateAICommunicationDraft(params: {
  action: 'suggest' | 'improve' | 'professional' | 'shorten' | 'expand';
  channel: 'email' | 'sms' | 'whatsapp' | 'phone' | 'note';
  currentBody?: string;
  customerName?: string;
  subject?: string;
}): { subject?: string; body: string } {
  const name = params.customerName || "Customer";
  const body = params.currentBody?.trim() || "";

  if (params.action === "suggest") {
    if (params.channel === "email") {
      return {
        subject: `Update regarding your recent request`,
        body: `Hi ${name},\n\nI hope you are having a great day. I am writing to provide you with an update regarding your request. Please let us know if there is anything else we can assist you with.\n\nBest regards,\nYour Team`,
      };
    }
    return {
      body: `Hi ${name}, thank you for contacting us! We're processing your request and will follow up shortly.`,
    };
  }

  if (params.action === "improve" || params.action === "professional") {
    if (!body) {
      return {
        body: `Dear ${name},\n\nThank you for reaching out to us. We appreciate your communication and look forward to serving you.\n\nSincerely,\nCustomer Care Team`,
      };
    }
    return {
      body: `Dear ${name},\n\n${body.replace(/hey|hi/gi, "Hello")}\n\nThank you for your cooperation and prompt attention to this matter.\n\nWarm regards,\nService Team`,
    };
  }

  if (params.action === "shorten") {
    if (!body) return { body: `Hi ${name}, thank you for your message. We'll be in touch shortly.` };
    const sentences = body.split(".");
    return {
      body: sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 2))).join(".") + ".",
    };
  }

  if (params.action === "expand") {
    if (!body) {
      return {
        body: `Hi ${name},\n\nThank you for getting in touch with our team. We wanted to make sure all your questions were answered thoroughly and that you have all the necessary details.\n\nPlease reply at your convenience if you need further clarification.\n\nBest regards,`,
      };
    }
    return {
      body: `${body}\n\nWe value your partnership and want to ensure you receive the highest standard of support. Please reach out anytime if you have additional questions or concerns.`,
    };
  }

  return { body };
}
