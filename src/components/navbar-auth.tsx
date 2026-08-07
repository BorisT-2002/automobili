"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function NavbarAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user?.email ?? null);
      setLoading(false);
    };
    load();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return null;

  if (!email) {
    return (
      <Link href="/auth" className="btn-nav">
        🔑 Prijava / Registracija
      </Link>
    );
  }

  return (
    <>
      <Link href="/dashboard">Moj Dashboard</Link>
      <Link href="/dashboard/my-listings">Moji Oglasi</Link>
      <button
        type="button"
        className="button outline"
        style={{ padding: "8px 16px", fontSize: "0.85rem" }}
        onClick={logout}
      >
        Odjava
      </button>
    </>
  );
}
