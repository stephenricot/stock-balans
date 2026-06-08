
-- businesses
CREATE TABLE public.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'My Business',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- user_profiles
CREATE TABLE public.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user-supplier',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's business_id (security definer to avoid recursion)
CREATE OR REPLACE FUNCTION public.current_business_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT business_id FROM public.user_profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- inventory
CREATE TABLE public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  product_code text NOT NULL,
  name text NOT NULL,
  category text,
  quantity numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pcs',
  reorder_point numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, product_code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory TO authenticated;
GRANT ALL ON public.inventory TO service_role;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- outbound_logs
CREATE TABLE public.outbound_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  inventory_id uuid REFERENCES public.inventory(id) ON DELETE SET NULL,
  product_code text NOT NULL,
  product_name text NOT NULL,
  quantity_deducted numeric NOT NULL,
  reason text NOT NULL,
  remaining_stock numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outbound_logs TO authenticated;
GRANT ALL ON public.outbound_logs TO service_role;
ALTER TABLE public.outbound_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX outbound_logs_business_created_idx ON public.outbound_logs (business_id, created_at DESC);

-- RLS policies
CREATE POLICY "view own business" ON public.businesses
  FOR SELECT TO authenticated USING (id = public.current_business_id());
CREATE POLICY "update own business" ON public.businesses
  FOR UPDATE TO authenticated USING (id = public.current_business_id());

CREATE POLICY "view own profile" ON public.user_profiles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "select own inventory" ON public.inventory
  FOR SELECT TO authenticated USING (business_id = public.current_business_id());
CREATE POLICY "insert own inventory" ON public.inventory
  FOR INSERT TO authenticated WITH CHECK (business_id = public.current_business_id());
CREATE POLICY "update own inventory" ON public.inventory
  FOR UPDATE TO authenticated USING (business_id = public.current_business_id());
CREATE POLICY "delete own inventory" ON public.inventory
  FOR DELETE TO authenticated USING (business_id = public.current_business_id());

CREATE POLICY "select own outbound" ON public.outbound_logs
  FOR SELECT TO authenticated USING (business_id = public.current_business_id());
CREATE POLICY "insert own outbound" ON public.outbound_logs
  FOR INSERT TO authenticated WITH CHECK (business_id = public.current_business_id());

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER inventory_updated_at BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- New user trigger: create business + profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_business_id uuid;
BEGIN
  INSERT INTO public.businesses (name)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'))
  RETURNING id INTO new_business_id;

  INSERT INTO public.user_profiles (user_id, business_id, role)
  VALUES (NEW.id, new_business_id, 'user-supplier');

  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic deduction function
CREATE OR REPLACE FUNCTION public.deduct_inventory(
  p_inventory_id uuid,
  p_quantity numeric,
  p_reason text
)
RETURNS public.outbound_logs
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_business_id uuid := public.current_business_id();
  v_item public.inventory%ROWTYPE;
  v_log public.outbound_logs%ROWTYPE;
BEGIN
  IF v_business_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_quantity <= 0 THEN RAISE EXCEPTION 'Quantity must be positive'; END IF;

  SELECT * INTO v_item FROM public.inventory
    WHERE id = p_inventory_id AND business_id = v_business_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Product not found'; END IF;
  IF v_item.quantity < p_quantity THEN
    RAISE EXCEPTION 'Insufficient stock (available: %)', v_item.quantity;
  END IF;

  UPDATE public.inventory SET quantity = quantity - p_quantity
    WHERE id = p_inventory_id;

  INSERT INTO public.outbound_logs
    (business_id, inventory_id, product_code, product_name, quantity_deducted, reason, remaining_stock)
  VALUES
    (v_business_id, v_item.id, v_item.product_code, v_item.name, p_quantity, p_reason, v_item.quantity - p_quantity)
  RETURNING * INTO v_log;

  RETURN v_log;
END;
$$;
GRANT EXECUTE ON FUNCTION public.deduct_inventory(uuid, numeric, text) TO authenticated;
