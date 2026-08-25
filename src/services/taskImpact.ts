import { supabase } from "@/lib/supabase";
import { fetchCrediEdgeScore, type CrediEdgeScoreData } from "./score";
import type { Task } from "@/lib/database.types";

export type TargetMetricKey =
  | "revenue"
  | "cash_collection"
  | "customer_retention"
  | "reviews_reputation"
  | "response_time"
  | "conversion"
  | "operational_efficiency"
  | "automation_time_saved"
  | "none";

export interface TaskBusinessImpactEvaluation {
  taskId: string;
  taskTitle: string;
  targetMetric: TargetMetricKey;
  targetMetricLabel: string;
  isCompleted: boolean;

  // Estimated Impact
  estimatedImpactValue: number; // e.g. currency or minutes
  estimatedImpactFormatted: string;

  // Verified Result
  hasMeasuredData: boolean;
  metricChangedName: string;
  previousValueFormatted: string;
  newValueFormatted: string;
  absoluteChangeFormatted: string;
  verificationSource: "directly_measured" | "insufficient_data";
  verifiedSummaryNotes: string;

  // CrediEdge Score Impact
  scoreCategoryName: string;
  scoreCategoryWeightPct: number;
  scoreConfirmedChange: number | null; // null or number (e.g., +2, 0, -1)
  currentOverallScore: number;
  scoreExplanation: string;
}

export const TARGET_METRIC_OPTIONS: {
  key: TargetMetricKey;
  label: string;
  description: string;
  scoreFactor: string;
}[] = [
  {
    key: "none",
    label: "No Specific Metric Target",
    description: "Use when the task is not intended to directly improve a specific measurable business outcome.",
    scoreFactor: "Operations",
  },
  {
    key: "revenue",
    label: "Revenue Growth",
    description: "Tasks intended to generate or increase revenue.",
    scoreFactor: "Finance",
  },
  {
    key: "cash_collection",
    label: "Cash Collection & Cashflow",
    description: "Tasks intended to collect outstanding money or improve cashflow.",
    scoreFactor: "Finance",
  },
  {
    key: "customer_retention",
    label: "Customer Retention & LTV",
    description: "Tasks intended to retain customers or increase customer value.",
    scoreFactor: "CRM & Growth",
  },
  {
    key: "reviews_reputation",
    label: "Reviews & Reputation",
    description: "Tasks intended to improve reviews, ratings or reputation.",
    scoreFactor: "Customer Experience",
  },
  {
    key: "response_time",
    label: "Enquiry Response Time",
    description: "Tasks intended to reduce the time taken to respond to enquiries.",
    scoreFactor: "Communication",
  },
  {
    key: "conversion",
    label: "Sales & Conversion",
    description: "Tasks intended to improve leads, sales or conversion rates.",
    scoreFactor: "CRM & Growth",
  },
  {
    key: "operational_efficiency",
    label: "Operational Efficiency",
    description: "Tasks intended to make the business operate faster or more efficiently.",
    scoreFactor: "Operations",
  },
  {
    key: "automation_time_saved",
    label: "Automation / Time Saved",
    description: "Tasks intended to reduce manual work or save measurable time.",
    scoreFactor: "Operations",
  },
];

export async function evaluateTaskBusinessImpact(
  task: Task & { target_metric?: string },
  businessId: string
): Promise<TaskBusinessImpactEvaluation> {
  const metricKey = (task.target_metric as TargetMetricKey) || "none";
  const option = TARGET_METRIC_OPTIONS.find((o) => o.key === metricKey) || TARGET_METRIC_OPTIONS[0];

  const estimatedValue = Number(task.estimated_impact_value) || 0;
  let estimatedFormatted = "Unmeasured";
  if (estimatedValue > 0) {
    if (metricKey === "automation_time_saved" || metricKey === "operational_efficiency") {
      estimatedFormatted = `${estimatedValue} mins saved`;
    } else if (metricKey === "reviews_reputation" || metricKey === "response_time") {
      estimatedFormatted = `${estimatedValue} pts impact`;
    } else {
      estimatedFormatted = `£${estimatedValue.toLocaleString("en-GB")}`;
    }
  }

  // 1. Fetch Authoritative CrediEdge Score Data
  const scoreData: CrediEdgeScoreData = await fetchCrediEdgeScore(businessId);

  // Default evaluation response for insufficient data or uncompleted tasks
  let hasMeasuredData = false;
  let metricChangedName = option.label;
  let previousValueFormatted = "N/A";
  let newValueFormatted = "N/A";
  let absoluteChangeFormatted = "0";
  let verificationSource: "directly_measured" | "insufficient_data" = "insufficient_data";
  let verifiedSummaryNotes = "Insufficient data in connected business records to verify actual impact.";
  let scoreConfirmedChange: number | null = null;
  let scoreExplanation = "Completed tasks contribute to the Operations health index. No score inflation occurs without verified metric changes.";

  const isCompleted = task.status === "completed";

  // 2. Measure actual business metric changes based on connected entities
  if (isCompleted) {
    const taskInvoiceId = (task as any).invoice_id;
    if (taskInvoiceId) {
      // Check cash collection / revenue connected to this task
      const { data: inv } = await supabase
        .from("invoices")
        .select("total_amount, amount_paid, status")
        .eq("id", taskInvoiceId)
        .eq("business_id", businessId)
        .single();

      if (inv) {
        const paid = Number(inv.amount_paid) || 0;
        const total = Number(inv.total_amount) || 0;
        hasMeasuredData = paid > 0;
        if (hasMeasuredData) {
          verificationSource = "directly_measured";
          metricChangedName = "Connected Invoice Payment";
          previousValueFormatted = "£0.00";
          newValueFormatted = `£${paid.toLocaleString("en-GB")}`;
          absoluteChangeFormatted = `+£${paid.toLocaleString("en-GB")}`;
          verifiedSummaryNotes = `Connected invoice recorded £${paid.toLocaleString("en-GB")} in collected payments against total invoice of £${total.toLocaleString("en-GB")}.`;
          scoreConfirmedChange = scoreData.todayChange ?? 0;
          scoreExplanation = `Verified invoice payment contributed to the Finance health index (${scoreData.categories.find(c => c.name === "Finance")?.score || 70}/100).`;
        }
      }
    } else if (task.customer_id && (metricKey === "reviews_reputation" || metricKey === "customer_retention")) {
      // Check reviews or customer status
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating, status")
        .eq("customer_id", task.customer_id)
        .eq("business_id", businessId);

      if (reviews && reviews.length > 0) {
        const publishedReviews = reviews.filter((r) => r.status === "published" || r.rating);
        if (publishedReviews.length > 0) {
          hasMeasuredData = true;
          verificationSource = "directly_measured";
          metricChangedName = "Customer Review Rating";
          const lastRating = publishedReviews[publishedReviews.length - 1].rating || 5;
          previousValueFormatted = "No Review";
          newValueFormatted = `${lastRating} ★`;
          absoluteChangeFormatted = `+${lastRating} Stars`;
          verifiedSummaryNotes = `Connected customer submitted a verified ${lastRating}-star rating.`;
          scoreConfirmedChange = scoreData.todayChange ?? 0;
          scoreExplanation = `Verified rating enhanced Customer Experience health index (${scoreData.categories.find(c => c.name === "Customer Experience")?.score || 80}/100).`;
        }
      }
    }

    // If no connected entity gave measured data, check task time entries
    if (!hasMeasuredData) {
      const { data: timeEntries } = await (supabase as any)
        .from("task_time_entries")
        .select("duration_minutes")
        .eq("task_id", task.id)
        .eq("business_id", businessId);

      if (timeEntries && timeEntries.length > 0) {
        const actualMins = (timeEntries as any[]).reduce((s, e) => s + (Number(e.duration_minutes) || 0), 0);
        const estMins = Number(task.estimated_minutes) || 30;
        const savedMins = Math.max(0, estMins - actualMins);

        if (actualMins > 0) {
          hasMeasuredData = true;
          verificationSource = "directly_measured";
          metricChangedName = "Work Duration & Efficiency";
          previousValueFormatted = `${estMins} mins estimated`;
          newValueFormatted = `${actualMins} mins actual`;
          absoluteChangeFormatted = savedMins > 0 ? `-${savedMins} mins variance` : `+${actualMins - estMins} mins overage`;
          verifiedSummaryNotes = savedMins > 0
            ? `Task completed in ${actualMins} mins (${savedMins} mins saved vs ${estMins} min estimate).`
            : `Task completed in ${actualMins} mins against ${estMins} min estimate.`;
          scoreConfirmedChange = scoreData.todayChange ?? 0;
          scoreExplanation = `Task completion contributed to the Operations health index (${scoreData.categories.find(c => c.name === "Operations")?.score || 75}/100).`;
        }
      }
    }
  }

  return {
    taskId: task.id,
    taskTitle: task.title,
    targetMetric: metricKey,
    targetMetricLabel: option.label,
    isCompleted,

    estimatedImpactValue: estimatedValue,
    estimatedImpactFormatted: estimatedFormatted,

    hasMeasuredData,
    metricChangedName,
    previousValueFormatted,
    newValueFormatted,
    absoluteChangeFormatted,
    verificationSource,
    verifiedSummaryNotes,

    scoreCategoryName: option.scoreFactor,
    scoreCategoryWeightPct: option.scoreFactor === "Finance" ? 25 : option.scoreFactor === "Communication" ? 20 : option.scoreFactor === "Customer Experience" ? 20 : option.scoreFactor === "Operations" ? 20 : 15,
    scoreConfirmedChange,
    currentOverallScore: scoreData.overallScore,
    scoreExplanation,
  };
}
