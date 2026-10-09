import { supabase } from "@/lib/supabase";
import { logActivity } from "./activity";

export interface BusinessInvitation {
  id: string;
  business_id: string;
  email: string;
  role: string;
  invited_by: string | null;
  status: string;
  accepted_by: string | null;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface MemberInfo {
  membership_id: string;
  user_id: string;
  role: string;
  status: string;
  joined_at: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export async function fetchMembers(businessId: string): Promise<MemberInfo[]> {
  const { data, error } = await (supabase.from as any)("memberships")
    .select(`
      id,
      user_id,
      role,
      status,
      joined_at,
      profiles!inner(first_name, last_name, full_name, avatar_url)
    `)
    .eq("business_id", businessId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[fetchMembers] error:", error);
    return [];
  }
  return (data || []).map((row: any) => ({
    membership_id: row.id,
    user_id: row.user_id,
    role: row.role,
    status: row.status,
    joined_at: row.joined_at,
    first_name: row.profiles?.first_name ?? null,
    last_name: row.profiles?.last_name ?? null,
    full_name: row.profiles?.full_name ?? null,
    avatar_url: row.profiles?.avatar_url ?? null,
    email: null,
  })) as MemberInfo[];
}

export async function fetchInvitations(businessId: string): Promise<BusinessInvitation[]> {
  // The invitation token is a secret and is deliberately not selected here;
  // the database also withholds SELECT on that column from the browser.
  const { data, error } = await (supabase.from as any)("business_invitations")
    .select("id, business_id, email, role, invited_by, status, accepted_by, accepted_at, expires_at, created_at, updated_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[fetchInvitations] error:", error);
    return [];
  }
  return (data || []) as BusinessInvitation[];
}

export async function createInvitation(
  businessId: string,
  invitedBy: string,
  email: string,
  role: string,
): Promise<BusinessInvitation | null> {
  const { data, error } = await (supabase.from as any)("business_invitations")
    .insert({
      business_id: businessId,
      email: email.toLowerCase().trim(),
      role,
      invited_by: invitedBy,
    })
    .select("id, business_id, email, role, invited_by, status, accepted_by, accepted_at, expires_at, created_at, updated_at")
    .single();
  if (error) {
    console.error("[createInvitation] error:", error);
    return null;
  }
  await logActivity({
    business_id: businessId,
    entity_type: "invitation",
    entity_id: data.id,
    action: "invited",
    description: `Invited ${email} as ${role}`,
    actor_id: invitedBy,
  }).catch(() => {});
  return data as BusinessInvitation;
}

export async function revokeInvitation(businessId: string, invitationId: string): Promise<boolean> {
  const { error } = await (supabase.from as any)("business_invitations")
    .update({ status: "revoked", updated_at: new Date().toISOString() })
    .eq("id", invitationId)
    .eq("business_id", businessId);
  if (error) {
    console.error("[revokeInvitation] error:", error);
    return false;
  }
  return true;
}

export async function updateMemberRole(_businessId: string, membershipId: string, role: string): Promise<boolean> {
  // Role changes are performed server-side so that only an active owner/admin of
  // the same business can change a member's role. See set_member_role().
  const { error } = await (supabase.rpc as any)("set_member_role", {
    p_membership_id: membershipId,
    p_role: role,
  });
  if (error) {
    console.error("[updateMemberRole] error:", error);
    return false;
  }
  return true;
}
