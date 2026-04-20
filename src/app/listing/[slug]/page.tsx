import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewForm } from "../../../components/review-form";
import { supabaseServer } from "../../../lib/supabase-server";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { data: listing } = await supabaseServer
    .from("listings")
    .select("title,description,city,slug")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!listing) {
    return {
      title: "Oglas nije pronađen | AutoMajstor.rs",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
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

  const { data: listing } = await supabaseServer
    .from("listings")
    .select(
      "id,slug,title,description,city,contact_phone,whatsapp_viber,working_hours,price,price_on_request,featured,average_rating,review_count,categories(name,slug),profiles(full_name,is_verified)",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!listing) notFound();

  const [{ data: images }, { data: reviews }] = await Promise.all([
    supabaseServer
      .from("listing_images")
      .select("image_url,display_order")
      .eq("listing_id", listing.id)
      .order("display_order"),
    supabaseServer
      .from("reviews")
      .select("id,rating,comment,created_at,profiles(full_name)")
      .eq("listing_id", listing.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const whatsAppPhone = listing.whatsapp_viber
    ? listing.whatsapp_viber.replace(/[^\d]/g, "")
    : listing.contact_phone.replace(/[^\d]/g, "");
  const prefilledMessage = encodeURIComponent(
    `Zdravo, interesuje me oglas "${listing.title}" na AutoMajstor.rs`,
  );

  return (
    <div className="grid" style={{ gap: 16, paddingBottom: 24 }}>
      <section className="card">
        <h1 style={{ marginTop: 0 }}>{listing.title}</h1>
        <div className="muted">
          {listing.city} • Ocena {listing.average_rating.toFixed(1)} ({listing.review_count})
        </div>
        <p style={{ marginTop: 14 }}>{listing.description}</p>
        <div style={{ marginTop: 14, fontWeight: 700 }}>
          Cena: {listing.price_on_request ? "Po dogovoru" : listing.price ? `${listing.price} RSD` : "Nije uneto"}
        </div>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Kontakt</h2>
        <div>Telefon: {listing.contact_phone}</div>
        {listing.whatsapp_viber ? <div>WhatsApp/Viber: {listing.whatsapp_viber}</div> : null}
        {listing.working_hours ? <div>Radno vreme: {listing.working_hours}</div> : null}
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <a className="button" style={{ width: "auto", background: "#0f766e" }} href={`tel:${listing.contact_phone}`}>
            Pozovi
          </a>
          <a
            className="button"
            style={{ width: "auto", background: "#16a34a" }}
            href={`https://wa.me/${whatsAppPhone}?text=${prefilledMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            Chat na WhatsApp
          </a>
          <a
            className="button"
            style={{ width: "auto", background: "#2563eb" }}
            href={`viber://chat?number=%2B${whatsAppPhone}`}
          >
            Chat na Viber
          </a>
        </div>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Galerija</h2>
        <div className="grid grid-3">
          {(images ?? []).map((img) => (
            <img
              key={`${img.image_url}-${img.display_order}`}
              src={img.image_url}
              alt={listing.title}
              style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
          ))}
        </div>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Recenzije</h2>
        <div className="grid">
          {(reviews ?? []).map((review) => (
            <article key={review.id} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 12 }}>
              <strong>{review.profiles?.full_name ?? "Korisnik"}</strong> • {review.rating}/5
              <p style={{ marginBottom: 4 }}>{review.comment ?? "Bez komentara."}</p>
              <div className="muted">{new Date(review.created_at).toLocaleDateString("sr-RS")}</div>
            </article>
          ))}
          {reviews?.length === 0 ? <div className="muted">Još nema recenzija.</div> : null}
        </div>
      </section>

      <ReviewForm listingId={listing.id} />
    </div>
  );
}
