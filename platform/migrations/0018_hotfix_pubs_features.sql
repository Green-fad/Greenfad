-- ===========================================================================
-- 0018 : HOTFIX — product_publications.features_json double-encodé
-- ---------------------------------------------------------------------------
-- La version déployée de 0017 a sérialisé deux fois les listes de
-- caractéristiques des 9 publications « nouvelle » (valeur = chaîne JSON
-- au lieu d'un tableau JSON), ce qui faisait planter le rendu des fiches
-- produits concernées (X.map is not a function).
-- Correctif : réécriture du tableau JSON correct — UPDATE strictement gardé
-- (n'agit que si la valeur est encore double-encodée, i.e. commence par '"[').
-- Le générateur 0017 est corrigé à la source ; ce correctif répare les
-- lignes déjà insérées en production.
-- ===========================================================================

UPDATE product_publications SET features_json = '["Trois principes fondateurs : léger, local, honnête", "Trois flux annoncés : Certifié, Global, Vidéo"]'
WHERE slug = 'tile-pub-origine' AND features_json LIKE '"[%';

UPDATE product_publications SET features_json = '["Version 1.0.6+724 publiée sur Android et iOS", "PWA maintenue en parallèle"]'
WHERE slug = 'tile-pub-stores' AND features_json LIKE '"[%';

UPDATE product_publications SET features_json = '["Promesse : une carte toujours à jour", "Partage par simple contact ou QR code"]'
WHERE slug = 'fadcard-pub-origine' AND features_json LIKE '"[%';

UPDATE product_publications SET features_json = '["Six applications réunies sous un même compte", "66 pays, 40+ devises, analytics temps réel"]'
WHERE slug = 'fadcard-pub-bilan' AND features_json LIKE '"[%';

UPDATE product_publications SET features_json = '["Constat terrain : le problème des menus papier", "Réponse la plus simple : un QR code imprimé"]'
WHERE slug = 'qrfad-pub-origine' AND features_json LIKE '"[%';

UPDATE product_publications SET features_json = '["Du menu QR à la plateforme complète de gestion", "Portail public : 9 établissements"]'
WHERE slug = 'qrfad-pub-bilan' AND features_json LIKE '"[%';

UPDATE product_publications SET features_json = '["Socle commun : clients, stocks, factures, paiements PAYG, audit", "Modules dédiés : ERP, Finance, Energy, Agro, School"]'
WHERE slug = 'paygfad-pub-origine' AND features_json LIKE '"[%';

UPDATE product_publications SET features_json = '["Encaissement Mobile Money : Orange Money, Wave, MTN, Moov", "Accès navigateur smartphone, sans installation"]'
WHERE slug = 'paygfad-pub-scool' AND features_json LIKE '"[%';

UPDATE product_publications SET features_json = '["Agent CloudAf aux outils audités", "Studio Builder complet : blocs, canvas, inspecteur, thèmes"]'
WHERE slug = 'cloudaf-pub-v1-1' AND features_json LIKE '"[%';
