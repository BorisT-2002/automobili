-- Real Demo Seed for AutoMajstor.rs
-- Populate initial services, images, and reviews

DO $$
DECLARE
  p_admin_id UUID := 'a1cb0093-7b1c-4bab-ae57-dd134a1e3b03';
  l1_id UUID := gen_random_uuid();
  l2_id UUID := gen_random_uuid();
  l3_id UUID := gen_random_uuid();
  l4_id UUID := gen_random_uuid();
  l5_id UUID := gen_random_uuid();
  l6_id UUID := gen_random_uuid();
  l7_id UUID := gen_random_uuid();
  l8_id UUID := gen_random_uuid();
BEGIN

  -- Insert Demo Listings
  INSERT INTO public.listings (
    id, provider_id, category_id, title, description, city, contact_phone, whatsapp_viber, vehicle_brand, price, price_on_request, emergency_service, mobile_service, working_hours, featured, status
  ) VALUES 
  (
    l1_id, p_admin_id, 1, 'Auto Servis BeoMehanika - Kompletan servis motora i trapa',
    'Kompletna auto dijagnostika, mali i veliki servis, zamena kočnica, setova kvačila i servisa trapa za sva evropska i azijska vozila. Garancija na delove i rad.',
    'Beograd', '+381641112233', '+381641112233', 'BMW, Audi, VW, Mercedes', 4500.00, false, false, true, 'Pon-Pet: 08:00 - 17:00, Sub: 08:00 - 14:00', true, 'active'
  ),
  (
    l2_id, p_admin_id, 2, 'Autoelektrika & Dijagnostika Tesla-Servis Novi Sad',
    'Kompjuterska dijagnostika novije generacije, popravka alternatora, anlasera, kodiranje ključeva, popravka ECU računara i otklanjanje grešaka na tabli.',
    'Novi Sad', '+381652223344', '+381652223344', 'Svi brendovi', 3000.00, false, true, true, 'Pon-Pet: 09:00 - 18:00', true, 'active'
  ),
  (
    l3_id, p_admin_id, 4, 'Detailing Centar ShineMaster - Poliranje i Keramička Zaštita',
    'Višeslojno mašinsko poliranje automobila, korekcija laka, nanosečenje keramičke zaštite sa garancijom 2 do 5 godina, poliranje farova i zaštita folijom.',
    'Beograd', '+381633334455', '+381633334455', 'Premium brendovi', 15000.00, false, false, false, 'Pon-Sub: 09:00 - 19:00', true, 'active'
  ),
  (
    l4_id, p_admin_id, 8, 'Vulkanizer i Hotel Guma Brzi Gumar Niš',
    'Zamena i balansiranje guma do 24 inča, krpljenje guma, ispravljanje aluminijumskih felni i sezonsko skladištenje guma u kontrolisanim uslovima.',
    'Niš', '+381604445566', '+381604445566', 'Svi brendovi', 800.00, false, true, false, 'Pon-Sub: 08:00 - 20:00', false, 'active'
  ),
  (
    l5_id, p_admin_id, 7, 'Šlep Služba 00-24 Asistencija Kragujevac i Cela Srbija',
    'Pouzdan i brz transport havarisanih, pokvarenih i neregistrovanih vozila 24/7 na teritoriji Kragujevca, Šumadije i cele Srbije. Pomoć na putu.',
    'Kragujevac', '+381665556677', '+381665556677', 'Svi brendovi', 0.00, true, true, true, 'Non-stop 00-24h', true, 'active'
  ),
  (
    l6_id, p_admin_id, 5, 'Perionica & Dubinsko Čišćenje Enterijera Lux Novi Sad',
    'Dubinsko čišćenje sedišta, tepiha i gepeka profesionalnim mašinama i ekološkim hemijskim sredstvima. Osvežavanje kože i eliminacija neprijatnih mirisa.',
    'Novi Sad', '+381616667788', '+381616667788', 'Svi brendovi', 5000.00, false, false, true, 'Pon-Sub: 08:30 - 18:30', false, 'active'
  ),
  (
    l7_id, p_admin_id, 3, 'AutoArt Limarija i Farbanje u Komori Subotica',
    'Popravka havarisanih vozila na stolu za razvlačenje, farbanje u savremenoj termo-lakirnoj komori sa kompjuterskim miksovanjem boja originalne nijanse.',
    'Subotica', '+381627778899', '+381627778899', 'Svi brendovi', 0.00, true, false, false, 'Pon-Pet: 08:00 - 16:30', false, 'active'
  ),
  (
    l8_id, p_admin_id, 6, 'Tehnički Pregled & Registracija Bez Odlaska u MUP Beograd',
    'Kompletna usluga tehničkog pregleda, izdavanja registracione nalepnice na licu mesta, osiguranje i zeleni karton u najkraćem mogućem roku.',
    'Beograd', '+381698889900', '+381698889900', 'Svi brendovi', 6000.00, false, false, false, 'Pon-Pet: 07:30 - 19:00, Sub: 08:00 - 15:00', false, 'active'
  );

  -- Insert Listing Images
  INSERT INTO public.listing_images (listing_id, image_url, display_order) VALUES
  (l1_id, 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80', 0),
  (l1_id, 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80', 1),
  (l2_id, 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80', 0),
  (l3_id, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80', 0),
  (l4_id, 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1200&q=80', 0),
  (l5_id, 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', 0),
  (l6_id, 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80', 0),
  (l7_id, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 0),
  (l8_id, 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', 0);

  -- Insert Sample Reviews
  INSERT INTO public.reviews (listing_id, user_id, rating, comment, status) VALUES
  (l1_id, '8a09b378-bbf6-4597-aa1e-65fdfa0d4163', 5, 'Izuzetan servis! Odradili mali i veliki servis na mom BMW-u brzo i po fer ceni.', 'published'),
  (l1_id, '8329835a-609c-4170-9160-1fd9b28230a5', 5, 'Svaka preporuka za BeoMehaniku. Odlična dijagnostika i vrlo ljubazni majstori.', 'published'),
  (l2_id, '8a09b378-bbf6-4597-aa1e-65fdfa0d4163', 5, 'Rešili problem sa alternativnim punjenjem akumulatora koji niko drugi nije znao.', 'published'),
  (l3_id, '8329835a-609c-4170-9160-1fd9b28230a5', 5, 'Auto izgleda kao iz salona posle poliranja i keramičke zaštite!', 'published'),
  (l5_id, '8a09b378-bbf6-4597-aa1e-65fdfa0d4163', 5, 'Stigli u rekordnom roku od 20 minuta usred noći na auto-putu.', 'published');

END $$;
