-- ============================================================
-- GREEN FAD — Migration 0007 « Patrimoine historique des produits »
-- Mission CTO N°2 : reconstitution historique, chronologies vérifiables,
-- journal des versions, articles reliés aux jalons, sources & traçabilité.
-- Principe cardinal : NE JAMAIS transformer une estimation en date certaine.
--   date_precision porte le niveau de fiabilité de chaque date :
--   exacte | approximative | archives | estimee | inconnue
-- ============================================================

-- ---------- Produits : introduction de la section « Parcours historique » ----------
ALTER TABLE products ADD COLUMN history_intro_md TEXT;

-- ---------- Blog : lien éditorial produit ↔ article (par slug, stable) ----------
ALTER TABLE posts ADD COLUMN product_slug TEXT;

-- ---------- Jalons historiques (chronologie par produit) ----------
CREATE TABLE IF NOT EXISTS product_milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_slug TEXT NOT NULL,
  -- conception|cadrage|developpement|implementation|annonce|tests|
  -- premiere_production|premier_utilisateur|mise_a_jour|derniere_evolution|situation_actuelle
  kind TEXT NOT NULL DEFAULT 'mise_a_jour',
  title TEXT NOT NULL,
  description_md TEXT,
  -- date libre : 2026-11-08 (jour), 2026-11 (mois), 2019 (année) — NULL si inconnue
  occurred_on TEXT,
  date_precision TEXT NOT NULL DEFAULT 'inconnue',
  version_ref TEXT,
  article_slug TEXT,                -- article de blog relié (annonces avant implémentation)
  media_json TEXT NOT NULL DEFAULT '[]',   -- [{key,type,alt}]
  source_label TEXT,                -- ex. « Fondateur — mission CTO N°2, 10/11/2026 »
  confidence TEXT NOT NULL DEFAULT 'moyenne', -- haute|moyenne|faible
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'brouillon',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_milestones_product ON product_milestones(product_slug, sort_order, status);
CREATE INDEX IF NOT EXISTS idx_milestones_article ON product_milestones(article_slug);

-- ---------- Journal des versions ----------
CREATE TABLE IF NOT EXISTS product_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_slug TEXT NOT NULL,
  version TEXT NOT NULL,
  released_on TEXT,
  date_precision TEXT NOT NULL DEFAULT 'inconnue',
  -- mineure|majeure|module|architecture|production|correction
  kind TEXT NOT NULL DEFAULT 'mineure',
  summary TEXT,
  features TEXT NOT NULL DEFAULT '[]',     -- liste JSON
  improvements TEXT,
  fixes TEXT,
  tech_notes TEXT,                          -- changements techniques publiaBLES uniquement
  article_slug TEXT,
  media_json TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'brouillon',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_versions_product ON product_versions(product_slug, sort_order, status);

-- ---------- Sources & traçabilité historique ----------
CREATE TABLE IF NOT EXISTS product_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_slug TEXT NOT NULL,
  milestone_id INTEGER REFERENCES product_milestones(id) ON DELETE SET NULL,
  version_id INTEGER REFERENCES product_versions(id) ON DELETE SET NULL,
  -- fondateur|archives|git|release|changelog|article|store|web|capture|deploiement
  source_type TEXT NOT NULL DEFAULT 'archives',
  title TEXT NOT NULL,
  detail TEXT,
  url TEXT,
  evidenced_on TEXT,                 -- date de la preuve retrouvée
  confidence TEXT NOT NULL DEFAULT 'moyenne',
  validated_by TEXT,                 -- validation éventuelle du fondateur
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sources_product ON product_sources(product_slug);
