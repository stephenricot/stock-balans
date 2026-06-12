import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CV_TjftL.mjs";
import { P as PageHeader } from "./PageHeader-DnYHjpB5.mjs";
import { C as Card, d as CardContent } from "./card-DQ5v2DYb.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/lucide-react.mjs";
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const PRESETS = ["Sold", "Damaged", "Expired", "Transferred"];
function NewOutbound() {
  const nav = useNavigate();
  const [inventoryId, setInventoryId] = reactExports.useState("");
  const [quantity, setQuantity] = reactExports.useState("");
  const [reasonPreset, setReasonPreset] = reactExports.useState("Sold");
  const [customReason, setCustomReason] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const items = useQuery({
    queryKey: ["inventory-select"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("inventory").select("id, name, product_code, quantity, unit").order("name");
      if (error) throw error;
      return data ?? [];
    }
  });
  const selected = reactExports.useMemo(() => items.data?.find((i) => i.id === inventoryId), [items.data, inventoryId]);
  const submit = async (e) => {
    e.preventDefault();
    if (!selected) {
      toast.error("Pick a product");
      return;
    }
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      toast.error("Enter a positive quantity");
      return;
    }
    if (qty > Number(selected.quantity)) {
      toast.error(`Only ${selected.quantity} ${selected.unit} available`);
      return;
    }
    const reason = reasonPreset === "Custom" ? customReason.trim() : reasonPreset;
    if (!reason) {
      toast.error("Reason required");
      return;
    }
    setBusy(true);
    try {
      const {
        error
      } = await supabase.rpc("deduct_inventory", {
        p_inventory_id: selected.id,
        p_quantity: qty,
        p_reason: reason
      });
      if (error) throw error;
      toast.success("Deduction recorded");
      nav({
        to: "/outbound"
      });
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "New Outbound", description: "Deduct stock and log the reason." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: inventoryId, onValueChange: setInventoryId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a product…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: items.data?.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: i.id, children: [
            i.name,
            " — ",
            i.product_code,
            " (",
            Number(i.quantity),
            " ",
            i.unit,
            ")"
          ] }, i.id)) })
        ] }),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Available: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
            Number(selected.quantity),
            " ",
            selected.unit
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "qty", children: "Quantity to deduct" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "qty", type: "number", min: 0, step: "any", value: quantity, onChange: (e) => setQuantity(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Reason" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: reasonPreset, onValueChange: setReasonPreset, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p, children: p }, p)),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Custom", children: "Custom…" })
          ] })
        ] }),
        reasonPreset === "Custom" && /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "mt-2", placeholder: "Describe the reason", value: customReason, onChange: (e) => setCustomReason(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => nav({
          to: "/outbound"
        }), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Saving…" : "Record deduction" })
      ] })
    ] }) }) })
  ] });
}
export {
  NewOutbound as component
};
