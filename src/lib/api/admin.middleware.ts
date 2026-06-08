import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export const requireSuperAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { supabase, userId } = context as unknown as {
      supabase: SupabaseClient<Database>;
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
