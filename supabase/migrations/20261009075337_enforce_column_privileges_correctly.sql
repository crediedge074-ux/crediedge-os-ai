/*
# Enforce the privileged-column restrictions correctly

1. Why this migration exists
   - Earlier migrations used column-level REVOKE to protect privileged columns.
     In PostgreSQL a column-level REVOKE cannot subtract from a table-wide
     grant, so those revokes had no effect and the columns remained writable.
     The table-wide grant is therefore withdrawn first and then re-granted on
     the permitted columns only, which is the form that actually restricts.

2. Security changes
   - `memberships`: UPDATE is now limited to `updated_at`, so a member can no
     longer promote themselves by writing `role`. Role changes go through the
     `set_member_role` function, which checks the caller is an owner/admin.
     INSERT excludes `status` (it defaults to 'active'), and the insert policy
     now also constrains which `role` may be claimed.
   - `profiles`: `is_active` is no longer insertable or updatable by the user,
     so a deactivated account cannot re-enable its own profile record.
   - `businesses`: `subscription_plan`, `subscription_status`, `trial_ends_at`,
     `status` and `is_active` are no longer insertable or updatable by the
     browser, so a business cannot grant itself a paid plan. Platform admins
     change these through `admin_set_business_plan` / `admin_set_business_status`.

3. Important notes
   1. Every column the application legitimately writes is still granted, so no
      existing screen loses functionality.
*/

-- memberships -------------------------------------------------------------
REVOKE UPDATE ON public.memberships FROM authenticated;
GRANT UPDATE (updated_at) ON public.memberships TO authenticated;

REVOKE INSERT ON public.memberships FROM authenticated;
GRANT INSERT (id, created_at, updated_at, business_id, user_id, role, joined_at, invited_by)
  ON public.memberships TO authenticated;

DROP POLICY IF EXISTS "memberships insert first owner or invited" ON public.memberships;
CREATE POLICY "memberships insert first owner or invited"
ON public.memberships FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    -- Onboarding: claiming the very first membership of a brand-new business.
    (
      role = 'owner'
      AND NOT EXISTS (
        SELECT 1 FROM public.memberships existing
        WHERE existing.business_id = memberships.business_id
      )
    )
    -- Or: redeeming a pending invitation addressed to this user, at the role
    -- the invitation specifies and no higher.
    OR EXISTS (
      SELECT 1 FROM public.business_invitations i
      WHERE i.business_id = memberships.business_id
        AND lower(i.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        AND i.status = 'pending'
        AND i.expires_at > now()
        AND i.role = memberships.role
    )
  )
);

-- profiles ----------------------------------------------------------------
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (updated_at, first_name, last_name, full_name, avatar_url, phone, job_title, last_login)
  ON public.profiles TO authenticated;

REVOKE INSERT ON public.profiles FROM authenticated;
GRANT INSERT (id, created_at, updated_at, first_name, last_name, full_name, avatar_url, phone, job_title, last_login)
  ON public.profiles TO authenticated;

-- businesses --------------------------------------------------------------
REVOKE UPDATE ON public.businesses FROM authenticated;
GRANT UPDATE (
  updated_at, name, slug, logo_url, industry, business_size, website, email, phone,
  address_line_1, address_line_2, city, county, postcode, country, timezone, currency,
  vat_number, business_hours
) ON public.businesses TO authenticated;

REVOKE INSERT ON public.businesses FROM authenticated;
GRANT INSERT (
  id, created_at, updated_at, name, slug, logo_url, industry, business_size, website,
  email, phone, address_line_1, address_line_2, city, county, postcode, country,
  timezone, currency, vat_number, business_hours
) ON public.businesses TO authenticated;
