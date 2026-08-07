import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewForm } from "../../../components/review-form";
import { ServiceMap } from "../../../components/service-map";
import { env } from "../../../lib/env";
import { getSupabaseServer } from "../../../lib/supabase-server";

type Params = { params: Promise<{ slug: string }> };

type ListingDetail = {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  city: string;
  contact_phone: string | null;
  whatsapp_viber: string | null;
  working_hours: string | null;
  price: number | null;
  price_on_request: boolean | null;
  featured: boolean | null;
  emergency_service: boolean | null;
  mobile_service: boolean | null;
  average_rating: number | null;
  review_count: number | null;
};

type ListingImage = { image_url: string; display_order: number | null };

type ListingReview = {
  id: string;
  rating: number | null;
  comment: string | null;
  created_at: string;
  profiles: { full_name: string | null } | null;
};

type ListingMeta = {
  title: string;
  description: string;
  city: string;
  slug: string | null;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await getSupabaseServer()
    .from("listings")
    .select("title,description,city,slug")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  const listing = data as ListingMeta | null;

  if (!listing) {
    return {
      title: "Oglas nije pronađen | AutoMajstor.rs",
    };
  }

  const baseUrl = env.siteUrl;
  const description = `${listing.title} u ${listing.city}. ${listing.description.slice(0, 140)}`;
  const canonicalPath = `/listing/${listing.slug}`;

  return {
    title: `${listing.title} | AutoMajstor.rs`,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${listing.title} | AutoMajstor.rs`,
      description,
      url: `${baseUrl}${canonicalPath}`,
      type: "article",
      locale: "sr_RS",
    },
  };
}

export default async function ListingPage({ params }: Params) {
  const { slug } = await params;
  const supabase = getSupabaseServer();

  const { data: rawListing } = await supabase
    .from("listings")
    .select(
      "id,slug,title,description,city,contact_phone,whatsapp_viber,working_hours,price,price_on_request,featured,emergency_service,mobile_service,average_rating,review_count",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!rawListing) notFound();
  const listing = rawListing as ListingDetail;

  const [imagesRes, reviewsRes] = await Promise.all([
    supabase
      .from("listing_images")
      .select("image_url,display_order")
      .eq("listing_id", listing.id)
      .order("display_order"),
    supabase
      .from("reviews")
      .select("id,rating,comment,created_at,profiles(full_name)")
      .eq("listing_id", listing.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const images = (imagesRes.data as ListingImage[] | null) ?? [];
  const reviews = (reviewsRes.data as ListingReview[] | null) ?? [];

  const whatsAppSource = listing.whatsapp_viber ?? listing.contact_phone ?? "";
  const whatsAppPhone = whatsAppSource.replace(/[^\d]/g, "");
  const prefilledMessage = encodeURIComponent(
    `Zdravo, interesuje me oglas "${listing.title}" na AutoMajstor.rs`,
  );

  const mainImage = images[0]?.image_url || "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="grid" style={{ gap: 24, paddingBottom: 40 }}>
      {/* Banner Header */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ position: "relative", width: "100%", height: 320, background: "#0F172A" }}>
          <img
            src={mainImage}
            alt={listing.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(18, 24, 39, 0.95) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              right: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span className="badge primary">📍 {listing.city}</span>
                {listing.featured && <span className="badge warning glow-badge">★ Istaknuto</span>}
                {listing.emergency_service && <span className="badge danger glow-danger">00-24h Hitno</span>}
                {listing.mobile_service && <span className="badge primary">Terenski servis</span>}
              </div>
              <h1 style={{ fontSize: "2.2rem", margin: 0, color: "white" }}>{listing.title}</h1>
            </div>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.85)",
                backdropFilter: "blur(12px)",
                padding: "12px 20px",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                textAlign: "right",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Prosečna ocena</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#F59E0B" }}>
                ★ {(listing.average_rating ?? 0).toFixed(1)} <small style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 400 }}>({listing.review_count ?? 0} ocena)</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="grid" style={{ gap: 24 }}>
          {/* Description */}
          <section className="card">
            <h2 style={{ marginTop: 0, marginBottom: 16 }}>Opis Usluge</h2>
            <p style={{ whiteSpace: "pre-line", fontSize: "1.05rem" }}>{listing.description}</p>
          </section>

          {/* Interactive Location Map */}
          <section className="card">
            <h2 style={{ marginTop: 0, marginBottom: 16 }}>Lokacija Servisa</h2>
            <ServiceMap city={listing.city} title={listing.title} height={300} />
          </section>

          {/* Gallery */}
          {images.length > 0 ? (
            <section className="card">
              <h2 style={{ marginTop: 0, marginBottom: 16 }}>Galerija Slika</h2>
              <div className="grid grid-3">
                {images.map((img, idx) => (
                  <img
                    key={`${img.image_url}-${idx}`}
                    src={img.image_url}
                    alt={listing.title}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                    }}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {/* Reviews List */}
          <section className="card">
            <h2 style={{ marginTop: 0, marginBottom: 16 }}>Recenzije Korisnika</h2>
            <div className="grid" style={{ gap: 16 }}>
              {reviews.map((review) => (
                <article
                  key={review.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-color)",
                    padding: 16,
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div className="flex-between" style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 700 }}>{review.profiles?.full_name ?? "Korisnik"}</span>
                    <span style={{ color: "#F59E0B", fontWeight: 700 }}>★ {review.rating}/5</span>
                  </div>
                  <p style={{ marginBottom: 8, color: "var(--text-main)" }}>{review.comment ?? "Bez komentara."}</p>
                  <div className="muted" style={{ fontSize: "0.8rem" }}>
                    {new Date(review.created_at).toLocaleDateString("sr-RS")}
                  </div>
                </article>
              ))}
              {reviews.length === 0 ? <div className="muted">Još nema recenzija. Budi prvi koji će ostaviti ocenu!</div> : null}
            </div>
          </section>

          <ReviewForm listingId={listing.id} />
        </div>

        {/* Sidebar Info & Action Buttons */}
        <div className="grid" style={{ gap: 24, alignContent: "start" }}>
          <section className="card" style={{ border: "1px solid var(--border-hover)" }}>
            <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: "1.3rem" }}>Kontakt & Radno Vreme</h2>

            <div style={{ marginBottom: 20 }}>
              <div className="muted" style={{ fontSize: "0.85rem", marginBottom: 4 }}>Okvirna Cena Usluge</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#38BDF8" }}>
                {listing.price_on_request ? "Po dogovoru" : listing.price ? `${Number(listing.price).toLocaleString("sr-RS")} RSD` : "Na upit"}
              </div>
            </div>

            {listing.working_hours ? (
              <div style={{ marginBottom: 20 }}>
                <div className="muted" style={{ fontSize: "0.85rem", marginBottom: 4 }}>Radno vreme</div>
                <div style={{ fontWeight: 600 }}>{listing.working_hours}</div>
              </div>
            ) : null}

            <div className="grid" style={{ gap: 12 }}>
              {listing.contact_phone ? (
                <a
                  className="button"
                  style={{ width: "100%", background: "#10B981" }}
                  href={`tel:${listing.contact_phone}`}
                >
                  📞 Pozovi: {listing.contact_phone}
                </a>
              ) : null}

              {whatsAppPhone ? (
                <a
                  className="button"
                  style={{ width: "100%", background: "#25D366" }}
                  href={`https://wa.me/${whatsAppPhone}?text=${prefilledMessage}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 Poruka na WhatsApp
                </a>
              ) : null}

              {whatsAppPhone ? (
                <a
                  className="button"
                  style={{ width: "100%", background: "#7360F2" }}
                  href={`viber://chat?number=%2B${whatsAppPhone}`}
                >
                  🟣 Poruka na Viber
                </a>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
