import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as utils, w as writeFileSync } from "../_libs/xlsx.mjs";
import { s as supabase } from "./client-CV_TjftL.mjs";
import { P as PageHeader } from "./PageHeader-DnYHjpB5.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-DQ5v2DYb.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Download } from "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function SettingsPage() {
  const [bizId, setBizId] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data: prof
      } = await supabase.from("user_profiles").select("business_id").maybeSingle();
      if (!prof) return;
      const {
        data: biz
      } = await supabase.from("businesses").select("id, name").eq("id", prof.business_id).maybeSingle();
      if (biz) {
        setBizId(biz.id);
        setName(biz.name);
      }
    })();
  }, []);
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const {
      error
    } = await supabase.from("businesses").update({
      name
    }).eq("id", bizId);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };
  const exportInventory = async () => {
    const {
      data,
      error
    } = await supabase.from("inventory").select("product_code, name, category, quantity, unit, reorder_point").order("name");
    if (error) {
      toast.error(error.message);
      return;
    }
    const ws = utils.json_to_sheet((data ?? []).map((r) => ({
      "Product Code": r.product_code,
      Name: r.name,
      Category: r.category ?? "",
      "Quantity on Hand": Number(r.quantity),
      Unit: r.unit,
      "Reorder Point": Number(r.reorder_point)
    })));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Inventory");
    writeFileSync(wb, `inventory_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Settings", description: "Manage your business profile and data." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Business" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Update your business name." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Business name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", value: name, onChange: (e) => setName(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Saving…" : "Save" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Export" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Download the current inventory as an Excel file." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: exportInventory, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-2" }),
          "Export inventory"
        ] }) })
      ] })
    ] })
  ] });
}
export {
  SettingsPage as component
};
