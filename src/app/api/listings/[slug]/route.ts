import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase-server";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;

  const { data: listing, error: listingError } = await supabaseServer
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

  const [{ data: images }, { data: reviews }] = await Promise.all([
    supabaseServer
      .from("listing_images")
      .select("image_url,display_order")
      .eq("listing_id", listing.id)
      .order("display_order"),
    supabaseServer
      .from("reviews")
      .select("id,rating,comment,created_at,profiles(full_name)")
      .eq("listing_id", listing.id)
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
