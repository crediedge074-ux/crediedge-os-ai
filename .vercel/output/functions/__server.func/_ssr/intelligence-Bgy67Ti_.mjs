import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { At as Award, Dt as Brain, Mt as ArrowRight, Pt as ArrowDown, S as Shield, St as ChevronDown, T as Send, X as Lightbulb, c as TriangleAlert, dt as Eye, gt as Clock, ht as Cpu, jt as ArrowUp, l as TrendingUp, p as Target, t as Zap, u as TrendingDown, ut as FileText, v as Sparkles, wt as Calendar, z as Minus } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppLayout } from "./PageHeader-BxHsP49M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intelligence-Bgy67Ti_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var dnaModules = [
	{
		id: "relationships",
		name: "Relationship DNA™",
		score: 94,
		trend: 3,
		status: "excellent",
		contribution: 96,
		description: "Customer retention and loyalty at peak performance.",
		route: "/relationships",
		color: "#E31B23"
	},
	{
		id: "communications",
		name: "Communication Intelligence™",
		score: 83,
		trend: 2,
		status: "strong",
		contribution: 85,
		description: "Response times and channel engagement strong.",
		route: "/communications",
		color: "#3b82f6"
	},
	{
		id: "reputation",
		name: "Reputation DNA™",
		score: 82,
		trend: -1,
		status: "strong",
		contribution: 84,
		description: "4.3 stars — 2 unanswered reviews require attention.",
		route: "/reviews",
		color: "#10b981"
	},
	{
		id: "revenue",
		name: "Revenue DNA™",
		score: 78,
		trend: 5,
		status: "good",
		contribution: 80,
		description: "Revenue growing — upsell conversion rate improving.",
		route: "/insights",
		color: "#f59e0b"
	},
	{
		id: "marketing",
		name: "Marketing DNA™",
		score: 68,
		trend: -2,
		status: "needs-attention",
		contribution: 70,
		description: "Ad spend efficiency falling. SEO rankings declined.",
		route: "/insights",
		color: "#8b5cf6"
	},
	{
		id: "operations",
		name: "Operations DNA™",
		score: 76,
		trend: 1,
		status: "good",
		contribution: 78,
		description: "Job completion on track. Scheduling variance improving.",
		route: "/tasks",
		color: "#06b6d4"
	},
	{
		id: "finance",
		name: "Finance DNA™",
		score: 71,
		trend: -3,
		status: "needs-attention",
		contribution: 73,
		description: "2 overdue invoices. Cashflow slightly pressured.",
		route: "/health",
		color: "#ec4899"
	},
	{
		id: "website",
		name: "Website DNA™",
		score: 65,
		trend: -4,
		status: "needs-attention",
		contribution: 67,
		description: "Page speed dropped. Mobile bounce rate increased.",
		route: "/website",
		color: "#f97316"
	},
	{
		id: "automation",
		name: "Automation DNA™",
		score: 58,
		trend: 0,
		status: "critical",
		contribution: 60,
		description: "Low automation coverage. Manual tasks increasing.",
		route: "/tasks",
		color: "#6b7280"
	}
];
var discoveries = [
	{
		id: "d1",
		title: "Repeat customers now generate 64% of total revenue",
		explanation: "Relationship health improvements in March drove a 12% increase in repeat bookings. This has increased average monthly revenue by £1,840 compared to the same period last year. Customers acquired through referrals have a 2.3x higher LTV than those acquired through paid advertising.",
		impact: "+£1,840/mo",
		impactType: "positive",
		confidence: 92,
		module: "Relationship DNA™",
		moduleColor: "#E31B23"
	},
	{
		id: "d2",
		title: "Response times increased by 14 minutes — reducing conversions",
		explanation: "Between 28 June and 8 July, average first response time increased from 18 to 32 minutes. This correlates with a 9% drop in booking conversion rate. AI has identified that 3 of the 5 lost leads during this period messaged between 5pm and 7pm, when response times are slowest.",
		impact: "-£1,200 est.",
		impactType: "negative",
		confidence: 88,
		module: "Communication Intelligence™",
		moduleColor: "#3b82f6"
	},
	{
		id: "d3",
		title: "Website traffic fell 18% — organic search rankings declined",
		explanation: "Google Search Console data suggests 4 target keywords dropped between positions 3–5 and 7–9 over the last 3 weeks. This coincides with a competitor publishing 6 new content pages targeting your primary service keywords. Estimated monthly revenue impact: -£640.",
		impact: "-£640/mo",
		impactType: "negative",
		confidence: 84,
		module: "Website DNA™",
		moduleColor: "#f97316"
	},
	{
		id: "d4",
		title: "Review response rate improvement increased booking conversion by 4%",
		explanation: "Since implementing the review response strategy in May, Google Business Profile click-through rate increased from 3.1% to 4.8%. This directly contributed to an additional 8 new customer enquiries in June, worth approximately £2,400 in potential revenue.",
		impact: "+£2,400",
		impactType: "positive",
		confidence: 79,
		module: "Reputation DNA™",
		moduleColor: "#10b981"
	}
];
var healthScores = [
	{
		label: "Overall Business",
		score: 91,
		color: "#E31B23",
		trend: 2
	},
	{
		label: "Revenue",
		score: 78,
		color: "#10b981",
		trend: 5
	},
	{
		label: "Operations",
		score: 76,
		color: "#3b82f6",
		trend: 1
	},
	{
		label: "Marketing",
		score: 68,
		color: "#8b5cf6",
		trend: -2
	},
	{
		label: "Relationships",
		score: 94,
		color: "#f59e0b",
		trend: 3
	},
	{
		label: "Website",
		score: 65,
		color: "#f97316",
		trend: -4
	},
	{
		label: "Finance",
		score: 71,
		color: "#06b6d4",
		trend: -3
	},
	{
		label: "Communications",
		score: 83,
		color: "#ec4899",
		trend: 2
	},
	{
		label: "Reputation",
		score: 82,
		color: "#84cc16",
		trend: -1
	}
];
var causeEffectChains = [
	{
		id: "c1",
		title: "Response Time Impact Chain",
		color: "#E31B23",
		steps: [
			{
				label: "Response times increased by 14 minutes",
				type: "cause"
			},
			{
				label: "Lead conversion rate dropped 9%",
				type: "effect"
			},
			{
				label: "3 bookings lost per week (est.)",
				type: "effect"
			},
			{
				label: "Revenue reduced by ~£1,200/month",
				type: "outcome"
			}
		]
	},
	{
		id: "c2",
		title: "Review Growth Impact Chain",
		color: "#10b981",
		steps: [
			{
				label: "Review requests sent within 24h",
				type: "cause"
			},
			{
				label: "Review volume increased 31%",
				type: "effect"
			},
			{
				label: "Google ranking improved 2 positions",
				type: "effect"
			},
			{
				label: "Organic traffic increased 14%",
				type: "outcome"
			}
		]
	},
	{
		id: "c3",
		title: "Website Speed Impact Chain",
		color: "#f97316",
		steps: [
			{
				label: "Page load time exceeded 4.2 seconds",
				type: "cause"
			},
			{
				label: "Mobile bounce rate increased 22%",
				type: "effect"
			},
			{
				label: "Contact form submissions dropped 18%",
				type: "effect"
			},
			{
				label: "Lost 6 potential customers this month",
				type: "outcome"
			}
		]
	}
];
var predictions = [
	{
		label: "Revenue (30 days)",
		current: "£18,250",
		predicted: "£19,800",
		confidence: 87,
		direction: "up",
		reasoning: "Seasonal uplift + improved conversion rate expected to generate additional £1,550.",
		timeframe: "Next 30 days"
	},
	{
		label: "New Bookings",
		current: "47/mo",
		predicted: "53/mo",
		confidence: 82,
		direction: "up",
		reasoning: "Review improvements and relationship campaign should drive 6 additional bookings.",
		timeframe: "Next 30 days"
	},
	{
		label: "Customer Churn",
		current: "4.2%",
		predicted: "3.8%",
		confidence: 78,
		direction: "up",
		reasoning: "AI re-activation outreach predicted to recover 2 at-risk customers.",
		timeframe: "Next 30 days"
	},
	{
		label: "Review Score",
		current: "4.3",
		predicted: "4.5",
		confidence: 74,
		direction: "up",
		reasoning: "Replying to negatives and requesting new reviews should lift average rating.",
		timeframe: "60 days"
	},
	{
		label: "Website Traffic",
		current: "1,240/mo",
		predicted: "1,050/mo",
		confidence: 71,
		direction: "down",
		reasoning: "SEO rankings continuing to decline without content intervention. Action required.",
		timeframe: "Next 30 days"
	},
	{
		label: "Profit Margin",
		current: "34%",
		predicted: "32%",
		confidence: 69,
		direction: "down",
		reasoning: "Rising supplier costs and unresolved invoices creating margin pressure.",
		timeframe: "Next 30 days"
	}
];
var opportunities = [
	{
		id: "o1",
		title: "Re-activate 12 inactive customers",
		value: "£8,200",
		roi: "41x",
		difficulty: "Easy",
		timeRequired: "20 min",
		confidence: 88,
		reasoning: "12 customers haven't booked in 90+ days. AI has drafted personalised re-activation messages. Based on similar campaigns, 5–7 are expected to rebook, generating estimated £8,200 in revenue.",
		module: "Relationship DNA™"
	},
	{
		id: "o2",
		title: "Fix website speed — reduce mobile bounce rate",
		value: "£3,400",
		roi: "18x",
		difficulty: "Medium",
		timeRequired: "2 hours",
		confidence: 81,
		reasoning: "Current 4.2-second load time causes 22% mobile bounce. Fixing images and scripts should drop this to <2.5s, recovering approximately 6 monthly leads worth £3,400.",
		module: "Website DNA™"
	},
	{
		id: "o3",
		title: "Reduce first response time to <15 minutes",
		value: "£2,800",
		roi: "12x",
		difficulty: "Easy",
		timeRequired: "30 min setup",
		confidence: 84,
		reasoning: "Auto-response setup + priority notification rules would cut average response from 32m to <15m. 9% conversion uplift on current lead volume = £2,800 additional monthly revenue.",
		module: "Communication Intelligence™"
	},
	{
		id: "o4",
		title: "Collect 27 outstanding reviews",
		value: "£4,500",
		roi: "22x",
		difficulty: "Easy",
		timeRequired: "10 min",
		confidence: 84,
		reasoning: "27 satisfied customers haven't been asked for a review. 18 expected to respond, lifting Google position by 2 places and driving 14% traffic increase worth ~£4,500.",
		module: "Reputation DNA™"
	},
	{
		id: "o5",
		title: "Chase 2 overdue invoices",
		value: "£1,640",
		roi: "∞",
		difficulty: "Easy",
		timeRequired: "5 min",
		confidence: 96,
		reasoning: "INV-1001 (£950) and INV-1002 (£690) are both overdue by 14+ days. AI has drafted professional payment request messages for both.",
		module: "Finance DNA™"
	}
];
var risks = [
	{
		id: "r1",
		title: "Website traffic declining — SEO erosion",
		probability: 84,
		financialImpact: "£640/mo",
		suggestedSolution: "Publish 3 targeted content pages addressing your competitors' recently added keywords. Estimated 4–6 week recovery.",
		confidence: 84,
		severity: "high"
	},
	{
		id: "r2",
		title: "Supplier costs increasing — margin pressure",
		probability: 71,
		financialImpact: "£890/mo",
		suggestedSolution: "Review 3 supplier contracts due for renewal in Q3. Negotiate volume discounts or identify alternative suppliers.",
		confidence: 71,
		severity: "high"
	},
	{
		id: "r3",
		title: "Response time creep — conversion erosion",
		probability: 88,
		financialImpact: "£1,200/mo",
		suggestedSolution: "Enable automated acknowledgment messages on all channels to buy response time without losing leads.",
		confidence: 88,
		severity: "critical"
	},
	{
		id: "r4",
		title: "2 negative reviews without reply — reputation risk",
		probability: 67,
		financialImpact: "£1,800 est.",
		suggestedSolution: "Reply to both reviews within 24 hours. AI has pre-drafted professional responses for each.",
		confidence: 90,
		severity: "high"
	},
	{
		id: "r5",
		title: "Low automation coverage — manual task overload",
		probability: 76,
		financialImpact: "4 hours/week",
		suggestedSolution: "Automate review requests, invoice reminders, and appointment confirmations. 3-hour setup, saves 4+ hours/week ongoing.",
		confidence: 76,
		severity: "medium"
	}
];
var timelineEvents = [
	{
		id: "t1",
		date: "9 Jul 2026",
		category: "Revenue",
		title: "Best revenue day of Q3",
		detail: "£1,840 in a single day",
		value: "£1,840",
		sentiment: "positive"
	},
	{
		id: "t2",
		date: "8 Jul 2026",
		category: "Booking",
		title: "John Smith booked BMW service",
		detail: "WhatsApp enquiry converted",
		value: "£420",
		sentiment: "positive"
	},
	{
		id: "t3",
		date: "7 Jul 2026",
		category: "Review",
		title: "Rebecca Foster left 1-star review",
		detail: "No response yet — urgent",
		sentiment: "negative"
	},
	{
		id: "t4",
		date: "6 Jul 2026",
		category: "Website",
		title: "Page speed score dropped to 54",
		detail: "Google Core Web Vitals threshold breached",
		sentiment: "negative"
	},
	{
		id: "t5",
		date: "5 Jul 2026",
		category: "Campaign",
		title: "Summer Loyalty Campaign launched",
		detail: "12 customers enrolled",
		sentiment: "positive"
	},
	{
		id: "t6",
		date: "4 Jul 2026",
		category: "Finance",
		title: "Invoice INV-1002 overdue",
		detail: "£690 outstanding — 14 days late",
		value: "£690",
		sentiment: "negative"
	},
	{
		id: "t7",
		date: "3 Jul 2026",
		category: "Relationship",
		title: "Marcus Williams — 6th booking",
		detail: "Total LTV now £3,100",
		value: "£620",
		sentiment: "positive"
	},
	{
		id: "t8",
		date: "2 Jul 2026",
		category: "Review",
		title: "John Smith left 5-star review",
		detail: "Praised communication and speed",
		sentiment: "positive"
	},
	{
		id: "t9",
		date: "1 Jul 2026",
		category: "AI",
		title: "AI Insight: Repeat customers hit 64%",
		detail: "Highest ratio recorded this year",
		sentiment: "positive"
	}
];
var decisions = [
	{
		id: "dc1",
		recommendation: "Fix response times before increasing ad spend",
		reason: "Current conversion rate is 9% below potential due to slow responses. Paying more for leads you're not converting is wasteful. Fix the funnel leak first.",
		confidence: 94,
		expectedOutcome: "Recover £2,800/mo before marketing spend increases ROI.",
		priority: "urgent"
	},
	{
		id: "dc2",
		recommendation: "Reply to both negative reviews today",
		reason: "Every day of silence on a 1-star review reduces Google ranking and booking conversion. The expected revenue impact of continued inaction is £1,800.",
		confidence: 96,
		expectedOutcome: "Stabilise reputation score. Possible review update from Rebecca.",
		priority: "urgent"
	},
	{
		id: "dc3",
		recommendation: "Do not increase supplier orders this month",
		reason: "Cashflow is mildly pressured with 2 overdue invoices outstanding. Chase invoices first, then reassess supplier volume commitments.",
		confidence: 82,
		expectedOutcome: "Protect cashflow. Recover £1,640 before new outgoings.",
		priority: "high"
	},
	{
		id: "dc4",
		recommendation: "Launch re-activation campaign this week",
		reason: "12 dormant customers represent the easiest revenue available. AI has pre-drafted all messages. Expected 7 bookings, £8,200 revenue, 20-minute effort.",
		confidence: 88,
		expectedOutcome: "£8,200 revenue. Highest ROI action available this week.",
		priority: "high"
	},
	{
		id: "dc5",
		recommendation: "Consider raising prices by 3–5% in Q4",
		reason: "Average job value has grown organically but pricing hasn't been reviewed in 14 months. Competitor analysis suggests 5% headroom without customer loss risk.",
		confidence: 74,
		expectedOutcome: "+£3,400/yr at current volume with <5% churn risk.",
		priority: "medium"
	}
];
var memoryItems = [
	{
		id: "m1",
		insight: "Customers respond 3.2x better to SMS than email for booking reminders",
		learnedFrom: "142 campaigns analysed",
		confidence: 91,
		category: "Communication"
	},
	{
		id: "m2",
		insight: "Review requests sent within 24 hours of job completion achieve 68% response rate vs 31% after 72 hours",
		learnedFrom: "89 review requests tracked",
		confidence: 94,
		category: "Reputation"
	},
	{
		id: "m3",
		insight: "Repeat customers generate 64% of total revenue but represent only 38% of the customer base",
		learnedFrom: "Full customer database analysis",
		confidence: 98,
		category: "Revenue"
	},
	{
		id: "m4",
		insight: "Tuesday–Thursday bookings have a 28% lower no-show rate than Friday–Monday",
		learnedFrom: "212 completed jobs",
		confidence: 87,
		category: "Operations"
	},
	{
		id: "m5",
		insight: "Customers who receive a personalised reply to their review have a 31% higher rebooking rate",
		learnedFrom: "Reviews with/without replies compared",
		confidence: 83,
		category: "Reputation"
	},
	{
		id: "m6",
		insight: "Website visitors who reach the pricing page convert at 4.1x the rate of homepage visitors",
		learnedFrom: "Website analytics integration",
		confidence: 79,
		category: "Website"
	},
	{
		id: "m7",
		insight: "Every 1-star Google review without a response reduces monthly organic leads by an estimated 2–3",
		learnedFrom: "Traffic correlation model",
		confidence: 76,
		category: "Reputation"
	},
	{
		id: "m8",
		insight: "Customers with 4+ jobs completed refer 1.6x more often than those with 1–3 jobs",
		learnedFrom: "Referral tracking data",
		confidence: 85,
		category: "Relationships"
	}
];
var impactMetrics = [
	{
		label: "Revenue Generated by AI Insights",
		value: 24800,
		prefix: "£",
		description: "From recommendations acted upon",
		color: "#E31B23"
	},
	{
		label: "Revenue Saved / Protected",
		value: 8400,
		prefix: "£",
		description: "Churn prevention + invoice recovery",
		color: "#10b981"
	},
	{
		label: "Hours Saved by Automation",
		value: 47,
		suffix: "h",
		description: "This month across all workflows",
		color: "#3b82f6"
	},
	{
		label: "Customers Retained",
		value: 14,
		description: "AI re-activation + relationship care",
		color: "#f59e0b"
	},
	{
		label: "Reviews Generated",
		value: 23,
		description: "Via AI-suggested campaigns",
		color: "#8b5cf6"
	},
	{
		label: "Missions Completed",
		value: 8,
		description: "Business goals achieved this month",
		color: "#06b6d4"
	},
	{
		label: "CrediEdge Score Improvement",
		value: 7,
		suffix: " pts",
		description: "+7 points since activation",
		color: "#ec4899"
	},
	{
		label: "Decisions Made with AI Guidance",
		value: 34,
		description: "Since platform launch",
		color: "#f97316"
	}
];
var suggestedPrompts = [
	"Why is profit falling?",
	"Where am I losing money?",
	"What should I focus on this month?",
	"What is my biggest opportunity right now?",
	"Summarise my business in one paragraph.",
	"How can I grow revenue faster?",
	"Why is my Business Score dropping?",
	"What would a 10% revenue increase require?"
];
function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0, duration = 1300 }) {
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
					const eased = 1 - Math.pow(1 - p, 3);
					setDisplay(eased * value);
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
			decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString(),
			suffix
		]
	});
}
function ScoreRing({ score, size = 80, stroke = 6, color = "#E31B23" }) {
	const [animated, setAnimated] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	const r = (size - stroke) / 2;
	const circ = 2 * Math.PI * r;
	const offset = circ - (animated ? score / 100 : 0) * circ;
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setAnimated(true);
				obs.disconnect();
			}
		}, { threshold: .2 });
		obs.observe(el);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		ref,
		width: size,
		height: size,
		className: "-rotate-90",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: size / 2,
			cy: size / 2,
			r,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: stroke,
			className: "text-border"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: size / 2,
			cy: size / 2,
			r,
			fill: "none",
			stroke: color,
			strokeWidth: stroke,
			strokeLinecap: "round",
			strokeDasharray: circ,
			strokeDashoffset: offset,
			style: { transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }
		})]
	});
}
function ProgressBar({ value, color = "#E31B23" }) {
	const [w, setW] = (0, import_react.useState)(0);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setTimeout(() => setW(value), 100);
				obs.disconnect();
			}
		}, { threshold: .2 });
		obs.observe(el);
		return () => obs.disconnect();
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "relative h-1.5 w-full overflow-hidden rounded-full bg-secondary",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
			style: {
				width: `${w}%`,
				backgroundColor: color
			}
		})
	});
}
var statusConfig = {
	excellent: {
		badge: "bg-emerald-50 text-emerald-600",
		label: "Excellent"
	},
	strong: {
		badge: "bg-brand/10 text-brand",
		label: "Strong"
	},
	good: {
		badge: "bg-blue-50 text-blue-600",
		label: "Good"
	},
	"needs-attention": {
		badge: "bg-amber-50 text-amber-600",
		label: "Needs Attention"
	},
	critical: {
		badge: "bg-destructive/10 text-destructive",
		label: "Critical"
	}
};
var severityConfig = {
	critical: {
		badge: "bg-destructive/10 text-destructive",
		dot: "bg-destructive animate-pulse"
	},
	high: {
		badge: "bg-brand/10 text-brand",
		dot: "bg-brand"
	},
	medium: {
		badge: "bg-amber-50 text-amber-600",
		dot: "bg-amber-500"
	},
	low: {
		badge: "bg-secondary text-muted-foreground",
		dot: "bg-muted-foreground/40"
	}
};
var priorityConfig = {
	urgent: { badge: "bg-destructive/10 text-destructive" },
	high: { badge: "bg-brand/10 text-brand" },
	medium: { badge: "bg-amber-50 text-amber-600" },
	low: { badge: "bg-secondary text-muted-foreground" }
};
function Hero() {
	const [explainOpen, setExplainOpen] = (0, import_react.useState)(false);
	const overallScore = 91;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand/20 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-brand/10 blur-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-brand" }), "Business Intelligence™"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-[20px] font-bold leading-tight tracking-tight text-background sm:text-[24px]",
								children: "Good morning, Dom."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 max-w-xl text-[13px] leading-relaxed text-background/65",
								children: "I've analysed every part of your business overnight. Here's what's happening, why it matters, and what to do next."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex shrink-0 items-center gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
										score: overallScore,
										size: 72,
										stroke: 6,
										color: "#E31B23"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute inset-0 flex flex-col items-center justify-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[18px] font-bold leading-none text-background",
											children: overallScore
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[8px] text-background/50",
											children: "/ 100"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-medium text-background/60",
									children: "Business Health"
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2.5 sm:grid-cols-4",
						children: [
							{
								label: "Business Momentum",
								value: "Strong",
								icon: TrendingUp,
								sub: "Accelerating"
							},
							{
								label: "Biggest Opportunity",
								value: "Re-activate Customers",
								icon: Target,
								sub: "Est. £8,200"
							},
							{
								label: "Biggest Risk",
								value: "Response Times",
								icon: TriangleAlert,
								sub: "Impact: £1,200/mo"
							},
							{
								label: "AI Confidence",
								value: "95%",
								icon: Brain,
								sub: "Based on 847 data points"
							}
						].map((item) => {
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1 rounded-xl bg-background/10 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											className: "h-3 w-3 text-background/55",
											strokeWidth: 1.75
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9.5px] font-medium text-background/55",
											children: item.label
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[14px] font-bold leading-tight text-background",
										children: item.value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] text-background/50",
										children: item.sub
									})
								]
							}, item.label);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setExplainOpen(!explainOpen),
							className: "flex items-center gap-2 rounded-xl bg-background/15 px-4 py-2.5 text-[12.5px] font-semibold text-background transition-all hover:bg-background/25",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
									className: "h-3.5 w-3.5",
									strokeWidth: 1.75
								}),
								"Explain Everything",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3.5 w-3.5 transition-transform duration-300 ${explainOpen ? "rotate-180" : ""}` })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-xl bg-background/10 px-3.5 py-2.5 text-[11px] text-background/70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" }), "Last analysed: 6:00am today"]
						})]
					}),
					explainOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-xl border border-background/20 bg-background/10 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
								className: "h-4 w-4 text-brand",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-background/70",
								children: "Full AI Analysis — 9 July 2026"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-[12.5px] leading-relaxed text-background/80",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-background",
									children: "What changed:"
								}), " Response times increased 14 minutes on average. Website page speed score dropped to 54. Two negative reviews remain unanswered. Revenue is up 8% month-on-month."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-background",
									children: "Why it changed:"
								}), " The response time increase correlates with a surge in evening enquiries (5–7pm) without coverage. The website slowdown followed a plugin update on 6 July. The unanswered reviews are a capacity issue, not a process failure."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-background",
									children: "Expected impact if not addressed:"
								}), " Response time delay will cost an estimated £1,200/month in lost conversions. Website speed will continue to erode Google rankings. Each unanswered review reduces organic click-through rate by ~2%."] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-background",
									children: "What to do next:"
								}), " Reply to both reviews today (5 minutes). Enable auto-acknowledgment on WhatsApp and Email for out-of-hours. Fix website images and plugins (2 hours). Launch re-activation campaign for 12 dormant customers (20 minutes). Total effort: ~3 hours. Total value unlocked: ~£12,000."] })
							]
						})]
					})
				]
			})
		]
	});
}
function BusinessDNAGrid() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Business DNA™"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-muted-foreground",
						children: "9 intelligence modules"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: dnaModules.map((mod) => {
					const cfg = statusConfig[mod.status];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: mod.route,
						className: "group flex flex-col gap-3 rounded-xl border border-border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[12.5px] font-semibold text-foreground",
										children: mod.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `mt-1 inline-block rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${cfg.badge}`,
										children: cfg.label
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col items-end gap-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative h-12 w-12 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
											score: mod.score,
											size: 48,
											stroke: 4,
											color: mod.color
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-0 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[12px] font-bold text-foreground",
												children: mod.score
											})
										})]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
								value: mod.score,
								color: mod.color
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10.5px] text-muted-foreground leading-tight",
									children: mod.description
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `flex shrink-0 items-center gap-0.5 text-[10px] font-semibold ${mod.trend >= 0 ? "text-brand" : "text-destructive"}`,
									children: [mod.trend >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
										className: "h-2.5 w-2.5",
										strokeWidth: 2
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, {
										className: "h-2.5 w-2.5",
										strokeWidth: 2
									}), Math.abs(mod.trend)]
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-t border-border pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground",
									children: ["Contributes ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground",
										children: [mod.contribution, "/100"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground" })]
							})
						]
					}, mod.id);
				})
			})
		})]
	});
}
function AIDiscoveries() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "AI Discoveries"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white",
						children: discoveries.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-muted-foreground",
						children: "Updated 6:00am"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border",
			children: discoveries.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 transition-colors hover:bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 h-2 w-2 shrink-0 rounded-full",
						style: { backgroundColor: d.impactType === "positive" ? "#10b981" : d.impactType === "negative" ? "#E31B23" : "#6b7280" }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start gap-2 justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[12.5px] font-semibold text-foreground",
									children: d.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-md px-1.5 py-0.5 text-[9.5px] font-bold",
											style: {
												backgroundColor: `${d.moduleColor}18`,
												color: d.moduleColor
											},
											children: d.module
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[11px] font-bold ${d.impactType === "positive" ? "text-brand" : "text-destructive"}`,
											children: d.impact
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10.5px] text-muted-foreground",
											children: [d.confidence, "% confidence"]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setExpanded(expanded === d.id ? null : d.id),
								className: "flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
										className: "h-3 w-3",
										strokeWidth: 1.75
									}),
									"Explain",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-2.5 w-2.5 transition-transform duration-200 ${expanded === d.id ? "rotate-180" : ""}` })
								]
							})]
						}), expanded === d.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-xl border border-brand/15 bg-brand/5 p-3.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
									className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-brand",
									strokeWidth: 1.75
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11.5px] leading-relaxed text-foreground/80",
									children: d.explanation
								})]
							})
						})]
					})]
				})
			}, d.id))
		})]
	});
}
function BusinessHealth() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
					className: "h-4 w-4 text-brand",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "Business Health Dashboard"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9",
				children: healthScores.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
							score: h.score,
							size: 60,
							stroke: 5,
							color: h.color
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[13px] font-bold text-foreground",
								children: h.score
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-center text-[9.5px] font-medium text-muted-foreground leading-tight",
							children: h.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `flex items-center gap-0.5 text-[9px] font-semibold ${h.trend >= 0 ? "text-brand" : "text-destructive"}`,
							children: [h.trend >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
								className: "h-2 w-2",
								strokeWidth: 2.5
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
								className: "h-2 w-2",
								strokeWidth: 2.5
							}), Math.abs(h.trend)]
						})]
					})]
				}, h.label))
			})
		})]
	});
}
function CauseEffect() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Cause & Effect"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-muted-foreground",
						children: "AI connects events automatically"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 p-5 sm:grid-cols-3",
			children: causeEffectChains.map((chain) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 text-[12px] font-semibold text-foreground",
					children: chain.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: chain.steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full rounded-lg px-3 py-2 text-center text-[11px] font-medium",
							style: {
								backgroundColor: step.type === "cause" ? `${chain.color}18` : step.type === "outcome" ? `${chain.color}30` : "oklch(0.97 0 0)",
								color: step.type === "cause" || step.type === "outcome" ? chain.color : "oklch(0.45 0 0)"
							},
							children: step.label
						}), i < chain.steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
							className: "my-1 h-3 w-3 text-muted-foreground/40",
							strokeWidth: 1.75
						})]
					}, i))
				})]
			}, chain.id))
		})]
	});
}
function AIPredictions() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "AI Predictions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-muted-foreground",
						children: "Next 30–60 days"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3",
			children: predictions.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group cursor-pointer rounded-xl border border-border p-4 transition-all duration-200 hover:border-foreground/15 hover:shadow-card",
				onClick: () => setExpanded(expanded === p.label ? null : p.label),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11.5px] font-semibold text-foreground",
							children: p.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex items-center gap-0.5 text-[11px] font-bold ${p.direction === "up" ? "text-brand" : p.direction === "down" ? "text-destructive" : "text-muted-foreground"}`,
							children: p.direction === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
								className: "h-3 w-3",
								strokeWidth: 2.5
							}) : p.direction === "down" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
								className: "h-3 w-3",
								strokeWidth: 2.5
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
								className: "h-3 w-3",
								strokeWidth: 2
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-2 mb-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: p.current
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-3 w-3 text-muted-foreground/40",
								strokeWidth: 1.75
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[16px] font-bold ${p.direction === "up" ? "text-brand" : p.direction === "down" ? "text-destructive" : "text-foreground"}`,
								children: p.predicted
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
						value: p.confidence,
						color: p.direction === "up" ? "#E31B23" : "#f59e0b"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 flex items-center justify-between text-[10px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: p.timeframe
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `font-semibold ${p.direction === "up" ? "text-brand" : "text-amber-600"}`,
							children: [p.confidence, "% confidence"]
						})]
					}),
					expanded === p.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 border-t border-border pt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] leading-relaxed text-muted-foreground",
							children: p.reasoning
						})
					})
				]
			}, i))
		})]
	});
}
function OpportunityEngine() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const diffCfg = {
		Easy: "bg-emerald-50 text-emerald-600",
		Medium: "bg-amber-50 text-amber-600",
		Hard: "bg-destructive/10 text-destructive"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Opportunity Engine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-muted-foreground",
						children: "Sorted by value"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border",
			children: opportunities.map((o, rank) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 transition-colors hover:bg-secondary/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand",
						children: rank + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[12.5px] font-semibold text-foreground",
								children: o.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[12px] font-bold text-brand",
										children: o.value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10.5px] text-muted-foreground",
										children: ["ROI: ", o.roi]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${diffCfg[o.difficulty]}`,
										children: o.difficulty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-0.5 text-[10.5px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
											className: "h-2.5 w-2.5",
											strokeWidth: 1.75
										}), o.timeRequired]
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-brand/90",
									children: "Start"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setExpanded(expanded === o.id ? null : o.id),
									className: "flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] text-muted-foreground transition-all hover:border-foreground/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
										className: "h-3 w-3",
										strokeWidth: 1.75
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-2.5 w-2.5 transition-transform duration-200 ${expanded === o.id ? "rotate-180" : ""}` })]
								})]
							})]
						}), expanded === o.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-xl border border-brand/15 bg-brand/5 p-3.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
									className: "mt-0.5 h-3 w-3 shrink-0 text-brand",
									strokeWidth: 1.75
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11.5px] leading-relaxed text-foreground/80",
									children: o.reasoning
								})]
							})
						})]
					})]
				})
			}, o.id))
		})]
	});
}
function RiskEngine() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
						className: "h-4 w-4 text-destructive",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Risk Engine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white",
						children: risks.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-muted-foreground",
						children: "AI-identified"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border",
			children: risks.map((r) => {
				const cfg = severityConfig[r.severity];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 transition-colors hover:bg-secondary/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mt-1 h-2 w-2 shrink-0 rounded-full ${cfg.dot}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[12.5px] font-semibold text-foreground",
									children: r.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${cfg.badge}`,
											children: r.severity.charAt(0).toUpperCase() + r.severity.slice(1)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold text-destructive",
											children: r.financialImpact
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10.5px] text-muted-foreground",
											children: [r.probability, "% probability"]
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setExpanded(expanded === r.id ? null : r.id),
									className: "flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
											className: "h-3 w-3",
											strokeWidth: 1.75
										}),
										"Solution",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-2.5 w-2.5 transition-transform duration-200 ${expanded === r.id ? "rotate-180" : ""}` })
									]
								})]
							}), expanded === r.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, {
										className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600",
										strokeWidth: 1.75
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11.5px] leading-relaxed text-amber-800",
										children: r.suggestedSolution
									})]
								})
							})]
						})]
					})
				}, r.id);
			})
		})]
	});
}
function BusinessTimeline() {
	const catColors = {
		Revenue: "bg-brand/10 text-brand",
		Booking: "bg-emerald-50 text-emerald-600",
		Review: "bg-amber-50 text-amber-600",
		Website: "bg-orange-50 text-orange-600",
		Campaign: "bg-purple-50 text-purple-600",
		Finance: "bg-red-50 text-red-600",
		Relationship: "bg-blue-50 text-blue-600",
		AI: "bg-cyan-50 text-cyan-600"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Business Timeline"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-muted-foreground",
						children: "Every event. One view."
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: timelineEvents.map((ev, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[9px] font-bold ${catColors[ev.category] ?? "bg-secondary text-muted-foreground"}`,
						children: ev.category.slice(0, 3)
					}), idx < timelineEvents.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1 h-full w-px bg-border" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-1 pb-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12.5px] font-semibold text-foreground",
								children: ev.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1.5 w-1.5 rounded-full ${ev.sentiment === "positive" ? "bg-emerald-500" : ev.sentiment === "negative" ? "bg-destructive" : "bg-muted-foreground/40"}` })]
						}), ev.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: ev.detail
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 flex-col items-end gap-0.5",
							children: [ev.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] font-bold text-brand",
								children: ev.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: ev.date
							})]
						})]
					})
				})]
			}, ev.id))
		})]
	});
}
function DecisionEngine() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "AI Decision Engine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-muted-foreground",
						children: "What your AI recommends doing"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border",
			children: decisions.map((d, i) => {
				const pcfg = priorityConfig[d.priority];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 transition-colors hover:bg-secondary/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-foreground text-[11px] font-bold text-background mt-0.5",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[13px] font-semibold text-foreground",
									children: d.recommendation
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${pcfg.badge}`,
										children: d.priority.charAt(0).toUpperCase() + d.priority.slice(1)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10.5px] text-muted-foreground",
										children: [d.confidence, "% confidence"]
									})]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setExpanded(expanded === d.id ? null : d.id),
									className: "flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
											className: "h-3 w-3",
											strokeWidth: 1.75
										}),
										"Explain Why",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-2.5 w-2.5 transition-transform duration-200 ${expanded === d.id ? "rotate-180" : ""}` })
									]
								})]
							}), expanded === d.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 rounded-xl border border-brand/15 bg-brand/5 p-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
										className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-brand",
										strokeWidth: 1.75
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11.5px] leading-relaxed text-foreground/80",
										children: d.reason
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-[11px] font-semibold text-brand",
										children: ["Expected: ", d.expectedOutcome]
									})] })]
								})
							})]
						})]
					})
				}, d.id);
			})
		})]
	});
}
function ExecutiveReport() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Weekly Executive Report"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600",
						children: "W28 · July 2026"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						{
							label: "Business Momentum",
							value: "Strong",
							color: "text-brand"
						},
						{
							label: "Overall Confidence",
							value: "95%",
							color: "text-foreground"
						},
						{
							label: "Revenue Opportunity",
							value: "£24,940",
							color: "text-brand"
						},
						{
							label: "Critical Actions",
							value: "3",
							color: "text-destructive"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-secondary/50 p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium text-muted-foreground",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mt-1 text-[17px] font-bold ${s.color}`,
							children: s.value
						})]
					}, s.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						{
							label: "Wins This Week",
							color: "emerald",
							items: [
								"Revenue up 8% month-on-month",
								"Relationship health at all-time high (94)",
								"Review response programme launched",
								"5 new customers acquired"
							]
						},
						{
							label: "Areas to Address",
							color: "amber",
							items: [
								"2 negative reviews unanswered",
								"Website speed score declined to 54",
								"Response times increased 14 minutes",
								"2 invoices overdue £1,640 combined"
							]
						},
						{
							label: "Top Recommendations",
							color: "brand",
							items: [
								"Reply to negative reviews today",
								"Enable out-of-hours auto-response",
								"Launch re-activation campaign",
								"Fix website images and plugins"
							]
						}
					].map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: section.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5",
							children: section.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2 text-[11.5px] text-foreground/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${section.color === "emerald" ? "bg-emerald-500" : section.color === "amber" ? "bg-amber-500" : "bg-brand"}` }), item]
							}, i))
						})]
					}, section.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-xl bg-secondary/50 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: "Full PDF report ready"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12.5px] font-semibold text-foreground",
						children: "Week 28 — Business Intelligence Report"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-[12.5px] font-semibold text-background transition-all hover:bg-foreground/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
							className: "h-3.5 w-3.5",
							strokeWidth: 1.75
						}), "Download PDF"]
					})]
				})
			]
		})]
	});
}
function AIMemorySection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "AI Memory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-muted-foreground",
						children: "Continuously learning from your business"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 p-5 sm:grid-cols-2",
			children: memoryItems.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 rounded-xl bg-secondary/50 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
					className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-brand",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] leading-relaxed text-foreground",
					children: m.insight
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground",
							children: m.learnedFrom
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground/30",
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-semibold text-brand",
							children: [m.confidence, "% confident"]
						})
					]
				})] })]
			}, m.id))
		})]
	});
}
function BusinessImpact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Business Impact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600",
						children: "Since Activation"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 p-5 sm:grid-cols-4",
			children: impactMetrics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-medium text-muted-foreground",
						children: m.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 text-[20px] font-bold text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
							value: m.value,
							prefix: m.prefix ?? "",
							suffix: m.suffix ?? ""
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[10px] font-medium",
						style: { color: m.color },
						children: m.description
					})
				]
			}, m.label))
		})]
	});
}
var aiResponses = {
	"Why is profit falling?": "Your profit margin has decreased from 38% to 34% over 6 weeks. Two contributing factors: supplier costs have increased by approximately £890/month without a corresponding price adjustment, and 2 overdue invoices totalling £1,640 are creating cashflow pressure. I recommend reviewing 3 supplier contracts due for Q3 renewal and chasing both invoices this week.",
	"Where am I losing money?": "There are three identified revenue leaks: (1) Slow response times are costing an estimated £1,200/month in unconverted leads. (2) The website speed decline has reduced organic traffic by 18%, worth approximately £640/month in lost enquiries. (3) 27 happy customers haven't been asked for reviews — their Google impact is worth approximately £4,500 in potential new customer revenue.",
	"What should I focus on this month?": "Prioritise in this order: First, reply to both negative reviews (5 minutes, protects £1,800 in reputation value). Second, enable out-of-hours auto-response (30 minutes, recovers £2,800/month). Third, launch the 12-customer re-activation campaign (20 minutes, generates estimated £8,200). Total: 55 minutes of effort for ~£12,000 in unlocked value.",
	"What is my biggest opportunity right now?": "Your biggest immediate opportunity is the 12 dormant customers identified by AI. These customers have spent an average of £680 each and haven't booked in 90+ days. Based on historical re-activation campaigns with similar customer profiles, 5–7 are predicted to rebook. AI has already drafted personalised messages for each one. Estimated return: £8,200. Effort: 20 minutes.",
	"Summarise my business in one paragraph.": "Your business is performing well with strong momentum. Revenue is up 8% month-on-month and your customer relationships are at their healthiest ever, with a Relationship DNA™ score of 94/100. Your biggest strengths are communication quality and customer loyalty. The areas requiring immediate attention are response time management, website performance, and reputation response rate — all of which are fixable within a few hours this week. Overall Business Health: 91/100.",
	"How can I grow revenue faster?": "The fastest revenue growth available to you right now comes from three sources: (1) Re-activating 12 dormant customers (£8,200, 20 minutes). (2) Reducing response time to under 15 minutes, which should recover 9% of currently lost leads (£2,800/month ongoing). (3) Fixing website speed and collecting 27 outstanding reviews, which together should increase organic traffic by 14% within 60 days. Combined impact: approximately £15,000 additional revenue over the next 60 days.",
	"Why is my Business Score dropping?": "Your Business Score has dropped 4 points from its peak of 95. The main contributing factors are: Website DNA™ fell from 71 to 65 (page speed decline), Marketing DNA™ fell from 70 to 68 (SEO erosion), and Finance DNA™ fell from 74 to 71 (overdue invoices). Your Relationship DNA™ and Communication Intelligence™ scores are both rising, partially offsetting the decline. Addressing the website speed and overdue invoices would recover approximately 3–4 points.",
	"What would a 10% revenue increase require?": "At your current monthly revenue of £18,250, a 10% increase means generating an additional £1,825/month. The AI estimates this is achievable by: activating the dormant customer campaign (adds £8,200 once, not recurring), reducing response time (adds £2,800/month recurring), and the review-driven SEO improvement adds approximately £640/month. The sustainable 10% monthly increase is most achievable through the response time fix combined with the review campaign over a 60-day period."
};
function IntelligenceChat() {
	const [messages, setMessages] = (0, import_react.useState)([{
		role: "ai",
		content: "Hello. I've already analysed your entire business. Ask me anything — I know your revenue, customers, reviews, website, and operations in detail."
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const bottomRef = (0, import_react.useRef)(null);
	const send = (text) => {
		if (!text.trim() || loading) return;
		const userMsg = {
			role: "user",
			content: text
		};
		setMessages((m) => [...m, userMsg]);
		setInput("");
		setLoading(true);
		setTimeout(() => {
			const response = aiResponses[text] ?? `Great question. Based on your current business data, I can see patterns across your ${dnaModules.length} intelligence modules. To give you the most accurate answer, I'd recommend also looking at your Relationship DNA™ score (94) and Communication Intelligence™ (83) — both are performing well and provide context for this question. Would you like me to analyse a specific module in more detail?`;
			setMessages((m) => [...m, {
				role: "ai",
				content: response
			}]);
			setLoading(false);
		}, 900);
	};
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border px-5 py-3.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
							className: "h-4 w-4 text-brand",
							strokeWidth: 1.75
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[13.5px] font-semibold tracking-tight text-foreground",
							children: "Business Intelligence Chat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 ml-auto rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" }), "AI Online"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-secondary/30 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Suggested questions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: suggestedPrompts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => send(p),
						className: "rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition-all hover:border-brand/30 hover:bg-brand/5 hover:text-brand",
						children: p
					}, p))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-80 flex-col overflow-y-auto p-4 space-y-3",
				children: [
					messages.map((msg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
						children: [msg.role === "ai" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mr-2 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
								className: "h-3 w-3 text-brand",
								strokeWidth: 1.75
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `max-w-[80%] rounded-2xl px-4 py-3 text-[12.5px] leading-relaxed ${msg.role === "user" ? "rounded-tr-sm bg-foreground text-background" : "rounded-tl-sm bg-secondary/60 text-foreground"}`,
							children: msg.content
						})]
					}, i)),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
								className: "h-3 w-3 text-brand",
								strokeWidth: 1.75
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1 rounded-2xl bg-secondary/60 px-4 py-3",
							children: [
								0,
								1,
								2
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50",
								style: { animationDelay: `${i * .15}s` }
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: input,
						onChange: (e) => setInput(e.target.value),
						onKeyDown: (e) => e.key === "Enter" && send(input),
						placeholder: "Ask your AI anything about your business...",
						className: "flex-1 rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-card focus:outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => send(input),
						disabled: !input.trim() || loading,
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-white transition-all hover:bg-brand/90 disabled:opacity-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
							className: "h-4 w-4",
							strokeWidth: 1.75
						})
					})]
				})
			})
		]
	});
}
function BusinessIntelligence() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessDNAGrid, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIDiscoveries, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessHealth, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CauseEffect, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIPredictions, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpportunityEngine, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskEngine, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessTimeline, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecisionEngine, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveReport, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIMemorySection, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessImpact, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntelligenceChat, {})
		]
	});
}
function IntelligencePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Intelligence",
		description: "Understand what is happening inside your business.",
		crumbs: [{ label: "Intelligence" }],
		action: {
			label: "Export Report",
			icon: Brain
		},
		secondaryAction: { label: "Refresh Analysis" }
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessIntelligence, {})] });
}
//#endregion
export { IntelligencePage as component };
