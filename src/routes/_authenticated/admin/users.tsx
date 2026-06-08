import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAdminUsers, type AdminUser } from "@/lib/api/admin.functions";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin — StockBalanse" }] }),
  component: AdminUsers,
});

const PAGE_SIZE = 25;

function roleBadge(role: string) {
  if (role === "super-admin") {
    return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">{role}</Badge>;
  }
  return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">{role}</Badge>;
}

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getAdminUsers(),
  });

  const allUsers: AdminUser[] = data?.users ?? [];

  const filtered = allUsers.filter((u) => {
    const q = search.toLowerCase();
    return u.businessName.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Users"
        description="All registered users and their inventory overview."
      />

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 text-sm mb-6">
          Failed to load users. Make sure your account has super-admin access.
        </div>
      )}

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by business name or role..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Products</TableHead>
              <TableHead className="text-right">Qty on Hand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                  {search ? "No users match your search." : "No users found."}
                </TableCell>
              </TableRow>
            ) : (
              paged.map((u) => (
                <TableRow key={u.userId}>
                  <TableCell className="font-medium">{u.businessName}</TableCell>
                  <TableCell>{roleBadge(u.role)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(u.joinedAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{u.productCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">{u.totalQuantity.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border enabled:hover:bg-muted disabled:opacity-40"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 rounded border enabled:hover:bg-muted disabled:opacity-40"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
