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
};

export function ListingCard(props: ListingCardProps) {
  return (
    <article className="card interactive" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <span className="badge primary">{props.category_name ?? "Usluga"}</span>
        {props.featured && <span className="badge warning">Istaknuto</span>}
      </div>

      <h3 style={{ margin: "0 0 8px 0", fontSize: '1.15rem' }}>
        <Link href={props.slug ? `/listing/${props.slug}` : "#"}>
          {props.title ?? "Bez naslova"}
        </Link>
      </h3>

      <div className="muted" style={{ marginBottom: '24px', fontSize: '0.9rem' }}>
        📍 {props.city ?? "Nepoznat grad"}
      </div>

      <div className="flex-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: 'auto' }}>
        <div style={{ fontSize: '0.9rem', color: '#D97706', fontWeight: 600 }}>
          ★ {props.average_rating?.toFixed(1) ?? "0.0"} <span className="muted" style={{ fontWeight: 400 }}>({props.review_count ?? 0})</span>
        </div>
        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
          {props.price_on_request ? "Dogovor" : props.price ? `${props.price} RSD` : "Nije uneto"}
        </div>
      </div>
    </article>
  );
}
