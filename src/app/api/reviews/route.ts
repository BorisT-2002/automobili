import { NextRequest, NextResponse } from "next/server";
import { callEdgeFunction } from "../../../lib/edge-functions";
import { getSupabaseServer } from "../../../lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    return NextResponse.json({ error: "Nema access tokena." }, { status: 401 });
  }

  const payload = await req.json();
  const edgeResponse = await callEdgeFunction("submit-review", payload, accessToken);
  const rawBody = await edgeResponse.text();

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    parsed = { error: rawBody || "Edge function returned non-JSON response" };
  }

  if (!edgeResponse.ok) {
    const message =
      (parsed as { error?: string; message?: string })?.error ??
      (parsed as { message?: string })?.message ??
      `Edge function error (${edgeResponse.status})`;
    return NextResponse.json({ error: message }, { status: edgeResponse.status });
  }

  return NextResponse.json(parsed, { status: edgeResponse.status });
}
