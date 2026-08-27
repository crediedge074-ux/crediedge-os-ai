-- Migration: Create customer_memories table for AI Memory Architecture
-- Supports CONFIRMED, OBSERVED, and AI INTERPRETATION customer memory records.

CREATE TABLE IF NOT EXISTS public.customer_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('CONFIRMED', 'OBSERVED', 'AI INTERPRETATION')),
  statement TEXT NOT NULL,
  provenance TEXT NOT NULL DEFAULT 'CONNECTED',
  confidence_score NUMERIC(5, 2) DEFAULT NULL,
  supporting_records JSONB DEFAULT '[]'::jsonb,
  timeframe TEXT DEFAULT NULL,
  explanation TEXT DEFAULT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Foreign key with workspace isolation
  CONSTRAINT fk_customer_memories_workspace_customer
    FOREIGN KEY (customer_id, business_id)
    REFERENCES public.customers(id, business_id)
    ON DELETE CASCADE
);

-- Index for efficient customer and business query performance
CREATE INDEX IF NOT EXISTS idx_customer_memories_cust_biz ON public.customer_memories(customer_id, business_id);
CREATE INDEX IF NOT EXISTS idx_customer_memories_biz ON public.customer_memories(business_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.customer_memories ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Select customer memories within user's business membership
CREATE POLICY customer_memories_select ON public.customer_memories
  FOR SELECT
  USING (
    business_id IN (
      SELECT business_id FROM public.memberships WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Insert customer memories within user's business membership
CREATE POLICY customer_memories_insert ON public.customer_memories
  FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT business_id FROM public.memberships WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Update customer memories within user's business membership
CREATE POLICY customer_memories_update ON public.customer_memories
  FOR UPDATE
  USING (
    business_id IN (
      SELECT business_id FROM public.memberships WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Delete customer memories within user's business membership
CREATE POLICY customer_memories_delete ON public.customer_memories
  FOR DELETE
  USING (
    business_id IN (
      SELECT business_id FROM public.memberships WHERE user_id = auth.uid()
    )
  );

NOTIFY pgrst, 'reload schema';
