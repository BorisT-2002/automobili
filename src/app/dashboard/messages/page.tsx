"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "../../../components/auth-guard";
import { ChatBox } from "../../../components/chat-box";
import { supabase } from "../../../lib/supabase";

type Conversation = {
  id: string;
  listing_id: string;
  customer_id: string;
  provider_id: string;
  created_at: string;
  listings: { title: string; city: string } | null;
  customer: { full_name: string | null; email: string | null } | null;
  provider: { full_name: string | null; email: string | null; company_name: string | null } | null;
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const uid = sessionData.session.user.id;
      setCurrentUserId(uid);

      const res = await fetch("/api/chat/conversations");
      const data = await res.json();
      const list = (data.conversations ?? []) as Conversation[];

      setConversations(list);
      if (list.length > 0) {
        setActiveId(list[0].id);
      }
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <div className="card">Učitavanje poruka...</div>
      </AuthGuard>
    );
  }

  const activeConv = conversations.find((c) => c.id === activeId);

  const getPartnerName = (conv: Conversation) => {
    if (conv.customer_id === currentUserId) {
      return conv.provider?.company_name || conv.provider?.full_name || conv.provider?.email || "Majstor";
    }
    return conv.customer?.full_name || conv.customer?.email || "Kupac";
  };

  return (
    <AuthGuard>
      <div className="grid" style={{ gap: 24 }}>
        <h1 style={{ marginTop: 0 }}>💬 Centar za Poruke (Realtime Čat)</h1>

        {conversations.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <h3>Nemate aktivnih razgovora</h3>
            <p className="muted" style={{ marginTop: 8 }}>
              Kada pošaljete poruku nekom servisu ili kada kupac kontaktira vaš oglas, razgovor će se pojaviti ovde.
            </p>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "1fr 2fr", gap: 24 }}>
            {/* Conversations List */}
            <div className="card" style={{ padding: 12 }}>
              <h3 style={{ marginTop: 0, padding: "8px 8px 12px", borderBottom: "1px solid var(--border-color)" }}>
                Razgovori ({conversations.length})
              </h3>
              <div className="grid" style={{ gap: 8, marginTop: 12 }}>
                {conversations.map((c) => {
                  const partner = getPartnerName(c);
                  const isActive = c.id === activeId;
                  return (
                    <div
                      key={c.id}
                      className="card interactive"
                      style={{
                        padding: 12,
                        cursor: "pointer",
                        borderColor: isActive ? "var(--primary)" : "var(--border-color)",
                        background: isActive ? "rgba(99, 102, 241, 0.15)" : "var(--bg-card)",
                      }}
                      onClick={() => setActiveId(c.id)}
                    >
                      <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>💬 {partner}</div>
                      <div className="muted" style={{ fontSize: "0.8rem", marginTop: 4 }}>
                        {c.listings?.title || "Auto Servis"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active ChatBox */}
            {activeConv && currentUserId ? (
              <ChatBox
                conversationId={activeConv.id}
                currentUserId={currentUserId}
                partnerName={getPartnerName(activeConv)}
                listingTitle={activeConv.listings?.title}
              />
            ) : null}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
