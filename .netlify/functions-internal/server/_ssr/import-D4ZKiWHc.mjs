import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as utils, w as writeFileSync, r as readSync } from "../_libs/xlsx.mjs";
import { s as supabase } from "./client-CV_TjftL.mjs";
import { a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { P as PageHeader } from "./PageHeader-DnYHjpB5.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-DQ5v2DYb.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-RrXKMtST.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Download, F as FileSpreadsheet, U as Upload } from "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
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
const HEADERS = ["Product Code", "Name", "Category", "Quantity on Hand", "Unit", "Reorder Point"];
function ImportPage() {
  const qc = useQueryClient();
  const [rows, setRows] = reactExports.useState(null);
  const [fileName, setFileName] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const downloadTemplate = () => {
    const ws = utils.aoa_to_sheet([HEADERS, ["SKU-001", "Sample Product", "Beverages", 100, "pcs", 20], ["SKU-002", "Another Item", "Food", 50, "kg", 10]]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Inventory");
    writeFileSync(wb, "stockbalanse_template.xlsx");
  };
  const handleFile = async (file) => {
    setFileName(file.name);
    const buf = await file.arrayBuffer();
    const wb = readSync(buf);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = utils.sheet_to_json(ws, {
      defval: ""
    });
    if (!json.length) {
      toast.error("File is empty");
      return;
    }
    const headers = Object.keys(json[0]);
    const missing = ["Product Code", "Name", "Quantity on Hand", "Unit"].filter((h) => !headers.includes(h));
    if (missing.length) {
      toast.error(`Missing required columns: ${missing.join(", ")}`);
      return;
    }
    const parsed = [];
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
        reorder_point: Number(r["Reorder Point"] ?? 0) || 0
      });
    }
    setRows(parsed);
    toast.success(`Parsed ${parsed.length} rows. Review and confirm.`);
  };
  const confirmImport = async () => {
    if (!rows) return;
    setBusy(true);
    try {
      const {
        data: profile
      } = await supabase.from("user_profiles").select("business_id").maybeSingle();
      if (!profile) throw new Error("No business found");
      const payload = rows.map((r) => ({
        ...r,
        business_id: profile.business_id
      }));
      const {
        error
      } = await supabase.from("inventory").upsert(payload, {
        onConflict: "business_id,product_code"
      });
      if (error) throw error;
      toast.success(`Imported ${rows.length} products`);
      setRows(null);
      setFileName("");
      qc.invalidateQueries({
        queryKey: ["inventory"]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard-stats"]
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Import Inventory", description: "Upload an Excel sheet to add or update products.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: downloadTemplate, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-2" }),
      "Download Template"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-5" }),
          "Upload file"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          "Required columns: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs", children: "Product Code, Name, Quantity on Hand, Unit" }),
          ". Optional: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs", children: "Category, Reorder Point" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "file", children: "Excel file (.xlsx, .xls)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "file", type: "file", accept: ".xlsx,.xls", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        } }),
        fileName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: fileName })
      ] }) })
    ] }),
    rows && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { children: [
            "Preview (",
            rows.length,
            " rows)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Existing products with matching codes will be updated." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: confirmImport, disabled: busy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-4 mr-2" }),
          busy ? "Importing…" : "Confirm Import"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-md max-h-96 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { className: "sticky top-0 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Qty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Reorder" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: rows.slice(0, 100).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: r.product_code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: r.category || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: r.quantity }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: r.unit }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: r.reorder_point })
          ] }, i)) })
        ] }) }),
        rows.length > 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Showing first 100 rows." })
      ] })
    ] })
  ] });
}
export {
  ImportPage as component
};
