import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "../../../../lib/auth-header";
import { supabaseUserServer } from "../../../../lib/supabase-user-server";

export async function GET(req: NextRequest) {
  const token = getBearerToken(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "Missing Authorization Bearer token" }, { status: 401 });
  }

  const supabase = supabaseUserServer(token);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("listings")
    .select(
      "id,slug,title,city,status,featured,average_rating,review_count,created_at,updated_at,categories(name)",
    )
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ items: data ?? [] });
}
