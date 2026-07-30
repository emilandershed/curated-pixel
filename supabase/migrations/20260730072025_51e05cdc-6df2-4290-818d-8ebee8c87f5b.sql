CREATE POLICY "Service role can manage album downloads"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'album-downloads')
WITH CHECK (bucket_id = 'album-downloads');

CREATE POLICY "No public reads on album downloads"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (false);