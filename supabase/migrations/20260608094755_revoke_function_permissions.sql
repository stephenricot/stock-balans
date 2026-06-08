
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.current_business_id() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.deduct_inventory(uuid, numeric, text) FROM PUBLIC, anon;
