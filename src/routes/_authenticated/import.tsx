import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload as UploadIcon, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/import")({
  head: () => ({ meta: [{ title: "Import — StockBalanse" }] }),
  component: ImportPage,
});

const HEADERS = ["Product Code", "Name", "Category", "Quantity on Hand", "Unit", "Reorder Point"];

type Row = {
  product_code: string;
  name: string;
  category: string | null;
  quantity: number;
  unit: string;
  reorder_point: number;
};

function ImportPage() {
  const qc = useQueryClient();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      HEADERS,
      ["SKU-001", "Sample Product", "Beverages", 100, "pcs", 20],
      ["SKU-002", "Another Item", "Food", 50, "kg", 10],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "stockbalanse_template.xlsx");
  };

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
    if (!json.length) { toast.error("File is empty"); return; }

    const headers = Object.keys(json[0]);
    const missing = ["Product Code", "Name", "Quantity on Hand", "Unit"].filter((h) => !headers.includes(h));
    if (missing.length) {
      toast.error(`Missing required columns: ${missing.join(", ")}`);
      return;
    }

    const parsed: Row[] = [];
    for (const [i, r] of json.entries()) {
      const code = String(r["Product Code"] ?? "").trim();
      const name = String(r["Name"] ?? "").trim();
      const qty = Number(r["Quantity on Hand"]);
      const unit = String(r["Unit"] ?? "").trim();
      if (!code || !name || !unit || Number.isNaN(qty)) {
        toast.error(`Invalid row ${i + 2}: missing required field`);
        return;
      }
      parsed.push({
        product_code: code,
        name,
        category: String(r["Category"] ?? "").trim() || null,
        quantity: qty,
        unit,
        reorder_point: Number(r["Reorder Point"] ?? 0) || 0,
      });
    }
    setRows(parsed);
    toast.success(`Parsed ${parsed.length} rows. Review and confirm.`);
  };

  const confirmImport = async () => {
    if (!rows) return;
    setBusy(true);
    try {
      const { data: profile } = await supabase.from("user_profiles").select("business_id").maybeSingle();
      if (!profile) throw new Error("No business found");
      const payload = rows.map((r) => ({ ...r, business_id: profile.business_id }));
      const { error } = await supabase
        .from("inventory")
        .upsert(payload, { onConflict: "business_id,product_code" });
      if (error) throw error;
      toast.success(`Imported ${rows.length} products`);
      setRows(null);
      setFileName("");
      qc.invalidateQueries({ queryKey: ["inventory"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Import Inventory"
        description="Upload an Excel sheet to add or update products."
        actions={<Button variant="outline" onClick={downloadTemplate}><Download className="size-4 mr-2" />Download Template</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="size-5" />Upload file</CardTitle>
          <CardDescription>
            Required columns: <code className="text-xs">Product Code, Name, Quantity on Hand, Unit</code>. Optional: <code className="text-xs">Category, Reorder Point</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="file">Excel file (.xlsx, .xls)</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
          </div>
        </CardContent>
      </Card>

      {rows && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Preview ({rows.length} rows)</CardTitle>
              <CardDescription>Existing products with matching codes will be updated.</CardDescription>
            </div>
            <Button onClick={confirmImport} disabled={busy}>
              <UploadIcon className="size-4 mr-2" />
              {busy ? "Importing…" : "Confirm Import"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md max-h-96 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Reorder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 100).map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{r.product_code}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.category || "—"}</TableCell>
                      <TableCell className="text-right">{r.quantity}</TableCell>
                      <TableCell>{r.unit}</TableCell>
                      <TableCell className="text-right">{r.reorder_point}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {rows.length > 100 && <p className="text-xs text-muted-foreground mt-2">Showing first 100 rows.</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
