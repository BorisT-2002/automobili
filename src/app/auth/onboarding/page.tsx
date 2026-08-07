"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Category = {
  id: number;
  slug: string;
  name: string;
};

const CITIES = [
  "Beograd",
  "Novi Sad",
  "Niš",
  "Kragujevac",
  "Subotica",
  "Vrbas",
  "Zrenjanin",
  "Pančevo",
  "Čačak",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [businessType, setBusiness_type] = useState("preduzetnik");
  const [companyName, setCompanyName] = useState("");
  const [pib, setPib] = useState("");
  const [city, setCity] = useState("Beograd");
  const [address, setAddress] = useState("");
  const [workingHours, setWorkingHours] = useState("Pon-Pet: 08:00 - 17:00");
  const [emergencyService, setEmergencyService] = useState(false);
  const [mobileService, setMobileService] = useState(false);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [phone, setPhone] = useState("");
  const [whatsappViber, setWhatsappViber] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/auth");
        return;
      }
      setUserId(data.session.user.id);

      const categoriesRes = await fetch("/api/categories");
      const catData = await categoriesRes.json();
      setCategories((catData.items ?? []) as Category[]);
    };
    init();
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !userId) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${userId}/onboarding/${crypto.randomUUID()}.${ext}`;

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
      setUploading(false);
      e.target.value = "";
    }
  };

  const submitOnboarding = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Update Profiles Table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: "provider",
          company_name: companyName,
          pib: pib,
          address: address,
          business_type: businessType,
          city: city,
          phone: phone,
          onboarding_completed: true,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      // 2. Create Initial Listing
      const payload = {
        title: companyName || "Auto Servis",
        description: description || "Kompletne auto usluge i dijagnostika.",
        category_id: Number(categoryId),
        city: city,
        contact_phone: phone,
        whatsapp_viber: whatsappViber || phone,
        price: null,
        price_on_request: true,
        emergency_service: emergencyService,
        mobile_service: mobileService,
        working_hours: workingHours,
        image_urls: imageUrls,
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Neuspešno kreiranje oglasa servisa.");

      // Complete & Redirect
      router.replace("/dashboard/my-listings");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Došlo je do greške pri čuvanju.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 720, margin: "20px auto 40px" }}>
      {/* Wizard Header Progress */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h1 style={{ marginTop: 0 }}>Registracija Auto Servisa / Majstora</h1>
        <p className="muted" style={{ marginTop: 6 }}>Popuni podatke o svom servisu i kreiraj svoj oglas na platformi</p>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: step >= 1 ? "var(--primary-gradient)" : "#1E293B",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              1
            </span>
            <span style={{ fontWeight: step === 1 ? 700 : 400, fontSize: "0.9rem" }}>Profil Servisa</span>
          </div>

          <div style={{ width: 40, height: 2, background: "var(--border-color)", alignSelf: "center" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: step >= 2 ? "var(--primary-gradient)" : "#1E293B",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              2
            </span>
            <span style={{ fontWeight: step === 2 ? 700 : 400, fontSize: "0.9rem" }}>Lokacija & Radno Vreme</span>
          </div>

          <div style={{ width: 40, height: 2, background: "var(--border-color)", alignSelf: "center" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: step >= 3 ? "var(--primary-gradient)" : "#1E293B",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              3
            </span>
            <span style={{ fontWeight: step === 3 ? 700 : 400, fontSize: "0.9rem" }}>Kontakt & Slike</span>
          </div>
        </div>
      </div>

      <form onSubmit={submitOnboarding}>
        {/* STEP 1: Podaci o servisu */}
        {step === 1 && (
          <div className="grid" style={{ gap: 20 }}>
            <div>
              <div className="muted" style={{ marginBottom: 8 }}>Pravni oblik poslovanja</div>
              <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { id: "preduzetnik", label: "Preduzetnik (PR)" },
                  { id: "doo", label: "D.O.O. Kompanija" },
                  { id: "samostalni", label: "Samostalni Majstor" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className="card interactive"
                    style={{
                      padding: 14,
                      textAlign: "center",
                      borderColor: businessType === type.id ? "var(--primary)" : "var(--border-color)",
                      background: businessType === type.id ? "rgba(99, 102, 241, 0.15)" : "var(--bg-card)",
                      cursor: "pointer",
                    }}
                    onClick={() => setBusiness_type(type.id)}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <label>
              <div className="muted" style={{ marginBottom: 6 }}>Naziv Auto Servisa / Radionice *</div>
              <input
                className="input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="npr. Auto Servis BeoMehanika"
                required
              />
            </label>

            <label>
              <div className="muted" style={{ marginBottom: 6 }}>PIB / Matični Broj (Za Verifikovan Servis značku ✔️)</div>
              <input
                className="input"
                value={pib}
                onChange={(e) => setPib(e.target.value)}
                placeholder="109876543 (opciono)"
              />
            </label>

            <label>
              <div className="muted" style={{ marginBottom: 6 }}>Glavna Kategorija Usluga *</div>
              <select
                className="select"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="button"
              style={{ marginTop: 10 }}
              onClick={() => {
                if (!companyName) {
                  setError("Molimo unesi naziv servisa.");
                  return;
                }
                setError(null);
                setStep(2);
              }}
            >
              Dalje: Lokacija i Radno Vreme →
            </button>
          </div>
        )}

        {/* STEP 2: Lokacija i radno vreme */}
        {step === 2 && (
          <div className="grid" style={{ gap: 20 }}>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <label>
                <div className="muted" style={{ marginBottom: 6 }}>Grad *</div>
                <select className="select" value={city} onChange={(e) => setCity(e.target.value)} required>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <div className="muted" style={{ marginBottom: 6 }}>Ulica i broj servisa *</div>
                <input
                  className="input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="npr. Bulevar Kralja Aleksandra 120"
                  required
                />
              </label>
            </div>

            <label>
              <div className="muted" style={{ marginBottom: 6 }}>Radno vreme</div>
              <input
                className="input"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="npr. Pon-Pet: 08:00 - 17:00, Sub: 08:00 - 14:00"
              />
            </label>

            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={emergencyService}
                  onChange={(e) => setEmergencyService(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "#4F46E5" }}
                />
                <span style={{ fontWeight: 600 }}>00-24h Hitne intervencije (Dežurna služba)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={mobileService}
                  onChange={(e) => setMobileService(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "#4F46E5" }}
                />
                <span style={{ fontWeight: 600 }}>Nudim terenski servis na licu mesta</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button
                type="button"
                className="button outline"
                style={{ flex: 1 }}
                onClick={() => setStep(1)}
              >
                ← Nazad
              </button>
              <button
                type="button"
                className="button"
                style={{ flex: 2 }}
                onClick={() => {
                  if (!address) {
                    setError("Molimo unesi adresu servisa.");
                    return;
                  }
                  setError(null);
                  setStep(3);
                }}
              >
                Dalje: Kontakt & Slike →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Kontakt i slike */}
        {step === 3 && (
          <div className="grid" style={{ gap: 20 }}>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <label>
                <div className="muted" style={{ marginBottom: 6 }}>Telefon za pozive *</div>
                <input
                  className="input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+381641234567"
                  required
                />
              </label>

              <label>
                <div className="muted" style={{ marginBottom: 6 }}>WhatsApp / Viber broj</div>
                <input
                  className="input"
                  value={whatsappViber}
                  onChange={(e) => setWhatsappViber(e.target.value)}
                  placeholder="+381641234567"
                />
              </label>
            </div>

            <label>
              <div className="muted" style={{ marginBottom: 6 }}>Detaljan opis usluga i specijalizacija *</div>
              <textarea
                className="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opišite svoje usluge, mašine, specijalizacije za određene marke automobila..."
                required
              />
            </label>

            <div>
              <div className="muted" style={{ marginBottom: 8 }}>Fotografije radionice / logotipa</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="button outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Upload u toku..." : "📷 Dodaj slike radionice"}
              </button>

              {imageUrls.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: 10,
                    marginTop: 12,
                  }}
                >
                  {imageUrls.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt="Slika servisa"
                      style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8 }}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button
                type="button"
                className="button outline"
                style={{ flex: 1 }}
                onClick={() => setStep(2)}
              >
                ← Nazad
              </button>
              <button type="submit" className="button" style={{ flex: 2 }} disabled={loading}>
                {loading ? "Čuvanje..." : "🚀 Kompletiraj Registraciju Servisa"}
              </button>
            </div>
          </div>
        )}

        {error ? <p style={{ color: "#EF4444", marginTop: 16, textAlign: "center" }}>{error}</p> : null}
      </form>
    </div>
  );
}
