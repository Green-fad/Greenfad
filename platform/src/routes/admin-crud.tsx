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
import { icon } from "../icons";
import { validateBlocks, normalizeBlocksInput } from "../blocks";

type FieldType = "text" | "textarea" | "markdown" | "number" | "date" | "datetime" | "select" | "tags" | "image" | "file" | "relation" | "boolean" | "json" | "list" | "kvlist" | "readonly" | "url" | "media_multi";

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
  relationsKey?: "product" | "project" | "service"; // médias liés via content_relations
  columns: Field[];
  fields: Field[];
  intro?: string;
};

const STATUS_OPTIONS = CONTENT_STATUSES.map((s) => ({ value: s, label: s.replace("_", " ") }));
const PUBLIE = "publie";

// Bibliothèque d'icônes autorisée (noms de src/icons.ts) — aucune emoji saisie possible
const ICON_OPTIONS = ["cpu", "code", "cloud", "database", "server", "shield", "zap", "layers", "globe", "lightbulb", "rocket", "flask", "compass", "target", "briefcase", "building", "users", "smartphone", "monitor", "bar-chart", "trending-up", "book-open", "newspaper", "camera", "leaf", "workflow", "route", "git-branch", "package", "settings"].map((n) => ({ value: n, label: n }));

const PRODUCT_STATES = [
  { value: "developpement", label: "En développement" },
  { value: "beta", label: "Bêta" },
  { value: "disponible", label: "Disponible" },
  { value: "evolution", label: "En évolution" },
  { value: "archive", label: "Archivé" },
];

const POST_KINDS = [
  { value: "article", label: "Actualité" },
  { value: "analyse", label: "Analyse technologique" },
  { value: "recherche", label: "Recherche & développement" },
  { value: "prototype", label: "Innovation / prototype" },
  { value: "veille", label: "Veille technologique" },
  { value: "publication", label: "Publication institutionnelle" },
  { value: "guide", label: "Guide & ressources" },
  { value: "opinion", label: "Opinion & perspectives" },
  { value: "recit", label: "Histoire de projet / retour d'expérience" },
];

export const RESOURCES: Record<string, ResourceDef> = {
  products: {
    key: "products", table: "products", title: "Produits technologiques", single: "produit", perm: "products", statusable: true,
    slugFrom: "name", order: "sort_order ASC", searchable: ["name", "tagline"], relationsKey: "product",
    intro: "Chaque produit dispose d'une fiche portfolio complète (problème, vision, architecture, démonstrations, versions). La page publique est générée automatiquement.",
    columns: [{ name: "name", label: "Nom", type: "text", list: true }, { name: "state", label: "État", type: "select", options: PRODUCT_STATES, list: true }, { name: "category", label: "Catégorie", type: "text", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }, { name: "sort_order", label: "Ordre", type: "number", list: true }],
    fields: [
      { name: "name", label: "Nom officiel du produit", type: "text", required: true },
      { name: "slug", label: "Identifiant URL (slug)", type: "text", help: "Laisser vide pour générer automatiquement" },
      { name: "tagline", label: "Accroche", type: "textarea", form_span: true },
      { name: "category", label: "Secteur d'activité / catégorie", type: "text" },
      { name: "state", label: "État du produit", type: "select", options: PRODUCT_STATES },
      { name: "image_key", label: "Image principale (couverture, bannière)", type: "image" },
      { name: "logo_key", label: "Logo du produit (affiché sur les cartes et l'accueil)", type: "image" },
      { name: "icon", label: "Icône (bibliothèque SVG)", type: "select", options: ICON_OPTIONS },
      { name: "description_md", label: "Présentation générale (markdown)", type: "markdown", form_span: true },
      { name: "problem_md", label: "Problème auquel le produit répond", type: "markdown", form_span: true },
      { name: "vision_md", label: "Vision et objectif", type: "markdown", form_span: true },
      { name: "origin_md", label: "Origine et contexte de création", type: "markdown", form_span: true },
      { name: "features", label: "Fonctionnalités détaillées", type: "list", form_span: true, help: "Une fonctionnalité par ligne — aucun JSON à écrire" },
      { name: "modules_md", label: "Modules et services intégrés", type: "markdown", form_span: true },
      { name: "architecture_md", label: "Architecture et technologies (si publication autorisée)", type: "markdown", form_span: true },
      { name: "ux_md", label: "Expérience utilisateur et interfaces", type: "markdown", form_span: true },
      { name: "audience", label: "Publics et utilisateurs cibles", type: "textarea", form_span: true },
      { name: "benefits_md", label: "Bénéfices et valeur ajoutée", type: "markdown", form_span: true },
      { name: "differentiators_md", label: "Éléments différenciateurs", type: "markdown", form_span: true },
      { name: "use_cases_md", label: "Cas d'utilisation", type: "markdown", form_span: true },
      { name: "related_service_id", label: "Expertise mobilisée", type: "relation", relation: { table: "services", label: "name", value: "id" } },
      { name: "links_json", label: "Liens officiels", type: "kvlist", form_span: true, help: "Un lien par ligne : Nom du lien | https://adresse — aucun JSON à écrire" },
      { name: "versions_json", label: "Historique des versions publiables", type: "kvlist", form_span: true, help: "Une version par ligne : 1.0 | 2025 | Note des changements" },
      { name: "external_url", label: "URL de l'application / démo", type: "url" },
      { name: "blocks", label: "Sections éditoriales supplémentaires", type: "json", form_span: true, help: "Optionnel — laissez vide. Pour construire des sections, utilisez le Page Builder des pages : plus simple et visuel." },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
      { name: "meta_title", label: "Titre SEO", type: "text" },
      { name: "meta_description", label: "Description SEO", type: "textarea" },
      { name: "seo_keywords", label: "Mots-clés éditoriaux", type: "text" },
      { name: "og_image", label: "Image de partage Open Graph", type: "image" },
      { name: "_media", label: "Médias liés (galerie & vidéos du produit)", type: "media_multi", form_span: true, help: "Cochez les médias du Media Center à associer — réutilisables sans duplication" },
    ],
  },
  services: {
    key: "services", table: "services", title: "Services & Expertises", single: "service", perm: "services", statusable: true,
    slugFrom: "name", order: "sort_order ASC", searchable: ["name", "summary"], relationsKey: "service",
    columns: [{ name: "name", label: "Nom", type: "text", list: true }, { name: "sort_order", label: "Ordre", type: "number", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "name", label: "Nom du service", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", help: "Laisser vide pour générer automatiquement" },
      { name: "summary", label: "Résumé (cartes & SEO)", type: "textarea", form_span: true },
      { name: "icon", label: "Icône (bibliothèque SVG)", type: "select", options: ICON_OPTIONS },
      { name: "image_key", label: "Image", type: "image" },
      { name: "content_md", label: "Présentation commerciale complète (markdown)", type: "markdown", form_span: true },
      { name: "methodology_md", label: "Méthodologie d'intervention (markdown)", type: "markdown", form_span: true, help: "Étapes numérotées ou sous-titres — affichée en section « Comment nous procédons »" },
      { name: "process_md", label: "Déroulement d'un projet type (markdown)", type: "markdown", form_span: true },
      { name: "includes_json", label: "Ce que le service inclut", type: "list", form_span: true, help: "Un élément par ligne — aucun JSON à écrire" },
      { name: "tech_json", label: "Technologies & outils maîtrisés", type: "list", form_span: true, help: "Une technologie par ligne" },
      { name: "industries_json", label: "Secteurs / industries adressés", type: "list", form_span: true, help: "Un secteur par ligne" },
      { name: "benefits_md", label: "Bénéfices pour le client (markdown)", type: "markdown", form_span: true },
      { name: "deliverables_md", label: "Livrables types (markdown)", type: "markdown", form_span: true },
      { name: "_media", label: "Médias liés (galerie & vidéos du service)", type: "media_multi", form_span: true, help: "Médias du Media Center réutilisables sans duplication" },
      { name: "sort_order", label: "Ordre", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
      { name: "meta_title", label: "Titre SEO", type: "text" },
      { name: "meta_description", label: "Description SEO", type: "textarea" },
      { name: "og_image", label: "Image de partage Open Graph", type: "image" },
    ],
  },
  posts: {
    key: "posts", table: "posts", title: "Blog & Publications", single: "article", perm: "posts", statusable: true,
    slugFrom: "title", order: "published_at DESC", searchable: ["title", "excerpt"],
    intro: "Le blog GREEN FAD (public : /blog) : actualités, lancements produits, analyses, R&D, guides et retours d'expérience — reliés aux produits, projets et pays. Article le plus lu affiché automatiquement dans « Articles populaires ».",
    columns: [{ name: "title", label: "Titre", type: "text", list: true }, { name: "kind", label: "Type", type: "select", options: POST_KINDS, list: true }, { name: "published_at", label: "Date éditoriale", type: "datetime", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "title", label: "Titre de l'article", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", help: "Laisser vide pour générer automatiquement" },
      { name: "kind", label: "Type de publication", type: "select", options: POST_KINDS },
      { name: "excerpt", label: "Chapeau / résumé", type: "textarea", form_span: true },
      { name: "cover_key", label: "Image de couverture", type: "image" },
      { name: "category", label: "Catégorie libre", type: "text", help: "seo, web, mobile, digital…" },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "author", label: "Auteur", type: "text" },
      { name: "content_md", label: "Contenu (markdown)", type: "markdown", form_span: true, help: "Images : ![alt](/media/…). Citations : > texte. Blocs techniques : ```code```" },
      { name: "related_product_id", label: "Produit lié", type: "relation", relation: { table: "products", label: "name", value: "id" } },
      { name: "related_project_id", label: "Projet lié", type: "relation", relation: { table: "projects", label: "title", value: "id" } },
      { name: "related_service_id", label: "Service lié", type: "relation", relation: { table: "services", label: "name", value: "id" } },
      { name: "country_id", label: "Pays concerné", type: "relation", relation: { table: "countries", label: "name", value: "id" } },
      { name: "is_featured", label: "À la une", type: "boolean" },
      { name: "published_at", label: "Date éditoriale affichée", type: "datetime", required: true, help: "Indépendante de la date technique — permet de publier des archives avec leur vraie date historique" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "meta_title", label: "Titre SEO", type: "text" },
      { name: "meta_description", label: "Description SEO", type: "textarea" },
      { name: "seo_keywords", label: "Mots-clés éditoriaux", type: "text" },
      { name: "og_image", label: "Image de partage Open Graph", type: "image" },
    ],
  },
  projects: {
    key: "projects", table: "projects", title: "Projets & Réalisations", single: "projet", perm: "projects", statusable: true,
    slugFrom: "title", order: "sort_order ASC", searchable: ["title", "summary"], relationsKey: "project",
    intro: "Études de cas des prestations et partenariats — distinctes des produits propriétaires. Ne jamais publier de résultats ou références non autorisés.",
    columns: [{ name: "title", label: "Titre", type: "text", list: true }, { name: "client", label: "Client", type: "text", list: true }, { name: "category", label: "Catégorie", type: "text", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "title", label: "Titre du projet", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "client", label: "Client (si autorisé)", type: "text" },
      { name: "client_type", label: "Type de relation", type: "select", options: [{ value: "client", label: "Client direct" }, { value: "partenaire", label: "Partenaire technologique" }, { value: "interne", label: "Projet interne / expérimentation" }, { value: "solution", label: "Solution personnalisée" }] },
      { name: "country_id", label: "Pays", type: "relation", relation: { table: "countries", label: "name", value: "id" } },
      { name: "related_service_id", label: "Expertise mobilisée", type: "relation", relation: { table: "services", label: "name", value: "id" } },
      { name: "category", label: "Catégorie", type: "text" },
      { name: "summary", label: "Résumé", type: "textarea", form_span: true },
      { name: "content_md", label: "Étude de cas (markdown)", type: "markdown", form_span: true },
      { name: "need_md", label: "Contexte & besoin", type: "markdown", form_span: true },
      { name: "approach_md", label: "Approche", type: "markdown", form_span: true },
      { name: "solution_md", label: "Solution livrée", type: "markdown", form_span: true },
      { name: "tech_stack", label: "Technologies utilisées (public)", type: "markdown", form_span: true },
      { name: "results_md", label: "Résultats vérifiés (jamais inventés)", type: "markdown", form_span: true },
      { name: "image_key", label: "Image principale", type: "image" },
      { name: "gallery", label: "Galerie simple (images)", type: "list", form_span: true, help: "Une image par ligne — téléversez puis copiez la clé, ou collez un chemin /assets/…" },
      { name: "completed_at", label: "Livré le", type: "date" },
      { name: "sort_order", label: "Ordre", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Date de publication", type: "datetime" },
      { name: "meta_title", label: "Titre SEO", type: "text" },
      { name: "meta_description", label: "Description SEO", type: "textarea" },
      { name: "seo_keywords", label: "Mots-clés éditoriaux", type: "text" },
      { name: "og_image", label: "Image de partage Open Graph", type: "image" },
      { name: "_media", label: "Médias liés (galerie du projet)", type: "media_multi", form_span: true, help: "Médias du Media Center réutilisables sans duplication" },
    ],
  },
  countries: {
    key: "countries", table: "countries", title: "Pays", single: "pays", perm: "countries", statusable: true,
    slugFrom: "name", order: "sort_order ASC", searchable: ["name"],
    columns: [{ name: "name", label: "Pays", type: "text", list: true }, { name: "iso2", label: "Code", type: "text", list: true }, { name: "is_registered", label: "Immatriculé", type: "boolean", list: true }, { name: "status", label: "Statut", type: "readonly", list: true }],
    fields: [
      { name: "name", label: "Nom du pays", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "iso2", label: "Code ISO (ML, BF, NI, CD, CI…)", type: "text", required: true, help: "Affiché en badge sur les cartes — les drapeaux emoji sont remplacés par des badges ISO modernes" },
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
function fieldInput(f: Field, value: unknown, csrf: string, relationOptions?: { value: string; label: string }[], mediaItems: { id: number; title: string; kind: string; thumb: string }[] = []): string {
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
        <div class="media-pick__main"><input name="${f.name}" value="${esc(v)}" placeholder="Téléversez une image depuis votre appareil, ou choisissez dans la bibliothèque" data-media-input>
        <div class="media-pick__btns">
        <button type="button" class="btn btn--sm btn--primary" data-media-upload>${icon("upload")} Téléverser</button>
        <button type="button" class="btn btn--sm" data-media-open>Choisir</button>
        <button type="button" class="btn btn--sm" data-media-clear>Retirer</button>
        </div></div></div>${f.help ? `<small>${esc(f.help)}</small>` : ""}</div>`;
    case "file":
      return `<div class="adm-field adm-field--media${full}" data-media-field data-doc>
        <span>${esc(f.label)}</span>
        <div class="media-pick"><div class="media-pick__main"><input name="${f.name}" value="${esc(v)}" placeholder="Téléversez un document depuis votre appareil, ou choisissez dans la bibliothèque" data-media-input>
        <div class="media-pick__btns">
        <button type="button" class="btn btn--sm btn--primary" data-media-upload data-doc>${icon("upload")} Téléverser</button>
        <button type="button" class="btn btn--sm" data-media-open data-doc>Choisir</button>
        <button type="button" class="btn btn--sm" data-media-clear>Retirer</button>
        </div></div></div>${f.help ? `<small>${esc(f.help)}</small>` : ""}</div>`;
    case "json":
      return `<label class="adm-field${full}"><span>${esc(f.label)}</span><textarea name="${f.name}" rows="4" data-json>${esc(typeof value === "string" ? v : JSON.stringify(value, null, 2))}</textarea>${f.help ? `<small>${esc(f.help)}</small>` : ""}</label>`;
    case "list": {
      // Éditeur simple : un élément par ligne — converti en tableau JSON côté serveur
      const lines = Array.isArray(value) ? (value as unknown[]).map(String) : parseJSON<string[]>(typeof value === "string" ? value : "[]", []);
      return `<label class="adm-field${full}"><span>${esc(f.label)}${f.required ? " *" : ""}</span><textarea name="${f.name}" rows="6" data-list>${esc((lines || []).join("\n"))}</textarea>${f.help ? `<small>${esc(f.help)}</small>` : ""}</label>`;
    }
    case "kvlist": {
      // Éditeur clé-valeur : « Label | valeur1 | valeur2 » par ligne — converti en objets JSON côté serveur
      const pairs = parseJSON<Record<string, string>[]>(typeof value === "string" ? value : "[]", []);
      const lines2 = (pairs || []).map((o) => Object.values(o).join(" | "));
      return `<label class="adm-field${full}"><span>${esc(f.label)}${f.required ? " *" : ""}</span><textarea name="${f.name}" rows="5" data-list>${esc(lines2.join("\n"))}</textarea>${f.help ? `<small>${esc(f.help)}</small>` : ""}</label>`;
    }
    case "date":
      return `<label class="adm-field"><span>${esc(f.label)}</span><input type="date" name="${f.name}" value="${esc(v.slice(0, 10))}"></label>`;
    case "datetime":
      return `<label class="adm-field"><span>${esc(f.label)}${f.required ? " *" : ""}</span><input type="datetime-local" name="${f.name}" value="${esc(v.replace(" ", "T").slice(0, 16))}">${f.help ? `<small>${esc(f.help)}</small>` : ""}</label>`;
    case "number":
      return `<label class="adm-field"><span>${esc(f.label)}</span><input type="number" name="${f.name}" value="${esc(v)}"></label>`;
    case "url":
      return `<label class="adm-field"><span>${esc(f.label)}</span><input type="url" name="${f.name}" value="${esc(v)}"></label>`;
    case "media_multi": {
      const selected = new Set(String((value as unknown) || "").split(",").filter(Boolean));
      return `<div class="adm-field${full}" data-media-multi><span>${esc(f.label)}</span><p class="muted" style="font-size:.82rem">${esc(f.help || "")}</p><div class="media-multi-grid">${mediaItems
        .map((mi) => `<label class="media-multi-item"><input type="checkbox" name="${f.name}" value="${mi.id}" ${selected.has(String(mi.id)) ? "checked" : ""}>${mi.thumb ? `<img src="${esc(mi.thumb)}" alt="">` : `<span class="media-multi-item__icon">${icon("video")}</span>`}<span>${esc(mi.title)}<em>${esc(mi.kind)}</em></span></label>`)
        .join("")}</div></div>`;
    }
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

// Alias d'URL pour une navigation lisible (/admin/team → team_members…)
const RESOURCE_ALIASES: Record<string, string> = {
  team: "team_members",
  press: "press_releases",
  newsletter: "newsletter_subscribers",
};

// ---------- Médias liés (content_relations) ----------
async function loadMediaOptions(db: D1Database): Promise<{ id: number; title: string; kind: string; thumb: string }[]> {
  const images = await q(db, "SELECT mi.id, mi.title, m.r2_key FROM media_items mi JOIN media m ON m.id = mi.media_id WHERE mi.type='image' AND mi.status='publie' ORDER BY mi.sort_order LIMIT 200");
  const videos = await q(db, "SELECT id, title, provider FROM media_items WHERE type='video' AND status='publie' ORDER BY sort_order LIMIT 50");
  return [
    ...images.map((i) => ({ id: Number(i.id), title: String(i.title), kind: "image", thumb: `/media/${i.r2_key}` })),
    ...videos.map((v) => ({ id: Number(v.id), title: String(v.title), kind: `vidéo ${String(v.provider || "")}`, thumb: "" })),
  ];
}

async function loadSelectedRelations(db: D1Database, content_type: string, content_id: string): Promise<string> {
  const rows = await q(db, "SELECT media_item_id FROM content_relations WHERE content_type = ? AND content_id = ? ORDER BY sort_order", content_type, content_id);
  return rows.map((r) => String(r.media_item_id)).join(",");
}

async function syncRelations(c: Context<{ Bindings: Env }>, content_type: string, content_id: number, form: Record<string, unknown>): Promise<void> {
  const raw = form["_media"];
  const ids = Array.isArray(raw) ? raw.map((x) => Number(x)).filter((n) => Number.isInteger(n) && n > 0) : Number(raw) ? [Number(raw)] : [];
  await c.env.DB.prepare("DELETE FROM content_relations WHERE content_type = ? AND content_id = ?").bind(content_type, content_id).run();
  for (let i = 0; i < ids.length; i++) {
    await c.env.DB.prepare("INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) VALUES (?1,?2,?3,?4) ON CONFLICT DO NOTHING").bind(content_type, content_id, ids[i], i).run();
  }
}

// ---------- Router CRUD ----------
export function crudRouter(): Hono<{ Bindings: Env }> {
  const r = new Hono<{ Bindings: Env }>();

  const getRes = (key: string): ResourceDef | null => RESOURCES[key] || RESOURCES[RESOURCE_ALIASES[key] || ""] || null;

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
            if (f.type === "boolean") return `<td>${v && v !== "0" ? icon("check-circle", "ok-ic") : "—"}</td>`;
            if (f.type === "datetime") return `<td class="muted">${fmtDate(String(v || ""), "short")}</td>`;
            if (f.type === "url") return `<td class="muted">${v ? `<a href="${esc(String(v))}" target="_blank" rel="noopener">${icon("external-link", "i--inline")} lien</a>` : ""}</td>`;
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
    <div class="pager adm-pager">${page > 1 ? `<a href="/admin/${res.key}?page=${page - 1}">${icon("arrow-right", "flip")} Préc.</a>` : ""}<span>Page ${page} / ${pages} — ${total} élément${total > 1 ? "s" : ""}</span>${page < pages ? `<a href="/admin/${res.key}?page=${page + 1}">Suiv. ${icon("arrow-right")}</a>` : ""}</div>`}`;
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
    const mediaOpts = res.fields.some((f) => f.type === "media_multi") ? await loadMediaOptions(c.env.DB) : [];
    const body = `<form method="post" action="/admin/${res.key}" class="adm-form" data-confirm-leave>
      <input type="hidden" name="_csrf" value="${user.csrf}">
      ${res.fields.map((f) => fieldInput(f, "", user.csrf, relOpts[f.name], mediaOpts)).join("")}
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
    if (created && res.relationsKey) await syncRelations(c, res.relationsKey, created.id, form);
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
    const mediaOpts = res.fields.some((f) => f.type === "media_multi") ? await loadMediaOptions(c.env.DB) : [];
    const selectedMedia = res.relationsKey ? await loadSelectedRelations(c.env.DB, res.relationsKey, c.req.param("id")) : "";
    const canEdit = can(user.role, res.perm, "edit");
    const formFields = res.fields.map((f) => fieldInput(f, f.type === "media_multi" ? selectedMedia : row[f.name], user.csrf, relOpts[f.name], mediaOpts)).join("");
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
    if (res.relationsKey) await syncRelations(c, res.relationsKey, Number(c.req.param("id")), form);
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
    if (res.relationsKey) await c.env.DB.prepare("DELETE FROM content_relations WHERE content_type = ? AND content_id = ?").bind(res.relationsKey, c.req.param("id")).run();
    await audit(c, "suppression", res.table, c.req.param("id"));
    return c.redirect(`/admin/${res.key}?msg=supprimé`);
  });

  return r;
}

// Collecte + validation serveur des champs
async function collectFields(c: Context<{ Bindings: Env }>, res: ResourceDef, form: Record<string, unknown>, id: string | null): Promise<{ data: Record<string, unknown>; error?: string }> {
  const data: Record<string, unknown> = {};
  for (const f of res.fields) {
    if (f.type === "readonly" || f.type === "file" || f.type === "media_multi") continue;
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
      case "list": {
        // Une entrée par ligne — l'admin n'écrit jamais de JSON
        const lines = s ? s.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 40) : [];
        data[f.name] = JSON.stringify(lines);
        break;
      }
      case "kvlist": {
        // « Label | v1 | v2 » par ligne → [{label,url}] (liens) ou [{version,date,note}] (versions)
        const rows = s
          ? s.split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((p) => p.length >= 2 && p[0]).slice(0, 40)
          : [];
        const shaped = f.name === "versions_json"
          ? rows.map((p) => ({ version: p[0], date: p[1] || "", note: p.slice(2).join(" | ") || "" }))
          : rows.map((p) => ({ label: p[0], url: p[1] || "", ...(p.length > 2 ? { note: p.slice(2).join(" | ") } : {}) }));
        data[f.name] = JSON.stringify(shaped);
        break;
      }
      case "json": {
        if (s === "") {
          data[f.name] = f.name === "features" || f.name === "gallery" || f.name === "links_json" || f.name === "versions_json" || f.name === "blocks" ? "[]" : "{}";
          break;
        }
        try {
          let parsed = JSON.parse(s);
          if (f.name === "blocks") {
            // Tolérance : {"blocks":[…]} déballé, bloc unique enveloppé — l'admin n'est plus bloqué
            parsed = normalizeBlocksInput(parsed);
            const v = validateBlocks(parsed);
            if (!v.ok) return { data, error: `Sections éditoriales : ${v.error}` };
            data[f.name] = JSON.stringify(v.blocks);
            break;
          }
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
