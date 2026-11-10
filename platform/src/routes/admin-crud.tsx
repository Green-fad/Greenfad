// GREEN FAD — Moteur CRUD générique du Dashboard
// Un moteur, tous les modules : chaque ressource est déclarée, le serveur
// valide, journalise et applique les permissions RBAC.
import { Hono, Context } from "hono";
import { Env, ContentStatus, CONTENT_STATUSES } from "../types";
import { q, q1, count } from "../db";
import { adminLayout } from "../render/admin";
import { esc, slugify, md, parseJSON, fmtDate, fmtBytes, mediaSrc } from "../utils";
import { audit } from "../audit";
import { can } from "../rbac";
import { saveToR2 } from "../media";
import { icon } from "../icons";
import { validateBlocks, normalizeBlocksInput } from "../blocks";

type FieldType = "text" | "textarea" | "markdown" | "number" | "date" | "datetime" | "select" | "tags" | "image" | "file" | "relation" | "boolean" | "json" | "list" | "kvlist" | "readonly" | "url" | "media_multi" | "screenshots" | "downloads";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  relation?: { table: string; label: string; value: "id" | "slug" };
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
  { value: "bientot", label: "Bientôt disponible" },
  { value: "disponible", label: "Disponible" },
  { value: "evolution", label: "En évolution" },
  { value: "archive", label: "Archivé" },
];

// ---------- Patrimoine historique (Mission CTO N°2) ----------
const MILESTONE_KINDS = [
  { value: "conception", label: "Conception — naissance de l'idée" },
  { value: "cadrage", label: "Cadrage — définition du projet et des objectifs" },
  { value: "developpement", label: "Développement — début du développement" },
  { value: "implementation", label: "Implémentation — grandes fonctionnalités" },
  { value: "annonce", label: "Annonce — communication aux utilisateurs" },
  { value: "tests", label: "Tests — validation et préparation" },
  { value: "premiere_production", label: "Première mise en production" },
  { value: "premier_utilisateur", label: "Premier utilisateur réel" },
  { value: "mise_a_jour", label: "Mise à jour — versions et améliorations" },
  { value: "derniere_evolution", label: "Dernière évolution connue" },
  { value: "situation_actuelle", label: "Situation actuelle du produit" },
];

const VERSION_KINDS = [
  { value: "mineure", label: "Mise à jour mineure" },
  { value: "majeure", label: "Évolution majeure" },
  { value: "module", label: "Nouveau module" },
  { value: "architecture", label: "Changement d'architecture" },
  { value: "production", label: "Mise en production" },
  { value: "correction", label: "Correction importante" },
];

// exacte = date confirmée · approximative = communiquée · archives = retrouvée · estimee = à confirmer · inconnue
const DATE_PRECISIONS = [
  { value: "exacte", label: "Confirmée (preuve datée)" },
  { value: "approximative", label: "Environ (approximation communiquée)" },
  { value: "archives", label: "Retrouvée dans les archives" },
  { value: "estimee", label: "Estimation à confirmer" },
  { value: "inconnue", label: "Inconnue" },
];

const CONFIDENCE_LEVELS = [
  { value: "haute", label: "Haute" },
  { value: "moyenne", label: "Moyenne" },
  { value: "faible", label: "Faible" },
];

const PUB_PROVENANCES = [
  { value: "original_retrouve", label: "Article original retrouvé" },
  { value: "reconstruite", label: "Publication reconstituée" },
  { value: "nouvelle", label: "Nouvelle publication historique" },
];

const SOURCE_TYPES = [
  { value: "fondateur", label: "Fondateur" },
  { value: "archives", label: "Archives internes" },
  { value: "git", label: "Dépôt Git (commits, tags, branches)" },
  { value: "release", label: "Release / artefact" },
  { value: "changelog", label: "Changelog" },
  { value: "article", label: "Article / publication" },
  { value: "store", label: "Store officiel (Play, App Store…)" },
  { value: "web", label: "Site web officiel" },
  { value: "capture", label: "Capture d'écran" },
  { value: "deploiement", label: "Historique de déploiement / CI" },
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
      { name: "screenshots_json", label: "Captures d'écran du produit (mobile & desktop)", type: "screenshots", form_span: true, help: "Téléversez d'abord vos captures via « Téléverser un média », puis cochez-les ici : choisissez Mobile ou Desktop et ajoutez une légende. Ordre = bibliothèque (plus récentes d'abord)." },
      { name: "downloads_json", label: "Liens de téléchargement (App Store, Google Play, APK, Web…)", type: "downloads", form_span: true, help: "Une ligne par lien : Plateforme | https://adresse | Libellé — plateformes : ios, android, apk, web, windows, mac. Ex : android | https://play.google.com/store/apps/details?id=com.ferefad.connect | Google Play" },
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
      { name: "history_intro_md", label: "Intro du parcours historique", type: "markdown", form_span: true, help: "Introduction affichée au-dessus de la chronologie (section « Parcours historique » de la fiche produit) — laissez vide pour l'intro par défaut." },
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
      { name: "product_slug", label: "Produit du patrimoine (chronologie)", type: "relation", relation: { table: "products", label: "name", value: "slug" }, help: "Relie cet article au parcours historique d'un produit — l'article apparaît alors sur la fiche du produit et ses jalons peuvent y renvoyer." },
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
  // ---------- PATRIMOINE HISTORIQUE (Mission CTO N°2) ----------
  jalons: {
    key: "jalons", table: "product_milestones", title: "Jalons & chronologies", single: "jalon", perm: "patrimoine", statusable: true,
    order: "product_slug ASC, sort_order ASC", searchable: ["title", "product_slug", "version_ref"],
    intro: "Chronologie vivante de chaque produit : naissance de l'idée, conception, développement, annonces, tests, premières mises en production, premiers utilisateurs, mises à jour, situation actuelle. Ne jamais transformer une estimation en date certaine — le niveau de précision est affiché publiquement.",
    columns: [
      { name: "product_slug", label: "Produit", type: "relation", relation: { table: "products", label: "name", value: "slug" }, list: true },
      { name: "kind", label: "Type de jalon", type: "select", options: MILESTONE_KINDS, list: true },
      { name: "title", label: "Titre", type: "text", list: true },
      { name: "occurred_on", label: "Date", type: "text", list: true },
      { name: "date_precision", label: "Précision", type: "select", options: DATE_PRECISIONS, list: true },
      { name: "status", label: "Statut", type: "readonly", list: true },
    ],
    fields: [
      { name: "product_slug", label: "Produit concerné", type: "relation", relation: { table: "products", label: "name", value: "slug" }, required: true },
      { name: "kind", label: "Type de jalon", type: "select", options: MILESTONE_KINDS, required: true },
      { name: "title", label: "Titre du jalon", type: "text", required: true, form_span: true },
      { name: "description_md", label: "Description (markdown)", type: "markdown", form_span: true, help: "Ce qui s'est passé, ce qui a été décidé ou livré — uniquement des faits vérifiables." },
      { name: "occurred_on", label: "Date du jalon", type: "text", help: "Formats acceptés : 2026-11-08 (jour), 2026-11 (mois), 2019 (année). Laisser vide si la date est inconnue — ne jamais inventer." },
      { name: "date_precision", label: "Niveau de précision de la date", type: "select", options: DATE_PRECISIONS, help: "« Confirmée » = preuve datée ; « Environ » = approximation communiquée ; « Archives » = retrouvée dans les archives ; « Estimation » = à confirmer ; « Inconnue » = pas de date." },
      { name: "version_ref", label: "Version associée (optionnel)", type: "text", help: "ex. 1.0.6+724, 2.2.0" },
      { name: "version_id", label: "Version reliée (journal)", type: "relation", relation: { table: "product_versions", label: "version", value: "id" }, help: "Relie ce jalon à une entrée du journal des versions (#n) — le numéro s'affiche cliquable côté public." },
      { name: "article_slug", label: "Article de blog relié (annonce / retour)", type: "relation", relation: { table: "posts", label: "title", value: "slug" }, help: "Article d'annonce publié AVANT l'implémentation, ou article de retour après mise en production. Uniquement un article réellement existant." },
      { name: "media_json", label: "Images du jalon", type: "screenshots", form_span: true, help: "Captures ou visuels associés à ce jalon — choisissez dans la bibliothèque (le type Mobile/Desktop n'est pas affiché ici, seule la légende compte)." },
      { name: "source_label", label: "Source de l'information", type: "text", form_span: true, help: "ex. « Fondateur — mission CTO N°2, 10/11/2026 » ou « Archives : TILE_FINAL_RELEASE_REPORT.md, 17/07/2026 »" },
      { name: "confidence", label: "Niveau de confiance", type: "select", options: CONFIDENCE_LEVELS },
      { name: "sort_order", label: "Ordre chronologique d'affichage", type: "number", help: "1 = premier jalon. Suivre l'ordre chronologique réel." },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
    ],
  },
  versions: {
    key: "versions", table: "product_versions", title: "Versions produits", single: "version", perm: "patrimoine", statusable: true,
    order: "product_slug ASC, sort_order ASC", searchable: ["version", "summary", "product_slug"],
    intro: "Journal des versions par produit : numéros, dates, types (mineure, majeure, nouveau module, architecture, production, correction), fonctionnalités ajoutées, corrections, article d'annonce. La date de la dernière mise à jour provient de données vérifiables, jamais de la date de modification d'une page éditoriale.",
    columns: [
      { name: "product_slug", label: "Produit", type: "relation", relation: { table: "products", label: "name", value: "slug" }, list: true },
      { name: "version", label: "Version", type: "text", list: true },
      { name: "released_on", label: "Sortie", type: "text", list: true },
      { name: "kind", label: "Type", type: "select", options: VERSION_KINDS, list: true },
      { name: "status", label: "Statut", type: "readonly", list: true },
    ],
    fields: [
      { name: "product_slug", label: "Produit concerné", type: "relation", relation: { table: "products", label: "name", value: "slug" }, required: true },
      { name: "version", label: "Numéro ou nom de version", type: "text", required: true, help: "ex. 1.0, 1.0.6+724, 2.2.0" },
      { name: "released_on", label: "Date de sortie", type: "text", help: "Formats : 2026-11-02, 2026-11, 2026. Vide si inconnue." },
      { name: "date_precision", label: "Niveau de précision", type: "select", options: DATE_PRECISIONS },
      { name: "kind", label: "Type de mise à jour", type: "select", options: VERSION_KINDS, required: true },
      { name: "summary", label: "Résumé de la version", type: "textarea", form_span: true },
      { name: "features", label: "Fonctionnalités ajoutées", type: "list", form_span: true, help: "Une fonctionnalité par ligne" },
      { name: "improvements", label: "Améliorations", type: "textarea", form_span: true },
      { name: "fixes", label: "Corrections", type: "textarea", form_span: true, help: "Une correction par ligne" },
      { name: "tech_notes", label: "Changements techniques publiables", type: "textarea", form_span: true, help: "Uniquement ce qui est autorisé à être public — jamais de secret technique." },
      { name: "article_slug", label: "Article d'annonce relié", type: "relation", relation: { table: "posts", label: "title", value: "slug" } },
      { name: "media_json", label: "Médias de la version", type: "screenshots", form_span: true, help: "Captures associées à cette version (bibliothèque média)." },
      { name: "sort_order", label: "Ordre d'affichage", type: "number", help: "1 = version la plus ancienne. Les plus récentes en dernier." },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
    ],
  },
  publications: {
    key: "publications", table: "product_publications", title: "Publications du parcours", single: "publication", perm: "patrimoine", statusable: true,
    order: "product_slug ASC, sort_order ASC", searchable: ["title", "product_slug", "post_slug"],
    intro: "Chaque publication raconte une évolution : annonce initiale, contexte et problème, fonctionnalités, bénéfices, date réelle de livraison et version livrée. Une annonce n'est jamais confondue avec la livraison. Provenance : « article original retrouvé » (relié au blog), « reconstituée » (existence établie par les archives, marquée comme telle) ou « nouvelle publication historique » (jamais antidatée).",
    columns: [
      { name: "product_slug", label: "Produit", type: "relation", relation: { table: "products", label: "name", value: "slug" }, list: true },
      { name: "title", label: "Publication", type: "text", list: true },
      { name: "provenance", label: "Provenance", type: "select", options: PUB_PROVENANCES, list: true },
      { name: "announcement_on", label: "Annonce", type: "text", list: true },
      { name: "delivery_on", label: "Livraison", type: "text", list: true },
      { name: "status", label: "Statut", type: "readonly", list: true },
    ],
    fields: [
      { name: "product_slug", label: "Produit concerné", type: "relation", relation: { table: "products", label: "name", value: "slug" }, required: true },
      { name: "title", label: "Titre de la publication", type: "text", required: true, form_span: true },
      { name: "provenance", label: "Provenance", type: "select", options: PUB_PROVENANCES, required: true, help: "original_retrouve = article de blog existant ; reconstruite = existence établie par les archives ; nouvelle = publication historique créée aujourd'hui (jamais antidatée)." },
      { name: "post_slug", label: "Article de blog relié (si original retrouvé)", type: "relation", relation: { table: "posts", label: "title", value: "slug" }, help: "Uniquement pour une provenance « original_retrouve »." },
      { name: "event_id", label: "Événement du parcours relié", type: "relation", relation: { table: "product_milestones", label: "title", value: "id" }, help: "Le jalon correspondant (voir /admin/jalons)." },
      { name: "version_id", label: "Version livrée", type: "relation", relation: { table: "product_versions", label: "version", value: "id" } },
      { name: "version_ref", label: "Référence de version (texte)", type: "text", help: "ex. 1.0, 2.2.0 — affiché même sans journal." },
      { name: "original_pub_on", label: "Date de publication originale", type: "text", help: "Date de l'article original, si retrouvée. Vide = inconnue." },
      { name: "original_pub_precision", label: "Précision de la date originale", type: "select", options: DATE_PRECISIONS },
      { name: "announcement_on", label: "Date de l'annonce", type: "text", help: "ex. 2026-06-03" },
      { name: "announcement_precision", label: "Précision de l'annonce", type: "select", options: DATE_PRECISIONS },
      { name: "delivery_on", label: "Date réelle de livraison", type: "text", help: "La livraison effective, distincte de l'annonce." },
      { name: "delivery_precision", label: "Précision de la livraison", type: "select", options: DATE_PRECISIONS },
      { name: "context_md", label: "Contexte et problème rencontré", type: "textarea", form_span: true },
      { name: "evolution_md", label: "Évolution annoncée", type: "textarea", form_span: true },
      { name: "features_json", label: "Fonctionnalités concernées", type: "list", form_span: true, help: "Une fonctionnalité par ligne" },
      { name: "benefits_md", label: "Bénéfices attendus pour les utilisateurs", type: "textarea", form_span: true },
      { name: "result_md", label: "Résultat effectivement livré", type: "textarea", form_span: true },
      { name: "media_json", label: "Médias et documents associés", type: "screenshots", form_span: true },
      { name: "source_label", label: "Source de l'information", type: "text", form_span: true, help: "ex. « Article original retrouvé : cloudaf-lancement (03/06/2026) »" },
      { name: "confidence", label: "Niveau de confiance", type: "select", options: CONFIDENCE_LEVELS },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
      { name: "status", label: "Statut", type: "select", options: STATUS_OPTIONS },
    ],
  },
  sources: {
    key: "sources", table: "product_sources", title: "Sources & traçabilité", single: "source", perm: "patrimoine",
    order: "product_slug ASC, id ASC", searchable: ["title", "product_slug", "detail"],
    intro: "Preuves historiques : informations du fondateur, dépôts Git, rapports de missions, stores officiels, articles, captures. Chaque jalon ou version doit pouvoir être relié à une source. Ne jamais inventer un historique pour remplir une chronologie.",
    columns: [
      { name: "product_slug", label: "Produit", type: "relation", relation: { table: "products", label: "name", value: "slug" }, list: true },
      { name: "source_type", label: "Type", type: "select", options: SOURCE_TYPES, list: true },
      { name: "title", label: "Source", type: "text", list: true },
      { name: "evidenced_on", label: "Preuve du", type: "text", list: true },
      { name: "confidence", label: "Confiance", type: "select", options: CONFIDENCE_LEVELS, list: true },
    ],
    fields: [
      { name: "product_slug", label: "Produit concerné", type: "relation", relation: { table: "products", label: "name", value: "slug" }, required: true },
      { name: "source_type", label: "Type de source", type: "select", options: SOURCE_TYPES, required: true },
      { name: "title", label: "Intitulé de la source", type: "text", required: true, form_span: true },
      { name: "detail", label: "Détail / correspondance avec les événements", type: "textarea", form_span: true },
      { name: "url", label: "Lien de la preuve (si public)", type: "url" },
      { name: "evidenced_on", label: "Date de la preuve", type: "text", help: "ex. 2026-11-02" },
      { name: "confidence", label: "Niveau de confiance", type: "select", options: CONFIDENCE_LEVELS },
      { name: "milestone_id", label: "Jalon relié (id)", type: "number", help: "Optionnel — id affiché dans /admin/jalons (#n)" },
      { name: "version_id", label: "Version reliée (id)", type: "number", help: "Optionnel — id affiché dans /admin/versions (#n)" },
      { name: "validated_by", label: "Validation fondateur", type: "text", help: "ex. « Validé par le fondateur le 10/11/2026 » — laisser vide si non validé" },
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
function fieldInput(f: Field, value: unknown, csrf: string, relationOptions?: { value: string; label: string }[], mediaItems: { id: number; title: string; kind: string; thumb: string }[] = [], mediaFiles: { id: number; r2_key: string; filename: string; alt: string }[] = []): string {
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
      // value null → textarea vide (jamais « null » en clair, qui bloquait toute la sauvegarde du produit)
      return `<label class="adm-field${full}"><span>${esc(f.label)}</span><textarea name="${f.name}" rows="4" data-json>${esc(value == null ? "" : typeof value === "string" ? v : JSON.stringify(value, null, 2))}</textarea>${f.help ? `<small>${esc(f.help)}</small>` : ""}</label>`;
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
    case "screenshots": {
      // Éditeur de captures : sélection dans la bibliothèque + type (mobile/desktop) + légende par image
      const items = parseJSON<{ key: string; type?: string; alt?: string }[]>(typeof value === "string" && value.trim() ? value : "[]", []);
      const byKey = new Map(items.map((it) => [String(it.key), it]));
      return `<div class="adm-field${full}" data-screenshots><span>${esc(f.label)}</span>
      <p class="muted" style="font-size:.82rem">${esc(f.help || "")}</p>
      <div class="shot-editor">${mediaFiles
        .map((mf) => { const sel = byKey.get(mf.r2_key); return `<div class="shot-row${sel ? " is-on" : ""}">
        <label class="shot-row__pick"><input type="checkbox" name="scr_in_${mf.id}" ${sel ? "checked" : ""}><img src="${mediaSrc(mf.r2_key)}" alt="" loading="lazy"><span>${esc(mf.filename.slice(0, 34))}</span></label>
        <div class="shot-row__cfg">
          <select name="scr_type_${mf.id}" aria-label="Type de capture"><option value="mobile" ${!sel || sel.type !== "desktop" ? "selected" : ""}>Mobile</option><option value="desktop" ${sel?.type === "desktop" ? "selected" : ""}>Desktop</option></select>
          <input name="scr_alt_${mf.id}" value="${esc(sel?.alt || mf.alt || "")}" placeholder="Légende affichée sous la capture" maxlength="140">
        </div></div>`; }).join("") || `<em class="muted">Bibliothèque vide — téléversez d'abord vos captures avec « Téléverser un média ».</em>`}
      </div></div>`;
    }
    case "downloads": {
      // Éditeur de liens : une ligne « Plateforme | URL | Libellé » — converti en JSON côté serveur
      const rows = parseJSON<{ platform?: string; url?: string; label?: string }[]>(typeof value === "string" && value.trim() ? value : "[]", []);
      const lines = (rows || []).map((d) => [d.platform, d.url, d.label].filter(Boolean).join(" | "));
      return `<label class="adm-field${full}"><span>${esc(f.label)}</span><textarea name="${f.name}" rows="4" data-list>${esc(lines.join("\n"))}</textarea>${f.help ? `<small>${esc(f.help)}</small>` : ""}</label>`;
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
    ...images.map((i) => ({ id: Number(i.id), title: String(i.title), kind: "image", thumb: mediaSrc(String(i.r2_key)) })),
    ...videos.map((v) => ({ id: Number(v.id), title: String(v.title), kind: `vidéo ${String(v.provider || "")}`, thumb: "" })),
  ];
}

// Bibliothèque d'images brute (media) — pour l'éditeur de captures des produits
async function loadMediaFiles(db: D1Database): Promise<{ id: number; r2_key: string; filename: string; alt: string }[]> {
  return q(db, "SELECT id, r2_key, filename, COALESCE(alt,'') AS alt FROM media WHERE mime LIKE 'image/%' ORDER BY id DESC LIMIT 300");
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
    const mediaFiles = res.fields.some((f) => f.type === "screenshots") ? await loadMediaFiles(c.env.DB) : [];
    const body = `<form method="post" action="/admin/${res.key}" class="adm-form" data-confirm-leave>
      <input type="hidden" name="_csrf" value="${user.csrf}">
      ${res.fields.map((f) => fieldInput(f, "", user.csrf, relOpts[f.name], mediaOpts, mediaFiles)).join("")}
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
    const mediaFiles = res.fields.some((f) => f.type === "screenshots") ? await loadMediaFiles(c.env.DB) : [];
    const selectedMedia = res.relationsKey ? await loadSelectedRelations(c.env.DB, res.relationsKey, c.req.param("id")) : "";
    const canEdit = can(user.role, res.perm, "edit");
    const formFields = res.fields.map((f) => fieldInput(f, f.type === "media_multi" ? selectedMedia : row[f.name], user.csrf, relOpts[f.name], mediaOpts, mediaFiles)).join("");
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
    if (f.type === "screenshots") {
      // Captures : champs scr_in_<id> / scr_type_<id> / scr_alt_<id> — reconstruction du JSON
      const ids = Object.keys(form).filter((k) => k.startsWith("scr_in_") && form[k]).map((k) => Number(k.slice(7))).filter((n) => Number.isInteger(n) && n > 0).slice(0, 40);
      const items: { key: string; type: string; alt: string }[] = [];
      if (ids.length) {
        const rows = await q<{ id: number; r2_key: string; alt: string }>(c.env.DB, `SELECT id, r2_key, COALESCE(alt,'') AS alt FROM media WHERE id IN (${ids.map(() => "?").join(",")}) ORDER BY id DESC`, ...ids);
        for (const r of rows) {
          const t = String(form["scr_type_" + r.id] || "mobile") === "desktop" ? "desktop" : "mobile";
          const alt = String(form["scr_alt_" + r.id] || r.alt || "").trim().slice(0, 140);
          items.push({ key: r.r2_key, type: t, alt });
        }
      }
      data[f.name] = JSON.stringify(items);
      continue;
    }
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
      case "downloads": {
        // « Plateforme | URL | Libellé » par ligne → [{platform,url,label}] — l'admin n'écrit jamais de JSON
        const rows = s
          ? s.split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((p) => p.length >= 2 && p[0] && /^https?:\/\//.test(p[1] || "")).slice(0, 12)
          : [];
        data[f.name] = JSON.stringify(rows.map((p) => ({ platform: p[0].toLowerCase(), url: p[1], ...(p.length > 2 ? { label: p.slice(2).join(" | ") } : {}) })));
        break;
      }
      case "json": {
        if (s === "" || s === "null") {
          data[f.name] = f.name === "features" || f.name === "gallery" || f.name === "links_json" || f.name === "versions_json" || f.name === "blocks" || f.name === "screenshots_json" || f.name === "downloads_json" ? "[]" : "{}";
          break;
        }
        try {
          let parsed = JSON.parse(s);
          if (parsed == null) parsed = f.name === "blocks" || f.name.endsWith("_json") ? [] : {};
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
        // Relation numérique (id) ou textuelle (slug) selon la définition — produits & articles
        // du patrimoine sont reliés par slug (stable et lisible).
        data[f.name] = s === "" ? null : f.relation && f.relation.value !== "id" ? s : (Number(s) || null);
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
