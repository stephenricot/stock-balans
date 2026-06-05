import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/outbound/")({
  head: () => ({ meta: [{ title: "Outbound history — StockBalanse" }] }),
  component: OutboundList,
});

function OutboundList() {
  const [search, setSearch] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const q = useQuery({
    queryKey: ["outbound"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outbound_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    const startT = start ? new Date(start).getTime() : null;
    const endT = end ? new Date(end).getTime() + 86400000 : null;
    return (q.data ?? []).filter((o) => {
      const t = new Date(o.created_at).getTime();
      if (startT && t < startT) return false;
      if (endT && t > endT) return false;
      if (s && !o.product_name.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [q.data, search, start, end]);

  const pageItems = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const exportXlsx = () => {
    const rows = filtered.map((o) => ({
      Date: new Date(o.created_at).toLocaleString(),
      "Product Code": o.product_code,
      "Product Name": o.product_name,
      "Quantity Deducted": Number(o.quantity_deducted),
      Reason: o.reason,
      "Remaining Stock": Number(o.remaining_stock),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Deductions");
    XLSX.writeFile(wb, `deductions_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div>
      <PageHeader
        title="Outbound History"
        description="Track every deduction with reason and remaining stock."
        actions={
          <>
            <Button variant="outline" onClick={exportXlsx} disabled={!filtered.length}>
              <Download className="size-4 mr-2" />Export
            </Button>
            <Button asChild><Link to="/outbound/new"><Plus className="size-4 mr-2" />New</Link></Button>
          </>
        }
      />

      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by product name…" className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
          </div>
          <Input type="date" value={start} onChange={(e) => { setStart(e.target.value); setPage(0); }} />
          <Input type="date" value={end} onChange={(e) => { setEnd(e.target.value); setPage(0); }} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-right">Deducted</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {q.isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : pageItems.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No outbound records.</TableCell></TableRow>
            ) : pageItems.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{new Date(o.created_at).toLocaleString()}</TableCell>
                <TableCell className="font-medium">{o.product_name}</TableCell>
                <TableCell className="font-mono text-xs">{o.product_code}</TableCell>
                <TableCell className="text-right">{Number(o.quantity_deducted).toLocaleString()}</TableCell>
                <TableCell>{o.reason}</TableCell>
                <TableCell className="text-right text-muted-foreground">{Number(o.remaining_stock).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
