"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const setAccessCookie = (token: string | null) => {
  if (typeof document === "undefined") return;
  if (!token) {
    document.cookie = "am_access_token=; Path=/; Max-Age=0; SameSite=Lax";
    return;
  }
  document.cookie = `am_access_token=${token}; Path=/; Max-Age=604800; SameSite=Lax`;
};

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    const sync = async () => {
      const { data } = await supabase.auth.getSession();
      setSessionEmail(data.session?.user?.email ?? null);
      setAccessCookie(data.session?.access_token ?? null);
    };
    sync();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user?.email ?? null);
      setAccessCookie(session?.access_token ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setMessage(error ? error.message : "Uspešno prijavljivanje.");
  };

  const signUp = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setMessage(
      error
        ? error.message
        : "Nalog kreiran. Proveri email za potvrdu ako je uključena verifikacija.",
    );
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAccessCookie(null);
    setMessage("Odjavljen si.");
  };

  const signInGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth` : undefined,
      },
    });
    if (error) setMessage(error.message);
  };

  return (
    <div className="card" style={{ maxWidth: 560, margin: "0 auto 24px" }}>
      <h1 style={{ marginTop: 0 }}>Prijava i registracija</h1>
      <p className="muted">
        Trenutno prijavljen: <strong>{sessionEmail ?? "niko"}</strong>
      </p>

      <form className="grid" onSubmit={signIn}>
        <label>
          <div className="muted">Email</div>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <div className="muted">Lozinka</div>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="button" disabled={loading}>
          {loading ? "Sačekaj..." : "Prijavi se"}
        </button>
      </form>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button className="button" style={{ background: "#059669" }} onClick={signUp} disabled={loading}>
          Registruj se
        </button>
        <button className="button" style={{ background: "#ea580c" }} onClick={signOut}>
          Odjava
        </button>
        <button className="button" style={{ background: "#1f2937" }} onClick={signInGoogle}>
          Google login
        </button>
      </div>

      {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
    </div>
  );
}
