import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthContext-BeiOlUYy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var supabase = createClient("https://kaoyfnssycfmlayrmhfe.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthb3lmbnNzeWNmbWxheXJtaGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDA0NDcsImV4cCI6MjA5OTE3NjQ0N30.S0yW--whGPJKYor6DseY0LMqBG477uZFgR2TsF9A9hA");
async function getProfile(userId) {
	const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
	if (error) throw error;
	return data;
}
async function updateProfile(userId, updates) {
	const { data, error } = await supabase.from("profiles").update({
		...updates,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", userId).select().single();
	if (error) throw error;
	return data;
}
async function getPrimaryMembership(userId) {
	const { data, error } = await supabase.from("memberships").select("*").eq("user_id", userId).eq("status", "active").order("joined_at", { ascending: true }).limit(1).maybeSingle();
	if (error) throw error;
	return data;
}
async function getBusiness(businessId) {
	const { data, error } = await supabase.from("businesses").select("*").eq("id", businessId).maybeSingle();
	if (error) throw error;
	return data;
}
async function updateBusiness(businessId, updates) {
	const { data, error } = await supabase.from("businesses").update({
		...updates,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", businessId).select().single();
	if (error) throw error;
	return data;
}
async function getBusinessSettings(businessId) {
	const { data, error } = await supabase.from("settings").select("*").eq("business_id", businessId).maybeSingle();
	if (error) throw error;
	return data;
}
async function updateBusinessSettings(businessId, updates) {
	const { data, error } = await supabase.from("settings").update({
		...updates,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("business_id", businessId).select().single();
	if (error) throw error;
	return data;
}
var AuthContext = (0, import_react.createContext)(null);
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [membership, setMembership] = (0, import_react.useState)(null);
	const [business, setBusiness] = (0, import_react.useState)(null);
	const [settings, setSettings] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const loadUserData = async (userId) => {
		try {
			const [prof, mem] = await Promise.all([getProfile(userId), getPrimaryMembership(userId)]);
			setProfile(prof);
			setMembership(mem);
			if (mem?.business_id) {
				const [biz, bizSettings] = await Promise.all([getBusiness(mem.business_id), getBusinessSettings(mem.business_id)]);
				setBusiness(biz);
				setSettings(bizSettings);
			}
		} catch (err) {
			console.error("Failed to load user data:", err);
		}
	};
	const refreshProfile = async () => {
		if (user) {
			const prof = await getProfile(user.id);
			setProfile(prof);
		}
	};
	const refreshBusiness = async () => {
		if (membership?.business_id) {
			const biz = await getBusiness(membership.business_id);
			setBusiness(biz);
		}
	};
	const refreshSettings = async () => {
		if (membership?.business_id) {
			const s = await getBusinessSettings(membership.business_id);
			setSettings(s);
		}
	};
	(0, import_react.useEffect)(() => {
		let mounted = true;
		supabase.auth.getSession().then(async ({ data: { session: s } }) => {
			if (!mounted) return;
			setSession(s);
			setUser(s?.user ?? null);
			if (s?.user) await loadUserData(s.user.id);
			if (mounted) setLoading(false);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
			setSession(s);
			setUser(s?.user ?? null);
			if (s?.user) (async () => {
				await loadUserData(s.user.id);
			})();
			else {
				setProfile(null);
				setMembership(null);
				setBusiness(null);
				setSettings(null);
			}
		});
		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			session,
			user,
			profile,
			membership,
			business,
			settings,
			loading,
			refreshProfile,
			refreshBusiness,
			refreshSettings
		},
		children
	});
}
function useAuthContext() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
	return ctx;
}
//#endregion
export { updateProfile as a, updateBusinessSettings as i, supabase as n, useAuthContext as o, updateBusiness as r, AuthProvider as t };
