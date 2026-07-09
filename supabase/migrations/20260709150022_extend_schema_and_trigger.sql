/*
# Extend existing schema for CrediEdgeOS app

## Summary
Adds columns needed by the frontend, business ownership policies, and a trigger
to auto-seed data when a new user signs up.

## Modified Tables

### settings (extended)
- compact_mode (boolean, default false) — dense UI layout toggle
- ai_provider (text, default 'openai') — AI service provider
- ai_model (text, default 'gpt-4o') — preferred AI model
- ai_creativity (integer, default 65) — creativity/temperature slider
- business_context (text, nullable) — free-text context for AI prompting

### businesses (extended)
- vat_number (text, nullable) — VAT registration number

## Security
- Adds missing INSERT / UPDATE / DELETE policies on businesses so owners can manage their record.

## Trigger: handle_new_user
Fires AFTER INSERT on auth.users. Creates:
1. A profile row (full_name derived from user metadata or email prefix)
2. A business row seeded with CrediEdge demo defaults
3. A membership row linking the user as 'owner' of that business
4. A settings row with sensible defaults (red accent, AI on, briefings on)
*/

-- ─── Add missing columns to settings ─────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='settings' AND column_name='compact_mode') THEN
    ALTER TABLE settings ADD COLUMN compact_mode boolean NOT NULL DEFAULT false;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='settings' AND column_name='ai_provider') THEN
    ALTER TABLE settings ADD COLUMN ai_provider text NOT NULL DEFAULT 'openai';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='settings' AND column_name='ai_model') THEN
    ALTER TABLE settings ADD COLUMN ai_model text NOT NULL DEFAULT 'gpt-4o';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='settings' AND column_name='ai_creativity') THEN
    ALTER TABLE settings ADD COLUMN ai_creativity integer NOT NULL DEFAULT 65;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='settings' AND column_name='business_context') THEN
    ALTER TABLE settings ADD COLUMN business_context text;
  END IF;
END $$;

-- ─── Add vat_number to businesses ─────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='businesses' AND column_name='vat_number') THEN
    ALTER TABLE businesses ADD COLUMN vat_number text;
  END IF;
END $$;

-- ─── Business ownership policies (INSERT / UPDATE / DELETE) ───────────────────

DROP POLICY IF EXISTS "businesses insert owner" ON businesses;
CREATE POLICY "businesses insert owner" ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.business_id = businesses.id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('owner','admin')
        AND memberships.status = 'active'
    )
  );

DROP POLICY IF EXISTS "businesses update owner" ON businesses;
CREATE POLICY "businesses update owner" ON businesses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.business_id = businesses.id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('owner','admin')
        AND memberships.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.business_id = businesses.id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('owner','admin')
        AND memberships.status = 'active'
    )
  );

DROP POLICY IF EXISTS "businesses delete owner" ON businesses;
CREATE POLICY "businesses delete owner" ON businesses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.business_id = businesses.id
        AND memberships.user_id = auth.uid()
        AND memberships.role = 'owner'
        AND memberships.status = 'active'
    )
  );

-- ─── Settings delete policy ───────────────────────────────────────────────────

DROP POLICY IF EXISTS "settings delete privileged" ON settings;
CREATE POLICY "settings delete privileged" ON settings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.business_id = settings.business_id
        AND memberships.user_id = auth.uid()
        AND memberships.role IN ('owner','admin')
        AND memberships.status = 'active'
    )
  );

-- ─── New user trigger ─────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_business_id uuid;
  display_name    text;
  first_n         text;
  last_n          text;
BEGIN
  display_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    SPLIT_PART(NEW.email, '@', 1)
  );

  first_n := SPLIT_PART(display_name, ' ', 1);
  last_n  := CASE
               WHEN POSITION(' ' IN display_name) > 0
               THEN SUBSTRING(display_name FROM POSITION(' ' IN display_name) + 1)
               ELSE NULL
             END;

  -- 1. Profile
  INSERT INTO profiles (id, full_name, first_name, last_name)
  VALUES (NEW.id, display_name, first_n, last_n)
  ON CONFLICT (id) DO NOTHING;

  -- 2. Business (seeded with CrediEdge demo defaults)
  INSERT INTO businesses (
    name, industry, timezone, currency,
    subscription_plan, subscription_status, status
  )
  VALUES (
    'CrediEdge', 'Business Operating System', 'Europe/London', 'GBP',
    'Professional', 'active', 'active'
  )
  RETURNING id INTO new_business_id;

  -- 3. Membership
  INSERT INTO memberships (business_id, user_id, role, status)
  VALUES (new_business_id, NEW.id, 'owner', 'active');

  -- 4. Settings
  INSERT INTO settings (
    business_id, theme, ai_enabled, email_notifications,
    daily_briefing, weekly_report, accent_colour,
    timezone, currency, ai_provider, ai_model, ai_creativity
  )
  VALUES (
    new_business_id, 'light', true, true,
    true, true, '#E31B23',
    'Europe/London', 'GBP', 'openai', 'gpt-4o', 65
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
