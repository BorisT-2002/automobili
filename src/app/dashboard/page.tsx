"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "../../components/auth-guard";
import { supabase } from "../../lib/supabase";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "customer" | "provider" | "admin";
  company_name: string | null;
  pib: string | null;
  is_verified: boolean;
  onboarding_completed: boolean;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const { data } = await supabase
        .from("profiles")
        .select("id,email,full_name,role,company_name,pib,is_verified,onboarding_completed")
        .eq("id", sessionData.session.user.id)
        .maybeSingle();

      if (data) {
        setProfile(data as Profile);
      } else {
        setProfile({
          id: sessionData.session.user.id,
          email: sessionData.session.user.email ?? null,
          full_name: null,
          role: "customer",
          company_name: null,
          pib: null,
          is_verified: false,
          onboarding_completed: false,
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <div className="card">Učitavanje vašeg dashboarda...</div>
      </AuthGuard>
    );
  }

  const isProvider = profile?.role === "provider";

  return (
    <AuthGuard>
      <div className="grid" style={{ gap: 24, maxWidth: 960, margin: "0 auto" }}>
        {/* Welcome Header Card */}
        <div className="card" style={{ border: "1px solid var(--border-hover)" }}>
          <div className="flex-between" style={{ flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <span className="badge primary">
                  {isProvider ? "🧰 Majstor / Servis" : "🚗 Vozač / Kupac"}
                </span>
                {isProvider && (
                  <span className="badge success">
                    {profile?.pib ? "✔️ Verifikovan Servis" : "Prijavljen Servis"}
                  </span>
                )}
              </div>
              <h1 style={{ marginTop: 0, fontSize: "2rem" }}>
                {profile?.company_name || profile?.full_name || "Dobrodošli na Dashboard"}
              </h1>
              <p className="muted">
                Prijavljeni email: <strong>{profile?.email}</strong>
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {isProvider ? (
                <Link href="/dashboard/add-listing" className="button">
                  ➕ Dodaj Novi Oglas
                </Link>
              ) : (
                <Link href="/search" className="button">
                  🔍 Pretraži Servise
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* CUSTOMER DASHBOARD VIEW */}
        {!isProvider ? (
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="card">
              <h3>🚗 Moj Nalog Vozača</h3>
              <p className="muted" style={{ marginTop: 8, marginBottom: 16 }}>
                Pratite svoje tražene auto servise, ocenjujte usluge i kontaktirajte majstore.
              </p>
              <Link href="/search" className="button outline" style={{ width: "100%" }}>
                🔍 Pretraži Sve Servise i Majstore
              </Link>
            </div>

            <div className="card" style={{ border: "1px solid var(--primary-light)" }}>
              <h3>🧰 Imate auto servis ili nudite majstorske usluge?</h3>
              <p className="muted" style={{ marginTop: 8, marginBottom: 16 }}>
                Postanite vidljivi hiljadama vozača širom Srbije! Besplatno oglašavanje vašeg servisa.
              </p>
              <Link href="/auth/onboarding" className="button" style={{ width: "100%" }}>
                🚀 Registruj Svoj Auto Servis
              </Link>
            </div>
          </div>
        ) : (
          /* PROVIDER DASHBOARD VIEW */
          <div className="grid" style={{ gap: 24 }}>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              <div className="card interactive">
                <div className="muted" style={{ fontSize: "0.85rem" }}>Status Naloga</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, marginTop: 4, color: "#10B981" }}>
                  {profile?.pib ? "✔️ Verifikovan" : "Aktivno"}
                </div>
              </div>

              <div className="card interactive">
                <div className="muted" style={{ fontSize: "0.85rem" }}>PIB / Matični Broj</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: 4 }}>
                  {profile?.pib || "Nije uneto"}
                </div>
              </div>

              <div className="card interactive">
                <div className="muted" style={{ fontSize: "0.85rem" }}>Upravljanje</div>
                <Link href="/dashboard/my-listings" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--primary)", marginTop: 4, display: "inline-block" }}>
                  Moji Oglasi →
                </Link>
              </div>
            </div>

            <div className="card">
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Moji Servisni Oglasi</h3>
                <Link href="/dashboard/add-listing" className="button" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  + Novi Oglas
                </Link>
              </div>
              <p className="muted">
                Upravljajte svojim oglasima, menjajte radno vreme, cene i radite na promociji pozicije servisa.
              </p>
              <div style={{ marginTop: 16 }}>
                <Link href="/dashboard/my-listings" className="button outline">
                  📋 Otvori Listu Moje Oglase
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
