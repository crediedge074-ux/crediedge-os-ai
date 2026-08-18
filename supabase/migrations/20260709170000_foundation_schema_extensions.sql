/*
# Foundation Schema Extensions for Multi-Tenant SaaS Operating System

## Summary
Completes the foundational data model for CrediEdgeOS as required by Step 1:
- `goals`
- `ai_recommendations`
- `ai_recommendation_outcomes`
- `business_metrics`
- `integrations`

## Features
- All tables have `business_id` and Row Level Security (RLS) policies linking access to active `memberships`.
- Extensible, unopinionated structure for AI recommendations, history/outcomes, goals, metrics, and third-party integrations.
*/

-- ─── 1. GOALS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  target_value numeric(12,2) NOT NULL DEFAULT 0,
  current_value numeric(12,2) NOT NULL DEFAULT 0,
  unit text DEFAULT '£', -- '£', '%', 'count', etc.
  category text DEFAULT 'revenue', -- revenue, review, efficiency, customer
  status text NOT NULL DEFAULT 'active', -- active, achieved, paused, cancelled
  start_date date DEFAULT CURRENT_DATE,
  target_date date,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS goals_business_id_idx ON goals(business_id);
CREATE INDEX IF NOT EXISTS goals_status_idx ON goals(business_id, status);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_goals" ON goals;
CREATE POLICY "members_select_goals" ON goals FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = goals.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_goals" ON goals;
CREATE POLICY "members_insert_goals" ON goals FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = goals.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_goals" ON goals;
CREATE POLICY "members_update_goals" ON goals FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = goals.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = goals.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_goals" ON goals;
CREATE POLICY "members_delete_goals" ON goals FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = goals.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── 2. AI RECOMMENDATIONS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'advisor', -- advisor, CRM, pricing, retention, scheduling
  title text NOT NULL,
  description text NOT NULL,
  action_type text, -- 'send_message', 'create_task', 'adjust_price', 'request_review'
  action_payload jsonb DEFAULT '{}'::jsonb,
  estimated_impact text, -- e.g. '+£780', '+12% conversion'
  impact_score integer DEFAULT 50, -- 1-100 impact priority score
  confidence_score integer DEFAULT 85, -- 1-100 AI confidence score
  status text NOT NULL DEFAULT 'pending', -- pending, accepted, dismissed, executed
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_recommendations_business_id_idx ON ai_recommendations(business_id);
CREATE INDEX IF NOT EXISTS ai_recommendations_status_idx ON ai_recommendations(business_id, status);

ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_ai_recommendations" ON ai_recommendations;
CREATE POLICY "members_select_ai_recommendations" ON ai_recommendations FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = ai_recommendations.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_ai_recommendations" ON ai_recommendations;
CREATE POLICY "members_insert_ai_recommendations" ON ai_recommendations FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = ai_recommendations.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_ai_recommendations" ON ai_recommendations;
CREATE POLICY "members_update_ai_recommendations" ON ai_recommendations FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = ai_recommendations.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = ai_recommendations.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_ai_recommendations" ON ai_recommendations;
CREATE POLICY "members_delete_ai_recommendations" ON ai_recommendations FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = ai_recommendations.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── 3. AI RECOMMENDATION OUTCOMES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_recommendation_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  recommendation_id uuid REFERENCES ai_recommendations(id) ON DELETE CASCADE,
  action_taken text NOT NULL, -- 'accepted', 'dismissed', 'modified'
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  result_metrics jsonb DEFAULT '{}'::jsonb, -- e.g. {"revenue_gained": 780, "review_stars": 5}
  feedback_notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_outcomes_business_id_idx ON ai_recommendation_outcomes(business_id);
CREATE INDEX IF NOT EXISTS ai_outcomes_rec_id_idx ON ai_recommendation_outcomes(recommendation_id);

ALTER TABLE ai_recommendation_outcomes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_ai_outcomes" ON ai_recommendation_outcomes;
CREATE POLICY "members_select_ai_outcomes" ON ai_recommendation_outcomes FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = ai_recommendation_outcomes.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_ai_outcomes" ON ai_recommendation_outcomes;
CREATE POLICY "members_insert_ai_outcomes" ON ai_recommendation_outcomes FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = ai_recommendation_outcomes.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── 4. BUSINESS METRICS / SCORES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS business_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  metric_date date NOT NULL DEFAULT CURRENT_DATE,
  crediedge_score integer DEFAULT 82,
  revenue_mtd numeric(12,2) DEFAULT 0,
  revenue_today numeric(12,2) DEFAULT 0,
  conversion_rate numeric(5,2) DEFAULT 0,
  avg_review_rating numeric(3,2) DEFAULT 5.0,
  response_time_minutes integer DEFAULT 18,
  active_customers_count integer DEFAULT 0,
  metrics_breakdown jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_business_metric_date UNIQUE (business_id, metric_date)
);

CREATE INDEX IF NOT EXISTS business_metrics_business_id_idx ON business_metrics(business_id);

ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_business_metrics" ON business_metrics;
CREATE POLICY "members_select_business_metrics" ON business_metrics FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = business_metrics.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_business_metrics" ON business_metrics;
CREATE POLICY "members_insert_business_metrics" ON business_metrics FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = business_metrics.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_business_metrics" ON business_metrics;
CREATE POLICY "members_update_business_metrics" ON business_metrics FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = business_metrics.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = business_metrics.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── 5. INTEGRATIONS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  provider text NOT NULL, -- e.g. 'stripe', 'google_calendar', 'whatsapp', 'quickbooks', 'xero'
  status text NOT NULL DEFAULT 'disconnected', -- connected, disconnected, error
  credentials_encrypted text,
  settings jsonb DEFAULT '{}'::jsonb,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_business_provider UNIQUE (business_id, provider)
);

CREATE INDEX IF NOT EXISTS integrations_business_id_idx ON integrations(business_id);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_integrations" ON integrations;
CREATE POLICY "members_select_integrations" ON integrations FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = integrations.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_integrations" ON integrations;
CREATE POLICY "members_insert_integrations" ON integrations FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = integrations.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_integrations" ON integrations;
CREATE POLICY "members_update_integrations" ON integrations FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = integrations.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = integrations.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_integrations" ON integrations;
CREATE POLICY "members_delete_integrations" ON integrations FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = integrations.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));
