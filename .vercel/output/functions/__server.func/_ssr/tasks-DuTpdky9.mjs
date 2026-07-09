import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as PoundSterling, Ct as ChartBar, Dt as Brain, Ft as Activity, K as MapPin, Mt as ArrowRight, St as ChevronDown, Tt as CalendarDays, Y as ListFilter, _t as Circle, at as Globe, bt as ChevronUp, gt as Clock, i as Users, j as Plus, l as TrendingUp, lt as Flame, p as Target, rt as History, s as Trophy, t as Zap, v as Sparkles, w as Settings2, xt as ChevronRight, yt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppLayout } from "./PageHeader-BxHsP49M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-DuTpdky9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var campaigns = [
	{
		id: "c1",
		name: "Become Bromley's Highest Rated Garage",
		description: "Systematically improve every customer touchpoint to dominate local search rankings and review platforms.",
		type: "customer",
		progress: 74,
		businessValue: "£48,000",
		estimatedDays: 43,
		health: "Excellent",
		confidence: 95,
		startDate: "1 Jun",
		estimatedRevenue: "£48,000",
		hoursSaved: "120 hrs",
		scoreImprovement: "+18",
		aiInsight: "At current pace you will reach your target 6 days ahead of schedule. Review volume is the primary remaining lever — sending 8 more review requests this week would accelerate completion.",
		missions: [
			{
				id: "m1",
				title: "Reach 250 Google Reviews",
				progress: 82,
				tasks: 12,
				tasksCompleted: 10,
				status: "active"
			},
			{
				id: "m2",
				title: "Improve Website Speed Score",
				progress: 100,
				tasks: 6,
				tasksCompleted: 6,
				status: "completed"
			},
			{
				id: "m3",
				title: "Reduce Response Time to < 1hr",
				progress: 65,
				tasks: 8,
				tasksCompleted: 5,
				status: "active"
			},
			{
				id: "m4",
				title: "Increase Repeat Customers",
				progress: 58,
				tasks: 10,
				tasksCompleted: 6,
				status: "active"
			},
			{
				id: "m5",
				title: "Win 5 Industry Awards",
				progress: 40,
				tasks: 8,
				tasksCompleted: 3,
				status: "pending"
			}
		],
		totalTasks: 38
	},
	{
		id: "c2",
		name: "£30k Monthly Revenue Target",
		description: "Drive consistent revenue growth through pricing optimisation, upselling, and new customer acquisition.",
		type: "revenue",
		progress: 61,
		businessValue: "£72,000",
		estimatedDays: 68,
		health: "Good",
		confidence: 88,
		startDate: "15 Jun",
		estimatedRevenue: "£72,000",
		hoursSaved: "85 hrs",
		scoreImprovement: "+12",
		aiInsight: "Revenue is growing 8% month-on-month. Upselling premium packages to existing customers has the highest ROI at this stage — estimated £4,200 additional monthly revenue with minimal acquisition cost.",
		missions: [
			{
				id: "m6",
				title: "Optimise Service Pricing",
				progress: 90,
				tasks: 5,
				tasksCompleted: 4,
				status: "active"
			},
			{
				id: "m7",
				title: "Launch Premium Package",
				progress: 45,
				tasks: 9,
				tasksCompleted: 4,
				status: "active"
			},
			{
				id: "m8",
				title: "Grow Referral Programme",
				progress: 30,
				tasks: 7,
				tasksCompleted: 2,
				status: "pending"
			}
		],
		totalTasks: 21
	},
	{
		id: "c3",
		name: "Automate 80% of Admin",
		description: "Eliminate repetitive admin tasks through AI automation, freeing 15+ hours per week for revenue-generating activities.",
		type: "automation",
		progress: 38,
		businessValue: "£24,000",
		estimatedDays: 112,
		health: "Good",
		confidence: 82,
		startDate: "20 Jun",
		estimatedRevenue: "£24,000",
		hoursSaved: "200 hrs",
		scoreImprovement: "+9",
		aiInsight: "Invoice automation alone would save 4 hours per week. Setting up automated follow-up sequences is the highest-impact next step — estimated 6 hours saved weekly once complete.",
		missions: [
			{
				id: "m9",
				title: "Automate Invoice Sending",
				progress: 70,
				tasks: 4,
				tasksCompleted: 3,
				status: "active"
			},
			{
				id: "m10",
				title: "Set Up AI Follow-Up Sequences",
				progress: 20,
				tasks: 8,
				tasksCompleted: 2,
				status: "active"
			},
			{
				id: "m11",
				title: "Connect All Integrations",
				progress: 85,
				tasks: 6,
				tasksCompleted: 5,
				status: "active"
			}
		],
		totalTasks: 18
	}
];
var completedCampaigns = [{
	id: "cc1",
	name: "Launch New Website",
	completedDate: "28 May",
	outcome: "Website conversion rate improved by 34%",
	revenueGenerated: "£12,400",
	lessonLearned: "Mobile-first design had the greatest impact on enquiry volume. Future website work should prioritise mobile experience above all else.",
	scoreChange: "+8"
}, {
	id: "cc2",
	name: "Improve Google Review Score",
	completedDate: "10 Jun",
	outcome: "Rating increased from 4.2 to 4.8 stars",
	revenueGenerated: "£8,200",
	lessonLearned: "Personalised review requests sent within 2 hours of job completion had a 68% response rate vs 22% for generic messages sent the following day.",
	scoreChange: "+11"
}];
var aiSuggestedCampaign = {
	name: "Become London's Highest Rated Detailing Studio",
	description: "Based on your current trajectory and market position, expanding your reputation campaign beyond Bromley to target the wider London market would position you as the premium choice in a high-value market.",
	estimatedRevenue: "£84,000",
	estimatedDuration: "8 months",
	confidence: 96,
	roi: "420%",
	why: "Your current review score (4.8) and response time (1.4 hrs) already exceed 94% of competitors in the London market. You have the foundation — the campaign would amplify it."
};
var typeConfig = {
	revenue: {
		icon: PoundSterling,
		color: "text-emerald-600",
		bg: "bg-emerald-50",
		label: "Revenue Growth"
	},
	growth: {
		icon: TrendingUp,
		color: "text-blue-600",
		bg: "bg-blue-50",
		label: "Business Growth"
	},
	customer: {
		icon: Users,
		color: "text-brand",
		bg: "bg-brand/10",
		label: "Customer Experience"
	},
	marketing: {
		icon: ChartBar,
		color: "text-purple-600",
		bg: "bg-purple-50",
		label: "Marketing"
	},
	website: {
		icon: Globe,
		color: "text-orange-600",
		bg: "bg-orange-50",
		label: "Website"
	},
	automation: {
		icon: Zap,
		color: "text-amber-600",
		bg: "bg-amber-50",
		label: "Automation"
	},
	expansion: {
		icon: MapPin,
		color: "text-indigo-600",
		bg: "bg-indigo-50",
		label: "Expansion"
	},
	operations: {
		icon: Settings2,
		color: "text-slate-600",
		bg: "bg-slate-100",
		label: "Operations"
	}
};
var healthConfig = {
	Excellent: {
		color: "text-emerald-700",
		dot: "bg-emerald-500",
		bg: "bg-emerald-50"
	},
	Good: {
		color: "text-blue-700",
		dot: "bg-blue-500",
		bg: "bg-blue-50"
	},
	"Needs Attention": {
		color: "text-amber-700",
		dot: "bg-amber-500",
		bg: "bg-amber-50"
	},
	"At Risk": {
		color: "text-destructive",
		dot: "bg-destructive",
		bg: "bg-destructive/10"
	}
};
function ProgressRing({ progress, size = 72, strokeWidth = 5.5, color = "#E31B23" }) {
	const [animated, setAnimated] = (0, import_react.useState)(0);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				let frame = 0;
				const total = 40;
				const tick = () => {
					frame++;
					setAnimated(Math.round(frame / total * progress));
					if (frame < total) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
				observer.disconnect();
			}
		}, { threshold: .5 });
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [progress]);
	const r = (size - strokeWidth) / 2;
	const circ = 2 * Math.PI * r;
	const offset = circ - animated / 100 * circ;
	const cx = size / 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		ref,
		width: size,
		height: size,
		viewBox: `0 0 ${size} ${size}`,
		className: "-rotate-90",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx,
			cy: cx,
			r,
			stroke: "oklch(0.928 0 0)",
			strokeWidth,
			fill: "none"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx,
			cy: cx,
			r,
			stroke: color,
			strokeWidth,
			fill: "none",
			strokeLinecap: "round",
			strokeDasharray: circ,
			strokeDashoffset: offset,
			style: { transition: "stroke-dashoffset 0.04s linear" }
		})]
	});
}
function MissionBar({ mission }) {
	const [width, setWidth] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setWidth(mission.progress), 300);
		return () => clearTimeout(t);
	}, [mission.progress]);
	const statusColor = mission.status === "completed" ? "text-emerald-600 bg-emerald-50" : mission.status === "active" ? "text-blue-600 bg-blue-50" : "text-muted-foreground bg-secondary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-[12px] font-medium text-foreground",
					children: mission.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10.5px] text-muted-foreground",
						children: [
							mission.tasksCompleted,
							"/",
							mission.tasks,
							" tasks"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold capitalize ${statusColor}`,
						children: mission.status
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-1.5 overflow-hidden rounded-full bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${mission.status === "completed" ? "bg-emerald-500" : "bg-brand"}`,
					style: { width: `${width}%` }
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-8 shrink-0 text-right text-[11.5px] font-bold text-foreground",
			children: [mission.progress, "%"]
		})]
	});
}
function CampaignExpanded({ campaign }) {
	typeConfig[campaign.type];
	const hc = healthConfig[campaign.health];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-border bg-secondary/30 p-5 space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					{
						label: "Est. Revenue",
						value: campaign.estimatedRevenue,
						icon: PoundSterling,
						color: "text-emerald-600",
						bg: "bg-emerald-50"
					},
					{
						label: "Hours Saved",
						value: campaign.hoursSaved,
						icon: Clock,
						color: "text-blue-600",
						bg: "bg-blue-50"
					},
					{
						label: "Score Impact",
						value: campaign.scoreImprovement,
						icon: TrendingUp,
						color: "text-brand",
						bg: "bg-brand/10"
					},
					{
						label: "Confidence",
						value: `${campaign.confidence}%`,
						icon: Brain,
						color: "text-purple-600",
						bg: "bg-purple-50"
					}
				].map((s) => {
					const Icon = s.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-3.5 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `mx-auto mb-2 grid h-8 w-8 place-items-center rounded-xl ${s.bg} ${s.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "h-[14px] w-[14px]",
									strokeWidth: 2
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `text-[18px] font-extrabold leading-none ${s.color}`,
								children: s.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[10.5px] text-muted-foreground",
								children: s.label
							})
						]
					}, s.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
							className: "h-3.5 w-3.5 text-foreground/60",
							strokeWidth: 2
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12.5px] font-semibold text-foreground",
							children: "Mission Roadmap"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto text-[11px] text-muted-foreground",
							children: [
								campaign.missions.filter((m) => m.status === "completed").length,
								"/",
								campaign.missions.length,
								" complete"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: campaign.missions.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissionBar, { mission: m }, m.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-brand/15 bg-brand/5 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-3.5 w-3.5 text-brand",
						strokeWidth: 2
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-semibold uppercase tracking-wider text-brand/70",
						children: "AI Campaign Analysis"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12.5px] leading-relaxed text-foreground/80",
					children: campaign.aiInsight
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center gap-3 rounded-xl border border-border p-3.5 ${hc.bg}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
							className: `h-5 w-5 ${hc.color}`,
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10.5px] text-muted-foreground",
							children: "Campaign Health"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-[13px] font-bold ${hc.color}`,
							children: campaign.health
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-card p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
							className: "h-5 w-5 text-foreground/50",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10.5px] text-muted-foreground",
							children: "Started"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[13px] font-bold text-foreground",
							children: campaign.startDate
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-card p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
							className: "h-5 w-5 text-foreground/50",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10.5px] text-muted-foreground",
							children: "Total Tasks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[13px] font-bold text-foreground",
							children: [campaign.totalTasks, " tasks"]
						})] })]
					})
				]
			})
		]
	});
}
function CampaignCard({ campaign }) {
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const tc = typeConfig[campaign.type];
	const hc = healthConfig[campaign.health];
	const TypeIcon = tc.icon;
	const progressColor = campaign.progress >= 75 ? "#10B981" : campaign.progress >= 50 ? "#E31B23" : "#F59E0B";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressRing, {
						progress: campaign.progress,
						color: progressColor
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[15px] font-extrabold leading-none text-foreground",
							children: [campaign.progress, "%"]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-[14px] font-bold text-foreground leading-snug",
									children: campaign.name
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${tc.bg} ${tc.color}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeIcon, {
										className: "h-2.5 w-2.5",
										strokeWidth: 2
									}), tc.label]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${hc.bg} ${hc.color}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${hc.dot}` }), campaign.health]
								})]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-xl border border-border bg-secondary/60 px-2.5 py-1.5 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9.5px] font-medium text-muted-foreground",
										children: "Value"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[13px] font-extrabold text-emerald-600",
										children: campaign.businessValue
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-xl border border-border bg-secondary/60 px-2.5 py-1.5 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9.5px] font-medium text-muted-foreground",
										children: "Days left"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[13px] font-extrabold text-foreground",
										children: campaign.estimatedDays
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[12px] leading-relaxed text-muted-foreground line-clamp-2",
							children: campaign.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-[11px] text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
											className: "h-3 w-3",
											strokeWidth: 1.75
										}),
										campaign.missions.length,
										" missions"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-[11px] text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
											className: "h-3 w-3",
											strokeWidth: 1.75
										}),
										campaign.totalTasks,
										" tasks"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-[11px] text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
											className: "h-3 w-3",
											strokeWidth: 1.75
										}),
										campaign.confidence,
										"% confidence"
									]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setExpanded((v) => !v),
				className: "flex w-full items-center justify-between border-t border-border px-5 py-2.5 text-[11.5px] font-semibold text-brand transition-colors duration-150 hover:bg-secondary/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: expanded ? "Collapse Campaign" : "View Campaign Details" }), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, {
					className: "h-3.5 w-3.5",
					strokeWidth: 2
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: "h-3.5 w-3.5",
					strokeWidth: 2
				})]
			}),
			expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignExpanded, { campaign })
		]
	});
}
function AISuggestedCampaign() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-2xl border border-dashed border-brand/30 bg-brand/3 p-5 transition-all duration-200 hover:border-brand/50 hover:bg-brand/5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/15",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
					className: "h-[20px] w-[20px] text-brand",
					strokeWidth: 2
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold uppercase tracking-widest text-brand/60",
									children: "AI Recommended Next Campaign"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1 text-[15px] font-bold text-foreground",
								children: aiSuggestedCampaign.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 max-w-xl text-[12.5px] leading-relaxed text-muted-foreground",
								children: aiSuggestedCampaign.description
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "shrink-0 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand/90 hover:shadow",
							children: ["Launch Campaign", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-3.5 w-3.5",
								strokeWidth: 2
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4",
						children: [
							{
								label: "Est. Revenue",
								value: aiSuggestedCampaign.estimatedRevenue,
								color: "text-emerald-600"
							},
							{
								label: "Duration",
								value: aiSuggestedCampaign.estimatedDuration,
								color: "text-foreground"
							},
							{
								label: "ROI",
								value: aiSuggestedCampaign.roi,
								color: "text-brand"
							},
							{
								label: "AI Confidence",
								value: `${aiSuggestedCampaign.confidence}%`,
								color: "text-foreground"
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-brand/15 bg-card px-3 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-medium text-muted-foreground",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `mt-0.5 text-[15px] font-extrabold ${s.color}`,
								children: s.value
							})]
						}, s.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3.5 rounded-xl bg-card border border-brand/10 px-3.5 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
								className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-brand",
								strokeWidth: 2
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[12px] leading-relaxed text-foreground/70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "Why now? "
								}), aiSuggestedCampaign.why]
							})]
						})
					})
				]
			})]
		})
	});
}
function CompletedCampaigns() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
					className: "h-4 w-4 text-amber-500",
					strokeWidth: 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[14px] font-semibold text-foreground",
					children: "Completed Campaigns"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-100 px-1 text-[10px] font-bold text-emerald-700",
					children: completedCampaigns.length
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: completedCampaigns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-emerald-100 bg-emerald-50/50 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
								className: "h-4 w-4 text-emerald-600",
								strokeWidth: 2
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[13px] font-semibold text-foreground",
								children: c.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: ["Completed ", c.completedDate]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-xl bg-emerald-100 px-3 py-1 text-[12px] font-bold text-emerald-700",
								children: c.revenueGenerated
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-xl bg-brand/10 px-3 py-1 text-[12px] font-bold text-brand",
								children: ["Score ", c.scoreChange]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[12px] text-emerald-700 font-medium",
						children: c.outcome
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2.5 rounded-lg bg-white/70 border border-emerald-100 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "AI Lesson Learned"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11.5px] leading-relaxed text-foreground/70",
							children: c.lessonLearned
						})]
					})
				]
			}, c.id))
		})]
	});
}
function Campaigns() {
	const totalValue = "£144,000";
	const activeCampaigns = campaigns.length;
	const avgProgress = Math.round(campaigns.reduce((sum, c) => sum + c.progress, 0) / campaigns.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[18px] font-bold tracking-tight text-foreground",
					children: "Campaigns"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-[12.5px] text-muted-foreground",
					children: "The biggest objectives driving your business."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9.5px] font-medium text-muted-foreground",
								children: "Active"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[15px] font-extrabold text-foreground",
								children: activeCampaigns
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9.5px] font-medium text-muted-foreground",
								children: "Avg Progress"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[15px] font-extrabold text-brand",
								children: [avgProgress, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9.5px] font-medium text-muted-foreground",
								children: "Total Value"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[15px] font-extrabold text-emerald-600",
								children: totalValue
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-2.5 text-[12.5px] font-semibold text-background transition-all duration-200 hover:bg-foreground/85",
							children: ["New Campaign", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-3.5 w-3.5",
								strokeWidth: 2
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: campaigns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignCard, { campaign: c }, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AISuggestedCampaign, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompletedCampaigns, {})
		]
	});
}
var initialTasks = [
	{
		id: 1,
		title: "Reply to 4 new enquiries",
		priority: "High",
		time: "15 min",
		impact: "£1,800",
		impactType: "currency",
		done: false,
		campaign: "Become Bromley's Highest Rated Garage",
		mission: "Reduce Response Time to < 1hr",
		cta: "Reply Now",
		to: "/communications"
	},
	{
		id: 2,
		title: "Chase 2 overdue invoices",
		priority: "High",
		time: "5 min",
		impact: "£950",
		impactType: "currency",
		done: false,
		campaign: "£30k Monthly Revenue Target",
		mission: "Optimise Service Pricing",
		cta: "Open CRM",
		to: "/relationships"
	},
	{
		id: 3,
		title: "Send 6 review requests",
		priority: "Medium",
		time: "8 min",
		impact: "£340",
		impactType: "currency",
		done: false,
		campaign: "Become Bromley's Highest Rated Garage",
		mission: "Reach 250 Google Reviews",
		cta: "Send Reviews",
		to: "/reviews"
	},
	{
		id: 4,
		title: "Review ad campaign performance",
		priority: "Medium",
		time: "15 min",
		impact: "£200",
		impactType: "currency",
		done: false,
		campaign: "£30k Monthly Revenue Target",
		mission: "Launch Premium Package",
		cta: "View Insights",
		to: "/insights"
	},
	{
		id: 5,
		title: "Fix homepage speed issue",
		priority: "Low",
		time: "45 min",
		impact: "SEO risk",
		impactType: "text",
		done: true,
		campaign: "Become Bromley's Highest Rated Garage",
		mission: "Improve Website Speed Score",
		cta: "View Website",
		to: "/website"
	},
	{
		id: 6,
		title: "Set up invoice automation",
		priority: "Medium",
		time: "30 min",
		impact: "4 hrs/wk",
		impactType: "text",
		done: false,
		campaign: "Automate 80% of Admin",
		mission: "Automate Invoice Sending",
		cta: "View Integrations",
		to: "/integrations"
	}
];
var priorityConfig = {
	High: {
		dot: "bg-brand",
		badge: "bg-brand/10 text-brand",
		border: "border-l-brand"
	},
	Medium: {
		dot: "bg-warning",
		badge: "bg-warning/10 text-warning",
		border: "border-l-warning"
	},
	Low: {
		dot: "bg-muted-foreground/40",
		badge: "bg-secondary text-muted-foreground",
		border: "border-l-border"
	}
};
var analyticsData = [
	{
		label: "Completed Today",
		value: "1",
		icon: CircleCheck,
		color: "text-emerald-600",
		bg: "bg-emerald-50"
	},
	{
		label: "Pending",
		value: "5",
		icon: Circle,
		color: "text-brand",
		bg: "bg-brand/10"
	},
	{
		label: "Est. Impact Today",
		value: "£3,290",
		icon: PoundSterling,
		color: "text-emerald-600",
		bg: "bg-emerald-50"
	},
	{
		label: "Time Required",
		value: "1h 48m",
		icon: Clock,
		color: "text-blue-600",
		bg: "bg-blue-50"
	}
];
var historyItems = [
	{
		title: "Check website speed",
		completedAt: "Yesterday, 3:42pm",
		campaign: "Become Bromley's Highest Rated Garage",
		impact: "Speed improved"
	},
	{
		title: "Send review requests to 8 customers",
		completedAt: "Yesterday, 11:20am",
		campaign: "Become Bromley's Highest Rated Garage",
		impact: "+£420"
	},
	{
		title: "Update pricing page",
		completedAt: "2 days ago",
		campaign: "£30k Monthly Revenue Target",
		impact: "Conversion +8%"
	},
	{
		title: "Set up Google Calendar sync",
		completedAt: "2 days ago",
		campaign: "Automate 80% of Admin",
		impact: "2 hrs/wk saved"
	}
];
function TodaysFocus({ tasks }) {
	const pending = tasks.filter((t) => !t.done);
	const totalImpact = pending.filter((t) => t.impactType === "currency").reduce((sum, t) => sum + parseFloat(t.impact.replace(/[£,]/g, "")), 0);
	const totalTime = pending.reduce((sum, t) => {
		const mins = parseInt(t.time);
		return sum + (isNaN(mins) ? 0 : mins);
	}, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mb-6 overflow-hidden rounded-2xl bg-foreground p-5 text-background shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-white/5 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute bottom-0 left-8 h-28 w-28 rounded-full bg-brand/20 blur-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							className: "h-3.5 w-3.5 text-background/60",
							strokeWidth: 2
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10.5px] font-semibold uppercase tracking-widest text-background/50",
							children: "Today's Focus"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-[16px] font-bold leading-snug text-background",
						children: [
							"You have ",
							pending.length,
							" tasks to complete today."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1.5 text-[12.5px] text-background/60",
						children: [
							"Completing all pending tasks will generate an estimated",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-background",
								children: ["£", totalImpact.toLocaleString()]
							}),
							" ",
							"and requires approximately",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-background",
								children: [totalTime, " minutes"]
							}),
							". Tasks are sorted by business impact."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium text-background/50",
							children: "Est. Impact"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[16px] font-extrabold text-background",
							children: ["£", totalImpact.toLocaleString()]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium text-background/50",
							children: "Time needed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[16px] font-extrabold text-background",
							children: [totalTime, "m"]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-4 flex items-center gap-2.5 rounded-xl bg-white/8 px-4 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
					className: "h-3.5 w-3.5 shrink-0 text-brand",
					strokeWidth: 2
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[12px] text-background/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-background",
							children: "AI Priority Queue active."
						}),
						" ",
						"Tasks ordered by maximum business impact. Complete in order for best results."
					]
				})]
			})
		]
	});
}
function MissionsSection() {
	const missions = [
		{
			id: "m1",
			title: "Reach 250 Google Reviews",
			campaign: "Become Bromley's Highest Rated Garage",
			progress: 82,
			tasks: 12,
			completed: 10
		},
		{
			id: "m2",
			title: "Reduce Response Time to < 1hr",
			campaign: "Become Bromley's Highest Rated Garage",
			progress: 65,
			tasks: 8,
			completed: 5
		},
		{
			id: "m3",
			title: "Optimise Service Pricing",
			campaign: "£30k Monthly Revenue Target",
			progress: 90,
			tasks: 5,
			completed: 4
		},
		{
			id: "m4",
			title: "Automate Invoice Sending",
			campaign: "Automate 80% of Admin",
			progress: 70,
			tasks: 4,
			completed: 3
		},
		{
			id: "m5",
			title: "Launch Premium Package",
			campaign: "£30k Monthly Revenue Target",
			progress: 45,
			tasks: 9,
			completed: 4
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-5 py-3.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
					className: "h-4 w-4 text-foreground/60",
					strokeWidth: 1.75
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold text-foreground",
					children: "Active Missions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[10px] font-bold text-foreground/70",
					children: missions.length
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: missions.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "group flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 hover:bg-secondary/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12.5px] font-medium text-foreground truncate",
								children: m.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-[11px] font-bold text-foreground",
								children: [m.progress, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative h-1.5 w-full overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-y-0 left-0 rounded-full bg-brand",
								style: {
									width: `${m.progress}%`,
									transition: "width 0.7s ease-out"
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-[10.5px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
									className: "h-2.5 w-2.5",
									strokeWidth: 2
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: m.campaign
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-[10.5px] text-muted-foreground",
								children: [
									m.completed,
									"/",
									m.tasks,
									" tasks"
								]
							})]
						})
					]
				})
			}, m.id))
		})]
	});
}
function TaskList({ tasks, onToggle }) {
	const pending = tasks.filter((t) => !t.done);
	const done = tasks.filter((t) => t.done);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card shadow-soft overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 border-b border-border px-5 py-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold text-foreground",
						children: "Task List"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white",
						children: pending.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "ml-auto flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListFilter, {
							className: "h-3 w-3",
							strokeWidth: 1.75
						}), "Filter"]
					})
				]
			}), pending.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-5 py-10 text-center text-[13px] text-muted-foreground",
				children: "All tasks complete — great work!"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: pending.map((t) => {
					const cfg = priorityConfig[t.priority];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: `group flex items-start gap-3.5 border-l-2 px-5 py-4 transition-colors duration-150 hover:bg-secondary/30 ${cfg.border}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onToggle(t.id),
								className: "mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] border-border bg-card transition-all duration-200 hover:border-brand/50"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] font-medium text-foreground",
											children: t.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `rounded-md px-1.5 py-0.5 text-[9.5px] font-bold ${cfg.badge}`,
											children: t.priority
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex items-center gap-1 text-[10.5px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate max-w-[160px]",
												children: t.campaign
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
												className: "h-2.5 w-2.5 shrink-0",
												strokeWidth: 2
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate max-w-[140px]",
												children: t.mission
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-0.5 text-[10.5px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
												className: "h-2.5 w-2.5",
												strokeWidth: 1.75
											}), t.time]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[10.5px] font-bold ${t.impactType === "currency" ? "text-brand" : "text-warning"}`,
											children: t.impact
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: t.to,
								className: "shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-foreground/20 hover:bg-foreground hover:text-background",
								children: t.cta
							})
						]
					}, t.id);
				})
			})]
		}), done.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card shadow-soft overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 border-b border-border px-5 py-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
						className: "h-3.5 w-3.5 text-emerald-600",
						strokeWidth: 2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold text-foreground",
						children: "Completed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-5 min-w-5 place-items-center rounded-full bg-emerald-100 px-1 text-[10px] font-bold text-emerald-700",
						children: done.length
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: done.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3.5 px-5 py-3.5 opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onToggle(t.id),
						className: "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] border-brand bg-brand text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[13px] font-medium text-foreground line-through",
							children: t.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: t.campaign
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
									className: "h-2.5 w-2.5 shrink-0",
									strokeWidth: 2
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: t.mission
								})
							]
						})]
					})]
				}, t.id))
			})]
		})]
	});
}
function TaskAnalytics() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
		children: analyticsData.map((s) => {
			const Icon = s.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mb-3 grid h-8 w-8 place-items-center rounded-xl ${s.bg} ${s.color}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "h-[14px] w-[14px]",
							strokeWidth: 2
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `text-[22px] font-extrabold leading-none ${s.color}`,
						children: s.value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-[10.5px] text-muted-foreground leading-tight",
						children: s.label
					})
				]
			}, s.label);
		})
	});
}
function TaskHistory() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-5 py-3.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, {
				className: "h-4 w-4 text-foreground/60",
				strokeWidth: 1.75
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[13.5px] font-semibold text-foreground",
				children: "Task History"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: historyItems.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3.5 px-5 py-3.5 transition-colors hover:bg-secondary/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
							className: "h-3.5 w-3.5 text-emerald-600",
							strokeWidth: 2
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12.5px] font-medium text-foreground",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.completedAt }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/30",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: item.campaign
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 rounded-lg bg-brand/10 px-2 py-0.5 text-[10.5px] font-bold text-brand",
						children: item.impact
					})
				]
			}, idx))
		})]
	});
}
function AIPriorityQueue({ tasks }) {
	const top3 = tasks.filter((t) => !t.done).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 border-b border-border px-5 py-3.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
					className: "h-3.5 w-3.5 text-brand",
					strokeWidth: 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold text-foreground",
					children: "AI Priority Queue"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand",
					children: "AI"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[12px] text-muted-foreground mb-3",
				children: "Complete these 3 tasks first for maximum business impact today."
			}), top3.map((t, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-xl bg-secondary/50 px-3.5 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-extrabold text-white",
					children: idx + 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] font-medium text-foreground truncate",
						children: t.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10.5px] text-muted-foreground",
						children: [
							t.time,
							" · ",
							t.impact
						]
					})]
				})]
			}, t.id))]
		})]
	});
}
function TasksPage() {
	const [tasks, setTasks] = (0, import_react.useState)(initialTasks);
	const toggle = (id) => setTasks((t) => t.map((x) => x.id === id ? {
		...x,
		done: !x.done
	} : x));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Tasks",
			description: "Campaigns drive Missions. Missions drive Tasks. Everything connects.",
			crumbs: [{ label: "Tasks" }],
			action: {
				label: "Add Task",
				icon: Plus
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodaysFocus, { tasks }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campaigns, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[13px] font-semibold tracking-tight text-foreground",
					children: "Missions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissionsSection, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[13px] font-semibold tracking-tight text-foreground",
					children: "AI Priority Queue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIPriorityQueue, { tasks })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[13px] font-semibold tracking-tight text-foreground",
					children: "Task Analytics"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskAnalytics, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[13px] font-semibold tracking-tight text-foreground",
					children: "Task List"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskList, {
				tasks,
				onToggle: toggle
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[13px] font-semibold tracking-tight text-foreground",
					children: "Task History"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskHistory, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8" })
	] });
}
//#endregion
export { TasksPage as component };
