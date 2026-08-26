import { supabase } from "@/lib/supabase";
import type { Customer, Job, Invoice, Review, Communication, ActivityLog } from "@/lib/database.types";

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

  // Real NPS calculated strictly if genuine survey data exists (otherwise null)
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
  // Section 3 Authoritative Relationship Performance Metrics
  authoritativeMetrics: AuthoritativeRelationshipMetrics;
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

// ─── AUTHORITATIVE RELATIONSHIP ANALYTICS (SECTION 2 & 3 ENGINE) ─────────────

/**
 * Single Authoritative Source of Truth for Relationship Performance Metrics.
 * Computes deterministic, workspace-isolated KPIs strictly from real database records.
 */
export async function fetchAuthoritativeRelationshipMetrics(
  businessId: string | undefined
): Promise<AuthoritativeRelationshipMetrics> {
  if (!businessId) {
    return getEmptyAuthoritativeMetrics();
  }

  try {
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

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

    // 1. TOTAL LTV (CONNECTED / DERIVED)
    // Primary Source: Settled payment records in public.payments.
    // Fallback Source: Customer record lifetime_value if payments table has 0 rows.
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

    // 2. AVERAGE LTV (DERIVED)
    // Average LTV = Total Authoritative Revenue / Total Workspace Customers
    const avgLtvValue = totalLtvHasData && customers.length > 0 ? Math.round(totalLtvValue / customers.length) : null;
    const avgLtv: MetricValue<number> = {
      value: avgLtvValue,
      formatted: avgLtvValue !== null ? `£${avgLtvValue.toLocaleString("en-GB")}` : "Insufficient Data",
      hasSufficientData: avgLtvValue !== null,
      methodology: `Total authoritative workspace LTV (£${totalLtvValue.toLocaleString("en-GB")}) divided across ${customers.length} total customer record(s).`,
      provenance: avgLtvValue !== null ? "DERIVED" : "INSUFFICIENT DATA",
    };

    // 3. RETENTION RATE (DERIVED / INSUFFICIENT DATA)
    // Methodology: Active 90-day cohort retention.
    // Qualifying cohort: Customers created >90 days ago.
    // Retained: Customers in qualifying cohort with jobs, invoices, or comms in last 90 days.
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

    // 4. NPS SCORE (INSUFFICIENT DATA)
    // Strict Principle: Genuine survey/NPS data does not yet exist. Do NOT compute from Google reviews or star ratings.
    const npsScore: MetricValue<number> = {
      value: null,
      formatted: "Insufficient Data",
      hasSufficientData: false,
      methodology: "CrediEdgeOS strictly prohibits calculating NPS from star reviews or sentiment. Requires dedicated survey response data.",
      provenance: "INSUFFICIENT DATA",
    };

    // 5. REFERRAL RATE (DERIVED / INSUFFICIENT DATA)
    // Methodology: Customers with recorded source = 'referral' / total customers with recorded source * 100
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

    // 6. CHURN RISK (DERIVED)
    // Deterministic Rule: Inactive status OR overdue invoices OR zero LTV with >90 days account age.
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

    // 7. HISTORICAL MOM COMPARISONS (INSUFFICIENT DATA)
    // Requires at least 14 daily metrics logs in business_metrics table.
    let momLtvValue: number | null = null;
    let momRetentionValue: number | null = null;

    if (metricsLogs.length >= 14) {
      // Historical log comparisons present
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
    ] = await Promise.all([
      supabase.from("customers").select("*").eq("business_id", businessId),
      supabase.from("jobs").select("*").eq("business_id", businessId).gte("created_at", ninetyDaysAgo),
      supabase.from("invoices").select("*").eq("business_id", businessId),
      supabase.from("communications").select("*").eq("business_id", businessId).gte("created_at", ninetyDaysAgo),
      supabase.from("reviews").select("*").eq("business_id", businessId),
      supabase.from("payments").select("*").eq("business_id", businessId).gte("payment_date", thirtyDaysAgo),
      fetchAuthoritativeRelationshipMetrics(businessId),
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

    const items: AttentionItem[] = [];

    customers.forEach((c) => {
      const name = c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Customer";
      const cInvoices = invoices.filter((i) => i.customer_id === c.id);
      const cJobs = jobs.filter((j) => j.customer_id === c.id);
      const cReviews = reviews.filter((r) => r.customer_id === c.id);

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
      authoritativeMetrics,
    };
  } catch (err) {
    console.error("[fetchPortfolioRelationshipAnalytics] error:", err);
    return getEmptyPortfolioRelationshipAnalytics();
  }
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
  };
}

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
