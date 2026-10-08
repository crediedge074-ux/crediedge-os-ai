/*
# Integration Sync Logs

## Purpose
Creates a `integration_sync_logs` table to record real sync attempts for the Integrations Hub.
This enables the Sync History section to display genuine sync records instead of fabricated data.

## New Tables

### integration_sync_logs
- `id` (uuid, PK) — unique sync log identifier
- `business_id` (uuid, NOT NULL) — workspace scope
- `integration_id` (uuid) — FK to integrations table, nullable for deleted integrations
- `provider` (text, NOT NULL) — provider name (e.g. "google_analytics")
- `status` (text, NOT NULL) — "success" | "failed" | "partial"
- `started_at` (timestamptz, NOT NULL, default now()) — sync start time
- `completed_at` (timestamptz) — sync completion time
- `duration_ms` (integer) — duration in milliseconds
- `records_processed` (integer, default 0) — total records processed
- `records_created` (integer, default 0) — new records created
- `records_updated` (integer, default 0) — existing records updated
- `records_failed` (integer, default 0) — records that failed
- `error_message` (text) — error details if status is "failed" or "partial"
- `metadata` (jsonb, default '{}') — additional sync metadata
- `created_at` (timestamptz, default now()) — record creation timestamp

## Security
- RLS enabled on `integration_sync_logs`
- 4 separate policies (SELECT, INSERT, UPDATE, DELETE) scoped to `authenticated` users
  via membership check on `business_id` through the `memberships` table
- Only users with an active membership for the same business can access sync logs

## Indexes
- Index on `business_id` for workspace-scoped queries
- Index on `integration_id` for per-integration history lookups
- Index on `started_at` (descending) for chronological sync history display

## Notes
1. This table is ready for real sync operations but will start empty — the Integrations Hub
   will show an honest empty state until real syncs occur.
2. The `provider` column is denormalized from integrations.provider to preserve history
   even if an integration row is deleted.
3. No data is fabricated or seeded.
*/

CREATE TABLE IF NOT EXISTS integration_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  integration_id uuid REFERENCES integrations(id) ON DELETE SET NULL,
  provider text NOT NULL,
  status text NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  duration_ms integer,
  records_processed integer NOT NULL DEFAULT 0,
  records_created integer NOT NULL DEFAULT 0,
  records_updated integer NOT NULL DEFAULT 0,
  records_failed integer NOT NULL DEFAULT 0,
  error_message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_integration_sync_logs" ON integration_sync_logs;
CREATE POLICY "members_select_integration_sync_logs"
ON integration_sync_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = integration_sync_logs.business_id
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "members_insert_integration_sync_logs" ON integration_sync_logs;
CREATE POLICY "members_insert_integration_sync_logs"
ON integration_sync_logs FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = integration_sync_logs.business_id
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "members_update_integration_sync_logs" ON integration_sync_logs;
CREATE POLICY "members_update_integration_sync_logs"
ON integration_sync_logs FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = integration_sync_logs.business_id
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = integration_sync_logs.business_id
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "members_delete_integration_sync_logs" ON integration_sync_logs;
CREATE POLICY "members_delete_integration_sync_logs"
ON integration_sync_logs FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = integration_sync_logs.business_id
    AND memberships.user_id = auth.uid()
    AND memberships.status = 'active'
  )
);

CREATE INDEX IF NOT EXISTS idx_integration_sync_logs_business_id ON integration_sync_logs(business_id);
CREATE INDEX IF NOT EXISTS idx_integration_sync_logs_integration_id ON integration_sync_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_sync_logs_started_at ON integration_sync_logs(started_at DESC);
