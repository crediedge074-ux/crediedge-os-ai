-- Task Security & Assigned User Workspace Isolation Migration
-- Enforces database-level constraint that assigned_to on tasks MUST belong to the same business_id via memberships(user_id, business_id)
-- Re-asserts Row Level Security policies across execution layer tables

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'memberships_user_id_business_id_key'
    ) THEN
        ALTER TABLE public.memberships ADD CONSTRAINT memberships_user_id_business_id_key UNIQUE (user_id, business_id);
    END IF;
END $$;

ALTER TABLE public.tasks
    DROP CONSTRAINT IF EXISTS tasks_assigned_to_business_fk;

ALTER TABLE public.tasks
    ADD CONSTRAINT tasks_assigned_to_business_fk
    FOREIGN KEY (assigned_to, business_id)
    REFERENCES public.memberships(user_id, business_id)
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS tasks_assigned_to_business_idx ON public.tasks(business_id, assigned_to);

-- Re-assert Row Level Security (RLS) policies for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_tasks" ON public.tasks;
CREATE POLICY "members_select_tasks" ON public.tasks FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = tasks.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_tasks" ON public.tasks;
CREATE POLICY "members_insert_tasks" ON public.tasks FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = tasks.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_tasks" ON public.tasks;
CREATE POLICY "members_update_tasks" ON public.tasks FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = tasks.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = tasks.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_tasks" ON public.tasks;
CREATE POLICY "members_delete_tasks" ON public.tasks FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = tasks.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

NOTIFY pgrst, 'reload schema';
