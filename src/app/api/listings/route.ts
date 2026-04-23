import { NextRequest, NextResponse } from "next/server";
import { callEdgeFunction } from "../../../lib/edge-functions";
import { getSupabaseServer } from "../../../lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = await req.json();
  const edgeResponse = await callEdgeFunction("create-listing-v2", payload, accessToken);
  const body = await edgeResponse.json();

  return NextResponse.json(body, { status: edgeResponse.status });
}
