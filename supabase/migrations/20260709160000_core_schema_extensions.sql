/*
# Core Schema Extensions for CrediEdgeOS V1

## Summary
Adds missing core operational and customer intelligence tables required for the CrediEdgeOS Business Operating System V1:
- `jobs`
- `tasks`
- `calendar_events`
- `invoices`
- `payments`
- `communications`
- `reviews`
- `notifications`
- `activity_logs`

## Features
- Multi-tenant tenant isolation via `business_id` and RLS linked to `memberships`.
- Trigger on `payments` to auto-calculate `invoices.amount_paid` and update `invoices.status`.
- Foreign key protection using `ON DELETE SET NULL` on historical links (e.g. `tasks.job_id`).
- Shared `activity_logs` for unified cross-module customer and business timelines.
*/

-- ─── 1. JOBS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  job_number text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'scheduled', -- draft, scheduled, in_progress, completed, cancelled
  priority text NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  estimated_amount numeric(12,2) DEFAULT 0,
  target_start_date timestamptz,
  target_completion_date timestamptz,
  completed_at timestamptz,
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS jobs_business_id_idx ON jobs(business_id);
CREATE INDEX IF NOT EXISTS jobs_customer_id_idx ON jobs(customer_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(business_id, status);
CREATE INDEX IF NOT EXISTS jobs_assigned_to_idx ON jobs(business_id, assigned_to);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_jobs" ON jobs;
CREATE POLICY "members_select_jobs" ON jobs FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = jobs.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_jobs" ON jobs;
CREATE POLICY "members_insert_jobs" ON jobs FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = jobs.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_jobs" ON jobs;
CREATE POLICY "members_update_jobs" ON jobs FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = jobs.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = jobs.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_jobs" ON jobs;
CREATE POLICY "members_delete_jobs" ON jobs FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = jobs.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── 2. TASKS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo', -- todo, in_progress, review, completed
  priority text NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  due_date timestamptz,
  completed_at timestamptz,
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tasks_business_id_idx ON tasks(business_id);
CREATE INDEX IF NOT EXISTS tasks_customer_id_idx ON tasks(customer_id);
CREATE INDEX IF NOT EXISTS tasks_job_id_idx ON tasks(job_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(business_id, status);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_tasks" ON tasks;
CREATE POLICY "members_select_tasks" ON tasks FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = tasks.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_tasks" ON tasks;
CREATE POLICY "members_insert_tasks" ON tasks FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = tasks.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_tasks" ON tasks;
CREATE POLICY "members_update_tasks" ON tasks FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = tasks.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = tasks.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_tasks" ON tasks;
CREATE POLICY "members_delete_tasks" ON tasks FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = tasks.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── 3. CALENDAR EVENTS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  event_type text NOT NULL DEFAULT 'booking', -- booking, meeting, reminder, task, job
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  is_all_day boolean NOT NULL DEFAULT false,
  location text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS calendar_events_business_id_idx ON calendar_events(business_id);
CREATE INDEX IF NOT EXISTS calendar_events_times_idx ON calendar_events(business_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS calendar_events_job_id_idx ON calendar_events(job_id);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_calendar_events" ON calendar_events;
CREATE POLICY "members_select_calendar_events" ON calendar_events FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = calendar_events.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_calendar_events" ON calendar_events;
CREATE POLICY "members_insert_calendar_events" ON calendar_events FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = calendar_events.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_calendar_events" ON calendar_events;
CREATE POLICY "members_update_calendar_events" ON calendar_events FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = calendar_events.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = calendar_events.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_calendar_events" ON calendar_events;
CREATE POLICY "members_delete_calendar_events" ON calendar_events FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = calendar_events.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── 4. INVOICES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  invoice_number text NOT NULL,
  status text NOT NULL DEFAULT 'draft', -- draft, sent, partially_paid, paid, overdue, void
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  total_amount numeric(12,2) NOT NULL DEFAULT 0,
  amount_paid numeric(12,2) NOT NULL DEFAULT 0,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS invoices_business_id_idx ON invoices(business_id);
CREATE INDEX IF NOT EXISTS invoices_customer_id_idx ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(business_id, status);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_invoices" ON invoices;
CREATE POLICY "members_select_invoices" ON invoices FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = invoices.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_invoices" ON invoices;
CREATE POLICY "members_insert_invoices" ON invoices FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = invoices.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_invoices" ON invoices;
CREATE POLICY "members_update_invoices" ON invoices FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = invoices.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = invoices.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_invoices" ON invoices;
CREATE POLICY "members_delete_invoices" ON invoices FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = invoices.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── 5. PAYMENTS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'income', -- income, expense
  amount numeric(12,2) NOT NULL DEFAULT 0,
  payment_method text DEFAULT 'card', -- card, bank_transfer, cash, stripe, BACS
  payment_date timestamptz NOT NULL DEFAULT now(),
  reference text,
  description text,
  category text, -- job_revenue, supplies, payroll
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_business_id_idx ON payments(business_id);
CREATE INDEX IF NOT EXISTS payments_invoice_id_idx ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS payments_type_idx ON payments(business_id, type);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_payments" ON payments;
CREATE POLICY "members_select_payments" ON payments FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = payments.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_payments" ON payments;
CREATE POLICY "members_insert_payments" ON payments FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = payments.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_payments" ON payments;
CREATE POLICY "members_update_payments" ON payments FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = payments.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = payments.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_payments" ON payments;
CREATE POLICY "members_delete_payments" ON payments FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = payments.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── TRIGGER: UPDATE INVOICE AMOUNT PAID ─────────────────────────────────────
CREATE OR REPLACE FUNCTION sync_invoice_payments()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_invoice_id uuid;
  total_paid numeric(12,2);
  inv_total numeric(12,2);
BEGIN
  target_invoice_id := COALESCE(NEW.invoice_id, OLD.invoice_id);

  IF target_invoice_id IS NOT NULL THEN
    SELECT COALESCE(SUM(amount), 0) INTO total_paid
    FROM payments
    WHERE invoice_id = target_invoice_id AND type = 'income';

    SELECT total_amount INTO inv_total
    FROM invoices
    WHERE id = target_invoice_id;

    UPDATE invoices
    SET
      amount_paid = total_paid,
      status = CASE
        WHEN total_paid >= inv_total THEN 'paid'
        WHEN total_paid > 0 THEN 'partially_paid'
        ELSE status
      END,
      updated_at = now()
    WHERE id = target_invoice_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_sync_invoice_payments ON payments;
CREATE TRIGGER trigger_sync_invoice_payments
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION sync_invoice_payments();

-- ─── 6. COMMUNICATIONS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  channel text NOT NULL DEFAULT 'email', -- email, sms, whatsapp, phone, note
  direction text NOT NULL DEFAULT 'outbound', -- inbound, outbound
  subject text,
  body text NOT NULL,
  sentiment text DEFAULT 'neutral', -- positive, neutral, urgent, frustrated
  read_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS communications_business_id_idx ON communications(business_id);
CREATE INDEX IF NOT EXISTS communications_customer_id_idx ON communications(customer_id);

ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_communications" ON communications;
CREATE POLICY "members_select_communications" ON communications FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = communications.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_communications" ON communications;
CREATE POLICY "members_insert_communications" ON communications FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = communications.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_communications" ON communications;
CREATE POLICY "members_update_communications" ON communications FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = communications.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = communications.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_communications" ON communications;
CREATE POLICY "members_delete_communications" ON communications FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = communications.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── 7. REVIEWS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback text,
  source text DEFAULT 'internal', -- google, internal, direct
  status text NOT NULL DEFAULT 'requested', -- requested, submitted, published
  requested_at timestamptz DEFAULT now(),
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reviews_business_id_idx ON reviews(business_id);
CREATE INDEX IF NOT EXISTS reviews_customer_id_idx ON reviews(customer_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_reviews" ON reviews;
CREATE POLICY "members_select_reviews" ON reviews FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = reviews.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_reviews" ON reviews;
CREATE POLICY "members_insert_reviews" ON reviews FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = reviews.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_reviews" ON reviews;
CREATE POLICY "members_update_reviews" ON reviews FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = reviews.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = reviews.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_reviews" ON reviews;
CREATE POLICY "members_delete_reviews" ON reviews FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = reviews.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── 8. NOTIFICATIONS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info', -- info, warning, urgent, success, priority
  title text NOT NULL,
  message text NOT NULL,
  action_url text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_business_id_idx ON notifications(business_id);
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_notifications" ON notifications;
CREATE POLICY "members_select_notifications" ON notifications FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = notifications.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_notifications" ON notifications;
CREATE POLICY "members_insert_notifications" ON notifications FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = notifications.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_notifications" ON notifications;
CREATE POLICY "members_update_notifications" ON notifications FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = notifications.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = notifications.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_notifications" ON notifications;
CREATE POLICY "members_delete_notifications" ON notifications FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = notifications.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

-- ─── 9. ACTIVITY LOGS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  entity_type text NOT NULL, -- customer, job, invoice, task, communication, review
  entity_id uuid,
  action text NOT NULL, -- created, status_changed, payment_received, message_sent
  description text NOT NULL,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_logs_business_id_idx ON activity_logs(business_id);
CREATE INDEX IF NOT EXISTS activity_logs_customer_id_idx ON activity_logs(customer_id);
CREATE INDEX IF NOT EXISTS activity_logs_job_id_idx ON activity_logs(job_id);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_activity_logs" ON activity_logs;
CREATE POLICY "members_select_activity_logs" ON activity_logs FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = activity_logs.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_insert_activity_logs" ON activity_logs;
CREATE POLICY "members_insert_activity_logs" ON activity_logs FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = activity_logs.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_update_activity_logs" ON activity_logs;
CREATE POLICY "members_update_activity_logs" ON activity_logs FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = activity_logs.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'))
WITH CHECK (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = activity_logs.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));

DROP POLICY IF EXISTS "members_delete_activity_logs" ON activity_logs;
CREATE POLICY "members_delete_activity_logs" ON activity_logs FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.business_id = activity_logs.business_id AND memberships.user_id = auth.uid() AND memberships.status = 'active'));
