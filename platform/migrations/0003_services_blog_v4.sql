-- GREEN FAD — Migration 0003 : pages services enrichies + blog éditorial v4
-- Les colonnes ajoutées sont toutes optionnelles : aucune rupture des contenus existants.

-- ---------- SERVICES / EXPERTISES : fiche complète ----------
ALTER TABLE services ADD COLUMN methodology_md TEXT;   -- méthodologie d'intervention (étapes)
ALTER TABLE services ADD COLUMN includes_json TEXT NOT NULL DEFAULT '[]';  -- ce que le service inclut : ["Audit","Conception",…]
ALTER TABLE services ADD COLUMN tech_json TEXT NOT NULL DEFAULT '[]';      -- technologies & outils maîtrisés
ALTER TABLE services ADD COLUMN industries_json TEXT NOT NULL DEFAULT '[]'; -- secteurs adressés
ALTER TABLE services ADD COLUMN benefits_md TEXT;      -- bénéfices pour le client
ALTER TABLE services ADD COLUMN deliverables_md TEXT;  -- livrables types
ALTER TABLE services ADD COLUMN process_md TEXT;       -- déroulement d'un projet type
-- og_image existe déjà (migration 0002) — non dupliqué ici

-- ---------- RÉALISATIONS & PRODUITS : liaison explicite ↔ service ----------
ALTER TABLE projects ADD COLUMN related_service_id INTEGER REFERENCES services(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN related_service_id INTEGER REFERENCES services(id) ON DELETE SET NULL;

-- ---------- BLOG : temps de lecture calculé à l'affichage (pas de colonne), vues déjà présentes ----------
CREATE INDEX IF NOT EXISTS idx_posts_kind_status ON posts(kind, status);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views DESC);

-- ---------- SITEMAP : sitemap d'images servi dynamiquement (aucune table nécessaire) ----------
