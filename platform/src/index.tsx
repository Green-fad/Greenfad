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

// Sessions sur toutes les routes
app.use("*", authMiddleware);

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
  const isMedia = /\.(jpg|jpeg|png|webp|gif|svg|ico|css|js)$/i.test(c.req.path);
  if (isMedia) return c.notFound();
  const { loadSiteData, layout } = await import("./render/layout");
  const { getSetting } = await import("./db");
  try {
    const site = await loadSiteData(c);
    const seo = { title: "Page introuvable" };
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
