import { supabase } from "@/lib/supabase";
import { fetchCrediEdgeScore } from "./score";
import type { StoredRecommendation } from "./advisor";

export interface BusinessMilestone {
  id: string;
  category: "Revenue" | "Recommendations" | "Customers" | "Reviews" | "Operations" | "Score" | "Time Saved";
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  progressPct: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
  unitPrefix?: string;
  unitSuffix?: string;
}

export interface BusinessMilestonesOverview {
  milestones: BusinessMilestone[];
  nextMilestone: BusinessMilestone | null;
  unlockedCount: number;
  totalCount: number;
}

export async function fetchBusinessMilestones(businessId: string | undefined): Promise<BusinessMilestonesOverview> {
  if (!businessId) {
    return {
      milestones: [],
      nextMilestone: null,
      unlockedCount: 0,
      totalCount: 0,
    };
  }

  try {
    // 1. Fetch real workspace raw data in parallel
    const [
      paymentsRes,
      recsRes,
      custRes,
      revsRes,
      tasksRes,
      scoreRes,
      unlockedRes,
    ] = await Promise.all([
      supabase.from("payments").select("amount").eq("business_id", businessId),
      supabase.from("ai_recommendations").select("*").eq("business_id", businessId).eq("status", "completed"),
      supabase.from("customers").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      supabase.from("tasks").select("id", { count: "exact", head: true }).eq("business_id", businessId).eq("status", "completed"),
      fetchCrediEdgeScore(businessId),
      (supabase.from as any)("business_achievements").select("*").eq("business_id", businessId),
    ]);

    // Real Revenue = sum of recorded payments
    const totalRecordedRevenue = (paymentsRes.data || []).reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

    // Real Completed Recommendations
    const completedRecs = (recsRes.data || []) as StoredRecommendation[];
    const completedRecsCount = completedRecs.length;

    // Real Verified Time Saved (minutes)
    const verifiedTimeSavedMinutes = completedRecs.reduce((acc, r) => {
      const minutes = r.actual_outcome?.time_saved_minutes;
      return acc + (typeof minutes === "number" ? minutes : 0);
    }, 0);
    const verifiedTimeSavedHours = Math.round((verifiedTimeSavedMinutes / 60) * 10) / 10;

    // Real Customers
    const customerCount = custRes.count || 0;

    // Real Reviews
    const reviewCount = revsRes.count || 0;

    // Real Completed Tasks / Operations
    const completedTasksCount = tasksRes.count || 0;

    // Real CrediEdge Score
    const overallScore = scoreRes.hasSufficientData ? scoreRes.overallScore : 0;

    // Unlocked achievements history map
    const unlockedMap: Record<string, string> = {};
    ((unlockedRes.data || []) as any[]).forEach((row) => {
      unlockedMap[row.milestone_id] = row.unlocked_at;
    });

    // Milestone Catalogue Definitions
    const catalogueDefinitions: Array<{
      id: string;
      category: BusinessMilestone["category"];
      title: string;
      description: string;
      targetValue: number;
      currentValue: number;
      unitPrefix?: string;
      unitSuffix?: string;
    }> = [
      // Revenue Milestones
      {
        id: "rev-500",
        category: "Revenue",
        title: "First £500 Revenue",
        description: "Reach £500 in total payments recorded across your business.",
        targetValue: 500,
        currentValue: totalRecordedRevenue,
        unitPrefix: "£",
      },
      {
        id: "rev-1000",
        category: "Revenue",
        title: "£1,000 Revenue Benchmark",
        description: "Reach £1,000 in total verified revenue.",
        targetValue: 1000,
        currentValue: totalRecordedRevenue,
        unitPrefix: "£",
      },
      {
        id: "rev-2500",
        category: "Revenue",
        title: "£2,500 Growth Target",
        description: "Reach £2,500 in total verified revenue.",
        targetValue: 2500,
        currentValue: totalRecordedRevenue,
        unitPrefix: "£",
      },
      {
        id: "rev-5000",
        category: "Revenue",
        title: "£5,000 Revenue Milestone",
        description: "Reach £5,000 in total verified revenue.",
        targetValue: 5000,
        currentValue: totalRecordedRevenue,
        unitPrefix: "£",
      },
      {
        id: "rev-10000",
        category: "Revenue",
        title: "£10,000 Master Target",
        description: "Reach £10,000 in total verified revenue.",
        targetValue: 10000,
        currentValue: totalRecordedRevenue,
        unitPrefix: "£",
      },

      // Recommendations Completed Milestones
      {
        id: "recs-1",
        category: "Recommendations",
        title: "First AI Action",
        description: "Complete your very first AI recommendation.",
        targetValue: 1,
        currentValue: completedRecsCount,
      },
      {
        id: "recs-10",
        category: "Recommendations",
        title: "10 Actions Completed",
        description: "Complete 10 AI recommendations across your business.",
        targetValue: 10,
        currentValue: completedRecsCount,
      },
      {
        id: "recs-50",
        category: "Recommendations",
        title: "50 Actions Completed",
        description: "Complete 50 AI recommendations across your business.",
        targetValue: 50,
        currentValue: completedRecsCount,
      },

      // Customers Milestones
      {
        id: "cust-10",
        category: "Customers",
        title: "10 Active Customers",
        description: "Add and maintain 10 active customer relationships in CRM.",
        targetValue: 10,
        currentValue: customerCount,
      },

      // Reviews Milestones
      {
        id: "revs-5",
        category: "Reviews",
        title: "5 Client Reviews",
        description: "Collect 5 verified customer reviews in your workspace.",
        targetValue: 5,
        currentValue: reviewCount,
      },

      // Operational Activity Milestones
      {
        id: "ops-25",
        category: "Operations",
        title: "25 Operational Tasks",
        description: "Complete 25 operational tasks to maintain workflow health.",
        targetValue: 25,
        currentValue: completedTasksCount,
      },

      // CrediEdge Score Milestones
      {
        id: "score-70",
        category: "Score",
        title: "Good Health Index (70+)",
        description: "Achieve a CrediEdge Score™ of 70 or higher based on health index metrics.",
        targetValue: 70,
        currentValue: overallScore,
      },

      // Time Saved Milestones
      {
        id: "time-10",
        category: "Time Saved",
        title: "10 Hours Saved",
        description: "Save 10 hours through verified recommendation completions.",
        targetValue: 10,
        currentValue: verifiedTimeSavedHours,
        unitSuffix: " hrs",
      },
    ];

    // Compute status and persist newly unlocked milestones
    const milestones: BusinessMilestone[] = [];
    let unlockedCount = 0;

    for (const def of catalogueDefinitions) {
      const isMet = def.currentValue >= def.targetValue;
      const wasUnlockedBefore = Boolean(unlockedMap[def.id]);
      const isUnlocked = isMet || wasUnlockedBefore;

      let unlockedAt: string | null = unlockedMap[def.id] ?? null;

      if (isMet && !wasUnlockedBefore) {
        unlockedAt = new Date().toISOString();
        try {
          await (supabase.from as any)("business_achievements").insert({
            business_id: businessId,
            milestone_id: def.id,
            category: def.category,
            title: def.title,
            description: def.description,
            target_value: def.targetValue,
            achieved_value: def.currentValue,
            unlocked_at: unlockedAt,
          });
        } catch (err) {
          console.warn("[fetchBusinessMilestones] Non-blocking achievement unlock save notice:", err);
        }
      }

      if (isUnlocked) unlockedCount++;

      const progressPct = Math.min(100, Math.round((def.currentValue / def.targetValue) * 100));

      milestones.push({
        ...def,
        progressPct,
        isUnlocked,
        unlockedAt,
      });
    }

    // Find next meaningful locked milestone (prioritising Revenue -> Recommendations)
    const lockedMilestones = milestones.filter((m) => !m.isUnlocked);
    const nextMilestone = lockedMilestones.length > 0 ? lockedMilestones[0] : null;

    return {
      milestones,
      nextMilestone,
      unlockedCount,
      totalCount: milestones.length,
    };
  } catch (err) {
    console.error("[fetchBusinessMilestones] error:", err);
    return {
      milestones: [],
      nextMilestone: null,
      unlockedCount: 0,
      totalCount: 0,
    };
  }
}
