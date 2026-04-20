"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type AuthGuardProps = {
  children: React.ReactNode;
  requireRole?: "admin";
};

export function AuthGuard({ children, requireRole }: AuthGuardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!mounted) return;
      if (sessionError) {
        setError("Greška pri proveri sesije.");
        setReady(false);
        return;
      }
      if (!data.session) {
        const next = encodeURIComponent(window.location.pathname);
        router.replace(`/auth?next=${next}`);
        return;
      }
      if (requireRole === "admin") {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .maybeSingle();

        if (profileError || profile?.role !== "admin") {
          setError("Ova stranica je dostupna samo admin korisniku.");
          setReady(false);
          return;
        }
      }
      setError(null);
      setReady(true);
    };
    check();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session) {
        const next = encodeURIComponent(window.location.pathname);
        router.replace(`/auth?next=${next}`);
        return;
      }
      setReady(true);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [requireRole, router]);

  if (error) return <div className="card">{error}</div>;

  if (!ready) return <div className="card">Provera sesije...</div>;
  return <>{children}</>;
}
