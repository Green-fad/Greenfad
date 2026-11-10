-- ===========================================================================
-- 0021 : PERFORMANCE ACCUEIL — LOGOS PARTENAIRES TÉLÉVERSÉS OPTIMISÉS
--        (demande du fondateur, 10/11/2026 — « éviter de charger la page »)
-- ---------------------------------------------------------------------------
-- Contexte : la migration 0020 a optimisé les logos semés, mais en production
-- les 14 lignes partners pointent vers des fichiers R2 téléversés par
-- l'administration (total ~1958 Ko — dont un PNG de 941 Ko). Conformément à la
-- règle « aucune donnée admin écrasée », 0020 les avait laissés intacts.
--
-- Démarche de 0021 : pour chaque ligne, un DÉRIVÉ WebP 320×200 du MÊME logo
-- (visuellement identique, total ~70 Ko) est livré comme asset versionné ;
-- partners.logo_key bascule vers ce jumeau AVEC GARDE = clé R2 exacte.
-- L'original reste intact dans R2 : retour arrière possible en réaffectant la
-- clé d'origine (conservée dans la garde WHERE de chaque UPDATE). Idempotent.
-- RÈGLES : INSERT OR IGNORE / UPDATE gardés ; content_version inchangée (16) ;
--          aucun bloc du Page Builder ni aucune autre table n'est touché.
-- ===========================================================================

-- 1) Médias dérivés déclarés dans la médiathèque (idempotent)
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-afric-immo-w320.webp', 'partenaire-afric-immo-w320.webp', 'image/webp', 3688, 320, 200, 'Référence client : Afric-Immo (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-artifyfad-w320.webp', 'partenaire-artifyfad-w320.webp', 'image/webp', 1962, 320, 200, 'Référence client : ArtifyFad (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-casa-des-delices-w320.webp', 'partenaire-casa-des-delices-w320.webp', 'image/webp', 9936, 320, 200, 'Référence client : Casa des Délices (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-cours-africa-w320.webp', 'partenaire-cours-africa-w320.webp', 'image/webp', 7334, 320, 200, 'Référence client : Cours Africa (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-efb-entreprise-w320.webp', 'partenaire-efb-entreprise-w320.webp', 'image/webp', 7972, 320, 200, 'Référence client : EFB Entreprise (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-massaley-hotel-w320.webp', 'partenaire-massaley-hotel-w320.webp', 'image/webp', 5000, 320, 200, 'Référence client : Massaley Hôtel (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-pharmacie-hopital-du-mali-w320.webp', 'partenaire-pharmacie-hopital-du-mali-w320.webp', 'image/webp', 2852, 320, 200, 'Référence client : Pharmacie hôpital du Mali (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-eurodecor-w320.webp', 'partenaire-eurodecor-w320.webp', 'image/webp', 3480, 320, 200, 'Référence client : Eurodecor (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-justice-mali-w320.webp', 'partenaire-justice-mali-w320.webp', 'image/webp', 7342, 320, 200, 'Référence client : Justice Mali (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-le-baobab-hotel-w320.webp', 'partenaire-le-baobab-hotel-w320.webp', 'image/webp', 6914, 320, 200, 'Référence client : Le Baobab Hôtel (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-nature-attitude-w320.webp', 'partenaire-nature-attitude-w320.webp', 'image/webp', 3220, 320, 200, 'Référence client : Nature Attitude (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-sky-buffet-w320.webp', 'partenaire-sky-buffet-w320.webp', 'image/webp', 3874, 320, 200, 'Référence client : Sky Buffet (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-greenfad-w320.webp', 'partenaire-greenfad-w320.webp', 'image/webp', 5824, 320, 200, 'Référence client : Greenfad (optimisé 0021)', '/', 'seed', datetime('now'));
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES ('/assets/images/clients/partenaire-greenfad-2-w320.webp', 'partenaire-greenfad-2-w320.webp', 'image/webp', 2848, 320, 200, 'Référence client : Greenfad 2 (optimisé 0021)', '/', 'seed', datetime('now'));



-- 2) Bascule logo_key → jumeau WebP (garde : clé R2 exacte — idempotent)
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-afric-immo-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/47JX0BQKCH12HB3HEWZPZJC38W-img-6166.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-artifyfad-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/JJ21T7ER5JKQ0Y3Z98NT3CKWEW-img-6173.webp';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-casa-des-delices-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/M1SXBEDW1RC2EZBHX7Z3AVRVXG-img-6172.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-cours-africa-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/V49CV71VZTWQ69J5GN87W31JM3-img-6175.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-efb-entreprise-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/3KR6FKN606MPTCX5C1TAT81QKW-img-6174.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-massaley-hotel-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/W2AVHPN7JQQKDRKHNA0GAX2VCE-img-6169.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-pharmacie-hopital-du-mali-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/BVS7KJ2MNE5BYXEERNAB04YRVR-img-6179.png';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-eurodecor-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/XKR24TX882GD8XAQYJBYPGDZR0-img-6171.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-justice-mali-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/JWVNEYVP56GQE874XB6ZM8QK7C-img-6178.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-le-baobab-hotel-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/SSMK2QSQ8KSX72DS2CZGTX2A5X-img-6168.png';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-nature-attitude-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/V3A8KADXCJGET8C33B452JC09K-img-6177.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-sky-buffet-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/EFHYKZ7TS0JEH6VMXWVM3MC9Z8-img-6176.jpg';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-greenfad-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/13CPVZF5YQ42PXZEJ5881P14EY-img-0057.png';
UPDATE partners SET logo_key = '/assets/images/clients/partenaire-greenfad-2-w320.webp', updated_at = datetime('now') WHERE logo_key = 'media/2026-11/SPMJYGDV9BA1BG6GGXRG52Z9VT-img-6071.png';

-- 3) content_version inchangée (16) — contenu éditorial non touché.
-- ===========================================================================
