-- ===========================================================================
-- 0019 : DOCUMENTS PUBLICS DE L'ENTREPRISE + MENU (demande du fondateur,
--        10/11/2026) — « enrichir les documents publics utiles à
--        l'avancement de l'entreprise et à la crédibilité auprès des
--        partenaires » + « il manque des documents dans le menu »
-- ---------------------------------------------------------------------------
-- 1) 4 nouveaux documents officiels (PDF statiques livrés dans
--    /assets/docs/) ajoutés à la table documents — la page /ressources
--    les liste (7 documents au total avec les 3 existants).
-- 2) Menu d'en-tête : entrée « Documents » → /ressources (additif gardé).
-- 3) Pied de page « Informations » : entrée « Documents publics » (gardé :
--    sauté si déjà présent).
-- RÈGLES : INSERT OR IGNORE / UPDATE gardés — aucune saisie admin écrasée ;
--          content_version inchangé (16). Le seed est mis à jour à la source
--          (documents, menu header, footer liens) pour survivre à un bump.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1) Documents officiels (fichiers PDF statiques — CDN Pages)
-- ---------------------------------------------------------------------------
INSERT INTO documents (title, description, category, file_key, file_name, mime, size, is_public, status, published_at, created_at, updated_at) SELECT 'Profil d''entreprise GREEN FAD — 2026', 'Qui est GREEN FAD : mission, trajectoire documentée 2019-2026, écosystème des onze produits, discipline produit et coordonnées officielles. Le document de référence pour découvrir et vérifier l''entreprise.', 'Institutionnel', '/assets/docs/profil-entreprise-greenfad.pdf', 'profil-entreprise-greenfad.pdf', 'application/pdf', 142251, 1, 'publie', datetime('now'), datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_key='/assets/docs/profil-entreprise-greenfad.pdf');

INSERT INTO documents (title, description, category, file_key, file_name, mime, size, is_public, status, published_at, created_at, updated_at) SELECT 'Catalogue des produits GREEN FAD — 2026', 'Les onze produits présentés produit par produit : promesse, fonctionnalités documentées, état réel de disponibilité et accès. Une photographie honnête du portefeuille à novembre 2026.', 'Catalogues', '/assets/docs/catalogue-produits-greenfad.pdf', 'catalogue-produits-greenfad.pdf', 'application/pdf', 171224, 1, 'publie', datetime('now'), datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_key='/assets/docs/catalogue-produits-greenfad.pdf');

INSERT INTO documents (title, description, category, file_key, file_name, mime, size, is_public, status, published_at, created_at, updated_at) SELECT 'Prospectus de partenariat GREEN FAD — 2026', 'Pourquoi et comment devenir partenaire : ce que nous avons construit, quatre modèles de partenariat (revendeurs, établissements, partenaires financiers WARIPAY, opérateurs), engagements et processus en quatre étapes.', 'Partenariats', '/assets/docs/prospectus-partenariats-greenfad.pdf', 'prospectus-partenariats-greenfad.pdf', 'application/pdf', 141757, 1, 'publie', datetime('now'), datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_key='/assets/docs/prospectus-partenariats-greenfad.pdf');

INSERT INTO documents (title, description, category, file_key, file_name, mime, size, is_public, status, published_at, created_at, updated_at) SELECT 'Dossier de presse GREEN FAD — novembre 2026', 'L''information essentielle pour les médias : fiche d''identité, chronologie vérifiable 2019-2026, les produits en une phrase, éléments de langage et angles d''actualité de novembre 2026.', 'Presse', '/assets/docs/dossier-presse-greenfad.pdf', 'dossier-presse-greenfad.pdf', 'application/pdf', 143314, 1, 'publie', datetime('now'), datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM documents WHERE file_key='/assets/docs/dossier-presse-greenfad.pdf');

-- ---------------------------------------------------------------------------
-- 2) Menu d'en-tête : « Documents » → /ressources
--    a) menu semé intact → remplacement par le menu canonique 9 entrées
--       (Documents entre Blog et Contact)
--    b) menu modifié par l'admin (sans Documents) → ajout en fin de tableau
-- ---------------------------------------------------------------------------
UPDATE menus SET items = '[{"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"}, {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"}, {"label": "Galerie", "url": "/galerie"}, {"label": "Blog", "url": "/blog"}, {"label": "Documents", "url": "/ressources"}, {"label": "Implantation", "url": "/implantation"}, {"label": "Contact", "url": "/contact"}]', updated_at = datetime('now')
WHERE location = 'header' AND items = '[{"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"}, {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"}, {"label": "Galerie", "url": "/galerie"}, {"label": "Blog", "url": "/blog"}, {"label": "Implantation", "url": "/implantation"}, {"label": "Contact", "url": "/contact"}]';

UPDATE menus SET items = json_insert(items, '$[#]', json_object('label', 'Documents', 'url', '/ressources')), updated_at = datetime('now')
WHERE location = 'header' AND items NOT LIKE '%/ressources%';

-- ---------------------------------------------------------------------------
-- 3) Pied de page « Informations » : « Documents publics » (gardé)
-- ---------------------------------------------------------------------------
UPDATE footer_sections SET content = json_insert(content, '$.items[' || json_array_length(content, '$.items') || ']', json_object('label', 'Documents publics', 'url', '/ressources')), updated_at = datetime('now')
WHERE section_key = 'liens' AND content NOT LIKE '%/ressources%';
