CREATE POLICY "Deny all direct access to orders"
ON public.orders
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all direct access to order_items"
ON public.order_items
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all direct access to download_tokens"
ON public.download_tokens
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all direct access to payment_events"
ON public.payment_events
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);