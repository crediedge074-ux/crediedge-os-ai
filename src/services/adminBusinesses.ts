import { supabase } from "@/lib/supabase";
import { logAdminEvent } from "./adminAccess";

const db = supabase as unknown as { from: (table: string) => any };

export interface AdminBusinessSummary {
  id: string;
  name: string;
  slug: string | null;
  industry: string | null;
  status: string;
  subscription_plan: string | null;
  subscription_status: string | null;
  is_active: boolean;
  created_at: string;
  owner_email: string | null;
  owner_name: string | null;
  member_count: number;
  ai_credits_used: number;
  ai_credits_allowance: number;
}

export interface AdminBusinessDetail extends AdminBusinessSummary {
  email: string | null;
  phone: string | null;
  website: string | null;
  timezone: string | null;
  currency: string | null;
  trial_ends_at: string | null;
  updated_at: string;
  members: Array<{
    id: string;
    user_id: string;
    role: string;
    status: string;
    joined_at: string;
    email: string | null;
    full_name: string | null;
  }>;
}

export interface PlatformOverviewMetrics {
  totalBusinesses: number;
  activeBusinesses: number;
  enterpriseBusinesses: number;
  totalUsers: number;
  activeUsers: number;
  aiCreditsUsed: number;
  aiCreditsRemaining: number;
  openEnterpriseLeads: number;
  recentSignups: Array<{ id: string; name: string; created_at: string }>;
}

export async function fetchPlatformOverview(): Promise<PlatformOverviewMetrics> {
  const [businessesRes, membersRes, profilesRes, leadsRes, allowancesRes, usageRes] = await Promise.all([
    db.from("businesses").select("id, name, status, subscription_plan, is_active, created_at"),
    db.from("memberships").select("id, user_id, status, business_id"),
    db.from("profiles").select("id, is_active, full_name"),
    db.from("enterprise_leads").select("id, status").eq("status", "open"),
    db.from("ai_credit_allowances").select("monthly_credit_allowance, is_active"),
    db.from("ai_usage_logs").select("credits_consumed"),
  ]);

  const businesses = businessesRes.data || [];
  const memberships = membersRes.data || [];
  const profiles = profilesRes.data || [];
  const leads = leadsRes.data || [];
  const allowances = allowancesRes.data || [];
  const usage = usageRes.data || [];

  const activeBusinesses = businesses.filter((b: any) => b.is_active && b.status === "active").length;
  const enterpriseBusinesses = businesses.filter(
    (b: any) => (b.subscription_plan || "").toLowerCase() === "enterprise"
  ).length;
  const activeUsers = profiles.filter((p: any) => p.is_active).length;
  const aiCreditsUsed = usage.reduce((sum: number, u: any) => sum + (u.credits_consumed || 0), 0);
  const aiCreditsRemaining = allowances.reduce((sum: number, a: any) => sum + (a.is_active ? a.monthly_credit_allowance : 0), 0) - aiCreditsUsed;
  const recentSignups = [...businesses]
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map((b: any) => ({ id: b.id, name: b.name, created_at: b.created_at }));

  return {
    totalBusinesses: businesses.length,
    activeBusinesses,
    enterpriseBusinesses,
    totalUsers: profiles.length,
    activeUsers,
    aiCreditsUsed,
    aiCreditsRemaining: Math.max(0, aiCreditsRemaining),
    openEnterpriseLeads: leads.length,
    recentSignups,
  };
}

export async function fetchBusinesses(params: {
  search?: string;
  status?: string;
  plan?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ businesses: AdminBusinessSummary[]; total: number }> {
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = db.from("businesses").select("*", { count: "exact" });

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,slug.ilike.%${params.search}%`);
  }
  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }
  if (params.plan && params.plan !== "all") {
    query = query.eq("subscription_plan", params.plan);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);
  const { data, error, count } = await query;
  if (error) throw error;

  const businesses = data || [];
  const businessIds = businesses.map((b: any) => b.id);

  if (businessIds.length === 0) return { businesses: [], total: count || 0 };

  const [membersRes, allowancesRes, usageRes] = await Promise.all([
    db.from("memberships").select("business_id, user_id, role").in("business_id", businessIds),
    db.from("ai_credit_allowances").select("business_id, monthly_credit_allowance").in("business_id", businessIds),
    db.from("ai_usage_logs").select("business_id, credits_consumed").in("business_id", businessIds),
  ]);

  const memberCounts = (membersRes.data || []).reduce((acc: Record<string, number>, m: any) => {
    acc[m.business_id] = (acc[m.business_id] || 0) + 1;
    return acc;
  }, {});

  const ownerUserIds = (membersRes.data || []).filter((m: any) => m.role === "owner").map((m: any) => m.user_id);
  const profilesRes = ownerUserIds.length > 0
    ? await db.from("profiles").select("id, full_name").in("id", ownerUserIds)
    : { data: [] };

  const ownerMap = (profilesRes.data || []).reduce((acc: Record<string, any>, p: any) => {
    acc[p.id] = p;
    return acc;
  }, {});

  const ownerByBusiness = (membersRes.data || []).reduce((acc: Record<string, string>, m: any) => {
    if (m.role === "owner") acc[m.business_id] = m.user_id;
    return acc;
  }, {});

  const allowanceMap = (allowancesRes.data || []).reduce((acc: Record<string, number>, a: any) => {
    acc[a.business_id] = a.monthly_credit_allowance;
    return acc;
  }, {});

  const usageMap = (usageRes.data || []).reduce((acc: Record<string, number>, u: any) => {
    acc[u.business_id] = (acc[u.business_id] || 0) + (u.credits_consumed || 0);
    return acc;
  }, {});

  const summaries: AdminBusinessSummary[] = businesses.map((b: any) => {
    const ownerUserId = ownerByBusiness[b.id];
    const ownerProfile = ownerUserId ? ownerMap[ownerUserId] : null;
    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      industry: b.industry,
      status: b.status,
      subscription_plan: b.subscription_plan,
      subscription_status: b.subscription_status,
      is_active: b.is_active,
      created_at: b.created_at,
      owner_email: null,
      owner_name: ownerProfile?.full_name || null,
      member_count: memberCounts[b.id] || 0,
      ai_credits_used: usageMap[b.id] || 0,
      ai_credits_allowance: allowanceMap[b.id] || 0,
    };
  });

  return { businesses: summaries, total: count || 0 };
}

export async function fetchBusinessDetail(businessId: string): Promise<AdminBusinessDetail | null> {
  const { data: business, error } = await db.from("businesses").select("*").eq("id", businessId)
    .maybeSingle();
  if (error || !business) return null;

  const [membersRes, allowancesRes, usageRes] = await Promise.all([
    db.from("memberships").select("id, user_id, role, status, joined_at").eq("business_id", businessId),
    db.from("ai_credit_allowances").select("monthly_credit_allowance").eq("business_id", businessId).maybeSingle(),
    db.from("ai_usage_logs").select("credits_consumed").eq("business_id", businessId),
  ]);

  const memberUserIds = (membersRes.data || []).map((m: any) => m.user_id);
  const profilesRes = memberUserIds.length > 0
    ? await db.from("profiles").select("id, full_name, is_active").in("id", memberUserIds)
    : { data: [] };

  const profileMap = (profilesRes.data || []).reduce((acc: Record<string, any>, p: any) => {
    acc[p.id] = p;
    return acc;
  }, {});

  const members = (membersRes.data || []).map((m: any) => ({
    id: m.id,
    user_id: m.user_id,
    role: m.role,
    status: m.status,
    joined_at: m.joined_at,
    email: null,
    full_name: profileMap[m.user_id]?.full_name || null,
  }));

  const aiCreditsUsed = (usageRes.data || []).reduce((sum: number, u: any) => sum + (u.credits_consumed || 0), 0);

  return {
    id: business.id,
    name: business.name,
    slug: business.slug,
    industry: business.industry,
    status: business.status,
    subscription_plan: business.subscription_plan,
    subscription_status: business.subscription_status,
    is_active: business.is_active,
    created_at: business.created_at,
    updated_at: business.updated_at,
    email: business.email,
    phone: business.phone,
    website: business.website,
    timezone: business.timezone,
    currency: business.currency,
    trial_ends_at: business.trial_ends_at,
    owner_email: null,
    owner_name: members.find((m: any) => m.role === "owner")?.full_name || null,
    member_count: members.length,
    ai_credits_used: aiCreditsUsed,
    ai_credits_allowance: allowancesRes.data?.monthly_credit_allowance || 0,
    members,
  };
}

export async function updateBusinessStatus(businessId: string, status: string): Promise<void> {
  // Commercial/lifecycle columns are not directly writable by the browser;
  // this goes through a platform-admin-gated server function.
  const { error } = await (supabase.rpc as any)("admin_set_business_status", {
    p_business_id: businessId,
    p_status: status,
  });
  if (error) throw error;
  await logAdminEvent({
    action: "business_status_changed",
    targetType: "business",
    targetId: businessId,
    targetLabel: status,
    businessId,
    metadata: { status },
  });
}

export async function updateBusinessSubscriptionPlan(businessId: string, plan: string): Promise<void> {
  const { error } = await (supabase.rpc as any)("admin_set_business_plan", {
    p_business_id: businessId,
    p_plan: plan,
  });
  if (error) throw error;
  await logAdminEvent({
    action: "subscription_plan_changed",
    targetType: "business",
    targetId: businessId,
    targetLabel: plan,
    businessId,
    metadata: { plan },
  });
}
