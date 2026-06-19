import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-CLOo5LxO.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import "../_libs/sonner.mjs";
import { B as Boxes, A as ArrowRight, U as Upload, c as Package, D as Download } from "../_libs/lucide-react.mjs";
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
import "./client-CV_TjftL.mjs";
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
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
function LandingPage() {
  const {
    session
  } = useAuth();
  const ctaTo = session ? "/dashboard" : "/auth";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, { ctaTo }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, { ctaTo }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturesSection, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Navbar({
  ctaTo
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2.5 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-primary grid place-items-center shadow-sm transition-transform group-hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground tracking-tight", children: "StockBalanse" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: "Sign in" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: ctaTo, children: "Get started" }) })
    ] })
  ] }) });
}
function HeroSection({
  ctaTo
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative min-h-screen flex items-center justify-center overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-cover bg-center bg-no-repeat", style: {
      backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80')"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-slate-900/80" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-24 pb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-8 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-green-400 animate-pulse" }),
        "Free for small teams · No credit card required"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6", children: [
        "Inventory tracking that starts",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300", children: "with your Excel file." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed mb-10", children: "Import your existing stock sheet, track outbounds, and export clean reports — built for small teams who already live in spreadsheets." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "h-12 px-7 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: ctaTo, children: "Get started — it's free" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", className: "h-12 px-7 text-base font-medium bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/demo", children: [
          "Try demo",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4 ml-1.5" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 text-white/50 text-sm", children: "Join hundreds of small teams already tracking smarter" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs tracking-widest uppercase", children: "Scroll" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-8 bg-gradient-to-b from-white/40 to-transparent" })
    ] })
  ] });
}
const features = [{
  icon: Upload,
  title: "Excel Import",
  description: "Upload your existing .xlsx inventory in seconds. We map your columns automatically — no reformatting needed.",
  accent: "bg-blue-50 text-blue-600",
  ring: "ring-blue-100"
}, {
  icon: Package,
  title: "Live Stock Tracking",
  description: "Deduct outbounds with a reason, monitor low-stock alerts, and see your inventory in real-time across your team.",
  accent: "bg-emerald-50 text-emerald-600",
  ring: "ring-emerald-100"
}, {
  icon: Download,
  title: "Export Reports",
  description: "Download clean inventory snapshots as Excel any time. Share with suppliers, accountants, or your whole team.",
  accent: "bg-amber-50 text-amber-600",
  ring: "ring-amber-100"
}];
function FeaturesSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-24 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4", children: "Everything your small team needs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-xl mx-auto", children: "No complicated setup. Start with your spreadsheet and be running in under five minutes." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: features.map(({
      icon: Icon,
      title,
      description,
      accent,
      ring
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-2xl border bg-card p-8 shadow-sm ring-1 ${ring} hover:shadow-md transition-shadow group`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex size-12 rounded-xl items-center justify-center mb-5 ${accent}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-foreground mb-3", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: description })
    ] }, title)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "h-12 px-8 text-base", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", children: [
      "Start for free",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4 ml-2" })
    ] }) }) })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t bg-card py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-6 rounded-md bg-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-3.5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "© 2026 StockBalanse" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-foreground transition-colors", children: "Privacy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "hover:text-foreground transition-colors", children: "Sign in" })
    ] })
  ] }) });
}
export {
  LandingPage as component
};
