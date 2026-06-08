import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Boxes } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — StockBalanse" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard" });
  }, [session, loading, navigate]);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [busy, setBusy] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { business_name: businessName || "My Business" },
          },
        });
        if (error) throw error;
        if (data.user?.identities?.length === 0) {
          toast.info("This email is already registered. Please sign in instead.");
        } else {
          toast.success("Account created. Please check your email to verify your account before signing in.");
        }
        setMode("signin");
        setPassword("");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed") || error.message.toLowerCase().includes("not confirmed")) {
            toast.error("A verification is needed to sign in to your account. Please check your email.");
          } else {
            throw error;
          }
        }
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/30 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto size-12 rounded-xl bg-primary grid place-items-center mb-2">
            <Boxes className="size-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">StockBalanse</CardTitle>
          <CardDescription>Excel-driven inventory for small teams</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <form onSubmit={submit} className="space-y-4 mt-6">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="biz">Business name</Label>
                  <Input id="biz" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Co." />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pw">Password</Label>
                  {mode === "signup" && password.length > 0 && (
                    <span className={`text-xs font-medium ${strength.color}`}>
                      {strength.label}
                    </span>
                  )}
                </div>
                <Input
                  id="pw"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {mode === "signup" && password.length > 0 && (
                  <div className="flex gap-1 pt-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          strength.score >= level ? strength.barColor : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>
            <TabsContent value="signin" />
            <TabsContent value="signup" />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // clamp to 1-4
  if (score <= 1) score = 1;
  if (score >= 4) score = 4;

  const levels: Record<number, { label: string; color: string; barColor: string }> = {
    1: { label: "Weak", color: "text-red-500", barColor: "bg-red-500" },
    2: { label: "Fair", color: "text-amber-500", barColor: "bg-amber-500" },
    3: { label: "Strong", color: "text-lime-600", barColor: "bg-lime-500" },
    4: { label: "Very Strong", color: "text-emerald-600", barColor: "bg-emerald-500" },
  };

  return { score, ...levels[score] };
}
