-- ===========================================================================
-- 0011 : PATRIMOINE V2 — SCHÉMA (slugs canoniques uniques, version_id, product_publications)
-- ===========================================================================

-- Exécuté une seule fois par wrangler d1 migrations apply — les ALTER SQLite ne sont

-- pas ré-exécutables ; les DONNÉES (migration 0012) sont elles totalement idempotentes.

ALTER TABLE product_milestones ADD COLUMN slug TEXT;
ALTER TABLE product_milestones ADD COLUMN version_id INTEGER;
ALTER TABLE product_versions ADD COLUMN slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_milestones_slug ON product_milestones(slug) WHERE slug IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_versions_slug ON product_versions(slug) WHERE slug IS NOT NULL;
CREATE TABLE IF NOT EXISTS product_publications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_slug TEXT NOT NULL,
  slug TEXT UNIQUE,
  post_slug TEXT,                          -- article de blog original si retrouvé
  event_id INTEGER REFERENCES product_milestones(id) ON DELETE SET NULL,
  version_id INTEGER REFERENCES product_versions(id) ON DELETE SET NULL,
  kind TEXT NOT NULL DEFAULT 'annonce',
  title TEXT NOT NULL,
  original_pub_on TEXT, original_pub_precision TEXT NOT NULL DEFAULT 'inconnue',
  announcement_on TEXT, announcement_precision TEXT NOT NULL DEFAULT 'inconnue',
  delivery_on TEXT, delivery_precision TEXT NOT NULL DEFAULT 'inconnue',
  version_ref TEXT,
  context_md TEXT,                         -- contexte et problème rencontré
  evolution_md TEXT,                       -- évolution annoncée
  features_json TEXT NOT NULL DEFAULT '[]',
  benefits_md TEXT,                        -- bénéfices attendus pour les utilisateurs
  result_md TEXT,                          -- résultat effectivement livré
  media_json TEXT NOT NULL DEFAULT '[]',
  -- original_retrouve | reconstruite | nouvelle
  provenance TEXT NOT NULL DEFAULT 'nouvelle',
  source_label TEXT,
  confidence TEXT NOT NULL DEFAULT 'haute',
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'brouillon',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_publications_product ON product_publications(product_slug, sort_order, status);
