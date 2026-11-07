// GREEN FAD — Journal d'audit : chaque mutation sensible est tracée
import { Context } from "hono";
import { Env } from "./types";
import { clientIp } from "./auth";

export async function audit(
  c: Context<{ Bindings: Env }>,
  action: string,
  entity?: string,
  entityId?: string | number | null,
  details?: unknown
): Promise<void> {
  const user = c.get("user");
  try {
    await c.env.DB.prepare(
      `INSERT INTO audit_log (user_email, action, entity, entity_id, details, ip, user_agent, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, datetime('now'))`
    )
      .bind(
        user?.email || "anonyme",
        action,
        entity || null,
        entityId != null ? String(entityId) : null,
        details ? JSON.stringify(details).slice(0, 4000) : null,
        clientIp(c),
        (c.req.header("user-agent") || "").slice(0, 300)
      )
      .run();
  } catch (e) {
    console.error("audit failed", e);
  }
}
