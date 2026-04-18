"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "../../../components/auth-guard";
import { supabase } from "../../../lib/supabase";

type Category = {
  id: number;
  slug: string;
  name: string;
};

export default function AddListingPage() {
  const [token, setToken] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const [{ data: authData }, categoriesRes] = await Promise.all([
        supabase.auth.getSession(),
        fetch("/api/categories"),
      ]);
      setToken(authData.session?.access_token ?? null);
      setSessionEmail(authData.session?.user?.email ?? null);

      const categoriesData = await categoriesRes.json();
      setCategories((categoriesData.items ?? []) as Category[]);
    };
    run();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token ?? null);
      setSessionEmail(session?.user?.email ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      category_id: Number(formData.get("category_id")),
      city: String(formData.get("city") ?? ""),
      contact_phone: String(formData.get("contact_phone") ?? ""),
      whatsapp_viber: String(formData.get("whatsapp_viber") ?? ""),
      price: formData.get("price") ? Number(formData.get("price")) : null,
      price_on_request: Boolean(formData.get("price_on_request")),
      emergency_service: Boolean(formData.get("emergency_service")),
      mobile_service: Boolean(formData.get("mobile_service")),
      working_hours: String(formData.get("working_hours") ?? ""),
      image_urls: String(formData.get("image_urls") ?? "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    try {
      if (!token) throw new Error("Moraš biti prijavljen da kreiraš oglas.");

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Neuspešno kreiranje oglasa");
      setResult(`Kreiran oglas: ${data.slug}`);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Došlo je do greške");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="card" style={{ maxWidth: 760, margin: "0 auto 24px" }}>
        <h1 style={{ marginTop: 0 }}>Dodaj oglas</h1>
        <p className="muted">
          Prijavljen korisnik: <strong>{sessionEmail ?? "nisi prijavljen"}</strong>
        </p>
        <p className="muted">
          Upravljanje postojećim oglasima: <Link href="/dashboard/my-listings">Moji oglasi</Link>
        </p>

        <form className="grid" onSubmit={onSubmit}>
          <label>
            <div className="muted">Naslov</div>
            <input className="input" name="title" required />
          </label>

          <label>
            <div className="muted">Opis</div>
            <textarea className="textarea" name="description" required />
          </label>

          <label>
            <div className="muted">Kategorija</div>
            <select className="select" name="category_id" required>
              <option value="">Izaberi</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <label>
              <div className="muted">Grad</div>
              <input className="input" name="city" required />
            </label>
            <label>
              <div className="muted">Telefon</div>
              <input className="input" name="contact_phone" required />
            </label>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <label>
              <div className="muted">Cena (RSD)</div>
              <input className="input" type="number" name="price" />
            </label>
            <label>
              <div className="muted">WhatsApp/Viber</div>
              <input className="input" name="whatsapp_viber" />
            </label>
          </div>

          <label>
            <div className="muted">Image URL-ovi (zarezom odvojeni)</div>
            <input className="input" name="image_urls" />
          </label>

          <button className="button" disabled={loading}>
            {loading ? "Čuvanje..." : "Sačuvaj oglas"}
          </button>
        </form>

        {result ? <p style={{ color: "#047857" }}>{result}</p> : null}
        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      </div>
    </AuthGuard>
  );
}
