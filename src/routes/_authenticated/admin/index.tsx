import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/lib/api/admin.functions";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, Package, Layers, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin — StockBalanse" }] }),
  component: AdminIndex,
});

function AdminIndex() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => getAdminUsers(),
  });

  const stats = data?.stats;

  return (
    <div>
      <PageHeader
        title="Admin Overview"
        description="System-wide stats across all users and businesses."
        actions={
          <Button asChild>
            <Link to="/admin/users">
              View all users <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        }
      />

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 text-sm mb-6">
          Failed to load admin data. Make sure your account has super-admin access.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="size-4" />}
          label="Total users"
          value={isLoading ? null : (stats?.totalUsers ?? 0)}
        />
        <StatCard
          icon={<Building2 className="size-4" />}
          label="Total businesses"
          value={isLoading ? null : (stats?.totalBusinesses ?? 0)}
        />
        <StatCard
          icon={<Package className="size-4" />}
          label="Total products"
          value={isLoading ? null : (stats?.totalProducts ?? 0)}
        />
        <StatCard
          icon={<Layers className="size-4" />}
          label="Total quantity on hand"
          value={isLoading ? null : (stats?.totalQuantity?.toLocaleString() ?? 0)}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode | null;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider">
          <span>{label}</span>
          {icon}
        </div>
        <div className="mt-2 text-2xl font-semibold">
          {value === null ? <Skeleton className="h-7 w-16" /> : value}
        </div>
      </CardContent>
    </Card>
  );
}
