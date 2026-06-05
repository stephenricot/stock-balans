import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — StockBalanse" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [bizId, setBizId] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: prof } = await supabase.from("user_profiles").select("business_id").maybeSingle();
      if (!prof) return;
      const { data: biz } = await supabase.from("businesses").select("id, name").eq("id", prof.business_id).maybeSingle();
      if (biz) { setBizId(biz.id); setName(biz.name); }
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("businesses").update({ name }).eq("id", bizId);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  const exportInventory = async () => {
    const { data, error } = await supabase
      .from("inventory")
      .select("product_code, name, category, quantity, unit, reorder_point")
      .order("name");
    if (error) { toast.error(error.message); return; }
    const ws = XLSX.utils.json_to_sheet(
      (data ?? []).map((r) => ({
        "Product Code": r.product_code,
        Name: r.name,
        Category: r.category ?? "",
        "Quantity on Hand": Number(r.quantity),
        Unit: r.unit,
        "Reorder Point": Number(r.reorder_point),
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `inventory_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your business profile and data." />
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Business</CardTitle>
            <CardDescription>Update your business name.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Business name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export</CardTitle>
            <CardDescription>Download the current inventory as an Excel file.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={exportInventory}>
              <Download className="size-4 mr-2" />Export inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
