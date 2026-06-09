
-- 1. current_business_id(): switch SECURITY DEFINER → SECURITY INVOKER
--    Safe because it queries user_profiles WHERE user_id = auth.uid(), which
--    the "view own profile" RLS policy already permits (no recursion risk).
CREATE OR REPLACE FUNCTION public.current_business_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT business_id FROM public.user_profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 2. deduct_inventory(): switch SECURITY DEFINER → SECURITY INVOKER
--    The underlying table access (inventory SELECT/UPDATE, outbound_logs INSERT)
--    is fully protected by RLS policies, so SECURITY DEFINER is unnecessary.
CREATE OR REPLACE FUNCTION public.deduct_inventory(
  p_inventory_id uuid,
  p_quantity numeric,
  p_reason text
)
RETURNS public.outbound_logs
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
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

-- 3. is_super_admin(): must remain SECURITY DEFINER to avoid infinite RLS recursion
--    (the super_admin_select_all_profiles policy on user_profiles calls this function,
--    so a SECURITY INVOKER version would recurse). Keep EXECUTE for authenticated
--    so RLS policies can evaluate it; revoke from PUBLIC and anon.
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
