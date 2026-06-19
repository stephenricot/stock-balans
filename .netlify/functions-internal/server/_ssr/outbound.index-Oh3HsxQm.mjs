import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as utils, w as writeFileSync } from "../_libs/xlsx.mjs";
import { s as supabase } from "./client-CV_TjftL.mjs";
import { P as PageHeader } from "./PageHeader-DnYHjpB5.mjs";
import { C as Card } from "./card-DQ5v2DYb.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-RrXKMtST.mjs";
import { D as Download, h as Plus, d as Search } from "../_libs/lucide-react.mjs";
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
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
function OutboundList() {
  const [search, setSearch] = reactExports.useState("");
  const [start, setStart] = reactExports.useState("");
  const [end, setEnd] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const pageSize = 25;
  const q = useQuery({
    queryKey: ["outbound"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("outbound_logs").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const filtered = reactExports.useMemo(() => {
    const s = search.toLowerCase();
    const startT = start ? new Date(start).getTime() : null;
    const endT = end ? new Date(end).getTime() + 864e5 : null;
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
      "Remaining Stock": Number(o.remaining_stock)
    }));
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Deductions");
    writeFileSync(wb, `deductions_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Outbound History", description: "Track every deduction with reason and remaining stock.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: exportXlsx, disabled: !filtered.length, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-2" }),
        "Export"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/outbound/new", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
        "New"
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by product name…", className: "pl-9", value: search, onChange: (e) => {
          setSearch(e.target.value);
          setPage(0);
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: start, onChange: (e) => {
        setStart(e.target.value);
        setPage(0);
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: end, onChange: (e) => {
        setEnd(e.target.value);
        setPage(0);
      } })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Deducted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Reason" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Remaining" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center py-10 text-muted-foreground", children: "Loading…" }) }) : pageItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center py-10 text-muted-foreground", children: "No outbound records." }) }) : pageItems.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground whitespace-nowrap", children: new Date(o.created_at).toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: o.product_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: o.product_code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: Number(o.quantity_deducted).toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: o.reason }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-muted-foreground", children: Number(o.remaining_stock).toLocaleString() })
      ] }, o.id)) })
    ] }) }),
    filtered.length > pageSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        "Page ",
        page + 1,
        " of ",
        totalPages
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", disabled: page === 0, onClick: () => setPage((p) => p - 1), children: "Previous" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", disabled: page >= totalPages - 1, onClick: () => setPage((p) => p + 1), children: "Next" })
      ] })
    ] })
  ] });
}
export {
  OutboundList as component
};
