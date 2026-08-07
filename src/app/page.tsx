import Link from "next/link";
import { ListingCard } from "../components/listing-card";
import { getSupabaseServer } from "../lib/supabase-server";

const CATEGORY_ICONS: Record<string, string> = {
  "auto-mehanicari": "🔧",
  "autoelektricari": "⚡",
  "limari-farbari": "🎨",
  "poliranje-detailing": "✨",
  "dubinsko-ciscenje": "🧼",
  "tehnicki-pregled": "📋",
  "slep-sluzba": "🚨",
  "vulkanizeri": "🛞",
};

const POPULAR_CITIES = [
  { name: "Beograd", count: "180+ servisa", icon: "🏙️" },
  { name: "Novi Sad", count: "95+ servisa", icon: "🌉" },
  { name: "Niš", count: "65+ servisa", icon: "🏛️" },
  { name: "Kragujevac", count: "45+ servisa", icon: "🚗" },
  { name: "Subotica", count: "35+ servisa", icon: "🏰" },
  { name: "Vrbas", count: "20+ servisa", icon: "📍" },
  { name: "Zrenjanin", count: "30+ servisa", icon: "📍" },
  { name: "Pančevo", count: "40+ servisa", icon: "📍" },
];

export default async function HomePage() {
  const supabase = getSupabaseServer();
  const [{ data: categories }, { data: featured }, { data: latest }] = await Promise.all([
    supabase.from("categories").select("id,name,slug").order("name"),
    supabase
      .from("active_listing_cards")
      .select("*")
      .eq("featured", true)
      .limit(6),
    supabase
      .from("active_listing_cards")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return (
    <div className="grid" style={{ gap: 36 }}>
      {/* Compact Hero with Integrated Search */}
      <section className="hero-compact">
        <h1 className="hero-title">Pronađite pouzdan auto servis i majstora u Srbiji</h1>
        <p className="hero-subtitle">
          Pretražite proverene mehaničare, vulkanizere, autoelektričare i šlep službe sa ocenama vozača.
        </p>

        {/* Integrated Quick Search Form */}
        <form action="/search" method="GET" className="hero-search-bar">
          <div className="search-field">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              name="q"
              placeholder="Šta tražite? (npr. kočnice, dijagnostika...)"
              className="search-input"
            />
          </div>

          <div className="search-divider" />

          <div className="search-field">
            <span className="search-icon">📁</span>
            <select name="category" className="search-select">
              <option value="">Sve kategorije</option>
              {(categories ?? []).map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-divider" />

          <div className="search-field">
            <span className="search-icon">📍</span>
            <select name="city" className="search-select">
              <option value="">Svi gradovi</option>
              {POPULAR_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="button search-btn">
            Pretraži
          </button>
        </form>

        {/* Quick Category Pills below Search */}
        <div className="hero-pills">
          <span className="muted" style={{ fontSize: "0.85rem" }}>Brzi izbor:</span>
          <Link href="/search?category=auto-mehanicari" className="hero-pill">🔧 Mehanika</Link>
          <Link href="/search?category=autoelektricari" className="hero-pill">⚡ Elektrika</Link>
          <Link href="/search?category=slep-sluzba&emergency=true" className="hero-pill emergency">🚨 Šlep 00-24h</Link>
          <Link href="/search?category=vulkanizeri" className="hero-pill">🛞 Vulkanizeri</Link>
          <Link href="/search?category=poliranje-detailing" className="hero-pill">✨ Detailing</Link>
        </div>
      </section>

      {/* Categories Grid - Compact */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Kategorije Auto Usluga</h2>
          <Link href="/search" className="section-link">
            Sve kategorije →
          </Link>
        </div>

        <div className="categories-compact-grid">
          {(categories ?? []).map((item) => {
            const icon = CATEGORY_ICONS[item.slug] || "🚗";
            return (
              <Link key={item.id} className="category-compact-card" href={`/search?category=${item.slug}`}>
                <span className="category-icon">{icon}</span>
                <span className="category-name">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* NEW: Pretraži po Gradovima Sekcija */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Pretraži Auto Servise po Gradovima</h2>
          <Link href="/search" className="section-link">
            Svi gradovi →
          </Link>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {POPULAR_CITIES.map((c) => (
            <Link
              key={c.name}
              href={`/search?city=${encodeURIComponent(c.name)}`}
              className="card interactive"
              style={{ padding: 14, textAlign: "center" }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{c.name}</div>
              <div className="muted" style={{ fontSize: "0.75rem", marginTop: 2 }}>{c.count}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings - Compact Grid */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Preporučeni Servisi</h2>
          <Link href="/search?featured=true" className="section-link">
            Prikaži sve →
          </Link>
        </div>
        <div className="listings-compact-grid">
          {(featured ?? []).map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      {/* Latest Listings */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Najnoviji Oglasi</h2>
          <Link href="/search" className="section-link">
            Svi oglasi →
          </Link>
        </div>
        <div className="listings-compact-grid">
          {(latest ?? []).map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
