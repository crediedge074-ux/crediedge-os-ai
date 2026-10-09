import { supabase } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  banned_until: string | null;
  platform_role: string | null;
  raw_user_meta_data: Record<string, unknown> | null;
}

export async function listAuthUsers(page = 1, perPage = 50): Promise<{ users: AuthUser[]; error: string | null }> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL}/functions/v1/admin-auth-operations`;
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) return { users: [], error: "No active session" };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || "",
      },
      body: JSON.stringify({ action: "list_users", page, perPage }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { users: [], error: body.error || `Request failed (${res.status})` };
    }
    const data = await res.json();
    if (!data || !Array.isArray(data.users)) {
      return { users: [], error: "Invalid response from server" };
    }
    return { users: data.users as AuthUser[], error: null };
  } catch (err) {
    return { users: [], error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function inviteUser(email: string, fullName?: string): Promise<{ success: boolean; userId?: string; error: string | null }> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL}/functions/v1/admin-auth-operations`;
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) return { success: false, error: "No active session" };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || "",
      },
      body: JSON.stringify({ action: "invite_user", email, fullName }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, error: body.error || `Request failed (${res.status})` };
    return { success: true, userId: body.userId, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function getAuthUser(userId: string): Promise<{ user: AuthUser | null; error: string | null }> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL}/functions/v1/admin-auth-operations`;
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) return { user: null, error: "No active session" };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || "",
      },
      body: JSON.stringify({ action: "get_user", userId }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { user: null, error: body.error || `Request failed (${res.status})` };
    }
    const data = await res.json();
    if (!data || !data.user) return { user: null, error: "Invalid response" };
    return { user: data.user as AuthUser, error: null };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function deactivateUser(userId: string): Promise<{ success: boolean; error: string | null }> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL}/functions/v1/admin-auth-operations`;
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) return { success: false, error: "No active session" };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || "",
      },
      body: JSON.stringify({ action: "deactivate_user", userId }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || `Request failed (${res.status})` };
    }
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function activateUser(userId: string): Promise<{ success: boolean; error: string | null }> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL}/functions/v1/admin-auth-operations`;
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) return { success: false, error: "No active session" };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || "",
      },
      body: JSON.stringify({ action: "activate_user", userId }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || `Request failed (${res.status})` };
    }
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function sendPasswordReset(email: string): Promise<{ success: boolean; error: string | null }> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL}/functions/v1/admin-auth-operations`;
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) return { success: false, error: "No active session" };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || "",
      },
      body: JSON.stringify({ action: "send_password_reset", email }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || `Request failed (${res.status})` };
    }
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}
