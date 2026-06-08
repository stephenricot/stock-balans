/**
 * low-stock-alerts — Supabase Edge Function
 *
 * Sends a daily email digest of low-stock items to every business owner.
 * Triggered by a pg_cron job (see migration 20260609_low_stock_cron.sql).
 *
 * Environment variables required (set in Supabase dashboard → Edge Functions → Secrets):
 *   SUPABASE_URL            — auto-injected by Supabase
 *   SUPABASE_SERVICE_ROLE_KEY — auto-injected by Supabase
 *   RESEND_API_KEY          — from resend.com (free tier: 3 000 emails/month)
 *   ALERT_FROM_EMAIL        — e.g. "alerts@yourdomain.com"
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("ALERT_FROM_EMAIL") ?? "alerts@stockbalanse.app";

interface LowStockItem {
  product_code: string;
  name: string;
  category: string | null;
  quantity: number;
  unit: string;
  reorder_point: number;
}

interface BusinessAlert {
  businessId: string;
  businessName: string;
  ownerEmail: string;
  items: LowStockItem[];
}

Deno.serve(async (req) => {
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const alerts = await buildAlerts();

    if (alerts.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, message: "No low-stock items found" }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    const results = await Promise.allSettled(
      alerts.map((a) => sendEmail(a)),
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(`Low-stock alerts: ${sent} sent, ${failed} failed`);
    return new Response(
      JSON.stringify({ sent, failed }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("low-stock-alerts error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

async function buildAlerts(): Promise<BusinessAlert[]> {
  const { data: lowItems, error: invError } = await supabase
    .from("inventory")
    .select("business_id, product_code, name, category, quantity, unit, reorder_point")
    .gt("reorder_point", 0)
    .filter("quantity", "lte", "reorder_point");

  if (invError) throw invError;
  if (!lowItems || lowItems.length === 0) return [];

  const businessIds = [...new Set(lowItems.map((i) => i.business_id))];

  const { data: profiles, error: profError } = await supabase
    .from("user_profiles")
    .select("business_id, user_id, businesses(name)")
    .in("business_id", businessIds)
    .eq("role", "admin");

  if (profError) throw profError;
  if (!profiles || profiles.length === 0) return [];

  const userIds = profiles.map((p) => p.user_id);
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) throw authError;

  const emailByUserId = new Map<string, string>(
    (authUsers.users ?? [])
      .filter((u) => userIds.includes(u.id))
      .map((u) => [u.id, u.email ?? ""]),
  );

  const alertMap = new Map<string, BusinessAlert>();

  for (const profile of profiles) {
    const email = emailByUserId.get(profile.user_id);
    if (!email) continue;

    const biz = Array.isArray(profile.businesses)
      ? profile.businesses[0]
      : profile.businesses;
    const businessName = (biz as { name: string } | null)?.name ?? "Your Business";

    alertMap.set(profile.business_id, {
      businessId: profile.business_id,
      businessName,
      ownerEmail: email,
      items: [],
    });
  }

  for (const item of lowItems) {
    const alert = alertMap.get(item.business_id);
    if (alert) {
      alert.items.push({
        product_code: item.product_code,
        name: item.name,
        category: item.category,
        quantity: Number(item.quantity),
        unit: item.unit,
        reorder_point: Number(item.reorder_point),
      });
    }
  }

  return [...alertMap.values()].filter((a) => a.items.length > 0);
}

async function sendEmail(alert: BusinessAlert): Promise<void> {
  const itemRows = alert.items
    .sort((a, b) => a.quantity - b.quantity)
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-family:monospace;font-size:13px">${item.product_code}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${item.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#888">${item.category ?? "—"}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#d97706;font-weight:600;text-align:right">
            ${item.quantity} ${item.unit}
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#888;text-align:right">
            ${item.reorder_point} ${item.unit}
          </td>
        </tr>`,
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f9f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;border:1px solid #e8e8e4;overflow:hidden">
    <div style="background:#166534;padding:24px 32px">
      <div style="color:#fff;font-weight:600;font-size:16px">StockBalanse</div>
      <div style="color:rgba(255,255,255,0.65);font-size:12px">Daily low-stock alert</div>
    </div>
    <div style="padding:28px 32px">
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:600">
        ${alert.items.length} item${alert.items.length !== 1 ? "s" : ""} need restocking
      </h1>
      <p style="margin:0 0 24px;color:#666;font-size:14px">
        The following products in <strong>${alert.businessName}</strong> are at or below their reorder point.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#f6f6f4">
            <th style="padding:8px 12px;text-align:left;font-weight:500;color:#888;font-size:11px;text-transform:uppercase">Code</th>
            <th style="padding:8px 12px;text-align:left;font-weight:500;color:#888;font-size:11px;text-transform:uppercase">Product</th>
            <th style="padding:8px 12px;text-align:left;font-weight:500;color:#888;font-size:11px;text-transform:uppercase">Category</th>
            <th style="padding:8px 12px;text-align:right;font-weight:500;color:#888;font-size:11px;text-transform:uppercase">In stock</th>
            <th style="padding:8px 12px;text-align:right;font-weight:500;color:#888;font-size:11px;text-transform:uppercase">Reorder at</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div style="margin-top:28px;padding:16px;background:#fef9ee;border:1px solid #fcd34d;border-radius:8px;font-size:13px;color:#92400e">
        ⚠️ These items have quantity ≤ reorder point. Consider placing a purchase order soon.
      </div>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #f0f0f0;font-size:12px;color:#aaa;text-align:center">
      Automated daily alert from StockBalanse for ${alert.businessName}.
    </div>
  </div>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: alert.ownerEmail,
      subject: `⚠️ ${alert.items.length} low-stock item${alert.items.length !== 1 ? "s" : ""} — ${alert.businessName}`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }
}
