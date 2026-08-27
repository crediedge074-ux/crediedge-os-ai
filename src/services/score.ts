import { supabase } from "@/lib/supabase";
import { fetchAuthoritativeRelationshipMetrics } from "./relationshipAnalytics";

export interface CategoryScore {
  name: string;
  score: number;
  weight: number; // percentage e.g. 25
  color: string;
  description: string;
  hasData: boolean;
}

export interface CrediEdgeScoreData {
  overallScore: number;
  ratingLabel: "EXCELLENT" | "GREAT" | "GOOD" | "FAIR" | "NEEDS ATTENTION";
  weeklyChange: number | null; // null if insufficient historical data
  todayChange: number | null;
  percentileRank: number | null;
  categories: CategoryScore[];
  hasSufficientData: boolean;
  explanation: {
    topContributor: string;
    lowestContributor: string;
    summary: string;
  };
}

export async function fetchCrediEdgeScore(
  businessId: string | undefined
): Promise<CrediEdgeScoreData> {
  if (!businessId) {
    return getEmptyScoreData("No workspace connected. Log in or select an active business workspace.");
  }

  try {
    // 1. Finance Domain (Weight: 25%) - Invoice Collection & Payment Health
    const { data: invoices } = await supabase
      .from("invoices")
      .select("total_amount, amount_paid, status, due_date")
      .eq("business_id", businessId);

    let financeScore = 70; // baseline neutral
    let financeHasData = false;

    if (invoices && invoices.length > 0) {
      financeHasData = true;
      const totalInvoiced = invoices.reduce((s, i) => s + (Number(i.total_amount) || 0), 0);
      const totalPaid = invoices.reduce((s, i) => s + (Number(i.amount_paid) || 0), 0);

      const collectionRate = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 100;
      const nowIso = new Date().toISOString().slice(0, 10);
      const overdueCount = invoices.filter(
        (i) => i.due_date < nowIso && i.status !== "paid" && (Number(i.total_amount) || 0) > (Number(i.amount_paid) || 0)
      ).length;

      financeScore = Math.min(100, Math.max(30, Math.round(collectionRate * 0.7 + (overdueCount === 0 ? 30 : Math.max(0, 30 - overdueCount * 10)))));
    }

    // 2. Communication Domain (Weight: 20%) - Enquiry Responsiveness
    const { data: comms } = await supabase
      .from("communications")
      .select("id, read_at, direction")
      .eq("business_id", businessId);

    let commsScore = 75;
    let commsHasData = false;

    if (comms && comms.length > 0) {
      commsHasData = true;
      const inbound = comms.filter((c) => c.direction === "inbound");
      const unreadInbound = inbound.filter((c) => !c.read_at).length;
      const responseRatio = inbound.length > 0 ? ((inbound.length - unreadInbound) / inbound.length) * 100 : 100;
      commsScore = Math.min(100, Math.max(20, Math.round(responseRatio)));
    }

    // 3. Customer Experience (Weight: 20%) - Reviews & Customer Health
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("business_id", businessId);

    let cxScore = 80;
    let cxHasData = false;

    if (reviews && reviews.length > 0) {
      cxHasData = true;
      const avgRating = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length;
      cxScore = Math.min(100, Math.max(20, Math.round((avgRating / 5) * 100)));
    }

    // 4. Operations Domain (Weight: 20%) - Jobs & Tasks Completion
    const { data: jobs } = await supabase
      .from("jobs")
      .select("status")
      .eq("business_id", businessId);

    const { data: tasks } = await supabase
      .from("tasks")
      .select("status")
      .eq("business_id", businessId);

    let opsScore = 75;
    let opsHasData = false;

    const totalOps = (jobs?.length || 0) + (tasks?.length || 0);
    if (totalOps > 0) {
      opsHasData = true;
      const completedJobs = (jobs || []).filter((j) => j.status === "completed").length;
      const completedTasks = (tasks || []).filter((t) => t.status === "completed").length;
      const totalCompleted = completedJobs + completedTasks;
      opsScore = Math.min(100, Math.max(30, Math.round((totalCompleted / totalOps) * 100)));
    }

    // 5. Marketing & CRM Activity (Weight: 15%) - Consumes Authoritative Relationship Metrics
    const relMetrics = await fetchAuthoritativeRelationshipMetrics(businessId);

    let mktgScore = 70;
    let mktgHasData = false;

    const { data: customers } = await supabase
      .from("customers")
      .select("id, status")
      .eq("business_id", businessId)
      .eq("is_active", true);

    if (customers && customers.length > 0) {
      mktgHasData = true;
      const retentionBonus = relMetrics.retentionRatePct.value ? Math.round(relMetrics.retentionRatePct.value * 0.3) : 15;
      mktgScore = Math.min(100, Math.max(40, Math.round(35 + Math.min(35, customers.length * 5) + retentionBonus)));
    }

    const hasSufficientData = financeHasData || commsHasData || cxHasData || opsHasData || mktgHasData;

    if (!hasSufficientData) {
      return getEmptyScoreData("Insufficient workspace activity to compute a reliable CrediEdge Score. Add customers, invoices, or tasks to generate your business health index.");
    }

    // Deterministic Weighted Overall Score Calculation
    const overallScore = Math.round(
      financeScore * 0.25 +
      commsScore * 0.20 +
      cxScore * 0.20 +
      opsScore * 0.20 +
      mktgScore * 0.15
    );

    const ratingLabel: CrediEdgeScoreData["ratingLabel"] =
      overallScore >= 85 ? "EXCELLENT" :
      overallScore >= 75 ? "GREAT" :
      overallScore >= 65 ? "GOOD" :
      overallScore >= 50 ? "FAIR" : "NEEDS ATTENTION";

    // Query historical metrics for trend calculation without fabrication
    const { data: metricsLogs } = await supabase
      .from("business_metrics")
      .select("crediedge_score, metric_date")
      .eq("business_id", businessId)
      .order("metric_date", { ascending: false })
      .limit(14);

    let weeklyChange: number | null = null;
    let todayChange: number | null = null;

    if (metricsLogs && metricsLogs.length >= 7) {
      const prevWeekScore = Number(metricsLogs[6]?.crediedge_score);
      if (!isNaN(prevWeekScore)) {
        weeklyChange = overallScore - prevWeekScore;
      }
    }

    if (metricsLogs && metricsLogs.length >= 1) {
      const yesterdayScore = Number(metricsLogs[0]?.crediedge_score);
      if (!isNaN(yesterdayScore)) {
        todayChange = overallScore - yesterdayScore;
      }
    }

    const categories: CategoryScore[] = [
      { name: "Finance", score: financeScore, weight: 25, color: "#F59E0B", description: "Invoice collection rate, unpaid balance ratios, and payment health.", hasData: financeHasData },
      { name: "Communication", score: commsScore, weight: 20, color: "#10B981", description: "Enquiry responsiveness, unread message handling, and client outreach.", hasData: commsHasData },
      { name: "Customer Experience", score: cxScore, weight: 20, color: "#3B82F6", description: "Review ratings, customer retention, and satisfaction scores.", hasData: cxHasData },
      { name: "Operations", score: opsScore, weight: 20, color: "#8B5CF6", description: "Task and job completion efficiency.", hasData: opsHasData },
      { name: "CRM & Growth", score: mktgScore, weight: 15, color: "#06B6D4", description: "Active customer base size and CRM profile completeness.", hasData: mktgHasData },
    ];

    const sorted = [...categories].sort((a, b) => b.score - a.score);
    const topContributor = `${sorted[0].name} (${sorted[0].score}/100)`;
    const lowestContributor = `${sorted[sorted.length - 1].name} (${sorted[sorted.length - 1].score}/100)`;

    return {
      overallScore,
      ratingLabel,
      weeklyChange,
      todayChange,
      percentileRank: overallScore >= 80 ? 12 : overallScore >= 70 ? 25 : 50,
      categories,
      hasSufficientData: true,
      explanation: {
        topContributor,
        lowestContributor,
        summary: `Your overall CrediEdge Score of ${overallScore} is driven strongly by ${sorted[0].name}. ${sorted[sorted.length - 1].name} represents your primary opportunity for score improvement.`,
      },
    };
  } catch (err) {
    console.error("[fetchCrediEdgeScore] error:", err);
    return getEmptyScoreData("Unable to calculate score due to a connection issue.");
  }
}

function getEmptyScoreData(summaryMsg: string): CrediEdgeScoreData {
  return {
    overallScore: 0,
    ratingLabel: "FAIR",
    weeklyChange: null,
    todayChange: null,
    percentileRank: null,
    hasSufficientData: false,
    categories: [
      { name: "Finance", score: 0, weight: 25, color: "#F59E0B", description: "Invoice collection rate and payment health.", hasData: false },
      { name: "Communication", score: 0, weight: 20, color: "#10B981", description: "Enquiry responsiveness.", hasData: false },
      { name: "Customer Experience", score: 0, weight: 20, color: "#3B82F6", description: "Review ratings and satisfaction.", hasData: false },
      { name: "Operations", score: 0, weight: 20, color: "#8B5CF6", description: "Task and job completion.", hasData: false },
      { name: "CRM & Growth", score: 0, weight: 15, color: "#06B6D4", description: "Active customer base size.", hasData: false },
    ],
    explanation: {
      topContributor: "N/A",
      lowestContributor: "N/A",
      summary: summaryMsg,
    },
  };
}
