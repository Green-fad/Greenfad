-- ===========================================================================
-- 0024 : RÉFÉRENCES (page publique + fiche détaillée par référence) +
--        BANNIÈRE D ENTÊTE ADMINISTRABLE (demande du fondateur, 11/11/2026)
-- ---------------------------------------------------------------------------
-- NB IMPORTANT : ce fichier ne contient AUCUN apostrophe droit (’) hors
--   littéraux SQL. Le moteur de découpe des instructions de wrangler
--   (migrations apply) suit les quotes sans échappement : un apostrophe
--   dans un commentaire, ou un littéral à trois quotes consécutives,
--   décalerait toutes les instructions suivantes. Rester strictement symétrique.
--
-- Demande : « Fais aussi pour la page références (RÉFÉRENCES — Ils nous font
-- confiance) avec voir tous nos références et aussi dans menu et aussi la page
-- détail de chaque ; la gestion admin doit être améliorée ; l’image de
-- bannière dans l’entête doit être remplaçable par l’admin, jusqu’à 3 qui
-- défilent avec 3 modèles de défilement, plus une vidéo de 5 s en boucle. »
--
-- 1) partners.slug  → URL fiche /references/<slug> (unique, backfill gardé)
--    partners.sector → secteur d’activité (libre, affiché si renseigné)
-- 2) Table hero_slides — jusqu’à 3 diapositives publiées (image OU vidéo R2),
--    la bannière reste pilotée 100 % par la base : plus aucune image à
--    remplacer dans le code à chaque saison ou campagne.
-- 3) Réglages par défaut : hero_effect (fondu | glisse | zoom — les 3 modèles
--    de défilement) + hero_interval (5000 ms, calé sur la vidéo 5 s en boucle).
-- 4) Menus : entrée « Références » → /references (en-tête + pied de page,
--    additifs gardés : un menu déjà modifié par l’admin n’est jamais écrasé).
--
-- RÈGLES : aucune donnée inventée (les secteurs restent vides jusqu’à saisie
--          admin) ; INSERT/UPDATE gardés → idempotent, aucune saisie écrasée.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1) Colonnes partners.slug + partners.sector
--    Wrangler journalise chaque migration (d1_migrations) : les ALTER ne
--    s’exécutent qu’une fois par base — aucune explosion possible.
-- ---------------------------------------------------------------------------
ALTER TABLE partners ADD COLUMN slug TEXT;
ALTER TABLE partners ADD COLUMN sector TEXT NOT NULL DEFAULT '';

-- ---------------------------------------------------------------------------
-- 1 bis) Backfill des slugs — slugs propres pour les références semées,
--        puis repli générique pour toute référence ajoutée par l’admin
--        (jamais écrasé : garde slug vide uniquement)
-- ---------------------------------------------------------------------------
UPDATE partners SET slug = 'afric-immo'                 WHERE name = 'Afric-Immo'                  AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'artifyfad'                  WHERE name = 'ArtifyFad'                   AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'casa-des-delices'           WHERE name = 'Casa des Délices'            AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'cours-africa'               WHERE name = 'Cours Africa'                AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'efb-entreprise'             WHERE name = 'EFB Entreprise'              AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'massaley-hotel'             WHERE name = 'Massaley Hôtel'              AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'pharmacie-hopital-du-mali'  WHERE name = 'Pharmacie hôpital du Mali'   AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'eurodecor'                  WHERE name = 'Eurodecor'                   AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'justice-mali'               WHERE name = 'Justice Mali'                AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'le-baobab-hotel'            WHERE name = 'Le Baobab Hôtel'             AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'nature-attitude'            WHERE name = 'Nature Attitude'             AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'sky-buffet'                 WHERE name = 'Sky Buffet'                  AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'greenfad'                   WHERE name = 'Greenfad'                    AND (slug IS NULL OR slug = '');
UPDATE partners SET slug = 'greenfad-2'                 WHERE name = 'Greenfad 2'                  AND (slug IS NULL OR slug = '');

-- Repli générique (références ajoutées par l’admin, sans slug) : translittération
-- française de base via REPLACE — suffisant et déterministe.
-- Apostrophe remplacée via char(39) : jamais de littéral à trois quotes ici.
UPDATE partners SET slug =
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
  REPLACE(REPLACE(REPLACE(
    REPLACE(LOWER(TRIM(name)), ' ', '-'),
  char(39),
  ''),
  'À', 'a'),
  'Â', 'a'),
  'Ä', 'a'),
  'É', 'e'),
  'È', 'e'),
  'Ê', 'e'),
  'Ë', 'e'),
  'Î', 'i'),
  'Ï', 'i'),
  'Ô', 'o'),
  'Ö', 'o'),
  'Ù', 'u'),
  'Û', 'u'),
  'Ü', 'u'),
  'Ç', 'c'),
  'Œ', 'oe'),
  'Æ', 'ae'),
  'é', 'e'),
  'è', 'e'),
  'ê', 'e'),
  'ë', 'e'),
  'à', 'a'),
  'â', 'a'),
  'ä', 'a'),
  'ù', 'u'),
  'û', 'u'),
  'ü', 'u'),
  'ï', 'i'),
  'î', 'i'),
  'ô', 'o'),
  'ö', 'o'),
  'ÿ', 'y'),
  'ç', 'c'),
  'œ', 'oe'),
  'æ', 'ae'),
  ',', ''),
  '.', ''),
  ':', ''),
  ';', ''),
  '!', ''),
  '?', ''),
  '(', ''),
  ')', ''),
  '"', ''),
  '&', 'et'),
  '/', '-')
WHERE (slug IS NULL OR slug = '') AND TRIM(COALESCE(name, '')) != '';

-- Nettoyage : jamais de tiret final dans un slug (ex. « Nom ! » → « nom »)
UPDATE partners SET slug = RTRIM(slug, '-') WHERE slug LIKE '%-' AND slug != '-';

-- Dédoublonnage : le premier conservé, les suivants suffixés par l’id (URL stable)
UPDATE partners SET slug = slug || '-' || id
WHERE slug != '' AND id NOT IN (SELECT MIN(id) FROM partners GROUP BY slug);

CREATE UNIQUE INDEX IF NOT EXISTS idx_partners_slug ON partners(slug)
  WHERE slug IS NOT NULL AND slug != '';

-- ---------------------------------------------------------------------------
-- 2) Table hero_slides — bannière d’entête administrable (≤ 3 publiées)
--    media_key : clé R2 ou chemin /assets/… ; media_type : image | vidéo
--    (vidéo de 5 s jouée en boucle, muette, lecture automatique)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  media_key TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image','video')),
  alt TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'brouillon',
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hero_slides_status ON hero_slides(status, sort_order);

-- ---------------------------------------------------------------------------
-- 3) Réglages par défaut des 3 modèles de défilement (éditables au Dashboard ;
--    une valeur déjà choisie par l’admin n’est jamais écrasée)
--    fondu  = fondu enchaîné (crossfade)
--    glisse = translation horizontale
--    zoom   = zoom lent (effet Ken Burns)
-- ---------------------------------------------------------------------------
INSERT INTO settings (key, value, updated_at) SELECT 'hero_effect', '"fondu"', datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'hero_effect');
INSERT INTO settings (key, value, updated_at) SELECT 'hero_interval', '5000', datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'hero_interval');

-- ---------------------------------------------------------------------------
-- 4) Menus — entrée « Références » → /references
--    a) menu canonique à 10 entrées → menu canonique 11 entrées (Références après Vidéos)
--    b) menu déjà modifié par l’admin → ajout additif gardé (json_insert)
-- ---------------------------------------------------------------------------
UPDATE menus SET items = '[{"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"}, {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"}, {"label": "Galerie", "url": "/galerie"}, {"label": "Vidéos", "url": "/videos"}, {"label": "Références", "url": "/references"}, {"label": "Blog", "url": "/blog"}, {"label": "Documents", "url": "/ressources"}, {"label": "Implantation", "url": "/implantation"}, {"label": "Contact", "url": "/contact"}]', updated_at = datetime('now')
WHERE location = 'header' AND items = '[{"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"}, {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"}, {"label": "Galerie", "url": "/galerie"}, {"label": "Vidéos", "url": "/videos"}, {"label": "Blog", "url": "/blog"}, {"label": "Documents", "url": "/ressources"}, {"label": "Implantation", "url": "/implantation"}, {"label": "Contact", "url": "/contact"}]';

UPDATE menus SET items = json_insert(items, '$[#]', json_object('label', 'Références', 'url', '/references')), updated_at = datetime('now')
WHERE location = 'header' AND items NOT LIKE '%/references%';

-- Pied de page « Informations » (section liens) — additif gardé
UPDATE footer_sections SET content = json_insert(content, '$.items[' || json_array_length(content, '$.items') || ']', json_object('label', 'Références', 'url', '/references')), updated_at = datetime('now')
WHERE section_key = 'liens' AND content NOT LIKE '%/references%';
