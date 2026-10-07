import { supabase } from "@/lib/supabase";
import type { Json } from "@/lib/database.types";

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

export interface IntegrationRow {
  id: string;
  provider: string;
  status: string;
  last_synced_at: string | null;
  settings: Json;
}

export interface AwaitingReplyItem {
  id: string;
  customer_id: string | null;
  job_id: string | null;
  channel: string;
  subject: string | null;
  body: string;
  created_at: string;
  waiting_hours: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  evidence: string[];
}

export interface PriorityRecommendation {
  item: AwaitingReplyItem | null;
  evidence: string[];
  reason: string | null;
  hasSufficientData: boolean;
}

export interface ScoreComponent {
  key: "responseTime" | "sentiment" | "satisfaction" | "consistency" | "followUpRate" | "resolutionTime";
  label: string;
  score: number | null;
  weight: number;
  evidence: string;
}

export interface CommunicationScore {
  score: number | null;
  components: ScoreComponent[];
  minimumEvidence: string;
  hasSufficientData: boolean;
}

export interface AnalyticsMetric {
  key: string;
  label: string;
  value: number | null;
  unit: string;
  source: string;
  status: "verified" | "calculated" | "estimated" | "insufficient";
}

export interface CommunicationsAnalytics {
  periodStart: string;
  periodEnd: string;
  comparisonStart: string;
  comparisonEnd: string;
  metrics: AnalyticsMetric[];
}

export interface ChannelMetric {
  channel: string;
  connected: boolean;
  communicationCount: number;
  inboundCount: number;
  outboundCount: number;
  responseTimeMinutes: number | null;
  status: "verified" | "insufficient" | "not_connected";
}

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  occurredAt: string;
  customerId: string;
  relatedId: string | null;
}

export interface CommunicationDNA {
  preferredChannel: { value: string; status: "verified" | "calculated" } | null;
  preferredTone: { value: string; status: "verified" | "calculated" } | null;
  typicalResponseTimeMinutes: number | null;
  preferredContactHour: number | null;
  sentimentTrend: string | null;
  evidenceCount: number;
  hasSufficientData: boolean;
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
  score: CommunicationScore;
  channels: ChannelMetric[];
}

export interface ComposeResult {
  status: "recorded" | "not_connected";
  communicationId: string | null;
  message: string;
}

export interface CommunicationInsertPayload {
  business_id: string;
  customer_id: string | null;
  job_id?: string | null;
  channel: string;
  direction: string;
  subject: string | null;
  body: string;
  created_by: string | null;
}

export interface ResolveCommunicationPayload {
  businessId: string;
  communicationId: string;
  customerId: string | null;
  userId: string;
  actionTaken: string;
  notes: string;
  manualChannel: string | null;
}

export interface ResolveCommunicationResult {
  success: boolean;
  message: string;
}

interface CustomerRow {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  preferred_contact_method: string | null;
}

interface ReviewRow {
  id: string;
  customer_id: string | null;
  job_id: string | null;
  rating: number | null;
  feedback: string | null;
  created_at: string;
  submitted_at: string | null;
}

interface JobRow {
  id: string;
  customer_id: string | null;
  title: string;
  status: string;
  completed_at: string | null;
  created_at: string;
}

interface InvoiceRow {
  id: string;
  customer_id: string | null;
  job_id: string | null;
  total_amount: number;
  status: string;
  created_at: string;
}

interface PaymentRow {
  id: string;
  customer_id: string | null;
  job_id: string | null;
  amount: number;
  payment_date: string | null;
  created_at: string;
}

interface ActionRow {
  id: string;
  communication_id: string;
  customer_id: string | null;
  status: "resolved" | "noted";
  action_taken: string | null;
  notes: string | null;
  manual_channel: string | null;
  resolved_at: string | null;
}

interface WorkspaceSnapshot {
  communications: CommunicationRow[];
  customers: CustomerRow[];
  reviews: ReviewRow[];
  jobs: JobRow[];
  invoices: InvoiceRow[];
  payments: PaymentRow[];
  actions: ActionRow[];
  integrations: IntegrationRow[];
}

const ACTIVE_STATUSES = new Set(["connected", "active"]);
const SCORE_COMPONENTS = [
  { key: "responseTime" as const, label: "Response Time", weight: 0.2 },
  { key: "sentiment" as const, label: "Sentiment", weight: 0.15 },
  { key: "satisfaction" as const, label: "Customer Satisfaction", weight: 0.2 },
  { key: "consistency" as const, label: "Consistency", weight: 0.15 },
  { key: "followUpRate" as const, label: "Follow-up Rate", weight: 0.15 },
  { key: "resolutionTime" as const, label: "Resolution Time", weight: 0.15 },
];

export async function fetchWorkspaceSnapshot(businessId: string): Promise<WorkspaceSnapshot> {
  const [communications, customers, reviews, jobs, invoices, payments, actions, integrations] = await Promise.all([
    supabase.from("communications").select("*").eq("business_id", businessId).order("created_at", { ascending: false }),
    supabase.from("customers").select("id, full_name, first_name, last_name, email, phone, preferred_contact_method").eq("business_id", businessId),
    supabase.from("reviews").select("id, customer_id, job_id, rating, feedback, created_at, submitted_at").eq("business_id", businessId),
    supabase.from("jobs").select("id, customer_id, title, status, completed_at, created_at").eq("business_id", businessId),
    supabase.from("invoices").select("id, customer_id, job_id, total_amount, status, created_at").eq("business_id", businessId),
    supabase.from("payments").select("id, customer_id, job_id, amount, payment_date, created_at").eq("business_id", businessId),
    (supabase.from as any)("communication_actions").select("id, communication_id, customer_id, status, action_taken, notes, manual_channel, resolved_at").eq("business_id", businessId),
    supabase.from("integrations").select("id, provider, status, last_synced_at, settings").eq("business_id", businessId),
  ]);

  const firstError = [communications, customers, reviews, jobs, invoices, payments, actions, integrations].find((result) => result.error)?.error;
  if (firstError) {
    console.error("[fetchWorkspaceSnapshot] error:", firstError);
    throw firstError;
  }

  return {
    communications: (communications.data || []) as CommunicationRow[],
    customers: (customers.data || []) as CustomerRow[],
    reviews: (reviews.data || []) as ReviewRow[],
    jobs: (jobs.data || []) as JobRow[],
    invoices: (invoices.data || []) as InvoiceRow[],
    payments: (payments.data || []) as PaymentRow[],
    actions: (actions.data || []) as ActionRow[],
    integrations: (integrations.data || []) as IntegrationRow[],
  };
}

export async function fetchCommunicationsMetrics(businessId: string | undefined): Promise<CommunicationsMetrics> {
  if (!businessId) return emptyMetrics();
  try {
    const snapshot = await fetchWorkspaceSnapshot(businessId);
    return buildMetrics(snapshot);
  } catch (error) {
    console.error("[fetchCommunicationsMetrics] error:", error);
    return emptyMetrics();
  }
}

function buildMetrics(snapshot: WorkspaceSnapshot): CommunicationsMetrics {
  const { communications, reviews, integrations } = snapshot;
  const inbound = communications.filter((row) => row.direction === "inbound");
  const outbound = communications.filter((row) => row.direction === "outbound");
  const activeIntegrations = integrations.filter((integration) => ACTIVE_STATUSES.has(integration.status.toLowerCase()));
  const awaiting = buildAwaitingReply(snapshot);
  const responseTimes = getResponseTimes(communications);
  const satisfaction = calculateSatisfaction(reviews);
  const score = calculateCommunicationScore(snapshot);
  const channels = calculateChannelMetrics(snapshot);

  return {
    unreadMessages: inbound.filter((row) => !row.read_at).length,
    awaitingReply: awaiting.length,
    avgResponseTimeMinutes: responseTimes.length >= 2 ? round(mean(responseTimes), 1) : null,
    satisfactionPct: satisfaction,
    aiPriorityScore: score.score,
    missedOpportunities: awaiting.filter((item) => item.waiting_hours > 24).length,
    connectedChannels: activeIntegrations.length,
    liveMonitoring: activeIntegrations.some((integration) => integration.last_synced_at && Date.now() - new Date(integration.last_synced_at).getTime() < 10 * 60 * 1000),
    totalCommunications: communications.length,
    totalInbound: inbound.length,
    totalOutbound: outbound.length,
    hasSufficientData: communications.length > 0,
    score,
    channels,
  };
}

export async function fetchAwaitingReply(businessId: string | undefined): Promise<AwaitingReplyItem[]> {
  if (!businessId) return [];
  try {
    const snapshot = await fetchWorkspaceSnapshot(businessId);
    return buildAwaitingReply(snapshot);
  } catch (error) {
    console.error("[fetchAwaitingReply] error:", error);
    return [];
  }
}

function buildAwaitingReply(snapshot: WorkspaceSnapshot): AwaitingReplyItem[] {
  const { communications, customers, actions } = snapshot;
  const customerMap = new Map(customers.map((customer) => [customer.id, customer]));
  const resolvedIds = new Set(actions.filter((action) => action.status === "resolved").map((action) => action.communication_id));
  const groups = new Map<string, CommunicationRow[]>();

  for (const communication of communications) {
    const key = `${communication.customer_id || "unassigned"}:${communication.job_id || "no-job"}:${communication.channel.toLowerCase()}`;
    const group = groups.get(key) || [];
    group.push(communication);
    groups.set(key, group);
  }

  const items: AwaitingReplyItem[] = [];
  for (const group of groups.values()) {
    const ordered = [...group].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const latestInbound = [...ordered].reverse().find((row) => row.direction === "inbound");
    if (!latestInbound || resolvedIds.has(latestInbound.id)) continue;
    const laterOutbound = ordered.some((row) => row.direction === "outbound" && new Date(row.created_at) > new Date(latestInbound.created_at));
    if (laterOutbound) continue;

    const customer = latestInbound.customer_id ? customerMap.get(latestInbound.customer_id) : undefined;
    const waitingHours = Math.max(0, (Date.now() - new Date(latestInbound.created_at).getTime()) / 3600000);
    const evidence = [`Inbound ${latestInbound.channel} message received ${formatAge(waitingHours)} ago`];
    if (!latestInbound.read_at) evidence.push("Message has not been marked as read");
    if (waitingHours > 24) evidence.push("Waiting longer than the 24-hour response window");

    items.push({
      id: latestInbound.id,
      customer_id: latestInbound.customer_id,
      job_id: latestInbound.job_id,
      channel: latestInbound.channel,
      subject: latestInbound.subject,
      body: latestInbound.body,
      created_at: latestInbound.created_at,
      waiting_hours: round(waitingHours, 1),
      customer_name: customer ? customer.full_name || `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || null : null,
      customer_email: customer?.email || null,
      customer_phone: customer?.phone || null,
      evidence,
    });
  }

  return items.sort((a, b) => b.waiting_hours - a.waiting_hours);
}

export async function fetchPriorityRecommendation(businessId: string | undefined): Promise<PriorityRecommendation> {
  if (!businessId) return { item: null, evidence: [], reason: null, hasSufficientData: false };
  try {
    const snapshot = await fetchWorkspaceSnapshot(businessId);
    const items = buildAwaitingReply(snapshot);
    const item = items[0] || null;
    if (!item) return { item: null, evidence: [], reason: snapshot.communications.length > 0 ? "No unresolved inbound conversations are awaiting reply." : null, hasSufficientData: snapshot.communications.length > 0 };
    return {
      item,
      evidence: item.evidence,
      reason: `AI analysis prioritises this conversation because it has the longest verified waiting time among unresolved inbound conversations${item.waiting_hours > 24 ? " and is beyond the 24-hour response window" : ""}.`,
      hasSufficientData: true,
    };
  } catch (error) {
    console.error("[fetchPriorityRecommendation] error:", error);
    return { item: null, evidence: [], reason: null, hasSufficientData: false };
  }
}

export async function fetchCommunicationScore(businessId: string | undefined): Promise<CommunicationScore> {
  if (!businessId) return emptyScore();
  try {
    return calculateCommunicationScore(await fetchWorkspaceSnapshot(businessId));
  } catch (error) {
    console.error("[fetchCommunicationScore] error:", error);
    return emptyScore();
  }
}

export function calculateCommunicationScore(snapshot: WorkspaceSnapshot): CommunicationScore {
  const responseTimes = getResponseTimes(snapshot.communications);
  const inbound = snapshot.communications.filter((row) => row.direction === "inbound");
  const outbound = snapshot.communications.filter((row) => row.direction === "outbound");
  const sentimentRows = snapshot.communications.filter((row) => row.sentiment);
  const satisfaction = calculateSatisfaction(snapshot.reviews);
  const resolvedActions = snapshot.actions.filter((action) => action.status === "resolved" && action.resolved_at);
  const components: ScoreComponent[] = SCORE_COMPONENTS.map(({ key, label, weight }) => {
    let score: number | null = null;
    let evidence = "Insufficient evidence";
    if (key === "responseTime" && responseTimes.length >= 2) {
      score = responseTimeScore(mean(responseTimes));
      evidence = `Calculated from ${responseTimes.length} matched inbound/outbound pairs`;
    }
    if (key === "sentiment" && sentimentRows.length >= 3) {
      score = round(mean(sentimentRows.map((row) => sentimentScore(row.sentiment))), 0);
      evidence = `Calculated from ${sentimentRows.length} communications with recorded sentiment`;
    }
    if (key === "satisfaction" && satisfaction !== null && snapshot.reviews.length >= 2) {
      score = satisfaction;
      evidence = `Calculated from ${snapshot.reviews.length} customer reviews`;
    }
    if (key === "consistency" && responseTimes.length >= 3) {
      const average = mean(responseTimes);
      const deviation = Math.sqrt(mean(responseTimes.map((value) => Math.pow(value - average, 2))));
      score = Math.max(0, Math.min(100, Math.round(100 - (deviation / Math.max(average, 1)) * 100)));
      evidence = `Calculated from response-time consistency across ${responseTimes.length} matched pairs`;
    }
    if (key === "followUpRate" && inbound.length >= 3) {
      const followed = inbound.filter((row) => outbound.some((reply) => reply.customer_id === row.customer_id && new Date(reply.created_at) > new Date(row.created_at))).length;
      score = Math.round((followed / inbound.length) * 100);
      evidence = `Calculated from ${inbound.length} inbound communications`;
    }
    if (key === "resolutionTime" && resolvedActions.length >= 2) {
      const durations = resolvedActions.map((action) => {
        const communication = snapshot.communications.find((row) => row.id === action.communication_id);
        return communication ? (new Date(action.resolved_at as string).getTime() - new Date(communication.created_at).getTime()) / 3600000 : null;
      }).filter((value): value is number => value !== null && value >= 0);
      if (durations.length >= 2) {
        score = resolutionTimeScore(mean(durations));
        evidence = `Calculated from ${durations.length} resolved conversations`;
      }
    }
    return { key, label, score, weight, evidence };
  });

  const available = components.filter((component) => component.score !== null);
  const score = snapshot.communications.length >= 5 && available.length >= 4
    ? Math.round(available.reduce((total, component) => total + (component.score as number) * component.weight, 0) / available.reduce((total, component) => total + component.weight, 0))
    : null;

  return {
    score,
    components,
    minimumEvidence: "At least 5 communications and 4 of 6 measurable components are required.",
    hasSufficientData: score !== null,
  };
}

export async function fetchCommunicationsAnalytics(
  businessId: string | undefined,
  periodStart: string,
  periodEnd: string
): Promise<CommunicationsAnalytics> {
  const start = new Date(periodStart);
  const end = new Date(periodEnd);
  const duration = end.getTime() - start.getTime();
  const comparisonStart = new Date(start.getTime() - duration).toISOString();
  const comparisonEnd = start.toISOString();
  const empty: CommunicationsAnalytics = { periodStart, periodEnd, comparisonStart, comparisonEnd, metrics: [] };
  if (!businessId) return empty;

  try {
    const snapshot = await fetchWorkspaceSnapshot(businessId);
    const current = snapshot.communications.filter((row) => inPeriod(row.created_at, periodStart, periodEnd));
    const currentSnapshot = { ...snapshot, communications: current };
    const responseTimes = getResponseTimes(current);
    const closed = snapshot.actions.filter((action) => action.status === "resolved" && action.resolved_at && inPeriod(action.resolved_at, periodStart, periodEnd));
    const inbound = current.filter((row) => row.direction === "inbound");
    const outbound = current.filter((row) => row.direction === "outbound");
    const paidJobIds = new Set(snapshot.payments.filter((payment) => inPeriod(payment.payment_date || payment.created_at, periodStart, periodEnd)).map((payment) => payment.job_id).filter(Boolean));
    const revenue = snapshot.payments.filter((payment) => paidJobIds.has(payment.job_id) && current.some((communication) => communication.job_id && communication.job_id === payment.job_id)).reduce((total, payment) => total + Number(payment.amount || 0), 0);
    const reviewsGenerated = snapshot.reviews.filter((review) => review.submitted_at && inPeriod(review.submitted_at, periodStart, periodEnd) && current.some((communication) => communication.customer_id && communication.customer_id === review.customer_id)).length;
    const satisfaction = calculateSatisfaction(snapshot.reviews.filter((review) => inPeriod(review.created_at, periodStart, periodEnd)));

    return {
      ...empty,
      metrics: [
        metric("averageResponseTime", "Average Response Time", responseTimes.length >= 2 ? round(mean(responseTimes), 1) : null, "minutes", "Matched inbound/outbound communication timestamps", responseTimes.length >= 2 ? "calculated" : "insufficient"),
        metric("resolutionTime", "Resolution Time", closed.length >= 2 ? round(mean(closed.map((action) => resolutionHours(action, current))), 1) : null, "hours", "Resolved communication actions", closed.length >= 2 ? "calculated" : "insufficient"),
        metric("conversationsClosed", "Conversations Closed", closed.length || null, "", "communication_actions resolved in period", closed.length ? "verified" : "insufficient"),
        metric("revenueGenerated", "Revenue via Conversations", revenue > 0 ? round(revenue, 2) : null, "currency", "Paid payments linked to a communicated job", revenue > 0 ? "verified" : "insufficient"),
        metric("bookingsFromCommunications", "Bookings from Communications", null, "", "No booking source is present in the current schema", "insufficient"),
        metric("reviewsGenerated", "Reviews Generated", reviewsGenerated || null, "", "Reviews submitted by customers with a communication in the period", reviewsGenerated ? "calculated" : "insufficient"),
        metric("missedOpportunities", "Missed Opportunities", buildAwaitingReply(snapshot).filter((item) => item.waiting_hours > 24).length || null, "", "Unresolved inbound messages beyond 24 hours", current.length ? "calculated" : "insufficient"),
        metric("customerSatisfaction", "Customer Satisfaction", satisfaction, "%", "Customer review ratings", satisfaction !== null ? "verified" : "insufficient"),
        metric("inbound", "Inbound Communications", inbound.length || null, "", "communications.direction = inbound", inbound.length ? "verified" : "insufficient"),
        metric("outbound", "Outbound Communications", outbound.length || null, "", "communications.direction = outbound", outbound.length ? "verified" : "insufficient"),
      ],
    };
  } catch (error) {
    console.error("[fetchCommunicationsAnalytics] error:", error);
    return empty;
  }
}

export async function fetchCustomerTimeline(businessId: string, customerId: string): Promise<TimelineEvent[]> {
  try {
    const snapshot = await fetchWorkspaceSnapshot(businessId);
    const events: TimelineEvent[] = [];
    for (const communication of snapshot.communications.filter((row) => row.customer_id === customerId)) {
      events.push({ id: `communication-${communication.id}`, type: "communication", title: `${communication.direction === "inbound" ? "Received" : "Sent"} ${communication.channel}`, description: communication.subject || communication.body.slice(0, 120), occurredAt: communication.created_at, customerId, relatedId: communication.id });
    }
    for (const job of snapshot.jobs.filter((row) => row.customer_id === customerId)) {
      events.push({ id: `job-${job.id}`, type: "job", title: job.status === "completed" ? "Job completed" : "Job activity", description: job.title, occurredAt: job.completed_at || job.created_at, customerId, relatedId: job.id });
    }
    for (const review of snapshot.reviews.filter((row) => row.customer_id === customerId)) {
      events.push({ id: `review-${review.id}`, type: "review", title: review.rating ? `Customer review: ${review.rating}/5` : "Customer review", description: review.feedback || "Review recorded", occurredAt: review.submitted_at || review.created_at, customerId, relatedId: review.id });
    }
    return events.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  } catch (error) {
    console.error("[fetchCustomerTimeline] error:", error);
    return [];
  }
}

export async function fetchCommunicationDNA(businessId: string, customerId: string): Promise<CommunicationDNA> {
  try {
    const snapshot = await fetchWorkspaceSnapshot(businessId);
    const customer = snapshot.customers.find((row) => row.id === customerId);
    const rows = snapshot.communications.filter((row) => row.customer_id === customerId);
    if (!customer && rows.length === 0) return emptyDNA();
    const channelCounts = countBy(rows, (row) => row.channel.toLowerCase());
    const preferredChannel = customer?.preferred_contact_method || (rows.length >= 3 ? maxKey(channelCounts) : null);
    const responseTimes = getResponseTimes(rows);
    const sentimentRows = rows.filter((row) => row.sentiment);
    const positive = sentimentRows.filter((row) => sentimentScore(row.sentiment) >= 70).length;
    const negative = sentimentRows.filter((row) => sentimentScore(row.sentiment) <= 35).length;
    return {
      preferredChannel: preferredChannel ? { value: preferredChannel, status: customer?.preferred_contact_method ? "verified" : "calculated" } : null,
      preferredTone: null,
      typicalResponseTimeMinutes: responseTimes.length >= 2 ? round(mean(responseTimes), 1) : null,
      preferredContactHour: rows.length >= 3 ? mostCommon(rows.map((row) => new Date(row.created_at).getHours())) : null,
      sentimentTrend: sentimentRows.length >= 3 ? positive > negative ? "Mostly positive" : negative > positive ? "Mostly negative" : "Mixed" : null,
      evidenceCount: rows.length,
      hasSufficientData: rows.length >= 3,
    };
  } catch (error) {
    console.error("[fetchCommunicationDNA] error:", error);
    return emptyDNA();
  }
}

export async function fetchChannelMetrics(businessId: string | undefined): Promise<ChannelMetric[]> {
  if (!businessId) return [];
  try {
    return calculateChannelMetrics(await fetchWorkspaceSnapshot(businessId));
  } catch (error) {
    console.error("[fetchChannelMetrics] error:", error);
    return [];
  }
}

function calculateChannelMetrics(snapshot: WorkspaceSnapshot): ChannelMetric[] {
  const activeProviders = new Set(snapshot.integrations.filter((integration) => ACTIVE_STATUSES.has(integration.status.toLowerCase())).map((integration) => normaliseChannel(integration.provider)));
  const channels = new Set(snapshot.communications.map((row) => normaliseChannel(row.channel)));
  return [...new Set([...activeProviders, ...channels])].sort().map((channel) => {
    const connected = activeProviders.has(channel);
    const rows = snapshot.communications.filter((row) => normaliseChannel(row.channel) === channel);
    const responseTimes = getResponseTimes(rows);
    return { channel, connected, communicationCount: rows.length, inboundCount: rows.filter((row) => row.direction === "inbound").length, outboundCount: rows.filter((row) => row.direction === "outbound").length, responseTimeMinutes: responseTimes.length >= 2 ? round(mean(responseTimes), 1) : null, status: connected && rows.length ? "verified" : connected ? "insufficient" : "not_connected" };
  });
}

export async function resolveCommunication(payload: ResolveCommunicationPayload): Promise<ResolveCommunicationResult> {
  try {
    const { error } = await (supabase.from as any)("communication_actions").upsert({
      business_id: payload.businessId,
      communication_id: payload.communicationId,
      customer_id: payload.customerId,
      status: "resolved",
      action_taken: payload.actionTaken.trim() || null,
      notes: payload.notes.trim() || null,
      manual_channel: payload.manualChannel,
      resolved_at: new Date().toISOString(),
      resolved_by: payload.userId,
    }, { onConflict: "communication_id" });
    if (error) throw error;
    return { success: true, message: "Conversation marked as resolved and recorded." };
  } catch (error) {
    console.error("[resolveCommunication] error:", error);
    return { success: false, message: "Could not record this conversation outcome." };
  }
}

export async function fetchConnectedIntegrations(businessId: string | undefined): Promise<IntegrationRow[]> {
  if (!businessId) return [];
  const { data, error } = await supabase.from("integrations").select("id, provider, status, last_synced_at, settings").eq("business_id", businessId);
  if (error) {
    console.error("[fetchConnectedIntegrations] error:", error);
    return [];
  }
  return (data || []) as IntegrationRow[];
}

export async function saveCommunicationRecord(payload: CommunicationInsertPayload): Promise<ComposeResult> {
  try {
    const { data, error } = await supabase.from("communications").insert({ ...payload, direction: "outbound" }).select("id").single();
    if (error) throw error;
    const integrations = await fetchConnectedIntegrations(payload.business_id);
    const channelConnected = integrations.some((integration) => ACTIVE_STATUSES.has(integration.status.toLowerCase()) && normaliseChannel(integration.provider) === normaliseChannel(payload.channel));
    return { status: "not_connected", communicationId: data.id, message: channelConnected ? "Communication recorded. External delivery is not enabled for this channel yet." : "Communication saved as a record. No sending integration is connected, so it was not sent." };
  } catch (error) {
    console.error("[saveCommunicationRecord] error:", error);
    return { status: "not_connected", communicationId: null, message: "Could not save the communication record." };
  }
}

function emptyMetrics(): CommunicationsMetrics {
  return { unreadMessages: 0, awaitingReply: 0, avgResponseTimeMinutes: null, satisfactionPct: null, aiPriorityScore: null, missedOpportunities: 0, connectedChannels: 0, liveMonitoring: false, totalCommunications: 0, totalInbound: 0, totalOutbound: 0, hasSufficientData: false, score: emptyScore(), channels: [] };
}

function emptyScore(): CommunicationScore {
  return { score: null, components: SCORE_COMPONENTS.map(({ key, label, weight }) => ({ key, label, weight, score: null, evidence: "Insufficient evidence" })), minimumEvidence: "At least 5 communications and 4 of 6 measurable components are required.", hasSufficientData: false };
}

function emptyDNA(): CommunicationDNA {
  return { preferredChannel: null, preferredTone: null, typicalResponseTimeMinutes: null, preferredContactHour: null, sentimentTrend: null, evidenceCount: 0, hasSufficientData: false };
}

function getResponseTimes(rows: CommunicationRow[]): number[] {
  const groups = new Map<string, CommunicationRow[]>();
  for (const row of rows) {
    const key = `${row.customer_id || "unassigned"}:${row.job_id || "no-job"}:${row.channel.toLowerCase()}`;
    groups.set(key, [...(groups.get(key) || []), row]);
  }
  const deltas: number[] = [];
  for (const group of groups.values()) {
    const ordered = [...group].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    for (let index = 0; index < ordered.length; index += 1) {
      const inbound = ordered[index];
      if (inbound.direction !== "inbound") continue;
      const reply = ordered.slice(index + 1).find((row) => row.direction === "outbound");
      if (reply) deltas.push((new Date(reply.created_at).getTime() - new Date(inbound.created_at).getTime()) / 60000);
    }
  }
  return deltas.filter((value) => Number.isFinite(value) && value >= 0);
}

function calculateSatisfaction(reviews: ReviewRow[]): number | null {
  const ratings = reviews.map((review) => review.rating).filter((rating): rating is number => typeof rating === "number" && rating >= 1 && rating <= 5);
  return ratings.length ? Math.round((mean(ratings) / 5) * 100) : null;
}

function responseTimeScore(minutes: number): number { return Math.max(0, Math.min(100, Math.round(100 - (minutes / 1440) * 100))); }
function resolutionTimeScore(hours: number): number { return Math.max(0, Math.min(100, Math.round(100 - (hours / 168) * 100))); }
function sentimentScore(value: string | null): number { const normalized = (value || "").toLowerCase(); return normalized.includes("positive") || normalized.includes("happy") ? 100 : normalized.includes("negative") || normalized.includes("frustrat") || normalized.includes("angry") ? 25 : 60; }
function normaliseChannel(value: string): string { const normalized = value.toLowerCase().replace(/[_-]/g, " "); if (normalized.includes("gmail") || normalized.includes("outlook") || normalized.includes("email")) return "email"; if (normalized.includes("whatsapp")) return "whatsapp"; if (normalized.includes("sms") || normalized.includes("twilio")) return "sms"; if (normalized.includes("phone") || normalized.includes("call")) return "phone"; if (normalized.includes("web")) return "web chat"; if (normalized.includes("instagram")) return "instagram"; return normalized; }
function mean(values: number[]): number { return values.reduce((total, value) => total + value, 0) / values.length; }
function round(value: number, decimals: number): number { const factor = 10 ** decimals; return Math.round(value * factor) / factor; }
function formatAge(hours: number): string { return hours >= 24 ? `${Math.floor(hours / 24)} days` : `${Math.max(1, Math.floor(hours))} hours`; }
function inPeriod(value: string, start: string, end: string): boolean { const timestamp = new Date(value).getTime(); return timestamp >= new Date(start).getTime() && timestamp < new Date(end).getTime(); }
function metric(key: string, label: string, value: number | null, unit: string, source: string, status: AnalyticsMetric["status"]): AnalyticsMetric { return { key, label, value, unit, source, status }; }
function resolutionHours(action: ActionRow, rows: CommunicationRow[]): number { const communication = rows.find((row) => row.id === action.communication_id); return communication && action.resolved_at ? Math.max(0, (new Date(action.resolved_at).getTime() - new Date(communication.created_at).getTime()) / 3600000) : 0; }
function countBy<T>(values: T[], getKey: (value: T) => string): Record<string, number> { return values.reduce<Record<string, number>>((counts, value) => { const key = getKey(value); counts[key] = (counts[key] || 0) + 1; return counts; }, {}); }
function maxKey(values: Record<string, number>): string | null { const entries = Object.entries(values).sort((a, b) => b[1] - a[1]); return entries[0]?.[0] || null; }
function mostCommon(values: number[]): number | null { return maxKey(countBy(values, String)) ? Number(maxKey(countBy(values, String))) : null; }
