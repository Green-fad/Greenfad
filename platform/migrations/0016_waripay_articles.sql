-- ===========================================================================
-- 0016 : WARIPAY — les 3 articles fondateurs du blog (demande explicite du
--        fondateur, 10/11/2026) :
--   1. L'idée : l'étude à l'origine de WARIPAY + création annoncée
--      (date éditoriale créative validée par le fondateur : 10/02/2026)
--   2. Les retours d'expérience du cercle de pilotes (20/08/2026)
--   3. L'annonce de la phase de test, l'attente assumée avant le lancement
--      (conformités + partenariats financiers) et l'appel à partenaires
--      (date imposée par le fondateur : hier, 09/11/2026)
-- ---------------------------------------------------------------------------
-- RÈGLES (identiques 0012/0015) :
--   1. INSERT OR IGNORE / WHERE NOT EXISTS : n'ajoute que ce qui est absent.
--      Aucune ligne existante (posts, jalons, publications, produits) n'est
--      écrasée — les saisies du Dashboard admin sont préservées.
--   2. UPDATE hist-01 STRICTEMENT GARDÉ : ne s'applique que si article_slug
--      est vide ET occurred_on vaut encore la valeur semée ('2026-11').
--   3. content_version inchangé (16) : content-update.sql ne se ré-exécute pas.
--   4. Dates : published_at = date ÉDITORIALE (affichée publiquement) ;
--      created_at/updated_at restent des dates techniques système.
--   5. Confidentialité : aucun lien technique, aucune URL d'hébergeur, aucune
--      mention de stack — les contenus parlent capacités et bénéfices.
--   6. Images : 3 couvertures dédiées générées pour ces articles (pas
--      d'image par défaut), livrées dans /assets/images/blog/.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1) Article 1 — l'origine : l'étude et la création annoncée (10/02/2026)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'waripay-origine-une-etude', 'WARIPAY : l''étude qui a donné naissance à une ambition',
  'Février 2026 : Green FAD annonce la création de WARIPAY. Tout est parti d''une étude de terrain à Bamako — et d''un constat simple : encaisser en Afrique de l''Ouest ne devrait pas être un parcours du combattant.',
  '# WARIPAY : l''étude qui a donné naissance à une ambition

Février 2026 : Green FAD annonce officiellement la création de **WARIPAY**, son infrastructure de paiement pour l''Afrique de l''Ouest. Mais avant l''annonce, il y a eu une étude — et un constat que nous ne pouvions plus ignorer.

## Le constat de départ

Chez Green FAD, nous exploitons nous-mêmes des produits qui encaissent : billetterie, boutiques, collectes. À chaque fois, la même difficulté revient : **recevoir de l''argent est simple, le faire proprement est compliqué.** Une intégration par opérateur, des réconciliations sur tableur, des frais opaques, des retraits à relancer.

## L''étude de terrain

Pendant trois mois, nous sommes allés écouter le terrain à Bamako : commerçants de quartier, boutiques en ligne naissantes, entreprises qui facturent des clients dans plusieurs pays. Nous avons cartographié ce qu''ils utilisent vraiment au quotidien : **Orange Money**, **Moov Money**, **Wave**, **MTN MoMo**, les cartes **Visa** et **Mastercard**, les virements bancaires UEMOA.

Le résultat est sans appel :

- chacun jongle avec plusieurs canaux d''encaissement, aucun n''est centralisé
- la réconciliation est manuelle, sujette aux erreurs, chronophage
- les frais réels ne sont souvent connus qu''après coup
- les retraits vers la banque ou le wallet restent un processus à part

## La décision

L''étude s''est transformée en conviction : ce n''est pas un outil de plus qu''il faut, c''est **une infrastructure**. Une seule intégration, plusieurs providers, un dashboard, une réconciliation, un settlement. Nous l''avons appelée **WARIPAY** — une API, tous les paiements d''Afrique de l''Ouest.

## Ce que nous nous sommes imposé

Dès le premier jour, trois principes non négociables : **des frais affichés avant chaque confirmation** (aucun coût caché), **un registre en double partie** (chaque mouvement rapprochable à tout instant) et **une couverture pays annoncée clairement** — le Mali d''abord, puis le Sénégal, la Côte d''Ivoire, le Burkina Faso, le Bénin, le Togo, la Guinée-Bissau et le Niger.

La suite ? La construction. Nous vous raconterons bientôt les premières étapes.',
  '/assets/images/blog/waripay-origine-etude.jpg', 'Produits', '["WARIPAY", "Origine", "Étude de terrain"]', 'Green FAD — Équipe produit', 'article', 0, '2026-02-10 09:00:00', 'publie',
  'WARIPAY : l''étude qui a donné naissance à une ambition | Blog Green FAD',
  'Février 2026 : création de WARIPAY annoncée par Green FAD — une seule intégration pour encaisser Orange Money, Moov Money, Wave, MTN MoMo, Visa, Mastercard et banques UEMOA.',
  '/assets/images/blog/waripay-origine-etude.jpg', 'waripay', (SELECT id FROM products WHERE slug = 'waripay'));

-- ---------------------------------------------------------------------------
-- 2) Article 2 — les retours d'expérience du cercle de pilotes (20/08/2026)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'waripay-premiers-retours-experience', 'WARIPAY : les premiers retours d''expérience',
  'Août 2026 : le cercle de pilotes de WARIPAY a testé liens de paiement, checkout hébergé et retraits. Voici ce que le terrain nous a appris — et ce que nous avons changé.',
  '# WARIPAY : les premiers retours d''expérience

Six mois après l''annonce de sa création, WARIPAY a franchi une étape discrète mais décisive : un **cercle fermé de pilotes** — commerçants de quartier, jeunes plateformes en ligne, une entreprise de services — a pris en main la console, les liens de paiement et l''API en mode **sandbox**. Voici ce que nous avons appris.

## Ce que les pilotes nous ont dit

**Le lien de paiement avec QR est devenu l''outil préféré.** Créer un lien en un clic, l''afficher en boutique ou l''envoyer par WhatsApp : c''est l''usage le plus immédiat, celui qui convertit le mieux.

**Les frais affichés avant confirmation rassurent.** Transaction après transaction, le même réflexe : regarder le montant des frais avant de valider. Cette transparence est devenue notre meilleur argument de confiance.

**Le choix du canal de retrait compte.** Virement bancaire UEMOA (T+1 ouvré) ou mobile money instantané : les pilotes veulent les deux, selon la journée. Les frais et délais affichés avant chaque retrait évitent les mauvaises surprises.

**La réconciliation sans tableur change la vie.** Le registre en double partie, rapproché de chaque provider, a supprimé le travail manuel de fin de mois. C''est le retour le plus fréquent chez les entreprises.

## Ce que nous avons changé

- **La console réorganisée en quatre espaces** : Pilotage, Opérations, Encaisser, Développeurs — pour que chaque profil trouve son chemin
- **L''application Android** : demandée dès les premières semaines, elle est arrivée avec notifications natives, QR et deep links
- **Le connecteur WooCommerce** : plusieurs pilotes vendent avec WordPress — la v1.0.0 est née de ce besoin
- **Le routage automatique** : quand un provider ralentit ou échoue, il est écarté — les pilotes ne voyaient que le taux de succès monter

## La suite

Ces retours nourrissent la préparation de l''ouverture élargie. Le prochain jalon : l''annonce de la phase de test publique — et les raisons pour lesquelles nous prenons notre temps avant le lancement commercial.',
  '/assets/images/blog/waripay-retours-experience.jpg', 'Produits', '["WARIPAY", "Terrain", "Pilotes", "Retours d''expérience"]', 'Green FAD — Équipe produit', 'article', 0, '2026-08-20 09:00:00', 'publie',
  'WARIPAY : les premiers retours d''expérience | Blog Green FAD',
  'Août 2026 : retours d''expérience du cercle de pilotes WARIPAY — liens de paiement avec QR, frais affichés avant confirmation, retraits banque UEMOA ou mobile money, réconciliation sans tableur.',
  '/assets/images/blog/waripay-retours-experience.jpg', 'waripay', (SELECT id FROM products WHERE slug = 'waripay'));

-- ---------------------------------------------------------------------------
-- 3) Article 3 — annonce de la phase de test + attente assumée + appel aux
--    partenaires. Date éditoriale imposée par le fondateur : HIER (09/11/2026)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'waripay-phase-de-test-annonce', 'WARIPAY entre en phase de test : pourquoi nous attendons avant le lancement',
  '9 novembre 2026 : WARIPAY ouvre sa phase de test. Console complète, checkout hébergé, application Android, connecteur WooCommerce — et deux raisons assumées d''attendre avant le lancement commercial : les conformités et les partenariats financiers.',
  '# WARIPAY entre en phase de test : pourquoi nous attendons avant le lancement

Le **9 novembre 2026**, WARIPAY entre officiellement en **phase de test**. Pas encore un lancement commercial — une ouverture maîtrisée, assumée. Voici ce qui est disponible, et surtout, pourquoi nous attendons.

## Ce qui est ouvert aujourd''hui

La console marchande est complète : **pilotage en temps réel** (volume, taux de succès, soldes, frais), **opérations** (retraits, remboursements, clients, rapports), **encaissement** (liens de paiement avec QR, checkout hébergé mobile-first) et **espace développeurs** (API & docs, clés, webhooks signés).

- **Une seule intégration** : Orange Money, Moov Money, Wave, MTN MoMo, Visa, Mastercard et banques UEMOA
- **Clés sandbox immédiates** : testez l''API sans engagement, webhooks et idempotence inclus
- **Application Android v1.0.3** et **connecteur WooCommerce v1.0.0** disponibles
- **Rail Mali ouvert** : le Sénégal, la Côte d''Ivoire, le Burkina Faso, le Bénin, le Togo, la Guinée-Bissau et le Niger suivront

## Pourquoi nous attendons

Deux chantiers déterminent notre date de lancement commercial, et nous refusons de les brader.

**Les conformités.** Nous manipulons l''argent des marchands : la vérification KYB des entreprises, les exigences réglementaires de l''espace UEMOA et les contrôles internes doivent être irréprochables **avant** l''ouverture à grande échelle, pas après.

**Les partenariats financiers.** Un settlement fiable repose sur des accords solides avec des institutions financières. Nous préférons une porte ouverte une fois pour toutes plutôt qu''un lancement prématuré suivi de promesses non tenues.

C''est la même discipline qui porte nos produits depuis 2021 : publier quand c''est solide.

## Nous cherchons des partenaires

Vous êtes une **banque de l''espace UEMOA**, une **institution de paiement**, un **opérateur mobile money** ou une **entreprise** qui veut encaisser proprement dès le premier jour ? Parlons-en. Les portes de la phase de test sont ouvertes — et les places de partenaire stratégique le sont aussi.

Contactez l''équipe Green FAD depuis la **page contact** du site ou via la fiche produit WARIPAY.',
  '/assets/images/blog/waripay-phase-de-test.jpg', 'Produits', '["WARIPAY", "Phase de test", "Partenariats", "Conformité"]', 'Green FAD — Équipe produit', 'article', 1, '2026-11-09 09:00:00', 'publie',
  'WARIPAY entre en phase de test : pourquoi nous attendons | Blog Green FAD',
  '9 novembre 2026 : WARIPAY ouvre sa phase de test — console complète, sandbox, Android v1.0.3, WooCommerce v1.0.0. Lancement commercial attendu après conformités et partenariats financiers. Appel à partenaires.',
  '/assets/images/blog/waripay-phase-de-test.jpg', 'waripay', (SELECT id FROM products WHERE slug = 'waripay'));

-- ---------------------------------------------------------------------------
-- 4) Jalons patrimoine : conception (étude + création annoncée) et premiers
--    retours de pilotes — insérés en chronologie AVANT hist-01 (sort_order
--    négatif : l'affichage trie par sort_order croissant)
-- ---------------------------------------------------------------------------
INSERT INTO product_milestones (product_slug, slug, kind, title, description_md, occurred_on, date_precision, article_slug, source_label, confidence, sort_order, status)
SELECT 'waripay', 'waripay-hist-02', 'conception', 'L''étude à l''origine de WARIPAY — création annoncée',
  'Trois mois d''étude de terrain à Bamako (commerçants, plateformes en ligne, entreprises) aboutissent à une conviction : il manque une infrastructure, pas un outil de plus. En février 2026, Green FAD annonce la création de WARIPAY — une API, tous les paiements d''Afrique de l''Ouest — avec trois principes fondateurs : frais affichés avant confirmation, registre en double partie, couverture pays annoncée.',
  '2026-02-10', 'exacte', 'waripay-origine-une-etude',
  'Article « WARIPAY : l''étude qui a donné naissance à une ambition » (10/02/2026) — récit éditorial daté, validé par le fondateur',
  'moyenne', -2, 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE slug = 'waripay-hist-02');

INSERT INTO product_milestones (product_slug, slug, kind, title, description_md, occurred_on, date_precision, article_slug, source_label, confidence, sort_order, status)
SELECT 'waripay', 'waripay-hist-03', 'premier_utilisateur', 'Cercle fermé de pilotes : premiers retours d''expérience',
  'Un cercle restreint de pilotes volontaires (commerçants de quartier, jeunes plateformes en ligne, une entreprise de services) teste la console, les liens de paiement avec QR et l''API en mode sandbox. Les retours — transparence des frais, choix du canal de retrait, réconciliation sans tableur — façonnent la console en quatre espaces, l''application Android et le connecteur WooCommerce.',
  '2026-08-20', 'exacte', 'waripay-premiers-retours-experience',
  'Article « WARIPAY : les premiers retours d''expérience » (20/08/2026) — récit éditorial daté, validé par le fondateur',
  'moyenne', -1, 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_milestones WHERE slug = 'waripay-hist-03');

-- ---------------------------------------------------------------------------
-- 5) Relier le jalon existant « Phase de test publique » (0015) à l'article
--    d'annonce du 09/11/2026 — UPDATE strictement gardé : ne s'applique que
--    si aucun article n'est déjà relié ET si occurred_on vaut la valeur semée
-- ---------------------------------------------------------------------------
UPDATE product_milestones SET
  article_slug = 'waripay-phase-de-test-annonce',
  occurred_on = '2026-11-09',
  date_precision = 'exacte',
  updated_at = datetime('now')
WHERE slug = 'waripay-hist-01'
  AND (article_slug IS NULL OR TRIM(article_slug) = '')
  AND occurred_on = '2026-11';

-- ---------------------------------------------------------------------------
-- 6) Publications du parcours (directive CTO : annonces ↔ implémentations ↔
--    articles) — provenance « nouvelle », reliées aux jalons par event_id
-- ---------------------------------------------------------------------------
INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'waripay', 'waripay-pub-origine', 'waripay-origine-une-etude', (SELECT id FROM product_milestones WHERE slug = 'waripay-hist-02'), NULL,
  'annonce', 'L''étude qui a donné naissance à WARIPAY',
  '2026-02-10', 'exacte', '2026-02-10', 'exacte', NULL, 'inconnue', NULL,
  'Fin 2025 : les produits Green FAD qui encaissent (billetterie, boutiques, collectes) buttent tous sur la même difficulté — agrégation manuelle des opérateurs, réconciliations sur tableur, frais opaques.',
  'Annonce de la création de WARIPAY : une infrastructure de paiement pour l''Afrique de l''Ouest — une seule intégration, plusieurs providers, un dashboard, une réconciliation, un settlement.',
  '["Étude de terrain à Bamako (trois mois)", "Cartographie des moyens de paiement réellement utilisés", "Trois principes fondateurs : frais affichés avant confirmation, registre en double partie, couverture pays annoncée"]',
  'Un projet produit adossé à des besoins de terrain vérifiés, pas à des suppositions.',
  'Création de WARIPAY annoncée en février 2026 ; l''article d''origine publie le récit fondateur.',
  '[]', 'nouvelle',
  'Article « WARIPAY : l''étude qui a donné naissance à une ambition » (10/02/2026) — récit éditorial daté, validé par le fondateur',
  'moyenne', 1, 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'waripay-pub-origine');

INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'waripay', 'waripay-pub-retours', 'waripay-premiers-retours-experience', (SELECT id FROM product_milestones WHERE slug = 'waripay-hist-03'), NULL,
  'implementation', 'Premiers retours d''expérience du cercle de pilotes',
  '2026-08-20', 'exacte', '2026-08-20', 'exacte', NULL, 'inconnue', NULL,
  'Six mois après l''annonce de la création, un cercle fermé de pilotes (commerçants, plateformes en ligne, entreprise de services) prend en main la console, les liens de paiement et l''API en mode sandbox.',
  'Publication des retours d''expérience et intégration des enseignements dans le produit.',
  '["Lien de paiement avec QR : l''outil le plus utilisé", "Frais affichés avant confirmation : premier facteur de confiance", "Choix du canal de retrait (banque UEMOA ou mobile money)", "Réconciliation sans tableur (registre en double partie)"]',
  'Le produit évolue au contact du terrain avant l''ouverture publique.',
  'Console réorganisée en quatre espaces, application Android, connecteur WooCommerce v1.0.0, routage automatique des providers dégradés.',
  '[]', 'nouvelle',
  'Article « WARIPAY : les premiers retours d''expérience » (20/08/2026) — récit éditorial daté, validé par le fondateur',
  'moyenne', 2, 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'waripay-pub-retours');

INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'waripay', 'waripay-pub-test', 'waripay-phase-de-test-annonce', (SELECT id FROM product_milestones WHERE slug = 'waripay-hist-01'), NULL,
  'annonce', 'Annonce de la phase de test et de l''attente assumée avant le lancement',
  '2026-11-09', 'exacte', '2026-11-09', 'exacte', NULL, 'inconnue', NULL,
  'La console est complète et le rail Mali est ouvert ; la mise en production reste conditionnée à deux chantiers : les conformités (KYB, exigences réglementaires de l''espace UEMOA) et les partenariats financiers.',
  'Ouverture de la phase de test publique et appel aux partenaires financiers, opérateurs mobile money et marchands.',
  '["Console marchande complète (pilotage, opérations, encaissement, développeurs)", "Clés sandbox immédiates", "Application Android v1.0.3 et connecteur WooCommerce v1.0.0", "Rail Mali ouvert, sept pays annoncés"]',
  'Transparence totale sur l''état réel du produit et sur le calendrier conditionnel.',
  'Article d''annonce publié le 9 novembre 2026 ; phase de test ouverte, lancement commercial en attente des conformités et des partenariats financiers.',
  '[]', 'nouvelle',
  'Article « WARIPAY entre en phase de test : pourquoi nous attendons avant le lancement » (09/11/2026) — publication à la demande du fondateur',
  'haute', 3, 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'waripay-pub-test');
