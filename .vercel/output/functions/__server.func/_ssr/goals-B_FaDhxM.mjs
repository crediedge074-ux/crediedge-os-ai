import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { j as Plus, p as Target } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppLayout } from "./PageHeader-BxHsP49M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/goals-B_FaDhxM.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ icon: Icon, title, description, action, secondaryAction }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col items-center justify-center px-6 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-border bg-secondary text-muted-foreground shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "h-6 w-6",
					strokeWidth: 1.5
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[15px] font-semibold text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 max-w-xs text-[13px] text-muted-foreground",
				children: description
			}),
			(action || secondaryAction) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center gap-2.5",
				children: [secondaryAction && (secondaryAction.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: secondaryAction.to,
					className: "rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-secondary",
					children: secondaryAction.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: secondaryAction.onClick,
					className: "rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-secondary",
					children: secondaryAction.label
				})), action && (action.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: action.to,
					className: "rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand/90",
					children: action.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: action.onClick,
					className: "rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand/90",
					children: action.label
				}))]
			})
		]
	});
}
var goals = [
	{
		id: 1,
		title: "Reach £25,000 monthly revenue",
		category: "Revenue",
		progress: 73,
		target: "£25,000",
		current: "£18,250",
		deadline: "31 Jul 2025"
	},
	{
		id: 2,
		title: "Achieve 100 5-star reviews",
		category: "Reviews",
		progress: 84,
		target: "100",
		current: "84",
		deadline: "31 Aug 2025"
	},
	{
		id: 3,
		title: "Reduce response time to under 1 hour",
		category: "Enquiries",
		progress: 60,
		target: "< 1 hr",
		current: "1.4 hrs",
		deadline: "31 Jul 2025"
	},
	{
		id: 4,
		title: "Onboard 3 new VIP customers",
		category: "Customers",
		progress: 33,
		target: "3",
		current: "1",
		deadline: "30 Sep 2025"
	}
];
var categoryColor = {
	Revenue: "bg-brand/10 text-brand",
	Reviews: "bg-warning/10 text-warning",
	Enquiries: "bg-success/10 text-success",
	Customers: "bg-secondary text-foreground/70"
};
function GoalsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Goals",
		description: "Set, track and achieve your business growth targets.",
		crumbs: [{ label: "Goals" }],
		action: {
			label: "Create Goal",
			icon: Plus
		}
	}), goals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		icon: Target,
		title: "No goals yet",
		description: "Create your first business goal to start tracking your progress.",
		action: { label: "Create Goal" }
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-4 md:grid-cols-2",
		children: goals.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${categoryColor[g.category]}`,
							children: g.category
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[14px] font-semibold leading-tight text-foreground",
							children: g.title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "shrink-0 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11.5px] font-medium text-foreground transition-colors hover:bg-secondary",
						children: "Edit"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[12px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-foreground",
							children: [g.progress, "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-2 overflow-hidden rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-brand transition-all duration-700",
							style: { width: `${g.progress}%` }
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10.5px] font-medium text-muted-foreground",
							children: "Current"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[13px] font-semibold text-foreground",
							children: g.current
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10.5px] font-medium text-muted-foreground",
							children: "Target"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[13px] font-semibold text-foreground",
							children: g.target
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10.5px] font-medium text-muted-foreground",
							children: "Deadline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[13px] font-semibold text-foreground",
							children: g.deadline
						})] })
					]
				})
			]
		}, g.id))
	})] });
}
//#endregion
export { GoalsPage as component };
