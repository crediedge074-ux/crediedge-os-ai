import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Nt as ArrowLeft, gt as Clock, j as Plus, wt as Calendar } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppLayout } from "./PageHeader-BxHsP49M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-CWlsf2uy.js
var import_jsx_runtime = require_jsx_runtime();
function PlaceholderPage({ icon: Icon, title, description, status = "coming-soon", features = [] }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col items-center justify-center px-6 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "h-7 w-7 text-brand",
					strokeWidth: 1.5
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${status === "coming-soon" ? "bg-brand/10 text-brand" : "bg-warning/15 text-warning"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
					className: "h-3 w-3",
					strokeWidth: 2
				}), status === "coming-soon" ? "Coming Soon" : "Module Under Development"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[22px] font-bold tracking-tight text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground",
				children: description
			}),
			features.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-7 w-full max-w-xs rounded-xl border border-border bg-card p-5 text-left shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
					children: "Planned features"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2.5 text-[13px] text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 shrink-0 rounded-full bg-brand" }), f]
					}, f))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand/90",
					children: "Return to Command Centre"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => window.history.back(),
					className: "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
						className: "h-3.5 w-3.5",
						strokeWidth: 1.75
					}), "Back"]
				})]
			})
		]
	});
}
function CalendarPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Calendar",
		description: "View and manage bookings, appointments and scheduled jobs.",
		crumbs: [{ label: "Calendar" }],
		action: {
			label: "New Booking",
			icon: Plus
		}
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceholderPage, {
		icon: Calendar,
		title: "Calendar & Bookings",
		description: "View all your appointments, jobs and events in one intelligent calendar view.",
		status: "coming-soon",
		features: [
			"Booking and appointment management",
			"Workshop job scheduling",
			"Google Calendar sync",
			"SMS & email reminders",
			"Resource and staff scheduling",
			"Recurring bookings"
		]
	})] });
}
//#endregion
export { CalendarPage as component };
