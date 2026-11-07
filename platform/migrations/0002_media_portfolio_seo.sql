-- ============================================================
-- GREEN FAD PLATFORM — Migration 0002
-- Extension stratégique : Media Center, portfolio produits/projets,
-- SEO enrichi, espace Innovation, relations entre contenus.
-- ============================================================

-- ---------- MEDIA CENTER : albums ----------
CREATE TABLE IF NOT EXISTS media_albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  -- general | produits | projets | evenements | institution | bureaux | demonstrations
  category TEXT NOT NULL DEFAULT 'general',
  cover_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'brouillon',
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------- MEDIA CENTER : éléments publiables (images R2 + vidéos par URL) ----------
-- Un média = UNE entrée réutilisable dans plusieurs contenus via content_relations,
-- sans duplication physique du fichier (image) ni de la référence (vidéo).
CREATE TABLE IF NOT EXISTS media_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL DEFAULT 'image',            -- image | video
  media_id INTEGER REFERENCES media(id) ON DELETE SET NULL,   -- image stockée dans R2
  source_url TEXT,                               -- vidéo : URL YouTube / Vimeo / sociale
  provider TEXT,                                 -- youtube | vimeo | url
  provider_id TEXT,                              -- identifiant extrait (embed/miniature)
  title TEXT NOT NULL,
  description TEXT,
  caption TEXT,
  credit TEXT,                                   -- crédit photographique / droits
  alt TEXT,                                      -- texte alternatif (SEO + accessibilité)
  keywords TEXT NOT NULL DEFAULT '[]',
  album_id INTEGER REFERENCES media_albums(id) ON DELETE SET NULL,
  category TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'brouillon',
  published_at TEXT,
  uploaded_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_media_items_album ON media_items(album_id, type, status);
CREATE INDEX IF NOT EXISTS idx_media_items_type ON media_items(type, status);

-- ---------- RELATIONS CONTENUS ↔ MÉDIAS (réutilisation sans duplication) ----------
CREATE TABLE IF NOT EXISTS content_relations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL,      -- product | project | service | post | page | country
  content_id INTEGER NOT NULL,
  media_item_id INTEGER REFERENCES media_items(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(content_type, content_id, media_item_id)
);
CREATE INDEX IF NOT EXISTS idx_relations_content ON content_relations(content_type, content_id);

-- ---------- PORTFOLIO PRODUITS (page produit professionnelle) ----------
ALTER TABLE products ADD COLUMN problem_md TEXT;             -- problème auquel répond le produit
ALTER TABLE products ADD COLUMN vision_md TEXT;              -- vision et objectif
ALTER TABLE products ADD COLUMN origin_md TEXT;              -- origine et contexte de création
ALTER TABLE products ADD COLUMN sector TEXT;                 -- secteur d'activité
ALTER TABLE products ADD COLUMN audience TEXT;               -- publics et utilisateurs cibles
ALTER TABLE products ADD COLUMN modules_md TEXT;             -- modules et services intégrés
ALTER TABLE products ADD COLUMN architecture_md TEXT;        -- architecture et technologies (si publiables)
ALTER TABLE products ADD COLUMN ux_md TEXT;                  -- expérience utilisateur et interfaces
ALTER TABLE products ADD COLUMN benefits_md TEXT;            -- bénéfices et valeur ajoutée
ALTER TABLE products ADD COLUMN differentiators_md TEXT;     -- éléments différenciateurs
ALTER TABLE products ADD COLUMN use_cases_md TEXT;           -- cas d'utilisation
ALTER TABLE products ADD COLUMN state TEXT NOT NULL DEFAULT 'developpement'; -- developpement|beta|disponible|evolution|archive
ALTER TABLE products ADD COLUMN links_json TEXT NOT NULL DEFAULT '[]';       -- site, app, documentation, réseaux, support
ALTER TABLE products ADD COLUMN versions_json TEXT NOT NULL DEFAULT '[]';    -- historique des versions publiables
ALTER TABLE products ADD COLUMN blocks TEXT;                 -- sections éditoriales configurables (Page Builder)
ALTER TABLE products ADD COLUMN og_image TEXT;               -- image de partage Open Graph

-- ---------- PORTFOLIO PROJETS & RÉALISATIONS (étude de cas complète) ----------
ALTER TABLE projects ADD COLUMN need_md TEXT;                -- contexte et besoin client
ALTER TABLE projects ADD COLUMN approach_md TEXT;            -- approche méthodologique
ALTER TABLE projects ADD COLUMN solution_md TEXT;            -- solution livrée
ALTER TABLE projects ADD COLUMN tech_stack TEXT;             -- technologies utilisées (public)
ALTER TABLE projects ADD COLUMN results_md TEXT;             -- résultats vérifiés (jamais inventés)
ALTER TABLE projects ADD COLUMN client_type TEXT;            -- client direct | partenaire | interne
ALTER TABLE projects ADD COLUMN og_image TEXT;
ALTER TABLE projects ADD COLUMN blocks TEXT;                 -- sections éditoriales configurables

-- ---------- ESPACE INNOVATION & CONNAISSANCE ----------
ALTER TABLE posts ADD COLUMN kind TEXT NOT NULL DEFAULT 'article';
-- article | analyse | recherche | prototype | veille | publication | guide | opinion | recit
ALTER TABLE posts ADD COLUMN og_image TEXT;
ALTER TABLE posts ADD COLUMN related_product_id INTEGER REFERENCES products(id) ON DELETE SET NULL;
ALTER TABLE posts ADD COLUMN related_project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL;
ALTER TABLE posts ADD COLUMN related_service_id INTEGER REFERENCES services(id) ON DELETE SET NULL;
ALTER TABLE posts ADD COLUMN country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL;

-- ---------- SEO ENRICHI ----------
ALTER TABLE services ADD COLUMN og_image TEXT;
ALTER TABLE pages ADD COLUMN robots_meta TEXT DEFAULT 'index,follow';
ALTER TABLE pages ADD COLUMN seo_keywords TEXT;
ALTER TABLE products ADD COLUMN seo_keywords TEXT;
ALTER TABLE posts ADD COLUMN seo_keywords TEXT;
ALTER TABLE projects ADD COLUMN seo_keywords TEXT;
ALTER TABLE services ADD COLUMN seo_keywords TEXT;

-- ---------- PAYS : drapeaux sans emoji (badge ISO2 + icônes SVG) ----------
UPDATE countries SET flag_emoji = '' WHERE flag_emoji IS NOT NULL;
