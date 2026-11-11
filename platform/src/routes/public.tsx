// GREEN FAD — Site public SSR v2 : toutes les routes proviennent de la base de données.
// Identité technologique, portfolio produits, galerie multimédia, espace innovation.
// Aucun emoji : icônes SVG uniquement (icons.ts). Données 100 % réelles publiées.
import { Hono, Context } from "hono";
import { Env } from "../types";
import { q, q1, count, getSetting } from "../db";
import { layout, loadSiteData, PageSEO, crumbsHTML, Crumb } from "../render/layout";
import { renderBlocks, renderBlock, Block, parseVideo, videoProviderLabel, countriesCardsHTML } from "../blocks";
import { md, esc, fmtDate, fmtBytes, excerptFromMd, stripFirstH1, parseJSON, mediaSrc } from "../utils";
import { icon } from "../icons";
import { audit } from "../audit";

const PUBLIE = "publie";

// ---------- Contenu éditable depuis l'admin (settings → « content_overrides » JSON) ----------
// ZÉRO donnée codée en dur : tous les héros, bandeaux CTA, textes SEO et la frise
// chronologique proviennent de la base (seed + Admin → Paramètres). Si une entrée
// est absente de la base, la zone correspondante ne s'affiche simplement pas.
type HeroOverride = { title?: string; html?: string; text?: string };
type CtaOverride = { title?: string; text?: string; button_label?: string; button_url?: string };
type SeoOverride = { title?: string; description?: string };
type TimelineEntry = { year: string; title: string; text: string };
type ContentOverrides = {
  heroes?: Record<string, HeroOverride>;
  ctas?: Record<string, CtaOverride>;
  seo?: Record<string, SeoOverride>;
  timeline?: TimelineEntry[];
  product_demo_intro?: string;
};

function overridesOf(site: { settings: Record<string, unknown> }): ContentOverrides {
  const raw = site.settings.content_overrides;
  // Deux formes selon la source : objet déjà parsé par loadSettings (seed SQL)
  // ou chaîne JSON (enregistrement via l'admin → setSetting). Les deux sont valides.
  if (raw && typeof raw === "object") return raw as ContentOverrides;
  return parseJSON<ContentOverrides>(String(raw || ""), {});
}

/** Héros de page : uniquement la base. Rien en base → chaînes vides (la page reste fonctionnelle). */
function heroOf(site: { settings: Record<string, unknown> }, path: string, fallbackTitle = ""): { title: string; html: string; text: string } {
  const h = overridesOf(site).heroes?.[path];
  return { title: h?.title || fallbackTitle, html: h?.html || "", text: h?.text || "" };
}

/** Titre de héros : HTML éditorial (base) sinon texte échappé. */
function heroTitleHTML(hero: { title: string; html: string }): string {
  return hero.html || esc(hero.title);
}

/** Bandeau CTA de bas de page : uniquement la base → absent, pas de bandeau. */
function ctaOf(site: { settings: Record<string, unknown> }, key: string): CtaOverride | null {
  const ct = overridesOf(site).ctas?.[key];
  return ct && (ct.title || ct.button_label) ? ct : null;
}

function ctaBandHTML(ct: CtaOverride): string {
  return `<section class="cta-band"><div class="container cta-band__inner reveal"><h2>${esc(ct.title || "")}</h2>${ct.text ? `<p>${esc(ct.text)}</p>` : ""}${ct.button_label ? `<a class="btn btn--invert" href="${esc(ct.button_url || "/contact")}">${esc(ct.button_label)} ${icon("arrow-right")}</a>` : ""}</div></section>`;
}

/** SEO par page : base (content_overrides.seo) → repli : titre sobre + description par défaut du site. */
async function seoOf(c: Context<{ Bindings: Env }>, site: { settings: Record<string, unknown> }, path: string, fallbackTitle: string): Promise<{ title: string; description?: string }> {
  const o = overridesOf(site).seo?.[path];
  const defaults = (await getSetting(c.env.DB, "seo_defaults", {})) as { default_description?: string };
  return {
    title: o?.title || fallbackTitle,
    description: o?.description || defaults.default_description || undefined,
  };
}

function timelineOf(site: { settings: Record<string, unknown> }): TimelineEntry[] {
  const t = overridesOf(site).timeline;
  return Array.isArray(t) ? t : [];
}

/** Nom d'organisation pour les données structurées JSON-LD : setting site_name. */
function orgName(site: { settings: Record<string, unknown> }): string {
  return String(site.settings.site_name || "GREEN FAD") + " SARL";
}

/** Zone géographique de service (JSON-LD Service) : setting service_area — absent → omis. */
function serviceAreaOf(site: { settings: Record<string, unknown> }): string | undefined {
  const v = String(site.settings.service_area || "").trim();
  return v || undefined;
}

// ---------- Helpers ----------
async function getPageSEO(c: Context<{ Bindings: Env }>, seo: PageSEO): Promise<PageSEO> {
  const siteName = (await getSetting(c.env.DB, "site_name", "GREEN FAD")) as string;
  const defaults = (await getSetting(c.env.DB, "seo_defaults", {})) as { default_description?: string; title_suffix?: string };
  // Suffixe de titre : setting éditable au Dashboard (admin/seo) — repli « | GREEN FAD ».
  const suffix = String(defaults.title_suffix || "").trim() || ` | ${String(siteName)}`;
  return {
    ...seo,
    title: /green\s*fad/i.test(seo.title) ? seo.title : `${seo.title}${suffix}`,
    description: seo.description || defaults.default_description || undefined,
  };
}

/** Texte brut pour JSON-LD (JobPosting.description, VideoObject.description…) : markdown allégé + entités HTML retirées. */
function plainText(mdText: string | null | undefined, max = 1200): string {
  const raw = String(mdText || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*`\[\]()!_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return raw.length > max ? raw.slice(0, max - 1).replace(/\s\S*$/, "") + "…" : raw;
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
    bientot: "Bientôt disponible",
    disponible: "Disponible",
    evolution: "En évolution",
    archive: "Archivé",
  };
  const icons: Record<string, string> = { developpement: "code", beta: "flask", bientot: "clock", disponible: "check-circle", evolution: "refresh", archive: "archive" };
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

// ---------- Patrimoine historique (Mission CTO N°2) ----------
// Principe cardinal : ne jamais transformer une estimation en date certaine.
// La précision de chaque date est portée par les données et affichée publiquement.
type MilestoneRow = {
  id: number; product_slug: string; kind: string; title: string; description_md: string | null;
  occurred_on: string | null; date_precision: string; version_ref: string | null; article_slug: string | null;
  media_json: string | null; source_label: string | null; confidence: string; version_num: string | null;
  version_id: number | null;
};
type PubRow = {
  id: number; product_slug: string; slug: string; post_slug: string | null; event_id: number | null;
  version_id: number | null; kind: string; title: string; original_pub_on: string | null;
  original_pub_precision: string; announcement_on: string | null; announcement_precision: string;
  delivery_on: string | null; delivery_precision: string; version_ref: string | null;
  context_md: string | null; evolution_md: string | null; features_json: string | null;
  benefits_md: string | null; result_md: string | null; media_json: string | null;
  provenance: string; source_label: string | null; confidence: string;
};
type VersionRow = {
  id: number; product_slug: string; version: string; released_on: string | null; date_precision: string;
  kind: string; summary: string | null; features: string | null; improvements: string | null;
  fixes: string | null; tech_notes: string | null; article_slug: string | null; media_json: string | null;
};
type SourceRow = {
  id: number; product_slug: string; source_type: string; title: string; detail: string | null;
  url: string | null; evidenced_on: string | null; confidence: string; validated_by: string | null;
};

const MILESTONE_META: Record<string, { label: string; icon: string; group: string }> = {
  conception: { label: "Conception", icon: "lightbulb", group: "creation" },
  cadrage: { label: "Cadrage & objectifs", icon: "compass", group: "creation" },
  developpement: { label: "Développement", icon: "code", group: "creation" },
  implementation: { label: "Implémentation", icon: "layers", group: "creation" },
  annonce: { label: "Annonce aux utilisateurs", icon: "newspaper", group: "creation" },
  tests: { label: "Tests & validation", icon: "flask", group: "production" },
  premiere_production: { label: "Première mise en production", icon: "rocket", group: "production" },
  premier_utilisateur: { label: "Premiers utilisateurs", icon: "users", group: "production" },
  mise_a_jour: { label: "Mise à jour", icon: "zap", group: "production" },
  derniere_evolution: { label: "Dernière évolution", icon: "trending-up", group: "production" },
  situation_actuelle: { label: "Situation actuelle", icon: "target", group: "production" },
};

const VERSION_META: Record<string, { label: string; cls: string }> = {
  mineure: { label: "Mineure", cls: "" },
  majeure: { label: "Évolution majeure", cls: "ver-kind--majeure" },
  module: { label: "Nouveau module", cls: "ver-kind--module" },
  architecture: { label: "Architecture", cls: "ver-kind--archi" },
  production: { label: "Mise en production", cls: "ver-kind--prod" },
  correction: { label: "Correction", cls: "ver-kind--fix" },
};

const PRECISION_META: Record<string, { label: string; cls: string }> = {
  exacte: { label: "Date confirmée", cls: "prec--exacte" },
  approximative: { label: "Environ", cls: "prec--approx" },
  archives: { label: "Retrouvée en archives", cls: "prec--archives" },
  estimee: { label: "Estimation à confirmer", cls: "prec--estimee" },
  inconnue: { label: "Date inconnue", cls: "prec--inconnue" },
};

const SOURCE_META: Record<string, { label: string; icon: string }> = {
  fondateur: { label: "Fondateur", icon: "users" },
  archives: { label: "Archives internes", icon: "archive" },
  git: { label: "Dépôt Git", icon: "git-branch" },
  release: { label: "Release / artefact", icon: "package" },
  changelog: { label: "Changelog", icon: "file-text" },
  article: { label: "Article", icon: "newspaper" },
  store: { label: "Store officiel", icon: "smartphone" },
  web: { label: "Site officiel", icon: "globe" },
  capture: { label: "Capture d'écran", icon: "camera" },
  deploiement: { label: "Déploiement / CI", icon: "cloud" },
};

const CONF_META: Record<string, string> = { haute: "conf--haute", moyenne: "conf--moyenne", faible: "conf--faible" };

const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** Affiche 2026-11-02 / 2026-11 / 2019 / texte libre — sans jamais fabriquer de certitude. */
function fmtHistDate(v: unknown): string {
  const s = String(v || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-").map(Number);
    return `${d} ${MONTHS_FR[m - 1] || ""} ${y}`;
  }
  if (/^\d{4}-\d{2}$/.test(s)) {
    const [y, m] = s.split("-").map(Number);
    return `${MONTHS_FR[m - 1] || ""} ${y}`;
  }
  return s;
}

/** ISO 8601 uniquement si la date est exploitable — jamais d'invention pour le JSON-LD. */
function histDateISO(v: unknown): string | null {
  const s = String(v || "").trim();
  if (/^\d{4}$/.test(s)) return s;
  if (/^\d{4}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return null;
}

function precisionBadge(precision: string): string {
  const p = PRECISION_META[precision] || PRECISION_META.inconnue;
  return `<span class="prec ${p.cls}" title="Niveau de fiabilité de la date">${icon("clock", "i--inline")} ${p.label}</span>`;
}

function confidenceBadge(confidence: string): string {
  const c = CONF_META[confidence] || "conf--moyenne";
  return `<span class="conf ${c}" title="Confiance de la source">confiance ${esc(String(confidence || "moyenne"))}</span>`;
}

function milestoneKindBadge(kind: string): string {
  const m = MILESTONE_META[kind] || MILESTONE_META.mise_a_jour;
  return `<span class="jalon-kind">${icon(m.icon, "i--inline")} ${m.label}</span>`;
}

function versionKindBadge(kind: string): string {
  const v = VERSION_META[kind] || VERSION_META.mineure;
  return `<span class="ver-kind ${v.cls}">${v.label}</span>`;
}

export const publicRoutes = new Hono<{ Bindings: Env }>();

/** Requête patrimoine tolérante aux pannes : si la table n'existe pas encore
 *  (migration 0007 pas encore appliquée), la section historique ne s'affiche
 *  simplement pas — la page reste rendue au lieu de planter. */
async function safeQ<T = Record<string, unknown>>(db: D1Database, sql: string, ...params: unknown[]): Promise<T[]> {
  try {
    return await q<T>(db, sql, ...params);
  } catch (e) {
    console.warn("section patrimoine ignorée:", (e as Error)?.message);
    return [];
  }
}

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
  const hero = heroOf(site, "/expertises", "Expertises");
  const ct = ctaOf(site, "/expertises");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Expertises" }])}<p class="eyebrow">Expertises</p>
    <h1>${heroTitleHTML(hero)}</h1>
    ${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  <section class="container"><div class="cards cards--3 reveal" data-stagger>${rows
    .map((s) => `<article class="card"><a class="card__media" href="/expertises/${esc(s.slug)}"><img src="${esc(mediaSrc(s.image_key as string))}" alt="${esc(String(s.name))}" loading="lazy"></a>
      <div class="card__body"><h3><a href="/expertises/${esc(s.slug)}">${esc(String(s.name))}</a></h3><p>${esc(String(s.summary || ""))}</p><span class="card__more">En savoir plus ${icon("arrow-right")}</span></div></article>`)
    .join("")}</div></section>
  ${ct ? ctaBandHTML(ct) : ""}`;
  const seo = await seoOf(c, site, "/expertises", "Expertises & services technologiques");
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/expertises", crumbs: [{ label: "Accueil", url: "/" }, { label: "Expertises" }] }), body));
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
    provider: { "@type": "Organization", name: orgName(site), url: String(site.settings.site_url || "") },
    areaServed: serviceAreaOf(site),
    image: s.image_key ? String(site.settings.site_url || "") + mediaSrc(String(s.image_key)) : undefined,
  }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(s.meta_title || `${s.name} — Expertise GREEN FAD`), description: String(s.meta_description || s.summary || "") || undefined, ogImage: String(s.og_image || mediaSrc(String(s.image_key)) || "") || undefined, canonicalPath: `/expertises/${String(s.slug)}`, jsonLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Expertises", url: "/expertises" }, { label: String(s.name) }] }), body));
});

// ---------- Produits technologiques (portfolio professionnel) ----------
publicRoutes.get("/produits", async (c) => {
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, name, tagline, image_key, category, state FROM products WHERE status = ? ORDER BY sort_order", PUBLIE);
  const site = await loadSiteData(c);
  const stateLabels: Record<string, string> = { developpement: "En développement", beta: "Bêta", bientot: "Bientôt disponible", disponible: "Disponible", evolution: "En évolution", archive: "Archivé" };
  const hero = heroOf(site, "/produits", "Produits");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Produits" }])}<p class="eyebrow">Produits technologiques</p>
    <h1>${heroTitleHTML(hero)}</h1>
    ${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  <section class="container"><div class="cards cards--3 reveal" data-stagger>${rows
    .map((p) => `<article class="card">
      ${p.image_key ? `<a class="card__media" href="/produits/${esc(String(p.slug))}"><img src="${esc(mediaSrc(String(p.image_key)))}" alt="${esc(String(p.name))}" loading="lazy"></a>` : `<a class="card__media card__media--empty" href="/produits/${esc(String(p.slug))}" aria-hidden="true" tabindex="-1">${icon("package")}</a>`}
      <div class="card__body">
        <div class="card__foot">${p.category ? `<span class="tag">${esc(String(p.category))}</span>` : ""}${statePill(String(p.state || "developpement"))}</div>
        <h3><a href="/produits/${esc(String(p.slug))}">${esc(String(p.name))}</a></h3>
        <p>${esc(String(p.tagline || ""))}</p>
        <span class="card__more">Voir la fiche produit ${icon("arrow-right")}</span></div></article>`)
    .join("")}</div></section>
  ${rows.length ? "" : `<section class="container center muted">Les fiches produits seront publiées prochainement.</section>`}`;
  const seo = await seoOf(c, site, "/produits", "Produits technologiques");
  const base = String(site.settings.site_url || "");
  const itemListLd = [{ "@context": "https://schema.org", "@type": "ItemList", name: "Produits technologiques GREEN FAD", itemListElement: rows.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: String(p.name), url: `${base}/produits/${p.slug}` })) }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/produits", jsonLd: itemListLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Produits" }] }), body));
});

// ---------- Fiche produit « style store » : héros, captures, téléchargements ----------
type Shot = { key: string; type?: string; alt?: string };
type Download = { platform?: string; url?: string; label?: string };

const DL_PLATFORMS: Record<string, { label: string; icon: string; cls: string; os: string }> = {
  ios: { label: "App Store", icon: "smartphone", cls: "dl-card--ios", os: "iOS" },
  android: { label: "Google Play", icon: "play", cls: "dl-card--android", os: "Android" },
  apk: { label: "Fichier APK", icon: "download", cls: "dl-card--apk", os: "Android" },
  web: { label: "Application web", icon: "globe", cls: "dl-card--web", os: "Web" },
  windows: { label: "Microsoft Store", icon: "monitor", cls: "dl-card--win", os: "Windows" },
  mac: { label: "Mac App Store", icon: "monitor", cls: "dl-card--mac", os: "macOS" },
};
function dlMeta(platform?: string): { label: string; icon: string; cls: string; os: string } {
  const key = String(platform || "").toLowerCase().trim();
  return DL_PLATFORMS[key] || { label: platform || "Lien officiel", icon: "external-link", cls: "", os: key };
}

publicRoutes.get("/produits/:slug", async (c) => {
  const p = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM products WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!p) return c.notFound();
  const site = await loadSiteData(c);
  const db = c.env.DB;

  // Médias liés (réutilisation sans duplication) + vidéos + FAQ + articles liés + autres produits
  const [gallery, videos, productFaqs, relatedPosts, otherProducts, milestones, hVersions, pSources, pPubs] = await Promise.all([
    q(db, "SELECT mi.title, mi.caption, m.r2_key FROM content_relations cr JOIN media_items mi ON mi.id = cr.media_item_id AND mi.type='image' AND mi.status='publie' JOIN media m ON m.id = mi.media_id WHERE cr.content_type='product' AND cr.content_id = ? ORDER BY cr.sort_order", p.id),
    q(db, "SELECT mi.id, mi.title, mi.description, mi.source_url FROM content_relations cr JOIN media_items mi ON mi.id = cr.media_item_id AND mi.type='video' AND mi.status='publie' WHERE cr.content_type='product' AND cr.content_id = ? ORDER BY cr.sort_order", p.id),
    q(db, "SELECT question, answer FROM faqs WHERE status='publie' AND category = ? ORDER BY sort_order LIMIT 8", `produit:${p.slug}`),
    safeQ(db, "SELECT slug, title, kind, published_at FROM posts WHERE status='publie' AND (related_product_id = ? OR product_slug = ? OR category = ?) ORDER BY published_at DESC LIMIT 4", p.id, String(p.slug), String(p.category || "")),
    q(db, "SELECT slug, name, tagline, image_key, logo_key, state FROM products WHERE status = ? AND id != ? ORDER BY sort_order LIMIT 3", PUBLIE, p.id),
    // Patrimoine historique (Mission CTO N°2) — chronologie, journal des versions, sources
    // (safeQ : si la migration 0007 n'est pas encore appliquée, les sections ne s'affichent pas)
    safeQ<MilestoneRow>(db, "SELECT m.*, pv.version AS version_num FROM product_milestones m LEFT JOIN product_versions pv ON pv.id = m.version_id WHERE m.product_slug = ? AND m.status = ? ORDER BY m.sort_order ASC, m.id ASC", p.slug, PUBLIE),
    safeQ<VersionRow>(db, "SELECT * FROM product_versions WHERE product_slug = ? AND status = ? ORDER BY sort_order ASC, id ASC", p.slug, PUBLIE),
    safeQ<SourceRow>(db, "SELECT * FROM product_sources WHERE product_slug = ? ORDER BY id ASC", p.slug),
    // Publications du parcours (directive CTO : annonces ↔ implémentations ↔ versions)
    safeQ<PubRow>(db, "SELECT * FROM product_publications WHERE product_slug = ? AND status = ? ORDER BY sort_order ASC, id ASC", p.slug, PUBLIE),
  ]);

  const links = parseJSON<{ label: string; url: string }[]>(p.links_json, []);
  const versions = parseJSON<{ version: string; date: string; note: string }[]>(p.versions_json, []);
  const blocks = p.blocks ? parseJSON<Block[]>(String(p.blocks), []) : [];
  const shots = parseJSON<Shot[]>(p.screenshots_json, []).filter((s) => s && s.key);
  const downloads = parseJSON<Download[]>(p.downloads_json, []).filter((d) => d && /^https?:\/\//.test(String(d.url || "")));
  const features = parseJSON<string[]>(p.features, []);

  // ---------- Patrimoine historique : rendu des jalons / versions ----------
  const latestVer = hVersions.length ? hVersions[hVersions.length - 1] : null;

  const milestoneHTML = (m: MilestoneRow) => {
    const meta = MILESTONE_META[m.kind] || MILESTONE_META.mise_a_jour;
    const media = parseJSON<{ key: string; alt?: string }[]>(m.media_json, []).filter((x) => x && x.key);
    const dateTxt = fmtHistDate(m.occurred_on);
    const iso = histDateISO(m.occurred_on);
    return `<li class="htimeline__item" data-tl-group="${meta.group}">
      <span class="htimeline__marker" aria-hidden="true">${icon(meta.icon)}</span>
      <div class="htimeline__card">
        <div class="htimeline__head">
          ${milestoneKindBadge(m.kind)}
          <span class="htimeline__date">${dateTxt ? `<time datetime="${esc(iso || "")}">${esc(dateTxt)}</time>` : ""} ${precisionBadge(m.date_precision)}</span>
        </div>
        <h3>${esc(m.title)}</h3>
        ${m.description_md ? `<div class="prose htimeline__desc">${md(m.description_md)}</div>` : ""}
        ${(m.version_ref || m.article_slug) ? `<div class="htimeline__extras">
          ${(m.version_ref || m.version_num) ? `<a class="tag tag--soft" href="#ver-${m.version_id || ""}">${icon("git-branch", "i--inline")} v${esc(String(m.version_num || m.version_ref))}</a>` : ""}
          ${m.article_slug ? `<a class="btn btn--ghost btn--sm" href="/blog/${esc(m.article_slug)}">${icon("newspaper", "i--inline")} Article relié</a>` : ""}
        </div>` : ""}
        ${media.length ? `<div class="htimeline__media" data-lightbox>${media.map((x) => { const src = mediaSrc(x.key); return `<figure data-full="${esc(src)}"><img src="${esc(src)}" alt="${esc(x.alt || m.title)}" loading="lazy"></figure>`; }).join("")}</div>` : ""}
        ${m.source_label ? `<p class="htimeline__source">${icon("shield", "i--inline")} Source&nbsp;: ${esc(m.source_label)} ${confidenceBadge(m.confidence)}</p>` : ""}
      </div>
    </li>`;
  };

  const verHTML = (v: VersionRow) => {
    const feats = parseJSON<string[]>(v.features, []);
    const media = parseJSON<{ key: string; alt?: string }[]>(v.media_json, []).filter((x) => x && x.key);
    const dateTxt = fmtHistDate(v.released_on);
    const iso = histDateISO(v.released_on);
    return `<article class="ver-card" id="ver-${v.id}">
      <div class="ver-card__head">
        <span class="ver-card__num">${icon("git-branch")} v${esc(v.version)}</span>
        ${versionKindBadge(v.kind)}
        <span class="ver-card__date">${dateTxt ? `<time datetime="${esc(iso || "")}">${esc(dateTxt)}</time>` : ""} ${precisionBadge(v.date_precision)}</span>
      </div>
      ${v.summary ? `<p class="ver-card__summary">${esc(v.summary)}</p>` : ""}
      ${feats.length ? `<ul class="feat-list ver-card__feat">${feats.map((f) => `<li>${icon("check-circle")} <span>${esc(f)}</span></li>`).join("")}</ul>` : ""}
      ${v.improvements ? `<p class="ver-card__line">${icon("trending-up", "i--inline")} <strong>Améliorations&nbsp;:</strong> ${esc(v.improvements)}</p>` : ""}
      ${v.fixes ? `<p class="ver-card__line">${icon("shield", "i--inline")} <strong>Corrections&nbsp;:</strong> ${esc(v.fixes)}</p>` : ""}
      ${v.tech_notes ? `<p class="ver-card__line muted">${icon("code", "i--inline")} <strong>Notes techniques&nbsp;:</strong> ${esc(v.tech_notes)}</p>` : ""}
      ${(v.article_slug || media.length) ? `<div class="htimeline__extras">
        ${v.article_slug ? `<a class="btn btn--ghost btn--sm" href="/blog/${esc(v.article_slug)}">${icon("newspaper", "i--inline")} Article d'annonce</a>` : ""}
        ${media.length ? `<div class="htimeline__media" data-lightbox>${media.map((x) => { const src = mediaSrc(x.key); return `<figure data-full="${esc(src)}"><img src="${esc(src)}" alt="${esc(x.alt || `Version ${v.version}`)}" loading="lazy"></figure>`; }).join("")}</div>` : ""}
      </div>` : ""}
    </article>`;
  };

  // Publications du parcours (directive CTO §4) : chaque annonce reliée à son
  // événement, sa version, sa date d'annonce et sa date réelle de livraison.
  const PUB_META: Record<string, { label: string; cls: string; icon: string }> = {
    original_retrouve: { label: "Article original retrouvé", cls: "pub--original", icon: "newspaper" },
    reconstruite: { label: "Publication reconstituée", cls: "pub--reconstruite", icon: "history" },
    nouvelle: { label: "Publication historique", cls: "pub--nouvelle", icon: "clock" },
  };
  const pubHTML = (pub: PubRow) => {
    const meta = PUB_META[String(pub.provenance)] || PUB_META.nouvelle;
    const feats = parseJSON<string[]>(pub.features_json, []);
    const media = parseJSON<{ key: string; alt?: string }[]>(pub.media_json, []).filter((x) => x && x.key);
    const ver = pub.version_id ? hVersions.find((v) => v.id === pub.version_id) : null;
    const annTxt = pub.announcement_on ? `${fmtHistDate(pub.announcement_on)} ${precisionBadge(pub.announcement_precision)}` : "";
    const dlvTxt = pub.delivery_on ? `${fmtHistDate(pub.delivery_on)} ${precisionBadge(pub.delivery_precision)}` : "";
    const detail = `<div class="pub-card__detail prose">
      ${pub.context_md ? `<p><strong>Contexte&nbsp;:</strong> ${md(pub.context_md)}</p>` : ""}
      ${pub.evolution_md ? `<p><strong>Évolution annoncée&nbsp;:</strong> ${md(pub.evolution_md)}</p>` : ""}
      ${feats.length ? `<ul class="feat-list">${feats.map((f) => `<li>${icon("check-circle")} <span>${esc(f)}</span></li>`).join("")}</ul>` : ""}
      ${pub.benefits_md ? `<p><strong>Bénéfices attendus&nbsp;:</strong> ${md(pub.benefits_md)}</p>` : ""}
      ${pub.result_md ? `<p><strong>Résultat livré&nbsp;:</strong> ${md(pub.result_md)}</p>` : ""}
      ${media.length ? `<div class="htimeline__media" data-lightbox>${media.map((x) => { const src = mediaSrc(x.key); return `<figure data-full="${esc(src)}"><img src="${esc(src)}" alt="${esc(x.alt || pub.title)}" loading="lazy"></figure>`; }).join("")}</div>` : ""}
      ${pub.source_label ? `<p class="htimeline__source">${icon("shield", "i--inline")} ${esc(pub.source_label)} ${confidenceBadge(pub.confidence)}</p>` : ""}
    </div>`;
    return `<article class="pub-card ${meta.cls}">
      <div class="pub-card__head">
        <span class="pub-card__prov">${icon(meta.icon, "i--inline")} ${esc(meta.label)}</span>
        ${ver ? `<a class="tag tag--soft" href="#ver-${ver.id}">${icon("git-branch", "i--inline")} v${esc(ver.version)}</a>` : pub.version_ref ? `<span class="tag tag--soft">${icon("git-branch", "i--inline")} v${esc(pub.version_ref)}</span>` : ""}
        ${annTxt ? `<span class="pub-card__date">${icon("newspaper", "i--inline")} Annonce&nbsp;: ${annTxt}</span>` : ""}
        ${dlvTxt ? `<span class="pub-card__date">${icon("rocket", "i--inline")} Livraison&nbsp;: ${dlvTxt}</span>` : ""}
      </div>
      <h3>${pub.post_slug ? `<a href="/blog/${esc(pub.post_slug)}">${esc(pub.title)}</a>` : esc(pub.title)}</h3>
      ${pub.post_slug
        ? `${detail}<a class="btn btn--ghost btn--sm" href="/blog/${esc(pub.post_slug)}">${icon("newspaper", "i--inline")} Lire l'article original</a>`
        : `<details class="pub-card__more"><summary>${icon("history", "i--inline")} Consulter cette publication</summary>${detail}</details>`}
    </article>`;
  };

  const specCard = (title: string, iconName: string, content: unknown) =>
    content ? `<div class="spec-card"><h3>${icon(iconName)} ${esc(title)}</h3><div class="prose" style="font-size:.95rem">${md(content)}</div></div>` : "";

  const demoIntro = overridesOf(site).product_demo_intro || "";
  const hasMobile = shots.some((s) => String(s.type) !== "desktop");
  const hasDesktop = shots.some((s) => String(s.type) === "desktop");

  const dlCard = (d: Download) => {
    const meta = dlMeta(d.platform);
    const small = meta.os === "Web" ? "Ouvrir" : "Télécharger sur";
    return `<a class="dl-card ${meta.cls}" href="${esc(String(d.url))}" target="_blank" rel="noopener">
      <span class="dl-card__icon">${icon(meta.icon)}</span>
      <span class="dl-card__meta"><small>${esc(small)}</small><strong>${esc(String(d.label || meta.label))}</strong>${d.label && meta.label !== d.label ? `<small class="dl-card__plat">${esc(meta.label)}</small>` : ""}</span>
      <span class="dl-card__go">${icon("arrow-right")}</span>
    </a>`;
  };

  const shotHTML = (s: Shot, i: number) => {
    const src = mediaSrc(String(s.key));
    const isDesktop = String(s.type) === "desktop";
    const alt = String(s.alt || `${p.name} — capture d'écran ${i + 1}`);
    return `<figure class="shot ${isDesktop ? "shot--desktop" : "shot--mobile"}" data-type="${isDesktop ? "desktop" : "mobile"}" data-full="${esc(src)}">
      <div class="shot__frame"><img src="${esc(src)}" alt="${esc(alt)}" loading="${i < 3 ? "eager" : "lazy"}"></div>
      <figcaption><span class="shot__chip">${isDesktop ? `${icon("monitor")} Desktop` : `${icon("smartphone")} Mobile`}</span><span class="shot__alt">${esc(alt)}</span></figcaption>
    </figure>`;
  };

  // Ancres de navigation interne (uniquement les sections réellement présentes)
  const anchors: { id: string; label: string }[] = [
    { id: "presentation", label: "Présentation" },
    ...(shots.length ? [{ id: "apercus", label: `Aperçus (${shots.length})` }] : []),
    ...(milestones.length || pPubs.length ? [{ id: "parcours", label: "Histoire & évolution" }] : []),
    ...(hVersions.length ? [{ id: "versions", label: `Versions (${hVersions.length})` }] : []),
    ...(downloads.length ? [{ id: "telechargements", label: "Téléchargements" }] : []),
    ...(productFaqs.length ? [{ id: "faq", label: "FAQ" }] : []),
  ];

  const heroActions = [
    ...downloads.slice(0, 4).map(dlCard),
    p.external_url ? `<a class="btn btn--ghost store-hero__btn" href="${esc(String(p.external_url))}" target="_blank" rel="noopener">${icon("external-link", "i--inline")} Accéder au produit</a>` : "",
    `<a class="btn btn--accent store-hero__btn" href="#demo">${icon("rocket", "i--inline")} Demander une démo</a>`,
  ].filter(Boolean).join("");

  const body = `<section class="store-hero"><div class="container store-hero__grid">
    <div class="store-hero__main">
      ${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Produits", url: "/produits" }, { label: String(p.name) }])}
      <div class="store-hero__id">
        ${p.logo_key ? `<img class="store-hero__logo" src="${esc(mediaSrc(String(p.logo_key)))}" alt="Logo ${esc(String(p.name))}">` : ""}
        <div>
          <p class="eyebrow store-hero__eyebrow">Produit technologique GREEN FAD</p>
          <h1>${esc(String(p.name))}</h1>
          ${p.tagline ? `<p class="store-hero__tagline">${esc(String(p.tagline))}</p>` : ""}
          <div class="pdp__meta">${p.category ? `<span class="tag">${esc(String(p.category))}</span>` : ""}${statePill(String(p.state || "developpement"))}${latestVer ? `<span class="tag tag--soft">${icon("git-branch", "i--inline")} v${esc(latestVer.version)}</span>` : versions.length ? `<span class="tag tag--soft">${icon("git-branch", "i--inline")} v${esc(versions[0].version)}</span>` : ""}${milestones.length ? `<span class="tag tag--soft">${icon("route", "i--inline")} ${milestones.length} jalon${milestones.length > 1 ? "s" : ""}</span>` : ""}</div>
        </div>
      </div>
      ${heroActions ? `<div class="store-hero__actions">${heroActions}</div>` : ""}
      ${links.length ? `<div class="pdp__links">${links.map((l) => `<a class="btn btn--ghost btn--sm" href="${esc(l.url)}" target="_blank" rel="noopener">${icon("external-link", "i--inline")} ${esc(l.label)}</a>`).join("")}</div>` : ""}
      ${anchors.length ? `<nav class="store-anchors" aria-label="Sections de la fiche">${anchors.map((a) => `<a href="#${a.id}">${esc(a.label)}</a>`).join("")}</nav>` : ""}
    </div>
    ${p.image_key ? `<div class="store-hero__media"><img src="${esc(mediaSrc(String(p.image_key)))}" alt="${esc(String(p.name))} — présentation"></div>` : ""}
  </div></section>

  <section class="container" id="presentation"><div class="pdp-brief reveal">
    <div class="pdp-brief__text">
      <header class="sec-head sec-head--left"><p class="eyebrow">Présentation</p><h2>À propos de ${esc(String(p.name))}</h2></header>
      <div class="prose">${md(stripFirstH1(p.description_md))}</div>
      <div class="pdp__cta">
        <a class="btn btn--primary" href="#demo">${icon("rocket", "i--inline")} Demander une démonstration</a>
        ${p.external_url ? `<a class="btn btn--outline" href="${esc(String(p.external_url))}" target="_blank" rel="noopener">${icon("external-link", "i--inline")} Site du produit</a>` : ""}
        <a class="btn btn--outline" href="/contact">${icon("mail", "i--inline")} Partenariat & contact</a>
      </div>
    </div>
    ${features.length ? `<aside class="pdp-brief__feat"><h3>${icon("zap")} Fonctionnalités clés</h3><ul class="feat-list">${features.map((f) => `<li>${icon("check-circle")} <span>${esc(f)}</span></li>`).join("")}</ul></aside>` : ""}
  </div></section>

  ${shots.length ? `<section class="container" id="apercus">
    <header class="sec-head sec-head--left reveal"><p class="eyebrow">Aperçus</p><h2>Le produit en images</h2></header>
    ${hasMobile && hasDesktop ? `<div class="shots-tabs reveal" data-shots-tabs role="group" aria-label="Filtrer les captures">
      <button type="button" class="is-active" data-filter="all">${icon("layers", "i--inline")} Tout voir</button>
      <button type="button" data-filter="mobile">${icon("smartphone", "i--inline")} Mobile</button>
      <button type="button" data-filter="desktop">${icon("monitor", "i--inline")} Desktop</button>
    </div>` : ""}
    <div class="shots reveal" data-lightbox data-shots>${shots.map(shotHTML).join("")}</div>
    <p class="muted shots-hint">${icon("info", "i--inline")} Faites défiler horizontalement et cliquez pour agrandir.</p>
  </section>` : ""}

  ${(p.problem_md || p.vision_md || p.origin_md || p.modules_md) ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Conception</p><h2>Pourquoi ${esc(String(p.name))} existe</h2></header>
    <div class="spec-grid reveal">
    ${specCard("Le problème résolu", "target", p.problem_md)}
    ${specCard("Vision & objectif", "lightbulb", p.vision_md)}
    ${specCard("Origine du produit", "history", p.origin_md)}
    ${specCard("Modules & services intégrés", "layers", p.modules_md)}
  </div></section>` : ""}

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

  ${milestones.length ? `<section class="container" id="parcours">
    <header class="sec-head sec-head--left reveal"><p class="eyebrow">Parcours historique</p><h2>L'histoire de ${esc(String(p.name))}, de l'idée à aujourd'hui</h2></header>
    ${p.history_intro_md ? `<div class="prose hist-intro reveal">${md(p.history_intro_md)}</div>` : ""}
    <p class="muted hist-note reveal">${icon("info", "i--inline")} Chaque date est accompagnée de son niveau de fiabilité — aucune estimation n'est présentée comme un fait établi.</p>
    <div class="hist-filters reveal" data-tl-tabs role="group" aria-label="Filtrer les jalons">
      <button type="button" class="is-active" data-tl-filter="all">${icon("layers", "i--inline")} Tout le parcours</button>
      <button type="button" data-tl-filter="creation">${icon("lightbulb", "i--inline")} Conception & développement</button>
      <button type="button" data-tl-filter="production">${icon("rocket", "i--inline")} Production & évolutions</button>
    </div>
    <ol class="htimeline reveal" data-tl>${milestones.map(milestoneHTML).join("")}</ol>
  </section>` : ""}

  ${pPubs.length ? `<section class="container" id="publications">
    <header class="sec-head sec-head--left reveal"><p class="eyebrow">Annonces & publications</p><h2>Les publications qui ont raconté l'évolution de ${esc(String(p.name))}</h2></header>
    <p class="muted hist-note reveal">${icon("info", "i--inline")} Chaque publication est reliée à son événement et, le cas échéant, à sa version. Une annonce n'est jamais confondue avec la date de livraison&nbsp;; les publications reconstituées sont identifiées comme telles.</p>
    <div class="pub-list reveal">${pPubs.map(pubHTML).join("")}</div>
  </section>` : ""}

  ${hVersions.length ? `<section class="container" id="versions">
    <header class="sec-head sec-head--left reveal"><p class="eyebrow">Journal des versions</p><h2>Versions & évolutions de ${esc(String(p.name))}</h2></header>
    <div class="ver-timeline reveal">${hVersions.map(verHTML).join("")}</div>
  </section>` : ""}

  ${pSources.length ? `<section class="container"><details class="hist-sources reveal">
    <summary>${icon("shield", "i--inline")} Sources & traçabilité de cet historique (${pSources.length})</summary>
    <ul class="hist-sources__list">${pSources.map((s) => `<li>
      <span class="hist-sources__type">${icon((SOURCE_META[s.source_type] || SOURCE_META.archives).icon, "i--inline")} ${(SOURCE_META[s.source_type] || SOURCE_META.archives).label}</span>
      <div><strong>${esc(s.title)}</strong>${s.detail ? ` — <span class="muted">${esc(s.detail)}</span>` : ""}
        ${s.url ? ` <a href="${esc(s.url)}" target="_blank" rel="noopener">${icon("external-link", "i--inline")} vérifier la source</a>` : ""}
        ${s.evidenced_on ? ` <em class="muted">preuve du ${esc(fmtHistDate(s.evidenced_on))}</em>` : ""}
        ${confidenceBadge(s.confidence)}${s.validated_by ? ` <em class="muted">· ${esc(s.validated_by)}</em>` : ""}
      </div></li>`).join("")}</ul>
    <p class="muted hist-sources__note">Règle éditoriale GREEN FAD&nbsp;: les dates marquées « Environ », « Archives », « Estimation » ou « Inconnue » ne sont pas présentées comme des faits établis — elles sont enrichies et validées au fil des vérifications avec le fondateur.</p>
  </details></section>` : ""}

  ${downloads.length ? `<section class="container" id="telechargements"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Téléchargements</p><h2>Obtenez ${esc(String(p.name))}</h2></header>
    <div class="dl-grid reveal">${downloads.map(dlCard).join("")}</div>
    <p class="muted dl-note">${icon("info", "i--inline")} Les liens de téléchargement officiels sont maintenus par les équipes GREEN FAD — en cas de lien obsolète, <a href="/contact">signalez-le nous</a>.</p>
  </section>` : ""}

  ${gallery.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Galerie</p><h2>Le produit en situation</h2></header>
    <div class="gallery gallery--3 reveal" data-lightbox>${gallery.map((g) => { const src = mediaSrc(String(g.r2_key)); return `<figure data-full="${esc(src)}"><img src="${esc(src)}" alt="${esc(String(g.title || ""))}" loading="lazy">${g.caption ? `<figcaption>${esc(String(g.caption))}</figcaption>` : ""}</figure>`; }).join("")}</div></section>` : ""}
  ${videos.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Démonstrations</p><h2>Vidéos du produit</h2></header>
    <div class="video-grid reveal">${videos.map((v) => { const pv = parseVideo(String(v.source_url || "")); return `<div class="video-card"><div class="video-embed"><iframe src="${esc(pv.embed)}" allowfullscreen loading="lazy" title="${esc(String(v.title))}"></iframe></div><div class="video-card__body"><h3>${esc(String(v.title))}</h3>${v.description ? `<p>${esc(String(v.description))}</p>` : ""}</div></div>`; }).join("")}</div></section>` : ""}
  ${blocks.length ? (await renderBlocks(blocks, c.env)) : ""}
  ${(versions.length && !hVersions.length) ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Historique</p><h2>Versions & évolutions publiables</h2></header>
    <div class="version-list reveal">${versions.map((v) => `<div class="version-item"><strong>${esc(v.version)}</strong><span><em>${esc(v.date || "")}</em>${esc(v.note || "")}</span></div>`).join("")}</div></section>` : ""}
  ${productFaqs.length ? `<section class="container" id="faq"><header class="sec-head sec-head--left reveal"><p class="eyebrow">FAQ</p><h2>Questions fréquentes sur ${esc(String(p.name))}</h2></header>
    <div class="faq reveal" style="margin:0">${productFaqs.map((f) => `<details><summary>${esc(String(f.question))}</summary><div class="prose">${md(f.answer)}</div></details>`).join("")}</div></section>` : ""}
  ${relatedPosts.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Actualités liées</p><h2>À lire sur ce produit</h2></header>
    <div class="cards cards--${Math.min(relatedPosts.length, 3)} reveal">${relatedPosts.map((r) => `<article class="card"><div class="card__body"><span class="kind-badge">${icon((KIND_LABELS[String(r.kind)] || KIND_LABELS.article).icon)} ${(KIND_LABELS[String(r.kind)] || KIND_LABELS.article).label}</span><h3><a href="/blog/${esc(String(r.slug))}">${esc(String(r.title))}</a></h3><span class="card__more">Lire ${icon("arrow-right")}</span></div></article>`).join("")}</div></section>` : ""}
  ${otherProducts.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Écosystème GREEN FAD</p><h2>Autres produits qui pourraient vous servir</h2></header>
    <div class="cards cards--3 reveal">${otherProducts.map((pr) => `<article class="card">${(pr.logo_key || pr.image_key) ? `<a class="card__media" href="/produits/${esc(String(pr.slug))}"><img src="${esc(mediaSrc(String(pr.logo_key || pr.image_key)))}" alt="${esc(String(pr.name))}" loading="lazy"></a>` : `<a class="card__media card__media--empty" href="/produits/${esc(String(pr.slug))}" aria-hidden="true" tabindex="-1">${icon("package")}</a>`}<div class="card__body"><h3><a href="/produits/${esc(String(pr.slug))}">${esc(String(pr.name))}</a></h3><p>${esc(String(pr.tagline || ""))}</p><span class="card__more">Voir la fiche produit ${icon("arrow-right")}</span></div></article>`).join("")}</div></section>` : ""}
  <section class="container" id="demo"><div class="form-card reveal">
    <h2>Demander une démonstration de ${esc(String(p.name))}</h2>
    ${demoIntro ? `<p class="muted">${esc(demoIntro)}</p>` : ""}
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

  // Données structurées : SoftwareApplication (produits installables) ou Product
  const osList = [...new Set(downloads.map((d) => dlMeta(d.platform).os).filter(Boolean))];
  const abs = (k: string) => String(site.settings.site_url || "") + mediaSrc(String(k));
  const primaryDl = downloads.find((d) => ["android", "apk", "ios"].includes(String(d.platform || "").toLowerCase())) || downloads[0];
  const jsonLd: Record<string, unknown>[] = [{
    "@context": "https://schema.org",
    "@type": downloads.length ? "SoftwareApplication" : "Product",
    name: String(p.name),
    description: String(p.meta_description || p.tagline || excerptFromMd(p.description_md, 200)),
    brand: { "@type": "Brand", name: String(site.settings.site_name || "GREEN FAD") },
    manufacturer: { "@type": "Organization", name: orgName(site), url: String(site.settings.site_url || "") },
    ...(p.image_key ? { image: abs(String(p.image_key)) } : {}),
    ...(shots.length ? { screenshot: shots.slice(0, 10).map((s) => abs(String(s.key))) } : {}),
    ...(p.category ? { applicationCategory: String(p.category) } : {}),
    ...(osList.length ? { operatingSystem: osList.join(", ") } : {}),
    ...(versions[0]?.version || latestVer ? { softwareVersion: String(latestVer?.version || versions[0]?.version) } : {}),
    ...(p.external_url ? { url: String(p.external_url), ...(downloads.length ? {} : { offers: { "@type": "Offer", url: String(p.external_url), availability: "https://schema.org/InStock", seller: { "@type": "Organization", name: orgName(site) } } }) } : {}),
    ...(downloads.length && primaryDl ? { downloadUrl: String(primaryDl.url) } : {}),
  }];
  // Chronologie crawlable (Mission CTO N°2 §10) : les jalons existent dans les données structurées.
  // Une date non confirmée n'est JAMAIS exposée comme startDate certaine — elle reste descriptive.
  if (milestones.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Parcours historique de ${String(p.name)}`,
      itemListElement: milestones.map((m, i) => {
        const iso = histDateISO(m.occurred_on);
        const certain = m.date_precision === "exacte" || m.date_precision === "archives";
        const when = iso ? (certain ? `le ${fmtHistDate(m.occurred_on)}` : `environ ${fmtHistDate(m.occurred_on)}`) : "date à confirmer";
        const ev: Record<string, unknown> = {
          "@type": "Event",
          name: String(m.title),
          description: `${MILESTONE_META[m.kind]?.label || "Jalon"} — ${when}. ${excerptFromMd(m.description_md, 180)}`.trim(),
        };
        if (iso && certain) ev.startDate = iso;
        return { "@type": "ListItem", position: i + 1, item: ev };
      }),
    });
  }
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(p.meta_title || `${p.name} — Produit technologique`), description: String(p.meta_description || p.tagline || excerptFromMd(p.description_md, 160)), ogImage: String(p.og_image || mediaSrc(String(p.image_key))), canonicalPath: `/produits/${p.slug}`, jsonLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Produits", url: "/produits" }, { label: String(p.name) }] }), body));
});

// ---------- Réalisations / projets clients ----------
publicRoutes.get("/realisations", async (c) => {
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, summary, image_key, category, client_type FROM projects WHERE status = ? ORDER BY sort_order", PUBLIE);
  const site = await loadSiteData(c);
  // Centre d'histoire technologique (Mission CTO N°2) : produits vivants avec chronologies publiées
  const histProducts = await safeQ<Record<string, unknown>>(c.env.DB, `SELECT p.slug, p.name, p.tagline, p.logo_key, p.image_key, p.state,
    (SELECT COUNT(*) FROM product_milestones m WHERE m.product_slug = p.slug AND m.status = 'publie') AS n_milestones,
    (SELECT MAX(m.occurred_on) FROM product_milestones m WHERE m.product_slug = p.slug AND m.status = 'publie' AND m.occurred_on IS NOT NULL) AS last_event,
    (SELECT m.occurred_on FROM product_milestones m WHERE m.product_slug = p.slug AND m.status = 'publie' AND m.kind = 'conception' ORDER BY m.sort_order LIMIT 1) AS conception_on,
    (SELECT v.version FROM product_versions v WHERE v.product_slug = p.slug AND v.status = 'publie' ORDER BY v.sort_order DESC LIMIT 1) AS last_version
    FROM products p WHERE p.status = ? ORDER BY p.sort_order`, PUBLIE);
  const histCard = (h: Record<string, unknown>) => {
    const n = Number(h.n_milestones || 0);
    if (!n) return "";
    return `<a class="hist-card" href="/produits/${esc(String(h.slug))}#parcours">
      <span class="hist-card__logo">${h.logo_key ? `<img src="${esc(mediaSrc(String(h.logo_key)))}" alt="Logo ${esc(String(h.name))}" loading="lazy">` : icon("package")}</span>
      <span class="hist-card__body">
        <strong>${esc(String(h.name))}</strong>
        <em>${esc(String(h.tagline || ""))}</em>
        <span class="hist-card__meta">
          ${statePill(String(h.state || "developpement"))}
          ${h.last_version ? `<span class="tag tag--soft">${icon("git-branch", "i--inline")} v${esc(String(h.last_version))}</span>` : ""}
          <span class="hist-card__count">${icon("route", "i--inline")} ${n} jalon${n > 1 ? "s" : ""}</span>
        </span>
        <span class="hist-card__dates">
          ${h.conception_on ? `<span>${icon("lightbulb", "i--inline")} Idée&nbsp;: ${esc(fmtHistDate(h.conception_on))}</span>` : ""}
          ${h.last_event ? `<span>${icon("trending-up", "i--inline")} Dernière évolution&nbsp;: ${esc(fmtHistDate(h.last_event))}</span>` : ""}
        </span>
        <span class="card__more">Explorer la chronologie ${icon("arrow-right")}</span>
      </span>
    </a>`;
  };
  const prop = rows.filter((r) => String(r.category || "").includes("Produit propriétaire"));
  const others = rows.filter((r) => !String(r.category || "").includes("Produit propriétaire"));
  const projectCard = (r: Record<string, unknown>) => `<article class="card"><a class="card__media" href="/realisations/${esc(String(r.slug))}">${r.image_key ? `<img src="${esc(mediaSrc(String(r.image_key)))}" alt="${esc(String(r.title))}" loading="lazy">` : ""}</a>
      <div class="card__body">${r.category ? `<span class="tag">${esc(String(r.category))}</span>` : ""}<h3><a href="/realisations/${esc(String(r.slug))}">${esc(String(r.title))}</a></h3><p>${esc(String(r.summary || ""))}</p><span class="card__more">Lire l'étude de cas ${icon("arrow-right")}</span></div></article>`;
  const hero = heroOf(site, "/realisations", "Réalisations");
  const ct = ctaOf(site, "/realisations");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Réalisations" }])}<p class="eyebrow">Projets & réalisations</p>
    <h1>${heroTitleHTML(hero)}</h1>
    ${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  ${histProducts.some((h) => Number(h.n_milestones || 0)) ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Centre d'histoire technologique</p><h2>Nos produits vivent, évoluent et racontent leur histoire</h2>
    <p class="muted">Chaque produit GREEN FAD dispose d'un parcours historique documenté et vérifiable&nbsp;: naissance de l'idée, conception, développement, mises en production, premiers utilisateurs, évolutions successives. Les dates sont accompagnées de leur niveau de fiabilité — les estimations ne sont jamais présentées comme des faits établis.</p></header>
    <div class="hist-grid reveal" data-stagger>${histProducts.map(histCard).filter(Boolean).join("")}</div>
    <p class="center muted" style="margin-top:1.4rem">${icon("shield", "i--inline")} Chronologies traçables&nbsp;: chaque jalon renvoie à sa source (fondateur, archives, dépôts, stores officiels).</p>
  </section>` : ""}
  ${prop.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Produits propriétaires</p><h2>Le parcours de nos plateformes</h2></header>
    <div class="cards cards--${Math.min(prop.length, 3)} reveal">${prop.map(projectCard).join("")}</div></section>` : ""}
  <section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Depuis 2021</p><h2>Le chemin parcouru</h2></header>
    <ol class="timeline reveal" data-stagger>${timelineOf(site).map((t) => `<li><span class="timeline__year">${esc(t.year)}</span><div><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div></li>`).join("")}
    </ol>
    <p class="center" style="margin-top:2rem"><a class="btn btn--outline" href="/blog">${icon("newspaper", "i--inline")} Lire le parcours complet dans le blog</a></p></section>
  ${others.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Projets & prestations</p><h2>Études de cas clients</h2></header>
    <div class="cards cards--3 reveal" data-stagger>${others.map(projectCard).join("")}</div></section>` : ""}
  ${ct ? ctaBandHTML(ct) : ""}`;
  const seo = await seoOf(c, site, "/realisations", "Réalisations & études de cas");
  const histLd = histProducts.filter((h) => Number(h.n_milestones || 0)).map((h, i) => ({ "@type": "ListItem", position: i + 1, name: String(h.name), url: `${String(site.settings.site_url || "")}/produits/${h.slug}` }));
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/realisations", crumbs: [{ label: "Accueil", url: "/" }, { label: "Réalisations" }], ...(histLd.length ? { jsonLd: [{ "@context": "https://schema.org", "@type": "ItemList", name: "Historique technologique des produits GREEN FAD", itemListElement: histLd }] } : {}) }), body));
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
  const baseR = String(site.settings.site_url || "");
  const workLd = [{
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: String(r.title),
    ...(r.summary ? { description: plainText(String(r.summary), 400) } : {}),
    ...(r.image_key ? { image: `${baseR}${mediaSrc(String(r.image_key))}` } : {}),
    url: `${baseR}/realisations/${r.slug}`,
    author: { "@type": "Organization", name: String(site.settings.site_name || "GREEN FAD"), url: baseR },
    inLanguage: "fr",
  }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(r.meta_title || r.title), description: String(r.meta_description || r.summary || ""), ogImage: String(r.og_image || mediaSrc(String(r.image_key))), canonicalPath: `/realisations/${r.slug}`, jsonLd: workLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Réalisations", url: "/realisations" }, { label: String(r.title) }] }), body));
});

// ---------- Galerie multimédia ----------
publicRoutes.get("/galerie", async (c) => {
  const [albums, videos] = await Promise.all([
    q<Record<string, unknown>>(c.env.DB, "SELECT a.*, (SELECT COUNT(*) FROM media_items mi WHERE mi.album_id = a.id AND mi.status='publie') AS n FROM media_albums a WHERE a.status = ? ORDER BY a.sort_order", PUBLIE),
    q<Record<string, unknown>>(c.env.DB, "SELECT id, title, description, source_url FROM media_items WHERE type='video' AND status = ? ORDER BY sort_order LIMIT 12", PUBLIE),
  ]);
  const site = await loadSiteData(c);
  const catLabels: Record<string, string> = { general: "Galerie générale", produits: "Produits", projets: "Projets & réalisations", evenements: "Événements", institution: "Institutionnel & équipes", bureaux: "Bureaux & implantations", demonstrations: "Démonstrations" };
  const hero = heroOf(site, "/galerie", "Galerie");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Galerie" }])}<p class="eyebrow">Media Center</p>
    <h1>${heroTitleHTML(hero)}</h1>
    ${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  ${albums.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Albums photo</p><h2>Explorez par thématique</h2></header>
    <div class="album-grid reveal">${albums.map((a) => `<a class="album" href="/galerie/album/${esc(String(a.slug))}">
      ${a.cover_key ? `<img src="${esc(mediaSrc(String(a.cover_key)))}" alt="${esc(String(a.name))}" loading="lazy">` : ""}
      <span class="album__overlay"><h3>${esc(String(a.name))}</h3><p>${icon("image")} ${Number(a.n)} visuel${Number(a.n) > 1 ? "s" : ""}${a.description ? ` · ${esc(String(a.description).slice(0, 60))}` : ""}</p></span></a>`).join("")}</div></section>` : ""}
  ${videos.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Vidéos</p><h2>Nos démonstrations & interventions</h2></header>
    <div class="video-grid reveal">${videos.map((v) => { const pv = parseVideo(String(v.source_url || "")); return `<a class="video-card" href="/galerie/video/${v.id}">
      <span class="video-card__thumb">${pv.thumb ? `<img src="${esc(pv.thumb)}" alt="Miniature : ${esc(String(v.title))}" loading="lazy">` : `<span class="video-card__src">${esc(videoProviderLabel(pv.provider))}</span>`}<span class="video-card__play"><span>${icon("play")}</span></span></span>
      <span class="video-card__body"><h3>${esc(String(v.title))}</h3>${v.description ? `<p>${esc(String(v.description).slice(0, 120))}</p>` : ""}</span></a>`; }).join("")}</div>
    <p class="center" style="margin-top:1.8rem"><a class="btn btn--outline btn--sm" href="/videos">${icon("video", "i--inline")} Toutes les vidéos</a></p></section>` : ""}
  ${!albums.length && !videos.length ? `<section class="container center"><div class="form-card" style="max-width:560px">${icon("image-off")}<h2 style="margin-top:1rem">Galerie en préparation</h2><p class="muted">Aucun média publié pour le moment. Les premiers albums arrivent bientôt.</p></div></section>` : ""}`;
  const seo = await seoOf(c, site, "/galerie", "Galerie multimédia");
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/galerie", crumbs: [{ label: "Accueil", url: "/" }, { label: "Galerie" }] }), body));
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
  const base = String(site.settings.site_url || "");
  // Miniature : celle de la plateforme (YouTube) — sinon image de marque du site (jamais d'URL inventée)
  const thumb = pv.thumb || String(site.settings.og_default_image || "");
  const absThumb = thumb.startsWith("http") ? thumb : base + thumb;
  // Date ISO d'upload : date de publication de la vidéo sur le site (source réelle, jamais inventée)
  const upRaw = String(v.published_at || v.created_at || "").trim();
  const uploadDate = upRaw.length >= 19 ? upRaw.slice(0, 19).replace(" ", "T") + "Z" : upRaw;
  // VideoObject : permet l'apparition dans Google Vidéo (résultats vidéo riches)
  const videoLd = [{
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: String(v.title || ""),
    description: plainText(String(v.description || ""), 600) || `Vidéo ${String(v.title || "Green FAD")} — ${String(site.settings.site_name || "GREEN FAD")}`,
    thumbnailUrl: [absThumb],
    ...(uploadDate ? { uploadDate } : {}),
    embedUrl: pv.embed.startsWith("http") ? pv.embed : undefined,
    contentUrl: String(v.source_url || "").startsWith("http") ? String(v.source_url) : undefined,
    publisher: { "@type": "Organization", name: String(site.settings.site_name || "GREEN FAD"), url: base, logo: { "@type": "ImageObject", url: base + String(site.settings.logo_key || "/assets/images/greenfad-logo.svg") } },
    ...(String(v.credit || "") ? { creditText: String(v.credit) } : {}),
  }];
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Vidéos", url: "/videos" }, { label: String(v.title) }])}<p class="eyebrow">Vidéo</p><h1>${esc(String(v.title))}</h1></div></section>
  <section class="container"><div class="video-wrap"><div class="video-embed"><iframe src="${esc(pv.embed)}" allowfullscreen title="${esc(String(v.title))}"></iframe></div>
  ${v.description ? `<div class="prose" style="margin-top:1.4rem">${esc(String(v.description))}</div>` : ""}
  ${v.credit ? `<p class="muted" style="margin-top:.6rem;font-size:.85rem">Source : ${esc(String(v.credit))}</p>` : ""}</div></section>
  ${others.length ? `<section class="container"><header class="sec-head"><h2>Autres vidéos</h2></header><div class="video-grid reveal">${others.map((o) => { const pvo = parseVideo(String(o.source_url || "")); return `<a class="video-card" href="/galerie/video/${o.id}"><span class="video-card__thumb">${pvo.thumb ? `<img src="${esc(pvo.thumb)}" alt="Miniature : ${esc(String(o.title))}" loading="lazy">` : `<span class="video-card__src">${esc(videoProviderLabel(pvo.provider))}</span>`}<span class="video-card__play"><span>${icon("play")}</span></span></span><span class="video-card__body"><h3>${esc(String(o.title))}</h3></span></a>`; }).join("")}</div>
  <p class="center" style="margin-top:1.8rem"><a class="btn btn--outline btn--sm" href="/videos">${icon("video", "i--inline")} Toutes les vidéos</a></p></section>` : ""}`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(v.title), description: plainText(String(v.description || ""), 155) || undefined, ogImage: absThumb, ogImageAlt: `Miniature vidéo : ${String(v.title)}`, ogType: "video.other", canonicalPath: `/galerie/video/${v.id}`, jsonLd: videoLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Vidéos", url: "/videos" }, { label: String(v.title) }] }), body));
});

// ---------- Vidéos : TOUTES les vidéos publiques (page « voir tout », 11/11/2026) ----------
// Demande du fondateur : « fais pareil pour les vidéos — menu + voir plus,
// ajoute plus de vidéos Greenfad depuis YouTube, Facebook et TikTok ».
// Toutes plateformes confondues (YouTube, Facebook, TikTok, Vimeo), filtre par
// catégorie côté client, tuile « source » sur les cartes sans miniature officielle.
publicRoutes.get("/videos", async (c) => {
  const vids = await q<Record<string, unknown>>(c.env.DB, "SELECT id, title, description, category, source_url, provider, credit, published_at FROM media_items WHERE type='video' AND status = ? ORDER BY sort_order, id", PUBLIE);
  const site = await loadSiteData(c);
  const hero = heroOf(site, "/videos", "Vidéos");
  const base = String(site.settings.site_url || "");
  // Catégories réellement présentes en base — aucune catégorie fictive
  const cats = new Map<string, number>();
  for (const v of vids) { const k = String(v.category || "").trim() || "Autres"; cats.set(k, (cats.get(k) || 0) + 1); }
  // ItemList de VideoObject : alimente Google Vidéo pour l'ensemble de la vidéothèque
  const videoLd = [{
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vidéos officielles GREEN FAD",
    numberOfItems: vids.length,
    itemListElement: vids.map((v, i) => {
      const pv = parseVideo(String(v.source_url || ""));
      const thumb = pv.thumb || String(site.settings.og_default_image || "");
      return {
        "@type": "ListItem", position: i + 1,
        item: {
          "@type": "VideoObject",
          name: String(v.title || ""),
          description: plainText(String(v.description || ""), 300) || `Vidéo ${String(v.title || "Green FAD")}`,
          thumbnailUrl: thumb.startsWith("http") ? thumb : base + thumb,
          ...(String(v.published_at || "") ? { uploadDate: String(v.published_at).slice(0, 19).replace(" ", "T") + "Z" } : {}),
          embedUrl: pv.embed.startsWith("http") ? pv.embed : undefined,
          url: `${base}/galerie/video/${v.id}`,
        },
      };
    }),
  }];
  const card = (v: Record<string, unknown>) => {
    const pv = parseVideo(String(v.source_url || ""));
    const cat = String(v.category || "").trim() || "Autres";
    return `<a class="video-card" data-cat="${esc(cat)}" href="/galerie/video/${v.id}">
      <span class="video-card__thumb">${pv.thumb ? `<img src="${esc(pv.thumb)}" alt="Miniature : ${esc(String(v.title || ""))}" loading="lazy">` : `<span class="video-card__src">${esc(videoProviderLabel(pv.provider))}</span>`}<span class="video-card__play"><span>${icon("play")}</span></span></span>
      <span class="video-card__body"><h3>${esc(String(v.title || ""))}</h3>${v.description ? `<p>${esc(String(v.description).slice(0, 120))}${String(v.description).length > 120 ? "…" : ""}</p>` : ""}${cat ? `<span class="tag">${esc(cat)}</span>` : ""}</span></a>`;
  };
  const chips = [...cats.entries()].map(([k, n]) => `<button type="button" class="chip" data-cat="${esc(k)}">${esc(k)} (${n})</button>`).join("");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Vidéos" }])}<p class="eyebrow">Media Center</p>
    <h1>${heroTitleHTML(hero)}</h1>${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  ${vids.length ? `<section class="container">
    <p class="docs-count" data-vids-count>${vids.length} vidéo${vids.length > 1 ? "s" : ""} — YouTube, Facebook, TikTok et plus</p>
    ${cats.size > 1 ? `<div class="chips docs-filters" role="group" aria-label="Filtrer par catégorie"><button type="button" class="chip is-on" data-cat="">Toutes (${vids.length})</button>${chips}</div>` : ""}
    <div class="video-grid reveal">${vids.map(card).join("")}</div>
  </section>
  <script>(function(){var b=document.querySelectorAll(".docs-filters .chip");var d=document.querySelectorAll(".video-card[data-cat]");if(!b.length)return;b.forEach(function(x){x.addEventListener("click",function(){b.forEach(function(y){y.classList.toggle("is-on",y===x);});var f=x.getAttribute("data-cat"),n=0;d.forEach(function(e){var s=!f||e.getAttribute("data-cat")===f;e.style.display=s?"":"none";if(s)n++;});var cc=document.querySelector("[data-vids-count]");if(cc)cc.textContent=n+(n>1?" vidéos publiées":" vidéo publiée");});});})();</script>`
  : `<section class="container center"><p class="muted">Les premières vidéos seront publiées prochainement.</p></section>`}`;
  const seo = await seoOf(c, site, "/videos", "Vidéos GREEN FAD");
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/videos", jsonLd: videoLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Vidéos" }] }), body));
});

// ---------- RÉFÉRENCES — clients & partenaires qui nous font confiance ----------
// Demande du fondateur (11/11/2026) : « Fais aussi pour la page références
// (RÉFÉRENCES — Ils nous font confiance) avec voir tous nos références, dans le
// menu, la page détail de chaque, et une gestion admin améliorée. »
// Données 100 % base (table partners) — aucun texte inventé : les champs laissés
// vides par l'administration ne s'affichent simplement pas.
publicRoutes.get("/references", async (c) => {
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT name, slug, sector, description, logo_key, url FROM partners WHERE status = ? AND slug IS NOT NULL AND slug != '' ORDER BY sort_order, name", PUBLIE);
  const site = await loadSiteData(c);
  const hero = heroOf(site, "/references", "Références");
  const base = String(site.settings.site_url || "");
  // ItemList d'organisations : alimente Google pour « références / clients Greenfad »
  const refLd = [{
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Références clients & partenaires GREEN FAD",
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({
      "@type": "ListItem", position: i + 1,
      item: {
        "@type": "Organization",
        name: String(r.name),
        url: `${base}/references/${r.slug}`,
        ...(r.logo_key ? { logo: { "@type": "ImageObject", url: `${base}${mediaSrc(String(r.logo_key))}` } } : {}),
        ...(r.sector ? { knowsAbout: String(r.sector) } : {}),
      },
    })),
  }];
  const card = (r: Record<string, unknown>) => {
    const logo = String(r.logo_key || "").startsWith("/") ? String(r.logo_key) : `/media/${r.logo_key}`;
    const desc = String(r.description || "").trim();
    return `<a class="ref-card" href="/references/${esc(String(r.slug))}">
      <span class="ref-card__logo">${r.logo_key ? `<img src="${esc(logo)}" alt="${esc(String(r.name))}" loading="lazy" decoding="async" width="320" height="200">` : `<span>${esc(String(r.name))}</span>`}</span>
      <span class="ref-card__body">
        <strong>${esc(String(r.name))}</strong>
        ${r.sector ? `<span class="tag">${esc(String(r.sector))}</span>` : ""}
        ${desc ? `<p>${esc(desc.slice(0, 140))}${desc.length > 140 ? "…" : ""}</p>` : ""}
        <span class="card__more">Voir la référence ${icon("arrow-right")}</span>
      </span></a>`;
  };
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Références" }])}<p class="eyebrow">Ils nous font confiance</p>
    <h1>${heroTitleHTML(hero)}</h1>
    ${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : `<p class="page-hero__text">Entreprises, institutions et organisations qui travaillent avec GREEN FAD — des collaborations réelles, menées du Mali vers l'international.</p>`}</div></section>
  ${rows.length ? `<section class="container">
    <p class="docs-count" data-refs-count>${rows.length} référence${rows.length > 1 ? "s" : ""} — clients, partenaires et institutions</p>
    <div class="ref-grid reveal" data-stagger>${rows.map(card).join("")}</div>
  </section>
  <section class="cta-band"><div class="container cta-band__inner reveal"><h2>Envie de rejoindre nos références ?</h2><p>Parlons de votre projet — nous répondons rapidement.</p><a class="btn btn--invert" href="/contact">${icon("arrow-right")} Démarrer la conversation</a></div></section>`
  : `<section class="container center"><p class="muted">Les premières références seront publiées prochainement.</p></section>`}`;
  const seo = await seoOf(c, site, "/references", "Références — Ils nous font confiance");
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description || "Les clients, partenaires et institutions qui font confiance à GREEN FAD — références réelles et collaborations vérifiables.", canonicalPath: "/references", jsonLd: refLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Références" }] }), body));
});

publicRoutes.get("/references/:slug", async (c) => {
  const r = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM partners WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!r || !String(r.slug || "")) return c.notFound();
  const site = await loadSiteData(c);
  const base = String(site.settings.site_url || "");
  const others = await q(c.env.DB, "SELECT name, slug, sector, logo_key FROM partners WHERE status = ? AND slug IS NOT NULL AND slug != '' AND id != ? ORDER BY sort_order, name LIMIT 12", PUBLIE, r.id);
  const logo = String(r.logo_key || "").startsWith("/") ? String(r.logo_key) : (r.logo_key ? `/media/${r.logo_key}` : "");
  const desc = String(r.description || "").trim();
  const sector = String(r.sector || "").trim();
  const refUrl = `${base}/references/${r.slug}`;
  const ld = [{
    "@context": "https://schema.org",
    "@type": "Organization",
    name: String(r.name),
    url: refUrl,
    ...(r.logo_key ? { logo: { "@type": "ImageObject", url: `${base}${mediaSrc(String(r.logo_key))}` } } : {}),
    ...(sector ? { knowsAbout: sector } : {}),
    ...(r.url ? { sameAs: [String(r.url)] } : {}),
    description: desc || `${String(r.name)} figure parmi les références qui font confiance à GREEN FAD.`,
  }];
  const body = `<section class="page-hero ref-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Références", url: "/references" }, { label: String(r.name) }])}<p class="eyebrow">Référence client & partenaire</p>
    <div class="ref-hero__row">
      ${logo ? `<span class="ref-hero__logo"><img src="${esc(logo)}" alt="Logo ${esc(String(r.name))}" width="320" height="200"></span>` : ""}
      <div><h1>${esc(String(r.name))}</h1>
      ${sector ? `<p class="ref-hero__sector"><span class="tag">${esc(sector)}</span></p>` : ""}</div>
    </div></div></section>
  <section class="container"><div class="article-grid">
    <article class="article prose reveal">
      ${desc ? md(desc) : `<p>${esc(String(r.name))} figure parmi les organisations qui nous font confiance. GREEN FAD accompagne ses partenaires avec la même exigence : des solutions numériques pensées pour les réalités du terrain africain.</p>`}
      ${r.url ? `<p><a class="btn btn--outline btn--sm" href="${esc(String(r.url))}" target="_blank" rel="noopener">${icon("external-link", "i--inline")} Site officiel de ${esc(String(r.name))}</a></p>` : ""}
    </article>
    <aside class="article-side">
      <div class="article-side__block"><h3>${icon("briefcase", "i--inline")} Travailler avec nous</h3><p class="muted">Vous souhaitez rejoindre nos références ou lancer votre projet ?</p><a class="btn btn--primary btn--sm" href="/contact">Nous contacter ${icon("arrow-right")}</a></div>
      <div class="article-side__block"><h3>${icon("share", "i--inline")} Partager</h3>${shareHTML(String(r.name), refUrl)}</div>
    </aside>
  </div></section>
  ${others.length ? `<section class="container"><header class="sec-head sec-head--left reveal"><p class="eyebrow">Références</p><h2>Autres organisations qui nous font confiance</h2></header>
    <div class="partners reveal" data-stagger>${others.map((o) => {
      const oSlug = String(o.slug || "");
      const oLogo = String(o.logo_key || "").startsWith("/") ? String(o.logo_key) : (o.logo_key ? `/media/${o.logo_key}` : "");
      const inner = oLogo ? `<img src="${esc(oLogo)}" alt="${esc(String(o.name))}" loading="lazy" decoding="async" width="320" height="200">` : `<span>${esc(String(o.name))}</span>`;
      return `<a class="partner" href="/references/${esc(oSlug)}" title="${esc(String(o.name))} — voir la référence">${inner}</a>`;
    }).join("")}</div>
    <p class="center" style="margin-top:1.8rem"><a class="btn btn--outline btn--sm" href="/references">Voir toutes nos références ${icon("arrow-right")}</a></p></section>` : ""}`;
  const seo = await seoOf(c, site, `/references/${r.slug}`, `${String(r.name)} — Référence GREEN FAD`);
  return c.html(await layout(c, site, await getPageSEO(c, {
    title: seo.title,
    description: plainText(desc, 155) || `${String(r.name)} fait partie des références qui font confiance à GREEN FAD.`,
    ogImage: logo ? mediaSrc(logo) : undefined,
    ogImageAlt: logo ? `Logo ${String(r.name)}` : undefined,
    canonicalPath: `/references/${r.slug}`,
    jsonLd: ld,
    crumbs: [{ label: "Accueil", url: "/" }, { label: "Références", url: "/references" }, { label: String(r.name) }],
  }), body));
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

  const hero = heroOf(site, "/blog", "Blog");
  const body = `<section class="page-hero blog-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Blog" }])}<p class="eyebrow">Blog GREEN FAD</p>
    <h1>${heroTitleHTML(hero)}</h1>
    ${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}
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
  const seo = await seoOf(c, site, "/blog", "Blog — Actualités, ingénierie et innovation");
  // Blog (CollectionPage) + liste des articles publiés : alimente Google pour « blog Greenfad »,
  // les recherches par thème et les résultats enrichis de la section Actualités.
  const baseBlog = String(site.settings.site_url || "");
  const blogLd = [{
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog ${String(site.settings.site_name || "GREEN FAD")}`,
    url: `${baseBlog}/blog`,
    description: seo.description || "Actualités, lancements produits, analyses technologiques et retours d'expérience écrits par les équipes Green FAD.",
    inLanguage: "fr",
    publisher: { "@type": "Organization", name: String(site.settings.site_name || "GREEN FAD"), logo: { "@type": "ImageObject", url: `${baseBlog}/assets/images/greenfad-logo.svg` } },
    blogPost: all.map((p) => ({ "@type": "BlogPosting", headline: String(p.title), url: `${baseBlog}/blog/${p.slug}`, datePublished: String(p.published_at || ""), image: p.cover_key ? `${baseBlog}${mediaSrc(String(p.cover_key))}` : undefined })),
  }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/blog", jsonLd: blogLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Blog" }] }), body));
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
  const hero = heroOf(site, "/blog/archives", "Archives");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Blog", url: "/blog" }, { label: "Archives" }])}<p class="eyebrow">Blog — archives</p>
    <h1>${esc(hero.title)}</h1>${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  <section class="container">${[...groups.entries()].map(([key, items]) => `<div class="archive-group reveal">
    <h2>${MONTHS[Number(key.slice(5, 7)) - 1] || key} ${key.slice(0, 4)} <span class="muted">(${items.length})</span></h2>
    <ul class="archive-list">${items.map((r) => `<li><span class="archive-list__date">${fmtDate(r.published_at, "short")}</span>${kindBadge(String(r.kind))}<a href="/blog/${esc(String(r.slug))}">${esc(String(r.title))}</a></li>`).join("")}</ul></div>`).join("")}
  ${!rows.length ? `<p class="center muted">Aucun article publié pour le moment.</p>` : ""}</section>`;
  const seo = await seoOf(c, site, "/blog/archives", "Archives du blog");
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/blog/archives", noindex: true }), body));
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
  const product = (p.product_slug
    ? await q1<{ slug: string; name: string }>(c.env.DB, "SELECT slug, name FROM products WHERE slug = ? AND status = ?", String(p.product_slug), PUBLIE)
    : null)
    || (p.related_product_id ? await q1<{ slug: string; name: string }>(c.env.DB, "SELECT slug, name FROM products WHERE slug IS NOT NULL AND (id = ? OR slug = ?)", p.related_product_id, String(p.related_product_id || "")) : null);

  const articleUrl = `${String(site.settings.site_url || c.env.SITE_URL || "https://greenfad.tech")}/blog/${p.slug}`;
  const tags = parseJSON<string[]>(p.tags, []);
  const ctArticle = ctaOf(site, "article");
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
    <div class="cards cards--3 reveal">${relatedFallback.map((o) => `<article class="card">${o.cover_key ? `<a class="card__media" href="/blog/${esc(String(o.slug))}"><img src="${esc(mediaSrc(String(o.cover_key)))}" alt="${esc(String(o.title))}" loading="lazy"></a>` : ""}<div class="card__body">${kindBadge(String(o.kind))}<h3><a href="/blog/${esc(String(o.slug))}">${esc(String(o.title))}</a></h3><p>${esc(String(o.excerpt || ""))}</p><span class="card__more">Lire ${icon("arrow-right")}</span></div></article>`).join("")}</div></section>` : ""}
  ${ctArticle ? ctaBandHTML(ctArticle) : ""}`;
  const jsonLd = [{
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: String(p.title),
    description: String(p.excerpt || excerptFromMd(p.content_md, 160)),
    datePublished: String(p.published_at || ""),
    dateModified: String(p.updated_at || p.published_at || ""),
    wordCount: String(p.content_md || "").split(/\s+/).filter(Boolean).length,
    author: { "@type": "Organization", name: String(p.author || site.settings.site_name || "GREEN FAD") },
    publisher: { "@type": "Organization", name: String(site.settings.site_name || "GREEN FAD"), logo: { "@type": "ImageObject", url: String(site.settings.site_url || "") + "/assets/images/greenfad-logo.svg" } },
    image: p.cover_key ? String(site.settings.site_url || "") + mediaSrc(String(p.cover_key)) : undefined,
    mainEntityOfPage: articleUrl,
    inLanguage: "fr",
  }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(p.meta_title || p.title), description: String(p.meta_description || p.excerpt || ""), ogImage: String(p.og_image || mediaSrc(String(p.cover_key))), ogType: "article", canonicalPath: `/blog/${p.slug}`, jsonLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Blog", url: "/blog" }, { label: String(p.title) }] }), body));
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
  const hero = heroOf(site, "/implantation", "Implantation");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Implantation" }])}<p class="eyebrow">Présence internationale</p>
    <h1>${heroTitleHTML(hero)}</h1>
    ${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  <section class="container"><div class="countries countries--modern reveal" data-stagger>${countriesCardsHTML(countries)}</div></section>`;
  const seo = await seoOf(c, site, "/implantation", "Implantation & présence internationale");
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/implantation", crumbs: [{ label: "Accueil", url: "/" }, { label: "Implantation" }] }), body));
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

// ---------- Ressources : TOUS les documents publics (page « voir tout », 10/11/2026) ----------
// Filtre par catégorie côté client (aucun rechargement), poids et date affichés,
// fichier manquant → tuile « en préparation » au lieu d'un lien cassé.
publicRoutes.get("/ressources", async (c) => {
  const docs = await q<Record<string, unknown>>(c.env.DB, "SELECT id, title, description, category, file_key, file_name, mime, size, published_at FROM documents WHERE status = 'publie' AND is_public = 1 ORDER BY id DESC LIMIT 200");
  const site = await loadSiteData(c);
  const hero = heroOf(site, "/ressources", "Ressources");
  // Catégories réellement présentes en base — aucune catégorie fictive
  const cats = new Map<string, number>();
  for (const d of docs) { const k = String(d.category || "").trim() || "Autres"; cats.set(k, (cats.get(k) || 0) + 1); }
  const docCard = (d: Record<string, unknown>) => {
    const fk = String(d.file_key || "");
    const isPdf = /pdf$/i.test(String(d.mime || "")) || /\.pdf$/i.test(fk);
    const cat = String(d.category || "").trim() || "Autres";
    const size = Number(d.size || 0);
    const meta = [size ? fmtBytes(size) : "", d.published_at ? fmtDate(String(d.published_at), "short") : ""].filter(Boolean) as string[];
    const metaHTML = (meta.length || !fk) ? `<span class="doc__meta">${meta.map((m) => `<small>${esc(m)}</small>`).join("")}${!fk ? `<span class="tag">Fichier en préparation</span>` : ""}</span>` : "";
    if (!fk) {
      return `<div class="doc doc--soon" title="Fichier en préparation"><span class="doc__icon">${icon("file-text")}</span><span><strong>${esc(String(d.title))}</strong>${d.description ? `<em>${esc(String(d.description))}</em>` : ""}${metaHTML}</span></div>`;
    }
    const href = fk.startsWith("/") ? fk : `/media/${esc(fk)}`;
    return `<a class="doc" data-cat="${esc(cat)}" href="${href}"${isPdf ? ' target="_blank" rel="noopener"' : ""}><span class="doc__icon">${icon(isPdf ? "file-text" : "folder")}</span><span><strong>${esc(String(d.title))}</strong>${d.description ? `<em>${esc(String(d.description))}</em>` : ""}${metaHTML}</span><span class="doc__arrow">${icon("download")}</span></a>`;
  };
  const chips = [...cats.entries()].map(([k, n]) => `<button type="button" class="chip" data-cat="${esc(k)}">${esc(k)} (${n})</button>`).join("");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Ressources" }])}<p class="eyebrow">Ressources</p>
    <h1>${heroTitleHTML(hero)}</h1>${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  ${docs.length ? `<section class="container">
    <p class="docs-count" data-docs-count>${docs.length} document${docs.length > 1 ? "s" : ""} public${docs.length > 1 ? "s" : ""} — librement téléchargeables</p>
    ${cats.size > 1 ? `<div class="chips docs-filters" role="group" aria-label="Filtrer par catégorie"><button type="button" class="chip is-on" data-cat="">Tous (${docs.length})</button>${chips}</div>` : ""}
    <div class="doc-list reveal" data-docs-list>${docs.map(docCard).join("")}</div>
  </section>
  <script>(function(){var b=document.querySelectorAll(".docs-filters .chip");var d=document.querySelectorAll(".doc[data-cat]");if(!b.length)return;b.forEach(function(x){x.addEventListener("click",function(){b.forEach(function(y){y.classList.toggle("is-on",y===x);});var f=x.getAttribute("data-cat"),n=0;d.forEach(function(e){var s=!f||e.getAttribute("data-cat")===f;e.style.display=s?"":"none";if(s)n++;});var c=document.querySelector("[data-docs-count]");if(c)c.textContent=n+(n>1?" documents publics":" document public");});});})();</script>` : `<section class="container center"><p class="muted">Les premiers documents seront publiés prochainement.</p></section>`}`;
  const seo = await seoOf(c, site, "/ressources", "Ressources & documentation");
  const base = String(site.settings.site_url || "");
  const itemListLd = [{ "@context": "https://schema.org", "@type": "ItemList", name: "Documents publics GREEN FAD", itemListElement: docs.filter((d) => String(d.file_key || "")).map((d, i) => ({ "@type": "ListItem", position: i + 1, name: String(d.title), url: `${base}${String(d.file_key).startsWith("/") ? d.file_key : `/media/${d.file_key}`}` })) }];
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/ressources", jsonLd: itemListLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Ressources" }] }), body));
});

// ---------- Presse ----------
publicRoutes.get("/presse/:slug", async (c) => {
  const pr = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM press_releases WHERE slug = ? AND status = ?", c.req.param("slug"), PUBLIE);
  if (!pr) return c.notFound();
  const site = await loadSiteData(c);
  const basePr = String(site.settings.site_url || "");
  const articleLd = [{
    "@context": "https://schema.org",
    "@type": "Article",
    headline: String(pr.title),
    description: String(pr.summary || excerptFromMd(pr.content_md, 160)),
    datePublished: String(pr.published_at || ""),
    dateModified: String(pr.updated_at || pr.published_at || ""),
    author: { "@type": "Organization", name: String(site.settings.site_name || "GREEN FAD") },
    publisher: { "@type": "Organization", name: String(site.settings.site_name || "GREEN FAD"), logo: { "@type": "ImageObject", url: `${basePr}/assets/images/greenfad-logo.svg` } },
    mainEntityOfPage: `${basePr}/presse/${pr.slug}`,
    inLanguage: "fr",
  }];
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Presse" }, { label: String(pr.title) }])}<p class="eyebrow">Communiqué</p><h1>${esc(String(pr.title))}</h1></div></section>
  <section class="container"><article class="article prose reveal">${md(pr.content_md)}
  ${pr.file_key ? `<p><a class="btn btn--outline" href="/media/${esc(String(pr.file_key))}" target="_blank" rel="noopener">${icon("download", "i--inline")} Télécharger le communiqué (PDF)</a></p>` : ""}</article></section>`;
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(pr.title), description: String(pr.summary || ""), canonicalPath: `/presse/${pr.slug}`, ogType: "article", jsonLd: articleLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Presse" }, { label: String(pr.title) }] }), body));
});

// ---------- Carrières ----------
publicRoutes.get("/carrieres", async (c) => {
  const jobs = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, department, location, contract_type, deadline FROM jobs WHERE status = ? AND is_open = 1 ORDER BY id DESC", PUBLIE);
  const site = await loadSiteData(c);
  const hero = heroOf(site, "/carrieres", "Carrières");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Carrières" }])}<p class="eyebrow">Carrières</p>
    <h1>${heroTitleHTML(hero)}</h1>${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  ${jobs.length ? `<section class="container"><div class="cards cards--2 reveal">${jobs
    .map((j) => `<article class="card"><div class="card__body">
      <div class="card__foot">${j.department ? `<span class="tag">${esc(String(j.department))}</span>` : ""}${j.contract_type ? `<span class="tag tag--navy">${esc(String(j.contract_type))}</span>` : ""}</div>
      <h3><a href="/carrieres/${esc(String(j.slug))}">${esc(String(j.title))}</a></h3>
      <div class="post-meta">${j.location ? `<span>${icon("map-pin")} ${esc(String(j.location))}</span>` : ""}${j.deadline ? `<span>${icon("clock")} Jusqu'au ${fmtDate(j.deadline, "short")}</span>` : ""}</div>
      <span class="card__more">Voir l'offre ${icon("arrow-right")}</span></div></article>`).join("")}</div></section>`
    : `<section class="container center"><div class="form-card" style="max-width:600px"><h2>Aucun poste ouvert actuellement</h2><p class="muted">Les prochaines opportunités seront publiées ici. Vous pouvez aussi nous envoyer une candidature spontanée via le formulaire de contact.</p><a class="btn btn--primary" href="/contact">Candidature spontanée ${icon("arrow-right")}</a></div></section>`}`;
  const seo = await seoOf(c, site, "/carrieres", "Carrières");
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/carrieres", crumbs: [{ label: "Accueil", url: "/" }, { label: "Carrières" }] }), body));
});

publicRoutes.get("/carrieres/:slug", async (c) => {
  const j = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM jobs WHERE slug = ? AND status = ? AND is_open = 1", c.req.param("slug"), PUBLIE);
  if (!j) return c.notFound();
  const site = await loadSiteData(c);
  const baseJob = String(site.settings.site_url || "");
  // JobPosting : alimente Google Jobs — uniquement des données réelles de l'offre
  const jobLd = [{
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: String(j.title),
    description: plainText(String(j.description_md || ""), 2400),
    datePosted: String(j.published_at || ""),
    ...(j.deadline ? { validThrough: `${String(j.deadline).slice(0, 10)}T23:59:59Z` } : {}),
    hiringOrganization: { "@type": "Organization", name: String(site.settings.site_name || "GREEN FAD"), url: baseJob, logo: { "@type": "ImageObject", url: `${baseJob}/assets/images/greenfad-logo.svg` } },
    ...(j.location ? { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: String(j.location), addressCountry: "ML" } } } : {}),
    ...(j.contract_type ? { employmentType: String(j.contract_type) } : {}),
    identifier: { "@type": "PropertyValue", name: String(site.settings.site_name || "GREEN FAD"), value: `carrieres-${String(j.slug)}` },
  }];
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
  return c.html(await layout(c, site, await getPageSEO(c, { title: String(j.title), description: excerptFromMd(j.description_md, 150), canonicalPath: `/carrieres/${j.slug}`, jsonLd: jobLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "Carrières", url: "/carrieres" }, { label: String(j.title) }] }), body));
});

// ---------- FAQ ----------
publicRoutes.get("/faq", async (c) => {
  const cats = await q(c.env.DB, "SELECT DISTINCT category FROM faqs WHERE status = 'publie' AND category IS NOT NULL");
  const rows = await q(c.env.DB, "SELECT question, answer, category FROM faqs WHERE status = 'publie' ORDER BY category, sort_order");
  const site = await loadSiteData(c);
  const hero = heroOf(site, "/faq", "FAQ");
  const grouped = new Map<string, { question: string; answer: string }[]>();
  for (const r of rows) {
    const key = String(r.category || "Général");
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push({ question: String(r.question), answer: String(r.answer) });
  }
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "FAQ" }])}<p class="eyebrow">Questions fréquentes</p>
    <h1>${heroTitleHTML(hero)}</h1>${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  <section class="container">${[...grouped.entries()].map(([cat, items]) => `
    <header class="sec-head sec-head--left reveal"><p class="eyebrow">${esc(cat)}</p></header>
    <div class="faq reveal" style="margin-bottom:2rem">${items.map((f) => `<details><summary>${esc(f.question)}</summary><div class="prose">${md(f.answer)}</div></details>`).join("")}</div>`).join("")}
    ${!rows.length ? `<p class="center muted">Aucune question publiée pour le moment.</p>` : ""}</section>`;
  const jsonLd = [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: rows.map((r) => ({ "@type": "Question", name: String(r.question), acceptedAnswer: { "@type": "Answer", text: String(r.answer).replace(/[#*>`]/g, "") } })) }];
  const seo = await seoOf(c, site, "/faq", "FAQ");
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/faq", jsonLd, crumbs: [{ label: "Accueil", url: "/" }, { label: "FAQ" }] }), body));
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
  const hero = heroOf(site, "/contact", "Contact");
  const body = `<section class="page-hero"><div class="page-hero__inner">${crumbsHTML([{ label: "Accueil", url: "/" }, { label: "Contact" }])}<p class="eyebrow">Contact</p>
    <h1>${heroTitleHTML(hero)}</h1>${hero.text ? `<p class="page-hero__text">${esc(hero.text)}</p>` : ""}</div></section>
  ${sent ? `<section class="container"><div class="form-card" id="merci"><div class="form-ok">${icon("check-circle")}<span><strong>Message bien reçu.</strong> Notre équipe revient vers vous très vite.</span></div><a class="btn btn--outline" href="/">Retour à l'accueil</a></div></section>` : ""}
  <section class="container"><div class="split split--contact">
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
  const seo = await seoOf(c, site, "/contact", "Contact");
  return c.html(await layout(c, site, await getPageSEO(c, { title: seo.title, description: seo.description, canonicalPath: "/contact", crumbs: [{ label: "Accueil", url: "/" }, { label: "Contact" }] }), body));
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

// ---------- SEO : sitemap + sitemap vidéo + sitemap images + robots + RSS ----------
// Objectif : dispersion maximale dans Google — pages, vidéos (Google Vidéo) et
// images (Google Images) chacune avec leur sitemap dédié, référencés dans robots.txt.
publicRoutes.get("/sitemap.xml", async (c) => {
  const base = String((await getSetting(c.env.DB, "site_url", c.env.SITE_URL)) as string);
  const [pages, posts, products, services, projects, countries, albums, press, jobs, partners] = await Promise.all([
    // is_home = 0 : la page « accueil » sert la homepage sur « / » — /p/accueil n'existe pas (404), on ne la soumet jamais
    q(c.env.DB, "SELECT slug, updated_at FROM pages WHERE status = ? AND is_home = 0", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM posts WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM products WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM services WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM projects WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM countries WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM media_albums WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM press_releases WHERE status = ?", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM jobs WHERE status = ? AND is_open = 1", PUBLIE),
    q(c.env.DB, "SELECT slug, updated_at FROM partners WHERE status = ? AND slug IS NOT NULL AND slug != ''", PUBLIE),
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
    { loc: "/videos", date: today, priority: "0.7" },
    ...albums.map((a) => ({ loc: `/galerie/album/${a.slug}`, date: String(a.updated_at).slice(0, 10), priority: "0.5" })),
    { loc: "/references", date: today, priority: "0.7" },
    ...partners.map((r) => ({ loc: `/references/${r.slug}`, date: String(r.updated_at).slice(0, 10), priority: "0.6" })),
    // /blog/archives volontairement absente : page utilitaire noindex,nofollow — soumettre une URL noindex génère
    // des erreurs « Submitted URL marked 'noindex' » dans Search Console
    { loc: "/blog", date: today, priority: "0.9" },
    ...posts.map((p) => ({ loc: `/blog/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.7" })),
    { loc: "/implantation", date: today, priority: "0.7" },
    ...countries.map((p) => ({ loc: `/implantation/${p.slug}`, date: String(p.updated_at).slice(0, 10), priority: "0.6" })),
    { loc: "/contact", date: today, priority: "0.6" },
    { loc: "/ressources", date: today, priority: "0.5" },
    { loc: "/carrieres", date: today, priority: "0.5" },
    ...jobs.map((j) => ({ loc: `/carrieres/${j.slug}`, date: String(j.updated_at).slice(0, 10), priority: "0.5" })),
    ...press.map((pr) => ({ loc: `/presse/${pr.slug}`, date: String(pr.updated_at).slice(0, 10), priority: "0.6" })),
    { loc: "/faq", date: today, priority: "0.4" },
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${base}${u.loc}</loc><lastmod>${u.date}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>`;
  return c.body(xml, 200, { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" });
});

// Sitemap vidéo (format Google : http://www.google.com/schemas/sitemap-video/1.1)
// → alimente directement Google Vidéo avec chaque page /galerie/video/:id.
publicRoutes.get("/sitemap-videos.xml", async (c) => {
  const base = String((await getSetting(c.env.DB, "site_url", c.env.SITE_URL)) as string);
  const ogDefault = String((await getSetting(c.env.DB, "og_default_image", "/assets/images/hero-image-modern.jpg")) as string);
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT id, title, description, source_url, provider, published_at FROM media_items WHERE type='video' AND status = ? ORDER BY id", PUBLIE);
  const entries = rows.map((v) => {
    const pv = parseVideo(String(v.source_url || ""));
    const thumb = pv.thumb || ogDefault;
    const up = String(v.published_at || "").slice(0, 19).replace(" ", "T") + "Z";
    const player = pv.embed.startsWith("http") ? pv.embed : `${base}/galerie/video/${v.id}`;
    return `<url><loc>${base}/galerie/video/${v.id}</loc><video:video><video:thumbnail_loc>${esc(thumb.startsWith("http") ? thumb : base + thumb)}</video:thumbnail_loc><video:title>${esc(String(v.title || "Vidéo Green FAD"))}</video:title><video:description>${esc(plainText(String(v.description || `Vidéo officielle Green FAD : ${String(v.title || "")}`), 600))}</video:description><video:content_loc>${esc(String(v.source_url || player))}</video:content_loc><video:player_loc>${esc(player)}</video:player_loc>${String(v.published_at || "") ? `<video:publication_date>${up}</video:publication_date>` : ""}<video:family_friendly>yes</video:family_friendly><video:live>no</video:live></video:video></url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.join("\n")}
</urlset>`;
  return c.body(xml, 200, { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" });
});

// Sitemap images (format Google : http://www.google.com/schemas/sitemap-image/1.1)
// → alimente Google Images : images produits, couvertures d'articles, albums photo, expertises.
publicRoutes.get("/sitemap-images.xml", async (c) => {
  const base = String((await getSetting(c.env.DB, "site_url", c.env.SITE_URL)) as string);
  const [products, posts, services, albums, partners] = await Promise.all([
    q(c.env.DB, "SELECT slug, name, image_key, updated_at FROM products WHERE status = ? AND image_key != ''", PUBLIE),
    q(c.env.DB, "SELECT slug, title, cover_key, updated_at FROM posts WHERE status = ? AND cover_key != ''", PUBLIE),
    q(c.env.DB, "SELECT slug, name, image_key, updated_at FROM services WHERE status = ? AND image_key != ''", PUBLIE),
    q(c.env.DB, "SELECT a.slug, a.name, a.updated_at, m.r2_key, m.alt, mi.title FROM media_albums a JOIN media_items mi ON mi.album_id = a.id AND mi.type = 'image' AND mi.status = 'publie' JOIN media m ON m.id = mi.media_id WHERE a.status = ? ORDER BY a.sort_order, mi.sort_order", PUBLIE),
    q(c.env.DB, "SELECT slug, name, logo_key FROM partners WHERE status = ? AND slug IS NOT NULL AND slug != '' AND logo_key != ''", PUBLIE),
  ]);
  const imgSrc = (k: unknown) => { const s = String(k || ""); return s.startsWith("/") ? base + s : `${base}/media/${s}`; };
  const imgBlock = (title: string, loc: string) => `<image:image><image:loc>${esc(loc)}</image:loc><image:title>${esc(title)}</image:title></image:image>`;
  // Un <url> par page, toutes les images de l'album regroupées dans le même bloc
  const albumImgs = new Map<string, { name: string; imgs: string[] }>();
  for (const a of albums) {
    const e = albumImgs.get(String(a.slug)) || { name: String(a.name), imgs: [] };
    e.imgs.push(imgBlock(String(a.title || a.alt || a.name), imgSrc(a.r2_key)));
    albumImgs.set(String(a.slug), e);
  }
  const urls: string[] = [
    `<url><loc>${base}/</loc>${imgBlock("GREEN FAD SARL — Entreprise technologique africaine", imgSrc("/assets/images/greenfad-logo.svg"))}</url>`,
    ...products.map((p) => `<url><loc>${base}/produits/${p.slug}</loc>${imgBlock(String(p.name), imgSrc(p.image_key))}</url>`),
    ...services.map((s) => `<url><loc>${base}/expertises/${s.slug}</loc>${imgBlock(String(s.name), imgSrc(s.image_key))}</url>`),
    ...posts.map((p) => `<url><loc>${base}/blog/${p.slug}</loc>${imgBlock(String(p.title), imgSrc(p.cover_key))}</url>`),
    ...partners.map((r) => `<url><loc>${base}/references/${r.slug}</loc>${imgBlock(`${r.name} — référence GREEN FAD`, imgSrc(r.logo_key))}</url>`),
    ...[...albumImgs.entries()].map(([slug, e]) => `<url><loc>${base}/galerie/album/${slug}</loc>${e.imgs.join("")}</url>`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;
  return c.body(xml, 200, { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" });
});

publicRoutes.get("/robots.txt", async (c) => {
  const base = String((await getSetting(c.env.DB, "site_url", c.env.SITE_URL)) as string);
  return c.body(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nDisallow: /__preview\n\nSitemap: ${base}/sitemap.xml\nSitemap: ${base}/sitemap-videos.xml\nSitemap: ${base}/sitemap-images.xml\n`, 200, { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" });
});

publicRoutes.get("/rss.xml", async (c) => {
  const base = String((await getSetting(c.env.DB, "site_url", c.env.SITE_URL)) as string);
  const siteName = String((await getSetting(c.env.DB, "site_name", "GREEN FAD")) as string);
  const seoDef = (await getSetting(c.env.DB, "seo_defaults", {})) as { default_description?: string };
  const rows = await q<Record<string, unknown>>(c.env.DB, "SELECT slug, title, excerpt, published_at FROM posts WHERE status = ? ORDER BY published_at DESC LIMIT 20", PUBLIE);
  const items = rows
    .map((p) => `<item><title>${esc(p.title)}</title><link>${base}/blog/${p.slug}</link><description>${esc(p.excerpt || "")}</description><pubDate>${new Date(String(p.published_at)).toUTCString()}</pubDate><guid>${base}/blog/${p.slug}</guid></item>`)
    .join("\n");
  return c.body(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(siteName)} — Blog technologique</title><link>${base}/blog</link><description>${esc(seoDef.default_description || "Actualités, ingénierie, produits et innovation")}</description>${items}</channel></rss>`, 200, { "content-type": "application/rss+xml; charset=utf-8" });
});
