// GREEN FAD — Types partagés & bindings Cloudflare
export type ContentStatus = "brouillon" | "en_attente" | "publie" | "depublie" | "archive";

export const CONTENT_STATUSES: ContentStatus[] = ["brouillon", "en_attente", "publie", "depublie", "archive"];

export type Role =
  | "super_admin"
  | "admin"
  | "responsable_editorial"
  | "gestionnaire_produits"
  | "gestionnaire_services"
  | "responsable_medias"
  | "responsable_commercial"
  | "lecteur";

export const ROLES: { value: Role; label: string }[] = [
  { value: "super_admin", label: "Super administrateur" },
  { value: "admin", label: "Administrateur" },
  { value: "responsable_editorial", label: "Responsable éditorial" },
  { value: "gestionnaire_produits", label: "Gestionnaire produits" },
  { value: "gestionnaire_services", label: "Gestionnaire services" },
  { value: "responsable_medias", label: "Responsable médias" },
  { value: "responsable_commercial", label: "Responsable commercial" },
  { value: "lecteur", label: "Lecteur-auditeur" },
];

export type Env = {
  DB: D1Database;
  MEDIA: R2Bucket;
  KV: KVNamespace;
  SITE_URL: string;
};

export type SessionUser = {
  userId: number;
  email: string;
  name: string;
  role: Role;
  csrf: string;
};

// Contexte étendu Hono
declare module "hono" {
  interface ContextVariableMap {
    user: SessionUser | null;
  }
}

export const SESSION_COOKIE = "gf_session";
export const SESSION_TTL = 60 * 60 * 24 * 7; // 7 jours

export function nowISO(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}
