import { supabase } from "@/lib/supabase";

export interface BriefingMetrics {
  greetingName: string;
  overdueInvoicesCount: number;
  overdueInvoicesAmount: number;
  awaitingEnquiriesCount: number;
  eligibleReviewsCount: number;
  pendingFollowupsCount: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  revenueChangePct: number | null;
  totalOpportunityToday: number;
  hasHistoricalData: boolean;
  revenueInsightText: string;
}

export async function fetchMorningBriefingMetrics(
  businessId: string | undefined,
  firstNameFromProfile?: string | null
): Promise<BriefingMetrics> {
  const greetingName = firstNameFromProfile?.trim() || "there";

  if (!businessId) {
    return {
      greetingName,
      overdueInvoicesCount: 0,
      overdueInvoicesAmount: 0,
      awaitingEnquiriesCount: 0,
      eligibleReviewsCount: 0,
      pendingFollowupsCount: 0,
      todayRevenue: 0,
      yesterdayRevenue: 0,
      revenueChangePct: null,
      totalOpportunityToday: 0,
      hasHistoricalData: false,
      revenueInsightText: "No business workspace connected yet. Please log in or select an active business workspace to view your morning briefing.",
    };
  }

  try {
    // 1. Fetch overdue/unpaid invoices
    const { data: invoices } = await supabase
      .from("invoices")
      .select("total_amount, amount_paid, due_date, status")
      .eq("business_id", businessId);

    const nowIso = new Date().toISOString().slice(0, 10);
    const overdueInvoices = (invoices || []).filter((inv) => {
      const balance = (Number(inv.total_amount) || 0) - (Number(inv.amount_paid) || 0);
      return balance > 0 && inv.due_date < nowIso && inv.status !== "paid";
    });

    const overdueInvoicesCount = overdueInvoices.length;
    const overdueInvoicesAmount = overdueInvoices.reduce(
      (sum, inv) => sum + ((Number(inv.total_amount) || 0) - (Number(inv.amount_paid) || 0)),
      0
    );

    // 2. Fetch unread inbound communications / enquiries (count only - no fabricated £ impact)
    const { data: communications } = await supabase
      .from("communications")
      .select("id, read_at, direction")
      .eq("business_id", businessId)
      .eq("direction", "inbound")
      .is("read_at", null);

    const awaitingEnquiriesCount = (communications || []).length;

    // 3. Fetch customers eligible for review / followups (count only - no fabricated £ impact)
    const { data: customers } = await supabase
      .from("customers")
      .select("id, status, last_booking_at, last_contacted_at, lifetime_value")
      .eq("business_id", businessId)
      .eq("is_active", true);

    const activeCustomers = customers || [];
    const eligibleReviewsCount = activeCustomers.filter(
      (c) => c.last_booking_at && (Number(c.lifetime_value) || 0) > 0
    ).length;

    const pendingFollowupsCount = activeCustomers.filter((c) => {
      if (!c.last_contacted_at) return true;
      const daysSince = (Date.now() - new Date(c.last_contacted_at).getTime()) / 86400000;
      return daysSince > 14;
    }).length;

    // 4. Calculate real Today vs Yesterday revenue from `payments` table (the true financial source)
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);

    const { data: payments } = await supabase
      .from("payments")
      .select("amount, payment_date")
      .eq("business_id", businessId);

    const allPayments = payments || [];
    const todayRevenue = allPayments
      .filter((p) => p.payment_date && p.payment_date.startsWith(todayStr))
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const yesterdayRevenue = allPayments
      .filter((p) => p.payment_date && p.payment_date.startsWith(yesterdayStr))
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    let revenueChangePct: number | null = null;
    if (yesterdayRevenue > 0) {
      revenueChangePct = Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100);
    }

    const hasHistoricalData =
      allPayments.length > 0 || overdueInvoicesCount > 0 || awaitingEnquiriesCount > 0 || activeCustomers.length > 0;

    let revenueInsightText = "";

    if (!hasHistoricalData) {
      revenueInsightText =
        "Welcome to your Command Centre! As you add customers, invoices, and receive enquiries, your morning briefing will automatically calculate revenue trends, urgent action items, and growth opportunities.";
    } else {
      const parts: string[] = [];
      if (yesterdayRevenue > 0) {
        if (revenueChangePct !== null && revenueChangePct >= 0) {
          parts.push(`Today's revenue is currently £${todayRevenue.toLocaleString()} (+${revenueChangePct}% vs yesterday's £${yesterdayRevenue.toLocaleString()})`);
        } else if (revenueChangePct !== null) {
          parts.push(`Today's revenue is currently £${todayRevenue.toLocaleString()} (${revenueChangePct}% vs yesterday's £${yesterdayRevenue.toLocaleString()})`);
        }
      } else if (todayRevenue > 0) {
        parts.push(`Today's revenue is £${todayRevenue.toLocaleString()}`);
      }

      if (overdueInvoicesCount > 0) {
        parts.push(`${overdueInvoicesCount} overdue invoice${overdueInvoicesCount > 1 ? "s" : ""} require collection (£${overdueInvoicesAmount.toLocaleString()})`);
      }
      if (awaitingEnquiriesCount > 0) {
        parts.push(`${awaitingEnquiriesCount} enquiry${awaitingEnquiriesCount > 1 ? "ies" : ""} awaiting response`);
      }
      if (pendingFollowupsCount > 0) {
        parts.push(`${pendingFollowupsCount} customer${pendingFollowupsCount > 1 ? "s" : ""} due for follow-up`);
      }

      if (parts.length > 0) {
        revenueInsightText = `Workspace summary: ${parts.join("; ")}.`;
      } else {
        revenueInsightText = "All invoices, communications, and customer interactions are up to date! Great job maintaining smooth business operations.";
      }
    }

    // Direct confirmed recoverable financial opportunity = total overdue invoice balance
    const totalOpportunityToday = overdueInvoicesAmount;

    return {
      greetingName,
      overdueInvoicesCount,
      overdueInvoicesAmount,
      awaitingEnquiriesCount,
      eligibleReviewsCount,
      pendingFollowupsCount,
      todayRevenue,
      yesterdayRevenue,
      revenueChangePct,
      totalOpportunityToday,
      hasHistoricalData,
      revenueInsightText,
    };
  } catch (err) {
    console.error("[fetchMorningBriefingMetrics] error:", err);
    return {
      greetingName,
      overdueInvoicesCount: 0,
      overdueInvoicesAmount: 0,
      awaitingEnquiriesCount: 0,
      eligibleReviewsCount: 0,
      pendingFollowupsCount: 0,
      todayRevenue: 0,
      yesterdayRevenue: 0,
      revenueChangePct: null,
      totalOpportunityToday: 0,
      hasHistoricalData: false,
      revenueInsightText: "Unable to load briefing data at this moment. Please check your network or try refreshing.",
    };
  }
}
