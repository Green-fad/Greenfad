// GREEN FAD — Helpers D1
export async function q<T = Record<string, unknown>>(db: D1Database, sql: string, ...params: unknown[]): Promise<T[]> {
  const r = await db.prepare(sql).bind(...params).all<T>();
  return r.results || [];
}

export async function q1<T = Record<string, unknown>>(db: D1Database, sql: string, ...params: unknown[]): Promise<T | null> {
  const rows = await q<T>(db, sql, ...params);
  return rows[0] || null;
}

export async function count(db: D1Database, table: string, where = "1=1", ...params: unknown[]): Promise<number> {
  const r = await q1<{ n: number }>(db, `SELECT COUNT(*) AS n FROM ${table} WHERE ${where}`, ...params);
  return r?.n || 0;
}

export async function getSetting(db: D1Database, key: string, fallback: unknown = null): Promise<unknown> {
  const row = await q1<{ value: string }>(db, "SELECT value FROM settings WHERE key = ?", key);
  if (!row) return fallback;
  try {
    return JSON.parse(row.value);
  } catch {
    return fallback;
  }
}

export async function setSetting(db: D1Database, key: string, value: unknown): Promise<void> {
  await db
    .prepare("INSERT INTO settings (key, value, updated_at) VALUES (?1, ?2, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = ?2, updated_at = datetime('now')")
    .bind(key, JSON.stringify(value))
    .run();
}

/** Charge toutes les settings en un seul accès (utilisé dans le layout) */
export async function loadSettings(db: D1Database): Promise<Record<string, unknown>> {
  const rows = await q<{ key: string; value: string }>(db, "SELECT key, value FROM settings");
  const out: Record<string, unknown> = {};
  for (const r of rows) {
    try {
      out[r.key] = JSON.parse(r.value);
    } catch {
      out[r.key] = r.value;
    }
  }
  return out;
}

/** Cache KV simple pour les fragments publics (menus, settings).
 *  Tolérant aux pannes : KV n'est qu'un cache — si une écriture échoue
 *  (quota gratuit dépassé, incident…), on renvoie simplement la valeur
 *  de la base au lieu de faire planter toute la plateforme. */
/** Clé de cache versionnée par déploiement : chaque commitCF_PAGES_COMMIT_SHA
 *  démarre avec des caches frais — plus d'anciennes valeurs servies jusqu'à
 *  une heure après un changement de contenu. Hors Pages (local), le suffixe
 *  est fixe (« dev »). */
function cacheKey(env: { KV: KVNamespace }, key: string): string {
  const sha = String((env as unknown as { CF_PAGES_COMMIT_SHA?: string }).CF_PAGES_COMMIT_SHA || 'dev').slice(0, 8);
  return `cache:${key}:${sha}`;
}

export async function cached<T>(env: { KV: KVNamespace }, key: string, ttlSec: number, fn: () => Promise<T>): Promise<T> {
  const k = cacheKey(env, key);
  let hit: string | null = null;
  try {
    hit = await env.KV.get(k);
  } catch (e) {
    console.warn(`cache:get ${key} indisponible`, (e as Error)?.message);
  }
  if (hit) {
    try {
      return JSON.parse(hit) as T;
    } catch {
      /* ignore */
    }
  }
  const value = await fn();
  try {
    await env.KV.put(k, JSON.stringify(value), { expirationTtl: ttlSec });
  } catch (e) {
    console.warn(`cache:put ${key} indisponible`, (e as Error)?.message);
  }
  return value;
}

export function invalidateCache(env: { KV: KVNamespace }, keys: string[]): Promise<void> {
  return Promise.all(keys.map((k) => env.KV.delete(cacheKey(env, k)).catch(() => undefined))).then(() => undefined);
}
