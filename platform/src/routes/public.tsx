// GREEN FAD — Site public SSR : toutes les routes proviennent de la base de données
import { Hono } from "hono";
import { Context } from "hono";
import { Env } from "../types";
import { q, q1, count, getSetting } from "../db";
import { layout, loadSiteData, PageSEO } from "../render/layout";
import { renderBlocks, renderBlock, Block } from "../blocks";
import { md, esc, fmtDate, excerptFromMd } from "../utils";
import { audit } from "../audit";

const PUBLIE = "publie";

// ---------- Helpers ----------
async function getPageSEO(c: Context<{ Bindings: Env }>, seo: PageSEO): Promise<PageSEO> {
  const defaults = (await getSetting(c.env.DB, "seo_defaults", {})) as { default_title_suffix?: string; default_description?: string };
  return {
    ...seo,
    title: `${seo.title}${seo.title.includes("Greenfad") ? "" : ` | ${String((await getSetting(c.env.DB, "site_name", "GREEN FAD")) as string)}`}`,
    description: seo.description || defaults.default_description || undefined,
  };
}

function cardHTML(item: { url: string; title: string; text?: string; image?: string; tag?: string; icon?: string }): string {
  return `<article class="card reveal">
    ${item.image ? `<a class="card__media" href="${esc(item.url)}"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy"></a>` : ""}
    <div class="card__body">
      ${item.tag ? `<span class="tag">${esc(item.tag)}</span>` : ""}
      <h3><a href="${esc(item.url)}">${esc(item.title)}</a></h3>
      ${item.text ? `<p>${esc(item.text)}</p>` : ""}
      <span class="card__more">Découvrir →</span>
    </div></article>`;
}

function coverSrc(key: string | null | undefined): string {
  if (!key) return "";
  return key.startsWith("/") ? key : `/media/${key}`;
}

// ---------- Router ----------
export const publicRoutes = new Hono<{ Bindings: Env }>();

// Redirections SEO depuis la base (ancien site → nouvelle structure)
publicRoutes.use("*", async (c, next) => {
  const path = c.req.path;
  if (path.startsWith("/admin") || path.startsWith("/api") || path.startsWith("/media") || path.startsWith("/assets")) return next();
  const r = await q1<{ to_path: string; code: number }>(c.env.DB, "SELECT to_path, code FROM redirects WHERE from_path = ? AND is_active = 1", path);
  if (r) return c.redirect(r.to_path, r.code as 301 | 302);
  await next();
});

// ---------- Accueil ----------
publicRoutes.get("/", async (c) => {
  const site = await loadSiteData(c);
  const home = await q1<{ title: string; blocks: string; meta_title: string; meta_description: string }>(
    c.env.DB,
    "SELECT title, blocks, meta_title, meta_description FROM pages WHERE is_home = 1 AND status = ?",
    PUBLIE
  );
  if (!home) {
    return c.html(await layout(c, site, await getPageSEO(c, { title: "GREEN FAD — Transformation numérique et écologique en Afrique" }), `<section class="container" style="padding:8rem 0"><h1>Bienvenue chez GREEN FAD</h1><p>Le site est en cours de publication.</p></section>`));
  }
  const blocks = JSON.parse(home.blocks) as Block[];
  const body = await renderBlocks(blocks, c.env);
  return c.html(await layout(c, site, await getPageSEO(c, { title: home.meta_title || home.title, description: home.meta_description || undefined }), body));
});

// ---------- Pages génériques (Entreprise, mentions légales…) ----------
publicRoutes.get("/p/:slug", async (c) => {
  const slug = c.req.param("slug");
  const site = await loadSiteData(c);
  const page = await q1<{ title: string; blocks: string; meta_title: string; meta_description: string; og_image: string }>(
    c.env.DB,
    "SELECT title, blocks, meta_title, meta_description, og_image FROM pages WHERE slug = ? AND status = ? AND is_home = 0",
    slug,
    PUBLIE
  );
  if (!page) return c.notFound();
  const body = await renderBlocks(JSON.parse(page.blocks) as Block[], c.env);
  return c.html(await layout(c, site, await getPageSEO(c, { title: page.meta_title || page.title, description: page.meta_description || undefined, ogImage: page.og_image || undefined }), body));
});

// Aperçu Page Builder (réservé administrateur connecté, statut brouillon)
publicRoutes.get("/__preview/:id", async (c) => {
  const user = c.get("user");
  if (!user) return c.text("Aperçu réservé à l'administration", 401);
  const id = c.req.param("id");
  const site = await loadSiteData(c);
  const page = await q1<{ title: string; blocks: string }>(c.env.DB, "SELECT title, blocks FROM pages WHERE id = ?", id);
  if (!page) return c.notFound();
  const body = await renderBlocks(JSON.parse(page.blocks) as Block[], c.env);
  return c.html(await layout(c, site, { title: `${page.title} — APERÇU BROUILLON`, noindex: true }, `<div class="preview-banner">Brouillon en prévisualisation — non publié</div>${body}`));
});

// ---------- Expertises (services) ----------
publicRoutes.get("/expertises", async (c) => {
  const site = await loadSiteData(c);
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, name, summary, icon, image_key FROM services WHERE status = ? ORDER BY sort_order", PUBLIE);
  const intro = (await getSetting(c.env.DB, "expertises_intro", "")) as string;
  const body = `<section class="page-head"><div class="container"><p class="eyebrow">Nos expertises</p><h1>Des savoir-faire complets, du conseil à la réalisation</h1>${intro ? `<p class="page-head__text">${esc(intro)}</p>` : ""}</div></section>
  <section class="container"><div class="cards cards--3">${rows
    .map((s) => cardHTML({ url: `/expertises/${s.slug}`, title: String(s.name), text: String(s.summary || ""), image: coverSrc(String(s.image_key || "")), icon: String(s.icon || "") }))
    .join("")}</div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Nos expertises", description: "Développement web, applications mobiles, SEO & marketing digital, impression & communication." }), body));
});

publicRoutes.get("/expertises/:slug", async (c) => {
  const slug = c.req.param("slug");
  const site = await loadSiteData(c);
  const s = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM services WHERE slug = ? AND status = ?", slug, PUBLIE);
  if (!s) return c.notFound();
  const others = await q(c.env.DB, "SELECT slug, name FROM services WHERE status = ? AND slug != ? ORDER BY sort_order LIMIT 3", PUBLIE, slug);
  const body = `<article>
    <section class="page-head page-head--entity"><div class="container">
      <p class="eyebrow"><a href="/expertises">Expertises</a> /</p>
      <h1>${esc(s.name)}</h1>
      ${s.summary ? `<p class="page-head__text">${esc(s.summary)}</p>` : ""}
      <div class="page-head__cta"><a class="btn btn--primary" href="/devis">Demander un devis</a><a class="btn btn--ghost" href="/contact">Poser une question</a></div>
    </div></section>
    <section class="container prose entity-body">${md(s.content_md)}</section>
    ${others.length ? `<section class="container"><header class="sec-head"><h2>Autres expertises</h2></header><div class="chips">${others.map((o) => `<a class="chip" href="/expertises/${o.slug}">${esc(o.name)}</a>`).join("")}</div></section>` : ""}
  </article>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(s.meta_title || s.name), description: String(s.meta_description || s.summary || "") }), body));
});

// ---------- Produits ----------
publicRoutes.get("/produits", async (c) => {
  const site = await loadSiteData(c);
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, name, tagline, category, image_key, icon FROM products WHERE status = ? ORDER BY sort_order", PUBLIE);
  const body = `<section class="page-head"><div class="container"><p class="eyebrow">Nos produits</p><h1>Des solutions propriétaires, nées sur le terrain</h1><p class="page-head__text">Chaque produit GREEN FAD allie innovation technologique et approche écologique.</p></div></section>
  <section class="container"><div class="cards cards--3">${rows
    .map((p) => cardHTML({ url: `/produits/${p.slug}`, title: String(p.name), text: String(p.tagline || ""), image: coverSrc(String(p.image_key || "")), tag: String(p.category || "") }))
    .join("")}</div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Nos produits", description: "FAD CARD, NIAFAD, QRFAD, FEREFAD, SARAPAY, Carte Santé — solutions digitales GREEN FAD." }), body));
});

publicRoutes.get("/produits/:slug", async (c) => {
  const slug = c.req.param("slug");
  const site = await loadSiteData(c);
  const p = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM products WHERE slug = ? AND status = ?", slug, PUBLIE);
  if (!p) return c.notFound();
  const features = JSON.parse(String(p.features || "[]")) as { title?: string; text?: string }[];
  const others = await q(c.env.DB, "SELECT slug, name FROM products WHERE status = ? AND slug != ? ORDER BY sort_order LIMIT 3", PUBLIE, slug);
  const body = `<article>
    <section class="page-head page-head--entity"><div class="container">
      <p class="eyebrow"><a href="/produits">Produits</a>${p.category ? ` / ${esc(p.category)}` : ""} /</p>
      <h1>${esc(p.name)}</h1>
      ${p.tagline ? `<p class="page-head__text">${esc(p.tagline)}</p>` : ""}
      <div class="page-head__cta"><a class="btn btn--primary" href="/devis">Demander une démonstration</a></div>
    </div></section>
    ${p.image_key ? `<section class="container"><div class="entity-cover"><img src="${esc(coverSrc(String(p.image_key)))}" alt="${esc(p.name)}"></div></section>` : ""}
    <section class="container prose entity-body">${md(p.description_md)}</section>
    ${features.length ? `<section class="container"><header class="sec-head"><h2>Fonctionnalités</h2></header><div class="feature-grid">${features
      .map((f) => `<div class="feature"><h3>${esc(f.title || "")}</h3><p>${esc(f.text || "")}</p></div>`)
      .join("")}</div></section>` : ""}
    ${others.length ? `<section class="container"><header class="sec-head"><h2>Autres produits</h2></header><div class="chips">${others.map((o) => `<a class="chip" href="/produits/${o.slug}">${esc(o.name)}</a>`).join("")}</div></section>` : ""}
  </article>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(p.meta_title || p.name), description: String(p.meta_description || p.tagline || "") }), body));
});

// ---------- Réalisations ----------
publicRoutes.get("/realisations", async (c) => {
  const site = await loadSiteData(c);
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, summary, category, image_key, completed_at FROM projects WHERE status = ? ORDER BY sort_order", PUBLIE);
  const body = `<section class="page-head"><div class="container"><p class="eyebrow">Nos réalisations</p><h1>Des projets qui parlent d'eux-mêmes</h1></div></section>
  <section class="container"><div class="cards cards--3">${rows
    .map((p) => cardHTML({ url: `/realisations/${p.slug}`, title: String(p.title), text: String(p.summary || ""), image: coverSrc(String(p.image_key || "")), tag: String(p.category || "") }))
    .join("")}</div></section>
  <section class="cta-band"><div class="container cta-band__inner"><h2>Votre projet mérite le même niveau d'exigence</h2><a class="btn btn--invert" href="/devis">Parlons-en</a></div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Nos réalisations" }), body));
});

publicRoutes.get("/realisations/:slug", async (c) => {
  const site = await loadSiteData(c);
  const p = await q1<Record<string, unknown>>(c.env.DB, "SELECT p.*, co.name AS country_name FROM projects p LEFT JOIN countries co ON co.id = p.country_id WHERE p.slug = ? AND p.status = ?", c.req.param("slug"), PUBLIE);
  if (!p) return c.notFound();
  const gallery = JSON.parse(String(p.gallery || "[]")) as string[];
  const body = `<article>
    <section class="page-head page-head--entity"><div class="container">
      <p class="eyebrow"><a href="/realisations">Réalisations</a>${p.category ? ` / ${esc(p.category)}` : ""} /</p>
      <h1>${esc(p.title)}</h1>
      ${p.summary ? `<p class="page-head__text">${esc(p.summary)}</p>` : ""}
      <p class="muted">${[p.client ? `Client : ${esc(p.client)}` : "", p.country_name ? `Pays : ${esc(p.country_name)}` : "", p.completed_at ? `Livré : ${fmtDate(String(p.completed_at))}` : ""].filter(Boolean).join(" · ")}</p>
    </div></section>
    ${p.image_key ? `<section class="container"><div class="entity-cover"><img src="${esc(coverSrc(String(p.image_key)))}" alt="${esc(p.title)}"></div></section>` : ""}
    <section class="container prose entity-body">${md(p.content_md)}</section>
    ${gallery.length ? `<section class="container"><div class="gallery gallery--3">${gallery.map((g) => `<figure><img src="${esc(coverSrc(g))}" alt="${esc(p.title)}" loading="lazy"></figure>`).join("")}</div></section>` : ""}
  </article>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(p.meta_title || p.title), description: String(p.meta_description || p.summary || "") }), body));
});

// ---------- Actualités (blog) ----------
publicRoutes.get("/actualites", async (c) => {
  const site = await loadSiteData(c);
  const page = Math.max(1, parseInt(c.req.query("page") || "1", 10) || 1);
  const per = 9;
  const total = await count(c.env.DB, "posts", "status = ?", PUBLIE);
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, excerpt, cover_key, category, published_at, author FROM posts WHERE status = ? ORDER BY published_at DESC LIMIT ? OFFSET ?", PUBLIE, per, (page - 1) * per);
  const featured = page === 1 ? await q1(c.env.DB, "SELECT slug, title, excerpt, cover_key, category, published_at FROM posts WHERE status = ? AND is_featured = 1 ORDER BY published_at DESC LIMIT 1", PUBLIE) : null;
  const pages = Math.max(1, Math.ceil(total / per));
  const body = `<section class="page-head"><div class="container"><p class="eyebrow">Actualités & Insights</p><h1>Le regard GREEN FAD sur la technologie et le développement durable</h1></div></section>
  ${featured ? `<section class="container"><a class="featured reveal" href="/actualites/${featured.slug}">
      ${featured.cover_key ? `<div class="featured__media"><img src="${esc(coverSrc(String(featured.cover_key)))}" alt="${esc(featured.title)}"></div>` : ""}
      <div class="featured__body"><span class="tag">${esc(featured.category || "À la une")}</span><h2>${esc(featured.title)}</h2><p>${esc(featured.excerpt || "")}</p><p class="muted">${fmtDate(String(featured.published_at))}</p></div></a></section>` : ""}
  <section class="container"><div class="cards cards--3">${rows
    .map((p) => cardHTML({ url: `/actualites/${p.slug}`, title: String(p.title), text: String(p.excerpt || excerptFromMd(p.excerpt)).slice(0, 160), image: coverSrc(String(p.cover_key || "")), tag: String(p.category || "") }))
    .join("")}</div></section>
  ${pages > 1 ? `<nav class="pager container">${Array.from({ length: pages }, (_, i) => `<a class="${i + 1 === page ? "is-current" : ""}" href="/actualites?page=${i + 1}">${i + 1}</a>`).join("")}</nav>` : ""}`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Actualités", description: "Articles, tutoriels et analyses sur le développement web, le SEO et les technologies vertes en Afrique." }), body));
});

publicRoutes.get("/actualites/:slug", async (c) => {
  const site = await loadSiteData(c);
  const p = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM posts WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!p) return c.notFound();
  await c.env.DB.prepare("UPDATE posts SET views = views + 1 WHERE id = ?").bind(p.id).run();
  const tags = JSON.parse(String(p.tags || "[]")) as string[];
  const related = await q(c.env.DB, "SELECT slug, title, published_at FROM posts WHERE status = ? AND slug != ? AND category = ? ORDER BY published_at DESC LIMIT 3", PUBLIE, p.slug, String(p.category || ""));
  const body = `<article class="post">
    <header class="page-head page-head--entity"><div class="container">
      <p class="eyebrow"><a href="/actualites">Actualités</a>${p.category ? ` / ${esc(p.category)}` : ""} /</p>
      <h1>${esc(p.title)}</h1>
      <p class="muted">Publié le <time datetime="${esc(String(p.published_at))}">${fmtDate(String(p.published_at))}</time> · ${esc(p.author)}</p>
    </div></header>
    ${p.cover_key ? `<section class="container"><div class="entity-cover"><img src="${esc(coverSrc(String(p.cover_key)))}" alt="${esc(p.title)}"></div></section>` : ""}
    <div class="container prose entity-body">${md(p.content_md)}</div>
    ${tags.length ? `<div class="container"><div class="chips">${tags.map((t) => `<span class="chip">#${esc(t)}</span>`).join("")}</div></div>` : ""}
    ${related.length ? `<section class="container"><header class="sec-head"><h2>À lire également</h2></header><ul class="related">${related.map((r) => `<li><a href="/actualites/${r.slug}">${esc(r.title)}</a><span class="muted"> · ${fmtDate(String(r.published_at), "short")}</span></li>`).join("")}</ul></section>` : ""}
  </article>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(p.meta_title || p.title), description: String(p.meta_description || p.excerpt || "") }), body));
});

// ---------- Implantation internationale ----------
publicRoutes.get("/implantation", async (c) => {
  const site = await loadSiteData(c);
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT c.*, (SELECT COUNT(*) FROM offices o WHERE o.country_id = c.id AND o.status='publie') AS nb_offices FROM countries c WHERE c.status = ? ORDER BY c.sort_order", PUBLIE);
  const body = `<section class="page-head"><div class="container"><p class="eyebrow">Implantation</p><h1>Une présence régionale, ancrée localement</h1><p class="page-head__text">GREEN FAD SARL est immatriculée au Mali, en RDC, au Burkina Faso et au Niger.</p></div></section>
  <section class="container"><div class="countries">${rows
    .map((r) => `<a class="country reveal" href="/implantation/${r.slug}"><span class="country__flag">${esc(r.flag_emoji || "🌍")}</span><h3>${esc(r.name)}</h3><p class="muted">${r.nb_offices ? `${r.nb_offices} bureau${Number(r.nb_offices) > 1 ? "x" : ""}` : "Présence"}</p><span class="country__arrow">→</span></a>`)
    .join("")}</div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Implantation internationale", description: "Mali, Burkina Faso, Côte d'Ivoire, Niger, RDC — bureaux et contacts GREEN FAD." }), body));
});

publicRoutes.get("/implantation/:slug", async (c) => {
  const site = await loadSiteData(c);
  const co = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM countries WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!co) return c.notFound();
  const offices = await q(c.env.DB, "SELECT * FROM offices WHERE country_id = ? AND status = ? ORDER BY is_hq DESC", co.id, PUBLIE);
  const body = `<article>
    <section class="page-head page-head--entity"><div class="container">
      <p class="eyebrow"><a href="/implantation">Implantation</a> /</p>
      <h1>${esc(co.flag_emoji || "")} GREEN FAD au ${esc(co.name)}</h1>
    </div></section>
    <section class="container prose entity-body">${md(co.presentation_md)}</section>
    <section class="container"><header class="sec-head"><h2>Nos bureaux au ${esc(co.name)}</h2></header>
      ${offices.length ? `<div class="office-grid">${offices
        .map((o) => `<div class="office card"><div class="card__body"><h3>${esc(o.city)}${o.is_hq ? ' <span class="tag">Siège</span>' : ""}</h3>${o.address ? `<p>📍 ${esc(o.address)}</p>` : ""}${o.phone ? `<p>📞 <a href="tel:${esc(String(o.phone).replace(/\s/g, ""))}">${esc(o.phone)}</a></p>` : ""}${o.email ? `<p>✉️ <a href="mailto:${esc(o.email)}">${esc(o.email)}</a></p>` : ""}${o.hours ? `<p class="muted">🕘 ${esc(o.hours)}</p>` : ""}${o.map_url ? `<p><a href="${esc(o.map_url)}" target="_blank" rel="noopener">Voir sur la carte →</a></p>` : ""}</div></div>`)
        .join("")}</div>` : `<p class="muted container">Les coordonnées détaillées de ce pays seront publiées prochainement.</p>`}
    </section>
  </article>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: `GREEN FAD ${co.name}`, description: `Bureaux, contacts et projets GREEN FAD ${co.name}.` }), body));
});

// ---------- Ressources : documents, presse, archives ----------
publicRoutes.get("/ressources", async (c) => {
  const site = await loadSiteData(c);
  const docs = await q(c.env.DB, "SELECT id, title, description, category, file_key, mime FROM documents WHERE status = ? AND is_public = 1 ORDER BY id DESC LIMIT 12", PUBLIE);
  const press = await q(c.env.DB, "SELECT slug, title, summary, published_at FROM press_releases WHERE status = ? ORDER BY published_at DESC LIMIT 6", PUBLIE);
  const archives = await q(c.env.DB, "SELECT id, year, title, description FROM archives WHERE status = ? ORDER BY year DESC LIMIT 8", PUBLIE);
  const body = `<section class="page-head"><div class="container"><p class="eyebrow">Ressources</p><h1>Centre documentaire & archives</h1></div></section>
  <section class="container"><header class="sec-head"><h2>Documents</h2></header>
    ${docs.length ? `<div class="doc-list">${docs
      .map((d) => `<a class="doc" href="${esc(String(d.file_key).startsWith("/") ? String(d.file_key) : "/media/" + d.file_key)}" ${/pdf/.test(String(d.mime || "")) ? 'target="_blank"' : ""}><span class="doc__icon">📄</span><span><strong>${esc(d.title)}</strong>${d.description ? `<em>${esc(d.description)}</em>` : ""}</span><span class="doc__arrow">↓</span></a>`)
      .join("")}</div>` : `<p class="muted">Aucun document public pour le moment.</p>`}
  </section>
  <section class="container"><header class="sec-head"><h2>Communiqués de presse</h2></header>
    ${press.length ? `<ul class="related">${press.map((r) => `<li><a href="/presse/${r.slug}">${esc(r.title)}</a><span class="muted"> · ${fmtDate(String(r.published_at), "short")}</span></li>`).join("")}</ul>` : `<p class="muted">Aucun communiqué publié pour le moment.</p>`}
  </section>
  <section class="container"><header class="sec-head"><h2>Archives historiques</h2></header>
    ${archives.length ? `<ol class="timeline">${archives.map((a) => `<li><span class="timeline__year">${esc(a.year)}</span><div><h3>${esc(a.title)}</h3>${a.description ? `<p>${esc(a.description)}</p>` : ""}</div></li>`).join("")}</ol>` : `<p class="muted">Les archives seront alimentées par l'administration.</p>`}
  </section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Ressources" }), body));
});

publicRoutes.get("/presse/:slug", async (c) => {
  const site = await loadSiteData(c);
  const r = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM press_releases WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!r) return c.notFound();
  const body = `<article><section class="page-head page-head--entity"><div class="container"><p class="eyebrow">Presse</p><h1>${esc(r.title)}</h1><p class="muted">${fmtDate(String(r.published_at))}</p></div></section>
  <div class="container prose entity-body">${md(r.content_md)}</div></article>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(r.title) }), body));
});

// ---------- Carrières ----------
publicRoutes.get("/carrieres", async (c) => {
  const site = await loadSiteData(c);
  const rows = await q(c.env.DB, "SELECT slug, title, department, location, contract_type, deadline FROM jobs WHERE status = ? AND is_open = 1 ORDER BY id DESC", PUBLIE);
  const body = `<section class="page-head"><div class="container"><p class="eyebrow">Carrières</p><h1>Rejoindre GREEN FAD</h1><p class="page-head__text">Construire l'avenir numérique et écologique de l'Afrique, ensemble.</p></div></section>
  <section class="container">${rows.length ? `<div class="job-list">${rows
    .map((j) => `<a class="job" href="/carrieres/${j.slug}"><div><h3>${esc(j.title)}</h3><p class="muted">${esc([j.department, j.location, j.contract_type].filter(Boolean).join(" · "))}</p></div><span class="country__arrow">→</span></a>`)
    .join("")}</div>` : `<p class="muted">Aucun poste ouvert pour le moment — les offres seront publiées depuis le Dashboard.</p>`}
  </section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Carrières" }), body));
});

publicRoutes.get("/carrieres/:slug", async (c) => {
  const site = await loadSiteData(c);
  const j = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM jobs WHERE slug = ? AND status = ? AND is_open = 1", c.req.param("slug"), PUBLIE);
  if (!j) return c.notFound();
  const body = `<article><section class="page-head page-head--entity"><div class="container"><p class="eyebrow"><a href="/carrieres">Carrières</a> /</p><h1>${esc(j.title)}</h1>
    <p class="muted">${esc([j.department, j.location, j.contract_type].filter(Boolean).join(" · "))}${j.deadline ? ` · clôture le ${fmtDate(String(j.deadline))}` : ""}</p></div></section>
    <section class="container prose entity-body">${md(j.description_md)}${j.requirements_md ? `<h2>Profil recherché</h2>${md(j.requirements_md)}` : ""}</section>
    <section class="container form-card" id="apply"><h2>Postuler</h2>
      <form method="post" action="/carrieres/${esc(j.slug)}/apply" enctype="multipart/form-data" class="form-grid">
        <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label>Nom complet<input name="name" required maxlength="120"></label>
        <label>Email<input type="email" name="email" required maxlength="160"></label>
        <label>Téléphone<input name="phone" maxlength="40"></label>
        <label class="full">Lettre de motivation / mot de présentation<textarea name="cover_note" rows="4" maxlength="3000"></textarea></label>
        <label class="full">CV (PDF, max 5 Mo)<input type="file" name="cv" accept=".pdf"></label>
        <button class="btn btn--primary" type="submit">Envoyer ma candidature</button>
      </form></section>
  </article>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(j.title) }), body));
});

// ---------- FAQ ----------
publicRoutes.get("/faq", async (c) => {
  const site = await loadSiteData(c);
  const rows = await q(c.env.DB, "SELECT question, answer, category FROM faqs WHERE status = ? ORDER BY category, sort_order", PUBLIE);
  const byCat: Record<string, { question: string; answer: string }[]> = {};
  for (const r of rows) (byCat[String(r.category || "Général")] ||= []).push({ question: String(r.question), answer: String(r.answer) });
  const body = `<section class="page-head"><div class="container"><p class="eyebrow">FAQ</p><h1>Questions fréquentes</h1></div></section>
  ${Object.entries(byCat).map(([cat, items]) => `<section class="container"><header class="sec-head"><h2>${esc(cat)}</h2></header><div class="faq">${items.map((i) => `<details><summary>${esc(i.question)}</summary><div class="prose">${md(i.answer)}</div></details>`).join("")}</div></section>`).join("")}`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "FAQ" }), body));
});

// ---------- Contact / Devis (POST → base de données) ----------
export async function handleContact(c: Context<{ Bindings: Env }>, type: "contact" | "devis"): Promise<Response> {
  const body = await c.req.parseBody().catch(() => null);
  if (!body || typeof body === "string") return c.text("Formulaire invalide", 400);
  if (body["website"]) return c.redirect("/contact?sent=1#merci"); // honeypot : spam bot
  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 160);
  const message = String(body.message || "").trim().slice(0, 4000);
  if (!name || !email.includes("@") || !message) return c.redirect(type === "contact" ? "/contact?error=1" : "/?error=1#form-block");
  const ok = await (await import("../auth")).rateLimit(c, `form:${c.req.header("cf-connecting-ip") || "ip"}`, 8, 3600);
  if (!ok) return c.text("Trop de soumissions. Réessayez plus tard.", 429);
  if (type === "devis") {
    await c.env.DB.prepare("INSERT INTO leads (name, email, phone, company, message, source, status, created_at) VALUES (?1,?2,?3,?4,?5,'devis','nouveau',datetime('now'))")
      .bind(name, email, String(body.phone || "").slice(0, 40), String(body.company || "").slice(0, 160), message)
      .run();
    await audit(c, "formulaire_devis", "leads", null, { name, email });
  } else {
    await c.env.DB.prepare("INSERT INTO contact_messages (name, email, phone, subject, message, type, status, created_at) VALUES (?1,?2,?3,?4,?5,'contact','nouveau',datetime('now'))")
      .bind(name, email, String(body.phone || "").slice(0, 40), String(body.subject || "").slice(0, 150), message)
      .run();
    await audit(c, "formulaire_contact", "contact_messages", null, { name, email });
  }
  return c.redirect("/contact?sent=1#merci");
}

publicRoutes.get("/contact", async (c) => {
  const site = await loadSiteData(c);
  const s = site.settings;
  const sent = c.req.query("sent") === "1";
  const body = `<section class="page-head"><div class="container"><p class="eyebrow">Contact</p><h1>Parlons de votre projet</h1><p class="page-head__text">Remplissez le formulaire et nos équipes vous répondent dans les meilleurs délais.</p></div></section>
  ${sent ? `<section class="container"><div class="form-card" id="merci"><h2>✅ Message bien reçu</h2><p>Merci ${""}! Notre équipe revient vers vous très vite.</p><a class="btn btn--outline" href="/">Retour à l'accueil</a></div></section>` : ""}
  <section class="container"><div class="contact-grid">
    <div class="form-card"><h2>Nous écrire</h2>
      <form method="post" action="/contact" class="form-grid">
        <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label>Nom complet<input name="name" required maxlength="120"></label>
        <label>Email<input type="email" name="email" required maxlength="160"></label>
        <label>Téléphone<input name="phone" maxlength="40"></label>
        <label>Objet<input name="subject" maxlength="150"></label>
        <label class="full">Votre message<textarea name="message" rows="5" required maxlength="4000"></textarea></label>
        <button class="btn btn--primary" type="submit">Envoyer</button>
      </form></div>
    <aside class="contact-aside">
      <h2>Coordonnées</h2>
      ${s.contact_address ? `<p>📍 ${esc(String(s.contact_address))}</p>` : ""}
      ${s.contact_phone ? `<p>📞 <a href="tel:${esc(String(s.contact_phone).replace(/\s/g, ""))}">${esc(String(s.contact_phone))}</a></p>` : ""}
      ${s.contact_email ? `<p>✉️ <a href="mailto:${esc(String(s.contact_email))}">${esc(String(s.contact_email))}</a></p>` : ""}
      <h2>Devis & partenariats</h2>
      <form method="post" action="/devis" class="form-grid">
        <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label>Nom<input name="name" required maxlength="120"></label>
        <label>Email<input type="email" name="email" required maxlength="160"></label>
        <label>Société<input name="company" maxlength="160"></label>
        <label class="full">Votre besoin<textarea name="message" rows="3" required maxlength="4000"></textarea></label>
        <button class="btn btn--outline" type="submit">Demander un devis</button>
      </form>
    </aside>
  </div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Contact", description: "Contactez GREEN FAD — Bamako, Mali." }), body));
});

publicRoutes.post("/contact", (c) => handleContact(c, "contact"));
publicRoutes.post("/devis", (c) => handleContact(c, "devis"));

// Newsletter
publicRoutes.post("/newsletter", async (c) => {
  const body = await c.req.parseBody().catch(() => null);
  const email = body && typeof body !== "string" ? String(body.email || "").trim().slice(0, 160) : "";
  if (email.includes("@")) {
    await c.env.DB.prepare("INSERT INTO newsletter_subscribers (email, status, created_at) VALUES (?1,'actif',datetime('now')) ON CONFLICT(email) DO NOTHING").bind(email).run();
  }
  return c.redirect("/?newsletter=1");
});

// ---------- Candidature ----------
publicRoutes.post("/carrieres/:slug/apply", async (c) => {
  const job = await q1<{ id: number }>(c.env.DB, "SELECT id FROM jobs WHERE slug = ? AND status = ? AND is_open = 1", c.req.param("slug"), PUBLIE);
  if (!job) return c.notFound();
  const form = await c.req.parseBody({ all: true }).catch(() => null);
  if (!form || typeof form === "string") return c.text("Formulaire invalide", 400);
  if (form["website"]) return c.redirect("/carrieres");
  const name = String(form.name || "").trim().slice(0, 120);
  const email = String(form.email || "").trim().slice(0, 160);
  if (!name || !email.includes("@")) return c.redirect(`/carrieres/${c.req.param("slug")}#apply`);
  let cvKey: string | null = null;
  const cv = form["cv"];
  if (cv && cv instanceof File && cv.size > 0 && cv.size < 5 * 1024 * 1024 && cv.type === "application/pdf") {
    const { saveToR2 } = await import("../media");
    cvKey = await saveToR2(c, cv, "docs");
  }
  await c.env.DB.prepare("INSERT INTO job_applications (job_id, name, email, phone, cover_note, cv_key, created_at) VALUES (?1,?2,?3,?4,?5,?6,datetime('now'))")
    .bind(job.id, name, email, String(form.phone || "").slice(0, 40), String(form.cover_note || "").slice(0, 3000), cvKey)
    .run();
  return c.redirect(`/carrieres/${c.req.param("slug")}?sent=1#apply`);
});

// ---------- SEO : sitemap + robots + RSS ----------
publicRoutes.get("/sitemap.xml", async (c) => {
  const base = String((await getSetting(c.env.DB, "site_url", c.env.SITE_URL)) as string);
  const [pages, posts, products, services, projects, countries] = await Promise.all([
    q(c.env.DB, "SELECT slug, updated_at FROM pages WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM posts WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM products WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM services WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM projects WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM countries WHERE status = ?", PUBLIE),
  ]);
  const urls: { loc: string; date: string; priority: string }[] = [
    { loc: "/", date: new Date().toISOString().slice(0, 10), priority: "1.0" },
    ...pages.filter((p) => p.slug !== "__home__").map((p) => ({ loc: p.slug === "entreprise" ? "/p/entreprise" : `/p/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.8" })),
    { loc: "/expertises", date: new Date().toISOString().slice(0, 10), priority: "0.9" },
    ...services.map((s) => ({ loc: `/expertises/${s.slug}`, date: String(s.updated_at).slice(0, 10), priority: "0.7" })),
    { loc: "/produits", date: new Date().toISOString().slice(0, 10), priority: "0.9" },
    ...products.map((p) => ({ loc: `/produits/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.7" })),
    { loc: "/realisations", date: new Date().toISOString().slice(0, 10), priority: "0.8" },
    ...projects.map((p) => ({ loc: `/realisations/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.6" })),
    { loc: "/actualites", date: new Date().toISOString().slice(0, 10), priority: "0.8" },
    ...posts.map((p) => ({ loc: `/actualites/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.6" })),
    { loc: "/implantation", date: new Date().toISOString().slice(0, 10), priority: "0.7" },
    ...countries.map((p) => ({ loc: `/implantation/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.6" })),
    { loc: "/contact", date: new Date().toISOString().slice(0, 10), priority: "0.6" },
    { loc: "/ressources", date: new Date().toISOString().slice(0, 10), priority: "0.5" },
    { loc: "/carrieres", date: new Date().toISOString().slice(0, 10), priority: "0.5" },
    { loc: "/faq", date: new Date().toISOString().slice(0, 10), priority: "0.4" },
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${base}${u.loc}</loc><lastmod>${u.date}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>`;
  return c.body(xml, 200, { "content-type": "application/xml; charset=utf-8" });
});

publicRoutes.get("/robots.txt", async (c) => {
  const base = String((await getSetting(c.env.DB, "site_url", c.env.SITE_URL)) as string);
  return c.body(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${base}/sitemap.xml\n`, 200, { "content-type": "text/plain; charset=utf-8" });
});

publicRoutes.get("/rss.xml", async (c) => {
  const base = String((await getSetting(c.env.DB, "site_url", c.env.SITE_URL)) as string);
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, excerpt, published_at FROM posts WHERE status = ? ORDER BY published_at DESC LIMIT 20", PUBLIE);
  const items = rows
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${base}/actualites/${p.slug}</link><description>${esc(p.excerpt || "")}</description><pubDate>${new Date(String(p.published_at)).toUTCString()}</pubDate><guid>${base}/actualites/${p.slug}</guid></item>`
    )
    .join("\n");
  return c.body(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>GREEN FAD — Actualités</title><link>${base}</link><description>Technologie & durabilité en Afrique</description>${items}</channel></rss>`, 200, { "content-type": "application/rss+xml; charset=utf-8" });
});
