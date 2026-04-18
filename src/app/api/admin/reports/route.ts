import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "../../../../lib/auth-header";
import { supabaseUserServer } from "../../../../lib/supabase-user-server";

export async function GET(req: NextRequest) {
  const token = getBearerToken(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "Missing Authorization Bearer token" }, { status: 401 });
  }

  const supabase = supabaseUserServer(token);
  const { data, error } = await supabase
    .from("admin_reported_reviews")
    .select("*")
    .order("reported_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ items: data ?? [] });
}
