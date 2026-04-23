# AutoMajstor.rs Backend Bootstrap

Supabase projekat je inicijalizovan sa MVP bazom, RLS politikama, storage bucket-om i Edge funkcijama.

## Edge Functions

Base URL:

`https://hgxwxusrgwtjwydcxahz.supabase.co/functions/v1`

Deploy-ovane funkcije:

- `create-listing`
- `submit-review`
- `admin-moderate-review`

Sve funkcije ocekuju `Authorization: Bearer <user_access_token>`.

## Quick API examples

Create listing:

```bash
curl -X POST "https://hgxwxusrgwtjwydcxahz.supabase.co/functions/v1/create-listing" \
  -H "Authorization: Bearer <USER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Auto elektrika Novi Sad",
    "description": "Dijagnostika i popravka autoelektrike.",
    "category_id": 2,
    "city": "Novi Sad",
    "contact_phone": "+381601234567",
    "image_urls": ["https://example.com/slika1.jpg"]
  }'
```

Submit review:

```bash
curl -X POST "https://hgxwxusrgwtjwydcxahz.supabase.co/functions/v1/submit-review" \
  -H "Authorization: Bearer <USER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "listing_id": "<LISTING_UUID>",
    "rating": 5,
    "comment": "Odlican servis."
  }'
```

Admin moderate review:

```bash
curl -X POST "https://hgxwxusrgwtjwydcxahz.supabase.co/functions/v1/admin-moderate-review" \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "review_id": "<REVIEW_UUID>",
    "action": "hide",
    "clear_reports": true
  }'
```

## TypeScript types

Generisani tipovi su u `supabase/types.ts`.

## Next.js integration

- Podesi `.env.local` po sablonu iz `.env.example`
- Koristi klijent iz `src/lib/supabase.ts`
- Postavi i `NEXT_PUBLIC_SITE_URL` zbog SEO sitemap/metadata

## App API routes (Next.js)

Dodate su i API rute koje "proxy"-uju pozive ka Supabase RPC/Edge funkcijama:

- `GET /api/search`
- `GET /api/filters`
- `GET /api/categories`
- `POST /api/listings`
- `GET /api/listings/:slug`
- `POST /api/reviews`
- `POST /api/admin/reviews/moderate`
- `GET /api/my/listings`
- `GET /api/my/listings/:id`
- `PATCH /api/my/listings/:id`
- `DELETE /api/my/listings/:id`
- `GET /api/admin/reports`

Napomena: API rute koriste Supabase session iz HTTP cookie-ja (`@supabase/ssr`). Klijent ne šalje `Authorization` header — sesija se automatski sinhronizuje kroz cookie na klijentu i serveru.

## Početne stranice

Dodate su i početne Next.js stranice:

- `/` (home sa kategorijama + istaknuti/najnoviji oglasi)
- `/search` (pretraga)
- `/auth` (email/password + Google login)
- `/listing/[slug]` (detalj oglasa)
- `/dashboard/add-listing` (forma za kreiranje oglasa)
- `/dashboard/my-listings` (moji oglasi + status akcije)
- `/dashboard/my-listings/[id]` (edit oglasa)
- `/admin/reviews` (moderacija prijavljenih recenzija)

## Auth UX update

- JWT unos je uklonjen iz `/dashboard/add-listing`
- Stranica automatski koristi session token prijavljenog korisnika
- Na detalju oglasa dodata forma za slanje recenzije koja koristi isti auth session
- Dashboard stranice koriste client-side `AuthGuard` + server-side middleware (`src/middleware.ts`) koji čita Supabase session iz cookie-ja i preusmerava na `/auth?next=...` za `/dashboard/*` i `/admin/*`

## SEO

- `src/app/sitemap.ts` generiše dinamički sitemap iz `seo_listing_pages` view-a
- `src/app/robots.ts` vraća robots pravila + sitemap URL
- `src/app/listing/[slug]/page.tsx` ima dinamički SEO metadata (`title`, `description`, OpenGraph, canonical)

## Demo seed

- `supabase/seed_demo.sql` sadrži gotove SQL primere za brzo punjenje demo podataka.

## Deploy checklist (Vercel)

- Postavi env varijable: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`
- U Supabase Auth dodaj Vercel domen u redirect URL listu (za Google OAuth callback)
- Proveri da je korisnik koji testira admin flow upisan kao `profiles.role = 'admin'`
- Proveri da `listing-images` bucket postoji i da su storage policy-ji aktivni
- Posle deploy-a proveri `sitemap.xml` i `robots.txt`
