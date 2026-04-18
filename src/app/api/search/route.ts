import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase-server";

const boolOrNull = (value: string | null): boolean | null => {
  if (value === null) return null;
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  return null;
};

const numOrNull = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const { data, error } = await supabaseServer.rpc("search_listings", {
    query_text: params.get("q") ?? undefined,
    p_city: params.get("city") ?? undefined,
    p_category_slug: params.get("category") ?? undefined,
    p_vehicle_brand: params.get("brand") ?? undefined,
    p_emergency: boolOrNull(params.get("emergency")) ?? undefined,
    p_mobile: boolOrNull(params.get("mobile")) ?? undefined,
    p_min_rating: numOrNull(params.get("minRating")) ?? undefined,
    p_featured_only: boolOrNull(params.get("featured")) ?? false,
    p_sort: params.get("sort") ?? "relevance",
    p_limit: numOrNull(params.get("limit")) ?? 20,
    p_offset: numOrNull(params.get("offset")) ?? 0,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ items: data ?? [] });
}
