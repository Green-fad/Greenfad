// GREEN FAD — Moteur CRUD générique du Dashboard
// Un moteur, tous les modules : chaque ressource est déclarée, le serveur
// valide, journalise et applique les permissions RBAC.
import { Hono, Context } from "hono";
import { Env, ContentStatus, CONTENT_STATUSES } from "../types";
import { q, q1, count } from "../db";
import { adminLayout } from "../render/admin";
import { esc, slugify, md, parseJSON, fmtDate, fmtBytes } from "../utils";
import { audit } from "../audit";
import { can } from "../rbac";
import { saveToR2 } from "../media";

type FieldType = "text" | "textarea" | "markdown" | "number" | "date" | "datetime" | "select" | "tags" | "image" | "file" | "relation" | "boolean" | "json" | "readonly" | "url";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  relation?: { table: string; label: string; value: "id" };
  placeholder?: string;
  help?: string;
  list?: boolean; // visible dans la liste
  form_span?: boolean; // pleine largeur
};

export type ResourceDef = {
  key: string;
  table: string;
  title: string;
  single: string;
  perm: string; // clé RBAC
  statusable?: boolean;
  slugFrom?: string;
  order?: string;
  searchable?: string[];
  columns: Field[];
  fields: Field[];
  intro?: string;
};

const STATUS_OPTIONS = CONTENT_STATUSES.map((s) => ({ value: s, label: s.replace("_", " ") }));
const PUBLIE = "publie";

export const RESOURCES: Record<string, ResourceDef> = {
  products: {
    key: "products", table: "products", title: "Produits", single: "produit", perm: "products", statusable: true,
    slugFrom: "name", order: "sort_order ASC", searchable: ["name", "tagline"],
    columns: [{ name: "name", label: "Nom", type: "text", list: true }, { name: "category", label: "Catégorie", type: "text", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }, { name: "sort_order", label: "Ordre", type: "number", list: true }],
    fields: [
      { name: "name", label: "Nom du produit", type: "text", required: true },
      { name: "slug", label: "Identifiant URL (slug)", type: "text", help: "Laisser vide pour générer automatiquement" },
      { name: "tagline", label: "Accroche", type: "textarea", form_span: true },
      { name: "category", label: "Catégorie", type: "text" },
      { name: "icon", label: "Icône (emoji)", type: "text" },
      { name: "image_key", label: "Image principale", type: "image" },
      { name: "description_md", label: "Description complète (markdown)", type: "markdown", form_span: true },
      { name: "features", label: "Fonctionnalités", type: "json", form_span: true, help: '[{"title":"…","text":"…"}]' },
      { name: "external_url", label: "URL externe (app déployée)", type: "url" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
      { name: "meta_title", label: "Titre SEO", type: "text" },
      { name: "meta_description", label: "Description SEO", type: "textarea" },
    ],
  },
  services: {
    key: "services", table: "services", title: "Services & Expertises", single: "service", perm: "services", statusable: true,
    slugFrom: "name", order: "sort_order ASC", searchable: ["name", "summary"],
    columns: [{ name: "name", label: "Nom", type: "text", list: true }, { name: "summary", label: "Résumé", type: "textarea", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "name", label: "Nom du service", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", help: "Laisser vide pour générer automatiquement" },
      { name: "summary", label: "Résumé (cartes & SEO)", type: "textarea", form_span: true },
      { name: "icon", label: "Icône (emoji)", type: "text" },
      { name: "image_key", label: "Image", type: "image" },
      { name: "content_md", label: "Contenu commercial complet (markdown)", type: "markdown", form_span: true },
      { name: "sort_order", label: "Ordre", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
      { name: "meta_title", label: "Titre SEO", type: "text" },
      { name: "meta_description", label: "Description SEO", type: "textarea" },
    ],
  },
  posts: {
    key: "posts", table: "posts", title: "Blog & Actualités", single: "article", perm: "posts", statusable: true,
    slugFrom: "title", order: "published_at DESC", searchable: ["title", "excerpt"],
    columns: [{ name: "title", label: "Titre", type: "text", list: true }, { name: "category", label: "Catégorie", type: "text", list: true }, { name: "published_at", label: "Date éditoriale", type: "datetime", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "title", label: "Titre de l'article", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", help: "Laisser vide pour générer automatiquement" },
      { name: "excerpt", label: "Chapeau / résumé", type: "textarea", form_span: true },
      { name: "cover_key", label: "Image de couverture", type: "image" },
      { name: "category", label: "Catégorie", type: "text", help: "seo, web, mobile, digital…" },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "author", label: "Auteur", type: "text" },
      { name: "content_md", label: "Contenu (markdown)", type: "markdown", form_span: true, help: "Images : ![alt](/media/…). Vidéos : passez par le Page Builder sur les pages." },
      { name: "is_featured", label: "À la une", type: "boolean" },
      { name: "published_at", label: "Date éditoriale affichée", type: "datetime", required: true, help: "Indépendante de la date technique — permet de publier des archives avec leur vraie date historique" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "meta_title", label: "Titre SEO", type: "text" },
      { name: "meta_description", label: "Description SEO", type: "textarea" },
    ],
  },
  projects: {
    key: "projects", table: "projects", title: "Projets & Réalisations", single: "projet", perm: "projects", statusable: true,
    slugFrom: "title", order: "sort_order ASC", searchable: ["title", "summary"],
    columns: [{ name: "title", label: "Titre", type: "text", list: true }, { name: "client", label: "Client", type: "text", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "title", label: "Titre du projet", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "client", label: "Client", type: "text" },
      { name: "country_id", label: "Pays", type: "relation", relation: { table: "countries", label: "name", value: "id" } },
      { name: "category", label: "Catégorie", type: "text" },
      { name: "summary", label: "Résumé", type: "textarea", form_span: true },
      { name: "content_md", label: "Étude de cas (markdown)", type: "markdown", form_span: true },
      { name: "image_key", label: "Image principale", type: "image" },
      { name: "gallery", label: "Galerie", type: "json", form_span: true, help: '["clé-image1","clé-image2"]' },
      { name: "completed_at", label: "Livré le", type: "date" },
      { name: "sort_order", label: "Ordre", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
      { name: "meta_title", label: "Titre SEO", type: "text" },
      { name: "meta_description", label: "Description SEO", type: "textarea" },
    ],
  },
  countries: {
    key: "countries", table: "countries", title: "Pays", single: "pays", perm: "countries", statusable: true,
    slugFrom: "name", order: "sort_order ASC", searchable: ["name"],
    columns: [{ name: "name", label: "Pays", type: "text", list: true }, { name: "flag_emoji", label: "Drapeau", type: "text", list: true }, { name: "is_registered", label: "Immatriculé", type: "boolean", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "name", label: "Nom du pays", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "iso2", label: "Code ISO (ML, BF…)", type: "text" },
      { name: "flag_emoji", label: "Drapeau (emoji)", type: "text" },
      { name: "is_registered", label: "Immatriculation officielle", type: "boolean", help: "Cocher si GREEN FAD est immatriculée dans ce pays" },
      { name: "presentation_md", label: "Présentation (markdown)", type: "markdown", form_span: true },
      { name: "sort_order", label: "Ordre", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
    ],
  },
  offices: {
    key: "offices", table: "offices", title: "Bureaux", single: "bureau", perm: "offices", statusable: true,
    order: "country_id ASC, is_hq DESC", searchable: ["city", "address"],
    columns: [{ name: "city", label: "Ville", type: "text", list: true }, { name: "country_id", label: "Pays", type: "relation", relation: { table: "countries", label: "name", value: "id" }, list: true }, { name: "is_hq", label: "Siège", type: "boolean", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "country_id", label: "Pays", type: "relation", relation: { table: "countries", label: "name", value: "id" }, required: true },
      { name: "city", label: "Ville", type: "text", required: true },
      { name: "address", label: "Adresse", type: "textarea" },
      { name: "phone", label: "Téléphone", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "hours", label: "Horaires", type: "text" },
      { name: "map_url", label: "Lien carte", type: "url" },
      { name: "is_hq", label: "Siège principal", type: "boolean" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
    ],
  },
  team_members: {
    key: "team_members", table: "team_members", title: "Équipe", single: "membre", perm: "team_members", statusable: true,
    slugFrom: "name", order: "sort_order ASC", searchable: ["name", "role"],
    columns: [{ name: "name", label: "Nom", type: "text", list: true }, { name: "role", label: "Fonction", type: "text", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "name", label: "Nom complet", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "role", label: "Fonction", type: "text" },
      { name: "bio", label: "Biographie courte", type: "textarea", form_span: true },
      { name: "photo_key", label: "Photo", type: "image" },
      { name: "email", label: "Email", type: "text" },
      { name: "linkedin", label: "LinkedIn", type: "url" },
      { name: "sort_order", label: "Ordre", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
    ],
  },
  partners: {
    key: "partners", table: "partners", title: "Partenaires", single: "partenaire", perm: "partners", statusable: true,
    order: "sort_order ASC", searchable: ["name"],
    columns: [{ name: "name", label: "Nom", type: "text", list: true }, { name: "url", label: "Site", type: "url", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "name", label: "Nom du partenaire", type: "text", required: true },
      { name: "logo_key", label: "Logo", type: "image" },
      { name: "url", label: "Site web", type: "url" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sort_order", label: "Ordre", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
    ],
  },
  testimonials: {
    key: "testimonials", table: "testimonials", title: "Témoignages", single: "témoignage", perm: "testimonials", statusable: true,
    order: "sort_order ASC", searchable: ["author_name", "company"],
    columns: [{ name: "author_name", label: "Auteur", type: "text", list: true }, { name: "company", label: "Société", type: "text", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "author_name", label: "Nom de l'auteur", type: "text", required: true },
      { name: "author_role", label: "Fonction", type: "text" },
      { name: "company", label: "Société", type: "text" },
      { name: "quote", label: "Citation", type: "textarea", required: true, form_span: true },
      { name: "photo_key", label: "Photo", type: "image" },
      { name: "sort_order", label: "Ordre", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
    ],
  },
  faqs: {
    key: "faqs", table: "faqs", title: "FAQ", single: "question", perm: "faqs", statusable: true,
    order: "category ASC, sort_order ASC", searchable: ["question"],
    columns: [{ name: "question", label: "Question", type: "text", list: true }, { name: "category", label: "Catégorie", type: "text", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Réponse (markdown)", type: "markdown", required: true, form_span: true },
      { name: "category", label: "Catégorie", type: "text" },
      { name: "sort_order", label: "Ordre", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
    ],
  },
  jobs: {
    key: "jobs", table: "jobs", title: "Carrières — Offres", single: "offre", perm: "jobs", statusable: true,
    slugFrom: "title", order: "id DESC", searchable: ["title"],
    columns: [{ name: "title", label: "Poste", type: "text", list: true }, { name: "location", label: "Lieu", type: "text", list: true }, { name: "is_open", label: "Ouvert", type: "boolean", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "title", label: "Intitulé du poste", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "department", label: "Département", type: "text" },
      { name: "location", label: "Localisation", type: "text" },
      { name: "contract_type", label: "Contrat", type: "select", options: [{ value: "", label: "—" }, { value: "CDI", label: "CDI" }, { value: "CDD", label: "CDD" }, { value: "Stage", label: "Stage" }, { value: "Freelance", label: "Freelance" }, { value: "Consultant", label: "Consultant" }] },
      { name: "description_md", label: "Description du poste", type: "markdown", form_span: true },
      { name: "requirements_md", label: "Profil recherché", type: "markdown", form_span: true },
      { name: "deadline", label: "Date de clôture", type: "date" },
      { name: "is_open", label: "Recrutement ouvert", type: "boolean" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
    ],
  },
  press_releases: {
    key: "press_releases", table: "press_releases", title: "Presse", single: "communiqué", perm: "press_releases", statusable: true,
    slugFrom: "title", order: "published_at DESC", searchable: ["title"],
    columns: [{ name: "title", label: "Titre", type: "text", list: true }, { name: "published_at", label: "Date", type: "datetime", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "summary", label: "Résumé", type: "textarea", form_span: true },
      { name: "content_md", label: "Contenu", type: "markdown", form_span: true },
      { name: "file_key", label: "Fichier PDF", type: "file" },
      { name: "published_at", label: "Date", type: "datetime" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
    ],
  },
  archives: {
    key: "archives", table: "archives", title: "Archives historiques", single: "archive", perm: "archives", statusable: true,
    order: "year DESC", searchable: ["title", "year"],
    columns: [{ name: "year", label: "Année", type: "text", list: true }, { name: "title", label: "Titre", type: "text", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "year", label: "Année", type: "text", required: true },
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "description", label: "Résumé", type: "textarea", form_span: true },
      { name: "content_md", label: "Contenu (markdown)", type: "markdown", form_span: true },
      { name: "media_key", label: "Média", type: "image" },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
    ],
  },
  documents: {
    key: "documents", table: "documents", title: "Documents", single: "document", perm: "documents", statusable: true,
    order: "id DESC", searchable: ["title"],
    columns: [{ name: "title", label: "Titre", type: "text", list: true }, { name: "category", label: "Catégorie", type: "text", list: true }, { name: "is_public", label: "Public", type: "boolean", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "category", label: "Catégorie", type: "text", help: "ex : Plaquette, Rapport, Contrat, Notice" },
      { name: "file_key", label: "Fichier", type: "file", required: true },
      { name: "is_public", label: "Téléchargeable publiquement", type: "boolean" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
    ],
  },
  leads: {
    key: "leads", table: "leads", title: "Prospects & Devis", single: "prospect", perm: "leads",
    order: "id DESC", searchable: ["name", "email", "company"],
    columns: [{ name: "name", label: "Nom", type: "text", list: true }, { name: "company", label: "Société", type: "text", list: true }, { name: "email", label: "Email", type: "text", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }, { name: "created_at", label: "Reçu le", type: "readonly", list: true }],
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
      { name: "phone", label: "Téléphone", type: "text" },
      { name: "company", label: "Société", type: "text" },
      { name: "message", label: "Besoin exprimé", type: "textarea", form_span: true },
      { name: "status", label: "Statut", type: "select", options: [{ value: "nouveau", label: "nouveau" }, { value: "qualifie", label: "qualifié" }, { value: "converti", label: "converti" }, { value: "perdu", label: "perdu" }] },
    ],
  },
  newsletter_subscribers: {
    key: "newsletter_subscribers", table: "newsletter_subscribers", title: "Newsletter", single: "abonné", perm: "newsletter_subscribers",
    order: "id DESC", searchable: ["email"],
    columns: [{ name: "email", label: "Email", type: "text", list: true }, { name: "status", label: "Statut", type: "text", list: true }, { name: "created_at", label: "Inscrit le", type: "readonly", list: true }],
    fields: [{ name: "email", label: "Email", type: "text", required: true }, { name: "name", label: "Nom", type: "text" }, { name: "status", label: "Statut", type: "select", options: [{ value: "actif", label: "actif" }, { value: "desinscrit", label: "désinscrit" }] }],
  },
};

// ---------- Rendus de champs ----------
function fieldInput(f: Field, value: unknown, csrf: string, relationOptions?: { value: string; label: string }[]): string {
  const v = value == null ? "" : String(value);
  const full = f.form_span ? " full" : "";
  switch (f.type) {
    case "markdown":
      return `<label class="adm-field${full}"><span>${esc(f.label)}${f.required ? " *" : ""}</span>
        <textarea name="${f.name}" data-md="1" rows="12" placeholder="${esc(f.placeholder || "Markdown : # Titre, **gras**, listes - …")}">${esc(v)}</textarea>
        ${f.help ? `<small>${esc(f.help)}</small>` : ""}<small class="md-hint" data-md-preview="${f.name}"></small></label>`;
    case "textarea":
      return `<label class="adm-field${full}"><span>${esc(f.label)}${f.required ? " *" : ""}</span><textarea name="${f.name}" rows="3">${esc(v)}</textarea>${f.help ? `<small>${esc(f.help)}</small>` : ""}</label>`;
    case "select":
      return `<label class="adm-field${full}"><span>${esc(f.label)}</span><select name="${f.name}">${(f.options || [])
        .map((o) => `<option value="${esc(o.value)}" ${v === o.value ? "selected" : ""}>${esc(o.label)}</option>`)
        .join("")}</select>${f.help ? `<small>${esc(f.help)}</small>` : ""}</label>`;
    case "relation": {
      const opts = relationOptions || [];
      return `<label class="adm-field${full}"><span>${esc(f.label)}</span><select name="${f.name}"><option value="">—</option>${opts
        .map((o) => `<option value="${esc(o.value)}" ${v === o.value ? "selected" : ""}>${esc(o.label)}</option>`)
        .join("")}</select></label>`;
    }
    case "boolean":
      return `<label class="adm-field adm-field--check${full}"><input type="checkbox" name="${f.name}" value="1" ${v && v !== "0" ? "checked" : ""}><span>${esc(f.label)}${f.help ? ` <small>${esc(f.help)}</small>` : ""}</span></label>`;
    case "tags":
      return `<label class="adm-field${full}"><span>${esc(f.label)}</span><input name="${f.name}" value="${esc(Array.isArray(value) ? (value as string[]).join(", ") : v)}" placeholder="tag1, tag2"><small>Séparés par des virgules</small></label>`;
    case "image":
      return `<div class="adm-field adm-field--media${full}" data-media-field>
        <span>${esc(f.label)}</span>
        <div class="media-pick"><img src="${v ? esc(v.startsWith("/") ? v : "/media/" + v) : ""}" alt="" class="media-pick__thumb ${v ? "" : "is-empty"}" data-media-thumb>
        <div><input name="${f.name}" value="${esc(v)}" placeholder="clé R2 ou /assets/…" data-media-input>
        <button type="button" class="btn btn--sm" data-media-open>Choisir dans la bibliothèque</button></div></div></div>`;
    case "file":
      return `<div class="adm-field adm-field--media${full}" data-media-field data-doc>
        <span>${esc(f.label)}</span>
        <div class="media-pick"><div><input name="${f.name}" value="${esc(v)}" placeholder="clé R2" data-media-input>
        <button type="button" class="btn btn--sm" data-media-open data-doc>Choisir un document</button></div></div></div>`;
    case "json":
      return `<label class="adm-field${full}"><span>${esc(f.label)}</span><textarea name="${f.name}" rows="4" data-json>${esc(typeof value === "string" ? v : JSON.stringify(value, null, 2))}</textarea>${f.help ? `<small>${esc(f.help)}</small>` : ""}</label>`;
    case "date":
      return `<label class="adm-field"><span>${esc(f.label)}</span><input type="date" name="${f.name}" value="${esc(v.slice(0, 10))}"></label>`;
    case "datetime":
      return `<label class="adm-field"><span>${esc(f.label)}${f.required ? " *" : ""}</span><input type="datetime-local" name="${f.name}" value="${esc(v.replace(" ", "T").slice(0, 16))}">${f.help ? `<small>${esc(f.help)}</small>` : ""}</label>`;
    case "number":
      return `<label class="adm-field"><span>${esc(f.label)}</span><input type="number" name="${f.name}" value="${esc(v)}"></label>`;
    case "url":
      return `<label class="adm-field"><span>${esc(f.label)}</span><input type="url" name="${f.name}" value="${esc(v)}"></label>`;
    case "readonly":
      return v ? `<div class="adm-field"><span>${esc(f.label)}</span><p class="adm-static">${esc(v)}</p></div>` : "";
    default:
      return `<label class="adm-field${full}"><span>${esc(f.label)}${f.required ? " *" : ""}</span><input name="${f.name}" value="${esc(v)}">${f.help ? `<small>${esc(f.help)}</small>` : ""}</label>`;
  }
}

function statusPill(status: string): string {
  const map: Record<string, string> = { publie: "ok", brouillon: "", en_attente: "warn", depublie: "warn", archive: "muted", nouveau: "warn", qualifie: "", converti: "ok", perdu: "muted", actif: "ok", lu: "", traite: "ok" };
  return `<span class="pill ${map[status] || ""}">${esc(status.replace(/_/g, " "))}</span>`;
}

function relationLabelOptions(db: D1Database, f: Field): Promise<{ value: string; label: string }[]> {
  if (!f.relation) return Promise.resolve([]);
  return q(db, `SELECT ${f.relation.value} AS v, ${f.relation.label} AS l FROM ${f.relation.table} ORDER BY l`).then((rows) => rows.map((r) => ({ value: String(r.v), label: String(r.l) })));
}

// ---------- Router CRUD ----------
export function crudRouter(): Hono<{ Bindings: Env }> {
  const r = new Hono<{ Bindings: Env }>();

  const getRes = (key: string): ResourceDef | null => RESOURCES[key] || null;

  const deny = (c: Context<{ Bindings: Env }>, perm: string, action: "view" | "create" | "edit" | "delete" | "publish"): Response | null => {
    const user = c.get("user")!;
    if (!can(user.role, perm, action)) {
      return c.html(adminLayout(c, user, "Accès refusé", `<div class="adm-alert adm-alert--error">Votre rôle ne permet pas cette opération sur ce module (contrôle serveur RBAC).</div>`), 403);
    }
    return null;
  };

  // LISTE
  r.get("/:res", async (c) => {
    const res = getRes(c.req.param("res"));
    const user = c.get("user")!;
    if (!res) return c.notFound();
    const d = deny(c, res.perm, "view");
    if (d) return d;

    const search = (c.req.query("q") || "").trim();
    const statusF = (c.req.query("status") || "").trim();
    const page = Math.max(1, parseInt(c.req.query("page") || "1", 10) || 1);
    const per = 20;

    const where: string[] = ["1=1"];
    const params: unknown[] = [];
    if (search && res.searchable?.length) {
      where.push("(" + res.searchable.map((f) => `${f} LIKE ?`).join(" OR ") + ")");
      for (const _ of res.searchable) params.push(`%${search}%`);
    }
    if (statusF && res.statusable) {
      where.push("status = ?");
      params.push(statusF);
    }
    const whereSql = where.join(" AND ");

    const total = await count(c.env.DB, res.table, whereSql, ...params);
    const rows = await q<Record<string, unknown>>(c.env.DB, `SELECT * FROM ${res.table} WHERE ${whereSql} ORDER BY ${res.order || "id DESC"} LIMIT ? OFFSET ?`, ...params, per, (page - 1) * per);

    // libellés des relations affichées
    const relFields = res.columns.filter((f) => f.type === "relation");
    const relLabels: Record<string, Record<string, string>> = {};
    for (const rf of relFields) {
      const opts = await relationLabelOptions(c.env.DB, rf);
      relLabels[rf.name] = Object.fromEntries(opts.map((o) => [o.value, o.label]));
    }

    const pages = Math.max(1, Math.ceil(total / per));
    const canCreate = can(user.role, res.perm, "create");
    const canEdit = can(user.role, res.perm, "edit");
    const canDelete = can(user.role, res.perm, "delete");

    const rowsHtml = rows
      .map((row) => {
        const cols = res.columns
          .map((f) => {
            const v = row[f.name];
            if (f.type === "relation") return `<td>${esc(relLabels[f.name]?.[String(v)] || "")}</td>`;
            if (f.name === "status") return `<td>${statusPill(String(v))}</td>`;
            if (f.type === "boolean") return `<td>${v && v !== "0" ? "✔" : "—"}</td>`;
            if (f.type === "datetime") return `<td class="muted">${fmtDate(String(v || ""), "short")}</td>`;
            if (f.type === "url") return `<td class="muted">${v ? `<a href="${esc(String(v))}" target="_blank" rel="noopener">lien ↗</a>` : ""}</td>`;
            return `<td>${esc(String(v ?? "")).slice(0, 90)}</td>`;
          })
          .join("");
        const actions: string[] = [];
        if (canEdit) actions.push(`<a class="btn btn--sm" href="/admin/${res.key}/${row.id}">Modifier</a>`);
        if (canDelete) actions.push(`<form method="post" action="/admin/${res.key}/${row.id}/delete" data-confirm="Supprimer définitivement « ${esc(String(row[res.columns[0].name]))} » ?"><input type="hidden" name="_csrf" value="${user.csrf}"><button class="btn btn--sm btn--danger">Suppr.</button></form>`);
        return `<tr><td class="adm-id">#${row.id}</td>${cols}<td class="adm-actions">${actions.join("")}</td></tr>`;
      })
      .join("");

    const body = `${res.intro ? `<p class="adm-intro">${esc(res.intro)}</p>` : ""}
    <div class="adm-toolbar">
      <form method="get" class="adm-search"><input name="q" value="${esc(search)}" placeholder="Rechercher…"><button class="btn btn--sm">Chercher</button></form>
      ${res.statusable ? `<div class="adm-filters"><a class="chip ${!statusF ? "is-on" : ""}" href="/admin/${res.key}">Tous</a>${CONTENT_STATUSES.map((s) => `<a class="chip ${statusF === s ? "is-on" : ""}" href="/admin/${res.key}?status=${s}">${esc(s.replace(/_/g, " "))}</a>`).join("")}</div>` : ""}
      ${canCreate ? `<a class="btn btn--primary adm-new" href="/admin/${res.key}/new">+ Nouveau ${esc(res.single)}</a>` : ""}
    </div>
    ${total === 0 ? `<div class="adm-empty">Aucun ${esc(res.single)} pour le moment.${canCreate ? " Utilisez « + Nouveau » pour créer le premier." : ""}</div>` : `
    <div class="adm-table-wrap"><table class="adm-table"><thead><tr><th></th>${res.columns.map((f) => `<th>${esc(f.label)}</th>`).join("")}<th>Actions</th></tr></thead><tbody>${rowsHtml}</tbody></table></div>
    <div class="pager adm-pager">${page > 1 ? `<a href="/admin/${res.key}?page=${page - 1}">← Préc.</a>` : ""}<span>Page ${page} / ${pages} — ${total} élément${total > 1 ? "s" : ""}</span>${page < pages ? `<a href="/admin/${res.key}?page=${page + 1}">Suiv. →</a>` : ""}</div>`}`;
    return c.html(adminLayout(c, user, res.title, body, `/admin/${res.key}`));
  });

  // NOUVEAU
  r.get("/:res/new", async (c) => {
    const res = getRes(c.req.param("res"));
    const user = c.get("user")!;
    if (!res) return c.notFound();
    const d = deny(c, res.perm, "create");
    if (d) return d;
    const relFields = res.fields.filter((f) => f.type === "relation");
    const relOpts: Record<string, { value: string; label: string }[]> = {};
    for (const f of relFields) relOpts[f.name] = await relationLabelOptions(c.env.DB, f);
    const body = `<form method="post" action="/admin/${res.key}" class="adm-form" data-confirm-leave>
      <input type="hidden" name="_csrf" value="${user.csrf}">
      ${res.fields.map((f) => fieldInput(f, "", user.csrf, relOpts[f.name])).join("")}
      <div class="adm-form__actions"><button class="btn btn--primary" type="submit">Créer</button><a class="btn" href="/admin/${res.key}">Annuler</a></div>
    </form>`;
    return c.html(adminLayout(c, user, `Nouveau ${res.single}`, body, `/admin/${res.key}`));
  });

  // CRÉATION
  r.post("/:res", async (c) => {
    const res = getRes(c.req.param("res"));
    const user = c.get("user")!;
    if (!res) return c.notFound();
    const d = deny(c, res.perm, "create");
    if (d) return d;
    const form = await c.req.parseBody({ all: true });
    const { data, error } = await collectFields(c, res, form, null);
    if (error) return c.html(adminLayout(c, user, "Erreur", `<div class="adm-alert adm-alert--error">${esc(error)}</div><a class="btn" href="/admin/${res.key}/new">Retour au formulaire</a>`), 400);
    if (res.slugFrom && !data.slug) data.slug = slugify(String(data[res.slugFrom] || `${res.key}-${Date.now()}`));
    const cols = Object.keys(data);
    await c.env.DB.prepare(`INSERT INTO ${res.table} (${cols.join(",")}, created_at, updated_at) VALUES (${cols.map((_, i) => `?${i + 1}`).join(",")}, datetime('now'), datetime('now'))`).bind(...cols.map((k) => data[k])).run();
    const created = await q1<{ id: number }>(c.env.DB, `SELECT id FROM ${res.table} ORDER BY id DESC LIMIT 1`);
    await audit(c, "creation", res.table, created?.id, { slug: data.slug });
    return c.redirect(`/admin/${res.key}?msg=créé`);
  });

  // ÉDITION
  r.get("/:res/:id", async (c) => {
    const res = getRes(c.req.param("res"));
    const user = c.get("user")!;
    if (!res) return c.notFound();
    const d = deny(c, res.perm, "view");
    if (d) return d;
    const row = await q1<Record<string, unknown>>(c.env.DB, `SELECT * FROM ${res.table} WHERE id = ?`, c.req.param("id"));
    if (!row) return c.notFound();
    const relFields = res.fields.filter((f) => f.type === "relation");
    const relOpts: Record<string, { value: string; label: string }[]> = {};
    for (const f of relFields) relOpts[f.name] = await relationLabelOptions(c.env.DB, f);
    const canEdit = can(user.role, res.perm, "edit");
    const formFields = res.fields.map((f) => fieldInput(f, row[f.name], user.csrf, relOpts[f.name])).join("");
    const body = canEdit
      ? `<form method="post" action="/admin/${res.key}/${row.id}" class="adm-form" data-confirm-leave>
          <input type="hidden" name="_csrf" value="${user.csrf}">
          ${formFields}
          <div class="adm-form__actions"><button class="btn btn--primary" type="submit">Enregistrer</button><a class="btn" href="/admin/${res.key}">Retour</a></div>
        </form>
        ${can(user.role, res.perm, "delete") ? `<form method="post" action="/admin/${res.key}/${row.id}/delete" data-confirm="Supprimer définitivement cet élément ?"><input type="hidden" name="_csrf" value="${user.csrf}"><button class="btn btn--danger adm-zone-danger">Supprimer définitivement</button></form>` : ""}`
      : `<div class="adm-form">${formFields}<p class="muted">Mode lecture : votre rôle ne permet pas la modification.</p></div>`;
    return c.html(adminLayout(c, user, `${res.title} — #${row.id}`, body, `/admin/${res.key}`));
  });

  // MISE À JOUR
  r.post("/:res/:id", async (c) => {
    const res = getRes(c.req.param("res"));
    const user = c.get("user")!;
    if (!res) return c.notFound();
    const d = deny(c, res.perm, "edit");
    if (d) return d;
    const form = await c.req.parseBody({ all: true });
    const { data, error } = await collectFields(c, res, form, c.req.param("id"));
    if (error) return c.html(adminLayout(c, user, "Erreur", `<div class="adm-alert adm-alert--error">${esc(error)}</div><a class="btn" href="/admin/${res.key}/${c.req.param('id')}">Retour au formulaire</a>`), 400);
    const cols = Object.keys(data);
    await c.env.DB.prepare(`UPDATE ${res.table} SET ${cols.map((k, i) => `${k} = ?${i + 1}`).join(",")}, updated_at = datetime('now') WHERE id = ?${cols.length + 1}`).bind(...cols.map((k) => data[k]), c.req.param("id")).run();
    await audit(c, "modification", res.table, c.req.param("id"), { champs: cols });
    return c.redirect(`/admin/${res.key}?msg=enregistré`);
  });

  // SUPPRESSION
  r.post("/:res/:id/delete", async (c) => {
    const res = getRes(c.req.param("res"));
    const user = c.get("user")!;
    if (!res) return c.notFound();
    const d = deny(c, res.perm, "delete");
    if (d) return d;
    await c.env.DB.prepare(`DELETE FROM ${res.table} WHERE id = ?`).bind(c.req.param("id")).run();
    await audit(c, "suppression", res.table, c.req.param("id"));
    return c.redirect(`/admin/${res.key}?msg=supprimé`);
  });

  return r;
}

// Collecte + validation serveur des champs
async function collectFields(c: Context<{ Bindings: Env }>, res: ResourceDef, form: Record<string, unknown>, id: string | null): Promise<{ data: Record<string, unknown>; error?: string }> {
  const data: Record<string, unknown> = {};
  for (const f of res.fields) {
    if (f.type === "readonly" || f.type === "file") continue;
    const raw = form[f.name];
    if (f.required && (raw == null || String(raw).trim() === "")) return { data, error: `Le champ « ${f.label} » est obligatoire.` };
    if (raw == null) {
      if (f.type === "boolean") data[f.name] = 0;
      continue;
    }
    const s = String(raw).trim();
    switch (f.type) {
      case "number":
        data[f.name] = s === "" ? 0 : Number(s) || 0;
        break;
      case "boolean":
        data[f.name] = s === "1" ? 1 : 0;
        break;
      case "tags": {
        const arr = s ? s.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 20) : [];
        data[f.name] = JSON.stringify(arr);
        break;
      }
      case "json": {
        if (s === "") {
          data[f.name] = f.name === "features" || f.name === "gallery" ? "[]" : "{}";
          break;
        }
        try {
          const parsed = JSON.parse(s);
          data[f.name] = JSON.stringify(parsed);
        } catch {
          return { data, error: `Format JSON invalide pour « ${f.label} ».` };
        }
        break;
      }
      case "relation":
        data[f.name] = s === "" ? null : Number(s) || null;
        break;
      case "datetime":
        data[f.name] = s === "" ? null : s.replace("T", " ") + (s.length === 16 ? ":00" : "");
        break;
      case "url":
        data[f.name] = s.slice(0, 500);
        break;
      case "image":
        data[f.name] = s.slice(0, 300);
        break;
      default: {
        let v = s;
        if (f.name === "slug") {
          v = slugify(s);
          // unicité du slug
          const existing = await q1<{ id: number; slug: string }>(c.env.DB, `SELECT id, slug FROM ${res.table} WHERE slug = ? AND id != ?`, v, id || "0");
          if (existing) return { data, error: `Le slug « ${v} » est déjà utilisé par l'élément #${existing.id}.` };
        }
        if (f.name === "status" && !CONTENT_STATUSES.includes(s as ContentStatus) && res.statusable) return { data, error: "Statut invalide." };
        if (f.name === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return { data, error: "Email invalide." };
        data[f.name] = v;
      }
    }
  }
  return { data };
}
