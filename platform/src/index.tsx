// GREEN FAD — Point d'entrée Hono (Cloudflare Pages _worker.js)
// Architecture : Database → Backend Hono → API → Frontend SSR
import { Hono } from "hono";
import { Env } from "./types";
import { authMiddleware } from "./auth";
import { publicRoutes } from "./routes/public";
import { crudRouter } from "./routes/admin-crud";
import { adminCore } from "./routes/admin-core";
import { builderRouter } from "./routes/builder";
import { apiRouter } from "./api";
import { esc } from "./utils";

const app = new Hono<{ Bindings: Env }>();

// ---------- Redirections canoniques (SEO) : www → apex, slash final → sans slash ----------
// Un seul hôte et une seule forme d'URL pour Google : https://greenfad.tech/…
// - www.greenfad.tech → greenfad.tech (301) : s'active dès que « www » est relié au projet
//   Pages (Paramètres → Domaines personnalisés) ; sans cela www renvoie une erreur 522 Cloudflare.
// - /produits/tile/ → /produits/tile (301) : évite la duplication et les 404 de crawl.
// GET/HEAD uniquement (une 301 sur un POST altérerait la méthode) ; ne touche pas les assets ni /media.
app.on(["GET", "HEAD"], "*", async (c, next) => {
  const url = new URL(c.req.url);
  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.slice(4);
    return c.redirect(url.toString(), 301);
  }
  const p = url.pathname;
  if (p.length > 1 && p.endsWith("/") && !p.startsWith("/admin") && !p.startsWith("/media/") && !p.startsWith("/assets/")) {
    url.pathname = p.replace(/\/+$/, "");
    return c.redirect(url.toString(), 301);
  }
  await next();
});

// ---------- Fichiers statiques (css/js/images/favicon) ----------
// En mode Pages avancé (_worker.js), TOUTES les requêtes passent par le Worker.
// Les fichiers statiques doivent être servis via le binding ASSETS — AVANT tout middleware.
const STATIC_RE = /\.(css|js|mjs|map|jpg|jpeg|png|webp|avif|gif|svg|ico|woff2?|ttf|eot|txt|xml|json|webmanifest)$/i;
app.on(["GET", "HEAD"], "*", async (c, next) => {
  const p = c.req.path;
  if (p.startsWith("/api") || p.startsWith("/admin") || p.startsWith("/media/") || p === "/sitemap.xml") return next();
  if (STATIC_RE.test(p) || p.startsWith("/assets/") || p.startsWith("/css/") || p.startsWith("/js/") || p === "/favicon.svg" || p === "/robots.txt") {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    if (res.status !== 404) return res;
  }
  return next();
});

// Sessions sur toutes les routes (public + admin + api)
app.use("*", authMiddleware);

// ---------- PWA Admin : service worker servi avec l'autorisation de scope /admin/ ----------
app.get("/admin/sw.js", async (c) => {
  const url = new URL("/admin-sw.js", c.req.url);
  const res = await c.env.ASSETS.fetch(new Request(url.toString(), { method: "GET", headers: c.req.raw.headers }));
  if (res.status === 404) return c.body("not found", 404, { "content-type": "text/plain" });
  const headers = new Headers(res.headers);
  headers.set("Service-Worker-Allowed", "/admin/");
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  return new Response(res.body, { status: res.status, headers });
});

// ---------- Accès admin par alias /greenfad (mémoire de marque) ----------
app.get("/greenfad", (c) => c.redirect("/admin", 302));
app.get("/greenfad/*", (c) => {
  const rest = c.req.path.slice("/greenfad".length) || "";
  const qs = c.req.query("q") ? `?q=${encodeURIComponent(c.req.query("q")!)}` : "";
  return c.redirect(`/admin${rest}${qs}`, 302);
});

// ---------- Médias R2 ----------
app.get("/media/*", async (c) => {
  const key = c.req.path.replace("/media/", "");
  if (!key || key.includes("..")) return c.notFound();
  const obj = await c.env.MEDIA.get(key);
  if (!obj) return c.notFound();
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", obj.httpMetadata?.cacheControl || "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
});

// ---------- API v1 ----------
app.route("/api/v1", apiRouter());

// ---------- Administration ----------
// /admin/login reste public ; tout le reste exige une session + CSRF valide
app.on(["GET", "POST"], "/admin/*", async (c, next) => {
  if (c.req.path === "/admin/login") return next();
  const { requireAuth } = await import("./auth");
  return requireAuth(c, next);
});
app.on(["POST"], "/admin/*", async (c, next) => {
  if (c.req.path === "/admin/login" || c.req.path === "/admin/logout") return next();
  const { csrfProtect } = await import("./auth");
  return csrfProtect(c, next);
});
// Ordre critique : routes littérales (login, médias, users…) AVANT les routes paramétriques du CRUD générique
app.route("/admin/pages", builderRouter());
app.route("/admin", adminCore());
app.route("/admin", crudRouter());

// ---------- Site public ----------
app.route("/", publicRoutes);

// ---------- 404 ----------
app.notFound(async (c) => {
  if (c.req.path.startsWith("/api/")) return c.json({ error: "Route inconnue" }, 404);
  if (c.req.path.startsWith("/admin/")) return c.redirect("/admin");
  // Fichiers statiques introuvables : réponse minimale (jamais c.notFound() ici — récursion interdite)
  const isMedia = /\.(jpg|jpeg|png|webp|avif|gif|svg|ico|css|js|mjs|map|woff2?|ttf)$/i.test(c.req.path);
  if (isMedia) return new Response("Not found", { status: 404, headers: { "content-type": "text/plain" } });
  const { loadSiteData, layout } = await import("./render/layout");
  try {
    const site = await loadSiteData(c);
    const seo = { title: "Page introuvable", noindex: true } as const;
    const body = `<section class="error-page container"><p class="eyebrow">Erreur 404</p>
      <h1>Cette page n'existe pas ou a été déplacée</h1>
      <p class="page-head__text">Les anciennes URL du site sont redirigées automatiquement — si vous êtes venus d'un ancien lien, la redirection a peut-être besoin d'être ajoutée.</p>
      <div class="hero__cta"><a class="btn btn--primary" href="/">Retour à l'accueil</a><a class="btn btn--ghost" href="/contact">Nous signaler ce lien</a></div></section>`;
    return c.html(await layout(c, site, seo, body), 404);
  } catch {
    return c.html(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>404 — GREEN FAD</title></head><body style="font-family:system-ui;text-align:center;padding:4rem"><h1>404 — Page introuvable</h1><a href="/">Accueil</a></body></html>`, 404);
  }
});

// ---------- Erreur serveur ----------
app.onError((err, c) => {
  console.error("Erreur plateforme:", err.message, err.stack?.slice(0, 500));
  if (c.req.path.startsWith("/api/")) return c.json({ error: "Erreur interne" }, 500);
  const dbReady = !!c.env.DB;
  return c.html(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>GREEN FAD</title></head>
    <body style="font-family:system-ui;max-width:640px;margin:6rem auto;padding:0 1rem;text-align:center">
    <h1>GREEN FAD — Service momentanément indisponible</h1>
    <p>${dbReady ? "Une erreur technique est survenue. Elle a été consignée." : "La base de données n'est pas encore reliée à cette installation. Contactez l'administration."}</p>
    <p><a href="/">Réessayer</a> · <a href="mailto:contact@greenfad.tech">contact@greenfad.tech</a></p></body></html>`,
    500
  );
});

export default app;
