import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

// IMPORTANT: This route guard is a UX convenience only.
// The real security boundary for admin data is enforced server-side
// by the requireSuperAdmin middleware on every admin createServerFn.
export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminGuard,
});

function AdminGuard() {
  const { role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && role !== "super-admin") {
      toast.error("Access denied. Super-admin only.");
      navigate({ to: "/dashboard" });
    }
  }, [loading, role, navigate]);

  if (loading || role !== "super-admin") {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  return <Outlet />;
}
