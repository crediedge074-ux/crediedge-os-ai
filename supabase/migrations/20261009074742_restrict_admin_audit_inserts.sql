/*
# Restrict administration audit trail writes to platform admins

1. Security changes
   - The insert policy on `admin_audit_events` only required the row to name the
     caller as actor, so any signed-in user could write arbitrary entries into
     the record platform owners rely on when reviewing administrative activity.
   - The policy now also requires `is_platform_admin()`, matching the read
     policy on the same table.
*/

DROP POLICY IF EXISTS "authenticated_insert_audit" ON public.admin_audit_events;
CREATE POLICY "platform_admin_insert_audit"
ON public.admin_audit_events FOR INSERT
TO authenticated
WITH CHECK (is_platform_admin() AND auth.uid() = actor_id);
