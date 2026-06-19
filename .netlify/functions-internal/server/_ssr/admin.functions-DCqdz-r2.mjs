import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-B5icM9w3.mjs";
import { r as requireSuperAdmin } from "./admin.middleware-DpA4M0PG.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
const getAdminUsers_createServerFn_handler = createServerRpc({
  id: "5193d73f59a2a05e5253bea70853a304faf46eefbb46b3be819d254debf01c9b",
  name: "getAdminUsers",
  filename: "src/lib/api/admin.functions.ts"
}, (opts) => getAdminUsers.__executeServer(opts));
const getAdminUsers = createServerFn({
  method: "POST"
}).middleware([requireSuperAdmin]).handler(getAdminUsers_createServerFn_handler, async () => {
  const [profilesResult, inventoryResult] = await Promise.all([supabaseAdmin.from("user_profiles").select("user_id, business_id, role, created_at, businesses(id, name)").order("created_at", {
    ascending: false
  }), supabaseAdmin.from("inventory").select("business_id, quantity")]);
  if (profilesResult.error) throw profilesResult.error;
  if (inventoryResult.error) throw inventoryResult.error;
  const inventoryByBusiness = {};
  for (const item of inventoryResult.data ?? []) {
    const bid = item.business_id;
    if (!inventoryByBusiness[bid]) inventoryByBusiness[bid] = {
      count: 0,
      total: 0
    };
    inventoryByBusiness[bid].count += 1;
    inventoryByBusiness[bid].total += Number(item.quantity);
  }
  const users = (profilesResult.data ?? []).map((p) => {
    const biz = Array.isArray(p.businesses) ? p.businesses[0] : p.businesses;
    const inv = inventoryByBusiness[p.business_id] ?? {
      count: 0,
      total: 0
    };
    return {
      userId: p.user_id,
      businessId: p.business_id,
      businessName: biz?.name ?? "Unknown",
      role: p.role,
      joinedAt: p.created_at,
      productCount: inv.count,
      totalQuantity: inv.total
    };
  });
  const uniqueBusinessIds = new Set(users.map((u) => u.businessId));
  const stats = {
    totalUsers: users.length,
    totalBusinesses: uniqueBusinessIds.size,
    totalProducts: Object.values(inventoryByBusiness).reduce((s, v) => s + v.count, 0),
    totalQuantity: Object.values(inventoryByBusiness).reduce((s, v) => s + v.total, 0)
  };
  return {
    users,
    stats
  };
});
export {
  getAdminUsers_createServerFn_handler
};
