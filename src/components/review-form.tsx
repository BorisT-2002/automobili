"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type ReviewFormProps = {
  listingId: string;
};

export function ReviewForm({ listingId }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      setSessionEmail(data.session?.user?.email ?? null);
    };
    run();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listing_id: listingId,
        rating,
        comment,
      }),
    });

    const body = await res.json();
    setLoading(false);
    if (!res.ok) {
      setStatus(body.error ?? "Neuspešno slanje recenzije.");
      return;
    }

    setComment("");
    setStatus("Recenzija je sačuvana.");
  };

  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>Ostavi recenziju</h2>
      <p className="muted">Prijavljen korisnik: {sessionEmail ?? "nisi prijavljen"}</p>
      <form className="grid" onSubmit={submit}>
        <label>
          <div className="muted">Ocena</div>
          <select
            className="select"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
            <option value={2}>2</option>
            <option value={1}>1</option>
          </select>
        </label>
        <label>
          <div className="muted">Komentar</div>
          <textarea
            className="textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Kako je prošla usluga?"
          />
        </label>
        <button className="button" disabled={loading}>
          {loading ? "Slanje..." : "Pošalji recenziju"}
        </button>
      </form>
      {status ? <p>{status}</p> : null}
    </section>
  );
}
