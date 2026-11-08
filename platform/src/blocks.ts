// GREEN FAD — Catalogue de blocs du Page Builder v2
// Chaque bloc possède un schéma zod validé CÔTÉ SERVEUR au save et au rendu.
// Les blocs "dynamiques" ne rendent QUE les données réelles publiées de la base.
// Aucun emoji : toutes les icônes proviennent de la bibliothèque SVG (icons.ts).
import { z } from "zod";
import { Env, ContentStatus } from "./types";
import { q, getSetting } from "./db";
import { md, esc, parseJSON, fmtDate } from "./utils";
import { icon } from "./icons";

const urlish = z.string().max(500).optional().or(z.literal(""));

// ---------- Schémas des blocs ----------
export const blockSchemas = {
  hero: z.object({
    title: z.string().min(1).max(200),
    subtitle: z.string().max(300).optional().or(z.literal("")),
    eyebrow: z.string().max(120).optional().or(z.literal("")),
    image_key: z.string().max(300).optional().or(z.literal("")),
    cta_label: z.string().max(80).optional().or(z.literal("")),
    cta_url: urlish,
    cta2_label: z.string().max(80).optional().or(z.literal("")),
    cta2_url: urlish,
    variant: z.enum(["gradient", "dark", "image", "split"]).default("gradient"),
  }),
  section_header: z.object({
    eyebrow: z.string().max(120).optional().or(z.literal("")),
    title: z.string().min(1).max(200),
    text: z.string().max(500).optional().or(z.literal("")),
    align: z.enum(["left", "center"]).default("center"),
  }),
  richtext: z.object({
    content_md: z.string().max(20000),
  }),
  image: z.object({
    image_key: z.string().min(1).max(300),
    alt: z.string().max(300).optional().or(z.literal("")),
    caption: z.string().max(400).optional().or(z.literal("")),
    width: z.enum(["contained", "full"]).default("contained"),
  }),
  gallery: z.object({
    items: z.array(z.object({ image_key: z.string().min(1), caption: z.string().max(300).optional().or(z.literal("")) })).max(24),
    columns: z.number().int().min(1).max(4).default(3),
  }),
  gallery_album: z.object({
    album_slug: z.string().min(1).max(120),
    limit: z.number().int().min(1).max(24).default(12),
    layout: z.enum(["grid", "featured"]).default("grid"),
  }),
  split: z.object({
    title: z.string().max(200),
    text_md: z.string().max(5000),
    image_key: z.string().max(300).optional().or(z.literal("")),
    image_side: z.enum(["left", "right"]).default("right"),
    cta_label: z.string().max(80).optional().or(z.literal("")),
    cta_url: urlish,
  }),
  cards: z.object({
    source: z.enum(["products", "services", "posts", "projects", "countries", "manual"]),
    limit: z.number().int().min(1).max(12).default(6),
    columns: z.number().int().min(2).max(4).default(3),
    view_all_label: z.string().max(80).optional().or(z.literal("")),
    view_all_url: urlish,
    // source=manual : contenu saisi par l'admin (aucune donnée fictive injectée par le système)
    items: z
      .array(
        z.object({
          title: z.string().min(1).max(200),
          text: z.string().max(600).optional().or(z.literal("")),
          image_key: z.string().max(300).optional().or(z.literal("")),
          url: urlish,
          icon: z.string().max(50).optional().or(z.literal("")),
        })
      )
      .max(12)
      .default([]),
  }),
  stats: z.object({
    items: z.array(z.object({ value: z.string().min(1).max(12), label: z.string().min(1).max(80) })).max(6),
    variant: z.enum(["light", "dark"]).default("dark"),
  }),
  cta: z.object({
    title: z.string().min(1).max(200),
    text: z.string().max(400).optional().or(z.literal("")),
    button_label: z.string().max(80),
    button_url: urlish,
    variant: z.enum(["solid", "outline"]).default("solid"),
  }),
  contact_form: z.object({
    title: z.string().max(150).optional().or(z.literal("")),
    intro: z.string().max(400).optional().or(z.literal("")),
    form_type: z.enum(["contact", "devis", "demo"]).default("contact"),
  }),
  faq: z.object({
    category: z.string().max(80).optional().or(z.literal("")),
    limit: z.number().int().min(1).max(20).default(8),
  }),
  team: z.object({
    limit: z.number().int().min(1).max(24).default(8),
  }),
  posts: z.object({
    limit: z.number().int().min(1).max(6).default(3),
    category: z.string().max(80).optional().or(z.literal("")),
  }),
  logo_marquee: z.object({
    source: z.enum(["products", "partners"]).default("products"),
    label: z.string().max(120).optional().or(z.literal("")),
  }),
  partners: z.object({
    limit: z.number().int().min(1).max(24).default(12),
  }),
  countries_map: z.object({}),
  timeline: z.object({
    title: z.string().max(200).optional().or(z.literal("")),
    items: z.array(z.object({ year: z.string().max(20), title: z.string().max(200), text: z.string().max(600).optional().or(z.literal("")) })).max(20),
  }),
  video: z.object({
    url: z.string().min(1).max(500),
    title: z.string().max(200).optional().or(z.literal("")),
  }),
  video_playlist: z.object({
    limit: z.number().int().min(1).max(12).default(6),
    category: z.string().max(80).optional().or(z.literal("")),
  }),
  document_list: z.object({
    category: z.string().max(80).optional().or(z.literal("")),
    limit: z.number().int().min(1).max(20).default(8),
  }),
  testimonials: z.object({
    limit: z.number().int().min(1).max(12).default(3),
  }),
  embed: z.object({
    code: z.string().max(4000),
  }),
  spacer: z.object({
    height: z.enum(["small", "medium", "large"]).default("medium"),
  }),
} as const;

export type BlockType = keyof typeof blockSchemas;

export type Block = { type: BlockType; visible?: boolean } & Record<string, unknown>;

export const BLOCK_LABELS: Record<BlockType, { label: string; group: string; desc: string }> = {
  hero: { label: "Bannière principale (Hero)", group: "Structure", desc: "Grande section d'ouverture avec titre, image et appels à l'action" },
  section_header: { label: "Titre de section", group: "Structure", desc: "Intertitre avec sur-titre et texte d'introduction" },
  richtext: { label: "Texte enrichi", group: "Contenu", desc: "Paragraphe libre en markdown (titres, listes, liens)" },
  image: { label: "Image", group: "Média", desc: "Image pleine largeur ou contenue, avec légende" },
  gallery: { label: "Galerie manuelle", group: "Média", desc: "Grille d'images choisies avec légendes" },
  gallery_album: { label: "Galerie d'album", group: "Média", desc: "Affiche les images d'un album du Media Center (grille ou mise en avant)" },
  video: { label: "Vidéo (URL)", group: "Média", desc: "Intégration YouTube ou Vimeo centrée" },
  video_playlist: { label: "Vidéos du Media Center", group: "Média", desc: "Grille des vidéos publiées dans le Media Center" },
  split: { label: "Image + Texte", group: "Structure", desc: "Deux colonnes : image d'un côté, texte de l'autre" },
  cards: { label: "Cartes (contenu dynamique)", group: "Contenu", desc: "Grille de cartes reliée aux produits, services, articles, projets ou saisie manuelle" },
  stats: { label: "Chiffres clés", group: "Contenu", desc: "Rangée de chiffres saisis par l'administration (aucun chiffre inventé)" },
  timeline: { label: "Chronologie", group: "Contenu", desc: "Jalons historiques avec année, titre et texte" },
  cta: { label: "Appel à l'action", group: "Conversion", desc: "Bandeau de conversion avec bouton" },
  contact_form: { label: "Formulaire", group: "Conversion", desc: "Contact, demande de devis ou de démonstration produit" },
  faq: { label: "FAQ", group: "Contenu", desc: "Questions-réponses publiées depuis le module FAQ" },
  team: { label: "Équipe", group: "Écosystème", desc: "Membres publiés du module Équipe" },
  posts: { label: "Aperçus du blog", group: "Contenu", desc: "Dernières publications réelles : couverture, type, date, résumé, lien vers l'article" },
  logo_marquee: { label: "Bandeau de logos animé", group: "Écosystème", desc: "Défilement continu des logos produits ou partenaires" },
  partners: { label: "Partenaires", group: "Écosystème", desc: "Logos et liens des partenaires publiés" },
  testimonials: { label: "Témoignages clients", group: "Écosystème", desc: "Témoignages réels validés par l'administration" },
  countries_map: { label: "Implantation internationale", group: "Écosystème", desc: "Carte des pays actifs et leurs bureaux" },
  document_list: { label: "Documents", group: "Contenu", desc: "Liste de documents publics par catégorie" },
  embed: { label: "Intégration HTML", group: "Avancé", desc: "Bloc HTML personnalisé (réservé aux administrateurs)" },
  spacer: { label: "Espacement", group: "Structure", desc: "Espace vertical discret entre sections" },
};

// ---------- Validation serveur ----------
/** Libellés des types de publication (blog) — utilisés par le bloc « posts » */
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

/**
 * Normalise une valeur « blocks » potentiellement mal formée saisie dans l'admin :
 * - {"blocks":[…]} (objet englobant) → déballe
 * - un objet bloc unique {type:…} → enveloppe dans un tableau
 * - chaîne JSON déjà parsée par le caller → laissé tel quel
 * Rend le save non bloquant pour les parcours Dashboard.
 */
export function normalizeBlocksInput(v: unknown): unknown {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const obj = v as Record<string, unknown>;
    if (Array.isArray(obj.blocks)) return obj.blocks;
    if (typeof obj.type === "string") return [v];
    // Objet sans type ni blocks (ex. {} collé par l'admin) → liste vide, pas d'erreur bloquante
    return [];
  }
  return v;
}

export function validateBlocks(blocks: unknown): { ok: true; blocks: Block[] } | { ok: false; error: string } {
  if (!Array.isArray(blocks)) return { ok: false, error: "les sections doivent être une liste de blocs (ex. : [{\"type\":\"hero\",\"title\":\"…\"}]) — ou vide pour désactiver" };
  if (blocks.length > 60) return { ok: false, error: "maximum 60 blocs par page" };
  const out: Block[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i] as Block;
    if (!b || typeof b !== "object" || typeof b.type !== "string") return { ok: false, error: `bloc #${i + 1} invalide` };
    const schema = blockSchemas[b.type as BlockType];
    if (!schema) return { ok: false, error: `type de bloc inconnu : ${b.type}` };
    const parsed = schema.safeParse(b);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return { ok: false, error: `bloc ${BLOCK_LABELS[b.type as BlockType]?.label || b.type} : ${issue.path.join(".")} — ${issue.message}` };
    }
    out.push({ ...parsed.data, type: b.type, visible: b.visible !== false });
  }
  return { ok: true, blocks: out };
}

// ---------- Rendu SSR ----------
type BlockCtx = { env: Env };

async function dynamicCards(db: D1Database, source: string, limit: number): Promise<{ title: string; text: string; image_key: string; url: string; icon: string; tag?: string }[]> {
  const pub: ContentStatus = "publie";
  const map = (rows: Record<string, unknown>[], base: string, titleF: string, textF: string, imgF: string, iconF?: string) =>
    rows.map((r) => ({ title: String(r[titleF] || ""), text: String(r[textF] || ""), image_key: String(r[imgF] || ""), url: `${base}/${r.slug}`, icon: iconF ? String(r[iconF] || "") : "" }));
  try {
    if (source === "products")
      return (await q(db, "SELECT slug, name, tagline, image_key, logo_key, category, state FROM products WHERE status=? ORDER BY sort_order LIMIT ?", pub, limit)).map((r) => ({
        title: String(r.name || ""),
        text: String(r.tagline || ""),
        image_key: String(r.logo_key || r.image_key || ""),
        url: `/produits/${r.slug}`,
        icon: "",
        tag: String(r.category || ""),
      }));
    if (source === "services") return map(await q(db, "SELECT slug, name, summary, image_key, icon FROM services WHERE status=? ORDER BY sort_order LIMIT ?", pub, limit), "/expertises", "name", "summary", "image_key", "icon");
    if (source === "posts") return map(await q(db, "SELECT slug, title, excerpt, cover_key FROM posts WHERE status=? ORDER BY published_at DESC LIMIT ?", pub, limit), "/blog", "title", "excerpt", "cover_key");
    if (source === "projects")
      return (await q(db, "SELECT slug, title, summary, image_key, category FROM projects WHERE status=? ORDER BY sort_order LIMIT ?", pub, limit)).map((r) => ({
        title: String(r.title || ""), text: String(r.summary || ""), image_key: String(r.image_key || ""), url: `/realisations/${r.slug}`, icon: "", tag: String(r.category || ""),
      }));
    if (source === "countries")
      return (await q(db, "SELECT slug, name, iso2, presentation_md FROM countries WHERE status=? ORDER BY sort_order LIMIT ?", pub, limit)).map((r) => ({
        title: String(r.name || ""),
        text: String(r.presentation_md || "").replace(/[#*>`]/g, "").slice(0, 140),
        image_key: "",
        url: `/implantation/${r.slug}`,
        icon: String(r.iso2 || "AF"),
      }));
  } catch (e) {
    console.error("dynamicCards", e);
  }
  return [];
}

function img(key: string, alt = "", cls = ""): string {
  if (!key) return "";
  const src = key.startsWith("/") ? key : `/media/${key}`;
  return `<img src="${esc(src)}" alt="${esc(alt)}" class="${cls}" loading="lazy">`;
}

function iconBadge(name: string): string {
  if (!name) return "";
  // Nom ISO2 (2 lettres majuscules) → badge pays ; sinon icône de la bibliothèque
  if (/^[A-Z]{2}$/.test(name)) return `<span class="country__code country__code--teal">${esc(name)}</span>`;
  return `<span class="card__icon">${icon(name)}</span>`;
}

/** Image logo → tuile douce (object-fit contain) ; photo → cadre plein (cover) */
function isLogoKey(key: string): boolean {
  return /-?logo[\w-]*\.(png|svg|jpe?g)$/i.test(key || "") || /logo[-_]?(key|main)\.(png|svg|jpe?g)$/i.test(key || "");
}

function cardMediaHTML(src: string, alt: string, url: string): string {
  if (!src) return "";
  const href = url || "#";
  if (isLogoKey(src)) {
    return `<a class="card__media card__media--logo" href="${esc(href)}"><img src="${esc(src.startsWith("/") ? src : "/media/" + src)}" alt="${esc(alt)}" loading="lazy"></a>`;
  }
  return `<a class="card__media" href="${esc(href)}"><img src="${esc(src.startsWith("/") ? src : "/media/" + src)}" alt="${esc(alt)}" loading="lazy"></a>`;
}

/** Analyse une URL YouTube/Vimeo → URL d'intégration officielle + miniature */
export function parseVideo(raw: string): { embed: string; thumb: string; provider: string } {
  const yt = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(raw);
  if (yt) return { embed: `https://www.youtube-nocookie.com/embed/${yt[1]}`, thumb: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`, provider: "youtube" };
  const vm = /vimeo\.com\/(?:video\/)?(\d{6,})/.exec(raw);
  if (vm) return { embed: `https://player.vimeo.com/video/${vm[1]}`, thumb: "", provider: "vimeo" };
  return { embed: raw, thumb: "", provider: "url" };
}

export async function renderBlock(b: Block, ctx: BlockCtx): Promise<string> {
  if (b.visible === false) return "";
  const p = b as unknown as Record<string, any>;
  switch (b.type) {
    case "hero": {
      const isImg = p.variant === "image" && p.image_key;
      const style = isImg ? `background-image:linear-gradient(rgba(10,19,43,.78),rgba(14,27,58,.9)),url('${esc(p.image_key.startsWith("/") ? p.image_key : "/media/" + p.image_key)}')` : "";
      // Badges du héros : 100 % pilotés par la base (settings → « hero_badges », JSON).
      // Aucun texte figé dans le code : si le setting est vide, la rangée ne s'affiche pas.
      // getSetting renvoie déjà la valeur parsée (tableau) — on accepte aussi une chaîne JSON.
      const rawBadges = await getSetting(ctx.env.DB, "hero_badges", []);
      const badgesList: { icon?: string; label: string }[] = Array.isArray(rawBadges)
        ? (rawBadges as { icon?: string; label: string }[])
        : parseJSON<{ icon?: string; label: string }[]>(String(rawBadges || "[]"), []);
      const badges = badgesList.length
        ? `<div class="hero__badges">${badgesList
            .map((bd, i) => `<span style="--d:${i * 110}ms">${icon(bd.icon || "shield")} ${esc(bd.label)}</span>`)
            .join("")}</div>`
        : "";
      return `<section class="hero hero--${esc(p.variant)}" ${style ? `style="${style}"` : ""}>
        <span class="hero__mark" aria-hidden="true"><svg viewBox="0 0 114 96" fill="none"><rect x="0" y="0" width="41.5" height="96" fill="currentColor" opacity=".55"/><g stroke="currentColor" stroke-width="2"><path d="M 14.6 1 H 112.5 V 96"/><path d="M 23.1 9.6 H 104.1 V 96"/><path d="M 31.2 17.5 H 95.4 V 96"/><path d="M 39.7 26.1 H 86.8 V 96"/><path d="M 14.6 1 V 55.7"/><path d="M 23.1 9.6 V 55.7"/><path d="M 31.2 17.5 V 55.7"/><path d="M 39.7 26.1 V 55.7"/><path d="M 48.9 55.7 V 34.5 H 78.7 V 96"/><path d="M 14.6 55.7 H 78.7"/><path d="M 14.6 64.6 H 78.7"/><path d="M 14.6 72.6 H 78.7"/><path d="M 14.6 81 H 78.7"/><path d="M 14.6 89.6 H 78.7"/></g></svg></span>
        <div class="container hero__inner reveal">
          ${p.eyebrow ? `<p class="eyebrow">${esc(p.eyebrow)}</p>` : ""}
          <h1>${esc(p.title)}</h1>
          ${p.subtitle ? `<p class="hero__sub">${esc(p.subtitle)}</p>` : ""}
          ${(p.cta_label || p.cta2_label) ? `<div class="hero__cta">${p.cta_label ? `<a class="btn btn--primary" href="${esc(p.cta_url || "/contact")}">${p.cta_label} ${icon("arrow-right")}</a>` : ""}${p.cta2_label ? `<a class="btn btn--ghost" href="${esc(p.cta2_url || "#")}">${esc(p.cta2_label)}</a>` : ""}</div>` : ""}
          ${badges}
        </div>
        <button class="hero__scroll" type="button" aria-label="Défiler vers le contenu">${icon("chevron-down")}</button>
      </section>`;
    }
    case "section_header":
      return `<div class="container"><header class="sec-head sec-head--${esc(p.align)} reveal">
        ${p.eyebrow ? `<p class="eyebrow">${esc(p.eyebrow)}</p>` : ""}
        <h2>${esc(p.title)}</h2>${p.text ? `<p class="sec-head__text">${esc(p.text)}</p>` : ""}</header></div>`;
    case "richtext":
      return `<section class="container prose reveal">${md(p.content_md)}</section>`;
    case "image": {
      const el = `<figure class="figure figure--${esc(p.width)} reveal">${img(p.image_key, p.alt || "")}${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}</figure>`;
      return p.width === "full" ? el : `<div class="container">${el}</div>`;
    }
    case "gallery": {
      const items = (p.items as { image_key: string; caption?: string }[]) || [];
      return `<div class="container"><div class="gallery gallery--${p.columns} reveal" data-lightbox>${items
        .map((it) => `<figure data-full="${esc(it.image_key.startsWith("/") ? it.image_key : "/media/" + it.image_key)}">${img(it.image_key, it.caption || "")}${it.caption ? `<figcaption>${esc(it.caption)}</figcaption>` : ""}</figure>`)
        .join("")}</div></div>`;
    }
    case "gallery_album": {
      const rows = await q(ctx.env.DB, "SELECT m.r2_key, m.alt, mi.title FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE mi.album_id = (SELECT id FROM media_albums WHERE slug = ?) AND mi.type='image' AND mi.status='publie' ORDER BY mi.sort_order LIMIT ?", p.album_slug, p.limit);
      if (!rows.length) return "";
      const gcls = p.layout === "featured" ? "gallery gallery--featured" : "gallery gallery--3";
      return `<div class="container"><div class="${gcls} reveal" data-lightbox>${rows
        .map((r) => {
          const src = String(r.r2_key || "").startsWith("/") ? String(r.r2_key) : `/media/${r.r2_key}`;
          return `<figure data-full="${esc(src)}">${img(src, String(r.title || r.alt || ""))}${r.title ? `<figcaption>${esc(r.title)}</figcaption>` : ""}</figure>`;
        })
        .join("")}</div><p class="center" style="margin-top:1.6rem"><a class="btn btn--outline btn--sm" href="/galerie">${icon("image", "i--inline")} Voir toute la galerie</a></p></div>`;
    }
    case "video": {
      const v = parseVideo(p.url);
      return `<div class="container"><div class="video-wrap reveal">${p.title ? `<h3>${esc(p.title)}</h3>` : ""}<div class="video-embed"><iframe src="${esc(v.embed)}" allowfullscreen loading="lazy" title="${esc(p.title || "Vidéo Green FAD")}"></iframe></div></div></div>`;
    }
    case "video_playlist": {
      const rows = await q(ctx.env.DB, "SELECT mi.title, mi.description, mi.source_url, mi.provider_id, mi.provider FROM media_items mi WHERE mi.type='video' AND mi.status='publie' AND (?1 = '' OR mi.category = ?1) ORDER BY mi.sort_order LIMIT ?2", p.category || "", p.limit);
      if (!rows.length) return "";
      return `<div class="container"><div class="video-grid reveal">${rows
        .map((r) => {
          const v = parseVideo(String(r.source_url || ""));
          const thumb = v.provider === "youtube" ? v.thumb : "";
          return `<a class="video-card" href="/galerie/video/${r.id}">
            <span class="video-card__thumb">${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy">` : ""}<span class="video-card__play"><span>${icon("play")}</span></span></span>
            <span class="video-card__body"><h3>${esc(String(r.title || ""))}</h3>${r.description ? `<p>${esc(String(r.description).slice(0, 120))}</p>` : ""}</span></a>`;
        })
        .join("")}</div></div>`;
    }
    case "split":
      return `<section class="container"><div class="split split--img-${esc(p.image_side)} reveal">
        ${p.image_key ? `<div class="split__media">${img(p.image_key, p.title)}</div>` : ""}
        <div class="split__body"><h2>${esc(p.title)}</h2><div class="prose">${md(p.text_md)}</div>
        ${p.cta_label ? `<a class="btn btn--outline" href="${esc(p.cta_url || "#")}">${esc(p.cta_label)} ${icon("arrow-right")}</a>` : ""}</div></div></section>`;
    case "cards": {
      let cards: { title: string; text: string; image_key: string; url: string; icon: string; tag?: string }[] =
        p.source === "manual"
          ? ((p.items as { title: string; text?: string; image_key?: string; url?: string; icon?: string }[]) || [])
              .filter((it) => it.title)
              .map((it) => ({ title: it.title, text: it.text || "", image_key: it.image_key || "", url: it.url || "", icon: it.icon || "" }))
          : await dynamicCards(ctx.env.DB, p.source, p.limit);
      if (!cards.length) return ""; // aucune donnée réelle publiée → la section ne s'affiche pas (aucune carte fictive)
      return `<section class="container"><div class="cards cards--${p.columns} reveal" data-stagger>${cards
        .map((it) => {
          const hasIso = /^[A-Z]{2}$/.test(it.icon || "");
          const media = it.image_key
            ? cardMediaHTML(it.image_key, it.title, it.url)
            : !it.icon
              ? `<a class="card__media card__media--empty" href="${esc(it.url || "#")}" aria-hidden="true" tabindex="-1">${icon("layers")}</a>`
              : "";
          const iconTile = !it.image_key && it.icon && !hasIso ? `<span class="card__icon">${icon(it.icon)}</span>` : "";
          const isoTile = !it.image_key && hasIso ? iconBadge(it.icon) : "";
          return `<article class="card">
            ${media}
            <div class="card__body">
              ${it.tag ? `<span class="tag">${esc(it.tag)}</span>` : ""}
              ${iconTile}${isoTile}
              <h3>${it.url ? `<a href="${esc(it.url)}">${esc(it.title)}</a>` : esc(it.title)}</h3>
              ${it.text ? `<p>${esc(it.text)}</p>` : ""}
              ${it.url ? `<span class="card__more">Découvrir ${icon("arrow-right")}</span>` : ""}
            </div></article>`;
        })
        .join("")}</div>${p.view_all_label && p.view_all_url ? `<p class="center" style="margin-top:2.2rem"><a class="btn btn--outline" href="${esc(p.view_all_url)}">${esc(p.view_all_label)} ${icon("arrow-right")}</a></p>` : ""}</section>`;
    }
    case "stats": {
      const items = (p.items as { value: string; label: string }[]) || [];
      if (!items.length) return "";
      return `<section class="stats stats--${esc(p.variant)}"><div class="stats__row reveal" data-stagger>${items
        .map((it) => `<div class="stat"><strong>${esc(it.value)}</strong><span>${esc(it.label)}</span></div>`)
        .join("")}</div></section>`;
    }
    case "cta":
      return `<section class="cta-band"><div class="container cta-band__inner reveal"><h2>${esc(p.title)}</h2>${p.text ? `<p>${esc(p.text)}</p>` : ""}<a class="btn btn--invert" href="${esc(p.button_url || "/contact")}">${esc(p.button_label)} ${icon("arrow-right")}</a></div></section>`;
    case "contact_form": {
      const isDevis = p.form_type === "devis";
      const isDemo = p.form_type === "demo";
      const action = isDevis ? "/devis" : isDemo ? "/contact" : "/contact";
      return `<section class="container" id="form-block"><div class="form-card reveal">
        ${p.title ? `<h2>${esc(p.title)}</h2>` : ""}${p.intro ? `<p class="muted">${esc(p.intro)}</p>` : ""}
        <form method="post" action="${action}" class="form-grid">
          <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          ${isDemo ? `<input type="hidden" name="subject" value="Demande de démonstration">` : ""}
          <label>Nom complet<input name="name" required maxlength="120"></label>
          <label>Email<input type="email" name="email" required maxlength="160"></label>
          <label>Téléphone<input name="phone" maxlength="40"></label>
          ${isDevis ? `<label>Société / Organisation<input name="company" maxlength="160"></label>` : isDemo ? `<label>Société / Organisation<input name="company" maxlength="160"></label>` : `<label>Objet<input name="subject" maxlength="150"></label>`}
          <label class="full">${isDevis ? "Décrivez votre besoin" : "Votre message"}<textarea name="message" rows="5" required maxlength="4000">${isDemo ? "Produit concerné et contexte d'utilisation : " : ""}</textarea></label>
          <button class="btn btn--primary btn--full" type="submit">${icon("send", "i--inline")} Envoyer</button>
        </form>
        <p class="form-note">Vos informations sont transmises de façon sécurisée et utilisées uniquement pour répondre à votre demande.</p>
        </div></section>`;
    }
    case "faq": {
      const rows = await q(ctx.env.DB, "SELECT question, answer FROM faqs WHERE status='publie' AND (?1 = '' OR category = ?1) ORDER BY sort_order LIMIT ?2", p.category || "", p.limit);
      if (!rows.length) return "";
      return `<section class="container"><div class="faq reveal">${rows
        .map((r) => `<details><summary>${esc(r.question)}</summary><div class="prose">${md(r.answer)}</div></details>`)
        .join("")}</div></section>`;
    }
    case "team": {
      const rows = await q(ctx.env.DB, "SELECT name, role, bio, photo_key FROM team_members WHERE status='publie' ORDER BY sort_order LIMIT ?", p.limit);
      if (!rows.length) return "";
      return `<section class="container"><div class="team-grid reveal">${rows
        .map((r) => `<article class="team-card">${img(r.photo_key as string, String(r.name), "team-card__photo")}<h3>${esc(r.name)}</h3>${r.role ? `<p class="eyebrow-sm">${esc(r.role)}</p>` : ""}${r.bio ? `<p>${esc(r.bio)}</p>` : ""}</article>`)
        .join("")}</div></section>`;
    }
    case "partners": {
      const rows = await q(ctx.env.DB, "SELECT name, logo_key, url FROM partners WHERE status='publie' ORDER BY sort_order LIMIT ?", p.limit);
      if (!rows.length) return "";
      return `<section class="container"><div class="partners reveal" data-stagger>${rows
        .map((r) => `<div class="partner">${r.logo_key ? `<img src="${esc(String(r.logo_key).startsWith("/") ? r.logo_key : "/media/" + r.logo_key)}" alt="${esc(r.name)}" loading="lazy">` : `<span>${esc(r.name)}</span>`}</div>`)
        .join("")}</div></section>`;
    }
    case "posts": {
      const rows = await q(ctx.env.DB, "SELECT slug, title, excerpt, cover_key, kind, category, author, published_at FROM posts WHERE status='publie' AND (?1 = '' OR category = ?1) ORDER BY published_at DESC LIMIT ?2", p.category || "", p.limit);
      if (!rows.length) return "";
      return `<section class="container"><div class="posts-grid reveal" data-stagger>${rows
        .map((r) => {
          const dt = String(r.published_at || "");
          const d = dt ? fmtDate(dt, "long") : "";
          const k = KIND_LABELS[String(r.kind || "")] || KIND_LABELS.article;
          return `<article class="post-card">
            <a class="post-card__media" href="/blog/${esc(String(r.slug))}">${
              r.cover_key ? img(String(r.cover_key), String(r.title)) : `<span class="post-card__noimg">${icon("newspaper")}</span>`
            }<span class="kind-badge${k.cls ? " " + k.cls : ""}">${icon(k.icon)} ${k.label}</span></a>
            <div class="post-card__body">
              <p class="post-card__meta">${d ? `<time datetime="${esc(dt.slice(0, 10))}">${esc(d)}</time>` : ""}</p>
              <h3><a href="/blog/${esc(String(r.slug))}">${esc(String(r.title))}</a></h3>
              ${r.excerpt ? `<p class="post-card__excerpt">${esc(String(r.excerpt).slice(0, 180))}</p>` : ""}
              <span class="post-card__more">Lire l'article ${icon("arrow-right")}</span>
            </div>
          </article>`;
        })
        .join("")}</div><p class="center" style="margin-top:2.2rem"><a class="btn btn--outline" href="/blog">Tous les articles du blog ${icon("arrow-right")}</a></p></section>`;
    }
    case "logo_marquee": {
      const src = p.source === "partners" ? "partners" : "products";
      const rows =
        src === "products"
          ? await q(ctx.env.DB, "SELECT name, COALESCE(logo_key, image_key) AS logo FROM products WHERE status='publie' AND COALESCE(logo_key, image_key) != '' ORDER BY sort_order")
          : await q(ctx.env.DB, "SELECT name, logo_key AS logo FROM partners WHERE status='publie' AND COALESCE(logo_key, '') != '' ORDER BY sort_order");
      if (!rows.length) return "";
      const tile = (name: string, logo: string) =>
        `<span class="marquee__item" title="${esc(name)}"><img src="${esc(String(logo).startsWith("/") ? logo : "/media/" + logo)}" alt="${esc(name)}" loading="lazy"></span>`;
      const sequence = rows.map((r) => tile(String(r.name), String(r.logo))).join("");
      return `<div class="marquee reveal" aria-label="${esc(p.label || "Produits Green FAD")}">
        <p class="marquee__label">${esc(p.label || "Nos produits")}</p>
        <div class="marquee__track"><div class="marquee__seq">${sequence}</div><div class="marquee__seq" aria-hidden="true">${sequence}</div></div>
      </div>`;
    }
    case "testimonials": {
      const rows = await q(ctx.env.DB, "SELECT author_name, author_role, company, quote, photo_key FROM testimonials WHERE status='publie' ORDER BY sort_order LIMIT ?", p.limit);
      if (!rows.length) return "";
      return `<section class="container"><div class="cards cards--3 reveal">${rows
        .map((r) => `<blockquote class="card quote"><span class="card__icon card__icon--gold">${icon("quote")}</span><p>« ${esc(r.quote)} »</p><footer><strong>${esc(String(r.author_name))}</strong>${r.author_role || r.company ? ` — ${esc([r.author_role, r.company].filter(Boolean).join(", "))}` : ""}</footer></blockquote>`)
        .join("")}</div></section>`;
    }
    case "countries_map": {
      const rows = await q(ctx.env.DB, "SELECT c.slug, c.name, c.iso2, c.is_registered, COUNT(o.id) AS offices FROM countries c LEFT JOIN offices o ON o.country_id = c.id AND o.status='publie' WHERE c.status='publie' GROUP BY c.id ORDER BY c.sort_order");
      if (!rows.length) return "";
      return `<section class="container"><div class="countries reveal" data-stagger>${rows
        .map((r) => `<a class="country" href="/implantation/${esc(r.slug)}"><span class="country__code${Number(r.is_registered) ? "" : " country__code--teal"}">${esc(String(r.iso2 || "AF"))}</span><h3>${esc(r.name)}</h3><p class="muted">${r.offices ? `${r.offices} bureau${Number(r.offices) > 1 ? "x" : ""}` : "Présence &amp; partenariats"}</p><span class="country__arrow">${icon("arrow-right")}</span></a>`)
        .join("")}</div></section>`;
    }
    case "timeline": {
      const items = (p.items as { year: string; title: string; text?: string }[]) || [];
      if (!items.length) return "";
      return `<section class="container">${p.title ? `<header class="sec-head"><h2>${esc(p.title)}</h2></header>` : ""}<ol class="timeline reveal" data-stagger>${items
        .map((it) => `<li><span class="timeline__year">${esc(it.year)}</span><div><h3>${esc(it.title)}</h3>${it.text ? `<p>${esc(it.text)}</p>` : ""}</div></li>`)
        .join("")}</ol></section>`;
    }
    case "document_list": {
      const rows = await q(ctx.env.DB, "SELECT id, title, description, category, file_key, file_name, mime FROM documents WHERE status='publie' AND is_public=1 AND (?1 = '' OR category = ?1) ORDER BY id DESC LIMIT ?2", p.category || "", p.limit);
      if (!rows.length) return "";
      return `<section class="container"><div class="doc-list reveal">${rows
        .map((r) => {
          const isPdf = /pdf$/.test(String(r.mime || ""));
          const href = String(r.file_key).startsWith("/") ? r.file_key : `/media/${r.file_key}`;
          return `<a class="doc" href="${esc(href)}"${isPdf ? ' target="_blank" rel="noopener"' : ""}><span class="doc__icon">${icon(isPdf ? "file-text" : "folder")}</span><span><strong>${esc(r.title)}</strong>${r.description ? `<em>${esc(r.description)}</em>` : ""}</span><span class="doc__arrow">${icon("download")}</span></a>`;
        })
        .join("")}</div></section>`;
    }
    case "embed":
      return `<section class="container">${p.code}</section>`; // réservé super_admin/admin, validé côté serveur
    case "spacer":
      return `<div class="spacer spacer--${esc(p.height)}"></div>`;
    default:
      return "";
  }
}

export async function renderBlocks(blocks: Block[], env: Env): Promise<string> {
  const out: string[] = [];
  for (const b of blocks) out.push(await renderBlock(b, { env }));
  return out.join("\n");
}
