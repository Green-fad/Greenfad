// GREEN FAD — Stockage R2 : upload, lecture, suppression de médias
import { Context } from "hono";
import { Env } from "./types";
import { ulid, slugify } from "./utils";

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"];
const ALLOWED_DOC = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain", "text/csv", "application/zip"];
const MAX_SIZE = 20 * 1024 * 1024; // 20 Mo

export function isAllowedMime(mime: string): boolean {
  return ALLOWED_IMAGE.includes(mime) || ALLOWED_DOC.includes(mime);
}

export function extFromMime(mime: string, filename: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
    "application/pdf": ".pdf",
    "text/plain": ".txt",
    "text/csv": ".csv",
    "application/zip": ".zip",
  };
  if (map[mime]) return map[mime];
  const m = /\.(\w{1,5})$/.exec(filename);
  return m ? `.${m[1].toLowerCase()}` : "";
}

export async function saveToR2(c: Context<{ Bindings: Env }>, file: File, folder: string): Promise<string | null> {
  if (!file.size || file.size > MAX_SIZE) return null;
  if (!isAllowedMime(file.type)) return null;
  const ext = extFromMime(file.type, file.name);
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "fichier";
  const key = `${folder}/${new Date().toISOString().slice(0, 7)}/${ulid()}-${base}${ext}`;
  await c.env.MEDIA.put(key, file, {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
  });
  await c.env.DB.prepare("INSERT INTO media (r2_key, filename, mime, size, folder, uploaded_by, created_at) VALUES (?1,?2,?3,?4,?5,?6,datetime('now'))")
    .bind(key, file.name.slice(0, 200), file.type, file.size, folder === "docs" ? "documents" : "/", c.get("user")?.email || "systeme")
    .run();
  return key;
}

export async function deleteMedia(c: Context<{ Bindings: Env }>, key: string): Promise<boolean> {
  await c.env.MEDIA.delete(key);
  const r = await c.env.DB.prepare("DELETE FROM media WHERE r2_key = ?").bind(key).run();
  return (r.meta.changes || 0) > 0;
}
