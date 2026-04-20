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
    document.cookie = "am_access_token=; Path=/; Max-Age=0; SameSite=Lax";
    window.location.href = "/";
  };

  if (loading) return null;

  if (!email) {
    return <Link href="/auth">Prijava</Link>;
  }

  return (
    <>
      <Link href="/dashboard/my-listings">Moji oglasi</Link>
      <Link href="/dashboard/add-listing" className="btn-nav">
        Dodaj oglas
      </Link>
      <Link href="/admin/reviews">Admin</Link>
      <button type="button" className="button" style={{ width: "auto", padding: "8px 14px" }} onClick={logout}>
        Odjava
      </button>
    </>
  );
}
