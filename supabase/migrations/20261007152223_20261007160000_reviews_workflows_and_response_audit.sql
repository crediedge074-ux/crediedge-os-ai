/*
# Add Reviews workflow records and response metadata

1. New table: `review_requests`
- Stores user-created review request records separately from received reviews.
- Includes workspace, customer, job, platform, request message, verified route, and request status.
- This preserves the distinction between a request and a received review.

2. New table: `review_actions`
- Stores review priority completion and review workflow actions.
- Includes workspace, review, action type, notes, actor, and timestamps.
- Used to remove completed items from the active review queue without altering source reviews.

3. Modified table: `reviews`
- Adds `response_text`, `response_at`, `response_by`, and `external_url` for verified response metadata and platform links.
- Existing review records and source fields are preserved.

4. Security
- All new tables are workspace scoped through `business_id`.
- RLS is enabled on both new tables.
- Select, insert, update, and delete policies require an active membership in the row's business.
- Review response metadata remains covered by the existing workspace-scoped review policies.

5. Important notes
- No provider credentials or publishing capability are created by this migration.
- The application must only write response metadata after a provider confirms publication.
- Request records may be created by explicit user action; delivery remains dependent on a verified integration.
*/

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response_text text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response_at timestamptz;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS external_url text;

CREATE TABLE IF NOT EXISTS review_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  platform text NOT NULL,
  message text NOT NULL,
  request_url text,
  status text NOT NULL DEFAULT 'created',
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS review_requests_business_idx ON review_requests(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS review_requests_customer_idx ON review_requests(customer_id);

ALTER TABLE review_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members_select_review_requests" ON review_requests;
CREATE POLICY "members_select_review_requests" ON review_requests FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = review_requests.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));
DROP POLICY IF EXISTS "members_insert_review_requests" ON review_requests;
CREATE POLICY "members_insert_review_requests" ON review_requests FOR INSERT TO authenticated
WITH CHECK (created_by = auth.uid() AND EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = review_requests.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));
DROP POLICY IF EXISTS "members_update_review_requests" ON review_requests;
CREATE POLICY "members_update_review_requests" ON review_requests FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = review_requests.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = review_requests.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));
DROP POLICY IF EXISTS "members_delete_review_requests" ON review_requests;
CREATE POLICY "members_delete_review_requests" ON review_requests FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = review_requests.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

CREATE TABLE IF NOT EXISTS review_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  review_id uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  notes text,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS review_actions_review_action_idx ON review_actions(review_id, action_type);
CREATE INDEX IF NOT EXISTS review_actions_business_idx ON review_actions(business_id, created_at DESC);

ALTER TABLE review_actions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members_select_review_actions" ON review_actions;
CREATE POLICY "members_select_review_actions" ON review_actions FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = review_actions.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));
DROP POLICY IF EXISTS "members_insert_review_actions" ON review_actions;
CREATE POLICY "members_insert_review_actions" ON review_actions FOR INSERT TO authenticated
WITH CHECK (created_by = auth.uid() AND EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = review_actions.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active') AND EXISTS (SELECT 1 FROM reviews WHERE reviews.id = review_actions.review_id AND reviews.business_id = review_actions.business_id));
DROP POLICY IF EXISTS "members_update_review_actions" ON review_actions;
CREATE POLICY "members_update_review_actions" ON review_actions FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = review_actions.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = review_actions.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));
DROP POLICY IF EXISTS "members_delete_review_actions" ON review_actions;
CREATE POLICY "members_delete_review_actions" ON review_actions FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = review_actions.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));
