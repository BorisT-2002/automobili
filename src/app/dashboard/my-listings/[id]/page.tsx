"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "../../../../components/auth-guard";

type Category = { id: number; name: string; slug: string };
type EditableListing = {
  id: string;
  title: string;
  description: string;
  category_id: number;
  city: string;
  contact_phone: string;
  whatsapp_viber: string | null;
  vehicle_brand: string | null;
  price: number | null;
  price_on_request: boolean;
  emergency_service: boolean;
  mobile_service: boolean;
  working_hours: string | null;
  status: "draft" | "active" | "paused" | "archived";
};

export default function EditMyListingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [listing, setListing] = useState<EditableListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const [categoriesRes, listingRes] = await Promise.all([
        fetch("/api/categories"),
        fetch(`/api/my/listings/${params.id}`),
      ]);

      const categoriesBody = await categoriesRes.json();
      setCategories(categoriesBody.items ?? []);

      const listingBody = await listingRes.json();
      setLoading(false);
      if (!listingRes.ok) {
        setError(listingBody.error ?? "Nije moguće učitati oglas.");
        return;
      }
      setListing(listingBody.item);
    };
    init();
  }, [params.id]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!listing) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    const res = await fetch(`/api/my/listings/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listing),
    });

    const body = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(body.error ?? "Čuvanje nije uspelo.");
      return;
    }
    setMessage("Oglas je uspešno ažuriran.");
  };

  if (loading) return <AuthGuard><div className="card">Učitavanje...</div></AuthGuard>;

  return (
    <AuthGuard>
      <div className="card" style={{ maxWidth: 820, margin: "0 auto 24px" }}>
        <h1 style={{ marginTop: 0 }}>Uredi oglas</h1>
        <p className="muted">
          <Link href="/dashboard/my-listings">Nazad na moje oglase</Link>
        </p>

        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}

        {listing ? (
          <form className="grid" onSubmit={onSubmit}>
            <label>
              <div className="muted">Naslov</div>
              <input
                className="input"
                value={listing.title}
                onChange={(e) => setListing({ ...listing, title: e.target.value })}
                required
              />
            </label>
            <label>
              <div className="muted">Opis</div>
              <textarea
                className="textarea"
                value={listing.description}
                onChange={(e) => setListing({ ...listing, description: e.target.value })}
                required
              />
            </label>

            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <label>
                <div className="muted">Kategorija</div>
                <select
                  className="select"
                  value={listing.category_id}
                  onChange={(e) => setListing({ ...listing, category_id: Number(e.target.value) })}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <div className="muted">Status</div>
                <select
                  className="select"
                  value={listing.status}
                  onChange={(e) => setListing({ ...listing, status: e.target.value as EditableListing["status"] })}
                >
                  <option value="draft">draft</option>
                  <option value="active">active</option>
                  <option value="paused">paused</option>
                  <option value="archived">archived</option>
                </select>
              </label>
            </div>

            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <label>
                <div className="muted">Grad</div>
                <input
                  className="input"
                  value={listing.city}
                  onChange={(e) => setListing({ ...listing, city: e.target.value })}
                  required
                />
              </label>
              <label>
                <div className="muted">Telefon</div>
                <input
                  className="input"
                  value={listing.contact_phone}
                  onChange={(e) => setListing({ ...listing, contact_phone: e.target.value })}
                  required
                />
              </label>
            </div>

            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <label>
                <div className="muted">Cena</div>
                <input
                  className="input"
                  type="number"
                  value={listing.price ?? ""}
                  onChange={(e) =>
                    setListing({ ...listing, price: e.target.value ? Number(e.target.value) : null })
                  }
                />
              </label>
              <label>
                <div className="muted">WhatsApp/Viber</div>
                <input
                  className="input"
                  value={listing.whatsapp_viber ?? ""}
                  onChange={(e) => setListing({ ...listing, whatsapp_viber: e.target.value || null })}
                />
              </label>
            </div>

            <button className="button" disabled={saving}>
              {saving ? "Čuvanje..." : "Sačuvaj izmene"}
            </button>
            {message ? <p style={{ color: "#047857" }}>{message}</p> : null}
          </form>
        ) : null}

        <div style={{ marginTop: 16 }}>
          <button className="button" style={{ width: "auto", background: "#374151" }} onClick={() => router.push("/dashboard/my-listings")}>
            Nazad
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
