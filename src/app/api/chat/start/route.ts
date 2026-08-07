import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  const { data: authData } = await supabase.auth.getSession();
  const userId = authData.session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  try {
    const { listing_id, provider_id } = await req.json();

    if (!listing_id || !provider_id) {
      return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
    }

    if (userId === provider_id) {
      return NextResponse.json({ error: "Ne možete poslati poruku sami sebi." }, { status: 400 });
    }

    // Check if conversation exists
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listing_id)
      .eq("customer_id", userId)
      .eq("provider_id", provider_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ conversation_id: existing.id });
    }

    // Create new conversation
    const { data: created, error } = await supabase
      .from("conversations")
      .insert({
        listing_id,
        customer_id: userId,
        provider_id,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ conversation_id: created.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Greška pri kreiranju razgovora." },
      { status: 500 },
    );
  }
}
