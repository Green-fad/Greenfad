-- ===========================================================================
-- 0026 : RESTAURATION — captures produits & images projets écrasées par le
--        rejeu destructif de seed/content-update.sql lors des 4 déploiements
--        du 10/11/2026 (17h58 e0aa4e5, 18h25 3ab204f, 19h06 6b5fe0c, 23h14
--        6cda321 — preuves : logs CI « Contenu v16/v17 appliqué », 536 requêtes
--        à 23h14, 1670 lignes écrites).
-- ---------------------------------------------------------------------------
-- Dégâts documentés (diagnostic lecture seule du 11/11/2026) :
--   • products.screenshots_json / downloads_json vidés à '[]' pour
--     qrfad, fad-card, tile, cloudaf, paygfad — les valeurs réelles venaient
--     des migrations 0008/0009/0010, déjà marquées « appliquées » dans
--     d1_migrations et donc JAMAIS rejouées automatiquement.
--   • projects.image_key / og_image vides pour tile & cloudaf
--     (édition admin du 08/11 19h49, jamais rétablie).
--   • projects.og_image (qrfad) pointant vers un objet R2 supprimé
--     (media/2026-11/XE329SDFZ…-b1b5b45d….png — HTTP 404 prouvé le 11/11).
-- ---------------------------------------------------------------------------
-- RÈGLE STRICTE NON-DESTRUCTIVE (identique à 0008-0010) :
--   1. AUCUN DELETE, aucun TRUNCATE.
--   2. Chaque UPDATE ne s'applique QUE si la valeur actuelle est vide ou
--      '[]' (ou la référence morte exacte pour l'og du projet QRFAD).
--      Tout contenu saisi via le Dashboard admin est donc préservé.
--   3. Les valeurs réinjectées sont celles du dépôt GitHub (source de
--      vérité) : migrations 0008/0009/0010 + images portfolio canoniques.
-- ===========================================================================

-- 1) Captures réelles produits — valeurs canoniques du dépôt (0008/0009/0010)
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
]'
  WHERE slug = 'qrfad'
    AND (screenshots_json IS NULL OR TRIM(screenshots_json) IN ('', '[]'));
UPDATE products SET downloads_json = '[
  {"platform":"web","url":"https://qrfad.com","label":"Portail public QRFAD"},
  {"platform":"web","url":"https://qrfad.com/login","label":"Dashboard restaurateur"}
]'
  WHERE slug = 'qrfad'
    AND (downloads_json IS NULL OR TRIM(downloads_json) IN ('', '[]'));
UPDATE products SET screenshots_json = '[
  {"key":"/assets/images/products/fadcard-desktop-01.jpg","type":"desktop","alt":"FadCard — une plateforme, six applications métier, un seul compte"},  {"key":"/assets/images/products/fadcard-desktop-02.jpg","type":"desktop","alt":"FadCard — les six applications : vCard, Market, Tickets, Fund, Vote, Pay"},  {"key":"/assets/images/products/fadcard-desktop-03.jpg","type":"desktop","alt":"FadCard — l''interface d''une vCard avec QR code dédié"},  {"key":"/assets/images/products/fadcard-desktop-04.jpg","type":"desktop","alt":"FadCard — Mon Espace : plan Business, vues et vCards"},  {"key":"/assets/images/products/fadcard-desktop-05.jpg","type":"desktop","alt":"FadCard — Mes vCards : création guidée, 100 designs premium"},  {"key":"/assets/images/products/fadcard-desktop-06.jpg","type":"desktop","alt":"FadCard Market — produits, stocks, commandes et ventes"},  {"key":"/assets/images/products/fadcard-desktop-07.jpg","type":"desktop","alt":"FadCard Pay — encaissement centralisé et suivi des fonds"},  {"key":"/assets/images/products/fadcard-desktop-08.jpg","type":"desktop","alt":"FadCard Billetterie — tickets d''événements et quotas par catégorie"},  {"key":"/assets/images/products/fadcard-desktop-09.jpg","type":"desktop","alt":"FadCard Fund — campagnes de collecte avec objectif et progression"},  {"key":"/assets/images/products/fadcard-desktop-10.jpg","type":"desktop","alt":"FadCard — les six dashboards en vérité"},  {"key":"/assets/images/products/fadcard-desktop-11.jpg","type":"desktop","alt":"FadCard — connexion à l''espace de gestion"},  {"key":"/assets/images/products/fadcard-mobile-01.jpg","type":"mobile","alt":"FadCard — Mon Espace sur mobile : plan Business et statistiques"},  {"key":"/assets/images/products/fadcard-mobile-02.jpg","type":"mobile","alt":"FadCard — Mes vCards sur mobile"},  {"key":"/assets/images/products/fadcard-mobile-03.jpg","type":"mobile","alt":"FadCard Market sur mobile — boutiques, produits et commandes"},  {"key":"/assets/images/products/fadcard-mobile-04.jpg","type":"mobile","alt":"FadCard — connexion mobile sécurisée"}
]'
  WHERE slug = 'fad-card'
    AND (screenshots_json IS NULL OR TRIM(screenshots_json) IN ('', '[]'));
UPDATE products SET downloads_json = '[
  {"platform":"web","url":"https://fadcard.greenfad.tech","label":"Plateforme FadCard"}
]'
  WHERE slug = 'fad-card'
    AND (downloads_json IS NULL OR TRIM(downloads_json) IN ('', '[]'));
UPDATE products SET screenshots_json = '[
  {"key":"/assets/images/products/tile-mobile-01.jpg","type":"mobile","alt":"Accueil TILE — créez, partagez, connectez-vous"},
  {"key":"/assets/images/products/tile-mobile-02.jpg","type":"mobile","alt":"Flux Certifié — l''information vérifiée des médias"},
  {"key":"/assets/images/products/tile-mobile-03.jpg","type":"mobile","alt":"Flux Certifié, onglet Urgent — annonces officielles"},
  {"key":"/assets/images/products/tile-mobile-04.jpg","type":"mobile","alt":"Lecteur vidéo immersif — créateurs et vidéos verticales"},
  {"key":"/assets/images/products/tile-desktop-01.jpg","type":"desktop","alt":"tileofficiel.com — le site officiel de TILE"},
  {"key":"/assets/images/products/tile-desktop-02.jpg","type":"desktop","alt":"Six univers dans une seule application"},
  {"key":"/assets/images/products/tile-desktop-03.jpg","type":"desktop","alt":"Les trois flux — Réseau, Certifié, Pour toi"}
]'
  WHERE slug = 'tile'
    AND (screenshots_json IS NULL OR TRIM(screenshots_json) IN ('', '[]'));
UPDATE products SET downloads_json = '[
  {"platform":"ios","url":"https://apps.apple.com/app/tile/id6819139237","label":"App Store"},
  {"platform":"android","url":"https://play.google.com/store/apps/details?id=com.tere.fad","label":"Google Play"},
  {"platform":"web","url":"https://app.tileofficiel.com","label":"Web App (PWA)"}
]'
  WHERE slug = 'tile'
    AND (downloads_json IS NULL OR TRIM(downloads_json) IN ('', '[]'));
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
]'
  WHERE slug = 'cloudaf'
    AND (screenshots_json IS NULL OR TRIM(screenshots_json) IN ('', '[]'));
UPDATE products SET downloads_json = '[
  {"platform":"web","url":"https://cloudaf.net","label":"Plateforme CloudAf"}
]'
  WHERE slug = 'cloudaf'
    AND (downloads_json IS NULL OR TRIM(downloads_json) IN ('', '[]'));
UPDATE products SET screenshots_json = '[
  {"key":"/assets/images/products/paygfad-desktop-01.jpg","type":"desktop","alt":"PayGfad Scool — dashboard admin École Primaire Kaloum"},  {"key":"/assets/images/products/paygfad-desktop-02.jpg","type":"desktop","alt":"PayGfad Scool — dossier des élèves : fiches, matricules, statuts"},  {"key":"/assets/images/products/paygfad-desktop-03.jpg","type":"desktop","alt":"PayGfad Scool — paiements scolaires : encaissements, attentes, relances"},  {"key":"/assets/images/products/paygfad-desktop-04.jpg","type":"desktop","alt":"PayGfad Scool — saisie des notes par classe, matière et semestre"},  {"key":"/assets/images/products/paygfad-desktop-05.jpg","type":"desktop","alt":"PayGfad Scool — emplois du temps des classes et enseignants"},  {"key":"/assets/images/products/paygfad-desktop-06.jpg","type":"desktop","alt":"PayGfad Scool — suite documents officiels : bulletins et certificats"},  {"key":"/assets/images/products/paygfad-desktop-07.jpg","type":"desktop","alt":"PayGfad Scool — connexion sécurisée, multilingue FR/EN/Bamanankan"},  {"key":"/assets/images/products/paygfad-mobile-01.jpg","type":"mobile","alt":"PayGfad Scool sur mobile — dashboard admin de l''école"},  {"key":"/assets/images/products/paygfad-mobile-02.jpg","type":"mobile","alt":"PayGfad Scool — dossiers étudiants sur mobile"},  {"key":"/assets/images/products/paygfad-mobile-03.jpg","type":"mobile","alt":"PayGfad Scool — paiements scolaires sur mobile"},  {"key":"/assets/images/products/paygfad-mobile-04.jpg","type":"mobile","alt":"PayGfad Scool — notes sur mobile"},  {"key":"/assets/images/products/paygfad-mobile-05.jpg","type":"mobile","alt":"PayGfad Scool — connexion mobile"}
]'
  WHERE slug = 'paygfad'
    AND (screenshots_json IS NULL OR TRIM(screenshots_json) IN ('', '[]'));
UPDATE products SET downloads_json = '[
  {"platform":"web","url":"https://scool.paygfad.com","label":"PayGfad Scool — gestion scolaire"},
  {"platform":"web","url":"https://paygfad.com","label":"PayGfad — Solutions Digitales"}
]'
  WHERE slug = 'paygfad'
    AND (downloads_json IS NULL OR TRIM(downloads_json) IN ('', '[]'));

-- 2) Fiches /realisations — images canoniques du dépôt (portfolio) là où vides
UPDATE projects SET image_key = '/assets/images/portfolio/tile.jpg'
  WHERE slug = 'tile-reseau-social-africain' AND (image_key IS NULL OR image_key = '');
UPDATE projects SET og_image = '/assets/images/portfolio/tile.jpg'
  WHERE slug = 'tile-reseau-social-africain' AND (og_image IS NULL OR og_image = '');
UPDATE projects SET image_key = '/assets/images/portfolio/cloudaf.jpg'
  WHERE slug = 'cloudaf-plateforme-nocode-ia' AND (image_key IS NULL OR image_key = '');
UPDATE projects SET og_image = '/assets/images/portfolio/cloudaf.jpg'
  WHERE slug = 'cloudaf-plateforme-nocode-ia' AND (og_image IS NULL OR og_image = '');

-- 3) Fiche /realisations QRFAD — og_image référençait un objet R2 supprimé
--    (HTTP 404 prouvé le 11/11/2026) ; rétablie sur l'image canonique du dépôt.
--    Garde : ne s'applique QUE si la valeur est exactement la référence morte.
UPDATE projects SET og_image = '/assets/images/portfolio/qrfad.jpg'
  WHERE slug = 'qrfad-digitalisation-restauration'
    AND og_image = 'media/2026-11/XE329SDFZEPVYFT1QTHCKAYT9Z-b1b5b45d-93cb-407b-80d6-a1979059b6bd.png';
