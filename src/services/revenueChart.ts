import { supabase } from "@/lib/supabase";

export type TimeframeOption =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "6months"
  | "year"
  | "custom";

export interface ChartDataPoint {
  d: string;
  r: number;
}

export interface FinancialMetricValue {
  value: string;
  trend: number | null;
  hasData: boolean;
}

export interface RevenueChartData {
  timeframeLabel: string;
  chartData: ChartDataPoint[];
  totalRevenue: FinancialMetricValue;
  totalExpenses: FinancialMetricValue;
  netProfit: FinancialMetricValue;
  aiObservations: string[];
  hasData: boolean;
}

export async function fetchRevenueChartData(
  businessId: string | undefined,
  timeframe: TimeframeOption,
  customStart?: string,
  customEnd?: string
): Promise<RevenueChartData> {
  if (!businessId) {
    return getEmptyChartData("No active workspace connected.");
  }

  try {
    const { data: payments } = await supabase
      .from("payments")
      .select("amount, payment_date")
      .eq("business_id", businessId);

    const allPayments = payments || [];
    const now = new Date();

    let startDate: Date;
    let endDate: Date = new Date(now);
    let timeframeLabel = "Month to date";

    switch (timeframe) {
      case "day":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        timeframeLabel = "Today";
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        timeframeLabel = "Last 7 days";
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        timeframeLabel = "This month";
        break;
      case "quarter":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        timeframeLabel = "Last quarter (3 months)";
        break;
      case "6months":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 6);
        timeframeLabel = "Last 6 months";
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        timeframeLabel = "Last 12 months";
        break;
      case "custom":
        startDate = customStart ? new Date(customStart) : new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = customEnd ? new Date(customEnd) : new Date(now);
        timeframeLabel = `Custom (${startDate.toISOString().slice(0, 10)} to ${endDate.toISOString().slice(0, 10)})`;
        break;
    }

    const startIso = startDate.toISOString().slice(0, 10);
    const endIso = endDate.toISOString().slice(0, 10);

    // Calculate Preceding Comparison Period for Trend
    const periodDurationDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86400000));
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(startDate.getDate() - periodDurationDays);
    const prevStartIso = prevStartDate.toISOString().slice(0, 10);

    const currentPayments = allPayments.filter(
      (p) => p.payment_date && p.payment_date >= startIso && p.payment_date <= `${endIso}T23:59:59`
    );

    const prevPayments = allPayments.filter(
      (p) => p.payment_date && p.payment_date >= prevStartIso && p.payment_date < startIso
    );

    const totalRevenueVal = currentPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const prevRevenueVal = prevPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);

    let revenueTrend: number | null = null;
    if (prevRevenueVal > 0) {
      revenueTrend = Math.round(((totalRevenueVal - prevRevenueVal) / prevRevenueVal) * 100);
    }

    // Build Chart Granularity Data Points
    const chartData: ChartDataPoint[] = [];

    if (timeframe === "day") {
      // 24-hour aggregation
      for (let h = 0; h < 24; h += 3) {
        const label = `${h.toString().padStart(2, "0")}:00`;
        const hourTotal = currentPayments
          .filter((p) => {
            const date = new Date(p.payment_date);
            return date.getHours() >= h && date.getHours() < h + 3;
          })
          .reduce((s, p) => s + (Number(p.amount) || 0), 0);
        chartData.push({ d: label, r: hourTotal });
      }
    } else if (timeframe === "week" || timeframe === "month") {
      // Daily aggregation
      const cur = new Date(startDate);
      while (cur <= endDate) {
        const ds = cur.toISOString().slice(0, 10);
        const dayLabel = cur.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        const dayTotal = currentPayments
          .filter((p) => p.payment_date && p.payment_date.startsWith(ds))
          .reduce((s, p) => s + (Number(p.amount) || 0), 0);
        chartData.push({ d: dayLabel, r: dayTotal });
        cur.setDate(cur.getDate() + (timeframe === "month" ? 2 : 1));
      }
    } else {
      // Monthly aggregation for quarter, 6months, year, custom
      const cur = new Date(startDate);
      while (cur <= endDate) {
        const yr = cur.getFullYear();
        const mo = cur.getMonth();
        const monthLabel = cur.toLocaleDateString("en-GB", { month: "short" });
        const monthTotal = currentPayments
          .filter((p) => {
            const pd = new Date(p.payment_date);
            return pd.getFullYear() === yr && pd.getMonth() === mo;
          })
          .reduce((s, p) => s + (Number(p.amount) || 0), 0);
        chartData.push({ d: monthLabel, r: monthTotal });
        cur.setMonth(cur.getMonth() + 1);
      }
    }

    const hasData = currentPayments.length > 0;

    const aiObservations = hasData
      ? [
          `Total revenue captured for ${timeframeLabel.toLowerCase()} is £${totalRevenueVal.toLocaleString()}.`,
          revenueTrend !== null
            ? `Revenue is trending ${revenueTrend >= 0 ? "+" : ""}${revenueTrend}% compared to the preceding period.`
            : "Sufficient historical comparison data will calculate trend movements automatically.",
          `Recorded across ${currentPayments.length} verified payment transactions.`,
        ]
      : [
          "No verified payment transactions recorded for this timeframe yet.",
          "Revenue graphs update automatically as payments are received in your workspace.",
        ];

    return {
      timeframeLabel,
      chartData: chartData.length > 0 ? chartData : [{ d: "Now", r: 0 }],
      totalRevenue: {
        value: `£${totalRevenueVal.toLocaleString()}`,
        trend: revenueTrend,
        hasData,
      },
      totalExpenses: {
        value: "N/A",
        trend: null,
        hasData: false, // Schema does not contain expense tracking table
      },
      netProfit: {
        value: "N/A",
        trend: null,
        hasData: false, // Requires expense tracking to calculate net profit without fabrication
      },
      aiObservations,
      hasData,
    };
  } catch (err) {
    console.error("[fetchRevenueChartData] error:", err);
    return getEmptyChartData("Error loading workspace revenue graph.");
  }
}

function getEmptyChartData(msg: string): RevenueChartData {
  return {
    timeframeLabel: "This month",
    chartData: [{ d: "Now", r: 0 }],
    totalRevenue: { value: "£0", trend: null, hasData: false },
    totalExpenses: { value: "N/A", trend: null, hasData: false },
    netProfit: { value: "N/A", trend: null, hasData: false },
    aiObservations: [msg],
    hasData: false,
  };
}
