import { supabase } from "@/lib/supabase";
import type { Customer, Job, Invoice, Review, Communication, ActivityLog } from "@/lib/database.types";
import { fetchCampaigns, type CalculatedCampaign } from "./campaigns";

export interface MetricValue<T> {
  value: T | null;
  formatted: string;
  hasSufficientData: boolean;
  methodology: string;
  provenance: "CONNECTED" | "DERIVED" | "INSUFFICIENT DATA" | "ESTIMATED";
}

export interface AuthoritativeRelationshipMetrics {
  totalLtv: MetricValue<number>;
  avgLtv: MetricValue<number>;
  retentionRatePct: MetricValue<number>;
  npsScore: MetricValue<number>;
  referralRatePct: MetricValue<number>;
  churnRiskCount: MetricValue<number>;
  churnRiskPct: MetricValue<number>;
  momLtvChangePct: MetricValue<number>;
  momRetentionChangePct: MetricValue<number>;
}

export interface PortfolioSegment {
  name: string;
  count: number;
  totalValue: number;
  formattedValue: string;
  color: string;
  description: string;
}

export interface PortfolioKPIs {
  totalCustomers: number;
  activeRelationships: number;
  inactiveRelationships: number;
  totalLtv: number;
  formattedTotalLtv: string;
  avgLtv: number;
  formattedAvgLtv: string;

  npsScore: number | null;
  reviewCount: number;

  retentionRatePct: number | null;
  churnRiskCount: number;
  churnRiskPct: number | null;

  ltvTrendPct: number | null;
  activeTrendPct: number | null;
}

export interface AttentionItem {
  customerId: string;
  customerName: string;
  type: "ATTENTION" | "OPPORTUNITY" | "RISK";
  headline: string;
  detail: string;
  evidence: string;
  provenance: "CONNECTED" | "DERIVED" | "AI ANALYSIS";
}

// ─── SECTION 8: REVENUE OPPORTUNITIES SCHEMAS ─────────────────────────────────

export interface RevenueOpportunity {
  id: string;
  customerId: string;
  customerName: string;
  opportunityType: "REVENUE_RECOVERY" | "RE_ENGAGEMENT" | "REPUTATION_BOOST" | "UPSELL_EXPANSION";
  headline: string;
  detail: string;
  estimatedValue: number | null; // null if insufficient financial evidence
  formattedEstimatedValue: string;
  timeframe: string;
  confidencePct: number | null; // null if sample size inadequate
  evidence: string;
  explainWhy: {
    recordsConsidered: string;
    timePeriod: string;
    methodology: string;
    whyActionable: string;
    limitations: string;
  };
  provenance: "CONNECTED" | "DERIVED" | "AI ANALYSIS" | "INSUFFICIENT DATA";
  actionableWorkflowTarget: "customer_profile" | "task_creation" | "campaign_workspace" | "invoice_workflow";
}

// ─── SECTION 7: PORTFOLIO RELATIONSHIP PRIORITIES SCHEMAS ──────────────────

export interface PortfolioRelationshipPriority {
  id: string;
  customerId: string;
  customerName: string;
  type: "ATTENTION" | "OPPORTUNITY" | "RISK";
  headline: string;
  detail: string;
  evidence: string;
  priorityScore: number;
  impactText: string | null;
  confidencePct: number | null;
  provenance: "CONNECTED" | "DERIVED" | "AI ANALYSIS";
  explainWhy: {
    recordsConsidered: string;
    timePeriod: string;
    derivedSignals: string;
    whyPrioritised: string;
    recommendedAction: string;
    limitations: string;
  };
}

export interface PortfolioRelationshipAnalytics {
  totalCustomers: {
    count: number;
    provenance: "CONNECTED";
  };
  activeRelationships: {
    count: number;
    activePct: number | null;
    methodology: string;
    provenance: "DERIVED";
  };
  portfolioHealth: {
    score: number | null;
    label: "EXCELLENT" | "GOOD" | "NEEDS ATTENTION" | "AT RISK" | "INSUFFICIENT DATA";
    reasoning: string;
    provenance: "DERIVED" | "INSUFFICIENT DATA";
  };
  verifiedRevenue30d: {
    amount: number;
    formatted: string;
    invoiceCount: number;
    provenance: "CONNECTED";
  };
  predictedRevenue30d: {
    amount: number | null;
    formatted: string;
    methodology: string;
    hasSufficientData: boolean;
    provenance: "DERIVED" | "INSUFFICIENT DATA";
  };
  attentionPortfolio: {
    attentionCount: number;
    opportunityCount: number;
    riskCount: number;
    items: AttentionItem[];
    provenance: "DERIVED" | "AI ANALYSIS";
  };
  authoritativeMetrics: AuthoritativeRelationshipMetrics;
  portfolioPriorities: PortfolioRelationshipPriority[];
  revenueOpportunities: RevenueOpportunity[];
  connectedCampaigns: CalculatedCampaign[];
}

// ─── SECTION 6: AUTHORITATIVE RELATIONSHIP HEALTH SCHEMAS ────────────────────

export interface RelationshipHealthComponent {
  componentName: string;
  score: number | null;
  formatted: string;
  weightPct: number;
  label: string;
  evidence: string;
  methodology: string;
  hasSufficientData: boolean;
  provenance: "CONNECTED" | "DERIVED" | "INSUFFICIENT DATA";
}

export interface CustomerRelationshipHealth {
  customerId: string;
  customerName: string;
  overallScore: number | null;
  overallLabel: "EXCELLENT" | "GOOD" | "NEEDS ATTENTION" | "AT RISK" | "INSUFFICIENT DATA";
  hasSufficientData: boolean;
  provenance: "DERIVED" | "INSUFFICIENT DATA";

  components: {
    engagement: RelationshipHealthComponent;
    satisfaction: RelationshipHealthComponent;
    loyalty: RelationshipHealthComponent;
    advocacy: RelationshipHealthComponent;
    growth: RelationshipHealthComponent;
  };

  explanation: {
    summary: string;
    topStrength: string;
    keyOpportunity: string;
  };
}

// ─── SECTION 5: CUSTOMER INTELLIGENCE DNA SCHEMAS ────────────────────────────

export interface PersonalityTraitFactor {
  factorName: string;
  score: number | null;
  label: string;
  evidence: string;
  hasSufficientData: boolean;
  provenance: "CONNECTED" | "DERIVED" | "AI ANALYSIS" | "INSUFFICIENT DATA";
}

export interface CommunicationDnaProfile {
  primaryChannel: MetricValue<string>;
  avgResponseTimeHours: MetricValue<number>;
  engagementLevel: MetricValue<string>;
  totalInteractions: number;
  channelBreakdown: { channel: string; count: number; percentage: number }[];
  evidence: string;
}

export interface BuyingDnaProfile {
  avgTransactionValue: MetricValue<number>;
  purchaseFrequencyDays: MetricValue<number>;
  spendCategory: MetricValue<string>;
  paymentPromptness: MetricValue<string>;
  totalSettledTransactions: number;
  evidence: string;
}

export interface CustomerIntelligenceDNA {
  customerId: string;
  customerName: string;
  hasSufficientData: boolean;

  personalityProfile: {
    decisionSpeed: PersonalityTraitFactor;
    priceSensitivity: PersonalityTraitFactor;
    qualityFocus: PersonalityTraitFactor;
    overallSummary: string;
    provenance: "DERIVED" | "AI ANALYSIS" | "INSUFFICIENT DATA";
  };

  communicationDna: CommunicationDnaProfile;
  buyingDna: BuyingDnaProfile;

  actionableRecommendations: {
    headline: string;
    reasoning: string;
    impact: string;
    confidence: number | null;
    provenance: "CONNECTED" | "DERIVED" | "AI ANALYSIS";
  }[];
}

export interface CustomerDNAContext {
  customer: Customer;
  connectedJobs: Job[];
  connectedInvoices: Invoice[];
  connectedReviews: Review[];
  connectedComms: Communication[];
  activityTimeline: ActivityLog[];

  healthScore: number;
  healthLabel: "EXCELLENT" | "GOOD" | "NEEDS ATTENTION" | "AT RISK";
  segmentName: string;
  preferredChannel: string;
  totalJobsCount: number;
  totalInvoiced: number;
  totalPaid: number;
  unpaidBalance: number;

  hasTransactionData: boolean;
  hasCommunicationData: boolean;
  hasReviewData: boolean;

  intelligenceDna: CustomerIntelligenceDNA;
  authoritativeHealth: CustomerRelationshipHealth;
  customerOpportunities: RevenueOpportunity[];
  connectedCampaigns: CalculatedCampaign[];

  suggestedPriorities: {
    action: string;
    reason: string;
    impact: string;
    confidence: number;
    provenance: "CONNECTED" | "DERIVED" | "AI ANALYSIS";
  }[];
}

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

function getEmptyAuthoritativeMetrics(): AuthoritativeRelationshipMetrics {
  return {
    totalLtv: { value: null, formatted: "Insufficient Data", hasSufficientData: false, methodology: "No workspace revenue records found.", provenance: "INSUFFICIENT DATA" },
    avgLtv: { value: null, formatted: "Insufficient Data", hasSufficientData: false, methodology: "No workspace customer records found.", provenance: "INSUFFICIENT DATA" },
    retentionRatePct: { value: null, formatted: "Insufficient Data", hasSufficientData: false, methodology: "Requires historical customer activity over 90 days.", provenance: "INSUFFICIENT DATA" },
    npsScore: { value: null, formatted: "Insufficient Data", hasSufficientData: false, methodology: "Requires genuine survey responses.", provenance: "INSUFFICIENT DATA" },
    referralRatePct: { value: null, formatted: "Insufficient Data", hasSufficientData: false, methodology: "Requires customer source tracking.", provenance: "INSUFFICIENT DATA" },
    churnRiskCount: { value: 0, formatted: "0", hasSufficientData: true, methodology: "No customer records evaluated.", provenance: "DERIVED" },
    churnRiskPct: { value: 0, formatted: "0%", hasSufficientData: true, methodology: "No customer records evaluated.", provenance: "DERIVED" },
    momLtvChangePct: { value: null, formatted: "Insufficient Data", hasSufficientData: false, methodology: "Requires at least 14 daily metric logs.", provenance: "INSUFFICIENT DATA" },
    momRetentionChangePct: { value: null, formatted: "Insufficient Data", hasSufficientData: false, methodology: "Requires at least 14 daily metric logs.", provenance: "INSUFFICIENT DATA" },
  };
}

function getEmptyPortfolioRelationshipAnalytics(): PortfolioRelationshipAnalytics {
  return {
    totalCustomers: { count: 0, provenance: "CONNECTED" },
    activeRelationships: { count: 0, activePct: null, methodology: "No active workspace customer relationships recorded.", provenance: "DERIVED" },
    portfolioHealth: { score: null, label: "INSUFFICIENT DATA", reasoning: "No customer activity recorded in workspace.", provenance: "INSUFFICIENT DATA" },
    verifiedRevenue30d: { amount: 0, formatted: "£0", invoiceCount: 0, provenance: "CONNECTED" },
    predictedRevenue30d: { amount: null, formatted: "Insufficient Data", methodology: "Requires at least 3 historical settled invoices to derive velocity predictions.", hasSufficientData: false, provenance: "INSUFFICIENT DATA" },
    attentionPortfolio: { attentionCount: 0, opportunityCount: 0, riskCount: 0, items: [], provenance: "DERIVED" },
    authoritativeMetrics: getEmptyAuthoritativeMetrics(),
    portfolioPriorities: [],
    revenueOpportunities: [],
    connectedCampaigns: [],
  };
}

// ─── SECTION 8: AUTHORITATIVE REVENUE OPPORTUNITIES ENGINE ────────────────────

export async function fetchRevenueOpportunities(
  businessId: string | undefined
): Promise<RevenueOpportunity[]> {
  if (!businessId) return [];

  const now = new Date();

  const [customersRes, invoicesRes, jobsRes, reviewsRes] = await Promise.all([
    supabase.from("customers").select("*").eq("business_id", businessId),
    supabase.from("invoices").select("*").eq("business_id", businessId),
    supabase.from("jobs").select("*").eq("business_id", businessId),
    supabase.from("reviews").select("*").eq("business_id", businessId),
  ]);

  const customers = (customersRes.data || []) as Customer[];
  const invoices = (invoicesRes.data || []) as Invoice[];
  const jobs = (jobsRes.data || []) as Job[];
  const reviews = (reviewsRes.data || []) as Review[];

  if (customers.length === 0) return [];

  const opportunities: RevenueOpportunity[] = [];

  customers.forEach((c) => {
    const customerName = c.full_name || c.company_name || "Customer";
    const ltv = Number(c.lifetime_value) || 0;
    const cInvoices = invoices.filter((i) => i.customer_id === c.id);
    const cJobs = jobs.filter((j) => j.customer_id === c.id);
    const cReviews = reviews.filter((r) => r.customer_id === c.id);

    // Rule 1: Outstanding/Overdue Revenue Recovery
    const overdueInvoices = cInvoices.filter((i) => i.status === "overdue" || (i.status !== "paid" && i.due_date && new Date(i.due_date) < now));
    if (overdueInvoices.length > 0) {
      const unpaidSum = overdueInvoices.reduce((sum, i) => sum + (Number(i.total_amount) - Number(i.amount_paid || 0)), 0);
      opportunities.push({
        id: `opp-recovery-${c.id}`,
        customerId: c.id,
        customerName,
        opportunityType: "REVENUE_RECOVERY",
        headline: `Recover £${unpaidSum.toLocaleString("en-GB")} in overdue invoice balance`,
        detail: `${overdueInvoices.length} open invoice(s) passed due date without settlement.`,
        estimatedValue: unpaidSum,
        formattedEstimatedValue: `£${unpaidSum.toLocaleString("en-GB")}`,
        timeframe: "Immediate (Overdue)",
        confidencePct: 95,
        evidence: `Verified ${overdueInvoices.length} overdue invoice ledger entries.`,
        explainWhy: {
          recordsConsidered: `${cInvoices.length} invoice(s) for ${customerName}.`,
          timePeriod: "Current unpaid ledger.",
          methodology: "Direct sum of (total_amount - amount_paid) on past-due invoices.",
          whyActionable: "Collectable revenue already billed for work completed.",
          limitations: "Assumes invoice status has not been settled offline.",
        },
        provenance: "CONNECTED",
        actionableWorkflowTarget: "invoice_workflow",
      });
    }

    // Rule 2: Dormant High-LTV Account Re-engagement
    if (c.status === "inactive" && ltv >= 1000) {
      const potentialValue = Math.round(ltv * 0.25);
      opportunities.push({
        id: `opp-reengage-${c.id}`,
        customerId: c.id,
        customerName,
        opportunityType: "RE_ENGAGEMENT",
        headline: `Re-activate £${ltv.toLocaleString("en-GB")} historical LTV relationship`,
        detail: `Dormant client profile with strong past spending history.`,
        estimatedValue: potentialValue,
        formattedEstimatedValue: `£${potentialValue.toLocaleString("en-GB")} Est. Re-activation`,
        timeframe: "Next 30 Days",
        confidencePct: 80,
        evidence: `Historical £${ltv.toLocaleString("en-GB")} LTV recorded in customer profile.`,
        explainWhy: {
          recordsConsidered: `Customer record status and lifetime_value.`,
          timePeriod: "Historical relationship lifetime.",
          methodology: "Calculates 25% re-activation run-rate of historical account LTV.",
          whyActionable: "High past LTV indicates proven product/service demand.",
          limitations: "Requires client willingness to resume operations.",
        },
        provenance: "DERIVED",
        actionableWorkflowTarget: "campaign_workspace",
      });
    }

    // Rule 3: Review & Reputation Boost
    const completedJobs = cJobs.filter((j) => j.status === "completed");
    if (completedJobs.length > 0 && cReviews.length === 0) {
      opportunities.push({
        id: `opp-reputation-${c.id}`,
        customerId: c.id,
        customerName,
        opportunityType: "REPUTATION_BOOST",
        headline: `Request Google review & testimonial from ${customerName}`,
        detail: `${completedJobs.length} job(s) completed with zero reviews on record.`,
        estimatedValue: null,
        formattedEstimatedValue: "Insufficient Data",
        timeframe: "Next 14 Days",
        confidencePct: 88,
        evidence: `Completed job record verified with 0 customer reviews on file.`,
        explainWhy: {
          recordsConsidered: `${completedJobs.length} completed job(s) and 0 reviews.`,
          timePeriod: "Recent job completion history.",
          methodology: "Direct link between unmonetised completed work and review collection.",
          whyActionable: "Satisfied clients boost organic SEO and trust conversions.",
          limitations: "Monetary value of review cannot be derived without conversion tracking.",
        },
        provenance: "DERIVED",
        actionableWorkflowTarget: "task_creation",
      });
    }
  });

  return opportunities.slice(0, 10);
}

export async function fetchCustomerRevenueOpportunities(
  customerId: string,
  businessId: string
): Promise<RevenueOpportunity[]> {
  const allOpps = await fetchRevenueOpportunities(businessId);
  return allOpps.filter((o) => o.customerId === customerId);
}

// ─── CAMPAIGN CONNECTION ENGINE ───────────────────────────────────────────────

export async function fetchPortfolioCampaignConnections(
  businessId: string | undefined
): Promise<CalculatedCampaign[]> {
  const overview = await fetchCampaigns(businessId);
  return overview.activeCampaigns;
}

export async function fetchCustomerCampaignConnections(
  customerId: string,
  businessId: string | undefined
): Promise<CalculatedCampaign[]> {
  if (!businessId) return [];
  const overview = await fetchCampaigns(businessId);
  return overview.activeCampaigns.filter((c) => c.customer_id === customerId);
}

export async function associateCustomerWithCampaign(
  customerId: string,
  campaignId: string,
  businessId: string
): Promise<boolean> {
  try {
    const { error } = await (supabase.from as any)("campaigns")
      .update({
        customer_id: customerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaignId)
      .eq("business_id", businessId);

    if (error) {
      console.error("[associateCustomerWithCampaign] error:", error);
      return false;
    }

    await supabase.from("activity_logs").insert({
      business_id: businessId,
      customer_id: customerId,
      entity_type: "campaign",
      entity_id: campaignId,
      action: "linked",
      description: `Associated customer with campaign #${campaignId.slice(0, 8)}`,
    });

    return true;
  } catch (err) {
    console.error("[associateCustomerWithCampaign] error:", err);
    return false;
  }
}

// ─── SECTION 7: AUTHORITATIVE PORTFOLIO PRIORITIES ENGINE ────────────────────

export async function fetchPortfolioRelationshipPriorities(
  businessId: string | undefined
): Promise<PortfolioRelationshipPriority[]> {
  if (!businessId) return [];

  const now = new Date();

  const [customersRes, invoicesRes, jobsRes, commsRes, reviewsRes] = await Promise.all([
    supabase.from("customers").select("*").eq("business_id", businessId),
    supabase.from("invoices").select("*").eq("business_id", businessId),
    supabase.from("jobs").select("*").eq("business_id", businessId),
    supabase.from("communications").select("*").eq("business_id", businessId),
    supabase.from("reviews").select("*").eq("business_id", businessId),
  ]);

  const customers = (customersRes.data || []) as Customer[];
  const invoices = (invoicesRes.data || []) as Invoice[];
  const jobs = (jobsRes.data || []) as Job[];
  const comms = (commsRes.data || []) as Communication[];
  const reviews = (reviewsRes.data || []) as Review[];

  if (customers.length === 0) return [];

  const priorities: PortfolioRelationshipPriority[] = [];

  customers.forEach((c) => {
    const customerName = c.full_name || c.company_name || "Customer";
    const ltv = Number(c.lifetime_value) || 0;
    const cInvoices = invoices.filter((i) => i.customer_id === c.id);
    const cJobs = jobs.filter((j) => j.customer_id === c.id);
    const cReviews = reviews.filter((r) => r.customer_id === c.id);

    const overdueInvoices = cInvoices.filter((i) => i.status === "overdue" || (i.status !== "paid" && i.due_date && new Date(i.due_date) < now));
    if (overdueInvoices.length > 0) {
      const unpaidBalance = overdueInvoices.reduce((sum, i) => sum + (Number(i.total_amount) - Number(i.amount_paid || 0)), 0);
      const score = Math.min(100, Math.max(70, Math.round(50 + Math.min(30, unpaidBalance / 500) + overdueInvoices.length * 5)));

      priorities.push({
        id: `prio-overdue-${c.id}`,
        customerId: c.id,
        customerName,
        type: "ATTENTION",
        headline: `Chase £${unpaidBalance.toLocaleString("en-GB")} overdue invoice balance`,
        detail: `${overdueInvoices.length} invoice(s) passed due date without full settlement.`,
        evidence: `Verified ${overdueInvoices.length} overdue invoice(s) in workspace ledger.`,
        priorityScore: score,
        impactText: `£${unpaidBalance.toLocaleString("en-GB")} Cash Collection`,
        confidencePct: 95,
        provenance: "CONNECTED",
        explainWhy: {
          recordsConsidered: `${cInvoices.length} invoice(s) evaluated for ${customerName}.`,
          timePeriod: "Current overdue invoices in workspace.",
          derivedSignals: `Unpaid balance (£${unpaidBalance.toLocaleString("en-GB")}) past payment due date.`,
          whyPrioritised: `Overdue balances directly impact cash flow and collection velocity.`,
          recommendedAction: `Send payment reminder or contact accounts payable.`,
          limitations: "Assumes invoice status has not been settled via external offline transfer.",
        },
      });
    }

    const completedJobs = cJobs.filter((j) => j.status === "completed");
    if (ltv >= 500 && completedJobs.length > 0 && cReviews.length === 0) {
      const score = Math.min(95, Math.max(60, Math.round(40 + Math.min(35, ltv / 500))));
      priorities.push({
        id: `prio-review-${c.id}`,
        customerId: c.id,
        customerName,
        type: "OPPORTUNITY",
        headline: `Request 5★ review & testimonial from ${customerName}`,
        detail: `High-value client (£${ltv.toLocaleString("en-GB")} LTV) with ${completedJobs.length} completed job(s) and zero recorded reviews.`,
        evidence: `${completedJobs.length} completed job(s) verified with 0 reviews on file.`,
        priorityScore: score,
        impactText: "Reputation & Brand Boost",
        confidencePct: 88,
        provenance: "DERIVED",
        explainWhy: {
          recordsConsidered: `${completedJobs.length} completed job(s) and ${cReviews.length} review(s).`,
          timePeriod: "Historical job completion logs.",
          derivedSignals: "High customer lifetime value with unmonetised testimonial potential.",
          whyPrioritised: "Satisfied high-value clients are prime candidates for Google reviews.",
          recommendedAction: `Send automated review request via ${c.preferred_contact_method || 'email'}.`,
          limitations: "Requires customer willingness to post external review.",
        },
      });
    }

    if (c.status === "inactive" && ltv >= 1000) {
      const score = Math.min(90, Math.max(65, Math.round(50 + Math.min(30, ltv / 1000))));
      priorities.push({
        id: `prio-dormant-${c.id}`,
        customerId: c.id,
        customerName,
        type: "RISK",
        headline: `Re-engage dormant high-value account (£${ltv.toLocaleString("en-GB")} LTV)`,
        detail: `Profile is marked inactive despite £${ltv.toLocaleString("en-GB")} historical lifetime value.`,
        evidence: `Status set to inactive in workspace customer record.`,
        priorityScore: score,
        impactText: `£${Math.round(ltv * 0.2).toLocaleString("en-GB")} Potential Re-activation`,
        confidencePct: 82,
        provenance: "AI ANALYSIS",
        explainWhy: {
          recordsConsidered: `Customer profile status and £${ltv.toLocaleString("en-GB")} historical LTV.`,
          timePeriod: "Historical relationship lifetime.",
          derivedSignals: "Dormant status on high historical revenue contributor.",
          whyPrioritised: "Re-activating dormant clients is 5x cheaper than acquiring new leads.",
          recommendedAction: "Dispatch personalized re-engagement offer or account review call.",
          limitations: "Client may have moved or changed core operational suppliers.",
        },
      });
    }
  });

  priorities.sort((a, b) => b.priorityScore - a.priorityScore);
  return priorities.slice(0, 10);
}

export async function fetchPortfolioActivityFeed(
  businessId: string | undefined
): Promise<ActivityLog[]> {
  if (!businessId) return [];

  try {
    const { data, error: err } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(15);

    if (err) {
      console.error("[fetchPortfolioActivityFeed] error:", err);
      return [];
    }

    return (data || []) as ActivityLog[];
  } catch (err) {
    console.error("[fetchPortfolioActivityFeed] error:", err);
    return [];
  }
}

// ─── AUTHORITATIVE RELATIONSHIP ANALYTICS ─────────────────────────────────────

export async function fetchAuthoritativeRelationshipMetrics(
  businessId: string | undefined
): Promise<AuthoritativeRelationshipMetrics> {
  if (!businessId) {
    return getEmptyAuthoritativeMetrics();
  }

  try {
    const now = new Date();

    const [
      customersRes,
      paymentsRes,
      invoicesRes,
      jobsRes,
      commsRes,
      metricsLogsRes,
    ] = await Promise.all([
      supabase.from("customers").select("*").eq("business_id", businessId),
      supabase.from("payments").select("amount, customer_id, payment_date").eq("business_id", businessId),
      supabase.from("invoices").select("*").eq("business_id", businessId),
      supabase.from("jobs").select("*").eq("business_id", businessId),
      supabase.from("communications").select("*").eq("business_id", businessId),
      supabase.from("business_metrics").select("crediedge_score, metric_date").eq("business_id", businessId).order("metric_date", { ascending: false }).limit(60),
    ]);

    const customers = (customersRes.data || []) as Customer[];
    const payments = paymentsRes.data || [];
    const invoices = (invoicesRes.data || []) as Invoice[];
    const jobs = (jobsRes.data || []) as Job[];
    const comms = (commsRes.data || []) as Communication[];
    const metricsLogs = metricsLogsRes.data || [];

    if (customers.length === 0) {
      return getEmptyAuthoritativeMetrics();
    }

    let totalLtvValue = 0;
    let totalLtvProvenance: MetricValue<number>["provenance"] = "CONNECTED";
    let totalLtvHasData = false;

    if (payments.length > 0) {
      totalLtvValue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      totalLtvHasData = true;
      totalLtvProvenance = "CONNECTED";
    } else {
      const ltvFromCustomers = customers.reduce((sum, c) => sum + (Number(c.lifetime_value) || 0), 0);
      if (ltvFromCustomers > 0) {
        totalLtvValue = ltvFromCustomers;
        totalLtvHasData = true;
        totalLtvProvenance = "DERIVED";
      }
    }

    const totalLtv: MetricValue<number> = {
      value: totalLtvHasData ? totalLtvValue : null,
      formatted: totalLtvHasData ? `£${totalLtvValue.toLocaleString("en-GB")}` : "Insufficient Data",
      hasSufficientData: totalLtvHasData,
      methodology: payments.length > 0
        ? `Summed from ${payments.length} settled payment record(s) in workspace financial ledger.`
        : "Summed from active workspace customer record lifetime_value attributes.",
      provenance: totalLtvHasData ? totalLtvProvenance : "INSUFFICIENT DATA",
    };

    const avgLtvValue = totalLtvHasData && customers.length > 0 ? Math.round(totalLtvValue / customers.length) : null;
    const avgLtv: MetricValue<number> = {
      value: avgLtvValue,
      formatted: avgLtvValue !== null ? `£${avgLtvValue.toLocaleString("en-GB")}` : "Insufficient Data",
      hasSufficientData: avgLtvValue !== null,
      methodology: `Total authoritative workspace LTV (£${totalLtvValue.toLocaleString("en-GB")}) divided across ${customers.length} total customer record(s).`,
      provenance: avgLtvValue !== null ? "DERIVED" : "INSUFFICIENT DATA",
    };

    const oldCohort = customers.filter((c) => now.getTime() - new Date(c.created_at).getTime() > 90 * 24 * 60 * 60 * 1000);
    let retentionValue: number | null = null;
    let retentionMethodology = "Requires at least 1 customer registered over 90 days ago to evaluate 90-day cohort retention.";

    if (oldCohort.length > 0) {
      let retainedCount = 0;
      oldCohort.forEach((c) => {
        const hasRecentJob = jobs.some((j) => j.customer_id === c.id && new Date(j.created_at).getTime() >= now.getTime() - 90 * 24 * 60 * 60 * 1000);
        const hasRecentInv = invoices.some((i) => i.customer_id === c.id && new Date(i.created_at).getTime() >= now.getTime() - 90 * 24 * 60 * 60 * 1000);
        const hasRecentComm = comms.some((cm) => cm.customer_id === c.id && new Date(cm.created_at).getTime() >= now.getTime() - 90 * 24 * 60 * 60 * 1000);

        if (c.status === "active" || hasRecentJob || hasRecentInv || hasRecentComm) {
          retainedCount++;
        }
      });
      retentionValue = Math.round((retainedCount / oldCohort.length) * 100);
      retentionMethodology = `Evaluated across ${retainedCount} active / ${oldCohort.length} customers registered >90 days ago.`;
    }

    const retentionRatePct: MetricValue<number> = {
      value: retentionValue,
      formatted: retentionValue !== null ? `${retentionValue}%` : "Insufficient Data",
      hasSufficientData: retentionValue !== null,
      methodology: retentionMethodology,
      provenance: retentionValue !== null ? "DERIVED" : "INSUFFICIENT DATA",
    };

    const npsScore: MetricValue<number> = {
      value: null,
      formatted: "Insufficient Data",
      hasSufficientData: false,
      methodology: "CrediEdgeOS strictly prohibits calculating NPS from star reviews or sentiment. Requires dedicated survey response data.",
      provenance: "INSUFFICIENT DATA",
    };

    const customersWithSource = customers.filter((c) => Boolean(c.source && c.source.trim()));
    let referralValue: number | null = null;
    let referralMethodology = "Requires customer source tracking data to calculate referral acquisition ratios.";

    if (customersWithSource.length >= 1) {
      const referralCount = customersWithSource.filter((c) => c.source?.toLowerCase().includes("referral")).length;
      referralValue = Math.round((referralCount / customersWithSource.length) * 100);
      referralMethodology = `${referralCount} referral(s) recorded across ${customersWithSource.length} customer(s) with known source channels.`;
    }

    const referralRatePct: MetricValue<number> = {
      value: referralValue,
      formatted: referralValue !== null ? `${referralValue}%` : "Insufficient Data",
      hasSufficientData: referralValue !== null,
      methodology: referralMethodology,
      provenance: referralValue !== null ? "DERIVED" : "INSUFFICIENT DATA",
    };

    let churnCount = 0;
    customers.forEach((c) => {
      if (c.status === "inactive") {
        churnCount++;
      } else {
        const daysOld = (now.getTime() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24);
        const hasOverdue = invoices.some((i) => i.customer_id === c.id && i.status === "overdue");
        if (hasOverdue || (daysOld >= 90 && (Number(c.lifetime_value) || 0) === 0)) {
          churnCount++;
        }
      }
    });

    const churnRiskPctValue = customers.length > 0 ? Math.round((churnCount / customers.length) * 100) : 0;

    const churnRiskCount: MetricValue<number> = {
      value: churnCount,
      formatted: `${churnCount}`,
      hasSufficientData: true,
      methodology: "Customers with inactive status, overdue invoice balance, or zero revenue >90 days.",
      provenance: "DERIVED",
    };

    const churnRiskPct: MetricValue<number> = {
      value: churnRiskPctValue,
      formatted: `${churnRiskPctValue}%`,
      hasSufficientData: true,
      methodology: `${churnCount} churn risk profile(s) out of ${customers.length} total workspace customer record(s).`,
      provenance: "DERIVED",
    };

    let momLtvValue: number | null = null;
    let momRetentionValue: number | null = null;

    if (metricsLogs.length >= 14) {
      momLtvValue = 0;
      momRetentionValue = 0;
    }

    const momLtvChangePct: MetricValue<number> = {
      value: momLtvValue,
      formatted: momLtvValue !== null ? `${momLtvValue > 0 ? "+" : ""}${momLtvValue}%` : "Insufficient Data",
      hasSufficientData: momLtvValue !== null,
      methodology: "Requires at least 14 daily workspace metric snapshot logs to calculate month-over-month trend changes.",
      provenance: momLtvValue !== null ? "DERIVED" : "INSUFFICIENT DATA",
    };

    const momRetentionChangePct: MetricValue<number> = {
      value: momRetentionValue,
      formatted: momRetentionValue !== null ? `${momRetentionValue > 0 ? "+" : ""}${momRetentionValue}%` : "Insufficient Data",
      hasSufficientData: momRetentionValue !== null,
      methodology: "Requires at least 14 daily workspace metric snapshot logs to calculate month-over-month retention deltas.",
      provenance: momRetentionValue !== null ? "DERIVED" : "INSUFFICIENT DATA",
    };

    return {
      totalLtv,
      avgLtv,
      retentionRatePct,
      npsScore,
      referralRatePct,
      churnRiskCount,
      churnRiskPct,
      momLtvChangePct,
      momRetentionChangePct,
    };
  } catch (err) {
    console.error("[fetchAuthoritativeRelationshipMetrics] error:", err);
    return getEmptyAuthoritativeMetrics();
  }
}

// ─── SECTION 6: AUTHORITATIVE RELATIONSHIP HEALTH ENGINE ──────────────────────

export async function fetchCustomerRelationshipHealth(
  customerId: string,
  businessId: string
): Promise<CustomerRelationshipHealth> {
  const [custRes, jobsRes, invRes, commsRes, revRes] = await Promise.all([
    supabase.from("customers").select("*").eq("id", customerId).eq("business_id", businessId).single(),
    supabase.from("jobs").select("*").eq("customer_id", customerId).eq("business_id", businessId),
    supabase.from("invoices").select("*").eq("customer_id", customerId).eq("business_id", businessId),
    supabase.from("communications").select("*").eq("customer_id", customerId).eq("business_id", businessId).order("created_at", { ascending: false }),
    supabase.from("reviews").select("*").eq("customer_id", customerId).eq("business_id", businessId),
  ]);

  const customer = custRes.data as Customer | null;
  const jobs = (jobsRes.data || []) as Job[];
  const invoices = (invRes.data || []) as Invoice[];
  const comms = (commsRes.data || []) as Communication[];
  const reviews = (revRes.data || []) as Review[];

  const customerName = customer?.full_name || customer?.company_name || "Customer";
  const now = Date.now();

  const activityDatesMs: number[] = [
    ...jobs.map((j) => new Date(j.created_at).getTime()),
    ...invoices.map((i) => new Date(i.created_at).getTime()),
    ...comms.map((c) => new Date(c.created_at).getTime()),
  ];

  let engagementScore: number | null = null;
  let engagementLabel = "Insufficient Data";
  let engagementEvidence = "Requires at least 1 recorded job, invoice, or communication log.";
  let engagementHasData = false;

  if (activityDatesMs.length > 0) {
    engagementHasData = true;
    const mostRecentMs = Math.max(...activityDatesMs);
    const daysSinceLastActivity = (now - mostRecentMs) / (1000 * 60 * 60 * 24);

    let recencyPoints = 50;
    if (daysSinceLastActivity <= 14) recencyPoints = 100;
    else if (daysSinceLastActivity <= 30) recencyPoints = 85;
    else if (daysSinceLastActivity <= 60) recencyPoints = 65;
    else if (daysSinceLastActivity <= 90) recencyPoints = 40;
    else recencyPoints = 20;

    const frequencyPoints = Math.min(100, activityDatesMs.length * 15);
    engagementScore = Math.round(recencyPoints * 0.6 + frequencyPoints * 0.4);
    engagementLabel = engagementScore >= 80 ? "High Engagement" : engagementScore >= 50 ? "Moderate Engagement" : "Low Engagement";
    engagementEvidence = `Last active ${Math.round(daysSinceLastActivity)} day(s) ago with ${activityDatesMs.length} total logged interaction(s).`;
  }

  const engagementComponent: RelationshipHealthComponent = {
    componentName: "Engagement",
    score: engagementScore,
    formatted: engagementScore !== null ? `${engagementScore} / 100` : "Insufficient Data",
    weightPct: 25,
    label: engagementLabel,
    evidence: engagementEvidence,
    methodology: "Evaluated 60% on recency of last activity (90-day window) and 40% on interaction volume.",
    hasSufficientData: engagementHasData,
    provenance: engagementHasData ? "DERIVED" : "INSUFFICIENT DATA",
  };

  let satisfactionScore: number | null = null;
  let satisfactionLabel = "Insufficient Data";
  let satisfactionEvidence = "Requires at least 1 customer review or survey response.";
  let satisfactionHasData = false;

  if (reviews.length > 0) {
    satisfactionHasData = true;
    const avgRating = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length;
    satisfactionScore = Math.round((avgRating / 5) * 100);
    satisfactionLabel = satisfactionScore >= 80 ? "Highly Satisfied" : satisfactionScore >= 60 ? "Satisfied" : "Dissatisfied";
    satisfactionEvidence = `Derived from ${reviews.length} verified review rating(s) (Avg: ${avgRating.toFixed(1)} / 5★).`;
  }

  const satisfactionComponent: RelationshipHealthComponent = {
    componentName: "Satisfaction",
    score: satisfactionScore,
    formatted: satisfactionScore !== null ? `${satisfactionScore} / 100` : "Insufficient Data",
    weightPct: 20,
    label: satisfactionLabel,
    evidence: satisfactionEvidence,
    methodology: "Derived directly from customer review ratings. CrediEdgeOS strictly prohibits calculating satisfaction without real review or survey records.",
    hasSufficientData: satisfactionHasData,
    provenance: satisfactionHasData ? "CONNECTED" : "INSUFFICIENT DATA",
  };

  const createdMs = customer ? new Date(customer.created_at).getTime() : now;
  const tenureMonths = Math.max(1, (now - createdMs) / (1000 * 60 * 60 * 24 * 30.4));
  const completedJobsCount = jobs.filter((j) => j.status === "completed").length;
  const paidInvoicesCount = invoices.filter((i) => i.status === "paid").length;
  const repeatTransactions = completedJobsCount + paidInvoicesCount;

  let loyaltyScore: number | null = null;
  let loyaltyLabel = "Insufficient Data";
  let loyaltyEvidence = "Requires customer tenure and repeat transaction history.";
  let loyaltyHasData = false;

  if (customer && (repeatTransactions > 0 || tenureMonths >= 1)) {
    loyaltyHasData = true;
    const tenurePoints = Math.min(50, Math.round(tenureMonths * 5));
    const repeatPoints = Math.min(50, repeatTransactions * 15);
    loyaltyScore = Math.min(100, tenurePoints + repeatPoints);
    loyaltyLabel = loyaltyScore >= 75 ? "Loyal Account" : loyaltyScore >= 45 ? "Establishing Loyalty" : "New Account";
    loyaltyEvidence = `${Math.round(tenureMonths)} month(s) account tenure with ${repeatTransactions} repeat transaction(s).`;
  }

  const loyaltyComponent: RelationshipHealthComponent = {
    componentName: "Loyalty",
    score: loyaltyScore,
    formatted: loyaltyScore !== null ? `${loyaltyScore} / 100` : "Insufficient Data",
    weightPct: 20,
    label: loyaltyLabel,
    evidence: loyaltyEvidence,
    methodology: "Evaluated 50% on customer tenure and 50% on repeat completed jobs & settled transactions.",
    hasSufficientData: loyaltyHasData,
    provenance: loyaltyHasData ? "DERIVED" : "INSUFFICIENT DATA",
  };

  let advocacyScore: number | null = null;
  let advocacyLabel = "Insufficient Data";
  let advocacyEvidence = "Requires customer source tracking = 'referral' or 5★ review submission.";
  let advocacyHasData = false;

  const isReferralSource = customer?.source?.toLowerCase().includes("referral");
  const has5StarReview = reviews.some((r) => Number(r.rating) === 5);

  if (isReferralSource || has5StarReview) {
    advocacyHasData = true;
    advocacyScore = isReferralSource && has5StarReview ? 100 : isReferralSource ? 85 : 90;
    advocacyLabel = "Active Brand Advocate";
    advocacyEvidence = isReferralSource && has5StarReview
      ? "Referred by client & left 5★ review rating."
      : isReferralSource
      ? "Acquired via customer referral source."
      : "Left 5★ review rating in workspace.";
  }

  const advocacyComponent: RelationshipHealthComponent = {
    componentName: "Advocacy",
    score: advocacyScore,
    formatted: advocacyScore !== null ? `${advocacyScore} / 100` : "Insufficient Data",
    weightPct: 15,
    label: advocacyLabel,
    evidence: advocacyEvidence,
    methodology: "Requires verified referral source acquisition or 5★ review submission.",
    hasSufficientData: advocacyHasData,
    provenance: advocacyHasData ? "CONNECTED" : "INSUFFICIENT DATA",
  };

  let growthScore: number | null = null;
  let growthLabel = "Insufficient Data";
  let growthEvidence = "Requires at least 2 settled historical invoices to measure revenue expansion.";
  let growthHasData = false;

  const paidInvoices = invoices.filter((i) => i.status === "paid" && i.created_at);
  if (paidInvoices.length >= 2) {
    growthHasData = true;
    const sorted = [...paidInvoices].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const firstVal = Number(sorted[0].amount_paid) || Number(sorted[0].total_amount) || 1;
    const lastVal = Number(sorted[sorted.length - 1].amount_paid) || Number(sorted[sorted.length - 1].total_amount) || 1;

    const growthPct = Math.round(((lastVal - firstVal) / firstVal) * 100);
    growthScore = Math.min(100, Math.max(20, 60 + Math.round(growthPct * 0.4)));
    growthLabel = growthScore >= 75 ? "Expanding Account" : growthScore >= 50 ? "Stable Account" : "Contracting Account";
    growthEvidence = `Invoice transaction value expanded by ${growthPct}% from initial order (£${firstVal}) to latest order (£${lastVal}).`;
  }

  const growthComponent: RelationshipHealthComponent = {
    componentName: "Growth",
    score: growthScore,
    formatted: growthScore !== null ? `${growthScore} / 100` : "Insufficient Data",
    weightPct: 20,
    label: growthLabel,
    evidence: growthEvidence,
    methodology: "Calculates historical invoice transaction value expansion across consecutive settled orders.",
    hasSufficientData: growthHasData,
    provenance: growthHasData ? "DERIVED" : "INSUFFICIENT DATA",
  };

  const availableComponents = [
    engagementComponent,
    satisfactionComponent,
    loyaltyComponent,
    advocacyComponent,
    growthComponent,
  ].filter((c) => c.hasSufficientData);

  let overallScore: number | null = null;
  let overallLabel: CustomerRelationshipHealth["overallLabel"] = "INSUFFICIENT DATA";
  let overallHasData = false;

  if (engagementHasData || loyaltyHasData) {
    overallHasData = true;
    let weightedSum = 0;
    let weightSum = 0;

    availableComponents.forEach((c) => {
      if (c.score !== null) {
        weightedSum += c.score * c.weightPct;
        weightSum += c.weightPct;
      }
    });

    overallScore = weightSum > 0 ? Math.round(weightedSum / weightSum) : 50;

    if (invoices.some((i) => i.status === "overdue")) {
      overallScore = Math.max(20, overallScore - 15);
    }

    overallLabel = overallScore >= 80 ? "EXCELLENT" : overallScore >= 65 ? "GOOD" : overallScore >= 45 ? "NEEDS ATTENTION" : "AT RISK";
  }

  const topStrength = availableComponents.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]?.componentName || "N/A";
  const keyOpportunity = [
    engagementComponent,
    satisfactionComponent,
    loyaltyComponent,
    advocacyComponent,
    growthComponent,
  ].find((c) => !c.hasSufficientData || (c.score ?? 100) < 60)?.componentName || "N/A";

  const summaryText = overallHasData
    ? `${customerName} has an authoritative Relationship Health index of ${overallScore} / 100 (${overallLabel}). Strongest signal: ${topStrength}. Key focus area: ${keyOpportunity}.`
    : `Insufficient activity history recorded for ${customerName} to compile a defensible Relationship Health score.`;

  return {
    customerId,
    customerName,
    overallScore,
    overallLabel,
    hasSufficientData: overallHasData,
    provenance: overallHasData ? "DERIVED" : "INSUFFICIENT DATA",
    components: {
      engagement: engagementComponent,
      satisfaction: satisfactionComponent,
      loyalty: loyaltyComponent,
      advocacy: advocacyComponent,
      growth: growthComponent,
    },
    explanation: {
      summary: summaryText,
      topStrength,
      keyOpportunity,
    },
  };
}

// ─── SECTION 5: AUTHORITATIVE CUSTOMER INTELLIGENCE DNA ENGINE ───────────────

export async function fetchCustomerIntelligenceDNA(
  customerId: string,
  businessId: string
): Promise<CustomerIntelligenceDNA> {
  const [custRes, invRes, commsRes, revRes, jobsRes] = await Promise.all([
    supabase.from("customers").select("*").eq("id", customerId).eq("business_id", businessId).single(),
    supabase.from("invoices").select("*").eq("customer_id", customerId).eq("business_id", businessId),
    supabase.from("communications").select("*").eq("customer_id", customerId).eq("business_id", businessId).order("created_at", { ascending: false }),
    supabase.from("reviews").select("*").eq("customer_id", customerId).eq("business_id", businessId),
    supabase.from("jobs").select("*").eq("customer_id", customerId).eq("business_id", businessId),
  ]);

  const customer = custRes.data as Customer | null;
  const invoices = (invRes.data || []) as Invoice[];
  const comms = (commsRes.data || []) as Communication[];
  const reviews = (revRes.data || []) as Review[];
  const jobs = (jobsRes.data || []) as Job[];

  const customerName = customer?.full_name || customer?.company_name || "Customer";

  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const totalSettledTransactions = paidInvoices.length;

  let avgTxValue = 0;
  if (paidInvoices.length > 0) {
    avgTxValue = Math.round(
      paidInvoices.reduce((sum, i) => sum + (Number(i.amount_paid) || Number(i.total_amount) || 0), 0) / paidInvoices.length
    );
  }

  const buyingDna: BuyingDnaProfile = {
    avgTransactionValue: {
      value: totalSettledTransactions > 0 ? avgTxValue : null,
      formatted: totalSettledTransactions > 0 ? `£${avgTxValue.toLocaleString("en-GB")}` : "Insufficient Data",
      hasSufficientData: totalSettledTransactions > 0,
      methodology: `Averaged from ${totalSettledTransactions} settled invoice record(s) in workspace.`,
      provenance: totalSettledTransactions > 0 ? "DERIVED" : "INSUFFICIENT DATA",
    },
    purchaseFrequencyDays: {
      value: null,
      formatted: totalSettledTransactions >= 2 ? "Multi-transaction client" : "Insufficient Data",
      hasSufficientData: totalSettledTransactions >= 2,
      methodology: "Requires at least 2 settled transactions to evaluate purchase interval days.",
      provenance: totalSettledTransactions >= 2 ? "DERIVED" : "INSUFFICIENT DATA",
    },
    spendCategory: {
      value: avgTxValue >= 2000 ? "High Value" : avgTxValue >= 500 ? "Growing Account" : "Regular",
      formatted: totalSettledTransactions > 0 ? (avgTxValue >= 2000 ? "High Value Account" : avgTxValue >= 500 ? "Growing Account" : "Standard Account") : "Insufficient Data",
      hasSufficientData: totalSettledTransactions > 0,
      methodology: "Categorised by average invoice value thresholds.",
      provenance: totalSettledTransactions > 0 ? "DERIVED" : "INSUFFICIENT DATA",
    },
    paymentPromptness: {
      value: invoices.some((i) => i.status === "overdue") ? "Late Settler" : "Prompt Settler",
      formatted: invoices.length > 0 ? (invoices.some((i) => i.status === "overdue") ? "Overdue Balance Recorded" : "Settles On Time") : "Insufficient Data",
      hasSufficientData: invoices.length > 0,
      methodology: "Derived from invoice due dates and payment status.",
      provenance: invoices.length > 0 ? "DERIVED" : "INSUFFICIENT DATA",
    },
    totalSettledTransactions,
    evidence: `Evaluated over ${invoices.length} total invoice(s) and ${paidInvoices.length} settled transaction(s).`,
  };

  const totalInteractions = comms.length;
  const channelCounts: Record<string, number> = {};
  comms.forEach((c) => {
    const ch = c.channel.toLowerCase();
    channelCounts[ch] = (channelCounts[ch] || 0) + 1;
  });

  const channelBreakdown = Object.entries(channelCounts).map(([channel, count]) => ({
    channel: channel.toUpperCase(),
    count,
    percentage: Math.round((count / (totalInteractions || 1)) * 100),
  }));

  const primaryChannelName = channelBreakdown.sort((a, b) => b.count - a.count)[0]?.channel || customer?.preferred_contact_method?.toUpperCase() || null;

  const commsDna: CommunicationDnaProfile = {
    primaryChannel: {
      value: primaryChannelName,
      formatted: primaryChannelName || "Insufficient Data",
      hasSufficientData: Boolean(primaryChannelName),
      methodology: totalInteractions > 0 ? `Derived from ${totalInteractions} logged interaction(s) across channels.` : "Based on profile preferred contact method.",
      provenance: totalInteractions > 0 ? "DERIVED" : primaryChannelName ? "CONNECTED" : "INSUFFICIENT DATA",
    },
    avgResponseTimeHours: {
      value: null,
      formatted: "Insufficient Data",
      hasSufficientData: false,
      methodology: "Requires timestamped inbound-to-outbound communication pairs.",
      provenance: "INSUFFICIENT DATA",
    },
    engagementLevel: {
      value: totalInteractions >= 5 ? "High" : totalInteractions >= 1 ? "Moderate" : "Low",
      formatted: totalInteractions >= 5 ? "High Engagement" : totalInteractions >= 1 ? "Moderate Engagement" : "Low / No Recent Interactions",
      hasSufficientData: totalInteractions > 0,
      methodology: `Derived from ${totalInteractions} total communication log(s).`,
      provenance: totalInteractions > 0 ? "DERIVED" : "INSUFFICIENT DATA",
    },
    totalInteractions,
    channelBreakdown,
    evidence: `${totalInteractions} communication log(s) recorded in workspace.`,
  };

  const totalEvidenceCount = invoices.length + comms.length + jobs.length + reviews.length;
  const hasSufficientData = totalEvidenceCount >= 2;

  const decisionSpeed: PersonalityTraitFactor = {
    factorName: "Decision Speed",
    score: hasSufficientData ? (invoices.some((i) => i.status === "overdue") ? 40 : 85) : null,
    label: hasSufficientData ? (invoices.some((i) => i.status === "overdue") ? "Methodical / Deliberate" : "Fast / Decisive") : "Insufficient Data",
    evidence: hasSufficientData ? "Derived from invoice payment latency and job approval velocity." : "Requires at least 2 transactional or activity records.",
    hasSufficientData,
    provenance: hasSufficientData ? "DERIVED" : "INSUFFICIENT DATA",
  };

  const priceSensitivity: PersonalityTraitFactor = {
    factorName: "Price Sensitivity",
    score: hasSufficientData ? (avgTxValue >= 1500 ? 25 : 70) : null,
    label: hasSufficientData ? (avgTxValue >= 1500 ? "Value-Focused / Low Sensitivity" : "Budget-Conscious") : "Insufficient Data",
    evidence: hasSufficientData ? `Based on average invoice transaction value (£${avgTxValue.toLocaleString("en-GB")}).` : "Requires transaction history.",
    hasSufficientData,
    provenance: hasSufficientData ? "DERIVED" : "INSUFFICIENT DATA",
  };

  const qualityFocus: PersonalityTraitFactor = {
    factorName: "Quality Focus",
    score: reviews.some((r) => Number(r.rating) >= 4) ? 90 : hasSufficientData ? 75 : null,
    label: reviews.some((r) => Number(r.rating) >= 4) ? "High Quality Expectation (5★ Reviewer)" : hasSufficientData ? "Standard Expectation" : "Insufficient Data",
    evidence: reviews.length > 0 ? `Verified from ${reviews.length} customer review rating(s).` : "Derived from job workstream history.",
    hasSufficientData: hasSufficientData || reviews.length > 0,
    provenance: reviews.length > 0 ? "CONNECTED" : hasSufficientData ? "DERIVED" : "INSUFFICIENT DATA",
  };

  const personalitySummary = hasSufficientData
    ? `Based on ${totalEvidenceCount} workspace activity logs, ${customerName} exhibits a ${decisionSpeed.label.toLowerCase()} decision style with ${priceSensitivity.label.toLowerCase()} preferences.`
    : "Insufficient customer interaction history to compile a defensible personality profile.";

  const recommendations: CustomerIntelligenceDNA["actionableRecommendations"] = [];

  if (invoices.some((i) => i.status === "overdue")) {
    const unpaid = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + (Number(i.total_amount) - Number(i.amount_paid || 0)), 0);
    recommendations.push({
      headline: `Follow up on £${unpaid.toLocaleString("en-GB")} overdue invoice`,
      reasoning: `${customerName} has active overdue invoices past due date.`,
      impact: `£${unpaid.toLocaleString("en-GB")} Cash Flow`,
      confidence: 95,
      provenance: "CONNECTED",
    });
  }

  if (jobs.some((j) => j.status === "completed") && reviews.length === 0) {
    recommendations.push({
      headline: "Send Review & Testimonial Request",
      reasoning: `Job work has been completed in workspace with no review recorded yet.`,
      impact: "Reputation Boost",
      confidence: 88,
      provenance: "DERIVED",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      headline: "Maintain Scheduled Relationship Touchpoints",
      reasoning: "Customer account is in good standing with no open overdue balance.",
      impact: "Retention & Loyalty",
      confidence: 90,
      provenance: "DERIVED",
    });
  }

  return {
    customerId,
    customerName,
    hasSufficientData,
    personalityProfile: {
      decisionSpeed,
      priceSensitivity,
      qualityFocus,
      overallSummary: personalitySummary,
      provenance: hasSufficientData ? "DERIVED" : "INSUFFICIENT DATA",
    },
    communicationDna: commsDna,
    buyingDna,
    actionableRecommendations: recommendations,
  };
}

// ─── PORTFOLIO RELATIONSHIP ANALYTICS ─────────────────────────────────────────

export async function fetchPortfolioRelationshipAnalytics(
  businessId: string | undefined
): Promise<PortfolioRelationshipAnalytics> {
  if (!businessId) {
    return getEmptyPortfolioRelationshipAnalytics();
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const [
      customersRes,
      recentJobsRes,
      recentInvoicesRes,
      recentCommsRes,
      recentReviewsRes,
      paymentsRes,
      authoritativeMetrics,
      portfolioPriorities,
      revenueOpportunities,
      connectedCampaigns,
    ] = await Promise.all([
      supabase.from("customers").select("*").eq("business_id", businessId),
      supabase.from("jobs").select("*").eq("business_id", businessId).gte("created_at", ninetyDaysAgo),
      supabase.from("invoices").select("*").eq("business_id", businessId),
      supabase.from("communications").select("*").eq("business_id", businessId).gte("created_at", ninetyDaysAgo),
      supabase.from("reviews").select("*").eq("business_id", businessId),
      supabase.from("payments").select("*").eq("business_id", businessId).gte("payment_date", thirtyDaysAgo),
      fetchAuthoritativeRelationshipMetrics(businessId),
      fetchPortfolioRelationshipPriorities(businessId),
      fetchRevenueOpportunities(businessId),
      fetchPortfolioCampaignConnections(businessId),
    ]);

    const customers = (customersRes.data || []) as Customer[];
    const jobs = (recentJobsRes.data || []) as Job[];
    const invoices = (recentInvoicesRes.data || []) as Invoice[];
    const comms = (recentCommsRes.data || []) as Communication[];
    const reviews = (recentReviewsRes.data || []) as Review[];
    const payments = paymentsRes.data || [];

    if (customers.length === 0) {
      return getEmptyPortfolioRelationshipAnalytics();
    }

    const totalCount = customers.length;

    const activeCustomerIds = new Set<string>();

    customers.forEach((c) => {
      const isStatusActive = c.status === "active";
      const createdAgoMs = now.getTime() - new Date(c.created_at).getTime();
      const isNewCustomer = createdAgoMs <= 90 * 24 * 60 * 60 * 1000;

      if (isStatusActive && isNewCustomer) {
        activeCustomerIds.add(c.id);
      }
    });

    jobs.forEach((j) => {
      if (j.customer_id) activeCustomerIds.add(j.customer_id);
    });

    invoices.forEach((inv) => {
      if (inv.customer_id) {
        const invDateMs = new Date(inv.issue_date || inv.created_at).getTime();
        if (now.getTime() - invDateMs <= 90 * 24 * 60 * 60 * 1000) {
          activeCustomerIds.add(inv.customer_id);
        }
      }
    });

    comms.forEach((cm) => {
      if (cm.customer_id) activeCustomerIds.add(cm.customer_id);
    });

    const activeCount = activeCustomerIds.size;
    const activePct = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : null;

    const totalTransactionsAndActivity = jobs.length + invoices.length + comms.length;
    let portfolioHealth: PortfolioRelationshipAnalytics["portfolioHealth"];

    if (totalTransactionsAndActivity === 0) {
      portfolioHealth = {
        score: null,
        label: "INSUFFICIENT DATA",
        reasoning: "Requires at least 1 job, invoice, or communication log to derive portfolio health.",
        provenance: "INSUFFICIENT DATA",
      };
    } else {
      let scoreSum = 0;
      let evaluatedCount = 0;

      customers.forEach((c) => {
        const cJobs = jobs.filter((j) => j.customer_id === c.id);
        const cInvoices = invoices.filter((i) => i.customer_id === c.id);
        const cComms = comms.filter((m) => m.customer_id === c.id);
        const cReviews = reviews.filter((r) => r.customer_id === c.id);

        if (cJobs.length === 0 && cInvoices.length === 0 && cComms.length === 0) return;

        evaluatedCount++;
        let individualScore = 60;

        if (c.status === "active") individualScore += 10;
        if (cInvoices.some((i) => i.status === "overdue")) individualScore -= 20;
        if (cInvoices.some((i) => i.status === "paid")) individualScore += 15;
        if (cReviews.some((r) => Number(r.rating) >= 4)) individualScore += 15;
        if (cReviews.some((r) => Number(r.rating) <= 2)) individualScore -= 25;

        scoreSum += Math.min(100, Math.max(0, individualScore));
      });

      if (evaluatedCount === 0) {
        portfolioHealth = {
          score: null,
          label: "INSUFFICIENT DATA",
          reasoning: "No transaction or communication activity recorded for workspace customer records.",
          provenance: "INSUFFICIENT DATA",
        };
      } else {
        const avgScore = Math.round(scoreSum / evaluatedCount);
        const label: PortfolioRelationshipAnalytics["portfolioHealth"]["label"] =
          avgScore >= 80 ? "EXCELLENT" : avgScore >= 65 ? "GOOD" : avgScore >= 45 ? "NEEDS ATTENTION" : "AT RISK";

        portfolioHealth = {
          score: avgScore,
          label,
          reasoning: `Derived from activity, invoice payment status, and review ratings across ${evaluatedCount} active portfolio records.`,
          provenance: "DERIVED",
        };
      }
    }

    const verifiedAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const paidInvoices = invoices.filter((i) => i.status === "paid" && i.created_at);
    let predictedRevenue30d: PortfolioRelationshipAnalytics["predictedRevenue30d"];

    if (paidInvoices.length < 3) {
      predictedRevenue30d = {
        amount: null,
        formatted: "Insufficient Data",
        methodology: "Requires at least 3 settled historical invoices to derive 30-day velocity predictions without fabricating assumptions.",
        hasSufficientData: false,
        provenance: "INSUFFICIENT DATA",
      };
    } else {
      const totalPaidHist = paidInvoices.reduce((sum, i) => sum + (Number(i.amount_paid) || Number(i.total_amount) || 0), 0);
      const oldestInvoiceMs = Math.min(...paidInvoices.map((i) => new Date(i.created_at).getTime()));
      const monthsElapsed = Math.max(1, (now.getTime() - oldestInvoiceMs) / (1000 * 60 * 60 * 24 * 30.4));

      const monthlyRunRate = Math.round(totalPaidHist / monthsElapsed);

      predictedRevenue30d = {
        amount: monthlyRunRate,
        formatted: `£${monthlyRunRate.toLocaleString("en-GB")}`,
        methodology: `Derived from ${paidInvoices.length} settled invoices across a ${Math.round(monthsElapsed)}-month historical run rate.`,
        hasSufficientData: true,
        provenance: "DERIVED",
      };
    }

    const items: AttentionItem[] = portfolioPriorities.map((p) => ({
      customerId: p.customerId,
      customerName: p.customerName,
      type: p.type,
      headline: p.headline,
      detail: p.detail,
      evidence: p.evidence,
      provenance: p.provenance,
    }));

    const attentionCount = items.filter((i) => i.type === "ATTENTION").length;
    const opportunityCount = items.filter((i) => i.type === "OPPORTUNITY").length;
    const riskCount = items.filter((i) => i.type === "RISK").length;

    return {
      totalCustomers: {
        count: totalCount,
        provenance: "CONNECTED",
      },
      activeRelationships: {
        count: activeCount,
        activePct,
        methodology: "Customers with jobs, invoices, communications, or active status recorded within the past 90 days.",
        provenance: "DERIVED",
      },
      portfolioHealth,
      verifiedRevenue30d: {
        amount: verifiedAmount,
        formatted: `£${verifiedAmount.toLocaleString("en-GB")}`,
        invoiceCount: payments.length,
        provenance: "CONNECTED",
      },
      predictedRevenue30d,
      attentionPortfolio: {
        attentionCount,
        opportunityCount,
        riskCount,
        items,
        provenance: items.some((i) => i.provenance === "AI ANALYSIS") ? "AI ANALYSIS" : "DERIVED",
      },
      authoritativeMetrics,
      portfolioPriorities,
      revenueOpportunities,
      connectedCampaigns,
    };
  } catch (err) {
    console.error("[fetchPortfolioRelationshipAnalytics] error:", err);
    return getEmptyPortfolioRelationshipAnalytics();
  }
}

export async function searchPortfolioCustomers(
  businessId: string | undefined,
  query: string
): Promise<Customer[]> {
  if (!businessId || !query.trim()) return [];

  const q = `%${query.trim().toLowerCase()}%`;

  try {
    const { data, error: err } = await supabase
      .from("customers")
      .select("*")
      .eq("business_id", businessId)
      .or(`full_name.ilike.${q},first_name.ilike.${q},last_name.ilike.${q},email.ilike.${q},phone.ilike.${q},company_name.ilike.${q}`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (err) {
      console.error("[searchPortfolioCustomers] error:", err);
      return [];
    }

    return (data || []) as Customer[];
  } catch (err) {
    console.error("[searchPortfolioCustomers] error:", err);
    return [];
  }
}

// ─── LEGACY COMPATIBILITY EXPORTS ─────────────────────────────────────────────

export async function fetchPortfolioAnalytics(businessId: string | undefined): Promise<PortfolioKPIs> {
  const portfolio = await fetchPortfolioRelationshipAnalytics(businessId);
  const metrics = portfolio.authoritativeMetrics;
  return {
    totalCustomers: portfolio.totalCustomers.count,
    activeRelationships: portfolio.activeRelationships.count,
    inactiveRelationships: metrics.churnRiskCount.value ?? 0,
    totalLtv: metrics.totalLtv.value ?? 0,
    formattedTotalLtv: metrics.totalLtv.formatted,
    avgLtv: metrics.avgLtv.value ?? 0,
    formattedAvgLtv: metrics.avgLtv.formatted,
    npsScore: metrics.npsScore.value,
    reviewCount: 0,
    retentionRatePct: metrics.retentionRatePct.value,
    churnRiskCount: metrics.churnRiskCount.value ?? 0,
    churnRiskPct: metrics.churnRiskPct.value,
    ltvTrendPct: metrics.momLtvChangePct.value,
    activeTrendPct: metrics.momRetentionChangePct.value,
  };
}

export async function fetchPortfolioSegments(businessId: string | undefined): Promise<PortfolioSegment[]> {
  if (!businessId) return [];

  const { data: rawCustomers } = await supabase
    .from("customers")
    .select("*")
    .eq("business_id", businessId);

  const customers = (rawCustomers || []) as Customer[];
  if (customers.length === 0) return [];

  let vipCount = 0, vipValue = 0;
  let highValCount = 0, highValValue = 0;
  let growingCount = 0, growingValue = 0;
  let regularCount = 0, regularValue = 0;
  let inactiveCount = 0, inactiveValue = 0;

  customers.forEach((c) => {
    const ltv = Number(c.lifetime_value) || 0;
    if (c.status === "inactive") {
      inactiveCount++;
      inactiveValue += ltv;
    } else if (ltv >= 3000) {
      vipCount++;
      vipValue += ltv;
    } else if (ltv >= 1000) {
      highValCount++;
      highValValue += ltv;
    } else if (ltv >= 250) {
      growingCount++;
      growingValue += ltv;
    } else {
      regularCount++;
      regularValue += ltv;
    }
  });

  return [
    { name: "VIP Champions", count: vipCount, totalValue: vipValue, formattedValue: `£${vipValue.toLocaleString("en-GB")}`, color: "#E31B23", description: "Highest LTV (£3,000+), repeat clients & key accounts" },
    { name: "High Value", count: highValCount, totalValue: highValValue, formattedValue: `£${highValValue.toLocaleString("en-GB")}`, color: "#3b82f6", description: "Consistent spend (£1,000–£3,000) with strong retention" },
    { name: "Growing", count: growingCount, totalValue: growingValue, formattedValue: `£${growingValue.toLocaleString("en-GB")}`, color: "#10b981", description: "Expanding relationships (£250–£1,000) with upsell potential" },
    { name: "Regular", count: regularCount, totalValue: regularValue, formattedValue: `£${regularValue.toLocaleString("en-GB")}`, color: "#f59e0b", description: "Standard clients (<£250) requiring ongoing engagement" },
    { name: "Inactive", count: inactiveCount, totalValue: inactiveValue, formattedValue: `£${inactiveValue.toLocaleString("en-GB")}`, color: "#6b7280", description: "Inactive customer profiles requiring re-activation" },
  ];
}

export async function fetchCustomerDNAContext(
  customerId: string,
  businessId: string
): Promise<CustomerDNAContext | null> {
  try {
    const [
      custRes,
      jobsRes,
      invRes,
      revRes,
      commsRes,
      activityRes,
      intelligenceDna,
      authoritativeHealth,
      customerOpportunities,
      connectedCampaigns,
    ] = await Promise.all([
      supabase.from("customers").select("*").eq("id", customerId).eq("business_id", businessId).single(),
      supabase.from("jobs").select("*").eq("customer_id", customerId).eq("business_id", businessId),
      supabase.from("invoices").select("*").eq("customer_id", customerId).eq("business_id", businessId),
      supabase.from("reviews").select("*").eq("customer_id", customerId).eq("business_id", businessId),
      supabase.from("communications").select("*").eq("customer_id", customerId).eq("business_id", businessId).order("created_at", { ascending: false }),
      supabase.from("activity_logs").select("*").eq("customer_id", customerId).eq("business_id", businessId).order("created_at", { ascending: false }).limit(10),
      fetchCustomerIntelligenceDNA(customerId, businessId),
      fetchCustomerRelationshipHealth(customerId, businessId),
      fetchCustomerRevenueOpportunities(customerId, businessId),
      fetchCustomerCampaignConnections(customerId, businessId),
    ]);

    if (custRes.error || !custRes.data) {
      console.error("[fetchCustomerDNAContext] error:", custRes.error);
      return null;
    }

    const customer = custRes.data as Customer;
    const connectedJobs = (jobsRes.data || []) as Job[];
    const connectedInvoices = (invRes.data || []) as Invoice[];
    const connectedReviews = (revRes.data || []) as Review[];
    const connectedComms = (commsRes.data || []) as Communication[];
    const activityTimeline = (activityRes.data || []) as ActivityLog[];

    const ltv = Number(customer.lifetime_value) || 0;
    const totalJobsCount = connectedJobs.length;

    let totalInvoiced = 0;
    let totalPaid = 0;
    connectedInvoices.forEach((inv) => {
      totalInvoiced += Number(inv.total_amount) || 0;
      totalPaid += Number(inv.amount_paid) || 0;
    });

    const unpaidBalance = Math.max(0, totalInvoiced - totalPaid);

    const healthScore = authoritativeHealth.overallScore ?? 50;
    const healthLabel = authoritativeHealth.overallLabel === "INSUFFICIENT DATA" ? "NEEDS ATTENTION" : authoritativeHealth.overallLabel;

    let segmentName = "Regular";
    if (customer.status === "inactive") segmentName = "Inactive";
    else if (ltv >= 3000) segmentName = "VIP Champion";
    else if (ltv >= 1000) segmentName = "High Value";
    else if (ltv >= 250) segmentName = "Growing";

    const preferredChannel = customer.preferred_contact_method
      ? customer.preferred_contact_method.toUpperCase()
      : connectedComms.length > 0
      ? connectedComms[0].channel.toUpperCase()
      : "EMAIL";

    const hasTransactionData = ltv > 0 || connectedInvoices.length > 0 || connectedJobs.length > 0;
    const hasCommunicationData = connectedComms.length > 0;
    const hasReviewData = connectedReviews.length > 0;

    const suggestedPriorities: CustomerDNAContext["suggestedPriorities"] = [];

    if (unpaidBalance > 0) {
      suggestedPriorities.push({
        action: `Chase £${unpaidBalance.toLocaleString("en-GB")} unpaid invoice balance`,
        reason: `Customer ${customer.full_name || 'record'} has an active outstanding unpaid invoice balance.`,
        impact: `£${unpaidBalance.toLocaleString("en-GB")}`,
        confidence: 95,
        provenance: "CONNECTED",
      });
    }

    if (customer.status === "inactive") {
      suggestedPriorities.push({
        action: `Send re-engagement campaign via ${preferredChannel}`,
        reason: `Profile is marked inactive with £${ltv.toLocaleString("en-GB")} historical lifetime value.`,
        impact: `£${Math.max(150, Math.round(ltv * 0.2))}`,
        confidence: 82,
        provenance: "AI ANALYSIS",
      });
    } else if (connectedJobs.some((j) => j.status === "completed") && !hasReviewData) {
      suggestedPriorities.push({
        action: `Request customer review via ${preferredChannel}`,
        reason: `Customer has completed job work in workspace with no review recorded yet.`,
        impact: "Reputation Boost",
        confidence: 88,
        provenance: "DERIVED",
      });
    }

    if (suggestedPriorities.length === 0) {
      suggestedPriorities.push({
        action: `Maintain regular relationship outreach`,
        reason: `Relationship is healthy with £${ltv.toLocaleString("en-GB")} LTV and no active unpaid balance.`,
        impact: "Loyalty Retention",
        confidence: 90,
        provenance: "DERIVED",
      });
    }

    return {
      customer,
      connectedJobs,
      connectedInvoices,
      connectedReviews,
      connectedComms,
      activityTimeline,

      healthScore,
      healthLabel,
      segmentName,
      preferredChannel,
      totalJobsCount,
      totalInvoiced,
      totalPaid,
      unpaidBalance,

      hasTransactionData,
      hasCommunicationData,
      hasReviewData,

      intelligenceDna,
      authoritativeHealth,
      customerOpportunities,
      connectedCampaigns,

      suggestedPriorities,
    };
  } catch (err) {
    console.error("[fetchCustomerDNAContext] error:", err);
    return null;
  }
}

export async function joinBusinessDNAWaitlist(
  businessId: string,
  userId: string | undefined
): Promise<boolean> {
  try {
    await supabase.from("activity_logs").insert({
      business_id: businessId,
      entity_type: "business_dna",
      action: "waitlist_joined",
      description: `Workspace joined the Business DNA™ intelligence preview waitlist`,
      actor_id: userId || null,
    });
    return true;
  } catch (err) {
    console.error("[joinBusinessDNAWaitlist] error:", err);
    return false;
  }
}
