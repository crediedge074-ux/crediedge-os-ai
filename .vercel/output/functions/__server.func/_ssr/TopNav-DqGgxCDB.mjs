import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { o as useAuthContext } from "./AuthContext-BeiOlUYy.mjs";
import { r as signOut, t as Logo } from "./auth-CYRA7tOE.mjs";
import { _ as useNavigate, g as Link, l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Settings, Ct as ChartBar, J as LogOut, M as Plug, Mt as ArrowRight, St as ChevronDown, U as Menu, Z as LayoutDashboard, _ as SquareCheck, _t as Circle, at as Globe, g as Star, i as Users, jt as ArrowUp, kt as Bell, l as TrendingUp, n as X, p as Target, tt as Inbox, ut as FileText, v as Sparkles, wt as Calendar } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TopNav-DqGgxCDB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HealthScore() {
	const target = 84;
	const [score, setScore] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(() => {
			let current = 0;
			const step = () => {
				current = Math.min(current + 2, target);
				setScore(current);
				if (current < target) requestAnimationFrame(step);
			};
			requestAnimationFrame(step);
		}, 400);
		return () => clearTimeout(timer);
	}, []);
	const radius = 26;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - score / 100 * circumference;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-[#0D0D0D] p-4 text-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-[10px] font-bold uppercase tracking-widest text-white/50",
				children: "CrediEdge Score™"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-[64px] w-[64px] shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 64 64",
						className: "h-full w-full -rotate-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "32",
							cy: "32",
							r: radius,
							stroke: "rgba(255,255,255,0.08)",
							strokeWidth: "4.5",
							fill: "none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "32",
							cy: "32",
							r: radius,
							stroke: "#E31B23",
							strokeWidth: "4.5",
							fill: "none",
							strokeLinecap: "round",
							strokeDasharray: circumference,
							strokeDashoffset: offset,
							style: { transition: "stroke-dashoffset 0.05s linear" }
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[19px] font-bold leading-none",
								children: score
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[8px] font-semibold text-white/60 uppercase tracking-wide",
								children: "Excellent"
							})]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 text-[11px] font-semibold text-brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
							className: "h-3 w-3",
							strokeWidth: 2.5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+6 this week" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-1 text-[10.5px] text-white/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
							className: "h-3 w-3",
							strokeWidth: 1.75
						}), "Top 12% of businesses"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/health",
				className: "mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-brand/30 py-1.5 text-[11px] font-semibold text-brand transition-all duration-200 hover:bg-brand hover:text-white hover:border-brand",
				children: ["View Full Report ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
			})
		]
	});
}
var nav = [
	{
		label: "Command Centre",
		icon: LayoutDashboard,
		to: "/"
	},
	{
		label: "Business Advisor",
		icon: Sparkles,
		to: "/advisor"
	},
	{
		label: "Tasks",
		icon: SquareCheck,
		to: "/tasks"
	},
	{
		label: "Calendar",
		icon: Calendar,
		to: "/calendar"
	},
	{
		label: "Relationships",
		icon: Users,
		to: "/relationships"
	},
	{
		label: "Communications",
		icon: Inbox,
		to: "/communications",
		badge: 5
	},
	{
		label: "Reviews",
		icon: Star,
		to: "/reviews"
	},
	{
		label: "Business Intelligence",
		icon: ChartBar,
		to: "/intelligence"
	},
	{
		label: "Insights",
		icon: FileText,
		to: "/insights"
	},
	{
		label: "Goals",
		icon: Target,
		to: "/goals"
	},
	{
		label: "Website",
		icon: Globe,
		to: "/website"
	},
	{
		label: "Integrations",
		icon: Plug,
		to: "/integrations"
	},
	{
		label: "Settings",
		icon: Settings,
		to: "/settings"
	}
];
function Sidebar() {
	const { pathname } = useLocation();
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const NavItem = ({ item }) => {
		const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
		const Icon = item.icon;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: item.to,
			onClick: () => setMobileOpen(false),
			className: `group flex w-full items-center justify-between rounded-lg px-3 py-2 text-[12.5px] font-medium transition-all duration-150 xl:py-2 xl:text-[13px] ${isActive ? "bg-brand text-white shadow-sm" : "text-foreground/70 hover:bg-secondary hover:text-foreground"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: `h-[15px] w-[15px] shrink-0 transition-transform duration-150 group-hover:scale-105 ${isActive ? "text-white" : "text-foreground/55"}`,
					strokeWidth: 1.75
				}), item.label]
			}), item.badge && !isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white",
				children: item.badge
			})]
		}) });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setMobileOpen(true),
			className: "fixed left-4 top-4 z-50 grid h-8 w-8 place-items-center rounded-lg border border-border bg-card text-foreground shadow-soft lg:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
				className: "h-4 w-4",
				strokeWidth: 1.75
			})
		}),
		mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden",
			onClick: () => setMobileOpen(false)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: `fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-card transition-transform duration-200 lg:translate-x-0 xl:w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-[60px] items-center justify-between border-b border-border px-4 xl:px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobileOpen(false),
						className: "grid h-7 w-7 place-items-center rounded-lg text-foreground/50 transition-colors hover:bg-secondary hover:text-foreground lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "h-4 w-4",
							strokeWidth: 1.75
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 overflow-y-auto px-2.5 py-2 xl:px-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-0.5",
						children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, { item }, item.to))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-2.5 xl:p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthScore, {})
				})
			]
		})
	] });
}
function TopNav() {
	const { profile, membership, user } = useAuthContext();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const menuRef = (0, import_react.useRef)(null);
	const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "User";
	const initials = displayName.charAt(0).toUpperCase();
	const role = membership?.role ? membership.role.charAt(0).toUpperCase() + membership.role.slice(1) : "Owner";
	const handleSignOut = async () => {
		setMenuOpen(false);
		await signOut();
		navigate({ to: "/login" });
	};
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-sm sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "grid h-8 w-8 place-items-center rounded-lg text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
					className: "h-4.5 w-4.5",
					strokeWidth: 1.75
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand",
						strokeWidth: 1.75
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Ask anything about your business...",
						className: "h-[34px] w-full rounded-full border border-border bg-secondary/50 pl-9 pr-4 text-[12.5px] text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-3 focus:ring-foreground/5"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-0.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "relative grid h-8 w-8 place-items-center rounded-lg text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
							className: "h-[17px] w-[17px]",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-1 top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-brand px-0.5 text-[8px] font-bold text-white",
							children: "5"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "grid h-8 w-8 place-items-center rounded-lg text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
							className: "h-[17px] w-[17px]",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1.5 h-5 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						ref: menuRef,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setMenuOpen((o) => !o),
							className: "flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors duration-150 hover:bg-secondary",
							children: [
								profile?.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: profile.avatar_url,
									alt: displayName,
									className: "h-7 w-7 rounded-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-7 w-7 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand",
									children: initials
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden text-left sm:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[12.5px] font-semibold leading-tight text-foreground",
										children: displayName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10.5px] leading-tight text-muted-foreground",
										children: role
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
									className: "h-3 w-3 text-muted-foreground",
									strokeWidth: 2
								})
							]
						}), menuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-0 top-full mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-border px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[13px] font-semibold text-foreground",
									children: displayName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 truncate text-[11.5px] text-muted-foreground",
									children: user?.email
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleSignOut,
									className: "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
										className: "h-3.5 w-3.5",
										strokeWidth: 1.75
									}), "Sign Out"]
								})
							})]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { TopNav as n, Sidebar as t };
