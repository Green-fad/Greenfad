-- ===========================================================================
-- 0013 : CONFIDENTIALITÉ — compléments (règle non négociable, directive CTO §7)
-- ---------------------------------------------------------------------------
-- Ces UPDATE complètent la purge du stack technique débutée en 0012 sur des
-- contenus identifiés après le déploiement initial (history_intro_md des
-- fiches produits, meta_title/meta_description, description longue de
-- l'article « Tile : un an et huit mois d'ingénierie »).
-- Règle inchangée : capacités et résultats publics — jamais les technologies
-- internes (Flutter, Firebase, React, Next.js, Cloudflare, Hono…).
-- Idempotent : REPLACE est un no-op si le motif est absent.
-- ===========================================================================

-- Introductions « Histoire & évolution » des fiches produits
UPDATE products SET history_intro_md = REPLACE(history_intro_md, 'infrastructure Cloudflare (pages, Workers, D1) opérée par Green FAD', 'infrastructure cloud opérée et supervisée par Green FAD') WHERE history_intro_md LIKE '%Cloudflare%';
UPDATE products SET history_intro_md = REPLACE(history_intro_md, 'infrastructure Cloudflare opérée par Green FAD', 'infrastructure cloud opérée par Green FAD') WHERE history_intro_md LIKE '%Cloudflare%';
UPDATE products SET history_intro_md = REPLACE(history_intro_md, 'base technique moderne (Next.js, TypeScript, React)', 'base technique moderne et éprouvée') WHERE history_intro_md LIKE '%Next.js%';
UPDATE products SET history_intro_md = REPLACE(history_intro_md, '**Stack :** Next.js, TypeScript, React, intégrations IA', '**Approche :** intégrations IA') WHERE history_intro_md LIKE '%Next.js%';
UPDATE products SET history_intro_md = REPLACE(history_intro_md, '**Stack :**', '**Approche :**') WHERE history_intro_md LIKE '%**Stack :**%';
UPDATE products SET history_intro_md = REPLACE(history_intro_md, 'une application Flutter (Android, iOS, Web/PWA) adossée à Firebase et à une administration React', 'une application multiplateforme (Android, iOS, Web/PWA) adossée à des services cloud et à une console d''administration dédiée') WHERE history_intro_md LIKE '%Flutter%';
UPDATE products SET history_intro_md = REPLACE(history_intro_md, 'Flutter/Firebase', 'd''ingénierie') WHERE history_intro_md LIKE '%Flutter%';

-- Métadonnées SEO des produits
UPDATE products SET meta_title = REPLACE(meta_title, 'Flutter/Firebase', 'd''ingénierie') WHERE meta_title LIKE '%Flutter%';
UPDATE products SET meta_description = REPLACE(meta_description, 'Flutter/Firebase', 'd''ingénierie') WHERE meta_description LIKE '%Flutter%';
UPDATE products SET meta_description = REPLACE(meta_description, 'une application Flutter (Android, iOS, Web/PWA) adossée à Firebase et à une administration React', 'une application multiplateforme (Android, iOS, Web/PWA) adossée à des services cloud et à une console d''administration dédiée') WHERE meta_description LIKE '%Flutter%';

-- Article de reconstruction « Tile : un an et huit mois d'ingénierie » (public)
UPDATE posts SET content_md = REPLACE(content_md, 'une application Flutter (Android, iOS, Web/PWA) adossée à Firebase et à une administration React', 'une application multiplateforme (Android, iOS, Web/PWA) adossée à des services cloud et à une console d''administration dédiée') WHERE content_md LIKE '%Flutter%';
UPDATE posts SET excerpt = REPLACE(excerpt, 'une application Flutter (Android, iOS, Web/PWA) adossée à Firebase et à une administration React', 'une application multiplateforme (Android, iOS, Web/PWA) adossée à des services cloud et à une console d''administration dédiée') WHERE excerpt LIKE '%Flutter%';
