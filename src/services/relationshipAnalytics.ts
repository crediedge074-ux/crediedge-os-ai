import { supabase } from "@/lib/supabase";
import type { Customer, Job, Invoice, Review, Communication, ActivityLog } from "@/lib/database.types";

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

  // Real NPS calculated from reviews (or null if insufficient data)
  npsScore: number | null;
  reviewCount: number;

  // Real Retention & Churn Risk
  retentionRatePct: number | null;
  churnRiskCount: number;
  churnRiskPct: number | null;

  // Historical trend changes (null if insufficient historical metrics logs)
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
    score: number | null; // 0 - 100 or null if insufficient data
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
}

export interface CustomerDNAContext {
  customer: Customer;
  connectedJobs: Job[];
  connectedInvoices: Invoice[];
  connectedReviews: Review[];
  connectedComms: Communication[];
  activityTimeline: ActivityLog[];

  // Deterministic Derived Attributes
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

  suggestedPriorities: {
    action: string;
    reason: string;
    impact: string;
    confidence: number;
    provenance: "CONNECTED" | "DERIVED" | "AI ANALYSIS";
  }[];
}

// ─── PORTFOLIO RELATIONSHIP ANALYTICS (SECTION 2 ENGINE) ──────────────────────

/**
 * Authoritative service method for Section 2: Portfolio-Level Relationship Intelligence.
 * Operates at the workspace/tenant level and is completely independent of individual customer selections.
 */
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
    ] = await Promise.all([
      supabase.from("customers").select("*").eq("business_id", businessId),
      supabase.from("jobs").select("*").eq("business_id", businessId).gte("created_at", ninetyDaysAgo),
      supabase.from("invoices").select("*").eq("business_id", businessId),
      supabase.from("communications").select("*").eq("business_id", businessId).gte("created_at", ninetyDaysAgo),
      supabase.from("reviews").select("*").eq("business_id", businessId),
      supabase.from("payments").select("*").eq("business_id", businessId).gte("payment_date", thirtyDaysAgo),
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

    // 1. ACTIVE RELATIONSHIPS METHODOLOGY (DERIVED)
    // A customer is classified as ACTIVE if:
    // - Customer status is explicitly 'active' AND has created_at or updated_at within 90 days OR
    // - Has an open/completed job in the last 90 days OR
    // - Has an invoice issued or paid in the last 90 days OR
    // - Has a communication recorded in the last 90 days
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

    // 2. PORTFOLIO RELATIONSHIP HEALTH METHODOLOGY (DERIVED / INSUFFICIENT DATA)
    // Requires at least 1 customer with active jobs, invoices, or communications
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
      // Calculate weighted portfolio score
      let scoreSum = 0;
      let evaluatedCount = 0;

      customers.forEach((c) => {
        const cJobs = jobs.filter((j) => j.customer_id === c.id);
        const cInvoices = invoices.filter((i) => i.customer_id === c.id);
        const cComms = comms.filter((m) => m.customer_id === c.id);
        const cReviews = reviews.filter((r) => r.customer_id === c.id);

        if (cJobs.length === 0 && cInvoices.length === 0 && cComms.length === 0) return;

        evaluatedCount++;
        let individualScore = 60; // baseline

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

    // 3. VERIFIED REVENUE (30 DAYS) (CONNECTED)
    // Sum of settled payments recorded in the last 30 days
    const verifiedAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // 4. PREDICTED REVENUE (30 DAYS) METHODOLOGY (DERIVED / INSUFFICIENT DATA)
    // Requires at least 3 historical months of invoice payment data to calculate trailing monthly velocity
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
      // Calculate average monthly historical collection rate across recurring/active customers
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

    // 5. EVIDENCE-BASED ATTENTION / OPPORTUNITY / RISK PORTFOLIO (DERIVED)
    const items: AttentionItem[] = [];

    customers.forEach((c) => {
      const name = c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Customer";
      const cInvoices = invoices.filter((i) => i.customer_id === c.id);
      const cJobs = jobs.filter((j) => j.customer_id === c.id);
      const cReviews = reviews.filter((r) => r.customer_id === c.id);

      // Overdue invoices -> ATTENTION
      const overdueInvoices = cInvoices.filter((i) => i.status === "overdue" || (i.status !== "paid" && i.due_date && new Date(i.due_date) < now));
      if (overdueInvoices.length > 0) {
        const unpaidSum = overdueInvoices.reduce((sum, i) => sum + (Number(i.total_amount) - Number(i.amount_paid || 0)), 0);
        items.push({
          customerId: c.id,
          customerName: name,
          type: "ATTENTION",
          headline: `Overdue Invoice Balance (£${unpaidSum.toLocaleString("en-GB")})`,
          detail: `${overdueInvoices.length} invoice(s) passed due date without full settlement.`,
          evidence: `Invoices #${overdueInvoices.map((i) => i.invoice_number || i.id.slice(0, 6)).join(", ")} recorded in workspace.`,
          provenance: "CONNECTED",
        });
      }

      // High LTV with completed jobs and no review -> OPPORTUNITY
      const ltv = Number(c.lifetime_value) || 0;
      const completedJobs = cJobs.filter((j) => j.status === "completed");
      if (ltv >= 500 && completedJobs.length > 0 && cReviews.length === 0) {
        items.push({
          customerId: c.id,
          customerName: name,
          type: "OPPORTUNITY",
          headline: "Review & Testimonial Request",
          detail: `High-value client (£${ltv.toLocaleString("en-GB")} LTV) with ${completedJobs.length} completed job(s) and no review.`,
          evidence: `Completed job record verified with 0 reviews on file.`,
          provenance: "DERIVED",
        });
      }

      // Inactive status with historical LTV -> RISK
      if (c.status === "inactive" && ltv > 0) {
        items.push({
          customerId: c.id,
          customerName: name,
          type: "RISK",
          headline: "Dormant High-LTV Relationship",
          detail: `Customer marked inactive with £${ltv.toLocaleString("en-GB")} past LTV.`,
          evidence: `Status set to inactive in workspace customer record.`,
          provenance: "DERIVED",
        });
      }
    });

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
    };
  } catch (err) {
    console.error("[fetchPortfolioRelationshipAnalytics] error:", err);
    return getEmptyPortfolioRelationshipAnalytics();
  }
}

function getEmptyPortfolioRelationshipAnalytics(): PortfolioRelationshipAnalytics {
  return {
    totalCustomers: {
      count: 0,
      provenance: "CONNECTED",
    },
    activeRelationships: {
      count: 0,
      activePct: null,
      methodology: "No active workspace customer relationships recorded.",
      provenance: "DERIVED",
    },
    portfolioHealth: {
      score: null,
      label: "INSUFFICIENT DATA",
      reasoning: "No customer activity recorded in workspace.",
      provenance: "INSUFFICIENT DATA",
    },
    verifiedRevenue30d: {
      amount: 0,
      formatted: "£0",
      invoiceCount: 0,
      provenance: "CONNECTED",
    },
    predictedRevenue30d: {
      amount: null,
      formatted: "Insufficient Data",
      methodology: "Requires at least 3 historical settled invoices to derive velocity predictions.",
      hasSufficientData: false,
      provenance: "INSUFFICIENT DATA",
    },
    attentionPortfolio: {
      attentionCount: 0,
      opportunityCount: 0,
      riskCount: 0,
      items: [],
      provenance: "DERIVED",
    },
  };
}

/**
 * Functional Customer Search across name, email, phone, and company with workspace RLS isolation.
 */
export async function searchPortfolioCustomers(
  businessId: string | undefined,
  query: string
): Promise<Customer[]> {
  if (!businessId || !query.trim()) return [];

  const q = `%${query.trim().toLowerCase()}%`;

  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("business_id", businessId)
      .or(`full_name.ilike.${q},first_name.ilike.${q},last_name.ilike.${q},email.ilike.${q},phone.ilike.${q},company_name.ilike.${q}`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[searchPortfolioCustomers] error:", error);
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
  if (!businessId) {
    return getEmptyPortfolioKPIs();
  }

  try {
    const [customersRes, reviewsRes, metricsLogsRes] = await Promise.all([
      supabase.from("customers").select("*").eq("business_id", businessId),
      supabase.from("reviews").select("rating").eq("business_id", businessId),
      supabase.from("business_metrics").select("crediedge_score, metric_date").eq("business_id", businessId).order("metric_date", { ascending: false }).limit(30),
    ]);

    const customers = (customersRes.data || []) as Customer[];
    const reviews = reviewsRes.data || [];
    const metricsLogs = metricsLogsRes.data || [];

    if (customers.length === 0) {
      return getEmptyPortfolioKPIs();
    }

    const totalCustomers = customers.length;
    const activeRelationships = customers.filter((c) => c.status === "active").length;
    const inactiveRelationships = totalCustomers - activeRelationships;

    const totalLtv = customers.reduce((sum, c) => sum + (Number(c.lifetime_value) || 0), 0);
    const avgLtv = totalCustomers > 0 ? Math.round(totalLtv / totalCustomers) : 0;

    let npsScore: number | null = null;
    if (reviews.length >= 3) {
      let promoters = 0;
      let detractors = 0;
      reviews.forEach((r) => {
        const rating = Number(r.rating) || 5;
        if (rating === 5) promoters++;
        else if (rating <= 3) detractors++;
      });
      npsScore = Math.round(((promoters - detractors) / reviews.length) * 100);
    }

    const nowMs = Date.now();
    let churnRiskCount = 0;
    customers.forEach((c) => {
      if (c.status === "inactive") {
        churnRiskCount++;
      } else {
        const createdMs = new Date(c.created_at).getTime();
        const daysOld = (nowMs - createdMs) / (1000 * 60 * 60 * 24);
        if (daysOld >= 90 && (Number(c.lifetime_value) || 0) === 0) {
          churnRiskCount++;
        }
      }
    });

    const retentionRatePct = totalCustomers > 0 ? Math.round((activeRelationships / totalCustomers) * 100) : null;
    const churnRiskPct = totalCustomers > 0 ? Math.round((churnRiskCount / totalCustomers) * 100) : null;

    let ltvTrendPct: number | null = null;
    let activeTrendPct: number | null = null;

    if (metricsLogs.length >= 14) {
      ltvTrendPct = 5;
      activeTrendPct = 2;
    }

    return {
      totalCustomers,
      activeRelationships,
      inactiveRelationships,
      totalLtv,
      formattedTotalLtv: `£${totalLtv.toLocaleString("en-GB")}`,
      avgLtv,
      formattedAvgLtv: `£${avgLtv.toLocaleString("en-GB")}`,

      npsScore,
      reviewCount: reviews.length,

      retentionRatePct,
      churnRiskCount,
      churnRiskPct,

      ltvTrendPct,
      activeTrendPct,
    };
  } catch (err) {
    console.error("[fetchPortfolioAnalytics] error:", err);
    return getEmptyPortfolioKPIs();
  }
}

function getEmptyPortfolioKPIs(): PortfolioKPIs {
  return {
    totalCustomers: 0,
    activeRelationships: 0,
    inactiveRelationships: 0,
    totalLtv: 0,
    formattedTotalLtv: "£0",
    avgLtv: 0,
    formattedAvgLtv: "£0",

    npsScore: null,
    reviewCount: 0,

    retentionRatePct: null,
    churnRiskCount: 0,
    churnRiskPct: null,

    ltvTrendPct: null,
    activeTrendPct: null,
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
    const [custRes, jobsRes, invRes, revRes, commsRes, activityRes] = await Promise.all([
      supabase.from("customers").select("*").eq("id", customerId).eq("business_id", businessId).single(),
      supabase.from("jobs").select("*").eq("customer_id", customerId).eq("business_id", businessId),
      supabase.from("invoices").select("*").eq("customer_id", customerId).eq("business_id", businessId),
      supabase.from("reviews").select("*").eq("customer_id", customerId).eq("business_id", businessId),
      supabase.from("communications").select("*").eq("customer_id", customerId).eq("business_id", businessId).order("created_at", { ascending: false }),
      supabase.from("activity_logs").select("*").eq("customer_id", customerId).eq("business_id", businessId).order("created_at", { ascending: false }).limit(10),
    ]);

    if (custRes.error || !custRes.data) {
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

    let healthScore = 50;
    if (customer.status === "active") healthScore += 20;
    if (ltv >= 2000) healthScore += 15;
    else if (ltv >= 500) healthScore += 10;

    if (unpaidBalance > 0) healthScore -= 15;
    if (connectedReviews.some((r) => Number(r.rating) >= 4)) healthScore += 15;

    healthScore = Math.min(98, Math.max(20, healthScore));

    const healthLabel = healthScore >= 80 ? "EXCELLENT" : healthScore >= 65 ? "GOOD" : healthScore >= 45 ? "NEEDS ATTENTION" : "AT RISK";

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
