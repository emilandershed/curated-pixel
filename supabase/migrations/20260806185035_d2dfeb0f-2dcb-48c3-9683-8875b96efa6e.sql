ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email_error text;

CREATE TABLE public.rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bucket text NOT NULL,
  key text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX rate_limits_bucket_key_created_at_idx
  ON public.rate_limits (bucket, key, created_at DESC);

GRANT ALL ON public.rate_limits TO service_role;

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all direct access to rate_limits"
  ON public.rate_limits FOR ALL TO anon, authenticated
  USING (false) WITH CHECK (false);