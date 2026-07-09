import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as PoundSterling, Ct as ChartBar, Mt as ArrowRight, P as Percent, Pt as ArrowDown, S as Shield, St as ChevronDown, Tt as CalendarDays, V as MessageSquare, at as Globe, c as TriangleAlert, et as Info, g as Star, gt as Clock, i as Users, jt as ArrowUp, l as TrendingUp, o as UserPlus, q as Mail, ut as FileText, v as Sparkles, vt as CircleDollarSign, wt as Calendar, xt as ChevronRight, yt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as TopNav, t as Sidebar } from "./TopNav-DqGgxCDB.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, r as YAxis, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B6qOGa-q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function KpiCard({ title, value, trend, trendLabel = "vs last month", insight, icon: Icon, iconTone = "muted", data, unit = "%" }) {
	const up = trend >= 0;
	const gradientId = `spark-${title.replace(/\s+/g, "-")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-foreground/10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11.5px] font-medium leading-tight text-muted-foreground",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors duration-150 ${iconTone === "brand" ? "bg-brand/10 text-brand" : "bg-secondary text-foreground/60 group-hover:bg-secondary/80"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "h-[13px] w-[13px]",
						strokeWidth: 1.75
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-[23px] font-bold leading-none tracking-tight text-foreground",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2.5 flex items-end justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `inline-flex items-center gap-0.5 font-semibold ${up ? "text-brand" : "text-destructive"}`,
							children: [
								up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
									className: "h-2.5 w-2.5",
									strokeWidth: 2.5
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
									className: "h-2.5 w-2.5",
									strokeWidth: 2.5
								}),
								Math.abs(trend),
								unit
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "whitespace-nowrap text-muted-foreground",
							children: trendLabel
						})]
					}), insight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10.5px] leading-tight text-muted-foreground",
						children: insight
					})]
				}), data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-10 w-16 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data,
							margin: {
								top: 2,
								right: 0,
								bottom: 0,
								left: 0
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: gradientId,
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "#E31B23",
									stopOpacity: .25
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "#E31B23",
									stopOpacity: 0
								})]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "v",
								stroke: "#E31B23",
								strokeWidth: 1.5,
								fill: `url(#${gradientId})`,
								dot: false
							})]
						})
					})
				})]
			})
		]
	});
}
var actions = [
	{
		icon: MessageSquare,
		label: "Reply to Enquiries",
		sublabel: "4 awaiting response",
		impact: "+£1,800",
		cta: "Reply Now",
		to: "/communications",
		urgent: true
	},
	{
		icon: Users,
		label: "Open CRM",
		sublabel: "2 overdue invoices",
		impact: "+£950",
		cta: "View CRM",
		to: "/relationships",
		urgent: true
	},
	{
		icon: Star,
		label: "Send Review Requests",
		sublabel: "6 customers eligible",
		impact: "+£340",
		cta: "Send Now",
		to: "/reviews"
	},
	{
		icon: Globe,
		label: "View Customers",
		sublabel: "3 awaiting follow-up",
		impact: "Retention",
		cta: "View",
		to: "/relationships"
	}
];
function MorningBriefing() {
	const hour = (/* @__PURE__ */ new Date()).getHours();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-5 py-3.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-3.5 w-3.5 text-brand",
						strokeWidth: 2
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "Morning Briefing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand",
					children: "AI"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-xl bg-foreground p-5 text-background",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute bottom-0 left-12 h-24 w-24 rounded-full bg-brand/20 blur-2xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "relative text-[14px] font-semibold leading-snug",
							children: [
								hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening",
								", Dom ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block",
									children: "👋"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "relative mt-2.5 text-[13px] leading-[1.65] text-background/80",
							children: [
								"Yesterday your business performed well. Revenue increased by",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-background",
									children: "12%"
								}),
								" above target. You received",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-background",
									children: "5 new enquiries"
								}),
								" and response times improved. However, two invoices remain unpaid and three customers are still waiting for replies."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-4 flex items-center gap-2.5 rounded-lg bg-white/10 px-3.5 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
								className: "h-4 w-4 shrink-0 text-background/70",
								strokeWidth: 2
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] text-background/80",
								children: "Estimated opportunity today: "
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[13px] font-bold text-background",
								children: "+£3,090"
							})] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4",
					children: actions.map((a) => {
						const Icon = a.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: a.to,
							className: `group relative flex flex-col gap-2 overflow-hidden rounded-xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${a.urgent ? "border-brand/20 bg-brand/5 hover:border-brand/30 hover:bg-brand/8" : "border-border bg-secondary/40 hover:border-foreground/10 hover:bg-secondary/70"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `grid h-8 w-8 place-items-center rounded-lg transition-colors ${a.urgent ? "bg-brand/15 text-brand" : "bg-card text-foreground/60"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											className: "h-[15px] w-[15px]",
											strokeWidth: 1.75
										})
									}), a.urgent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-brand" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[12px] font-semibold leading-tight text-foreground",
									children: a.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-[10.5px] text-muted-foreground",
									children: a.sublabel
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[11px] font-bold ${a.urgent ? "text-brand" : "text-foreground/60"}`,
										children: a.impact
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5" })]
								})
							]
						}, a.label);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex justify-center border-t border-border pt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/advisor",
						className: "inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-2",
						children: ["View Full AI Analysis ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
					})
				})
			]
		})]
	});
}
var categories = [
	{
		name: "Communication",
		score: 92,
		color: "#10B981",
		description: "Response times, follow-up rate, and message quality."
	},
	{
		name: "Customer Experience",
		score: 89,
		color: "#3B82F6",
		description: "Reviews, satisfaction scores, and repeat business."
	},
	{
		name: "Operations",
		score: 81,
		color: "#8B5CF6",
		description: "Job completion rate, efficiency, and scheduling accuracy."
	},
	{
		name: "Finance",
		score: 80,
		color: "#F59E0B",
		description: "Invoice collection, cash flow health, and profit margins."
	},
	{
		name: "Marketing",
		score: 73,
		color: "#06B6D4",
		description: "Lead generation, ad performance, and brand presence."
	},
	{
		name: "Website",
		score: 68,
		color: "#F97316",
		description: "Speed, SEO ranking, and conversion performance."
	},
	{
		name: "Automation",
		score: 55,
		color: "#E31B23",
		description: "Workflow automation and time saved through AI tools."
	}
];
function CategoryBar({ cat, animate }) {
	const [width, setWidth] = (0, import_react.useState)(0);
	const [showTip, setShowTip] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (animate) {
			const t = setTimeout(() => setWidth(cat.score), 100 + categories.indexOf(cat) * 60);
			return () => clearTimeout(t);
		}
	}, [animate, cat]);
	const scoreColor = cat.score >= 85 ? "text-emerald-600" : cat.score >= 70 ? "text-foreground" : "text-orange-500";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative",
		onMouseEnter: () => setShowTip(true),
		onMouseLeave: () => setShowTip(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-[118px] shrink-0 text-[11.5px] font-medium text-foreground/80 lg:w-[130px]",
					children: cat.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-[6px] flex-1 overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
						style: {
							width: `${width}%`,
							backgroundColor: cat.color
						}
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `w-7 shrink-0 text-right text-[12px] font-bold ${scoreColor}`,
					children: cat.score
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					className: "h-3 w-3 shrink-0 cursor-help text-muted-foreground/40 transition-colors group-hover:text-muted-foreground",
					strokeWidth: 1.75
				})
			]
		}), showTip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute right-0 top-6 z-20 w-52 rounded-xl border border-border bg-card px-3 py-2.5 shadow-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-[11px] font-semibold text-foreground",
				children: cat.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10.5px] leading-relaxed text-muted-foreground",
				children: cat.description
			})]
		})]
	});
}
function CrediEdgeScore() {
	const target = 84;
	const [score, setScore] = (0, import_react.useState)(0);
	const [animate, setAnimate] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setAnimate(true);
				const timer = setTimeout(() => {
					let current = 0;
					const step = () => {
						current = Math.min(current + 1, target);
						setScore(current);
						if (current < target) requestAnimationFrame(step);
					};
					requestAnimationFrame(step);
				}, 200);
				observer.disconnect();
				return () => clearTimeout(timer);
			}
		}, { threshold: .3 });
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);
	const radius = 54;
	const strokeWidth = 7;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - score / 100 * circumference;
	const size = 128;
	const cx = size / 2;
	const cy = size / 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "CrediEdge Score™"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5 text-[11px] text-muted-foreground",
					children: "Your business health index"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/health",
					className: "inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand transition-all duration-200 hover:gap-1.5",
					children: ["Full Report ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						width: size,
						height: size,
						viewBox: `0 0 ${size} ${size}`,
						className: "-rotate-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx,
							cy,
							r: radius,
							stroke: "oklch(0.928 0 0)",
							strokeWidth,
							fill: "none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx,
							cy,
							r: radius,
							stroke: "#E31B23",
							strokeWidth,
							fill: "none",
							strokeLinecap: "round",
							strokeDasharray: circumference,
							strokeDashoffset: offset,
							style: { transition: "stroke-dashoffset 0.04s linear" }
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[34px] font-extrabold leading-none tracking-tight text-foreground",
							children: score
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-brand",
							children: "Excellent"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-secondary/60 px-3 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-brand",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
									className: "h-3 w-3",
									strokeWidth: 2.5
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[13px] font-bold",
									children: "+3"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[10px] text-muted-foreground",
								children: "Today"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-secondary/60 px-3 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-brand",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
									className: "h-3 w-3",
									strokeWidth: 2.5
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[13px] font-bold",
									children: "+7"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[10px] text-muted-foreground",
								children: "This week"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-brand/5 border border-brand/15 px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
								className: "h-3.5 w-3.5 text-brand",
								strokeWidth: 2
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] font-semibold text-foreground",
								children: "Top 12%"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[10.5px] text-muted-foreground",
							children: "of similar businesses"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-2.5 border-t border-border pt-4",
				children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryBar, {
					cat,
					animate
				}, cat.name))
			})
		]
	});
}
var data = [
	{
		d: "1 Jul",
		r: 2200
	},
	{
		d: "3 Jul",
		r: 3100
	},
	{
		d: "5 Jul",
		r: 4800
	},
	{
		d: "7 Jul",
		r: 6200
	},
	{
		d: "9 Jul",
		r: 7100
	},
	{
		d: "11 Jul",
		r: 8900
	},
	{
		d: "13 Jul",
		r: 9400
	},
	{
		d: "15 Jul",
		r: 11200
	},
	{
		d: "17 Jul",
		r: 12250
	},
	{
		d: "19 Jul",
		r: 13600
	},
	{
		d: "21 Jul",
		r: 14900
	},
	{
		d: "25 Jul",
		r: 15100
	},
	{
		d: "31 Jul",
		r: 18250
	}
];
var aiInsights = [
	"Revenue has grown steadily for the last three weeks.",
	"Average order value has increased by 11% this month.",
	"Weekend bookings continue to outperform weekdays."
];
function Metric({ label, value, trend }) {
	const up = trend >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] font-medium text-muted-foreground",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-[17px] font-bold tracking-tight text-foreground",
			children: value
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `mt-0.5 inline-flex items-center gap-0.5 text-[10.5px] font-semibold ${up ? "text-brand" : "text-destructive"}`,
			children: [
				up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
					className: "h-2.5 w-2.5",
					strokeWidth: 2.5
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
					className: "h-2.5 w-2.5",
					strokeWidth: 2.5
				}),
				Math.abs(trend),
				"%"
			]
		})
	] });
}
function RevenueChart() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "Revenue Snapshot"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5 text-[11px] text-muted-foreground",
					children: "Month to date"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors duration-150 hover:bg-secondary",
					children: ["This Month ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-[180px] flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data,
						margin: {
							top: 8,
							right: 6,
							left: -20,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "rev-gradient",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "#E31B23",
									stopOpacity: .22
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "#E31B23",
									stopOpacity: 0
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								vertical: false,
								stroke: "oklch(0.94 0 0)",
								strokeDasharray: "4 4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "d",
								tick: {
									fontSize: 10,
									fill: "#9CA3AF"
								},
								axisLine: false,
								tickLine: false,
								interval: 3
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fontSize: 10,
									fill: "#9CA3AF"
								},
								axisLine: false,
								tickLine: false,
								tickFormatter: (v) => `£${(v / 1e3).toFixed(0)}k`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									borderRadius: 10,
									border: "1px solid oklch(0.928 0 0)",
									fontSize: 11,
									boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
									padding: "8px 12px"
								},
								formatter: (v) => [`£${v.toLocaleString()}`, "Revenue"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "r",
								stroke: "#E31B23",
								strokeWidth: 2,
								fill: "url(#rev-gradient)",
								activeDot: {
									r: 4,
									fill: "#E31B23",
									stroke: "#fff",
									strokeWidth: 2
								},
								dot: false
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Total Revenue",
						value: "£18,250",
						trend: 12.5
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Total Expenses",
						value: "£7,650",
						trend: -3.2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Net Profit",
						value: "£10,600",
						trend: 18.7
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl bg-secondary/60 p-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-3 w-3 text-brand",
						strokeWidth: 2
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: "AI Observation"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: aiInsights.map((insight) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-1.5 text-[11.5px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-[5px] h-1 w-1 shrink-0 rounded-full bg-brand/60" }), insight]
					}, insight))
				})]
			})
		]
	});
}
var tasks = [
	{
		id: "1",
		title: "Reply to 4 new enquiries",
		priority: "High",
		time: "15 min",
		impact: "£1,800",
		impactType: "currency",
		cta: "Reply Now",
		to: "/communications"
	},
	{
		id: "2",
		title: "Chase 2 overdue invoices",
		priority: "High",
		time: "5 min",
		impact: "£950",
		impactType: "currency",
		cta: "Open CRM",
		to: "/relationships"
	},
	{
		id: "3",
		title: "Send 6 review requests",
		priority: "Medium",
		time: "8 min",
		impact: "£340",
		impactType: "currency",
		cta: "Send Reviews",
		to: "/reviews"
	},
	{
		id: "4",
		title: "Review ad performance",
		priority: "Medium",
		time: "15 min",
		impact: "£200",
		impactType: "currency",
		cta: "View Insights",
		to: "/insights"
	},
	{
		id: "5",
		title: "Fix website speed issue",
		priority: "Low",
		time: "5 min",
		impact: "SEO risk",
		impactType: "text",
		cta: "View Issues",
		to: "/website"
	}
];
var priorityConfig = {
	High: {
		dot: "bg-brand",
		label: "HIGH",
		labelColor: "text-brand bg-brand/10",
		bg: "hover:bg-brand/5"
	},
	Medium: {
		dot: "bg-warning",
		label: "MED",
		labelColor: "text-warning bg-warning/10",
		bg: "hover:bg-warning/5"
	},
	Low: {
		dot: "bg-muted-foreground/40",
		label: "LOW",
		labelColor: "text-muted-foreground bg-secondary",
		bg: "hover:bg-secondary/60"
	}
};
function Priorities() {
	const [done, setDone] = (0, import_react.useState)({});
	const remaining = tasks.filter((t) => !done[t.id]).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 border-b border-border px-5 py-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Today's Priorities"
					}),
					remaining > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white",
						children: remaining
					}),
					remaining === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600",
						children: "All done!"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: tasks.map((t) => {
					const checked = !!done[t.id];
					const cfg = priorityConfig[t.priority];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: `group flex items-center gap-3 px-4 py-3.5 transition-all duration-150 ${cfg.bg} ${checked ? "opacity-50" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDone((d) => ({
									...d,
									[t.id]: !d[t.id]
								})),
								className: `relative grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] transition-all duration-200 ${checked ? "border-brand bg-brand text-white" : "border-border bg-card hover:border-brand/50"}`,
								children: checked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
									viewBox: "0 0 12 12",
									className: "h-2.5 w-2.5",
									fill: "none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M2 6l3 3 5-6",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `text-[12.5px] font-medium leading-snug ${checked ? "text-muted-foreground line-through" : "text-foreground"}`,
									children: t.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-0.5 text-[10.5px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
												className: "h-2.5 w-2.5",
												strokeWidth: 1.75
											}), t.time]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground/30",
											children: "·"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[10.5px] font-bold ${t.impactType === "currency" ? "text-brand" : "text-warning"}`,
											children: t.impact
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `hidden shrink-0 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold sm:block ${cfg.labelColor}`,
								children: cfg.label
							}),
							!checked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: t.to,
								className: "shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-foreground/20 hover:bg-foreground hover:text-background",
								children: t.cta
							})
						]
					}, t.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-t border-border px-5 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted-foreground",
					children: "AI-sorted by business impact"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/tasks",
					className: "inline-flex items-center gap-1 text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-1.5",
					children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
				})]
			})
		]
	});
}
var items = [
	{
		icon: MessageSquare,
		title: "New enquiry from John Smith",
		time: "2 min ago",
		type: "enquiry",
		action: {
			label: "Reply",
			to: "/communications"
		}
	},
	{
		icon: CircleDollarSign,
		title: "Payment received — Sarah Johnson",
		detail: "£450.00",
		time: "1h ago",
		type: "payment"
	},
	{
		icon: Star,
		title: "New 5-star review on Google",
		detail: "★★★★★",
		time: "2h ago",
		type: "review",
		action: {
			label: "View",
			to: "/reviews"
		}
	},
	{
		icon: TriangleAlert,
		title: "Website speed issue detected",
		time: "3h ago",
		type: "alert",
		action: {
			label: "Fix",
			to: "/website"
		}
	},
	{
		icon: CircleCheck,
		title: "Job #0041 marked as complete",
		time: "4h ago",
		type: "task"
	},
	{
		icon: UserPlus,
		title: "New appointment booked — Emma Clarke",
		time: "5h ago",
		type: "customer",
		action: {
			label: "View",
			to: "/relationships"
		}
	}
];
var typeStyle = {
	enquiry: "bg-blue-50 text-blue-600",
	payment: "bg-emerald-50 text-emerald-600",
	review: "bg-brand/10 text-brand",
	alert: "bg-amber-50 text-amber-600",
	task: "bg-secondary text-foreground/60",
	customer: "bg-purple-50 text-purple-600"
};
function RecentActivity() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-5 py-3.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[13.5px] font-semibold tracking-tight text-foreground",
				children: "Recent Activity"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/intelligence",
				className: "inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand transition-all duration-200 hover:gap-1.5",
				children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex-1 divide-y divide-border",
			children: items.map((item, idx) => {
				const Icon = item.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "group flex items-start gap-3 px-5 py-3.5 transition-colors duration-150 hover:bg-secondary/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-8 w-8 place-items-center rounded-xl ${typeStyle[item.type]}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "h-[14px] w-[14px]",
								strokeWidth: 1.75
							})
						}), idx < items.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1 h-[calc(100%-2rem)] w-px bg-border" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1 pb-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-[12.5px] font-medium text-foreground",
										children: item.title
									}),
									item.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 text-[12px] font-bold text-foreground",
										children: item.detail
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 text-[10.5px] text-muted-foreground",
										children: item.time
									})
								]
							}), item.action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.action.to,
								className: "shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-foreground/20 hover:bg-foreground hover:text-background",
								children: item.action.label
							})]
						})
					})]
				}, item.title);
			})
		})]
	});
}
var notifs = [
	{
		icon: FileText,
		title: "Invoice INV-1002 overdue — £950",
		time: "2h ago",
		tier: "critical"
	},
	{
		icon: TriangleAlert,
		title: "Customer waiting over 4 hours",
		time: "4h ago",
		tier: "critical"
	},
	{
		icon: Mail,
		title: "4 new messages waiting",
		time: "2m ago",
		tier: "important"
	},
	{
		icon: Star,
		title: "New 5-star review received",
		time: "1h ago",
		tier: "important",
		stars: true
	},
	{
		icon: ChartBar,
		title: "Website backup completed",
		time: "3h ago",
		tier: "general"
	},
	{
		icon: Shield,
		title: "Monthly report is ready",
		time: "5h ago",
		tier: "general"
	}
];
var tierConfig = {
	critical: {
		label: "Critical",
		dot: "bg-destructive",
		bg: "bg-destructive/5 border-destructive/10",
		textColor: "text-destructive",
		iconColor: "text-destructive"
	},
	important: {
		label: "Important",
		dot: "bg-warning",
		bg: "bg-warning/5 border-warning/10",
		textColor: "text-foreground",
		iconColor: "text-warning"
	},
	general: {
		label: "Info",
		dot: "bg-muted-foreground/30",
		bg: "bg-transparent border-transparent",
		textColor: "text-foreground",
		iconColor: "text-muted-foreground"
	}
};
var grouped = {
	critical: notifs.filter((n) => n.tier === "critical"),
	important: notifs.filter((n) => n.tier === "important"),
	general: notifs.filter((n) => n.tier === "general")
};
function Notifications() {
	const criticalCount = grouped.critical.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 border-b border-border px-5 py-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Notifications"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white",
						children: notifs.length
					}),
					criticalCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" }),
							criticalCount,
							" critical"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: [
					"critical",
					"important",
					"general"
				].map((tier) => {
					const items = grouped[tier];
					if (!items.length) return null;
					const cfg = tierConfig[tier];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${cfg.dot}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: cfg.label
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5",
							children: items.map((n) => {
								const Icon = n.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: `flex items-start gap-2.5 rounded-xl border px-3 py-2.5 transition-colors duration-150 hover:brightness-95 ${cfg.bg}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											className: `mt-0.5 h-3.5 w-3.5 shrink-0 ${cfg.iconColor}`,
											strokeWidth: 1.75
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `text-[12px] font-medium leading-snug ${cfg.textColor}`,
												children: n.title
											}), n.stars && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-0.5 flex gap-0.5 text-brand",
												children: Array.from({ length: 5 }).map((_, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
													className: "h-2.5 w-2.5 fill-current",
													strokeWidth: 0
												}, k))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "shrink-0 text-[10px] text-muted-foreground",
											children: n.time
										})
									]
								}, n.title);
							})
						})]
					}, tier);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border px-5 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/communications",
					className: "inline-flex items-center gap-1 text-[12px] font-semibold text-brand transition-all duration-200 hover:gap-1.5",
					children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
				})
			})
		]
	});
}
var spark = (seed) => Array.from({ length: 12 }, (_, i) => ({ v: Math.round(50 + Math.sin(i * .7 + seed) * 20 + i * (2 + seed / 3)) }));
function Dashboard() {
	const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:pl-60 xl:pl-64",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-7 xl:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-[22px] font-bold tracking-tight text-foreground lg:text-2xl",
							children: "Command Centre"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[12px] text-muted-foreground",
							children: "Everything you need to run your business today."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-[11.5px] font-medium text-muted-foreground shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
								className: "h-3.5 w-3.5",
								strokeWidth: 1.75
							}), today]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MorningBriefing, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "xl:col-span-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrediEdgeScore, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "xl:col-span-7",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Priorities, {})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-[13px] font-semibold tracking-tight text-foreground",
								children: "Business Snapshot"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
									title: "Revenue Today",
									value: "£1,240",
									trend: 18,
									trendLabel: "vs yesterday",
									insight: "Best performing Tuesday this month",
									icon: PoundSterling,
									data: spark(1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
									title: "Revenue (MTD)",
									value: "£18,250",
									trend: 12.5,
									insight: "On track for record month",
									icon: PoundSterling,
									data: spark(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
									title: "New Enquiries",
									value: "27",
									trend: 8,
									unit: "",
									trendLabel: "vs last week",
									insight: "Response time improved 18%",
									icon: MessageSquare
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
									title: "Booked Jobs",
									value: "15",
									trend: 4,
									unit: "",
									trendLabel: "vs last week",
									insight: "Workshop utilisation at 91%",
									icon: Calendar,
									iconTone: "brand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
									title: "Conversion Rate",
									value: "36%",
									trend: 5,
									insight: "Above industry average",
									icon: Percent,
									data: spark(4)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
									title: "Avg. Review Rating",
									value: "4.8",
									trend: .2,
									unit: "",
									trendLabel: "this month",
									insight: "Only 2 reviews away from 4.9★",
									icon: Star,
									iconTone: "brand"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-[13px] font-semibold tracking-tight text-foreground",
								children: "Revenue Snapshot"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevenueChart, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "xl:col-span-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-[13px] font-semibold tracking-tight text-foreground",
									children: "Notifications"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notifications, {})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "xl:col-span-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-[13px] font-semibold tracking-tight text-foreground",
									children: "Recent Activity"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentActivity, {})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8" })
				]
			})]
		})]
	});
}
//#endregion
export { Dashboard as component };
