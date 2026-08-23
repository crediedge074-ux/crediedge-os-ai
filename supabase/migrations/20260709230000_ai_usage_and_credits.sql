-- ── AI USAGE LOGS & CREDIT ALLOWANCES SCHEMA ────────────────────────

CREATE TABLE IF NOT EXISTS public.ai_credit_allowances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE UNIQUE,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'starter',
    monthly_credit_allowance INTEGER NOT NULL DEFAULT 100,
    reset_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reset_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    complexity_tier VARCHAR(50) NOT NULL DEFAULT 'standard',
    credits_consumed INTEGER NOT NULL DEFAULT 1,
    request_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'completed',
    provider VARCHAR(50),
    model VARCHAR(100),
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    estimated_cost_gbp NUMERIC(10, 6),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_credit_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Multi-Tenant RLS Policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'ai_credit_allowances' AND policyname = 'Users can view AI allowances for active business'
    ) THEN
        CREATE POLICY "Users can view AI allowances for active business"
            ON public.ai_credit_allowances FOR SELECT
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
        WHERE tablename = 'ai_usage_logs' AND policyname = 'Users can view AI usage logs for active business'
    ) THEN
        CREATE POLICY "Users can view AI usage logs for active business"
            ON public.ai_usage_logs FOR SELECT
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
        WHERE tablename = 'ai_usage_logs' AND policyname = 'Users can create AI usage logs for active business'
    ) THEN
        CREATE POLICY "Users can create AI usage logs for active business"
            ON public.ai_usage_logs FOR INSERT
            TO authenticated
            WITH CHECK (
                business_id IN (
                    SELECT business_id FROM public.memberships
                    WHERE user_id = auth.uid() AND status = 'active'
                )
            );
    END IF;
END $$;
