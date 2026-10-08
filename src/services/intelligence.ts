import { supabase } from "@/lib/supabase";
import type { BusinessMetric, Customer, Invoice, Job, Payment, Task } from "@/lib/database.types";
import { fetchCrediEdgeScore, type CrediEdgeScoreData } from "@/services/score";
import { fetchRevenueChartData, type RevenueChartData } from "@/services/revenueChart";
import { fetchCommunicationsMetrics, type CommunicationsMetrics } from "@/services/communications";
import { fetchPortfolioAnalytics, type PortfolioKPIs } from "@/services/relationshipAnalytics";
import { fetchCampaigns, type CampaignOverview } from "@/services/campaigns";
import { fetchReviewsSnapshot, fetchReviewMetrics, buildReviewInsights, type ReviewMetrics, type ReviewsSnapshot } from "@/services/reviews";
import { getAIAllowance, authorizeAndLogAIRequest, type AIAllowanceStatus } from "@/services/aiUsage";

const db = supabase as unknown as { from: (table: string) => any };

type EvidenceStatus = "verified" | "calculated" | "insufficient";

export interface IntelligenceDiscovery {
  id: string;
  title: string;
  interpretation: string;
  evidence: string[];
  source: string;
  status: EvidenceStatus;
  action?: { label: string; route: string };
}

export interface IntelligenceRisk {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  explanation: string;
  evidence: string[];
  source: string;
  action?: { label: string; route: string };
}

export interface IntelligenceOpportunity {
  id: string;
  title: string;
  explanation: string;
  evidence: string[];
  source: string;
  value: number | null;
  valueLabel: string;
  action?: { label: string; route: string };
}

export interface IntelligenceTimelineEvent {
  id: string;
  date: string;
  title: string;
  detail: string;
  area: string;
  tone: "positive" | "negative" | "neutral";
  source: string;
}

export interface IntelligenceModule {
  id: string;
  name: string;
  score: number | null;
  trend: number | null;
  evidence: string;
  route: string;
  color: string;
}

export interface IntelligenceMemory {
  id: string;
  statement: string;
  evidence: string;
  source: string;
}

export interface IntelligenceImpact {
  label: string;
  value: string;
  evidence: string;
  available: boolean;
}

export interface IntelligenceSnapshot {
  businessId: string;
  analyzedAt: string;
  businessName: string;
  score: CrediEdgeScoreData;
  revenue: RevenueChartData;
  communications: CommunicationsMetrics;
  relationships: PortfolioKPIs;
  reviews: ReviewsSnapshot;
  reviewMetrics: ReviewMetrics;
  campaigns: CampaignOverview;
  customers: Customer[];
  jobs: Job[];
  tasks: Task[];
  invoices: Invoice[];
  payments: Payment[];
  businessMetrics: BusinessMetric[];
  discoveries: IntelligenceDiscovery[];
  risks: IntelligenceRisk[];
  opportunities: IntelligenceOpportunity[];
  timeline: IntelligenceTimelineEvent[];
  modules: IntelligenceModule[];
  memories: IntelligenceMemory[];
  impact: IntelligenceImpact[];
  allowance: AIAllowanceStatus;
}

export interface IntelligenceAnswer {
  content: string;
  evidence: string[];
  source: string;
  status: "answered" | "insufficient" | "redirected" | "unavailable";
}

function dateValue(value: string | null | undefined): number {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function money(value: number): string {
  return `£${Math.round(value).toLocaleString("en-GB")}`;
}

function dateLabel(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function daysAgo(value: string | null | undefined): number {
  const timestamp = dateValue(value);
  return timestamp ? Math.max(0, Math.floor((Date.now() - timestamp) / 86400000)) : 0;
}

function scoreLabel(score: number | null): string {
  return score === null ? "INSUFFICIENT DATA" : `${score}/100`;
}

function buildDiscoveries(params: {
  reviews: ReviewsSnapshot;
  reviewMetrics: ReviewMetrics;
  communications: CommunicationsMetrics;
  invoices: Invoice[];
  customers: Customer[];
  jobs: Job[];
}): IntelligenceDiscovery[] {
  const discoveries: IntelligenceDiscovery[] = [];
  const negativeReviews = params.reviews.reviews.filter((review) => Number(review.rating || 0) <= 3 && !review.response_text && !review.response_at);
  if (negativeReviews.length > 0) {
    discoveries.push({
      id: "unanswered-reviews",
      title: `${negativeReviews.length} low-rated review${negativeReviews.length === 1 ? " needs" : "s need"} a response`,
      interpretation: "This is a verified reputation workflow priority. The records show low ratings without response evidence; the data does not prove a future revenue impact.",
      evidence: [`${negativeReviews.length} review records rated 3 or below`, `${params.reviewMetrics.responseRate === null ? "Response rate unavailable" : `${Math.round(params.reviewMetrics.responseRate)}% of reviews have response evidence`}`],
      source: "Reviews",
      status: "calculated",
      action: { label: "Open Reviews", route: "/reviews" },
    });
  }

  const awaiting = params.communications.awaitingReply;
  if (awaiting > 0) {
    discoveries.push({
      id: "awaiting-replies",
      title: `${awaiting} inbound conversation${awaiting === 1 ? " is" : "s are"} awaiting reply`,
      interpretation: "These are unresolved inbound conversations identified by the communications service. Their commercial impact is not estimated because no defensible conversion value is available.",
      evidence: [`${awaiting} unresolved inbound conversation${awaiting === 1 ? "" : "s"}`, `${params.communications.missedOpportunities} beyond the 24-hour response window`],
      source: "Communications",
      status: "verified",
      action: { label: "Open Communications", route: "/communications" },
    });
  }

  const overdue = params.invoices.filter((invoice) => invoice.due_date && invoice.due_date < new Date().toISOString().slice(0, 10) && invoice.status !== "paid" && Number(invoice.total_amount) > Number(invoice.amount_paid));
  if (overdue.length > 0) {
    const balance = overdue.reduce((sum, invoice) => sum + Math.max(0, Number(invoice.total_amount) - Number(invoice.amount_paid)), 0);
    discoveries.push({
      id: "overdue-invoices",
      title: `${overdue.length} overdue invoice${overdue.length === 1 ? " is" : "s are"} affecting cash collection`,
      interpretation: "The outstanding balance is verified from invoice records. This is money owed, not money recovered or a forecast.",
      evidence: [`${overdue.length} overdue invoice${overdue.length === 1 ? "" : "s"}`, `${money(balance)} outstanding balance`, `Oldest overdue by ${Math.max(...overdue.map((invoice) => daysAgo(invoice.due_date)))} days`],
      source: "Finance",
      status: "verified",
      action: { label: "Open Finance", route: "/finance" },
    });
  }

  const inactive = params.customers.filter((customer) => customer.is_active && customer.status === "inactive");
  if (inactive.length > 0) {
    const value = inactive.reduce((sum, customer) => sum + Number(customer.lifetime_value || 0), 0);
    discoveries.push({
      id: "inactive-customers",
      title: `${inactive.length} customer profile${inactive.length === 1 ? " is" : "s are"} marked inactive`,
      interpretation: "Inactive status is a verified customer record. CrediEdgeOS does not predict reactivation or assign an expected value without outcome evidence.",
      evidence: [`${inactive.length} active customer records marked inactive`, value > 0 ? `${money(value)} recorded lifetime value across these profiles` : "Lifetime value is unavailable for these profiles"],
      source: "Relationships",
      status: "verified",
      action: { label: "Open Relationships", route: "/relationships" },
    });
  }

  const completedWithoutReview = params.jobs.filter((job) => job.status === "completed" && job.customer_id && !params.reviews.reviews.some((review) => review.job_id === job.id));
  if (completedWithoutReview.length > 0) {
    discoveries.push({
      id: "review-request-coverage",
      title: `${completedWithoutReview.length} completed job${completedWithoutReview.length === 1 ? " has" : "s have"} no linked review`,
      interpretation: "This identifies a review-request workflow opportunity from completed jobs and review links. It does not estimate response rates or revenue.",
      evidence: [`${completedWithoutReview.length} completed jobs`, "No linked review record found for these jobs"],
      source: "Jobs + Reviews",
      status: "calculated",
      action: { label: "Open Reviews", route: "/reviews" },
    });
  }

  return discoveries;
}

function buildRisks(discoveries: IntelligenceDiscovery[]): IntelligenceRisk[] {
  return discoveries.slice(0, 5).map((discovery) => ({
    id: `risk-${discovery.id}`,
    title: discovery.title,
    severity: discovery.id === "overdue-invoices" || discovery.id === "unanswered-reviews" ? "High" : "Medium",
    explanation: discovery.interpretation,
    evidence: discovery.evidence,
    source: discovery.source,
    action: discovery.action,
  }));
}

function buildOpportunities(params: { discoveries: IntelligenceDiscovery[]; reviews: ReviewsSnapshot; invoices: Invoice[]; jobs: Job[] }): IntelligenceOpportunity[] {
  const opportunities: IntelligenceOpportunity[] = [];
  const overdue = params.invoices.filter((invoice) => invoice.due_date && invoice.due_date < new Date().toISOString().slice(0, 10) && invoice.status !== "paid" && Number(invoice.total_amount) > Number(invoice.amount_paid));
  if (overdue.length > 0) {
    const amount = overdue.reduce((sum, invoice) => sum + Math.max(0, Number(invoice.total_amount) - Number(invoice.amount_paid)), 0);
    opportunities.push({ id: "collect-overdue-invoices", title: "Follow up overdue invoices", explanation: "A finance workflow can address a verified outstanding balance. Recovery is not claimed until a payment is recorded.", evidence: [`${overdue.length} overdue invoice${overdue.length === 1 ? "" : "s"}`, `${money(amount)} outstanding balance`], source: "Finance", value: amount, valueLabel: "verified balance", action: { label: "Open Finance", route: "/finance" } });
  }
  const completedWithoutReview = params.jobs.filter((job) => job.status === "completed" && job.customer_id && !params.reviews.reviews.some((review) => review.job_id === job.id));
  if (completedWithoutReview.length > 0) {
    opportunities.push({ id: "request-reviews", title: "Request reviews from completed customers", explanation: "Completed jobs without a linked review are eligible for the existing review-request workflow. No response outcome is predicted.", evidence: [`${completedWithoutReview.length} eligible completed jobs`, "No linked review record found"], source: "Jobs + Reviews", value: null, valueLabel: "No defensible financial estimate", action: { label: "Open Reviews", route: "/reviews" } });
  }
  return opportunities;
}

function buildTimeline(params: { payments: Payment[]; jobs: Job[]; reviews: ReviewsSnapshot; invoices: Invoice[]; campaigns: CampaignOverview }): IntelligenceTimelineEvent[] {
  const events: IntelligenceTimelineEvent[] = [];
  params.payments.filter((payment) => Number(payment.amount) > 0).forEach((payment) => events.push({ id: `payment-${payment.id}`, date: payment.payment_date || payment.created_at, title: `${money(Number(payment.amount))} payment recorded`, detail: "Verified payment record.", area: "Finance", tone: "positive", source: "Payments" }));
  params.jobs.filter((job) => job.status === "completed").forEach((job) => events.push({ id: `job-${job.id}`, date: job.completed_at || job.updated_at, title: "Job completed", detail: job.title, area: "Operations", tone: "positive", source: "Jobs" }));
  params.reviews.reviews.forEach((review) => events.push({ id: `review-${review.id}`, date: review.submitted_at || review.created_at, title: `${review.rating === null ? "Review" : `${review.rating}/5 review`} recorded`, detail: review.feedback || "Review text unavailable.", area: "Reviews", tone: Number(review.rating || 0) >= 4 ? "positive" : Number(review.rating || 0) <= 3 ? "negative" : "neutral", source: "Reviews" }));
  params.invoices.filter((invoice) => invoice.due_date && invoice.due_date < new Date().toISOString().slice(0, 10) && invoice.status !== "paid").forEach((invoice) => events.push({ id: `invoice-${invoice.id}`, date: invoice.due_date, title: "Invoice became overdue", detail: `${money(Math.max(0, Number(invoice.total_amount) - Number(invoice.amount_paid)))} remains outstanding.`, area: "Finance", tone: "negative", source: "Invoices" }));
  params.campaigns.completedCampaigns.forEach((campaign) => events.push({ id: `campaign-${campaign.id}`, date: campaign.completed_at || campaign.updated_at, title: "Campaign completed", detail: campaign.name, area: "Campaigns", tone: "positive", source: "Campaigns" }));
  return events.sort((a, b) => dateValue(b.date) - dateValue(a.date)).slice(0, 30);
}

function buildModules(score: CrediEdgeScoreData, reviews: ReviewMetrics, communications: CommunicationsMetrics, relationships: PortfolioKPIs, revenue: RevenueChartData): IntelligenceModule[] {
  const category = (name: string): { score: number | null; trend: number | null; evidence: string; color: string } => {
    const item = score.categories.find((entry) => entry.name === name);
    return { score: item?.hasData ? item.score : null, trend: null, evidence: item?.hasData ? item.description : "No authoritative data is available for this area.", color: item?.color || "#64748b" };
  };
  const finance = category("Finance");
  const communication = category("Communication");
  const cx = category("Customer Experience");
  const operations = category("Operations");
  const growth = category("CRM & Growth");
  return [
    { id: "relationships", name: "Relationship DNA™", score: relationships.retentionRatePct, trend: relationships.activeTrendPct, evidence: relationships.retentionRatePct === null ? "Retention evidence is insufficient." : "Retention rate from the relationship analytics service.", route: "/relationships", color: "#E31B23" },
    { id: "communications", name: "Communication Intelligence™", score: communications.score.score, trend: null, evidence: communications.score.hasSufficientData ? communications.score.minimumEvidence : communications.score.minimumEvidence, route: "/communications", color: "#3b82f6" },
    { id: "reputation", name: "Reputation DNA™", score: reviews.averageRating === null ? null : Math.round((reviews.averageRating / 5) * 100), trend: reviews.growth, evidence: reviews.averageRating === null ? "No rated reviews are available." : `${reviews.total} reviews; average ${reviews.averageRating.toFixed(2)}/5.`, route: "/reviews", color: "#10b981" },
    { id: "revenue", name: "Revenue DNA™", score: revenue.hasData ? 100 : null, trend: revenue.totalRevenue.trend, evidence: revenue.hasData ? "Score is not defined; verified revenue is shown in Finance." : "No verified payment data is available.", route: "/finance", color: "#f59e0b" },
    { id: "operations", name: "Operations DNA™", score: operations.score, trend: operations.trend, evidence: operations.evidence, route: "/tasks", color: "#06b6d4" },
    { id: "finance", name: "Finance DNA™", score: finance.score, trend: finance.trend, evidence: finance.evidence, route: "/finance", color: "#ec4899" },
    { id: "growth", name: "CRM & Growth", score: growth.score, trend: growth.trend, evidence: growth.evidence, route: "/relationships", color: "#64748b" },
    { id: "website", name: "Website DNA™", score: null, trend: null, evidence: "No authoritative website performance source is connected.", route: "/website", color: "#f97316" },
    { id: "marketing", name: "Marketing DNA™", score: null, trend: null, evidence: "No authoritative marketing performance source is connected.", route: "/insights", color: "#0f766e" },
  ];
}

function buildMemories(reviews: ReviewsSnapshot, communications: CommunicationsMetrics): IntelligenceMemory[] {
  const memories: IntelligenceMemory[] = [];
  const insights = buildReviewInsights(reviews.reviews).filter((insight) => insight.sufficient);
  insights.slice(0, 3).forEach((insight) => memories.push({ id: `review-${insight.label}-${insight.statement}`, statement: insight.statement, evidence: insight.evidence, source: "Reviews" }));
  if (communications.totalCommunications >= 3 && communications.avgResponseTimeMinutes !== null) memories.push({ id: "communication-response-time", statement: `Recorded communications have an average response time of ${communications.avgResponseTimeMinutes} minutes.`, evidence: `${communications.totalCommunications} communications are available; response-time calculation requires matched timestamps.`, source: "Communications" });
  return memories;
}

export async function fetchIntelligenceSnapshot(businessId: string, businessName: string): Promise<IntelligenceSnapshot> {
  const [score, revenue, communications, relationships, reviews, campaigns, customersRes, jobsRes, tasksRes, invoicesRes, paymentsRes, metricsRes, allowance] = await Promise.all([
    fetchCrediEdgeScore(businessId),
    fetchRevenueChartData(businessId, "month"),
    fetchCommunicationsMetrics(businessId),
    fetchPortfolioAnalytics(businessId),
    fetchReviewsSnapshot(businessId),
    fetchCampaigns(businessId),
    supabase.from("customers").select("*").eq("business_id", businessId),
    supabase.from("jobs").select("*").eq("business_id", businessId),
    supabase.from("tasks").select("*").eq("business_id", businessId),
    supabase.from("invoices").select("*").eq("business_id", businessId),
    supabase.from("payments").select("*").eq("business_id", businessId),
    supabase.from("business_metrics").select("*").eq("business_id", businessId).order("metric_date", { ascending: false }).limit(30),
    getAIAllowance(businessId),
  ]);
  const customers = (customersRes.data || []) as Customer[];
  const jobs = (jobsRes.data || []) as Job[];
  const tasks = (tasksRes.data || []) as Task[];
  const invoices = (invoicesRes.data || []) as Invoice[];
  const payments = (paymentsRes.data || []) as Payment[];
  const businessMetrics = (metricsRes.data || []) as BusinessMetric[];
  const reviewMetrics = fetchReviewMetrics(reviews);
  const discoveries = buildDiscoveries({ reviews, reviewMetrics, communications, invoices, customers, jobs });
  return {
    businessId,
    analyzedAt: new Date().toISOString(), businessName, score, revenue, communications, relationships, reviews, reviewMetrics, campaigns, customers, jobs, tasks, invoices, payments, businessMetrics,
    discoveries, risks: buildRisks(discoveries), opportunities: buildOpportunities({ discoveries, reviews, invoices, jobs }), timeline: buildTimeline({ payments, jobs, reviews, invoices, campaigns }), modules: buildModules(score, reviewMetrics, communications, relationships, revenue), memories: buildMemories(reviews, communications),
    impact: [{ label: "Measured recommendation outcomes", value: "INSUFFICIENT DATA", evidence: "No verified outcome records are connected to an accepted Intelligence recommendation.", available: false }, { label: "Revenue attributed to CrediEdgeOS", value: "INSUFFICIENT DATA", evidence: "Potential opportunity value is not counted as achieved revenue.", available: false }, { label: "Verified workflow completions", value: `${tasks.filter((task) => task.status === "completed").length}`, evidence: "Completed task records in the workspace; attribution to Intelligence is not established.", available: tasks.length > 0 }], allowance,
  };
}

function businessOnlyQuestion(question: string): boolean {
  const unrelated = /\b(recipe|lasagna|maths exam|homework|poem|joke|movie plot)\b/i;
  return !unrelated.test(question);
}

export async function answerBusinessQuestion(snapshot: IntelligenceSnapshot, question: string, userId?: string | null): Promise<IntelligenceAnswer> {
  const trimmed = question.trim();
  if (!businessOnlyQuestion(trimmed)) return { content: "I’m CrediEdgeOS Business Intelligence, so I can help with your business data and decisions, but not unrelated personal or general requests. Ask me about customers, revenue, operations, communications, reviews, finance, or what to prioritise next.", evidence: [], source: "Business-only governance", status: "redirected" };
  const authorization = await authorizeAndLogAIRequest({ businessId: snapshot.businessId, userId, actionType: "business_intelligence_chat", complexityTier: "free" });
  if (!authorization.authorized) return { content: authorization.message, evidence: [], source: "Central AI usage system", status: "unavailable" };
  const lower = trimmed.toLowerCase();
  if (lower.includes("review")) {
    const reviewRisk = snapshot.risks.find((risk) => risk.source.includes("Reviews"));
    return reviewRisk ? { content: `${reviewRisk.title}. ${reviewRisk.explanation}`, evidence: reviewRisk.evidence, source: reviewRisk.source, status: "answered" } : { content: "INSUFFICIENT DATA — no review issue is currently supported by the connected review records.", evidence: ["Reviews source queried", "No qualifying review risk found"], source: "Reviews", status: "insufficient" };
  }
  if (lower.includes("money") || lower.includes("profit") || lower.includes("revenue") || lower.includes("losing")) {
    const overdue = snapshot.opportunities.find((opportunity) => opportunity.source === "Finance");
    return overdue ? { content: `${overdue.title}. ${overdue.explanation}`, evidence: overdue.evidence, source: overdue.source, status: "answered" } : snapshot.revenue.hasData ? { content: `Verified revenue for ${snapshot.revenue.timeframeLabel.toLowerCase()} is ${snapshot.revenue.totalRevenue.value}. Expense and profit data are unavailable, so I cannot reliably identify profit loss or margin pressure.`, evidence: snapshot.revenue.aiObservations, source: "Finance", status: "insufficient" } : { content: "INSUFFICIENT DATA — no verified payment data is available for a revenue or profit analysis.", evidence: ["Payments source queried", "No payment records in the current period"], source: "Finance", status: "insufficient" };
  }
  if (lower.includes("focus") || lower.includes("priorit") || lower.includes("next")) {
    const priority = snapshot.risks[0] || snapshot.opportunities[0];
    return priority ? { content: `Start with ${priority.title}. ${priority.explanation}`, evidence: priority.evidence, source: priority.source, status: "answered" } : { content: "INSUFFICIENT DATA — there is not enough connected business activity to rank a reliable next action.", evidence: ["Risks and opportunities evaluated", "No qualifying records found"], source: "CrediEdgeOS Intelligence", status: "insufficient" };
  }
  return { content: `Your current verified CrediEdge Score is ${scoreLabel(snapshot.score.hasSufficientData ? snapshot.score.overallScore : null)}. I found ${snapshot.discoveries.length} evidence-backed discover${snapshot.discoveries.length === 1 ? "y" : "ies"} and ${snapshot.opportunities.length} workflow opportunit${snapshot.opportunities.length === 1 ? "y" : "ies"}. Ask about revenue, reviews, customers, communications, finance, or what to focus on next for a source-specific answer.`,  evidence: [`${snapshot.customers.length} customers`, `${snapshot.jobs.length} jobs`, `${snapshot.reviews.reviews.length} reviews`, `${snapshot.communications.totalCommunications} communications`], source: "CrediEdgeOS workspace snapshot", status: snapshot.discoveries.length ? "answered" : "insufficient" };
}

export { dateLabel, money, scoreLabel };
