-- ── EXECUTION SYSTEM ENTITY LINKS ─────────────────────────────────────

ALTER TABLE public.campaigns
    ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;

ALTER TABLE public.missions
    ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS campaigns_customer_id_idx ON public.campaigns(business_id, customer_id);
CREATE INDEX IF NOT EXISTS campaigns_job_id_idx ON public.campaigns(business_id, job_id);
CREATE INDEX IF NOT EXISTS missions_customer_id_idx ON public.missions(business_id, customer_id);
CREATE INDEX IF NOT EXISTS missions_job_id_idx ON public.missions(business_id, job_id);
