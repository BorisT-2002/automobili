import Link from "next/link";
import { ListingCard } from "../components/listing-card";
import { supabaseServer } from "../lib/supabase-server";

export default async function HomePage() {
  const [{ data: categories }, { data: featured }, { data: latest }] = await Promise.all([
    supabaseServer.from("categories").select("id,name,slug").order("name"),
    supabaseServer
      .from("active_listing_cards")
      .select("*")
      .eq("featured", true)
      .limit(6),
    supabaseServer
      .from("active_listing_cards")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return (
    <div className="grid" style={{ gap: 20, paddingBottom: 24 }}>
      <section className="card">
        <h1 style={{ marginTop: 0 }}>Marketplace za auto usluge</h1>
        <p className="muted">
          Pronađi auto majstora po gradu, usluzi i ocenama. Bez booking sistema, čisto oglasnik.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <Link className="button" style={{ width: "auto" }} href="/search">
            Idi na pretragu
          </Link>
          <Link className="button" style={{ width: "auto", background: "#059669" }} href="/dashboard/add-listing">
            Postavi oglas
          </Link>
        </div>
      </section>

      <section>
        <h2>Kategorije</h2>
        <div className="grid grid-3">
          {(categories ?? []).map((item) => (
            <Link key={item.id} className="card" href={`/search?category=${item.slug}`}>
              {item.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Istaknuti oglasi</h2>
        <div className="grid grid-3">
          {(featured ?? []).map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section>
        <h2>Najnoviji oglasi</h2>
        <div className="grid grid-3">
          {(latest ?? []).map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
