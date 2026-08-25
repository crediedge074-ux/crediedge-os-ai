-- ── TASK TIME ENTRIES & PRODUCTIVITY INTELLIGENCE SCHEMA ─────────────────

CREATE TABLE IF NOT EXISTS public.task_time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER DEFAULT 0,
    entry_type VARCHAR(50) NOT NULL DEFAULT 'manual', -- timer, manual, automated
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Index
CREATE INDEX IF NOT EXISTS task_time_entries_task_id_idx ON public.task_time_entries(business_id, task_id);
CREATE INDEX IF NOT EXISTS task_time_entries_user_id_idx ON public.task_time_entries(business_id, user_id);

-- Enable RLS
ALTER TABLE public.task_time_entries ENABLE ROW LEVEL SECURITY;

-- Multi-Tenant RLS Policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'task_time_entries' AND policyname = 'Users can view time entries for active business'
    ) THEN
        CREATE POLICY "Users can view time entries for active business"
            ON public.task_time_entries FOR SELECT
            TO authenticated
            USING (
                business_id IN (
                    SELECT business_id FROM public.memberships
                    WHERE user_id = auth.uid() AND status = 'active'
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'task_time_entries' AND policyname = 'Users can create time entries for active business'
    ) THEN
        CREATE POLICY "Users can create time entries for active business"
            ON public.task_time_entries FOR INSERT
            TO authenticated
            WITH CHECK (
                business_id IN (
                    SELECT business_id FROM public.memberships
                    WHERE user_id = auth.uid() AND status = 'active'
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'task_time_entries' AND policyname = 'Users can update time entries for active business'
    ) THEN
        CREATE POLICY "Users can update time entries for active business"
            ON public.task_time_entries FOR UPDATE
            TO authenticated
            USING (
                business_id IN (
                    SELECT business_id FROM public.memberships
                    WHERE user_id = auth.uid() AND status = 'active'
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'task_time_entries' AND policyname = 'Users can delete time entries for active business'
    ) THEN
        CREATE POLICY "Users can delete time entries for active business"
            ON public.task_time_entries FOR DELETE
            TO authenticated
            USING (
                business_id IN (
                    SELECT business_id FROM public.memberships
                    WHERE user_id = auth.uid() AND status = 'active'
                )
            );
    END IF;
END $$;
