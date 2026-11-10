-- ===========================================================================
-- 0015 : WARIPAY — nouveau produit en phase de test (demande explicite du
--        fondateur, 10/11/2026) — « Ajoute ce projet… il sera prêt pour la
--        production une fois les conformités et les partenariats financiers
--        terminés »
-- ---------------------------------------------------------------------------
-- RÈGLE STRICTE NON-DESTRUCTIVE (identique à 0008-0010) :
--   1. Images statiques livrées avec le bundle Pages — aucun objet R2 modifié.
--   2. INSERT OR IGNORE : n'ajoute que ce qui est absent. Aucune autre ligne
--      produits/médias n'est touchée — les saisies du Dashboard admin sont
--      préservées.
--   3. UPDATE screenshots_json GARDÉ : appliqué uniquement si la valeur
--      actuelle est vide ('[]', '' ou NULL).
--   4. content_version inchangé (16) : content-update.sql ne se ré-exécute pas.
-- Source des contenus (10/11/2026) :
--   WARIPAY en phase de test — landing publique et console de démonstration
--   (accès fourni par le fondateur) : une seule intégration pour Orange Money,
--   Moov Money, Wave, MTN MoMo, Visa, Mastercard, ORA Bank / Virement UEMOA ;
--   collecte, retraits, réconciliation, settlement ; checkout hébergé, liens
--   de paiement, payouts batch, webhooks signés, ledger en double partie ;
--   application Android v1.0.3 et connecteur WooCommerce v1.0.0 ; Mali
--   disponible, 7 pays suivront. AUCUNE donnée inventée.
-- État produit : state 'bientot' (nouveau) = « Bientôt disponible » — en phase
--   de test, production après conformités et partenariats financiers.
-- Confidentialité (directive permanente) : AUCUN lien technique publié —
--   l'URL d'essai n'est PAS exposée (revealant l'hébergeur) et waripay.app
--   n'est pas encore en ligne ; links_json et external_url restent vides.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1) Produit WARIPAY (additif, idempotent)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO products (slug, name, tagline, description_md, problem_md, vision_md, origin_md, sector, audience, features, modules_md, use_cases_md, ux_md, benefits_md, differentiators_md, category, state, image_key, icon, sort_order, status, published_at, meta_title, meta_description, og_image, links_json, versions_json, external_url, related_service_id) VALUES (
  'waripay', 'WARIPAY', 'Une API. Tous les paiements d''Afrique de l''Ouest.',
  'WARIPAY est une infrastructure de paiement pour l''Afrique de l''Ouest : une seule intégration connecte votre entreprise, votre marketplace ou votre plateforme à **Orange Money**, **Moov Money**, **Wave**, **MTN MoMo**, **Visa**, **Mastercard** et aux **banques UEMOA** — collecte, retraits, réconciliation et settlement unifiés.

Le marchand pilote tout depuis une console unique : KPI en temps réel (volume, taux de succès, soldes, frais), répartition par provider, liens de paiement avec QR, checkout hébergé mobile-first, retraits vers un compte bancaire UEMOA ou vers le mobile money — avec frais, plafonds et délais affichés avant chaque confirmation. Chaque mouvement financier transite par un registre en double partie, réconciliable à tout instant.

Le lancement commercial démarre au Mali ; le Sénégal, la Côte d''Ivoire, le Burkina Faso, le Bénin, le Togo, la Guinée-Bissau et le Niger suivent. WARIPAY est actuellement **en phase de test** : la mise en production suivra la finalisation des conformités et des partenariats financiers.',
  'Encaisser en Afrique de l''Ouest suppose d''agréger à la main chaque opérateur : une intégration par provider, des réconciliations sur tableur, des retraits multi-canaux, des frais opaques et des semaines de travail avant le premier paiement encaissé.',
  'Un pipeline unique de bout en bout — une API, plusieurs providers, plusieurs moyens de paiement, un dashboard, une réconciliation, un settlement.',
  'Développée par Green FAD à Bamako, WARIPAY est entrée en phase de test publique : API en mode sandbox, checkout hébergé, application Android v1.0.3 et connecteur WooCommerce v1.0.0 opérationnels. La mise en production suivra la finalisation des conformités et des partenariats financiers.',
  'Fintech — infrastructure de paiement', 'Entreprises & grands comptes, marchands & e-commerce, développeurs & plateformes',
  '["Une seule intégration : Orange Money, Moov Money, Wave, MTN MoMo, Visa, Mastercard, banques UEMOA", "Encaissement par push marchand, USSD, carte bancaire ou virement", "Checkout hébergé mobile-first et liens de paiement partageables avec QR", "Retraits au choix : virement bancaire UEMOA (T+1 ouvré) ou mobile money (instantané), frais et plafonds affichés avant confirmation", "Payouts individuels et massifs (CSV, batch) vers banque ou wallet", "Remboursements totaux ou partiels selon le provider", "Moteur de routage : les providers dégradés sont écartés automatiquement", "Ledger en double partie : chaque mouvement rapproché du provider, réconciliation sans export manuel", "API REST/JSON prévisible : erreurs typées, idempotence, timeline par transaction, webhooks signés avec retries", "Clés sandbox immédiates, clés d''API hachées et révocables à chaud, MFA administrateur", "Console marchande : KPI temps réel, répartition par provider, rapports, rôles et journal d''audit", "Application Android v1.0.3 (notifications natives, QR et deep links) et connecteur WooCommerce v1.0.0"]',
  '**Une console, quatre espaces :**

- **Pilotage** — vue d''ensemble, transactions, paiements
- **Opérations** — retraits, remboursements, clients, solde & settlement, rapports
- **Encaisser** — liens de paiement, checkout hébergé ou embarquable
- **Développeurs** — API & docs, clés API, webhooks, sandbox', '- Une entreprise centralise l''encaissement de ses filiales et pilote sa trésorerie depuis un registre unique, avec payouts massifs et piste d''audit complète
- Un commerce crée un lien de paiement en un clic, encaisse par mobile money ou carte et retire ses fonds vers sa banque ou son wallet quand il le souhaite
- Une plateforme logicielle intègre l''API en quelques heures : clés sandbox immédiates, webhooks signés, composant de checkout embarquable',
  'Console web responsive et application Android (7.0+) avec les mêmes comptes et les mêmes données. Environnements Sandbox et Live séparés ; chaque opération financière est idempotente et horodatée.',
  'Une intégration au lieu de plusieurs, des frais affichés avant chaque validation (aucun coût caché), une réconciliation automatique, des fonds retirables au canal de son choix, et un support opérationnel basé dans la région.',
  'Conçue au Mali pour l''espace UEMOA : 9+ providers derrière une seule abstraction, couverture pays annoncée (Mali d''abord, puis Sénégal, Côte d''Ivoire, Burkina Faso, Bénin, Togo, Guinée-Bissau, Niger), tarification transparente (Starter 2,5 %, Croissance 1,8 %, Entreprise 2,8 %) et vérification KYB des marchands.',
  'Infrastructure de paiement', 'bientot', '/assets/images/products/waripay-banniere.jpg', 'wallet', 10, 'publie', datetime('now'),
  'WARIPAY — Une API. Tous les paiements d''Afrique de l''Ouest | Green FAD', 'Waripay connecte entreprises, marchands et plateformes à Orange Money, Moov Money, Wave, MTN MoMo, Visa, Mastercard et banques UEMOA avec une seule intégration : collecte, retraits, réconciliation, settlement. En phase de test — bientôt disponible.', '/assets/images/products/waripay-banniere.jpg',
  '[]', '[{"version": "v1.0", "date": "Novembre 2026", "note": "Phase de test publique : API en mode sandbox, checkout hébergé, liens de paiement, application Android 1.0.3 et connecteur WooCommerce 1.0.0. La mise en production suivra la finalisation des conformités et des partenariats financiers."}]', '',
  (SELECT id FROM services WHERE slug = 'developpement-web'));

-- ---------------------------------------------------------------------------
-- 2) Médiathèque : 17 captures réelles (additif, idempotent)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO media (r2_key, filename, mime, size, width, height, alt, folder, uploaded_by, created_at) VALUES
  ('/assets/images/products/waripay-banniere.jpg', 'waripay-banniere.jpg', 'image/jpeg', 137644, 1600, 1000, 'WARIPAY — infrastructure de paiement pour l''Afrique de l''Ouest (bannière)', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-01.jpg', 'waripay-desktop-01.jpg', 'image/jpeg', 116083, 1280, 800, 'WARIPAY — accueil « Une API. Tous les paiements d''Afrique de l''Ouest. » avec terminal de premier paiement', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-02.jpg', 'waripay-desktop-02.jpg', 'image/jpeg', 109755, 1280, 800, 'WARIPAY — aperçu de l''interface marchande : volume, taux de succès, solde et répartition par provider (données de démonstration)', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-03.jpg', 'waripay-desktop-03.jpg', 'image/jpeg', 103689, 1280, 800, 'WARIPAY — trois profils servis : entreprises & grands comptes, marchands & e-commerce, développeurs & plateformes', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-04.jpg', 'waripay-desktop-04.jpg', 'image/jpeg', 100432, 1280, 800, 'WARIPAY — la vision : une API, plusieurs providers, plusieurs moyens de paiement, un dashboard, une réconciliation, un settlement', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-05.jpg', 'waripay-desktop-05.jpg', 'image/jpeg', 95289, 1280, 800, 'WARIPAY — moyens de paiement intégrés : Orange Money, Moov Money, Wave, MTN MoMo, Visa, Mastercard, ORA Bank et Virement UEMOA', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-06.jpg', 'waripay-desktop-06.jpg', 'image/jpeg', 75401, 1280, 800, 'WARIPAY — retraits : virement bancaire UEMOA ou mobile money, au choix du marchand, frais et délais affichés', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-07.jpg', 'waripay-desktop-07.jpg', 'image/jpeg', 87869, 1280, 800, 'WARIPAY — une API REST prévisible : idempotence, webhooks signés, composant wari.js, clés protégées', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-08.jpg', 'waripay-desktop-08.jpg', 'image/jpeg', 80696, 1280, 800, 'WARIPAY — fondations de confiance : clés protégées, comptabilité par construction, conformité et contrôles, support opérationnel', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-09.jpg', 'waripay-desktop-09.jpg', 'image/jpeg', 71664, 1280, 800, 'WARIPAY — tarification transparente : offres Starter 2,5 %, Croissance 1,8 % et Entreprise 2,8 %', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-10.jpg', 'waripay-desktop-10.jpg', 'image/jpeg', 70098, 1280, 800, 'WARIPAY — application Android v1.0.3 : dashboard marchand, notifications natives, QR et deep links', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-11.jpg', 'waripay-desktop-11.jpg', 'image/jpeg', 39149, 1280, 800, 'WARIPAY — console marchande, vue d''ensemble (environnement Sandbox de test)', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-desktop-12.jpg', 'waripay-desktop-12.jpg', 'image/jpeg', 92953, 1280, 800, 'WARIPAY — console marchande, Checkout : page hébergée ou composant embarquable', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-mobile-01.jpg', 'waripay-mobile-01.jpg', 'image/jpeg', 56732, 390, 844, 'WARIPAY sur mobile — accueil « Une API. Tous les paiements d''Afrique de l''Ouest. »', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-mobile-02.jpg', 'waripay-mobile-02.jpg', 'image/jpeg', 60373, 390, 844, 'WARIPAY sur mobile — moyens de paiement intégrés', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-mobile-03.jpg', 'waripay-mobile-03.jpg', 'image/jpeg', 38279, 390, 844, 'WARIPAY sur mobile — tarification transparente', '/', 'seed', datetime('now')),
  ('/assets/images/products/waripay-mobile-04.jpg', 'waripay-mobile-04.jpg', 'image/jpeg', 42942, 390, 844, 'WARIPAY sur mobile — application Android', '/', 'seed', datetime('now'));

-- ---------------------------------------------------------------------------
-- 3) Captures de la fiche produit (GARDÉ : ne s'applique que si vide)
-- ---------------------------------------------------------------------------
UPDATE products SET screenshots_json = '[
  {"key":"/assets/images/products/waripay-desktop-01.jpg","type":"desktop","alt":"WARIPAY — accueil « Une API. Tous les paiements d''Afrique de l''Ouest. » avec terminal de premier paiement"},
  {"key":"/assets/images/products/waripay-desktop-02.jpg","type":"desktop","alt":"WARIPAY — aperçu de l''interface marchande : volume, taux de succès, solde et répartition par provider (données de démonstration)"},
  {"key":"/assets/images/products/waripay-desktop-03.jpg","type":"desktop","alt":"WARIPAY — trois profils servis : entreprises & grands comptes, marchands & e-commerce, développeurs & plateformes"},
  {"key":"/assets/images/products/waripay-desktop-04.jpg","type":"desktop","alt":"WARIPAY — la vision : une API, plusieurs providers, plusieurs moyens de paiement, un dashboard, une réconciliation, un settlement"},
  {"key":"/assets/images/products/waripay-desktop-05.jpg","type":"desktop","alt":"WARIPAY — moyens de paiement intégrés : Orange Money, Moov Money, Wave, MTN MoMo, Visa, Mastercard, ORA Bank et Virement UEMOA"},
  {"key":"/assets/images/products/waripay-desktop-06.jpg","type":"desktop","alt":"WARIPAY — retraits : virement bancaire UEMOA ou mobile money, au choix du marchand"},
  {"key":"/assets/images/products/waripay-desktop-07.jpg","type":"desktop","alt":"WARIPAY — une API REST prévisible : idempotence, webhooks signés, composant wari.js, clés protégées"},
  {"key":"/assets/images/products/waripay-desktop-08.jpg","type":"desktop","alt":"WARIPAY — fondations de confiance : clés protégées, comptabilité par construction, conformité et contrôles, support opérationnel"},
  {"key":"/assets/images/products/waripay-desktop-09.jpg","type":"desktop","alt":"WARIPAY — tarification transparente : offres Starter 2,5 %, Croissance 1,8 % et Entreprise 2,8 %"},
  {"key":"/assets/images/products/waripay-desktop-10.jpg","type":"desktop","alt":"WARIPAY — application Android v1.0.3 : dashboard marchand, notifications natives, QR et deep links"},
  {"key":"/assets/images/products/waripay-desktop-11.jpg","type":"desktop","alt":"WARIPAY — console marchande, vue d''ensemble (environnement Sandbox de test)"},
  {"key":"/assets/images/products/waripay-desktop-12.jpg","type":"desktop","alt":"WARIPAY — console marchande, Checkout : page hébergée ou composant embarquable"},
  {"key":"/assets/images/products/waripay-mobile-01.jpg","type":"mobile","alt":"WARIPAY sur mobile — accueil"},
  {"key":"/assets/images/products/waripay-mobile-02.jpg","type":"mobile","alt":"WARIPAY sur mobile — moyens de paiement intégrés"},
  {"key":"/assets/images/products/waripay-mobile-03.jpg","type":"mobile","alt":"WARIPAY sur mobile — tarification transparente"},
  {"key":"/assets/images/products/waripay-mobile-04.jpg","type":"mobile","alt":"WARIPAY sur mobile — application Android"}
]'
WHERE slug = 'waripay' AND (screenshots_json IS NULL OR TRIM(screenshots_json) IN ('', '[]'));

-- ---------------------------------------------------------------------------
-- 4) Patrimoine : situation actuelle — phase de test (aucune date inventée)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO product_milestones (product_slug, slug, kind, title, description_md, occurred_on, date_precision, source_label, confidence, sort_order, status) VALUES (
  'waripay', 'waripay-hist-01', 'situation_actuelle',
  'Phase de test publique avant l''ouverture commerciale',
  'WARIPAY est accessible en environnement de test : clés sandbox immédiates après inscription, checkout hébergé et liens de paiement fonctionnels, application Android v1.0.3 (APK signé, Android 7.0+) et connecteur WooCommerce v1.0.0 disponibles. Le rail Mali est ouvert ; le Sénégal, la Côte d''Ivoire, le Burkina Faso, le Bénin, le Togo, la Guinée-Bissau et le Niger sont annoncés. La mise en production suivra la finalisation des conformités et des partenariats financiers, conformément à la feuille de route du fondateur.',
  '2026-11', 'mois',
  'Vérification directe du produit en phase de test (site + console de démonstration) — directive fondateur du 10/11/2026',
  'haute', 0, 'publie');

-- ---------------------------------------------------------------------------
-- 5) Album « Produits Green FAD » : bannière WARIPAY (additif, idempotent)
-- ---------------------------------------------------------------------------
INSERT INTO media_items (type, media_id, title, credit, album_id, sort_order, status, published_at, uploaded_by, created_at, updated_at)
SELECT 'image', m.id, 'WARIPAY — infrastructure de paiement', 'GREEN FAD',
  (SELECT id FROM media_albums WHERE slug = 'produits-green-fad'), 15, 'publie', datetime('now'), 'seed', datetime('now'), datetime('now')
FROM media m
WHERE m.r2_key = '/assets/images/products/waripay-banniere.jpg'
  AND NOT EXISTS (SELECT 1 FROM media_items mi JOIN media m2 ON m2.id = mi.media_id WHERE m2.r2_key = '/assets/images/products/waripay-banniere.jpg');

INSERT OR IGNORE INTO content_relations (content_type, content_id, media_item_id, sort_order)
SELECT 'product', (SELECT id FROM products WHERE slug = 'waripay'), mi.id, 0
FROM media_items mi JOIN media m ON m.id = mi.media_id
WHERE m.r2_key = '/assets/images/products/waripay-banniere.jpg';

-- ---------------------------------------------------------------------------
-- 6) Pied de page « Nos produits » : ajout de WARIPAY (additif, idempotent,
--    préserve toute édition admin existante — n'ajoute qu'un élément au tableau)
-- ---------------------------------------------------------------------------
UPDATE footer_sections SET
  content = json_insert(content, '$.items[' || json_array_length(content, '$.items') || ']',
    json_object('label', 'WARIPAY', 'url', '/produits/waripay')),
  updated_at = datetime('now')
WHERE section_key = 'produits' AND content NOT LIKE '%waripay%';

