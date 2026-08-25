-- ── TASK ESTIMATED DURATION & ESTIMATED IMPACT EXTENSIONS ────────────────

ALTER TABLE public.tasks
    ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER DEFAULT 30,
    ADD COLUMN IF NOT EXISTS estimated_impact_value NUMERIC(12, 2) DEFAULT 0;

CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks(business_id, due_date);
