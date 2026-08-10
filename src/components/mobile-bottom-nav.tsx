"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <nav className="mobile-bottom-nav">
      <Link href="/" className={`bottom-nav-item ${pathname === "/" ? "active" : ""}`}>
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Početna</span>
      </Link>

      <Link href="/search" className={`bottom-nav-item ${pathname.startsWith("/search") ? "active" : ""}`}>
        <span className="nav-icon">🔍</span>
        <span className="nav-label">Pretraga</span>
      </Link>

      <Link
        href={isLoggedIn ? "/dashboard/messages" : "/auth"}
        className={`bottom-nav-item ${pathname.startsWith("/dashboard/messages") ? "active" : ""}`}
      >
        <span className="nav-icon">💬</span>
        <span className="nav-label">Poruke</span>
      </Link>

      <Link
        href={isLoggedIn ? "/dashboard" : "/auth"}
        className={`bottom-nav-item ${pathname.startsWith("/dashboard") || pathname.startsWith("/auth") ? "active" : ""}`}
      >
        <span className="nav-icon">👤</span>
        <span className="nav-label">{isLoggedIn ? "Dashboard" : "Prijava"}</span>
      </Link>
    </nav>
  );
}
