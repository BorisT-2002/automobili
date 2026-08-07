"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { env } from "../../lib/env";
import { supabase } from "../../lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<"customer" | "provider">("customer");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    const sync = async () => {
      const { data } = await supabase.auth.getSession();
      setSessionEmail(data.session?.user?.email ?? null);
      const next = searchParams.get("next");
      if (data.session && next && next.startsWith("/")) {
        router.replace(next);
      }
    };
    sync();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user?.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [router, searchParams]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setMessage(error.message);
        return;
      }
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") ? next : "/");
      router.refresh();
    } else {
      // REGISTRATION
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: selectedRole,
          },
        },
      });

      setLoading(false);

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.user) {
        // Save profile role
        await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: selectedRole,
          });

        if (selectedRole === "provider") {
          router.replace("/auth/onboarding");
        } else {
          setMessage("Uspešna registracija! Dobrodošli na AutoMajstor.rs");
          setTimeout(() => router.replace("/"), 1000);
        }
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setMessage("Odjavljen si.");
    router.refresh();
  };

  const signInGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${env.siteUrl}/auth`,
      },
    });
    if (error) setMessage(error.message);
  };

  return (
    <div className="card" style={{ maxWidth: 580, margin: "20px auto 40px" }}>
      {/* Mode Switcher Header */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "#0F172A", padding: 6, borderRadius: "var(--radius-full)", border: "1px solid var(--border-color)" }}>
        <button
          type="button"
          className="button"
          style={{
            flex: 1,
            background: mode === "login" ? "var(--primary-gradient)" : "transparent",
            boxShadow: mode === "login" ? "var(--shadow-glow)" : "none",
            fontSize: "0.95rem",
          }}
          onClick={() => {
            setMode("login");
            setMessage(null);
          }}
        >
          🔑 Prijava na Nalog
        </button>
        <button
          type="button"
          className="button"
          style={{
            flex: 1,
            background: mode === "register" ? "var(--primary-gradient)" : "transparent",
            boxShadow: mode === "register" ? "var(--shadow-glow)" : "none",
            fontSize: "0.95rem",
          }}
          onClick={() => {
            setMode("register");
            setMessage(null);
          }}
        >
          ✨ Registracija Novog Nologa
        </button>
      </div>

      <h1 style={{ marginTop: 0, fontSize: "1.8rem" }}>
        {mode === "login" ? "Dobrodošli Nazad" : "Kreirajte Nalog na AutoMajstor.rs"}
      </h1>
      <p className="muted" style={{ marginBottom: 20 }}>
        {sessionEmail ? (
          <>Prijavljeni ste kao: <strong>{sessionEmail}</strong></>
        ) : (
          mode === "login" ? "Prijavite se sa svojim podacima" : "Izaberite tip naloga i započnite"
        )}
      </p>

      {sessionEmail ? (
        <div style={{ marginBottom: 20 }}>
          <p className="muted" style={{ marginBottom: 12 }}>
            <Link href="/dashboard/my-listings">Moji oglasi</Link> •{" "}
            <Link href="/dashboard/add-listing">Dodaj oglas</Link> •{" "}
            <Link href="/admin/reviews">Admin</Link>
          </p>
          <button className="button outline" onClick={signOut}>
            Odjavi se
          </button>
        </div>
      ) : null}

      {!sessionEmail ? (
        <form className="grid" onSubmit={handleSubmit} style={{ gap: 16 }}>
          {/* ROLE SELECTOR CARDS FOR REGISTRATION */}
          {mode === "register" ? (
            <div>
              <div className="muted" style={{ marginBottom: 8 }}>Izaberite tip naloga *</div>
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div
                  className="card interactive"
                  style={{
                    padding: 16,
                    cursor: "pointer",
                    borderColor: selectedRole === "customer" ? "var(--primary)" : "var(--border-color)",
                    background: selectedRole === "customer" ? "rgba(99, 102, 241, 0.15)" : "var(--bg-card)",
                  }}
                  onClick={() => setSelectedRole("customer")}
                >
                  <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>🚗</div>
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>Vozač / Kupac</div>
                  <div className="muted" style={{ fontSize: "0.8rem", marginTop: 4 }}>
                    Tražim majstore, ocenjujem i zakazujem termine
                  </div>
                </div>

                <div
                  className="card interactive"
                  style={{
                    padding: 16,
                    cursor: "pointer",
                    borderColor: selectedRole === "provider" ? "var(--primary)" : "var(--border-color)",
                    background: selectedRole === "provider" ? "rgba(99, 102, 241, 0.15)" : "var(--bg-card)",
                  }}
                  onClick={() => setSelectedRole("provider")}
                >
                  <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>🧰</div>
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>Majstor / Servis</div>
                  <div className="muted" style={{ fontSize: "0.8rem", marginTop: 4 }}>
                    Nudim auto usluge i oglašavam svoj servis
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {mode === "register" ? (
            <label>
              <div className="muted" style={{ marginBottom: 6 }}>Ime i Prezime *</div>
              <input
                className="input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="npr. Marko Marković"
                required
              />
            </label>
          ) : null}

          <label>
            <div className="muted" style={{ marginBottom: 6 }}>Email adresa *</div>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vaš@email.com"
              required
            />
          </label>

          <label>
            <div className="muted" style={{ marginBottom: 6 }}>Lozinka *</div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <button className="button" style={{ marginTop: 8 }} disabled={loading}>
            {loading
              ? "Sačekaj..."
              : mode === "login"
              ? "Prijavi se"
              : selectedRole === "provider"
              ? "Dalje na Registraciju Servisa →"
              : "Registruj se kao Vozač"}
          </button>

          <div style={{ textAlign: "center", margin: "10px 0" }}>
            <span className="muted">ili se prijavi preko</span>
          </div>

          <button
            type="button"
            className="button outline"
            style={{ width: "100%" }}
            onClick={signInGoogle}
          >
            🌐 Prijavi se preko Google Naloga
          </button>
        </form>
      ) : null}

      {message ? (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: "var(--radius-md)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border-color)",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      ) : null}
    </div>
  );
}
