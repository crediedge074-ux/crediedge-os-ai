-- Calendar Foundation & Task Scheduling Migration
-- Adds scheduled_start and scheduled_end to tasks
-- Adds provider integration columns to calendar_events with RLS and composite FK protections
-- Forces PostgREST schema cache reload

ALTER TABLE public.tasks
    ADD COLUMN IF NOT EXISTS scheduled_start timestamptz,
    ADD COLUMN IF NOT EXISTS scheduled_end timestamptz;

COMMENT ON COLUMN public.tasks.scheduled_start IS 'Timestamp when work on the task is scheduled to begin';
COMMENT ON COLUMN public.tasks.scheduled_end IS 'Timestamp when work on the task is scheduled to conclude';

CREATE INDEX IF NOT EXISTS tasks_scheduled_times_idx ON public.tasks(business_id, scheduled_start, scheduled_end);

ALTER TABLE public.calendar_events
    ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'internal',
    ADD COLUMN IF NOT EXISTS external_event_id text,
    ADD COLUMN IF NOT EXISTS external_calendar_id text,
    ADD COLUMN IF NOT EXISTS sync_status text NOT NULL DEFAULT 'synced',
    ADD COLUMN IF NOT EXISTS last_synced_at timestamptz;

COMMENT ON COLUMN public.calendar_events.provider IS 'Calendar provider: internal, google, microsoft, apple';
COMMENT ON COLUMN public.calendar_events.sync_status IS 'Synchronization status: synced, pending, error';

CREATE INDEX IF NOT EXISTS calendar_events_task_id_idx ON public.calendar_events(business_id, task_id);
CREATE INDEX IF NOT EXISTS calendar_events_provider_idx ON public.calendar_events(business_id, provider, external_event_id);

-- Re-assert Row Level Security (RLS) policies for calendar_events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_calendar_events" ON public.calendar_events;
CREATE POLICY "members_select_calendar_events" ON public.calendar_events FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = calendar_events.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_calendar_events" ON public.calendar_events;
CREATE POLICY "members_insert_calendar_events" ON public.calendar_events FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = calendar_events.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_calendar_events" ON public.calendar_events;
CREATE POLICY "members_update_calendar_events" ON public.calendar_events FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = calendar_events.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = calendar_events.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_calendar_events" ON public.calendar_events;
CREATE POLICY "members_delete_calendar_events" ON public.calendar_events FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = calendar_events.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
