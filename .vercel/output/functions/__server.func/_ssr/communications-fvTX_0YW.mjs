import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { $ as Instagram, At as Award, B as Mic, Ct as ChartBar, Dt as Brain, H as MessageCircle, N as Phone, Ot as BookOpen, St as ChevronDown, T as Send, V as MessageSquare, X as Lightbulb, at as Globe, c as TriangleAlert, d as ThumbsUp, dt as Eye, f as ThumbsDown, g as Star, gt as Clock, k as RefreshCw, l as TrendingUp, q as Mail, r as Wand, st as Gift, t as Zap, u as TrendingDown, v as Sparkles, wt as Calendar, y as Smile, yt as CircleCheck, z as Minus } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppLayout } from "./PageHeader-BxHsP49M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/communications-fvTX_0YW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1200 }) {
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
					setDisplay(Math.round(eased * value));
					if (p < 1) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
				obs.disconnect();
			}
		}, { threshold: .3 });
		obs.observe(el);
		return () => obs.disconnect();
	}, [value, duration]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		children: [
			prefix,
			display.toLocaleString(),
			suffix
		]
	});
}
function ScoreRing({ score, size = 96, stroke = 8, color = "#E31B23", label }) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative inline-flex flex-col items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
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
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 flex flex-col items-center justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[20px] font-bold leading-none text-foreground",
					children: score
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[9px] text-muted-foreground",
					children: "/ 100"
				})]
			})]
		}), label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10.5px] font-medium text-muted-foreground",
			children: label
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
var channelIcon = {
	Email: Mail,
	WhatsApp: MessageCircle,
	SMS: MessageSquare,
	Phone,
	Facebook: MessageSquare,
	Instagram,
	"Web Chat": Globe,
	"Contact Form": BookOpen,
	Voicemail: Mic
};
var sentimentConfig = {
	"Very Happy": {
		color: "text-emerald-600",
		bg: "bg-emerald-50",
		icon: ThumbsUp
	},
	Positive: {
		color: "text-brand",
		bg: "bg-brand/10",
		icon: Smile
	},
	Neutral: {
		color: "text-muted-foreground",
		bg: "bg-secondary",
		icon: Minus
	},
	Frustrated: {
		color: "text-amber-600",
		bg: "bg-amber-50",
		icon: ThumbsDown
	},
	Urgent: {
		color: "text-orange-600",
		bg: "bg-orange-50",
		icon: TriangleAlert
	},
	"At Risk": {
		color: "text-destructive",
		bg: "bg-destructive/10",
		icon: TriangleAlert
	}
};
var priorityConfig = {
	Critical: {
		dot: "bg-destructive animate-pulse",
		badge: "bg-destructive/10 text-destructive"
	},
	High: {
		dot: "bg-brand",
		badge: "bg-brand/10 text-brand"
	},
	Medium: {
		dot: "bg-amber-500",
		badge: "bg-amber-50 text-amber-600"
	},
	Low: {
		dot: "bg-muted-foreground/40",
		badge: "bg-secondary text-muted-foreground"
	}
};
var conversations = [
	{
		id: "1",
		name: "Sarah Johnson",
		initials: "SJ",
		channel: "Email",
		preview: "Hi, I wanted to follow up on the quote you sent last week. Is the price still valid?",
		time: "8m ago",
		waitingHours: .1,
		unread: true,
		priority: "Critical",
		sentiment: "Urgent",
		aiLabel: "Potential High Value Customer",
		estimatedRevenue: "£780",
		confidence: 94,
		responseDeadline: "Reply within 1 hour",
		customerHealth: 82,
		ltv: "£4,200",
		jobs: 7,
		lastContact: "9 days ago",
		aiSummary: "Sarah is requesting confirmation on a premium service quote. Lifetime spend £4,200. Books every 6–8 weeks. Has left two 5-star reviews. AI recommends offering a loyalty discount to convert — estimated value £780.",
		opportunity: "£780",
		timeline: [
			{
				type: "email",
				event: "Quote sent by you",
				date: "9 days ago"
			},
			{
				type: "booking",
				event: "Last service completed",
				date: "2 months ago",
				amount: "£490"
			},
			{
				type: "review",
				event: "Left 5-star review",
				date: "2 months ago"
			},
			{
				type: "booking",
				event: "Previous booking",
				date: "4 months ago",
				amount: "£380"
			}
		],
		dna: {
			tone: "Professional",
			channel: "Email",
			bestTime: "Weekdays 9am–11am",
			replyTime: "< 2 hours",
			style: "Detail-oriented",
			sentiment: 78,
			strength: 82
		},
		followUps: [{
			reason: "Quote expires in 24 hours",
			estimatedRevenue: "£780",
			bestTime: "Now",
			confidence: 94,
			message: "Hi Sarah, just following up on your quote. We'd love to get you booked in — I can also offer you a loyalty discount as a returning customer. Does Tuesday work for you?"
		}],
		replies: ["Hi Sarah, of course! The quote is still valid. In fact, as a valued returning customer I can offer you a small loyalty discount. Would Tuesday morning work for you?", "Hi Sarah, thanks for following up. The quote remains valid. Shall I book you in for this week?"]
	},
	{
		id: "2",
		name: "John Smith",
		initials: "JS",
		channel: "WhatsApp",
		preview: "Hi, I'd like to book my car in for a service next week if possible?",
		time: "2m ago",
		waitingHours: 0,
		unread: true,
		priority: "High",
		sentiment: "Positive",
		aiLabel: "Likely To Book",
		estimatedRevenue: "£420",
		confidence: 87,
		responseDeadline: "Reply within 3 hours",
		customerHealth: 74,
		ltv: "£1,240",
		jobs: 3,
		lastContact: "6 weeks ago",
		aiSummary: "John is ready to book a service. New customer with 3 previous jobs. Consistent 6-week booking cycle suggests high retention potential. WhatsApp is his preferred channel — respond there.",
		opportunity: "£420",
		timeline: [{
			type: "booking",
			event: "Service completed",
			date: "6 weeks ago",
			amount: "£420"
		}, {
			type: "booking",
			event: "Previous service",
			date: "3 months ago",
			amount: "£380"
		}],
		dna: {
			tone: "Friendly & casual",
			channel: "WhatsApp",
			bestTime: "Evenings 6pm–8pm",
			replyTime: "< 30 minutes",
			style: "Brief and direct",
			sentiment: 82,
			strength: 68
		},
		followUps: [],
		replies: ["Hi John! Of course, we'd love to see you. We have Tuesday at 9am or Thursday at 2pm available. Which works best for you?", "Hi John! Great timing. We have availability next week — Tuesday or Thursday. Let me know what suits you!"]
	},
	{
		id: "3",
		name: "Emily Clarke",
		initials: "EC",
		channel: "SMS",
		preview: "I've been waiting for a callback since this morning. Starting to get concerned...",
		time: "4h ago",
		waitingHours: 4,
		unread: true,
		priority: "Critical",
		sentiment: "Frustrated",
		aiLabel: "Likely To Leave",
		estimatedRevenue: "£290",
		confidence: 78,
		responseDeadline: "Reply IMMEDIATELY",
		customerHealth: 44,
		ltv: "£980",
		jobs: 2,
		lastContact: "3 weeks ago",
		aiSummary: "Emily has been waiting 4 hours with no response. Sentiment is deteriorating. Health score dropped 18 points. Risk of negative review is 67%. Immediate response with an apology and resolution is critical to retain this customer.",
		opportunity: "£290",
		timeline: [
			{
				type: "phone",
				event: "Missed call from Emily",
				date: "4 hours ago"
			},
			{
				type: "phone",
				event: "Missed call from Emily",
				date: "6 hours ago"
			},
			{
				type: "booking",
				event: "Last service",
				date: "3 weeks ago",
				amount: "£290"
			}
		],
		dna: {
			tone: "Reassuring",
			channel: "SMS",
			bestTime: "Mornings 8am–10am",
			replyTime: "< 1 hour",
			style: "Direct, appreciates transparency",
			sentiment: 38,
			strength: 44
		},
		followUps: [],
		replies: ["Hi Emily, I'm so sorry for the delayed response today — that's not the standard we aim for. I'm available right now if you'd like to call, or I can arrange a callback in the next 10 minutes. What would you prefer?", "Hi Emily, I apologise for the delay. Please call me directly on this number — I'll pick up immediately."]
	},
	{
		id: "4",
		name: "Marcus Williams",
		initials: "MW",
		channel: "WhatsApp",
		preview: "Everything was perfect as always! Would recommend to anyone.",
		time: "2h ago",
		waitingHours: 2,
		unread: false,
		priority: "High",
		sentiment: "Very Happy",
		aiLabel: "Review Opportunity",
		estimatedRevenue: "£340",
		confidence: 88,
		responseDeadline: "Reply within 6 hours",
		customerHealth: 94,
		ltv: "£3,100",
		jobs: 6,
		lastContact: "Today",
		aiSummary: "Marcus has just expressed very high satisfaction. This is the ideal moment to request a Google review and plant the seed for a referral. His loyalty score is 91% — a referral request here has an estimated 73% success rate.",
		opportunity: "£340",
		timeline: [
			{
				type: "booking",
				event: "Service completed (today)",
				date: "Today",
				amount: "£620"
			},
			{
				type: "review",
				event: "Left 5-star review",
				date: "3 months ago"
			},
			{
				type: "booking",
				event: "Previous service",
				date: "3 months ago",
				amount: "£517"
			}
		],
		dna: {
			tone: "Warm & professional",
			channel: "WhatsApp",
			bestTime: "Tuesday–Thursday, 9am–11am",
			replyTime: "< 2 hours",
			style: "Quality-focused",
			sentiment: 94,
			strength: 91
		},
		followUps: [{
			reason: "Review opportunity — very happy customer",
			estimatedRevenue: "£340",
			bestTime: "Within 2 hours",
			confidence: 88,
			message: "Hi Marcus, so glad to hear it — it was a pleasure as always! We'd really appreciate it if you had a moment to leave us a quick Google review. It means the world to a small business. Here's the link: [link]"
		}],
		replies: ["Hi Marcus, thank you so much! It's always a pleasure. We'd love it if you had a moment to leave us a Google review — it really helps other customers find us. Here's the link! 🙏", "Marcus, thank you! That means a lot to us. Would you consider leaving a Google review? It takes 30 seconds and helps us hugely."]
	},
	{
		id: "5",
		name: "James Thompson",
		initials: "JT",
		channel: "Email",
		preview: "Can I get a quote for a full service and MOT on my BMW 5 Series?",
		time: "5h ago",
		waitingHours: 5,
		unread: true,
		priority: "High",
		sentiment: "Neutral",
		aiLabel: "Referral Opportunity",
		estimatedRevenue: "£650",
		confidence: 71,
		responseDeadline: "Reply within 8 hours",
		customerHealth: 88,
		ltv: "£5,600",
		jobs: 9,
		lastContact: "Yesterday",
		aiSummary: "James is your highest-LTV customer requesting a full-service quote. BMW 5 Series — premium tier. He has referred 2 customers previously. A comprehensive quote with a referral incentive included could generate additional pipeline.",
		opportunity: "£650",
		timeline: [
			{
				type: "email",
				event: "Quote request received",
				date: "5 hours ago"
			},
			{
				type: "booking",
				event: "Service completed",
				date: "Yesterday",
				amount: "£410"
			},
			{
				type: "booking",
				event: "Bundle deal purchased",
				date: "1 month ago",
				amount: "£780"
			},
			{
				type: "referral",
				event: "Referred Emily Clarke",
				date: "2 months ago"
			}
		],
		dna: {
			tone: "Value-focused",
			channel: "Email",
			bestTime: "Monday & Friday, 12pm–2pm",
			replyTime: "< 4 hours",
			style: "Wants clear pricing, no jargon",
			sentiment: 71,
			strength: 79
		},
		followUps: [],
		replies: ["Hi James, great to hear from you. For your BMW 5 Series, a full service + MOT would be £595. Given your loyalty, I can offer you a 10% returning customer discount — bringing it to £536. Shall I book you in?", "Hi James! Full service and MOT for your BMW 5 Series: £595. Available this week — Tuesday or Thursday. Want me to reserve a slot?"]
	}
];
var analytics = [
	{
		label: "Avg Response Time",
		value: "18",
		suffix: " min",
		trend: "-4 min",
		up: true
	},
	{
		label: "Resolution Time",
		value: "2.4",
		suffix: "h",
		trend: "-0.6h",
		up: true
	},
	{
		label: "Conversations Closed",
		value: "47",
		suffix: "",
		trend: "+12",
		up: true
	},
	{
		label: "Revenue Generated",
		value: "£8,240",
		suffix: "",
		trend: "+£1,200",
		up: true
	},
	{
		label: "Bookings from Comms",
		value: "23",
		suffix: "",
		trend: "+5",
		up: true
	},
	{
		label: "Reviews Generated",
		value: "9",
		suffix: "",
		trend: "+3",
		up: true
	},
	{
		label: "Missed Opportunities",
		value: "3",
		suffix: "",
		trend: "-2",
		up: true
	},
	{
		label: "Customer Satisfaction",
		value: "94",
		suffix: "%",
		trend: "+2%",
		up: true
	}
];
var impactStats = [
	{
		label: "Revenue via Conversations",
		value: 8240,
		prefix: "£",
		description: "This month"
	},
	{
		label: "Customers Saved",
		value: 6,
		prefix: "",
		description: "Re-activation wins"
	},
	{
		label: "Negative Reviews Prevented",
		value: 4,
		prefix: "",
		description: "AI early warning"
	},
	{
		label: "Hours Saved by AI",
		value: 14,
		prefix: "",
		description: "Smart suggestions"
	}
];
var scoreBreakdown = [
	{
		label: "Response Time",
		score: 88,
		color: "#E31B23"
	},
	{
		label: "Sentiment Score",
		score: 81,
		color: "#10b981"
	},
	{
		label: "Customer Satisfaction",
		score: 94,
		color: "#3b82f6"
	},
	{
		label: "Consistency",
		score: 76,
		color: "#f59e0b"
	},
	{
		label: "Follow-up Rate",
		score: 69,
		color: "#8b5cf6"
	},
	{
		label: "Resolution Time",
		score: 83,
		color: "#06b6d4"
	}
];
function CommunicationIntelligenceHero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-brand/10 blur-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-brand" }), "AI-Powered Intelligence"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[22px] font-bold leading-tight tracking-tight text-background",
							children: "Communication Intelligence™"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[13px] text-background/65",
							children: "Every conversation. One intelligent workspace."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 rounded-xl bg-background/10 px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 animate-pulse rounded-full bg-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-background/80",
								children: "Live monitoring"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1.5 rounded-xl bg-background/10 px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-background/80",
								children: "9 channels active"
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6",
					children: [
						{
							label: "Unread Messages",
							value: 8,
							suffix: "",
							icon: MessageSquare
						},
						{
							label: "Awaiting Reply",
							value: 5,
							suffix: "",
							icon: Clock
						},
						{
							label: "Avg Response Time",
							value: 18,
							suffix: "m",
							icon: Zap
						},
						{
							label: "AI Priority Score",
							value: 91,
							suffix: "",
							icon: Brain
						},
						{
							label: "Satisfaction",
							value: 94,
							suffix: "%",
							icon: Star
						},
						{
							label: "Missed Opps",
							value: 3,
							suffix: "",
							icon: TriangleAlert
						}
					].map((s) => {
						const Icon = s.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5 rounded-xl bg-background/10 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "h-3 w-3 text-background/50",
									strokeWidth: 1.75
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9.5px] font-medium text-background/55",
									children: s.label
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[20px] font-bold tracking-tight text-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
									value: s.value,
									suffix: s.suffix
								})
							})]
						}, s.label);
					})
				})]
			})
		]
	});
}
function TodaysPriorityCard({ onSelectConversation }) {
	const [explainOpen, setExplainOpen] = (0, import_react.useState)(false);
	const top = conversations[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/5 to-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/10 blur-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
							className: "h-4 w-4 text-brand",
							strokeWidth: 1.75
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold uppercase tracking-wider text-brand",
							children: "AI Recommendation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold text-brand",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-brand" }), "LIVE"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[13.5px] leading-relaxed text-foreground",
					children: [
						"You have ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "4 enquiries"
						}),
						" worth approximately ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-brand",
							children: "£2,300"
						}),
						". 2 customers have been waiting over 12 hours. 1 customer is showing frustration signals. AI recommends replying to",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: top.name
						}),
						" first."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Estimated Value"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[18px] font-bold text-brand",
								children: top.estimatedRevenue
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-px bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Confidence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[18px] font-bold text-foreground",
								children: [top.confidence, "%"]
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onSelectConversation(top.id),
							className: "rounded-xl bg-brand px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:bg-brand/90 hover:shadow-md",
							children: "Open Conversation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setExplainOpen(!explainOpen),
							className: "flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-[12.5px] font-semibold text-foreground transition-all hover:border-foreground/20 hover:bg-secondary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
									className: "h-3.5 w-3.5",
									strokeWidth: 1.75
								}),
								"Explain Why",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3 w-3 transition-transform duration-200 ${explainOpen ? "rotate-180" : ""}` })
							]
						})]
					})]
				}),
				explainOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-xl bg-brand/5 border border-brand/15 p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
							className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-brand",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-brand",
							children: [
								"Why ",
								top.name,
								" first?"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] leading-relaxed text-foreground/80",
							children: top.aiSummary
						})] })]
					})
				})
			]
		})]
	});
}
function ConversationList({ selected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col rounded-2xl border border-border bg-card shadow-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[12px] font-semibold text-foreground",
					children: "AI Priority Queue"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white",
					children: conversations.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto text-[10px] text-muted-foreground",
					children: "Sorted by business impact"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex-1 divide-y divide-border overflow-y-auto",
			children: conversations.map((c, rank) => {
				const ChanIcon = channelIcon[c.channel] ?? MessageSquare;
				const sentCfg = sentimentConfig[c.sentiment];
				const SentIcon = sentCfg.icon;
				const priCfg = priorityConfig[c.priority];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					onClick: () => onSelect(c.id),
					className: `group cursor-pointer px-4 py-3.5 transition-all duration-150 ${selected === c.id ? "bg-brand/5 border-l-2 border-l-brand" : "hover:bg-secondary/40 border-l-2 border-l-transparent"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand",
									children: c.initials
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${priCfg.dot}` })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[12.5px] font-semibold ${c.unread ? "text-foreground" : "text-foreground/80"}`,
											children: c.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 text-[10px] text-muted-foreground",
											children: c.time
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChanIcon, {
											className: "h-2.5 w-2.5 shrink-0 text-muted-foreground",
											strokeWidth: 1.75
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-[11px] text-muted-foreground",
											children: c.preview
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${priCfg.badge}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1 w-1 rounded-full ${priCfg.dot.replace(" animate-pulse", "")}` }), c.priority]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-medium ${sentCfg.bg} ${sentCfg.color}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SentIcon, {
													className: "h-2.5 w-2.5",
													strokeWidth: 1.75
												}), c.sentiment]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-auto text-[10px] font-bold text-brand",
												children: c.estimatedRevenue
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-[10px] text-muted-foreground",
										children: [
											"#",
											rank + 1,
											" — ",
											c.aiLabel
										]
									})
								]
							}),
							c.unread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" })
						]
					})
				}, c.id);
			})
		})]
	});
}
function ConversationDetail({ conversation }) {
	const [replyText, setReplyText] = (0, import_react.useState)("");
	const [suggestedIdx, setSuggestedIdx] = (0, import_react.useState)(null);
	const [showCoach, setShowCoach] = (0, import_react.useState)(false);
	const [showTimeline, setShowTimeline] = (0, import_react.useState)(false);
	const [showDNA, setShowDNA] = (0, import_react.useState)(false);
	const sentCfg = sentimentConfig[conversation.sentiment];
	const SentIcon = sentCfg.icon;
	const ChanIcon = channelIcon[conversation.channel] ?? MessageSquare;
	const handleSuggest = () => {
		setSuggestedIdx(0);
		setReplyText(conversation.replies[0]);
	};
	const handleImprove = () => {
		if (conversation.replies[1]) {
			setSuggestedIdx(1);
			setReplyText(conversation.replies[1]);
		}
	};
	const timelineIcons = {
		booking: Calendar,
		email: Mail,
		review: Star,
		phone: Phone,
		referral: Gift
	};
	const timelineColors = {
		booking: "bg-brand/10 text-brand",
		email: "bg-blue-50 text-blue-600",
		review: "bg-emerald-50 text-emerald-600",
		phone: "bg-amber-50 text-amber-600",
		referral: "bg-purple-50 text-purple-600"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 border-b border-border px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-[13px] font-bold text-brand",
						children: conversation.initials
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[14px] font-semibold text-foreground",
							children: conversation.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold ${sentCfg.bg} ${sentCfg.color}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SentIcon, {
								className: "h-2.5 w-2.5",
								strokeWidth: 1.75
							}), conversation.sentiment]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChanIcon, {
								className: "h-3 w-3",
								strokeWidth: 1.75
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["via ", conversation.channel] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground/30",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: conversation.time }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground/30",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-destructive font-medium",
								children: conversation.responseDeadline
							})
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowCoach(!showCoach),
						className: `flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all ${showCoach ? "border-brand/30 bg-brand/5 text-brand" : "border-border bg-card text-foreground hover:border-foreground/20"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
							className: "h-3 w-3",
							strokeWidth: 1.75
						}), "AI Coach"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "rounded-lg bg-brand px-3.5 py-1.5 text-[12px] font-semibold text-white transition-all hover:bg-brand/90",
						children: "Mark Done"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-1 flex-col overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-border bg-secondary/30 p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-brand/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
										className: "h-3.5 w-3.5 text-brand",
										strokeWidth: 1.75
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-1 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10.5px] font-semibold uppercase tracking-wider text-brand",
												children: "AI Summary"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] font-bold text-brand",
												children: [
													"+",
													conversation.opportunity,
													" opportunity"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[12px] leading-relaxed text-foreground/80",
											children: conversation.aiSummary
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex flex-wrap gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-lg bg-card border border-border px-2 py-1 text-[10px] text-muted-foreground",
													children: ["LTV: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-foreground",
														children: conversation.ltv
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-lg bg-card border border-border px-2 py-1 text-[10px] text-muted-foreground",
													children: ["Jobs: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-foreground",
														children: conversation.jobs
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-lg bg-card border border-border px-2 py-1 text-[10px] text-muted-foreground",
													children: ["Last: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-foreground",
														children: conversation.lastContact
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-lg bg-card border border-border px-2 py-1 text-[10px] text-muted-foreground",
													children: ["Health: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-semibold text-brand",
														children: [conversation.customerHealth, "/100"]
													})]
												})
											]
										})
									]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand",
									children: conversation.initials
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[13px] leading-relaxed text-foreground",
										children: conversation.preview
									})
								})]
							})
						}),
						conversation.followUps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-4 mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
									className: "h-3 w-3 text-amber-600",
									strokeWidth: 1.75
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10.5px] font-semibold uppercase tracking-wider text-amber-600",
									children: "Follow-up Suggested"
								})]
							}), conversation.followUps.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-[11.5px] text-amber-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: f.reason
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-auto font-bold",
											children: f.estimatedRevenue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-600/70",
											children: "·"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [f.confidence, "% confidence"] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1.5 text-[11.5px] leading-relaxed text-amber-800/80 italic",
									children: [
										"\"",
										f.message,
										"\""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setReplyText(f.message),
									className: "mt-2 rounded-lg bg-amber-500 px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-amber-600",
									children: "Use This Message"
								})
							] }, i))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowTimeline(!showTimeline),
								className: "flex w-full items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
										className: "h-3.5 w-3.5",
										strokeWidth: 1.75
									}),
									"Customer Timeline",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `ml-auto h-3.5 w-3.5 transition-transform duration-200 ${showTimeline ? "rotate-180" : ""}` })
								]
							}), showTimeline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 space-y-2",
								children: conversation.timeline.map((item, idx) => {
									const Icon = timelineIcons[item.type] ?? Calendar;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 rounded-xl bg-secondary/40 px-3.5 py-2.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `grid h-6 w-6 shrink-0 place-items-center rounded-lg ${timelineColors[item.type] ?? "bg-secondary text-muted-foreground"}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
													className: "h-3 w-3",
													strokeWidth: 1.75
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex-1 text-[11.5px] text-foreground",
												children: item.event
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10.5px] text-muted-foreground",
												children: item.date
											}),
											"amount" in item && item.amount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-bold text-brand",
												children: item.amount
											})
										]
									}, idx);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowDNA(!showDNA),
								className: "flex w-full items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
										className: "h-3.5 w-3.5",
										strokeWidth: 1.75
									}),
									"Communication DNA™",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `ml-auto h-3.5 w-3.5 transition-transform duration-200 ${showDNA ? "rotate-180" : ""}` })
								]
							}), showDNA && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 grid grid-cols-2 gap-2",
								children: [
									["Preferred Tone", conversation.dna.tone],
									["Preferred Channel", conversation.dna.channel],
									["Best Time", conversation.dna.bestTime],
									["Reply Time", conversation.dna.replyTime],
									["Style", conversation.dna.style],
									["Sentiment Score", `${conversation.dna.sentiment}%`]
								].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-secondary/50 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9.5px] font-medium text-muted-foreground",
										children: k
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 text-[11.5px] font-semibold text-foreground",
										children: v
									})]
								}, k))
							})]
						})
					]
				}), showCoach && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-56 shrink-0 border-l border-border bg-secondary/20 p-4 overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
							className: "h-3.5 w-3.5 text-brand",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold text-foreground",
							children: "AI Coach"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2.5",
						children: [
							{
								tip: `${conversation.name} responds better to ${conversation.dna.style.toLowerCase()} messages.`,
								icon: Lightbulb
							},
							{
								tip: `Best contact time: ${conversation.dna.bestTime}.`,
								icon: Clock
							},
							{
								tip: `Preferred channel: ${conversation.dna.channel}. Use it.`,
								icon: MessageSquare
							},
							{
								tip: `Relationship strength: ${conversation.dna.strength}/100. ${conversation.dna.strength > 70 ? "Strong bond — be warm." : "Needs nurturing."}`,
								icon: Heart
							},
							{
								tip: conversation.sentiment === "Frustrated" || conversation.sentiment === "At Risk" ? "Use a reassuring, apologetic tone. Avoid excuses." : "Tone is positive — match their energy.",
								icon: Smile
							}
						].map((item, i) => {
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl bg-brand/5 border border-brand/10 p-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "mt-0.5 h-3 w-3 shrink-0 text-brand",
										strokeWidth: 1.75
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10.5px] leading-relaxed text-foreground/80",
										children: item.tip
									})]
								})
							}, i);
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2.5 flex flex-wrap gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleSuggest,
							className: "flex items-center gap-1 rounded-lg border border-brand/30 bg-brand/5 px-2.5 py-1.5 text-[11px] font-semibold text-brand transition-all hover:bg-brand/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wand, {
								className: "h-3 w-3",
								strokeWidth: 1.75
							}), "Suggest Reply"]
						}), [
							{
								label: "Improve",
								icon: RefreshCw,
								action: handleImprove
							},
							{
								label: "Shorten",
								icon: Minus,
								action: () => setReplyText(replyText.split(". ")[0] + ".")
							},
							{
								label: "More Professional",
								icon: Award,
								action: () => {}
							},
							{
								label: "Friendlier",
								icon: Smile,
								action: () => {}
							},
							{
								label: "Summarise",
								icon: BookOpen,
								action: () => {}
							}
						].map((btn) => {
							const Icon = btn.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: btn.action,
								className: "flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "h-3 w-3",
									strokeWidth: 1.75
								}), btn.label]
							}, btn.label);
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: replyText,
							onChange: (e) => setReplyText(e.target.value),
							placeholder: `Reply to ${conversation.name} via ${conversation.channel}...`,
							rows: 3,
							className: "w-full resize-none rounded-xl border border-border bg-secondary/30 px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-card focus:outline-none"
						}), suggestedIdx !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute left-3 top-2.5 flex items-center gap-1 rounded-md bg-brand/10 px-1.5 py-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
								className: "h-2.5 w-2.5 text-brand",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9.5px] font-semibold text-brand",
								children: "AI suggested"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10.5px] text-muted-foreground",
							children: "AI suggestion — always review before sending"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-all hover:bg-brand/90 hover:shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
								className: "h-3.5 w-3.5",
								strokeWidth: 1.75
							}), "Send Reply"]
						})]
					})
				]
			})
		]
	});
}
function CommunicationAnalytics() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBar, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Communication Analytics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground",
						children: "This month"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 p-5 sm:grid-cols-4",
			children: analytics.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-secondary/50 p-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10.5px] font-medium text-muted-foreground",
						children: a.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-[18px] font-bold text-foreground",
						children: [a.value, a.suffix]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-0.5 flex items-center gap-1 text-[10.5px] font-semibold ${a.up ? "text-brand" : "text-destructive"}`,
						children: [
							a.up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
								className: "h-2.5 w-2.5",
								strokeWidth: 2
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, {
								className: "h-2.5 w-2.5",
								strokeWidth: 2
							}),
							a.trend,
							" vs last month"
						]
					})
				]
			}, a.label))
		})]
	});
}
function CommunicationScore() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
					className: "h-4 w-4 text-brand",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "Communication Score™"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-5 sm:flex-row sm:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
						score: 83,
						size: 96,
						stroke: 8,
						color: "#E31B23"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold text-foreground",
							children: "Excellent"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground",
							children: "Top 15% of businesses"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 space-y-3",
					children: scoreBreakdown.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-36 shrink-0 text-[11.5px] text-muted-foreground",
								children: s.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
								value: s.score,
								color: s.color
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-8 shrink-0 text-right text-[11px] font-semibold text-foreground",
								children: s.score
							})
						]
					}, s.label))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl bg-brand/5 border border-brand/15 p-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, {
						className: "h-3 w-3 text-brand",
						strokeWidth: 1.75
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10.5px] font-semibold text-brand",
						children: "How to reach 90+"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11.5px] leading-relaxed text-foreground/80",
					children: "Your response time is strong (88). Biggest gain: improve your follow-up rate from 69 to 85+ by acting on AI-suggested follow-ups within 24 hours. This alone would add +6 points to your score."
				})]
			})]
		})]
	});
}
function CommunicationImpact() {
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
						children: "Communication Impact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600",
						children: "This Month"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 p-5",
			children: impactStats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10.5px] font-medium text-muted-foreground",
						children: s.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 text-[20px] font-bold text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
							value: s.value,
							prefix: s.prefix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[10.5px] font-medium text-brand",
						children: s.description
					})
				]
			}, s.label))
		})]
	});
}
function ChannelBreakdown() {
	const channels = [
		{
			name: "WhatsApp",
			messages: 34,
			revenue: "£3,200",
			response: "14m",
			color: "#10b981"
		},
		{
			name: "Email",
			messages: 28,
			revenue: "£2,900",
			response: "22m",
			color: "#3b82f6"
		},
		{
			name: "Phone",
			messages: 19,
			revenue: "£1,800",
			response: "Immediate",
			color: "#f59e0b"
		},
		{
			name: "SMS",
			messages: 14,
			revenue: "£960",
			response: "18m",
			color: "#8b5cf6"
		},
		{
			name: "Web Chat",
			messages: 8,
			revenue: "£480",
			response: "11m",
			color: "#06b6d4"
		},
		{
			name: "Instagram",
			messages: 5,
			revenue: "£220",
			response: "31m",
			color: "#ec4899"
		}
	];
	const total = channels.reduce((s, c) => s + c.messages, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, {
					className: "h-4 w-4 text-brand",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "Channel Breakdown"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-5 space-y-3",
			children: channels.map((ch) => {
				const Icon = channelIcon[ch.name] ?? MessageSquare;
				const pct = Math.round(ch.messages / total * 100);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
						style: { backgroundColor: `${ch.color}18` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "h-3.5 w-3.5",
							style: { color: ch.color },
							strokeWidth: 1.75
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[12px] font-semibold text-foreground",
									children: ch.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold text-foreground",
									children: ch.revenue
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
								value: pct,
								color: ch.color
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [ch.messages, " messages"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground/30",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Avg response: ", ch.response] })
								]
							})
						]
					})]
				}, ch.name);
			})
		})]
	});
}
function BusinessDNAPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl border border-dashed border-brand/30 bg-gradient-to-r from-brand/5 to-transparent p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/10 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							className: "h-4 w-4 text-brand",
							strokeWidth: 1.75
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold uppercase tracking-wider text-brand",
							children: "Business DNA™"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground",
							children: "Preview"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 max-w-lg text-[12px] leading-relaxed text-muted-foreground",
					children: "Communication Intelligence™ contributes to your overall CrediEdge Score™. Every module adds to one unified business intelligence profile."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2.5 sm:grid-cols-4",
					children: [
						{
							name: "Relationship DNA™",
							pct: 94,
							done: true
						},
						{
							name: "Communication Intelligence™",
							pct: 83,
							done: true
						},
						{
							name: "Website DNA™",
							pct: 72,
							done: false
						},
						{
							name: "Revenue DNA™",
							pct: 80,
							done: false
						},
						{
							name: "Marketing DNA™",
							pct: 68,
							done: false
						},
						{
							name: "Operations DNA™",
							pct: 76,
							done: false
						},
						{
							name: "Finance DNA™",
							pct: 71,
							done: false
						},
						{
							name: "Automation DNA™",
							pct: 58,
							done: false
						}
					].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-xl border p-3 ${m.done ? "border-brand/20 bg-brand/5" : "border-border bg-card"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1.5 flex items-center justify-between gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold text-foreground truncate",
									children: m.name
								}), m.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									className: "h-3 w-3 shrink-0 text-brand",
									strokeWidth: 2
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-[9px] text-muted-foreground",
									children: "Soon"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
								value: m.pct,
								color: m.done ? "#E31B23" : "#6b7280"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `mt-1 text-[10px] font-semibold ${m.done ? "text-brand" : "text-muted-foreground"}`,
								children: [m.pct, "/100"]
							})
						]
					}, m.name))
				})
			]
		})]
	});
}
function CommunicationIntelligence() {
	const [selectedId, setSelectedId] = (0, import_react.useState)(conversations[0].id);
	const conversation = conversations.find((c) => c.id === selectedId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunicationIntelligenceHero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodaysPriorityCard, { onSelectConversation: setSelectedId }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[340px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationList, {
					selected: selectedId,
					onSelect: setSelectedId
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationDetail, { conversation })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunicationAnalytics, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunicationScore, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunicationImpact, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelBreakdown, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessDNAPreview, {})
		]
	});
}
function CommunicationsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Communications",
		description: "Every conversation. One intelligent workspace.",
		crumbs: [{ label: "Communications" }],
		action: {
			label: "Compose",
			icon: MessageSquare
		},
		secondaryAction: { label: "Settings" }
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunicationIntelligence, {})] });
}
//#endregion
export { CommunicationsPage as component };
