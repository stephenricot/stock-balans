import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, O as Outlet, u as useRouter, e as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-CKI6RGD7.mjs";
import { s as supabase } from "./client-CV_TjftL.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import "../_libs/sonner.mjs";
import { B as Boxes, L as LayoutDashboard, P as Package, U as Upload, A as ArrowDownToLine, S as Settings, a as ShieldCheck, b as LogOut } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
const baseNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/stock", label: "Stock", icon: Package },
  { to: "/import", label: "Import", icon: Upload },
  { to: "/outbound", label: "Outbound", icon: ArrowDownToLine },
  { to: "/settings", label: "Settings", icon: Settings }
];
const adminNav = { to: "/admin", label: "Admin", icon: ShieldCheck };
function AppShell({ children }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role } = useAuth();
  const nav = role === "super-admin" ? [...baseNav, adminNav] : baseNav;
  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden md:flex w-60 flex-col bg-sidebar text-sidebar-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 flex items-center gap-2 border-b border-sidebar-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-sidebar-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-5 text-sidebar-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold tracking-tight", children: "StockBalanse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-sidebar-foreground/60", children: "Inventory" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-3 py-4 space-y-1", children: nav.map((n) => {
        const active = pathname === n.to || n.to !== "/dashboard" && pathname.startsWith(n.to);
        const Icon = n.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: n.to,
            className: cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
              n.label
            ]
          },
          n.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          className: "w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          onClick: signOut,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4 mr-2" }),
            " Sign out"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden flex items-center justify-between px-4 py-3 border-b bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "StockBalanse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: signOut, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden flex overflow-x-auto gap-1 px-2 py-2 border-b bg-card", children: nav.map((n) => {
        const active = pathname === n.to || n.to !== "/dashboard" && pathname.startsWith(n.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: n.to,
            className: cn(
              "px-3 py-1.5 rounded-md text-xs whitespace-nowrap",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            ),
            children: n.label
          },
          n.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto", children })
    ] })
  ] });
}
function AuthGate() {
  const {
    session,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && !session) navigate({
      to: "/auth"
    });
  }, [loading, session, navigate]);
  if (loading || !session) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center text-muted-foreground", children: "Loading…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
export {
  AuthGate as component
};
