import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as PoundSterling, At as Award, Ct as ChartBar, Dt as Brain, Mt as ArrowRight, St as ChevronDown, V as MessageSquare, at as Globe, bt as ChevronUp, g as Star, gt as Clock, i as Users, jt as ArrowUp, k as RefreshCw, l as TrendingUp, p as Target, s as Trophy, ut as FileText, v as Sparkles, wt as Calendar, x as ShoppingBag, yt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppLayout } from "./PageHeader-BxHsP49M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/advisor-D7_cgzWx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var recommendations$1 = [
	{
		id: "1",
		icon: MessageSquare,
		title: "Reply to 4 Outstanding Enquiries",
		description: "4 high-intent enquiries have been waiting over 6 hours. Historical data shows reply within 2 hours converts at 68%. Acting now maximises revenue opportunity.",
		priority: "critical",
		category: "Customer Communication",
		estimatedImpact: "+£2,300",
		impactLabel: "Est. revenue",
		timeRequired: "15 min",
		to: "/communications",
		cta: "Reply Now"
	},
	{
		id: "2",
		icon: PoundSterling,
		title: "Chase 2 Overdue Invoices",
		description: "INV-1002 (£650) and INV-1005 (£300) are both 14+ days overdue. A polite reminder with a direct payment link historically recovers 94% of late payments within 24 hours.",
		priority: "high",
		category: "Revenue",
		estimatedImpact: "+£950",
		impactLabel: "Est. recovered",
		timeRequired: "5 min",
		to: "/relationships",
		cta: "Open CRM"
	},
	{
		id: "3",
		icon: Star,
		title: "Send 18 Review Requests",
		description: "You have 18 recently completed jobs with no review request sent. Requesting within 48 hours of job completion increases review submission rate by 3.2×.",
		priority: "high",
		category: "Reviews",
		estimatedImpact: "+£1,200",
		impactLabel: "Est. impact",
		timeRequired: "8 min",
		to: "/reviews",
		cta: "Send Reviews"
	},
	{
		id: "4",
		icon: Globe,
		title: "Fix Homepage Load Speed",
		description: "Your homepage loads in 4.8 seconds on mobile. Google penalises pages over 3 seconds, which reduces organic traffic by an estimated 18%. A fix takes under an hour.",
		priority: "medium",
		category: "Website",
		estimatedImpact: "SEO risk",
		impactLabel: "Risk avoided",
		timeRequired: "45 min",
		to: "/website",
		cta: "View Issues"
	},
	{
		id: "5",
		icon: ChartBar,
		title: "Reallocate Ad Budget to Campaign B",
		description: "Campaign A has a cost per lead of £47 vs Campaign B at £12. Shifting 80% of budget to Campaign B is estimated to generate 290% more leads at the same spend.",
		priority: "medium",
		category: "Marketing",
		estimatedImpact: "+£1,840",
		impactLabel: "Est. monthly",
		timeRequired: "20 min",
		to: "/insights",
		cta: "View Insights"
	},
	{
		id: "6",
		icon: Users,
		title: "Follow Up with 3 Inactive Customers",
		description: "3 customers who booked 60+ days ago haven't re-engaged. A personalised outreach at this stage has a 34% rebooking rate based on your historical data.",
		priority: "low",
		category: "Customer Retention",
		estimatedImpact: "+£480",
		impactLabel: "Est. revenue",
		timeRequired: "10 min",
		to: "/relationships",
		cta: "View Customers"
	}
];
var priorityConfig = {
	critical: {
		label: "Critical",
		border: "border-destructive/25",
		bg: "hover:bg-destructive/3",
		text: "text-destructive",
		dot: "bg-destructive animate-pulse",
		badge: "bg-destructive/10 text-destructive"
	},
	high: {
		label: "High",
		border: "border-brand/20",
		bg: "hover:bg-brand/3",
		text: "text-brand",
		dot: "bg-brand",
		badge: "bg-brand/10 text-brand"
	},
	medium: {
		label: "Medium",
		border: "border-border",
		bg: "hover:bg-secondary/50",
		text: "text-amber-600",
		dot: "bg-amber-500",
		badge: "bg-amber-50 text-amber-700"
	},
	low: {
		label: "Low",
		border: "border-border",
		bg: "hover:bg-secondary/30",
		text: "text-muted-foreground",
		dot: "bg-muted-foreground/40",
		badge: "bg-secondary text-muted-foreground"
	}
};
var categoryColor$1 = {
	"Customer Communication": "bg-blue-50 text-blue-700",
	Revenue: "bg-emerald-50 text-emerald-700",
	Reviews: "bg-brand/10 text-brand",
	Website: "bg-orange-50 text-orange-700",
	Marketing: "bg-purple-50 text-purple-700",
	"Customer Retention": "bg-slate-50 text-slate-700"
};
function AIRecommendations() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-[18px] font-bold tracking-tight text-foreground",
			children: "AI Recommendations"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-[12.5px] text-muted-foreground",
			children: "Sorted by estimated business impact. Complete these to maximise today's results."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] font-medium text-muted-foreground",
					children: "Total Opportunity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[15px] font-bold text-brand",
					children: "+£6,770"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] font-medium text-muted-foreground",
					children: "Time Required"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[15px] font-bold text-foreground",
					children: "103 min"
				})]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: recommendations$1.map((rec, idx) => {
			const Icon = rec.icon;
			const cfg = priorityConfig[rec.priority];
			const catColor = categoryColor$1[rec.category] ?? "bg-secondary text-muted-foreground";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `group rounded-2xl border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${cfg.border} ${cfg.bg}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "shrink-0 flex flex-col items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground/60 transition-colors group-hover:bg-card group-hover:shadow-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "h-[18px] w-[18px]",
									strokeWidth: 1.75
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] font-bold text-muted-foreground/50",
								children: ["#", idx + 1]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap items-start justify-between gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-[14px] font-semibold text-foreground",
											children: rec.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${cfg.dot}` }), cfg.label]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground",
									children: rec.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${catColor}`,
											children: rec.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
												className: "h-2.5 w-2.5",
												strokeWidth: 1.75
											}), rec.timeRequired]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 text-[10.5px] font-bold text-brand",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
													className: "h-2.5 w-2.5",
													strokeWidth: 2
												}),
												rec.estimatedImpact,
												" ",
												rec.impactLabel
											]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: rec.to,
							className: "mt-1 shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-2 text-[12px] font-semibold text-background transition-all duration-200 hover:bg-foreground/85 hover:gap-2",
							children: [rec.cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-3.5 w-3.5",
								strokeWidth: 2
							})]
						})
					]
				})
			}, rec.id);
		})
	})] });
}
var recommendations = [
	{
		id: "r1",
		title: "Reply to 4 Outstanding Enquiries",
		dateSuggested: "2 Jul",
		dateCompleted: "3 Jul",
		category: "Customer Communication",
		estimatedImpact: "+£2,300",
		actualResult: "+£2,050",
		confidence: 94,
		status: "successful",
		icon: MessageSquare,
		why: "Four high-intent enquiries had been unanswered for over 6 hours. Historical data shows response within 2 hours converts at 68% vs 31% after 24 hours.",
		what: "Replies were sent within 15 minutes of the recommendation. Three of four customers proceeded to booking.",
		beforeMetric: {
			label: "Response time",
			value: "8.2 hrs avg"
		},
		afterMetric: {
			label: "Response time",
			value: "1.4 hrs avg"
		},
		aiLearnt: "Morning enquiries convert better when replied to before midday. Customers in this segment respond strongly to personalised follow-ups.",
		futureImprovement: "AI will now alert you within 30 minutes of a new enquiry arriving during business hours."
	},
	{
		id: "r2",
		title: "Send 18 Google Review Requests",
		dateSuggested: "28 Jun",
		dateCompleted: "29 Jun",
		category: "Reviews",
		estimatedImpact: "+£1,200",
		actualResult: "+£1,410",
		confidence: 91,
		status: "successful",
		icon: Star,
		why: "You had 18 recently completed jobs with no review request sent. Research shows 72% of customers will leave a review when asked within 48 hours.",
		what: "18 review requests sent. 11 customers left 5-star reviews. Average rating increased from 4.6 to 4.8.",
		beforeMetric: {
			label: "Review rating",
			value: "4.6 ★"
		},
		afterMetric: {
			label: "Review rating",
			value: "4.8 ★"
		},
		aiLearnt: "Customers from premium packages are 2.3× more likely to leave detailed reviews. Timing requests for Tuesday afternoon yields highest open rates.",
		futureImprovement: "AI will auto-identify optimal review request timing per customer based on their activity patterns."
	},
	{
		id: "r3",
		title: "Fix Website Page Speed",
		dateSuggested: "25 Jun",
		dateCompleted: "26 Jun",
		category: "Website",
		estimatedImpact: "SEO risk",
		actualResult: "Bounce rate −14%",
		confidence: 87,
		status: "successful",
		icon: Globe,
		why: "Your homepage was loading in 4.8 seconds on mobile. Google penalises sites over 3 seconds in search rankings, reducing organic enquiries by an estimated 18%.",
		what: "Images were compressed and a caching layer was added. Load time improved to 1.9 seconds. Google Core Web Vitals score improved from 42 to 78.",
		beforeMetric: {
			label: "Load time",
			value: "4.8 sec"
		},
		afterMetric: {
			label: "Load time",
			value: "1.9 sec"
		},
		aiLearnt: "Mobile performance has 3.1× more impact on enquiry volume than desktop for this business category.",
		futureImprovement: "Weekly website health scans will now flag speed regressions before they affect rankings."
	},
	{
		id: "r4",
		title: "Chase 2 Overdue Invoices",
		dateSuggested: "24 Jun",
		dateCompleted: "24 Jun",
		category: "Revenue",
		estimatedImpact: "+£950",
		actualResult: "+£950",
		confidence: 99,
		status: "successful",
		icon: PoundSterling,
		why: "Two invoices were 14 days overdue. Historical collection data shows 94% recovery rate within 24 hours of first reminder.",
		what: "Both invoices collected in full within 6 hours of sending reminders. Zero dispute.",
		beforeMetric: {
			label: "Outstanding",
			value: "£950"
		},
		afterMetric: {
			label: "Outstanding",
			value: "£0"
		},
		aiLearnt: "Polite reminder emails with a direct payment link have 3× better conversion than phone calls for this client profile.",
		futureImprovement: "Invoice reminders will be triggered automatically at 7 days overdue."
	},
	{
		id: "r5",
		title: "Pause Underperforming Ad Campaign",
		dateSuggested: "20 Jun",
		dateCompleted: "21 Jun",
		category: "Marketing",
		estimatedImpact: "Save £380/mo",
		actualResult: "Saved £380/mo",
		confidence: 82,
		status: "partial",
		icon: ChartBar,
		why: "Campaign A had a cost per lead of £47 vs Campaign B at £12. Reallocating budget to Campaign B was estimated to improve ROI by 290%.",
		what: "Campaign A was paused. Budget reallocated to Campaign B. Monthly leads increased from 12 to 29 while spend remained the same.",
		beforeMetric: {
			label: "Cost per lead",
			value: "£47"
		},
		afterMetric: {
			label: "Cost per lead",
			value: "£18"
		},
		aiLearnt: "Weekend ad spend generates 40% fewer qualified leads. Budget concentration on Tuesday–Thursday performs best for this industry.",
		futureImprovement: "AI will now monitor campaign performance weekly and flag budget optimisation opportunities."
	}
];
var achievements = [
	{
		id: "a1",
		icon: CircleCheck,
		title: "First Recommendation Completed",
		description: "You completed your very first AI recommendation.",
		earned: true,
		earnedDate: "15 Jun"
	},
	{
		id: "a2",
		icon: Target,
		title: "10 Recommendations Completed",
		description: "You've completed 10 AI recommendations.",
		earned: true,
		earnedDate: "28 Jun"
	},
	{
		id: "a3",
		icon: Trophy,
		title: "£10,000 Revenue Generated",
		description: "AI recommendations have generated over £10,000 in revenue.",
		earned: true,
		earnedDate: "2 Jul"
	},
	{
		id: "a4",
		icon: Clock,
		title: "50 Hours Saved",
		description: "AI has saved your business over 50 hours.",
		earned: true,
		earnedDate: "4 Jul"
	},
	{
		id: "a5",
		icon: TrendingUp,
		title: "Score +10 Improvement",
		description: "CrediEdge Score™ improved by 10 points.",
		earned: true,
		earnedDate: "5 Jul"
	},
	{
		id: "a6",
		icon: Award,
		title: "100 Recommendations Completed",
		description: "Complete 100 AI recommendations to unlock.",
		earned: false
	}
];
var dataPoints = [
	{
		icon: MessageSquare,
		label: "Enquiries analysed",
		value: 482
	},
	{
		icon: ShoppingBag,
		label: "Bookings analysed",
		value: 311
	},
	{
		icon: Star,
		label: "Reviews analysed",
		value: 128
	},
	{
		icon: FileText,
		label: "Invoices processed",
		value: 43
	}
];
var confidenceSources = [
	{
		label: "Bookings",
		pct: 95
	},
	{
		label: "Customers",
		pct: 88
	},
	{
		label: "Revenue",
		pct: 91
	},
	{
		label: "Reviews",
		pct: 84
	},
	{
		label: "Website",
		pct: 76
	},
	{
		label: "Communications",
		pct: 97
	},
	{
		label: "Tasks",
		pct: 89
	},
	{
		label: "Goals",
		pct: 72
	}
];
function AnimatedNumber({ target, prefix = "", suffix = "", duration = 1200 }) {
	const [value, setValue] = (0, import_react.useState)(0);
	const ref = (0, import_react.useRef)(null);
	const started = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && !started.current) {
				started.current = true;
				const start = Date.now();
				const tick = () => {
					const progress = Math.min((Date.now() - start) / duration, 1);
					const eased = 1 - Math.pow(1 - progress, 3);
					setValue(Math.round(eased * target));
					if (progress < 1) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
				observer.disconnect();
			}
		}, { threshold: .5 });
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [target, duration]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		children: [
			prefix,
			value.toLocaleString(),
			suffix
		]
	});
}
var statusConfig = {
	successful: {
		label: "Successful",
		bg: "bg-emerald-50",
		text: "text-emerald-700",
		dot: "bg-emerald-500"
	},
	partial: {
		label: "Partial",
		bg: "bg-amber-50",
		text: "text-amber-700",
		dot: "bg-amber-500"
	},
	pending: {
		label: "Pending",
		bg: "bg-secondary",
		text: "text-muted-foreground",
		dot: "bg-muted-foreground/40"
	},
	failed: {
		label: "Failed",
		bg: "bg-destructive/10",
		text: "text-destructive",
		dot: "bg-destructive"
	}
};
var categoryColor = {
	"Customer Communication": "bg-blue-50 text-blue-700",
	Revenue: "bg-emerald-50 text-emerald-700",
	Marketing: "bg-purple-50 text-purple-700",
	Operations: "bg-slate-50 text-slate-700",
	Website: "bg-orange-50 text-orange-700",
	Reviews: "bg-brand/10 text-brand"
};
function RecommendationCard({ reco }) {
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const cfg = statusConfig[reco.status];
	const Icon = reco.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "h-[18px] w-[18px] text-foreground/60",
							strokeWidth: 1.75
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${cfg.dot}` })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[13.5px] font-semibold text-foreground",
							children: reco.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${categoryColor[reco.category]}`,
								children: reco.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Suggested ",
									reco.dateSuggested,
									" · Completed ",
									reco.dateCompleted
								]
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${cfg.dot}` }), cfg.label]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-secondary/60 px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-medium text-muted-foreground",
									children: "Estimated"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-[14px] font-bold text-foreground",
									children: reco.estimatedImpact
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-secondary/60 px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-medium text-muted-foreground",
									children: "Actual Result"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `mt-0.5 text-[14px] font-bold ${reco.status === "successful" ? "text-emerald-600" : "text-foreground"}`,
									children: reco.actualResult
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-secondary/60 px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-medium text-muted-foreground",
									children: "AI Confidence"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 text-[14px] font-bold text-foreground",
									children: [reco.confidence, "%"]
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setExpanded((v) => !v),
				className: "flex w-full items-center justify-between border-t border-border px-5 py-2.5 text-[11.5px] font-semibold text-brand transition-colors duration-150 hover:bg-secondary/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Outcome" }), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, {
					className: "h-3.5 w-3.5",
					strokeWidth: 2
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: "h-3.5 w-3.5",
					strokeWidth: 2
				})]
			}),
			expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border bg-secondary/30 p-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-card border border-border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
									className: "h-3.5 w-3.5 text-brand",
									strokeWidth: 2
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Why This Was Recommended"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[12.5px] leading-relaxed text-foreground/80",
								children: reco.why
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-card border border-border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									className: "h-3.5 w-3.5 text-emerald-600",
									strokeWidth: 2
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "What Happened"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[12.5px] leading-relaxed text-foreground/80",
								children: reco.what
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Before"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11.5px] text-muted-foreground",
									children: reco.beforeMetric.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[20px] font-bold text-foreground",
									children: reco.beforeMetric.value
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-emerald-200 bg-emerald-50/60 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-emerald-600",
									children: "After"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11.5px] text-emerald-700/70",
									children: reco.afterMetric.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[20px] font-bold text-emerald-700",
									children: reco.afterMetric.value
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-brand/15 bg-brand/5 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									className: "h-3.5 w-3.5 text-brand",
									strokeWidth: 2
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-brand/70",
									children: "What the AI Learnt"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[12.5px] leading-relaxed text-foreground/80",
								children: reco.aiLearnt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 border-t border-brand/10 pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground mb-1",
									children: "How This Improves Future Recommendations"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[12px] leading-relaxed text-foreground/70",
									children: reco.futureImprovement
								})]
							})
						]
					})
				]
			})
		]
	});
}
function AIPerformanceSummary() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
					className: "h-[18px] w-[18px] text-brand",
					strokeWidth: 2
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[15px] font-bold tracking-tight text-foreground",
				children: "AI Performance"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11.5px] text-muted-foreground",
				children: "Cumulative impact since you started using CrediEdgeOS"
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-5",
			children: [
				{
					label: "Recommendations Completed",
					value: 84,
					suffix: "",
					icon: CircleCheck,
					color: "text-emerald-600",
					bg: "bg-emerald-50"
				},
				{
					label: "AI Accuracy",
					value: 93,
					suffix: "%",
					icon: Target,
					color: "text-brand",
					bg: "bg-brand/10"
				},
				{
					label: "Revenue Generated",
					value: 18450,
					prefix: "£",
					icon: PoundSterling,
					color: "text-emerald-600",
					bg: "bg-emerald-50"
				},
				{
					label: "Hours Saved",
					value: 74,
					suffix: " hrs",
					icon: Clock,
					color: "text-blue-600",
					bg: "bg-blue-50"
				},
				{
					label: "Score Improvement",
					value: 11,
					prefix: "+",
					icon: TrendingUp,
					color: "text-brand",
					bg: "bg-brand/10"
				}
			].map((s) => {
				const Icon = s.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col rounded-2xl border border-border bg-secondary/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-8 w-8 place-items-center rounded-xl ${s.bg} ${s.color} mb-3`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "h-[15px] w-[15px]",
								strokeWidth: 2
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-[22px] font-extrabold leading-none tracking-tight ${s.color}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
								target: s.value,
								prefix: s.prefix ?? "",
								suffix: s.suffix ?? ""
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 text-[10.5px] leading-tight text-muted-foreground",
							children: s.label
						})
					]
				}, s.label);
			})
		})]
	});
}
function MonthlyImpact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-foreground p-6 text-background shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
							className: "h-4 w-4 text-background/60",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold uppercase tracking-widest text-background/50",
							children: "This Month"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-[18px] font-bold leading-tight text-background",
						children: "Monthly AI Impact Report"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-[12.5px] text-background/60",
						children: "July 2026"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: [
					{
						label: "AI recommendations completed",
						value: "27",
						icon: CircleCheck,
						color: "text-emerald-600"
					},
					{
						label: "Additional revenue generated",
						value: "£12,420",
						icon: PoundSterling,
						color: "text-emerald-600"
					},
					{
						label: "Response times improved by",
						value: "31%",
						icon: Clock,
						color: "text-blue-600"
					},
					{
						label: "Review score increased by",
						value: "+0.3 ★",
						icon: Star,
						color: "text-brand"
					},
					{
						label: "CrediEdge Score™ improved",
						value: "+9",
						icon: TrendingUp,
						color: "text-brand"
					}
				].map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "h-4 w-4 shrink-0 text-background/50",
								strokeWidth: 1.75
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "min-w-0 flex-1 text-[12.5px] text-background/70",
								children: item.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0 text-[15px] font-bold text-background",
								children: item.value
							})
						]
					}, item.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded-xl bg-brand/20 px-4 py-3 border border-brand/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[12px] text-background/80",
					children: [
						"Your AI recommendations are generating an average of",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-background",
							children: "£460 per recommendation"
						}),
						". That's ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-background",
							children: "4.6× your subscription cost"
						}),
						"."
					]
				})
			})
		]
	});
}
function AILearningSystem() {
	const [animate, setAnimate] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setAnimate(true);
				observer.disconnect();
			}
		}, { threshold: .3 });
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "rounded-2xl border border-border bg-card p-6 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
						className: "h-[18px] w-[18px] text-brand",
						strokeWidth: 2
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[15px] font-bold tracking-tight text-foreground",
					children: "AI Learning System"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11.5px] text-muted-foreground",
					children: "Your AI grows smarter with every piece of business data"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: dataPoints.map((d) => {
					const Icon = d.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center rounded-2xl border border-border bg-secondary/50 py-4 px-3 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-8 w-8 place-items-center rounded-xl bg-card shadow-soft mb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "h-[14px] w-[14px] text-foreground/60",
									strokeWidth: 1.75
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[20px] font-extrabold leading-none text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { target: d.value })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[10px] text-muted-foreground leading-tight",
								children: d.label
							})
						]
					}, d.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-brand/15 bg-brand/5 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-4 w-4 shrink-0 mt-0.5 text-brand",
						strokeWidth: 2
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[12.5px] leading-relaxed text-foreground/80",
						children: [
							"Because of this data, recommendation confidence has increased from",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "81%"
							}),
							" to",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-brand",
								children: "94%"
							}),
							". As more business data becomes available, your AI will continue to improve — making smarter, higher-confidence recommendations every month."
						]
					})]
				})
			})
		]
	});
}
function Achievements() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
				className: "h-4.5 w-4.5 text-amber-500",
				strokeWidth: 2
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[15px] font-bold tracking-tight text-foreground",
				children: "Achievements"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
			children: achievements.map((a) => {
				const Icon = a.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 ${a.earned ? "border-amber-200 bg-amber-50/60 hover:shadow-card" : "border-border bg-secondary/30 opacity-50"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-10 w-10 place-items-center rounded-xl mb-3 ${a.earned ? "bg-amber-100 text-amber-600" : "bg-secondary text-muted-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "h-[18px] w-[18px]",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-[12px] font-semibold leading-tight ${a.earned ? "text-foreground" : "text-muted-foreground"}`,
							children: a.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[10.5px] text-muted-foreground leading-tight",
							children: a.description
						}),
						a.earned && a.earnedDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 rounded-md bg-amber-100 px-2 py-0.5 text-[9.5px] font-semibold text-amber-700",
							children: ["Earned ", a.earnedDate]
						}),
						!a.earned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-[9.5px] text-muted-foreground/60",
							children: "Locked"
						})
					]
				}, a.id);
			})
		})]
	});
}
function AIPersonalisation() {
	const [animate, setAnimate] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setAnimate(true);
				observer.disconnect();
			}
		}, { threshold: .3 });
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "rounded-2xl border border-border bg-card p-6 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
					className: "h-4 w-4 text-brand",
					strokeWidth: 2
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13px] font-semibold text-muted-foreground",
					children: "AI Personalisation"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 text-[15px] font-bold tracking-tight text-foreground",
				children: "Your AI is becoming smarter every day."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-center gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						width: 96,
						height: 96,
						viewBox: "0 0 96 96",
						className: "-rotate-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: 48,
							cy: 48,
							r: 40,
							stroke: "oklch(0.928 0 0)",
							strokeWidth: 6,
							fill: "none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: 48,
							cy: 48,
							r: 40,
							stroke: "#E31B23",
							strokeWidth: 6,
							fill: "none",
							strokeLinecap: "round",
							strokeDasharray: 2 * Math.PI * 40,
							strokeDashoffset: animate ? 2 * Math.PI * 40 * .06000000000000005 : 2 * Math.PI * 40,
							style: { transition: "stroke-dashoffset 1.2s ease-out" }
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[22px] font-extrabold leading-none text-foreground",
							children: "94%"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[8.5px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Confidence"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[12.5px] leading-relaxed text-muted-foreground",
						children: [
							"Current confidence is based on",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "7 connected data sources"
							}),
							". Adding more integrations will increase recommendation accuracy further."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
							className: "h-3 w-3 text-brand",
							strokeWidth: 2.5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11.5px] font-semibold text-brand",
							children: "Up from 81% last month"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: confidenceSources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-24 shrink-0 text-[11.5px] font-medium text-foreground/70",
							children: s.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-y-0 left-0 rounded-full bg-brand transition-all duration-700 ease-out",
								style: { width: animate ? `${s.pct}%` : "0%" }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-8 shrink-0 text-right text-[11px] font-semibold text-foreground",
							children: [s.pct, "%"]
						})
					]
				}, s.label))
			})
		]
	});
}
function AIImpactTracker() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 2
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[18px] font-bold tracking-tight text-foreground",
					children: "AI Impact Tracker"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12.5px] text-muted-foreground",
					children: "See how previous AI recommendations have improved your business."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 xl:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "xl:col-span-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIPersonalisation, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "xl:col-span-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthlyImpact, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIPerformanceSummary, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[14px] font-semibold text-foreground",
						children: "Recommendation History"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] text-muted-foreground",
						children: [recommendations.length, " completed"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: recommendations.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecommendationCard, { reco: r }, r.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 xl:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "xl:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AILearningSystem, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "xl:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Achievements, {})
				})]
			})
		]
	});
}
function DailyBriefingBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mb-8 overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute bottom-0 left-8 h-32 w-32 rounded-full bg-brand/25 blur-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-7 w-7 items-center justify-center rounded-lg bg-white/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
								className: "h-3.5 w-3.5 text-background/80",
								strokeWidth: 2
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold uppercase tracking-widest text-background/50",
							children: "AI Executive Briefing"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[17px] font-bold leading-snug text-background",
						children: "Good morning, Dom. Your AI has identified 6 actions today."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-xl text-[13px] leading-relaxed text-background/70",
						children: [
							"Completing all recommendations would generate an estimated",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-background",
								children: "+£6,770"
							}),
							" in additional revenue and requires approximately",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-background",
								children: "103 minutes"
							}),
							". Your AI confidence score is ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-background",
								children: "94%"
							}),
							" — up from 81% last month."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[12.5px] font-semibold text-background transition-all duration-200 hover:bg-white/15",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
						className: "h-3.5 w-3.5",
						strokeWidth: 2
					}), "Regenerate Briefing"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-5 flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-medium text-background/50",
						children: "AI Confidence"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-y-0 left-0 rounded-full bg-brand",
							style: { width: "94%" }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-bold text-background",
						children: "94%"
					})
				]
			})
		]
	});
}
function AdvisorPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Business Advisor",
			description: "AI-powered recommendations, impact tracking, and strategic guidance — personalised to your business.",
			crumbs: [{ label: "Business Advisor" }],
			badge: "AI",
			action: {
				label: "Generate Briefing",
				icon: Sparkles
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyBriefingBanner, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIRecommendations, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIImpactTracker, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8" })
	] });
}
//#endregion
export { AdvisorPage as component };
