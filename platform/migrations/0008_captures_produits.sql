-- ===========================================================================
-- 0008 : Captures d'écran réelles — QRFAD (démo qrfad.com) & TILE (kit média
--        officiel + tileofficiel.com) — Mission captures produits
-- ---------------------------------------------------------------------------
-- RÈGLE STRICTE NON-DESTRUCTIVE :
--   1. Les images sont des fichiers statiques livrés avec le bundle Pages
--      (platform/public/assets/images/products/) — aucun objet R2 existant
--      n'est modifié.
--   2. INSERT OR IGNORE INTO media : n'ajoute que les clés r2_key absentes ;
--      jamais de remplacement d'une entrée existante.
--   3. Les UPDATE screenshots_json / downloads_json sont GARDÉS : ils ne
--      s'appliquent QUE si la valeur actuelle est vide ('[]', '' ou NULL).
--      Tout contenu saisi via le Dashboard admin est donc préservé.
--   4. content_version reste à 16 : seed/content-update.sql ne se ré-exécute
--      pas, aucune donnée éditoriale n'est resynchronisée.
-- Sources des captures :
--   QRFAD  — démo réelle https://qrfad.com (Dashboard Massaley Hotel + menu
--            public), 2026-11-09, avec l'accès de démonstration du fondateur.
--   TILE   — kit média presse officiel (captures iPhone) + site officiel
--            https://tileofficiel.com + PWA en production (lecteur vidéo).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1) Enregistrement des 16 captures QRFAD dans la médiathèque (additif)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES
  ('/assets/images/products/qrfad-mobile-01.jpg',  'qrfad-mobile-01.jpg',  'image/jpeg', 33894,  390, 844, 'Tableau de bord QRFAD — ventes du jour, commandes actives et activité des 7 derniers jours', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-mobile-02.jpg',  'qrfad-mobile-02.jpg',  'image/jpeg', 34354,  390, 844, 'Commandes QRFAD — sur place, à emporter, livraison, suivies en temps réel', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-mobile-03.jpg',  'qrfad-mobile-03.jpg',  'image/jpeg', 51644,  390, 844, 'Menu Digital — 88 plats organisés par catégories, photos et prix toujours à jour', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-mobile-04.jpg',  'qrfad-mobile-04.jpg',  'image/jpeg', 66342,  390, 844, 'Caisse POS — encaissement rapide avec produits, remises et taxes', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-mobile-05.jpg',  'qrfad-mobile-05.jpg',  'image/jpeg', 57521,  390, 844, 'Menu client par QR code — Massaley Hotel, sans application à installer', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-mobile-06.jpg',  'qrfad-mobile-06.jpg',  'image/jpeg', 56041,  390, 844, 'Menu client — plats, descriptions et prix synchronisés depuis le dashboard', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-mobile-07.jpg',  'qrfad-mobile-07.jpg',  'image/jpeg', 63379,  390, 844, 'Portail public qrfad.com — votre menu numérique, accessible en un scan', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-mobile-08.jpg',  'qrfad-mobile-08.jpg',  'image/jpeg', 33894,  390, 844, 'Connexion sécurisée au Dashboard restaurateur QRFAD', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-desktop-01.jpg', 'qrfad-desktop-01.jpg', 'image/jpeg', 76825,  1280, 800, 'Dashboard QRFAD — vue d''ensemble : activité, commandes en cours et QR menu', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-desktop-02.jpg', 'qrfad-desktop-02.jpg', 'image/jpeg', 65978,  1280, 800, 'Gestion des commandes — confirmation d''un geste, filtres par type', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-desktop-03.jpg', 'qrfad-desktop-03.jpg', 'image/jpeg', 162588, 1280, 800, 'Menu Digital — gestion des plats, catégories et photos', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-desktop-04.jpg', 'qrfad-desktop-04.jpg', 'image/jpeg', 55234,  1280, 800, 'Tables & QR — générez et imprimez les QR codes de vos tables', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-desktop-05.jpg', 'qrfad-desktop-05.jpg', 'image/jpeg', 137298, 1280, 800, 'Caisse POS intégrée — paiements, remises, taxes et dépenses', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-desktop-06.jpg', 'qrfad-desktop-06.jpg', 'image/jpeg', 83168,  1280, 800, 'Menu public Massaley Hotel — l''expérience client sur grand écran', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-desktop-07.jpg', 'qrfad-desktop-07.jpg', 'image/jpeg', 110879, 1280, 800, 'Portail public qrfad.com — établissements partenaires, menus et commandes', '/', 'seed', datetime('now')),
  ('/assets/images/products/qrfad-desktop-08.jpg', 'qrfad-desktop-08.jpg', 'image/jpeg', 23804,  1280, 800, 'Connexion au Dashboard QRFAD', '/', 'seed', datetime('now'));

-- ---------------------------------------------------------------------------
-- 2) Enregistrement des 7 captures TILE dans la médiathèque (additif)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES
  ('/assets/images/products/tile-mobile-01.jpg',  'tile-mobile-01.jpg',  'image/jpeg', 164372, 800, 1660, 'TILE — accueil : créez, partagez, connectez-vous', '/', 'seed', datetime('now')),
  ('/assets/images/products/tile-mobile-02.jpg',  'tile-mobile-02.jpg',  'image/jpeg', 166430, 800, 1642, 'Flux Certifié — l''information vérifiée des médias et institutions', '/', 'seed', datetime('now')),
  ('/assets/images/products/tile-mobile-03.jpg',  'tile-mobile-03.jpg',  'image/jpeg', 238562, 800, 1625, 'Flux Certifié, onglet Urgent — les annonces officielles en priorité', '/', 'seed', datetime('now')),
  ('/assets/images/products/tile-mobile-04.jpg',  'tile-mobile-04.jpg',  'image/jpeg', 147085, 780, 1688, 'Lecteur vidéo immersif — créateurs et vidéos verticales', '/', 'seed', datetime('now')),
  ('/assets/images/products/tile-desktop-01.jpg', 'tile-desktop-01.jpg', 'image/jpeg', 125936, 1280, 800, 'tileofficiel.com — le site officiel de TILE, Le Réseau du Progrès', '/', 'seed', datetime('now')),
  ('/assets/images/products/tile-desktop-02.jpg', 'tile-desktop-02.jpg', 'image/jpeg', 80225,  1280, 800, 'Six univers dans une seule application — vidéos, flux certifié, explorer, messagerie, boutiques', '/', 'seed', datetime('now')),
  ('/assets/images/products/tile-desktop-03.jpg', 'tile-desktop-03.jpg', 'image/jpeg', 140201, 1280, 800, 'Une plateforme vivante — les trois flux : Réseau, Certifié, Pour toi', '/', 'seed', datetime('now'));

-- ---------------------------------------------------------------------------
-- 3) QRFAD — captures + liens réels (GARDÉ : ne s'applique que si vide)
-- ---------------------------------------------------------------------------
UPDATE products SET screenshots_json = '[
  {"key":"/assets/images/products/qrfad-mobile-01.jpg","type":"mobile","alt":"Tableau de bord — ventes du jour et commandes actives"},
  {"key":"/assets/images/products/qrfad-mobile-02.jpg","type":"mobile","alt":"Commandes — sur place, à emporter, livraison"},
  {"key":"/assets/images/products/qrfad-mobile-03.jpg","type":"mobile","alt":"Menu Digital — 88 plats par catégories, photos et prix à jour"},
  {"key":"/assets/images/products/qrfad-mobile-04.jpg","type":"mobile","alt":"Caisse POS — encaissement rapide, remises et taxes"},
  {"key":"/assets/images/products/qrfad-mobile-05.jpg","type":"mobile","alt":"Menu client par QR code — sans application à installer"},
  {"key":"/assets/images/products/qrfad-mobile-06.jpg","type":"mobile","alt":"Menu client — plats et prix synchronisés en temps réel"},
  {"key":"/assets/images/products/qrfad-mobile-07.jpg","type":"mobile","alt":"Portail public qrfad.com — votre menu accessible en un scan"},
  {"key":"/assets/images/products/qrfad-mobile-08.jpg","type":"mobile","alt":"Connexion au Dashboard restaurateur"},
  {"key":"/assets/images/products/qrfad-desktop-01.jpg","type":"desktop","alt":"Dashboard — vue d''ensemble : activité, commandes et QR menu"},
  {"key":"/assets/images/products/qrfad-desktop-02.jpg","type":"desktop","alt":"Gestion des commandes — confirmation et filtres par type"},
  {"key":"/assets/images/products/qrfad-desktop-03.jpg","type":"desktop","alt":"Menu Digital — plats, catégories et photos"},
  {"key":"/assets/images/products/qrfad-desktop-04.jpg","type":"desktop","alt":"Tables & QR — générez les QR codes de vos tables"},
  {"key":"/assets/images/products/qrfad-desktop-05.jpg","type":"desktop","alt":"Caisse POS — paiements, remises, taxes et dépenses"},
  {"key":"/assets/images/products/qrfad-desktop-06.jpg","type":"desktop","alt":"Menu public — l''expérience client sur grand écran"},
  {"key":"/assets/images/products/qrfad-desktop-07.jpg","type":"desktop","alt":"Portail public — établissements partenaires et menus"},
  {"key":"/assets/images/products/qrfad-desktop-08.jpg","type":"desktop","alt":"Connexion au Dashboard QRFAD"}
]' WHERE slug = 'qrfad'
  AND (screenshots_json IS NULL OR TRIM(screenshots_json) IN ('', '[]'));

UPDATE products SET downloads_json = '[
  {"platform":"web","url":"https://qrfad.com","label":"Portail public QRFAD"},
  {"platform":"web","url":"https://qrfad.com/login","label":"Dashboard restaurateur"}
]' WHERE slug = 'qrfad'
  AND (downloads_json IS NULL OR TRIM(downloads_json) IN ('', '[]'));

-- ---------------------------------------------------------------------------
-- 4) TILE — captures + liens réels vérifiés (GARDÉ : ne s'applique que si vide)
--    Google Play (com.tere.fad), App Store (id6819139237) et PWA
--    app.tileofficiel.com — liens officiels issus de tileofficiel.com,
--    tous vérifiés HTTP 200 le 2026-11-09.
-- ---------------------------------------------------------------------------
UPDATE products SET screenshots_json = '[
  {"key":"/assets/images/products/tile-mobile-01.jpg","type":"mobile","alt":"Accueil TILE — créez, partagez, connectez-vous"},
  {"key":"/assets/images/products/tile-mobile-02.jpg","type":"mobile","alt":"Flux Certifié — l''information vérifiée des médias"},
  {"key":"/assets/images/products/tile-mobile-03.jpg","type":"mobile","alt":"Flux Certifié, onglet Urgent — annonces officielles"},
  {"key":"/assets/images/products/tile-mobile-04.jpg","type":"mobile","alt":"Lecteur vidéo immersif — créateurs et vidéos verticales"},
  {"key":"/assets/images/products/tile-desktop-01.jpg","type":"desktop","alt":"tileofficiel.com — le site officiel de TILE"},
  {"key":"/assets/images/products/tile-desktop-02.jpg","type":"desktop","alt":"Six univers dans une seule application"},
  {"key":"/assets/images/products/tile-desktop-03.jpg","type":"desktop","alt":"Les trois flux — Réseau, Certifié, Pour toi"}
]' WHERE slug = 'tile'
  AND (screenshots_json IS NULL OR TRIM(screenshots_json) IN ('', '[]'));

UPDATE products SET downloads_json = '[
  {"platform":"ios","url":"https://apps.apple.com/app/tile/id6819139237","label":"App Store"},
  {"platform":"android","url":"https://play.google.com/store/apps/details?id=com.tere.fad","label":"Google Play"},
  {"platform":"web","url":"https://app.tileofficiel.com","label":"Web App (PWA)"}
]' WHERE slug = 'tile'
  AND (downloads_json IS NULL OR TRIM(downloads_json) IN ('', '[]'));
