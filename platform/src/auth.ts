// GREEN FAD — Authentification (PBKDF2 WebCrypto) + sessions KV + CSRF + anti-bruteforce
import { Context, Next } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { Env, SessionUser, SESSION_COOKIE, SESSION_TTL } from "./types";
import { ulid } from "./utils";

const PBKDF2_ITERATIONS = 100_000;

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  return { hash: b64encode(key), salt: b64encode(salt) };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  try {
    const saltBytes = b64decode(salt);
    const derived = await deriveKey(password, saltBytes);
    const a = b64encode(derived);
    if (a.length !== hash.length) return false;
    // comparaison à temps constant
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ hash.charCodeAt(i);
    return diff === 0;
  } catch {
    return false;
  }
}

async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as unknown as BufferSource, iterations: PBKDF2_ITERATIONS },
    keyMaterial,
    256
  );
}

function b64encode(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}
function b64decode(s: string): Uint8Array {
  const raw = atob(s);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

// ---------- Sessions (KV avec repli D1) ----------
// Le quota d'écritures KV du plan gratuit peut être épuisé en journée :
// une session ne doit JAMAIS être bloquée par un quota — repli sur D1.
async function sessPut(c: Context<{ Bindings: Env }>, id: string, raw: string, ttl: number): Promise<void> {
  try {
    await c.env.KV.put(`sess:${id}`, raw, { expirationTtl: ttl });
    return;
  } catch (e) {
    console.warn("session:put — KV indisponible, repli D1", (e as Error)?.message);
  }
  await c.env.DB.prepare(
    "INSERT INTO sessions_backup (id, data, expires_at) VALUES (?1, ?2, ?3) ON CONFLICT(id) DO UPDATE SET data = excluded.data, expires_at = excluded.expires_at"
  ).bind(id, raw, Date.now() + ttl * 1000).run();
}

async function sessGet(c: Context<{ Bindings: Env }>, id: string): Promise<string | null> {
  try {
    const raw = await c.env.KV.get(`sess:${id}`);
    if (raw) return raw;
  } catch (e) {
    console.warn("session:get — KV indisponible, repli D1", (e as Error)?.message);
  }
  try {
    const row = await c.env.DB.prepare("SELECT data FROM sessions_backup WHERE id = ?1 AND expires_at > ?2").bind(id, Date.now()).first<{ data: string }>();
    return row?.data ?? null;
  } catch {
    return null;
  }
}

async function sessDel(c: Context<{ Bindings: Env }>, id: string): Promise<void> {
  try {
    await c.env.KV.delete(`sess:${id}`);
  } catch {
    /* quota/panne : la copie D1 est supprimée ci-dessous */
  }
  try {
    await c.env.DB.prepare("DELETE FROM sessions_backup WHERE id = ?1").bind(id).run();
  } catch {
    /* ignore */
  }
}

export async function createSession(c: Context<{ Bindings: Env }>, user: Omit<SessionUser, "csrf">): Promise<string> {
  const id = ulid();
  const csrfBytes = crypto.getRandomValues(new Uint8Array(16));
  const csrf = Array.from(csrfBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  const data: SessionUser = { ...user, csrf };
  await sessPut(c, id, JSON.stringify(data), SESSION_TTL);
  setCookie(c, SESSION_COOKIE, id, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
  return id;
}

export async function getSession(c: Context<{ Bindings: Env }>): Promise<SessionUser | null> {
  const id = getCookie(c, SESSION_COOKIE);
  if (!id || !/^[A-Z0-9]{26}$/.test(id)) return null;
  const raw = await sessGet(c, id);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as SessionUser;
    // session glissante : renouvelle le TTL (tolérant aux pannes KV)
    await sessPut(c, id, raw, SESSION_TTL);
    return user;
  } catch {
    return null;
  }
}

export async function destroySession(c: Context<{ Bindings: Env }>): Promise<void> {
  const id = getCookie(c, SESSION_COOKIE);
  if (id) await sessDel(c, id);
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
}

// ---------- Middlewares ----------
export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const user = await getSession(c);
  c.set("user", user);
  await next();
}

export async function requireAuth(c: Context<{ Bindings: Env }>, next: Next) {
  const user = c.get("user");
  if (!user) {
    if (c.req.path.startsWith("/api/")) return c.json({ error: "Non authentifié" }, 401);
    return c.redirect(`/admin/login?next=${encodeURIComponent(c.req.path)}`);
  }
  await next();
}

/** Vérifie le jeton CSRF sur tout POST admin/API (double-submit via session) */
export async function csrfProtect(c: Context<{ Bindings: Env }>, next: Next) {
  if (c.req.method === "POST" || c.req.method === "PUT" || c.req.method === "DELETE") {
    const user = c.get("user");
    const sent =
      c.req.header("x-csrf-token") ||
      (await c.req.parseBody({ all: true }).then((b) => b["_csrf"]).catch(() => null)) ||
      null;
    if (!user || !sent || sent !== user.csrf) {
      if (c.req.path.startsWith("/api/")) return c.json({ error: "Jeton CSRF invalide" }, 403);
      return c.html(renderCsrfError(), 403);
    }
  }
  await next();
}

function renderCsrfError(): string {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Session expirée</title></head>
<body style="font-family:system-ui;display:grid;place-items:center;min-height:80vh;text-align:center">
<div><h1>Session expirée ou invalide</h1><p>Pour votre sécurité, l'opération a été refusée.</p>
<a href="/admin" style="color:#0e5a3c">Retour au tableau de bord</a></div></body></html>`;
}

// ---------- Anti-bruteforce (KV, tolérant aux pannes) ----------
export async function rateLimit(c: Context<{ Bindings: Env }>, key: string, max: number, windowSec: number): Promise<boolean> {
  const k = `rl:${key}`;
  try {
    const current = parseInt((await c.env.KV.get(k)) || "0", 10);
    if (current >= max) return false;
    await c.env.KV.put(k, String(current + 1), { expirationTtl: windowSec });
    return true;
  } catch (e) {
    // KV indisponible (quota gratuit épuisé, incident…) : ne pas bloquer l'accès.
    console.warn("rateLimit — KV indisponible, tolérance ouverte", (e as Error)?.message);
    return true;
  }
}

export async function resetRateLimit(c: Context<{ Bindings: Env }>, key: string): Promise<void> {
  try {
    await c.env.KV.delete(`rl:${key}`);
  } catch {
    /* ignore */
  }
}

export function clientIp(c: Context): string {
  return c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "local";
}
