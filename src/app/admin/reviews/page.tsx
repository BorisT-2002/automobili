"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "../../../components/auth-guard";
import { supabase } from "../../../lib/supabase";

type ReportItem = {
  report_id: string | null;
  reported_at: string | null;
  reason: string | null;
  review_id: string | null;
  rating: number | null;
  comment: string | null;
  review_status: string | null;
  listing_slug: string | null;
  listing_title: string | null;
  reporter_name: string | null;
  review_author_name: string | null;
};

export default function AdminReviewsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [items, setItems] = useState<ReportItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (accessToken: string) => {
    const res = await fetch("/api/admin/reports", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(body.error ?? "Nije moguće učitati prijave.");
      return;
    }
    setItems(body.items ?? []);
  };

  const moderate = async (reviewId: string, action: "publish" | "hide" | "report") => {
    if (!token) return;
    const res = await fetch("/api/admin/reviews/moderate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        review_id: reviewId,
        action,
        clear_reports: action !== "report",
      }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Moderacija nije uspela.");
      return;
    }
    await load(token);
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token ?? null;
      setToken(accessToken);
      if (accessToken) load(accessToken);
      else {
        setLoading(false);
        setError("Moraš biti prijavljen kao admin.");
      }
    };
    init();
  }, []);

  return (
    <AuthGuard requireRole="admin">
      <div className="grid" style={{ gap: 12, paddingBottom: 24 }}>
        <section className="card">
          <h1 style={{ marginTop: 0 }}>Admin - prijavljene recenzije</h1>
          <p className="muted">
            Ako nema rezultata, proveri da li je korisnik admin (`profiles.role = admin`).
          </p>
          {loading ? <p>Učitavanje...</p> : null}
          {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
        </section>

        {items.map((item) => {
          const reviewId = item.review_id;
          return (
            <article key={`${item.report_id}-${reviewId}`} className="card">
              <div className="muted">
                Prijavljeno:{" "}
                {item.reported_at ? new Date(item.reported_at).toLocaleString("sr-RS") : "-"}
              </div>
              <h3 style={{ margin: "8px 0" }}>{item.listing_title ?? "Oglas"}</h3>
              <p style={{ margin: "4px 0" }}>
                <strong>Razlog prijave:</strong> {item.reason ?? "-"}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Recenzija:</strong> {item.comment ?? "Bez komentara"} ({item.rating ?? 0}/5)
              </p>
              <p className="muted">
                Autor: {item.review_author_name ?? "Nepoznat"} • Prijavio:{" "}
                {item.reporter_name ?? "Nepoznat"} • Status: {item.review_status ?? "-"}
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {reviewId ? (
                  <>
                    <button
                      className="button"
                      style={{ width: "auto", background: "#2563eb" }}
                      onClick={() => moderate(reviewId, "publish")}
                    >
                      Objavi
                    </button>
                    <button
                      className="button"
                      style={{ width: "auto", background: "#d97706" }}
                      onClick={() => moderate(reviewId, "hide")}
                    >
                      Sakrij
                    </button>
                    <button
                      className="button"
                      style={{ width: "auto", background: "#7c2d12" }}
                      onClick={() => moderate(reviewId, "report")}
                    >
                      Obeleži
                    </button>
                  </>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </AuthGuard>
  );
}
