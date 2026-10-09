/*
# Protect the commercial columns on businesses

1. Security changes
   - Revoke INSERT and UPDATE on `subscription_plan`, `subscription_status`,
     `trial_ends_at`, `status` and `is_active` from the `authenticated` role.
     Previously a business owner could grant their own business any plan simply
     by writing the column directly through the data API, unlocking paid
     features for free.
   - Add `admin_set_business_plan` and `admin_set_business_status`, SECURITY
     DEFINER functions gated on `is_platform_admin()`, so the platform admin
     console keeps working through a server-enforced path.

2. Important notes
   1. `status` and `is_active` keep their defaults, and `subscription_plan`,
      `subscription_status` and `trial_ends_at` are nullable, so creating a
      business without these columns still succeeds.
   2. Normal profile editing of a business (name, address, hours, branding) is
      unaffected: only these five columns were revoked.
*/

REVOKE INSERT (subscription_plan, subscription_status, trial_ends_at, status, is_active)
  ON public.businesses FROM authenticated;
REVOKE UPDATE (subscription_plan, subscription_status, trial_ends_at, status, is_active)
  ON public.businesses FROM authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_business_plan(p_business_id uuid, p_plan text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF NOT public.is_platform_admin() THEN
    RAISE EXCEPTION 'Not permitted';
  END IF;
  UPDATE public.businesses
  SET subscription_plan = p_plan, updated_at = now()
  WHERE id = p_business_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.admin_set_business_status(p_business_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF NOT public.is_platform_admin() THEN
    RAISE EXCEPTION 'Not permitted';
  END IF;
  IF p_status NOT IN ('active', 'suspended', 'archived', 'trial') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;
  UPDATE public.businesses
  SET status = p_status,
      is_active = (p_status = 'active'),
      updated_at = now()
  WHERE id = p_business_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_set_business_plan(uuid, text) FROM public, anon;
REVOKE ALL ON FUNCTION public.admin_set_business_status(uuid, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_business_plan(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_business_status(uuid, text) TO authenticated;
