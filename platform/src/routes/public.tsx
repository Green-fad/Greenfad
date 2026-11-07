// GREEN FAD — Site public SSR v2 : toutes les routes proviennent de la base de données.
// Identité technologique, portfolio produits, galerie multimédia, espace innovation.
// Aucun emoji : icônes SVG uniquement (icons.ts). Données 100 % réelles publiées.
import { Hono, Context } from "hono";
import { Env } from "../types";
import { q, q1, count, getSetting } from "../db";
import { layout, loadSiteData, PageSEO, crumbsHTML, Crumb } from "../render/layout";
import { renderBlocks, renderBlock, Block, parseVideo } from "../blocks";
import { md, esc, fmtDate, excerptFromMd, parseJSON } from "../utils";
import { icon } from "../icons";
import { audit } from "../audit";

const PUBLIE = "publie";

// ---------- Helpers ----------
async function getPageSEO(c: Context<{ Bindings: Env }>, seo: PageSEO): Promise<PageSEO> {
  const siteName = (await getSetting(c.env.DB, "site_name", "GREEN FAD")) as string;
  const defaults = (await getSetting(c.env.DB, "seo_defaults", {})) as { default_description?: string };
  return {
    ...seo,
    title: seo.title.includes("GREEN FAD") ? seo.title : `${seo.title} | ${String(siteName)}`,
    description: seo.description || defaults.default_description || undefined,
  };
}

function mediaSrc(key: string | null | undefined): string {
  if (!key) return "";
  return key.startsWith("/") ? key : `/media/${key}`;
}

function cardHTML(item: { url: string; title: string; text?: string; image?: string; tag?: string; icon?: string; iconBadge?: boolean }): string {
  return `<article class="card reveal">
    ${item.image ? `<a class="card__media" href="${esc(item.url)}"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy"></a>` : ""}
    <div class="card__body">
      ${item.tag ? `<span class="tag">${esc(item.tag)}</span>` : ""}
      ${!item.image && item.icon ? `<span class="card__icon">${icon(item.icon)}</span>` : ""}
      <h3><a href="${esc(item.url)}">${esc(item.title)}</a></h3>
      ${item.text ? `<p>${esc(item.text)}</p>` : ""}
      <span class="card__more">Découvrir ${icon("arrow-right")}</span>
    </div></article>`;
}

function statePill(state: string): string {
  const labels: Record<string, string> = {
    developpement: "En développement",
    beta: "Bêta",
    disponible: "Disponible",
    evolution: "En évolution",
    archive: "Archivé",
  };
  const icons: Record<string, string> = { developpement: "code", beta: "flask", disponible: "check-circle", evolution: "refresh", archive: "archive" };
  const s = labels[state] ? state : "developpement";
  return `<span class="state-pill state--${esc(s)}">${icon(icons[s] || "code")} ${esc(labels[s] || state)}</span>`;
}

const KIND_LABELS: Record<string, { label: string; icon: string; cls?: string }> = {
  article: { label: "Actualité", icon: "newspaper" },
  analyse: { label: "Analyse", icon: "bar-chart" },
  recherche: { label: "Recherche & développement", icon: "flask", cls: "kind-badge--or" },
  prototype: { label: "Prototype", icon: "rocket", cls: "kind-badge--or" },
  veille: { label: "Veille technologique", icon: "globe" },
  publication: { label: "Publication institutionnelle", icon: "file-text" },
  guide: { label: "Guide & ressources", icon: "book-open" },
  opinion: { label: "Opinion", icon: "quote" },
  recit: { label: "Retour d'expérience", icon: "route" },
};

function kindBadge(kind: string): string {
  const k = KIND_LABELS[kind] || KIND_LABELS.article;
  return `<span class="kind-badge${k.cls ? " " + k.cls : ""}">${icon(k.icon)} ${k.label}</span>`;
}

export const publicRoutes = new Hono<{ Bindings: Env }>();

// ---------- Redirections 301 pilotées par la base (cache KV 10 min) ----------
publicRoutes.use("*", async (c, next) => {
  const path = c.req.path;
  if (path === "/" || path.startsWith("/admin") || path.startsWith("/api") || path.startsWith("/media/") || /\.(css|js|mjs|map|jpe?g|png|webp|avif|gif|svg|ico|woff2?|ttf|eot|xml|txt|json|webmanifest)$/i.test(path)) return next();
  const rows = await (await import("../db")).cached(c.env, "redirects", 600, () =>
    q<{ from_path: string; to_path: string; code: number }>(c.env.DB, "SELECT from_path, to_path, code FROM redirects WHERE is_active = 1")
  );
  const hit = rows.find((r) => r.from_path === path || (r.from_path.endsWith("*") && path.startsWith(r.from_path.slice(0, -1))));
  if (hit) {
    const to = hit.to_path.includes("*") ? path.replace(hit.from_path.slice(0, -1), hit.to_path.slice(0, -1)) : hit.to_path;
    return c.redirect(to, (hit.code as 301 | 302) || 301);
  }
  return next();
});

// ---------- Accueil (Page Builder) ----------
publicRoutes.get("/", async (c) => {
  const page = await q1<{ id: number; title: string; blocks: string; meta_title: string; meta_description: string; og_image: string }>(c.env.DB, "SELECT id, title, blocks, meta_title, meta_description, og_image FROM pages WHERE is_home = 1 AND status = ?", PUBLIE);
  if (!page) return c.notFound();
  const site = await loadSiteData(c);
  const blocks = parseJSON<Block[]>(page.blocks, []);
  const body = await renderBlocks(blocks, c.env);
  const seo = await getPageSEO(c, { title: page.meta_title || page.title, description: page.meta_description || undefined, ogImage: page.og_image || undefined, canonicalPath: "/" });
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: String(site.settings.site_name || "GREEN FAD"),
      url: String(site.settings.site_url || c.env.SITE_URL),
      description: page.meta_description || undefined,
      inLanguage: "fr",
    },
  ];
  return c.html(await layout(c, site, { ...seo, jsonLd }, body));
});

// ---------- Pages libres (Page Builder) ----------
publicRoutes.get("/p/:slug", async (c) => {
  const page = await q1<{ id: number; slug: string; title: string; blocks: string; meta_title: string; meta_description: string; og_image: string; robots_meta: string; seo_keywords: string }>(c.env.DB, "SELECT * FROM pages WHERE slug = ? AND status = ? AND is_home = 0", c.req.param("slug"), PUBLIE);
  if (!page) return c.notFound();
  const site = await loadSiteData(c);
  const blocks = parseJSON<Block[]>(page.blocks, []);
  const body = `${crumbsHTML([{ label: "Accueil", url: "/" }, { label: page.title }])}<div class="container"><p class="eyebrow eyebrow--plain" style="margin-top:2.5rem">${esc(page.title)}</p></div>` + (await renderBlocks(blocks, c.env));
  const seo = await getPageSEO(c, { title: page.meta_title || page.title, description: page.meta_description || undefined, ogImage: page.og_image || undefined, canonicalPath: `/p/${page.slug}` });
  return c.html(await layout(c, site, seo, body));
});

// Prévisualisation éditoriale (session auth requise, noindex)
publicRoutes.get("/__preview/:id", async (c) => {
  const user = c.get("user");
  if (!user) return c.notFound();
  const page = await q1<{ title: string; blocks: string }>(c.env.DB, "SELECT title, blocks FROM pages WHERE id = ?", c.req.param("id"));
  if (!page) return c.notFound();
  const site = await loadSiteData(c);
  const body = await renderBlocks(parseJSON<Block[]>(page.blocks, []), c.env);
  return c.html(await layout(c, site, { title: `[Aperçu] ${page.title}`, noindex: true }, body));
});

// ---------- Expertises / services ----------
publicRoutes.get("/expertises", async (c) => {
  const rows = await q(c.env.DB, "SELECT slug, name, summary, image_key, icon FROM services WHERE status = ? ORDER BY sort_order", PUBLIE);
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Expertises" }])}<p class="eyebrow">Expertises</p>
    <h1>L'ingénierie numérique de bout en bout</h1>
    <p class="page-hero__text">Conception, développement, déploiement et accompagnement : nos équipes couvrent l'ensemble de la chaîne de valeur technologique.</p></div></section>
  <section class="container"><div class="cards cards--3 reveal">${rows
    .map((s) => `<article class="card"><a class="card__media" href="/expertises/${esc(s.slug)}"><img src="${esc(mediaSrc(s.image_key as string))}" alt="${esc(String(s.name))}" loading="lazy"></a>
      <div class="card__body"><h3><a href="/expertises/${esc(s.slug)}">${esc(String(s.name))}</a></h3><p>${esc(String(s.summary || ""))}</p><span class="card__more">En savoir plus ${icon("arrow-right")}</span></div></article>`)
    .join("")}</div></section>
  <section class="cta-band"><div class="container cta-band__inner reveal"><h2>Un besoin précis ?</h2><p>Décrivez votre projet — nous vous répondons avec une proposition concrète.</p><a class="btn btn--invert" href="/devis">Demander un devis ${icon("arrow-right")}</a></div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Expertises & services technologiques", description: "Développement web, applications mobiles, SEO, communication et conseil : les expertises GREEN FAD.", canonicalPath: "/expertises" }), body));
});

publicRoutes.get("/expertises/:slug", async (c) => {
  const s = await q1<{ id: number; slug: string; name: string; summary: string; content_md: string; image_key: string; icon: string; meta_title: string; meta_description: string; og_image: string }>(c.env.DB, "SELECT * FROM services WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!s) return c.notFound();
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Expertises", url: "/expertises" }, { label: s.name }])}<p class="eyebrow">Expertise</p><h1>${esc(s.name)}</h1>${s.summary ? `<p class="page-hero__text">${esc(s.summary)}</p>` : ""}</div></section>
  <section class="container"><div class="split"><div class="split__body prose">${md(s.content_md)}</div>
    ${s.image_key ? `<div class="split__media"><img src="${esc(mediaSrc(s.image_key))}" alt="${esc(s.name)}"></div>` : ""}</div></section>
  <section class="container"><div class="form-card reveal"><h2>Discuter de cette expertise</h2><p class="muted">Nos ingénieurs vous répondent avec des références concrètes.</p>
    <form method="post" action="/contact" class="form-grid"><input type="text" name="website" class="hp" tabindex="-1" aria-hidden="true">
    <input type="hidden" name="subject" value="Expertise : ${esc(s.name)}">
    <label>Nom complet<input name="name" required maxlength="120"></label><label>Email<input type="email" name="email" required maxlength="160"></label>
    <label class="full">Votre message<textarea name="message" rows="4" required maxlength="4000"></textarea></label>
    <button class="btn btn--primary" type="submit">${icon("send", "i--inline")} Envoyer</button></form></div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: s.meta_title || s.name, description: s.meta_description || s.summary || undefined, ogImage: s.og_image || mediaSrc(s.image_key), canonicalPath: `/expertises/${s.slug}` }), body));
});

// ---------- Produits technologiques (portfolio professionnel) ----------
publicRoutes.get("/produits", async (c) => {
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, name, tagline, image_key, category, state FROM products WHERE status = ? ORDER BY sort_order", PUBLIE);
  const site = await loadSiteData(c);
  const stateLabels: Record<string, string> = { developpement: "En développement", beta: "Bêta", disponible: "Disponible", evolution: "En évolution", archive: "Archivé" };
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Produits" }])}<p class="eyebrow">Produits technologiques</p>
    <h1>Des produits numériques <em style="color:var(--teal-400);font-style:normal">conçus et portés</em> par Green FAD</h1>
    <p class="page-hero__text">Solutions propriétaires développées par nos équipes, pensées pour les marchés africains et ouverts à l'international.</p></div></section>
  <section class="container"><div class="cards cards--3 reveal">${rows
    .map((p) => `<article class="card">
      <a class="card__media" href="/produits/${esc(String(p.slug))}">${p.image_key ? `<img src="${esc(mediaSrc(String(p.image_key)))}" alt="${esc(String(p.name))}" loading="lazy">` : `<span class="card__icon card__icon--navy" style="margin:0;height:100%;width:100%;border-radius:0">${icon("package")}</span>`}</a>
      <div class="card__body">
        <div class="card__foot">${p.category ? `<span class="tag">${esc(String(p.category))}</span>` : ""}${statePill(String(p.state || "developpement"))}</div>
        <h3><a href="/produits/${esc(String(p.slug))}">${esc(String(p.name))}</a></h3>
        <p>${esc(String(p.tagline || ""))}</p>
        <span class="card__more">Voir la fiche produit ${icon("arrow-right")}</span></div></article>`)
    .join("")}</div></section>
  ${rows.length ? "" : `<section class="container center muted">Les fiches produits seront publiées prochainement.</section>`}`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Produits technologiques GREEN FAD", description: "FAD CARD, QRFAD, FereFad : découvrez les produits technologiques développés par Green FAD.", canonicalPath: "/produits" }), body));
});

publicRoutes.get("/produits/:slug", async (c) => {
  const p = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM products WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!p) return c.notFound();
  const site = await loadSiteData(c);
  const db = c.env.DB;

  // Médias liés (réutilisation sans duplication) + vidéos + FAQ + articles liés
  const [gallery, videos, productFaqs, relatedPosts] = await Promise.all([
    q(db, "SELECT mi.title, mi.caption, m.r2_key FROM content_relations cr JOIN media_items mi ON mi.id = cr.media_item_id AND mi.type='image' AND mi.status='publie' JOIN media m ON m.id = mi.media_id WHERE cr.content_type='product' AND cr.content_id = ? ORDER BY cr.sort_order", p.id),
    q(db, "SELECT mi.id, mi.title, mi.description, mi.source_url FROM content_relations cr JOIN media_items mi ON mi.id = cr.media_item_id AND mi.type='video' AND mi.status='publie' WHERE cr.content_type='product' AND cr.content_id = ? ORDER BY cr.sort_order", p.id),
    q(db, "SELECT question, answer FROM faqs WHERE status='publie' AND category = ? ORDER BY sort_order LIMIT 8", `produit:${p.slug}`),
    q(db, "SELECT slug, title, kind, published_at FROM posts WHERE status='publie' AND (related_product_id = ? OR category = ?) ORDER BY published_at DESC LIMIT 4", p.id, String(p.category || "")),
  ]);

  const links = parseJSON<{ label: string; url: string }[]>(p.links_json, []);
  const versions = parseJSON<{ version: string; date: string; note: string }[]>(p.versions_json, []);
  const blocks = p.blocks ? parseJSON<Block[]>(String(p.blocks), []) : [];

  const specCard = (title: string, iconName: string, content: unknown) =>
    content ? `<div class="spec-card"><h3>${icon(iconName)} ${esc(title)}</h3><div class="prose" style="font-size:.95rem">${md(content)}</div></div>` : "";

  const body = `<section class="page-hero" style="padding-bottom:0"><div class="page-hero__inner">
    ${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Produits", url: "/produits" }, { label: String(p.name) }])}
    <p class="eyebrow">Produit technologique</p>
    <h1>${esc(String(p.name))}</h1>
    ${p.tagline ? `<p class="page-hero__text">${esc(String(p.tagline))}</p>` : ""}
    <div class="pdp__meta" style="margin-top:1.4rem">${p.category ? `<span class="tag">${esc(String(p.category))}</span>` : ""}${statePill(String(p.state || "developpement"))}</div>
    ${links.length ? `<div class="pdp__links">${links.map((l) => `<a class="btn btn--ghost btn--sm" href="${esc(l.url)}" target="_blank" rel="noopener">${icon("external-link", "i--inline")} ${esc(l.label)}</a>`).join("")}</div>` : ""}
  </div></section>
  <section class="container flush" style="padding-top:0">
    <div class="pdp" style="padding-top:44px">
      <div class="pdp__info">
        <h2 style="margin-bottom:1rem">Présentation générale</h2>
        <div class="prose">${md(p.description_md)}</div>
        <div class="pdp__cta">
          <a class="btn btn--primary" href="#demo">${icon("rocket", "i--inline")} Demander une démonstration</a>
          <a class="btn btn--outline" href="/contact">${icon("mail", "i--inline")} Partenariat & contact</a>
        </div>
      </div>
      <div class="pdp__media">${p.image_key ? `<img src="${esc(mediaSrc(String(p.image_key)))}" alt="${esc(String(p.name))}">` : `<img src="/assets/images/hero-image-modern.jpg" alt="">`}</div>
    </div>
  </section>
  ${(p.problem_md || p.vision_md || p.origin_md) ? `<section class="container"><div class="spec-grid reveal">
    ${specCard("Le problème résolu", "target", p.problem_md)}
    ${specCard("Vision & objectif", "lightbulb", p.vision_md)}
    ${specCard("Origine du produit", "history", p.origin_md)}
  </div></section>` : ""}
  ${(p.features && (p.features as string).length > 2 && p.features !== "[]") ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Fonctionnalités</p><h2>Ce que le produit fait pour vous</h2></header>
    <div class="spec-grid reveal"><div class="spec-card"><h3>${icon("zap")} Fonctionnalités détaillées</h3><ul>${parseJSON<string[]>(p.features, []).map((f) => `<li>${icon("check")} <span>${esc(f)}</span></li>`).join("")}</ul></div>
    ${p.modules_md ? `<div class="spec-card"><h3>${icon("layers")} Modules & services intégrés</h3><div class="prose" style="font-size:.95rem">${md(p.modules_md)}</div></div>` : ""}</div></section>` : ""}
  ${(p.architecture_md || p.ux_md || p.audience || p.sector) ? `<section class="container"><div class="spec-grid reveal">
    ${specCard("Architecture & technologies", "server", p.architecture_md)}
    ${specCard("Expérience utilisateur", "smartphone", p.ux_md)}
    ${specCard("Publics cibles", "users", p.audience)}
    ${specCard("Secteur d'activité", "briefcase", p.sector)}
  </div></section>` : ""}
  ${gallery.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Galerie</p><h2>Le produit en images</h2></header>
    <div class="gallery gallery--3 reveal" data-lightbox>${gallery.map((g) => { const src = mediaSrc(String(g.r2_key)); return `<figure data-full="${esc(src)}"><img src="${esc(src)}" alt="${esc(String(g.title || ""))}" loading="lazy">${g.caption ? `<figcaption>${esc(String(g.caption))}</figcaption>` : ""}</figure>`; }).join("")}</div></section>` : ""}
  ${videos.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Démonstrations</p><h2>Vidéos du produit</h2></header>
    <div class="video-grid reveal">${videos.map((v) => { const pv = parseVideo(String(v.source_url || "")); return `<div class="video-card"><div class="video-embed"><iframe src="${esc(pv.embed)}" allowfullscreen loading="lazy" title="${esc(String(v.title))}"></iframe></div><div class="video-card__body"><h3>${esc(String(v.title))}</h3>${v.description ? `<p>${esc(String(v.description))}</p>` : ""}</div></div>`; }).join("")}</div></section>` : ""}
  ${blocks.length ? (await renderBlocks(blocks, c.env)) : ""}
  ${versions.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Historique</p><h2>Versions & évolutions publiables</h2></header>
    <div class="version-list reveal">${versions.map((v) => `<div class="version-item"><strong>${esc(v.version)}</strong><span><em>${esc(v.date || "")}</em>${esc(v.note || "")}</span></div>`).join("")}</div></section>` : ""}
  ${productFaqs.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">FAQ</p><h2>Questions fréquentes sur ${esc(String(p.name))}</h2></header>
    <div class="faq reveal" style="margin:0">${productFaqs.map((f) => `<details><summary>${esc(String(f.question))}</summary><div class="prose">${md(f.answer)}</div></details>`).join("")}</div></section>` : ""}
  ${relatedPosts.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Actualités liées</p><h2>À lire sur ce produit</h2></header>
    <div class="cards cards--${Math.min(relatedPosts.length, 3)} reveal">${relatedPosts.map((r) => `<article class="card"><div class="card__body"><span class="kind-badge">${icon((KIND_LABELS[String(r.kind)] || KIND_LABELS.article).icon)} ${(KIND_LABELS[String(r.kind)] || KIND_LABELS.article).label}</span><h3><a href="/innovation/${esc(String(r.slug))}">${esc(String(r.title))}</a></h3><span class="card__more">Lire ${icon("arrow-right")}</span></div></article>`).join("")}</div></section>` : ""}
  <section class="container" id="demo"><div class="form-card reveal">
    <h2>Demander une démonstration de ${esc(String(p.name))}</h2>
    <p class="muted">Présentation guidée par nos équipes, en présentiel à Bamako ou en visioconférence.</p>
    <form method="post" action="/contact" class="form-grid">
      <input type="text" name="website" class="hp" tabindex="-1" aria-hidden="true">
      <input type="hidden" name="subject" value="Démonstration produit : ${esc(String(p.name))}">
      <label>Nom complet<input name="name" required maxlength="120"></label>
      <label>Email professionnel<input type="email" name="email" required maxlength="160"></label>
      <label>Téléphone<input name="phone" maxlength="40"></label>
      <label>Société / Organisation<input name="company" maxlength="160"></label>
      <label class="full">Contexte d'utilisation<textarea name="message" rows="4" required maxlength="4000"></textarea></label>
      <button class="btn btn--primary btn--full" type="submit">${icon("send", "i--inline")} Envoyer la demande</button>
    </form></div></section>`;

  const jsonLd = [{
    "@context": "https://schema.org",
    "@type": "Product",
    name: String(p.name),
    description: String(p.tagline || excerptFromMd(p.description_md, 200)),
    brand: { "@type": "Brand", name: "GREEN FAD" },
    image: p.image_key ? String(site.settings.site_url || "") + mediaSrc(String(p.image_key)) : undefined,
    category: p.category ? String(p.category) : undefined,
  }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(p.meta_title || `${p.name} — Produit technologique`), description: String(p.meta_description || p.tagline || excerptFromMd(p.description_md, 160)), ogImage: String(p.og_image || mediaSrc(String(p.image_key))), canonicalPath: `/produits/${p.slug}`, jsonLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Produits", url: "/produits" }, { label: String(p.name) }] }), body));
});

// ---------- Réalisations / projets clients ----------
publicRoutes.get("/realisations", async (c) => {
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, summary, image_key, category, client_type FROM projects WHERE status = ? ORDER BY sort_order", PUBLIE);
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Réalisations" }])}<p class="eyebrow">Projets & réalisations</p>
    <h1>Des solutions livrées, des partenaires satisfaits</h1>
    <p class="page-hero__text">Études de cas de nos prestations et collaborations — distinctes de nos produits propriétaires. Seules des informations autorisées et vérifiables sont publiées.</p></div></section>
  <section class="container"><div class="cards cards--3 reveal">${rows
    .map((r) => `<article class="card"><a class="card__media" href="/realisations/${esc(String(r.slug))}">${r.image_key ? `<img src="${esc(mediaSrc(String(r.image_key)))}" alt="${esc(String(r.title))}" loading="lazy">` : ""}</a>
      <div class="card__body">${r.category ? `<span class="tag">${esc(String(r.category))}</span>` : ""}<h3><a href="/realisations/${esc(String(r.slug))}">${esc(String(r.title))}</a></h3><p>${esc(String(r.summary || ""))}</p><span class="card__more">Lire l'étude de cas ${icon("arrow-right")}</span></div></article>`)
    .join("")}</div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Réalisations & études de cas", description: "Projets technologiques livrés par Green FAD pour ses clients et partenaires.", canonicalPath: "/realisations" }), body));
});

publicRoutes.get("/realisations/:slug", async (c) => {
  const r = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM projects WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!r) return c.notFound();
  const site = await loadSiteData(c);
  const blocks = r.blocks ? parseJSON<Block[]>(String(r.blocks), []) : [];
  const gallery = await q(c.env.DB, "SELECT mi.title, mi.caption, m.r2_key FROM content_relations cr JOIN media_items mi ON mi.id = cr.media_item_id AND mi.type='image' AND mi.status='publie' JOIN media m ON m.id = mi.media_id WHERE cr.content_type='project' AND cr.content_id = ? ORDER BY cr.sort_order", r.id);
  const specCard = (title: string, iconName: string, content: unknown) =>
    content ? `<div class="spec-card"><h3>${icon(iconName)} ${esc(title)}</h3><div class="prose" style="font-size:.95rem">${md(content)}</div></div>` : "";
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Réalisations", url: "/realisations" }, { label: String(r.title) }])}
    <p class="eyebrow">Étude de cas</p><h1>${esc(String(r.title))}</h1>${r.summary ? `<p class="page-hero__text">${esc(String(r.summary))}</p>` : ""}</div></section>
  <section class="container"><div class="split">
    <div class="split__body prose">${md(r.content_md)}</div>
    ${r.image_key ? `<div class="split__media"><img src="${esc(mediaSrc(String(r.image_key)))}" alt="${esc(String(r.title))}"></div>` : ""}
  </div></section>
  ${(r.need_md || r.approach_md || r.solution_md || r.results_md) ? `<section class="container"><div class="spec-grid reveal">
    ${specCard("Contexte & besoin", "target", r.need_md)}
    ${specCard("Approche", "compass", r.approach_md)}
    ${specCard("Solution livrée", "package", r.solution_md)}
    ${specCard("Résultats", "trending-up", r.results_md)}
  </div></section>` : ""}
  ${r.tech_stack ? `<section class="container"><div class="spec-card reveal" style="max-width:860px"><h3>${icon("code")} Technologies utilisées</h3><div class="prose" style="font-size:.95rem">${md(r.tech_stack)}</div></div></section>` : ""}
  ${gallery.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Galerie</p><h2>Le projet en images</h2></header>
    <div class="gallery gallery--3 reveal" data-lightbox>${gallery.map((g) => { const src = mediaSrc(String(g.r2_key)); return `<figure data-full="${esc(src)}"><img src="${esc(src)}" alt="${esc(String(g.title || ""))}" loading="lazy">${g.caption ? `<figcaption>${esc(String(g.caption))}</figcaption>` : ""}</figure>`; }).join("")}</div></section>` : ""}
  ${blocks.length ? (await renderBlocks(blocks, c.env)) : ""}`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(r.meta_title || r.title), description: String(r.meta_description || r.summary || ""), ogImage: String(r.og_image || mediaSrc(String(r.image_key))), canonicalPath: `/realisations/${r.slug}`, crumbs: [{ label: "Accueil", url: "/" }, { label: "Réalisations", url: "/realisations" }, { label: String(r.title) }] }), body));
});

// ---------- Galerie multimédia ----------
publicRoutes.get("/galerie", async (c) => {
  const [albums, videos] = await Promise.all([
    q<Record<string, unknown>>(c.env.DB, "SELECT a.*, (SELECT COUNT(*) FROM media_items mi WHERE mi.album_id = a.id AND mi.status='publie') AS n FROM media_albums a WHERE a.status = ? ORDER BY a.sort_order", PUBLIE),
    q<Record<string, unknown>>(c.env.DB, "SELECT id, title, description, source_url FROM media_items WHERE type='video' AND status = ? ORDER BY sort_order LIMIT 12", PUBLIE),
  ]);
  const site = await loadSiteData(c);
  const catLabels: Record<string, string> = { general: "Galerie générale", produits: "Produits", projets: "Projets & réalisations", evenements: "Événements", institution: "Institutionnel & équipes", bureaux: "Bureaux & implantations", demonstrations: "Démonstrations" };
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Galerie" }])}<p class="eyebrow">Media Center</p>
    <h1>La galerie multimédia de Green FAD</h1>
    <p class="page-hero__text">Photographies et vidéos officielles : nos produits, nos équipes, nos événements et nos implantations.</p></div></section>
  ${albums.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Albums photo</p><h2>Explorez par thématique</h2></header>
    <div class="album-grid reveal">${albums.map((a) => `<a class="album" href="/galerie/album/${esc(String(a.slug))}">
      ${a.cover_key ? `<img src="${esc(mediaSrc(String(a.cover_key)))}" alt="${esc(String(a.name))}" loading="lazy">` : ""}
      <span class="album__overlay"><h3>${esc(String(a.name))}</h3><p>${icon("image")} ${Number(a.n)} visuel${Number(a.n) > 1 ? "s" : ""}${a.description ? ` · ${esc(String(a.description).slice(0, 60))}` : ""}</p></span></a>`).join("")}</div></section>` : ""}
  ${videos.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Vidéos</p><h2>Nos démonstrations & interventions</h2></header>
    <div class="video-grid reveal">${videos.map((v) => { const pv = parseVideo(String(v.source_url || "")); return `<a class="video-card" href="/galerie/video/${v.id}">
      <span class="video-card__thumb">${pv.thumb ? `<img src="${esc(pv.thumb)}" alt="" loading="lazy">` : ""}<span class="video-card__play"><span>${icon("play")}</span></span></span>
      <span class="video-card__body"><h3>${esc(String(v.title))}</h3>${v.description ? `<p>${esc(String(v.description).slice(0, 120))}</p>` : ""}</span></a>`; }).join("")}</div></section>` : ""}
  ${!albums.length && !videos.length ? `<section class="container center"><div class="form-card" style="max-width:560px">${icon("image-off")}<h2 style="margin-top:1rem">Galerie en préparation</h2><p class="muted">Aucun média publié pour le moment. Les premiers albums arrivent bientôt.</p></div></section>` : ""}`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Galerie multimédia", description: "Photos et vidéos officielles de Green FAD : produits, projets, événements et implantations.", canonicalPath: "/galerie" }), body));
});

publicRoutes.get("/galerie/album/:slug", async (c) => {
  const album = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM media_albums WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!album) return c.notFound();
  const items = await q(c.env.DB, "SELECT mi.title, mi.caption, mi.description, mi.credit, m.r2_key FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE mi.album_id = ? AND mi.type='image' AND mi.status = 'publie' ORDER BY mi.sort_order", album.id);
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Galerie", url: "/galerie" }, { label: String(album.name) }])}
    <p class="eyebrow">Album photo</p><h1>${esc(String(album.name))}</h1>${album.description ? `<p class="page-hero__text">${esc(String(album.description))}</p>` : ""}</div></section>
  ${items.length ? `<section class="container"><div class="gallery gallery--3 reveal" data-lightbox>${items.map((i) => { const src = mediaSrc(String(i.r2_key)); return `<figure data-full="${esc(src)}"><img src="${esc(src)}" alt="${esc(String(i.title || i.alt || ""))}" loading="lazy">${i.title ? `<figcaption>${esc(String(i.title))}${i.credit ? ` — crédit : ${esc(String(i.credit))}` : ""}</figcaption>` : ""}</figure>`; }).join("")}</div></section>`
    : `<section class="container center"><p class="muted">Cet album est en cours de préparation.</p></section>`}
  <section class="container center"><a class="btn btn--outline" href="/galerie">${icon("arrow-right", "i--inline")} Tous les albums</a></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(album.name), description: String(album.description || "Album photo Green FAD"), canonicalPath: `/galerie/album/${album.slug}`, crumbs: [{ label: "Accueil", url: "/" }, { label: "Galerie", url: "/galerie" }, { label: String(album.name) }] }), body));
});

publicRoutes.get("/galerie/video/:id", async (c) => {
  const v = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM media_items WHERE id = ? AND type='video' AND status = ?", c.req.param("id"), PUBLIE);
  if (!v) return c.notFound();
  const pv = parseVideo(String(v.source_url || ""));
  const others = await q(c.env.DB, "SELECT id, title, source_url FROM media_items WHERE type='video' AND status='publie' AND id != ? ORDER BY sort_order LIMIT 4", v.id);
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Galerie", url: "/galerie" }, { label: String(v.title) }])}<p class="eyebrow">Vidéo</p><h1>${esc(String(v.title))}</h1></div></section>
  <section class="container"><div class="video-wrap"><div class="video-embed"><iframe src="${esc(pv.embed)}" allowfullscreen title="${esc(String(v.title))}"></iframe></div>
  ${v.description ? `<div class="prose" style="margin-top:1.4rem">${esc(String(v.description))}</div>` : ""}
  ${v.credit ? `<p class="muted" style="margin-top:.6rem;font-size:.85rem">Source : ${esc(String(v.credit))}</p>` : ""}</div></section>
  ${others.length ? `<section class="container"><header class="sec-head"><h2>Autres vidéos</h2></header><div class="video-grid reveal">${others.map((o) => { const pvo = parseVideo(String(o.source_url || "")); return `<a class="video-card" href="/galerie/video/${o.id}"><span class="video-card__thumb">${pvo.thumb ? `<img src="${esc(pvo.thumb)}" alt="" loading="lazy">` : ""}<span class="video-card__play"><span>${icon("play")}</span></span></span><span class="video-card__body"><h3>${esc(String(o.title))}</h3></span></a>`; }).join("")}</div></section>` : ""}`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(v.title), description: String(v.description || "Vidéo Green FAD"), canonicalPath: `/galerie/video/${v.id}`, crumbs: [{ label: "Accueil", url: "/" }, { label: "Galerie", url: "/galerie" }, { label: String(v.title) }] }), body));
});

// ---------- Innovation & connaissance ----------
publicRoutes.get("/innovation", async (c) => {
  const kind = c.req.query("type") || "";
  const kinds = Object.keys(KIND_LABELS);
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, excerpt, cover_key, kind, published_at, author FROM posts WHERE status = ?2 AND (?1 = '' OR kind = ?1) ORDER BY published_at DESC LIMIT 30", kind, PUBLIE);
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Innovation" }])}<p class="eyebrow">Innovation & connaissance</p>
    <h1>Nous réfléchissons, expérimentons et documentons</h1>
    <p class="page-hero__text">Analyses, recherches, prototypes, veille technologique et retours d'expérience de nos équipes — au service de l'écosystème technologique africain.</p></div></section>
  <section class="container">
    <div class="filters reveal"><a href="/innovation" class="${kind === "" ? "active" : ""}">${icon("grid")} Tout</a>
    ${Object.entries(KIND_LABELS).map(([k, v]) => `<a href="/innovation?type=${k}" class="${kind === k ? "active" : ""}">${icon(v.icon)} ${v.label}</a>`).join("")}</div>
    <div class="post-list reveal">${rows
      .map((p) => `<article class="card">
        ${p.cover_key ? `<a class="card__media" href="/innovation/${esc(String(p.slug))}"><img src="${esc(mediaSrc(String(p.cover_key)))}" alt="" loading="lazy"></a>` : ""}
        <div class="card__body">${kindBadge(String(p.kind))}
        <h3><a href="/innovation/${esc(String(p.slug))}">${esc(String(p.title))}</a></h3>
        <p>${esc(String(p.excerpt || ""))}</p>
        <div class="post-meta"><span>${icon("calendar")} ${fmtDate(p.published_at, "short")}</span><span>${icon("user")} ${esc(String(p.author || "Green FAD"))}</span></div></div></article>`)
      .join("")}</div>
    ${!rows.length ? `<p class="center muted">Aucune publication dans cette catégorie pour le moment.</p>` : ""}
  </section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Innovation & connaissance", description: "Articles d'expertise, analyses technologiques, R&D et publications de Green FAD.", canonicalPath: "/innovation" }), body));
});

publicRoutes.get("/innovation/:slug", async (c) => {
  const p = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM posts WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!p) return c.notFound();
  const site = await loadSiteData(c);
  const others = await q(c.env.DB, "SELECT slug, title, kind FROM posts WHERE status='publie' AND id != ? ORDER BY published_at DESC LIMIT 3", p.id);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Innovation", url: "/innovation" }, { label: String(p.title) }])}
    <p class="eyebrow">Publication</p><h1>${esc(String(p.title))}</h1>
    <div class="post-meta" style="margin-top:1rem;color:rgba(255,255,255,.7)">${kindBadge(String(p.kind))}
    <span style="display:inline-flex;align-items:center;gap:5px">${icon("calendar")} ${fmtDate(p.published_at)}</span>
    <span style="display:inline-flex;align-items:center;gap:5px">${icon("user")} ${esc(String(p.author || "Green FAD"))}</span></div></div></section>
  ${p.cover_key ? `<div class="container"><div class="article__cover"><img src="${esc(mediaSrc(String(p.cover_key)))}" alt="${esc(String(p.title))}"></div></div>` : ""}
  <section class="container"><article class="article prose reveal">${md(p.content_md)}</article></section>
  ${others.length ? `<section class="container"><header class="sec-head"><h2>Poursuivre la lecture</h2></header>
    <div class="cards cards--${Math.min(others.length, 3)} reveal">${others.map((o) => `<article class="card"><div class="card__body">${kindBadge(String(o.kind))}<h3><a href="/innovation/${esc(String(o.slug))}">${esc(String(o.title))}</a></h3><span class="card__more">Lire ${icon("arrow-right")}</span></div></article>`).join("")}</div></section>` : ""}`;
  const jsonLd = [{
    "@context": "https://schema.org",
    "@type": "Article",
    headline: String(p.title),
    description: String(p.excerpt || excerptFromMd(p.content_md, 160)),
    datePublished: String(p.published_at || ""),
    author: { "@type": "Organization", name: String(p.author || "GREEN FAD") },
    publisher: { "@type": "Organization", name: "GREEN FAD" },
    image: p.cover_key ? String(site.settings.site_url || "") + mediaSrc(String(p.cover_key)) : undefined,
    inLanguage: "fr",
  }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(p.meta_title || p.title), description: String(p.meta_description || p.excerpt || ""), ogImage: String(p.og_image || mediaSrc(String(p.cover_key))), canonicalPath: `/innovation/${p.slug}`, jsonLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Innovation", url: "/innovation" }, { label: String(p.title) }] }), body));
});

// ---------- Implantation internationale ----------
publicRoutes.get("/implantation", async (c) => {
  const countries = await q(c.env.DB, "SELECT c.slug, c.name, c.iso2, c.is_registered, c.presentation_md, COUNT(o.id) AS offices FROM countries c LEFT JOIN offices o ON o.country_id = c.id AND o.status='publie' WHERE c.status='publie' GROUP BY c.id ORDER BY c.sort_order");
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Implantation" }])}<p class="eyebrow">Présence internationale</p>
    <h1>Enracinés en Afrique, tournés vers le monde</h1>
    <p class="page-hero__text">Green FAD opère depuis le Mali et accompagne des organisations dans plusieurs pays africains, avec une ambition internationale assumée.</p></div></section>
  <section class="container"><div class="countries reveal">${countries
    .map((co) => `<a class="country" href="/implantation/${esc(String(co.slug))}">
      <span class="country__code${Number(co.is_registered) ? "" : " country__code--teal"}">${esc(String(co.iso2 || "AF"))}</span>
      <h3>${esc(String(co.name))}</h3>
      <p>${co.offices ? `${co.offices} bureau${Number(co.offices) > 1 ? "x" : ""} · ` : ""}${esc(String(co.presentation_md || "").replace(/[#*>`]/g, "").slice(0, 110))}</p>
      <span class="country__arrow">${icon("arrow-right")}</span></a>`)
    .join("")}</div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Implantation & présence internationale", description: "Les pays d'intervention et bureaux de Green FAD en Afrique.", canonicalPath: "/implantation" }), body));
});

publicRoutes.get("/implantation/:slug", async (c) => {
  const co = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM countries WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!co) return c.notFound();
  const offices = await q(c.env.DB, "SELECT city, address, phone, email, hours, is_hq FROM offices WHERE country_id = ? AND status = 'publie'", co.id);
  const [projects, services] = await Promise.all([
    q(c.env.DB, "SELECT slug, title, summary FROM projects WHERE status='publie' AND country_id = ? LIMIT 3", co.id),
    q(c.env.DB, "SELECT slug, name FROM services WHERE status='publie' LIMIT 4", ),
  ]);
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Implantation", url: "/implantation" }, { label: String(co.name) }])}
    <p class="eyebrow">Présence : ${Number(co.is_registered) ? "immatriculation officielle" : "partenariat & interventions"}</p>
    <h1>${icon("map-pin", "i--inline")} ${esc(String(co.name))}</h1></div></section>
  <section class="container"><div class="split"><div class="split__body prose">${md(co.presentation_md)}</div></div></section>
  ${offices.length ? `<section class="container"><header class="sec-head sec-head--left"><p class="eyebrow">Bureaux</p><h2>Nos coordonnées locales</h2></header>
    <div class="cards cards--${Math.min(offices.length, 3)} reveal">${offices.map((o) => `<div class="office-card">
      <h3>${icon(o.is_hq ? "landmark" : "building")} ${esc(String(o.city))}${Number(o.is_hq) ? ' <span class="tag tag--gold">Siège social</span>' : ""}</h3>
      <dl>${o.address ? `<dt>Adresse</dt><dd>${esc(String(o.address))}</dd>` : ""}${o.phone ? `<dt>Téléphone</dt><dd><a href="tel:${esc(String(o.phone).replace(/\s/g, ""))}">${esc(String(o.phone))}</a></dd>` : ""}${o.email ? `<dt>Email</dt><dd><a href="mailto:${esc(String(o.email))}">${esc(String(o.email))}</a></dd>` : ""}${o.hours ? `<dt>Horaires</dt><dd>${esc(String(o.hours))}</dd>` : ""}</dl></div>`).join("")}</div></section>` : ""}
  ${projects.length ? `<section class="container"><header class="sec-head sec-head--left"><p class="eyebrow">Réalisations</p><h2>Projets menés en ${esc(String(co.name))}</h2></header>
    <div class="cards cards--${Math.min(projects.length, 3)} reveal">${projects.map((pr) => `<article class="card"><div class="card__body"><h3><a href="/realisations/${esc(String(pr.slug))}">${esc(String(pr.title))}</a></h3><p>${esc(String(pr.summary || ""))}</p></div></article>`).join("")}</div></section>` : ""}
  <section class="cta-band"><div class="container cta-band__inner reveal"><h2>Travailler avec nous en ${esc(String(co.name))}</h2><p>Contactez notre équipe pour discuter de votre projet.</p><a class="btn btn--invert" href="/contact">Nous contacter ${icon("arrow-right")}</a></div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: `Green FAD au ${co.name === "RDC Congo" ? "Congo" : String(co.name)}`, description: `Présence, bureaux et projets de Green FAD en ${co.name}.`, canonicalPath: `/implantation/${co.slug}`, crumbs: [{ label: "Accueil", url: "/" }, { label: "Implantation", url: "/implantation" }, { label: String(co.name) }] }), body));
});

// ---------- Ressources ----------
publicRoutes.get("/ressources", async (c) => {
  const docs = await q(c.env.DB, "SELECT id, title, description, category, file_key, mime, size FROM documents WHERE status = 'publie' AND is_public = 1 ORDER BY id DESC LIMIT 40");
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Ressources" }])}<p class="eyebrow">Ressources</p>
    <h1>Documents et supports publics</h1><p class="page-hero__text">Documentation institutionnelle et technique mise à disposition par Green FAD.</p></div></section>
  ${docs.length ? `<section class="container"><div class="doc-list reveal">${docs
    .map((d) => { const isPdf = /pdf$/.test(String(d.mime || "")); return `<a class="doc" href="/media/${esc(String(d.file_key))}"${isPdf ? ' target="_blank" rel="noopener"' : ""}><span class="doc__icon">${icon(isPdf ? "file-text" : "folder")}</span><span><strong>${esc(String(d.title))}</strong>${d.description ? `<em>${esc(String(d.description))}</em>` : ""}</span><span class="doc__arrow">${icon("download")}</span></a>`; })
    .join("")}</div></section>` : `<section class="container center"><p class="muted">Les premiers documents seront publiés prochainement.</p></section>`}`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Ressources & documentation", description: "Documents publics et supports de Green FAD.", canonicalPath: "/ressources" }), body));
});

// ---------- Presse ----------
publicRoutes.get("/presse/:slug", async (c) => {
  const pr = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM press_releases WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!pr) return c.notFound();
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Presse" }, { label: String(pr.title) }])}<p class="eyebrow">Communiqué</p><h1>${esc(String(pr.title))}</h1></div></section>
  <section class="container"><article class="article prose reveal">${md(pr.content_md)}
  ${pr.file_key ? `<p><a class="btn btn--outline" href="/media/${esc(String(pr.file_key))}" target="_blank" rel="noopener">${icon("download", "i--inline")} Télécharger le communiqué (PDF)</a></p>` : ""}</article></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(pr.title), description: String(pr.summary || ""), canonicalPath: `/presse/${pr.slug}`, crumbs: [{ label: "Accueil", url: "/" }, { label: "Presse" }, { label: String(pr.title) }] }), body));
});

// ---------- Carrières ----------
publicRoutes.get("/carrieres", async (c) => {
  const jobs = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, department, location, contract_type, deadline FROM jobs WHERE status = ? AND is_open = 1 ORDER BY id DESC", PUBLIE);
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Carrières" }])}<p class="eyebrow">Carrières</p>
    <h1>Construisez le futur technologique avec nous</h1><p class="page-hero__text">Rejoignez une équipe qui conçoit des produits numériques africains à ambition internationale.</p></div></section>
  ${jobs.length ? `<section class="container"><div class="cards cards--2 reveal">${jobs
    .map((j) => `<article class="card"><div class="card__body">
      <div class="card__foot">${j.department ? `<span class="tag">${esc(String(j.department))}</span>` : ""}${j.contract_type ? `<span class="tag tag--navy">${esc(String(j.contract_type))}</span>` : ""}</div>
      <h3><a href="/carrieres/${esc(String(j.slug))}">${esc(String(j.title))}</a></h3>
      <div class="post-meta">${j.location ? `<span>${icon("map-pin")} ${esc(String(j.location))}</span>` : ""}${j.deadline ? `<span>${icon("clock")} Jusqu'au ${fmtDate(j.deadline, "short")}</span>` : ""}</div>
      <span class="card__more">Voir l'offre ${icon("arrow-right")}</span></div></article>`).join("")}</div></section>`
    : `<section class="container center"><div class="form-card" style="max-width:600px"><h2>Aucun poste ouvert actuellement</h2><p class="muted">Les prochaines opportunités seront publiées ici. Vous pouvez aussi nous envoyer une candidature spontanée via le formulaire de contact.</p><a class="btn btn--primary" href="/contact">Candidature spontanée ${icon("arrow-right")}</a></div></section>`}`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Carrières chez Green FAD", description: "Offres d'emploi et opportunités technologiques chez Green FAD.", canonicalPath: "/carrieres" }), body));
});

publicRoutes.get("/carrieres/:slug", async (c) => {
  const j = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM jobs WHERE slug = ? AND status = ? AND is_open = 1", c.req.param("slug"), PUBLIE);
  if (!j) return c.notFound();
  const site = await loadSiteData(c);
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Carrières", url: "/carrieres" }, { label: String(j.title) }])}
    <p class="eyebrow">Offre d'emploi</p><h1>${esc(String(j.title))}</h1>
    <div class="post-meta" style="margin-top:1rem;color:rgba(255,255,255,.7)">${j.department ? `<span style="display:inline-flex;align-items:center;gap:5px">${icon("layers")} ${esc(String(j.department))}</span>` : ""}${j.location ? `<span style="display:inline-flex;align-items:center;gap:5px">${icon("map-pin")} ${esc(String(j.location))}</span>` : ""}${j.contract_type ? `<span style="display:inline-flex;align-items:center;gap:5px">${icon("briefcase")} ${esc(String(j.contract_type))}</span>` : ""}</div></div></section>
  <section class="container"><div class="article prose reveal"><h2>Description du poste</h2>${md(j.description_md)}
    <h2>Profil recherché</h2>${md(j.requirements_md)}
    ${j.deadline ? `<p class="muted">${icon("clock", "i--inline")} Candidatures acceptées jusqu'au <strong>${fmtDate(j.deadline)}</strong>.</p>` : ""}</div></section>
  <section class="container" id="apply"><div class="form-card reveal"><h2>Postuler</h2>
    <form method="post" action="/carrieres/${esc(String(j.slug))}/apply" class="form-grid" enctype="multipart/form-data">
      <input type="text" name="website" class="hp" tabindex="-1" aria-hidden="true">
      <label>Nom complet<input name="name" required maxlength="120"></label>
      <label>Email<input type="email" name="email" required maxlength="160"></label>
      <label>Téléphone<input name="phone" maxlength="40"></label>
      <label>CV (PDF, max 5 Mo)<input type="file" name="cv" accept="application/pdf"></label>
      <label class="full">Lettre de motivation / note<textarea name="cover_note" rows="4" maxlength="3000"></textarea></label>
      <button class="btn btn--primary btn--full" type="submit">${icon("send", "i--inline")} Envoyer ma candidature</button>
    </form>
    ${c.req.query("sent") === "1" ? `<div class="form-ok">${icon("check-circle")}<span>Candidature bien reçue. Notre équipe RH vous recontactera si votre profil correspond.</span></div>` : ""}
  </div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(j.title), description: excerptFromMd(j.description_md, 150), canonicalPath: `/carrieres/${j.slug}`, crumbs: [{ label: "Accueil", url: "/" }, { label: "Carrières", url: "/carrieres" }, { label: String(j.title) }] }), body));
});

// ---------- FAQ ----------
publicRoutes.get("/faq", async (c) => {
  const cats = await q(c.env.DB, "SELECT DISTINCT category FROM faqs WHERE status = 'publie' AND category IS NOT NULL");
  const rows = await q(c.env.DB, "SELECT question, answer, category FROM faqs WHERE status = 'publie' ORDER BY category, sort_order");
  const site = await loadSiteData(c);
  const grouped = new Map<string, { question: string; answer: string }[]>();
  for (const r of rows) {
    const key = String(r.category || "Général");
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push({ question: String(r.question), answer: String(r.answer) });
  }
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "FAQ" }])}<p class="eyebrow">Questions fréquentes</p>
    <h1>Vos questions, nos réponses</h1></div></section>
  <section class="container">${[...grouped.entries()].map(([cat, items]) => `
    <header class="sec-head sec-head--left reveal"><p class="eyebrow">${esc(cat)}</p></header>
    <div class="faq reveal" style="margin-bottom:2rem">${items.map((f) => `<details><summary>${esc(f.question)}</summary><div class="prose">${md(f.answer)}</div></details>`).join("")}</div>`).join("")}
    ${!rows.length ? `<p class="center muted">Aucune question publiée pour le moment.</p>` : ""}</section>`;
  const jsonLd = [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: rows.map((r) => ({ "@type": "Question", name: String(r.question), acceptedAnswer: { "@type": "Answer", text: String(r.answer).replace(/[#*>`]/g, "") } })) }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: "FAQ", description: "Questions fréquentes sur Green FAD et ses services.", canonicalPath: "/faq", jsonLd }), body));
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
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Contact" }])}<p class="eyebrow">Contact</p>
    <h1>Parlons de votre projet</h1><p class="page-hero__text">Démonstrations, devis, partenariats ou presse : nos équipes vous répondent dans les meilleurs délais.</p></div></section>
  ${sent ? `<section class="container"><div class="form-card" id="merci"><div class="form-ok">${icon("check-circle")}<span><strong>Message bien reçu.</strong> Notre équipe revient vers vous très vite.</span></div><a class="btn btn--outline" href="/">Retour à l'accueil</a></div></section>` : ""}
  <section class="container"><div class="split">
    <div class="form-card"><h2>Nous écrire</h2>
      <form method="post" action="/contact" class="form-grid">
        <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label>Nom complet<input name="name" required maxlength="120"></label>
        <label>Email<input type="email" name="email" required maxlength="160"></label>
        <label>Téléphone<input name="phone" maxlength="40"></label>
        <label>Objet<input name="subject" maxlength="150"></label>
        <label class="full">Votre message<textarea name="message" rows="5" required maxlength="4000"></textarea></label>
        <button class="btn btn--primary btn--full" type="submit">${icon("send", "i--inline")} Envoyer</button>
      </form></div>
    <div>
      <div class="office-card" style="margin-bottom:20px"><h3>${icon("map-pin")} Coordonnées</h3><dl>
        ${s.contact_address ? `<dt>Adresse</dt><dd>${esc(String(s.contact_address))}</dd>` : ""}
        ${s.contact_phone ? `<dt>Téléphone</dt><dd><a href="tel:${esc(String(s.contact_phone).replace(/\s/g, ""))}">${esc(String(s.contact_phone))}</a></dd>` : ""}
        ${s.contact_email ? `<dt>Email</dt><dd><a href="mailto:${esc(String(s.contact_email))}">${esc(String(s.contact_email))}</a></dd>` : ""}
        ${s.contact_hours ? `<dt>Horaires</dt><dd>${esc(String(s.contact_hours))}</dd>` : ""}
      </dl></div>
      <div class="form-card"><h2>Devis & partenariats</h2>
      <form method="post" action="/devis" class="form-grid">
        <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label>Nom<input name="name" required maxlength="120"></label>
        <label>Email<input type="email" name="email" required maxlength="160"></label>
        <label>Société<input name="company" maxlength="160"></label>
        <label class="full">Votre besoin<textarea name="message" rows="3" required maxlength="4000"></textarea></label>
        <button class="btn btn--navy btn--full" type="submit">${icon("wallet", "i--inline")} Demander un devis</button>
      </form></div>
    </div>
  </div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Contact", description: "Contactez Green FAD — Bamako, Mali. Démonstrations, devis, partenariats.", canonicalPath: "/contact", crumbs: [{ label: "Accueil", url: "/" }, { label: "Contact" }] }), body));
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
  const [pages, posts, products, services, projects, countries, albums] = await Promise.all([
    q(c.env.DB, "SELECT slug, updated_at FROM pages WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM posts WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM products WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM services WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM projects WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM countries WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM media_albums WHERE status = ?", PUBLIE),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const urls: { loc: string; date: string; priority: string }[] = [
    { loc: "/", date: today, priority: "1.0" },
    ...pages.filter((p) => p.slug !== "__home__").map((p) => ({ loc: `/p/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.8" })),
    { loc: "/expertises", date: today, priority: "0.9" },
    ...services.map((s) => ({ loc: `/expertises/${s.slug}`, date: String(s.updated_at).slice(0, 10), priority: "0.7" })),
    { loc: "/produits", date: today, priority: "0.9" },
    ...products.map((p) => ({ loc: `/produits/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.9" })),
    { loc: "/realisations", date: today, priority: "0.8" },
    ...projects.map((p) => ({ loc: `/realisations/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.6" })),
    { loc: "/galerie", date: today, priority: "0.7" },
    ...albums.map((a) => ({ loc: `/galerie/album/${a.slug}`, date: String(a.updated_at).slice(0, 10), priority: "0.5" })),
    { loc: "/innovation", date: today, priority: "0.8" },
    ...posts.map((p) => ({ loc: `/innovation/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.6" })),
    { loc: "/implantation", date: today, priority: "0.7" },
    ...countries.map((p) => ({ loc: `/implantation/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.6" })),
    { loc: "/contact", date: today, priority: "0.6" },
    { loc: "/ressources", date: today, priority: "0.5" },
    { loc: "/carrieres", date: today, priority: "0.5" },
    { loc: "/faq", date: today, priority: "0.4" },
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${base}${u.loc}</loc><lastmod>${u.date}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>`;
  return c.body(xml, 200, { "content-type": "application/xml; charset=utf-8" });
});

publicRoutes.get("/robots.txt", async (c) => {
  const base = String((await getSetting(c.env.DB, "site_url", c.env.SITE_URL)) as string);
  return c.body(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nDisallow: /__preview\n\nSitemap: ${base}/sitemap.xml\n`, 200, { "content-type": "text/plain; charset=utf-8" });
});

publicRoutes.get("/rss.xml", async (c) => {
  const base = String((await getSetting(c.env.DB, "site_url", c.env.SITE_URL)) as string);
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, excerpt, published_at FROM posts WHERE status = ? ORDER BY published_at DESC LIMIT 20", PUBLIE);
  const items = rows
    .map((p) => `<item><title>${esc(p.title)}</title><link>${base}/innovation/${p.slug}</link><description>${esc(p.excerpt || "")}</description><pubDate>${new Date(String(p.published_at)).toUTCString()}</pubDate><guid>${base}/innovation/${p.slug}</guid></item>`)
    .join("\n");
  return c.body(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>GREEN FAD — Innovation & actualités</title><link>${base}</link><description>Technologie, innovation et connaissance — Green FAD</description>${items}</channel></rss>`, 200, { "content-type": "application/rss+xml; charset=utf-8" });
});
