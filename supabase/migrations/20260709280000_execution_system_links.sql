-- ── EXECUTION SYSTEM ENTITY LINKS WITH AUTHORITATIVE COMPOSITE TENANT CONSTRAINTS ─────

-- 1. Ensure Composite Unique Constraints on referenced tables (id, business_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'customers_id_business_id_key'
    ) THEN
        ALTER TABLE public.customers ADD CONSTRAINT customers_id_business_id_key UNIQUE (id, business_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'jobs_id_business_id_key'
    ) THEN
        ALTER TABLE public.jobs ADD CONSTRAINT jobs_id_business_id_key UNIQUE (id, business_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'invoices_id_business_id_key'
    ) THEN
        ALTER TABLE public.invoices ADD CONSTRAINT invoices_id_business_id_key UNIQUE (id, business_id);
    END IF;
END $$;

-- 2. CAMPAIGNS: Drop old standalone FKs and add composite FKs
ALTER TABLE public.campaigns
    ADD COLUMN IF NOT EXISTS customer_id UUID,
    ADD COLUMN IF NOT EXISTS job_id UUID,
    ADD COLUMN IF NOT EXISTS invoice_id UUID;

ALTER TABLE public.campaigns
    DROP CONSTRAINT IF EXISTS campaigns_customer_id_fkey,
    DROP CONSTRAINT IF EXISTS campaigns_job_id_fkey,
    DROP CONSTRAINT IF EXISTS campaigns_invoice_id_fkey,
    DROP CONSTRAINT IF EXISTS campaigns_customer_fk,
    DROP CONSTRAINT IF EXISTS campaigns_job_fk,
    DROP CONSTRAINT IF EXISTS campaigns_invoice_fk;

ALTER TABLE public.campaigns
    ADD CONSTRAINT campaigns_customer_fk
    FOREIGN KEY (customer_id, business_id)
    REFERENCES public.customers(id, business_id)
    ON DELETE SET NULL,
    ADD CONSTRAINT campaigns_job_fk
    FOREIGN KEY (job_id, business_id)
    REFERENCES public.jobs(id, business_id)
    ON DELETE SET NULL,
    ADD CONSTRAINT campaigns_invoice_fk
    FOREIGN KEY (invoice_id, business_id)
    REFERENCES public.invoices(id, business_id)
    ON DELETE SET NULL;

-- 3. MISSIONS: Drop old standalone FKs and add composite FKs
ALTER TABLE public.missions
    ADD COLUMN IF NOT EXISTS customer_id UUID,
    ADD COLUMN IF NOT EXISTS job_id UUID,
    ADD COLUMN IF NOT EXISTS invoice_id UUID;

ALTER TABLE public.missions
    DROP CONSTRAINT IF EXISTS missions_customer_id_fkey,
    DROP CONSTRAINT IF EXISTS missions_job_id_fkey,
    DROP CONSTRAINT IF EXISTS missions_invoice_id_fkey,
    DROP CONSTRAINT IF EXISTS missions_customer_fk,
    DROP CONSTRAINT IF EXISTS missions_job_fk,
    DROP CONSTRAINT IF EXISTS missions_invoice_fk;

ALTER TABLE public.missions
    ADD CONSTRAINT missions_customer_fk
    FOREIGN KEY (customer_id, business_id)
    REFERENCES public.customers(id, business_id)
    ON DELETE SET NULL,
    ADD CONSTRAINT missions_job_fk
    FOREIGN KEY (job_id, business_id)
    REFERENCES public.jobs(id, business_id)
    ON DELETE SET NULL,
    ADD CONSTRAINT missions_invoice_fk
    FOREIGN KEY (invoice_id, business_id)
    REFERENCES public.invoices(id, business_id)
    ON DELETE SET NULL;

-- 4. TASKS: Drop old standalone FKs and add composite FKs
ALTER TABLE public.tasks
    ADD COLUMN IF NOT EXISTS customer_id UUID,
    ADD COLUMN IF NOT EXISTS job_id UUID,
    ADD COLUMN IF NOT EXISTS invoice_id UUID;

ALTER TABLE public.tasks
    DROP CONSTRAINT IF EXISTS tasks_customer_id_fkey,
    DROP CONSTRAINT IF EXISTS tasks_job_id_fkey,
    DROP CONSTRAINT IF EXISTS tasks_invoice_id_fkey,
    DROP CONSTRAINT IF EXISTS tasks_customer_fk,
    DROP CONSTRAINT IF EXISTS tasks_job_fk,
    DROP CONSTRAINT IF EXISTS tasks_invoice_fk;

ALTER TABLE public.tasks
    ADD CONSTRAINT tasks_customer_fk
    FOREIGN KEY (customer_id, business_id)
    REFERENCES public.customers(id, business_id)
    ON DELETE SET NULL,
    ADD CONSTRAINT tasks_job_fk
    FOREIGN KEY (job_id, business_id)
    REFERENCES public.jobs(id, business_id)
    ON DELETE SET NULL,
    ADD CONSTRAINT tasks_invoice_fk
    FOREIGN KEY (invoice_id, business_id)
    REFERENCES public.invoices(id, business_id)
    ON DELETE SET NULL;

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS campaigns_customer_id_idx ON public.campaigns(business_id, customer_id);
CREATE INDEX IF NOT EXISTS campaigns_job_id_idx ON public.campaigns(business_id, job_id);
CREATE INDEX IF NOT EXISTS campaigns_invoice_id_idx ON public.campaigns(business_id, invoice_id);

CREATE INDEX IF NOT EXISTS missions_customer_id_idx ON public.missions(business_id, customer_id);
CREATE INDEX IF NOT EXISTS missions_job_id_idx ON public.missions(business_id, job_id);
CREATE INDEX IF NOT EXISTS missions_invoice_id_idx ON public.missions(business_id, invoice_id);

CREATE INDEX IF NOT EXISTS tasks_customer_id_idx ON public.tasks(business_id, customer_id);
CREATE INDEX IF NOT EXISTS tasks_job_id_idx ON public.tasks(business_id, job_id);
CREATE INDEX IF NOT EXISTS tasks_invoice_id_idx ON public.tasks(business_id, invoice_id);
