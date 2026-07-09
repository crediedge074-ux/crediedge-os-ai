import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { At as Award, Dt as Brain, E as Search, Ft as Activity, G as Map, I as MousePointerClick, Mt as ArrowRight, Pt as ArrowDown, Q as Layers, St as ChevronDown, T as Send, V as MessageSquare, X as Lightbulb, at as Globe, c as TriangleAlert, dt as Eye, ht as Cpu, jt as ArrowUp, k as RefreshCw, l as TrendingUp, p as Target, r as Wand, t as Zap, ut as FileText, v as Sparkles, xt as ChevronRight, z as Minus } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppLayout } from "./PageHeader-BxHsP49M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/website-Ddc_v_-r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var websiteScores = [
	{
		label: "Health Score",
		score: 65,
		color: "#E31B23",
		trend: -4,
		description: "Overall website health requires attention."
	},
	{
		label: "Conversion Score",
		score: 52,
		color: "#f97316",
		trend: -9,
		description: "Visitors are not converting efficiently."
	},
	{
		label: "SEO Score",
		score: 61,
		color: "#f59e0b",
		trend: -6,
		description: "Rankings dropped — content action needed."
	},
	{
		label: "Speed Score",
		score: 54,
		color: "#ef4444",
		trend: -12,
		description: "Load time 4.2s — above acceptable threshold."
	},
	{
		label: "Mobile Score",
		score: 58,
		color: "#f97316",
		trend: -8,
		description: "Mobile bounce rate increased 22% this month."
	},
	{
		label: "Accessibility Score",
		score: 74,
		color: "#10b981",
		trend: 2,
		description: "Minor contrast and ARIA label improvements needed."
	},
	{
		label: "Trust Score",
		score: 69,
		color: "#3b82f6",
		trend: 1,
		description: "Add more testimonials and trust signals."
	},
	{
		label: "CrediEdge Contribution",
		score: 67,
		color: "#8b5cf6",
		trend: -4,
		description: "Website currently reducing your overall score."
	}
];
var websiteDiscoveries = [
	{
		id: "wd1",
		title: "Homepage bounce rate increased 22% — visitors leaving immediately",
		explanation: "Between 1–9 July, homepage bounce rate climbed from 31% to 53%. The AI identified that a recent image addition increased load time by 1.8 seconds. Mobile users, who account for 64% of traffic, are disproportionately affected. Each percentage point of bounce rate increase costs approximately 2 potential leads per month.",
		businessImpact: "-£620 est./mo",
		impactType: "negative",
		confidence: 89,
		relatedPages: ["Homepage", "Service Pages"]
	},
	{
		id: "wd2",
		title: "Contact page converts at 3.1% — industry average is 8.4%",
		explanation: "The contact form has 9 fields. AI analysis of 1,200 comparable contact forms shows that reducing to 4 essential fields increases completion rate by 2.7x. Your current contact page is your highest-traffic page after the homepage, making this the single highest-ROI change available.",
		businessImpact: "+£2,800 potential/mo",
		impactType: "negative",
		confidence: 87,
		relatedPages: ["Contact Page", "Homepage"]
	},
	{
		id: "wd3",
		title: "Pricing page converts 4.1x better than average — an underdeveloped asset",
		explanation: "Visitors who reach the pricing page convert at 4.1x the rate of homepage visitors, yet only 11% of homepage visitors ever navigate to pricing. Adding a clear pricing link in the main navigation and hero section could redirect 3x more visitors to your best-converting page.",
		businessImpact: "+£3,200 potential/mo",
		impactType: "positive",
		confidence: 83,
		relatedPages: [
			"Pricing Page",
			"Homepage",
			"Navigation"
		]
	},
	{
		id: "wd4",
		title: "Google rankings dropped — 4 keywords fell from positions 3–5 to 7–9",
		explanation: "A competitor published 6 new service pages in June targeting your primary keywords. This caused 4 of your top-performing keywords to slip to page 1 lower positions, reducing organic click share by 31%. Estimated organic traffic reduction: 190 visitors/month, worth approximately £640 in potential bookings.",
		businessImpact: "-£640/mo",
		impactType: "negative",
		confidence: 84,
		relatedPages: [
			"Homepage",
			"Service Pages",
			"Blog"
		]
	},
	{
		id: "wd5",
		title: "Mobile visitors leave 47% faster than desktop — layout issue identified",
		explanation: "Average mobile session duration is 42 seconds vs 81 seconds on desktop. The AI identified that the hero section CTA button is below the fold on devices under 390px width, affecting 38% of mobile visitors. Moving the CTA above the fold could recover an estimated 14 additional monthly leads.",
		businessImpact: "+£1,960 potential/mo",
		impactType: "negative",
		confidence: 81,
		relatedPages: ["Homepage", "Service Pages"]
	}
];
var journeySteps = [
	{
		label: "Google Search",
		visitors: 1240,
		dropOff: 0,
		isDropPoint: false
	},
	{
		label: "Homepage",
		visitors: 1240,
		dropOff: 22,
		isDropPoint: true
	},
	{
		label: "Service Page",
		visitors: 487,
		dropOff: 31,
		isDropPoint: true
	},
	{
		label: "Pricing Page",
		visitors: 136,
		dropOff: 18,
		isDropPoint: false
	},
	{
		label: "Contact Form",
		visitors: 93,
		dropOff: 67,
		isDropPoint: true
	},
	{
		label: "Form Submitted",
		visitors: 31,
		dropOff: 0,
		isDropPoint: false
	},
	{
		label: "Booking Confirmed",
		visitors: 22,
		dropOff: 0,
		isDropPoint: false
	}
];
var conversionMetrics = [
	{
		label: "Monthly Visitors",
		value: "1,240",
		trend: "-18%",
		up: false,
		explanation: "SEO rankings declined — organic traffic fell 190 visits this month."
	},
	{
		label: "Leads Generated",
		value: "31",
		trend: "-12%",
		up: false,
		explanation: "Contact form completions fell — form has too many fields."
	},
	{
		label: "Conversions",
		value: "22",
		trend: "-9%",
		up: false,
		explanation: "Slower load time and weak CTAs reducing conversion from lead to booking."
	},
	{
		label: "Conversion Rate",
		value: "1.8%",
		trend: "-0.4%",
		up: false,
		explanation: "Industry average is 3.2% — significant improvement opportunity available."
	},
	{
		label: "Avg. Time on Site",
		value: "1m 42s",
		trend: "-0:31",
		up: false,
		explanation: "Down from 2m 13s — mobile users are leaving faster due to layout issues."
	},
	{
		label: "Bounce Rate",
		value: "53%",
		trend: "+22%",
		up: false,
		explanation: "Increased since image was added to homepage — load time now 4.2 seconds."
	},
	{
		label: "Top Exit Page",
		value: "Contact",
		trend: "",
		up: false,
		explanation: "67% of visitors who reach the contact page leave without submitting the form."
	},
	{
		label: "Revenue Generated",
		value: "£3,960",
		trend: "-£820",
		up: false,
		explanation: "Direct website-attributed revenue this month — down from £4,780 in June."
	}
];
var websiteOpportunities = [
	{
		id: "wo1",
		title: "Simplify contact form — reduce from 9 to 4 fields",
		estimatedRevenue: "£2,800/mo",
		conversionIncrease: "+170%",
		difficulty: "Easy",
		timeRequired: "30 min",
		confidence: 91,
		reasoning: "9-field forms average 3.1% completion. 4-field forms average 8.4%. At current traffic, recovering this gap is worth 22 additional monthly leads."
	},
	{
		id: "wo2",
		title: "Compress images — reduce load time from 4.2s to under 2.5s",
		estimatedRevenue: "£1,960/mo",
		conversionIncrease: "+32%",
		difficulty: "Easy",
		timeRequired: "1 hour",
		confidence: 88,
		reasoning: "Homepage images are uncompressed — 3.8MB total. Compressing to WebP format reduces load time by 1.8s, recovering 22% of mobile bounce."
	},
	{
		id: "wo3",
		title: "Add pricing page link to main navigation",
		estimatedRevenue: "£3,200/mo",
		conversionIncrease: "+18%",
		difficulty: "Easy",
		timeRequired: "15 min",
		confidence: 83,
		reasoning: "Pricing page converts 4.1x better than average but only 11% of visitors find it. Navigation link would triple pricing page traffic."
	},
	{
		id: "wo4",
		title: "Rewrite homepage hero — stronger CTA above the fold on mobile",
		estimatedRevenue: "£1,400/mo",
		conversionIncrease: "+22%",
		difficulty: "Medium",
		timeRequired: "2 hours",
		confidence: 79,
		reasoning: "CTA is below fold on 38% of mobile devices. Moving it above fold with a clearer action message recovers an estimated 14 leads per month."
	},
	{
		id: "wo5",
		title: "Publish 3 new service pages targeting dropped keywords",
		estimatedRevenue: "£640/mo",
		conversionIncrease: "+14%",
		difficulty: "Hard",
		timeRequired: "1 week",
		confidence: 84,
		reasoning: "4 keywords dropped from top-3 to positions 7–9. Publishing competitor-beating content should recover rankings in 4–6 weeks."
	},
	{
		id: "wo6",
		title: "Add 8 customer testimonials with photos to homepage",
		estimatedRevenue: "£1,100/mo",
		conversionIncrease: "+12%",
		difficulty: "Easy",
		timeRequired: "45 min",
		confidence: 77,
		reasoning: "Current trust score is 69. Pages with 6+ testimonials with photos convert 12% better on average. You have 23 5-star reviews to pull from."
	}
];
var seoMetrics = [
	{
		label: "Primary Keywords Ranking",
		value: "4 dropped",
		status: "critical",
		detail: "4 keywords fell from positions 3–5 to 7–9 this month."
	},
	{
		label: "Meta Descriptions",
		value: "3 missing",
		status: "warning",
		detail: "3 service pages have no meta description — reduces click-through rate."
	},
	{
		label: "Page Titles",
		value: "2 duplicate",
		status: "warning",
		detail: "Homepage and About page share the same title tag."
	},
	{
		label: "Broken Links",
		value: "1 found",
		status: "warning",
		detail: "One internal link on the blog points to a deleted page."
	},
	{
		label: "Indexing Status",
		value: "All indexed",
		status: "good",
		detail: "All 11 pages are indexed by Google."
	},
	{
		label: "Internal Linking",
		value: "Weak",
		status: "critical",
		detail: "Pricing page has only 1 internal link — Google cannot discover it easily."
	},
	{
		label: "Page Structure (H1/H2)",
		value: "2 pages missing H1",
		status: "warning",
		detail: "About and FAQ pages are missing H1 headings."
	},
	{
		label: "Schema Markup",
		value: "Missing",
		status: "critical",
		detail: "No LocalBusiness or Service schema — missing rich results opportunity."
	},
	{
		label: "Core Web Vitals",
		value: "Failing",
		status: "critical",
		detail: "LCP: 4.2s (poor). CLS: 0.21 (poor). FID: 89ms (needs improvement)."
	},
	{
		label: "Backlinks",
		value: "14 domains",
		status: "warning",
		detail: "Low domain authority. Competitor averages 47 referring domains."
	}
];
var contentIssues = [
	{
		id: "ci1",
		page: "Homepage",
		type: "weak-headline",
		issue: "Headline reads 'Welcome to [Business Name]' — generic and unconvincing",
		suggestion: "Replace with a benefit-led headline: 'Fast, Reliable [Service] — Trusted by 200+ [Location] Customers'",
		impact: "high"
	},
	{
		id: "ci2",
		page: "Contact Page",
		type: "poor-cta",
		issue: "CTA button reads 'Submit' — no urgency or benefit",
		suggestion: "Replace with 'Get Your Free Quote Today' or 'Book My Appointment →'",
		impact: "high"
	},
	{
		id: "ci3",
		page: "Service Pages",
		type: "missing-proof",
		issue: "No testimonials or case studies on service pages",
		suggestion: "Add 2–3 customer quotes with star ratings directly below each service description",
		impact: "high"
	},
	{
		id: "ci4",
		page: "Homepage",
		type: "missing-faq",
		issue: "No FAQ section — visitors have unanswered questions about pricing and process",
		suggestion: "Add 6-question FAQ covering price, timing, what's included, and what to expect",
		impact: "medium"
	},
	{
		id: "ci5",
		page: "About Page",
		type: "low-trust",
		issue: "No team photos, credentials, or certifications visible",
		suggestion: "Add owner photo, years in business, accreditations, and a brief personal story",
		impact: "medium"
	},
	{
		id: "ci6",
		page: "Service Pages",
		type: "confusing",
		issue: "Service descriptions are technical — visitors don't understand the benefit",
		suggestion: "Rewrite in plain English: 'What you get', 'How it works', 'What it costs'",
		impact: "medium"
	}
];
var websitePredictions = [
	{
		label: "Monthly Traffic",
		current: "1,240/mo",
		predicted: "1,050/mo",
		confidence: 82,
		direction: "down",
		reasoning: "SEO rankings will continue declining without content intervention. Estimated further 16% organic traffic loss.",
		timeframe: "Next 30 days"
	},
	{
		label: "Lead Generation",
		current: "31/mo",
		predicted: "47/mo",
		confidence: 79,
		direction: "up",
		reasoning: "Fixing the contact form alone (9→4 fields) is predicted to increase monthly leads by 52%.",
		timeframe: "After form fix"
	},
	{
		label: "Conversion Rate",
		current: "1.8%",
		predicted: "3.1%",
		confidence: 77,
		direction: "up",
		reasoning: "Speed + CTA + form improvements combined could bring conversion rate close to industry average.",
		timeframe: "After full fixes"
	},
	{
		label: "SEO Rankings",
		current: "Pos 7–9",
		predicted: "Pos 4–6",
		confidence: 71,
		direction: "up",
		reasoning: "Publishing 3 new content pages should recover dropped keyword positions within 6 weeks.",
		timeframe: "6 weeks"
	},
	{
		label: "Revenue from Website",
		current: "£3,960/mo",
		predicted: "£7,200/mo",
		confidence: 74,
		direction: "up",
		reasoning: "Cumulative impact of all opportunity fixes estimated at +£3,240/mo additional revenue.",
		timeframe: "90 days"
	},
	{
		label: "Mobile Bounce Rate",
		current: "53%",
		predicted: "31%",
		confidence: 85,
		direction: "up",
		reasoning: "Image compression alone is expected to bring mobile bounce rate back to pre-July levels.",
		timeframe: "After speed fix"
	}
];
var websiteMissions = [
	{
		id: "wm1",
		campaign: "Increase Website Conversions",
		mission: "Optimise Homepage for Conversions",
		tasks: [
			"Compress homepage images to WebP",
			"Move CTA above fold on mobile",
			"Add 8 customer testimonials with photos",
			"Rewrite hero headline with benefit-led copy"
		],
		status: "active",
		estimatedRevenue: "£3,460/mo"
	},
	{
		id: "wm2",
		campaign: "Increase Website Conversions",
		mission: "Fix Contact Form",
		tasks: [
			"Reduce form from 9 to 4 fields",
			"Change submit button copy to 'Get Your Free Quote'",
			"Add trust badge below form",
			"Enable auto-confirmation email"
		],
		status: "planned",
		estimatedRevenue: "£2,800/mo"
	},
	{
		id: "wm3",
		campaign: "Recover SEO Rankings",
		mission: "Publish Service Content Pages",
		tasks: [
			"Research competitor keyword gaps",
			"Write 3 service-focused landing pages",
			"Add internal links from homepage",
			"Submit updated sitemap to Google"
		],
		status: "planned",
		estimatedRevenue: "£640/mo"
	}
];
var dnaContributions = [
	{
		module: "Relationship DNA™",
		contribution: 42,
		color: "#E31B23",
		route: "/relationships"
	},
	{
		module: "Communication Intelligence™",
		contribution: 38,
		color: "#3b82f6",
		route: "/communications"
	},
	{
		module: "Reputation DNA™",
		contribution: 61,
		color: "#10b981",
		route: "/reviews"
	},
	{
		module: "Revenue DNA™",
		contribution: 55,
		color: "#f59e0b",
		route: "/insights"
	},
	{
		module: "Marketing DNA™",
		contribution: 78,
		color: "#8b5cf6",
		route: "/insights"
	},
	{
		module: "Operations DNA™",
		contribution: 29,
		color: "#06b6d4",
		route: "/tasks"
	},
	{
		module: "Automation DNA™",
		contribution: 33,
		color: "#6b7280",
		route: "/tasks"
	},
	{
		module: "Finance DNA™",
		contribution: 24,
		color: "#ec4899",
		route: "/health"
	}
];
var websiteMemoryItems = [
	{
		id: "wm1",
		insight: "Visitors convert 2.7x better after testimonials were added to service pages in April",
		learnedFrom: "A/B test — 312 visits compared",
		confidence: 93,
		category: "Conversions"
	},
	{
		id: "wm2",
		insight: "Mobile users respond to shorter hero sections — pages under 600px height on mobile convert 34% better",
		learnedFrom: "Mobile session analysis",
		confidence: 88,
		category: "Mobile"
	},
	{
		id: "wm3",
		insight: "Contact forms with 4 fields or fewer achieve 8.4% average completion — 9+ fields average 3.1%",
		learnedFrom: "1,200 form analysis dataset",
		confidence: 94,
		category: "Forms"
	},
	{
		id: "wm4",
		insight: "Landing pages with embedded video increase average session time by 1m 42s",
		learnedFrom: "Video landing page experiments",
		confidence: 82,
		category: "Content"
	},
	{
		id: "wm5",
		insight: "Pages with schema markup rank 23% higher on average than comparable pages without",
		learnedFrom: "SEO correlation analysis",
		confidence: 79,
		category: "SEO"
	},
	{
		id: "wm6",
		insight: "Every 1-second improvement in load time increases conversions by approximately 7%",
		learnedFrom: "Core Web Vitals data",
		confidence: 91,
		category: "Speed"
	}
];
var websiteImpactMetrics = [
	{
		label: "Revenue Generated",
		value: 3960,
		prefix: "£",
		description: "Direct website-attributed this month",
		color: "#E31B23"
	},
	{
		label: "Leads Generated",
		value: 31,
		description: "Form submissions and enquiries",
		color: "#10b981"
	},
	{
		label: "Potential Revenue (Fixes)",
		value: 9700,
		prefix: "£",
		description: "Unlockable with recommended fixes",
		color: "#f59e0b"
	},
	{
		label: "Bounce Reduction Potential",
		value: 22,
		suffix: "%",
		description: "Mobile bounce recoverable with speed fix",
		color: "#3b82f6"
	},
	{
		label: "SEO Improvement (Fixes)",
		value: 31,
		suffix: "%",
		description: "Expected traffic recovery after content fix",
		color: "#8b5cf6"
	},
	{
		label: "Hours of AI Analysis",
		value: 47,
		description: "AI has analysed your website this month",
		color: "#06b6d4"
	},
	{
		label: "Issues Identified",
		value: 18,
		description: "Across performance, SEO, content, and UX",
		color: "#ef4444"
	},
	{
		label: "CrediEdge Score Impact",
		value: 67,
		suffix: "/100",
		description: "Current website contribution to your score",
		color: "#f97316"
	}
];
var websiteSuggestedPrompts = [
	"Why aren't visitors converting?",
	"What is my biggest website problem?",
	"How do I fix my bounce rate?",
	"Why did my Google rankings drop?",
	"What would double my leads?",
	"How does my site compare to competitors?",
	"What should I fix first?",
	"How much revenue is my website losing?"
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
		style: { transform: "rotate(-90deg)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: size / 2,
			cy: size / 2,
			r,
			fill: "none",
			stroke: "oklch(0.925 0 0)",
			strokeWidth: stroke
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
			style: { transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }
		})]
	});
}
function ProgressBar({ value, color = "#E31B23", height = 6 }) {
	const [width, setWidth] = (0, import_react.useState)(0);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setTimeout(() => setWidth(value), 100);
				obs.disconnect();
			}
		}, { threshold: .2 });
		obs.observe(el);
		return () => obs.disconnect();
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "w-full rounded-full bg-secondary",
		style: { height },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-full transition-all duration-700 ease-out",
			style: {
				width: `${width}%`,
				height,
				backgroundColor: color
			}
		})
	});
}
function WebsiteDNAHero() {
	const [showExplain, setShowExplain] = (0, import_react.useState)(false);
	const mainScore = websiteScores[0];
	const otherScores = websiteScores.slice(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-2xl bg-foreground text-background shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-background/10 px-6 py-5 sm:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
								className: "h-5 w-5 text-[#f97316]",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[13px] font-semibold uppercase tracking-widest text-background/60",
								children: "Website DNA™"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-[28px] font-bold leading-tight tracking-tight text-background sm:text-[32px]",
							children: "Is Your Website Helping or Hurting?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 max-w-xl text-[14px] leading-relaxed text-background/60",
							children: "AI has analysed your website across 8 performance dimensions. Action is required."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-semibold uppercase tracking-widest text-background/50",
									children: "Health Score"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[42px] font-bold leading-none text-background",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: mainScore.score })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-background/50",
									children: "out of 100"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
							score: mainScore.score,
							size: 76,
							stroke: 6,
							color: "#f97316"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 divide-background/10 sm:grid-cols-4 sm:divide-x",
				children: otherScores.slice(0, 4).map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex flex-col gap-3 px-5 py-5 ${i > 0 ? "border-l border-background/10 sm:border-0" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-background/50",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `text-[11px] font-semibold ${s.trend >= 0 ? "text-emerald-400" : "text-red-400"}`,
								children: [s.trend >= 0 ? "+" : "", s.trend]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[26px] font-bold leading-none text-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: s.score })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
								score: s.score,
								size: 36,
								stroke: 4,
								color: s.color
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
							value: s.score,
							color: s.color,
							height: 3
						})
					]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 divide-background/10 border-t border-background/10 sm:grid-cols-4 sm:divide-x",
				children: otherScores.slice(4).map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex flex-col gap-3 px-5 py-5 ${i > 0 ? "border-l border-background/10 sm:border-0" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-background/50",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `text-[11px] font-semibold ${s.trend >= 0 ? "text-emerald-400" : "text-red-400"}`,
								children: [s.trend >= 0 ? "+" : "", s.trend]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[26px] font-bold leading-none text-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: s.score })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
								score: s.score,
								size: 36,
								stroke: 4,
								color: s.color
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
							value: s.score,
							color: s.color,
							height: 3
						})
					]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-background/10 px-6 py-5 sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowExplain(!showExplain),
					className: "flex items-center gap-2 rounded-xl border border-background/20 px-4 py-2.5 text-[13px] font-semibold text-background/80 transition-colors hover:bg-background/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							className: "h-4 w-4 text-[#f97316]",
							strokeWidth: 1.75
						}),
						"Explain Everything",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform duration-200 ${showExplain ? "rotate-180" : ""}` })
					]
				}), showExplain && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-xl border border-background/10 bg-background/5 p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[13.5px] leading-relaxed text-background/80",
						children: [
							"Your website is currently ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-background",
								children: "underperforming across 6 of 8 dimensions"
							}),
							". The most critical issue is page speed — a 4.2-second load time is causing 22% of mobile visitors to leave before the page loads. This directly impacts conversion rate (currently 1.8% vs 3.2% industry average). Combined with a contact form that has too many fields and a homepage CTA that is below the fold on mobile, your website is losing an estimated ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-background",
								children: "£5,760 in potential monthly revenue"
							}),
							". The good news: 3 of the top 6 fixes are Easy difficulty and require under 1 hour to implement."
						]
					})
				})]
			})
		]
	});
}
function AIExecutiveSummary() {
	const [showFull, setShowFull] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-2xl bg-foreground text-background shadow-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 py-5 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
							className: "h-5 w-5 text-[#f97316]",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[13px] font-semibold uppercase tracking-widest text-background/60",
							children: "AI Executive Summary"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl border border-background/20 px-3 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 animate-pulse rounded-full bg-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12px] font-semibold text-background/60",
							children: "94% Confidence"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-[15px] leading-relaxed text-background/90",
					children: [
						"Your website is ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-background",
							children: "attracting visitors but failing to convert them"
						}),
						". Traffic increased 18% in Q2 but conversions fell 9% — a divergence that points directly to UX and speed issues rather than a demand problem. The AI has identified that slow page loading (4.2 seconds on mobile) and a contact form with 9 required fields are the primary conversion blockers."
					]
				}),
				showFull && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-2 text-[14px] leading-relaxed text-background/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Fixing page speed alone is expected to recover 22% of mobile bounce and generate approximately ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-background",
								children: "£1,960 in additional monthly leads"
							}),
							". Reducing the contact form to 4 fields could increase completions from 3.1% to 8.4%, adding a further ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-background",
								children: "£2,800/month"
							}),
							"."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "SEO erosion is a secondary concern. Four keywords dropped from positions 3–5 to 7–9 following competitor content activity. Without intervention, organic traffic is projected to fall a further 16% over the next 30 days." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium text-background",
							children: [
								"Combined, the recommended fixes could generate an additional ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "£5,760–£9,700/month" }),
								" within 90 days."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowFull(!showFull),
					className: "mt-4 flex items-center gap-2 text-[13px] font-semibold text-[#f97316] transition-opacity hover:opacity-70",
					children: [showFull ? "Show Less" : "Explain Everything", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform duration-200 ${showFull ? "rotate-180" : ""}` })]
				})
			]
		})
	});
}
function WebsiteHealth() {
	const healthItems = [
		{
			label: "Overall Health",
			score: 65,
			color: "#E31B23"
		},
		{
			label: "Performance",
			score: 54,
			color: "#ef4444"
		},
		{
			label: "SEO",
			score: 61,
			color: "#f59e0b"
		},
		{
			label: "Conversions",
			score: 52,
			color: "#f97316"
		},
		{
			label: "User Experience",
			score: 63,
			color: "#f97316"
		},
		{
			label: "Accessibility",
			score: 74,
			color: "#10b981"
		},
		{
			label: "Security",
			score: 88,
			color: "#10b981"
		},
		{
			label: "Forms",
			score: 38,
			color: "#ef4444"
		},
		{
			label: "Tracking",
			score: 71,
			color: "#3b82f6"
		}
	];
	const statusLabel = (s) => s >= 80 ? "Excellent" : s >= 70 ? "Good" : s >= 55 ? "Needs Work" : "Critical";
	const statusColor = (s) => s >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : s >= 70 ? "text-blue-600 bg-blue-50 border-blue-200" : s >= 55 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
				className: "h-4.5 w-4.5 text-muted-foreground",
				strokeWidth: 1.75
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[14px] font-semibold text-foreground",
				children: "Website Health Dashboard"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-3 gap-px bg-border sm:grid-cols-3 lg:grid-cols-9",
			children: healthItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-3 bg-card px-3 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
					score: item.score,
					size: 64,
					stroke: 5,
					color: item.color
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[20px] font-bold text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: item.score })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[10.5px] font-medium text-muted-foreground",
							children: item.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mt-1.5 inline-block rounded border px-1.5 py-0.5 text-[9.5px] font-semibold ${statusColor(item.score)}`,
							children: statusLabel(item.score)
						})
					]
				})]
			}, item.label))
		})]
	});
}
function AIDiscoveries() {
	const [expanded, setExpanded] = (0, import_react.useState)("wd1");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, {
					className: "h-4.5 w-4.5 text-[#f97316]",
					strokeWidth: 1.75
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "AI Discoveries"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white",
					children: websiteDiscoveries.length
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: websiteDiscoveries.map((d) => {
				const open = expanded === d.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex w-full items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-secondary/30",
					onClick: () => setExpanded(open ? null : d.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mt-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${d.impactType === "positive" ? "bg-emerald-50 text-emerald-700" : d.impactType === "negative" ? "bg-red-50 text-red-700" : "bg-secondary text-muted-foreground"}`,
							children: d.businessImpact
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[13.5px] font-semibold text-foreground",
								children: d.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-2",
								children: [d.relatedPages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground",
									children: p
								}, p)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground",
									children: [d.confidence, "% confidence"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}` })
					]
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border bg-secondary/20 px-6 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] leading-relaxed text-muted-foreground",
						children: d.explanation
					})
				})] }, d.id);
			})
		})]
	});
}
function WebsiteJourney() {
	const maxVisitors = journeySteps[0].visitors;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, {
					className: "h-4.5 w-4.5 text-muted-foreground",
					strokeWidth: 1.75
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "Visitor Journey"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto text-[12px] text-muted-foreground",
					children: "Where visitors drop off"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-0",
				children: journeySteps.map((step, i) => {
					const widthPct = step.visitors / maxVisitors * 100;
					const isLast = i === journeySteps.length - 1;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-36 shrink-0 text-right text-[12px] font-medium text-muted-foreground sm:w-44",
								children: step.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative h-8 flex-1 overflow-hidden rounded-lg bg-secondary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-full items-center justify-end pr-2 transition-all duration-700 ease-out",
											style: {
												width: `${widthPct}%`,
												backgroundColor: step.isDropPoint ? "#ef4444" : "#E31B23",
												opacity: step.isDropPoint ? .7 : 1
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-semibold text-white",
												children: step.visitors.toLocaleString()
											})
										})
									}),
									step.isDropPoint && step.dropOff > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex w-20 shrink-0 items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3.5 w-3.5 text-red-500" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] font-semibold text-red-500",
												children: [
													"-",
													step.dropOff,
													"%"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground",
												children: "leave"
											})
										]
									}),
									!step.isDropPoint && step.dropOff === 0 && i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-20 shrink-0" })
								]
							})]
						}), !isLast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ml-36 flex items-center sm:ml-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ml-4 h-4 w-px bg-border" })
						})]
					}, step.label);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-3 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-sm bg-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11.5px] text-muted-foreground",
						children: "Normal flow"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-sm bg-red-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11.5px] text-muted-foreground",
						children: "High drop-off point"
					})]
				})]
			})]
		})]
	});
}
function ConversionIntelligence() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
					className: "h-4.5 w-4.5 text-muted-foreground",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "Conversion Intelligence"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-px bg-border sm:grid-cols-4",
				children: conversionMetrics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex flex-col gap-1.5 bg-card px-4 py-4 text-left transition-colors hover:bg-secondary/30",
					onClick: () => setExpanded(expanded === m.label ? null : m.label),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-muted-foreground",
								children: m.label
							}), m.trend && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10.5px] font-semibold ${m.up ? "text-emerald-600" : "text-red-500"}`,
								children: m.trend
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[20px] font-bold tracking-tight text-foreground",
							children: m.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10.5px] text-muted-foreground/60",
							children: "Tap for insight →"
						})
					]
				}, m.label))
			}),
			expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border bg-secondary/30 px-6 py-4",
				children: conversionMetrics.filter((m) => m.label === expanded).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[13px] leading-relaxed text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
							className: "text-foreground",
							children: [m.label, ":"]
						}),
						" ",
						m.explanation
					]
				}, m.label))
			})
		]
	});
}
function AIOpportunities() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const diffColor = (d) => d === "Easy" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : d === "Medium" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-red-700 bg-red-50 border-red-200";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
					className: "h-4.5 w-4.5 text-[#f97316]",
					strokeWidth: 1.75
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "AI Opportunities"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white",
					children: websiteOpportunities.length
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: websiteOpportunities.map((op, i) => {
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[13.5px] font-semibold text-foreground",
										children: op.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700",
												children: op.estimatedRevenue
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700",
												children: [op.conversionIncrease, " conversion"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `rounded border px-2 py-0.5 text-[11px] font-semibold ${diffColor(op.difficulty)}`,
												children: op.difficulty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground",
												children: op.timeRequired
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground",
												children: [op.confidence, "% confidence"]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "rounded-lg bg-brand px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-80",
										children: "Start Mission"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setExpanded(open ? null : op.id),
										className: "rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:bg-secondary",
										children: open ? "Hide" : "Explain Why"
									})]
								})]
							}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 rounded-xl border border-border bg-secondary/30 p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] leading-relaxed text-muted-foreground",
									children: op.reasoning
								})
							})]
						})]
					})
				}, op.id);
			})
		})]
	});
}
function SEODNA() {
	const statusConfig = {
		good: {
			color: "text-emerald-700 bg-emerald-50 border-emerald-200",
			dot: "bg-emerald-500"
		},
		warning: {
			color: "text-amber-700 bg-amber-50 border-amber-200",
			dot: "bg-amber-500"
		},
		critical: {
			color: "text-red-700 bg-red-50 border-red-200",
			dot: "bg-red-500"
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "h-4.5 w-4.5 text-muted-foreground",
					strokeWidth: 1.75
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "SEO DNA"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-auto text-[12px] text-muted-foreground",
					children: [
						seoMetrics.filter((s) => s.status === "good").length,
						"/",
						seoMetrics.length,
						" passing"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: seoMetrics.map((m) => {
				const cfg = statusConfig[m.status];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-4 px-6 py-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[13px] font-semibold text-foreground",
								children: m.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded border px-2 py-0.5 text-[10.5px] font-semibold ${cfg.color}`,
								children: m.value
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[12px] text-muted-foreground",
							children: m.detail
						})]
					})]
				}, m.label);
			})
		})]
	});
}
function ContentIntelligence() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const typeLabel = {
		"weak-headline": "Weak Headline",
		"confusing": "Confusing Section",
		"low-trust": "Low Trust",
		"poor-cta": "Poor CTA",
		"missing-faq": "Missing FAQ",
		"missing-proof": "Missing Proof"
	};
	const typeColor = {
		"weak-headline": "text-amber-700 bg-amber-50 border-amber-200",
		"confusing": "text-orange-700 bg-orange-50 border-orange-200",
		"low-trust": "text-red-700 bg-red-50 border-red-200",
		"poor-cta": "text-red-700 bg-red-50 border-red-200",
		"missing-faq": "text-blue-700 bg-blue-50 border-blue-200",
		"missing-proof": "text-purple-700 bg-purple-50 border-purple-200"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
					className: "h-4.5 w-4.5 text-muted-foreground",
					strokeWidth: 1.75
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "Content Intelligence"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white",
					children: contentIssues.length
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: contentIssues.map((ci) => {
				const open = expanded === ci.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex w-full items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-secondary/30",
					onClick: () => setExpanded(open ? null : ci.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-secondary px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground",
									children: ci.page
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded border px-1.5 py-0.5 text-[10.5px] font-semibold ${typeColor[ci.type]}`,
									children: typeLabel[ci.type]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `rounded px-1.5 py-0.5 text-[10.5px] font-semibold ${ci.impact === "high" ? "text-red-600" : ci.impact === "medium" ? "text-amber-600" : "text-muted-foreground"}`,
									children: [ci.impact, " impact"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-[13px] font-medium text-foreground",
							children: ci.issue
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}` })]
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border bg-secondary/20 px-6 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wand, {
							className: "mt-0.5 h-4 w-4 shrink-0 text-brand",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[13px] leading-relaxed text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "AI Suggestion:"
								}),
								" ",
								ci.suggestion
							]
						})]
					})
				})] }, ci.id);
			})
		})]
	});
}
function HeatmapInsights() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-6 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointerClick, {
					className: "h-4.5 w-4.5 text-muted-foreground",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "Heatmap Insights"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground",
				children: "Microsoft Clarity · Coming Soon"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 p-6 sm:grid-cols-3",
			children: [
				{
					label: "Click Heatmap",
					description: "See exactly where visitors click most on each page.",
					icon: MousePointerClick,
					color: "#E31B23"
				},
				{
					label: "Scroll Depth",
					description: "Understand how far down visitors read before leaving.",
					icon: ArrowDown,
					color: "#f97316"
				},
				{
					label: "Attention Areas",
					description: "AI identifies which page sections hold attention longest.",
					icon: Eye,
					color: "#3b82f6"
				},
				{
					label: "Dead Clicks",
					description: "Detect elements visitors click that do nothing — broken UX.",
					icon: Target,
					color: "#f59e0b"
				},
				{
					label: "Rage Clicks",
					description: "Find areas where frustrated visitors repeatedly click.",
					icon: TriangleAlert,
					color: "#ef4444"
				},
				{
					label: "Session Replays",
					description: "Watch anonymised recordings of real visitor sessions.",
					icon: Activity,
					color: "#8b5cf6"
				}
			].map(({ label, description, icon: Icon, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-xl border border-dashed border-border bg-secondary/30 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "h-4.5 w-4.5",
							style: { color },
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-semibold text-foreground",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11.5px] leading-relaxed text-muted-foreground",
						children: description
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10.5px] font-medium text-muted-foreground/60",
						children: "Connects with Microsoft Clarity"
					})
				]
			}, label))
		})]
	});
}
function AIPredictions() {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const dirIcon = (d) => d === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-3.5 w-3.5 text-emerald-500" }) : d === "down" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3.5 w-3.5 text-red-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5 text-muted-foreground" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
				className: "h-4.5 w-4.5 text-muted-foreground",
				strokeWidth: 1.75
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[14px] font-semibold text-foreground",
				children: "AI Predictions"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3",
			children: websitePredictions.map((p) => {
				const open = expanded === p.label;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex flex-col gap-2 bg-card px-5 py-4 text-left transition-colors hover:bg-secondary/30",
					onClick: () => setExpanded(open ? null : p.label),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11.5px] font-medium text-muted-foreground",
								children: p.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [dirIcon(p.direction), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10.5px] text-muted-foreground",
									children: [p.confidence, "%"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[18px] font-bold text-foreground",
								children: p.predicted
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mb-0.5 text-[11.5px] text-muted-foreground",
								children: ["from ", p.current]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10.5px] text-muted-foreground/70",
							children: p.timeframe
						}),
						open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 rounded-lg bg-secondary/50 p-2.5 text-[12px] leading-relaxed text-muted-foreground",
							children: p.reasoning
						})
					]
				}, p.label);
			})
		})]
	});
}
function WebsiteMissions() {
	const statusColor = (s) => s === "active" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : s === "planned" ? "text-blue-700 bg-blue-50 border-blue-200" : "text-muted-foreground bg-secondary border-border";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
				className: "h-4.5 w-4.5 text-muted-foreground",
				strokeWidth: 1.75
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[14px] font-semibold text-foreground",
				children: "Website Missions"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-0 divide-y divide-border",
			children: websiteMissions.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: m.campaign
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[14px] font-semibold text-foreground",
						children: m.mission
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700",
							children: m.estimatedRevenue
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusColor(m.status)}`,
							children: m.status
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1.5",
					children: m.tasks.map((task, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 rounded-lg border border-border bg-secondary/30 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 shrink-0 rounded border border-border bg-card" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12.5px] text-foreground",
							children: task
						})]
					}, i))
				})]
			}, m.id))
		})]
	});
}
function BusinessDNAPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
					className: "h-4.5 w-4.5 text-muted-foreground",
					strokeWidth: 1.75
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "Business DNA™ — Website Contribution"
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
				children: "Website DNA™ contributes data to the following Business DNA™ modules. Improving your website score improves your overall CrediEdge Score."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: dnaContributions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: d.route,
					className: "flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-8 w-8 shrink-0 rounded-lg",
							style: {
								backgroundColor: `${d.color}18`,
								border: `1px solid ${d.color}30`
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-full items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2.5 w-2.5 rounded-full",
									style: { backgroundColor: d.color }
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[13px] font-semibold text-foreground",
								children: d.module
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
								value: d.contribution,
								color: d.color,
								height: 4
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[15px] font-bold text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
									value: d.contribution,
									suffix: "%"
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" })
					]
				}, d.module))
			})]
		})]
	});
}
function AIMemorySection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, {
					className: "h-4.5 w-4.5 text-muted-foreground",
					strokeWidth: 1.75
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "AI Memory"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto text-[12px] text-muted-foreground",
					children: "Continuously learning"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: websiteMemoryItems.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-4 px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] leading-relaxed text-foreground",
						children: m.insight
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground",
								children: m.learnedFrom
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-secondary px-1.5 py-0.5 text-[10.5px] text-muted-foreground",
								children: m.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10.5px] font-semibold text-emerald-600",
								children: [m.confidence, "% confidence"]
							})
						]
					})]
				})]
			}, m.id))
		})]
	});
}
function WebsiteImpact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
				className: "h-4.5 w-4.5 text-muted-foreground",
				strokeWidth: 1.75
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[14px] font-semibold text-foreground",
				children: "Website Impact"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-px bg-border sm:grid-cols-4",
			children: websiteImpactMetrics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
		})]
	});
}
function ExecutiveReport() {
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [generated, setGenerated] = (0, import_react.useState)(false);
	const handleGenerate = () => {
		setGenerating(true);
		setTimeout(() => {
			setGenerating(false);
			setGenerated(true);
		}, 1800);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-6 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
					className: "h-4.5 w-4.5 text-muted-foreground",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "Executive Website Report"
				})]
			}), generated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-80",
				children: "Download Report (PDF)"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleGenerate,
				disabled: generating,
				className: "flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-[12.5px] font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-60",
				children: generating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }), "Generating…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
					className: "h-3.5 w-3.5",
					strokeWidth: 1.75
				}), "Generate Report"] })
			})]
		}), generated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "divide-y divide-border",
			children: [[
				{
					label: "Summary",
					value: "Website performing below potential. 3 critical fixes available within 1 hour."
				},
				{
					label: "Strengths",
					value: "Security (88/100). Pricing page converts well. Accessibility improving."
				},
				{
					label: "Weaknesses",
					value: "Speed (54/100). Contact form (9 fields). Mobile CTA placement. SEO erosion."
				},
				{
					label: "Risks",
					value: "Organic traffic projected to fall 16% without SEO intervention in 30 days."
				},
				{
					label: "Opportunities",
					value: "£9,700/mo recoverable. 6 identified opportunities. 3 require under 1 hour."
				},
				{
					label: "Priority Actions",
					value: "1. Compress images. 2. Simplify contact form. 3. Add pricing to navigation."
				}
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 px-6 py-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-28 shrink-0 text-[12px] font-semibold text-muted-foreground",
					children: s.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13px] text-foreground",
					children: s.value
				})]
			}, s.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-6 py-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[12px] text-muted-foreground",
					children: ["AI Confidence: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: "91%"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[12px] text-muted-foreground",
					children: ["Generated: ", (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", {
						day: "numeric",
						month: "short",
						year: "numeric"
					})]
				})]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
					className: "h-10 w-10 text-muted-foreground/30",
					strokeWidth: 1.25
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[14px] font-semibold text-foreground",
					children: "Generate Your Website Report"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm text-[13px] text-muted-foreground",
					children: "The AI will generate a complete executive report including summary, strengths, weaknesses, risks, opportunities, and priority actions."
				})
			]
		})]
	});
}
var chatResponses = {
	"Why aren't visitors converting?": "Your conversion rate is 1.8% vs an industry average of 3.2%. The AI has identified three primary blockers: (1) A 4.2-second load time causing 22% of mobile visitors to leave before the page loads. (2) A contact form with 9 mandatory fields — industry data shows 9+ fields average 3.1% completion vs 8.4% for 4-field forms. (3) Your homepage CTA button is below the fold on 38% of mobile devices. Fixing these three issues alone is projected to increase conversions by 72%.",
	"What is my biggest website problem?": "Your biggest single problem is page speed. At 4.2 seconds load time, you're failing Google's Core Web Vitals (LCP, CLS, FID all in 'poor' range). This is a triple problem: it directly causes mobile visitors to leave, it reduces your Google search ranking, and it affects conversion rate. The fix is straightforward — your homepage images are uncompressed (3.8MB). Converting to WebP format reduces load time by approximately 1.8 seconds and costs nothing.",
	"How do I fix my bounce rate?": "Your bounce rate is 53%, up from 31% last month. The AI traced this directly to a large uncompressed image added to the homepage on 28 June, which increased page load time from 2.4 to 4.2 seconds. Step 1: Compress all homepage images to WebP format (1 hour). Step 2: Move the CTA above the fold on mobile (30 minutes). These two actions are projected to bring mobile bounce back to 31–35% within 2 weeks.",
	"Why did my Google rankings drop?": "Four of your primary keywords dropped from positions 3–5 to 7–9 during June. The AI identified two causes: (1) A competitor published 6 new service pages in June specifically targeting your primary keywords, and (2) your Core Web Vitals score dropped to 'poor', which is a ranking factor. To recover: publish 3 targeted service pages within 4–6 weeks, fix page speed (which also helps rankings), and add internal links to your pricing page, which currently has only 1 internal link.",
	"What would double my leads?": "Doubling your leads (from 31 to 62/month) requires two changes: (1) Fix the contact form — reducing from 9 to 4 fields is projected to increase form completions from 3.1% to 8.4%, adding approximately 22 additional monthly leads at current traffic. (2) Recover SEO rankings — fixing speed + publishing content should restore organic traffic, adding the remaining volume needed. Combined, these two actions are the fastest path to 62+ monthly leads.",
	"How does my site compare to competitors?": "Based on available data, your competitors are outperforming you in three key areas: (1) Page speed — your main competitor loads in 1.8 seconds vs your 4.2 seconds. (2) Content volume — they published 6 new service pages in June; you have had no new content in 3 months. (3) Backlinks — your competitors average 47 referring domains; you have 14. Your strengths: security (88/100), accessibility (74/100), and your pricing page converts exceptionally well once visitors find it.",
	"What should I fix first?": "Fix the contact form first. It is the highest ROI action available: Easy difficulty, 30 minutes to implement, and projected to generate an additional £2,800/month. It requires no design changes — simply remove 5 non-essential fields. Second priority: compress homepage images (1 hour, £1,960/month recovery). Third priority: add pricing page to navigation (15 minutes, £3,200/month potential). All three can be done today for a combined projected impact of £7,960/month.",
	"How much revenue is my website losing?": "The AI estimates your website is currently underperforming by £5,740–£9,700 per month compared to its potential. Broken down: slow page speed costs approximately £1,960/month in mobile bounce, the broken contact form costs approximately £2,800/month in lost leads, weak CTAs and missing pricing navigation cost approximately £1,400–£3,200/month, and declining SEO is costing approximately £640/month in organic traffic. The total opportunity if all 6 recommended fixes are implemented is approximately £9,700/month."
};
function WebsiteChat() {
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [typing, setTyping] = (0, import_react.useState)(false);
	const bottomRef = (0, import_react.useRef)(null);
	const sendMessage = (text) => {
		const userMsg = text.trim();
		if (!userMsg) return;
		setMessages((prev) => [...prev, {
			role: "user",
			content: userMsg
		}]);
		setInput("");
		setTyping(true);
		setTimeout(() => {
			const response = chatResponses[userMsg] ?? "The AI is analysing your website data to answer that question. Based on your current performance metrics, the most impactful action you can take today is to simplify your contact form (from 9 to 4 fields) and compress your homepage images. These two changes are projected to generate an additional £4,760/month within 30 days.";
			setMessages((prev) => [...prev, {
				role: "ai",
				content: response
			}]);
			setTyping(false);
		}, 900);
	};
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, typing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 border-b border-border px-6 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, {
						className: "h-4.5 w-4.5 text-muted-foreground",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[14px] font-semibold text-foreground",
						children: "Ask About Your Website"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-medium text-muted-foreground",
							children: "AI Active"
						})]
					})
				]
			}),
			messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[12.5px] font-medium text-muted-foreground",
					children: "Suggested questions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: websiteSuggestedPrompts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => sendMessage(p),
						className: "rounded-xl border border-border bg-secondary px-3 py-2 text-[12.5px] text-foreground transition-colors hover:bg-secondary/70",
						children: p
					}, p))
				})]
			}),
			messages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-80 overflow-y-auto px-6 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${m.role === "user" ? "bg-brand text-white" : "bg-secondary text-foreground"}`,
								children: m.content
							})
						}, i)),
						typing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" })
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border px-4 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						sendMessage(input);
					},
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: "Ask about your website performance…",
						className: "flex-1 rounded-xl border border-border bg-secondary px-4 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/60 focus:border-brand focus:outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !input.trim() || typing,
						className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-opacity hover:opacity-80 disabled:opacity-40",
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
function WebsiteDNA() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebsiteDNAHero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIExecutiveSummary, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebsiteHealth, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIDiscoveries, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebsiteJourney, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversionIntelligence, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIOpportunities, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SEODNA, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentIntelligence, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeatmapInsights, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIPredictions, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebsiteMissions, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessDNAPreview, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIMemorySection, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebsiteImpact, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutiveReport, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebsiteChat, {})
		]
	});
}
function WebsitePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Website",
		description: "Understand how your website performs, converts and grows your business.",
		crumbs: [{ label: "Website" }],
		action: {
			label: "Run Audit",
			icon: RefreshCw
		},
		secondaryAction: { label: "View Site" }
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebsiteDNA, {})] });
}
//#endregion
export { WebsitePage as component };
