import { supabase } from "@/lib/supabase";

const db = supabase as unknown as { from: (table: string) => any };

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

export async function fetchUsers(params: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ users: AdminUserSummary[]; total: number }> {
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = db.from("profiles").select("*", { count: "exact" });

  if (params.search) {
    query = query.or(`full_name.ilike.%${params.search}%,first_name.ilike.%${params.search}%`);
  }
  if (params.status && params.status !== "all") {
    query = query.eq("is_active", params.status === "active");
  }

  query = query.order("created_at", { ascending: false }).range(from, to);
  const { data, error, count } = await query;
  if (error) throw error;

  const profiles = data || [];
  const userIds = profiles.map((p: any) => p.id);

  if (userIds.length === 0) return { users: [], total: count || 0 };

  const membershipsRes = await db.from("memberships").select("user_id, business_id, role, status, joined_at").in("user_id", userIds);

  const membershipMap = (membershipsRes.data || []).reduce((acc: Record<string, any>, m: any) => {
    if (!acc[m.user_id]) acc[m.user_id] = m;
    return acc;
  }, {});

  const businessIds = Object.values(membershipMap).map((m: any) => m.business_id).filter(Boolean);
  const businessesRes = businessIds.length > 0
    ? await db.from("businesses").select("id, name, subscription_plan").in("id", businessIds)
    : { data: [] };

  const businessMap = (businessesRes.data || []).reduce((acc: Record<string, any>, b: any) => {
    acc[b.id] = b;
    return acc;
  }, {});

  const users: AdminUserSummary[] = profiles.map((p: any) => {
    const membership = membershipMap[p.id];
    const business = membership ? businessMap[membership.business_id] : null;
    return {
      id: p.id,
      email: null,
      full_name: p.full_name,
      is_active: p.is_active,
      role: membership?.role || null,
      business_id: membership?.business_id || null,
      business_name: business?.name || null,
      subscription_plan: business?.subscription_plan || null,
      last_login: p.last_login || null,
      created_at: p.created_at,
    };
  });

  if (params.role && params.role !== "all") {
    return {
      users: users.filter((u) => u.role === params.role),
      total: users.filter((u) => u.role === params.role).length,
    };
  }

  return { users, total: count || 0 };
}

export async function fetchUserDetail(userId: string): Promise<AdminUserDetail | null> {
  const { data: profile, error } = await db.from("profiles").select("*").eq("id", userId)
    .maybeSingle();
  if (error || !profile) return null;

  const membershipRes = await db.from("memberships").select("business_id, role, status, joined_at").eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  let business = null;
  if (membershipRes.data?.business_id) {
    const bizRes = await db.from("businesses").select("id, name, subscription_plan").eq("id", membershipRes.data.business_id)
      .maybeSingle();
    business = bizRes.data;
  }

  return {
    id: profile.id,
    email: null,
    full_name: profile.full_name,
    first_name: profile.first_name,
    last_name: profile.last_name,
    avatar_url: profile.avatar_url,
    phone: profile.phone,
    job_title: profile.job_title,
    is_active: profile.is_active,
    role: membershipRes.data?.role || null,
    business_id: membershipRes.data?.business_id || null,
    business_name: business?.name || null,
    subscription_plan: business?.subscription_plan || null,
    last_login: profile.last_login || null,
    created_at: profile.created_at,
    membership_status: membershipRes.data?.status || null,
    joined_at: membershipRes.data?.joined_at || null,
  };
}
