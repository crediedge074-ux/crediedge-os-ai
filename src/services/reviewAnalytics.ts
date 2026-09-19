import type { ExtendedReview } from "@/services/reviews";
import type { DataProvenanceMeta } from "@/services/aiGovernance";

export interface ReviewAnalyticsResult {
  hasSufficientData: boolean;
  provenance: DataProvenanceMeta;
  totalReviews: number;
  avgRating: number | null;
  fiveStarRate: number | null;
  responseRate: number | null;
  unansweredNegativeCount: number;
  sourceBreakdown: { source: string; count: number; percentage: number }[];
  insufficientDataReason?: string;
}

export function calculateReviewAnalytics(
  reviews: ExtendedReview[]
): ReviewAnalyticsResult {
  const total = reviews.length;

  if (total === 0) {
    return {
      hasSufficientData: false,
      provenance: {
        type: "INSUFFICIENT DATA",
        methodology: "No customer reviews recorded in this business workspace yet.",
        evidenceCount: 0,
        dataSources: ["reviews table"],
      },
      totalReviews: 0,
      avgRating: null,
      fiveStarRate: null,
      responseRate: null,
      unansweredNegativeCount: 0,
      sourceBreakdown: [],
      insufficientDataReason:
        "No reviews recorded for this workspace yet. Connect your review platform or request reviews from recent customers.",
    };
  }

  // Calculate average rating
  const ratedReviews = reviews.filter((r) => typeof r.rating === "number" && r.rating !== null);
  const avgRating =
    ratedReviews.length > 0
      ? Number(
          (
            ratedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            ratedReviews.length
          ).toFixed(1)
        )
      : null;

  // 5-Star Rate
  const fiveStarCount = ratedReviews.filter((r) => r.rating === 5).length;
  const fiveStarRate =
    ratedReviews.length > 0
      ? Math.round((fiveStarCount / ratedReviews.length) * 100)
      : null;

  // Response Rate
  const repliedCount = reviews.filter((r) => r.status === "replied").length;
  const responseRate = Math.round((repliedCount / total) * 100);

  // Unanswered Negative Reviews (rating <= 3 and status != 'replied')
  const unansweredNegativeCount = reviews.filter(
    (r) => (r.rating || 0) <= 3 && r.status !== "replied"
  ).length;

  // Source Breakdown
  const sourceMap: Record<string, number> = {};
  for (const r of reviews) {
    const s = r.source || "Direct";
    sourceMap[s] = (sourceMap[s] || 0) + 1;
  }

  const sourceBreakdown = Object.entries(sourceMap).map(([source, count]) => ({
    source,
    count,
    percentage: Math.round((count / total) * 100),
  }));

  return {
    hasSufficientData: true,
    provenance: {
      type: "DERIVED",
      methodology:
        "Derived directly from verified workspace review records in Supabase.",
      evidenceCount: total,
      dataSources: ["reviews table"],
      lastUpdated: new Date().toISOString(),
    },
    totalReviews: total,
    avgRating,
    fiveStarRate,
    responseRate,
    unansweredNegativeCount,
    sourceBreakdown,
  };
}
