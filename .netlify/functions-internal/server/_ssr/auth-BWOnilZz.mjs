import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-CV_TjftL.mjs";
import { u as useAuth } from "./router-CKI6RGD7.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-DQ5v2DYb.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Boxes } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/tailwind-merge.mjs";
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
function AuthPage() {
  const navigate = useNavigate();
  const {
    session,
    loading
  } = useAuth();
  reactExports.useEffect(() => {
    if (!loading && session) navigate({
      to: "/dashboard"
    });
  }, [session, loading, navigate]);
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [businessName, setBusinessName] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const strength = reactExports.useMemo(() => getPasswordStrength(password), [password]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const pwnedCount = await checkPasswordPwned(password);
        if (pwnedCount > 0) {
          toast.error(`This password has appeared in ${pwnedCount.toLocaleString()} data breach${pwnedCount === 1 ? "" : "es"}. Please choose a different password.`);
          return;
        }
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              business_name: businessName || "My Business"
            }
          }
        });
        if (error) throw error;
        toast.success("If this email is not yet registered, you will receive a confirmation link shortly.");
        setMode("signin");
        setPassword("");
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed") || error.message.toLowerCase().includes("not confirmed")) {
            toast.error("A verification is needed to sign in to your account. Please check your email.");
          } else {
            throw error;
          }
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/30 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto size-12 rounded-xl bg-primary grid place-items-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-6 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: "StockBalanse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Excel-driven inventory for small teams" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: mode, onValueChange: (v) => setMode(v), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signin", children: "Sign in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signup", children: "Sign up" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4 mt-6", children: [
        mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "biz", children: "Business name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "biz", value: businessName, onChange: (e) => setBusinessName(e.target.value), placeholder: "Acme Co." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pw", children: "Password" }),
            mode === "signup" && password.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${strength.color}`, children: strength.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "pw", type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value) }),
          mode === "signup" && password.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 pt-1", children: [1, 2, 3, 4].map((level) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 flex-1 rounded-full transition-colors ${strength.score >= level ? strength.barColor : "bg-muted"}` }, level)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signup" })
    ] }) })
  ] }) });
}
async function checkPasswordPwned(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  const prefix = hashHex.slice(0, 5);
  const suffix = hashHex.slice(5);
  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        "Add-Padding": "true"
      }
    });
    if (!res.ok) return 0;
    const text = await res.text();
    for (const line of text.split("\n")) {
      const [lineSuffix, countStr] = line.trim().split(":");
      if (lineSuffix === suffix) return parseInt(countStr, 10);
    }
  } catch {
    return 0;
  }
  return 0;
}
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) score = 1;
  if (score >= 4) score = 4;
  const levels = {
    1: {
      label: "Weak",
      color: "text-red-500",
      barColor: "bg-red-500"
    },
    2: {
      label: "Fair",
      color: "text-amber-500",
      barColor: "bg-amber-500"
    },
    3: {
      label: "Strong",
      color: "text-lime-600",
      barColor: "bg-lime-500"
    },
    4: {
      label: "Very Strong",
      color: "text-emerald-600",
      barColor: "bg-emerald-500"
    }
  };
  return {
    score,
    ...levels[score]
  };
}
export {
  AuthPage as component
};
