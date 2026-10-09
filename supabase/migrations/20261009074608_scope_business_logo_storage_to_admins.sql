/*
# Scope business logo uploads to owners and admins of that business

1. Security changes
   - The three write policies on the `business-logos` bucket previously tested
     only `bucket_id = 'business-logos'`, so any signed-in user could replace or
     delete any company's logo by guessing the path.
   - They now require the first folder segment of the object name to be a
     business the caller is an active owner or admin of, matching the path
     convention the app already writes (`<business id>/logo-<timestamp>.<ext>`).

2. Important notes
   1. Public read access is intentional and is left unchanged, because logos are
      rendered from public URLs.
   2. A malformed path (no folder segment, or a segment that is not a uuid) is
      rejected rather than erroring, via a regex guard before the cast.
*/

DROP POLICY IF EXISTS "auth_upload_business_logos" ON storage.objects;
CREATE POLICY "auth_upload_business_logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-logos'
  AND (storage.foldername(name))[1] ~ '^[0-9a-fA-F-]{36}$'
  AND EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.business_id = ((storage.foldername(name))[1])::uuid
      AND m.user_id = auth.uid()
      AND m.status = 'active'
      AND m.role IN ('owner', 'admin')
  )
);

DROP POLICY IF EXISTS "auth_update_business_logos" ON storage.objects;
CREATE POLICY "auth_update_business_logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business-logos'
  AND (storage.foldername(name))[1] ~ '^[0-9a-fA-F-]{36}$'
  AND EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.business_id = ((storage.foldername(name))[1])::uuid
      AND m.user_id = auth.uid()
      AND m.status = 'active'
      AND m.role IN ('owner', 'admin')
  )
)
WITH CHECK (
  bucket_id = 'business-logos'
  AND (storage.foldername(name))[1] ~ '^[0-9a-fA-F-]{36}$'
  AND EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.business_id = ((storage.foldername(name))[1])::uuid
      AND m.user_id = auth.uid()
      AND m.status = 'active'
      AND m.role IN ('owner', 'admin')
  )
);

DROP POLICY IF EXISTS "auth_delete_business_logos" ON storage.objects;
CREATE POLICY "auth_delete_business_logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-logos'
  AND (storage.foldername(name))[1] ~ '^[0-9a-fA-F-]{36}$'
  AND EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.business_id = ((storage.foldername(name))[1])::uuid
      AND m.user_id = auth.uid()
      AND m.status = 'active'
      AND m.role IN ('owner', 'admin')
  )
);
