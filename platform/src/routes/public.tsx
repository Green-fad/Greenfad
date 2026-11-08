// GREEN FAD — Site public SSR v2 : toutes les routes proviennent de la base de données.
// Identité technologique, portfolio produits, galerie multimédia, espace innovation.
// Aucun emoji : icônes SVG uniquement (icons.ts). Données 100 % réelles publiées.
import { Hono, Context } from "hono";
import { Env } from "../types";
import { q, q1, count, getSetting } from "../db";
import { layout, loadSiteData, PageSEO, crumbsHTML, Crumb } from "../render/layout";
import { renderBlocks, renderBlock, Block, parseVideo } from "../blocks";
import { md, esc, fmtDate, excerptFromMd, stripFirstH1, parseJSON } from "../utils";
import { icon } from "../icons";
import { audit } from "../audit";

const PUBLIE = "publie";

// ---------- Contenu éditable depuis l'admin (settings → « content_overrides » JSON) ----------
// Rien d'essentiel n'est figé dans le code : les textes de héros et le parcours des
// réalisations peuvent être remplacés depuis Admin → Paramètres, sans toucher au code.
type HeroOverride = { title?: string; text?: string };
type TimelineEntry = { year: string; title: string; text: string };
type ContentOverrides = { heroes?: Record<string, HeroOverride>; timeline?: TimelineEntry[] };

const DEFAULT_TIMELINE: TimelineEntry[] = [
  { year: "2021", title: "Les fondations", text: "Lancement de QRFAD (mars) et FAD CARD (mai) à Bamako : le menu par QR code et la carte de visite numérique NFC." },
  { year: "2022", title: "Des produits qui s'élargissent", text: "QRFAD passe au multi-établissements ; FadCard ouvre Market, sa vitrine marchande." },
  { year: "2023", title: "Transactions & commandes", text: "Commandes depuis le menu puis WhatsApp sur QRFAD ; Tickets puis Fund sur FadCard." },
  { year: "2024", title: "Plateformes complètes", text: "Hôtellerie et caisse POS côté QRFAD ; Vote et FadCard Pay clôturent la suite FadCard. PayGfad, la suite de gestion SaaS, est mise en ligne." },
  { year: "2025", title: "Maturité", text: "153 designs et cartes NFC pour FadCard ; caisse consolidée et thèmes pour QRFAD." },
  { year: "2026", title: "Tile, CloudAf & PayGfad", text: "Le réseau social du progrès, la plateforme no-code + IA et la suite de gestion SaaS rejoignent l'écosystème — cinq plateformes en ligne." },
];

function overridesOf(site: { settings: Record<string, unknown> }): ContentOverrides {
  return parseJSON<ContentOverrides>(String(site.settings.content_overrides || ""), {});
}

function heroOf(site: { settings: Record<string, unknown> }, path: string, defTitle: string, defText: string): { title: string; text: string; raw: boolean } {
  const h = overridesOf(site).heroes?.[path];
  if (h && (h.title || h.text)) return { title: h.title || defTitle, text: h.text || defText, raw: false };
  return { title: defTitle, text: defText, raw: true };
}

function timelineOf(site: { settings: Record<string, unknown> }): TimelineEntry[] {
  const t = overridesOf(site).timeline;
  return Array.isArray(t) && t.length ? t : DEFAULT_TIMELINE;
}

// ---------- Helpers ----------
async function getPageSEO(c: Context<{ Bindings: Env }>, seo: PageSEO): Promise<PageSEO> {
  const siteName = (await getSetting(c.env.DB, "site_name", "GREEN FAD")) as string;
  const defaults = (await getSetting(c.env.DB, "seo_defaults", {})) as { default_description?: string };
  return {
    ...seo,
    title: /green\s*fad/i.test(seo.title) ? seo.title : `${seo.title} | ${String(siteName)}`,
    description: seo.description || defaults.default_description || undefined,
  };
}

function mediaSrc(key: string | null | undefined): string {
  if (!key) return "";
  return key.startsWith("/") ? key : `/media/${key}`;
}

function cardHTML(item: { url: string; title: string; text?: string; image?: string; tag?: string; icon?: string; iconBadge?: boolean }): string {
  const media = item.image
    ? `<a class="card__media" href="${esc(item.url)}"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy"></a>`
    : `<a class="card__media card__media--empty" href="${esc(item.url)}" aria-hidden="true" tabindex="-1">${icon(item.icon && !/^[A-Z]{2}$/.test(item.icon) ? item.icon : "layers")}</a>`;
  return `<article class="card reveal">
    ${media}
    <div class="card__body">
      ${item.tag ? `<span class="tag">${esc(item.tag)}</span>` : ""}
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
  const rows = await (await import("../db")).cached(c.env, "redirects", 3600, () =>
    q<{ from_path: string; to_path: string; code: number }>(c.env.DB, "SELECT from_path, to_path, code FROM redirects WHERE is_active = 1")
  );
  const hit = rows.find((r) => r.from_path === path || (r.from_path.endsWith("*") && path.startsWith(r.from_path.slice(0, -1))));
  if (hit) {
    // Les anciennes URL se terminaient souvent par .html — on le retire pour la nouvelle cible
    if (hit.to_path.includes("*")) {
      const prefix = hit.from_path.slice(0, -1);
      const suffix = path.slice(prefix.length).replace(/\.html?$/i, "");
      return c.redirect(hit.to_path.slice(0, -1) + suffix, (hit.code as 301 | 302) || 301);
    }
    return c.redirect(hit.to_path, (hit.code as 301 | 302) || 301);
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
  const hero = heroOf(site, "/expertises", "L'ingénierie numérique de bout en bout", "Conception, développement, déploiement et accompagnement : nos équipes couvrent l'ensemble de la chaîne de valeur technologique.");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Expertises" }])}<p class="eyebrow">Expertises</p>
    <h1>${esc(hero.title)}</h1>
    <p class="page-hero__text">${esc(hero.text)}</p></div></section>
  <section class="container"><div class="cards cards--3 reveal">${rows
    .map((s) => `<article class="card"><a class="card__media" href="/expertises/${esc(s.slug)}"><img src="${esc(mediaSrc(s.image_key as string))}" alt="${esc(String(s.name))}" loading="lazy"></a>
      <div class="card__body"><h3><a href="/expertises/${esc(s.slug)}">${esc(String(s.name))}</a></h3><p>${esc(String(s.summary || ""))}</p><span class="card__more">En savoir plus ${icon("arrow-right")}</span></div></article>`)
    .join("")}</div></section>
  <section class="cta-band"><div class="container cta-band__inner reveal"><h2>Un besoin précis ?</h2><p>Décrivez votre projet — nous vous répondons avec une proposition concrète.</p><a class="btn btn--invert" href="/devis">Demander un devis ${icon("arrow-right")}</a></div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Expertises & services technologiques", description: "Développement web, applications mobiles, SEO, communication et conseil : les expertises GREEN FAD.", canonicalPath: "/expertises" }), body));
});

publicRoutes.get("/expertises/:slug", async (c) => {
  const s = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM services WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!s) return c.notFound();
  const site = await loadSiteData(c);
  const db = c.env.DB;

  // Contenus liés : projets menés, produits mobilisés, galeries, FAQ métier
  const [serviceFaqs, relatedProjects, relatedProducts, gallery, videos] = await Promise.all([
    q(db, "SELECT question, answer FROM faqs WHERE status='publie' AND category = ? ORDER BY sort_order LIMIT 8", `service:${s.slug}`),
    q(db, "SELECT slug, title, summary, image_key, category FROM projects WHERE status='publie' AND related_service_id = ? LIMIT 3", s.id),
    q(db, "SELECT slug, name, tagline, image_key, state FROM products WHERE status='publie' AND related_service_id = ? LIMIT 3", s.id),
    q(db, "SELECT mi.title, mi.caption, m.r2_key FROM content_relations cr JOIN media_items mi ON mi.id = cr.media_item_id AND mi.type='image' AND mi.status='publie' JOIN media m ON m.id = mi.media_id WHERE cr.content_type='service' AND cr.content_id = ? ORDER BY cr.sort_order LIMIT 6", s.id),
    q(db, "SELECT mi.id, mi.title, mi.description, mi.source_url FROM content_relations cr JOIN media_items mi ON mi.id = cr.media_item_id AND mi.type='video' AND mi.status='publie' WHERE cr.content_type='service' AND cr.content_id = ? ORDER BY cr.sort_order LIMIT 3", s.id),
  ]);
  // Règle éditoriale : sans relation explicite, aucun projet n'est affiché au hasard.

  const includes = parseJSON<string[]>(s.includes_json, []);
  const techs = parseJSON<string[]>(s.tech_json, []);
  const industries = parseJSON<string[]>(s.industries_json, []);

  const specCard = (title: string, iconName: string, content: unknown) =>
    content ? `<div class="spec-card"><h3>${icon(iconName)} ${esc(title)}</h3><div class="prose" style="font-size:.95rem">${md(content)}</div></div>` : "";

  const body = `<section class="page-hero service-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Expertises", url: "/expertises" }, { label: String(s.name) }])}
    ${s.icon ? `<span class="service-hero__icon">${icon(String(s.icon))}</span>` : ""}
    <p class="eyebrow">Expertise & service</p>
    <h1>${esc(String(s.name))}</h1>
    ${s.summary ? `<p class="page-hero__text">${esc(String(s.summary))}</p>` : ""}
    <div class="pdp__cta" style="margin-top:1.6rem;justify-content:flex-start">
      <a class="btn btn--invert" href="#devis">${icon("send", "i--inline")} Demander un devis</a>
      <a class="btn btn--ghost" href="/realisations">${icon("award", "i--inline")} Voir nos réalisations</a>
    </div></div></section>
  <section class="container flush" style="padding-top:0"><div class="pdp" style="padding-top:44px">
    <div class="pdp__info"><h2 style="margin-bottom:1rem">Présentation du service</h2><div class="prose">${md(stripFirstH1(s.content_md))}</div></div>
    ${s.image_key ? `<div class="pdp__media"><img src="${esc(mediaSrc(String(s.image_key)))}" alt="${esc(String(s.name))}"></div>` : ""}
  </div></section>
  ${includes.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Prestation</p><h2>Ce que ce service inclut</h2></header>
    <div class="includes-grid reveal">${includes.map((i) => `<div class="includes-item">${icon("check-circle")} <span>${esc(i)}</span></div>`).join("")}</div></section>` : ""}
  ${(s.methodology_md || s.process_md) ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Méthodologie</p><h2>Comment nous procédons</h2></header>
    <div class="spec-grid reveal">
    ${specCard("Notre méthodologie", "workflow", s.methodology_md)}
    ${specCard("Déroulement d'un projet type", "route", s.process_md)}
  </div></section>` : ""}
  ${techs.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Savoir-faire</p><h2>Technologies & outils maîtrisés</h2></header>
    <div class="chips chips--lg reveal">${techs.map((t) => `<span class="chip chip--tech">${icon("cpu", "i--inline")} ${esc(t)}</span>`).join("")}</div></section>` : ""}
  ${(s.benefits_md || s.deliverables_md) ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Résultats</p><h2>Bénéfices & livrables</h2></header>
    <div class="spec-grid reveal">
    ${specCard("Bénéfices pour votre organisation", "trending-up", s.benefits_md)}
    ${specCard("Livrables types", "clipboard", s.deliverables_md)}
  </div></section>` : ""}
  ${industries.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Secteurs</p><h2>Industries & organisations adressés</h2></header>
    <div class="industries-grid reveal">${industries.map((i) => `<div class="industry-card">${icon("building")} <span>${esc(i)}</span></div>`).join("")}</div></section>` : ""}
  ${gallery.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Galerie</p><h2>Ce service en images</h2></header>
    <div class="gallery gallery--3 reveal" data-lightbox>${gallery.map((g) => { const src = mediaSrc(String(g.r2_key)); return `<figure data-full="${esc(src)}"><img src="${esc(src)}" alt="${esc(String(g.title || ""))}" loading="lazy">${g.caption ? `<figcaption>${esc(String(g.caption))}</figcaption>` : ""}</figure>`; }).join("")}</div></section>` : ""}
  ${videos.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Démonstrations</p><h2>Vidéos</h2></header>
    <div class="video-grid reveal">${videos.map((v) => { const pv = parseVideo(String(v.source_url || "")); return `<div class="video-card"><div class="video-embed"><iframe src="${esc(pv.embed)}" allowfullscreen loading="lazy" title="${esc(String(v.title))}"></iframe></div><div class="video-card__body"><h3>${esc(String(v.title))}</h3>${v.description ? `<p>${esc(String(v.description))}</p>` : ""}</div></div>`; }).join("")}</div></section>` : ""}
  ${relatedProjects.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Références</p><h2>Réalisations liées à cette expertise</h2></header>
    <div class="cards cards--${Math.min(relatedProjects.length, 3)} reveal">${relatedProjects.map((r) => `<article class="card">${r.image_key ? `<a class="card__media" href="/realisations/${esc(String(r.slug))}"><img src="${esc(mediaSrc(String(r.image_key)))}" alt="${esc(String(r.title))}" loading="lazy"></a>` : ""}<div class="card__body">${r.category ? `<span class="tag">${esc(String(r.category))}</span>` : ""}<h3><a href="/realisations/${esc(String(r.slug))}">${esc(String(r.title))}</a></h3><p>${esc(String(r.summary || ""))}</p><span class="card__more">Lire l'étude de cas ${icon("arrow-right")}</span></div></article>`).join("")}</div></section>` : ""}
  ${relatedProducts.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Produits mobilisés</p><h2>Nos produits au service de cette expertise</h2></header>
    <div class="cards cards--${Math.min(relatedProducts.length, 3)} reveal">${relatedProducts.map((pr) => `<article class="card">${pr.image_key ? `<a class="card__media" href="/produits/${esc(String(pr.slug))}"><img src="${esc(mediaSrc(String(pr.image_key)))}" alt="${esc(String(pr.name))}" loading="lazy"></a>` : `<a class="card__media card__media--empty" href="/produits/${esc(String(pr.slug))}" aria-hidden="true" tabindex="-1">${icon("package")}</a>`}<div class="card__body"><h3><a href="/produits/${esc(String(pr.slug))}">${esc(String(pr.name))}</a></h3><p>${esc(String(pr.tagline || ""))}</p><span class="card__more">Voir la fiche produit ${icon("arrow-right")}</span></div></article>`).join("")}</div></section>` : ""}
  ${serviceFaqs.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">FAQ</p><h2>Questions fréquentes</h2></header>
    <div class="faq reveal" style="margin:0">${serviceFaqs.map((f) => `<details><summary>${esc(String(f.question))}</summary><div class="prose">${md(f.answer)}</div></details>`).join("")}</div></section>` : ""}
  <section class="container" id="devis"><div class="form-card reveal">
    <h2>Demander un devis — ${esc(String(s.name))}</h2>
    <p class="muted">Décrivez votre besoin : nos ingénieurs reviennent vers vous avec une proposition concrète, chiffrée et adaptée à votre contexte.</p>
    <form method="post" action="/devis" class="form-grid">
      <input type="text" name="website" class="hp" tabindex="-1" aria-hidden="true">
      <input type="hidden" name="subject" value="Devis — ${esc(String(s.name))}">
      <label>Nom complet<input name="name" required maxlength="120"></label>
      <label>Email professionnel<input type="email" name="email" required maxlength="160"></label>
      <label>Téléphone<input name="phone" maxlength="40"></label>
      <label>Société / Organisation<input name="company" maxlength="160"></label>
      <label class="full">Votre projet<textarea name="message" rows="4" required maxlength="4000" placeholder="Contexte, objectifs, délais envisagés…"></textarea></label>
      <button class="btn btn--primary btn--full" type="submit">${icon("send", "i--inline")} Envoyer la demande de devis</button>
    </form></div></section>`;
  const jsonLd = [{
    "@context": "https://schema.org",
    "@type": "Service",
    name: String(s.name),
    description: String(s.summary || excerptFromMd(s.content_md, 160)),
    serviceType: String(s.name),
    provider: { "@type": "Organization", name: "GREEN FAD SARL", url: String(site.settings.site_url || "") },
    areaServed: "Afrique & international",
    image: s.image_key ? String(site.settings.site_url || "") + mediaSrc(String(s.image_key)) : undefined,
  }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(s.meta_title || `${s.name} — Expertise GREEN FAD`), description: String(s.meta_description || s.summary || "") || undefined, ogImage: String(s.og_image || mediaSrc(String(s.image_key)) || "") || undefined, canonicalPath: `/expertises/${String(s.slug)}`, jsonLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Expertises", url: "/expertises" }, { label: String(s.name) }] }), body));
});

// ---------- Produits technologiques (portfolio professionnel) ----------
publicRoutes.get("/produits", async (c) => {
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, name, tagline, image_key, category, state FROM products WHERE status = ? ORDER BY sort_order", PUBLIE);
  const site = await loadSiteData(c);
  const stateLabels: Record<string, string> = { developpement: "En développement", beta: "Bêta", disponible: "Disponible", evolution: "En évolution", archive: "Archivé" };
  const hero = heroOf(site, "/produits", "Des produits numériques conçus et portés par Green FAD", "Solutions propriétaires développées par nos équipes, pensées pour les marchés africains et ouverts à l'international.");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Produits" }])}<p class="eyebrow">Produits technologiques</p>
    <h1>${hero.raw ? `Des produits numériques <em style="color:var(--teal-400);font-style:normal">conçus et portés</em> par Green FAD` : esc(hero.title)}</h1>
    <p class="page-hero__text">${esc(hero.text)}</p></div></section>
  <section class="container"><div class="cards cards--3 reveal">${rows
    .map((p) => `<article class="card">
      ${p.image_key ? `<a class="card__media" href="/produits/${esc(String(p.slug))}"><img src="${esc(mediaSrc(String(p.image_key)))}" alt="${esc(String(p.name))}" loading="lazy"></a>` : `<a class="card__media card__media--empty" href="/produits/${esc(String(p.slug))}" aria-hidden="true" tabindex="-1">${icon("package")}</a>`}
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
        <div class="prose">${md(stripFirstH1(p.description_md))}</div>
        <div class="pdp__cta">
          <a class="btn btn--primary" href="#demo">${icon("rocket", "i--inline")} Demander une démonstration</a>
          ${p.external_url ? `<a class="btn btn--accent" href="${esc(String(p.external_url))}" target="_blank" rel="noopener">${icon("external-link", "i--inline")} Accéder au produit</a>` : ""}
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
  ${(p.benefits_md || p.differentiators_md) ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Valeur ajoutée</p><h2>Pourquoi choisir ${esc(String(p.name))}</h2></header>
    <div class="spec-grid reveal">
    ${specCard("Bénéfices & valeur ajoutée", "trending-up", p.benefits_md)}
    ${specCard("Ce qui le différencie", "award", p.differentiators_md)}
  </div></section>` : ""}
  ${p.use_cases_md ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Terrain</p><h2>Cas d'usage concrets</h2></header>
    <div class="split"><div class="split__body prose reveal">${md(p.use_cases_md)}</div></div></section>` : ""}
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
    <div class="cards cards--${Math.min(relatedPosts.length, 3)} reveal">${relatedPosts.map((r) => `<article class="card"><div class="card__body"><span class="kind-badge">${icon((KIND_LABELS[String(r.kind)] || KIND_LABELS.article).icon)} ${(KIND_LABELS[String(r.kind)] || KIND_LABELS.article).label}</span><h3><a href="/blog/${esc(String(r.slug))}">${esc(String(r.title))}</a></h3><span class="card__more">Lire ${icon("arrow-right")}</span></div></article>`).join("")}</div></section>` : ""}
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
    manufacturer: { "@type": "Organization", name: "GREEN FAD SARL", url: String(site.settings.site_url || "") },
    image: p.image_key ? String(site.settings.site_url || "") + mediaSrc(String(p.image_key)) : undefined,
    category: p.category ? String(p.category) : undefined,
    ...(p.external_url ? { offers: { "@type": "Offer", url: String(p.external_url), availability: "https://schema.org/InStock", seller: { "@type": "Organization", name: "GREEN FAD SARL" } } } : {}),
  }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(p.meta_title || `${p.name} — Produit technologique`), description: String(p.meta_description || p.tagline || excerptFromMd(p.description_md, 160)), ogImage: String(p.og_image || mediaSrc(String(p.image_key))), canonicalPath: `/produits/${p.slug}`, jsonLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Produits", url: "/produits" }, { label: String(p.name) }] }), body));
});

// ---------- Réalisations / projets clients ----------
publicRoutes.get("/realisations", async (c) => {
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, summary, image_key, category, client_type FROM projects WHERE status = ? ORDER BY sort_order", PUBLIE);
  const site = await loadSiteData(c);
  const prop = rows.filter((r) => String(r.category || "").includes("Produit propriétaire"));
  const others = rows.filter((r) => !String(r.category || "").includes("Produit propriétaire"));
  const projectCard = (r: Record<string, unknown>) => `<article class="card"><a class="card__media" href="/realisations/${esc(String(r.slug))}">${r.image_key ? `<img src="${esc(mediaSrc(String(r.image_key)))}" alt="${esc(String(r.title))}" loading="lazy">` : ""}</a>
      <div class="card__body">${r.category ? `<span class="tag">${esc(String(r.category))}</span>` : ""}<h3><a href="/realisations/${esc(String(r.slug))}">${esc(String(r.title))}</a></h3><p>${esc(String(r.summary || ""))}</p><span class="card__more">Lire l'étude de cas ${icon("arrow-right")}</span></div></article>`;
  const hero = heroOf(site, "/realisations", "Des produits qui vivent, des parcours documentés", "Nos études de cas racontent la vraie vie de nos plateformes : lancement, évolutions trimestrielles, usage sur le terrain. Cinq ans de produit, sans artifice.");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Réalisations" }])}<p class="eyebrow">Projets & réalisations</p>
    <h1>${esc(hero.title)}</h1>
    <p class="page-hero__text">${esc(hero.text)}</p></div></section>
  ${prop.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Produits propriétaires</p><h2>Le parcours de nos plateformes</h2></header>
    <div class="cards cards--${Math.min(prop.length, 3)} reveal">${prop.map(projectCard).join("")}</div></section>` : ""}
  <section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Depuis 2021</p><h2>Le chemin parcouru</h2></header>
    <ol class="timeline reveal">${timelineOf(site).map((t) => `<li><span class="timeline__year">${esc(t.year)}</span><div><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div></li>`).join("")}
    </ol>
    <p class="center" style="margin-top:2rem"><a class="btn btn--outline" href="/blog">${icon("newspaper", "i--inline")} Lire le parcours complet dans le blog</a></p></section>
  ${others.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Projets & prestations</p><h2>Études de cas clients</h2></header>
    <div class="cards cards--3 reveal">${others.map(projectCard).join("")}</div></section>` : ""}
  <section class="cta-band"><div class="container cta-band__inner reveal"><h2>Et le prochain chapitre ?</h2><p>Nos plateformes avancent chaque trimestre — suivez le blog, ou construisez le vôtre avec nous.</p><a class="btn btn--invert" href="/blog">Suivre le parcours ${icon("arrow-right")}</a></div></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Réalisations & études de cas — le parcours de nos plateformes", description: "Études de cas et parcours produits Green FAD : QRFAD, FadCard, Tile, CloudAf, PayGfad — lancement, évolutions trimestrielles et déploiements réels depuis 2021.", canonicalPath: "/realisations" }), body));
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
  const hero = heroOf(site, "/galerie", "La galerie multimédia de Green FAD", "Photographies et vidéos officielles : nos produits, nos équipes, nos événements et nos implantations.");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Galerie" }])}<p class="eyebrow">Media Center</p>
    <h1>${esc(hero.title)}</h1>
    <p class="page-hero__text">${esc(hero.text)}</p></div></section>
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

// ---------- BLOG — média éditorial de l'entreprise ----------
function readingTime(mdText: string | null | undefined): number {
  const words = String(mdText || "").replace(/[#>*`\-\[\]()!]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function paginationHTML(base: string, page: number, totalPages: number, sep = "?"): string {
  if (totalPages <= 1) return "";
  const link = (n: number, label: string, cls: string, aria: string) =>
    `<a class="${cls}" href="${base}${sep}page=${n}" aria-label="${aria}">${label}</a>`;
  let links = "";
  const window = 2;
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= window) {
      links += n === page
        ? `<span class="pager__num pager__num--current" aria-current="page">${n}</span>`
        : link(n, String(n), "pager__num", `Page ${n}`);
    } else if (Math.abs(n - page) === window + 1) links += `<span class="pager__dots">…</span>`;
  }
  const prev = page > 1 ? link(page - 1, `${icon("arrow-left", "i--inline")} Précédent`, "pager__nav", "Page précédente") : `<span class="pager__nav pager__nav--off">Précédent</span>`;
  const next = page < totalPages ? link(page + 1, `Suivant ${icon("arrow-right", "i--inline")}`, "pager__nav", "Page suivante") : `<span class="pager__nav pager__nav--off">Suivant</span>`;
  return `<nav class="pager" aria-label="Pagination">${prev}${links}${next}</nav>`;
}

function shareHTML(title: string, url: string): string {
  const enc = encodeURIComponent;
  return `<div class="share" aria-label="Partager cet article">
    <span class="share__label">${icon("share", "i--inline")} Partager</span>
    <a class="share__btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}" target="_blank" rel="noopener" aria-label="Partager sur LinkedIn">${icon("briefcase")}</a>
    <a class="share__btn" href="https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}" target="_blank" rel="noopener" aria-label="Partager sur X (Twitter)">${icon("x-social")}</a>
    <a class="share__btn" href="https://api.whatsapp.com/send?text=${enc(title + " " + url)}" target="_blank" rel="noopener" aria-label="Partager sur WhatsApp">${icon("phone")}</a>
    <a class="share__btn" href="https://www.facebook.com/sharer/sharer.php?u=${enc(url)}" target="_blank" rel="noopener" aria-label="Partager sur Facebook">${icon("globe")}</a>
    <button class="share__btn share__btn--copy" type="button" data-copy="${esc(url)}" aria-label="Copier le lien">${icon("link")}</button>
  </div>`;
}

function searchNormalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

publicRoutes.get("/blog", async (c) => {
  const kind = c.req.query("type") || "";
  const search = (c.req.query("q") || "").trim().slice(0, 80);
  const page = Math.max(1, parseInt(c.req.query("page") || "1", 10) || 1);
  const PER = 9;
  const kinds = Object.keys(KIND_LABELS);

  // Recherche : normalisation accents côté SQL impossible — LIKE sur 3 champs + filtre affiné en JS
  const all = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, excerpt, content_md, cover_key, kind, category, tags, author, published_at, is_featured, views FROM posts WHERE status = ? ORDER BY published_at DESC", PUBLIE);

  let filtered = all;
  if (kind && kinds.includes(kind)) filtered = filtered.filter((r) => String(r.kind) === kind);
  if (search) {
    const nq = searchNormalize(search);
    filtered = filtered.filter((r) => searchNormalize(`${r.title} ${r.excerpt || ""} ${r.category || ""} ${String(r.tags || "")} ${String(r.content_md || "").slice(0, 4000)}`).includes(nq));
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER));
  const current = Math.min(page, totalPages);
  const slice = filtered.slice((current - 1) * PER, current * PER);

  const popular = all.filter((r) => Number(r.views || 0) > 0).sort((a, b) => Number(b.views) - Number(a.views)).slice(0, 5);
  const years = [...new Set(all.map((r) => String(r.published_at || "").slice(0, 4)).filter(Boolean))].sort().reverse();

  // À la une : dernier article marqué (uniquement page 1, sans filtre ni recherche)
  const featured = current === 1 && !kind && !search ? filtered.find((r) => Number(r.is_featured) === 1) || filtered[0] : null;
  const rest = featured ? slice.filter((r) => r.slug !== featured.slug) : slice;

  const site = await loadSiteData(c);
  const pagerParams = new URLSearchParams();
  if (kind) pagerParams.set("type", kind);
  if (search) pagerParams.set("q", search);
  const baseForPager = pagerParams.toString() ? `/blog?${pagerParams.toString()}` : "/blog";
  const sep = baseForPager.includes("?") ? "&" : "?";

  const card = (p: Record<string, unknown>) => `<article class="card post-card">
    ${p.cover_key ? `<a class="card__media" href="/blog/${esc(String(p.slug))}"><img src="${esc(mediaSrc(String(p.cover_key)))}" alt="${esc(String(p.title))}" loading="lazy"></a>` : ""}
    <div class="card__body">${kindBadge(String(p.kind))}
    <h3><a href="/blog/${esc(String(p.slug))}">${esc(String(p.title))}</a></h3>
    <p>${esc(String(p.excerpt || excerptFromMd(p.content_md, 130)))}</p>
    <div class="post-meta"><span>${icon("calendar")} ${fmtDate(p.published_at, "short")}</span><span>${icon("clock")} ${readingTime(String(p.content_md))} min</span></div></div></article>`;

  const hero = heroOf(site, "/blog", "Le média technologique de nos ingénieurs", "Actualités de l'entreprise, lancements produits, analyses, R&D, guides d'ingénierie et regards sur l'innovation africaine — écrits par les équipes qui construisent.");
  const body = `<section class="page-hero blog-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Blog" }])}<p class="eyebrow">Blog GREEN FAD</p>
    <h1>${hero.raw ? `Le média technologique <em style="color:var(--teal-400);font-style:normal">de nos ingénieurs</em>` : esc(hero.title)}</h1>
    <p class="page-hero__text">${esc(hero.text)}</p>
    <form class="blog-search" action="/blog" method="get" role="search">
      ${kind ? `<input type="hidden" name="type" value="${esc(kind)}">` : ""}
      <input type="search" name="q" value="${esc(search)}" placeholder="Rechercher un article, un thème…" aria-label="Rechercher dans le blog" maxlength="80">
      <button class="btn btn--primary" type="submit">${icon("search", "i--inline")} Rechercher</button>
      ${search ? `<a class="btn btn--ghost" href="${esc(baseForPager)}">Réinitialiser</a>` : ""}
    </form></div></section>
  <section class="container">
    <div class="filters filters--scroll reveal"><a href="/blog" class="${kind === "" ? "active" : ""}">${icon("grid")} Tout</a>
    ${Object.entries(KIND_LABELS).map(([k, v]) => `<a href="/blog?type=${k}" class="${kind === k ? "active" : ""}">${icon(v.icon)} ${v.label}</a>`).join("")}
    <span class="filters__spacer"></span><a class="filters__aux" href="/blog/archives">${icon("history")} Archives</a><a class="filters__aux" href="/rss.xml" title="Flux RSS">${icon("rss")} RSS</a></div>
  </section>
  ${search ? `<section class="container"><p class="muted">${total} résultat${total > 1 ? "s" : ""} pour « <strong>${esc(search)}</strong> »</p></section>` : ""}
  ${featured && current === 1 && !search ? `<section class="container"><a class="blog-featured reveal" href="/blog/${esc(String(featured.slug))}">
    <div class="blog-featured__media${featured.cover_key ? "" : " blog-featured__media--empty"}">${featured.cover_key
      ? `<img src="${esc(mediaSrc(String(featured.cover_key)))}" alt="${esc(String(featured.title))}">`
      : `<span class="blog-featured__mark" aria-hidden="true"><img src="/assets/images/greenfad-mark.svg" alt=""></span>`}</div>
    <div class="blog-featured__body"><span class="kind-badge">${icon("star")} À la une</span>${kindBadge(String(featured.kind))}
      <h2>${esc(String(featured.title))}</h2>
      <p>${esc(String(featured.excerpt || excerptFromMd(featured.content_md, 220)))}</p>
      <div class="post-meta"><span>${icon("user")} ${esc(String(featured.author || "Green FAD"))}</span><span>${icon("calendar")} ${fmtDate(featured.published_at)}</span><span>${icon("clock")} ${readingTime(String(featured.content_md))} min de lecture</span></div>
      <span class="card__more">Lire l'article ${icon("arrow-right")}</span></div></a></section>` : ""}
  <section class="container"><div class="post-list post-list--blog reveal">${rest.map(card).join("")}</div>
    ${!total ? `<p class="center muted">Aucun article ne correspond à votre recherche pour le moment.</p>` : ""}
    ${paginationHTML(baseForPager, current, totalPages, sep)}</section>
  ${popular.length && current === 1 && !search ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Les plus lus</p><h2>Articles populaires</h2></header>
    <div class="popular-list reveal">${popular.map((p, i) => `<a class="popular" href="/blog/${esc(String(p.slug))}"><span class="popular__rank">${i + 1}</span><span class="popular__body"><strong>${esc(String(p.title))}</strong><em>${fmtDate(p.published_at, "short")} · ${Number(p.views)} vue${Number(p.views) > 1 ? "s" : ""}</em></span>${icon("arrow-right", "popular__arrow")}</a>`).join("")}</div></section>` : ""}
  ${years.length ? `<section class="cta-band"><div class="container cta-band__inner reveal"><h2>Explorer par année</h2><p>Retrouvez tous nos articles dans les archives.</p><a class="btn btn--invert" href="/blog/archives">Archives ${years[0]} — ${years[years.length - 1]} ${icon("arrow-right")}</a></div></section>` : ""}`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Blog — Actualités, ingénierie et innovation", description: "Le blog de Green FAD : actualités, lancements produits, analyses technologiques, R&D, guides d'ingénierie et innovation africaine, par nos équipes.", canonicalPath: "/blog" }), body));
});

publicRoutes.get("/blog/archives", async (c) => {
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, kind, published_at FROM posts WHERE status = ? ORDER BY published_at DESC", PUBLIE);
  const site = await loadSiteData(c);
  const groups = new Map<string, Record<string, unknown>[]>();
  for (const r of rows) {
    const d = String(r.published_at || "");
    if (!d) continue;
    const key = d.slice(0, 7); // YYYY-MM
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }
  const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const hero = heroOf(site, "/blog/archives", "Tous nos articles, par mois", "");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Blog", url: "/blog" }, { label: "Archives" }])}<p class="eyebrow">Blog — archives</p>
    <h1>${esc(hero.title)}</h1>${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  <section class="container">${[...groups.entries()].map(([key, items]) => `<div class="archive-group reveal">
    <h2>${MONTHS[Number(key.slice(5, 7)) - 1] || key} ${key.slice(0, 4)} <span class="muted">(${items.length})</span></h2>
    <ul class="archive-list">${items.map((r) => `<li><span class="archive-list__date">${fmtDate(r.published_at, "short")}</span>${kindBadge(String(r.kind))}<a href="/blog/${esc(String(r.slug))}">${esc(String(r.title))}</a></li>`).join("")}</ul></div>`).join("")}
  ${!rows.length ? `<p class="center muted">Aucun article publié pour le moment.</p>` : ""}</section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: "Archives du blog", description: "Tous les articles du blog GREEN FAD classés par mois.", canonicalPath: "/blog/archives", noindex: true }), body));
});

publicRoutes.get("/blog/:slug", async (c) => {
  const p = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM posts WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!p) return c.notFound();
  const site = await loadSiteData(c);
  c.executionCtx.waitUntil(c.env.DB.prepare("UPDATE posts SET views = views + 1 WHERE id = ?").bind(p.id).run().catch(() => {}));

  const related = await q(c.env.DB, `SELECT slug, title, kind, excerpt, cover_key, published_at FROM posts WHERE status='publie' AND id != ? AND (kind = ? OR category = ?) ORDER BY published_at DESC LIMIT 3`, p.id, String(p.kind || ""), String(p.category || ""));
  const relatedFallback = related.length < 3
    ? [...related, ...await q(c.env.DB, "SELECT slug, title, kind, excerpt, cover_key, published_at FROM posts WHERE status='publie' AND id != ? ORDER BY published_at DESC LIMIT ?", p.id, 3 - related.length)].filter((v, i, a) => a.findIndex((x) => x.slug === v.slug) === i).slice(0, 3)
    : related;
  const product = p.related_product_id ? await q1<{ slug: string; name: string }>(c.env.DB, "SELECT slug, name FROM products WHERE slug IS NOT NULL AND (id = ? OR slug = ?)", p.related_product_id, String(p.related_product_id || "")) : null;

  const articleUrl = `${String(site.settings.site_url || c.env.SITE_URL || "https://greenfad.tech")}/blog/${p.slug}`;
  const tags = parseJSON<string[]>(p.tags, []);
  const body = `<section class="page-hero article-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Blog", url: "/blog" }, { label: String(p.title) }])}
    ${kindBadge(String(p.kind))}
    <h1>${esc(String(p.title))}</h1>
    <div class="post-meta post-meta--hero"><span>${icon("user")} ${esc(String(p.author || "Green FAD"))}</span><span>${icon("calendar")} ${fmtDate(p.published_at)}</span><span>${icon("clock")} ${readingTime(String(p.content_md))} min de lecture</span></div></div></section>
  ${p.cover_key ? `<div class="container"><div class="article__cover reveal"><img src="${esc(mediaSrc(String(p.cover_key)))}" alt="${esc(String(p.title))}"></div></div>` : ""}
  <section class="container"><div class="article-grid">
    <article class="article prose reveal">${md(stripFirstH1(p.content_md))}</article>
    <aside class="article-side">
      ${tags.length ? `<div class="article-side__block"><h3>${icon("tag", "i--inline")} Sujets</h3><div class="chips">${tags.map((t) => `<a class="chip" href="/blog?q=${encodeURIComponent(t)}">${esc(t)}</a>`).join("")}</div></div>` : ""}
      ${product ? `<div class="article-side__block"><h3>${icon("package", "i--inline")} Produit associé</h3><a class="mini-card" href="/produits/${esc(product.slug)}"><strong>${esc(product.name)}</strong><span class="card__more">Découvrir ${icon("arrow-right")}</span></a></div>` : ""}
      <div class="article-side__block"><h3>${icon("newspaper", "i--inline")} Newsletter</h3><p class="muted">Recevez nos prochaines publications technologiques.</p><form method="post" action="/newsletter" class="nl-form"><input type="email" name="email" required placeholder="votre@email.com" aria-label="Email"><button class="btn btn--primary btn--sm" type="submit">${icon("send", "i--inline")}</button></form></div>
      <div class="article-side__block">${shareHTML(String(p.title), articleUrl)}</div>
    </aside>
  </div></section>
  ${relatedFallback.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">À lire ensuite</p><h2>Articles liés</h2></header>
    <div class="cards cards--3 reveal">${relatedFallback.map((o) => `<article class="card">${o.cover_key ? `<a class="card__media" href="/blog/${esc(String(o.slug))}"><img src="${esc(mediaSrc(String(o.cover_key)))}" alt="" loading="lazy"></a>` : ""}<div class="card__body">${kindBadge(String(o.kind))}<h3><a href="/blog/${esc(String(o.slug))}">${esc(String(o.title))}</a></h3><p>${esc(String(o.excerpt || ""))}</p><span class="card__more">Lire ${icon("arrow-right")}</span></div></article>`).join("")}</div></section>` : ""}
  <section class="cta-band"><div class="container cta-band__inner reveal"><h2>Un projet technologique en tête ?</h2><p>Nos équipes conçoivent des produits et des plateformes pour les organisations africaines et internationales.</p><a class="btn btn--invert" href="/contact">Discutons-en ${icon("arrow-right")}</a></div></section>`;
  const jsonLd = [{
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: String(p.title),
    description: String(p.excerpt || excerptFromMd(p.content_md, 160)),
    datePublished: String(p.published_at || ""),
    dateModified: String(p.updated_at || p.published_at || ""),
    wordCount: String(p.content_md || "").split(/\s+/).filter(Boolean).length,
    author: { "@type": "Organization", name: String(p.author || "GREEN FAD") },
    publisher: { "@type": "Organization", name: "GREEN FAD", logo: { "@type": "ImageObject", url: String(site.settings.site_url || "") + "/assets/images/greenfad-logo.svg" } },
    image: p.cover_key ? String(site.settings.site_url || "") + mediaSrc(String(p.cover_key)) : undefined,
    mainEntityOfPage: articleUrl,
    inLanguage: "fr",
  }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(p.meta_title || p.title), description: String(p.meta_description || p.excerpt || ""), ogImage: String(p.og_image || mediaSrc(String(p.cover_key))), canonicalPath: `/blog/${p.slug}`, jsonLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Blog", url: "/blog" }, { label: String(p.title) }] }), body));
});

// ---------- Anciennes URL Innovation → Blog (301) ----------
publicRoutes.get("/innovation", (c) => c.redirect(c.req.url.replace(/\/innovation(\?.*)?$/, "/blog$1"), 301));
publicRoutes.get("/innovation/:slug", (c) => c.redirect(`/blog/${c.req.param("slug")}`, 301));

// ---------- Alias /services → /expertises ----------
publicRoutes.get("/services", (c) => c.redirect("/expertises", 301));
publicRoutes.get("/services/:slug", (c) => c.redirect(`/expertises/${c.req.param("slug")}`, 301));

// ---------- Implantation internationale ----------
publicRoutes.get("/implantation", async (c) => {
  const countries = await q(c.env.DB, "SELECT c.slug, c.name, c.iso2, c.is_registered, c.presentation_md, COUNT(o.id) AS offices FROM countries c LEFT JOIN offices o ON o.country_id = c.id AND o.status='publie' WHERE c.status='publie' GROUP BY c.id ORDER BY c.sort_order");
  const site = await loadSiteData(c);
  const hero = heroOf(site, "/implantation", "Enracinés en Afrique, tournés vers le monde", "Green FAD opère depuis le Mali et accompagne des organisations dans plusieurs pays africains, avec une ambition internationale assumée.");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Implantation" }])}<p class="eyebrow">Présence internationale</p>
    <h1>${esc(hero.title)}</h1>
    <p class="page-hero__text">${esc(hero.text)}</p></div></section>
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
    { loc: "/blog", date: today, priority: "0.9" },
    { loc: "/blog/archives", date: today, priority: "0.4" },
    ...posts.map((p) => ({ loc: `/blog/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.7" })),
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
    .map((p) => `<item><title>${esc(p.title)}</title><link>${base}/blog/${p.slug}</link><description>${esc(p.excerpt || "")}</description><pubDate>${new Date(String(p.published_at)).toUTCString()}</pubDate><guid>${base}/blog/${p.slug}</guid></item>`)
    .join("\n");
  return c.body(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>GREEN FAD — Blog technologique</title><link>${base}/blog</link><description>Actualités, ingénierie, produits et innovation — le blog de Green FAD</description>${items}</channel></rss>`, 200, { "content-type": "application/rss+xml; charset=utf-8" });
});
