import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const requireSuperAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { supabase, userId } = context as {
      supabase: Extract<typeof context.supabase, unknown>;
      userId: string;
    };

    const { data: callerProfile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (callerProfile?.role !== "super-admin") {
      throw new Error("Forbidden: super-admin access required");
    }

    return next();
  });
