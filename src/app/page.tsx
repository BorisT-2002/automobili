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
    <div className="grid" style={{ gap: 48 }}>
      {/* Hero Section */}
      <section className="hero">
        <h1>Pronađite pravog majstora za vaš auto</h1>
        <p>
          Brzo i lako pretražite bazu najboljih proverenih auto servisa, mehanikara i šlep službi u Srbiji.
          Pregledajte ocene, usluge i kontaktirajte ih direktno na telefon, WhatsApp ili Viber.
        </p>

        <div className="hero-buttons">
          <Link className="button" href="/search">
            🔍 Pretraži Servise
          </Link>
          <Link className="button outline" href="/dashboard/add-listing">
            ➕ Postavi Besplatan Oglas
          </Link>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
            marginTop: 48,
            flexWrap: "wrap",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: 32,
          }}
        >
          <div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#38BDF8" }}>500+</div>
            <div className="muted" style={{ fontSize: "0.85rem" }}>Verifikovanih Servisa</div>
          </div>
          <div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#F59E0B" }}>★ 4.9</div>
            <div className="muted" style={{ fontSize: "0.85rem" }}>Prosečna Ocena Usluga</div>
          </div>
          <div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#10B981" }}>00-24h</div>
            <div className="muted" style={{ fontSize: "0.85rem" }}>Dežurne Šlep Službe</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="section-title">Kategorije Usluga</h2>
        <div className="grid grid-3">
          {(categories ?? []).map((item) => {
            const icon = CATEGORY_ICONS[item.slug] || "🚗";
            return (
              <Link key={item.id} className="card interactive" href={`/search?category=${item.slug}`}>
                <div className="flex-between">
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: "1.8rem" }}>{icon}</span>
                    <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{item.name}</span>
                  </div>
                  <span className="muted" style={{ fontSize: "1.2rem", fontWeight: 700 }}>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Listings */}
      <section>
        <div className="flex-between" style={{ marginBottom: 24 }}>
          <h2 className="section-title" style={{ margin: 0 }}>Preporučeni i Istaknuti Servisi</h2>
          <Link href="/search?featured=true" className="muted" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
            Prikaži sve →
          </Link>
        </div>
        <div className="grid grid-3">
          {(featured ?? []).map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      {/* Latest Listings */}
      <section>
        <div className="flex-between" style={{ marginBottom: 24 }}>
          <h2 className="section-title" style={{ margin: 0 }}>Najnovije Dodati Oglasi</h2>
          <Link href="/search" className="muted" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
            Svi oglasi →
          </Link>
        </div>
        <div className="grid grid-3">
          {(latest ?? []).map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
