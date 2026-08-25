-- Task Business Impact Migration
-- Adds target_metric column to public.tasks to support the authoritative business impact model.

ALTER TABLE public.tasks
    ADD COLUMN IF NOT EXISTS target_metric text DEFAULT 'none';

COMMENT ON COLUMN public.tasks.target_metric IS 'Measurable business outcome target: revenue, cash_collection, customer_retention, reviews_reputation, response_time, conversion, operational_efficiency, automation_time_saved, or none';
