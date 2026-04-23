import Link from "next/link";
import { ListingCard } from "../components/listing-card";
import { getSupabaseServer } from "../lib/supabase-server";

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
    <div className="grid">
      <section className="hero">
        <h1>Pronađite pravog majstora za vaš auto</h1>
        <p>
          Brzo i lako pretražite bazu najboljih auto servisa i majstora u Srbiji.
          Pregledajte usluge, ocene i kontaktirajte ih direktno.
        </p>
        <div className="hero-buttons">
          <Link className="button" href="/search">
            Pretraži usluge
          </Link>
          <Link className="button success" href="/dashboard/add-listing">
            Postavi oglas
          </Link>
        </div>
      </section>

      <section>
        <h2 className="section-title">Kategorije usluga</h2>
        <div className="grid grid-3">
          {(categories ?? []).map((item) => (
            <Link key={item.id} className="card interactive" href={`/search?category=${item.slug}`}>
              <div className="flex-between">
                <span style={{ fontWeight: 600 }}>{item.name}</span>
                <span className="muted">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Istaknuti oglasi</h2>
        <div className="grid grid-3">
          {(featured ?? []).map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Najnoviji oglasi</h2>
        <div className="grid grid-3">
          {(latest ?? []).map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
