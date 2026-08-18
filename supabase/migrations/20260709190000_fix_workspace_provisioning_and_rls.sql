/*
# Fix Workspace Self-Provisioning RLS Policies & Backfill Existing Users

## Summary
1. Allows authenticated users to create a new `businesses` record and `memberships` record for themselves.
2. Backfills missing `profiles`, `businesses`, `memberships`, and `settings` records for existing `auth.users` who have 0 memberships using default starter subscription values.
*/

-- ─── 1. FIX BUSINESSES INSERT POLICY ──────────────────────────────────────────
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "businesses insert owner" ON businesses;
DROP POLICY IF EXISTS "authenticated_insert_business" ON businesses;

CREATE POLICY "authenticated_insert_business" ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ─── 2. FIX MEMBERSHIPS INSERT POLICY ─────────────────────────────────────────
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_insert_own_membership" ON memberships;

CREATE POLICY "authenticated_insert_own_membership" ON memberships FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ─── 3. BACKFILL WORKSPACES FOR ALL EXISTING USERS WITHOUT MEMBERSHIPS ────────
DO $$
DECLARE
  u RECORD;
  new_biz_id uuid;
  display_name text;
  first_n text;
  last_n text;
BEGIN
  FOR u IN
    SELECT id, email, raw_user_meta_data
    FROM auth.users
    WHERE id NOT IN (SELECT user_id FROM memberships)
  LOOP
    display_name := COALESCE(
      NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
      SPLIT_PART(u.email, '@', 1)
    );

    first_n := SPLIT_PART(display_name, ' ', 1);
    last_n  := CASE
                 WHEN POSITION(' ' IN display_name) > 0
                 THEN SUBSTRING(display_name FROM POSITION(' ' IN display_name) + 1)
                 ELSE NULL
               END;

    -- A. Profile
    INSERT INTO profiles (id, full_name, first_name, last_name)
    VALUES (u.id, display_name, first_n, last_n)
    ON CONFLICT (id) DO NOTHING;

    -- B. Business (uses starter defaults)
    INSERT INTO businesses (
      name, industry, timezone, currency,
      subscription_plan, subscription_status, status
    )
    VALUES (
      'CrediEdge Workspace', 'Business Operating System', 'Europe/London', 'GBP',
      'Starter', 'trialing', 'active'
    )
    RETURNING id INTO new_biz_id;

    -- C. Membership
    INSERT INTO memberships (business_id, user_id, role, status)
    VALUES (new_biz_id, u.id, 'owner', 'active');

    -- D. Settings
    INSERT INTO settings (
      business_id, theme, ai_enabled, email_notifications,
      daily_briefing, weekly_report, accent_colour,
      timezone, currency, ai_provider, ai_model, ai_creativity
    )
    VALUES (
      new_biz_id, 'light', true, true,
      true, true, '#E31B23',
      'Europe/London', 'GBP', 'openai', 'gpt-4o', 65
    );

  END LOOP;
END $$;
