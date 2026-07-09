import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as supabase, o as useAuthContext } from "./AuthContext-BeiOlUYy.mjs";
import { At as Award, Ct as ChartBar, D as Save, Dt as Brain, Et as Building2, H as MessageCircle, K as MapPin, Mt as ArrowRight, N as Phone, O as Repeat, S as Shield, St as ChevronDown, V as MessageSquare, X as Lightbulb, a as User, c as TriangleAlert, dt as Eye, g as Star, gt as Clock, i as Users, it as Heart, l as TrendingUp, m as Tag, n as X, p as Target, q as Mail, st as Gift, t as Zap, u as TrendingDown, v as Sparkles, vt as CircleDollarSign, wt as Calendar, xt as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as AppLayout } from "./PageHeader-BxHsP49M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/relationships-CcpUJeTj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEMO_CUSTOMERS = [
	{
		first_name: "Marcus",
		last_name: "Williams",
		full_name: "Marcus Williams",
		email: "marcus.williams@example.com",
		phone: "07700 900123",
		city: "London",
		postcode: "SW1A 1AA",
		customer_type: "individual",
		status: "active",
		source: "referral",
		lifetime_value: 3100,
		preferred_contact_method: "email",
		marketing_consent: true,
		gdpr_consent: true,
		tags: ["vip", "loyal"],
		customer_since: "2025-01-10",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 4320 * 60 * 1e3)).toISOString(),
		notes: "Prefers morning appointments. Has a dog named Biscuit. Works in finance."
	},
	{
		first_name: "James",
		last_name: "Thompson",
		full_name: "James Thompson",
		email: "james.thompson@example.com",
		phone: "07700 900456",
		city: "Manchester",
		postcode: "M1 1AE",
		customer_type: "individual",
		status: "active",
		source: "referral",
		lifetime_value: 5600,
		preferred_contact_method: "sms",
		marketing_consent: true,
		gdpr_consent: true,
		tags: ["high-value", "regular"],
		customer_since: "2025-03-03",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 1440 * 60 * 1e3)).toISOString(),
		notes: "Referred by Marcus Williams. Owns a small business. Flexible mornings."
	},
	{
		first_name: "Sarah",
		last_name: "Johnson",
		full_name: "Sarah Johnson",
		email: "sarah.johnson@example.com",
		phone: "07700 900789",
		city: "Birmingham",
		postcode: "B1 1BB",
		customer_type: "individual",
		status: "active",
		source: "organic",
		lifetime_value: 2400,
		preferred_contact_method: "email",
		marketing_consent: true,
		gdpr_consent: true,
		tags: ["growing"],
		customer_since: "2025-04-15",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 288 * 60 * 60 * 1e3)).toISOString()
	},
	{
		first_name: "Emily",
		last_name: "Clarke",
		full_name: "Emily Clarke",
		email: "emily.clarke@example.com",
		phone: "07700 900321",
		city: "Leeds",
		postcode: "LS1 1BA",
		customer_type: "individual",
		status: "active",
		source: "referral",
		lifetime_value: 1800,
		preferred_contact_method: "email",
		marketing_consent: false,
		gdpr_consent: true,
		tags: ["at-risk"],
		customer_since: "2025-04-30",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 1080 * 60 * 60 * 1e3)).toISOString(),
		notes: "Referred by James Thompson. Last engagement dropping off."
	},
	{
		first_name: "John",
		last_name: "Smith",
		full_name: "John Smith",
		email: "john.smith@example.com",
		phone: "07700 900654",
		city: "Bristol",
		postcode: "BS1 1AA",
		customer_type: "individual",
		status: "active",
		source: "social",
		lifetime_value: 2900,
		preferred_contact_method: "phone",
		marketing_consent: true,
		gdpr_consent: true,
		tags: ["high-value", "upsell-ready"],
		customer_since: "2025-02-20",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 11520 * 60 * 1e3)).toISOString()
	},
	{
		first_name: "Olivia",
		last_name: "Brown",
		full_name: "Olivia Brown",
		email: "olivia.brown@example.com",
		phone: "07700 900987",
		city: "Edinburgh",
		postcode: "EH1 1YZ",
		customer_type: "individual",
		status: "active",
		source: "organic",
		lifetime_value: 1500,
		preferred_contact_method: "sms",
		marketing_consent: true,
		gdpr_consent: true,
		tags: ["growing"],
		customer_since: "2025-05-10",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 480 * 60 * 60 * 1e3)).toISOString()
	},
	{
		first_name: "Daniel",
		last_name: "Murphy",
		full_name: "Daniel Murphy",
		email: "daniel.murphy@example.com",
		phone: "07700 900111",
		city: "Dublin",
		postcode: "D01 F5P2",
		country: "Ireland",
		customer_type: "individual",
		status: "active",
		source: "referral",
		lifetime_value: 4200,
		preferred_contact_method: "email",
		marketing_consent: true,
		gdpr_consent: true,
		tags: ["vip", "loyal"],
		customer_since: "2024-11-05",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 7200 * 60 * 1e3)).toISOString()
	},
	{
		first_name: "Sophie",
		last_name: "Turner",
		full_name: "Sophie Turner",
		email: "sophie.turner@example.com",
		phone: "07700 900222",
		city: "Liverpool",
		postcode: "L1 1AA",
		customer_type: "individual",
		status: "active",
		source: "social",
		lifetime_value: 950,
		preferred_contact_method: "sms",
		marketing_consent: true,
		gdpr_consent: true,
		tags: ["new"],
		customer_since: "2026-06-01",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 720 * 60 * 60 * 1e3)).toISOString()
	},
	{
		first_name: "Alex",
		last_name: "Harrison",
		full_name: "Alex Harrison",
		email: "alex.harrison@example.com",
		phone: "07700 900333",
		city: "Sheffield",
		postcode: "S1 1AA",
		customer_type: "individual",
		status: "inactive",
		source: "organic",
		lifetime_value: 680,
		preferred_contact_method: "email",
		marketing_consent: false,
		gdpr_consent: true,
		tags: ["inactive"],
		customer_since: "2025-08-12",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 2280 * 60 * 60 * 1e3)).toISOString()
	},
	{
		first_name: "Rachel",
		last_name: "Green",
		full_name: "Rachel Green",
		email: "rachel.green@example.com",
		phone: "07700 900444",
		city: "Nottingham",
		postcode: "NG1 1AA",
		customer_type: "individual",
		status: "active",
		source: "organic",
		lifetime_value: 2100,
		preferred_contact_method: "email",
		marketing_consent: true,
		gdpr_consent: true,
		tags: ["regular"],
		customer_since: "2025-03-18",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 360 * 60 * 60 * 1e3)).toISOString()
	},
	{
		first_name: "Tom",
		last_name: "Baker",
		full_name: "Tom Baker",
		email: "tom.baker@example.com",
		phone: "07700 900555",
		city: "Cardiff",
		postcode: "CF10 1AA",
		country: "Wales",
		customer_type: "individual",
		status: "active",
		source: "referral",
		lifetime_value: 3600,
		preferred_contact_method: "phone",
		marketing_consent: true,
		gdpr_consent: true,
		tags: ["high-value", "loyal"],
		customer_since: "2024-12-20",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 10080 * 60 * 1e3)).toISOString()
	},
	{
		first_name: "Natasha",
		last_name: "Patel",
		full_name: "Natasha Patel",
		email: "natasha.patel@example.com",
		phone: "07700 900666",
		city: "Leicester",
		postcode: "LE1 1AA",
		customer_type: "individual",
		status: "active",
		source: "social",
		lifetime_value: 1200,
		preferred_contact_method: "sms",
		marketing_consent: true,
		gdpr_consent: true,
		tags: ["growing"],
		customer_since: "2025-06-22",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 600 * 60 * 60 * 1e3)).toISOString()
	},
	{
		first_name: "Chris",
		last_name: "Evans",
		full_name: "Chris Evans",
		company_name: "Evans & Co.",
		email: "chris@evansco.co.uk",
		phone: "07700 900777",
		city: "Cambridge",
		postcode: "CB1 1AA",
		customer_type: "business",
		status: "active",
		source: "organic",
		lifetime_value: 7800,
		preferred_contact_method: "email",
		marketing_consent: true,
		gdpr_consent: true,
		tags: [
			"business",
			"high-value",
			"vip"
		],
		customer_since: "2024-10-01",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 2880 * 60 * 1e3)).toISOString(),
		notes: "Business account. Manages a team of 12. Monthly standing order."
	},
	{
		first_name: "Priya",
		last_name: "Sharma",
		full_name: "Priya Sharma",
		email: "priya.sharma@example.com",
		phone: "07700 900888",
		city: "Oxford",
		postcode: "OX1 1AA",
		customer_type: "individual",
		status: "inactive",
		source: "organic",
		lifetime_value: 420,
		preferred_contact_method: "email",
		marketing_consent: false,
		gdpr_consent: true,
		tags: ["inactive", "at-risk"],
		customer_since: "2025-09-05",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 2640 * 60 * 60 * 1e3)).toISOString()
	},
	{
		first_name: "George",
		last_name: "Wilson",
		full_name: "George Wilson",
		email: "george.wilson@example.com",
		phone: "07700 900999",
		city: "Glasgow",
		postcode: "G1 1AA",
		country: "Scotland",
		customer_type: "individual",
		status: "active",
		source: "referral",
		lifetime_value: 2700,
		preferred_contact_method: "phone",
		marketing_consent: true,
		gdpr_consent: true,
		tags: ["regular", "loyal"],
		customer_since: "2025-01-28",
		last_booking_at: (/* @__PURE__ */ new Date(Date.now() - 432 * 60 * 60 * 1e3)).toISOString()
	}
];
async function getCustomers(businessId) {
	const { data, error } = await supabase.from("customers").select("*").eq("business_id", businessId).eq("is_active", true).order("full_name", { ascending: true });
	if (error) throw error;
	return data ?? [];
}
async function createCustomer(insert) {
	const { data, error } = await supabase.from("customers").insert(insert).select().single();
	if (error) throw error;
	return data;
}
async function seedDemoCustomers(businessId, userId) {
	const inserts = DEMO_CUSTOMERS.map((c) => ({
		...c,
		business_id: businessId,
		created_by: userId
	}));
	const { error } = await supabase.from("customers").insert(inserts);
	if (error) throw error;
}
function useCustomers() {
	const { membership, user } = useAuthContext();
	const businessId = membership?.business_id;
	const [customers, setCustomers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		if (!businessId) return;
		let mounted = true;
		setLoading(true);
		setError(null);
		try {
			let data = await getCustomers(businessId);
			if (data.length === 0 && user) {
				await seedDemoCustomers(businessId, user.id);
				data = await getCustomers(businessId);
			}
			if (mounted) setCustomers(data);
		} catch (err) {
			if (mounted) setError(err instanceof Error ? err.message : "Failed to load customers");
		} finally {
			if (mounted) setLoading(false);
		}
		return () => {
			mounted = false;
		};
	}, [businessId, user]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	return {
		customers,
		loading,
		error,
		refresh: load
	};
}
function useCreateCustomer() {
	const { membership, user } = useAuthContext();
	const businessId = membership?.business_id;
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const create = async (data) => {
		if (!businessId) return null;
		setCreating(true);
		setError(null);
		try {
			return await createCustomer({
				...data,
				business_id: businessId,
				created_by: user?.id ?? null
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create customer");
			return null;
		} finally {
			setCreating(false);
		}
	};
	return {
		create,
		creating,
		error
	};
}
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1200 }) {
	const [display, setDisplay] = (0, import_react.useState)(0);
	const ref = (0, import_react.useRef)(null);
	const started = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && !started.current) {
				started.current = true;
				const start = performance.now();
				const tick = (now) => {
					const p = Math.min((now - start) / duration, 1);
					const eased = 1 - Math.pow(1 - p, 3);
					setDisplay(Math.round(eased * value));
					if (p < 1) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
				obs.disconnect();
			}
		}, { threshold: .3 });
		obs.observe(el);
		return () => obs.disconnect();
	}, [value, duration]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		children: [
			prefix,
			display.toLocaleString(),
			suffix
		]
	});
}
function HealthRing({ score, size = 80, stroke = 7, color = "#E31B23" }) {
	const [animated, setAnimated] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	const r = (size - stroke) / 2;
	const circ = 2 * Math.PI * r;
	const offset = circ - (animated ? score / 100 : 0) * circ;
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setAnimated(true);
				obs.disconnect();
			}
		}, { threshold: .3 });
		obs.observe(el);
		return () => obs.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		ref,
		width: size,
		height: size,
		className: "-rotate-90",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: size / 2,
			cy: size / 2,
			r,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: stroke,
			className: "text-border"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: size / 2,
			cy: size / 2,
			r,
			fill: "none",
			stroke: color,
			strokeWidth: stroke,
			strokeLinecap: "round",
			strokeDasharray: circ,
			strokeDashoffset: offset,
			style: { transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }
		})]
	});
}
function TraitBar({ label, value, color }) {
	const [w, setW] = (0, import_react.useState)(0);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setTimeout(() => setW(value), 100);
				obs.disconnect();
			}
		}, { threshold: .2 });
		obs.observe(el);
		return () => obs.disconnect();
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-28 shrink-0 text-[11.5px] text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
					style: {
						width: `${w}%`,
						backgroundColor: color
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "w-8 shrink-0 text-right text-[11px] font-semibold text-foreground",
				children: [value, "%"]
			})
		]
	});
}
function hashCode(s) {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
	return Math.abs(h);
}
function seededInt(seed, min, max) {
	const pseudo = (seed * 1664525 + 1013904223 >>> 0) / 4294967295;
	return Math.round(min + pseudo * (max - min));
}
var SEGMENTS = [
	"VIP Champion",
	"High Value",
	"Growing",
	"Regular",
	"At Risk"
];
var NEXT_ACTIONS = [
	"Send personalised offer",
	"Schedule follow-up call",
	"Send loyalty reward",
	"Invite to referral programme",
	"Send re-engagement campaign"
];
var PREDICTIONS = [
	"87% likely to book again",
	"93% likely to book again",
	"72% likely to book again",
	"65% likely to upgrade",
	"58% at risk of going inactive"
];
var CAMPAIGN_NAMES = [
	"Spring Loyalty Drive",
	"VIP Member Programme",
	"Retention Plus",
	"Annual Members Drive",
	"Summer Reactivation",
	"Referral Rewards"
];
var MEMORY_POOL = [
	"Prefers morning appointments",
	"Prefers afternoon slots",
	"Very punctual — always early",
	"Prefers minimal disruption",
	"Appreciates personalised service",
	"Responds quickly to SMS",
	"Prefers email communications",
	"Birthday on file — send card",
	"Long-term loyal customer",
	"Referred multiple clients"
];
var TRIGGERS_POOL = [
	"Personalised offers",
	"Loyalty rewards",
	"New service launches",
	"Seasonal promotions",
	"Bundle deals",
	"Reminder messages",
	"Limited availability"
];
function relativeTime(isoDate) {
	if (!isoDate) return "Unknown";
	const diff = Date.now() - new Date(isoDate).getTime();
	const days = Math.floor(diff / 864e5);
	if (days === 0) return "Today";
	if (days === 1) return "Yesterday";
	if (days < 7) return `${days} days ago`;
	if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
	return `${Math.floor(days / 30)} months ago`;
}
function adaptCustomer(c) {
	const seed = hashCode(c.id);
	const s1 = seededInt(seed, 1, 9999);
	const s2 = seededInt(seed ^ 3735928559, 1, 9999);
	const ltv = Number(c.lifetime_value) || 0;
	const health = Math.min(98, Math.max(40, Math.round(50 + ltv / 200 + seededInt(s1, -5, 5))));
	const segment = SEGMENTS[ltv >= 4e3 ? 0 : ltv >= 2500 ? 1 : ltv >= 1e3 ? 2 : c.status === "inactive" ? 4 : 3];
	const firstName = c.first_name ?? c.full_name?.split(" ")[0] ?? "Customer";
	const lastName = c.last_name ?? c.full_name?.split(" ")[1] ?? "";
	const name = c.full_name ?? [firstName, lastName].filter(Boolean).join(" ");
	const initials = [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase() || "C";
	const contactLabel = c.preferred_contact_method === "sms" ? "SMS" : c.preferred_contact_method === "phone" ? "Phone" : "Email";
	return {
		id: c.id,
		name,
		initials,
		segment,
		health,
		value: `£${ltv.toLocaleString()}`,
		jobs: Math.max(1, seededInt(s1, 2, 12)),
		lastSeen: relativeTime(c.last_booking_at),
		nextAction: NEXT_ACTIONS[seededInt(s1, 0, NEXT_ACTIONS.length - 1)],
		prediction: PREDICTIONS[seededInt(s2, 0, PREDICTIONS.length - 1)],
		personality: {
			traits: [
				{
					label: "Decision Speed",
					value: seededInt(s1, 30, 90),
					color: "#E31B23"
				},
				{
					label: "Price Sensitivity",
					value: seededInt(s1 ^ 1, 20, 75),
					color: "#3b82f6"
				},
				{
					label: "Brand Loyalty",
					value: Math.min(99, health + seededInt(s2, -8, 8)),
					color: "#10b981"
				},
				{
					label: "Communication Pref",
					value: seededInt(s2 ^ 2, 45, 90),
					color: "#f59e0b"
				},
				{
					label: "Quality Focus",
					value: seededInt(s2 ^ 3, 50, 95),
					color: "#8b5cf6"
				}
			],
			summary: `${firstName} is a ${segment.toLowerCase()} with ${c.status === "active" ? "strong" : "moderate"} engagement. ${ltv >= 3e3 ? "High lifetime value with consistent spending patterns." : "Growing relationship with good future potential."} ${contactLabel} is their preferred channel.`
		},
		communication: {
			preferred: contactLabel,
			responseTime: seededInt(s1, 0, 1) ? "< 2 hours" : "< 4 hours",
			bestTime: [
				"Tuesday–Thursday, 9am–11am",
				"Monday & Friday, 12pm–2pm",
				"Weekdays, 2pm–4pm"
			][seededInt(s1, 0, 2)],
			openRate: seededInt(s1, 60, 95),
			clickRate: seededInt(s2, 35, 75),
			channels: [
				{
					name: "Email",
					rate: seededInt(s1, 55, 95),
					color: "#E31B23"
				},
				{
					name: "SMS",
					rate: seededInt(s2, 50, 90),
					color: "#3b82f6"
				},
				{
					name: "Phone",
					rate: seededInt(s1 ^ 4, 30, 70),
					color: "#10b981"
				}
			]
		},
		buying: {
			avgSpend: ltv > 0 ? `£${Math.round(ltv / Math.max(1, seededInt(s1, 3, 10))).toLocaleString()}` : "£0",
			frequency: [
				"Every 4 weeks",
				"Every 6 weeks",
				"Monthly",
				"Bi-monthly"
			][seededInt(s1, 0, 3)],
			peakSeason: [
				"Spring & Autumn",
				"All year (consistent)",
				"Summer peak",
				"Q4 focused"
			][seededInt(s2, 0, 3)],
			triggers: [
				TRIGGERS_POOL[seededInt(s1, 0, TRIGGERS_POOL.length - 1)],
				TRIGGERS_POOL[seededInt(s2, 0, TRIGGERS_POOL.length - 1)],
				TRIGGERS_POOL[seededInt(s1 ^ s2, 0, TRIGGERS_POOL.length - 1)]
			].filter((v, i, a) => a.indexOf(v) === i),
			pattern: `${firstName} books ${[
				"regularly and consistently",
				"primarily for premium services",
				"reactively to promotions",
				"on a seasonal cycle"
			][seededInt(s1, 0, 3)]}. ${ltv >= 3e3 ? "High lifetime value customer." : "Growing spend trajectory."}`
		},
		timeline: [
			{
				date: "5 Jul 2026",
				event: "Booked service",
				amount: `£${seededInt(s1, 200, 700)}`,
				type: "booking"
			},
			{
				date: "28 May 2026",
				event: "Left 5-star review",
				type: "review"
			},
			{
				date: "14 Apr 2026",
				event: "Purchased add-on",
				amount: `£${seededInt(s2, 80, 250)}`,
				type: "purchase"
			},
			{
				date: "1 Mar 2026",
				event: "Referral made",
				type: "referral"
			}
		],
		opportunities: [{
			title: "Loyalty upgrade offer",
			value: `£${seededInt(s1, 150, 400)}`,
			probability: seededInt(s1, 65, 92),
			urgency: "This week"
		}, {
			title: "Referral programme invitation",
			value: `£${seededInt(s2, 100, 250)} credit`,
			probability: seededInt(s2, 55, 80),
			urgency: "This month"
		}],
		priorities: [{
			action: `Send ${NEXT_ACTIONS[seededInt(s1, 0, NEXT_ACTIONS.length - 1)].toLowerCase()}`,
			reason: `Based on ${firstName}'s booking history and engagement pattern, now is the optimal time to act. Historical conversion rate for this action is ${seededInt(s1, 70, 94)}%.`,
			impact: `£${seededInt(s1, 200, 600)}`,
			confidence: seededInt(s1, 72, 94)
		}],
		campaigns: [CAMPAIGN_NAMES[seededInt(s1, 0, CAMPAIGN_NAMES.length - 1)], CAMPAIGN_NAMES[seededInt(s2, 0, CAMPAIGN_NAMES.length - 1)]].filter((v, i, a) => a.indexOf(v) === i),
		memory: [
			MEMORY_POOL[seededInt(s1, 0, MEMORY_POOL.length - 1)],
			MEMORY_POOL[seededInt(s2, 0, MEMORY_POOL.length - 1)],
			MEMORY_POOL[seededInt(s1 ^ s2, 0, MEMORY_POOL.length - 1)],
			c.notes ? c.notes.slice(0, 80) : MEMORY_POOL[seededInt(s1 ^ 255, 0, MEMORY_POOL.length - 1)]
		].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)
	};
}
var segments = [
	{
		name: "VIP Champions",
		count: 3,
		value: "£14,200",
		color: "#E31B23",
		description: "Highest LTV, brand advocates, refer others"
	},
	{
		name: "High Value",
		count: 8,
		value: "£31,800",
		color: "#3b82f6",
		description: "Consistent bookings, growth potential"
	},
	{
		name: "Growing",
		count: 14,
		value: "£18,400",
		color: "#10b981",
		description: "Increasing frequency and spend"
	},
	{
		name: "At Risk",
		count: 5,
		value: "£8,900",
		color: "#f59e0b",
		description: "Declining engagement, need re-activation"
	},
	{
		name: "Inactive",
		count: 9,
		value: "£4,100",
		color: "#6b7280",
		description: "No activity in 90+ days"
	}
];
var predictions = [
	{
		customer: "Sarah Johnson",
		prediction: "Book again within 2 weeks",
		probability: 84,
		action: "Send reminder",
		type: "positive"
	},
	{
		customer: "Emily Clarke",
		prediction: "At risk of going inactive",
		probability: 71,
		action: "Re-activate now",
		type: "warning"
	},
	{
		customer: "John Smith",
		prediction: "Ready for upsell offer",
		probability: 79,
		action: "Send offer",
		type: "positive"
	},
	{
		customer: "Marcus Williams",
		prediction: "Will refer someone this month",
		probability: 67,
		action: "Share referral link",
		type: "positive"
	}
];
function CustomerSelectorSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2.5",
		children: [
			1,
			2,
			3
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[56px] w-40 animate-pulse rounded-2xl bg-secondary" }, i))
	});
}
function ProfileSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card p-5 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[72px] w-[72px] animate-pulse rounded-full bg-secondary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-2 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-32 animate-pulse rounded bg-secondary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-24 animate-pulse rounded bg-secondary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-48 animate-pulse rounded bg-secondary" })
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: [
				1,
				2,
				3,
				4,
				5
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-28 animate-pulse rounded bg-secondary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 flex-1 animate-pulse rounded-full bg-secondary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-8 animate-pulse rounded bg-secondary" })
				]
			}, i))
		})]
	});
}
function EmptyState({ onAdd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
					className: "h-6 w-6 text-brand",
					strokeWidth: 1.75
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[15px] font-semibold text-foreground",
				children: "No customers yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 max-w-xs text-[13px] text-muted-foreground",
				children: "Create your first customer to unlock AI-powered Relationship DNA profiles, health scores, and personalised recommendations."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onAdd,
				className: "mt-5 flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:opacity-85 transition-opacity",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
					className: "h-3.5 w-3.5",
					strokeWidth: 1.75
				}), "Add Your First Customer"]
			})
		]
	});
}
function RelationshipDNAHero({ total, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-8 left-1/3 h-40 w-40 rounded-full bg-brand/10 blur-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-brand" }), "AI-Powered Intelligence"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[22px] font-bold leading-tight tracking-tight text-background",
						children: "Relationship DNA™"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 max-w-lg text-[13px] leading-relaxed text-background/70",
						children: "Your AI understands every customer's personality, buying behaviour, and relationship health — so you know exactly who needs attention, who's ready to spend, and who's at risk."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex shrink-0 flex-wrap gap-3",
					children: [
						{
							label: "Total Customers",
							value: String(total),
							icon: Users
						},
						{
							label: "Active Relationships",
							value: String(active),
							icon: Heart
						},
						{
							label: "Avg. Relationship Health",
							value: "76%",
							icon: ChartBar
						},
						{
							label: "Predicted Revenue (30d)",
							value: "£8,240",
							icon: TrendingUp
						}
					].map((stat) => {
						const Icon = stat.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-[100px] flex-col gap-0.5 rounded-xl bg-background/10 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "h-3 w-3 text-background/60",
									strokeWidth: 1.75
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-medium text-background/60",
									children: stat.label
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[18px] font-bold tracking-tight text-background",
								children: stat.value
							})]
						}, stat.label);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mt-5 flex flex-wrap gap-2.5",
				children: [
					{
						label: "3 customers need immediate attention",
						dot: "bg-brand animate-pulse"
					},
					{
						label: "5 upsell opportunities identified",
						dot: "bg-emerald-400"
					},
					{
						label: "2 customers showing churn signals",
						dot: "bg-amber-400"
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-lg bg-background/10 px-3 py-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${item.dot}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11.5px] text-background/80",
						children: item.label
					})]
				}, item.label))
			})
		]
	});
}
function CustomerKPIs({ customers }) {
	const totalLtv = customers.reduce((sum, c) => sum + (parseInt(c.value.replace(/[^0-9]/g, ""), 10) || 0), 0);
	const avgLtv = customers.length ? Math.round(totalLtv / customers.length) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
		children: [
			{
				label: "Total LTV",
				value: totalLtv,
				prefix: "£",
				trend: "+12%",
				up: true,
				icon: CircleDollarSign
			},
			{
				label: "Avg. LTV",
				value: avgLtv,
				prefix: "£",
				trend: "+8%",
				up: true,
				icon: TrendingUp
			},
			{
				label: "Retention Rate",
				value: 84,
				suffix: "%",
				trend: "+3%",
				up: true,
				icon: Repeat
			},
			{
				label: "NPS Score",
				value: 71,
				suffix: "",
				trend: "+5 pts",
				up: true,
				icon: Star
			},
			{
				label: "Churn Risk",
				value: 13,
				suffix: "%",
				trend: "-2%",
				up: true,
				icon: TriangleAlert
			},
			{
				label: "Referral Rate",
				value: 28,
				suffix: "%",
				trend: "+6%",
				up: true,
				icon: Gift
			}
		].map((k) => {
			const Icon = k.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/10 hover:shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-medium text-muted-foreground",
							children: k.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-6 w-6 place-items-center rounded-lg bg-secondary text-foreground/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "h-[11px] w-[11px]",
								strokeWidth: 1.75
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[20px] font-bold tracking-tight text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
							value: k.value,
							prefix: k.prefix ?? "",
							suffix: k.suffix ?? ""
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center gap-1 text-[10.5px] font-semibold ${k.up ? "text-brand" : "text-destructive"}`,
						children: [
							k.up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
								className: "h-2.5 w-2.5",
								strokeWidth: 2
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, {
								className: "h-2.5 w-2.5",
								strokeWidth: 2
							}),
							k.trend,
							" vs last month"
						]
					})
				]
			}, k.label);
		})
	});
}
function CustomerSelector({ customers, selected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-2.5",
		children: [customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => onSelect(c.id),
			className: `flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-left transition-all duration-150 ${selected === c.id ? "border-foreground/20 bg-card shadow-card" : "border-border bg-card/50 hover:border-foreground/15 hover:bg-card"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold ${selected === c.id ? "bg-brand text-white" : "bg-secondary text-foreground"}`,
				children: c.initials
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12.5px] font-semibold text-foreground",
				children: c.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10.5px] text-muted-foreground",
				children: c.segment
			})] })]
		}, c.id)), customers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex items-center gap-1.5 rounded-2xl border border-dashed border-border px-4 py-2.5 text-[12px] font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground",
			children: ["View all ", customers.length]
		})]
	});
}
function PersonalityProfile({ customer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "AI Personality Profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand",
						children: "94% confidence"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthRing, {
							score: customer.health,
							size: 72,
							stroke: 6,
							color: "#E31B23"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 flex flex-col items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[16px] font-bold text-foreground",
								children: customer.health
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[8px] text-muted-foreground",
								children: "Health"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[13px] font-semibold text-foreground",
							children: customer.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10.5px] font-semibold text-brand",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-2.5 w-2.5" }), customer.segment]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 text-[10.5px] text-muted-foreground",
							children: customer.prediction
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5",
					children: customer.personality.traits.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitBar, {
						label: t.label,
						value: t.value,
						color: t.color
					}, t.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-secondary/60 p-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, {
							className: "h-3 w-3 text-brand",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10.5px] font-semibold text-foreground",
							children: "AI Summary"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11.5px] leading-relaxed text-muted-foreground",
						children: customer.personality.summary
					})]
				})
			]
		})]
	});
}
function CommunicationDNA({ customer }) {
	const channelIcons = {
		Email: Mail,
		SMS: MessageCircle,
		Phone
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, {
					className: "h-4 w-4 text-brand",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "Communication DNA"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [
					{
						label: "Preferred Channel",
						value: customer.communication.preferred
					},
					{
						label: "Response Time",
						value: customer.communication.responseTime
					},
					{
						label: "Best Time to Reach",
						value: customer.communication.bestTime
					},
					{
						label: "Email Open Rate",
						value: `${customer.communication.openRate}%`
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-secondary/50 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-medium text-muted-foreground",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[12px] font-semibold text-foreground",
						children: item.value
					})]
				}, item.label))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Channel Engagement"
				}), customer.communication.channels.map((ch) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-16 items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(channelIcons[ch.name] ?? MessageSquare, {
								className: "h-3 w-3 text-muted-foreground",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: ch.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitBar, {
							label: "",
							value: ch.rate,
							color: ch.color
						})]
					}, ch.name);
				})]
			})]
		})]
	});
}
function BuyingDNA({ customer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollarSign, {
					className: "h-4 w-4 text-brand",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "Buying DNA"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2.5",
					children: [
						{
							label: "Avg Spend",
							value: customer.buying.avgSpend
						},
						{
							label: "Frequency",
							value: customer.buying.frequency
						},
						{
							label: "Peak Season",
							value: customer.buying.peakSeason
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-secondary/50 p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium text-muted-foreground",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[11.5px] font-semibold text-foreground leading-tight",
							children: item.value
						})]
					}, item.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Purchase Triggers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: customer.buying.triggers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-lg bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand",
						children: t
					}, t))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl bg-secondary/60 p-3.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11.5px] leading-relaxed text-muted-foreground",
						children: customer.buying.pattern
					})
				})
			]
		})]
	});
}
function RelationshipHealth() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
					className: "h-4 w-4 text-brand",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "Relationship Health"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center justify-around gap-4 p-5",
			children: [
				{
					label: "Engagement",
					score: 87,
					color: "#E31B23"
				},
				{
					label: "Satisfaction",
					score: 92,
					color: "#10b981"
				},
				{
					label: "Loyalty",
					score: 78,
					color: "#3b82f6"
				},
				{
					label: "Advocacy",
					score: 71,
					color: "#f59e0b"
				},
				{
					label: "Growth",
					score: 65,
					color: "#8b5cf6"
				}
			].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthRing, {
						score: m.score,
						size: 64,
						stroke: 5,
						color: m.color
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[13px] font-bold text-foreground",
							children: m.score
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10.5px] font-medium text-muted-foreground",
					children: m.label
				})]
			}, m.label))
		})]
	});
}
function AICustomerSummary({ customer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl bg-foreground p-5 text-background shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/15 blur-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-background/15",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
					className: "h-4 w-4 text-background",
					strokeWidth: 1.75
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] font-semibold uppercase tracking-wider text-background/60",
						children: ["AI Summary — ", customer.name]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-brand/30 px-1.5 py-0.5 text-[9.5px] font-bold text-background",
						children: "LIVE"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[13px] leading-relaxed text-background/85",
					children: [
						customer.name,
						" is your ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-background",
							children: [customer.segment.toLowerCase(), " customer"]
						}),
						" with ",
						customer.jobs,
						" completed jobs and a total spend of ",
						customer.value,
						". Their relationship health score of ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-brand",
							children: [customer.health, "/100"]
						}),
						" indicates an exceptionally strong bond. ",
						customer.personality.summary
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded-lg bg-background/10 px-2.5 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
							className: "h-3 w-3 text-background/70",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-background/80",
							children: ["Next action: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-background",
								children: customer.nextAction
							})]
						})]
					})
				})
			] })]
		})]
	});
}
function TodaysPriorities({ customer }) {
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Today's Priorities"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white",
						children: customer.priorities.length
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border",
			children: customer.priorities.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 transition-colors hover:bg-secondary/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/10 text-[10px] font-bold text-brand",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12.5px] font-medium text-foreground",
							children: p.action
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-bold text-brand",
									children: [p.impact, " impact"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/40",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10.5px] text-muted-foreground",
									children: [p.confidence, "% confidence"]
								})
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setExpanded(expanded === i ? null : i),
						className: "shrink-0 flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
								className: "h-3 w-3",
								strokeWidth: 1.75
							}),
							"Explain Why",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3 w-3 transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}` })
						]
					})]
				}), expanded === i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 ml-7 rounded-xl bg-brand/5 border border-brand/15 p-3.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
							className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-brand",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-brand",
							children: "Why AI recommends this"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11.5px] leading-relaxed text-foreground/80",
							children: p.reason
						})] })]
					})
				})]
			}, i))
		})]
	});
}
function CustomerSegments() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "AI Customer Segments"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-muted-foreground",
						children: "Auto-updated daily"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-5 space-y-3",
			children: segments.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group flex items-center gap-3 rounded-xl border border-border p-3.5 transition-all hover:border-foreground/15 hover:bg-secondary/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-8 w-8 shrink-0 rounded-lg",
						style: { backgroundColor: `${s.color}18` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-full items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2.5 w-2.5 rounded-full",
								style: { backgroundColor: s.color }
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12.5px] font-semibold text-foreground",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] font-bold",
								style: { color: s.color },
								children: s.value
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground",
									children: [s.count, " customers"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/30",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10.5px] text-muted-foreground",
									children: s.description
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-muted-foreground" })
				]
			}, s.name))
		})]
	});
}
function CustomerPredictions() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
					className: "h-4 w-4 text-brand",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "AI Predictions"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border",
			children: predictions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-secondary/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `grid h-7 w-7 shrink-0 place-items-center rounded-xl ${p.type === "warning" ? "bg-amber-50 text-amber-500" : "bg-brand/10 text-brand"}`,
						children: p.type === "warning" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
							className: "h-3.5 w-3.5",
							strokeWidth: 1.75
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
							className: "h-3.5 w-3.5",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[12px] font-semibold text-foreground",
								children: p.customer
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[11px] text-muted-foreground",
								children: p.prediction
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1 flex-1 overflow-hidden rounded-full bg-secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-brand transition-all duration-700",
										style: { width: `${p.probability}%` }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-semibold text-brand",
									children: [p.probability, "%"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground transition-all hover:border-foreground/20 hover:bg-foreground hover:text-background",
						children: p.action
					})
				]
			}, p.customer))
		})]
	});
}
function CustomerTimeline({ customer }) {
	const typeColors = {
		booking: "bg-brand/10 text-brand",
		review: "bg-emerald-50 text-emerald-600",
		purchase: "bg-blue-50 text-blue-600",
		referral: "bg-purple-50 text-purple-600"
	};
	const typeIcons = {
		booking: Calendar,
		review: Star,
		purchase: CircleDollarSign,
		referral: Gift
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Relationship Timeline"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto text-[11px] text-muted-foreground",
						children: customer.name
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border",
			children: customer.timeline.map((item, idx) => {
				const Icon = typeIcons[item.type] ?? Calendar;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${typeColors[item.type] ?? "bg-secondary text-muted-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "h-3.5 w-3.5",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[12px] font-medium text-foreground",
								children: item.event
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[10.5px] text-muted-foreground",
								children: item.date
							})]
						}),
						item.amount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-[12px] font-bold text-brand",
							children: item.amount
						})
					]
				}, idx);
			})
		})]
	});
}
function RevenueOpportunities({ customer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
					className: "h-4 w-4 text-brand",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "Revenue Opportunities"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border",
			children: customer.opportunities.map((opp, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-secondary/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-[12px] font-bold text-brand",
						children: i + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[12.5px] font-semibold text-foreground",
								children: opp.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11.5px] font-bold text-brand",
										children: opp.value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground/30",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10.5px] text-muted-foreground",
										children: opp.urgency
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1 w-20 overflow-hidden rounded-full bg-secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-brand",
										style: { width: `${opp.probability}%` }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground",
									children: [opp.probability, "% probability"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-foreground/20 hover:bg-foreground hover:text-background",
						children: "Act Now"
					})
				]
			}, i))
		})]
	});
}
function CampaignConnection({ customer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
					className: "h-4 w-4 text-brand",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "Campaign Connection"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 space-y-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] text-muted-foreground mb-1",
					children: [customer.name, " is enrolled in:"]
				}),
				customer.campaigns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-7 w-7 place-items-center rounded-lg bg-brand/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
								className: "h-3.5 w-3.5 text-brand",
								strokeWidth: 1.75
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12.5px] font-medium text-foreground flex-1",
							children: c
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold text-brand",
							children: "Active"
						})
					]
				}, c)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-[11.5px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground",
					children: "+ Add to Campaign"
				})
			]
		})]
	});
}
function AIMemory({ customer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "AI Memory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto text-[10.5px] text-muted-foreground",
						children: ["What your AI remembers about ", customer.name.split(" ")[0]]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2.5",
				children: customer.memory.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-2.5 rounded-xl bg-secondary/50 px-3.5 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, {
						className: "mt-0.5 h-3 w-3 shrink-0 text-brand",
						strokeWidth: 1.75
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[12px] text-foreground",
						children: item
					})]
				}, i))
			})
		})]
	});
}
function RelationshipAnalytics() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBar, {
					className: "h-4 w-4 text-brand",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13.5px] font-semibold tracking-tight text-foreground",
					children: "Relationship Analytics"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 p-5",
			children: [
				{
					label: "Avg. Days Between Visits",
					value: "18",
					change: "-2 days",
					up: true
				},
				{
					label: "Re-activation Success Rate",
					value: "64%",
					change: "+11%",
					up: true
				},
				{
					label: "Upsell Conversion Rate",
					value: "38%",
					change: "+7%",
					up: true
				},
				{
					label: "Referral Conversion Rate",
					value: "52%",
					change: "+4%",
					up: true
				}
			].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-secondary/50 p-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10.5px] font-medium text-muted-foreground",
						children: m.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-[20px] font-bold tracking-tight text-foreground",
						children: m.value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-0.5 flex items-center gap-1 text-[10.5px] font-semibold ${m.up ? "text-brand" : "text-destructive"}`,
						children: [
							m.up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
								className: "h-2.5 w-2.5",
								strokeWidth: 2
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, {
								className: "h-2.5 w-2.5",
								strokeWidth: 2
							}),
							m.change,
							" vs last month"
						]
					})
				]
			}, m.label))
		})]
	});
}
function RelationshipImpact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-5 py-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13.5px] font-semibold tracking-tight text-foreground",
						children: "Relationship Impact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600",
						children: "This Year"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 p-5",
			children: [
				{
					label: "Revenue from repeat customers",
					value: 58400,
					prefix: "£",
					description: "76% of total revenue"
				},
				{
					label: "Revenue from referrals",
					value: 14200,
					prefix: "£",
					description: "From 11 referred customers"
				},
				{
					label: "Churn prevented (est.)",
					value: 9800,
					prefix: "£",
					description: "AI re-activation campaigns"
				},
				{
					label: "Upsell revenue captured",
					value: 7600,
					prefix: "£",
					description: "28 successful upsells"
				}
			].map((imp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10.5px] font-medium text-muted-foreground",
						children: imp.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 text-[18px] font-bold text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, {
							value: imp.value,
							prefix: imp.prefix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[10.5px] text-brand font-medium",
						children: imp.description
					})
				]
			}, imp.label))
		})]
	});
}
function BusinessDNAPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl border border-dashed border-brand/30 bg-gradient-to-r from-brand/5 to-transparent p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/10 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-4 w-4 text-brand",
						strokeWidth: 1.75
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-semibold uppercase tracking-wider text-brand",
						children: "Coming Soon"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-[16px] font-bold tracking-tight text-foreground",
					children: "Business DNA™"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-md text-[12px] leading-relaxed text-muted-foreground",
					children: "AI-powered analysis of your entire business — combining Relationship DNA™, Campaign performance, financial patterns, and market trends into one unified intelligence profile."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "shrink-0 rounded-xl border border-brand/30 bg-card px-4 py-2.5 text-[12px] font-semibold text-brand transition-all hover:border-brand hover:bg-brand/5",
				children: "Join Waitlist"
			})]
		})]
	});
}
function RelationshipDNA({ onAddCustomer }) {
	const { customers: rawCustomers, loading, error } = useCustomers();
	const customers = rawCustomers.map(adaptCustomer);
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (customers.length > 0 && !selectedId) setSelectedId(customers[0].id);
	}, [customers, selectedId]);
	const customer = customers.find((c) => c.id === selectedId) ?? customers[0];
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-2xl bg-secondary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
				children: [
					1,
					2,
					3,
					4,
					5,
					6
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-secondary" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerSelectorSkeleton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-secondary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSkeleton, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSkeleton, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSkeleton, {})
				]
			})
		]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
				className: "mb-3 h-8 w-8 text-red-400",
				strokeWidth: 1.75
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[14px] font-semibold text-red-700",
				children: "Failed to load customers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[12.5px] text-red-600",
				children: error
			})
		]
	});
	if (customers.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { onAdd: onAddCustomer ?? (() => {}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelationshipDNAHero, {
				total: rawCustomers.length,
				active: rawCustomers.filter((c) => c.status === "active").length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerKPIs, { customers }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[13px] font-semibold text-foreground",
					children: "View Customer Profile"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex items-center gap-1 text-[11.5px] font-semibold text-brand transition-all hover:gap-1.5",
					children: ["View all customers ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerSelector, {
				customers,
				selected: selectedId ?? "",
				onSelect: setSelectedId
			})] }),
			customer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AICustomerSummary, { customer }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonalityProfile, { customer }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunicationDNA, { customer }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyingDNA, { customer })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelationshipHealth, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodaysPriorities, { customer }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerTimeline, { customer })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevenueOpportunities, { customer }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignConnection, { customer })]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerSegments, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerPredictions, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelationshipAnalytics, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelationshipImpact, {})]
			}),
			customer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIMemory, { customer }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessDNAPreview, {})
		]
	});
}
var SOURCES = [
	"Referral",
	"Organic",
	"Social media",
	"Google Ads",
	"Walk-in",
	"Event",
	"Other"
];
var TYPES = [{
	value: "individual",
	label: "Individual"
}, {
	value: "business",
	label: "Business"
}];
var CONTACT_METHODS = [
	{
		value: "email",
		label: "Email"
	},
	{
		value: "sms",
		label: "SMS"
	},
	{
		value: "phone",
		label: "Phone"
	}
];
function Label({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1.5 block text-[12px] font-medium text-muted-foreground",
		children
	});
}
function Input({ className = "", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: `h-[38px] w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-2 focus:ring-foreground/5 ${className}`
	});
}
function Select({ className = "", children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		...props,
		className: `h-[38px] w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-2 focus:ring-foreground/5 ${className}`,
		children
	});
}
function CustomerForm({ open, onClose, onSave, initial, saving }) {
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [companyName, setCompanyName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [customerType, setCustomerType] = (0, import_react.useState)("individual");
	const [source, setSource] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [postcode, setPostcode] = (0, import_react.useState)("");
	const [preferredContact, setPreferredContact] = (0, import_react.useState)("email");
	const [tagInput, setTagInput] = (0, import_react.useState)("");
	const [tags, setTags] = (0, import_react.useState)([]);
	const [notes, setNotes] = (0, import_react.useState)("");
	const [marketingConsent, setMarketingConsent] = (0, import_react.useState)(false);
	const [gdprConsent, setGdprConsent] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (initial) {
			setFirstName(initial.first_name ?? "");
			setLastName(initial.last_name ?? "");
			setCompanyName(initial.company_name ?? "");
			setEmail(initial.email ?? "");
			setPhone(initial.phone ?? "");
			setCustomerType(initial.customer_type);
			setSource(initial.source ?? "");
			setCity(initial.city ?? "");
			setPostcode(initial.postcode ?? "");
			setPreferredContact(initial.preferred_contact_method ?? "email");
			setTags(initial.tags ?? []);
			setNotes(initial.notes ?? "");
			setMarketingConsent(initial.marketing_consent);
			setGdprConsent(initial.gdpr_consent);
		} else {
			setFirstName("");
			setLastName("");
			setCompanyName("");
			setEmail("");
			setPhone("");
			setCustomerType("individual");
			setSource("");
			setCity("");
			setPostcode("");
			setPreferredContact("email");
			setTags([]);
			setNotes("");
			setMarketingConsent(false);
			setGdprConsent(false);
		}
		setError(null);
	}, [initial, open]);
	const addTag = () => {
		const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
		if (t && !tags.includes(t)) setTags([...tags, t]);
		setTagInput("");
	};
	const handleTagKeyDown = (e) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag();
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!firstName.trim() && !companyName.trim()) {
			setError("Please enter a first name or company name.");
			return;
		}
		setError(null);
		const fullName = customerType === "business" && companyName ? companyName : [firstName, lastName].filter(Boolean).join(" ");
		await onSave({
			first_name: firstName || null,
			last_name: lastName || null,
			full_name: fullName || null,
			company_name: companyName || null,
			email: email || null,
			phone: phone || null,
			customer_type: customerType,
			source: source || null,
			city: city || null,
			postcode: postcode || null,
			preferred_contact_method: preferredContact,
			tags,
			notes: notes || null,
			marketing_consent: marketingConsent,
			gdpr_consent: gdprConsent
		});
	};
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-foreground/30 backdrop-blur-sm",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-border px-5 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-8 w-8 place-items-center rounded-xl bg-brand/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
							className: "h-4 w-4 text-brand",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[14px] font-semibold text-foreground",
						children: initial ? "Edit Customer" : "Add New Customer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11.5px] text-muted-foreground",
						children: initial ? "Update customer details" : "Create a new customer record"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "ml-auto grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "h-4 w-4",
							strokeWidth: 1.75
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "max-h-[calc(100vh-160px)] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Customer Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex rounded-xl border border-border bg-secondary/50 p-1 gap-1",
							children: TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setCustomerType(t.value),
								className: `flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12.5px] font-medium transition-all duration-150 ${customerType === t.value ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`,
								children: [t.value === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
									className: "h-3 w-3",
									strokeWidth: 1.75
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
									className: "h-3 w-3",
									strokeWidth: 1.75
								}), t.label]
							}, t.value))
						})] }),
						customerType === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Company Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: companyName,
							onChange: (e) => setCompanyName(e.target.value),
							placeholder: "Evans & Co."
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "First Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: firstName,
								onChange: (e) => setFirstName(e.target.value),
								placeholder: "Sarah"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Last Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: lastName,
								onChange: (e) => setLastName(e.target.value),
								placeholder: "Johnson"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
									className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60",
									strokeWidth: 1.75
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "sarah@example.com",
									className: "pl-9"
								})]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
									className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60",
									strokeWidth: 1.75
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "tel",
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									placeholder: "07700 900123",
									className: "pl-9"
								})]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
									className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60",
									strokeWidth: 1.75
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: city,
									onChange: (e) => setCity(e.target.value),
									placeholder: "London",
									className: "pl-9"
								})]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Postcode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: postcode,
								onChange: (e) => setPostcode(e.target.value),
								placeholder: "SW1A 1AA"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Source" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: source,
								onChange: (e) => setSource(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select source..."
								}), SOURCES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s.toLowerCase(),
									children: s
								}, s))]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Preferred Contact" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: preferredContact,
								onChange: (e) => setPreferredContact(e.target.value),
								children: CONTACT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m.value,
									children: m.label
								}, m.value))
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tags" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-secondary/30 p-2",
							children: [tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 flex flex-wrap gap-1.5",
								children: tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 rounded-lg bg-brand/10 px-2 py-0.5 text-[11.5px] font-medium text-brand",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
											className: "h-2.5 w-2.5",
											strokeWidth: 1.75
										}),
										tag,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setTags(tags.filter((t) => t !== tag)),
											className: "ml-0.5 text-brand/60 hover:text-brand",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
												className: "h-2.5 w-2.5",
												strokeWidth: 2
											})
										})
									]
								}, tag))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: tagInput,
								onChange: (e) => setTagInput(e.target.value),
								onKeyDown: handleTagKeyDown,
								onBlur: addTag,
								placeholder: "Type a tag and press Enter...",
								className: "w-full bg-transparent text-[12.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							rows: 3,
							placeholder: "Any important notes about this customer...",
							className: "w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-2 focus:ring-foreground/5 resize-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 rounded-xl border border-border bg-secondary/20 p-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Consent & Privacy"
							}), [{
								id: "gdpr",
								label: "GDPR consent given",
								value: gdprConsent,
								onChange: setGdprConsent
							}, {
								id: "marketing",
								label: "Marketing communications consent",
								value: marketingConsent,
								onChange: setMarketingConsent
							}].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									onClick: () => item.onChange(!item.value),
									className: `flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${item.value ? "border-brand bg-brand" : "border-border bg-card"}`,
									children: item.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
										className: "h-2.5 w-2.5 text-white",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 3,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 13l4 4L19 7" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[12.5px] text-foreground",
									children: item.label
								})]
							}, item.id))]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-700",
							children: error
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-2.5 border-t border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "h-[38px] rounded-xl border border-border bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: saving,
						className: "flex h-[38px] items-center gap-2 rounded-xl bg-brand px-5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-85 disabled:opacity-60",
						children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
							className: "h-3.5 w-3.5",
							strokeWidth: 1.75
						}), initial ? "Save Changes" : "Add Customer"]
					})]
				})]
			})]
		})]
	});
}
function RelationshipsPage() {
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const { create, creating } = useCreateCustomer();
	const { refresh } = useCustomers();
	const handleSave = async (data) => {
		if (await create(data)) {
			setFormOpen(false);
			refresh();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Relationships",
			description: "AI-powered customer intelligence — understand who deserves attention, who's ready to spend, and who's going quiet.",
			crumbs: [{ label: "Relationships" }],
			action: {
				label: "Add Customer",
				icon: Users,
				onClick: () => setFormOpen(true)
			},
			secondaryAction: { label: "Sync Data" }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelationshipDNA, { onAddCustomer: () => setFormOpen(true) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerForm, {
			open: formOpen,
			onClose: () => setFormOpen(false),
			onSave: handleSave,
			saving: creating
		})
	] });
}
//#endregion
export { RelationshipsPage as component };
