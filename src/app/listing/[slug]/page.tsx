import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewForm } from "../../../components/review-form";
import { ServiceMap } from "../../../components/service-map";
import { StartChatButton } from "../../../components/start-chat-button";
import { env } from "../../../lib/env";
import { getSupabaseServer } from "../../../lib/supabase-server";

type Params = { params: Promise<{ slug: string }> };

type ListingDetail = {
  id: string;
  provider_id: string;
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
      "id,provider_id,slug,title,description,city,contact_phone,whatsapp_viber,working_hours,price,price_on_request,featured,emergency_service,mobile_service,average_rating,review_count",
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
    <div className="grid listing-page-container">
      {/* Banner Header */}
      <div className="card listing-hero-banner">
        <div className="listing-banner-image-box">
          <img
            src={mainImage}
            alt={listing.title}
            className="listing-banner-img"
          />
          <div className="listing-banner-overlay" />
          <div className="listing-banner-content">
            <div className="listing-banner-info">
              <div className="listing-badge-row">
                <span className="badge primary">📍 {listing.city}</span>
                {listing.featured && <span className="badge warning glow-badge">★ Istaknuto</span>}
                {listing.emergency_service && <span className="badge danger glow-danger">00-24h Hitno</span>}
                {listing.mobile_service && <span className="badge primary">Terenski servis</span>}
              </div>
              <h1 className="listing-main-title">{listing.title}</h1>
            </div>

            <div className="listing-rating-box">
              <div className="muted" style={{ fontSize: "0.8rem" }}>Prosečna ocena</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#F59E0B" }}>
                ★ {(listing.average_rating ?? 0).toFixed(1)}{" "}
                <small style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 400 }}>
                  ({listing.review_count ?? 0})
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Split on Desktop, Single Column on Mobile */}
      <div className="listing-content-grid">
        {/* Left / Main Details */}
        <div className="grid" style={{ gap: 20 }}>
          {/* Description */}
          <section className="card">
            <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: "1.2rem" }}>Opis Usluge</h2>
            <p style={{ whiteSpace: "pre-line", fontSize: "0.98rem", wordBreak: "break-word" }}>{listing.description}</p>
          </section>

          {/* Interactive Location Map */}
          <section className="card">
            <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: "1.2rem" }}>Lokacija Servisa</h2>
            <ServiceMap city={listing.city} title={listing.title} height={260} />
          </section>

          {/* Gallery */}
          {images.length > 0 ? (
            <section className="card">
              <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: "1.2rem" }}>Galerija Slika</h2>
              <div className="grid grid-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
                {images.map((img, idx) => (
                  <img
                    key={`${img.image_url}-${idx}`}
                    src={img.image_url}
                    alt={listing.title}
                    style={{
                      width: "100%",
                      height: 120,
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
            <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: "1.2rem" }}>Recenzije Korisnika</h2>
            <div className="grid" style={{ gap: 14 }}>
              {reviews.map((review) => (
                <article
                  key={review.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-color)",
                    padding: 14,
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div className="flex-between" style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{review.profiles?.full_name ?? "Korisnik"}</span>
                    <span style={{ color: "#F59E0B", fontWeight: 700, fontSize: "0.9rem" }}>★ {review.rating}/5</span>
                  </div>
                  <p style={{ marginBottom: 6, color: "var(--text-main)", fontSize: "0.9rem" }}>{review.comment ?? "Bez komentara."}</p>
                  <div className="muted" style={{ fontSize: "0.75rem" }}>
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
        <div className="grid" style={{ gap: 20, alignContent: "start" }}>
          <section className="card" style={{ border: "1px solid var(--border-hover)" }}>
            <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: "1.2rem" }}>Kontakt & Čat</h2>

            <div style={{ marginBottom: 16 }}>
              <div className="muted" style={{ fontSize: "0.8rem", marginBottom: 2 }}>Okvirna Cena Usluge</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#38BDF8" }}>
                {listing.price_on_request ? "Po dogovoru" : listing.price ? `${Number(listing.price).toLocaleString("sr-RS")} RSD` : "Na upit"}
              </div>
            </div>

            {listing.working_hours ? (
              <div style={{ marginBottom: 16 }}>
                <div className="muted" style={{ fontSize: "0.8rem", marginBottom: 2 }}>Radno vreme</div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{listing.working_hours}</div>
              </div>
            ) : null}

            <div className="grid" style={{ gap: 10 }}>
              {/* Direct In-App Realtime Chat Button */}
              <StartChatButton listingId={listing.id} providerId={listing.provider_id} />

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
