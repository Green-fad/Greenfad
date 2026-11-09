-- ===========================================================================
-- 0010 : Captures d'écran réelles — CLOUDAf (cloudaf.net) — Mission captures produits
-- ---------------------------------------------------------------------------
-- RÈGLE STRICTE NON-DESTRUCTIVE (identique à 0008 et 0009) :
--   1. Images statiques livrées avec le bundle Pages — aucun objet R2 modifié.
--   2. INSERT OR IGNORE INTO media : n'ajoute que les clés absentes.
--   3. UPDATE screenshots_json / downloads_json GARDÉS : appliqués uniquement
--      si la valeur actuelle est vide ('[]', '' ou NULL) — tout contenu saisi
--      via le Dashboard admin est préservé.
--   4. content_version inchangé (16) : content-update.sql ne se ré-exécute pas.
-- Source des captures (2026-11-10) :
--   CLOUDAf — démo réelle https://cloudaf.net (landing publique, connexion et
--   dashboard Super Admin avec l'accès de démonstration fourni par le
--   fondateur) : landing et double éditeur, dashboard (Projets, Store, Agents,
--   Déploiements, Surveillance), éditeur de code, Agent, Studio CMS, Studio.
-- Lien réel vérifié HTTP 200 le 2026-11-10 : https://cloudaf.net.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1) Médiathèque : 26 captures (additif, idempotent)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES
  ('/assets/images/products/cloudaf-desktop-01.jpg', 'cloudaf-desktop-01.jpg', 'image/jpeg', 77170, 1280, 800, 'CloudAf — landing « Créez. Déployez. Scalez. »', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-02.jpg', 'cloudaf-desktop-02.jpg', 'image/jpeg', 74025, 1280, 800, 'CloudAf — « Codez ou non, à vous de choisir » : éditeur No-Code et logos des technologies', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-03.jpg', 'cloudaf-desktop-03.jpg', 'image/jpeg', 53623, 1280, 800, 'CloudAf — « Codez ou non » : onglet Éditeur de Code avec le source du projet', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-04.jpg', 'cloudaf-desktop-04.jpg', 'image/jpeg', 74242, 1280, 800, 'CloudAf — une plateforme complète : Studio Builder, CloudAf Agent, Sécurité native', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-05.jpg', 'cloudaf-desktop-05.jpg', 'image/jpeg', 48058, 1280, 800, 'CloudAf — parcours Inspirez, Créez, Déployez, Scalez et comparaison avec les solutions traditionnelles', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-06.jpg', 'cloudaf-desktop-06.jpg', 'image/jpeg', 51651, 1280, 800, 'CloudAf — tarifs : offres Free, Pro (29 €/mois) et Enterprise (99 €/mois)', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-07.jpg', 'cloudaf-desktop-07.jpg', 'image/jpeg', 31410, 1280, 800, 'CloudAf — connexion sécurisée à la plateforme', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-08.jpg', 'cloudaf-desktop-08.jpg', 'image/jpeg', 72377, 1280, 800, 'CloudAf — accueil du dashboard Super Admin : « Vos applications, notre infrastructure »', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-09.jpg', 'cloudaf-desktop-09.jpg', 'image/jpeg', 39981, 1280, 800, 'CloudAf — page Projets : espace de travail regroupant code, données et déploiements', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-10.jpg', 'cloudaf-desktop-10.jpg', 'image/jpeg', 57834, 1280, 800, 'CloudAf — vue d''ensemble d''un projet avec aperçu live de l''application', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-11.jpg', 'cloudaf-desktop-11.jpg', 'image/jpeg', 73224, 1280, 800, 'CloudAf — éditeur de code intégré (type VS Code) avec explorateur et terminal', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-12.jpg', 'cloudaf-desktop-12.jpg', 'image/jpeg', 102457, 1280, 800, 'CloudAf — l''Agent CloudAf assiste le développeur directement dans l''éditeur', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-13.jpg', 'cloudaf-desktop-13.jpg', 'image/jpeg', 72453, 1280, 800, 'CloudAf — Studio CMS : tableau de bord de gestion de contenu', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-14.jpg', 'cloudaf-desktop-14.jpg', 'image/jpeg', 55992, 1280, 800, 'CloudAf — Studio CMS : gestion des pages', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-15.jpg', 'cloudaf-desktop-15.jpg', 'image/jpeg', 102041, 1280, 800, 'CloudAf Store — templates prêts à l''emploi installables en un clic', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-16.jpg', 'cloudaf-desktop-16.jpg', 'image/jpeg', 57812, 1280, 800, 'CloudAf — page Agents : agents IA et tâches exécutées', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-17.jpg', 'cloudaf-desktop-17.jpg', 'image/jpeg', 44096, 1280, 800, 'CloudAf — historique des déploiements d''un projet', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-desktop-18.jpg', 'cloudaf-desktop-18.jpg', 'image/jpeg', 46875, 1280, 800, 'CloudAf — surveillance : santé, métriques et alertes en temps réel', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-mobile-01.jpg', 'cloudaf-mobile-01.jpg', 'image/jpeg', 36429, 390, 844, 'CloudAf — landing sur mobile : Créez. Déployez. Scalez.', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-mobile-02.jpg', 'cloudaf-mobile-02.jpg', 'image/jpeg', 37252, 390, 844, 'CloudAf sur mobile — Studio Builder, Agent et Sécurité native', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-mobile-03.jpg', 'cloudaf-mobile-03.jpg', 'image/jpeg', 31213, 390, 844, 'CloudAf sur mobile — comparaison avec les solutions traditionnelles', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-mobile-04.jpg', 'cloudaf-mobile-04.jpg', 'image/jpeg', 36465, 390, 844, 'CloudAf sur mobile — questions fréquentes', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-mobile-05.jpg', 'cloudaf-mobile-05.jpg', 'image/jpeg', 26154, 390, 844, 'CloudAf — connexion mobile sécurisée', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-mobile-06.jpg', 'cloudaf-mobile-06.jpg', 'image/jpeg', 41160, 390, 844, 'CloudAf sur mobile — accueil du dashboard', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-mobile-07.jpg', 'cloudaf-mobile-07.jpg', 'image/jpeg', 25501, 390, 844, 'CloudAf sur mobile — page Projets', '/', 'seed', datetime('now')),
  ('/assets/images/products/cloudaf-mobile-08.jpg', 'cloudaf-mobile-08.jpg', 'image/jpeg', 36161, 390, 844, 'CloudAf Store sur mobile — templates et applications', '/', 'seed', datetime('now'));

-- ---------------------------------------------------------------------------
-- 2) CLOUDAf — captures + lien réel (GARDÉ : ne s'applique que si vide)
-- ---------------------------------------------------------------------------
UPDATE products SET screenshots_json = '[
  {"key":"/assets/images/products/cloudaf-desktop-01.jpg","type":"desktop","alt":"CloudAf — landing « Créez. Déployez. Scalez. »"},
  {"key":"/assets/images/products/cloudaf-desktop-02.jpg","type":"desktop","alt":"CloudAf — « Codez ou non, à vous de choisir » : éditeur No-Code et logos des technologies"},
  {"key":"/assets/images/products/cloudaf-desktop-03.jpg","type":"desktop","alt":"CloudAf — « Codez ou non » : onglet Éditeur de Code avec le source du projet"},
  {"key":"/assets/images/products/cloudaf-desktop-04.jpg","type":"desktop","alt":"CloudAf — une plateforme complète : Studio Builder, CloudAf Agent, Sécurité native"},
  {"key":"/assets/images/products/cloudaf-desktop-05.jpg","type":"desktop","alt":"CloudAf — parcours Inspirez, Créez, Déployez, Scalez et comparaison avec les solutions traditionnelles"},
  {"key":"/assets/images/products/cloudaf-desktop-06.jpg","type":"desktop","alt":"CloudAf — tarifs : offres Free, Pro (29 €/mois) et Enterprise (99 €/mois)"},
  {"key":"/assets/images/products/cloudaf-desktop-07.jpg","type":"desktop","alt":"CloudAf — connexion sécurisée à la plateforme"},
  {"key":"/assets/images/products/cloudaf-desktop-08.jpg","type":"desktop","alt":"CloudAf — accueil du dashboard Super Admin : « Vos applications, notre infrastructure »"},
  {"key":"/assets/images/products/cloudaf-desktop-09.jpg","type":"desktop","alt":"CloudAf — page Projets : espace de travail regroupant code, données et déploiements"},
  {"key":"/assets/images/products/cloudaf-desktop-10.jpg","type":"desktop","alt":"CloudAf — vue d''ensemble d''un projet avec aperçu live de l''application"},
  {"key":"/assets/images/products/cloudaf-desktop-11.jpg","type":"desktop","alt":"CloudAf — éditeur de code intégré (type VS Code) avec explorateur et terminal"},
  {"key":"/assets/images/products/cloudaf-desktop-12.jpg","type":"desktop","alt":"CloudAf — l''Agent CloudAf assiste le développeur directement dans l''éditeur"},
  {"key":"/assets/images/products/cloudaf-desktop-13.jpg","type":"desktop","alt":"CloudAf — Studio CMS : tableau de bord de gestion de contenu"},
  {"key":"/assets/images/products/cloudaf-desktop-14.jpg","type":"desktop","alt":"CloudAf — Studio CMS : gestion des pages"},
  {"key":"/assets/images/products/cloudaf-desktop-15.jpg","type":"desktop","alt":"CloudAf Store — templates prêts à l''emploi installables en un clic"},
  {"key":"/assets/images/products/cloudaf-desktop-16.jpg","type":"desktop","alt":"CloudAf — page Agents : agents IA et tâches exécutées"},
  {"key":"/assets/images/products/cloudaf-desktop-17.jpg","type":"desktop","alt":"CloudAf — historique des déploiements d''un projet"},
  {"key":"/assets/images/products/cloudaf-desktop-18.jpg","type":"desktop","alt":"CloudAf — surveillance : santé, métriques et alertes en temps réel"},
  {"key":"/assets/images/products/cloudaf-mobile-01.jpg","type":"mobile","alt":"CloudAf — landing sur mobile : Créez. Déployez. Scalez."},
  {"key":"/assets/images/products/cloudaf-mobile-02.jpg","type":"mobile","alt":"CloudAf sur mobile — Studio Builder, Agent et Sécurité native"},
  {"key":"/assets/images/products/cloudaf-mobile-03.jpg","type":"mobile","alt":"CloudAf sur mobile — comparaison avec les solutions traditionnelles"},
  {"key":"/assets/images/products/cloudaf-mobile-04.jpg","type":"mobile","alt":"CloudAf sur mobile — questions fréquentes"},
  {"key":"/assets/images/products/cloudaf-mobile-05.jpg","type":"mobile","alt":"CloudAf — connexion mobile sécurisée"},
  {"key":"/assets/images/products/cloudaf-mobile-06.jpg","type":"mobile","alt":"CloudAf sur mobile — accueil du dashboard"},
  {"key":"/assets/images/products/cloudaf-mobile-07.jpg","type":"mobile","alt":"CloudAf sur mobile — page Projets"},
  {"key":"/assets/images/products/cloudaf-mobile-08.jpg","type":"mobile","alt":"CloudAf Store sur mobile — templates et applications"}
]' WHERE slug = 'cloudaf'
  AND (screenshots_json IS NULL OR TRIM(screenshots_json) IN ('', '[]'));

UPDATE products SET downloads_json = '[
  {"platform":"web","url":"https://cloudaf.net","label":"Plateforme CloudAf"}
]' WHERE slug = 'cloudaf'
  AND (downloads_json IS NULL OR TRIM(downloads_json) IN ('', '[]'));
