import Link from "next/link";

type ListingCardProps = {
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
};

export function ListingCard(props: ListingCardProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80";

  return (
    <article className="card interactive listing-card">
      <div className="card-image-wrapper">
        <img
          src={props.primary_image || fallbackImage}
          alt={props.title ?? "Auto servis"}
          className="card-image"
          loading="lazy"
        />
        <div className="card-badge-row">
          <span className="badge primary">{props.category_name ?? "Usluga"}</span>
          {props.featured && <span className="badge warning glow-badge">★ Istaknuto</span>}
          {props.emergency_service && <span className="badge danger glow-danger">00-24h</span>}
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">
          <Link href={props.slug ? `/listing/${props.slug}` : "#"}>
            {props.title ?? "Bez naslova"}
          </Link>
        </h3>

        <div className="card-location muted">
          <span>📍 {props.city ?? "Srbija"}</span>
        </div>

        <div className="card-footer flex-between">
          <div className="card-rating">
            <span className="star-icon">★</span>
            <span className="rating-num">{(props.average_rating ?? 0).toFixed(1)}</span>
            <span className="rating-count muted">({props.review_count ?? 0})</span>
          </div>

          <div className="card-price">
            {props.price_on_request ? (
              <span className="price-tag">Po dogovoru</span>
            ) : props.price ? (
              <span className="price-amount">{Number(props.price).toLocaleString("sr-RS")} <small>RSD</small></span>
            ) : (
              <span className="price-tag muted">Na upit</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
