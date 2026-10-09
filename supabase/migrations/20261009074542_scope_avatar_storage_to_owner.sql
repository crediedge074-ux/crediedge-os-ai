/*
# Scope avatar uploads to the user who owns them

1. Security changes
   - The three write policies on the `avatars` bucket previously tested only
     `bucket_id = 'avatars'`, so any signed-in user could upsert or delete any
     other user's avatar by guessing the path.
   - They now additionally require the first folder segment of the object name
     to equal the caller's own user id, which is the path convention the app
     already writes (`<user id>/avatar-<timestamp>.<ext>`).

2. Important notes
   1. Public read access is intentional and is left unchanged, because avatars
      are rendered from public URLs.
*/

DROP POLICY IF EXISTS "auth_upload_avatars" ON storage.objects;
CREATE POLICY "auth_upload_avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "auth_update_avatars" ON storage.objects;
CREATE POLICY "auth_update_avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "auth_delete_avatars" ON storage.objects;
CREATE POLICY "auth_delete_avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
