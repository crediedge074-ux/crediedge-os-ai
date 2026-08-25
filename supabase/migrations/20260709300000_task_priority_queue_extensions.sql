-- ── TASK PRIORITY QUEUE & RISK EXTENSIONS ────────────────────────────────

ALTER TABLE public.tasks
    ADD COLUMN IF NOT EXISTS risk_level VARCHAR(50) DEFAULT 'low',
    ADD COLUMN IF NOT EXISTS ai_context_notes TEXT;

CREATE INDEX IF NOT EXISTS tasks_priority_idx ON public.tasks(business_id, priority);
