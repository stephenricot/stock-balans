import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, Upload, ArrowDownToLine, Settings, LogOut, Boxes } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/stock", label: "Stock", icon: Package },
  { to: "/import", label: "Import", icon: Upload },
  { to: "/outbound", label: "Outbound", icon: ArrowDownToLine },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-60 flex-col bg-sidebar text-sidebar-foreground">
        <div className="px-6 py-6 flex items-center gap-2 border-b border-sidebar-border">
          <div className="size-9 rounded-lg bg-sidebar-primary grid place-items-center">
            <Boxes className="size-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold tracking-tight">StockBalanse</div>
            <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Inventory</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((n) => {
            const active = pathname === n.to || (n.to !== "/dashboard" && pathname.startsWith(n.to));
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={signOut}
          >
            <LogOut className="size-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-2">
            <Boxes className="size-5 text-primary" />
            <span className="font-semibold">StockBalanse</span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="size-4" />
          </Button>
        </div>
        <div className="md:hidden flex overflow-x-auto gap-1 px-2 py-2 border-b bg-card">
          {nav.map((n) => {
            const active = pathname === n.to || (n.to !== "/dashboard" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs whitespace-nowrap",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
