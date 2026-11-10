-- GREEN FAD — 0025 : ordre alphabétique des références (page /references + bloc accueil)
--
-- Demande du fondateur (11/11/2026) : « la page références, affichage des logos
-- partenaires, doit être ordonnée — cette page a besoin d amélioration. »
--
-- L ordre d affichage public suit partners.sort_order (contrôlable dans l admin,
-- champ « Ordre »). Les valeurs semées étaient arbitraires (Pharmacie avant
-- Eurodecor, Greenfad en dernier…) : cette migration renumérote par nom
-- alphabétique, insensible à la casse, pour un affichage immédiatement ordonné.
--
-- GARDE : la renumérotation ne s applique que si l ordre actuel correspond
-- encore à l ordre semé (sondes : Afric-Immo = 0 et Greenfad = 12). Si le
-- fondateur a déjà personnalisé l ordre depuis l admin, la migration ne fait
-- rien et sa personnalisation est préservée.
--
-- Idempotence : après exécution, Afric-Immo reste 0 mais Greenfad passe à 6
-- (≠ 12) : la seconde exécution devient un no-op.
--
-- Contrainte wrangler (migrations) : aucun apostrophe droit hors littéraux
-- équilibrés — noms de partenaires sans apostrophe vérifiés.

UPDATE partners
SET sort_order = (
  SELECT COUNT(*) FROM partners p2
  WHERE (p2.name COLLATE NOCASE) < (partners.name COLLATE NOCASE)
     OR ((p2.name COLLATE NOCASE) = (partners.name COLLATE NOCASE) AND p2.id < partners.id)
)
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Afric-Immo' AND sort_order != 0)
  AND NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Greenfad' AND sort_order != 12);
