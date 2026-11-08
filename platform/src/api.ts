// GREEN FAD — API JSON v1 (pour le Dashboard et les intégrations)
import { Hono } from "hono";
import { Env } from "./types";
import { q, count } from "./db";
import { saveToR2, deleteMedia } from "./media";
import { audit } from "./audit";
import { can } from "./rbac";

export function apiRouter(): Hono<{ Bindings: Env }> {
  const r = new Hono<{ Bindings: Env }>();

  r.get("/health", (c) => c.json({ ok: true, service: "greenfad-platform", version: "1.0", time: new Date().toISOString() }));

  // ---------- DIAGNOSTIC TEMPORAIRE (à retirer après résolution de l'incident) ----------
  r.get("/diag", async (c) => {
    const out: Record<string, string> = {};
    const t = async (name: string, fn: () => Promise<string>) => {
      try { out[name] = await fn(); } catch (e: any) { out[name] = "ERR: " + String(e?.message || e).slice(0, 300); }
    };
    await t("kv_get", async () => { const v = await c.env.KV.get("diag:probe"); return "ok:" + JSON.stringify(v); });
    await t("kv_put", async () => { await c.env.KV.put("diag:probe", String(Date.now())); return "ok"; });
    await t("d1_select_settings", async () => { const r = await c.env.DB.prepare("SELECT value FROM settings WHERE key='content_version'").first<{ value: string }>(); return "ok:" + JSON.stringify(r); });
    await t("d1_insert_newsletter", async () => { await c.env.DB.prepare("INSERT INTO newsletter_subscribers (email, status, created_at) VALUES (?1,'actif',datetime('now')) ON CONFLICT(email) DO NOTHING").bind("diag-probe@greenfad.tech").run(); return "ok"; });
    await t("d1_insert_audit", async () => { await c.env.DB.prepare("INSERT INTO audit_log (user_email, action, entity, created_at) VALUES ('diag@greenfad.tech','diag','diag',datetime('now'))").run(); return "ok"; });
    await t("r2_put", async () => { await c.env.MEDIA.put("diag/probe.txt", "probe"); return "ok"; });
    return c.json({ time: new Date().toISOString(), probes: out });
  });

  // ---------- MÉDIAS ----------
  r.get("/media/search", async (c) => {
    const user = c.get("user");
    if (!user || !can(user.role, "media", "view")) return c.json({ error: "Permission refusée" }, 403);
    const folder = c.req.query("folder") === "docs" ? "documents" : "/";
    const s = (c.req.query("q") || "").trim();
    const rows = s
      ? await q(c.env.DB, "SELECT id, r2_key, filename, mime, size FROM media WHERE folder = ? AND filename LIKE ? ORDER BY id DESC LIMIT 60", folder, `%${s}%`)
      : await q(c.env.DB, "SELECT id, r2_key, filename, mime, size FROM media WHERE folder = ? ORDER BY id DESC LIMIT 60", folder);
    return c.json({ items: rows });
  });

  r.post("/media", async (c) => {
    const user = c.get("user");
    if (!user || !can(user.role, "media", "create")) return c.json({ error: "Permission refusée" }, 403);
    const form = await c.req.parseBody({ all: true }).catch(() => null);
    if (!form || typeof form === "string") return c.json({ error: "Requête invalide" }, 400);
    const files = Array.isArray(form.file) ? form.file : [form.file];
    const saved: string[] = [];
    for (const f of files) {
      if (f instanceof File && f.size > 0) {
        const key = await saveToR2(c, f, c.req.query("folder") === "docs" ? "docs" : "media");
        if (key) saved.push(key);
      }
    }
    if (!saved.length) return c.json({ error: "Aucun fichier valide (type ou taille refusée)" }, 400);
    await audit(c, "upload_media_api", "media", null, { keys: saved });
    return c.json({ ok: true, keys: saved });
  });

  r.delete("/media/:key{.*}", async (c) => {
    const user = c.get("user");
    if (!user || !can(user.role, "media", "delete")) return c.json({ error: "Permission refusée" }, 403);
    const key = c.req.path.replace("/api/v1/media/", "");
    const ok = await deleteMedia(c, key);
    await audit(c, "suppression_media_api", "media", null, { key });
    return c.json({ ok });
  });

  // ---------- RELATIONS (sélecteurs de formulaires) ----------
  r.get("/relations/:res", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Non authentifié" }, 401);
    const map: Record<string, { table: string; label: string }> = {
      countries: { table: "countries", label: "name" },
      services: { table: "services", label: "name" },
      products: { table: "products", label: "name" },
      jobs: { table: "jobs", label: "title" },
    };
    const def = map[c.req.param("res")];
    if (!def) return c.json({ error: "Ressource inconnue" }, 404);
    const rows = await q(c.env.DB, `SELECT id, ${def.label} AS label FROM ${def.table} ORDER BY ${def.label}`);
    return c.json({ items: rows });
  });

  // ---------- STATISTIQUES ----------
  r.get("/stats", async (c) => {
    const user = c.get("user");
    if (!user || !can(user.role, "pages", "view")) return c.json({ error: "Permission refusée" }, 403);
    const [pages, posts, products, services, projects, countries, media, messages, leads] = await Promise.all([
      count(c.env.DB, "pages", "status='publie'"), count(c.env.DB, "posts", "status='publie'"),
      count(c.env.DB, "products", "status='publie'"), count(c.env.DB, "services", "status='publie'"),
      count(c.env.DB, "projects", "status='publie'"), count(c.env.DB, "countries", "status='publie'"),
      count(c.env.DB, "media"), count(c.env.DB, "contact_messages", "status='nouveau'"), count(c.env.DB, "leads", "status='nouveau'"),
    ]);
    return c.json({ pages, posts, products, services, projects, countries, media, messages, leads });
  });

  // ---------- MOI ----------
  r.get("/me", (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Non authentifié" }, 401);
    return c.json({ email: user.email, name: user.name, role: user.role });
  });

  return r;
}
