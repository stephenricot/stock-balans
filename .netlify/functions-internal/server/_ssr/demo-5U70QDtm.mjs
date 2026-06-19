import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-RrXKMtST.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-BKo0Bocc.mjs";
import { B as Boxes, U as Upload, D as Download, P as Plus, S as Search, a as Pencil, T as Trash2, A as ArrowRight, C as ChevronUp, b as ChevronDown } from "../_libs/lucide-react.mjs";
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
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
const SAMPLE_DATA = [{
  id: "1",
  product_code: "SKU-1001",
  name: "Organic Coffee Beans (1kg)",
  category: "Beverages",
  quantity: 42,
  unit: "bag",
  reorder_point: 20,
  last_updated: "2026-06-18"
}, {
  id: "2",
  product_code: "SKU-1002",
  name: "Whole Wheat Flour (5kg)",
  category: "Baking",
  quantity: 8,
  unit: "bag",
  reorder_point: 15,
  last_updated: "2026-06-17"
}, {
  id: "3",
  product_code: "SKU-1003",
  name: "Olive Oil Extra Virgin (500ml)",
  category: "Pantry",
  quantity: 120,
  unit: "bottle",
  reorder_point: 30,
  last_updated: "2026-06-18"
}, {
  id: "4",
  product_code: "SKU-1004",
  name: "Coconut Water (330ml)",
  category: "Beverages",
  quantity: 5,
  unit: "can",
  reorder_point: 12,
  last_updated: "2026-06-16"
}, {
  id: "5",
  product_code: "SKU-1005",
  name: "Dark Chocolate Bar (70%)",
  category: "Snacks",
  quantity: 67,
  unit: "bar",
  reorder_point: 25,
  last_updated: "2026-06-15"
}, {
  id: "6",
  product_code: "SKU-1006",
  name: "Almond Milk (1L)",
  category: "Dairy",
  quantity: 3,
  unit: "carton",
  reorder_point: 10,
  last_updated: "2026-06-14"
}, {
  id: "7",
  product_code: "SKU-1007",
  name: "Quinoa Grain (1kg)",
  category: "Pantry",
  quantity: 55,
  unit: "bag",
  reorder_point: 20,
  last_updated: "2026-06-18"
}, {
  id: "8",
  product_code: "SKU-1008",
  name: "Matcha Green Tea Powder",
  category: "Beverages",
  quantity: 28,
  unit: "tin",
  reorder_point: 10,
  last_updated: "2026-06-13"
}, {
  id: "9",
  product_code: "SKU-1009",
  name: "Greek Yogurt (500g)",
  category: "Dairy",
  quantity: 89,
  unit: "tub",
  reorder_point: 20,
  last_updated: "2026-06-17"
}, {
  id: "10",
  product_code: "SKU-1010",
  name: "Granola Mix (750g)",
  category: "Breakfast",
  quantity: 14,
  unit: "bag",
  reorder_point: 15,
  last_updated: "2026-06-12"
}, {
  id: "11",
  product_code: "SKU-1011",
  name: "Honey Raw (340g)",
  category: "Pantry",
  quantity: 33,
  unit: "jar",
  reorder_point: 10,
  last_updated: "2026-06-11"
}, {
  id: "12",
  product_code: "SKU-1012",
  name: "Oat Milk Barista (1L)",
  category: "Dairy",
  quantity: 6,
  unit: "carton",
  reorder_point: 8,
  last_updated: "2026-06-10"
}];
function DemoPage() {
  const [search, setSearch] = reactExports.useState("");
  const [sortKey, setSortKey] = reactExports.useState("name");
  const [sortDir, setSortDir] = reactExports.useState("asc");
  const [lockedOpen, setLockedOpen] = reactExports.useState(false);
  const filtered = reactExports.useMemo(() => {
    const term = search.trim().toLowerCase();
    let rows = term ? SAMPLE_DATA.filter((r) => r.name.toLowerCase().includes(term) || r.product_code.toLowerCase().includes(term) || r.category.toLowerCase().includes(term)) : [...SAMPLE_DATA];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      return sortDir === "asc" ? as < bs ? -1 : 1 : as < bs ? 1 : -1;
    });
    return rows;
  }, [search, sortKey, sortDir]);
  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  const SortIcon = ({
    col
  }) => {
    if (sortKey !== col) return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-3 text-muted-foreground/40" });
    return sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3 text-primary" });
  };
  const triggerLocked = () => setLockedOpen(true);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-50 border-b border-amber-200 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-amber-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-amber-500 animate-pulse" }),
          "Demo mode"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-700/80", children: "— changes won't be saved." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "h-8 text-xs", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: "Create a free account" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b bg-white/80 backdrop-blur-md px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2.5 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary grid place-items-center shadow-sm transition-transform group-hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-4 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground tracking-tight", children: "StockBalanse" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: "Sign in" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: "Get started" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Current Stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
            filtered.length.toLocaleString(),
            " of ",
            SAMPLE_DATA.length,
            " products"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: triggerLocked, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3.5 mr-1.5" }),
            "Import"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: triggerLocked, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5 mr-1.5" }),
            "Export"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: triggerLocked, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5 mr-1.5" }),
            "Add item"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name, code, or category…", className: "pl-9", value: search, onChange: (e) => setSearch(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-32 cursor-pointer select-none", onClick: () => toggleSort("product_code"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            "Code ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "product_code" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "cursor-pointer select-none", onClick: () => toggleSort("name"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            "Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "name" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "cursor-pointer select-none", onClick: () => toggleSort("category"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            "Category ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "category" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right cursor-pointer select-none", onClick: () => toggleSort("quantity"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-end gap-1", children: [
            "Quantity ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "quantity" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "cursor-pointer select-none", onClick: () => toggleSort("unit"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            "Unit ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "unit" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right cursor-pointer select-none", onClick: () => toggleSort("reorder_point"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-end gap-1", children: [
            "Reorder pt. ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "reorder_point" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "cursor-pointer select-none", onClick: () => toggleSort("last_updated"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            "Last updated ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "last_updated" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 8, className: "text-center py-14 text-muted-foreground", children: "No products match your search." }) }) : filtered.map((item) => {
          const low = item.reorder_point > 0 && item.quantity <= item.reorder_point;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: low ? "bg-amber-50/60" : void 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: item.product_code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: item.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: low ? "font-semibold text-amber-700" : "", children: item.quantity.toLocaleString() }),
              low && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2 border-amber-400 text-amber-700 bg-amber-50", children: "Low" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: item.unit }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-muted-foreground", children: item.reorder_point.toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-xs", children: item.last_updated }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "size-7 text-muted-foreground hover:text-foreground", onClick: triggerLocked, "aria-label": `Edit ${item.name}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "size-7 text-muted-foreground hover:text-destructive", onClick: triggerLocked, "aria-label": `Delete ${item.name}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
            ] }) })
          ] }, item.id);
        }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: lockedOpen, onOpenChange: setLockedOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto size-12 rounded-full bg-primary/10 grid place-items-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-6 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg", children: "Unlock your inventory" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Create a free account to manage your real inventory. Takes under a minute." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-col gap-2 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", children: [
          "Sign up free",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4 ml-1.5" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "w-full", onClick: () => setLockedOpen(false), children: "Keep exploring" })
      ] })
    ] }) })
  ] });
}
export {
  DemoPage as component
};
