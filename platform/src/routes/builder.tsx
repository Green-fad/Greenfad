// GREEN FAD — Page Builder : construction visuelle des pages, versions, publication
import { Hono, Context } from "hono";
import { Env } from "../types";
import { q, q1, count, invalidateCache } from "../db";
import { adminLayout } from "../render/admin";
import { can } from "../rbac";
import { audit } from "../audit";
import { esc, parseJSON, fmtDate } from "../utils";
import { validateBlocks, BLOCK_LABELS, Block, BlockType } from "../blocks";
import { icon } from "../icons";
import { slugify } from "../utils";

type PageRow = Record<string, unknown>;

export function builderRouter(): Hono<{ Bindings: Env }> {
  const r = new Hono<{ Bindings: Env }>();
  const deny = (c: Context<{ Bindings: Env }>, action: "view" | "create" | "edit" | "delete" | "publish" = "view") => {
    const user = c.get("user")!;
    if (!can(user.role, "pages", action)) return c.html(adminLayout(c, user, "Accès refusé", `<div class="adm-alert adm-alert--error">Permission refusée (RBAC serveur).</div>`), 403);
    return null;
  };

  // ---------- LISTE DES PAGES ----------
  r.get("/", async (c) => {
    const user = c.get("user")!;
    const d = deny(c);
    if (d) return d;
    const rows = await q<PageRow>(c.env.DB, "SELECT id, slug, title, status, is_home, version, updated_at FROM pages ORDER BY is_home DESC, id ASC");
    const canCreate = can(user.role, "pages", "create");
    const body = `<div class="adm-toolbar"><span class="muted">Chaque page est construite en blocs — cliquez sur « Construire » pour ouvrir le Page Builder.</span>
      ${canCreate ? `<a class="btn btn--primary adm-new" href="/admin/pages/new">+ Nouvelle page</a>` : ""}</div>
    <table class="adm-table"><thead><tr><th>#</th><th>Titre</th><th>Slug</th><th>Statut</th><th>Version</th><th>Mise à jour</th><th>Actions</th></tr></thead><tbody>${rows
      .map(
        (p) => `<tr><td>${p.id}</td>
        <td><strong>${esc(String(p.title))}</strong>${p.is_home ? ' <span class="tag">Accueil</span>' : ""}</td>
        <td><code>${esc(String(p.slug))}</code></td>
        <td><span class="pill ${p.status === "publie" ? "ok" : p.status === "brouillon" ? "" : "warn"}">${esc(String(p.status))}</span></td>
        <td>v${p.version}</td>
        <td class="muted">${fmtDate(String(p.updated_at), "short")}</td>
        <td class="adm-actions">
          ${can(user.role, "pages", "edit") ? `<a class="btn btn--sm" href="/admin/pages/${p.id}/builder">${icon("layers")} Construire</a><a class="btn btn--sm" href="/admin/pages/${p.id}">Meta & SEO</a>` : ""}
          ${can(user.role, "pages", "publish") && !p.is_home ? `<form method="post" action="/admin/pages/${p.id}/status" class="inline"><input type="hidden" name="_csrf" value="${user.csrf}"><input type="hidden" name="status" value="${p.status === "publie" ? "depublie" : "publie"}"><button class="btn btn--sm">${p.status === "publie" ? "Dépublier" : "Publier"}</button></form>` : ""}
          <a class="btn btn--sm" href="${p.is_home ? "/" : "/p/" + esc(String(p.slug))}" target="_blank">${icon("external-link")} Voir</a>
          ${can(user.role, "pages", "edit") ? `<a class="btn btn--sm" href="/admin/pages/${p.id}/versions">Versions</a>` : ""}
          ${can(user.role, "pages", "delete") && !p.is_home ? `<form method="post" action="/admin/pages/${p.id}/delete" data-confirm="Supprimer la page « ${esc(String(p.title))} » ?"><input type="hidden" name="_csrf" value="${user.csrf}"><button class="btn btn--sm btn--danger">Suppr.</button></form>` : ""}
        </td></tr>`
      )
      .join("")}</tbody></table>`;
    return c.html(adminLayout(c, user, "Pages & Page Builder", body, "/admin/pages"));
  });

  // ---------- CRÉATION ----------
  r.get("/new", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "create");
    if (d) return d;
    const body = `<form method="post" action="/admin/pages" class="adm-form">
      <input type="hidden" name="_csrf" value="${user.csrf}">
      <label class="adm-field"><span>Titre de la page *</span><input name="title" required></label>
      <label class="adm-field"><span>Slug (URL)</span><input name="slug" placeholder="généré automatiquement"></label>
      <label class="adm-field adm-field--check"><input type="checkbox" name="show_in_nav" value="1"><span>Afficher dans le menu principal (si configuré)</span></label>
      <label class="adm-field"><span>Statut initial</span><select name="status"><option value="brouillon">brouillon</option><option value="publie">publié</option></select></label>
      <div class="adm-form__actions"><button class="btn btn--primary" type="submit">Créer et construire</button><a class="btn" href="/admin/pages">Annuler</a></div></form>`;
    return c.html(adminLayout(c, user, "Nouvelle page", body, "/admin/pages"));
  });

  r.post("/", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "create");
    if (d) return d;
    const form = await c.req.parseBody();
    if (typeof form === "string") return c.redirect("/admin/pages/new");
    const title = String(form.title || "").trim();
    if (!title) return c.redirect("/admin/pages/new");
    let slug = slugify(String(form.slug || title));
    const exists = await q1(c.env.DB, "SELECT id FROM pages WHERE slug = ?", slug);
    if (exists) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    const status = String(form.status) === "publie" && can(user.role, "pages", "publish") ? "publie" : "brouillon";
    await c.env.DB.prepare("INSERT INTO pages (slug, title, blocks, status, show_in_nav, is_home, version, created_at, updated_at) VALUES (?1, ?2, '[]', ?3, ?4, 0, 1, datetime('now'), datetime('now'))")
      .bind(slug, title, status, form.show_in_nav === "1" ? 1 : 0)
      .run();
    const created = await q1<{ id: number }>(c.env.DB, "SELECT id FROM pages ORDER BY id DESC LIMIT 1");
    if (created) {
      await c.env.DB.prepare("INSERT INTO page_versions (page_id, version, title, blocks, note, author_email, created_at) VALUES (?1, 1, ?2, '[]', 'création initiale', ?3, datetime('now'))")
        .bind(created.id, title, user.email)
        .run();
    }
    await audit(c, "creation_page", "pages", created?.id ?? undefined, { slug, title });
    return c.redirect(`/admin/pages/${created?.id}/builder`);
  });

  // ---------- META & SEO ----------
  r.get("/:id", async (c) => {
    const user = c.get("user")!;
    const d = deny(c);
    if (d) return d;
    const p = await q1<PageRow>(c.env.DB, "SELECT * FROM pages WHERE id = ?", c.req.param("id"));
    if (!p) return c.notFound();
    const body = `<form method="post" action="/admin/pages/${p.id}" class="adm-form">
      <input type="hidden" name="_csrf" value="${user.csrf}">
      <label class="adm-field"><span>Titre *</span><input name="title" value="${esc(String(p.title))}" required></label>
      <label class="adm-field"><span>Slug *</span><input name="slug" value="${esc(String(p.slug))}" ${p.is_home ? "disabled" : ""}></label>
      <label class="adm-field"><span>Titre SEO</span><input name="meta_title" value="${esc(String(p.meta_title || ""))}"></label>
      <label class="adm-field full"><span>Description SEO</span><textarea name="meta_description" rows="2">${esc(String(p.meta_description || ""))}</textarea></label>
      <label class="adm-field adm-field--check"><input type="checkbox" name="show_in_nav" value="1" ${p.show_in_nav ? "checked" : ""}><span>Afficher dans le menu</span></label>
      <div class="adm-form__actions"><button class="btn btn--primary" type="submit">Enregistrer</button>
      ${can(user.role, "pages", "edit") ? `<a class="btn btn--outline" href="/admin/pages/${p.id}/builder">${icon("layers")} Ouvrir le Page Builder</a>` : ""}</div></form>`;
    return c.html(adminLayout(c, user, `Page : ${p.title}`, body, "/admin/pages"));
  });

  r.post("/:id", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "edit");
    if (d) return d;
    const form = await c.req.parseBody();
    if (typeof form === "string") return c.redirect("/admin/pages");
    const p = await q1<PageRow>(c.env.DB, "SELECT * FROM pages WHERE id = ?", c.req.param("id"));
    if (!p) return c.notFound();
    const slug = p.is_home ? String(p.slug) : slugify(String(form.slug || p.slug));
    await c.env.DB.prepare("UPDATE pages SET title=?1, slug=?2, meta_title=?3, meta_description=?4, show_in_nav=?5, updated_at=datetime('now') WHERE id=?6")
      .bind(String(form.title || p.title), slug, String(form.meta_title || ""), String(form.meta_description || ""), form.show_in_nav === "1" ? 1 : 0, c.req.param("id"))
      .run();
    await invalidateCache(c.env, ["page:" + slug]);
    await audit(c, "modification_page", "pages", c.req.param("id"), { slug });
    return c.redirect(`/admin/pages/${c.req.param("id")}`);
  });

  // ---------- PAGE BUILDER ----------
  r.get("/:id/builder", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "view");
    if (d) return d;
    const p = await q1<PageRow>(c.env.DB, "SELECT * FROM pages WHERE id = ?", c.req.param("id"));
    if (!p) return c.notFound();
    const canEdit = can(user.role, "pages", "edit");
    const blocks = parseJSON<Block[]>(String(p.blocks || "[]"), []);
    const catalog = Object.entries(BLOCK_LABELS)
      .map(
        ([type, info]) =>
          `<button type="button" class="bcatalog__item" data-add-block="${esc(type)}" title="${esc(info.desc)}"><span class="bcatalog__group">${esc(info.group)}</span><strong>${esc(info.label)}</strong><em>${esc(info.desc)}</em></button>`
      )
      .join("");

    const body = `<div class="builder" data-page-id="${p.id}" ${canEdit ? "" : 'data-readonly="1"'}>
      <div class="builder__bar">
        <div><strong>${esc(String(p.title))}</strong> <code>/${esc(String(p.slug))}</code> <span class="pill ${p.status === "publie" ? "ok" : ""}">${esc(String(p.status))}</span> <span class="muted">v${p.version}</span></div>
        <div class="builder__bar-actions">
          ${canEdit ? `<button type="button" class="btn btn--primary" data-save-blocks>${icon("check")} Enregistrer (brouillon)</button>` : ""}
          ${can(user.role, "pages", "publish") ? `<button type="button" class="btn btn--ok" data-publish>${icon("rocket")} Publier</button>` : ""}
          <a class="btn" href="/__preview/${p.id}" target="_blank">${icon("eye")} Aperçu brouillon</a>
          ${canEdit ? `<a class="btn" href="/admin/pages/${p.id}/versions">${icon("history")} Versions</a>` : ""}
        </div>
      </div>
      <div class="builder__layout">
        <aside class="builder__catalog"><h4>Catalogue de blocs</h4><p class="muted">Cliquez pour ajouter à la page.</p>${catalog}</aside>
        <div class="builder__canvas" data-blocks-list>
          ${blocks.length ? blocks.map((b, i) => builderBlockCard(b, i)).join("") : `<div class="adm-empty">Page vide — ajoutez un premier bloc depuis le catalogue.</div>`}
        </div>
        <div class="builder__editor"><div class="builder__editor-inner"><h4>Édition du bloc</h4><p class="muted">Sélectionnez un bloc dans la page pour éditer son contenu.</p><div class="builder__editor-form" data-block-form></div></div></div>
      </div>
      <div class="builder__preview-bar">
        <span>Aperçu :</span>
        <button type="button" class="btn btn--sm" data-device="desktop">${icon("monitor")} Ordinateur</button>
        <button type="button" class="btn btn--sm" data-device="tablet">${icon("layers")} Tablette</button>
        <button type="button" class="btn btn--sm" data-device="mobile">${icon("smartphone")} Mobile</button>
      </div>
      <div class="builder__preview"><iframe data-preview-frame src="/__preview/${p.id}" loading="lazy" title="Aperçu de la page"></iframe></div>
    </div>
    <template data-block-card-template></template>
    <script>window.__GF_BLOCKS__=${JSON.stringify(blocks).replace(/</g, "\\u003c")};</script>
    <script src="/js/builder.js" defer></script>`;
    return c.html(adminLayout(c, user, `Builder : ${p.title}`, body, "/admin/pages"));
  });

  // ---------- SAUVEGARDE DES BLOCS (API interne + API v1) ----------
  async function saveBlocks(c: Context<{ Bindings: Env }>, publish: boolean): Promise<Response> {
    const user = c.get("user")!;
    const action = publish ? "publish" : "edit";
    if (!can(user.role, "pages", action)) return c.json({ error: "Permission refusée (RBAC serveur)." }, 403);
    const id = c.req.param("id");
    const page = await q1<PageRow>(c.env.DB, "SELECT id, slug, title, version, status FROM pages WHERE id = ?", id);
    if (!page) return c.json({ error: "Page introuvable" }, 404);
    let blocks: unknown;
    if (c.req.header("content-type")?.includes("application/json")) {
      blocks = await c.req.json().then((j) => j.blocks).catch(() => null);
    } else {
      const form = await c.req.parseBody();
      blocks = typeof form !== "string" ? parseJSON(String(form.blocks || "[]"), null) : null;
    }
    const v = validateBlocks(blocks);
    if (!v.ok) return c.json({ error: v.error }, 400);
    const nextVersion = Number(page.version) + 1;
    await c.env.DB.prepare("INSERT INTO page_versions (page_id, version, title, blocks, note, author_email, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, datetime('now'))")
      .bind(id, nextVersion, String(page.title), JSON.stringify(v.blocks), publish ? "publication" : "sauvegarde brouillon", user.email)
      .run();
    await c.env.DB.prepare("UPDATE pages SET blocks = ?1, version = ?2, status = ?3, published_at = CASE WHEN ?3 = 'publie' THEN datetime('now') ELSE published_at END, updated_at = datetime('now') WHERE id = ?4")
      .bind(JSON.stringify(v.blocks), nextVersion, publish ? "publie" : String(page.status), id)
      .run();
    await invalidateCache(c.env, ["page:" + String(page.slug), "home"]);
    await audit(c, publish ? "publication_page" : "sauvegarde_brouillon_page", "pages", id, { version: nextVersion, blocs: v.blocks.length });
    return c.json({ ok: true, version: nextVersion });
  }

  r.post("/:id/blocks", (c) => saveBlocks(c, false));
  r.post("/:id/publish", (c) => saveBlocks(c, true));

  // ---------- VERSIONS & RESTAURATION ----------
  r.get("/:id/versions", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "view");
    if (d) return d;
    const page = await q1<PageRow>(c.env.DB, "SELECT id, title FROM pages WHERE id = ?", c.req.param("id"));
    if (!page) return c.notFound();
    const rows = await q(c.env.DB, "SELECT * FROM page_versions WHERE page_id = ? ORDER BY version DESC LIMIT 50", c.req.param("id"));
    const canEdit = can(user.role, "pages", "edit");
    const body = `<p class="adm-intro">Historique de « ${esc(String(page.title))} » — chaque enregistrement et chaque publication crée une version restaurable.</p>
    <table class="adm-table"><thead><tr><th>Version</th><th>Date</th><th>Note</th><th>Auteur</th><th></th></tr></thead><tbody>${rows
      .map(
        (v) => `<tr><td><strong>v${v.version}</strong></td><td class="muted">${fmtDate(String(v.created_at), "short")} ${esc(String(v.created_at).slice(11, 19))}</td><td>${esc(String(v.note || ""))}</td><td class="muted">${esc(String(v.author_email || ""))}</td>
        <td class="adm-actions">${canEdit ? `<form method="post" action="/admin/pages/${page.id}/versions/${v.version}/restore" data-confirm="Restaurer la version v${v.version} ?"><input type="hidden" name="_csrf" value="${user.csrf}"><button class="btn btn--sm">Restaurer</button></form>` : ""}</td></tr>`
      )
      .join("")}</tbody></table>
    <p><a class="btn" href="/admin/pages/${page.id}/builder">← Retour au builder</a></p>`;
    return c.html(adminLayout(c, user, `Versions : ${page.title}`, body, "/admin/pages"));
  });

  r.post("/:id/versions/:v/restore", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "edit");
    if (d) return d;
    const page = await q1<PageRow>(c.env.DB, "SELECT id, slug, title, version FROM pages WHERE id = ?", c.req.param("id"));
    const version = await q1<PageRow>(c.env.DB, "SELECT blocks FROM page_versions WHERE page_id = ? AND version = ?", c.req.param("id"), c.req.param("v"));
    if (!page || !version) return c.notFound();
    const v = validateBlocks(parseJSON(String(version.blocks), []));
    if (!v.ok) return c.redirect(`/admin/pages/${page.id}/versions`);
    const nextVersion = Number(page.version) + 1;
    await c.env.DB.prepare("INSERT INTO page_versions (page_id, version, title, blocks, note, author_email, created_at) VALUES (?1,?2,?3,?4,'restauration depuis v'||?5,?6,datetime('now'))")
      .bind(page.id, nextVersion, String(page.title), JSON.stringify(v.blocks), c.req.param("v"), user.email)
      .run();
    await c.env.DB.prepare("UPDATE pages SET blocks = ?1, version = ?2, updated_at = datetime('now') WHERE id = ?3").bind(JSON.stringify(v.blocks), nextVersion, page.id).run();
    await invalidateCache(c.env, ["page:" + String(page.slug), "home"]);
    await audit(c, "restauration_version", "pages", String(page.id), { depuis: c.req.param("v"), version: nextVersion });
    return c.redirect(`/admin/pages/${page.id}/builder`);
  });

  // ---------- STATUT & SUPPRESSION ----------
  r.post("/:id/status", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "publish");
    if (d) return d;
    const form = await c.req.parseBody();
    const status = typeof form !== "string" && ["publie", "depublie", "brouillon", "en_attente", "archive"].includes(String(form.status)) ? String(form.status) : "brouillon";
    const p = await q1<PageRow>(c.env.DB, "SELECT slug FROM pages WHERE id = ?", c.req.param("id"));
    await c.env.DB.prepare("UPDATE pages SET status = ?1, published_at = CASE WHEN ?1 = 'publie' THEN datetime('now') ELSE published_at END, updated_at = datetime('now') WHERE id = ?2").bind(status, c.req.param("id")).run();
    if (p) await invalidateCache(c.env, ["page:" + String(p.slug), "home"]);
    await audit(c, "statut_page", "pages", c.req.param("id"), { status });
    return c.redirect("/admin/pages");
  });

  r.post("/:id/delete", async (c) => {
    const user = c.get("user")!;
    const d = deny(c, "delete");
    if (d) return d;
    const p = await q1<PageRow>(c.env.DB, "SELECT slug FROM pages WHERE id = ?", c.req.param("id"));
    if (p) {
      await c.env.DB.prepare("DELETE FROM pages WHERE id = ?").bind(c.req.param("id")).run();
      await invalidateCache(c.env, ["page:" + String(p.slug), "home"]);
      await audit(c, "suppression_page", "pages", c.req.param("id"), { slug: p.slug });
    }
    return c.redirect("/admin/pages");
  });

  return r;
}

// Carte d'un bloc dans le canvas du builder
function builderBlockCard(b: Block, index: number): string {
  const info = BLOCK_LABELS[b.type as BlockType];
  const summary = summarize(b);
  return `<div class="bblock ${b.visible === false ? "is-hidden" : ""}" data-block-index="${index}" data-block-type="${esc(b.type)}">
    <div class="bblock__head">
      <span class="bblock__num">${index + 1}</span>
      <strong>${esc(info?.label || b.type)}</strong>
      <em class="bblock__summary">${esc(summary)}</em>
      <span class="bblock__tools">
        <button type="button" title="Monter" data-move="-1">${icon("arrow-right", "flip")}</button>
        <button type="button" title="Descendre" data-move="1">${icon("arrow-right")}</button>
        <button type="button" title="Dupliquer" data-duplicate>${icon("copy")}</button>
        <button type="button" title="${b.visible === false ? "Afficher" : "Masquer"}" data-toggle-vis>${icon(b.visible === false ? "x-circle" : "eye")}</button>
        <button type="button" title="Supprimer" data-remove class="danger">${icon("trash")}</button>
      </span>
    </div></div>`;
}

function summarize(b: Block): string {
  const p = b as unknown as Record<string, unknown>;
  return String(p.title || p.question || p.name || p.image_key || p.source || p.height || "").slice(0, 50);
}
