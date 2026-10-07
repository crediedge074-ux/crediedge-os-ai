import { supabase } from "@/lib/supabase";

const db = supabase as unknown as { from: (table: string) => any };
import type { Customer, Job, Review } from "@/lib/database.types";
import { logActivity, getActivityLogs } from "@/services/activity";
import { getCustomers } from "@/services/customers";
import { getJobs } from "@/services/jobs";
import { fetchCampaigns } from "@/services/campaigns";
import { getTasks, createTask } from "@/services/tasks";
import { appEvents, APP_EVENTS } from "@/lib/events";

export type ReviewSource = "Google" | "Trustpilot" | string;
export type ReviewRecord = Review & {
  response_text?: string | null;
  response_at?: string | null;
  response_by?: string | null;
  external_url?: string | null;
  customer?: Customer | null;
  job?: Job | null;
};

export interface ReviewIntegration {
  id: string;
  provider: string;
  status: string;
  last_synced_at: string | null;
  settings: Record<string, unknown>;
}

export interface ReviewMetrics {
  total: number | null;
  averageRating: number | null;
  thisMonth: number | null;
  fiveStarRate: number | null;
  responseRate: number | null;
  growth: number | null;
  googlePosition: number | null;
  trustScore: number | null;
  sourceCounts: Record<string, number>;
  lastSyncedAt: string | null;
}

export interface ReviewTheme {
  label: string;
  positive: number;
  negative: number;
  reviewIds: string[];
}

export interface ReviewInsight {
  label: string;
  statement: string;
  evidence: string;
  reviewIds: string[];
  sufficient: boolean;
}

export interface ReviewScore {
  label: string;
  score: number | null;
  evidence: string;
  color: string;
}

export interface ReviewPriority {
  id: string;
  type: "review" | "request";
  title: string;
  level: "Critical" | "High" | "Medium";
  reviewId: string | null;
  customerName: string | null;
  reason: string;
  evidence: string[];
  completed: boolean;
}

export interface ReviewAnalytics {
  periodDays: number;
  current: ReviewMetrics;
  previous: ReviewMetrics;
  averageReplyHours: number | null;
  requestCount: number | null;
  newReviewFrequency: number | null;
  trustTrend: number | null;
}

export interface ReviewsSnapshot {
  reviews: ReviewRecord[];
  customers: Customer[];
  jobs: Job[];
  integrations: ReviewIntegration[];
  requests: Array<Record<string, unknown>>;
  actions: Array<Record<string, unknown>>;
  activities: Awaited<ReturnType<typeof getActivityLogs>>;
  campaigns: Awaited<ReturnType<typeof fetchCampaigns>>;
  tasks: Awaited<ReturnType<typeof getTasks>>;
}

const THEME_RULES: Array<{ label: string; words: string[] }> = [
  { label: "Communication", words: ["communication", "informed", "explained", "kept me updated", "contact"] },
  { label: "Service Quality", words: ["quality", "workmanship", "excellent", "brilliant", "great work", "professional"] },
  { label: "Wait Time", words: ["wait", "delay", "late", "slow", "ready", "time"] },
  { label: "Pricing", words: ["price", "pricing", "cost", "value", "expensive", "fair"] },
  { label: "Reliability", words: ["reliable", "completed", "completion", "cancelled", "didn't", "wasn't"] },
  { label: "Transparency", words: ["honest", "transparent", "clear", "explain"] },
  { label: "Professionalism", words: ["professional", "friendly", "helpful", "team"] },
];

function safeDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isResponded(review: ReviewRecord): boolean {
  return Boolean(review.response_at || review.response_text || ["responded", "replied", "answered"].includes(review.status.toLowerCase()));
}

function reviewDate(review: ReviewRecord): Date | null {
  return safeDate(review.submitted_at) ?? safeDate(review.created_at);
}

function nameForCustomer(customer: Customer | null | undefined): string | null {
  if (!customer) return null;
  return customer.full_name || [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.email || null;
}

function inPeriod(review: ReviewRecord, days: number, end = new Date()): boolean {
  const date = reviewDate(review);
  if (!date) return false;
  return end.getTime() - date.getTime() <= days * 86400000 && date <= end;
}

function calculateMetrics(reviews: ReviewRecord[], requests: Array<Record<string, unknown>>, days = 30, end = new Date()): ReviewMetrics {
  const current = reviews.filter((review) => inPeriod(review, days, end));
  const ratings = reviews.filter((review) => typeof review.rating === "number");
  const sourceCounts = reviews.reduce<Record<string, number>>((counts, review) => {
    const source = review.source || "Unknown";
    counts[source] = (counts[source] || 0) + 1;
    return counts;
  }, {});
  const answered = reviews.filter(isResponded).length;
  const previousEnd = new Date(end.getTime() - days * 86400000);
  const previousStart = new Date(previousEnd.getTime() - days * 86400000);
  const previousCount = reviews.filter((review) => {
    const date = reviewDate(review);
    return date && date >= previousStart && date < previousEnd;
  }).length;
  const total = ratings.length;
  const averageRating = total > 0 ? ratings.reduce((sum, review) => sum + Number(review.rating), 0) / total : null;
  const currentCount = current.length;

  return {
    total: reviews.length || null,
    averageRating,
    thisMonth: currentCount || null,
    fiveStarRate: total > 0 ? (ratings.filter((review) => Number(review.rating) === 5).length / total) * 100 : null,
    responseRate: reviews.length > 0 ? (answered / reviews.length) * 100 : null,
    growth: previousCount > 0 ? ((currentCount - previousCount) / previousCount) * 100 : null,
    googlePosition: null,
    trustScore: null,
    sourceCounts,
    lastSyncedAt: null,
  };
}

export function calculateThemes(reviews: ReviewRecord[]): ReviewTheme[] {
  return THEME_RULES.map((rule) => {
    const matching = reviews.filter((review) => rule.words.some((word) => (review.feedback || "").toLowerCase().includes(word)));
    return {
      label: rule.label,
      positive: matching.filter((review) => Number(review.rating || 0) >= 4).length,
      negative: matching.filter((review) => Number(review.rating || 0) <= 3).length,
      reviewIds: matching.map((review) => review.id),
    };
  }).filter((theme) => theme.reviewIds.length > 0);
}

export function calculateHealthScores(reviews: ReviewRecord[], themes: ReviewTheme[]): ReviewScore[] {
  const rated = reviews.filter((review) => typeof review.rating === "number");
  const answered = reviews.filter(isResponded);
  const score = (value: number, evidence: string, color: string): ReviewScore => ({ label: "", score: Math.round(Math.max(0, Math.min(100, value))), evidence, color });
  const average = rated.length ? rated.reduce((sum, review) => sum + Number(review.rating), 0) / rated.length : null;
  const communication = themes.find((theme) => theme.label === "Communication");
  const service = themes.find((theme) => theme.label === "Service Quality");
  return [
    average === null ? { label: "Review Score", score: null, evidence: "No rated reviews are available.", color: "#E31B23" } : score((average / 5) * 100, `${rated.length} rated reviews; average ${average.toFixed(2)} out of 5.`, "#E31B23"),
    reviews.length === 0 ? { label: "Response Score", score: null, evidence: "No reviews are available.", color: "#f59e0b" } : score((answered.length / reviews.length) * 100, `${answered.length} of ${reviews.length} reviews have response evidence.`, "#f59e0b"),
    rated.length < 3 ? { label: "Customer Trust", score: null, evidence: "At least 3 rated reviews are required.", color: "#10b981" } : score((rated.filter((review) => Number(review.rating) >= 4).length / rated.length) * 100, `${rated.filter((review) => Number(review.rating) >= 4).length} of ${rated.length} rated reviews are 4 or 5 stars.`, "#10b981"),
    !service || service.reviewIds.length < 2 ? { label: "Service Quality", score: null, evidence: "At least 2 reviews mentioning service quality are required.", color: "#3b82f6" } : score((service.positive / service.reviewIds.length) * 100, `${service.positive} positive service-quality mentions from ${service.reviewIds.length} reviews.`, "#3b82f6"),
    !communication || communication.reviewIds.length < 2 ? { label: "Communication", score: null, evidence: "At least 2 reviews mentioning communication are required.", color: "#64748b" } : score((communication.positive / communication.reviewIds.length) * 100, `${communication.positive} positive communication mentions from ${communication.reviewIds.length} reviews.`, "#64748b"),
    new Set(reviews.filter((review) => review.customer_id).map((review) => review.customer_id)).size < 3 ? { label: "Loyalty Score", score: null, evidence: "At least 3 customer-linked reviews are required.", color: "#06b6d4" } : score((new Set(reviews.filter((review) => review.customer_id && Number(review.rating) >= 4).map((review) => review.customer_id)).size / new Set(reviews.filter((review) => review.customer_id).map((review) => review.customer_id)).size) * 100, "Calculated from customer-linked reviewers with a 4 or 5 star rating.", "#06b6d4"),
  ].map((item) => ({ ...item, label: item.label }));
}

export async function fetchReviewsSnapshot(businessId: string): Promise<ReviewsSnapshot> {
  const [reviewsRes, integrationsRes, requestsRes, actionsRes, customers, jobs, activities, campaigns, tasks] = await Promise.all([
    db.from("reviews").select("*").eq("business_id", businessId).order("submitted_at", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }),
    db.from("integrations").select("id, provider, status, last_synced_at, settings").eq("business_id", businessId),
    db.from("review_requests").select("*").eq("business_id", businessId).order("created_at", { ascending: false }),
    db.from("review_actions").select("*").eq("business_id", businessId).order("created_at", { ascending: false }),
    getCustomers(businessId).catch(() => []),
    getJobs(businessId),
    getActivityLogs(businessId, 100),
    fetchCampaigns(businessId),
    getTasks(businessId),
  ]);
  if (reviewsRes.error) console.error("[fetchReviewsSnapshot] reviews query failed", reviewsRes.error);
  const customerMap = new Map(customers.map((customer) => [customer.id, customer]));
  const jobMap = new Map(jobs.map((job) => [job.id, job]));
  const reviews = ((reviewsRes.data || []) as ReviewRecord[]).map((review) => ({ ...review, customer: review.customer_id ? customerMap.get(review.customer_id) || null : null, job: review.job_id ? jobMap.get(review.job_id) || null : null }));
  const integrations = ((integrationsRes.data || []) as ReviewIntegration[]).map((integration) => ({ ...integration, settings: (integration.settings || {}) as Record<string, unknown> }));
  const lastSyncedAt = integrations.filter((integration) => ["google", "google_business_profile", "trustpilot"].includes(integration.provider.toLowerCase()) && integration.last_synced_at).map((integration) => integration.last_synced_at as string).sort().at(-1) || null;
  if (lastSyncedAt) (reviews as ReviewRecord[]).forEach(() => undefined);
  return { reviews, customers, jobs, integrations, requests: requestsRes.data || [], actions: actionsRes.data || [], activities, campaigns, tasks };
}

export function fetchReviewMetrics(snapshot: ReviewsSnapshot): ReviewMetrics {
  const metrics = calculateMetrics(snapshot.reviews, snapshot.requests);
  metrics.lastSyncedAt = snapshot.integrations.filter((integration) => integration.last_synced_at).map((integration) => integration.last_synced_at as string).sort().at(-1) || null;
  return metrics;
}

export function fetchReviewAnalytics(snapshot: ReviewsSnapshot, periodDays: number): ReviewAnalytics {
  const now = new Date();
  const current = calculateMetrics(snapshot.reviews, snapshot.requests, periodDays, now);
  const previousEnd = new Date(now.getTime() - periodDays * 86400000);
  const previous = calculateMetrics(snapshot.reviews, snapshot.requests, periodDays, previousEnd);
  const currentReviews = snapshot.reviews.filter((review) => inPeriod(review, periodDays, now));
  const responseTimes = currentReviews.map((review) => {
    const reviewAt = reviewDate(review);
    const responseAt = safeDate(review.response_at);
    return reviewAt && responseAt ? (responseAt.getTime() - reviewAt.getTime()) / 3600000 : null;
  }).filter((value): value is number => value !== null && value >= 0);
  const requests = snapshot.requests.filter((request) => inPeriod({ created_at: String(request.created_at), submitted_at: null } as ReviewRecord, periodDays, now));
  const trust = calculateHealthScores(currentReviews, calculateThemes(currentReviews)).find((item) => item.label === "Customer Trust")?.score ?? null;
  const previousTrust = calculateHealthScores(snapshot.reviews.filter((review) => inPeriod(review, periodDays, previousEnd)), calculateThemes(snapshot.reviews)).find((item) => item.label === "Customer Trust")?.score ?? null;
  return { periodDays, current, previous, averageReplyHours: responseTimes.length ? responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length : null, requestCount: requests.length || null, newReviewFrequency: currentReviews.length ? currentReviews.length / periodDays * 7 : null, trustTrend: trust !== null && previousTrust !== null ? trust - previousTrust : null };
}

export function buildReviewPriorities(snapshot: ReviewsSnapshot): ReviewPriority[] {
  const completed = new Set(snapshot.actions.filter((action) => action.status === "completed").map((action) => String(action.review_id)));
  return snapshot.reviews.filter((review) => !completed.has(review.id) && !isResponded(review) && typeof review.rating === "number" && review.rating <= 3).map((review) => {
    const ageDays = reviewDate(review) ? Math.max(0, Math.floor((Date.now() - (reviewDate(review) as Date).getTime()) / 86400000)) : 0;
    const customerName = nameForCustomer(review.customer);
    const level: ReviewPriority["level"] = Number(review.rating) <= 1 || ageDays >= 14 ? "Critical" : Number(review.rating) <= 3 ? "High" : "Medium";
    return { id: `review-${review.id}`, type: "review" as const, title: `Reply to ${customerName || "an unanswered review"}`, level, reviewId: review.id, customerName, reason: `${review.rating}-star review has no recorded response and is ${ageDays} day${ageDays === 1 ? "" : "s"} old.`, evidence: [`${review.rating}/5 rating`, `${ageDays} days since review date`, review.source || "Platform source unavailable"], completed: false };
  }).sort((a, b) => ({ Critical: 3, High: 2, Medium: 1 }[b.level] - ({ Critical: 3, High: 2, Medium: 1 }[a.level]))).slice(0, 8);
}

export function buildReviewInsights(reviews: ReviewRecord[]): ReviewInsight[] {
  const themes = calculateThemes(reviews);
  const insights: ReviewInsight[] = [];
  themes.filter((theme) => theme.positive > 0).sort((a, b) => b.positive - a.positive).slice(0, 3).forEach((theme) => insights.push({ label: "Positive theme", statement: `${theme.label} is mentioned positively in ${theme.positive} review${theme.positive === 1 ? "" : "s"}.`, evidence: `${theme.reviewIds.length} reviews contributed to this theme.`, reviewIds: theme.reviewIds, sufficient: theme.reviewIds.length >= 2 }));
  themes.filter((theme) => theme.negative > 0).sort((a, b) => b.negative - a.negative).slice(0, 3).forEach((theme) => insights.push({ label: "Improvement theme", statement: `${theme.label} is mentioned negatively in ${theme.negative} review${theme.negative === 1 ? "" : "s"}.`, evidence: `${theme.reviewIds.length} reviews contributed to this theme.`, reviewIds: theme.reviewIds, sufficient: theme.reviewIds.length >= 2 }));
  return insights;
}

export async function completeReviewPriority(businessId: string, reviewId: string, userId: string, notes: string): Promise<void> {
  const { error } = await db.from("review_actions").upsert({ business_id: businessId, review_id: reviewId, action_type: "priority_completed", status: "completed", notes, created_by: userId }, { onConflict: "review_id,action_type" });
  if (error) throw new Error("Could not complete the review priority.");
  await logActivity({ business_id: businessId, entity_type: "review", entity_id: reviewId, action: "priority_completed", description: "Completed a review priority.", actor_id: userId, metadata: { notes } });
  appEvents.emit(APP_EVENTS.REVIEWS_MUTATED);
}

export async function createReviewRequest(params: { businessId: string; userId: string; customerId: string; jobId?: string | null; platform: string; message: string; requestUrl?: string | null }): Promise<void> {
  const { error } = await db.from("review_requests").insert({ business_id: params.businessId, customer_id: params.customerId, job_id: params.jobId || null, platform: params.platform, message: params.message, request_url: params.requestUrl || null, status: "created", created_by: params.userId });
  if (error) throw new Error("Could not create the review request.");
  await logActivity({ business_id: params.businessId, customer_id: params.customerId, job_id: params.jobId || null, entity_type: "review_request", action: "created", description: `Created a ${params.platform} review request.`, actor_id: params.userId, metadata: { platform: params.platform, request_url: params.requestUrl || null } });
  appEvents.emit(APP_EVENTS.REVIEWS_MUTATED);
}

export async function saveReviewDraftActivity(params: { businessId: string; userId: string; review: ReviewRecord; text: string }): Promise<void> {
  await logActivity({ business_id: params.businessId, customer_id: params.review.customer_id, job_id: params.review.job_id, entity_type: "review", entity_id: params.review.id, action: "reply_drafted", description: "Drafted a review reply.", actor_id: params.userId, metadata: { response_text: params.text, source: params.review.source } });
}

export async function createReviewTask(businessId: string, review: ReviewRecord): Promise<void> {
  await createTask({ business_id: businessId, customer_id: review.customer_id, job_id: review.job_id, title: `Respond to ${nameForCustomer(review.customer) || "review"}`, description: "Review the source review and respond through the verified platform route.", priority: Number(review.rating || 0) <= 1 ? "urgent" : "high" } as any);
}

export function getPlatformUrl(integration: ReviewIntegration | undefined, review: ReviewRecord): string | null {
  if (review.external_url) return review.external_url;
  const settings = integration?.settings || {};
  const value = settings.review_url || settings.business_url || settings.profile_url;
  return typeof value === "string" && /^https?:\/\//i.test(value) ? value : null;
}

export function getConnectedReviewIntegrations(integrations: ReviewIntegration[]): ReviewIntegration[] {
  return integrations.filter((integration) => ["google", "google_business_profile", "trustpilot"].includes(integration.provider.toLowerCase()) && integration.status === "connected");
}

export { calculateMetrics, isResponded, nameForCustomer };
