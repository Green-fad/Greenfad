-- GREEN FAD — Migration 0005 : logo dédié par produit
-- Affiché sur les cartes de l'accueil et le bandeau défilant (image principale = couverture/bannière).
ALTER TABLE products ADD COLUMN logo_key TEXT DEFAULT '';
