-- Migration: 20260709370000_communications_foundation.sql
-- Description: Create communication_templates table with multi-tenant RLS policies and default system seed templates

-- Create communication_templates table
CREATE TABLE IF NOT EXISTS public.communication_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  channel TEXT NOT NULL DEFAULT 'email',
  subject TEXT,
  body TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view system and workspace templates" ON public.communication_templates;
DROP POLICY IF EXISTS "Users can insert workspace templates" ON public.communication_templates;
DROP POLICY IF EXISTS "Users can update workspace templates" ON public.communication_templates;
DROP POLICY IF EXISTS "Users can delete workspace templates" ON public.communication_templates;

-- Policy 1: SELECT - Authenticated users can view global system templates (business_id IS NULL)
-- OR custom templates belonging to their active workspace membership.
CREATE POLICY "Users can view system and workspace templates"
  ON public.communication_templates
  FOR SELECT
  TO authenticated
  USING (
    business_id IS NULL
    OR business_id IN (
      SELECT business_id
      FROM public.memberships
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
  );

-- Policy 2: INSERT - Authenticated users can create templates for their active workspace membership.
CREATE POLICY "Users can insert workspace templates"
  ON public.communication_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    business_id IS NOT NULL
    AND business_id IN (
      SELECT business_id
      FROM public.memberships
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
  );

-- Policy 3: UPDATE - Authenticated users can update templates belonging to their active workspace membership.
CREATE POLICY "Users can update workspace templates"
  ON public.communication_templates
  FOR UPDATE
  TO authenticated
  USING (
    business_id IS NOT NULL
    AND business_id IN (
      SELECT business_id
      FROM public.memberships
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
  )
  WITH CHECK (
    business_id IS NOT NULL
    AND business_id IN (
      SELECT business_id
      FROM public.memberships
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
  );

-- Policy 4: DELETE - Authenticated users can delete custom templates belonging to their active workspace membership.
CREATE POLICY "Users can delete workspace templates"
  ON public.communication_templates
  FOR DELETE
  TO authenticated
  USING (
    business_id IS NOT NULL
    AND business_id IN (
      SELECT business_id
      FROM public.memberships
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
  );

-- Insert global system default templates if they don't already exist
INSERT INTO public.communication_templates (business_id, title, category, channel, subject, body)
SELECT NULL, 'General Follow-up', 'follow_up', 'email', 'Following up on our recent conversation', 'Hi {{first_name}},\n\nI wanted to follow up on our recent conversation regarding your service enquiry.\n\nPlease let us know if you have any questions or if we can assist you further.\n\nBest regards,\n{{business_name}}'
WHERE NOT EXISTS (
  SELECT 1 FROM public.communication_templates WHERE business_id IS NULL AND title = 'General Follow-up'
);

INSERT INTO public.communication_templates (business_id, title, category, channel, subject, body)
SELECT NULL, 'Appointment Confirmation', 'scheduling', 'email', 'Confirmation of your upcoming appointment', 'Dear {{first_name}},\n\nThis is a confirmation for your upcoming appointment scheduled with {{business_name}}.\n\nIf you need to reschedule, please notify us at your earliest convenience.\n\nThank you!'
WHERE NOT EXISTS (
  SELECT 1 FROM public.communication_templates WHERE business_id IS NULL AND title = 'Appointment Confirmation'
);

INSERT INTO public.communication_templates (business_id, title, category, channel, subject, body)
SELECT NULL, 'Payment Reminder', 'finance', 'email', 'Friendly reminder: Invoice {{invoice_number}}', 'Hello {{first_name}},\n\nThis is a friendly reminder that invoice {{invoice_number}} is currently due.\n\nPlease reach out if you need another copy of the invoice or assistance with payment options.\n\nKind regards,\n{{business_name}}'
WHERE NOT EXISTS (
  SELECT 1 FROM public.communication_templates WHERE business_id IS NULL AND title = 'Payment Reminder'
);

INSERT INTO public.communication_templates (business_id, title, category, channel, subject, body)
SELECT NULL, 'Customer Review Request', 'reputation', 'email', 'How was your experience with {{business_name}}?', 'Hi {{first_name}},\n\nThank you for choosing {{business_name}}! We would greatly appreciate it if you could spare 60 seconds to share your feedback with us.\n\nThank you for your support!'
WHERE NOT EXISTS (
  SELECT 1 FROM public.communication_templates WHERE business_id IS NULL AND title = 'Customer Review Request'
);
