import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as getAdminUsers } from "./admin.functions-BA8rSV8j.mjs";
import { P as PageHeader } from "./PageHeader-DnYHjpB5.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { S as Skeleton } from "./skeleton-CoUJiN10.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-RrXKMtST.mjs";
import "../_libs/seroval.mjs";
import { c as Search } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-D7uNzhwn.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./admin.middleware-a-24SqkX.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
const PAGE_SIZE = 25;
function roleBadge(role) {
  if (role === "super-admin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100", children: role });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100", children: role });
}
function AdminUsers() {
  const [search, setSearch] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getAdminUsers()
  });
  const allUsers = data?.users ?? [];
  const filtered = allUsers.filter((u) => {
    const q = search.toLowerCase();
    return u.businessName.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Users", description: "All registered users and their inventory overview." }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 text-sm mb-6", children: "Failed to load users. Make sure your account has super-admin access." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4 max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by business name or role...", value: search, onChange: (e) => {
        setSearch(e.target.value);
        setPage(1);
      }, className: "pl-9" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Business Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Joined" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Products" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Qty on Hand" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? Array.from({
        length: 6
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: Array.from({
        length: 5
      }).map((__, j) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, j)) }, i)) : paged.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "py-12 text-center text-muted-foreground text-sm", children: search ? "No users match your search." : "No users found." }) }) : paged.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: u.businessName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: roleBadge(u.role) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: format(new Date(u.joinedAt), "MMM d, yyyy") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right tabular-nums", children: u.productCount.toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right tabular-nums", children: u.totalQuantity.toLocaleString() })
      ] }, u.userId)) })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Showing ",
        (currentPage - 1) * PAGE_SIZE + 1,
        "–",
        Math.min(currentPage * PAGE_SIZE, filtered.length),
        " of ",
        filtered.length
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 py-1 rounded border enabled:hover:bg-muted disabled:opacity-40", disabled: currentPage <= 1, onClick: () => setPage((p) => p - 1), children: "Previous" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 py-1 rounded border enabled:hover:bg-muted disabled:opacity-40", disabled: currentPage >= totalPages, onClick: () => setPage((p) => p + 1), children: "Next" })
      ] })
    ] })
  ] });
}
export {
  AdminUsers as component
};
