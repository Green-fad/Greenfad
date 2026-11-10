-- 0023 : SEO — meta de la page d'accueil recentrée pour les SERP Google
--   meta_title : 115 → 60 caractères (Google tronque ~65 caractères) ; la marque
--   « Greenfad » (domaine greenfad.tech, cible de la stratégie de domination du nom)
--   passe en tête de titre.
--   meta_description : 202 → 155 caractères (Google tronque ~160 caractères).
-- Garde : l'UPDATE ne s'applique que si les valeurs d'origine (delta v9) sont
--   intactes — une meta déjà retravaillée par l'administrateur au Dashboard
--   n'est JAMAIS écrasée (aucune donnée métier hardcodée n'est perdue).

UPDATE pages SET
  meta_title = 'Greenfad — technologies & transformation digitale en Afrique',
  meta_description = 'Greenfad conçoit des produits numériques propriétaires et accompagne la transformation digitale des organisations africaines, du Mali vers l''international.'
WHERE slug = 'accueil'
  AND meta_title = 'GREEN FAD SARL — Entreprise technologique africaine : produits propriétaires, ingénierie et transformation digitale'
  AND meta_description = 'Entreprise technologique africaine : FAD CARD, QRFAD, FEREFAD… Green FAD conçoit ses propres produits numériques et accompagne la transformation digitale des organisations, du Mali vers l''international.';
