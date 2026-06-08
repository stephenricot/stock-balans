
-- user_profiles: deny INSERT/UPDATE/DELETE for authenticated users
CREATE POLICY "deny insert user_profiles" ON public.user_profiles
  FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "deny update user_profiles" ON public.user_profiles
  FOR UPDATE TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny delete user_profiles" ON public.user_profiles
  FOR DELETE TO authenticated USING (false);

-- businesses: deny INSERT/DELETE for authenticated users (creation handled by trigger)
CREATE POLICY "deny insert businesses" ON public.businesses
  FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "deny delete businesses" ON public.businesses
  FOR DELETE TO authenticated USING (false);

-- outbound_logs: deny UPDATE/DELETE to keep audit history immutable
CREATE POLICY "deny update outbound_logs" ON public.outbound_logs
  FOR UPDATE TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny delete outbound_logs" ON public.outbound_logs
  FOR DELETE TO authenticated USING (false);

-- Revoke execute on internal trigger function (only used by auth trigger)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;
