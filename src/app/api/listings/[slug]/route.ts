import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/supabase-server";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;
  const supabase = getSupabaseServer();

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select(
      "id,slug,title,description,city,contact_phone,whatsapp_viber,working_hours,price,price_on_request,featured,average_rating,review_count,categories(name,slug),profiles(full_name,is_verified)",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (listingError) {
    return NextResponse.json({ error: listingError.message }, { status: 400 });
  }

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const listingId = (listing as { id: string }).id;

  const [{ data: images }, { data: reviews }] = await Promise.all([
    supabase
      .from("listing_images")
      .select("image_url,display_order")
      .eq("listing_id", listingId)
      .order("display_order"),
    supabase
      .from("reviews")
      .select("id,rating,comment,created_at,profiles(full_name)")
      .eq("listing_id", listingId)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return NextResponse.json({
    listing,
    images: images ?? [],
    reviews: reviews ?? [],
  });
}
