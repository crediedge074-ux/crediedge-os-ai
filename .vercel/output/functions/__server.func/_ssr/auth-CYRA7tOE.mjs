import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as supabase } from "./AuthContext-BeiOlUYy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CYRA7tOE.js
var import_jsx_runtime = require_jsx_runtime();
var crediedge_logo_png_asset_default = {
	version: 1,
	asset_id: "90793973-eff5-42c2-872f-b1661d34b5b8",
	project_id: "06f326fe-8fe7-41df-a80e-c4c4de03fecf",
	url: "/__l5e/assets-v1/90793973-eff5-42c2-872f-b1661d34b5b8/crediedge-logo.png",
	r2_key: "a/v1/06f326fe-8fe7-41df-a80e-c4c4de03fecf/90793973-eff5-42c2-872f-b1661d34b5b8/crediedge-logo.png",
	original_filename: "crediedge-logo.png",
	size: 55358,
	content_type: "image/png",
	created_at: "2026-07-09T08:24:21Z"
};
function Logo({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center gap-2 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: crediedge_logo_png_asset_default.url,
			alt: "CrediEdge",
			className: "h-9 w-auto shrink-0 object-contain"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "rounded-md bg-foreground px-1.5 py-0.5 text-[9.5px] font-bold tracking-wider text-background",
			children: "OS"
		})]
	});
}
async function signIn(email, password) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});
	if (error) throw error;
	return data;
}
async function signUp(email, password, fullName) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: { data: { full_name: fullName } }
	});
	if (error) throw error;
	return data;
}
async function signOut() {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}
//#endregion
export { signUp as i, signIn as n, signOut as r, Logo as t };
