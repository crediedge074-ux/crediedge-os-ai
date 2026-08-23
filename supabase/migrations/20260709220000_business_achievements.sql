-- ── PERSISTENT BUSINESS ACHIEVEMENTS SCHEMA ─────────────────────────

CREATE TABLE IF NOT EXISTS public.business_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    milestone_id VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value NUMERIC NOT NULL,
    achieved_value NUMERIC NOT NULL,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(business_id, milestone_id)
);

-- Enable RLS
ALTER TABLE public.business_achievements ENABLE ROW LEVEL SECURITY;

-- Multi-Tenant RLS Policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'business_achievements' AND policyname = 'Users can view business achievements for active business'
    ) THEN
        CREATE POLICY "Users can view business achievements for active business"
            ON public.business_achievements FOR SELECT
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
        WHERE tablename = 'business_achievements' AND policyname = 'Users can create business achievements for active business'
    ) THEN
        CREATE POLICY "Users can create business achievements for active business"
            ON public.business_achievements FOR INSERT
            TO authenticated
            WITH CHECK (
                business_id IN (
                    SELECT business_id FROM public.memberships
                    WHERE user_id = auth.uid() AND status = 'active'
                )
            );
    END IF;
END $$;
