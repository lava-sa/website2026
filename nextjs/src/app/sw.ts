import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Injected by Serwist at build time — the precache manifest (static assets only).
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/**
 * LAVA-SA service worker.
 *
 * Caching strategy is deliberately conservative for an e-commerce site:
 * - defaultCache uses NetworkFirst for page navigations, so prices, stock and
 *   cart/checkout/account pages are ALWAYS fetched live when online. The cache
 *   is only ever used as an offline fallback — never to serve stale commerce data.
 * - Only build-time static assets (JS/CSS/fonts/images) are precached.
 * - When a navigation fails offline, we show the branded /offline page.
 */
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
