/*
# Fix Core RLS Policies for Profiles, Businesses, and Memberships

## Summary
Adds missing Row Level Security (RLS) policies for:
1. `profiles`: Allows users to SELECT and UPDATE their own profile (`id = auth.uid()`).
2. `memberships`: Allows users to SELECT memberships where `user_id = auth.uid()`.
3. `businesses`: Allows users to SELECT businesses if they have an active membership.

This resolves 401 Unauthorized / empty workspace responses when fetching user profiles or primary memberships upon login.
*/

-- ─── PROFILES RLS POLICIES ───────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own_profile" ON profiles;
CREATE POLICY "users_select_own_profile" ON profiles FOR SELECT TO authenticated
USING (id = auth.uid());

DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

-- ─── MEMBERSHIPS RLS POLICIES ────────────────────────────────────────────────
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_own_memberships" ON memberships;
CREATE POLICY "members_select_own_memberships" ON memberships FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- ─── BUSINESSES SELECT POLICY ───────────────────────────────────────────────
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_businesses" ON businesses;
CREATE POLICY "members_select_businesses" ON businesses FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = businesses.id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);
