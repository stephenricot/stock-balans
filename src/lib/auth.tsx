import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  session: Session | null;
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthCtx = createContext<AuthState>({ session: null, user: null, role: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async (userId: string) => {
      const { data } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      setRole(data?.role ?? null);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        fetchRole(s.user.id).finally(() => setLoading(false));
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        fetchRole(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthCtx.Provider value={{ session, user: session?.user ?? null, role, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
