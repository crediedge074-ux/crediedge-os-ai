import { supabase } from "@/lib/supabase";
import { listAuthUsers, type AuthUser } from "./adminAuth";

const db = supabase as unknown as { from: (table: string) => any };

interface ProfileRow {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  job_title: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

interface MembershipRow {
  user_id: string;
  business_id: string;
  role: string;
  status: string;
  joined_at: string;
}

interface BusinessRow {
  id: string;
  name: string;
  subscription_plan: string | null;
}

export interface AdminUserSummary {
  id: string;
  email: string | null;
  full_name: string | null;
  is_active: boolean;
  role: string | null;
  business_id: string | null;
  business_name: string | null;
  subscription_plan: string | null;
  last_login: string | null;
  created_at: string;
}

export interface AdminUserDetail extends AdminUserSummary {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  job_title: string | null;
  membership_status: string | null;
  joined_at: string | null;
}

function isBanned(user: AuthUser): boolean {
  return Boolean(user.banned_until && new Date(user.banned_until).getTime() > Date.now());
}

function authFullName(user: AuthUser): string | null {
  const name = user.raw_user_meta_data?.full_name;
  return typeof name === "string" && name.trim() ? name.trim() : null;
}

export async function fetchUsers(params: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ users: AdminUserSummary[]; total: number }> {
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const authResult = await listAuthUsers(1, 1000);
  if (authResult.error) throw new Error(authResult.error);

  const authUsers = authResult.users;
  const userIds = authUsers.map((user) => user.id);
  const profilesRes = userIds.length > 0
    ? await db.from("profiles").select("id, full_name, first_name, last_name, avatar_url, phone, job_title, is_active, last_login, created_at").in("id", userIds)
    : { data: [], error: null };
  if (profilesRes.error) throw profilesRes.error;

  const membershipsRes = userIds.length > 0
    ? await db.from("memberships").select("user_id, business_id, role, status, joined_at").in("user_id", userIds).order("created_at", { ascending: true })
    : { data: [], error: null };
  if (membershipsRes.error) throw membershipsRes.error;

  const profiles = (profilesRes.data || []) as ProfileRow[];
  const memberships = (membershipsRes.data || []) as MembershipRow[];
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
  const membershipMap = new Map<string, MembershipRow>();
  for (const membership of memberships) {
    if (!membershipMap.has(membership.user_id)) membershipMap.set(membership.user_id, membership);
  }

  const businessIds = [...new Set(memberships.map((membership) => membership.business_id))];
  const businessesRes = businessIds.length > 0
    ? await db.from("businesses").select("id, name, subscription_plan").in("id", businessIds)
    : { data: [], error: null };
  if (businessesRes.error) throw businessesRes.error;
  const businessMap = new Map((businessesRes.data as BusinessRow[] || []).map((business) => [business.id, business]));

  const search = params.search?.trim().toLowerCase();
  const users = authUsers
    .map((authUser): AdminUserSummary => {
      const profile = profileMap.get(authUser.id);
      const membership = membershipMap.get(authUser.id);
      const business = membership ? businessMap.get(membership.business_id) : undefined;
      return {
        id: authUser.id,
        email: authUser.email,
        full_name: profile?.full_name || authFullName(authUser),
        is_active: (profile?.is_active ?? true) && !isBanned(authUser),
        role: membership?.role || null,
        business_id: membership?.business_id || null,
        business_name: business?.name || null,
        subscription_plan: business?.subscription_plan || null,
        last_login: authUser.last_sign_in_at || profile?.last_login || null,
        created_at: authUser.created_at || profile?.created_at || "",
      };
    })
    .filter((user) => {
      if (search && ![user.email, user.full_name, user.business_name].some((value) => value?.toLowerCase().includes(search))) return false;
      if (params.role && params.role !== "all" && user.role !== params.role) return false;
      if (params.status && params.status !== "all" && (params.status === "active") !== user.is_active) return false;
      return true;
    });

  const from = (page - 1) * pageSize;
  return { users: users.slice(from, from + pageSize), total: users.length };
}

export async function fetchUserDetail(userId: string): Promise<AdminUserDetail | null> {
  const authResult = await listAuthUsers(1, 1000);
  if (authResult.error) throw new Error(authResult.error);
  const authUser = authResult.users.find((user) => user.id === userId);
  if (!authUser) return null;

  const { data: profile, error: profileError } = await db.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (profileError) throw profileError;
  const { data: membership, error: membershipError } = await db.from("memberships").select("business_id, role, status, joined_at").eq("user_id", userId).order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (membershipError) throw membershipError;

  let business: BusinessRow | null = null;
  if (membership?.business_id) {
    const { data, error } = await db.from("businesses").select("id, name, subscription_plan").eq("id", membership.business_id).maybeSingle();
    if (error) throw error;
    business = data as BusinessRow | null;
  }

  return {
    id: userId,
    email: authUser.email,
    full_name: profile?.full_name || authFullName(authUser),
    is_active: (profile?.is_active ?? true) && !isBanned(authUser),
    role: membership?.role || null,
    business_id: membership?.business_id || null,
    business_name: business?.name || null,
    subscription_plan: business?.subscription_plan || null,
    last_login: authUser.last_sign_in_at || profile?.last_login || null,
    created_at: authUser.created_at || profile?.created_at || "",
    first_name: profile?.first_name || null,
    last_name: profile?.last_name || null,
    avatar_url: profile?.avatar_url || null,
    phone: profile?.phone || null,
    job_title: profile?.job_title || null,
    membership_status: membership?.status || null,
    joined_at: membership?.joined_at || null,
  };
}
