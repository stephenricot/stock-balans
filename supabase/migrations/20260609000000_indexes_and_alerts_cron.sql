-- Performance indexes
CREATE INDEX IF NOT EXISTS inventory_business_name_idx
  ON public.inventory (business_id, name);

CREATE INDEX IF NOT EXISTS inventory_business_category_idx
  ON public.inventory (business_id, category)
  WHERE category IS NOT NULL;

-- Safety constraints
ALTER TABLE public.inventory
  ADD CONSTRAINT inventory_quantity_non_negative
    CHECK (quantity >= 0);

ALTER TABLE public.inventory
  ADD CONSTRAINT inventory_reorder_point_non_negative
    CHECK (reorder_point >= 0);

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_role_valid
    CHECK (role IN ('user-supplier', 'admin', 'super-admin'));

-- Schedule daily alert at 8am UTC (requires pg_cron extension enabled)
SELECT cron.schedule(
  'low-stock-alerts-daily',
  '0 8 * * *',
  $$
    SELECT net.http_post(
      url     := current_setting('app.supabase_url') || '/functions/v1/low-stock-alerts',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body    := '{}'::jsonb
    );
  $$
);
