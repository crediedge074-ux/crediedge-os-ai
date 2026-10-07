/*
# Add communication actions and resolution audit

1. New Tables
- `communication_actions`
- `id` (uuid primary key)
- `business_id` (uuid workspace owner)
- `communication_id` (uuid communication being acted on)
- `customer_id` (uuid customer context, nullable)
- `status` (text action state such as resolved or noted)
- `action_taken` (text user-entered outcome, nullable)
- `notes` (text user-entered context, nullable)
- `manual_channel` (text channel used outside an integration, nullable)
- `resolved_at` (timestamp when the item was resolved, nullable)
- `resolved_by` (authenticated actor, nullable)
- `created_at` (timestamp)

2. Security
- Row level security is enabled.
- Select, insert, update, and delete are limited to active members of the same workspace.
- Resolution actor and workspace fields are checked against the authenticated membership context.

3. Integrity
- A communication can have one current action record, enforced by a unique index.
- Foreign keys preserve workspace, communication, and customer relationships without changing existing data.
*/

CREATE TABLE IF NOT EXISTS public.communication_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  communication_id uuid NOT NULL REFERENCES public.communications(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'resolved',
  action_taken text,
  notes text,
  manual_channel text,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT communication_actions_status_check CHECK (status IN ('resolved', 'noted'))
);

CREATE UNIQUE INDEX IF NOT EXISTS communication_actions_communication_id_key
  ON public.communication_actions (communication_id);

CREATE INDEX IF NOT EXISTS communication_actions_business_id_idx
  ON public.communication_actions (business_id);

ALTER TABLE public.communication_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members_select_communication_actions" ON public.communication_actions;
CREATE POLICY "members_select_communication_actions"
ON public.communication_actions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.business_id = communication_actions.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "members_insert_communication_actions" ON public.communication_actions;
CREATE POLICY "members_insert_communication_actions"
ON public.communication_actions FOR INSERT
TO authenticated
WITH CHECK (
  resolved_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.business_id = communication_actions.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
  AND EXISTS (
    SELECT 1 FROM public.communications
    WHERE communications.id = communication_actions.communication_id
      AND communications.business_id = communication_actions.business_id
      AND (communication_actions.customer_id IS NULL OR communications.customer_id = communication_actions.customer_id)
  )
);

DROP POLICY IF EXISTS "members_update_communication_actions" ON public.communication_actions;
CREATE POLICY "members_update_communication_actions"
ON public.communication_actions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.business_id = communication_actions.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
)
WITH CHECK (
  resolved_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.business_id = communication_actions.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);

DROP POLICY IF EXISTS "members_delete_communication_actions" ON public.communication_actions;
CREATE POLICY "members_delete_communication_actions"
ON public.communication_actions FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.business_id = communication_actions.business_id
      AND memberships.user_id = auth.uid()
      AND memberships.status = 'active'
  )
);