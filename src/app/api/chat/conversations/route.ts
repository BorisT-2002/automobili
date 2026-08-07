import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/supabase-server";

export async function GET(_req: NextRequest) {
  const supabase = getSupabaseServer();
  const { data: authData } = await supabase.auth.getSession();
  const userId = authData.session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  try {
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        id,
        listing_id,
        customer_id,
        provider_id,
        created_at,
        updated_at,
        listings (title, city),
        customer:customer_id (full_name, email),
        provider:provider_id (full_name, email, company_name)
      `)
      .or(`customer_id.eq.${userId},provider_id.eq.${userId}`)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ conversations: conversations ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Greška pri učitavanju konverzacija." },
      { status: 500 },
    );
  }
}
