// GREEN FAD — Layout du Dashboard v2 (centre de contrôle)
// Navigation avec icônes SVG de la bibliothèque — aucun emoji.
import { Context } from "hono";
import { Env, SessionUser } from "../types";
import { esc } from "../utils";
import { icon } from "../icons";

export type AdminNavItem = { label: string; url: string; icon: string };

export const ADMIN_NAV: { group: string; items: AdminNavItem[] }[] = [
  { group: "Pilotage", items: [{ label: "Tableau de bord", url: "/admin", icon: "grid" }] },
  {
    group: "Contenus",
    items: [
      { label: "Pages & Page Builder", url: "/admin/pages", icon: "layers" },
      { label: "Produits technologiques", url: "/admin/products", icon: "package" },
      { label: "Jalons & chronologies", url: "/admin/jalons", icon: "route" },
      { label: "Versions produits", url: "/admin/versions", icon: "git-branch" },
      { label: "Publications du parcours", url: "/admin/publications", icon: "newspaper" },
      { label: "Sources & traçabilité", url: "/admin/sources", icon: "shield" },
      { label: "Services & Expertises", url: "/admin/services", icon: "briefcase" },
      { label: "Projets & Réalisations", url: "/admin/projects", icon: "award" },
      { label: "Blog & Publications", url: "/admin/posts", icon: "book-open" },
      { label: "Archives historiques", url: "/admin/archives", icon: "history" },
      { label: "Presse", url: "/admin/press", icon: "newspaper" },
      { label: "FAQ", url: "/admin/faqs", icon: "message-square" },
    ],
  },
  {
    group: "Réseau & Écosystème",
    items: [
      { label: "Pays & présence", url: "/admin/countries", icon: "globe" },
      { label: "Bureaux", url: "/admin/offices", icon: "building" },
      { label: "Équipe", url: "/admin/team", icon: "users" },
      { label: "Partenaires", url: "/admin/partners", icon: "link" },
      { label: "Témoignages", url: "/admin/testimonials", icon: "quote" },
    ],
  },
  {
    group: "Media Center",
    items: [
      { label: "Bibliothèque (R2)", url: "/admin/media", icon: "image" },
      { label: "Albums & galeries", url: "/admin/media/albums", icon: "folder" },
      { label: "Vidéos (URL)", url: "/admin/media/videos", icon: "video" },
      { label: "Documents", url: "/admin/documents", icon: "file-text" },
    ],
  },
  {
    group: "Commercial",
    items: [
      { label: "Messages de contact", url: "/admin/messages", icon: "inbox" },
      { label: "Prospects & Devis", url: "/admin/leads", icon: "trending-up" },
      { label: "Carrières", url: "/admin/jobs", icon: "wallet" },
      { label: "Newsletter", url: "/admin/newsletter", icon: "mail" },
    ],
  },
  {
    group: "Site & Système",
    items: [
      { label: "Menus", url: "/admin/menus", icon: "list" },
      { label: "Pied de page", url: "/admin/footer", icon: "route" },
      { label: "SEO & Redirections", url: "/admin/seo", icon: "search" },
      { label: "Paramètres & Identité", url: "/admin/settings", icon: "settings" },
      { label: "Utilisateurs & Permissions", url: "/admin/users", icon: "key" },
      { label: "Journal d'audit", url: "/admin/audit", icon: "shield" },
    ],
  },
];

export function adminLayout(c: Context<{ Bindings: Env }>, user: SessionUser, title: string, body: string, activeUrl = ""): string {
  const nav = ADMIN_NAV.map((g) => {
    const items = g.items
      .map((i) => `<a class="adm-nav__item ${activeUrl === i.url || (i.url !== "/admin" && activeUrl.startsWith(i.url + "/") && i.url !== "/admin/media") ? "is-active" : ""}" href="${i.url}"><span class="adm-nav__icon">${icon(i.icon)}</span>${esc(i.label)}</a>`)
      .join("");
    return `<div class="adm-nav__group"><p class="adm-nav__label">${esc(g.group)}</p>${items}</div>`;
  }).join("");

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${esc(title)} — GREEN FAD Admin</title>
<meta name="theme-color" content="#11243E">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" href="/assets/images/admin-icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="GF Admin">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/admin.css?v=4">
</head>
<body class="adm">
<div class="adm-backdrop" id="admBackdrop"></div>
<aside class="adm-side" id="admSide">
  <a class="adm-side__brand" href="/admin"><img src="/assets/images/greenfad-logo-white.svg" alt="GREEN FAD" class="adm-side__logoimg"></a>
  <nav class="adm-nav" aria-label="Modules">${nav}</nav>
  <div class="adm-side__foot">
    <button type="button" class="adm-side__link" id="admInstall" hidden>${icon("monitor", "i--inline")} Installer l'application</button>
    <a href="/" target="_blank" class="adm-side__link">${icon("external-link", "i--inline")} Voir le site</a>
    <form method="post" action="/admin/logout"><input type="hidden" name="_csrf" value="${user.csrf}"><button type="submit" class="adm-side__link adm-side__link--danger">${icon("log-out", "i--inline")} Déconnexion</button></form>
  </div>
</aside>
<div class="adm-main">
  <header class="adm-top">
    <div style="display:flex;align-items:center;gap:12px;min-width:0">
      <button class="adm-burger" id="admBurger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="admSide">${icon("menu")}</button>
      <h1 class="adm-top__title">${esc(title)}</h1>
    </div>
    <div class="adm-top__user">
      <span class="adm-top__role">${esc(user.name)} · ${esc(roleLabel(user.role))}</span>
      <span class="adm-top__avatar">${esc(user.name.slice(0, 1).toUpperCase())}</span>
    </div>
  </header>
  <main class="adm-content" id="main">
${body}
  </main>
</div>
<script src="/js/admin.js" defer></script>
<script>window.GF_CSRF=${JSON.stringify(user.csrf)};</script>
</body></html>`;
}

function roleLabel(role: string): string {
  const map: Record<string, string> = {
    super_admin: "Super administrateur",
    admin: "Administrateur",
    responsable_editorial: "Resp. éditorial",
    gestionnaire_produits: "Resp. produits",
    gestionnaire_services: "Resp. services",
    responsable_medias: "Resp. médias",
    responsable_commercial: "Resp. commercial",
    lecteur: "Lecteur-auditeur",
  };
  return map[role] || role;
}
