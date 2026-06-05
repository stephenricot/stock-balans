import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { Package, AlertTriangle, ArrowDownToLine, Layers } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — StockBalanse" }] }),
  component: Dashboard,
});

function Dashboard() {
  const stats = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const [inv, out] = await Promise.all([
        supabase.from("inventory").select("quantity, reorder_point"),
        supabase.from("outbound_logs").select("id, product_name, quantity_deducted, created_at").gte("created_at", since),
      ]);
      if (inv.error) throw inv.error;
      if (out.error) throw out.error;
      const items = inv.data ?? [];
      const totalProducts = items.length;
      const totalQty = items.reduce((s, i) => s + Number(i.quantity), 0);
      const lowStock = items.filter((i) => Number(i.quantity) <= Number(i.reorder_point) && Number(i.reorder_point) > 0).length;
      const totalOutbounds = (out.data ?? []).length;
      const top: Record<string, number> = {};
      for (const o of out.data ?? []) {
        top[o.product_name] = (top[o.product_name] ?? 0) + Number(o.quantity_deducted);
      }
      const topProducts = Object.entries(top)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);
      return { totalProducts, totalQty, lowStock, totalOutbounds, topProducts };
    },
  });

  const data = stats.data;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A snapshot of your inventory and recent activity."
        actions={
          <Button asChild>
            <Link to="/outbound/new">New outbound</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Package className="size-4" />} label="Total products" value={data?.totalProducts ?? "—"} />
        <StatCard icon={<Layers className="size-4" />} label="Quantity on hand" value={data?.totalQty?.toLocaleString() ?? "—"} />
        <StatCard
          icon={<AlertTriangle className="size-4" />}
          label="Low stock items"
          value={data?.lowStock ?? "—"}
          accent={data?.lowStock ? "warning" : undefined}
        />
        <StatCard icon={<ArrowDownToLine className="size-4" />} label="Outbounds (30d)" value={data?.totalOutbounds ?? "—"} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top deducted products</CardTitle>
          <CardDescription>Most deducted products in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {data?.topProducts.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topProducts} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="qty" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-12 text-center">No deductions yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent?: "warning";
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider">
          <span>{label}</span>
          <span className={accent === "warning" ? "text-warning" : ""}>{icon}</span>
        </div>
        <div className={`mt-2 text-2xl font-semibold ${accent === "warning" ? "text-warning" : ""}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
