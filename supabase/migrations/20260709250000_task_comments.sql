-- ── TASK COMMENTS & REACTIONS SCHEMA ───────────────────────────────────

CREATE TABLE IF NOT EXISTS public.task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.task_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.task_comment_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    comment_id UUID NOT NULL REFERENCES public.task_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(comment_id, user_id, emoji)
);

-- Enable RLS
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comment_reactions ENABLE ROW LEVEL SECURITY;

-- Multi-Tenant RLS Policies for task_comments
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'task_comments' AND policyname = 'Users can view comments for active business'
    ) THEN
        CREATE POLICY "Users can view comments for active business"
            ON public.task_comments FOR SELECT
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
        WHERE tablename = 'task_comments' AND policyname = 'Users can create comments for active business'
    ) THEN
        CREATE POLICY "Users can create comments for active business"
            ON public.task_comments FOR INSERT
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
        WHERE tablename = 'task_comments' AND policyname = 'Users can update own comments for active business'
    ) THEN
        CREATE POLICY "Users can update own comments for active business"
            ON public.task_comments FOR UPDATE
            TO authenticated
            USING (
                user_id = auth.uid() AND
                business_id IN (
                    SELECT business_id FROM public.memberships
                    WHERE user_id = auth.uid() AND status = 'active'
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'task_comments' AND policyname = 'Users can delete own comments for active business'
    ) THEN
        CREATE POLICY "Users can delete own comments for active business"
            ON public.task_comments FOR DELETE
            TO authenticated
            USING (
                user_id = auth.uid() AND
                business_id IN (
                    SELECT business_id FROM public.memberships
                    WHERE user_id = auth.uid() AND status = 'active'
                )
            );
    END IF;
END $$;

-- Multi-Tenant RLS Policies for task_comment_reactions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'task_comment_reactions' AND policyname = 'Users can view reactions for active business'
    ) THEN
        CREATE POLICY "Users can view reactions for active business"
            ON public.task_comment_reactions FOR SELECT
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
        WHERE tablename = 'task_comment_reactions' AND policyname = 'Users can toggle reactions for active business'
    ) THEN
        CREATE POLICY "Users can toggle reactions for active business"
            ON public.task_comment_reactions FOR ALL
            TO authenticated
            USING (
                user_id = auth.uid() AND
                business_id IN (
                    SELECT business_id FROM public.memberships
                    WHERE user_id = auth.uid() AND status = 'active'
                )
            );
    END IF;
END $$;
