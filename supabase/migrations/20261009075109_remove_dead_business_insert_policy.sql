/*
# Remove the dead business creation rule

1. Security changes
   - `businesses insert owner` required an existing membership row for the
     business being inserted, which cannot exist at insert time, so the rule
     could never pass. Because permissive policies are OR-ed, the rule that
     actually governed creation was the sibling one with an always-true check.
     Leaving a dead ownership check beside a live permissive one makes the
     access model read as restricted when it is not, so the dead rule is
     removed and the working one is renamed to say what it does.

2. Important notes
   1. Creating a business remains open to any signed-in user; the commercial
      columns (plan, subscription status, lifecycle status) were made
      non-writable in a previous migration, so a business cannot be created
      with a plan it has not paid for.
*/

DROP POLICY IF EXISTS "businesses insert owner" ON public.businesses;
DROP POLICY IF EXISTS "Authenticated users can create businesses" ON public.businesses;

CREATE POLICY "businesses insert any authenticated"
ON public.businesses FOR INSERT
TO authenticated
WITH CHECK (true);
