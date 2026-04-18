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
    <article className="card">
      <div className="muted">{props.category_name ?? "Usluga"}</div>
      <h3 style={{ margin: "8px 0" }}>
        <Link href={props.slug ? `/listing/${props.slug}` : "#"}>
          {props.title ?? "Bez naslova"}
        </Link>
      </h3>
      <div className="muted">{props.city ?? "Nepoznat grad"}</div>
      <div style={{ marginTop: 8 }}>
        Ocena: {props.average_rating?.toFixed(1) ?? "0.0"} ({props.review_count ?? 0})
      </div>
      <div style={{ marginTop: 8, fontWeight: 700 }}>
        {props.price_on_request ? "Po dogovoru" : props.price ? `${props.price} RSD` : "Nije uneto"}
      </div>
      {props.featured ? (
        <div style={{ marginTop: 10, color: "#b45309", fontWeight: 700 }}>Istaknuto</div>
      ) : null}
    </article>
  );
}
