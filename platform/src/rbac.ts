// GREEN FAD — RBAC : 8 rôles, permissions serveur sur chaque module
import { Context } from "hono";
import { Role } from "./types";

type Action = "view" | "create" | "edit" | "delete" | "publish";

// Matrice : ressource → { action → rôles autorisés }
// super_admin = tous droits, implicite (checkedRole includes)
export const PERMISSIONS: Record<string, Partial<Record<Action, Role[]>>> = {
  pages: {
    view: ["admin", "responsable_editorial", "gestionnaire_produits", "gestionnaire_services", "lecteur"],
    create: ["admin", "responsable_editorial"],
    edit: ["admin", "responsable_editorial"],
    delete: ["admin"],
    publish: ["admin", "responsable_editorial"],
  },
  products: {
    view: ["admin", "gestionnaire_produits", "responsable_editorial", "lecteur"],
    create: ["admin", "gestionnaire_produits"],
    edit: ["admin", "gestionnaire_produits"],
    delete: ["admin"],
    publish: ["admin", "gestionnaire_produits"],
  },
  // Patrimoine historique des produits (jalons, versions, sources) — Mission CTO N°2
  patrimoine: {
    view: ["admin", "gestionnaire_produits", "responsable_editorial", "lecteur"],
    create: ["admin", "gestionnaire_produits", "responsable_editorial"],
    edit: ["admin", "gestionnaire_produits", "responsable_editorial"],
    delete: ["admin"],
    publish: ["admin", "gestionnaire_produits", "responsable_editorial"],
  },
  services: {
    view: ["admin", "gestionnaire_services", "responsable_editorial", "lecteur"],
    create: ["admin", "gestionnaire_services"],
    edit: ["admin", "gestionnaire_services"],
    delete: ["admin"],
    publish: ["admin", "gestionnaire_services"],
  },
  posts: {
    view: ["admin", "responsable_editorial", "gestionnaire_produits", "gestionnaire_services", "lecteur"],
    create: ["admin", "responsable_editorial"],
    edit: ["admin", "responsable_editorial"],
    delete: ["admin"],
    publish: ["admin", "responsable_editorial"],
  },
  projects: {
    view: ["admin", "responsable_editorial", "responsable_commercial", "lecteur"],
    create: ["admin", "responsable_editorial"],
    edit: ["admin", "responsable_editorial"],
    delete: ["admin"],
    publish: ["admin", "responsable_editorial"],
  },
  countries: {
    view: ["admin", "responsable_editorial", "responsable_commercial", "lecteur"],
    create: ["admin", "responsable_editorial"],
    edit: ["admin", "responsable_editorial"],
    delete: ["admin"],
    publish: ["admin", "responsable_editorial"],
  },
  offices: {
    view: ["admin", "responsable_editorial", "responsable_commercial", "lecteur"],
    create: ["admin", "responsable_editorial", "responsable_commercial"],
    edit: ["admin", "responsable_editorial", "responsable_commercial"],
    delete: ["admin"],
    publish: ["admin", "responsable_editorial"],
  },
  team_members: {
    view: ["admin", "responsable_editorial", "lecteur"],
    create: ["admin", "responsable_editorial"],
    edit: ["admin", "responsable_editorial"],
    delete: ["admin"],
    publish: ["admin", "responsable_editorial"],
  },
  partners: {
    view: ["admin", "responsable_editorial", "responsable_commercial", "lecteur"],
    create: ["admin", "responsable_editorial"],
    edit: ["admin", "responsable_editorial"],
    delete: ["admin"],
    publish: ["admin", "responsable_editorial"],
  },
  testimonials: {
    view: ["admin", "responsable_editorial", "lecteur"],
    create: ["admin", "responsable_editorial"],
    edit: ["admin", "responsable_editorial"],
    delete: ["admin"],
    publish: ["admin", "responsable_editorial"],
  },
  faqs: {
    view: ["admin", "responsable_editorial", "gestionnaire_services", "lecteur"],
    create: ["admin", "responsable_editorial", "gestionnaire_services"],
    edit: ["admin", "responsable_editorial", "gestionnaire_services"],
    delete: ["admin"],
    publish: ["admin", "responsable_editorial"],
  },
  jobs: {
    view: ["admin", "responsable_commercial", "responsable_editorial", "lecteur"],
    create: ["admin", "responsable_commercial"],
    edit: ["admin", "responsable_commercial"],
    delete: ["admin"],
    publish: ["admin", "responsable_commercial"],
  },
  press_releases: {
    view: ["admin", "responsable_editorial", "lecteur"],
    create: ["admin", "responsable_editorial"],
    edit: ["admin", "responsable_editorial"],
    delete: ["admin"],
    publish: ["admin", "responsable_editorial"],
  },
  archives: {
    view: ["admin", "responsable_editorial", "lecteur"],
    create: ["admin", "responsable_editorial"],
    edit: ["admin", "responsable_editorial"],
    delete: ["admin"],
    publish: ["admin", "responsable_editorial"],
  },
  documents: {
    view: ["admin", "responsable_medias", "responsable_editorial", "responsable_commercial", "lecteur"],
    create: ["admin", "responsable_medias"],
    edit: ["admin", "responsable_medias"],
    delete: ["admin", "responsable_medias"],
    publish: ["admin", "responsable_medias"],
  },
  media: {
    view: ["admin", "responsable_medias", "responsable_editorial", "gestionnaire_produits", "gestionnaire_services", "responsable_commercial", "lecteur"],
    create: ["admin", "responsable_medias", "responsable_editorial", "gestionnaire_produits", "gestionnaire_services"],
    edit: ["admin", "responsable_medias", "responsable_editorial"],
    publish: ["admin", "responsable_medias", "responsable_editorial"],
    delete: ["admin", "responsable_medias"],
  },
  contact_messages: {
    view: ["admin", "responsable_commercial", "lecteur"],
    edit: ["admin", "responsable_commercial"],
    delete: ["admin"],
  },
  leads: {
    view: ["admin", "responsable_commercial", "lecteur"],
    create: ["admin", "responsable_commercial"],
    edit: ["admin", "responsable_commercial"],
    delete: ["admin"],
  },
  newsletter_subscribers: {
    view: ["admin", "responsable_commercial", "responsable_editorial", "lecteur"],
    edit: ["admin", "responsable_commercial"],
    delete: ["admin"],
  },
  users: {
    view: ["admin"],
    create: ["admin"],
    edit: ["admin"],
    delete: ["admin"],
  },
  settings: {
    view: ["admin"],
    edit: ["admin"],
  },
  menus: {
    view: ["admin"],
    edit: ["admin"],
  },
  seo: {
    view: ["admin", "responsable_editorial", "lecteur"],
    edit: ["admin", "responsable_editorial"],
  },
  audit_log: {
    view: ["admin", "lecteur"],
  },
};

export function can(role: Role, resource: string, action: Action = "view"): boolean {
  if (role === "super_admin") return true;
  const allowed = PERMISSIONS[resource]?.[action];
  return !!allowed?.includes(role);
}

/** Guard serveur — refuse 403 si permission absente */
export function requirePerm(resource: string, action: Action = "view") {
  return (c: Context) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Non authentifié" }, 401);
    if (!can(user.role, resource, action)) {
      return c.json({ error: "Permission refusée pour cette action" }, 403);
    }
    return null;
  };
}
