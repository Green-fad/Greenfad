// GREEN FAD — Dashboard : modules système (auth, accueil, médias R2, utilisateurs, menus, SEO, paramètres, audit)
import { Hono, Context } from "hono";
import { Env, ROLES, Role } from "../types";
import { q, q1, count, loadSettings, setSetting, invalidateCache } from "../db";
import { adminLayout, ADMIN_NAV } from "../render/admin";
import { hashPassword, verifyPassword, createSession, destroySession, rateLimit, resetRateLimit, clientIp } from "../auth";
import { can } from "../rbac";
import { audit } from "../audit";
import { saveToR2, deleteMedia, isAllowedMime } from "../media";
import { esc, fmtDate, fmtBytes, parseJSON, slugify } from "../utils";

export function adminCore(): Hono<{ Bindings: Env }> {
  const r = new Hono<{ Bindings: Env }>();
  const deny = (c: Context<{ Bindings: Env }>, perm: string, action: "view" | "create" | "edit" | "delete" | "publish" = "view") => {
    const user = c.get("user")!;
    if (!can(user.role, perm, action)) return c.html(adminLayout(c, user, "Accès refusé", `<div class="adm-alert adm-alert--error">Permission refusée (contrôle serveur RBAC).</div>`), 403);
    return null;
  };

  // ---------- CONNEXION ----------
  r.get("/login", (c) => {
    if (c.get("user")) return c.redirect("/admin");
    return c.html(adminLoginHTML(c.req.query("error"), c.req.query("email") || ""));
  });

  r.post("/login", async (c) => {
    const ip = clientIp(c);
    const limited = await rateLimit(c, `login:${ip}`, 6, 900);
    if (!limited) {
      await audit(c, "login_refuse_rate_limit", "users", null, { ip });
      return c.html(adminLoginHTML("Trop de tentatives. Réessayez dans 15 minutes."), 429);
    }
    const form = await c.req.parseBody().catch(() => null);
    const email = form && typeof form !== "string" ? String(form.email || "").trim().toLowerCase() : "";
    const password = form && typeof form !== "string" ? String(form.password || "") : "";
    if (!email || !password) return c.html(adminLoginHTML("Email et mot de passe requis.", email), 400);
    const user = await q1<{ id: number; email: string; name: string; role: string; password_hash: string; password_salt: string; is_active: number }>(c.env.DB, "SELECT * FROM users WHERE email = ? AND is_active = 1", email);
    if (!user || !(await verifyPassword(password, user.password_hash, user.password_salt))) {
      await audit(c, "login_echec", "users", null, { email, ip });
      return c.html(adminLoginHTML("Identifiants invalides.", email), 401);
    }
    await resetRateLimit(c, `login:${ip}`);
    await createSession(c, { userId: user.id, email: user.email, name: user.name, role: user.role as Role });
    await c.env.DB.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").bind(user.id).run();
    await audit(c, "login_succes", "users", user.id);
    return c.redirect("/admin");
  });

  r.post("/logout", async (c) => {
    const user = c.get("user");
    await audit(c, "logout", "users", user?.userId);
    await destroySession(c);
    return c.redirect("/admin/login");
  });

  // ---------- TABLEAU DE BORD ----------
  r.get("/", async (c) => {
    const user = c.get("user")!;
    const db = c.env.DB;
    const [pagesP, pagesD, posts, postsDraft, products, services, projects, countries, mediaCount, msgsNew, leadsNew, subs, jobsOpen] = await Promise.all([
      count(db, "pages", "status='publie'"), count(db, "pages", "status='brouillon'"),
      count(db, "posts", "status='publie'"), count(db, "posts", "status='brouillon'"),
      count(db, "products", "status='publie'"), count(db, "services", "status='publie'"),
      count(db, "projects", "status='publie'"), count(db, "countries", "status='publie'"),
      count(db, "media"), count(db, "contact_messages", "status='nouveau'"), count(db, "leads", "status='nouveau'"),
      count(db, "newsletter_subscribers", "status='actif'"), count(db, "jobs", "is_open=1 AND status='publie'"),
    ]);
    const recentAudit = await q(db, "SELECT * FROM audit_log ORDER BY id DESC LIMIT 8");
    const recentMsgs = await q(db, "SELECT * FROM contact_messages ORDER BY id DESC LIMIT 5");
    const recentPosts = await q(db, "SELECT id, title, status, published_at FROM posts ORDER BY id DESC LIMIT 5");

    const stat = (v: number | string, label: string, url: string, accent = "") =>
      `<a class="adm-stat ${accent}" href="${url}"><strong>${v}</strong><span>${esc(label)}</span></a>`;

    const body = `
    <p class="adm-intro">Bonjour ${esc(user.name)} — voici l'état réel de la plateforme. Toutes les données proviennent de la base D1 de production.</p>
    <div class="adm-stats">
      ${stat(`${pagesP}/${pagesD}`, "Pages publiées / brouillons", "/admin/pages")}
      ${stat(`${posts}/${postsDraft}`, "Articles publiés / brouillons", "/admin/posts")}
      ${stat(products, "Produits publiés", "/admin/products")}
      ${stat(services, "Services publiés", "/admin/services")}
      ${stat(projects, "Réalisations", "/admin/projects")}
      ${stat(countries, "Pays actifs", "/admin/countries")}
      ${stat(mediaCount, "Médias dans R2", "/admin/media")}
      ${stat(jobsOpen, "Offres d'emploi ouvertes", "/admin/jobs")}
    </div>
    <div class="adm-stats">
      ${stat(msgsNew, "Nouveaux messages", "/admin/messages", "warn")}
      ${stat(leadsNew, "Nouveaux prospects", "/admin/leads", "warn")}
      ${stat(subs, "Abonnés newsletter", "/admin/newsletter")}
    </div>
    <div class="adm-two">
      <section class="adm-panel"><h3>Derniers messages</h3>${recentMsgs.length
        ? `<ul class="adm-list">${recentMsgs.map((m) => `<li><a href="/admin/messages/${m.id}"><strong>${esc(m.name)}</strong> <span class="muted">${esc(String(m.subject || ""))}</span> <em>${fmtDate(String(m.created_at), "short")}</em></a></li>`).join("")}</ul>` : `<p class="muted">Aucun message.</p>`}</section>
      <section class="adm-panel"><h3>Derniers articles</h3>${recentPosts.length
        ? `<ul class="adm-list">${recentPosts.map((p) => `<li><a href="/admin/posts/${p.id}"><strong>${esc(p.title)}</strong> <em>${esc(String(p.status))}</em></a></li>`).join("")}</ul>` : `<p class="muted">Aucun article.</p>`}</section>
    </div>
    <section class="adm-panel"><h3>Journal d'audit — dernières opérations</h3>
      ${recentAudit.length ? `<table class="adm-table"><thead><tr><th>Quand</th><th>Qui</th><th>Action</th><th>Objet</th></tr></thead><tbody>${recentAudit
        .map((a) => `<tr><td class="muted">${fmtDate(String(a.created_at), "short")} ${esc(String(a.created_at).slice(11, 19))}</td><td>${esc(a.user_email)}</td><td><code>${esc(a.action)}</code></td><td class="muted">${esc([a.entity, a.entity_id].filter(Boolean).join(" #"))}</td></tr>`)
        .join("")}</tbody></table>` : `<p class="muted">Aucune opération journalisée.</p>`}
    </section>`;
    return c.html(adminLayout(c, user, "Tableau de bord", body, "/admin"));
  });

  // ---------- MÉDIAS (R2) ----------
  r.get("/media", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "media", "view");
    if (d) return d;
    const folder = c.req.query("folder") || "/";
    const rows = await q(c.env.DB, "SELECT * FROM media WHERE folder = ? ORDER BY id DESC LIMIT 120", folder === "documents" ? "documents" : "/");
    const canUp = can(user.role, "media", "create");
    const canDel = can(user.role, "media", "delete");

    const itemHtml = (m: Record<string, unknown>) => {
      const isImg = /image/.test(String(m.mime || ""));
      const preview = isImg ? `<img src="/media/${esc(m.r2_key)}" alt="${esc(String(m.alt || m.filename))}" loading="lazy">` : `<div class="media-item__doc">📄</div>`;
      const delForm = canDel
        ? `<form method="post" action="/admin/media/${m.id}/delete" data-confirm="Supprimer ce média de R2 et de la base ?"><input type="hidden" name="_csrf" value="${user.csrf}"><button class="btn btn--sm btn--danger">Suppr.</button></form>`
        : "";
      return `<div class="media-item">${preview}
        <div class="media-item__meta"><strong title="${esc(String(m.filename))}">${esc(String(m.filename).slice(0, 30))}</strong><span class="muted">${fmtBytes(Number(m.size))}</span>
        <span class="muted">${esc(String(m.r2_key))}</span></div>
        <div class="media-item__actions"><button class="btn btn--sm" data-copy="/media/${esc(String(m.r2_key))}">Copier l'URL</button>${delForm}</div></div>`;
    };

    const uploadBar = canUp
      ? `<form method="post" action="/admin/media/upload" enctype="multipart/form-data" class="adm-upload"><input type="hidden" name="_csrf" value="${user.csrf}"><input type="hidden" name="folder" value="${folder === "documents" ? "docs" : "media"}"><input type="file" name="file" multiple required><button class="btn btn--primary">⬆ Téléverser</button></form>`
      : "";

    const grid = rows.map(itemHtml).join("");
    const emptyNote = `<div class="adm-empty">Bibliothèque vide — téléversez vos premières images${canUp ? " ci-dessus" : ""}.</div>`;

    const body = `<div class="adm-toolbar">
      <div class="adm-filters"><a class="chip ${folder === "/" ? "is-on" : ""}" href="/admin/media">Images</a><a class="chip ${folder === "documents" ? "is-on" : ""}" href="/admin/media?folder=documents">Documents</a></div>
      ${uploadBar}
    </div>
    ${rows.length === 0 ? emptyNote : `<div class="media-grid">${grid}</div>`}`;
    return c.html(adminLayout(c, user, "Bibliothèque médias (R2)", body, "/admin/media"));
  });

  r.post("/media/upload", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "media", "create");
    if (d) return d;
    const form = (await c.req.parseBody({ all: true }).catch(() => ({}))) as Record<string, unknown>;
    const folder = form["folder"] === "docs" ? "docs" : "media";
    const rawFiles = form["file"];
    const files = Array.isArray(rawFiles) ? rawFiles : [rawFiles];
    let n = 0;
    for (const f of files) {
      if (f instanceof File && f.size > 0) {
        const key = await saveToR2(c, f, folder);
        if (key) n++;
        else await audit(c, "upload_refuse", "media", null, { file: f.name, mime: f.type });
      }
    }
    await audit(c, "upload_medias", "media", null, { nombre: n });
    return c.redirect("/admin/media" + (folder === "docs" ? "?folder=documents" : ""));
  });

  r.post("/media/:id/delete", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "media", "delete");
    if (d) return d;
    const m = await q1<{ r2_key: string }>(c.env.DB, "SELECT r2_key FROM media WHERE id = ?", c.req.param("id"));
    if (m) {
      await deleteMedia(c, m.r2_key);
      await audit(c, "suppression_media", "media", c.req.param("id"), { key: m.r2_key });
    }
    return c.redirect(c.req.header("referer") || "/admin/media");
  });

  // ---------- MESSAGES ----------
  r.get("/messages", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "contact_messages", "view");
    if (d) return d;
    const rows = await q(c.env.DB, "SELECT * FROM contact_messages ORDER BY id DESC LIMIT 100");
    const body = `<table class="adm-table"><thead><tr><th>#</th><th>Reçu</th><th>Nom</th><th>Objet</th><th>Statut</th><th></th></tr></thead><tbody>${rows
      .map((m) => `<tr><td>${m.id}</td><td class="muted">${fmtDate(String(m.created_at), "short")}</td><td><strong>${esc(m.name)}</strong><br><span class="muted">${esc(m.email)}</span></td><td>${esc(String(m.subject || m.message || "").slice(0, 60))}</td><td><span class="pill ${m.status === "nouveau" ? "warn" : m.status === "traite" ? "ok" : ""}">${esc(m.status)}</span></td><td class="adm-actions"><a class="btn btn--sm" href="/admin/messages/${m.id}">Ouvrir</a></td></tr>`)
      .join("")}</tbody></table>`;
    return c.html(adminLayout(c, user, "Messages de contact", body, "/admin/messages"));
  });

  r.get("/messages/:id", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "contact_messages", "view");
    if (d) return d;
    const m = await q1<Record<string, unknown>>(c.env.DB, "SELECT * FROM contact_messages WHERE id = ?", c.req.param("id"));
    if (!m) return c.notFound();
    await c.env.DB.prepare("UPDATE contact_messages SET status = 'lu' WHERE id = ? AND status = 'nouveau'").bind(m.id).run();
    const body = `<div class="adm-panel"><p class="muted">${fmtDate(String(m.created_at))}</p>
      <h3>${esc(String(m.subject || "Sans objet"))}</h3>
      <p><strong>${esc(String(m.name))}</strong> — <a href="mailto:${esc(String(m.email))}">${esc(String(m.email))}</a>${m.phone ? ` — ${esc(String(m.phone))}` : ""}</p>
      <div class="prose">${esc(String(m.message)).replace(/\n/g, "<br>")}</div></div>
      <div class="adm-form__actions">
      ${can(user.role, "contact_messages", "edit") ? `<form method="post" action="/admin/messages/${m.id}/status"><input type="hidden" name="_csrf" value="${user.csrf}"><input type="hidden" name="status" value="traite"><button class="btn btn--primary">Marquer traité</button></form>` : ""}
      ${can(user.role, "contact_messages", "delete") ? `<form method="post" action="/admin/messages/${m.id}/delete" data-confirm="Supprimer ce message ?"><input type="hidden" name="_csrf" value="${user.csrf}"><button class="btn btn--danger">Supprimer</button></form>` : ""}</div>`;
    return c.html(adminLayout(c, user, `Message #${m.id}`, body, "/admin/messages"));
  });

  r.post("/messages/:id/status", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "contact_messages", "edit");
    if (d) return d;
    const form = await c.req.parseBody();
    const status = typeof form !== "string" && ["nouveau", "lu", "traite", "archive"].includes(String(form.status)) ? String(form.status) : "lu";
    await c.env.DB.prepare("UPDATE contact_messages SET status = ? WHERE id = ?").bind(status, c.req.param("id")).run();
    await audit(c, "statut_message", "contact_messages", c.req.param("id"), { status });
    return c.redirect("/admin/messages");
  });

  r.post("/messages/:id/delete", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "contact_messages", "delete");
    if (d) return d;
    await c.env.DB.prepare("DELETE FROM contact_messages WHERE id = ?").bind(c.req.param("id")).run();
    await audit(c, "suppression_message", "contact_messages", c.req.param("id"));
    return c.redirect("/admin/messages");
  });

  // ---------- UTILISATEURS ----------
  r.get("/users", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "users", "view");
    if (d) return d;
    const rows = await q(c.env.DB, "SELECT id, email, name, role, is_active, last_login_at, created_at FROM users ORDER BY id");
    const body = `<div class="adm-toolbar"><span class="muted">8 rôles disponibles — les permissions sont vérifiées côté serveur sur chaque requête.</span>
      ${can(user.role, "users", "create") ? `<a class="btn btn--primary adm-new" href="/admin/users/new">+ Nouvel utilisateur</a>` : ""}</div>
    <table class="adm-table"><thead><tr><th>#</th><th>Nom</th><th>Email</th><th>Rôle</th><th>Actif</th><th>Dernière connexion</th><th></th></tr></thead><tbody>${rows
      .map((u) => `<tr><td>${u.id}</td><td><strong>${esc(u.name)}</strong></td><td>${esc(u.email)}</td><td>${esc(String(u.role))}</td><td>${u.is_active ? "✔" : "✖"}</td><td class="muted">${u.last_login_at ? fmtDate(String(u.last_login_at), "short") : "—"}</td>
      <td class="adm-actions">${can(user.role, "users", "edit") ? `<a class="btn btn--sm" href="/admin/users/${u.id}">Modifier</a>` : ""}${can(user.role, "users", "delete") && u.id !== user.userId ? `<form method="post" action="/admin/users/${u.id}/delete" data-confirm="Supprimer cet utilisateur ?"><input type="hidden" name="_csrf" value="${user.csrf}"><button class="btn btn--sm btn--danger">Suppr.</button></form>` : ""}</td></tr>`)
      .join("")}</tbody></table>`;
    return c.html(adminLayout(c, user, "Utilisateurs & permissions", body, "/admin/users"));
  });

  r.get("/users/new", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "users", "create");
    if (d) return d;
    const body = `<form method="post" action="/admin/users" class="adm-form">
      <input type="hidden" name="_csrf" value="${user.csrf}">
      <label class="adm-field"><span>Nom complet *</span><input name="name" required maxlength="120"></label>
      <label class="adm-field"><span>Email professionnel *</span><input type="email" name="email" required maxlength="160"></label>
      <label class="adm-field"><span>Rôle *</span><select name="role">${ROLES.map((r2) => `<option value="${r2.value}">${esc(r2.label)}</option>`).join("")}</select></label>
      <label class="adm-field"><span>Mot de passe initial *</span><input name="password" type="password" required minlength="10" autocomplete="new-password"><small>Minimum 10 caractères. L'utilisateur devra le changer (indiqué à sa première connexion).</small></label>
      <div class="adm-form__actions"><button class="btn btn--primary" type="submit">Créer le compte</button><a class="btn" href="/admin/users">Annuler</a></div></form>`;
    return c.html(adminLayout(c, user, "Nouvel utilisateur", body, "/admin/users"));
  });

  r.post("/users", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "users", "create");
    if (d) return d;
    const form = await c.req.parseBody();
    if (typeof form === "string") return c.redirect("/admin/users/new");
    const email = String(form.email || "").trim().toLowerCase();
    const name = String(form.name || "").trim();
    const password = String(form.password || "");
    const role = ROLES.find((r2) => r2.value === form.role)?.value || "lecteur";
    if (!email.includes("@") || !name || password.length < 10) return c.html(adminLayout(c, user, "Erreur", `<div class="adm-alert adm-alert--error">Champs invalides (mot de passe ≥ 10 caractères).</div><a class="btn" href="/admin/users/new">Retour</a>`), 400);
    const exists = await q1(c.env.DB, "SELECT id FROM users WHERE email = ?", email);
    if (exists) return c.html(adminLayout(c, user, "Erreur", `<div class="adm-alert adm-alert--error">Cet email possède déjà un compte.</div><a class="btn" href="/admin/users/new">Retour</a>`), 400);
    const { hash, salt } = await hashPassword(password);
    await c.env.DB.prepare("INSERT INTO users (email, password_hash, password_salt, name, role, is_active, must_change_password, created_at) VALUES (?1,?2,?3,?4,?5,1,1,datetime('now'))").bind(email, hash, salt, name, role).run();
    await audit(c, "creation_utilisateur", "users", null, { email, role });
    return c.redirect("/admin/users");
  });

  r.get("/users/:id", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "users", "edit");
    if (d) return d;
    const u = await q1<Record<string, unknown>>(c.env.DB, "SELECT id, email, name, role, is_active FROM users WHERE id = ?", c.req.param("id"));
    if (!u) return c.notFound();
    const body = `<form method="post" action="/admin/users/${u.id}" class="adm-form">
      <input type="hidden" name="_csrf" value="${user.csrf}">
      <label class="adm-field"><span>Nom</span><input name="name" value="${esc(String(u.name))}" required></label>
      <label class="adm-field"><span>Email</span><input type="email" name="email" value="${esc(String(u.email))}" required></label>
      <label class="adm-field"><span>Rôle</span><select name="role">${ROLES.map((r2) => `<option value="${r2.value}" ${u.role === r2.value ? "selected" : ""}>${esc(r2.label)}</option>`).join("")}</select></label>
      <label class="adm-field adm-field--check"><input type="checkbox" name="is_active" value="1" ${u.is_active ? "checked" : ""}><span>Compte actif</span></label>
      <label class="adm-field adm-field--check"><input type="checkbox" name="reset_password" value="1"><span>Réinitialiser le mot de passe</span><small>Si coché, définissez le champ ci-dessous (≥ 10 caractères).</small></label>
      <label class="adm-field"><span>Nouveau mot de passe</span><input name="password" type="password" minlength="10" autocomplete="new-password"></label>
      <div class="adm-form__actions"><button class="btn btn--primary" type="submit">Enregistrer</button><a class="btn" href="/admin/users">Retour</a></div></form>`;
    return c.html(adminLayout(c, user, `Utilisateur #${u.id}`, body, "/admin/users"));
  });

  r.post("/users/:id", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "users", "edit");
    if (d) return d;
    const form = await c.req.parseBody();
    if (typeof form === "string") return c.redirect("/admin/users");
    const email = String(form.email || "").trim().toLowerCase();
    const name = String(form.name || "").trim();
    const role = ROLES.find((r2) => r2.value === form.role)?.value || "lecteur";
    const isActive = form.is_active === "1" ? 1 : 0;
    await c.env.DB.prepare("UPDATE users SET email = ?1, name = ?2, role = ?3, is_active = ?4, updated_at = datetime('now') WHERE id = ?5").bind(email, name, role, isActive, c.req.param("id")).run();
    if (form.reset_password === "1" && String(form.password || "").length >= 10) {
      const { hash, salt } = await hashPassword(String(form.password));
      await c.env.DB.prepare("UPDATE users SET password_hash = ?1, password_salt = ?2, must_change_password = 1 WHERE id = ?3").bind(hash, salt, c.req.param("id")).run();
    }
    await audit(c, "modification_utilisateur", "users", c.req.param("id"), { email, role, isActive, reset: form.reset_password === "1" });
    return c.redirect("/admin/users");
  });

  r.post("/users/:id/delete", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "users", "delete");
    if (d) return d;
    if (String(c.req.param("id")) === String(user.userId)) return c.redirect("/admin/users");
    await c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(c.req.param("id")).run();
    await audit(c, "suppression_utilisateur", "users", c.req.param("id"));
    return c.redirect("/admin/users");
  });

  // ---------- MENUS ----------
  r.get("/menus", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "menus", "view");
    if (d) return d;
    const rows = await q(c.env.DB, "SELECT * FROM menus ORDER BY location");
    const body = rows
      .map(
        (m) => `<section class="adm-panel"><h3>Menu « ${esc(m.location)} »</h3>
        <form method="post" action="/admin/menus/${m.id}" class="adm-form" data-confirm-leave>
        <input type="hidden" name="_csrf" value="${user.csrf}">
        <label class="adm-field full"><span>Items (JSON — label, url, children optionnels)</span>
        <textarea name="items" rows="10" data-json>${esc(JSON.stringify(parseJSON(m.items, []), null, 2))}</textarea>
        <small>Exemple : [{"label":"Accueil","url":"/"},{"label":"Expertises","url":"/expertises","children":[{"label":"Développement web","url":"/expertises/developpement-web"}]}]</small></label>
        <button class="btn btn--primary" type="submit">Enregistrer ce menu</button></form></section>`
      )
      .join("");
    return c.html(adminLayout(c, user, "Menus du site", body, "/admin/menus"));
  });

  r.post("/menus/:id", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "menus", "edit");
    if (d) return d;
    const form = await c.req.parseBody();
    if (typeof form === "string") return c.redirect("/admin/menus");
    try {
      const items = JSON.parse(String(form.items || "[]"));
      if (!Array.isArray(items)) throw new Error();
      await c.env.DB.prepare("UPDATE menus SET items = ?1, updated_at = datetime('now') WHERE id = ?2").bind(JSON.stringify(items), c.req.param("id")).run();
      await invalidateCache(c.env, ["menus"]);
      await audit(c, "modification_menu", "menus", c.req.param("id"));
    } catch {
      return c.html(adminLayout(c, user, "Erreur", `<div class="adm-alert adm-alert--error">JSON des items invalide.</div><a class="btn" href="/admin/menus">Retour</a>`), 400);
    }
    return c.redirect("/admin/menus");
  });

  // ---------- FOOTER ----------
  r.get("/footer", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "menus", "view");
    if (d) return d;
    const rows = await q(c.env.DB, "SELECT * FROM footer_sections ORDER BY sort_order");
    const body = rows
      .map(
        (s) => `<section class="adm-panel"><h3>Section : ${esc(String(s.title))}</h3>
      <form method="post" action="/admin/footer/${s.id}" class="adm-form">
      <input type="hidden" name="_csrf" value="${user.csrf}">
      <label class="adm-field"><span>Titre</span><input name="title" value="${esc(String(s.title))}"></label>
      <label class="adm-field full"><span>Contenu (JSON)</span><textarea name="content" rows="5" data-json>${esc(JSON.stringify(parseJSON(s.content, {}), null, 2))}</textarea>
      <small>{"text":"…","email":"…"} ou {"items":[{"label":"…","url":"…"}]}</small></label>
      <button class="btn btn--primary" type="submit">Enregistrer</button></form></section>`
      )
      .join("");
    return c.html(adminLayout(c, user, "Pied de page", body, "/admin/footer"));
  });

  r.post("/footer/:id", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "menus", "edit");
    if (d) return d;
    const form = await c.req.parseBody();
    if (typeof form === "string") return c.redirect("/admin/footer");
    try {
      const content = JSON.parse(String(form.content || "{}"));
      await c.env.DB.prepare("UPDATE footer_sections SET title = ?1, content = ?2, updated_at = datetime('now') WHERE id = ?3").bind(String(form.title || ""), JSON.stringify(content), c.req.param("id")).run();
      await invalidateCache(c.env, ["footer_sections"]);
      await audit(c, "modification_footer", "footer_sections", c.req.param("id"));
    } catch {
      return c.html(adminLayout(c, user, "Erreur", `<div class="adm-alert adm-alert--error">JSON invalide.</div><a class="btn" href="/admin/footer">Retour</a>`), 400);
    }
    return c.redirect("/admin/footer");
  });

  // ---------- SEO & REDIRECTIONS ----------
  r.get("/seo", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "seo", "view");
    if (d) return d;
    const reds = await q(c.env.DB, "SELECT * FROM redirects ORDER BY id DESC LIMIT 100");
    const defaults = parseJSON<Record<string, string>>(JSON.stringify(await loadSettings(c.env.DB).then((s) => s.seo_defaults || {})), {});
    const body = `<section class="adm-panel"><h3>Valeurs SEO par défaut</h3>
      <form method="post" action="/admin/seo/defaults" class="adm-form">
      <input type="hidden" name="_csrf" value="${user.csrf}">
      <label class="adm-field full"><span>Suffixe de titre (ex : « | GREEN FAD »)</span><input name="title_suffix" value="${esc(defaults.title_suffix || "")}"></label>
      <label class="adm-field full"><span>Description par défaut</span><textarea name="default_description" rows="2">${esc(defaults.default_description || "")}</textarea></label>
      <button class="btn btn--primary" type="submit">Enregistrer</button></form></section>
    <section class="adm-panel"><h3>Redirections 301/302 (anciennes URL → nouvelles)</h3>
      <form method="post" action="/admin/seo/redirects" class="adm-form adm-form--inline">
      <input type="hidden" name="_csrf" value="${user.csrf}">
      <label class="adm-field"><span>Depuis (ancienne URL)</span><input name="from_path" placeholder="/services/web-development.html" required></label>
      <label class="adm-field"><span>Vers (nouvelle URL)</span><input name="to_path" placeholder="/expertises/developpement-web" required></label>
      <label class="adm-field"><span>Code</span><select name="code"><option>301</option><option>302</option></select></label>
      <button class="btn btn--primary" type="submit">+ Ajouter</button></form>
      ${reds.length ? `<table class="adm-table"><thead><tr><th>Depuis</th><th>Vers</th><th>Code</th><th>Active</th><th></th></tr></thead><tbody>${reds
        .map((rd) => `<tr><td><code>${esc(rd.from_path)}</code></td><td><code>${esc(rd.to_path)}</code></td><td>${rd.code}</td><td>${rd.is_active ? "✔" : "✖"}</td><td class="adm-actions"><form method="post" action="/admin/seo/redirects/${rd.id}/delete"><input type="hidden" name="_csrf" value="${user.csrf}"><button class="btn btn--sm btn--danger">Suppr.</button></form></td></tr>`)
        .join("")}</tbody></table>` : `<p class="muted">Aucune redirection configurée.</p>`}
    </section>`;
    return c.html(adminLayout(c, user, "SEO & Redirections", body, "/admin/seo"));
  });

  r.post("/seo/defaults", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "seo", "edit");
    if (d) return d;
    const form = await c.req.parseBody();
    if (typeof form === "string") return c.redirect("/admin/seo");
    await setSetting(c.env.DB, "seo_defaults", { title_suffix: String(form.title_suffix || ""), default_description: String(form.default_description || "") });
    await invalidateCache(c.env, ["settings"]);
    await audit(c, "modification_seo_defaults", "settings");
    return c.redirect("/admin/seo");
  });

  r.post("/seo/redirects", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "seo", "edit");
    if (d) return d;
    const form = await c.req.parseBody();
    if (typeof form === "string") return c.redirect("/admin/seo");
    const from = slugify(String(form.from_path || "")).startsWith("/") ? String(form.from_path).trim() : "/" + String(form.from_path).trim().replace(/^\//, "");
    const to = "/" + String(form.to_path || "").trim().replace(/^\//, "");
    if (from && to && from !== "/") {
      await c.env.DB.prepare("INSERT INTO redirects (from_path, to_path, code, is_active, created_at) VALUES (?1,?2,?3,1,datetime('now')) ON CONFLICT(from_path) DO UPDATE SET to_path = ?2, code = ?3").bind(from, to, String(form.code || "301")).run();
      await audit(c, "creation_redirection", "redirects", null, { from, to });
    }
    return c.redirect("/admin/seo");
  });

  r.post("/seo/redirects/:id/delete", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "seo", "edit");
    if (d) return d;
    await c.env.DB.prepare("DELETE FROM redirects WHERE id = ?").bind(c.req.param("id")).run();
    await audit(c, "suppression_redirection", "redirects", c.req.param("id"));
    return c.redirect("/admin/seo");
  });

  // ---------- PARAMÈTRES ----------
  r.get("/settings", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "settings", "view");
    if (d) return d;
    const s = await loadSettings(c.env.DB);
    const v = (k: string) => esc(String((s[k] as string) || ""));
    const socials = parseJSON<Record<string, string>>(JSON.stringify(s.socials || "{}"), {});
    const body = `<form method="post" action="/admin/settings" class="adm-form">
      <input type="hidden" name="_csrf" value="${user.csrf}">
      <section class="adm-panel"><h3>Identité de l'entreprise</h3>
        <label class="adm-field"><span>Nom du site</span><input name="site_name" value="${v("site_name")}"></label>
        <label class="adm-field full"><span>Accroche (tagline)</span><input name="tagline" value="${v("tagline")}"></label>
        <label class="adm-field"><span>Logo (clé média)</span><input name="logo_key" value="${v("logo_key")}"></label>
        <label class="adm-field"><span>Logo pied de page</span><input name="logo_footer_key" value="${v("logo_footer_key")}"></label>
        <label class="adm-field"><span>Image OG par défaut</span><input name="og_default_image" value="${v("og_default_image")}"></label>
      </section>
      <section class="adm-panel"><h3>Contact</h3>
        <label class="adm-field"><span>Téléphone</span><input name="contact_phone" value="${v("contact_phone")}"></label>
        <label class="adm-field"><span>Email</span><input name="contact_email" value="${v("contact_email")}"></label>
        <label class="adm-field full"><span>Adresse</span><input name="contact_address" value="${v("contact_address")}"></label>
        <label class="adm-field"><span>URL du site (canonical)</span><input name="site_url" value="${v("site_url")}"></label>
      </section>
      <section class="adm-panel"><h3>Réseaux sociaux</h3>
        ${["facebook", "youtube", "tiktok", "linkedin"].map((n) => `<label class="adm-field"><span>${esc(n)}</span><input name="social_${n}" value="${esc(socials[n] || "")}"></label>`).join("")}
      </section>
      <div class="adm-form__actions"><button class="btn btn--primary" type="submit">Enregistrer les paramètres</button></div></form>`;
    return c.html(adminLayout(c, user, "Paramètres & identité", body, "/admin/settings"));
  });

  r.post("/settings", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "settings", "edit");
    if (d) return d;
    const form = await c.req.parseBody();
    if (typeof form === "string") return c.redirect("/admin/settings");
    const keys = ["site_name", "tagline", "logo_key", "logo_footer_key", "og_default_image", "contact_phone", "contact_email", "contact_address", "site_url"];
    for (const k of keys) await setSetting(c.env.DB, k, String(form[k] || ""));
    const socials: Record<string, string> = {};
    for (const n of ["facebook", "youtube", "tiktok", "linkedin"]) if (form[`social_${n}`]) socials[n] = String(form[`social_${n}`]);
    await setSetting(c.env.DB, "socials", socials);
    await invalidateCache(c.env, ["settings"]);
    await audit(c, "modification_parametres", "settings");
    return c.redirect("/admin/settings");
  });

  // ---------- JOURNAL D'AUDIT ----------
  r.get("/audit", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "audit_log", "view");
    if (d) return d;
    const page = Math.max(1, parseInt(c.req.query("page") || "1", 10) || 1);
    const per = 50;
    const total = await count(c.env.DB, "audit_log");
    const rows = await q(c.env.DB, "SELECT * FROM audit_log ORDER BY id DESC LIMIT ? OFFSET ?", per, (page - 1) * per);
    const pages = Math.max(1, Math.ceil(total / per));
    const body = `<table class="adm-table"><thead><tr><th>Date & heure</th><th>Utilisateur</th><th>Action</th><th>Objet</th><th>Détails</th><th>IP</th></tr></thead><tbody>${rows
      .map((a) => `<tr><td class="muted">${fmtDate(String(a.created_at), "short")} ${esc(String(a.created_at).slice(11, 19))} UTC</td><td>${esc(a.user_email)}</td><td><code>${esc(a.action)}</code></td><td class="muted">${esc([a.entity, a.entity_id].filter(Boolean).join(" #"))}</td><td class="muted">${esc(String(a.details || "").slice(0, 80))}</td><td class="muted">${esc(a.ip || "")}</td></tr>`)
      .join("")}</tbody></table>
      <div class="pager adm-pager">${page > 1 ? `<a href="/admin/audit?page=${page - 1}">← Préc.</a>` : ""}<span>Page ${page} / ${pages}</span>${page < pages ? `<a href="/admin/audit?page=${page + 1}">Suiv. →</a>` : ""}</div>`;
    return c.html(adminLayout(c, user, "Journal d'audit", body, "/admin/audit"));
  });

  return r;
}

function adminLoginHTML(error = "", email = ""): string {
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
