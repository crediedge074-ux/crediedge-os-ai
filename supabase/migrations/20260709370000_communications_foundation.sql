-- ─── COMMUNICATIONS FOUNDATION MIGRATION ────────────────────────────────────

CREATE TABLE IF NOT EXISTS communication_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE, -- NULL for system-wide default templates
  title text NOT NULL,
  category text NOT NULL DEFAULT 'general', -- general, follow_up, review_request, payment_reminder, onboarding
  channel text NOT NULL DEFAULT 'email', -- email, sms, whatsapp
  subject text,
  body text NOT NULL,
  variables jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS communication_templates_business_id_idx ON communication_templates(business_id);

ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_communication_templates" ON communication_templates;
CREATE POLICY "select_communication_templates" ON communication_templates FOR SELECT TO authenticated
USING (
  business_id IS NULL OR
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = communication_templates.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "insert_communication_templates" ON communication_templates;
CREATE POLICY "insert_communication_templates" ON communication_templates FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = communication_templates.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "update_communication_templates" ON communication_templates;
CREATE POLICY "update_communication_templates" ON communication_templates FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = communication_templates.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = communication_templates.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "delete_communication_templates" ON communication_templates;
CREATE POLICY "delete_communication_templates" ON communication_templates FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.business_id = communication_templates.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);

-- Seed global default templates if they don't exist
INSERT INTO communication_templates (business_id, title, category, channel, subject, body, variables)
VALUES
  (
    NULL,
    'Service Follow-up',
    'follow_up',
    'email',
    'Following up on your recent service with {{business_name}}',
    'Hi {{customer_first_name}},\n\nThank you for choosing {{business_name}}. We wanted to follow up and see how everything is going with your recent service.\n\nPlease let us know if you have any questions or need further assistance!\n\nBest regards,\n{{business_name}}',
    '["customer_first_name", "business_name"]'::jsonb
  ),
  (
    NULL,
    'Review Request',
    'review_request',
    'email',
    'We value your feedback!',
    'Hi {{customer_first_name}},\n\nThank you for your business! We would love to hear about your experience with {{business_name}}.\n\nCould you take a moment to leave us a review?\n\nThank you,\n{{business_name}}',
    '["customer_first_name", "business_name"]'::jsonb
  ),
  (
    NULL,
    'Payment Reminder',
    'payment_reminder',
    'email',
    'Friendly Reminder: Invoice {{invoice_number}}',
    'Hi {{customer_first_name}},\n\nThis is a friendly reminder that invoice {{invoice_number}} from {{business_name}} is due soon.\n\nIf you have already settled this payment, please disregard this message.\n\nThank you,\n{{business_name}}',
    '["customer_first_name", "invoice_number", "business_name"]'::jsonb
  )
ON CONFLICT DO NOTHING;
