-- ── AI RECOMMENDATION SIGNALS & OUTCOME ENGINE EXTENSIONS ─────────────────────

ALTER TABLE public.ai_recommendations
    ADD COLUMN IF NOT EXISTS source_signals JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS expected_outcome JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS actual_outcome JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Enable RLS on outcomes if not already enabled
ALTER TABLE public.ai_recommendation_outcomes ENABLE ROW LEVEL SECURITY;

-- Multi-Tenant RLS Policies for Outcomes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'ai_recommendation_outcomes' AND policyname = 'Users can view recommendation outcomes for active business'
    ) THEN
        CREATE POLICY "Users can view recommendation outcomes for active business"
            ON public.ai_recommendation_outcomes FOR SELECT
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
        WHERE tablename = 'ai_recommendation_outcomes' AND policyname = 'Users can create recommendation outcomes for active business'
    ) THEN
        CREATE POLICY "Users can create recommendation outcomes for active business"
            ON public.ai_recommendation_outcomes FOR INSERT
            TO authenticated
            WITH CHECK (
                business_id IN (
                    SELECT business_id FROM public.memberships
                    WHERE user_id = auth.uid() AND status = 'active'
                )
            );
    END IF;
END $$;
