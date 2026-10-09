/*
# Harden memberships: prevent joining an arbitrary business

1. Security changes
   - Drop the two permissive INSERT policies whose only condition was
     `user_id = auth.uid()`. They allowed any signed-in user to insert a
     membership row naming ANY business_id with ANY role, which granted them
     access through every membership-scoped policy in the schema.
   - Replace them with a single policy that permits a self-insert only when
     either (a) the business has no members yet (first-owner onboarding), or
     (b) a pending, unexpired invitation exists for the caller's own verified
     email address on that business, with a matching role.

2. Important notes
   1. The privileged columns (role, status, business_id, user_id) are no longer
      directly insertable by `authenticated`, so the role claimed here comes from
      column defaults; the policy is the second layer.
   2. No client code currently inserts membership rows, so no existing feature
      is affected.
*/

DROP POLICY IF EXISTS "memberships insert own rows" ON public.memberships;
DROP POLICY IF EXISTS "Authenticated users can create memberships" ON public.memberships;

CREATE POLICY "memberships insert first owner or invited"
ON public.memberships FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    NOT EXISTS (
      SELECT 1 FROM public.memberships existing
      WHERE existing.business_id = memberships.business_id
    )
    OR EXISTS (
      SELECT 1 FROM public.business_invitations i
      WHERE i.business_id = memberships.business_id
        AND lower(i.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        AND i.status = 'pending'
        AND i.expires_at > now()
    )
  )
);
