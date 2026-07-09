import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { Pt as ArrowDown, S as Shield, at as Globe, g as Star, i as Users, jt as ArrowUp, l as TrendingUp, t as Zap } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppLayout } from "./PageHeader-BxHsP49M.mjs";
import { c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/health-EySzJMuT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var history = [
	{
		d: "Jan",
		s: 64
	},
	{
		d: "Feb",
		s: 68
	},
	{
		d: "Mar",
		s: 70
	},
	{
		d: "Apr",
		s: 74
	},
	{
		d: "May",
		s: 78
	},
	{
		d: "Jun",
		s: 84
	}
];
var pillars = [
	{
		label: "Revenue Health",
		score: 88,
		icon: TrendingUp,
		change: 4,
		detail: "Revenue is trending above target"
	},
	{
		label: "Customer Satisfaction",
		score: 92,
		icon: Star,
		change: 2,
		detail: "4.8 avg rating · 84 reviews"
	},
	{
		label: "Online Presence",
		score: 74,
		icon: Globe,
		change: -2,
		detail: "Website speed needs attention"
	},
	{
		label: "Enquiry Management",
		score: 82,
		icon: Zap,
		change: 6,
		detail: "Response time improved 18%"
	},
	{
		label: "Customer Retention",
		score: 79,
		icon: Users,
		change: 3,
		detail: "72% of customers returned"
	},
	{
		label: "Financial Security",
		score: 85,
		icon: Shield,
		change: 1,
		detail: "Cash flow is healthy"
	}
];
function ScoreGauge({ score }) {
	const [current, setCurrent] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => {
			let c = 0;
			const step = () => {
				c = Math.min(c + 1, score);
				setCurrent(c);
				if (c < score) requestAnimationFrame(step);
			};
			requestAnimationFrame(step);
		}, 200);
		return () => clearTimeout(t);
	}, [score]);
	const r = 54;
	const circ = 2 * Math.PI * r;
	const offset = circ - current / 100 * circ;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-40 w-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 120 120",
			className: "h-full w-full -rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "60",
				cy: "60",
				r,
				stroke: "oklch(0.928 0 0)",
				strokeWidth: "7",
				fill: "none"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "60",
				cy: "60",
				r,
				stroke: "#E31B23",
				strokeWidth: "7",
				fill: "none",
				strokeLinecap: "round",
				strokeDasharray: circ,
				strokeDashoffset: offset,
				style: { transition: "stroke-dashoffset 0.02s linear" }
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[36px] font-bold leading-none tracking-tight text-foreground",
				children: current
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
				children: "Excellent"
			})]
		})]
	});
}
function HealthPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "CrediEdge Score™",
			description: "Your comprehensive business health score — updated daily across 6 core performance pillars.",
			crumbs: [{ label: "CrediEdge Score™" }],
			badge: "Flagship",
			action: { label: "Full Report" },
			secondaryAction: { label: "Share Score" }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-5 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center rounded-xl border border-border bg-[#0D0D0D] p-8 text-white shadow-soft lg:col-span-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40",
						children: "Your Score"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreGauge, { score: 84 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
							className: "h-4 w-4",
							strokeWidth: 2.5
						}), "+6 this week"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-[12px] text-white/50",
						children: "Top 12% of similar businesses"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid w-full grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center",
						children: [
							["Previous", "78"],
							["This Month", "+6"],
							["Benchmark", "71"]
						].map(([l, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium text-white/40",
							children: l
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[16px] font-bold text-white",
							children: v
						})] }, l))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 text-[13.5px] font-semibold text-foreground",
					children: "Score History — 2025"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1",
					style: { minHeight: 200 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: history,
							margin: {
								top: 5,
								right: 5,
								left: -20,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									vertical: false,
									stroke: "oklch(0.925 0 0)",
									strokeDasharray: "3 3"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "d",
									tick: {
										fontSize: 11,
										fill: "#6B7280"
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									domain: [50, 100],
									tick: {
										fontSize: 11,
										fill: "#6B7280"
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										borderRadius: 8,
										border: "1px solid oklch(0.925 0 0)",
										fontSize: 12,
										padding: "6px 10px"
									},
									formatter: (v) => [v, "Score"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "s",
									stroke: "#E31B23",
									strokeWidth: 2.5,
									dot: {
										r: 4,
										fill: "#E31B23",
										stroke: "#fff",
										strokeWidth: 2
									},
									activeDot: { r: 5 }
								})
							]
						})
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-[12px] font-bold uppercase tracking-wider text-muted-foreground",
				children: "Score Breakdown"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
				children: pillars.map((p) => {
					const Icon = p.icon;
					const up = p.change >= 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-brand/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											className: "h-4 w-4 text-brand",
											strokeWidth: 1.75
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[13px] font-semibold text-foreground",
										children: p.label
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `flex items-center gap-0.5 text-[11.5px] font-semibold ${up ? "text-brand" : "text-destructive"}`,
									children: [up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
										className: "h-3 w-3",
										strokeWidth: 2.5
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
										className: "h-3 w-3",
										strokeWidth: 2.5
									}), Math.abs(p.change)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between text-[12px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 flex-1 overflow-hidden rounded-full bg-secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-brand transition-all duration-700",
										style: { width: `${p.score}%` }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-3 shrink-0 font-bold text-foreground",
									children: p.score
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-[11.5px] text-muted-foreground",
								children: p.detail
							})
						]
					}, p.label);
				})
			})]
		})
	] });
}
//#endregion
export { HealthPage as component };
