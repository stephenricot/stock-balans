import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/outbound/new")({
  head: () => ({ meta: [{ title: "New outbound — StockBalanse" }] }),
  component: NewOutbound,
});

const PRESETS = ["Sold", "Damaged", "Expired", "Transferred"];

function NewOutbound() {
  const nav = useNavigate();
  const [inventoryId, setInventoryId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reasonPreset, setReasonPreset] = useState("Sold");
  const [customReason, setCustomReason] = useState("");
  const [busy, setBusy] = useState(false);

  const items = useQuery({
    queryKey: ["inventory-select"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("id, name, product_code, quantity, unit")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const selected = useMemo(
    () => items.data?.find((i) => i.id === inventoryId),
    [items.data, inventoryId],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) { toast.error("Pick a product"); return; }
    const qty = Number(quantity);
    if (!qty || qty <= 0) { toast.error("Enter a positive quantity"); return; }
    if (qty > Number(selected.quantity)) { toast.error(`Only ${selected.quantity} ${selected.unit} available`); return; }
    const reason = reasonPreset === "Custom" ? customReason.trim() : reasonPreset;
    if (!reason) { toast.error("Reason required"); return; }

    setBusy(true);
    try {
      const { error } = await supabase.rpc("deduct_inventory", {
        p_inventory_id: selected.id,
        p_quantity: qty,
        p_reason: reason,
      });
      if (error) throw error;
      toast.success("Deduction recorded");
      nav({ to: "/outbound" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="New Outbound" description="Deduct stock and log the reason." />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Product</Label>
              <Select value={inventoryId} onValueChange={setInventoryId}>
                <SelectTrigger><SelectValue placeholder="Select a product…" /></SelectTrigger>
                <SelectContent>
                  {items.data?.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name} — {i.product_code} ({Number(i.quantity)} {i.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selected && (
                <p className="text-xs text-muted-foreground">
                  Available: <span className="font-semibold">{Number(selected.quantity)} {selected.unit}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qty">Quantity to deduct</Label>
              <Input id="qty" type="number" min={0} step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Select value={reasonPreset} onValueChange={setReasonPreset}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRESETS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  <SelectItem value="Custom">Custom…</SelectItem>
                </SelectContent>
              </Select>
              {reasonPreset === "Custom" && (
                <Textarea
                  className="mt-2"
                  placeholder="Describe the reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => nav({ to: "/outbound" })}>Cancel</Button>
              <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Record deduction"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
