-- ===========================================================================
-- 0022 : VIDÉOS GREEN FAD SUPPLÉMENTAIRES + MENU « VIDÉOS » (demande du
--        fondateur, 11/11/2026) — « fais pareil pour les vidéos : menu + voir
--        plus, ajoute plus de vidéos Greenfad depuis YouTube, Facebook et
--        TikTok sur les URLs si possible »
-- ---------------------------------------------------------------------------
-- 1) 15 nouvelles vidéos RÉELLES et VÉRIFIÉES le 11/11/2026 :
--      - 13 de la chaîne YouTube officielle @greenfad (toutes validées via
--        l'oEmbed YouTube : titre réel confirmé) ;
--      - 2 de la page Facebook officielle Green fad (100083594433530),
--        vérifiées HTTP 200 avec titre réel.
--    TikTok (@greenfad1, profil confirmé) : aucune URL de vidéo individuelle
--    vérifiable publiquement à ce jour — rien n'est inventé ; le Media Center
--    accepte désormais les URLs TikTok/Facebook (code déployé) pour l'admin.
-- 2) Relations produit ↔ vidéo (démos liées aux fiches produits).
-- 3) Menu d'en-tête : entrée « Vidéos » → /videos (additif gardé, après Galerie).
-- 4) Pied de page « Informations » : entrée « Vidéos » (gardé : sauté si déjà présent).
-- RÈGLES : INSERT gardés WHERE NOT EXISTS — aucune saisie admin écrasée ;
--          content_version inchangé (16). Le seed est mis à jour à la source
--          (seed.sql menu/footer, content-update.sql 9ter) pour les installs fraîches.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1) Vidéos YouTube officielles vérifiées (13 nouvelles)
-- ---------------------------------------------------------------------------
INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=d2XY1csuELw', 'youtube', 'd2XY1csuELw', 'PayGFad School V3 — La gestion de votre établissement, enfin réunie en une seule plateforme', 'Version courte (0:24) de la présentation officielle de PayGfad School V3, publiée sur la chaîne YouTube officielle Green FAD.', 'Chaîne YouTube officielle Green FAD', 'démonstration', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='d2XY1csuELw');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=BrBqSoTMcEs', 'youtube', 'BrBqSoTMcEs', 'Nous sommes enchantés d''accueillir officiellement M. Sagaba, notre nouvel ambassadeur !', 'Green FAD accueille officiellement M. Sagaba comme nouvel ambassadeur de l''entreprise.', 'Chaîne YouTube officielle Green FAD', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='BrBqSoTMcEs');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=_LPSzlqTtfI', 'youtube', '_LPSzlqTtfI', 'Vous cherchez des solutions réellement adaptées à vos réalités ? Faites confiance à GreenFad.', 'Message de marque : des solutions réellement adaptées aux réalités du terrain africain, par Green FAD.', 'Chaîne YouTube officielle Green FAD', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='_LPSzlqTtfI');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=agHGXIMrPYM', 'youtube', 'agHGXIMrPYM', 'Greenfad solution numéro', 'Format court institutionnel publié sur la chaîne YouTube officielle Green FAD.', 'Chaîne YouTube officielle Green FAD', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='agHGXIMrPYM');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=tOhveZTZr5w', 'youtube', 'tOhveZTZr5w', '29 avril 2025', 'Vidéo datée du 29 avril 2025, publiée sur la chaîne YouTube officielle Green FAD.', 'Chaîne YouTube officielle Green FAD', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='tOhveZTZr5w');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=ZDEf64aa6mU', 'youtube', 'ZDEf64aa6mU', 'Ce système innovant, développé par GreenFad', 'Présentation d''un système innovant développé par Green FAD pour simplifier les démarches en administration : carte d''identité, permis et remise de documents par le citoyen.', 'Chaîne YouTube officielle Green FAD', 'démonstration', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='ZDEf64aa6mU');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=n-7HR5UjUWQ', 'youtube', 'n-7HR5UjUWQ', 'Un moment d''échange inspirant autour de l''innovation responsable !', 'Moment d''échange autour de l''innovation responsable, partagé par Green FAD sur sa chaîne YouTube officielle.', 'Chaîne YouTube officielle Green FAD', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='n-7HR5UjUWQ');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=xNIcsGjnobw', 'youtube', 'xNIcsGjnobw', 'GreenFad, nous avons eu le plaisir de présenter l''un de nos projets technologiques en cours', 'Présentation de l''un des projets technologiques de Green FAD en cours de développement.', 'Chaîne YouTube officielle Green FAD', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='xNIcsGjnobw');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=NCHGYFyS1gE', 'youtube', 'NCHGYFyS1gE', 'Greenfad', 'Format court Green FAD publié sur la chaîne YouTube officielle.', 'Chaîne YouTube officielle Green FAD', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='NCHGYFyS1gE');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=iEZrIn1XEOA', 'youtube', 'iEZrIn1XEOA', 'Greenfad', 'Format court Green FAD publié sur la chaîne YouTube officielle.', 'Chaîne YouTube officielle Green FAD', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='iEZrIn1XEOA');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=y9JmColz_nM', 'youtube', 'y9JmColz_nM', 'Chez GreenFad, on croit en un tech qui fait sens.', 'Short YouTube officiel — la technologie prend racine en Afrique : des solutions numériques sur mesure, pensées pour les réalités économiques, sociales et culturelles locales.', 'Chaîne YouTube officielle Green FAD', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='y9JmColz_nM');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=3uNcno1QbXo', 'youtube', '3uNcno1QbXo', 'Solution Greenfad Qrfad', 'Short YouTube officiel présentant la solution Greenfad QRFAD.', 'Chaîne YouTube officielle Green FAD', 'démonstration', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='3uNcno1QbXo');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.youtube.com/watch?v=ZoikRw1HiWM', 'youtube', 'ZoikRw1HiWM', 'Green fad', 'Short YouTube officiel Green FAD.', 'Chaîne YouTube officielle Green FAD', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider_id='ZoikRw1HiWM');

-- ---------------------------------------------------------------------------
-- 1 bis) Vidéos de la page Facebook officielle Green fad (2, vérifiées HTTP 200)
-- ---------------------------------------------------------------------------
INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.facebook.com/100083594433530/videos/738279598528880/', 'facebook', '738279598528880', 'Vers un avenir plus lumineux pour l''Afrique, propulsé par l''innovation locale !', 'Comme ces mains tendues vers l''horizon, Green Fad s''engage pour un avenir plus lumineux pour l''Afrique, propulsé par l''innovation locale — vidéo publiée sur la page Facebook officielle Green fad.', 'Page Facebook officielle Green fad', 'institutionnel', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider='facebook' AND provider_id='738279598528880');

INSERT INTO media_items (type, source_url, provider, provider_id, title, description, credit, category, sort_order, status, published_at, uploaded_by, created_at, updated_at) SELECT 'video', 'https://www.facebook.com/100083594433530/videos/1195587872264932/', 'facebook', '1195587872264932', 'Un immense merci à toutes et à tous pour votre présence hier soir sur ORTM !', 'Green Fad remercie son audience après son passage sur l''ORTM, la télévision nationale malienne (7 mai 2025) — vidéo publiée sur la page Facebook officielle Green fad.', 'Page Facebook officielle Green fad', 'presse & médias', 0, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM media_items WHERE type='video' AND provider='facebook' AND provider_id='1195587872264932');

-- ---------------------------------------------------------------------------
-- 2) Relations produit ↔ vidéo (les fiches produits affichent leurs démos)
--    Gardes EXISTS : jamais d'échec si le produit a été renommé/supprimé par l'admin
-- ---------------------------------------------------------------------------
INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug='paygfad'), mi.id, 0 FROM media_items mi WHERE mi.type='video' AND mi.provider_id='d2XY1csuELw' AND EXISTS (SELECT 1 FROM products WHERE slug='paygfad') AND NOT EXISTS (SELECT 1 FROM content_relations cr WHERE cr.content_type='product' AND cr.content_id=(SELECT id FROM products WHERE slug='paygfad') AND cr.media_item_id=mi.id);

INSERT INTO content_relations (content_type, content_id, media_item_id, sort_order) SELECT 'product', (SELECT id FROM products WHERE slug='qrfad'), mi.id, 0 FROM media_items mi WHERE mi.type='video' AND mi.provider_id='3uNcno1QbXo' AND EXISTS (SELECT 1 FROM products WHERE slug='qrfad') AND NOT EXISTS (SELECT 1 FROM content_relations cr WHERE cr.content_type='product' AND cr.content_id=(SELECT id FROM products WHERE slug='qrfad') AND cr.media_item_id=mi.id);

-- ---------------------------------------------------------------------------
-- 3) Menu d'en-tête : « Vidéos » → /videos (après Galerie)
--    a) menu canonique à 9 entrées (Documents inclus) → menu canonique 10 entrées
--    b) menu modifié par l'admin (sans /videos) → ajout en fin de tableau
-- ---------------------------------------------------------------------------
UPDATE menus SET items = '[{"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"}, {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"}, {"label": "Galerie", "url": "/galerie"}, {"label": "Vidéos", "url": "/videos"}, {"label": "Blog", "url": "/blog"}, {"label": "Documents", "url": "/ressources"}, {"label": "Implantation", "url": "/implantation"}, {"label": "Contact", "url": "/contact"}]', updated_at = datetime('now')
WHERE location = 'header' AND items = '[{"label": "Entreprise", "url": "/p/entreprise"}, {"label": "Expertises", "url": "/expertises"}, {"label": "Produits", "url": "/produits"}, {"label": "Réalisations", "url": "/realisations"}, {"label": "Galerie", "url": "/galerie"}, {"label": "Blog", "url": "/blog"}, {"label": "Documents", "url": "/ressources"}, {"label": "Implantation", "url": "/implantation"}, {"label": "Contact", "url": "/contact"}]';

UPDATE menus SET items = json_insert(items, '$[#]', json_object('label', 'Vidéos', 'url', '/videos')), updated_at = datetime('now')
WHERE location = 'header' AND items NOT LIKE '%/videos%';

-- ---------------------------------------------------------------------------
-- 4) Pied de page « Informations » : « Vidéos » (gardé)
-- ---------------------------------------------------------------------------
UPDATE footer_sections SET content = json_insert(content, '$.items[' || json_array_length(content, '$.items') || ']', json_object('label', 'Vidéos', 'url', '/videos')), updated_at = datetime('now')
WHERE section_key = 'liens' AND content NOT LIKE '%/videos%';
