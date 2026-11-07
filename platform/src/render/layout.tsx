// GREEN FAD — Layout public : navigation, footer, SEO pilotés par la base de données
import { Context } from "hono";
import { Env } from "../types";
import { q, loadSettings, getSetting, cached } from "../db";
import { esc, parseJSON } from "../utils";

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
    cached(c.env, "settings", 120, () => loadSettings(db)),
    cached(c.env, "menus", 120, () => q<{ location: string; items: string }>(db, "SELECT location, items FROM menus")),
    cached(c.env, "footer_sections", 120, () => q<Record<string, unknown>>(db, "SELECT * FROM footer_sections ORDER BY sort_order")),
  ]);
  const menus = Object.fromEntries(menuRows.map((m) => [m.location, parseJSON<MenuItem[]>(m.items, [])]));
  return {
    settings,
    header: menus.header || [],
    footerNav: menus.footer || [],
    footerSections: footRows,
  };
}

export async function cachedHeaderNav(c: Context<{ Bindings: Env }>): Promise<MenuItem[]> {
  return cached(c.env, "menus", 120, async () => {
    const rows = await q<{ location: string; items: string }>(c.env.DB, "SELECT location, items FROM menus");
    const m = Object.fromEntries(rows.map((r) => [r.location, parseJSON<MenuItem[]>(r.items, [])]));
    return m.header || [];
  });
}

export function footerMenu(items: MenuItem[]): string {
  return items.map((i) => `<li><a href="${esc(i.url)}">${esc(i.label)}</a>${i.children?.length ? `<ul>${i.children.map((c2) => `<li><a href="${esc(c2.url)}">${esc(c2.label)}</a></li>`).join("")}</ul>` : ""}</li>`).join("");
}

export type PageSEO = { title: string; description?: string; ogImage?: string; canonicalPath?: string; noindex?: boolean };

export async function layout(c: Context<{ Bindings: Env }>, site: SiteData, seo: PageSEO, body: string, opts?: { skipHeader?: boolean }): Promise<string> {
  const s = site.settings;
  const siteName = String(s.site_name || "GREEN FAD");
  const tagline = String(s.tagline || "");
  const phone = String(s.contact_phone || "");
  const email = String(s.contact_email || "");
  const address = String(s.contact_address || "");
  const logo = String(s.logo_key || "/assets/images/greenfad-logo-new.svg");
  const logoFooter = String(s.logo_footer_key || logo);
  const socials = parseJSON<Record<string, string>>(JSON.stringify(s.socials || "{}"), {});
  const url = new URL(c.req.url);
  const canonical = `${String(s.site_url || c.env.SITE_URL)}${seo.canonicalPath || url.pathname}`;
  const ogImg = seo.ogImage || String(s.og_default_image || "");
  const socialLinks: string[] = [];
  if (socials.facebook) socialLinks.push(`<a href="${esc(socials.facebook)}" aria-label="Facebook" target="_blank" rel="noopener">Facebook</a>`);
  if (socials.youtube) socialLinks.push(`<a href="${esc(socials.youtube)}" aria-label="YouTube" target="_blank" rel="noopener">YouTube</a>`);
  if (socials.tiktok) socialLinks.push(`<a href="${esc(socials.tiktok)}" aria-label="TikTok" target="_blank" rel="noopener">TikTok</a>`);
  if (socials.linkedin) socialLinks.push(`<a href="${esc(socials.linkedin)}" aria-label="LinkedIn" target="_blank" rel="noopener">LinkedIn</a>`);

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
<title>${esc(seo.title)}</title>
${seo.description ? `<meta name="description" content="${esc(seo.description)}">` : ""}
${seo.noindex ? `<meta name="robots" content="noindex,nofollow">` : `<meta name="robots" content="index,follow">`}
<link rel="canonical" href="${esc(canonical)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(siteName)}">
<meta property="og:title" content="${esc(seo.title)}">
${seo.description ? `<meta property="og:description" content="${esc(seo.description)}">` : ""}
<meta property="og:url" content="${esc(canonical)}">
${ogImg ? `<meta property="og:image" content="${esc(ogImg.startsWith("http") ? ogImg : String(s.site_url || "") + ogImg)}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: String(s.site_url || c.env.SITE_URL),
    logo: logo.startsWith("http") ? logo : String(s.site_url || "") + logo,
    description: tagline,
    address: address ? { "@type": "PostalAddress", streetAddress: address } : undefined,
    contactPoint: phone ? { "@type": "ContactPoint", telephone: phone, contactType: "customer service", availableLanguage: ["fr", "en"] } : undefined,
    sameAs: Object.values(socials).filter(Boolean),
  })}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/main.css?v=1">
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="site-head">
  <div class="container site-head__row">
    <a class="brand" href="/">
      <img src="${esc(logo.startsWith("/") ? logo : "/media/" + logo)}" alt="${esc(siteName)}" class="brand__logo">
      <span class="brand__txt"><strong>${esc(siteName)}</strong><em>${esc(tagline)}</em></span>
    </a>
    <nav class="nav" aria-label="Navigation principale"><ul>${navHtml}</ul></nav>
    <a class="btn btn--primary btn--sm site-head__cta" href="/contact">Nous contacter</a>
    <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-foot">
  <div class="container site-foot__grid">
    <div class="site-foot__brand">
      <img src="${esc(logoFooter.startsWith("/") ? logoFooter : "/media/" + logoFooter)}" alt="${esc(siteName)}" class="site-foot__logo">
      <p>${esc(tagline)}</p>
      ${address ? `<p class="muted">${esc(address)}</p>` : ""}
      ${phone ? `<p><a href="tel:${esc(phone.replace(/\s/g, ""))}">${esc(phone)}</a></p>` : ""}
      ${email ? `<p><a href="mailto:${esc(email)}">${esc(email)}</a></p>` : ""}
      ${socialLinks.length ? `<nav class="socials" aria-label="Réseaux sociaux">${socialLinks.join("")}</nav>` : ""}
    </div>
    ${site.footerNav.length ? `<nav class="site-foot__nav" aria-label="Pied de page"><h4>Navigation</h4><ul>${footerMenu(site.footerNav)}</ul></nav>` : ""}
    ${site.footerSections
      .map((sec) => {
        const content = parseJSON<{ text?: string; email?: string; items?: { label: string; url: string }[] }>(JSON.stringify(sec.content || "{}"), {});
        return `<div class="site-foot__sec"><h4>${esc(sec.title)}</h4>${content.text ? `<p class="muted">${esc(content.text)}</p>` : ""}${content.email ? `<p><a href="mailto:${esc(content.email)}">${esc(content.email)}</a></p>` : ""}${content.items?.length ? `<ul>${content.items.map((i) => `<li><a href="${esc(i.url)}">${esc(i.label)}</a></li>`).join("")}</ul>` : ""}</div>`;
      })
      .join("")}
  </div>
  <div class="container site-foot__legal">
    <p>© ${new Date().getFullYear()} ${esc(siteName)} — Tous droits réservés.</p>
    <p><a href="/mentions-legales">Mentions légales</a> · <a href="/confidentialite">Confidentialité</a> · <a href="/admin">Espace administrateur</a></p>
  </div>
</footer>
<script src="/js/site.js" defer></script>
</body></html>`;
}
