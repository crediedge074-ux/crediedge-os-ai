/*
# Prevent users re-enabling their own account record

1. Security changes
   - Revoke INSERT and UPDATE on `profiles.is_active` from the `authenticated`
     role. The profile update policy is row scoped (`auth.uid() = id`), which
     meant a user whose account had been deactivated by an administrator could
     simply write `is_active = true` back onto their own row.

2. Important notes
   1. `is_active` is NOT NULL with a default of `true`, so profile creation on
      sign-up is unaffected.
   2. All other profile fields (names, phone, job title, avatar) remain
      self-editable exactly as before.
*/

REVOKE INSERT (is_active) ON public.profiles FROM authenticated;
REVOKE UPDATE (is_active) ON public.profiles FROM authenticated;
