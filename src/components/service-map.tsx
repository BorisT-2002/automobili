"use client";

import { useEffect, useRef } from "react";

export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Beograd: { lat: 44.7866, lng: 20.4489 },
  "Novi Sad": { lat: 45.2671, lng: 19.8335 },
  Niš: { lat: 43.3209, lng: 21.8958 },
  Kragujevac: { lat: 44.0128, lng: 20.9114 },
  Subotica: { lat: 46.1005, lng: 19.6650 },
  Vrbas: { lat: 45.5714, lng: 19.6408 },
  Zrenjanin: { lat: 45.3836, lng: 20.3819 },
  Pančevo: { lat: 44.8708, lng: 20.6403 },
  Čačak: { lat: 43.8914, lng: 20.3497 },
  Kraljevo: { lat: 43.7258, lng: 20.6894 },
};

type ServiceMapProps = {
  city: string;
  title?: string;
  zoom?: number;
  height?: string | number;
  markers?: Array<{
    title: string;
    city: string;
    slug?: string;
    category?: string;
  }>;
};

declare global {
  interface Window {
    L: any;
  }
}

export function ServiceMap({
  city,
  title = "Auto Servis",
  zoom = 13,
  height = 320,
  markers = [],
}: ServiceMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  const coords = CITY_COORDINATES[city] || CITY_COORDINATES["Beograd"];
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${title} ${city}`,
  )}`;

  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!mapRef.current || !window.L || mapInstanceRef.current) return;

      const map = window.L.map(mapRef.current, {
        center: [coords.lat, coords.lng],
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      window.L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        },
      ).addTo(map);

      // Add main marker
      const customIcon = window.L.divIcon({
        className: "custom-map-pin",
        html: `<div style="background: linear-gradient(135deg, #6366F1, #8B5CF6); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; color: white; border: 3px solid white; box-shadow: 0 4px 12px rgba(99,102,241,0.5);">🚗</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      if (markers.length > 0) {
        markers.forEach((m) => {
          const mCoords = CITY_COORDINATES[m.city] || coords;
          // Slight random offset so markers in same city don't completely overlap
          const latOffset = (Math.random() - 0.5) * 0.04;
          const lngOffset = (Math.random() - 0.5) * 0.04;

          window.L.marker([mCoords.lat + latOffset, mCoords.lng + lngOffset], {
            icon: customIcon,
          })
            .addTo(map)
            .bindPopup(
              `<div style="font-family: sans-serif; font-size: 13px;">
                <strong style="color: #0F172A; font-size: 14px;">${m.title}</strong><br/>
                <span style="color: #64748B;">📍 ${m.city}</span><br/>
                ${m.slug ? `<a href="/listing/${m.slug}" style="color: #4F46E5; font-weight: bold; text-decoration: none; display: inline-block; margin-top: 6px;">Pogledaj servis →</a>` : ""}
              </div>`,
            );
        });
      } else {
        window.L.marker([coords.lat, coords.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: sans-serif; font-size: 13px;">
              <strong style="color: #0F172A; font-size: 14px;">${title}</strong><br/>
              <span style="color: #64748B;">📍 ${city}</span>
            </div>`,
          )
          .openPopup();
      }

      mapInstanceRef.current = map;
    };

    // Check if Leaflet script is already loaded
    if (window.L) {
      initMap();
    } else {
      // Inject CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Inject JS
      if (!document.getElementById("leaflet-js")) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
          if (isMounted) initMap();
        };
        document.head.appendChild(script);
      } else {
        const script = document.getElementById("leaflet-js") as HTMLScriptElement;
        script.addEventListener("load", () => {
          if (isMounted) initMap();
        });
      }
    }

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [city, title, zoom, coords.lat, coords.lng, markers]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: typeof height === "number" ? `${height}px` : height,
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)",
          background: "#0F172A",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="muted" style={{ fontSize: "0.85rem" }}>
          📍 Prikažene koordinate za grad: <strong>{city}</strong>
        </span>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="button outline"
          style={{ padding: "6px 14px", fontSize: "0.85rem" }}
        >
          🧭 Otvori u Google Maps
        </a>
      </div>
    </div>
  );
}
