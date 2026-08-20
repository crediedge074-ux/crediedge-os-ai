import { supabase } from "@/lib/supabase";

export interface SnapshotMetric {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  unit: string;
  insight: string;
  sparklineData?: { v: number }[];
  hasData: boolean;
}

export interface BusinessSnapshotData {
  revenueToday: SnapshotMetric;
  revenueMtd: SnapshotMetric;
  newEnquiries: SnapshotMetric;
  bookedJobs: SnapshotMetric;
  conversionRate: SnapshotMetric;
  avgReviewRating: SnapshotMetric;
  aiInterpretation: string;
}

export async function fetchBusinessSnapshot(
  businessId: string | undefined
): Promise<BusinessSnapshotData> {
  if (!businessId) {
    return getEmptySnapshot("No active workspace connected. Please log in or select a business.");
  }

  try {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const startOfMtd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
    const prevMonthSameDay = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().slice(0, 10);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);
    const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().slice(0, 10);

    // 1. Fetch Payments for Revenue Calculations
    const { data: payments } = await supabase
      .from("payments")
      .select("amount, payment_date")
      .eq("business_id", businessId);

    const allPayments = payments || [];

    // Revenue Today & Yesterday
    const todayRevenue = allPayments
      .filter((p) => p.payment_date && p.payment_date.startsWith(todayStr))
      .reduce((s, p) => s + (Number(p.amount) || 0), 0);

    const yesterdayRevenue = allPayments
      .filter((p) => p.payment_date && p.payment_date.startsWith(yesterdayStr))
      .reduce((s, p) => s + (Number(p.amount) || 0), 0);

    let todayTrend = 0;
    if (yesterdayRevenue > 0) {
      todayTrend = Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100);
    }

    // Revenue MTD & Previous MTD
    const mtdRevenue = allPayments
      .filter((p) => p.payment_date && p.payment_date >= startOfMtd)
      .reduce((s, p) => s + (Number(p.amount) || 0), 0);

    const prevMtdRevenue = allPayments
      .filter((p) => p.payment_date && p.payment_date >= prevMonthStart && p.payment_date <= prevMonthSameDay)
      .reduce((s, p) => s + (Number(p.amount) || 0), 0);

    let mtdTrend = 0;
    if (prevMtdRevenue > 0) {
      mtdTrend = Math.round(((mtdRevenue - prevMtdRevenue) / prevMtdRevenue) * 100);
    }

    // Daily Sparkline for MTD (Last 12 days)
    const sparklineData = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (11 - i));
      const ds = d.toISOString().slice(0, 10);
      const dayTotal = allPayments
        .filter((p) => p.payment_date && p.payment_date.startsWith(ds))
        .reduce((s, p) => s + (Number(p.amount) || 0), 0);
      return { v: dayTotal };
    });

    // 2. Fetch Inbound Communications for Enquiries
    const { data: comms } = await supabase
      .from("communications")
      .select("created_at, direction")
      .eq("business_id", businessId)
      .eq("direction", "inbound");

    const allComms = comms || [];
    const last7Comms = allComms.filter((c) => c.created_at && c.created_at >= sevenDaysAgoStr).length;
    const prev7Comms = allComms.filter((c) => c.created_at && c.created_at >= fourteenDaysAgoStr && c.created_at < sevenDaysAgoStr).length;

    let commsTrend = 0;
    if (prev7Comms > 0) {
      commsTrend = Math.round(((last7Comms - prev7Comms) / prev7Comms) * 100);
    }

    // 3. Fetch Booked Jobs
    const { data: jobs } = await supabase
      .from("jobs")
      .select("created_at, status")
      .eq("business_id", businessId);

    const allJobs = jobs || [];
    const last7Jobs = allJobs.filter((j) => j.created_at && j.created_at >= sevenDaysAgoStr).length;
    const prev7Jobs = allJobs.filter((j) => j.created_at && j.created_at >= fourteenDaysAgoStr && j.created_at < sevenDaysAgoStr).length;

    let jobsTrend = 0;
    if (prev7Jobs > 0) {
      jobsTrend = Math.round(((last7Jobs - prev7Jobs) / prev7Jobs) * 100);
    }

    // 4. Conversion Rate Calculations
    const conversionRateVal = last7Comms > 0 ? Math.round((last7Jobs / last7Comms) * 100) : 0;
    const prevConversionRateVal = prev7Comms > 0 ? Math.round((prev7Jobs / prev7Comms) * 100) : 0;
    const conversionTrend = prevConversionRateVal > 0 ? Math.round(conversionRateVal - prevConversionRateVal) : 0;

    // 5. Fetch Reviews for Average Rating
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("business_id", businessId);

    const allReviews = reviews || [];
    const totalReviews = allReviews.length;
    const avgRatingVal = totalReviews > 0
      ? (allReviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / totalReviews).toFixed(1)
      : "0.0";

    const hasAnyData =
      allPayments.length > 0 || allComms.length > 0 || allJobs.length > 0 || totalReviews > 0;

    if (!hasAnyData) {
      return getEmptySnapshot("Workspace activity pending. Your Business Snapshot will automatically calculate as payments, jobs, enquiries, and reviews are recorded.");
    }

    return {
      revenueToday: {
        title: "Revenue Today",
        value: `£${todayRevenue.toLocaleString()}`,
        trend: todayTrend,
        trendLabel: "vs yesterday",
        unit: "%",
        insight: yesterdayRevenue > 0 ? `Yesterday: £${yesterdayRevenue.toLocaleString()}` : "Active workspace tracking",
        sparklineData,
        hasData: allPayments.length > 0,
      },
      revenueMtd: {
        title: "Revenue (MTD)",
        value: `£${mtdRevenue.toLocaleString()}`,
        trend: mtdTrend,
        trendLabel: "vs prev month MTD",
        unit: "%",
        insight: prevMtdRevenue > 0 ? `Prev MTD: £${prevMtdRevenue.toLocaleString()}` : "Month-to-date tracking",
        sparklineData,
        hasData: allPayments.length > 0,
      },
      newEnquiries: {
        title: "New Enquiries",
        value: String(last7Comms),
        trend: commsTrend,
        trendLabel: "vs prev 7 days",
        unit: "%",
        insight: prev7Comms > 0 ? `Prev 7 days: ${prev7Comms}` : "Inbound enquiry tracking",
        hasData: allComms.length > 0,
      },
      bookedJobs: {
        title: "Booked Jobs",
        value: String(last7Jobs),
        trend: jobsTrend,
        trendLabel: "vs prev 7 days",
        unit: "%",
        insight: prev7Jobs > 0 ? `Prev 7 days: ${prev7Jobs}` : "Job booking tracking",
        hasData: allJobs.length > 0,
      },
      conversionRate: {
        title: "Conversion Rate",
        value: `${conversionRateVal}%`,
        trend: conversionTrend,
        trendLabel: "pts vs prev 7d",
        unit: "pts",
        insight: last7Comms > 0 ? `${last7Jobs} jobs from ${last7Comms} enquiries` : "Inquiries-to-jobs ratio",
        hasData: last7Comms > 0,
      },
      avgReviewRating: {
        title: "Avg. Review Rating",
        value: avgRatingVal,
        trend: 0,
        trendLabel: "total reviews",
        unit: "★",
        insight: totalReviews > 0 ? `${totalReviews} total customer review${totalReviews > 1 ? "s" : ""}` : "Customer review tracking",
        hasData: totalReviews > 0,
      },
      aiInterpretation: `Workspace snapshot active: MTD revenue stands at £${mtdRevenue.toLocaleString()} across ${allPayments.length} transactions, with ${last7Comms} inbound enquiries and ${last7Jobs} booked jobs in the last 7 days.`,
    };
  } catch (err) {
    console.error("[fetchBusinessSnapshot] error:", err);
    return getEmptySnapshot("Unable to load snapshot metrics at this time.");
  }
}

function getEmptySnapshot(msg: string): BusinessSnapshotData {
  const emptyMetric = (title: string): SnapshotMetric => ({
    title,
    value: "£0",
    trend: 0,
    trendLabel: "no data",
    unit: "%",
    insight: "Pending data",
    hasData: false,
  });

  return {
    revenueToday: emptyMetric("Revenue Today"),
    revenueMtd: emptyMetric("Revenue (MTD)"),
    newEnquiries: { ...emptyMetric("New Enquiries"), value: "0" },
    bookedJobs: { ...emptyMetric("Booked Jobs"), value: "0" },
    conversionRate: { ...emptyMetric("Conversion Rate"), value: "0%" },
    avgReviewRating: { ...emptyMetric("Avg. Review Rating"), value: "0.0", unit: "★" },
    aiInterpretation: msg,
  };
}
