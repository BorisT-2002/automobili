"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchListingCard } from "../../components/search-listing-card";
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
  primary_image?: string | null;
  emergency_service?: boolean | null;
  contact_phone?: string | null;
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
  "Vrbas",
  "Zrenjanin",
  "Pančevo",
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="grid" style={{ gap: 20 }}>
      {/* Top Filter Card */}
      <section className="card">
        <h1 style={{ marginTop: 0, marginBottom: 12, fontSize: "1.6rem" }}>Pretraga majstora i auto servisa</h1>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, alignItems: "end" }}>
          <label>
            <div className="muted" style={{ marginBottom: 4, fontSize: "0.85rem" }}>Pretraga (naziv ili usluga)</div>
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="npr. kočnice, poliranje..."
            />
          </label>

          <label>
            <div className="muted" style={{ marginBottom: 4, fontSize: "0.85rem" }}>Kategorija</div>
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
            <div className="muted" style={{ marginBottom: 4, fontSize: "0.85rem" }}>Grad</div>
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

          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", paddingBottom: 8 }}>
            <input
              type="checkbox"
              checked={emergency}
              onChange={(e) => setEmergency(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: "#4F46E5" }}
            />
            <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>00-24h Hitno</span>
          </label>

          <button className="button" style={{ padding: "10px 20px" }} onClick={() => load(q, category, city, emergency)}>
            Pretraži
          </button>
        </div>
      </section>

      {/* Split Screen Layout: List on Left, Sticky Map on Right */}
      <div className="search-split-layout">
        {/* Left Side: Results Feed */}
        <div className="search-left-feed">
          <div className="flex-between" style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: "1rem" }}>
              {loading ? "Učitavanje..." : `${items.length} servisa u rezultatima`}
            </span>
          </div>

          {error ? <div className="card" style={{ color: "#b91c1c" }}>Greška: {error}</div> : null}

          {!loading && !error && items.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <h3>Nema pronađenih oglasa</h3>
              <p className="muted" style={{ marginTop: 8 }}>Pokušaj da izmeniš filtere ili promeniš reč za pretragu.</p>
            </div>
          ) : null}

          <div className="grid" style={{ gap: 14 }}>
            {items.map((item) => (
              <SearchListingCard key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* Right Side: Sticky Map */}
        <div className="search-right-map">
          <div className="card sticky-map-container" style={{ padding: 12 }}>
            <div className="flex-between" style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>📍 Mapa Servisa</span>
              <span className="badge primary">{items.length} pinova</span>
            </div>
            <ServiceMap
              city={city || "Beograd"}
              title="Pretraga Servisa"
              height="calc(100vh - 220px)"
              zoom={city ? 12 : 7}
              markers={mapMarkers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
