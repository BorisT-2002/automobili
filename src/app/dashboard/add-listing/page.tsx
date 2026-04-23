"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "../../../components/auth-guard";
import { supabase } from "../../../lib/supabase";

type Category = {
  id: number;
  slug: string;
  name: string;
};

export default function AddListingPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const run = async () => {
      const [{ data: authData }, categoriesRes] = await Promise.all([
        supabase.auth.getSession(),
        fetch("/api/categories"),
      ]);
      setUserId(authData.session?.user?.id ?? null);
      setSessionEmail(authData.session?.user?.email ?? null);

      const categoriesData = await categoriesRes.json();
      setCategories((categoriesData.items ?? []) as Category[]);
    };
    run();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setSessionEmail(session?.user?.email ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const uploadSelectedFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    if (!userId) {
      setError("Moraš biti prijavljen da uploaduješ slike.");
      event.target.value = "";
      return;
    }

    setUploadingImages(true);
    setError(null);

    try {
      const uploaded: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          throw new Error(`Fajl "${file.name}" nije slika.`);
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`Fajl "${file.name}" je veći od 5MB.`);
        }

        const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
        const path = `${userId}/listings/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }

      setImageUrls((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload slika nije uspeo.");
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((item) => item !== url));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      category_id: Number(formData.get("category_id")),
      city: String(formData.get("city") ?? ""),
      contact_phone: String(formData.get("contact_phone") ?? ""),
      whatsapp_viber: String(formData.get("whatsapp_viber") ?? ""),
      price: formData.get("price") ? Number(formData.get("price")) : null,
      price_on_request: Boolean(formData.get("price_on_request")),
      emergency_service: Boolean(formData.get("emergency_service")),
      mobile_service: Boolean(formData.get("mobile_service")),
      working_hours: String(formData.get("working_hours") ?? ""),
      image_urls: imageUrls,
    };

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Neuspešno kreiranje oglasa");
      setResult(`Kreiran oglas: ${data.slug}`);
      setImageUrls([]);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Došlo je do greške");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="card" style={{ maxWidth: 760, margin: "0 auto 24px" }}>
        <h1 style={{ marginTop: 0 }}>Dodaj oglas</h1>
        <p className="muted">
          Prijavljen korisnik: <strong>{sessionEmail ?? "nisi prijavljen"}</strong>
        </p>
        <p className="muted">
          Upravljanje postojećim oglasima: <Link href="/dashboard/my-listings">Moji oglasi</Link>
        </p>

        <form className="grid" onSubmit={onSubmit}>
          <label>
            <div className="muted">Naslov</div>
            <input className="input" name="title" required />
          </label>

          <label>
            <div className="muted">Opis</div>
            <textarea className="textarea" name="description" required />
          </label>

          <label>
            <div className="muted">Kategorija</div>
            <select className="select" name="category_id" required>
              <option value="">Izaberi</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <label>
              <div className="muted">Grad</div>
              <input className="input" name="city" required />
            </label>
            <label>
              <div className="muted">Telefon</div>
              <input className="input" name="contact_phone" required />
            </label>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <label>
              <div className="muted">Cena (RSD)</div>
              <input className="input" type="number" name="price" />
            </label>
            <label>
              <div className="muted">WhatsApp/Viber</div>
              <input className="input" name="whatsapp_viber" />
            </label>
          </div>

          <div>
            <div className="muted" style={{ marginBottom: 8 }}>
              Slike oglasa
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={uploadSelectedFiles}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="button"
              style={{ width: "auto", background: "#0f766e" }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImages}
            >
              {uploadingImages ? "Upload u toku..." : "Upload slika"}
            </button>
            <p className="muted" style={{ marginTop: 8 }}>
              Klikni na dugme, izaberi slike i one će automatski biti dodate u oglas.
            </p>
            {imageUrls.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {imageUrls.map((url) => (
                  <div key={url} className="card" style={{ padding: 8 }}>
                    <img
                      src={url}
                      alt="Slika oglasa"
                      style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 8 }}
                    />
                    <button
                      type="button"
                      className="button"
                      style={{ width: "100%", marginTop: 8, background: "#b91c1c", padding: "8px 12px" }}
                      onClick={() => removeImage(url)}
                    >
                      Ukloni
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <button className="button" disabled={loading}>
            {loading ? "Čuvanje..." : "Sačuvaj oglas"}
          </button>
        </form>

        {result ? <p style={{ color: "#047857" }}>{result}</p> : null}
        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      </div>
    </AuthGuard>
  );
}
