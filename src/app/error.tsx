"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h2 style={{ marginTop: 0 }}>Došlo je do greške</h2>
      <p className="muted">{error.message}</p>
      <button className="button" style={{ width: "auto" }} onClick={reset}>
        Pokušaj ponovo
      </button>
    </div>
  );
}
