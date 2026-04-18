import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "../../../../../lib/auth-header";
import { supabaseUserServer } from "../../../../../lib/supabase-user-server";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const token = getBearerToken(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "Missing Authorization Bearer token" }, { status: 401 });
  }

  const supabase = supabaseUserServer(token);
  const { id } = await params;

  const { data, error } = await supabase
    .from("listings")
    .select(
      "id,slug,title,description,category_id,city,contact_phone,whatsapp_viber,vehicle_brand,price,price_on_request,emergency_service,mobile_service,working_hours,status",
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ item: data });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const token = getBearerToken(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "Missing Authorization Bearer token" }, { status: 401 });
  }

  const supabase = supabaseUserServer(token);
  const { id } = await params;
  const payload = await req.json();

  const { data, error } = await supabase
    .from("listings")
    .update({
      title: payload.title,
      description: payload.description,
      city: payload.city,
      category_id: payload.category_id,
      contact_phone: payload.contact_phone,
      whatsapp_viber: payload.whatsapp_viber ?? null,
      price: payload.price ?? null,
      price_on_request: payload.price_on_request ?? false,
      emergency_service: payload.emergency_service ?? false,
      mobile_service: payload.mobile_service ?? false,
      working_hours: payload.working_hours ?? null,
      vehicle_brand: payload.vehicle_brand ?? null,
      status: payload.status,
    })
    .eq("id", id)
    .select("id,slug,title,status,updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ item: data });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const token = getBearerToken(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ error: "Missing Authorization Bearer token" }, { status: 401 });
  }

  const supabase = supabaseUserServer(token);
  const { id } = await params;

  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
