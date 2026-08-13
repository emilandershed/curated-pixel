CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text,
  variant text,
  created_at timestamptz NOT NULL DEFAULT now(),
  email_sent_at timestamptz,
  email_error text
);

CREATE UNIQUE INDEX waitlist_signups_email_lower_idx ON public.waitlist_signups (lower(email));

GRANT ALL ON public.waitlist_signups TO service_role;

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all direct access to waitlist_signups"
ON public.waitlist_signups
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);