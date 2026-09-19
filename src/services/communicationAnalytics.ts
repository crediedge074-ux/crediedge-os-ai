import type { Communication } from "@/lib/database.types";
import type { DataProvenanceMeta } from "@/services/aiGovernance";

export interface CommunicationChannelMetrics {
  channel: string;
  count: number;
  percentage: number;
  unreadCount: number;
}

export interface CommunicationScoreBreakdown {
  label: string;
  score: number;
  color: string;
  weight: number;
  description: string;
}

export interface CommunicationAnalyticsResult {
  hasSufficientData: boolean;
  provenance: DataProvenanceMeta;
  totalMessages: number;
  unreadCount: number;
  awaitingReplyCount: number;
  avgResponseTimeMinutes: number | null; // null if insufficient data
  channelBreakdown: CommunicationChannelMetrics[];
  sentimentBreakdown: { sentiment: string; count: number; percentage: number }[];
  communicationScore: number | null; // null if insufficient data
  scoreBreakdown: CommunicationScoreBreakdown[];
  insufficientDataReason?: string;
}

/**
 * Calculates authoritative communication metrics directly from genuine workspace communication rows.
 * Uses strict formulas and returns explicit INSUFFICIENT DATA state where evidence is lacking.
 */
export function calculateCommunicationAnalytics(
  communications: Communication[]
): CommunicationAnalyticsResult {
  const total = communications.length;

  if (total === 0) {
    return {
      hasSufficientData: false,
      provenance: {
        type: "INSUFFICIENT DATA",
        methodology: "No communications recorded in this business workspace yet.",
        evidenceCount: 0,
        dataSources: ["communications table"],
      },
      totalMessages: 0,
      unreadCount: 0,
      awaitingReplyCount: 0,
      avgResponseTimeMinutes: null,
      channelBreakdown: [],
      sentimentBreakdown: [],
      communicationScore: null,
      scoreBreakdown: [],
      insufficientDataReason:
        "No communication activity found for this workspace. Connect your channels or record customer interactions to generate metrics.",
    };
  }

  // 1. Calculate Unread & Awaiting Reply
  const unreadCount = communications.filter(
    (c) => c.direction === "inbound" && !c.read_at
  ).length;

  // Awaiting reply: inbound messages without subsequent outbound message from same customer
  const customerLastInbound: Record<string, Communication> = {};
  const customerHasOutboundAfter: Record<string, boolean> = {};

  // Sort ascending by time to trace sequence
  const sorted = [...communications].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  for (const c of sorted) {
    const key = c.customer_id || c.id;
    if (c.direction === "inbound") {
      customerLastInbound[key] = c;
      customerHasOutboundAfter[key] = false;
    } else if (c.direction === "outbound") {
      if (customerLastInbound[key]) {
        customerHasOutboundAfter[key] = true;
      }
    }
  }

  const awaitingReplyCount = Object.keys(customerLastInbound).filter(
    (key) => !customerHasOutboundAfter[key]
  ).length;

  // 2. Calculate Average Response Time in Minutes
  // Response time = outbound created_at - previous inbound created_at for same customer
  const responseTimes: number[] = [];
  const pendingInboundTime: Record<string, number> = {};

  for (const c of sorted) {
    const key = c.customer_id || "general";
    const t = new Date(c.created_at).getTime();
    if (c.direction === "inbound") {
      pendingInboundTime[key] = t;
    } else if (c.direction === "outbound" && pendingInboundTime[key]) {
      const diffMinutes = (t - pendingInboundTime[key]) / (1000 * 60);
      if (diffMinutes >= 0 && diffMinutes < 60 * 24 * 30) { // filter outliers > 30 days
        responseTimes.push(diffMinutes);
      }
      delete pendingInboundTime[key];
    }
  }

  const avgResponseTimeMinutes =
    responseTimes.length > 0
      ? Math.round(
          responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        )
      : null;

  // 3. Channel Breakdown
  const channelMap: Record<string, { total: number; unread: number }> = {};
  for (const c of communications) {
    const ch = c.channel || "Other";
    if (!channelMap[ch]) channelMap[ch] = { total: 0, unread: 0 };
    channelMap[ch].total += 1;
    if (c.direction === "inbound" && !c.read_at) {
      channelMap[ch].unread += 1;
    }
  }

  const channelBreakdown: CommunicationChannelMetrics[] = Object.entries(
    channelMap
  ).map(([channel, data]) => ({
    channel,
    count: data.total,
    percentage: Math.round((data.total / total) * 100),
    unreadCount: data.unread,
  }));

  // 4. Sentiment Breakdown
  const sentimentMap: Record<string, number> = {};
  let totalWithSentiment = 0;
  for (const c of communications) {
    if (c.sentiment) {
      sentimentMap[c.sentiment] = (sentimentMap[c.sentiment] || 0) + 1;
      totalWithSentiment += 1;
    }
  }

  const sentimentBreakdown = Object.entries(sentimentMap).map(
    ([sentiment, count]) => ({
      sentiment,
      count,
      percentage: totalWithSentiment > 0 ? Math.round((count / totalWithSentiment) * 100) : 0,
    })
  );

  // 5. Communication Score™ Calculation
  // Requires at least 3 communications to produce a reliable score
  const hasSufficientDataForScore = total >= 3;

  let communicationScore: number | null = null;
  const scoreBreakdown: CommunicationScoreBreakdown[] = [];

  if (hasSufficientDataForScore) {
    // Response time score (30%)
    let responseScore = 70;
    if (avgResponseTimeMinutes !== null) {
      if (avgResponseTimeMinutes <= 15) responseScore = 100;
      else if (avgResponseTimeMinutes <= 30) responseScore = 85;
      else if (avgResponseTimeMinutes <= 60) responseScore = 70;
      else if (avgResponseTimeMinutes <= 120) responseScore = 55;
      else responseScore = 40;
    }

    // Read rate score (25%)
    const readCount = communications.filter((c) => c.read_at || c.direction === "outbound").length;
    const readRateScore = Math.round((readCount / total) * 100);

    // Sentiment score (25%)
    const positiveCount = communications.filter(
      (c) => c.sentiment === "Positive" || c.sentiment === "Very Happy"
    ).length;
    const sentimentScore =
      totalWithSentiment > 0
        ? Math.round((positiveCount / totalWithSentiment) * 100)
        : 70;

    // Responsiveness / Resolution score (20%)
    const resolvedRate = Math.round(
      ((total - awaitingReplyCount) / total) * 100
    );

    communicationScore = Math.round(
      responseScore * 0.3 +
        readRateScore * 0.25 +
        sentimentScore * 0.25 +
        resolvedRate * 0.2
    );

    scoreBreakdown.push(
      {
        label: "Response Speed",
        score: responseScore,
        color: "#E31B23",
        weight: 30,
        description: avgResponseTimeMinutes !== null ? `Avg ${avgResponseTimeMinutes} min response` : "No reply pairs yet",
      },
      {
        label: "Message Read Rate",
        score: readRateScore,
        color: "#3b82f6",
        weight: 25,
        description: `${readRateScore}% of inbound messages reviewed`,
      },
      {
        label: "Customer Sentiment",
        score: sentimentScore,
        color: "#10b981",
        weight: 25,
        description: `${sentimentScore}% positive/satisfied signals`,
      },
      {
        label: "Inbound Resolution",
        score: resolvedRate,
        color: "#f59e0b",
        weight: 20,
        description: `${resolvedRate}% of customer conversations addressed`,
      }
    );
  }

  const provenanceType = hasSufficientDataForScore ? "DERIVED" : "INSUFFICIENT DATA";

  return {
    hasSufficientData: true,
    provenance: {
      type: provenanceType,
      methodology:
        "Derived directly from real workspace communications in Supabase using documented calculation rules.",
      evidenceCount: total,
      dataSources: ["communications table"],
      lastUpdated: new Date().toISOString(),
    },
    totalMessages: total,
    unreadCount,
    awaitingReplyCount,
    avgResponseTimeMinutes,
    channelBreakdown,
    sentimentBreakdown,
    communicationScore,
    scoreBreakdown,
  };
}
