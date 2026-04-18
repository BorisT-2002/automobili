"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ListingCard } from "../../components/listing-card";

type SearchItem = {
  id: string | null;
  slug: string | null;
  title: string | null;
  city: string | null;
  category_name: string | null;
  average_rating: number | null;
  review_count: number | null;
  price: number | null;
  price_on_request: boolean | null;
  featured: boolean | null;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialCategory = useMemo(() => searchParams.get("category") ?? "", [searchParams]);
  const [category, setCategory] = useState(initialCategory);

  const load = async (query: string, categorySlug: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (categorySlug) params.set("category", categorySlug);
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(q, category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <section className="card">
        <h1 style={{ marginTop: 0 }}>Pretraga oglasa</h1>
        <div className="grid" style={{ gridTemplateColumns: "2fr 1fr auto", alignItems: "end" }}>
          <label>
            <div className="muted">Šta tražiš?</div>
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="npr. mehanicar golf novi sad"
            />
          </label>
          <label>
            <div className="muted">Kategorija (slug)</div>
            <input
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="auto-mehanicari"
            />
          </label>
          <button className="button" onClick={() => load(q, category)}>
            Traži
          </button>
        </div>
      </section>

      {loading ? <div className="card">Učitavanje...</div> : null}
      {error ? <div className="card">Greška: {error}</div> : null}

      <section className="grid grid-3">
        {items.map((item) => (
          <ListingCard key={item.id} {...item} />
        ))}
      </section>
    </div>
  );
}
