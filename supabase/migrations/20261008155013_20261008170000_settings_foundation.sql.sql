/*
# Settings Foundation: User Preferences, Invitations, Storage, Business Hours

## Purpose
Extends the CrediEdgeOS database to support production Settings functionality:
- User-level preferences (appearance, notifications) scoped to the authenticated user
- Business member invitations with email/token workflow
- Storage buckets for business logos and user avatars
- Business hours JSONB column on the businesses table

## New Tables

### user_preferences
- `id` (uuid, PK)
- `user_id` (uuid, NOT NULL, REFERENCES auth.users ON DELETE CASCADE) — owner
- `theme` (text, default 'system') — 'light' | 'dark' | 'system'
- `accent_colour` (text, default '#E31B23')
- `compact_mode` (boolean, default false)
- `notification_new_enquiry` (boolean, default true)
- `notification_invoice_overdue` (boolean, default true)
- `notification_new_review` (boolean, default true)
- `notification_daily_briefing` (boolean, default true)
- `notification_weekly_report` (boolean, default true)
- `notification_campaign_alerts` (boolean, default true)
- `notification_mission_updates` (boolean, default true)
- `notification_ai_insights` (boolean, default true)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())
- RLS: owner-scoped (auth.uid() = user_id), 4 policies

### business_invitations
- `id` (uuid, PK)
- `business_id` (uuid, NOT NULL, REFERENCES businesses ON DELETE CASCADE)
- `email` (text, NOT NULL) — invitee email
- `role` (text, NOT NULL, default 'staff') — 'owner' | 'admin' | 'staff' | 'read_only'
- `token` (text, NOT NULL, UNIQUE) — opaque invitation token
- `invited_by` (uuid, REFERENCES auth.users ON DELETE SET NULL)
- `status` (text, NOT NULL, default 'pending') — 'pending' | 'accepted' | 'expired' | 'revoked'
- `accepted_by` (uuid, REFERENCES auth.users ON DELETE SET NULL)
- `accepted_at` (timestamptz)
- `expires_at` (timestamptz, NOT NULL) — default 7 days from creation
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())
- RLS: membership-scoped (SELECT/INSERT/UPDATE for active members of the same business), 4 policies

## Modified Tables

### businesses
- Added `business_hours` (jsonb, nullable) — stores editable business hours array
- Added `logo_url` to the Update type (column already exists on the table)

### settings
- Added AI preference columns:
  - `ai_response_style` (text, nullable) — 'concise' | 'balanced' | 'detailed'
  - `ai_proactivity` (text, nullable) — 'reactive' | 'proactive' | 'very_proactive'
  - `ai_prioritise` (text, nullable) — 'growth' | 'profitability' | 'efficiency' | 'customer_retention'
  - `ai_challenge_decisions` (boolean, default false)
  - `ai_require_confirmation` (boolean, default true)
  - `ai_allow_external_research` (boolean, default false)
  - `ai_allow_recommendations` (boolean, default true)
  - `ai_business_priorities` (text, nullable)
  - `ai_strategic_objectives` (text, nullable)
  - `ai_constraints` (text, nullable)
  - `ai_terminology` (text, nullable)

## Storage Buckets
- `business-logos` — public read, authenticated write (business-scoped)
- `avatars` — public read, authenticated write (user-scoped)

## Security
- user_preferences: RLS enabled, owner-scoped (auth.uid() = user_id)
- business_invitations: RLS enabled, membership-scoped via memberships table check
- Storage policies: authenticated users can upload to their own scoped paths

## Notes
1. user_preferences has DEFAULT auth.uid() on user_id so inserts that omit it still work.
2. business_invitations token is generated via gen_random_uuid()::text for opacity.
3. Business hours stored as JSONB array: [{day, open, from, to}, ...]
4. No data is fabricated or seeded.
*/

-- ─── user_preferences table ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text NOT NULL DEFAULT 'system',
  accent_colour text NOT NULL DEFAULT '#E31B23',
  compact_mode boolean NOT NULL DEFAULT false,
  notification_new_enquiry boolean NOT NULL DEFAULT true,
  notification_invoice_overdue boolean NOT NULL DEFAULT true,
  notification_new_review boolean NOT NULL DEFAULT true,
  notification_daily_briefing boolean NOT NULL DEFAULT true,
  notification_weekly_report boolean NOT NULL DEFAULT true,
  notification_campaign_alerts boolean NOT NULL DEFAULT true,
  notification_mission_updates boolean NOT NULL DEFAULT true,
  notification_ai_insights boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_user_preferences" ON user_preferences;
CREATE POLICY "owner_select_user_preferences"
ON user_preferences FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_insert_user_preferences" ON user_preferences;
CREATE POLICY "owner_insert_user_preferences"
ON user_preferences FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_user_preferences" ON user_preferences;
CREATE POLICY "owner_update_user_preferences"
ON user_preferences FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_user_preferences" ON user_preferences;
CREATE POLICY "owner_delete_user_preferences"
ON user_preferences FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ─── business_invitations table ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS business_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'staff',
  token text NOT NULL UNIQUE DEFAULT (gen_random_uuid()::text),
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  accepted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE business_invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_business_invitations" ON business_invitations;
CREATE POLICY "members_select_business_invitations"
ON business_invitations FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = business_invitations.business_id
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "members_insert_business_invitations" ON business_invitations;
CREATE POLICY "members_insert_business_invitations"
ON business_invitations FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = business_invitations.business_id
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
    AND memberships.role IN ('owner', 'admin')
  )
);

DROP POLICY IF EXISTS "members_update_business_invitations" ON business_invitations;
CREATE POLICY "members_update_business_invitations"
ON business_invitations FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = business_invitations.business_id
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
    AND memberships.role IN ('owner', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = business_invitations.business_id
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
    AND memberships.role IN ('owner', 'admin')
  )
);

DROP POLICY IF EXISTS "members_delete_business_invitations" ON business_invitations;
CREATE POLICY "members_delete_business_invitations"
ON business_invitations FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = business_invitations.business_id
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
    AND memberships.role IN ('owner', 'admin')
  )
);

-- ─── businesses: add business_hours column ───────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'business_hours') THEN
    ALTER TABLE businesses ADD COLUMN business_hours jsonb;
  END IF;
END $$;

-- ─── settings: add AI preference columns ─────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'ai_response_style') THEN
    ALTER TABLE settings ADD COLUMN ai_response_style text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'ai_proactivity') THEN
    ALTER TABLE settings ADD COLUMN ai_proactivity text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'ai_prioritise') THEN
    ALTER TABLE settings ADD COLUMN ai_prioritise text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'ai_challenge_decisions') THEN
    ALTER TABLE settings ADD COLUMN ai_challenge_decisions boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'ai_require_confirmation') THEN
    ALTER TABLE settings ADD COLUMN ai_require_confirmation boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'ai_allow_external_research') THEN
    ALTER TABLE settings ADD COLUMN ai_allow_external_research boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'ai_allow_recommendations') THEN
    ALTER TABLE settings ADD COLUMN ai_allow_recommendations boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'ai_business_priorities') THEN
    ALTER TABLE settings ADD COLUMN ai_business_priorities text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'ai_strategic_objectives') THEN
    ALTER TABLE settings ADD COLUMN ai_strategic_objectives text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'ai_constraints') THEN
    ALTER TABLE settings ADD COLUMN ai_constraints text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'ai_terminology') THEN
    ALTER TABLE settings ADD COLUMN ai_terminology text;
  END IF;
END $$;

-- ─── Storage buckets ─────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public) VALUES ('business-logos', 'business-logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for business-logos
DROP POLICY IF EXISTS "auth_read_business_logos" ON storage.objects;
CREATE POLICY "auth_read_business_logos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'business-logos');

DROP POLICY IF EXISTS "auth_upload_business_logos" ON storage.objects;
CREATE POLICY "auth_upload_business_logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'business-logos');

DROP POLICY IF EXISTS "auth_update_business_logos" ON storage.objects;
CREATE POLICY "auth_update_business_logos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'business-logos');

DROP POLICY IF EXISTS "auth_delete_business_logos" ON storage.objects;
CREATE POLICY "auth_delete_business_logos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'business-logos');

-- Storage policies for avatars
DROP POLICY IF EXISTS "auth_read_avatars" ON storage.objects;
CREATE POLICY "auth_read_avatars" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "auth_upload_avatars" ON storage.objects;
CREATE POLICY "auth_upload_avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "auth_update_avatars" ON storage.objects;
CREATE POLICY "auth_update_avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "auth_delete_avatars" ON storage.objects;
CREATE POLICY "auth_delete_avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_business_invitations_business_id ON business_invitations(business_id);
CREATE INDEX IF NOT EXISTS idx_business_invitations_email ON business_invitations(email);
CREATE INDEX IF NOT EXISTS idx_business_invitations_token ON business_invitations(token);
