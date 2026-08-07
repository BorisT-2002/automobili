"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

type ChatBoxProps = {
  conversationId: string;
  currentUserId: string;
  partnerName: string;
  listingTitle?: string;
};

export function ChatBox({ conversationId, currentUserId, partnerName, listingTitle }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch initial messages & setup Supabase Realtime Subscription
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      setMessages((data as Message[]) ?? []);
      setTimeout(scrollToBottom, 100);
    };

    fetchMessages();

    // Realtime channel
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          setTimeout(scrollToBottom, 50);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${currentUserId}/chat/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch (err) {
      alert("Upload slike nije uspeo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !imageUrl) || loading) return;

    setLoading(true);
    const contentText = input.trim();
    const currentImg = imageUrl;

    setInput("");
    setImageUrl(null);

    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: contentText || "📷 Slika",
        image_url: currentImg,
      });

      // Update conversation updated_at
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      if (error) throw error;
    } catch (err) {
      alert("Neuspešno slanje poruke.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        height: 540,
        padding: 0,
        overflow: "hidden",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          background: "rgba(15, 23, 42, 0.9)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>💬 {partnerName}</div>
          {listingTitle ? (
            <div className="muted" style={{ fontSize: "0.8rem", marginTop: 2 }}>
              Servis: {listingTitle}
            </div>
          ) : null}
        </div>
        <span className="badge primary">🟢 Realtime Čat</span>
      </div>

      {/* Messages Feed */}
      <div
        style={{
          flex: 1,
          padding: 20,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "#0B0F17",
        }}
      >
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isMine ? "flex-end" : "flex-start",
                maxWidth: "75%",
                display: "flex",
                flexDirection: "column",
                alignItems: isMine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background: isMine
                    ? "var(--primary-gradient)"
                    : "rgba(255, 255, 255, 0.08)",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  fontSize: "0.95rem",
                  boxShadow: isMine ? "var(--shadow-glow)" : "none",
                  border: isMine ? "none" : "1px solid var(--border-color)",
                }}
              >
                {msg.image_url ? (
                  <img
                    src={msg.image_url}
                    alt="Slika u poruci"
                    style={{ maxWidth: 220, borderRadius: 8, marginBottom: 6, display: "block" }}
                  />
                ) : null}
                <div>{msg.content}</div>
              </div>
              <span className="muted" style={{ fontSize: "0.7rem", marginTop: 4, padding: "0 4px" }}>
                {new Date(msg.created_at).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={sendMessage}
        style={{
          padding: 14,
          background: "#121827",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <button
          type="button"
          className="button outline"
          style={{ padding: "8px 12px", borderRadius: "50%", minWidth: 40, height: 40 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          📷
        </button>

        {imageUrl ? (
          <div style={{ position: "relative" }}>
            <img src={imageUrl} alt="preview" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }} />
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 16,
                height: 16,
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        ) : null}

        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napišite poruku majstoru..."
          style={{ flex: 1 }}
        />

        <button className="button" style={{ padding: "10px 20px" }} disabled={loading}>
          Slanje →
        </button>
      </form>
    </div>
  );
}
