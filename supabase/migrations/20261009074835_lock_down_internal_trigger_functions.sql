/*
# Lock down internal trigger routines and fix their lookup paths

1. Security changes
   - `sync_invoice_payments()` and `handle_new_user()` are trigger routines that
     run with elevated rights (SECURITY DEFINER). Both were executable by the
     `anon` and `authenticated` roles through the public RPC endpoint, which is
     a surface they were never meant to expose. EXECUTE is revoked from both.
   - `sync_invoice_payments()` had no fixed schema lookup path, which allows an
     unqualified table reference inside an elevated routine to be resolved
     against a schema the caller controls. It is now pinned.
   - `set_updated_at()`, `update_customers_updated_at()` and `user_biz_slug()`
     are likewise pinned to a fixed lookup path.

2. Important notes
   1. Revoking EXECUTE does not affect trigger firing: triggers run as the table
      owner, not as the calling role.
*/

REVOKE EXECUTE ON FUNCTION public.sync_invoice_payments() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

ALTER FUNCTION public.sync_invoice_payments() SET search_path = public, pg_temp;
ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_customers_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.user_biz_slug(uuid) SET search_path = public, pg_temp;
