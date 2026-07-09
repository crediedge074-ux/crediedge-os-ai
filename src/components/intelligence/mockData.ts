import type {
  DNAModule, BusinessInsight, HealthScore, CauseEffectChain,
  Prediction, BusinessOpportunity, BusinessRisk, TimelineEvent,
  Decision, MemoryItem, ImpactMetric,
} from "./types";

// ─── Business DNA Modules ─────────────────────────────────────────────────────

export const dnaModules: DNAModule[] = [
  { id: "relationships", name: "Relationship DNA™", score: 94, trend: 3, status: "excellent", contribution: 96, description: "Customer retention and loyalty at peak performance.", route: "/relationships", color: "#E31B23" },
  { id: "communications", name: "Communication Intelligence™", score: 83, trend: 2, status: "strong", contribution: 85, description: "Response times and channel engagement strong.", route: "/communications", color: "#3b82f6" },
  { id: "reputation", name: "Reputation DNA™", score: 82, trend: -1, status: "strong", contribution: 84, description: "4.3 stars — 2 unanswered reviews require attention.", route: "/reviews", color: "#10b981" },
  { id: "revenue", name: "Revenue DNA™", score: 78, trend: 5, status: "good", contribution: 80, description: "Revenue growing — upsell conversion rate improving.", route: "/insights", color: "#f59e0b" },
  { id: "marketing", name: "Marketing DNA™", score: 68, trend: -2, status: "needs-attention", contribution: 70, description: "Ad spend efficiency falling. SEO rankings declined.", route: "/insights", color: "#8b5cf6" },
  { id: "operations", name: "Operations DNA™", score: 76, trend: 1, status: "good", contribution: 78, description: "Job completion on track. Scheduling variance improving.", route: "/tasks", color: "#06b6d4" },
  { id: "finance", name: "Finance DNA™", score: 71, trend: -3, status: "needs-attention", contribution: 73, description: "2 overdue invoices. Cashflow slightly pressured.", route: "/health", color: "#ec4899" },
  { id: "website", name: "Website DNA™", score: 65, trend: -4, status: "needs-attention", contribution: 67, description: "Page speed dropped. Mobile bounce rate increased.", route: "/website", color: "#f97316" },
  { id: "automation", name: "Automation DNA™", score: 58, trend: 0, status: "critical", contribution: 60, description: "Low automation coverage. Manual tasks increasing.", route: "/tasks", color: "#6b7280" },
];

// ─── AI Discoveries ───────────────────────────────────────────────────────────

export const discoveries: BusinessInsight[] = [
  {
    id: "d1",
    title: "Repeat customers now generate 64% of total revenue",
    explanation: "Relationship health improvements in March drove a 12% increase in repeat bookings. This has increased average monthly revenue by £1,840 compared to the same period last year. Customers acquired through referrals have a 2.3x higher LTV than those acquired through paid advertising.",
    impact: "+£1,840/mo",
    impactType: "positive",
    confidence: 92,
    module: "Relationship DNA™",
    moduleColor: "#E31B23",
  },
  {
    id: "d2",
    title: "Response times increased by 14 minutes — reducing conversions",
    explanation: "Between 28 June and 8 July, average first response time increased from 18 to 32 minutes. This correlates with a 9% drop in booking conversion rate. AI has identified that 3 of the 5 lost leads during this period messaged between 5pm and 7pm, when response times are slowest.",
    impact: "-£1,200 est.",
    impactType: "negative",
    confidence: 88,
    module: "Communication Intelligence™",
    moduleColor: "#3b82f6",
  },
  {
    id: "d3",
    title: "Website traffic fell 18% — organic search rankings declined",
    explanation: "Google Search Console data suggests 4 target keywords dropped between positions 3–5 and 7–9 over the last 3 weeks. This coincides with a competitor publishing 6 new content pages targeting your primary service keywords. Estimated monthly revenue impact: -£640.",
    impact: "-£640/mo",
    impactType: "negative",
    confidence: 84,
    module: "Website DNA™",
    moduleColor: "#f97316",
  },
  {
    id: "d4",
    title: "Review response rate improvement increased booking conversion by 4%",
    explanation: "Since implementing the review response strategy in May, Google Business Profile click-through rate increased from 3.1% to 4.8%. This directly contributed to an additional 8 new customer enquiries in June, worth approximately £2,400 in potential revenue.",
    impact: "+£2,400",
    impactType: "positive",
    confidence: 79,
    module: "Reputation DNA™",
    moduleColor: "#10b981",
  },
];

// ─── Health Scores ────────────────────────────────────────────────────────────

export const healthScores: HealthScore[] = [
  { label: "Overall Business", score: 91, color: "#E31B23", trend: 2 },
  { label: "Revenue", score: 78, color: "#10b981", trend: 5 },
  { label: "Operations", score: 76, color: "#3b82f6", trend: 1 },
  { label: "Marketing", score: 68, color: "#8b5cf6", trend: -2 },
  { label: "Relationships", score: 94, color: "#f59e0b", trend: 3 },
  { label: "Website", score: 65, color: "#f97316", trend: -4 },
  { label: "Finance", score: 71, color: "#06b6d4", trend: -3 },
  { label: "Communications", score: 83, color: "#ec4899", trend: 2 },
  { label: "Reputation", score: 82, color: "#84cc16", trend: -1 },
];

// ─── Cause & Effect ───────────────────────────────────────────────────────────

export const causeEffectChains: CauseEffectChain[] = [
  {
    id: "c1",
    title: "Response Time Impact Chain",
    color: "#E31B23",
    steps: [
      { label: "Response times increased by 14 minutes", type: "cause" },
      { label: "Lead conversion rate dropped 9%", type: "effect" },
      { label: "3 bookings lost per week (est.)", type: "effect" },
      { label: "Revenue reduced by ~£1,200/month", type: "outcome" },
    ],
  },
  {
    id: "c2",
    title: "Review Growth Impact Chain",
    color: "#10b981",
    steps: [
      { label: "Review requests sent within 24h", type: "cause" },
      { label: "Review volume increased 31%", type: "effect" },
      { label: "Google ranking improved 2 positions", type: "effect" },
      { label: "Organic traffic increased 14%", type: "outcome" },
    ],
  },
  {
    id: "c3",
    title: "Website Speed Impact Chain",
    color: "#f97316",
    steps: [
      { label: "Page load time exceeded 4.2 seconds", type: "cause" },
      { label: "Mobile bounce rate increased 22%", type: "effect" },
      { label: "Contact form submissions dropped 18%", type: "effect" },
      { label: "Lost 6 potential customers this month", type: "outcome" },
    ],
  },
];

// ─── AI Predictions ───────────────────────────────────────────────────────────

export const predictions: Prediction[] = [
  { label: "Revenue (30 days)", current: "£18,250", predicted: "£19,800", confidence: 87, direction: "up", reasoning: "Seasonal uplift + improved conversion rate expected to generate additional £1,550.", timeframe: "Next 30 days" },
  { label: "New Bookings", current: "47/mo", predicted: "53/mo", confidence: 82, direction: "up", reasoning: "Review improvements and relationship campaign should drive 6 additional bookings.", timeframe: "Next 30 days" },
  { label: "Customer Churn", current: "4.2%", predicted: "3.8%", confidence: 78, direction: "up", reasoning: "AI re-activation outreach predicted to recover 2 at-risk customers.", timeframe: "Next 30 days" },
  { label: "Review Score", current: "4.3", predicted: "4.5", confidence: 74, direction: "up", reasoning: "Replying to negatives and requesting new reviews should lift average rating.", timeframe: "60 days" },
  { label: "Website Traffic", current: "1,240/mo", predicted: "1,050/mo", confidence: 71, direction: "down", reasoning: "SEO rankings continuing to decline without content intervention. Action required.", timeframe: "Next 30 days" },
  { label: "Profit Margin", current: "34%", predicted: "32%", confidence: 69, direction: "down", reasoning: "Rising supplier costs and unresolved invoices creating margin pressure.", timeframe: "Next 30 days" },
];

// ─── Opportunities ────────────────────────────────────────────────────────────

export const opportunities: BusinessOpportunity[] = [
  { id: "o1", title: "Re-activate 12 inactive customers", value: "£8,200", roi: "41x", difficulty: "Easy", timeRequired: "20 min", confidence: 88, reasoning: "12 customers haven't booked in 90+ days. AI has drafted personalised re-activation messages. Based on similar campaigns, 5–7 are expected to rebook, generating estimated £8,200 in revenue.", module: "Relationship DNA™" },
  { id: "o2", title: "Fix website speed — reduce mobile bounce rate", value: "£3,400", roi: "18x", difficulty: "Medium", timeRequired: "2 hours", confidence: 81, reasoning: "Current 4.2-second load time causes 22% mobile bounce. Fixing images and scripts should drop this to <2.5s, recovering approximately 6 monthly leads worth £3,400.", module: "Website DNA™" },
  { id: "o3", title: "Reduce first response time to <15 minutes", value: "£2,800", roi: "12x", difficulty: "Easy", timeRequired: "30 min setup", confidence: 84, reasoning: "Auto-response setup + priority notification rules would cut average response from 32m to <15m. 9% conversion uplift on current lead volume = £2,800 additional monthly revenue.", module: "Communication Intelligence™" },
  { id: "o4", title: "Collect 27 outstanding reviews", value: "£4,500", roi: "22x", difficulty: "Easy", timeRequired: "10 min", confidence: 84, reasoning: "27 satisfied customers haven't been asked for a review. 18 expected to respond, lifting Google position by 2 places and driving 14% traffic increase worth ~£4,500.", module: "Reputation DNA™" },
  { id: "o5", title: "Chase 2 overdue invoices", value: "£1,640", roi: "∞", difficulty: "Easy", timeRequired: "5 min", confidence: 96, reasoning: "INV-1001 (£950) and INV-1002 (£690) are both overdue by 14+ days. AI has drafted professional payment request messages for both.", module: "Finance DNA™" },
];

// ─── Risks ────────────────────────────────────────────────────────────────────

export const risks: BusinessRisk[] = [
  { id: "r1", title: "Website traffic declining — SEO erosion", probability: 84, financialImpact: "£640/mo", suggestedSolution: "Publish 3 targeted content pages addressing your competitors' recently added keywords. Estimated 4–6 week recovery.", confidence: 84, severity: "high" },
  { id: "r2", title: "Supplier costs increasing — margin pressure", probability: 71, financialImpact: "£890/mo", suggestedSolution: "Review 3 supplier contracts due for renewal in Q3. Negotiate volume discounts or identify alternative suppliers.", confidence: 71, severity: "high" },
  { id: "r3", title: "Response time creep — conversion erosion", probability: 88, financialImpact: "£1,200/mo", suggestedSolution: "Enable automated acknowledgment messages on all channels to buy response time without losing leads.", confidence: 88, severity: "critical" },
  { id: "r4", title: "2 negative reviews without reply — reputation risk", probability: 67, financialImpact: "£1,800 est.", suggestedSolution: "Reply to both reviews within 24 hours. AI has pre-drafted professional responses for each.", confidence: 90, severity: "high" },
  { id: "r5", title: "Low automation coverage — manual task overload", probability: 76, financialImpact: "4 hours/week", suggestedSolution: "Automate review requests, invoice reminders, and appointment confirmations. 3-hour setup, saves 4+ hours/week ongoing.", confidence: 76, severity: "medium" },
];

// ─── Timeline ─────────────────────────────────────────────────────────────────

export const timelineEvents: TimelineEvent[] = [
  { id: "t1", date: "9 Jul 2026", category: "Revenue", title: "Best revenue day of Q3", detail: "£1,840 in a single day", value: "£1,840", sentiment: "positive" },
  { id: "t2", date: "8 Jul 2026", category: "Booking", title: "John Smith booked BMW service", detail: "WhatsApp enquiry converted", value: "£420", sentiment: "positive" },
  { id: "t3", date: "7 Jul 2026", category: "Review", title: "Rebecca Foster left 1-star review", detail: "No response yet — urgent", sentiment: "negative" },
  { id: "t4", date: "6 Jul 2026", category: "Website", title: "Page speed score dropped to 54", detail: "Google Core Web Vitals threshold breached", sentiment: "negative" },
  { id: "t5", date: "5 Jul 2026", category: "Campaign", title: "Summer Loyalty Campaign launched", detail: "12 customers enrolled", sentiment: "positive" },
  { id: "t6", date: "4 Jul 2026", category: "Finance", title: "Invoice INV-1002 overdue", detail: "£690 outstanding — 14 days late", value: "£690", sentiment: "negative" },
  { id: "t7", date: "3 Jul 2026", category: "Relationship", title: "Marcus Williams — 6th booking", detail: "Total LTV now £3,100", value: "£620", sentiment: "positive" },
  { id: "t8", date: "2 Jul 2026", category: "Review", title: "John Smith left 5-star review", detail: "Praised communication and speed", sentiment: "positive" },
  { id: "t9", date: "1 Jul 2026", category: "AI", title: "AI Insight: Repeat customers hit 64%", detail: "Highest ratio recorded this year", sentiment: "positive" },
];

// ─── Decisions ────────────────────────────────────────────────────────────────

export const decisions: Decision[] = [
  { id: "dc1", recommendation: "Fix response times before increasing ad spend", reason: "Current conversion rate is 9% below potential due to slow responses. Paying more for leads you're not converting is wasteful. Fix the funnel leak first.", confidence: 94, expectedOutcome: "Recover £2,800/mo before marketing spend increases ROI.", priority: "urgent" },
  { id: "dc2", recommendation: "Reply to both negative reviews today", reason: "Every day of silence on a 1-star review reduces Google ranking and booking conversion. The expected revenue impact of continued inaction is £1,800.", confidence: 96, expectedOutcome: "Stabilise reputation score. Possible review update from Rebecca.", priority: "urgent" },
  { id: "dc3", recommendation: "Do not increase supplier orders this month", reason: "Cashflow is mildly pressured with 2 overdue invoices outstanding. Chase invoices first, then reassess supplier volume commitments.", confidence: 82, expectedOutcome: "Protect cashflow. Recover £1,640 before new outgoings.", priority: "high" },
  { id: "dc4", recommendation: "Launch re-activation campaign this week", reason: "12 dormant customers represent the easiest revenue available. AI has pre-drafted all messages. Expected 7 bookings, £8,200 revenue, 20-minute effort.", confidence: 88, expectedOutcome: "£8,200 revenue. Highest ROI action available this week.", priority: "high" },
  { id: "dc5", recommendation: "Consider raising prices by 3–5% in Q4", reason: "Average job value has grown organically but pricing hasn't been reviewed in 14 months. Competitor analysis suggests 5% headroom without customer loss risk.", confidence: 74, expectedOutcome: "+£3,400/yr at current volume with <5% churn risk.", priority: "medium" },
];

// ─── AI Memory ────────────────────────────────────────────────────────────────

export const memoryItems: MemoryItem[] = [
  { id: "m1", insight: "Customers respond 3.2x better to SMS than email for booking reminders", learnedFrom: "142 campaigns analysed", confidence: 91, category: "Communication" },
  { id: "m2", insight: "Review requests sent within 24 hours of job completion achieve 68% response rate vs 31% after 72 hours", learnedFrom: "89 review requests tracked", confidence: 94, category: "Reputation" },
  { id: "m3", insight: "Repeat customers generate 64% of total revenue but represent only 38% of the customer base", learnedFrom: "Full customer database analysis", confidence: 98, category: "Revenue" },
  { id: "m4", insight: "Tuesday–Thursday bookings have a 28% lower no-show rate than Friday–Monday", learnedFrom: "212 completed jobs", confidence: 87, category: "Operations" },
  { id: "m5", insight: "Customers who receive a personalised reply to their review have a 31% higher rebooking rate", learnedFrom: "Reviews with/without replies compared", confidence: 83, category: "Reputation" },
  { id: "m6", insight: "Website visitors who reach the pricing page convert at 4.1x the rate of homepage visitors", learnedFrom: "Website analytics integration", confidence: 79, category: "Website" },
  { id: "m7", insight: "Every 1-star Google review without a response reduces monthly organic leads by an estimated 2–3", learnedFrom: "Traffic correlation model", confidence: 76, category: "Reputation" },
  { id: "m8", insight: "Customers with 4+ jobs completed refer 1.6x more often than those with 1–3 jobs", learnedFrom: "Referral tracking data", confidence: 85, category: "Relationships" },
];

// ─── Business Impact ──────────────────────────────────────────────────────────

export const impactMetrics: ImpactMetric[] = [
  { label: "Revenue Generated by AI Insights", value: 24800, prefix: "£", description: "From recommendations acted upon", color: "#E31B23" },
  { label: "Revenue Saved / Protected", value: 8400, prefix: "£", description: "Churn prevention + invoice recovery", color: "#10b981" },
  { label: "Hours Saved by Automation", value: 47, suffix: "h", description: "This month across all workflows", color: "#3b82f6" },
  { label: "Customers Retained", value: 14, description: "AI re-activation + relationship care", color: "#f59e0b" },
  { label: "Reviews Generated", value: 23, description: "Via AI-suggested campaigns", color: "#8b5cf6" },
  { label: "Missions Completed", value: 8, description: "Business goals achieved this month", color: "#06b6d4" },
  { label: "CrediEdge Score Improvement", value: 7, suffix: " pts", description: "+7 points since activation", color: "#ec4899" },
  { label: "Decisions Made with AI Guidance", value: 34, description: "Since platform launch", color: "#f97316" },
];

// ─── Suggested Chat Prompts ───────────────────────────────────────────────────

export const suggestedPrompts = [
  "Why is profit falling?",
  "Where am I losing money?",
  "What should I focus on this month?",
  "What is my biggest opportunity right now?",
  "Summarise my business in one paragraph.",
  "How can I grow revenue faster?",
  "Why is my Business Score dropping?",
  "What would a 10% revenue increase require?",
];
