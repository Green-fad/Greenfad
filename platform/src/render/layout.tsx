// GREEN FAD — Layout public v2 : navigation, footer, SEO pilotés par la base de données
import { Context } from "hono";
import { Env } from "../types";
import { q, loadSettings, cached } from "../db";
import { esc, parseJSON } from "../utils";
import { icon } from "../icons";

export type MenuItem = { label: string; url: string; children?: MenuItem[] };

export type SiteData = {
  settings: Record<string, unknown>;
  header: MenuItem[];
  footerNav: MenuItem[];
  footerSections: Record<string, unknown>[];
};

export async function loadSiteData(c: Context<{ Bindings: Env }>): Promise<SiteData> {
  const db = c.env.DB;
  const [settings, menuRows, footRows] = await Promise.all([
    cached(c.env, "settings", 3600, () => loadSettings(db)),
    cached(c.env, "menus", 3600, () => q<{ location: string; items: string }>(db, "SELECT location, items FROM menus")),
    cached(c.env, "footer_sections", 3600, () => q<Record<string, unknown>>(db, "SELECT * FROM footer_sections ORDER BY sort_order")),
  ]);
  const menus = Object.fromEntries(menuRows.map((m) => [m.location, parseJSON<MenuItem[]>(m.items, [])]));
  return {
    settings,
    header: menus.header || [],
    footerNav: menus.footer || [],
    footerSections: footRows,
  };
}

export function footerMenu(items: MenuItem[]): string {
  return items
    .map((i) => `<li><a href="${esc(i.url)}">${esc(i.label)}</a>${i.children?.length ? `<ul>${i.children.map((c2) => `<li><a href="${esc(c2.url)}">${esc(c2.label)}</a></li>`).join("")}</ul>` : ""}</li>`)
    .join("");
}

export type Crumb = { label: string; url?: string };

export function crumbsHTML(crumbs: Crumb[]): string {
  if (!crumbs.length) return "";
  const parts = crumbs.map((cr, idx) =>
    idx === crumbs.length - 1 || !cr.url
      ? `<span>${esc(cr.label)}</span>`
      : `<a href="${esc(cr.url)}">${esc(cr.label)}</a><span class="crumbs__sep">${icon("chevron-right", "")}</span>`
  );
  return `<nav class="crumbs" aria-label="Fil d'Ariane">${parts.join("")}</nav>`;
}

export type PageSEO = {
  title: string;
  description?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: string;
  canonicalPath?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
  crumbs?: Crumb[];
};

export async function layout(c: Context<{ Bindings: Env }>, site: SiteData, seo: PageSEO, body: string, opts?: { skipHeader?: boolean }): Promise<string> {
  const s = site.settings;
  const siteName = String(s.site_name || "GREEN FAD");
  const tagline = String(s.tagline || "");
  const phone = String(s.contact_phone || "");
  const email = String(s.contact_email || "");
  const address = String(s.contact_address || "");
  const logo = String(s.logo_key || "/assets/images/greenfad-logo.svg");
  const logoFooter = String(s.logo_footer_key || "/assets/images/greenfad-logo-white.svg");
  const socials = parseJSON<Record<string, string>>(JSON.stringify(s.socials || "{}"), {});
  // Bouton CTA de l'entête : 100 % piloté par les paramètres (label + URL). Vide → masqué.
  const headCtaLabel = String(s.header_cta_label || "");
  const headCtaUrl = String(s.header_cta_url || "/contact");
  const url = new URL(c.req.url);
  const siteUrl = String(s.site_url || c.env.SITE_URL || "https://greenfad.tech");
  const canonical = `${siteUrl}${seo.canonicalPath || url.pathname}`;
  const ogImg = seo.ogImage || String(s.og_default_image || "");

  const jsonLd: (Record<string, unknown> | null)[] = [null];
  // L'Organization est émise sur toutes les pages ; les types spécifiques viennent s'ajouter
  if (seo.jsonLd?.length) jsonLd.push(...seo.jsonLd);
  if (seo.crumbs?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: seo.crumbs.map((cr, i) => ({ "@type": "ListItem", position: i + 1, name: cr.label, item: cr.url ? siteUrl + cr.url : undefined })),
    });
  }
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: logo.startsWith("http") ? logo : siteUrl + logo,
    description: tagline,
    address: address ? { "@type": "PostalAddress", streetAddress: address } : undefined,
    contactPoint: phone ? { "@type": "ContactPoint", telephone: phone, contactType: "customer service", availableLanguage: ["fr", "en"] } : undefined,
    sameAs: Object.values(socials).filter(Boolean),
  };
  const jsonLdHTML = [organizationLd, ...jsonLd].filter(Boolean).map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n");

  const socialIconMap: Record<string, string> = { facebook: "globe", youtube: "play", tiktok: "video", linkedin: "briefcase" };
  const socialLinks: string[] = [];
  for (const [name, url2] of Object.entries(socials)) {
    if (!url2) continue;
    socialLinks.push(`<a href="${esc(url2)}" aria-label="${esc(name)}" target="_blank" rel="noopener" title="${esc(name)}">${icon(socialIconMap[name] || "globe")}</a>`);
  }

  const navHtml = site.header
    .map((i) => {
      const active = url.pathname === i.url || (i.url !== "/" && url.pathname.startsWith(i.url + "/")) ? ' class="active"' : "";
      return `<li><a href="${esc(i.url)}"${active}>${esc(i.label)}</a>${i.children?.length ? `<ul class="submenu">${i.children.map((c2) => `<li><a href="${esc(c2.url)}">${esc(c2.label)}</a></li>`).join("")}</ul>` : ""}</li>`;
    })
    .join("");

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script>document.documentElement.classList.add("js")</script>
<meta name="theme-color" content="#11243E">
<title>${esc(seo.title)}</title>
${seo.description ? `<meta name="description" content="${esc(seo.description)}">` : ""}
${seo.noindex ? `<meta name="robots" content="noindex,nofollow">` : `<meta name="robots" content="index,follow">`}
<link rel="canonical" href="${esc(canonical)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="${esc(seo.ogType || "website")}">
<meta property="og:site_name" content="${esc(siteName)}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${esc(seo.title)}">
${seo.description ? `<meta property="og:description" content="${esc(seo.description)}">` : ""}
<meta property="og:url" content="${esc(canonical)}">
${ogImg ? `<meta property="og:image" content="${esc(ogImg.startsWith("http") ? ogImg : siteUrl + ogImg)}">` : ""}
${ogImg ? `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(seo.title)}">${seo.description ? `<meta name="twitter:description" content="${esc(seo.description)}">` : ""}<meta name="twitter:image" content="${esc(ogImg.startsWith("http") ? ogImg : siteUrl + ogImg)}">` : `<meta name="twitter:card" content="summary">`}
${ogImg ? `<meta property="og:image:alt" content="${esc(seo.ogImageAlt || seo.title)}">` : ""}
${jsonLdHTML}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/main.css?v=6">
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="site-head">
  <div class="container site-head__row">
    <a class="brand" href="/">
      <img src="${esc(logo.startsWith("/") ? logo : "/media/" + logo)}" alt="${esc(siteName)} — ${esc(tagline)}" class="brand__logo">
    </a>
    <nav class="nav" id="mainnav" aria-label="Navigation principale"><ul>${navHtml}</ul></nav>
    ${headCtaLabel ? `<a class="btn btn--primary btn--sm site-head__cta" href="${esc(headCtaUrl)}">${esc(headCtaLabel)}</a>` : ""}
    <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mainnav">${icon("menu")}</button>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-foot">
  <div class="container site-foot__grid">
    <div class="site-foot__brand">
      <img src="${esc(logoFooter.startsWith("/") ? logoFooter : "/media/" + logoFooter)}" alt="${esc(siteName)}" class="site-foot__logo">
      ${(() => {
        const ent = site.footerSections.find((sec) => String(sec.section_key) === "entreprise");
        if (!ent) return `<p>${esc(tagline)}</p>`;
        const rawEnt = typeof ent.content === "string" ? ent.content : JSON.stringify(ent.content || "{}");
        const entData = parseJSON<{ text?: string }>(rawEnt || "{}", {});
        return `<p>${esc(entData.text || tagline)}</p>`;
      })()}
      ${address ? `<p><span class="i i--inline">${icon("map-pin")}</span>${esc(address)}</p>` : ""}
      ${phone ? `<p><a href="tel:${esc(phone.replace(/\s/g, ""))}">${esc(phone)}</a></p>` : ""}
      ${email ? `<p><a href="mailto:${esc(email)}">${esc(email)}</a></p>` : ""}
      ${socialLinks.length ? `<nav class="socials" aria-label="Réseaux sociaux">${socialLinks.join("")}</nav>` : ""}
    </div>
    ${site.footerNav.length ? `<nav class="site-foot__nav" aria-label="Pied de page"><h4>Navigation</h4><ul>${footerMenu(site.footerNav)}</ul></nav>` : ""}
    ${site.footerSections
      .filter((sec) => !["entreprise", "contact"].includes(String(sec.section_key || "")))
      .map((sec) => {
        // Le contenu peut arriver en objet D1 (colonne JSON) ou en string JSON — normaliser ici
        const raw = typeof sec.content === "string" ? sec.content : JSON.stringify(sec.content || "{}");
        const content = parseJSON<{ text?: string; email?: string; items?: { label: string; url: string }[] }>(raw || "{}", {});
        return `<div class="site-foot__sec"><h4>${esc(sec.title)}</h4>${content.text ? `<p>${esc(content.text)}</p>` : ""}${content.email ? `<p><a href="mailto:${esc(content.email)}">${esc(content.email)}</a></p>` : ""}${content.items?.length ? `<ul>${content.items.map((i) => `<li><a href="${esc(i.url)}">${esc(i.label)}</a></li>`).join("")}</ul>` : ""}</div>`;
      })
      .join("")}
  </div>
  <div class="container site-foot__legal">
    <p>© ${new Date().getFullYear()} ${esc(siteName)} — Tous droits réservés.</p>
    <p><a href="/p/mentions-legales">Mentions légales</a> · <a href="/p/confidentialite">Confidentialité</a></p>
  </div>
</footer>
<script src="/js/site.js" defer></script>
</body></html>`;
}
