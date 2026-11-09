-- ===========================================================================
-- 0014 : Correction rédactionnelle (coquille) — jalon v1.1 CLOUDaf
-- La coquille « s'complete » avait été persistée par 0012 ; le texte source
-- du générateur est corrigé et cette migration met l'enregistrement au propre.
-- Idempotent.
-- ===========================================================================
UPDATE product_milestones SET
  description_md = REPLACE(description_md, 'et le Studio Builder s''complete', 'et le Studio Builder se complète'),
  updated_at = datetime('now')
WHERE slug = 'cloudaf-hist-08' AND description_md LIKE '%s''complete%';
