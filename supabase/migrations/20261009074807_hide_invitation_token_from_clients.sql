/*
# Hide invitation tokens from the browser

1. Security changes
   - `business_invitations` is readable by every active member of a business,
     and the row contains a `token` column that is the secret used to redeem the
     invitation. A low-privilege member could therefore read the token issued to
     a pending administrator.
   - SELECT is now granted on the non-secret columns only; the `token` column is
     no longer readable by `anon` or `authenticated`.

2. Important notes
   1. Table-level SELECT is replaced with explicit per-column SELECT so that the
      people/invitations screen keeps working; only `token` is withheld.
   2. The application was updated in the same change to stop selecting `*` on
      this table.
*/

REVOKE SELECT ON public.business_invitations FROM authenticated, anon;

GRANT SELECT (
  id, business_id, email, role, invited_by, status,
  accepted_by, accepted_at, expires_at, created_at, updated_at
) ON public.business_invitations TO authenticated;
