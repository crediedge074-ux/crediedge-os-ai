import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { At as Award, Dt as Brain, Ft as Activity, Mt as ArrowRight, Pt as ArrowDown, St as ChevronDown, V as MessageSquare, X as Lightbulb, at as Globe, c as TriangleAlert, ct as FlaskConical, gt as Clock, ht as Cpu, jt as ArrowUp, k as RefreshCw, l as TrendingUp, ot as GitBranch, p as Target, t as Zap, v as Sparkles, xt as ChevronRight, yt as CircleCheck, z as Minus } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppLayout } from "./PageHeader-BxHsP49M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-DyQqgCcf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var discoveries = [
	{
		id: "d1",
		title: "Customers who receive a reply within 1 hour spend 32% more over their lifetime",
		evidence: "Analysed 312 customer journeys. Customers receiving first response under 60 minutes have an average LTV of £1,840 vs £1,394 for those waiting over 2 hours. This pattern held consistent across all service types.",
		explanation: "The AI cross-referenced response time data from GoHighLevel with customer revenue data from Xero. Customers contacted quickly feel valued, build trust faster, and return more frequently. The 32% premium is statistically robust across 8 months of data.",
		confidence: 94,
		businessImpact: "+£446 average LTV per customer",
		impactType: "positive",
		revenueOpportunity: "£8,200/yr",
		recommendedAction: "Set up automated acknowledgement messages on all channels to buy response time, then reply personally within 30 minutes.",
		module: "Communication Intelligence™",
		moduleColor: "#3b82f6",
		category: "behaviour",
		discoveredAt: "9 Jul 2026",
		isNew: true
	},
	{
		id: "d2",
		title: "Customers who read your reviews before booking spend 2.1x more on their first visit",
		evidence: "Website analytics shows 38% of visitors navigate from your Google Business Profile to your website before booking. These customers average £380 on their first visit vs £181 for direct visitors. Tracked across 94 sessions.",
		explanation: "Review-referred customers arrive pre-sold. They've already done their due diligence, which reduces negotiation and increases willingness to pay. This suggests your reputation is doing significant sales work before customers even make contact.",
		confidence: 88,
		businessImpact: "+£199 average first order value",
		impactType: "positive",
		revenueOpportunity: "£4,600/mo",
		recommendedAction: "Increase Google review volume, respond to all reviews, and ensure review profile links to a high-converting landing page.",
		module: "Reputation DNA™",
		moduleColor: "#10b981",
		category: "behaviour",
		discoveredAt: "8 Jul 2026",
		isNew: true
	},
	{
		id: "d3",
		title: "71% of cancelled bookings occur on Fridays — a pattern you've never been told about",
		evidence: "Analysed 212 jobs over 6 months. Friday bookings have a 28% cancellation rate vs 8% Monday–Thursday average. This costs approximately £1,200/month in lost revenue.",
		explanation: "Friday bookellations correlate with weekend plan changes. Customers book on impulse earlier in the week then cancel when social plans emerge. The AI identified this by mapping booking creation dates against cancellation dates across all job categories.",
		confidence: 87,
		businessImpact: "−£1,200/mo in cancellations",
		impactType: "negative",
		revenueOpportunity: "£1,200/mo recoverable",
		recommendedAction: "Introduce a 48-hour cancellation policy for Friday bookings, or offer an incentive to reschedule rather than cancel.",
		module: "Operations DNA™",
		moduleColor: "#06b6d4",
		category: "operations",
		discoveredAt: "7 Jul 2026"
	},
	{
		id: "d4",
		title: "Customers booking online spend 41% more than customers booking by phone",
		evidence: "Online-booked jobs average £318 vs phone-booked jobs averaging £226. Analysed 178 jobs. Online customers select additional services during booking more frequently (34% upsell rate vs 9% phone).",
		explanation: "Online booking removes the social pressure of the phone call. Customers take time to review service options, read descriptions, and add extras without feeling rushed. The self-service model naturally drives upselling.",
		confidence: 91,
		businessImpact: "+£92 average job value",
		impactType: "positive",
		revenueOpportunity: "£3,400/mo",
		recommendedAction: "Promote online booking on all channels. Make the online booking flow the primary CTA on your website and in all follow-up communications.",
		module: "Website DNA™",
		moduleColor: "#f97316",
		category: "revenue",
		discoveredAt: "6 Jul 2026"
	},
	{
		id: "d5",
		title: "Google reviews mentioning 'friendly staff' correlate with 31% higher rebooking rates",
		evidence: "Of 89 reviews analysed, 34 mentioned 'friendly' or 'helpful' staff. Customers leaving these reviews rebooked within 90 days at a 71% rate, vs 40% for customers leaving reviews without this language.",
		explanation: "Emotional experience language in reviews reflects genuine relationship quality, not just transactional satisfaction. Customers who mention staff warmth are forming a personal connection with the business — and connections drive loyalty.",
		confidence: 82,
		businessImpact: "+31% rebooking rate",
		impactType: "positive",
		revenueOpportunity: "£2,100/mo",
		recommendedAction: "Train staff to focus on personalised interactions. Mention customers by name, follow up on previous conversations, and make every interaction feel personal.",
		module: "Reputation DNA™",
		moduleColor: "#10b981",
		category: "retention",
		discoveredAt: "5 Jul 2026"
	},
	{
		id: "d6",
		title: "Customers who spend over £600 are 4.2x more likely to refer someone new",
		evidence: "Tracked 47 referral events over 4 months. 81% came from customers with cumulative spend above £600. These customers also refer faster — median referral time is 8 days after their last visit vs 34 days for lower-spend customers.",
		explanation: "High-spend customers are invested in the relationship. They've made a financial commitment and want the business to succeed. Their referrals also tend to be higher quality — they refer people similar to themselves, who become high-value customers.",
		confidence: 86,
		businessImpact: "4.2x referral rate",
		impactType: "positive",
		revenueOpportunity: "£5,800/yr",
		recommendedAction: "Identify your top 12 customers by spend. Send personalised referral invitations. Consider a VIP referral programme for customers spending over £600.",
		module: "Relationship DNA™",
		moduleColor: "#E31B23",
		category: "retention",
		discoveredAt: "4 Jul 2026"
	},
	{
		id: "d7",
		title: "Customers returning within 3 months are 4x more likely to become long-term customers",
		evidence: "Customers with their second booking within 90 days have an 84% 12-month retention rate. Customers waiting 91–180 days have a 61% retention rate. Beyond 6 months, retention drops to 21%.",
		explanation: "The 90-day window is the loyalty decision point. A customer who returns quickly is building a habit and choosing you over alternatives. Beyond 90 days, competitors capture them or the habit fades. Intervening in the 60–90 day window is the highest-leverage retention action available.",
		confidence: 93,
		businessImpact: "4x long-term retention",
		impactType: "positive",
		revenueOpportunity: "£12,000/yr",
		recommendedAction: "Create an automated 60-day re-engagement campaign for customers who haven't returned. Offer a small incentive to come back before the 90-day window closes.",
		module: "Relationship DNA™",
		moduleColor: "#E31B23",
		category: "retention",
		discoveredAt: "3 Jul 2026"
	},
	{
		id: "d8",
		title: "Your highest-margin service generates 3x fewer enquiries but 2.2x more profit per job",
		evidence: "Premium detailing service: 8 jobs/month, £420 average, 68% margin. Standard service: 29 jobs/month, £185 average, 31% margin. Despite lower volume, premium generates 47% of total profit.",
		explanation: "This is your most profitable but most under-promoted service. The AI identified it by correlating job type, revenue, supplier costs, and time. The premium service is disproportionately valuable and should be prioritised in all marketing and sales conversations.",
		confidence: 89,
		businessImpact: "+£2,840/mo if volume doubled",
		impactType: "positive",
		revenueOpportunity: "£2,840/mo",
		recommendedAction: "Make premium detailing the primary offer on your website, Google Business Profile, and in all customer communications. Test a price increase of 8–10%.",
		module: "Revenue DNA™",
		moduleColor: "#f59e0b",
		category: "revenue",
		discoveredAt: "2 Jul 2026"
	}
];
var patterns = [
	{
		id: "p1",
		title: "Tuesday–Thursday is your highest conversion window",
		description: "Enquiries received Tuesday through Thursday convert to bookings at 3.2x the rate of Monday and Friday enquiries. Your best staff availability and response times correlate with this window.",
		dataPoints: "212 jobs, 8 months",
		strength: "strong",
		confidence: 91,
		impact: "+£3,400/mo if replicated other days",
		category: "Operations",
		color: "#06b6d4"
	},
	{
		id: "p2",
		title: "August sees 34% more bookings — but 18% lower average order value",
		description: "Summer demand spikes volume but customers are booking smaller jobs. This is a pricing and upselling opportunity. Competitors raise rates in peak periods — your pricing has remained flat.",
		dataPoints: "3 years seasonal data",
		strength: "strong",
		confidence: 88,
		impact: "+£2,100/mo potential August uplift",
		category: "Revenue",
		color: "#f59e0b"
	},
	{
		id: "p3",
		title: "Customers who open SMS reminders book again within 14 days",
		description: "SMS reminder open events correlate with 74% rebooking within 2 weeks. Email reminder opens correlate with only 31% rebooking. SMS is 2.4x more effective for retention.",
		dataPoints: "142 campaigns",
		strength: "strong",
		confidence: 87,
		impact: "+£1,800/mo SMS-driven retention",
		category: "Communication",
		color: "#3b82f6"
	},
	{
		id: "p4",
		title: "Customers booking for the first time spend 28% more when referred by someone",
		description: "Referred first-time customers average £312 first-visit spend vs £244 for non-referred customers. They also cancel less (6% vs 18%) and rebook faster.",
		dataPoints: "47 referral events",
		strength: "moderate",
		confidence: 83,
		impact: "+£68 per referred customer",
		category: "Marketing",
		color: "#8b5cf6"
	},
	{
		id: "p5",
		title: "3-star reviews are submitted most frequently on Mondays",
		description: "Mid-range negative reviews cluster on Mondays. The AI hypothesises this reflects weekend experience dissatisfaction with time to write a review. No 1-star reviews were submitted between Wednesday–Friday.",
		dataPoints: "89 reviews, 6 months",
		strength: "emerging",
		confidence: 74,
		impact: "Reputation management opportunity",
		category: "Reputation",
		color: "#10b981"
	},
	{
		id: "p6",
		title: "VIP customers (4+ visits) use WhatsApp 3.8x more than email",
		description: "Customers with 4 or more completed jobs prefer WhatsApp for every type of communication. Using email for VIP customers creates friction and slower response loops.",
		dataPoints: "38 VIP customers tracked",
		strength: "strong",
		confidence: 90,
		impact: "VIP retention improvement",
		category: "Communication",
		color: "#3b82f6"
	}
];
var correlations = [
	{
		id: "c1",
		factorA: "Higher Google Review Score",
		factorB: "Higher Average Order Value",
		relationship: "positive",
		strength: 78,
		confidence: 86,
		businessImpact: "Each 0.1-point review increase = +£14 average order value",
		explanation: "Customers who discover you through higher-rated reviews arrive with greater trust and willingness to pay. They've pre-qualified the relationship via social proof and are less price-sensitive.",
		revenueEffect: "+£840/mo per 0.1 rating improvement"
	},
	{
		id: "c2",
		factorA: "Faster Response Times",
		factorB: "Higher Repeat Business Rate",
		relationship: "positive",
		strength: 84,
		confidence: 91,
		businessImpact: "Every 10-minute improvement in first response time increases repeat rate by 6%",
		explanation: "Speed of response is experienced as respect by customers. Businesses responding fastest win on service quality perception even before the work is done. This advantage compounds — fast responders retain more, which grows the customer base.",
		revenueEffect: "+£1,200/mo per 10-minute improvement"
	},
	{
		id: "c3",
		factorA: "Website Load Speed",
		factorB: "Booking Conversion Rate",
		relationship: "positive",
		strength: 71,
		confidence: 85,
		businessImpact: "Each 1-second load time improvement = +7% conversion rate",
		explanation: "Mobile visitors are impatient. A 4.2-second load time loses 22% of visitors before the page appears. Improving to 2.5 seconds would recover approximately 14 bookings per month based on current traffic.",
		revenueEffect: "+£1,960/mo per 1-second improvement"
	},
	{
		id: "c4",
		factorA: "Phone Calls vs Email",
		factorB: "VIP Customer Satisfaction",
		relationship: "positive",
		strength: 88,
		confidence: 90,
		businessImpact: "VIP customers contacted by phone rate satisfaction 4.6/5 vs 3.8/5 by email",
		explanation: "VIP customers (4+ jobs) have established a personal relationship. Email feels transactional at this level. Phone and WhatsApp maintain the warmth of the relationship and signal that they are valued differently to new customers.",
		revenueEffect: "VIP retention 34% higher with phone contact"
	},
	{
		id: "c5",
		factorA: "MOT Bookings",
		factorB: "Full Service Return Bookings",
		relationship: "positive",
		strength: 67,
		confidence: 79,
		businessImpact: "62% of MOT customers rebook for a service within 90 days",
		explanation: "MOT customers discover vehicle issues during the inspection that prompt immediate or planned maintenance. This is your highest cross-sell conversion event. Customers who don't receive a follow-up after MOT have a 58% lower service rebooking rate.",
		revenueEffect: "+£4,200/yr with structured MOT follow-up"
	},
	{
		id: "c6",
		factorA: "Review Response Rate",
		factorB: "Organic Search Traffic",
		relationship: "positive",
		strength: 62,
		confidence: 76,
		businessImpact: "Businesses responding to 80%+ reviews rank 2.3 positions higher in local search",
		explanation: "Google's local ranking algorithm factors in review engagement. Businesses actively responding to reviews signal to Google that they are operationally engaged. This is a free SEO lever most businesses ignore.",
		revenueEffect: "+£640/mo in organic traffic at higher ranking"
	}
];
var hiddenOpportunities = [
	{
		id: "ho1",
		title: "Recover 14 inactive customers from the last 90 days",
		description: "14 customers who've spent over £400 previously have not returned in 90+ days. Based on historical patterns, 6–8 are recoverable with a personalised message.",
		estimatedValue: "£6,200",
		roi: "31x",
		difficulty: "Easy",
		confidence: 88,
		timeRequired: "25 min",
		reasoning: "AI has drafted personalised re-activation messages for each customer based on their last job, referencing their specific vehicle or service. Personalisation increases response rate by 3.8x.",
		module: "Relationship DNA™"
	},
	{
		id: "ho2",
		title: "Introduce a Premium Maintenance Plan at £89/month",
		description: "34 customers book at least 3 services per year. A maintenance plan at £89/month would generate £1,068/year per customer vs £742 in ad-hoc bookings. These customers already demonstrate the behaviour.",
		estimatedValue: "£8,400/yr",
		roi: "44x",
		difficulty: "Medium",
		confidence: 82,
		timeRequired: "2 hours",
		reasoning: "Maintenance plans convert best with customers who've demonstrated regular booking behaviour. These 34 customers are pre-qualified. Subscription revenue also improves cashflow predictability.",
		module: "Revenue DNA™"
	},
	{
		id: "ho3",
		title: "Raise premium detailing price by 12% — no demand risk",
		description: "Premium detailing has a 0% price sensitivity test outcome — no cancellations or objections in 3 test cases at higher prices. Demand exceeds capacity at current pricing.",
		estimatedValue: "£1,640/yr",
		roi: "∞",
		difficulty: "Easy",
		confidence: 79,
		timeRequired: "5 min",
		reasoning: "The AI identified zero price complaints and a 100% rebook rate for premium detailing customers. Demand is constrained by capacity, not price. A 12% increase on 8 monthly jobs generates £403 additional monthly revenue.",
		module: "Revenue DNA™"
	},
	{
		id: "ho4",
		title: "Launch a referral programme for your top 12 VIP customers",
		description: "Your top 12 customers by LTV already account for 81% of referrals. A structured programme with a small incentive is projected to double referral volume within 60 days.",
		estimatedValue: "£4,800/yr",
		roi: "24x",
		difficulty: "Easy",
		confidence: 84,
		timeRequired: "30 min",
		reasoning: "These customers are already referring informally. A formal programme gives them a reason to refer actively rather than passively. AI has identified this as the single highest-ROI marketing action available.",
		module: "Marketing DNA™"
	},
	{
		id: "ho5",
		title: "Offer MOT customers an express service upsell immediately after inspection",
		description: "62% of MOT customers need minor work identified during inspection. Offering an immediate on-the-day service upsell at a 10% discount converts at 48% vs 22% when offered later.",
		estimatedValue: "£3,200/mo",
		roi: "16x",
		difficulty: "Easy",
		confidence: 86,
		timeRequired: "15 min to implement",
		reasoning: "The MOT inspection creates a natural sales moment. Customers are already present, already trusting, and have just received evidence of needed work. On-the-day conversion is significantly higher than follow-up.",
		module: "Operations DNA™"
	}
];
var hiddenRisks = [
	{
		id: "hr1",
		title: "Profit margin has declined 4.2% over 6 months — unnoticed until now",
		description: "Net margin dropped from 38.1% (Jan) to 33.9% (Jun) despite revenue growing 14%. Supplier costs are outpacing price increases.",
		probability: 94,
		financialImpact: "−£890/mo ongoing",
		urgency: "high",
		confidence: 91,
		suggestedSolution: "Review 3 key supplier contracts. Model a 5% price increase on standard services. Target Q3 implementation.",
		trend: "worsening"
	},
	{
		id: "hr2",
		title: "New customer acquisition fell 18% in June — not compensated by retention",
		description: "New customer bookings dropped from 22 to 18 per month. Repeat customers have masked this decline. If new acquisition continues falling, total revenue will contract within 3 months.",
		probability: 78,
		financialImpact: "−£3,200/mo potential",
		urgency: "high",
		confidence: 84,
		suggestedSolution: "Increase Google review requests, improve SEO content, and run a referral programme to stimulate new acquisition.",
		trend: "worsening"
	},
	{
		id: "hr3",
		title: "Website organic traffic is declining 6% month-on-month",
		description: "Four keywords dropped from positions 3–5 to 7–9. Without intervention, organic traffic is projected to fall 31% over the next 60 days.",
		probability: 82,
		financialImpact: "−£640/mo",
		urgency: "high",
		confidence: 84,
		suggestedSolution: "Publish 3 targeted service pages. Fix page speed to below 2.5 seconds. Add Schema markup for local SEO.",
		trend: "worsening"
	},
	{
		id: "hr4",
		title: "Friday cancellation rate creating revenue unpredictability",
		description: "28% Friday cancellation rate vs 8% average. This creates unpredictable revenue and blocks slots that could be filled by more reliable weekday bookings.",
		probability: 87,
		financialImpact: "−£1,200/mo",
		urgency: "medium",
		confidence: 87,
		suggestedSolution: "Introduce 48-hour Friday cancellation policy. Offer incentives to reschedule to weekdays. Pre-fill Friday morning slots first.",
		trend: "stable"
	},
	{
		id: "hr5",
		title: "Response time crept from 18 to 32 minutes — customers don't complain, they just don't return",
		description: "Average first response time has increased 78% over the last 6 weeks. This is correlating with a 9% drop in lead conversion. Customers don't mention it — they simply choose competitors.",
		probability: 88,
		financialImpact: "−£1,200/mo",
		urgency: "critical",
		confidence: 92,
		suggestedSolution: "Enable automated first-response messages across all channels. Set up priority notifications for new enquiries. Target <15 minute personal response.",
		trend: "worsening"
	}
];
var experiments = [
	{
		id: "e1",
		hypothesis: "Replying to every new enquiry within 15 minutes increases booking conversion by at least 8%",
		description: "Enable automated acknowledgement on WhatsApp, Email, and SMS. Set up priority notification alerts for new enquiries during business hours.",
		expectedOutcome: "Booking conversion improves from 31% to 39%+. Monthly bookings increase by approximately 8.",
		estimatedRevenue: "£2,800/mo",
		confidence: 88,
		successCriteria: "Conversion rate above 37% for 30 consecutive days",
		duration: "30 days",
		difficulty: "Easy",
		status: "ready"
	},
	{
		id: "e2",
		hypothesis: "Offering premium service first in all conversations increases average order value by 15%",
		description: "Train all communication templates to lead with premium detailing rather than standard service. Monitor average order value.",
		expectedOutcome: "Average job value increases from £285 to £328. Monthly revenue increases by approximately £1,240.",
		estimatedRevenue: "£1,240/mo",
		confidence: 81,
		successCriteria: "Average order value above £315 for 4 consecutive weeks",
		duration: "28 days",
		difficulty: "Easy",
		status: "ready"
	},
	{
		id: "e3",
		hypothesis: "Moving the booking button above the fold on mobile increases bookings by 20%+",
		description: "Redesign mobile homepage hero to place CTA button within the first 400px. Monitor mobile conversion rate.",
		expectedOutcome: "Mobile conversion rate improves from 1.4% to 1.7%. Monthly mobile bookings increase by 6.",
		estimatedRevenue: "£1,400/mo",
		confidence: 79,
		successCriteria: "Mobile conversion rate above 1.65% for 3 consecutive weeks",
		duration: "21 days",
		difficulty: "Easy",
		status: "ready"
	},
	{
		id: "e4",
		hypothesis: "Sending review requests within 2 hours of job completion increases review rate by 40%",
		description: "Trigger review request message automatically 2 hours after job marked as complete. Current requests go out at end of day.",
		expectedOutcome: "Review conversion rate improves from 29% to 41%. Monthly new reviews increase from 7 to 10.",
		estimatedRevenue: "+3 reviews/mo",
		confidence: 83,
		successCriteria: "Review rate above 37% for 30 days",
		duration: "30 days",
		difficulty: "Easy",
		status: "running"
	},
	{
		id: "e5",
		hypothesis: "A personalised 60-day re-engagement message generates 4+ bookings per month from inactive customers",
		description: "Automatically identify customers who haven't booked in 58–62 days. Send a personalised message referencing their vehicle and last service.",
		expectedOutcome: "4–6 additional monthly bookings from inactive customers. Monthly revenue increase of £1,120–£1,680.",
		estimatedRevenue: "£1,400/mo",
		confidence: 86,
		successCriteria: "3+ bookings per month from re-engagement within 14 days of message",
		duration: "60 days",
		difficulty: "Medium",
		status: "ready"
	}
];
var whatChanged = [
	{
		id: "wc1",
		metric: "Customer Satisfaction",
		change: "+0.4 points",
		direction: "up",
		magnitude: "moderate",
		explanation: "Staff personalisation improved after the May training session. Customers mentioning staff by name in reviews increased from 12% to 28%.",
		period: "vs last month",
		value: "4.7/5"
	},
	{
		id: "wc2",
		metric: "Website Traffic",
		change: "−18%",
		direction: "down",
		magnitude: "significant",
		explanation: "SEO rankings for 4 core keywords dropped from positions 3–5 to 7–9 following competitor content activity. Google algorithm update in June may have contributed.",
		period: "vs last month",
		value: "1,240/mo"
	},
	{
		id: "wc3",
		metric: "Average Response Time",
		change: "+14 minutes",
		direction: "down",
		magnitude: "significant",
		explanation: "Response time increased from 18 to 32 minutes. Correlates with reduced staffing cover during 5–7pm. This window accounts for 31% of all new enquiries.",
		period: "vs last month",
		value: "32 minutes"
	},
	{
		id: "wc4",
		metric: "Repeat Booking Rate",
		change: "+6%",
		direction: "up",
		magnitude: "moderate",
		explanation: "Improved review response strategy and post-job follow-up sequence introduced in May is now showing in retention data. The 90-day return rate improved from 48% to 54%.",
		period: "vs last quarter",
		value: "54%"
	},
	{
		id: "wc5",
		metric: "Review Velocity",
		change: "+31%",
		direction: "up",
		magnitude: "significant",
		explanation: "Post-job review requests now sent within 24 hours. New review volume increased from 4 to 7 per month. Google position improved by 1.2 places on average.",
		period: "vs last month",
		value: "7/mo"
	},
	{
		id: "wc6",
		metric: "Profit Margin",
		change: "−4.2%",
		direction: "down",
		magnitude: "significant",
		explanation: "Supplier costs for 3 key products increased 8–12% in May. Pricing has not been adjusted. This is the largest single financial risk identified this month.",
		period: "vs 6 months ago",
		value: "33.9%"
	}
];
var industryBenchmarks = [
	{
		id: "ib1",
		insight: "Automotive businesses with 200+ Google reviews charge 12% higher prices on average",
		relevance: "You have 89 reviews. At 200 reviews, market data suggests price premium viability.",
		benchmark: "12% price premium at 200+ reviews",
		yourPosition: "89 reviews — below threshold",
		gap: "111 reviews needed",
		opportunity: "Reach 200 reviews within 6 months to support a price review"
	},
	{
		id: "ib2",
		insight: "Businesses responding to enquiries within 20 minutes have a 3.1x higher lead-to-booking conversion",
		relevance: "Your current average response time is 32 minutes — outside this window.",
		benchmark: "< 20 minute response for 3.1x conversion",
		yourPosition: "32-minute average response",
		gap: "12 minutes improvement needed",
		opportunity: "Auto-acknowledgement + priority alerts could halve response time"
	},
	{
		id: "ib3",
		insight: "Mobile-first automotive websites convert 2.4x better than desktop-optimised sites",
		relevance: "Your mobile conversion rate is 1.4% vs 3.2% desktop. Mobile is 64% of your traffic.",
		benchmark: "Mobile-first converts 2.4x better",
		yourPosition: "Mobile conversion: 1.4%",
		gap: "1.8% conversion gap",
		opportunity: "Mobile optimisation could generate 22 additional monthly bookings"
	},
	{
		id: "ib4",
		insight: "Average repeat rate for independent automotive businesses is 42% within 12 months",
		relevance: "Your repeat rate is 54% — significantly above industry average.",
		benchmark: "Industry average: 42% repeat rate",
		yourPosition: "Your rate: 54% — excellent",
		gap: "+12% above benchmark",
		opportunity: "Your retention is a competitive advantage — use it in marketing"
	},
	{
		id: "ib5",
		insight: "Businesses offering maintenance plans retain customers 68% longer",
		relevance: "You have no maintenance plan product. 34 customers show maintenance plan booking behaviour.",
		benchmark: "68% longer retention with plans",
		yourPosition: "No maintenance plan offering",
		gap: "Untapped product category",
		opportunity: "Maintenance plan could generate £8,400/year additional recurring revenue"
	}
];
var memoryItems = [
	{
		id: "m1",
		insight: "Customers trust testimonials more than offers — review-led content converts 3.1x better than promotional messaging",
		learnedFrom: "A/B test — 312 website sessions",
		confidence: 93,
		category: "Marketing",
		discoveredAt: "Jun 2026"
	},
	{
		id: "m2",
		insight: "Repeat customers prefer SMS reminders — WhatsApp and SMS open within 3 minutes, email takes 4.2 hours on average",
		learnedFrom: "142 campaigns analysed",
		confidence: 91,
		category: "Communication",
		discoveredAt: "May 2026"
	},
	{
		id: "m3",
		insight: "Winter (Nov–Feb) increases servicing demand by 28% — pre-winter campaign in October is the highest-ROI marketing month",
		learnedFrom: "3 years historical data",
		confidence: 94,
		category: "Operations",
		discoveredAt: "Feb 2026"
	},
	{
		id: "m4",
		insight: "Customers booking online spend 41% more than phone bookings due to self-service upsell behaviour",
		learnedFrom: "178 jobs compared",
		confidence: 91,
		category: "Revenue",
		discoveredAt: "Apr 2026"
	},
	{
		id: "m5",
		insight: "Your business performs best on Tuesdays — highest revenue, lowest cancellation, fastest response times all correlate",
		learnedFrom: "Full data cross-analysis",
		confidence: 88,
		category: "Operations",
		discoveredAt: "Mar 2026"
	},
	{
		id: "m6",
		insight: "Review requests sent within 2 hours of job completion achieve 3.2x higher response rate than next-day requests",
		learnedFrom: "89 review requests tracked",
		confidence: 94,
		category: "Reputation",
		discoveredAt: "May 2026"
	},
	{
		id: "m7",
		insight: "MOT customers return for full services 62% of the time — they are your highest-conversion cross-sell opportunity",
		learnedFrom: "62 MOT jobs tracked",
		confidence: 86,
		category: "Revenue",
		discoveredAt: "Jun 2026"
	},
	{
		id: "m8",
		insight: "VIP customers (4+ jobs) are 4.2x more likely to refer new customers — an untapped acquisition channel",
		learnedFrom: "47 referral events tracked",
		confidence: 86,
		category: "Relationships",
		discoveredAt: "Jun 2026"
	}
];
var insightHistory = [
	{
		id: "ih1",
		date: "9 Jul 2026",
		title: "AI discovered 1-hour response drives 32% higher LTV",
		detail: "Communication pattern analysis across 312 customer journeys",
		module: "Communication Intelligence™",
		moduleColor: "#3b82f6",
		impact: "+£8,200/yr"
	},
	{
		id: "ih2",
		date: "7 Jul 2026",
		title: "AI identified Friday cancellation cluster pattern",
		detail: "Booking data analysis revealed 28% cancellation rate on Fridays only",
		module: "Operations DNA™",
		moduleColor: "#06b6d4",
		impact: "−£1,200/mo risk"
	},
	{
		id: "ih3",
		date: "5 Jul 2026",
		title: "AI discovered staff warmth language correlates with retention",
		detail: "Review sentiment analysis across 89 customer reviews",
		module: "Reputation DNA™",
		moduleColor: "#10b981",
		impact: "+31% rebooking"
	},
	{
		id: "ih4",
		date: "3 Jul 2026",
		title: "AI identified 90-day loyalty window as critical retention point",
		detail: "Customer lifecycle analysis of 212 completed jobs",
		module: "Relationship DNA™",
		moduleColor: "#E31B23",
		impact: "+£12,000/yr"
	},
	{
		id: "ih5",
		date: "1 Jul 2026",
		title: "AI discovered online bookings generate 41% higher order value",
		detail: "Cross-channel booking analysis across 178 jobs",
		module: "Website DNA™",
		moduleColor: "#f97316",
		impact: "+£3,400/mo"
	},
	{
		id: "ih6",
		date: "28 Jun 2026",
		title: "AI discovered premium service is disproportionately profitable",
		detail: "Job-level margin analysis across all service types",
		module: "Revenue DNA™",
		moduleColor: "#f59e0b",
		impact: "+£2,840/mo potential"
	},
	{
		id: "ih7",
		date: "25 Jun 2026",
		title: "AI detected profit margin declining 4.2% since January",
		detail: "Supplier cost vs revenue trend analysis over 6 months",
		module: "Finance DNA™",
		moduleColor: "#ec4899",
		impact: "−£890/mo ongoing"
	},
	{
		id: "ih8",
		date: "22 Jun 2026",
		title: "AI discovered referrals cluster around customers spending £600+",
		detail: "Referral event correlation with customer LTV data",
		module: "Relationship DNA™",
		moduleColor: "#E31B23",
		impact: "+£5,800/yr"
	}
];
var impactMetrics = [
	{
		label: "Revenue Opportunities Found",
		value: 48200,
		prefix: "£",
		description: "Total value of all identified opportunities",
		color: "#E31B23"
	},
	{
		label: "Costs Saved / Protected",
		value: 12400,
		prefix: "£",
		description: "Risk mitigation and efficiency gains",
		color: "#10b981"
	},
	{
		label: "Hours Saved by AI Analysis",
		value: 94,
		suffix: "h",
		description: "Time that would take manual analysis",
		color: "#3b82f6"
	},
	{
		label: "Experiments Running",
		value: 1,
		description: "Active A/B tests in progress",
		color: "#f59e0b"
	},
	{
		label: "Discoveries Acted Upon",
		value: 6,
		description: "Insights converted to missions",
		color: "#8b5cf6"
	},
	{
		label: "Business Improvements",
		value: 12,
		description: "Changes made based on AI insights",
		color: "#06b6d4"
	},
	{
		label: "CrediEdge Score Increase",
		value: 7,
		suffix: " pts",
		description: "Since Insight Engine activated",
		color: "#ec4899"
	},
	{
		label: "Patterns Identified",
		value: 34,
		description: "Unique business patterns discovered",
		color: "#f97316"
	}
];
var feedItems = [
	{
		id: "f1",
		timestamp: "2 min ago",
		title: "New pattern: Tuesday bookings convert 3.2x better than Fridays",
		summary: "Analysed 212 jobs across 8 months. Confidence: 91%.",
		confidence: 91,
		impactType: "positive",
		module: "Operations DNA™",
		moduleColor: "#06b6d4",
		isNew: true
	},
	{
		id: "f2",
		timestamp: "18 min ago",
		title: "Risk identified: Response time crept to 32 minutes — lead conversion dropping",
		summary: "Response time increased 78% over 6 weeks. Booking conversion fell 9%.",
		confidence: 92,
		impactType: "negative",
		module: "Communication Intelligence™",
		moduleColor: "#3b82f6",
		isNew: true
	},
	{
		id: "f3",
		timestamp: "1 hr ago",
		title: "Opportunity: 14 inactive customers recoverable — £6,200 potential",
		summary: "AI identified 14 customers above £400 LTV who haven't returned in 90+ days.",
		confidence: 88,
		impactType: "positive",
		module: "Relationship DNA™",
		moduleColor: "#E31B23",
		isNew: false
	},
	{
		id: "f4",
		timestamp: "3 hrs ago",
		title: "Correlation confirmed: Review score correlates with +£14 order value per 0.1 point",
		summary: "Analysed 89 reviews and corresponding job values. Strong correlation found.",
		confidence: 86,
		impactType: "positive",
		module: "Reputation DNA™",
		moduleColor: "#10b981",
		isNew: false
	},
	{
		id: "f5",
		timestamp: "6 hrs ago",
		title: "Industry benchmark: You retain 54% of customers vs 42% industry average",
		summary: "Your retention is a significant competitive advantage. Consider using it in marketing.",
		confidence: 94,
		impactType: "positive",
		module: "Relationship DNA™",
		moduleColor: "#E31B23",
		isNew: false
	},
	{
		id: "f6",
		timestamp: "Yesterday",
		title: "Pattern: VIP customers use WhatsApp 3.8x more than email",
		summary: "38 VIP customers tracked across 8 months. Strong channel preference identified.",
		confidence: 90,
		impactType: "positive",
		module: "Communication Intelligence™",
		moduleColor: "#3b82f6",
		isNew: false
	},
	{
		id: "f7",
		timestamp: "Yesterday",
		title: "Risk: Profit margin declined 4.2% over 6 months undetected",
		summary: "Supplier costs rising 8–12%. Revenue growth masking margin erosion.",
		confidence: 91,
		impactType: "negative",
		module: "Finance DNA™",
		moduleColor: "#ec4899",
		isNew: false
	},
	{
		id: "f8",
		timestamp: "2 days ago",
		title: "Experiment launched: Review requests within 2 hours of job completion",
		summary: "Expected to increase review rate from 29% to 41%. Running for 30 days.",
		confidence: 83,
		impactType: "neutral",
		module: "Reputation DNA™",
		moduleColor: "#10b981",
		isNew: false
	}
];
var dnaContributions = [
	{
		module: "Relationship DNA™",
		discoveries: 8,
		color: "#E31B23",
		route: "/relationships"
	},
	{
		module: "Communication Intelligence™",
		discoveries: 6,
		color: "#3b82f6",
		route: "/communications"
	},
	{
		module: "Reputation DNA™",
		discoveries: 7,
		color: "#10b981",
		route: "/reviews"
	},
	{
		module: "Website DNA™",
		discoveries: 5,
		color: "#f97316",
		route: "/website"
	},
	{
		module: "Revenue DNA™",
		discoveries: 9,
		color: "#f59e0b",
		route: "/intelligence"
	},
	{
		module: "Operations DNA™",
		discoveries: 4,
		color: "#06b6d4",
		route: "/tasks"
	},
	{
		module: "Finance DNA™",
		discoveries: 3,
		color: "#ec4899",
		route: "/health"
	},
	{
		module: "Marketing DNA™",
		discoveries: 4,
		color: "#8b5cf6",
		route: "/intelligence"
	},
	{
		module: "Automation DNA™",
		discoveries: 2,
		color: "#6b7280",
		route: "/tasks"
	}
];
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1300 }) {
	const [display, setDisplay] = (0, import_react.useState)(0);
	const ref = (0, import_react.useRef)(null);
	const started = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && !started.current) {
				started.current = true;
				const start = performance.now();
				const tick = (now) => {
					const p = Math.min((now - start) / duration, 1);
					setDisplay((1 - Math.pow(1 - p, 3)) * value);
					if (p < 1) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
				obs.disconnect();
			}
		}, { threshold: .2 });
		obs.observe(el);
		return () => obs.disconnect();
	}, [value, duration]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		children: [
			prefix,
			Math.round(display).toLocaleString(),
			suffix
		]
	});
}
function ConfidenceBar({ value, color = "#E31B23" }) {
	const [w, setW] = (0, import_react.useState)(0);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) {
				setTimeout(() => setW(value), 80);
				obs.disconnect();
			}
		}, { threshold: .2 });
		obs.observe(el);
		return () => obs.disconnect();
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "h-1 w-full rounded-full bg-secondary",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full transition-all duration-700 ease-out",
			style: {
				width: `${w}%`,
				backgroundColor: color
			}
		})
	});
}
function SectionCard({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border border-border bg-card shadow-card ${className}`,
		children
	});
}
function SectionHead({ icon: Icon, title, count, color = "text-muted-foreground" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: `h-4.5 w-4.5 ${color}`,
				strokeWidth: 1.75
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[14px] font-semibold text-foreground",
				children: title
			}),
			count != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white",
				children: count
			})
		]
	});
}
function DifficultyBadge({ d }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded border px-1.5 py-0.5 text-[10.5px] font-semibold ${d === "Easy" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : d === "Medium" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-red-700 bg-red-50 border-red-200"}`,
		children: d
	});
}
function InsightEngineHero() {
	const [running, setRunning] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const dataSources = [
		"Customers",
		"Revenue",
		"Bookings",
		"Reviews",
		"Communications",
		"Website",
		"Marketing",
		"Operations",
		"Finance",
		"Tasks",
		"Campaigns",
		"Missions"
	];
	const handleGenerate = () => {
		setRunning(true);
		setTimeout(() => {
			setRunning(false);
			setDone(true);
		}, 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-2xl bg-foreground text-background shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-background/10 px-6 py-6 sm:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
								className: "h-5 w-5 text-[#f59e0b]",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[13px] font-semibold uppercase tracking-widest text-background/60",
								children: "Insight Engine™"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-[28px] font-bold leading-tight tracking-tight text-background sm:text-[32px]",
							children: "Your Business Just Taught You Something"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 max-w-xl text-[14px] leading-relaxed text-background/60",
							children: "The AI has analysed every corner of your business and discovered patterns, opportunities, and risks you would never have spotted manually."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-semibold uppercase tracking-widest text-background/50",
									children: "Discoveries"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[42px] font-bold leading-none text-background",
									children: "14"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-background/50",
									children: "this month"
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-background/10 px-6 py-4 sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 text-[11.5px] font-semibold uppercase tracking-wider text-background/50",
					children: done ? "Analysis Complete — Based on:" : "AI has analysed your:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: dataSources.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-all duration-300 ${done ? "border-background/20 text-background/80" : "border-background/10 text-background/40"}`,
						style: { transitionDelay: done ? `${i * 60}ms` : "0ms" },
						children: s
					}, s))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 divide-x divide-background/10 px-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1 px-6 py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-background/50",
								children: "Revenue Opportunity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[28px] font-bold text-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
									value: 18400,
									prefix: "£"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-background/50",
								children: "identified this month"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1 px-6 py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-background/50",
								children: "Business Confidence"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[28px] font-bold text-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
									value: 96,
									suffix: "%"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-background/50",
								children: "in all discoveries"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1 px-6 py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-background/50",
								children: "New This Week"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[28px] font-bold text-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: 3 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-background/50",
								children: "fresh discoveries"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-background/10 px-6 py-5 sm:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleGenerate,
						disabled: running,
						className: "flex items-center gap-2 rounded-xl border border-background/20 px-4 py-2.5 text-[13px] font-semibold text-background/80 transition-colors hover:bg-background/10 disabled:opacity-60",
						children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							className: "h-4 w-4 text-[#f59e0b]",
							strokeWidth: 1.75
						}), running ? "Analysing…" : done ? "Re-analyse Business" : "Generate Discoveries"]
					}), done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
							className: "h-4 w-4",
							strokeWidth: 1.75
						}), "Analysis complete — 14 discoveries found"]
					})]
				})
			})
		]
	});
}
function DiscoveryCard({ d }) {
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card shadow-soft transition-all hover:border-foreground/10 hover:shadow-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap items-start gap-2",
					children: [
						d.isNew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-brand/10 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-brand",
							children: "New"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border px-2 py-0.5 text-[10.5px] font-semibold",
							style: {
								borderColor: `${d.moduleColor}30`,
								backgroundColor: `${d.moduleColor}10`,
								color: d.moduleColor
							},
							children: d.module
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `ml-auto rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${d.impactType === "positive" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`,
							children: d.businessImpact
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-[14px] font-semibold leading-snug text-foreground",
					children: d.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 space-y-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Evidence"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12.5px] leading-relaxed text-muted-foreground",
						children: d.evidence
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Confidence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-bold text-foreground",
								children: [d.confidence, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBar, {
							value: d.confidence,
							color: d.moduleColor
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium text-emerald-600",
							children: "Opportunity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[13px] font-bold text-emerald-700",
							children: d.revenueOpportunity
						})]
					})]
				}),
				expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3 border-t border-border pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: "How the AI Discovered This"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] leading-relaxed text-muted-foreground",
						children: d.explanation
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-brand/20 bg-brand/5 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand",
							children: "Recommended Action"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] leading-relaxed text-foreground",
							children: d.recommendedAction
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "rounded-lg bg-brand px-3.5 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-80",
						children: "Create Mission"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setExpanded(!expanded),
						className: "flex items-center gap-1 rounded-lg border border-border bg-secondary px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary/70",
						children: [expanded ? "Hide" : "Explain Discovery", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}` })]
					})]
				})
			]
		})
	});
}
function TopDiscoveries() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		icon: Lightbulb,
		title: "Top Discoveries",
		count: discoveries.length,
		color: "text-[#f59e0b]"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-4 p-6 sm:grid-cols-2",
		children: discoveries.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscoveryCard, { d }, d.id))
	})] });
}
function PatternDetection() {
	const strengthColor = (s) => s === "strong" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : s === "moderate" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-blue-700 bg-blue-50 border-blue-200";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		icon: Activity,
		title: "Pattern Detection",
		count: patterns.length
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "divide-y divide-border",
		children: patterns.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-6 py-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 w-2 shrink-0 rounded-full",
								style: { backgroundColor: p.color }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[13.5px] font-semibold text-foreground",
								children: p.title
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground",
							children: p.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `rounded border px-1.5 py-0.5 text-[10.5px] font-semibold capitalize ${strengthColor(p.strength)}`,
									children: [p.strength, " pattern"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: p.dataPoints
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-semibold text-muted-foreground",
									children: [p.confidence, "% confidence"]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-secondary/30 px-3 py-2 text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-medium text-muted-foreground",
						children: "Impact"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] font-semibold text-foreground",
						children: p.impact
					})]
				})]
			})
		}, p.id))
	})] });
}
function Correlations() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		icon: GitBranch,
		title: "Correlations",
		count: correlations.length
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "divide-y divide-border",
		children: correlations.map((c) => {
			const open = expanded === c.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "w-full px-6 py-4 text-left transition-colors hover:bg-secondary/30",
				onClick: () => setExpanded(open ? null : c.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[13px] font-semibold text-foreground",
										children: c.factorA
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[13px] font-semibold text-foreground",
										children: c.factorB
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[12px] text-muted-foreground",
								children: c.businessImpact
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-1 items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10.5px] text-muted-foreground",
											children: "Strength"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 flex-1 rounded-full bg-secondary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full rounded-full bg-brand transition-all duration-700",
												style: { width: `${c.strength}%` }
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] font-semibold text-foreground",
											children: [c.strength, "%"]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground",
									children: [c.confidence, "% confidence"]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-emerald-600",
							children: "Revenue Effect"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] font-bold text-emerald-700",
							children: c.revenueEffect
						})]
					})]
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 rounded-xl border border-border bg-secondary/20 p-3 text-left",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] leading-relaxed text-muted-foreground",
						children: c.explanation
					})
				})]
			}, c.id);
		})
	})] });
}
function HiddenOpportunities() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		icon: Target,
		title: "Hidden Opportunities",
		count: hiddenOpportunities.length,
		color: "text-[#f59e0b]"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border",
		children: hiddenOpportunities.map((op, i) => {
			const open = expanded === op.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-6 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand",
						children: i + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[13.5px] font-semibold text-foreground",
										children: op.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[12px] text-muted-foreground",
										children: op.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700",
												children: op.estimatedValue
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700",
												children: ["ROI ", op.roi]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DifficultyBadge, { d: op.difficulty }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded border border-border bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground",
												children: op.timeRequired
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-muted-foreground",
												children: [op.confidence, "% confidence"]
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "rounded-lg bg-brand px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-80",
									children: "Create Mission"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setExpanded(open ? null : op.id),
									className: "rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary",
									children: open ? "Hide" : "Explain"
								})]
							})]
						}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-xl border border-border bg-secondary/20 p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] leading-relaxed text-muted-foreground",
								children: op.reasoning
							})
						})]
					})]
				})
			}, op.id);
		})
	})] });
}
function HiddenRisks() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const urgencyConfig = {
		critical: {
			color: "text-red-700 bg-red-50 border-red-200",
			dot: "bg-red-500"
		},
		high: {
			color: "text-orange-700 bg-orange-50 border-orange-200",
			dot: "bg-orange-500"
		},
		medium: {
			color: "text-amber-700 bg-amber-50 border-amber-200",
			dot: "bg-amber-500"
		},
		low: {
			color: "text-muted-foreground bg-secondary border-border",
			dot: "bg-muted-foreground/40"
		}
	};
	const trendColor = {
		worsening: "text-red-600",
		stable: "text-muted-foreground",
		improving: "text-emerald-600"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		icon: TriangleAlert,
		title: "Hidden Risks",
		count: hiddenRisks.length,
		color: "text-amber-500"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border",
		children: hiddenRisks.map((r) => {
			const cfg = urgencyConfig[r.urgency];
			const open = expanded === r.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "w-full px-6 py-4 text-left transition-colors hover:bg-secondary/30",
				onClick: () => setExpanded(open ? null : r.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mt-1 h-2 w-2 shrink-0 rounded-full ${cfg.dot}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[13.5px] font-semibold text-foreground",
										children: r.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[12px] text-muted-foreground",
										children: r.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `rounded border px-1.5 py-0.5 text-[10.5px] font-semibold capitalize ${cfg.color}`,
												children: r.urgency
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-muted-foreground",
												children: [r.probability, "% probability"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[11px] font-medium capitalize ${trendColor[r.trend]}`,
												children: r.trend
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-muted-foreground",
												children: [r.confidence, "% confidence"]
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-red-600",
									children: "Financial Impact"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[12px] font-bold text-red-700",
									children: r.financialImpact
								})]
							})]
						})
					})]
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-5 mt-3 rounded-xl border border-brand/20 bg-brand/5 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand",
						children: "Suggested Solution"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] leading-relaxed text-foreground",
						children: r.suggestedSolution
					})]
				})]
			}) }, r.id);
		})
	})] });
}
function AIExperiments() {
	const statusConfig = {
		ready: {
			color: "text-blue-700 bg-blue-50 border-blue-200",
			label: "Ready to Launch"
		},
		running: {
			color: "text-emerald-700 bg-emerald-50 border-emerald-200",
			label: "Running"
		},
		completed: {
			color: "text-muted-foreground bg-secondary border-border",
			label: "Completed"
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		icon: FlaskConical,
		title: "AI Experiments",
		count: experiments.length
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "divide-y divide-border",
		children: experiments.map((ex) => {
			const cfg = statusConfig[ex.status];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-wrap items-start gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded border px-1.5 py-0.5 text-[10.5px] font-semibold ${cfg.color}`,
								children: cfg.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DifficultyBadge, { d: ex.difficulty }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: ex.duration
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-auto text-[11px] font-semibold text-muted-foreground",
								children: [ex.confidence, "% confidence"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[13.5px] font-semibold text-foreground",
						children: ex.hypothesis
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground",
						children: ex.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-3 rounded-xl border border-border bg-secondary/20 p-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-medium text-muted-foreground",
								children: "Expected Outcome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[12px] font-medium text-foreground",
								children: ex.expectedOutcome.split(".")[0]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-medium text-muted-foreground",
								children: "Revenue Estimate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[12px] font-bold text-emerald-600",
								children: ex.estimatedRevenue
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2 sm:col-span-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-medium text-muted-foreground",
									children: "Success Criteria"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-[12px] text-foreground",
									children: ex.successCriteria
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: ex.status === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-80",
							children: "Launch Experiment"
						}) : ex.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[12.5px] font-medium text-emerald-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 animate-pulse rounded-full bg-emerald-500" }), "Experiment running — monitoring results"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-xl border border-border bg-secondary px-4 py-2 text-[12.5px] font-medium text-muted-foreground",
							children: "View Results"
						})
					})
				]
			}, ex.id);
		})
	})] });
}
function WhatChangedSection() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const dirIcon = (d) => d === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-4 w-4 text-emerald-500" }) : d === "down" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-4 w-4 text-red-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4 text-muted-foreground" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		icon: TrendingUp,
		title: "What Changed?",
		count: whatChanged.length
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3",
		children: whatChanged.map((wc) => {
			const open = expanded === wc.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "flex flex-col gap-2 bg-card px-5 py-4 text-left transition-colors hover:bg-secondary/30",
				onClick: () => setExpanded(open ? null : wc.id),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11.5px] font-medium text-muted-foreground",
							children: wc.metric
						}), dirIcon(wc.direction)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[20px] font-bold text-foreground",
							children: wc.value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mb-0.5 text-[12px] font-semibold ${wc.direction === "up" ? "text-emerald-600" : wc.direction === "down" ? "text-red-500" : "text-muted-foreground"}`,
							children: wc.change
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10.5px] text-muted-foreground/60",
						children: wc.period
					}),
					open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 rounded-lg bg-secondary/50 p-2.5 text-[12px] leading-relaxed text-muted-foreground",
						children: wc.explanation
					})
				]
			}, wc.id);
		})
	})] });
}
function IndustryInsights() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between border-b border-border px-6 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
				className: "h-4.5 w-4.5 text-muted-foreground",
				strokeWidth: 1.75
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[14px] font-semibold text-foreground",
				children: "Industry Insights"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground",
			children: "Anonymous Benchmarks"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "divide-y divide-border",
		children: industryBenchmarks.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 py-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13.5px] font-semibold text-foreground",
				children: b.insight
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-secondary/20 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium text-muted-foreground",
							children: "Benchmark"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[12px] font-semibold text-foreground",
							children: b.benchmark
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-secondary/20 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium text-muted-foreground",
							children: "Your Position"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[12px] font-semibold text-foreground",
							children: b.yourPosition
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-brand/20 bg-brand/5 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium text-brand",
							children: "Opportunity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[12px] font-semibold text-foreground",
							children: b.opportunity
						})]
					})
				]
			})]
		}, b.id))
	})] });
}
function AIMemorySection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		icon: Cpu,
		title: "AI Memory"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border",
		children: memoryItems.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-start gap-4 px-6 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] leading-relaxed text-foreground",
					children: m.insight
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground",
							children: m.learnedFrom
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground",
							children: m.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground",
							children: m.discoveredAt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10.5px] font-semibold text-emerald-600",
							children: [m.confidence, "% confidence"]
						})
					]
				})]
			})]
		}, m.id))
	})] });
}
function InsightHistorySection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		icon: Clock,
		title: "Insight History"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-6 py-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative space-y-0",
			children: insightHistory.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex gap-4 pb-6 last:pb-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2.5 w-2.5 shrink-0 rounded-full border-2 border-background",
						style: { backgroundColor: entry.moduleColor }
					}), i < insightHistory.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1 w-px flex-1 bg-border" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 pb-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11.5px] font-medium text-muted-foreground",
									children: entry.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border px-1.5 py-0.5 text-[10px] font-semibold",
									style: {
										borderColor: `${entry.moduleColor}30`,
										color: entry.moduleColor,
										backgroundColor: `${entry.moduleColor}10`
									},
									children: entry.module
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto text-[11.5px] font-semibold text-emerald-600",
									children: entry.impact
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[13px] font-semibold text-foreground",
							children: entry.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[12px] text-muted-foreground",
							children: entry.detail
						})
					]
				})]
			}, entry.id))
		})
	})] });
}
function ActionCentre() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		icon: Zap,
		title: "Action Centre",
		color: "text-[#f59e0b]"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 p-6 sm:grid-cols-4",
		children: [
			{
				label: "Create Campaign",
				icon: Target,
				description: "Turn a discovery into a full marketing campaign"
			},
			{
				label: "Create Mission",
				icon: Zap,
				description: "Launch a structured improvement mission"
			},
			{
				label: "Create Task",
				icon: CircleCheck,
				description: "Add a quick action to your task list"
			},
			{
				label: "Contact Customers",
				icon: MessageSquare,
				description: "Reach out to a customer segment"
			},
			{
				label: "Launch Website Fix",
				icon: Globe,
				description: "Start a website improvement mission"
			},
			{
				label: "Launch Review Campaign",
				icon: Award,
				description: "Boost your review volume and score"
			},
			{
				label: "Start AI Experiment",
				icon: FlaskConical,
				description: "Test a hypothesis with measurable outcomes"
			},
			{
				label: "View All Opportunities",
				icon: TrendingUp,
				description: "Review every identified revenue opportunity"
			}
		].map(({ label, icon: Icon, description }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex flex-col gap-2.5 rounded-xl border border-border bg-secondary/20 p-4 text-left transition-all hover:border-brand/30 hover:bg-brand/5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "h-4 w-4 text-muted-foreground",
					strokeWidth: 1.75
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12.5px] font-semibold text-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-[11px] leading-relaxed text-muted-foreground",
				children: description
			})] })]
		}, label))
	})] });
}
function BusinessDNAWidget() {
	const maxDiscoveries = Math.max(...dnaContributions.map((d) => d.discoveries));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
				className: "h-4.5 w-4.5 text-muted-foreground",
				strokeWidth: 1.75
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[14px] font-semibold text-foreground",
				children: "Business DNA™ — Source of Discoveries"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/intelligence",
				className: "ml-auto flex items-center gap-1 text-[12px] text-brand hover:opacity-70",
				children: ["View Intelligence ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-[13px] text-muted-foreground",
			children: "Every discovery originates from a Business DNA™ module. The more data a module has, the more discoveries it generates."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: dnaContributions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: d.route,
				className: "flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
						style: {
							backgroundColor: `${d.color}15`,
							border: `1px solid ${d.color}25`
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2.5 w-2.5 rounded-full",
							style: { backgroundColor: d.color }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[13px] font-semibold text-foreground",
								children: d.module
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[12px] font-bold text-foreground",
								children: [d.discoveries, " discoveries"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 w-full rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full transition-all duration-700 ease-out",
								style: {
									width: `${d.discoveries / maxDiscoveries * 100}%`,
									backgroundColor: d.color
								}
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" })
				]
			}, d.module))
		})]
	})] });
}
function InsightImpact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		icon: Award,
		title: "Insight Impact"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-px bg-border sm:grid-cols-4",
		children: impactMetrics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-1.5 bg-card px-4 py-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-medium text-muted-foreground",
					children: m.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[24px] font-bold tracking-tight",
					style: { color: m.color },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
						value: m.value,
						prefix: m.prefix ?? "",
						suffix: m.suffix ?? ""
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11.5px] text-muted-foreground",
					children: m.description
				})
			]
		}, m.label))
	})] });
}
function DiscoveryFeed() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between border-b border-border px-6 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
					className: "h-4.5 w-4.5 text-muted-foreground",
					strokeWidth: 1.75
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "Discovery Feed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-medium text-muted-foreground",
						children: "Live"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[12px] text-muted-foreground",
			children: "Newest first"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border",
		children: feedItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "px-6 py-4 transition-colors hover:bg-secondary/20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mt-1 h-2 w-2 shrink-0 rounded-full ${item.impactType === "positive" ? "bg-emerald-500" : item.impactType === "negative" ? "bg-red-500" : "bg-muted-foreground/40"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								item.isNew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-brand/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-brand",
									children: "New"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: item.timestamp
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border px-1.5 py-0.5 text-[10px] font-semibold",
									style: {
										borderColor: `${item.moduleColor}30`,
										color: item.moduleColor,
										backgroundColor: `${item.moduleColor}10`
									},
									children: item.module
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-auto text-[11px] font-semibold text-muted-foreground",
									children: [item.confidence, "% confidence"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[13px] font-semibold text-foreground",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[12px] text-muted-foreground",
							children: item.summary
						})
					]
				})]
			})
		}, item.id))
	})] });
}
function InsightEngine() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightEngineHero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopDiscoveries, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatternDetection, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Correlations, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiddenOpportunities, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiddenRisks, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIExperiments, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatChangedSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndustryInsights, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIMemorySection, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightHistorySection, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionCentre, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessDNAWidget, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightImpact, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscoveryFeed, {})
		]
	});
}
function InsightsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Insights",
		description: "Discover opportunities your business didn't know existed.",
		crumbs: [{ label: "Insights" }],
		action: {
			label: "Generate Discoveries",
			icon: Brain
		},
		secondaryAction: { label: "View History" }
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightEngine, {})] });
}
//#endregion
export { InsightsPage as component };
