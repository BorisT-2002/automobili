import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AutoMajstor.rs",
    short_name: "AutoMajstor",
    description: "Pronađite najboljeg auto servisa i majstora u Srbiji",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0F19",
    theme_color: "#6366F1",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
