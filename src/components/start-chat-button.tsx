"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StartChatButtonProps = {
  listingId: string;
  providerId: string;
};

export function StartChatButton({ listingId, providerId }: StartChatButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, provider_id: providerId }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/auth?next=/listing/${listingId}`);
          return;
        }
        alert(data.error ?? "Neuspešno pokretanje razgovora.");
        return;
      }

      router.push(`/dashboard/messages?id=${data.conversation_id}`);
    } catch (err) {
      alert("Došlo je do greške.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="button"
      style={{ width: "100%", background: "var(--primary-gradient)", boxShadow: "var(--shadow-glow)" }}
      onClick={handleStartChat}
      disabled={loading}
    >
      {loading ? "Pokretanje čata..." : "💬 Pošalji Direktnu Poruku Majstoru"}
    </button>
  );
}
