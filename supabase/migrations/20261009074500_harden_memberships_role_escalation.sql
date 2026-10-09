/*
# Harden memberships: prevent self-promotion to owner/admin

1. Security changes
   - Revoke INSERT/UPDATE privileges on the privileged membership columns
     (role, status, business_id, user_id) from the `authenticated` role, so a
     member can no longer rewrite their own row to grant themselves ownership.
   - Add `set_member_role(membership_id, new_role)`, a SECURITY DEFINER function
     that performs the legitimate "change a team member's role" action only when
     the caller is an active owner or admin of that same business, and which
     refuses to remove the last remaining owner.

2. Important notes
   1. Row level security is row scoped, not column scoped: the previous
      `USING (user_id = auth.uid())` UPDATE policy allowed every column of the
      caller's own row to be written, including `role`.
   2. No client code inserts membership rows, so revoking column INSERT
      privileges does not affect any existing feature.
*/

REVOKE INSERT (role, status, business_id, user_id) ON public.memberships FROM authenticated;
REVOKE UPDATE (role, status, business_id, user_id) ON public.memberships FROM authenticated;

CREATE OR REPLACE FUNCTION public.set_member_role(p_membership_id uuid, p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  v_business_id uuid;
  v_target_user uuid;
  v_current_role text;
  v_owner_count integer;
BEGIN
  IF p_role NOT IN ('owner', 'admin', 'member', 'viewer') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  SELECT business_id, user_id, role
    INTO v_business_id, v_target_user, v_current_role
  FROM public.memberships
  WHERE id = p_membership_id;

  IF v_business_id IS NULL THEN
    RAISE EXCEPTION 'Membership not found';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.business_id = v_business_id
      AND m.user_id = auth.uid()
      AND m.status = 'active'
      AND m.role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Not permitted';
  END IF;

  IF v_current_role = 'owner' AND p_role <> 'owner' THEN
    SELECT count(*) INTO v_owner_count
    FROM public.memberships
    WHERE business_id = v_business_id AND role = 'owner' AND status = 'active';
    IF v_owner_count <= 1 THEN
      RAISE EXCEPTION 'A business must keep at least one owner';
    END IF;
  END IF;

  UPDATE public.memberships
  SET role = p_role, updated_at = now()
  WHERE id = p_membership_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.set_member_role(uuid, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.set_member_role(uuid, text) TO authenticated;
