import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ALMATH — подготовка в БИЛ",
    short_name: "ALMATH",
    description: "Подготовка к поступлению: математика и логика",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f7f7",
    theme_color: "#58cc02",
    lang: "ru",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
