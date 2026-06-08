import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Search, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/stock")({
  head: () => ({ meta: [{ title: "Stock — StockBalanse" }] }),
  component: StockPage,
});

type InventoryRow = Tables<"inventory">;

// ─── debounce hook ────────────────────────────────────────────────────────────
function useDebounced<T>(v: T, ms = 350) {
  const [d, setD] = useState(v);
  useEffect(() => {
    const t = setTimeout(() => setD(v), ms);
    return () => clearTimeout(t);
  }, [v, ms]);
  return d;
}

// ─── edit dialog ──────────────────────────────────────────────────────────────
function EditDialog({
  item,
  open,
  onClose,
}: {
  item: InventoryRow | null;
  open: boolean;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [reorderPoint, setReorderPoint] = useState("");
  const [busy, setBusy] = useState(false);

  // Sync form when item changes
  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category ?? "");
      setQuantity(String(item.quantity));
      setUnit(item.unit);
      setReorderPoint(String(item.reorder_point));
    }
  }, [item]);

  const save = async () => {
    if (!item) return;
    const qty = Number(quantity);
    const rp = Number(reorderPoint);
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (!unit.trim()) { toast.error("Unit is required"); return; }
    if (isNaN(qty) || qty < 0) { toast.error("Quantity must be 0 or more"); return; }
    if (isNaN(rp) || rp < 0) { toast.error("Reorder point must be 0 or more"); return; }

    setBusy(true);
    const { error } = await supabase
      .from("inventory")
      .update({
        name: name.trim(),
        category: category.trim() || null,
        quantity: qty,
        unit: unit.trim(),
        reorder_point: rp,
      })
      .eq("id", item.id);

    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`"${name.trim()}" updated`);
    // Invalidate all inventory queries so every page refreshes
    qc.invalidateQueries({ queryKey: ["inventory"] });
    qc.invalidateQueries({ queryKey: ["inventory-categories"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Product code – read-only */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Product code (read-only)</Label>
            <div className="font-mono text-sm px-3 py-2 rounded-md bg-muted text-muted-foreground">
              {item?.product_code}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Name *</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-qty">Quantity *</Label>
              <Input
                id="edit-qty"
                type="number"
                min={0}
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-unit">Unit *</Label>
              <Input
                id="edit-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="pcs, kg, box…"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-cat">Category</Label>
              <Input
                id="edit-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="optional"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-rp">Reorder point</Label>
              <Input
                id="edit-rp"
                type="number"
                min={0}
                step="any"
                value={reorderPoint}
                onChange={(e) => setReorderPoint(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={save} disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
function StockPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(0);
  const [editItem, setEditItem] = useState<InventoryRow | null>(null);
  const dSearch = useDebounced(search);

  // Reset to page 0 whenever filters change
  useEffect(() => { setPage(0); }, [dSearch, category, pageSize]);

  // ── server-side paginated inventory ─────────────────────────────────────────
  const q = useQuery({
    queryKey: ["inventory", dSearch, category, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from("inventory")
        .select("*", { count: "exact" })
        .order("name", { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (dSearch) {
        query = query.or(
          `name.ilike.%${dSearch}%,product_code.ilike.%${dSearch}%`
        );
      }
      if (category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { items: data ?? [], total: count ?? 0 };
    },
    placeholderData: (prev) => prev,
  });

  // ── category dropdown (cached) ───────────────────────────────────────────────
  const catQ = useQuery({
    queryKey: ["inventory-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("category")
        .not("category", "is", null)
        .order("category");
      if (error) throw error;
      return Array.from(new Set((data ?? []).map((r) => r.category as string)));
    },
    staleTime: 60_000,
  });

  const items = q.data?.items ?? [];
  const total = q.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const categories = catQ.data ?? [];

  return (
    <div>
      <PageHeader
        title="Current Stock"
        description={
          q.isFetching
            ? "Loading…"
            : `${total.toLocaleString()} product${total !== 1 ? "s" : ""}`
        }
      />

      {/* ── filters ── */}
      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or product code…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(pageSize)}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className="w-full md:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* ── table ── */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Reorder pt.</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {q.isLoading ? (
              Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-14 text-muted-foreground">
                  {dSearch || category !== "all"
                    ? "No products match your search."
                    : "No products yet. Import from Excel to get started."}
                </TableCell>
              </TableRow>
            ) : (
              items.map((i) => {
                const low =
                  Number(i.reorder_point) > 0 &&
                  Number(i.quantity) <= Number(i.reorder_point);
                return (
                  <TableRow key={i.id} className={low ? "bg-warning/10" : ""}>
                    <TableCell className="font-mono text-xs">{i.product_code}</TableCell>
                    <TableCell className="font-medium">{i.name}</TableCell>
                    <TableCell>
                      {i.category || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={low ? "font-semibold text-warning-foreground" : ""}>
                        {Number(i.quantity).toLocaleString()}
                      </span>
                      {low && (
                        <Badge variant="outline" className="ml-2 border-warning text-warning">
                          Low
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{i.unit}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {Number(i.reorder_point).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-foreground"
                        onClick={() => setEditItem(i)}
                        aria-label={`Edit ${i.name}`}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ── pagination ── */}
      {total > pageSize && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-muted-foreground">
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of{" "}
            {total.toLocaleString()} products
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0 || q.isFetching}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4 mr-1" /> Previous
            </Button>
            <span className="text-muted-foreground px-1">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1 || q.isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── edit dialog ── */}
      <EditDialog
        item={editItem}
        open={editItem !== null}
        onClose={() => setEditItem(null)}
      />
    </div>
  );
}
