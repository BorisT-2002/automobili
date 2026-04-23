"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGuard } from "../../../components/auth-guard";

type ListingItem = {
  id: string;
  slug: string | null;
  title: string;
  city: string;
  status: string;
  featured: boolean;
  average_rating: number;
  review_count: number;
  categories: { name: string } | null;
};

export default function MyListingsPage() {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/my/listings");
    const body = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(body.error ?? "Greška pri učitavanju oglasa.");
      return;
    }
    setItems(body.items ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    const res = await fetch(`/api/my/listings/${id}`, { method: "DELETE" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Brisanje nije uspelo.");
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const setStatus = async (id: string, status: "active" | "paused" | "archived") => {
    const res = await fetch(`/api/my/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Izmena statusa nije uspela.");
      return;
    }
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  return (
    <AuthGuard>
      <div className="grid" style={{ gap: 12, paddingBottom: 24 }}>
        <div className="card">
          <h1 style={{ marginTop: 0 }}>Moji oglasi</h1>
          <p className="muted">
            <Link href="/dashboard/add-listing">+ Dodaj novi oglas</Link>
          </p>
          {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
          {loading ? <p>Učitavanje...</p> : null}
        </div>

        {(items ?? []).map((item) => (
          <article className="card" key={item.id}>
            <div className="muted">
              {item.categories?.name ?? "Kategorija"} • {item.city}
            </div>
            <h3 style={{ margin: "6px 0 8px" }}>{item.title}</h3>
            <div className="muted">
              Status: <strong>{item.status}</strong> • Ocena {item.average_rating.toFixed(1)} (
              {item.review_count}) {item.featured ? "• Istaknuto" : ""}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <Link className="button" style={{ width: "auto" }} href={`/dashboard/my-listings/${item.id}`}>
                Uredi
              </Link>
              {item.slug ? (
                <Link
                  className="button"
                  style={{ width: "auto", background: "#0f766e" }}
                  href={`/listing/${item.slug}`}
                >
                  Pogledaj
                </Link>
              ) : null}
              <button className="button" style={{ width: "auto", background: "#d97706" }} onClick={() => setStatus(item.id, "paused")}>
                Pauziraj
              </button>
              <button className="button" style={{ width: "auto", background: "#2563eb" }} onClick={() => setStatus(item.id, "active")}>
                Aktiviraj
              </button>
              <button className="button" style={{ width: "auto", background: "#7c2d12" }} onClick={() => setStatus(item.id, "archived")}>
                Arhiviraj
              </button>
              <button className="button" style={{ width: "auto", background: "#b91c1c" }} onClick={() => remove(item.id)}>
                Obriši
              </button>
            </div>
          </article>
        ))}
      </div>
    </AuthGuard>
  );
}
