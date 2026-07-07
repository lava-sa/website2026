import type { MetadataRoute } from "next";

/**
 * Web App Manifest — served at /manifest.webmanifest.
 * Controls the installed-app name, icon, colours and launch behaviour on
 * Android/Chrome, Edge, and (partially) iOS Safari.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lava-SA — German Vacuum Sealers",
    short_name: "Lava-SA",
    description:
      "South Africa's leading German vacuum sealer brand. Machines, bags, containers, sous-vide and butchery gear since 2007.",
    id: "/",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#063a46",
    lang: "en-ZA",
    dir: "ltr",
    categories: ["shopping", "food", "business"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Shop vacuum sealers",
        short_name: "Machines",
        url: "/products/vacuum-machines?source=pwa",
      },
      {
        name: "My account",
        short_name: "Account",
        url: "/account?source=pwa",
      },
      {
        name: "Contact us",
        short_name: "Contact",
        url: "/contact?source=pwa",
      },
    ],
  };
}
