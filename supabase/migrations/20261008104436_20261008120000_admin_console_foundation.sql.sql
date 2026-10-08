/*
# Admin Console Foundation — Platform Control Plane

## Summary
Establishes the database foundation for the CrediEdgeOS Admin Console / Enterprise Control Plane.
This migration introduces platform-level concepts that sit ABOVE the normal business/workspace layer:

1. **is_platform_admin() / get_platform_role()** — Helper functions checking raw_app_meta_data for platform-level role.
2. **platform_plans** — Central plan definitions (name, price, AI credits, status).
3. **feature_definitions** — Central registry of all CrediEdgeOS features that can be entitled.
4. **plan_feature_entitlements** — Maps subscription plans to features (plan-level entitlement).
5. **business_feature_overrides** — Per-business feature grants or restrictions that override plan defaults.
6. **admin_audit_events** — Audit log for all Admin Console actions.
7. **enterprise_leads** — Real lead/request records for non-Enterprise users who express interest.
8. **enterprise_accounts** — Future enterprise/white-label/reseller hierarchy.

## Security
- All new tables have RLS enabled.
- Platform admin access is enforced via `is_platform_admin()` SECURITY DEFINER function reading `raw_app_meta_data`.
- `enterprise_leads` allows any authenticated user to INSERT (submit interest); only platform admins can UPDATE.
- `admin_audit_events` is INSERT-only for authenticated, SELECT for platform admins only.
- No `USING (true)` shortcuts on protected tables.

## Important Notes
- Does NOT alter existing tables, columns, or RLS policies.
- The existing `memberships.role` system is unchanged — platform roles are additive.
- All tables use gen_random_uuid() primary keys and standard timestamps.
*/

-- 1. HELPER FUNCTIONS

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'platform_role') IN ('platform_owner', 'platform_admin'),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.get_platform_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT auth.jwt() -> 'app_metadata' ->> 'platform_role';
$$;

GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_platform_role() TO authenticated;

-- 2. platform_plans

CREATE TABLE IF NOT EXISTS public.platform_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  monthly_price_gbp NUMERIC(10,2) NOT NULL DEFAULT 0,
  annual_price_gbp NUMERIC(10,2) NOT NULL DEFAULT 0,
  ai_credit_allowance INTEGER NOT NULL DEFAULT 0,
  is_enterprise BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  max_users INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "platform_admin_select_plans" ON public.platform_plans;
CREATE POLICY "platform_admin_select_plans" ON public.platform_plans FOR SELECT
  TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_insert_plans" ON public.platform_plans;
CREATE POLICY "platform_admin_insert_plans" ON public.platform_plans FOR INSERT
  TO authenticated WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_update_plans" ON public.platform_plans;
CREATE POLICY "platform_admin_update_plans" ON public.platform_plans FOR UPDATE
  TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_delete_plans" ON public.platform_plans;
CREATE POLICY "platform_admin_delete_plans" ON public.platform_plans FOR DELETE
  TO authenticated USING (public.is_platform_admin());

INSERT INTO public.platform_plans (name, display_name, description, monthly_price_gbp, annual_price_gbp, ai_credit_allowance, is_enterprise, sort_order)
VALUES
  ('starter', 'Starter', 'Essential tools for small businesses getting started.', 0, 0, 100, false, 1),
  ('growth', 'Growth', 'Advanced features for growing businesses.', 49, 490, 500, false, 2),
  ('enterprise', 'Enterprise', 'Full platform access with admin control plane.', 0, 0, 2000, true, 3)
ON CONFLICT (name) DO NOTHING;

-- 3. feature_definitions

CREATE TABLE IF NOT EXISTS public.feature_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'core',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feature_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_features" ON public.feature_definitions;
CREATE POLICY "authenticated_select_features" ON public.feature_definitions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "platform_admin_insert_features" ON public.feature_definitions;
CREATE POLICY "platform_admin_insert_features" ON public.feature_definitions FOR INSERT
  TO authenticated WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_update_features" ON public.feature_definitions;
CREATE POLICY "platform_admin_update_features" ON public.feature_definitions FOR UPDATE
  TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_delete_features" ON public.feature_definitions;
CREATE POLICY "platform_admin_delete_features" ON public.feature_definitions FOR DELETE
  TO authenticated USING (public.is_platform_admin());

INSERT INTO public.feature_definitions (key, display_name, description, category, sort_order) VALUES
  ('command_centre', 'Command Centre', 'Main dashboard with morning briefing, score, and priorities.', 'core', 1),
  ('business_advisor', 'Business Advisor', 'AI-powered business recommendations and impact tracking.', 'ai', 2),
  ('tasks', 'Tasks', 'Full task management with priority, time tracking, and campaigns.', 'core', 3),
  ('calendar', 'Calendar', 'Schedule and manage events, bookings, and reminders.', 'core', 4),
  ('relationships', 'Relationships', 'Customer CRM with portfolio analytics and relationship DNA.', 'core', 5),
  ('communications', 'Communications', 'Unified communications with response intelligence.', 'core', 6),
  ('reviews', 'Reviews', 'Review management, reputation DNA, and platform connections.', 'core', 7),
  ('intelligence', 'Business Intelligence', 'Evidence-led business intelligence with discoveries and predictions.', 'ai', 8),
  ('insights', 'Insights', 'Workspace evidence insights and activity patterns.', 'ai', 9),
  ('goals', 'Goals', 'Business goal tracking and progress measurement.', 'core', 10),
  ('website', 'Website', 'Website performance audit and conversion analysis.', 'growth', 11),
  ('integrations', 'Integrations', 'Third-party tool connections and data sync.', 'growth', 12),
  ('admin_console', 'Admin Console', 'Platform-level control plane for managing businesses, users, and features.', 'enterprise', 13),
  ('business_dna', 'Business DNA', 'Advanced DNA modules for deep business analysis.', 'ai', 14),
  ('advanced_ai', 'Advanced AI', 'Higher AI credit allowance and advanced AI features.', 'ai', 15)
ON CONFLICT (key) DO NOTHING;

-- 4. plan_feature_entitlements

CREATE TABLE IF NOT EXISTS public.plan_feature_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.platform_plans(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES public.feature_definitions(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_plan_feature UNIQUE (plan_id, feature_id)
);

CREATE INDEX IF NOT EXISTS pfe_plan_id_idx ON public.plan_feature_entitlements(plan_id);
CREATE INDEX IF NOT EXISTS pfe_feature_id_idx ON public.plan_feature_entitlements(feature_id);

ALTER TABLE public.plan_feature_entitlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_plan_entitlements" ON public.plan_feature_entitlements;
CREATE POLICY "authenticated_select_plan_entitlements" ON public.plan_feature_entitlements FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "platform_admin_insert_plan_entitlements" ON public.plan_feature_entitlements;
CREATE POLICY "platform_admin_insert_plan_entitlements" ON public.plan_feature_entitlements FOR INSERT
  TO authenticated WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_update_plan_entitlements" ON public.plan_feature_entitlements;
CREATE POLICY "platform_admin_update_plan_entitlements" ON public.plan_feature_entitlements FOR UPDATE
  TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_delete_plan_entitlements" ON public.plan_feature_entitlements;
CREATE POLICY "platform_admin_delete_plan_entitlements" ON public.plan_feature_entitlements FOR DELETE
  TO authenticated USING (public.is_platform_admin());

INSERT INTO public.plan_feature_entitlements (plan_id, feature_id, is_enabled)
SELECT p.id, f.id, true FROM public.platform_plans p, public.feature_definitions f
WHERE p.name = 'starter' AND f.key IN ('command_centre','business_advisor','tasks','calendar','relationships','communications','reviews','intelligence','insights','goals')
ON CONFLICT (plan_id, feature_id) DO NOTHING;

INSERT INTO public.plan_feature_entitlements (plan_id, feature_id, is_enabled)
SELECT p.id, f.id, true FROM public.platform_plans p, public.feature_definitions f
WHERE p.name = 'growth' AND f.key IN ('command_centre','business_advisor','tasks','calendar','relationships','communications','reviews','intelligence','insights','goals','website','integrations','business_dna','advanced_ai')
ON CONFLICT (plan_id, feature_id) DO NOTHING;

INSERT INTO public.plan_feature_entitlements (plan_id, feature_id, is_enabled)
SELECT p.id, f.id, true FROM public.platform_plans p, public.feature_definitions f
WHERE p.name = 'enterprise'
ON CONFLICT (plan_id, feature_id) DO NOTHING;

-- 5. business_feature_overrides

CREATE TABLE IF NOT EXISTS public.business_feature_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES public.feature_definitions(id) ON DELETE CASCADE,
  override_type TEXT NOT NULL DEFAULT 'enable',
  reason TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_business_feature_override UNIQUE (business_id, feature_id)
);

CREATE INDEX IF NOT EXISTS bfo_business_id_idx ON public.business_feature_overrides(business_id);

ALTER TABLE public.business_feature_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_feature_overrides" ON public.business_feature_overrides;
CREATE POLICY "members_select_feature_overrides" ON public.business_feature_overrides FOR SELECT
  TO authenticated USING (
    public.is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.business_id = business_feature_overrides.business_id
        AND memberships.user_id = auth.uid()
        AND memberships.status = 'active'
    )
  );

DROP POLICY IF EXISTS "platform_admin_insert_feature_overrides" ON public.business_feature_overrides;
CREATE POLICY "platform_admin_insert_feature_overrides" ON public.business_feature_overrides FOR INSERT
  TO authenticated WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_update_feature_overrides" ON public.business_feature_overrides;
CREATE POLICY "platform_admin_update_feature_overrides" ON public.business_feature_overrides FOR UPDATE
  TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_delete_feature_overrides" ON public.business_feature_overrides;
CREATE POLICY "platform_admin_delete_feature_overrides" ON public.business_feature_overrides FOR DELETE
  TO authenticated USING (public.is_platform_admin());

-- 6. admin_audit_events

CREATE TABLE IF NOT EXISTS public.admin_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  target_label TEXT,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_actor_idx ON public.admin_audit_events(actor_id);
CREATE INDEX IF NOT EXISTS admin_audit_action_idx ON public.admin_audit_events(action);
CREATE INDEX IF NOT EXISTS admin_audit_target_idx ON public.admin_audit_events(target_type, target_id);
CREATE INDEX IF NOT EXISTS admin_audit_business_idx ON public.admin_audit_events(business_id);
CREATE INDEX IF NOT EXISTS admin_audit_created_idx ON public.admin_audit_events(created_at DESC);

ALTER TABLE public.admin_audit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "platform_admin_select_audit" ON public.admin_audit_events;
CREATE POLICY "platform_admin_select_audit" ON public.admin_audit_events FOR SELECT
  TO authenticated USING (public.is_platform_admin());

DROP POLICY IF EXISTS "authenticated_insert_audit" ON public.admin_audit_events;
CREATE POLICY "authenticated_insert_audit" ON public.admin_audit_events FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = actor_id);

-- 7. enterprise_leads

CREATE TABLE IF NOT EXISTS public.enterprise_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  business_name TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'admin_console_preview',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enterprise_leads_user_idx ON public.enterprise_leads(user_id);
CREATE INDEX IF NOT EXISTS enterprise_leads_business_idx ON public.enterprise_leads(business_id);
CREATE INDEX IF NOT EXISTS enterprise_leads_status_idx ON public.enterprise_leads(status);

ALTER TABLE public.enterprise_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_insert_enterprise_lead" ON public.enterprise_leads;
CREATE POLICY "authenticated_insert_enterprise_lead" ON public.enterprise_leads FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_or_admin_enterprise_leads" ON public.enterprise_leads;
CREATE POLICY "select_own_or_admin_enterprise_leads" ON public.enterprise_leads FOR SELECT
  TO authenticated USING (
    public.is_platform_admin() OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "platform_admin_update_enterprise_leads" ON public.enterprise_leads;
CREATE POLICY "platform_admin_update_enterprise_leads" ON public.enterprise_leads FOR UPDATE
  TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

-- 8. enterprise_accounts (future white-label/reseller hierarchy)

CREATE TABLE IF NOT EXISTS public.enterprise_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_name TEXT,
  parent_enterprise_id UUID REFERENCES public.enterprise_accounts(id) ON DELETE SET NULL,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES public.platform_plans(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
  is_reseller BOOLEAN NOT NULL DEFAULT false,
  white_label_name TEXT,
  white_label_logo_url TEXT,
  custom_domain TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enterprise_accounts_admin_idx ON public.enterprise_accounts(admin_user_id);
CREATE INDEX IF NOT EXISTS enterprise_accounts_parent_idx ON public.enterprise_accounts(parent_enterprise_id);

ALTER TABLE public.enterprise_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_or_enterprise_admin_select" ON public.enterprise_accounts;
CREATE POLICY "admin_or_enterprise_admin_select" ON public.enterprise_accounts FOR SELECT
  TO authenticated USING (
    public.is_platform_admin()
    OR admin_user_id = auth.uid()
  );

DROP POLICY IF EXISTS "platform_admin_insert_enterprise" ON public.enterprise_accounts;
CREATE POLICY "platform_admin_insert_enterprise" ON public.enterprise_accounts FOR INSERT
  TO authenticated WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_update_enterprise" ON public.enterprise_accounts;
CREATE POLICY "platform_admin_update_enterprise" ON public.enterprise_accounts FOR UPDATE
  TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_admin_delete_enterprise" ON public.enterprise_accounts;
CREATE POLICY "platform_admin_delete_enterprise" ON public.enterprise_accounts FOR DELETE
  TO authenticated USING (public.is_platform_admin());
