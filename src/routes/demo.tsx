import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Search, Upload, Plus, Download, Trash2, Pencil, ArrowRight, Boxes,
  ChevronUp, ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/demo")({
  head: () => ({ meta: [{ title: "Demo — StockBalanse" }] }),
  component: DemoPage,
});

/* ── sample data ─────────────────────────────────────────────────────── */
interface DemoItem {
  id: string;
  product_code: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorder_point: number;
  last_updated: string;
}

const SAMPLE_DATA: DemoItem[] = [
  { id: "1", product_code: "SKU-1001", name: "Organic Coffee Beans (1kg)", category: "Beverages", quantity: 42, unit: "bag", reorder_point: 20, last_updated: "2026-06-18" },
  { id: "2", product_code: "SKU-1002", name: "Whole Wheat Flour (5kg)", category: "Baking", quantity: 8, unit: "bag", reorder_point: 15, last_updated: "2026-06-17" },
  { id: "3", product_code: "SKU-1003", name: "Olive Oil Extra Virgin (500ml)", category: "Pantry", quantity: 120, unit: "bottle", reorder_point: 30, last_updated: "2026-06-18" },
  { id: "4", product_code: "SKU-1004", name: "Coconut Water (330ml)", category: "Beverages", quantity: 5, unit: "can", reorder_point: 12, last_updated: "2026-06-16" },
  { id: "5", product_code: "SKU-1005", name: "Dark Chocolate Bar (70%)", category: "Snacks", quantity: 67, unit: "bar", reorder_point: 25, last_updated: "2026-06-15" },
  { id: "6", product_code: "SKU-1006", name: "Almond Milk (1L)", category: "Dairy", quantity: 3, unit: "carton", reorder_point: 10, last_updated: "2026-06-14" },
  { id: "7", product_code: "SKU-1007", name: "Quinoa Grain (1kg)", category: "Pantry", quantity: 55, unit: "bag", reorder_point: 20, last_updated: "2026-06-18" },
  { id: "8", product_code: "SKU-1008", name: "Matcha Green Tea Powder", category: "Beverages", quantity: 28, unit: "tin", reorder_point: 10, last_updated: "2026-06-13" },
  { id: "9", product_code: "SKU-1009", name: "Greek Yogurt (500g)", category: "Dairy", quantity: 89, unit: "tub", reorder_point: 20, last_updated: "2026-06-17" },
  { id: "10", product_code: "SKU-1010", name: "Granola Mix (750g)", category: "Breakfast", quantity: 14, unit: "bag", reorder_point: 15, last_updated: "2026-06-12" },
  { id: "11", product_code: "SKU-1011", name: "Honey Raw (340g)", category: "Pantry", quantity: 33, unit: "jar", reorder_point: 10, last_updated: "2026-06-11" },
  { id: "12", product_code: "SKU-1012", name: "Oat Milk Barista (1L)", category: "Dairy", quantity: 6, unit: "carton", reorder_point: 8, last_updated: "2026-06-10" },
];

/* ── types ───────────────────────────────────────────────────────────── */
type SortKey = keyof DemoItem;
type SortDir = "asc" | "desc";

/* ── page ────────────────────────────────────────────────────────────── */
function DemoPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [lockedOpen, setLockedOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let rows = term
      ? SAMPLE_DATA.filter(
          (r) =>
            r.name.toLowerCase().includes(term) ||
            r.product_code.toLowerCase().includes(term) ||
            r.category.toLowerCase().includes(term)
        )
      : [...SAMPLE_DATA];

    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      return sortDir === "asc" ? (as < bs ? -1 : 1) : (as < bs ? 1 : -1);
    });
    return rows;
  }, [search, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="size-3 text-muted-foreground/40" />;
    return sortDir === "asc"
      ? <ChevronUp className="size-3 text-primary" />
      : <ChevronDown className="size-3 text-primary" />;
  };

  const triggerLocked = () => setLockedOpen(true);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── demo banner ─────────────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2 text-amber-800">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
              Demo mode
            </span>
            <span className="text-amber-700/80">— changes won't be saved.</span>
          </div>
          <Button size="sm" className="h-8 text-xs" asChild>
            <Link to="/auth">Create a free account</Link>
          </Button>
        </div>
      </div>

      {/* ── top nav ─────────────────────────────────────────────────── */}
      <header className="border-b bg-white/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-lg bg-primary grid place-items-center shadow-sm transition-transform group-hover:scale-105">
              <Boxes className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">StockBalanse</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── main content ────────────────────────────────────────────── */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Current Stock</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filtered.length.toLocaleString()} of {SAMPLE_DATA.length} products
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={triggerLocked}>
              <Upload className="size-3.5 mr-1.5" />
              Import
            </Button>
            <Button size="sm" variant="outline" onClick={triggerLocked}>
              <Download className="size-3.5 mr-1.5" />
              Export
            </Button>
            <Button size="sm" onClick={triggerLocked}>
              <Plus className="size-3.5 mr-1.5" />
              Add item
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, code, or category…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32 cursor-pointer select-none" onClick={() => toggleSort("product_code")}>
                  <span className="flex items-center gap-1">Code <SortIcon col="product_code" /></span>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  <span className="flex items-center gap-1">Name <SortIcon col="name" /></span>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("category")}>
                  <span className="flex items-center gap-1">Category <SortIcon col="category" /></span>
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("quantity")}>
                  <span className="flex items-center justify-end gap-1">Quantity <SortIcon col="quantity" /></span>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("unit")}>
                  <span className="flex items-center gap-1">Unit <SortIcon col="unit" /></span>
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("reorder_point")}>
                  <span className="flex items-center justify-end gap-1">Reorder pt. <SortIcon col="reorder_point" /></span>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("last_updated")}>
                  <span className="flex items-center gap-1">Last updated <SortIcon col="last_updated" /></span>
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-14 text-muted-foreground">
                    No products match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => {
                  const low = item.reorder_point > 0 && item.quantity <= item.reorder_point;
                  return (
                    <TableRow key={item.id} className={low ? "bg-amber-50/60" : undefined}>
                      <TableCell className="font-mono text-xs">{item.product_code}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">
                        <span className={low ? "font-semibold text-amber-700" : ""}>
                          {item.quantity.toLocaleString()}
                        </span>
                        {low && (
                          <Badge variant="outline" className="ml-2 border-amber-400 text-amber-700 bg-amber-50">
                            Low
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.reorder_point.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{item.last_updated}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-foreground"
                            onClick={triggerLocked}
                            aria-label={`Edit ${item.name}`}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={triggerLocked}
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* ── locked-action modal ─────────────────────────────────────── */}
      <Dialog open={lockedOpen} onOpenChange={setLockedOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <div className="mx-auto size-12 rounded-full bg-primary/10 grid place-items-center mb-3">
              <Boxes className="size-6 text-primary" />
            </div>
            <DialogTitle className="text-lg">Unlock your inventory</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Create a free account to manage your real inventory. Takes under a minute.
          </p>
          <DialogFooter className="flex-col gap-2 mt-2">
            <Button className="w-full" asChild>
              <Link to="/auth">
                Sign up free
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setLockedOpen(false)}>
              Keep exploring
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
