-- ── CAMPAIGNS & MISSIONS SCHEMA ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'revenue',
    target_description VARCHAR(255),
    target_value NUMERIC(12, 2) DEFAULT 0,
    business_value NUMERIC(12, 2) DEFAULT 0,
    deadline TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    health VARCHAR(50) NOT NULL DEFAULT 'Good',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Link campaigns to tasks
ALTER TABLE public.tasks
    ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Multi-Tenant RLS Policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'campaigns' AND policyname = 'Users can view campaigns for active business'
    ) THEN
        CREATE POLICY "Users can view campaigns for active business"
            ON public.campaigns FOR SELECT
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
        WHERE tablename = 'campaigns' AND policyname = 'Users can create campaigns for active business'
    ) THEN
        CREATE POLICY "Users can create campaigns for active business"
            ON public.campaigns FOR INSERT
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
        WHERE tablename = 'campaigns' AND policyname = 'Users can update campaigns for active business'
    ) THEN
        CREATE POLICY "Users can update campaigns for active business"
            ON public.campaigns FOR UPDATE
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
        WHERE tablename = 'campaigns' AND policyname = 'Users can delete campaigns for active business'
    ) THEN
        CREATE POLICY "Users can delete campaigns for active business"
            ON public.campaigns FOR DELETE
            TO authenticated
            USING (
                business_id IN (
                    SELECT business_id FROM public.memberships
                    WHERE user_id = auth.uid() AND status = 'active'
                )
            );
    END IF;
END $$;
