import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/supabase-server";

export async function GET() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("admin_reported_reviews")
    .select("*")
    .order("reported_at", { ascending: false })
    .limit(100);

  if (error) {
    const lower = error.message.toLowerCase();
    const status = lower.includes("permission") || lower.includes("not allowed") ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ items: data ?? [] });
}
