
-- Helper: returns true if the current user is a super-admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'super-admin'
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- Allow super-admins to select ALL user_profiles (not just their own)
CREATE POLICY "super_admin_select_all_profiles" ON public.user_profiles
  FOR SELECT TO authenticated USING (public.is_super_admin());

-- Allow super-admins to select ALL businesses
CREATE POLICY "super_admin_select_all_businesses" ON public.businesses
  FOR SELECT TO authenticated USING (public.is_super_admin());

-- Allow super-admins to select ALL inventory rows
CREATE POLICY "super_admin_select_all_inventory" ON public.inventory
  FOR SELECT TO authenticated USING (public.is_super_admin());
