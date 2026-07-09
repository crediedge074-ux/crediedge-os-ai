import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as updateProfile, i as updateBusinessSettings, o as useAuthContext, r as updateBusiness } from "./AuthContext-BeiOlUYy.mjs";
import { Dt as Brain, Et as Building2, F as Palette, Ft as Activity, L as Moon, Q as Layers, R as Monitor, S as Shield, _t as Circle, a as User, at as Globe, b as Smartphone, g as Star, gt as Clock, h as Sun, i as Users, k as RefreshCw, kt as Bell, mt as CreditCard, pt as Database, xt as ChevronRight, yt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppLayout } from "./PageHeader-BxHsP49M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DvbzxG8m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		id: "business",
		icon: Building2,
		label: "Business Profile",
		description: "Name, logo, contact and hours",
		group: "Core"
	},
	{
		id: "account",
		icon: User,
		label: "Account",
		description: "Profile, password and devices",
		group: "Core"
	},
	{
		id: "organisation",
		icon: Users,
		label: "Organisation",
		description: "Users, roles and permissions",
		group: "Core"
	},
	{
		id: "notifications",
		icon: Bell,
		label: "Notifications",
		description: "Email, push and SMS preferences",
		group: "Preferences"
	},
	{
		id: "appearance",
		icon: Palette,
		label: "Appearance",
		description: "Theme, layout and display",
		group: "Preferences"
	},
	{
		id: "ai",
		icon: Brain,
		label: "AI Settings",
		description: "Models, analysis and behaviour",
		group: "Preferences"
	},
	{
		id: "data",
		icon: Database,
		label: "Data & Privacy",
		description: "Export, backup and GDPR",
		group: "Data"
	},
	{
		id: "security",
		icon: Shield,
		label: "Security",
		description: "2FA, sessions and audit logs",
		group: "Data"
	},
	{
		id: "billing",
		icon: CreditCard,
		label: "Billing",
		description: "Plan, invoices and usage",
		group: "Account"
	},
	{
		id: "whitelabel",
		icon: Layers,
		label: "White Label",
		description: "Custom branding and domains",
		group: "Account"
	},
	{
		id: "status",
		icon: Activity,
		label: "System Status",
		description: "Platform health and versions",
		group: "System"
	},
	{
		id: "help",
		icon: Circle,
		label: "Help & Support",
		description: "Docs, requests and changelog",
		group: "System"
	}
];
var groups = [
	"Core",
	"Preferences",
	"Data",
	"Account",
	"System"
];
function SettingsRow({ label, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/20 px-4 py-3.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[13px] font-medium text-foreground",
				children: label
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-[12px] text-muted-foreground",
				children: description
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: action
		})]
	});
}
function Toggle({ on, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => onChange(!on),
		className: `relative h-6 w-11 rounded-full transition-colors ${on ? "bg-brand" : "bg-border"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}` })
	});
}
function ActionButton({ label, variant = "secondary" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: `rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors ${variant === "brand" ? "bg-brand text-white hover:opacity-80" : variant === "danger" ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100" : "border border-border bg-card text-foreground hover:bg-secondary"}`,
		children: label
	});
}
function SectionHeader({ title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-5 border-b border-border pb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-[15px] font-semibold text-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-[12.5px] text-muted-foreground",
			children: description
		})]
	});
}
function FormField({ label, value, onChange, defaultValue, type = "text", hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "mb-1.5 block text-[12.5px] font-medium text-muted-foreground",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			value,
			onChange: onChange ? (e) => onChange(e.target.value) : void 0,
			defaultValue: value === void 0 ? defaultValue : void 0,
			className: "w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/20 focus:bg-card focus:outline-none"
		}),
		hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-[11px] text-muted-foreground",
			children: hint
		})
	] });
}
function SaveBar({ onSave, saving, feedback }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-end gap-3 pt-2",
		children: [
			feedback === "saved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-600",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
					className: "h-3.5 w-3.5",
					strokeWidth: 2
				}), "Saved"]
			}),
			feedback === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[12.5px] font-medium text-red-600",
				children: "Failed to save. Try again."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onSave,
				disabled: saving,
				className: "rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-80 disabled:opacity-60",
				children: saving ? "Saving…" : "Save Changes"
			})
		]
	});
}
function PanelSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 animate-pulse rounded-lg bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4",
			children: [
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 animate-pulse rounded-xl bg-secondary" }, i))
		})]
	});
}
function BusinessPanel() {
	const { business, membership, refreshBusiness } = useAuthContext();
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		industry: "",
		phone: "",
		email: "",
		website: "",
		vat_number: "",
		address_line_1: "",
		city: "",
		postcode: "",
		timezone: "Europe/London",
		currency: "GBP"
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (business) setForm({
			name: business.name ?? "",
			industry: business.industry ?? "",
			phone: business.phone ?? "",
			email: business.email ?? "",
			website: business.website ?? "",
			vat_number: business.vat_number ?? "",
			address_line_1: business.address_line_1 ?? "",
			city: business.city ?? "",
			postcode: business.postcode ?? "",
			timezone: business.timezone ?? "Europe/London",
			currency: business.currency ?? "GBP"
		});
	}, [business?.id]);
	const set = (k) => (v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const handleSave = async () => {
		if (!membership?.business_id) return;
		setSaving(true);
		try {
			await updateBusiness(membership.business_id, form);
			await refreshBusiness();
			setFeedback("saved");
			setTimeout(() => setFeedback(null), 3e3);
		} catch {
			setFeedback("error");
		} finally {
			setSaving(false);
		}
	};
	if (!business) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelSkeleton, {});
	const businessHours = [
		{
			day: "Monday",
			open: true,
			from: "08:00",
			to: "18:00"
		},
		{
			day: "Tuesday",
			open: true,
			from: "08:00",
			to: "18:00"
		},
		{
			day: "Wednesday",
			open: true,
			from: "08:00",
			to: "18:00"
		},
		{
			day: "Thursday",
			open: true,
			from: "08:00",
			to: "18:00"
		},
		{
			day: "Friday",
			open: true,
			from: "08:00",
			to: "17:00"
		},
		{
			day: "Saturday",
			open: true,
			from: "09:00",
			to: "14:00"
		},
		{
			day: "Sunday",
			open: false,
			from: "—",
			to: "—"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Business Profile",
				description: "Your business identity displayed throughout CrediEdgeOS."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Business Name",
						value: form.name,
						onChange: set("name")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Industry",
						value: form.industry,
						onChange: set("industry")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Phone Number",
						value: form.phone,
						onChange: set("phone")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Email Address",
						value: form.email,
						onChange: set("email"),
						type: "email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Website",
						value: form.website,
						onChange: set("website")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "VAT Number",
						value: form.vat_number,
						onChange: set("vat_number")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Address Line 1",
						value: form.address_line_1,
						onChange: set("address_line_1")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "City / Town",
						value: form.city,
						onChange: set("city")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Postcode",
						value: form.postcode,
						onChange: set("postcode")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-[12.5px] font-medium text-muted-foreground",
						children: "Timezone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.timezone,
						onChange: (e) => set("timezone")(e.target.value),
						className: "w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Europe/London",
								children: "Europe/London (GMT+1)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "America/New_York",
								children: "America/New_York (GMT-4)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Asia/Dubai",
								children: "Asia/Dubai (GMT+4)"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-[12.5px] font-medium text-muted-foreground",
						children: "Currency"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.currency,
						onChange: (e) => set("currency")(e.target.value),
						className: "w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "GBP",
								children: "GBP — British Pound (£)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "USD",
								children: "USD — US Dollar ($)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "EUR",
								children: "EUR — Euro (€)"
							})
						]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-[13px] font-semibold text-foreground",
				children: "Business Hours"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border border-border",
				children: businessHours.map((bh, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-4 px-4 py-3 ${i < businessHours.length - 1 ? "border-b border-border" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-24 text-[12.5px] font-medium text-foreground",
							children: bh.day
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1.5 w-1.5 rounded-full ${bh.open ? "bg-emerald-500" : "bg-muted-foreground/30"}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] text-muted-foreground",
							children: bh.open ? `${bh.from} – ${bh.to}` : "Closed"
						})
					]
				}, bh.day))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBar, {
				onSave: handleSave,
				saving,
				feedback
			})
		]
	});
}
function AccountPanel() {
	const { profile, user, refreshProfile } = useAuthContext();
	const [form, setForm] = (0, import_react.useState)({
		first_name: "",
		last_name: "",
		phone: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (profile) setForm({
			first_name: profile.first_name ?? "",
			last_name: profile.last_name ?? "",
			phone: profile.phone ?? ""
		});
	}, [profile?.id]);
	const handleSave = async () => {
		if (!user) return;
		setSaving(true);
		try {
			await updateProfile(user.id, {
				first_name: form.first_name || null,
				last_name: form.last_name || null,
				full_name: [form.first_name, form.last_name].filter(Boolean).join(" ") || null,
				phone: form.phone || null
			});
			await refreshProfile();
			setFeedback("saved");
			setTimeout(() => setFeedback(null), 3e3);
		} catch {
			setFeedback("error");
		} finally {
			setSaving(false);
		}
	};
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelSkeleton, {});
	const displayName = profile.full_name ?? user?.email?.split("@")[0] ?? "User";
	const initials = displayName.charAt(0).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Account",
				description: "Your personal profile, password and active sessions."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [
					profile.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: profile.avatar_url,
						alt: displayName,
						className: "h-16 w-16 rounded-2xl object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-[22px] font-bold text-brand",
						children: initials
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[14px] font-semibold text-foreground",
						children: displayName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12.5px] text-muted-foreground",
						children: user?.email
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "ml-auto rounded-xl border border-border bg-secondary px-3.5 py-2 text-[12.5px] font-medium text-foreground transition-colors hover:bg-secondary/70",
						children: "Change Photo"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "First Name",
						value: form.first_name,
						onChange: (v) => setForm((f) => ({
							...f,
							first_name: v
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Last Name",
						value: form.last_name,
						onChange: (v) => setForm((f) => ({
							...f,
							last_name: v
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Email Address",
						defaultValue: user?.email,
						type: "email",
						hint: "Email changes require re-authentication."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Phone Number",
						value: form.phone,
						onChange: (v) => setForm((f) => ({
							...f,
							phone: v
						}))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-semibold text-foreground",
						children: "Security"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Password",
						description: "Last changed 30 days ago",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Change" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Two-Factor Authentication",
						description: "Not enabled — recommended for account security",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							label: "Enable",
							variant: "brand"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Active Sessions",
						description: "1 active session on this device",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "View" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Active Devices",
						description: "MacBook Pro, iPhone 15",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Manage" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBar, {
				onSave: handleSave,
				saving,
				feedback
			})
		]
	});
}
function OrganisationPanel() {
	const { profile, membership, business } = useAuthContext();
	const roles = profile ? [{
		name: profile.full_name ?? profile.first_name ?? "You",
		email: "",
		role: membership?.role ?? "Owner",
		status: "active"
	}] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Organisation",
				description: "Manage your team members, roles and access permissions."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[13px] font-semibold text-foreground",
					children: ["Team Members", business?.name ? ` — ${business.name}` : ""]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "rounded-xl bg-brand px-3.5 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-80",
					children: "Invite Member"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border border-border",
				children: roles.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-4 px-4 py-3.5 ${i < roles.length - 1 ? "border-b border-border" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand",
							children: r.name[0]?.toUpperCase() ?? "?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[13px] font-medium text-foreground",
								children: r.name
							}), r.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11.5px] text-muted-foreground",
								children: r.email
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700",
							children: r.role.charAt(0).toUpperCase() + r.role.slice(1)
						})
					]
				}, i))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-[13px] font-semibold text-foreground",
				children: "Role Permissions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
				children: [
					{
						role: "Owner",
						permissions: [
							"Full access",
							"Billing",
							"Users",
							"Delete data",
							"API keys"
						]
					},
					{
						role: "Admin",
						permissions: [
							"All features",
							"Manage users",
							"View billing"
						]
					},
					{
						role: "Staff",
						permissions: [
							"View data",
							"Create tasks",
							"Manage communications"
						]
					},
					{
						role: "Read Only",
						permissions: ["View reports", "View dashboard"]
					}
				].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-secondary/20 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2.5 text-[13px] font-semibold text-foreground",
						children: r.role
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: r.permissions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-[12px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
								className: "h-3.5 w-3.5 shrink-0 text-emerald-500",
								strokeWidth: 1.75
							}), p]
						}, p))
					})]
				}, r.role))
			})] })
		]
	});
}
function NotificationsPanel() {
	const { settings, membership, refreshSettings } = useAuthContext();
	const [prefs, setPrefs] = (0, import_react.useState)({
		new_enquiry: {
			email: true,
			push: true,
			sms: true
		},
		invoice_overdue: {
			email: true,
			push: true,
			sms: false
		},
		new_review: {
			email: true,
			push: true,
			sms: false
		},
		daily_briefing: {
			email: true,
			push: false,
			sms: false
		},
		weekly_report: {
			email: true,
			push: false,
			sms: false
		},
		campaign_alerts: {
			email: false,
			push: true,
			sms: false
		},
		mission_updates: {
			email: false,
			push: true,
			sms: false
		},
		ai_insights: {
			email: true,
			push: true,
			sms: false
		}
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (settings) setPrefs((p) => ({
			...p,
			daily_briefing: {
				...p.daily_briefing,
				email: settings.daily_briefing
			},
			weekly_report: {
				...p.weekly_report,
				email: settings.weekly_report
			},
			new_enquiry: {
				...p.new_enquiry,
				email: settings.email_notifications,
				push: settings.push_notifications,
				sms: settings.sms_notifications
			}
		}));
	}, [settings?.id]);
	const toggle = (id, channel) => {
		setPrefs((p) => ({
			...p,
			[id]: {
				...p[id],
				[channel]: !p[id][channel]
			}
		}));
	};
	const handleSave = async () => {
		if (!membership?.business_id) return;
		setSaving(true);
		try {
			await updateBusinessSettings(membership.business_id, {
				email_notifications: prefs.new_enquiry.email,
				push_notifications: prefs.new_enquiry.push,
				sms_notifications: prefs.new_enquiry.sms,
				daily_briefing: prefs.daily_briefing.email,
				weekly_report: prefs.weekly_report.email
			});
			await refreshSettings();
			setFeedback("saved");
			setTimeout(() => setFeedback(null), 3e3);
		} catch {
			setFeedback("error");
		} finally {
			setSaving(false);
		}
	};
	const items = [
		{
			id: "new_enquiry",
			label: "New Enquiry Received",
			description: "Triggered when a new lead or enquiry arrives"
		},
		{
			id: "invoice_overdue",
			label: "Invoice Overdue",
			description: "Alert when an invoice passes its due date"
		},
		{
			id: "new_review",
			label: "New Review Posted",
			description: "Notified when a customer posts a new review"
		},
		{
			id: "daily_briefing",
			label: "Daily AI Briefing",
			description: "Receive your CEO morning briefing each day"
		},
		{
			id: "weekly_report",
			label: "Weekly Performance Report",
			description: "Receive a weekly AI business summary"
		},
		{
			id: "campaign_alerts",
			label: "Campaign Alerts",
			description: "Status updates on running campaigns"
		},
		{
			id: "mission_updates",
			label: "Mission Updates",
			description: "Task completion and mission progress alerts"
		},
		{
			id: "ai_insights",
			label: "AI Insights",
			description: "New AI discoveries and opportunity alerts"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Notifications",
				description: "Control how and when CrediEdgeOS notifies you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_64px_64px_64px] border-b border-border bg-secondary/30 px-4 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Notification"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Push"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "SMS"
						})
					]
				}), items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `grid grid-cols-[1fr_64px_64px_64px] items-center px-4 py-3.5 ${i < items.length - 1 ? "border-b border-border" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-medium text-foreground",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11.5px] text-muted-foreground",
						children: item.description
					})] }), [
						"email",
						"push",
						"sms"
					].map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							on: prefs[item.id][ch],
							onChange: () => toggle(item.id, ch)
						})
					}, ch))]
				}, item.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBar, {
				onSave: handleSave,
				saving,
				feedback
			})
		]
	});
}
function AppearancePanel() {
	const { settings, membership, refreshSettings } = useAuthContext();
	const [theme, setTheme] = (0, import_react.useState)("Light");
	const [accent, setAccent] = (0, import_react.useState)("#E31B23");
	const [compact, setCompact] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (settings) {
			setTheme(settings.theme === "dark" ? "Dark" : settings.theme === "system" ? "System" : "Light");
			setAccent(settings.accent_colour ?? "#E31B23");
			setCompact(settings.compact_mode);
		}
	}, [settings?.id]);
	const handleSave = async () => {
		if (!membership?.business_id) return;
		setSaving(true);
		try {
			await updateBusinessSettings(membership.business_id, {
				theme: theme.toLowerCase(),
				accent_colour: accent,
				compact_mode: compact
			});
			await refreshSettings();
			setFeedback("saved");
			setTimeout(() => setFeedback(null), 3e3);
		} catch {
			setFeedback("error");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Appearance",
				description: "Personalise the look and feel of CrediEdgeOS."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mb-2.5 block text-[13px] font-semibold text-foreground",
				children: "Theme"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: [
					{
						label: "Light",
						icon: Sun
					},
					{
						label: "Dark",
						icon: Moon
					},
					{
						label: "System",
						icon: Monitor
					}
				].map(({ label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTheme(label),
					className: `flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-colors ${theme === label ? "border-brand bg-brand/10 text-brand" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "h-4 w-4",
						strokeWidth: 1.75
					}), label]
				}, label))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mb-2.5 block text-[13px] font-semibold text-foreground",
				children: "Accent Colour"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2.5",
				children: [
					{
						value: "#E31B23",
						label: "CrediEdge Red"
					},
					{
						value: "#1A1A1A",
						label: "Midnight"
					},
					{
						value: "#2563EB",
						label: "Ocean"
					},
					{
						value: "#059669",
						label: "Forest"
					},
					{
						value: "#D97706",
						label: "Amber"
					},
					{
						value: "#7C3AED",
						label: "Violet"
					}
				].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					title: c.label,
					onClick: () => setAccent(c.value),
					className: `h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${accent === c.value ? "border-foreground" : "border-transparent"}`,
					style: { backgroundColor: c.value }
				}, c.value))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mb-2.5 block text-[13px] font-semibold text-foreground",
				children: "Layout"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
					label: "Compact Mode",
					description: "Reduce spacing and padding for a denser interface",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						on: compact,
						onChange: setCompact
					})
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBar, {
				onSave: handleSave,
				saving,
				feedback
			})
		]
	});
}
function AIPanel() {
	const { settings, membership, refreshSettings } = useAuthContext();
	const [form, setForm] = (0, import_react.useState)({
		ai_provider: "openai",
		ai_model: "gpt-4o",
		ai_creativity: 65,
		ai_enabled: true,
		daily_briefing: true,
		weekly_report: true,
		business_context: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (settings) setForm({
			ai_provider: settings.ai_provider ?? "openai",
			ai_model: settings.ai_model ?? "gpt-4o",
			ai_creativity: settings.ai_creativity ?? 65,
			ai_enabled: settings.ai_enabled,
			daily_briefing: settings.daily_briefing,
			weekly_report: settings.weekly_report,
			business_context: settings.business_context ?? ""
		});
	}, [settings?.id]);
	const handleSave = async () => {
		if (!membership?.business_id) return;
		setSaving(true);
		try {
			await updateBusinessSettings(membership.business_id, {
				ai_provider: form.ai_provider,
				ai_model: form.ai_model,
				ai_creativity: form.ai_creativity,
				ai_enabled: form.ai_enabled,
				daily_briefing: form.daily_briefing,
				weekly_report: form.weekly_report,
				business_context: form.business_context || null
			});
			await refreshSettings();
			setFeedback("saved");
			setTimeout(() => setFeedback(null), 3e3);
		} catch {
			setFeedback("error");
		} finally {
			setSaving(false);
		}
	};
	if (!settings) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelSkeleton, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "AI Settings",
				description: "Configure how the AI analyses and communicates with you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-[12.5px] font-medium text-muted-foreground",
						children: "AI Provider"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.ai_provider,
						onChange: (e) => setForm((f) => ({
							...f,
							ai_provider: e.target.value
						})),
						className: "w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "openai",
								children: "OpenAI (GPT-4o)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "anthropic",
								children: "Anthropic (Claude 3.5)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "google",
								children: "Google (Gemini 1.5)"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-[12.5px] font-medium text-muted-foreground",
						children: "Preferred Model"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.ai_model,
						onChange: (e) => setForm((f) => ({
							...f,
							ai_model: e.target.value
						})),
						className: "w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "gpt-4o",
								children: "GPT-4o (Recommended)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "gpt-4o-mini",
								children: "GPT-4o Mini (Faster)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "o1",
								children: "GPT-o1 (Advanced Reasoning)"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-[12.5px] font-medium text-muted-foreground",
						children: "Response Length"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Concise" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Standard" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Detailed" })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-[12.5px] font-medium text-muted-foreground",
						children: "Analysis Frequency"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Every hour" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Every 6 hours" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Daily" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Manual only" })
						]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2.5 text-[13px] font-semibold text-foreground",
					children: "Creativity Level"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: 100,
					value: form.ai_creativity,
					onChange: (e) => setForm((f) => ({
						...f,
						ai_creativity: Number(e.target.value)
					})),
					className: "w-full accent-brand"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex justify-between text-[11px] text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Precise" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Balanced" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Creative" })
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "AI Enabled",
						description: "Enable AI analysis and insights across the platform",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							on: form.ai_enabled,
							onChange: (v) => setForm((f) => ({
								...f,
								ai_enabled: v
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Scheduled AI Refresh",
						description: "Re-analyse all data at 06:00 each morning",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							on: form.daily_briefing,
							onChange: (v) => setForm((f) => ({
								...f,
								daily_briefing: v
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Automatic AI Reports",
						description: "Generate weekly executive reports automatically",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							on: form.weekly_report,
							onChange: (v) => setForm((f) => ({
								...f,
								weekly_report: v
							}))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1.5 block text-[12.5px] font-medium text-muted-foreground",
					children: "Business Context"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.business_context,
					onChange: (e) => setForm((f) => ({
						...f,
						business_context: e.target.value
					})),
					placeholder: "Describe your business, goals and challenges to help the AI provide more relevant insights...",
					rows: 4,
					className: "w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/20 focus:outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[11px] text-muted-foreground",
					children: "This context helps the AI understand your business goals and provide more relevant insights."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBar, {
				onSave: handleSave,
				saving,
				feedback
			})
		]
	});
}
function DataPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Data & Privacy",
				description: "Manage your data, exports, backups and privacy settings."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-semibold text-foreground",
						children: "Data Management"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Export All Data",
						description: "Download a full export of your business data as CSV / JSON",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Export" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Import Data",
						description: "Import contacts, jobs or financial data from CSV",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Import" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Data Retention",
						description: "Automatically archive records older than 24 months",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Configure" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-semibold text-foreground",
						children: "Backups"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Create Backup",
						description: "Generate a full backup of your platform data now",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Backup Now" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Last Backup",
						description: "Completed successfully — 6 Jul 2026 at 02:00",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Download" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Restore from Backup",
						description: "Restore a previous backup to this account",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Restore" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-semibold text-foreground",
						children: "Privacy & GDPR"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Privacy Controls",
						description: "Manage what data is collected and processed",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Manage" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "GDPR Compliance",
						description: "View your data processing agreements",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "View DPA" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Cookie Preferences",
						description: "Control analytical and functional cookies",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Configure" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-red-200 bg-red-50 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-[13px] font-semibold text-red-700",
						children: "Danger Zone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-[12px] text-red-600",
						children: "This action is irreversible. All data will be permanently deleted."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
						label: "Delete Account",
						variant: "danger"
					})
				]
			})
		]
	});
}
function SecurityPanel() {
	const [twoFa, setTwoFa] = (0, import_react.useState)(false);
	const devices = [{
		name: "MacBook Pro 14",
		location: "London, UK",
		lastActive: "Now",
		current: true
	}, {
		name: "iPhone 15 Pro",
		location: "London, UK",
		lastActive: "1 hour ago",
		current: false
	}];
	const auditLog = [
		{
			action: "Logged in",
			device: "MacBook Pro",
			time: "Today 09:31",
			status: "success"
		},
		{
			action: "Changed password",
			device: "MacBook Pro",
			time: "7 Jul 09:18",
			status: "success"
		},
		{
			action: "API key generated",
			device: "MacBook Pro",
			time: "6 Jul 14:52",
			status: "success"
		},
		{
			action: "Failed login attempt",
			device: "Unknown",
			time: "5 Jul 22:14",
			status: "warning"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Security",
				description: "Protect your account with advanced security controls."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-semibold text-foreground",
						children: "Authentication"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Password",
						description: "Last changed 30 days ago",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Change Password" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
						label: "Two-Factor Authentication",
						description: twoFa ? "Enabled — authenticator app configured" : "Not enabled — adds an extra layer of security",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							on: twoFa,
							onChange: setTwoFa
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-[13px] font-semibold text-foreground",
				children: "Active Devices"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border border-border",
				children: devices.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-4 px-4 py-3.5 ${i === 0 ? "border-b border-border" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary",
							children: d.name.includes("iPhone") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
								className: "h-4 w-4 text-muted-foreground",
								strokeWidth: 1.75
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, {
								className: "h-4 w-4 text-muted-foreground",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[13px] font-medium text-foreground",
									children: d.name
								}), d.current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700",
									children: "Current"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11.5px] text-muted-foreground",
								children: [
									d.location,
									" · ",
									d.lastActive
								]
							})]
						}),
						!d.current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							label: "Revoke",
							variant: "danger"
						})
					]
				}, d.name))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-[13px] font-semibold text-foreground",
				children: "Audit Log"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border border-border",
				children: auditLog.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-3 px-4 py-3 ${i < auditLog.length - 1 ? "border-b border-border" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1.5 w-1.5 shrink-0 rounded-full ${entry.status === "success" ? "bg-emerald-500" : "bg-amber-500"}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[13px] font-medium text-foreground",
									children: entry.action
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-1.5 text-muted-foreground/40",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[12px] text-muted-foreground",
									children: entry.device
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-[11.5px] text-muted-foreground",
							children: entry.time
						})
					]
				}, i))
			})] })
		]
	});
}
function BillingPanel() {
	const { business } = useAuthContext();
	const plan = business?.subscription_plan ?? "Professional";
	const invoices = [
		{
			number: "INV-2026-007",
			date: "1 Jul 2026",
			amount: "£299.00",
			status: "paid"
		},
		{
			number: "INV-2026-006",
			date: "1 Jun 2026",
			amount: "£299.00",
			status: "paid"
		},
		{
			number: "INV-2026-005",
			date: "1 May 2026",
			amount: "£299.00",
			status: "paid"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "Billing",
				description: "Manage your subscription, payment method and invoices."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-brand/20 bg-brand/5 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[15px] font-bold text-foreground",
							children: [plan, " Plan"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[13px] text-muted-foreground",
							children: "£299 / month · Renews 1 August 2026"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: [
								"Unlimited contacts",
								"All DNA modules",
								"AI analysis",
								"Priority support",
								"API access"
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									className: "h-3 w-3",
									strokeWidth: 2
								}), f]
							}, f))
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold text-brand",
						children: "Active"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
						label: "Upgrade Plan",
						variant: "brand"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Manage Subscription" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[13px] font-semibold text-foreground",
					children: "Payment Method"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
					label: "Visa ending 4242",
					description: "Expires 12/26 · Default payment method",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Update" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-[13px] font-semibold text-foreground",
				children: "Invoice History"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border border-border",
				children: invoices.map((inv, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-4 px-4 py-3.5 ${i < invoices.length - 1 ? "border-b border-border" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[13px] font-medium text-foreground",
								children: inv.number
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11.5px] text-muted-foreground",
								children: inv.date
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[13px] font-semibold text-foreground",
							children: inv.amount
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700",
							children: "Paid"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, { label: "Download" })
					]
				}, inv.number))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-[13px] font-semibold text-foreground",
				children: "AI Credits Usage"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-secondary/20 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[13px] font-medium text-foreground",
							children: "Monthly Credits"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[13px] font-semibold text-foreground",
							children: "7,284 / 10,000"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 overflow-hidden rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[73%] rounded-full bg-brand transition-all duration-700" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 text-[11.5px] text-muted-foreground",
						children: "2,716 credits remaining this month"
					})
				]
			})] })
		]
	});
}
function WhiteLabelPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "White Label",
				description: "Customise CrediEdgeOS with your own branding for client portals."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-secondary/20 p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
							className: "h-6 w-6 text-muted-foreground/50",
							strokeWidth: 1.25
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[14px] font-semibold text-foreground",
						children: "White Label Available on Enterprise Plan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-sm text-[13px] text-muted-foreground",
						children: "Custom logo, domain, colours, and client portal branding. Contact us to upgrade to Enterprise."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "mt-4 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-80",
						children: "Upgrade to Enterprise"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none grid grid-cols-1 gap-4 opacity-40 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Custom Logo URL",
						defaultValue: "",
						hint: "Displayed in place of CrediEdgeOS logo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Custom Domain",
						defaultValue: "",
						hint: "e.g. app.yourbusiness.com"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Primary Brand Colour",
						defaultValue: "#E31B23"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: "Email Sender Name",
						defaultValue: "",
						hint: "Shown in email From field"
					})
				]
			})
		]
	});
}
function SystemStatusPanel() {
	const services = [
		{
			name: "Core Platform",
			status: "operational",
			uptime: "99.98%"
		},
		{
			name: "AI Engine",
			status: "operational",
			uptime: "99.94%"
		},
		{
			name: "Database",
			status: "operational",
			uptime: "99.99%"
		},
		{
			name: "Background Jobs",
			status: "operational",
			uptime: "99.91%"
		},
		{
			name: "API Gateway",
			status: "operational",
			uptime: "100%"
		},
		{
			name: "Webhooks",
			status: "operational",
			uptime: "99.87%"
		},
		{
			name: "Email Delivery",
			status: "degraded",
			uptime: "98.2%"
		},
		{
			name: "SMS Gateway",
			status: "operational",
			uptime: "99.76%"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				title: "System Status",
				description: "Real-time health and performance of all platform services."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-medium text-muted-foreground",
								children: "Platform Version"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 text-[20px] font-bold text-foreground",
								children: "v2.14.1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[11px] text-emerald-600",
								children: "Up to date"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-medium text-muted-foreground",
								children: "Storage Used"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 text-[20px] font-bold text-foreground",
								children: "4.2 GB"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[11px] text-muted-foreground",
								children: "of 50 GB"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-medium text-muted-foreground",
								children: "Connected Services"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 text-[20px] font-bold text-foreground",
								children: "9"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[11px] text-emerald-600",
								children: "All responding"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_120px_80px] border-b border-border bg-secondary/30 px-4 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Service"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Uptime"
						})
					]
				}), services.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `grid grid-cols-[1fr_120px_80px] items-center px-4 py-3 ${i < services.length - 1 ? "border-b border-border" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[13px] font-medium text-foreground",
							children: s.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1.5 w-1.5 rounded-full ${s.status === "operational" ? "bg-emerald-500" : "bg-amber-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[12px] font-medium capitalize ${s.status === "operational" ? "text-emerald-700" : "text-amber-700"}`,
								children: s.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-right text-[12px] font-medium text-muted-foreground",
							children: s.uptime
						})
					]
				}, s.name))]
			})
		]
	});
}
function HelpPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: "Help & Support",
			description: "Find resources, report issues or contact the team."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: [
				{
					label: "Documentation",
					description: "Full platform guides and API reference",
					icon: Globe,
					action: "Open Docs"
				},
				{
					label: "Contact Support",
					description: "Talk to the CrediEdge support team",
					icon: Circle,
					action: "Get Help"
				},
				{
					label: "Feature Requests",
					description: "Suggest new features for CrediEdgeOS",
					icon: Star,
					action: "Submit Idea"
				},
				{
					label: "Bug Reports",
					description: "Report a bug or unexpected behaviour",
					icon: RefreshCw,
					action: "Report Bug"
				},
				{
					label: "Public Roadmap",
					description: "See what's coming next in CrediEdgeOS",
					icon: Activity,
					action: "View Roadmap"
				},
				{
					label: "Changelog",
					description: "See recent updates and new features",
					icon: Clock,
					action: "View Changes"
				}
			].map((l) => {
				l.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsRow, {
					label: l.label,
					description: l.description,
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground",
						children: [l.action, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "h-3 w-3",
							strokeWidth: 2
						})]
					})
				}, l.label);
			})
		})]
	});
}
var panels = {
	business: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessPanel, {}),
	account: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountPanel, {}),
	organisation: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganisationPanel, {}),
	notifications: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsPanel, {}),
	appearance: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppearancePanel, {}),
	ai: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIPanel, {}),
	data: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataPanel, {}),
	security: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecurityPanel, {}),
	billing: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingPanel, {}),
	whitelabel: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhiteLabelPanel, {}),
	status: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SystemStatusPanel, {}),
	help: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelpPanel, {})
};
function SettingsHub() {
	const [active, setActive] = (0, import_react.useState)("business");
	const activeSection = sections.find((s) => s.id === active);
	const ActiveIcon = activeSection.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "w-52 shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "rounded-2xl border border-border bg-card shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4 p-2",
					children: groups.map((group) => {
						const groupSections = sections.filter((s) => s.group === group);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60",
							children: group
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-0.5",
							children: groupSections.map((s) => {
								const Icon = s.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActive(s.id),
									className: `flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[12.5px] font-medium transition-all duration-150 ${active === s.id ? "bg-brand text-white" : "text-foreground/70 hover:bg-secondary hover:text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											className: `h-3.5 w-3.5 shrink-0 ${active === s.id ? "text-white" : "text-foreground/50"}`,
											strokeWidth: 1.75
										}), s.label]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
										className: `h-3 w-3 ${active === s.id ? "text-white/50" : "text-foreground/25"}`,
										strokeWidth: 2
									})]
								}) }, s.id);
							})
						})] }, group);
					})
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-border px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-9 w-9 place-items-center rounded-xl bg-brand/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActiveIcon, {
						className: "h-4.5 w-4.5 text-brand",
						strokeWidth: 1.75
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[14.5px] font-semibold text-foreground",
					children: activeSection.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] text-muted-foreground",
					children: activeSection.description
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-6",
				children: panels[active]
			})]
		})]
	});
}
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Settings",
		description: "Configure your business, preferences and account.",
		crumbs: [{ label: "Settings" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsHub, {})] });
}
//#endregion
export { SettingsPage as component };
