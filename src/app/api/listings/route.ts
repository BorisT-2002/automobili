import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabase-server";

const slugify = (input: string): string => {
  const map: Record<string, string> = {
    č: "c", ć: "c", đ: "dj", š: "s", ž: "z",
    Č: "c", Ć: "c", Đ: "dj", Š: "s", Ž: "z",
  };
  const normalized = input.replace(/[čćđšžČĆĐŠŽ]/g, (c) => map[c] ?? c);
  const base = normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const suffix = Math.random().toString(36).slice(2, 8);
  return base ? `${base}-${suffix}` : suffix;
};

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
  }

  const payload = await req.json();

  const slug = slugify(payload.title ?? "oglas");

  const { data: listing, error: insertError } = await supabase
    .from("listings")
    .insert({
      provider_id: user.id,
      title: payload.title,
      description: payload.description,
      category_id: payload.category_id,
      city: payload.city,
      contact_phone: payload.contact_phone,
      whatsapp_viber: payload.whatsapp_viber || null,
      price: payload.price ?? null,
      price_on_request: payload.price_on_request ?? false,
      emergency_service: payload.emergency_service ?? false,
      mobile_service: payload.mobile_service ?? false,
      working_hours: payload.working_hours || null,
      status: "active",
      slug,
    })
    .select("id,slug")
    .single();

  if (insertError || !listing) {
    return NextResponse.json(
      { error: insertError?.message ?? "Nije moguće kreirati oglas." },
      { status: 400 },
    );
  }

  const listingId = (listing as { id: string; slug: string }).id;
  const resolvedSlug = (listing as { id: string; slug: string }).slug;

  const imageUrls: string[] = Array.isArray(payload.image_urls) ? payload.image_urls : [];
  if (imageUrls.length > 0) {
    const rows = imageUrls.map((url: string, index: number) => ({
      listing_id: listingId,
      image_url: url,
      display_order: index,
    }));
    const { error: imagesError } = await supabase.from("listing_images").insert(rows);
    if (imagesError) {
      return NextResponse.json(
        { error: `Oglas kreiran, ali slike nisu sačuvane: ${imagesError.message}`, slug: resolvedSlug },
        { status: 207 },
      );
    }
  }

  return NextResponse.json({ id: listingId, slug: resolvedSlug }, { status: 201 });
}
