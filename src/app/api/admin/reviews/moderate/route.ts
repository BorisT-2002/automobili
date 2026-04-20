import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "../../../../../lib/auth-header";
import { callEdgeFunction } from "../../../../../lib/edge-functions";

export async function POST(req: NextRequest) {
  const accessToken = getBearerToken(req.headers.get("authorization"));
  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing Authorization Bearer token" },
      { status: 401 },
    );
  }

  const payload = await req.json();
  const edgeResponse = await callEdgeFunction(
    "admin-moderate-review",
    payload,
    accessToken,
  );
  const body = await edgeResponse.json();
  const status = edgeResponse.status === 401 ? 403 : edgeResponse.status;
  return NextResponse.json(body, { status });
}
