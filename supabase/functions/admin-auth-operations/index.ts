import { createClient } from "npm:@supabase/supabase-js@2.110.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AdminUserResponse {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  banned_until: string | null;
  platform_role: string | null;
  raw_user_meta_data: Record<string, unknown> | null;
}

// Internal error detail (admin API messages, stack traces) names internal
// identifiers and configuration, so it is logged server-side and never returned
// to the browser. Callers get a fixed per-action sentence instead.
function logAndGeneric(error: unknown, action: string): string {
  console.error(`[admin-auth-operations] ${action} failed:`, error);
  return `The ${action.replace(/_/g, " ")} operation could not be completed.`;
}

// Looks up a target account and the platform role it currently holds, so that
// tier-crossing actions (changing a role, banning, deleting) can be refused
// when the target outranks the caller.
async function getTarget(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
): Promise<{ id: string; role: string | null } | null> {
  const { data, error } = await adminClient.auth.admin.getUserById(userId);
  if (error || !data?.user) return null;
  const role = (data.user.app_metadata as Record<string, unknown> | null)?.platform_role;
  return { id: data.user.id, role: typeof role === "string" ? role : null };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const anonKey = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      return new Response(JSON.stringify({ error: "Missing configuration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify caller is authenticated and is a platform admin
    const callerClient = createClient(supabaseUrl, anonKey);
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: ownerRecord, error: ownerLookupError } = await adminClient
      .from("platform_owners")
      .select("user_id")
      .eq("user_id", caller.id)
      .maybeSingle();
    if (ownerLookupError) {
      return new Response(JSON.stringify({ error: "Unable to verify platform access" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isOwner = Boolean(ownerRecord);
    const callerRole = caller.app_metadata?.platform_role;
    if (!isOwner && callerRole !== "platform_owner" && callerRole !== "platform_admin") {
      return new Response(JSON.stringify({ error: "Forbidden — platform admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    // ─── List all auth users with email ─────────────────────────────────
    if (action === "list_users") {
      const { page = 1, perPage = 50 } = body;
      const {
        data: { users },
        error,
      } = await adminClient.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) {
        return new Response(JSON.stringify({ error: logAndGeneric(error, "list_users") }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const result: AdminUserResponse[] = (users || []).map((u) => ({
        id: u.id,
        email: u.email ?? "",
        created_at: u.created_at ?? "",
        last_sign_in_at: u.last_sign_in_at ?? null,
        email_confirmed_at: u.email_confirmed_at ?? null,
        banned_until: u.banned_until ?? null,
        platform_role: typeof (u.app_metadata as Record<string, unknown> | null)?.platform_role === "string"
          ? (u.app_metadata as Record<string, unknown>).platform_role as string
          : null,
        raw_user_meta_data: (u.user_metadata as Record<string, unknown>) ?? null,
      }));

      return new Response(JSON.stringify({ users: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Create a business ──────────────────────────────────────────────
    if (action === "create_business") {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
      if (!name || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return new Response(JSON.stringify({ error: "A name and valid slug are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: business, error } = await adminClient
        .from("businesses")
        .insert({ name, slug, email })
        .select("id")
        .single();
      if (error) {
        return new Response(JSON.stringify({ error: logAndGeneric(error, "create_business") }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await adminClient.from("admin_audit_events").insert({
        actor_id: caller.id,
        action: "business_created",
        target_type: "business",
        target_id: business.id,
        target_label: name,
        business_id: business.id,
        metadata: { slug },
      });
      return new Response(JSON.stringify({ success: true, businessId: business.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Update business profile fields ─────────────────────────────────
    if (action === "update_business") {
      const businessId = typeof body.businessId === "string" ? body.businessId : "";
      const allowedFields = ["name", "slug", "industry", "business_size", "website", "email", "phone", "timezone", "currency"] as const;
      const updates: Record<string, string | null> = {};
      for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
          const value = body[field];
          if (value !== null && typeof value !== "string") {
            return new Response(JSON.stringify({ error: "Invalid business field" }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          updates[field] = typeof value === "string" ? value.trim() || null : null;
        }
      }
      if (!businessId || Object.keys(updates).length === 0) {
        return new Response(JSON.stringify({ error: "A business and at least one permitted field are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (updates.slug !== undefined && updates.slug !== null && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(updates.slug)) {
        return new Response(JSON.stringify({ error: "Invalid business slug" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await adminClient.from("businesses").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", businessId);
      if (error) {
        return new Response(JSON.stringify({ error: logAndGeneric(error, "update_business") }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      await adminClient.from("admin_audit_events").insert({
        actor_id: caller.id,
        action: "business_profile_updated",
        target_type: "business",
        target_id: businessId,
        business_id: businessId,
        metadata: updates,
      });
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Invite a user ──────────────────────────────────────────────────
    if (action === "invite_user") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
      if (!email || !email.includes("@")) {
        return new Response(JSON.stringify({ error: "A valid email is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
        data: fullName ? { full_name: fullName } : undefined,
      });
      if (error) {
        return new Response(JSON.stringify({ error: logAndGeneric(error, "invite_user") }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, userId: data.user.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Get single user ────────────────────────────────────────────────
    if (action === "get_user") {
      const { userId } = body;
      if (!userId) {
        return new Response(JSON.stringify({ error: "userId is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await adminClient.auth.admin.getUserById(userId);
      if (error) {
        return new Response(JSON.stringify({ error: logAndGeneric(error, "get_user") }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const u = data.user;
      const result: AdminUserResponse = {
        id: u.id,
        email: u.email ?? "",
        created_at: u.created_at ?? "",
        last_sign_in_at: u.last_sign_in_at ?? null,
        email_confirmed_at: u.email_confirmed_at ?? null,
        banned_until: u.banned_until ?? null,
        platform_role: typeof (u.app_metadata as Record<string, unknown> | null)?.platform_role === "string"
          ? (u.app_metadata as Record<string, unknown>).platform_role as string
          : null,
        raw_user_meta_data: (u.user_metadata as Record<string, unknown>) ?? null,
      };

      return new Response(JSON.stringify({ user: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Update user profile fields ─────────────────────────────────────
    if (action === "update_user") {
      const { userId, email, password, appMetadata } = body;
      if (!userId) {
        return new Response(JSON.stringify({ error: "userId is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const target = await getTarget(adminClient, userId);
      if (!target) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Credentials of a platform owner may only be changed by that owner.
      if ((email || password) && target.role === "platform_owner" && userId !== caller.id) {
        return new Response(JSON.stringify({ error: "Cannot change credentials of a platform owner" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const updates: Record<string, unknown> = {};
      if (email) updates.email = email;
      if (password) updates.password = password;

      // app_metadata carries the platform_role claim that drives every
      // authorization decision, so it is allowlisted, owner-gated, and may
      // never be applied to the caller's own account.
      if (appMetadata !== undefined && appMetadata !== null) {
        if (!isOwner) {
          return new Response(JSON.stringify({ error: "Only the platform owner can change platform roles" }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (userId === caller.id) {
          return new Response(JSON.stringify({ error: "Cannot change your own platform role" }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const keys = Object.keys(appMetadata as Record<string, unknown>);
        if (keys.some((k) => k !== "platform_role")) {
          return new Response(JSON.stringify({ error: "Only platform_role may be set" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const requested = (appMetadata as Record<string, unknown>).platform_role;
        if (requested !== null && requested !== "platform_admin") {
          return new Response(JSON.stringify({ error: "platform_role must be 'platform_admin' or null" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        updates.app_metadata = { platform_role: requested };
      }

      if (Object.keys(updates).length === 0) {
        return new Response(JSON.stringify({ error: "No permitted changes supplied" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await adminClient.auth.admin.updateUserById(userId, updates);
      if (error) {
        return new Response(JSON.stringify({ error: logAndGeneric(error, "update_user") }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, userId: data.user.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Deactivate user (ban) ──────────────────────────────────────────
    if (action === "deactivate_user") {
      const { userId } = body;
      if (!userId) {
        return new Response(JSON.stringify({ error: "userId is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // A platform admin must not be able to lock the platform owner out.
      const banTarget = await getTarget(adminClient, userId);
      if (banTarget?.role === "platform_owner" && callerRole !== "platform_owner") {
        return new Response(JSON.stringify({ error: "Cannot deactivate a platform owner" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (userId === caller.id) {
        return new Response(JSON.stringify({ error: "Cannot deactivate your own account" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await adminClient.auth.admin.updateUserById(userId, {
        ban_duration: "876000h",
      });
      if (error) {
        return new Response(JSON.stringify({ error: logAndGeneric(error, "deactivate_user") }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Activate user (unban) ──────────────────────────────────────────
    if (action === "activate_user") {
      const { userId } = body;
      if (!userId) {
        return new Response(JSON.stringify({ error: "userId is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await adminClient.auth.admin.updateUserById(userId, {
        ban_duration: "none",
      });
      if (error) {
        return new Response(JSON.stringify({ error: logAndGeneric(error, "activate_user") }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Delete user ────────────────────────────────────────────────────
    if (action === "delete_user") {
      const { userId } = body;
      if (!userId) {
        return new Response(JSON.stringify({ error: "userId is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Prevent self-deletion
      if (userId === caller.id) {
        return new Response(JSON.stringify({ error: "Cannot delete your own account" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // A platform admin must not be able to delete the platform owner.
      const deleteTarget = await getTarget(adminClient, userId);
      if (deleteTarget?.role === "platform_owner") {
        return new Response(JSON.stringify({ error: "Cannot delete a platform owner" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await adminClient.auth.admin.deleteUser(userId);
      if (error) {
        return new Response(JSON.stringify({ error: logAndGeneric(error, "delete_user") }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Send password reset email ──────────────────────────────────────
    if (action === "send_password_reset") {
      const { email } = body;
      if (!email) {
        return new Response(JSON.stringify({ error: "email is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await adminClient.auth.resetPasswordForEmail(email);
      if (error) {
        return new Response(JSON.stringify({ error: logAndGeneric(error, "send_password_reset") }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: logAndGeneric(err, "request") }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
