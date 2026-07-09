import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as AuthProvider } from "./AuthContext-BeiOlUYy.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-TIMbf8FO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Dkuk4ui2.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "CrediEdgeOS — AI Business Operating System" },
			{
				name: "description",
				content: "CrediEdgeOS is the AI-powered operating system for modern businesses — one intelligent dashboard for revenue, customers, tasks and growth."
			},
			{
				property: "og:title",
				content: "CrediEdgeOS — AI Business Operating System"
			},
			{
				property: "og:description",
				content: "CrediEdgeOS is the AI-powered operating system for modern businesses — one intelligent dashboard for revenue, customers, tasks and growth."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "CrediEdgeOS — AI Business Operating System"
			},
			{
				name: "twitter:description",
				content: "CrediEdgeOS is the AI-powered operating system for modern businesses — one intelligent dashboard for revenue, customers, tasks and growth."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3b5da095-d98c-411f-8471-671de1b226f8/id-preview-d86dccae--06f326fe-8fe7-41df-a80e-c4c4de03fecf.lovable.app-1783587902515.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3b5da095-d98c-411f-8471-671de1b226f8/id-preview-d86dccae--06f326fe-8fe7-41df-a80e-c4c4de03fecf.lovable.app-1783587902515.png"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$14 = () => import("./website-Ddc_v_-r.mjs");
var Route$14 = createFileRoute("/website")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./tasks-DuTpdky9.mjs");
var Route$13 = createFileRoute("/tasks")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./settings-DvbzxG8m.mjs");
var Route$12 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./reviews-odXhEfsm.mjs");
var Route$11 = createFileRoute("/reviews")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./relationships-CcpUJeTj.mjs");
var Route$10 = createFileRoute("/relationships")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./login-QOq1iAC7.mjs");
var Route$9 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./intelligence-Bgy67Ti_.mjs");
var Route$8 = createFileRoute("/intelligence")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./integrations-V2zRmBdX.mjs");
var Route$7 = createFileRoute("/integrations")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./insights-DyQqgCcf.mjs");
var Route$6 = createFileRoute("/insights")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./health-EySzJMuT.mjs");
var Route$5 = createFileRoute("/health")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./goals-B_FaDhxM.mjs");
var Route$4 = createFileRoute("/goals")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./communications-fvTX_0YW.mjs");
var Route$3 = createFileRoute("/communications")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./calendar-CWlsf2uy.mjs");
var Route$2 = createFileRoute("/calendar")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./advisor-D7_cgzWx.mjs");
var Route$1 = createFileRoute("/advisor")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./routes-B6qOGa-q.mjs");
var Route = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var WebsiteRoute = Route$14.update({
	id: "/website",
	path: "/website",
	getParentRoute: () => Route$15
});
var TasksRoute = Route$13.update({
	id: "/tasks",
	path: "/tasks",
	getParentRoute: () => Route$15
});
var SettingsRoute = Route$12.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$15
});
var ReviewsRoute = Route$11.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => Route$15
});
var RelationshipsRoute = Route$10.update({
	id: "/relationships",
	path: "/relationships",
	getParentRoute: () => Route$15
});
var LoginRoute = Route$9.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$15
});
var IntelligenceRoute = Route$8.update({
	id: "/intelligence",
	path: "/intelligence",
	getParentRoute: () => Route$15
});
var IntegrationsRoute = Route$7.update({
	id: "/integrations",
	path: "/integrations",
	getParentRoute: () => Route$15
});
var InsightsRoute = Route$6.update({
	id: "/insights",
	path: "/insights",
	getParentRoute: () => Route$15
});
var HealthRoute = Route$5.update({
	id: "/health",
	path: "/health",
	getParentRoute: () => Route$15
});
var GoalsRoute = Route$4.update({
	id: "/goals",
	path: "/goals",
	getParentRoute: () => Route$15
});
var CommunicationsRoute = Route$3.update({
	id: "/communications",
	path: "/communications",
	getParentRoute: () => Route$15
});
var CalendarRoute = Route$2.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => Route$15
});
var AdvisorRoute = Route$1.update({
	id: "/advisor",
	path: "/advisor",
	getParentRoute: () => Route$15
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$15
	}),
	AdvisorRoute,
	CalendarRoute,
	CommunicationsRoute,
	GoalsRoute,
	HealthRoute,
	InsightsRoute,
	IntegrationsRoute,
	IntelligenceRoute,
	LoginRoute,
	RelationshipsRoute,
	ReviewsRoute,
	SettingsRoute,
	TasksRoute,
	WebsiteRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
