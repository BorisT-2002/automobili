import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="card" style={{ maxWidth: 620, margin: "0 auto 24px" }}>
      <h1 style={{ marginTop: 0 }}>Stranica nije pronađena</h1>
      <p className="muted">Proveri URL ili se vrati na početnu stranicu.</p>
      <Link className="button" style={{ width: "auto" }} href="/">
        Nazad na početnu
      </Link>
    </div>
  );
}
