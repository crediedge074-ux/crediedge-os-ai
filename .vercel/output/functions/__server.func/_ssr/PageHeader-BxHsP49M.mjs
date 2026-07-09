import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { o as useAuthContext } from "./AuthContext-BeiOlUYy.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { nt as Hop, xt as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as TopNav, t as Sidebar } from "./TopNav-DqGgxCDB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PageHeader-BxHsP49M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-y-0 left-0 w-60 animate-pulse border-r border-border bg-card xl:w-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:pl-60 xl:pl-64",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[60px] animate-pulse border-b border-border bg-card" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1600px] space-y-4 px-4 py-6 sm:px-6 lg:px-7 xl:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-2xl bg-secondary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							1,
							2,
							3,
							4
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-secondary" }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-2xl bg-secondary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-2xl bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-2xl bg-secondary" })]
					})
				]
			})]
		})]
	});
}
function AppLayout({ children }) {
	const { session, loading } = useAuthContext();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!loading && !session) navigate({ to: "/login" });
	}, [
		loading,
		session,
		navigate
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSkeleton, {});
	if (!session) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:pl-60 xl:pl-64",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-7 xl:px-8",
				children
			})]
		})]
	});
}
function PageHeader({ title, description, crumbs = [], action, secondaryAction, badge, children }) {
	const ActionIcon = action?.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "mb-3 flex items-center gap-1.5 text-[11.5px] text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-1 transition-colors hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hop, {
					className: "h-3 w-3",
					strokeWidth: 1.75
				}), "Command Centre"]
			}), crumbs.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: "h-3 w-3 shrink-0",
					strokeWidth: 2
				}), c.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: c.to,
					className: "transition-colors hover:text-foreground",
					children: c.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground",
					children: c.label
				})]
			}, c.label))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[22px] font-bold tracking-tight text-foreground lg:text-[24px]",
						children: title
					}), badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand",
						children: badge
					})]
				}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-[13px] text-muted-foreground",
					children: description
				})]
			}), (action || secondaryAction || children) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-2",
				children: [
					children,
					secondaryAction && (secondaryAction.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: secondaryAction.to,
						className: "rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-secondary",
						children: secondaryAction.label
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: secondaryAction.onClick,
						className: "rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-secondary",
						children: secondaryAction.label
					})),
					action && (action.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: action.to,
						className: "inline-flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand/90 hover:shadow",
						children: [ActionIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionIcon, {
							className: "h-3.5 w-3.5",
							strokeWidth: 2
						}), action.label]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: action.onClick,
						className: "inline-flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand/90 hover:shadow",
						children: [ActionIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionIcon, {
							className: "h-3.5 w-3.5",
							strokeWidth: 2
						}), action.label]
					}))
				]
			})]
		})]
	});
}
//#endregion
export { PageHeader as n, AppLayout as t };
