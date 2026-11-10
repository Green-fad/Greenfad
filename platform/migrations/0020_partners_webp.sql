-- ===========================================================================
-- 0020 : PERFORMANCE ACCUEIL — LOGOS PARTENAIRES OPTIMISÉS (demande du
--        fondateur, 10/11/2026) — « nos partenaires sont beaucoup, alors
--        l'affichage doit être mieux affiché pour éviter de charger la page »
-- ---------------------------------------------------------------------------
-- Problème : la section « Références » de l'accueil charge 14 logos
-- JPG/PNG de 800×500 px (~320 Ko au total) pour un affichage de 58 px de
-- haut — poids et requêtes inutiles sur les réseaux mobiles africains.
--
-- 1) 14 versions WebP 320×200 (qualité 80) livrées dans /assets/images/
--    clients/ — poids total ~34 Ko (-89 %), rendu visuel identique
--    (mêmes logos, même ratio 8:5).
-- 2) Médias déclarés dans la médiathèque (INSERT OR IGNORE — idempotent).
-- 3) partners.logo_key basculé vers le WebP UNIQUEMENT si la ligne pointe
--    encore vers le fichier semé d'origine (garde = chemin exact) —
--    aucun logo téléversé par l'admin n'est jamais écrasé.
-- 4) Rendu : le bloc « partners » ajoute decoding="async" + width/height
--    intrinsèques (src/blocks.ts) — zéro décalage de mise en page.
-- RÈGLES : INSERT OR IGNORE / UPDATE gardés — aucune saisie admin écrasée ;
--          content_version inchangée (16) ; le seed est mis à jour à la
--          source (seed.sql + content-update.sql) pour survivre à un bump.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1) Médias WebP déclarés dans la médiathèque (idempotent)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/afric-immo-w320.webp', 'afric-immo-w320.webp', 'image/webp', 2270, 320, 200, 'Référence client : Afric-Immo (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/artifyfad-w320.webp', 'artifyfad-w320.webp', 'image/webp', 2324, 320, 200, 'Référence client : ArtifyFad (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/casa-des-delices-w320.webp', 'casa-des-delices-w320.webp', 'image/webp', 2706, 320, 200, 'Référence client : Casa des Délices (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/cours-africa-w320.webp', 'cours-africa-w320.webp', 'image/webp', 2734, 320, 200, 'Référence client : Cours Africa (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/efb-entreprise-w320.webp', 'efb-entreprise-w320.webp', 'image/webp', 2452, 320, 200, 'Référence client : EFB Entreprise (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/emage-w320.webp', 'emage-w320.webp', 'image/webp', 2346, 320, 200, 'Référence client : EMAGE (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/emmaf-consulting-w320.webp', 'emmaf-consulting-w320.webp', 'image/webp', 2730, 320, 200, 'Référence client : Emmaf Consulting (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/eurodecor-w320.webp', 'eurodecor-w320.webp', 'image/webp', 2378, 320, 200, 'Référence client : Eurodecor (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/greenfad1-w320.webp', 'greenfad1-w320.webp', 'image/webp', 2396, 320, 200, 'Référence client : Greenfad (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/greenfad2-w320.webp', 'greenfad2-w320.webp', 'image/webp', 2726, 320, 200, 'Référence client : Greenfad 2 (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/justice-mali-w320.webp', 'justice-mali-w320.webp', 'image/webp', 2350, 320, 200, 'Référence client : Justice Mali (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/le-baobab-hotel-w320.webp', 'le-baobab-hotel-w320.webp', 'image/webp', 2822, 320, 200, 'Référence client : Le Baobab Hôtel (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/nature-attitude-w320.webp', 'nature-attitude-w320.webp', 'image/webp', 2718, 320, 200, 'Référence client : Nature Attitude (optimisé)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/sky-buffet-w320.webp', 'sky-buffet-w320.webp', 'image/webp', 2702, 320, 200, 'Référence client : Sky Buffet (optimisé)', '/', 'seed', datetime('now'));

-- ---------------------------------------------------------------------------
-- 2) Filet de sécurité (AVANT la bascule) : si un ancien re-seed a recréé un
--    doublon avec la clé JPG alors que le jumeau WebP existe déjà (même nom),
--    on supprime uniquement la ligne encore branchée sur l'ancien fichier
--    /assets/images/clients/ (les logos téléversés par l'admin, sous
--    /media/…, ne sont jamais touchés). Idempotent : ne fait rien sans doublon.
--    Placé AVANT les UPDATE : sinon le doublon JPG serait lui-aussi basculé
--    en WebP et deviendrait un doublon WebP invisible pour ce filtre.
-- ---------------------------------------------------------------------------
DELETE FROM partners
WHERE logo_key LIKE '/assets/images/clients/%'
  AND logo_key NOT LIKE '%-w320.webp'
  AND EXISTS (SELECT 1 FROM partners p2 WHERE p2.name = partners.name AND p2.logo_key LIKE '%-w320.webp');

-- ---------------------------------------------------------------------------
-- 3) Bascule partners.logo_key → WebP (garde : chemin semé exact —
--    un logo admin différent n'est JAMAIS touché ; idempotent au re-run)
-- ---------------------------------------------------------------------------
UPDATE partners SET logo_key = '/assets/images/clients/afric-immo-w320.webp'      WHERE logo_key = '/assets/images/clients/afric-immo.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/artifyfad-w320.webp'       WHERE logo_key = '/assets/images/clients/artifyfad.png';
UPDATE partners SET logo_key = '/assets/images/clients/casa-des-delices-w320.webp' WHERE logo_key = '/assets/images/clients/casa-des-delices.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/cours-africa-w320.webp'    WHERE logo_key = '/assets/images/clients/cours-africa.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/efb-entreprise-w320.webp'  WHERE logo_key = '/assets/images/clients/efb-entreprise.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/emage-w320.webp'           WHERE logo_key = '/assets/images/clients/emage.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/emmaf-consulting-w320.webp' WHERE logo_key = '/assets/images/clients/emmaf-consulting.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/eurodecor-w320.webp'       WHERE logo_key = '/assets/images/clients/eurodecor.png';
UPDATE partners SET logo_key = '/assets/images/clients/greenfad1-w320.webp'       WHERE logo_key = '/assets/images/clients/greenfad1.png';
UPDATE partners SET logo_key = '/assets/images/clients/greenfad2-w320.webp'       WHERE logo_key = '/assets/images/clients/greenfad2.png';
UPDATE partners SET logo_key = '/assets/images/clients/justice-mali-w320.webp'    WHERE logo_key = '/assets/images/clients/justice-mali.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/le-baobab-hotel-w320.webp' WHERE logo_key = '/assets/images/clients/le-baobab-hotel.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/nature-attitude-w320.webp' WHERE logo_key = '/assets/images/clients/nature-attitude.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/sky-buffet-w320.webp'      WHERE logo_key = '/assets/images/clients/sky-buffet.jpg';

-- ---------------------------------------------------------------------------
-- 4) content_version inchangée (16) — le contenu éditorial n'est pas touché.
-- ===========================================================================
