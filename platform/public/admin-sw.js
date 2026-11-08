// GREEN FAD — Service Worker de la PWA Admin (scope /admin/)
// Stratégie volontairement prudente :
//  - assets (css/js/svg/png/polices) : cache-first (contenus publics, jamais sensibles)
//  - pages HTML /admin : network-only avec repli hors-ligne (aucune donnée métier cachée)
const VERSION = "gf-admin-v1";
const ASSET_CACHE = `${VERSION}-assets`;

const OFFLINE_HTML = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Hors ligne — GREEN FAD Admin</title>
<style>body{font-family:system-ui,sans-serif;background:#0E1B30;color:#E9F0FA;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px;text-align:center}
.box{max-width:420px}.ic{width:56px;height:56px;border-radius:16px;background:rgba(70,146,155,.18);display:inline-flex;align-items:center;justify-content:center;margin-bottom:18px}
svg{width:28px;height:28px;stroke:#7CC4CC;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
h1{font-size:1.25rem;margin:.4rem 0}p{color:rgba(233,240,250,.66);line-height:1.6;font-size:.95rem}</style></head>
<body><div class="box"><span class="ic"><svg viewBox="0 0 24 24"><path d="M2 12a10 10 0 0 1 14-1"/><path d="M2 5a17 17 0 0 1 16 8"/><circle cx="5" cy="19" r="1.5"/></svg></span>
<h1>Connexion indisponible</h1><p>L'interface d'administration GREEN FAD nécessite une connexion Internet. Reconnectez-vous pour retrouver vos données en temps réel.</p>
<button onclick="location.reload()" style="margin-top:14px;padding:10px 18px;border-radius:10px;border:1px solid rgba(124,196,204,.5);background:transparent;color:#7CC4CC;font-size:.95rem;cursor:pointer">Réessayer</button></div></body></html>`;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(ASSET_CACHE).then((c) => c.addAll([
    "/css/admin.css", "/js/admin.js", "/favicon.svg",
    "/assets/images/greenfad-logo-white.svg", "/assets/images/greenfad-mark.svg",
    "/assets/images/admin-icon-192.png", "/assets/images/admin-icon-512.png",
  ]).catch(() => {})).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith("/admin")) return;

  // Assets : cache-first
  if (/\.(css|js|mjs|map|svg|png|jpg|jpeg|webp|gif|ico|woff2?|ttf|webmanifest)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) caches.open(ASSET_CACHE).then((c) => c.put(req, res.clone()));
        return res;
      }))
    );
    return;
  }

  // Pages HTML : réseau, repli hors-ligne (jamais de cache des pages métier)
  if (req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req).catch(() => new Response(OFFLINE_HTML, { headers: { "content-type": "text/html; charset=utf-8" }, status: 503 }))
    );
  }
});
