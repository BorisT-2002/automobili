import Link from "next/link";

type SearchListingCardProps = {
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

export function SearchListingCard(props: SearchListingCardProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80";

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${props.title} ${props.city}`,
  )}`;

  return (
    <article className="card search-horizontal-card">
      <div className="search-card-image-box">
        <img
          src={props.primary_image || fallbackImage}
          alt={props.title ?? "Auto servis"}
          className="search-card-image"
          loading="lazy"
        />
        {props.emergency_service ? (
          <span className="badge danger glow-danger search-card-badge">00-24h Hitno</span>
        ) : null}
      </div>

      <div className="search-card-info">
        <div className="flex-between" style={{ gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
          <span className="badge primary">{props.category_name ?? "Auto Servis"}</span>
          <div className="card-rating">
            <span className="star-icon">★</span>
            <span className="rating-num">{(props.average_rating ?? 0).toFixed(1)}</span>
            <span className="rating-count muted">({props.review_count ?? 0})</span>
          </div>
        </div>

        <h3 className="search-card-title">
          <Link href={props.slug ? `/listing/${props.slug}` : "#"}>
            {props.title ?? "Bez naslova"}
          </Link>
        </h3>

        <div className="card-location muted" style={{ marginBottom: 12 }}>
          📍 {props.city ?? "Srbija"}
        </div>

        <div className="search-card-actions">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="button"
            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", padding: "8px 16px", fontSize: "0.85rem" }}
          >
            🧭 Navigacija
          </a>

          {props.contact_phone ? (
            <a
              href={`tel:${props.contact_phone}`}
              className="button"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)", padding: "8px 16px", fontSize: "0.85rem" }}
            >
              📞 Pozovi Servis
            </a>
          ) : (
            <Link
              href={props.slug ? `/listing/${props.slug}` : "#"}
              className="button outline"
              style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            >
              Detalji →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
