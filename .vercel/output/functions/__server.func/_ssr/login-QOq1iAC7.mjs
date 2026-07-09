import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { o as useAuthContext } from "./AuthContext-BeiOlUYy.mjs";
import { i as signUp, n as signIn, t as Logo } from "./auth-CYRA7tOE.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Mt as ArrowRight, c as TriangleAlert, v as Sparkles } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-QOq1iAC7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { session, loading } = useAuthContext();
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("in");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!loading && session) navigate({ to: "/" });
	}, [
		loading,
		session,
		navigate
	]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSubmitting(true);
		try {
			if (tab === "in") await signIn(email, password);
			else {
				if (!fullName.trim()) {
					setError("Please enter your full name.");
					setSubmitting(false);
					return;
				}
				await signUp(email, password, fullName.trim());
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Something went wrong.";
			setError(message);
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden w-[440px] shrink-0 flex-col justify-between overflow-hidden bg-foreground p-10 lg:flex xl:w-[480px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.585_0.223_27.5/0.15),transparent_60%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "brightness-0 invert" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative space-y-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-[32px] font-bold leading-tight text-white",
						children: [
							"The AI operating",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"system for your",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"business."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-[14px] leading-relaxed text-white/55",
						children: "Revenue intelligence, customer DNA, AI discoveries and task automation — all in one place."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: [
							"Real-time business intelligence",
							"AI-powered insights and discovery",
							"Automated briefings and reports",
							"Customer relationship DNA"
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									className: "h-3 w-3 text-brand",
									strokeWidth: 1.75
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[13px] text-white/70",
								children: f
							})]
						}, f))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "relative text-[11px] text-white/25",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" CrediEdge. All rights reserved."
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-1 items-center justify-center px-6 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-[380px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-8 lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[22px] font-bold text-foreground",
							children: tab === "in" ? "Welcome back" : "Create your account"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[13px] text-muted-foreground",
							children: tab === "in" ? "Sign in to continue to CrediEdgeOS." : "Start your AI business operating system today."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 flex rounded-xl border border-border bg-secondary/50 p-1",
						children: ["in", "up"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setTab(t);
								setError(null);
							},
							className: `flex-1 rounded-lg py-2 text-[13px] font-semibold transition-all duration-150 ${tab === t ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`,
							children: t === "in" ? "Sign In" : "Sign Up"
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							tab === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-[12.5px] font-medium text-muted-foreground",
								children: "Full Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								placeholder: "Dom Crediedge",
								required: true,
								className: "h-[42px] w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-3 focus:ring-foreground/5"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-[12.5px] font-medium text-muted-foreground",
								children: "Email Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "you@example.com",
								required: true,
								autoComplete: "email",
								className: "h-[42px] w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-3 focus:ring-foreground/5"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1.5 block text-[12.5px] font-medium text-muted-foreground",
									children: "Password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••",
									required: true,
									minLength: 6,
									autoComplete: tab === "in" ? "current-password" : "new-password",
									className: "h-[42px] w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-3 focus:ring-foreground/5"
								}),
								tab === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: "Minimum 6 characters."
								})
							] }),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
									className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500",
									strokeWidth: 1.75
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[12.5px] text-red-700",
									children: error
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: submitting,
								className: "flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-brand text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-85 disabled:opacity-60",
								children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [tab === "in" ? "Sign In" : "Create Account", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "h-4 w-4",
									strokeWidth: 2
								})] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-[12.5px] text-muted-foreground",
						children: [
							tab === "in" ? "Don't have an account?" : "Already have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setTab(tab === "in" ? "up" : "in");
									setError(null);
								},
								className: "font-semibold text-brand hover:underline",
								children: tab === "in" ? "Sign up free" : "Sign in"
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { LoginPage as component };
