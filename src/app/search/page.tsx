"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ListingCard } from "../../components/listing-card";
import { ServiceMap } from "../../components/service-map";

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

type Category = {
  id: number;
  slug: string;
  name: string;
};

const CITIES = [
  "Svi gradovi",
  "Beograd",
  "Novi Sad",
  "Niš",
  "Kragujevac",
  "Subotica",
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const initialCategory = useMemo(() => searchParams.get("category") ?? "", [searchParams]);
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [emergency, setEmergency] = useState(searchParams.get("emergency") === "true");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.items ?? []))
      .catch(() => {});
  }, []);

  const load = async (query: string, categorySlug: string, selectedCity: string, isEmergency: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (categorySlug) params.set("category", categorySlug);
      if (selectedCity && selectedCity !== "Svi gradovi") params.set("city", selectedCity);
      if (isEmergency) params.set("emergency", "true");

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Pretraga nije uspela");
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Došlo je do neočekivane greške");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(q, category, city, emergency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapMarkers = useMemo(() => {
    return items
      .filter((i) => i.title && i.city)
      .map((i) => ({
        title: i.title!,
        city: i.city!,
        slug: i.slug ?? undefined,
        category: i.category_name ?? undefined,
      }));
  }, [items]);

  return (
    <div className="grid" style={{ gap: 24 }}>
      <section className="card">
        <div className="flex-between" style={{ marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>Pretraga majstora i auto servisa</h1>
          <div style={{ display: "flex", gap: 8, background: "#0F172A", padding: 4, borderRadius: "var(--radius-full)", border: "1px solid var(--border-color)" }}>
            <button
              type="button"
              className="button"
              style={{
                background: viewMode === "grid" ? "var(--primary-gradient)" : "transparent",
                boxShadow: viewMode === "grid" ? "var(--shadow-glow)" : "none",
                padding: "8px 16px",
                fontSize: "0.85rem",
              }}
              onClick={() => setViewMode("grid")}
            >
              📋 Mreža
            </button>
            <button
              type="button"
              className="button"
              style={{
                background: viewMode === "map" ? "var(--primary-gradient)" : "transparent",
                boxShadow: viewMode === "map" ? "var(--shadow-glow)" : "none",
                padding: "8px 16px",
                fontSize: "0.85rem",
              }}
              onClick={() => setViewMode("map")}
            >
              🗺️ Prikaži na Mapi
            </button>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, alignItems: "end" }}>
          <label>
            <div className="muted" style={{ marginBottom: 6 }}>Pretraga (po nazivu ili usluzi)</div>
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="npr. kočnice, poliranje, dijagnostika..."
            />
          </label>

          <label>
            <div className="muted" style={{ marginBottom: 6 }}>Kategorija</div>
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Sve kategorije</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <div className="muted" style={{ marginBottom: 6 }}>Grad</div>
            <select
              className="select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {CITIES.map((c) => (
                <option key={c} value={c === "Svi gradovi" ? "" : c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", paddingBottom: 10 }}>
            <input
              type="checkbox"
              checked={emergency}
              onChange={(e) => setEmergency(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "#4F46E5" }}
            />
            <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Samo 00-24h (Hitne intervencije)</span>
          </label>

          <button className="button" onClick={() => load(q, category, city, emergency)}>
            Pretraži
          </button>
        </div>
      </section>

      {loading ? <div className="card">Učitavanje rezultata...</div> : null}
      {error ? <div className="card" style={{ color: "#b91c1c" }}>Greška: {error}</div> : null}

      {!loading && !error && items.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <h3>Nema pronađenih oglasa</h3>
          <p className="muted" style={{ marginTop: 8 }}>Pokušaj da izmeniš filtere ili promeniš reč za pretragu.</p>
        </div>
      ) : null}

      {viewMode === "grid" ? (
        <section className="grid grid-3">
          {items.map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </section>
      ) : (
        <section className="card">
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>Mape Servisa sa rezultatima pretrage ({items.length})</h2>
          <ServiceMap
            city={city || "Beograd"}
            title="Pretraga Servisa"
            height={500}
            zoom={city ? 12 : 7}
            markers={mapMarkers}
          />
        </section>
      )}
    </div>
  );
}
