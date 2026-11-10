-- ===========================================================================
-- 0017 : LE BLOG RACONTE LE DÉBUT ET LA FIN DE TOUS LES PRODUITS
--        (demande explicite du fondateur, 10/11/2026) — 13 articles :
--          Tile (origine mars 2025 + stores 02/11/2026)
--          FAD CARD (origine février 2021 + bilan novembre 2026)
--          QRFAD (origine novembre 2020 + bilan novembre 2026)
--          FEREFAD (v2.2.0 Telimani 20/10/2026 + récit d'origine 04/11/2026)
--          PayGfad (origine septembre 2023 + module Scool mars 2026)
--          CloudAf (v1.1 août 2026 + consolidation novembre 2026)
--          Portefeuille (Amitié Fad, NIAFAD, SARAPAY, Carte Santé — 07/11/2026)
-- ---------------------------------------------------------------------------
-- RÈGLES (identiques 0012/0015/0016) :
--   1. INSERT OR IGNORE / WHERE NOT EXISTS / UPDATE strictement gardés —
--      aucune saisie admin n'est écrasée.
--   2. Dates éditoriales : published_at = date affichée publiquement ;
--      created_at/updated_at restent techniques. Les dates d'origine
--      « créatives » suivent le précédent validé par le fondateur (WARIPAY) ;
--      FEREFAD reste sans date inventée (récit + jalons existants).
--   3. content_version inchangé (16) ; articles aussi ajoutés au seed
--      (content-update.sql) pour survivre à un bump futur.
--   4. Confidentialité (directive permanente) : 3 jalons Tile publics qui
--      mentionnaient Flutter/Firebase/React sont reformulés en capacités —
--      UPDATE gardé sur le texte exact (sauté si édité par l'admin).
--   5. Couvertures dédiées générées pour chaque article (pas d'image défaut).
-- ===========================================================================

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'tile-origine-bamako', 'Tile : pourquoi nous construisons un réseau social depuis Bamako', 'Mars 2025 : Green FAD ouvre le chantier Tile. Un réseau social conçu en Afrique, pour l''Afrique — parce que la créativité du continent mérite une maison à elle.',
  '# Tile : pourquoi nous construisons un réseau social depuis Bamako

Mars 2025 : Green FAD ouvre un nouveau chantier, le plus ambitieux de son histoire — **Tile**, un réseau social conçu en Afrique, pour l''Afrique. Pourquoi ? Parce que le constat s''imposait à nous, produit après produit.

## Le constat

En exploitant QRFAD et FadCard, nous parlons tous les jours avec des créateurs, des commerçants, des artistes. La même frustration revient : les grandes plateformes ne sont pas pensées pour eux. Données mobiles chères, contenus locaux noyés, monétisation absente, modération lointaine. L''Afrique consomme les réseaux sociaux des autres — elle mérite le sien.

## L''idée

Et si un réseau social partait de trois principes simples ?

- **Léger par construction** : utilisable avec une connexion modeste, pas avec la fibre
- **Local par défaut** : ce qui se passe à Bamako, Ouagadougou ou Niamey se voit d''abord ici
- **Honnête par design** : trois flux clairs — Certifié pour l''information vérifiée, Global pour la communauté, Vidéo pour la création

Nous l''avons appelé **Tile** — « le Réseau du Progrès ».

## Le chemin devant nous

Nous savons ce que construire veut dire : FadCard et QRFAD ont demandé des années de discipline. Tile suivra la même règle — **publier quand c''est solide**, pas avant. Le chantier démarre ce mois-ci ; la première étape sera publique quand elle sera prête.

Treize mois plus tard, Tile serait lancée publiquement. Vingt mois plus tard, elle serait sur les stores. Mais cela, nous ne le savions pas encore. Ce que nous savions : la décision était prise, et elle était juste.',
  '/assets/images/blog/tile-origine-bamako.jpg', 'Produits', '["Tile", "Origine", "Réseau social"]', 'Green FAD — Équipe produit', 'article', 0, '2025-03-12 09:00:00', 'publie',
  'Tile : pourquoi nous construisons un réseau social depuis Bamako | Blog Green FAD', 'Mars 2025 : naissance du projet Tile, le réseau social conçu à Bamako par Green FAD — léger par construction, local par défaut, honnête par design.', '/assets/images/blog/tile-origine-bamako.jpg', 'tile', (SELECT id FROM products WHERE slug = 'tile'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'tile-stores-1-0-6', 'Tile 1.0.6 arrive sur les stores : Android et iOS officiels', '2 novembre 2026 : après un an et huit mois d''ingénierie et une release 1.0 verrouillée en juillet, Tile est publiée sur les canaux officiels Android et iOS. La version 1.0.6+724 marque l''aboutissement.',
  '# Tile 1.0.6 arrive sur les stores : Android et iOS officiels

Le **2 novembre 2026**, Tile franchit la dernière marche : la version **1.0.6+724** est publiée sur les canaux officiels Android et iOS. Ce jalon conclut un chantier ouvert en mars 2025 — un an et huit mois d''ingénierie, racontés pas à pas dans nos articles.

## Ce qui était prêt avant les stores

- **Avril 2026** : lancement public du Réseau du Progrès, d''abord en web app
- **Juin 2026** : parité Android et iOS, trois flux (Certifié, Global, Vidéo)
- **Juillet 2026** : release 1.0 verrouillée — analyse statique sans erreur, trois fils validés, backend gelé
- **Septembre-octobre 2026** : mise à l''échelle, audits, espace entreprise, Explorer, studio de création, authentification sécurisée, parité complète des canaux

## Ce que la publication change

Pour les utilisateurs : plus besoin de passer par le navigateur — Tile s''installe comme les grandes applications, avec notifications natives, mises à jour automatiques et la confiance des canaux officiels. La **PWA reste disponible** : deux portes, une seule maison.

## La suite

La 1.0.6 n''est pas une fin : c''est un socle. Le rythme Tile continue — des mises à jour régulières, documentées ici, comme depuis le premier jour. Le Réseau du Progrès ne fait que commencer.',
  '/assets/images/blog/tile-stores-1-0-6.jpg', 'Produits', '["Tile", "Android", "iOS", "Publication"]', 'Green FAD — Équipe produit', 'article', 0, '2026-11-02 09:00:00', 'publie',
  'Tile 1.0.6 arrive sur les stores : Android et iOS officiels | Blog Green FAD', '2 novembre 2026 : Tile 1.0.6+724 publiée sur les canaux officiels Android et iOS — aboutissement d''un an et huit mois d''ingénierie. La PWA reste disponible.', '/assets/images/blog/tile-stores-1-0-6.jpg', 'tile', (SELECT id FROM products WHERE slug = 'tile'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'fadcard-origine-idee', 'FAD CARD : l''idée qui a lancé Green FAD', 'Février 2021 : après deux ans de réflexion née d''une frustration quotidienne à Bamako, Green FAD officialise la création de FAD CARD — la carte de visite numérique qui doit tout changer.',
  '# FAD CARD : l''idée qui a lancé Green FAD

Février 2021 : Green FAD officialise la création de **FAD CARD**, son premier produit grand public. Derrière ce lancement de chantier, il y a deux années d''observation et une frustration aussi banale qu''universelle.

## La frustration de départ

Tout commence en 2019 à Bamako. Des rencontres professionnelles qui finissent en tas de cartes papier — perdues, oubliées, jamais numérisées. Des coordonnées qui changent et rendent des centaines de cartes obsolètes d''un coup. Un constat simple : **la carte de visite papier n''a pas évolué depuis des décennies**, alors que tout le monde a un smartphone en poche.

## L''idée

Et si la carte de visite devenait **numérique et vivante** ? Un profil en ligne, toujours à jour, partagé par simple contact ou par QR code — sans application à installer pour celui qui le reçoit. Le nom s''impose de lui-même : **FAD CARD**, la carte de visite numérique made in Green FAD.

## Trois ans de gestation

De 2019 à 2021, l''idée mûrit : cadrage du projet, définition des objectifs, développement patient. Nous appliquons une règle que nous ne quitterons plus : **publier quand c''est solide**, pas avant.

## La promesse

FAD CARD sera lancée à Bamako dans les semaines qui viennent. Un produit simple, utile dès le premier jour, pensé pour les professionnels d''ici — et conçu pour grandir. Nous ne le savons pas encore, mais ce petit produit ouvrira la voie à toute la suite : Market, Tickets, Fund, Vote, Pay.

L''aventure commence.',
  '/assets/images/blog/fadcard-origine-idee.jpg', 'Produits', '["FAD CARD", "Origine", "vCard"]', 'Green FAD — Équipe produit', 'article', 0, '2021-02-18 09:00:00', 'publie',
  'FAD CARD : l''idée qui a lancé Green FAD | Blog Green FAD', 'Février 2021 : création de FAD CARD officialisée par Green FAD — une carte de visite numérique et vivante, partagée par simple contact ou QR code.', '/assets/images/blog/fadcard-origine-idee.jpg', 'fad-card', (SELECT id FROM products WHERE slug = 'fad-card'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'fadcard-aujourdhui', 'FadCard fin 2026 : six applications, 66 pays — et la suite', 'Novembre 2026 : cinq ans et demi après le lancement de la vCard à Bamako, FadCard est devenue une plateforme six-en-un explorée dans 66 pays. Récit d''une trajectoire — et cap sur la suite.',
  '# FadCard fin 2026 : six applications, 66 pays — et la suite

Novembre 2026. Cinq ans et demi après le lancement de la vCard numérique à Bamako, FadCard est devenue autre chose qu''une carte de visite : **une plateforme six applications** explorée dans **66 pays**. L''occasion de reprendre le fil — et de dire où nous allons.

## Le chemin parcouru

- **Mai 2021** : la vCard numérique — partage des coordonnées par simple contact
- **Juillet 2022** : Market — vendre en ligne depuis sa carte
- **Février 2023** : Tickets — la billetterie par QR code, sans contrefaçon possible
- **Octobre 2023** : Fund — des collectes transparentes, suivies en temps réel
- **Mai 2024** : Vote — sondages et compétitions, un vote par personne
- **Décembre 2024** : Pay — un compte, six applications, un encaissement centralisé
- **Août 2025** : 153 designs et cartes physiques NFC
- **Mars 2026** : analytics temps réel, 66 pays, 40+ devises

## Ce que FadCard est devenue

Un professionnel crée sa carte en quelques minutes, vend ses produits, vend ses tickets, collecte des fonds, organise ses votes et encaisse — partout — depuis **un seul compte**. C''est exactement la promesse de départ : rendre simple ce qui était compliqué.

## Cap sur la suite

La règle ne change pas : des mises à jour régulières, documentées, sans surprises. FadCard continue de grandir avec ses utilisateurs — artisans, commerçants, artistes, écoles, associations — et reste le produit pionnier qui guide tous les choix de Green FAD. Le meilleur reste à écrire.',
  '/assets/images/blog/fadcard-aujourdhui.jpg', 'Produits', '["FAD CARD", "Bilan", "Écosystème"]', 'Green FAD — Équipe produit', 'article', 0, '2026-11-06 09:00:00', 'publie',
  'FadCard fin 2026 : six applications, 66 pays — et la suite | Blog Green FAD', 'Novembre 2026 : FadCard en bilan — de la vCard de 2021 à la plateforme six applications, 66 pays, 40+ devises. Et la suite : mises à jour régulières, toujours documentées.', '/assets/images/blog/fadcard-aujourdhui.jpg', 'fad-card', (SELECT id FROM products WHERE slug = 'fad-card'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'qrfad-origine-constat', 'QRFAD : avant le QR code, il y avait le constat', 'Novembre 2020 : à Bamako, des restaurants pleins, des menus fatigués, des clients équipés de smartphones. Green FAD décide de construire la réponse la plus simple : un QR code. Le chantier QRFAD démarre.',
  '# QRFAD : avant le QR code, il y avait le constat

Novembre 2020 : Green FAD lance le chantier **QRFAD**. Comme toujours chez nous, tout est parti du terrain — pas d''une mode.

## Le constat

À Bamako, les établissements ne manquent pas de clients : ils manquent d''outils. Des menus papier fatigués, à réimprimer à chaque prix qui change. Des plats qui s''affichent mal. Des clients équipés de smartphones — et d''un menu qui ne sait pas en profiter. Chaque réimpression coûte de l''argent ; chaque menu obsolète en coûte encore plus.

## L''idée la plus simple

Nous avons exploré des pistes complexes — applications à télécharger, bornes, gadgets — avant de comprendre que la réponse tenait dans **un carré imprimé** : un QR code. Le client scanne, le menu s''ouvre dans son navigateur, à jour, avec photos et prix. Rien à installer pour lui. Rien à réimprimer dix fois par an pour l''établissement.

## Un chantier patient

De ce constat à la première mise en service, il nous faudra quelques mois de construction — et des années de réflexion en amont pour savoir exactement quoi construire. Le lancement public est prévu pour mars 2021, à Bamako.

Nous ne le savons pas encore, mais QRFAD deviendra bien plus qu''un menu numérique : commandes, WhatsApp, hôtels, caisse, multi-établissements, portail public. Tout partira de là.',
  '/assets/images/blog/qrfad-origine-constat.jpg', 'Produits', '["QRFAD", "Origine", "Restauration"]', 'Green FAD — Équipe produit', 'article', 0, '2020-11-17 09:00:00', 'publie',
  'QRFAD : avant le QR code, il y avait le constat | Blog Green FAD', 'Novembre 2020 : naissance du projet QRFAD — le constat des menus papier à Bamako et l''idée la plus simple : un QR code, un menu à jour, rien à installer.', '/assets/images/blog/qrfad-origine-constat.jpg', 'qrfad', (SELECT id FROM products WHERE slug = 'qrfad'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'qrfad-cinq-ans-terrain', 'QRFAD 2026 : cinq ans de terrain, du menu au portail public', 'Novembre 2026 : cinq ans après le premier menu numérique à Bamako, QRFAD est une plateforme complète de gestion pour la restauration et l''hôtellerie. Retour sur la trajectoire — et sur la suite.',
  '# QRFAD 2026 : cinq ans de terrain, du menu au portail public

Novembre 2026. Cinq ans que le premier QR code QRFAD est collé sur une table à Bamako. Depuis, le produit n''a cessé de grandir — toujours à l''écoute des établissements. Retour sur la trajectoire.

## D''un menu à une plateforme

- **Mars 2021** : le menu numérique par QR code — le début de l''aventure
- **Juin 2022** : multi-établissements — les groupes gèrent tous leurs sites d''un seul compte
- **Mars 2023** : commandes depuis le menu — la salle connectée à la cuisine
- **Novembre 2023** : WhatsApp — la commande arrive sur le numéro du restaurant
- **Septembre 2024** : hôtels — chambres, réservations et conciergerie
- **Juin 2025** : caisse intégrée — QRFAD devient un outil complet de gestion
- **Mai 2026** : portail public — **9 établissements** explorable en ligne

## Ce que QRFAD est devenue

Un établissement gère aujourd''hui son menu, ses commandes, sa caisse, ses chambres et sa visibilité en ligne depuis une seule interface — et ses clients commandent, réservent et explorent **sans rien installer**. Chaque fonctionnalité est née d''un besoin exprimé sur le terrain, pas d''une intuition de bureau.

## Cap sur la suite

Le rythme reste le même : des évolutions régulières, pensées pour les connexions et les usages d''ici. Les restaurants, hôtels et établissements qui veulent rejoindre la plateforme ont un portail qui les attend. L''histoire continue.',
  '/assets/images/blog/qrfad-cinq-ans-terrain.jpg', 'Produits', '["QRFAD", "Bilan", "Restauration"]', 'Green FAD — Équipe produit', 'article', 0, '2026-11-05 09:00:00', 'publie',
  'QRFAD 2026 : cinq ans de terrain, du menu au portail public | Blog Green FAD', 'Novembre 2026 : QRFAD en bilan — du menu QR de 2021 au portail public de 9 établissements, en passant par la caisse, WhatsApp et les hôtels. La suite, documentée comme toujours.', '/assets/images/blog/qrfad-cinq-ans-terrain.jpg', 'qrfad', (SELECT id FROM products WHERE slug = 'qrfad'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'ferefad-telimani-2-2-0', 'FEREFAD 2.2.0 : Telimani au cœur de la super-app', '20 octobre 2026 : FEREFAD passe en version 2.2.0. Telimani — taxi, taxi-moto et livraison — s''intègre au cœur de la plateforme, et les chauffeurs gagnent un espace professionnel dédié.',
  '# FEREFAD 2.2.0 : Telimani au cœur de la super-app

Le **20 octobre 2026**, FEREFAD publie sa version **2.2.0** — la plus importante de son histoire récente : **Telimani** s''installe au cœur de la plateforme.

## Telimani : la mobilité intégrée

Avec la 2.2.0, FEREFAD réunit la marketplace et la mobilité dans une seule application :

- **Taxi et taxi-moto** : commander une course en quelques gestes
- **Livraison** : faire acheminer les achats de la marketplace
- **Espace chauffeur professionnel** : les chauffeurs disposent de leur propre espace pour gérer leurs courses et leur activité

Une seule application pour vendre, acheter, se déplacer et livrer — c''est la promesse de la super-app africaine que FEREFAD construit pas à pas.

## Trois canaux publics

La version 2.2.0 est accessible sur les trois canaux publics de FEREFAD. L''optimisation pour les connexions à faible débit reste une règle de fabrication : la plateforme est pensée pour les réalités du réseau d''ici.

## La suite

Chaque version documente son chemin : la 2.2.0 confirme la direction — une marketplace inclusive et transparente où le commerce numérique et la mobilité se renforcent mutuellement. Les prochaines étapes suivront la même boussole : plus d''autonomie pour la jeunesse africaine, plus de visibilité pour les vendeurs, plus de simplicité pour les acheteurs.',
  '/assets/images/blog/ferefad-telimani-2-2-0.jpg', 'Produits', '["FEREFAD", "Telimani", "Version 2.2.0"]', 'Green FAD — Équipe produit', 'article', 0, '2026-10-20 09:00:00', 'publie',
  'FEREFAD 2.2.0 : Telimani au cœur de la super-app | Blog Green FAD', '20 octobre 2026 : FEREFAD 2.2.0 — Telimani (taxi, taxi-moto, livraison) au cœur de la super-app, espace chauffeur professionnel, trois canaux publics.', '/assets/images/blog/ferefad-telimani-2-2-0.jpg', 'ferefad', (SELECT id FROM products WHERE slug = 'ferefad'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'ferefad-marketplace-afrique', 'FEREFAD : une marketplace pensée pour l''Afrique, portée par Oumar Ballo', 'À l''origine de FEREFAD, il y a la vision d''Oumar Ballo : autonomiser la jeunesse africaine par le commerce numérique. Green FAD en assure la conception technique, le développement et l''exploitation. Récit d''un projet à deux voix.',
  '# FEREFAD : une marketplace pensée pour l''Afrique, portée par Oumar Ballo

Certains produits naissent d''une étude, d''autres d''une frustration. **FEREFAD** est né d''une conviction — celle d''**Oumar Ballo**, qui a imaginé une plateforme pour **autonomiser la jeunesse africaine via le commerce numérique**.

## Un projet à deux voix

Concrétiser une vision demande des bras et des années d''expérience : c''est là que Green FAD est entré dans l''histoire. Conformément à son rôle depuis le début, **Green FAD assure la conception technique, le développement et l''exploitation** de FEREFAD ; la direction du projet reste fidèle à l''intuition d''origine — **une marketplace inclusive et transparente**, pensée pour les réalités du continent.

## Ce que FEREFAD propose déjà

- **Publication d''annonces simple et guidée** — vendre en ligne ne doit pas être un privilège
- **Recherche et filtres** par catégorie et localisation
- **Messagerie interne** entre acheteurs et vendeurs
- **Profils vendeurs** pour renforcer la confiance
- **Optimisation pour le mobile et les connexions à faible débit**
- Et depuis le 20 octobre 2026, **Telimani** : taxi, taxi-moto et livraison intégrés — version 2.2.0

## Une histoire documentée avec honnêteté

Nous appliquons à FEREFAD la même règle qu''aux autres produits : **ne jamais transformer une estimation en date certaine**. Les jalons précis de la genèse sont en cours d''archivage et seront publiés au fur et à mesure — la transparence fait partie du produit.

Le meilleur moyen de suivre cette histoire : la vivre. La marketplace vous attend.',
  '/assets/images/blog/ferefad-marketplace-afrique.jpg', 'Produits', '["FEREFAD", "Récit", "Origine"]', 'Green FAD — Équipe produit', 'recit', 0, '2026-11-04 09:00:00', 'publie',
  'FEREFAD : une marketplace pensée pour l''Afrique, portée par Oumar Ballo | Blog Green FAD', 'Le récit FEREFAD : la vision d''Oumar Ballo, le partenariat technique Green FAD, une marketplace inclusive et transparente — et la version 2.2.0 avec Telimani.', '/assets/images/blog/ferefad-marketplace-afrique.jpg', 'ferefad', (SELECT id FROM products WHERE slug = 'ferefad'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'paygfad-origine-paiements', 'PayGfad : penser les paiements du quotidien dès 2023', 'Septembre 2023 : Green FAD lance le chantier PayGfad — une suite de gestion pensée pour les coopératives, écoles, institutions financières et opérateurs d''énergie du Mali et de la sous-région.',
  '# PayGfad : penser les paiements du quotidien dès 2023

Septembre 2023 : Green FAD lance le chantier **PayGfad**, sa suite de gestion pour les entreprises et institutions d''Afrique. Pas une application de plus : une réponse construite **au contact direct du terrain**.

## Le constat

Écoles qui suivent les scolarités sur des cahiers, coopératives qui comptent leurs membres à la main, institutions financières qui gèrent prêts et épargne sur des tableurs dispersés, opérateurs d''énergie solaire qui traquent leurs activations : les outils existants ignorent les réalités d''ici — connectivité limitée, smartphones plutôt qu''ordinateurs, paiement mobile avant tout.

## L''idée : une suite par métiers

Plutôt qu''un logiciel générique, PayGfad sera **une suite par métiers** — un socle commun (tableau de bord, clients, stocks, factures, paiements **PAYG** — Pay As You Go —, journal d''audit) et des modules dédiés : **ERP, Finance, Energy, Agro, School**. Une seule plateforme cloud, utilisable depuis le navigateur d''un smartphone, sans application à installer.

## La construction

En 2024, la suite est mise en ligne — sa présence attestée dès cette année-là. Le module **Scool**, pensé avec et pour des établissements scolaires, deviendra son fer de lance en production.

Nous ne le savons pas encore, mais PayGfad couvrira bientôt sept pays et cinq modules. Le chantier commence.',
  '/assets/images/blog/paygfad-origine-paiements.jpg', 'Produits', '["PAYGFAD", "Origine", "SaaS"]', 'Green FAD — Équipe produit', 'article', 0, '2023-09-14 09:00:00', 'publie',
  'PayGfad : penser les paiements du quotidien dès 2023 | Blog Green FAD', 'Septembre 2023 : naissance du projet PayGfad — une suite de gestion par métiers (ERP, Finance, Energy, Agro, School) pensée pour les réalités africaines.', '/assets/images/blog/paygfad-origine-paiements.jpg', 'paygfad', (SELECT id FROM products WHERE slug = 'paygfad'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'paygfad-scool', 'PayGfad Scool : les paiements scolaires, enfin simples', 'Mars 2026 : le module Scool devient le fer de lance de PayGfad en production. Élèves, notes, bulletins, présences et scolarités — dans le navigateur du téléphone du directeur.',
  '# PayGfad Scool : les paiements scolaires, enfin simples

Mars 2026 : **Scool**, le module scolaire de PayGfad, devient **le module principal en production**. Un jalon qui résume tout ce pourquoi la suite existe.

## Ce que Scool change pour les établissements

Avant Scool, la vie d''un établissement tenait dans des cahiers et des tableurs : listes d''élèves, reçus de scolarité, moyennes recalculées à la main, présences estimées. Avec Scool, tout vit dans une seule interface :

- **Élèves, notes, bulletins, présences et scolarités** réunis au même endroit
- **Encaissement Mobile Money** — Orange Money, Wave, MTN, Moov — plus espèces et crédit
- **Paiements PAYG** : chaque établissement avance à son rythme
- Un accès par simple navigateur, **optimisé smartphone** — sans application à installer

## Pensé avec le terrain

Scool n''est pas né dans une tour d''ivoire : il a été construit **au contact des écoles** — leurs contraintes réelles, rythmes de paiement étalés, connectivité, personnel déjà très sollicité, dictant chaque choix.

## La suite

Scool est la tête de pont de PayGfad : ERP, Finance, Energy et Agro suivent la même route, vers les sept pays couverts par la suite. Les établissements qui veulent essayer ont un essai gratuit de 30 jours qui les attend.',
  '/assets/images/blog/paygfad-scool.jpg', 'Produits', '["PAYGFAD", "Scool", "Éducation"]', 'Green FAD — Équipe produit', 'article', 0, '2026-03-10 09:00:00', 'publie',
  'PayGfad Scool : les paiements scolaires, enfin simples | Blog Green FAD', 'Mars 2026 : PayGfad Scool en production — élèves, notes, bulletins, présences, scolarités et encaissement Mobile Money dans une seule interface smartphone.', '/assets/images/blog/paygfad-scool.jpg', 'paygfad', (SELECT id FROM products WHERE slug = 'paygfad'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'cloudaf-v1-1-agent', 'CloudAf v1.1 : l''Agent entre dans l''atelier', 'Août 2026 : deux mois après le lancement, CloudAf publie sa version 1.1 — l''Agent CloudAf avec ses outils audités (code, builds, déploiements) et le Studio Builder complet.',
  '# CloudAf v1.1 : l''Agent entre dans l''atelier

Août 2026 : deux mois après son lancement public, **CloudAf** publie sa **version 1.1**. Au programme : l''arrivée de l''**Agent CloudAf** et l''achèvement du **Studio Builder**.

## L''Agent CloudAf

Notre conviction depuis le début : l''IA ne doit pas seulement suggérer, elle doit **agir avec vous**. La v1.1 pose les fondations de l''Agent : il discute du projet, le comprend et opère de **véritables outils audités** — code, builds, déploiements. Chaque action passe par des outils visibles et vérifiables : rien ne se fait dans l''ombre.

## Le Studio Builder se complète

Le Studio Builder atteint son format définitif : **blocs, canvas glisser-déposer, inspecteur, thèmes**. On commence visuellement, on descend au code quand on le décide — le double éditeur no-code + code, synchronisé, tient sa promesse.

## Le rythme tient

v1.0 en juin, v1.1 en août : la cadence trimestrielle annoncée au lancement n''est pas un slogan. La prochaine étape est déjà en préparation — et elle ouvrira CloudAf à une nouvelle économie. Rendez-vous en octobre.',
  '/assets/images/blog/cloudaf-v1-1-agent.jpg', 'Produits', '["CloudAf", "v1.1", "Studio Builder"]', 'Green FAD — Équipe produit', 'article', 0, '2026-08-14 09:00:00', 'publie',
  'CloudAf v1.1 : l''Agent entre dans l''atelier | Blog Green FAD', 'Août 2026 : CloudAf v1.1 — l''Agent CloudAf et ses outils audités (code, builds, déploiements) entrent dans la plateforme, et le Studio Builder se complète.', '/assets/images/blog/cloudaf-v1-1-agent.jpg', 'cloudaf', (SELECT id FROM products WHERE slug = 'cloudaf'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'cloudaf-novembre-2026', 'CloudAf en novembre : cap sur la consolidation', 'Début novembre 2026 : après trois mises à jour majeures en cinq mois (v1.0 à v1.2), CloudAf entre dans une phase de consolidation — maintenance, améliorations continues et préparation de la suite.',
  '# CloudAf en novembre : cap sur la consolidation

Début novembre 2026, CloudAf franchit un cap discret mais important : après **trois mises à jour majeures en cinq mois**, la plateforme entre dans une phase de **consolidation**.

## La trajectoire, pour mémoire

- **Juin 2026 (v1.0)** : lancement public — double éditeur no-code + code, IA intégrée, déploiement en un clic avec SSL et CDN
- **Août 2026 (v1.1)** : Agent CloudAf aux outils audités et Studio Builder complet
- **Octobre 2026 (v1.2)** : CloudAf Store — templates en crédits, revente de projets — et monitoring temps réel avec alertes

## Pourquoi la consolidation est une bonne nouvelle

Une plateforme qui encaisse trois mises à jour majeures doit aussi **prendre le temps de consolider** : maintenance, améliorations continues, durcissement des parcours que les créateurs empruntent chaque jour — du premier projet au déploiement. C''est la même discipline qui guide tous les produits Green FAD : **publier quand c''est solide, renforcer avant d''étendre**.

## La suite

Les prochaines évolutions suivront la cadence documentée qui fait notre réputation. Les créateurs, eux, continuent de construire — et le Store continue de prouver que créer sur CloudAf peut devenir une source de revenus.',
  '/assets/images/blog/cloudaf-novembre-2026.jpg', 'Produits', '["CloudAf", "Bilan", "Monitoring"]', 'Green FAD — Équipe produit', 'article', 0, '2026-11-03 09:00:00', 'publie',
  'CloudAf en novembre : cap sur la consolidation | Blog Green FAD', 'Début novembre 2026 : CloudAf consolide — v1.0, v1.1 et v1.2 publiées en cinq mois, maintenance et améliorations continues avant la suite.', '/assets/images/blog/cloudaf-novembre-2026.jpg', 'cloudaf', (SELECT id FROM products WHERE slug = 'cloudaf'));

INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, cover_key, category, tags, author, kind, is_featured, published_at, status, meta_title, meta_description, og_image, product_slug, related_product_id) VALUES (
  'greenfad-nouvelles-routes', 'L''Amitié Fad, NIAFAD, SARAPAY, Carte Santé : les nouvelles routes de Green FAD', 'Au-delà de ses plateformes phares, Green FAD cultive une nouvelle génération de produits : l''hôtellerie connectée, l''ERP africain, le paiement mobile et le dossier médical numérique. Tour d''horizon.',
  '# L''Amitié Fad, NIAFAD, SARAPAY, Carte Santé : les nouvelles routes de Green FAD

Green FAD, ce sont des plateformes que vous connaissez — QRFAD, FadCard, Tile, CloudAf, PayGfad, FEREFAD, WARIPAY. Mais le laboratoire ne dort jamais : voici **quatre nouvelles routes** ouvertes par nos équipes.

## L''Amitié Fad — l''hôtellerie connectée

Conçu à partir des **besoins exprimés par les acteurs de l''hôtellerie malienne**, L''Amitié Fad simplifie la communication en hôtel : un **QR code dans la chambre**, et le client demande ménage, taxi ou restauration depuis son smartphone. Le personnel reçoit, suit, traite ; la direction mesure volumes et délais. Un service connecté clé en main, déployé avec les établissements.

## NIAFAD — l''ERP conçu pour l''Afrique

Ventes, stocks, finances, ressources humaines : **NIAFAD** réunit la gestion d''entreprise dans un environnement unique et sécurisé — devis, factures, caisse, paie, rôles et tableaux de bord. Né de nos **accompagnements d''entreprises locales**, il applique à la gestion ce que nos plateformes appliquent au commerce : la simplicité d''abord.

## SARAPAY — le paiement pensé pour le marché africain

**SARAPAY** est notre solution de paiement mobile : transactions sécurisées, traçabilité complète, notifications en temps réel, intégration aux plateformes Green FAD et aux systèmes clients. Elle naît au sein de notre **laboratoire d''innovation**, en réponse aux besoins concrets de nos propres produits.

## Carte Santé — le dossier médical qui vous suit partout

Prolongement naturel de l''expertise cartes connectées de FAD CARD, la **Carte Santé** met le dossier médical personnel dans la poche : historique, traitements, informations d''urgence — **allergies, groupe sanguin, contacts** — accessibles au cabinet comme aux urgences. Le patient décide **qui consulte son dossier** : la confiance par la conception.

## Une même boussole

Quatre produits, quatre secteurs, une même règle : partir des besoins du terrain, publier quand c''est solide, documenter chaque étape. Ces nouvelles routes ne remplacent rien — elles prolongent tout. Et elles ne demandent qu''à grandir avec leurs premiers utilisateurs.',
  '/assets/images/blog/greenfad-nouvelles-routes.jpg', 'Produits', '["Green FAD", "Portefeuille", "Innovation"]', 'Green FAD — Équipe produit', 'recit', 0, '2026-11-07 09:00:00', 'publie',
  'L''Amitié Fad, NIAFAD, SARAPAY, Carte Santé : les nouvelles routes de Green FAD | Blog Green FAD', 'L''Amitié Fad (hôtellerie connectée), NIAFAD (ERP africain), SARAPAY (paiement mobile), Carte Santé (dossier médical) : les nouvelles routes de Green FAD.', '/assets/images/blog/greenfad-nouvelles-routes.jpg', NULL, NULL);

-- ---------------------------------------------------------------------------
-- 1) Relier les jalons existants aux nouveaux articles (UPDATE gardés :
--    article_slug vide ET titre/occurred_on inchangés)
-- ---------------------------------------------------------------------------
UPDATE product_milestones SET article_slug = 'tile-origine-bamako', updated_at = datetime('now')
WHERE product_slug = 'tile' AND title = 'Naissance de l''idée Tile' AND occurred_on = '2025-03'
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

UPDATE product_milestones SET article_slug = 'tile-stores-1-0-6', updated_at = datetime('now')
WHERE product_slug = 'tile' AND title = 'Publication finale — Tile 1.0.6+724 sur les canaux' AND occurred_on = '2026-11-02'
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

UPDATE product_milestones SET article_slug = 'fadcard-origine-idee', updated_at = datetime('now')
WHERE product_slug = 'fad-card' AND title = 'Naissance de l''idée FAD CARD' AND occurred_on = '2019'
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

UPDATE product_milestones SET article_slug = 'fadcard-aujourdhui', updated_at = datetime('now')
WHERE product_slug = 'fad-card' AND title = 'Situation actuelle : en production, continuellement améliorée' AND occurred_on = '2026-11-09'
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

UPDATE product_milestones SET article_slug = 'qrfad-origine-constat', updated_at = datetime('now')
WHERE product_slug = 'qrfad' AND title = 'Réflexion initiale : le problème des menus papier à Bamako' AND occurred_on = '2020'
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

UPDATE product_milestones SET article_slug = 'qrfad-cinq-ans-terrain', updated_at = datetime('now')
WHERE product_slug = 'qrfad' AND title = 'Situation actuelle : produit vivant, en production' AND occurred_on = '2026-11-09'
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

UPDATE product_milestones SET article_slug = 'ferefad-telimani-2-2-0', updated_at = datetime('now')
WHERE product_slug = 'ferefad' AND title = 'Module Telimani : taxi, taxi-moto et livraison intégrés' AND occurred_on = '2026-10-20'
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

UPDATE product_milestones SET article_slug = 'ferefad-marketplace-afrique', updated_at = datetime('now')
WHERE product_slug = 'ferefad' AND title = 'Origine : une plateforme inspirée par Oumar Ballo' AND occurred_on IS NULL
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

UPDATE product_milestones SET article_slug = 'paygfad-origine-paiements', updated_at = datetime('now')
WHERE product_slug = 'paygfad' AND title = 'Naissance de l''idée PayGfad' AND occurred_on = '2023'
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

UPDATE product_milestones SET article_slug = 'paygfad-scool', updated_at = datetime('now')
WHERE product_slug = 'paygfad' AND title = 'Module Scool — le module principal en production' AND occurred_on = '2026-03'
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

UPDATE product_milestones SET article_slug = 'cloudaf-v1-1-agent', updated_at = datetime('now')
WHERE product_slug = 'cloudaf' AND title = 'v1.1 (août 2026) : Agent CloudAf et Studio Builder complet' AND occurred_on = '2026-08'
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

UPDATE product_milestones SET article_slug = 'cloudaf-novembre-2026', updated_at = datetime('now')
WHERE product_slug = 'cloudaf' AND title = 'Mise à jour de début novembre 2026 (repère : ≈ 2 novembre 2026)' AND occurred_on = '2026-11-02'
  AND (article_slug IS NULL OR TRIM(article_slug) = '');

-- ---------------------------------------------------------------------------
-- 2) Publications du parcours « nouvelle » (annonces ↔ implémentations ↔
--    articles) reliées aux jalons par event_id
-- ---------------------------------------------------------------------------
INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'tile', 'tile-pub-origine', 'tile-origine-bamako', (SELECT id FROM product_milestones WHERE product_slug = 'tile' AND title = 'Naissance de l''idée Tile'), NULL,
  'annonce', 'Tile : pourquoi nous construisons un réseau social depuis Bamako', '2025-03-12', 'exacte', '2025-03-12', 'exacte', NULL, 'inconnue', NULL,
  'Le constat qui a lancé Tile : l''Afrique mérite son réseau social — léger, local, honnête.', 'Ouverture du chantier Tile à Bamako : un réseau social conçu en Afrique, pour l''Afrique.', '"[\"Trois principes fondateurs : léger, local, honnête\", \"Trois flux annoncés : Certifié, Global, Vidéo\"]"', 'Le visiteur du blog voit le début et la fin de chaque produit : la trajectoire complète reste traçable.',
  'Le chantier le plus ambitieux de Green FAD est lancé sur des fondations claires.', '[]', 'nouvelle', 'Article « Tile : pourquoi nous construisons un réseau social depuis Bamako » (2025-03-12) — récit éditorial validé par le fondateur', 'moyenne', (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM product_publications WHERE product_slug = 'tile'), 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'tile-pub-origine');

INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'tile', 'tile-pub-stores', 'tile-stores-1-0-6', (SELECT id FROM product_milestones WHERE product_slug = 'tile' AND title = 'Publication finale — Tile 1.0.6+724 sur les canaux'), NULL,
  'annonce', 'Tile 1.0.6 arrive sur les stores', '2026-11-02', 'exacte', '2026-11-02', 'exacte', NULL, 'inconnue', NULL,
  'Publication de Tile 1.0.6+724 sur les canaux officiels Android et iOS.', 'Publication finale multiplateforme : l''application s''installe depuis les canaux officiels, la PWA reste disponible.', '"[\"Version 1.0.6+724 publiée sur Android et iOS\", \"PWA maintenue en parallèle\"]"', 'Le visiteur du blog voit le début et la fin de chaque produit : la trajectoire complète reste traçable.',
  'Le chantier ouvert en mars 2025 aboutit : Tile est installable partout.', '[]', 'nouvelle', 'Article « Tile 1.0.6 arrive sur les stores » (2026-11-02) — récit éditorial validé par le fondateur', 'haute', (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM product_publications WHERE product_slug = 'tile'), 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'tile-pub-stores');

INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'fad-card', 'fadcard-pub-origine', 'fadcard-origine-idee', (SELECT id FROM product_milestones WHERE product_slug = 'fad-card' AND title = 'Naissance de l''idée FAD CARD'), NULL,
  'annonce', 'FAD CARD : l''idée qui a lancé Green FAD', '2021-02-18', 'exacte', '2021-02-18', 'exacte', NULL, 'inconnue', NULL,
  'Deux ans d''observation à Bamako aboutissent : la carte de visite devient numérique et vivante.', 'Création de FAD CARD officialisée : la vCard numérique, partagée par contact ou QR code, sans application pour le destinataire.', '"[\"Promesse : une carte toujours à jour\", \"Partage par simple contact ou QR code\"]"', 'Le visiteur du blog voit le début et la fin de chaque produit : la trajectoire complète reste traçable.',
  'Le produit pionnier de Green FAD entre en chantier ; il lancera toute la suite.', '[]', 'nouvelle', 'Article « FAD CARD : l''idée qui a lancé Green FAD » (2021-02-18) — récit éditorial validé par le fondateur', 'moyenne', (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM product_publications WHERE product_slug = 'fad-card'), 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'fadcard-pub-origine');

INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'fad-card', 'fadcard-pub-bilan', 'fadcard-aujourdhui', (SELECT id FROM product_milestones WHERE product_slug = 'fad-card' AND title = 'Situation actuelle : en production, continuellement améliorée'), NULL,
  'annonce', 'FadCard fin 2026 : six applications, 66 pays — et la suite', '2026-11-06', 'exacte', '2026-11-06', 'exacte', NULL, 'inconnue', NULL,
  'Bilan publié : de la vCard de 2021 à la plateforme six applications explorée dans 66 pays.', 'Article-bilan documentant la trajectoire complète 2021-2026 et la règle qui continue : mises à jour régulières.', '"[\"Six applications réunies sous un même compte\", \"66 pays, 40+ devises, analytics temps réel\"]"', 'Le visiteur du blog voit le début et la fin de chaque produit : la trajectoire complète reste traçable.',
  'La promesse de départ est tenue et documentée : rendre simple ce qui était compliqué.', '[]', 'nouvelle', 'Article « FadCard fin 2026 : six applications, 66 pays — et la suite » (2026-11-06) — récit éditorial validé par le fondateur', 'haute', (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM product_publications WHERE product_slug = 'fad-card'), 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'fadcard-pub-bilan');

INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'qrfad', 'qrfad-pub-origine', 'qrfad-origine-constat', (SELECT id FROM product_milestones WHERE product_slug = 'qrfad' AND title = 'Réflexion initiale : le problème des menus papier à Bamako'), NULL,
  'annonce', 'QRFAD : avant le QR code, il y avait le constat', '2020-11-17', 'exacte', '2020-11-17', 'exacte', NULL, 'inconnue', NULL,
  'Le terrain dicte la réponse : des menus papier fatigués, des clients équipés de smartphones.', 'Ouverture du chantier QRFAD : le menu numérique par QR code, rien à installer pour le client.', '"[\"Constat terrain : le problème des menus papier\", \"Réponse la plus simple : un QR code imprimé\"]"', 'Le visiteur du blog voit le début et la fin de chaque produit : la trajectoire complète reste traçable.',
  'Le produit qui lancera l''écosystème Green FAD entre en chantier.', '[]', 'nouvelle', 'Article « QRFAD : avant le QR code, il y avait le constat » (2020-11-17) — récit éditorial validé par le fondateur', 'moyenne', (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM product_publications WHERE product_slug = 'qrfad'), 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'qrfad-pub-origine');

INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'qrfad', 'qrfad-pub-bilan', 'qrfad-cinq-ans-terrain', (SELECT id FROM product_milestones WHERE product_slug = 'qrfad' AND title = 'Situation actuelle : produit vivant, en production'), NULL,
  'annonce', 'QRFAD 2026 : cinq ans de terrain', '2026-11-05', 'exacte', '2026-11-05', 'exacte', NULL, 'inconnue', NULL,
  'Bilan publié : cinq ans d''évolution documentée, du menu numérique au portail public.', 'Article-bilan retraçant 2021-2026 : commandes, WhatsApp, hôtels, caisse, portail public de 9 établissements.', '"[\"Du menu QR à la plateforme complète de gestion\", \"Portail public : 9 établissements\"]"', 'Le visiteur du blog voit le début et la fin de chaque produit : la trajectoire complète reste traçable.',
  'Chaque fonctionnalité née d''un besoin exprimé sur le terrain.', '[]', 'nouvelle', 'Article « QRFAD 2026 : cinq ans de terrain » (2026-11-05) — récit éditorial validé par le fondateur', 'haute', (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM product_publications WHERE product_slug = 'qrfad'), 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'qrfad-pub-bilan');

INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'paygfad', 'paygfad-pub-origine', 'paygfad-origine-paiements', (SELECT id FROM product_milestones WHERE product_slug = 'paygfad' AND title = 'Naissance de l''idée PayGfad'), NULL,
  'annonce', 'PayGfad : penser les paiements du quotidien dès 2023', '2023-09-14', 'exacte', '2023-09-14', 'exacte', NULL, 'inconnue', NULL,
  'Écoles, coopératives, institutions financières, opérateurs d''énergie : les outils existants ignorent les réalités d''ici.', 'Ouverture du chantier PayGfad : une suite par métiers sur un socle commun, pensée smartphone d''abord.', '"[\"Socle commun : clients, stocks, factures, paiements PAYG, audit\", \"Modules dédiés : ERP, Finance, Energy, Agro, School\"]"', 'Le visiteur du blog voit le début et la fin de chaque produit : la trajectoire complète reste traçable.',
  'La suite qui couvrira sept pays entre en chantier sur des besoins vérifiés.', '[]', 'nouvelle', 'Article « PayGfad : penser les paiements du quotidien dès 2023 » (2023-09-14) — récit éditorial validé par le fondateur', 'moyenne', (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM product_publications WHERE product_slug = 'paygfad'), 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'paygfad-pub-origine');

INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'paygfad', 'paygfad-pub-scool', 'paygfad-scool', (SELECT id FROM product_milestones WHERE product_slug = 'paygfad' AND title = 'Module Scool — le module principal en production'), NULL,
  'annonce', 'PayGfad Scool : les paiements scolaires, enfin simples', '2026-03-10', 'exacte', '2026-03-10', 'exacte', NULL, 'inconnue', NULL,
  'Les établissements suivaient scolarités et notes sur des cahiers et des tableurs.', 'Le module Scool devient le module principal en production : élèves, notes, bulletins, présences, scolarités et encaissement Mobile Money.', '"[\"Encaissement Mobile Money : Orange Money, Wave, MTN, Moov\", \"Accès navigateur smartphone, sans installation\"]"', 'Le visiteur du blog voit le début et la fin de chaque produit : la trajectoire complète reste traçable.',
  'Le fer de lance de PayGfad est en production, construit avec le terrain.', '[]', 'nouvelle', 'Article « PayGfad Scool : les paiements scolaires, enfin simples » (2026-03-10) — récit éditorial validé par le fondateur', 'moyenne', (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM product_publications WHERE product_slug = 'paygfad'), 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'paygfad-pub-scool');

INSERT INTO product_publications (product_slug, slug, post_slug, event_id, version_id, kind, title, original_pub_on, original_pub_precision, announcement_on, announcement_precision, delivery_on, delivery_precision, version_ref, context_md, evolution_md, features_json, benefits_md, result_md, media_json, provenance, source_label, confidence, sort_order, status)
SELECT 'cloudaf', 'cloudaf-pub-v1-1', 'cloudaf-v1-1-agent', (SELECT id FROM product_milestones WHERE product_slug = 'cloudaf' AND title = 'v1.1 (août 2026) : Agent CloudAf et Studio Builder complet'), NULL,
  'annonce', 'CloudAf v1.1 : l''Agent entre dans l''atelier', '2026-08-14', 'exacte', '2026-08-14', 'exacte', NULL, 'inconnue', NULL,
  'Deux mois après le lancement, la cadence trimestrielle doit tenir.', 'Publication de la v1.1 : l''Agent CloudAf et ses outils audités (code, builds, déploiements), Studio Builder complet.', '"[\"Agent CloudAf aux outils audités\", \"Studio Builder complet : blocs, canvas, inspecteur, thèmes\"]"', 'Le visiteur du blog voit le début et la fin de chaque produit : la trajectoire complète reste traçable.',
  'La v1.1 pose les fondations de l''IA qui agit, pas seulement qui suggère.', '[]', 'nouvelle', 'Article « CloudAf v1.1 : l''Agent entre dans l''atelier » (2026-08-14) — récit éditorial validé par le fondateur', 'haute', (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM product_publications WHERE product_slug = 'cloudaf'), 'publie'
WHERE NOT EXISTS (SELECT 1 FROM product_publications WHERE slug = 'cloudaf-pub-v1-1');

-- ---------------------------------------------------------------------------
-- 3) Relier les publications existantes (reconstruites / nouvelle) aux
--    nouveaux articles (UPDATE gardé : post_slug vide)
-- ---------------------------------------------------------------------------
UPDATE product_publications SET post_slug = 'ferefad-telimani-2-2-0', updated_at = datetime('now')
WHERE slug = 'ferefad-pub-telimani' AND (post_slug IS NULL OR TRIM(post_slug) = '');

UPDATE product_publications SET post_slug = 'ferefad-marketplace-afrique', updated_at = datetime('now')
WHERE slug = 'ferefad-pub-lancement' AND (post_slug IS NULL OR TRIM(post_slug) = '');

UPDATE product_publications SET post_slug = 'cloudaf-novembre-2026', updated_at = datetime('now')
WHERE slug = 'cloudaf-pub-nov-2026' AND (post_slug IS NULL OR TRIM(post_slug) = '');

-- ---------------------------------------------------------------------------
-- 4) Confidentialité — 3 jalons Tile publics reformulés en capacités
--    (UPDATE gardé sur le texte exact : sauté si édité par l'admin)
-- ---------------------------------------------------------------------------
UPDATE product_milestones SET
  title = 'Début du développement : une application pensée pour les trois canaux',
  description_md = 'L''architecture posée dès l''origine : une application unique déployée sur Android, iOS et le web (PWA), des services et des règles côté serveur, une administration dédiée. Cette architecture a été conservée et enrichie, jamais remplacée.',
  source_label = 'Fondateur — mission CTO N°2, 10/11/2026 · Archives internes du projet Tile',
  updated_at = datetime('now')
WHERE product_slug = 'tile' AND title = 'Début du développement Flutter / Firebase' AND description_md = 'L''architecture posée dès l''origine : application Flutter (Android, iOS, Web/PWA), fonctions et règles Firebase, administration React. Cette architecture a été conservée et enrichie, jamais remplacée.';

UPDATE product_milestones SET
  title = 'Verrouillage de la release Tile 1.0',
  description_md = 'Le « FINAL RELEASE REPORT (V1.0 LOCK) » du 17 juillet 2026 atteste tous les critères de fin : analyse statique sans erreur, build d''administration compilé, composants UI dédoublonnés (avatars, sources utilisateur), trois fils validés (Certifié, Global, Vidéo), backend gelé. Cinq commits, 333 lignes nettes supprimées.',
  updated_at = datetime('now')
WHERE product_slug = 'tile' AND title = 'Verrouillage de la release Tile 1.0' AND description_md = 'Le « FINAL RELEASE REPORT (V1.0 LOCK) » du 17 juillet 2026 atteste tous les critères de fin : analyse Flutter sans erreur, build d''administration compilé, composants UI dédoublonnés (avatars, sources utilisateur), trois fils validés (Certifié, Global, Vidéo), backend gelé. Cinq commits, 333 lignes nettes supprimées.';

UPDATE product_milestones SET
  title = 'Espace entreprise, Explorer, studio de création, authentification',
  description_md = 'Octobre 2026 : consolidation de l''espace entreprise et de l''Explorer knowledge (4 octobre), activation de l''authentification sécurisée (10 octobre), studio de création avancé (11 octobre), parité PWA/Android/iOS (4 octobre), préparation du dossier App Store (5-10 octobre).',
  updated_at = datetime('now')
WHERE product_slug = 'tile' AND title = 'Espace entreprise, Explorer, studio de création, authentification' AND description_md = 'Octobre 2026 : consolidation de l''espace entreprise et de l''Explorer knowledge (4 octobre), activation de l''authentification Firebase Cloud (10 octobre), studio de création avancé (11 octobre), parité PWA/Android/iOS (4 octobre), préparation du dossier App Store (5-10 octobre).';

-- ---------------------------------------------------------------------------
-- 5) Confidentialité — extension 0013 aux contenus oubliés : études de cas
--    (projects.tech_stack / results_md), FAQ Tile, history_intro_md.
--    REPLACE idempotent (no-op si le motif est absent) — style 0013.
-- ---------------------------------------------------------------------------
UPDATE projects SET tech_stack = REPLACE(tech_stack, 'infrastructure Cloudflare (pages, Workers, D1) opérée par Green FAD', 'infrastructure cloud opérée et supervisée par Green FAD') WHERE tech_stack LIKE '%infrastructure Cloudflare (pages, Workers, D1) opérée par Green FAD%';

UPDATE projects SET tech_stack = REPLACE(tech_stack, 'infrastructure Cloudflare opérée par Green FAD', 'infrastructure cloud opérée par Green FAD') WHERE tech_stack LIKE '%infrastructure Cloudflare opérée par Green FAD%';

UPDATE projects SET tech_stack = REPLACE(tech_stack, 'Next.js, TypeScript, React, intégrations IA (OpenAI, Google)', 'intégrations IA tierces') WHERE tech_stack LIKE '%Next.js, TypeScript, React, intégrations IA (OpenAI, Google)%';

UPDATE projects SET tech_stack = REPLACE(tech_stack, '**Stack :**', '**Approche :**') WHERE tech_stack LIKE '%**Stack :**%';

UPDATE projects SET tech_stack = REPLACE(tech_stack, 'App Check', 'protection anti-abus dédiée') WHERE tech_stack LIKE '%App Check%';

UPDATE projects SET tech_stack = REPLACE(tech_stack, 'règles de base strictes', 'règles d''accès strictes') WHERE tech_stack LIKE '%règles de base strictes%';

UPDATE projects SET results_md = REPLACE(results_md, 'base technique moderne (Next.js, TypeScript, React)', 'base technique moderne et éprouvée') WHERE results_md LIKE '%base technique moderne (Next.js, TypeScript, React)%';

UPDATE faqs SET answer = REPLACE(answer, 'L''application est développée avec Flutter pour une expérience fluide sur tous les téléphones', 'Elle est pensée pour une expérience fluide sur tous les téléphones') WHERE answer LIKE '%L''application est développée avec Flutter pour une expérience fluide sur tous les téléphones%';

UPDATE products SET history_intro_md = REPLACE(history_intro_md, 'une application Flutter (Android, iOS, Web/PWA) adossée à Firebase et à une administration React', 'une application multiplateforme (Android, iOS, Web/PWA) adossée à des services cloud et à une console d''administration dédiée') WHERE history_intro_md LIKE '%une application Flutter (Android, iOS, Web/PWA) adossée à Firebase et à une administration React%';

UPDATE posts SET content_md = REPLACE(content_md, 'L''architecture posée dès l''origine — **Flutter** pour Android, iOS et le Web/PWA, **Firebase** pour les fonctions et les données, **React** pour l''administration — n''a jamais été remplacée', 'L''architecture posée dès l''origine — une application multiplateforme pour Android, iOS et le Web/PWA, des services cloud pour les fonctions et les données, une console d''administration dédiée — n''a jamais été remplacée') WHERE content_md LIKE '%L''architecture posée dès l''origine — **Flutter** pour Android, iOS et le Web/PWA, **Firebase** pour les fonctions et les données, **React** pour l''administration — n''a jamais été remplacée%';

UPDATE posts SET excerpt = REPLACE(excerpt, 'd''un chantier Flutter/Firebase démarré début 2025', 'd''un chantier d''ingénierie démarré début 2025') WHERE excerpt LIKE '%d''un chantier Flutter/Firebase démarré début 2025%';

UPDATE posts SET meta_description = REPLACE(meta_description, 'de la conception Flutter/Firebase début 2025', 'de la conception d''ingénierie début 2025') WHERE meta_description LIKE '%de la conception Flutter/Firebase début 2025%';

UPDATE product_versions SET features = REPLACE(features, 'Analyse Flutter : 0 erreur', 'Analyse statique : 0 erreur') WHERE features LIKE '%Analyse Flutter : 0 erreur%';

UPDATE product_sources SET detail = REPLACE(detail, 'Application web Flutter — canal public direct du produit.', 'Application web — canal public direct du produit.') WHERE detail LIKE '%Application web Flutter — canal public direct du produit.%';
