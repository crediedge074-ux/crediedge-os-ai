/*
# Establish the CrediEdgeOS platform owner and global admin read access

## Summary
Creates the durable platform-owner record for the supplied owner account and updates the existing platform authorization helpers to recognize that record. This removes the dependency on a manually maintained Auth JWT claim for the owner while preserving platform-admin claims for delegated administrators.

## New Tables
- `platform_owners`
  - `user_id`: the Auth user that holds platform-owner authority.
  - `created_at`: when the platform-owner record was created.

## Modified Functions
- `is_platform_owner()`: returns true only when the authenticated user has a matching row in `platform_owners`.
- `is_platform_admin()`: recognizes the database-backed owner, or a delegated `platform_admin` / legacy `platform_owner` app metadata claim.
- `get_platform_role()`: returns `platform_owner` for the database-backed owner and `platform_admin` for delegated platform administrators.

## Security Changes
- Enables RLS on `platform_owners` without exposing rows to browser roles.
- Revokes public and anonymous execution of platform authorization helpers.
- Adds platform-admin SELECT policies to the existing business, profile, membership, AI usage, AI allowance, and enterprise lead tables so the Admin Console can read global records without weakening customer isolation.
- Keeps all writes to privileged commercial and role columns behind existing server-enforced functions.

## Important Notes
1. The owner is seeded with the user ID supplied for the CrediEdgeOS Owner account.
2. No business records, Auth passwords, customer records, or existing plan data are changed.
3. Enterprise users retain their existing tenant-scoped access because the new policies apply only when `is_platform_admin()` is true.
*/

CREATE TABLE IF NOT EXISTS public.platform_owners (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_owners ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.platform_owners FROM anon, authenticated;

INSERT INTO public.platform_owners (user_id)
VALUES ('ab6ce067-e503-4624-9255-b97ef1b24e5a')
ON CONFLICT (user_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_platform_owner()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.platform_owners
    WHERE user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT public.is_platform_owner()
    OR COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'platform_role') IN ('platform_owner', 'platform_admin'),
      false
    );
$$;

CREATE OR REPLACE FUNCTION public.get_platform_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT CASE
    WHEN public.is_platform_owner() THEN 'platform_owner'
    WHEN (auth.jwt() -> 'app_metadata' ->> 'platform_role') = 'platform_admin' THEN 'platform_admin'
    ELSE NULL
  END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_platform_owner() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_platform_admin() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.get_platform_role() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_platform_owner() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_platform_role() TO authenticated;

DROP POLICY IF EXISTS "platform_admin_select_businesses" ON public.businesses;
CREATE POLICY "platform_admin_select_businesses" ON public.businesses FOR SELECT
TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_select_profiles" ON public.profiles;
CREATE POLICY "platform_admin_select_profiles" ON public.profiles FOR SELECT
TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_select_memberships" ON public.memberships;
CREATE POLICY "platform_admin_select_memberships" ON public.memberships FOR SELECT
TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_select_ai_allowances" ON public.ai_credit_allowances;
CREATE POLICY "platform_admin_select_ai_allowances" ON public.ai_credit_allowances FOR SELECT
TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_select_ai_usage" ON public.ai_usage_logs;
CREATE POLICY "platform_admin_select_ai_usage" ON public.ai_usage_logs FOR SELECT
TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_select_enterprise_leads" ON public.enterprise_leads;
CREATE POLICY "platform_admin_select_enterprise_leads" ON public.enterprise_leads FOR SELECT
TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_insert_audit" ON public.admin_audit_events;
CREATE POLICY "platform_admin_insert_audit" ON public.admin_audit_events FOR INSERT
TO authenticated WITH CHECK (public.is_platform_admin() AND auth.uid() = actor_id);
