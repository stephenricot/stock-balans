import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export interface AdminUser {
  userId: string;
  businessId: string;
  businessName: string;
  role: string;
  joinedAt: string;
  productCount: number;
  totalQuantity: number;
}

export interface AdminStats {
  totalUsers: number;
  totalBusinesses: number;
  totalProducts: number;
  totalQuantity: number;
}

export const getAdminUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: callerProfile } = await context.supabase
      .from("user_profiles")
      .select("role")
      .eq("user_id", context.userId)
      .maybeSingle();

    if (callerProfile?.role !== "super-admin") {
      throw new Error("Forbidden: super-admin access required");
    }

    const [profilesResult, inventoryResult] = await Promise.all([
      supabaseAdmin
        .from("user_profiles")
        .select("user_id, business_id, role, created_at, businesses(id, name)")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("inventory")
        .select("business_id, quantity"),
    ]);

    if (profilesResult.error) throw profilesResult.error;
    if (inventoryResult.error) throw inventoryResult.error;

    const inventoryByBusiness: Record<string, { count: number; total: number }> = {};
    for (const item of inventoryResult.data ?? []) {
      const bid = item.business_id;
      if (!inventoryByBusiness[bid]) inventoryByBusiness[bid] = { count: 0, total: 0 };
      inventoryByBusiness[bid].count += 1;
      inventoryByBusiness[bid].total += Number(item.quantity);
    }

    const users: AdminUser[] = (profilesResult.data ?? []).map((p) => {
      const biz = Array.isArray(p.businesses) ? p.businesses[0] : p.businesses;
      const inv = inventoryByBusiness[p.business_id] ?? { count: 0, total: 0 };
      return {
        userId: p.user_id,
        businessId: p.business_id,
        businessName: (biz as { name: string } | null)?.name ?? "Unknown",
        role: p.role,
        joinedAt: p.created_at,
        productCount: inv.count,
        totalQuantity: inv.total,
      };
    });

    const uniqueBusinessIds = new Set(users.map((u) => u.businessId));
    const stats: AdminStats = {
      totalUsers: users.length,
      totalBusinesses: uniqueBusinessIds.size,
      totalProducts: Object.values(inventoryByBusiness).reduce((s, v) => s + v.count, 0),
      totalQuantity: Object.values(inventoryByBusiness).reduce((s, v) => s + v.total, 0),
    };

    return { users, stats };
  });
