// GREEN FAD — Layout du Dashboard (centre de contrôle)
import { Context } from "hono";
import { Env, SessionUser } from "../types";
import { esc } from "../utils";

export type AdminNavItem = { label: string; url: string; icon: string };

export const ADMIN_NAV: { group: string; items: AdminNavItem[] }[] = [
  { group: "Pilotage", items: [{ label: "Tableau de bord", url: "/admin", icon: "◎" }] },
  {
    group: "Contenus",
    items: [
      { label: "Pages & Page Builder", url: "/admin/pages", icon: "▤" },
      { label: "Produits", url: "/admin/products", icon: "◈" },
      { label: "Services & Expertises", url: "/admin/services", icon: "◉" },
      { label: "Blog & Actualités", url: "/admin/posts", icon: "✎" },
      { label: "Projets & Réalisations", url: "/admin/projects", icon: "▣" },
      { label: "Archives historiques", url: "/admin/archives", icon: "⌛" },
      { label: "Presse", url: "/admin/press", icon: "📣" },
      { label: "FAQ", url: "/admin/faqs", icon: "?" },
    ],
  },
  {
    group: "Réseau & Écosystème",
    items: [
      { label: "Pays", url: "/admin/countries", icon: "🌍" },
      { label: "Bureaux", url: "/admin/offices", icon: "🏢" },
      { label: "Équipe", url: "/admin/team", icon: "👥" },
      { label: "Partenaires", url: "/admin/partners", icon: "🤝" },
      { label: "Témoignages", url: "/admin/testimonials", icon: "❝" },
    ],
  },
  {
    group: "Médias & Documents",
    items: [
      { label: "Bibliothèque médias (R2)", url: "/admin/media", icon: "🖼️" },
      { label: "Documents", url: "/admin/documents", icon: "📁" },
    ],
  },
  {
    group: "Commercial",
    items: [
      { label: "Messages de contact", url: "/admin/messages", icon: "✉️" },
      { label: "Prospects & Devis", url: "/admin/leads", icon: "📈" },
      { label: "Carrières", url: "/admin/jobs", icon: "💼" },
      { label: "Newsletter", url: "/admin/newsletter", icon: "📧" },
    ],
  },
  {
    group: "Site & Système",
    items: [
      { label: "Menus", url: "/admin/menus", icon: "☰" },
      { label: "Pied de page", url: "/admin/footer", icon: "▁" },
      { label: "SEO & Redirections", url: "/admin/seo", icon: "🔍" },
      { label: "Paramètres & Identité", url: "/admin/settings", icon: "⚙️" },
      { label: "Utilisateurs & Permissions", url: "/admin/users", icon: "🔑" },
      { label: "Journal d'audit", url: "/admin/audit", icon: "🛡️" },
    ],
  },
];

export function adminLayout(c: Context<{ Bindings: Env }>, user: SessionUser, title: string, body: string, activeUrl = ""): string {
  const nav = ADMIN_NAV.map((g) => {
    const items = g.items
      .map((i) => `<a class="adm-nav__item ${activeUrl === i.url || (i.url !== "/admin" && activeUrl.startsWith(i.url + "/")) ? "is-active" : ""}" href="${i.url}"><span class="adm-nav__icon">${i.icon}</span>${esc(i.label)}</a>`)
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
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/admin.css?v=1">
</head>
<body class="adm">
<aside class="adm-side">
  <a class="adm-side__brand" href="/admin"><span class="adm-side__logo">GF</span><strong>GREEN FAD</strong><em>Centre de contrôle</em></a>
  <nav class="adm-nav" aria-label="Modules">${nav}</nav>
  <div class="adm-side__foot">
    <a href="/" target="_blank" class="adm-side__link">↗ Voir le site</a>
    <form method="post" action="/admin/logout"><input type="hidden" name="_csrf" value="${user.csrf}"><button type="submit" class="adm-side__link adm-side__link--danger">⏻ Déconnexion</button></form>
  </div>
</aside>
<div class="adm-main">
  <header class="adm-top">
    <h1 class="adm-top__title">${esc(title)}</h1>
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

export function adminLogin(title: string, error = "", email = ""): string {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Connexion — GREEN FAD Admin</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/admin.css?v=1"></head>
<body class="adm-login-bg"><div class="adm-login">
<div class="adm-login__brand"><span class="adm-side__logo">GF</span><div><strong>GREEN FAD</strong><em>Centre de contrôle numérique</em></div></div>
${error ? `<div class="adm-alert adm-alert--error">${esc(error)}</div>` : ""}
<form method="post" action="/admin/login" class="adm-login__form">
  <label>Email professionnel<input type="email" name="email" required autofocus value="${esc(email)}" autocomplete="username"></label>
  <label>Mot de passe<input type="password" name="password" required autocomplete="current-password"></label>
  <button class="btn btn--primary btn--full" type="submit">Se connecter</button>
  <p class="adm-login__hint">Accès réservé aux équipes autorisées GREEN FAD. Toutes les opérations sont journalisées.</p>
</form></div></body></html>`;
}
