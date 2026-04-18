-- Demo seed for AutoMajstor.rs MVP
-- Run in Supabase SQL editor after creating at least 2 auth users.

-- 1) Set one user as provider/admin (replace UUIDs)
-- update public.profiles set role = 'provider', city = 'Beograd' where id = 'PROVIDER_USER_UUID';
-- update public.profiles set role = 'admin' where id = 'ADMIN_USER_UUID';

-- 2) Insert sample listing
-- insert into public.listings (
--   provider_id,
--   category_id,
--   title,
--   description,
--   city,
--   contact_phone,
--   price,
--   status,
--   emergency_service,
--   mobile_service
-- ) values (
--   'PROVIDER_USER_UUID',
--   1,
--   'Popravka trapa i vešanja',
--   'Servis trapa, zamena spona i dijagnostika ogibljenja.',
--   'Novi Sad',
--   '+381601112223',
--   3500,
--   'active',
--   false,
--   true
-- );

-- 3) Insert listing image (replace LISTING_UUID)
-- insert into public.listing_images (listing_id, image_url, display_order)
-- values ('LISTING_UUID', 'https://images.unsplash.com/photo-1613214149922-f1809c99b414', 0);

-- 4) Insert review from another user (replace REVIEWER_USER_UUID and LISTING_UUID)
-- insert into public.reviews (listing_id, user_id, rating, comment, status)
-- values ('LISTING_UUID', 'REVIEWER_USER_UUID', 5, 'Brza i kvalitetna usluga.', 'published');
